# Mesā — Product Roadmap & Vision

> Decide together. Eat well. Share the table.

This is the living vision doc for Mesā. It captures where we're headed so the
build stays pointed at the same goal. (Updated as we go.)

---

## What Mesā is

Two things in one app:

1. **A group food-decision tool.** Start a session, pass the phone around the
   table, everyone taps what they're feeling, and Mesā reveals the winner — for
   eating *out* **or** cooking *in*.
2. **A social food platform.** A post feed and a TikTok-style video feed of
   meals and recipes, with reactions and (later) macros. *Strava meets TikTok,
   for food.*

**Feel:** warm, upscale, fast — Nobu meets Apple TV.

**Audience, in order:** fire-station crews → fitness community → friend groups &
families → general public.

**The hook:** *Pass the Phone* — one phone, everyone taps privately, big reveal.

---

## Pillars

### 1. Decide (working ✅ → expanding)
- Create session, set cuisine direction, gather crew, Pass-the-Phone vote,
  animated reveal. **Built.**
- **Next — "eat out OR cook it":** the winner branches into:
  - **Explore [cuisine]** → restaurants nearby
  - **Find recipes for [cuisine]** → recipes
- **Recipe sources the user picks from:** AI-generated · homemade by a creator ·
  a restaurant's. The decision tool is about *what are we eating*, not only
  *where do we go*.

### 2. Feed & Reels (social)
- **Post feed** (built, sample data): meals, reactions ✅ (keep the emoji
  reactions — they're a hit), cuisine tags, macros, native sponsored cards.
- **Reels / video tab** (building now): TikTok-style vertical feed of food &
  recipe clips. Eventually creator + user uploads. Split model like Facebook:
  Posts on one tab, Reels on another.
- Each reel can link to its recipe.

### 3. Pantry & Shopping (new pillar)
- In-app **pantry** of what you have.
- **Barcode scanning** to add items fast.
- **Shopping list** for when you run low.
- Pantry powers the recipe generator ("cook with what I've got").

### 4. Recipes
- AI-generated (Supabase Edge Function — backend ready).
- Homemade recipes by creators.
- Restaurant recipes.
- Reachable from: Decide winner, Reels, search, pantry.

### 5. Health & Recovery (later)
- Connect Apple Health, Bevel, MyFitnessPal, and workout apps.
- **Recovery recommendations:** suggest food/recipes after a detected workout,
  based on goals + what's in your pantry.
- Macros/calorie tracking: parked for now (re-enter here later).

---

## Branding

- Evolve the **Mesā wordmark into a logo**: transform the mark above the "ā"
  into a **knife** (the *messer* pun) — a clean table/chef's knife blended into
  the letterforms. Bold and iconic, not thin/italic — "looks meant to be there."
- Palette stays: sand `#F4EDE3` · coral `#E06B4F` · navy `#18293A` ·
  amber `#C9963A`. Fonts: Playfair Display + Jost.
- Real app icon + splash (currently navy placeholders).
- *Note: the actual logo artwork needs a designer or image-gen tool; we'll write
  a tight brief for it.*

---

## Go-to-market

- **Shareable web demo:** build Mesā for web and host it at a link to text to
  testers — no install required. Fastest path to real feedback. **(High
  priority for getting it in front of crews.)**
- Beta via TestFlight to fire crews; spreads through cross-station shifts → gym
  crews → general public.
- **Monetization (later):** native sponsored restaurant posts (primary, already
  in the design), premium subscription, business listings/boosts. Advertising
  push to grow.

---

## Build phases (rough)

**Phase 1 — Make it real & demoable**
- [x] Core Decide / Pass-the-Phone / Reveal flow
- [x] Post feed with reactions, macros, sponsored cards
- [ ] Reels / video tab ← *in progress*
- [ ] Fix known polish bugs (headings ✅ pushed, status bar on dark screens,
      content behind nav bar)
- [ ] Web build + hosted demo link for testers

**Phase 2 — The eating decision, fully**
- [ ] Winner → Explore restaurants / Find recipes branch
- [ ] Recipe screens (AI · homemade · restaurant)
- [ ] Turn on Supabase (real accounts + saved data)

**Phase 3 — Pantry & creators**
- [ ] Pantry + barcode scan + shopping list
- [ ] Creator profiles, follows, real Reels uploads

**Phase 4 — Health & recovery**
- [ ] Apple Health / Bevel / MyFitnessPal sync
- [ ] Recovery-based food recommendations
- [ ] Macro tracking (revisit)

---

## Current status (snapshot)

- ✅ Runs on device (Expo SDK 54) and in demo mode without a backend.
- ✅ Decide flow works end-to-end.
- 🟡 Feed / Crew / Profile use sample data.
- 🟡 Supabase wired but off until keys are set.
- 🔲 Reels, eat-out/cook-it, pantry, health: upcoming.
