-- Mesā — optional seed data for local development.
-- Run with `supabase db reset` (which applies migrations then this seed) or
-- paste into the SQL editor. Feed authorship is attributed to the first
-- profile that exists, so sign up at least one user first.

do $$
declare
  author uuid;
begin
  select id into author from public.profiles order by created_at limit 1;
  if author is null then
    raise notice 'No profiles yet — sign up a user, then re-run the seed.';
    return;
  end if;

  insert into public.feed_posts
    (author_id, caption, cuisine, calories, protein, carbs, fat, is_sponsored, sponsor_name)
  values
    (author, 'Post-shift rebuild. Charred chicken and a mountain of rice.', 'Mediterranean', 720, 58, 64, 22, false, null),
    (author, 'Station 12 taco night. We do not miss on Tuesdays.', 'Mexican', 880, 41, 78, 38, false, null),
    (author, 'Firehouse Friday: 20% off any bowl when you show your badge.', 'Poke', 540, 44, 52, 16, true, 'Coastline Poke Co.');
end $$;
