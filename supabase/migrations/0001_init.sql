-- Mesā — initial schema
-- Core flow: profiles, groups, meal sessions, and pass-the-phone votes,
-- plus a food feed. Run with `supabase db push` (or paste into the SQL editor).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  username     text unique not null,
  display_name text not null,
  avatar_url   text,
  created_at   timestamptz not null default now()
);

-- Create a profile row automatically when a user signs up. The username and
-- display name come from the signup metadata, with sensible fallbacks.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'username',
      split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 4)
    ),
    coalesce(new.raw_user_meta_data ->> 'display_name', 'Mesā Cook')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Groups (Station 12, Gym Crew, Family ...)
-- ---------------------------------------------------------------------------
create table if not exists public.groups (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  emoji      text not null default '🍽️',
  created_by uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.group_members (
  group_id  uuid not null references public.groups (id) on delete cascade,
  user_id   uuid not null references public.profiles (id) on delete cascade,
  role      text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

-- ---------------------------------------------------------------------------
-- Meal sessions + votes
-- ---------------------------------------------------------------------------

-- Short, human-friendly, unambiguous join codes (no 0/O/1/I).
create or replace function public.generate_session_code()
returns text
language plpgsql
as $$
declare
  alphabet text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  result   text := '';
  i        int;
begin
  for i in 1..6 loop
    result := result || substr(alphabet, floor(random() * length(alphabet) + 1)::int, 1);
  end loop;
  return result;
end;
$$;

create table if not exists public.meal_sessions (
  id                uuid primary key default gen_random_uuid(),
  code              text unique not null default public.generate_session_code(),
  host_id           uuid not null references public.profiles (id) on delete cascade,
  title             text not null,
  cuisine_direction text not null default 'anything',
  group_id          uuid references public.groups (id) on delete set null,
  mode              text not null default 'pass_the_phone'
                      check (mode in ('pass_the_phone', 'remote')),
  status            text not null default 'lobby'
                      check (status in ('lobby', 'voting', 'revealed', 'closed')),
  winner_cuisine    text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists meal_sessions_host_idx on public.meal_sessions (host_id);
create index if not exists meal_sessions_code_idx on public.meal_sessions (code);

create table if not exists public.session_votes (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null references public.meal_sessions (id) on delete cascade,
  voter_name    text not null,
  cuisine_id    text not null,
  cuisine_label text not null,
  created_at    timestamptz not null default now()
);

create index if not exists session_votes_session_idx on public.session_votes (session_id);

-- Tally a session's votes, most popular first.
create or replace function public.tally_session(p_session_id uuid)
returns table (cuisine_id text, cuisine_label text, votes bigint)
language sql
stable
as $$
  select cuisine_id, max(cuisine_label) as cuisine_label, count(*) as votes
  from public.session_votes
  where session_id = p_session_id
  group by cuisine_id
  order by votes desc, cuisine_label asc;
$$;

-- ---------------------------------------------------------------------------
-- Food feed
-- ---------------------------------------------------------------------------
create table if not exists public.feed_posts (
  id           uuid primary key default gen_random_uuid(),
  author_id    uuid not null references public.profiles (id) on delete cascade,
  image_url    text,
  caption      text not null,
  cuisine      text,
  calories     int,
  protein      int,
  carbs        int,
  fat          int,
  is_sponsored boolean not null default false,
  sponsor_name text,
  created_at   timestamptz not null default now()
);

create index if not exists feed_posts_created_idx on public.feed_posts (created_at desc);

-- ---------------------------------------------------------------------------
-- Realtime
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.meal_sessions;
alter publication supabase_realtime add table public.session_votes;
