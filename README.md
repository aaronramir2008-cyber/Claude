# Mesā 🍽️

> Decide together. Eat well. Share the table.

A group meal-decision and social food app — *Tinder for food meets Strava for
eating*. Fast, warm, premium. Built for fire-station crews first, then everyone.

This repo is the **MVP foundation**: a polished design system and the
**core decision flow working end-to-end** — create a meal session, gather the
crew, run **Pass the Phone** voting, and reveal the table's winner — wired to
**Supabase** (auth, database, realtime), with the Food Feed, Crew, and Profile
surfaces built out around it.

---

## Stack

| Layer      | Choice                                                        |
| ---------- | ------------------------------------------------------------- |
| App        | React Native + **Expo SDK 52**, **expo-router**, TypeScript   |
| Backend    | **Supabase** — Postgres, Auth, Realtime, Edge Functions       |
| AI         | OpenAI via a Supabase Edge Function (recipe generation)       |
| Fonts      | Playfair Display (headings) · Jost (body) via Google Fonts    |

## Design language

Warm, upscale beach-resort energy — think Nobu, with Apple-TV smoothness.

- **Deep sand** `#F4EDE3` base · **Coral/terracotta** `#E06B4F` accent
- **Navy depth** `#18293A` · **Amber** `#C9963A` highlights

All tokens live in [`src/theme`](src/theme). Use the `<AppText>`, `<Button>`,
`<Card>`, `<Screen>` primitives in [`src/components`](src/components) — they keep
type, color, spacing, and the soft warm shadows consistent everywhere.

---

## Getting started

```bash
# 1. Install
npm install

# 2. Configure Supabase (optional to start — see Demo mode below)
cp .env.example .env
#   then fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY

# 3. Run
npm run ios        # or: npm run android / npm start (scan QR in Expo Go)
```

### Demo mode

If no Supabase keys are present the app runs in **demo mode**: sign in with
anything, and sessions/votes/feed use in-memory + seeded data so you can feel
the whole flow immediately. The moment you add keys, the same screens talk to
real Supabase — no code changes.

---

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Apply the schema:
   ```bash
   supabase link --project-ref <your-ref>
   supabase db push          # runs supabase/migrations/*
   # optional sample feed (after at least one user signs up):
   supabase db execute --file supabase/seed.sql
   ```
3. Copy **Project Settings → API** values into `.env`
   (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`).
4. (Optional) AI recipes:
   ```bash
   supabase secrets set OPENAI_API_KEY=sk-...
   supabase functions deploy generate-recipe
   ```

### Schema overview (`supabase/migrations`)

- `profiles` — 1:1 with `auth.users`, auto-created on signup via trigger.
- `groups` / `group_members` — Station 12, Gym Crew, Family.
- `meal_sessions` — a decision session with a short join `code`, a cuisine
  `direction`, a `status` (`lobby → voting → revealed`), and the `winner`.
- `session_votes` — one row per pick; `tally_session()` aggregates them.
- `feed_posts` — the food feed, including native sponsored posts.
- Realtime is enabled on `meal_sessions` and `session_votes`.
- Row Level Security policies live in `0002_rls.sql`.

---

## The core flow

```
Decide tab
  └─ Create session ──► Lobby (share code, add the crew)
                           └─ Start voting ──► Pass the Phone
                                                  • private "pass to NAME" handoff
                                                  • each player taps one cuisine
                                                  • each pick is a vote in Supabase
                                                  └─ Reveal (tally + animated winner)
  └─ Join with code  ──► Lobby …
```

Code map:

- `app/(tabs)/sessions.tsx` — create / join entry
- `app/session/create.tsx` — set occasion + cuisine direction
- `app/session/[id]/index.tsx` — lobby, join code, gather crew
- `app/session/[id]/vote.tsx` — Pass-the-Phone voting
- `app/session/[id]/reveal.tsx` — tally + winner reveal
- `src/features/sessions/api.ts` — all session/vote logic (Supabase + demo fallback)

---

## Project structure

```
app/                      expo-router routes
  (auth)/                 welcome, sign-in, sign-up
  (tabs)/                 feed · sessions · friends · profile
  session/                create + [id] lobby/vote/reveal
src/
  components/             AppText, Button, Card, Screen, CuisineCard, PostCard…
  features/               auth/ · sessions/ · feed/
  theme/                  colors, typography, spacing, shadows
  data/                   cuisine deck + directions
  lib/                    supabase client, helpers
  types/                  domain + database types
supabase/
  migrations/             schema + RLS
  functions/              generate-recipe (OpenAI edge function)
  seed.sql
```

---

## Status & next steps

**Done this pass:** design system, auth flow, Food Feed with native sponsored
cards, Crew (groups + friends), Profile with daily macros and health-sync
toggles, and the full **Meal Session → Pass the Phone → Reveal** loop on
Supabase.

**Next:** real friend graph & group membership, push the Feed composer
(post a meal), Apple HealthKit / Garmin / MyFitnessPal sync (the toggles are
wired to UI, not yet to native modules), remote (multi-device) sessions over
Realtime, and the AI recipe screen on top of the deployed edge function.
