-- Mesā — Row Level Security
-- MVP policies: authenticated users can read the social graph and join
-- sessions by code; writes are scoped to the owner where it matters.

alter table public.profiles        enable row level security;
alter table public.groups          enable row level security;
alter table public.group_members   enable row level security;
alter table public.meal_sessions   enable row level security;
alter table public.session_votes   enable row level security;
alter table public.feed_posts      enable row level security;

-- Profiles --------------------------------------------------------------------
create policy "Profiles are readable by authenticated users"
  on public.profiles for select
  to authenticated using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Groups ----------------------------------------------------------------------
create policy "Authenticated users can read groups"
  on public.groups for select
  to authenticated using (true);

create policy "Authenticated users can create groups"
  on public.groups for insert
  to authenticated with check (auth.uid() = created_by);

create policy "Group owners can update their groups"
  on public.groups for update
  to authenticated using (auth.uid() = created_by);

create policy "Members can read membership"
  on public.group_members for select
  to authenticated using (true);

create policy "Users manage their own membership"
  on public.group_members for all
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Meal sessions ---------------------------------------------------------------
-- Readable by any authenticated user so a join code resolves to a session.
create policy "Authenticated users can read sessions"
  on public.meal_sessions for select
  to authenticated using (true);

create policy "Users can host sessions"
  on public.meal_sessions for insert
  to authenticated with check (auth.uid() = host_id);

create policy "Hosts can update their sessions"
  on public.meal_sessions for update
  to authenticated using (auth.uid() = host_id) with check (auth.uid() = host_id);

create policy "Hosts can delete their sessions"
  on public.meal_sessions for delete
  to authenticated using (auth.uid() = host_id);

-- Votes -----------------------------------------------------------------------
-- In pass-the-phone mode the host's device records every guest's vote, so we
-- allow authenticated inserts/reads against any session.
create policy "Authenticated users can read votes"
  on public.session_votes for select
  to authenticated using (true);

create policy "Authenticated users can cast votes"
  on public.session_votes for insert
  to authenticated with check (true);

-- Feed ------------------------------------------------------------------------
create policy "Authenticated users can read the feed"
  on public.feed_posts for select
  to authenticated using (true);

create policy "Users can post their own meals"
  on public.feed_posts for insert
  to authenticated with check (auth.uid() = author_id);
