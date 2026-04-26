# BrightMeal

Reducing food waste by connecting surplus food donors with local charities through a real-time logistics platform.

**Live app:** [brightmeal.vercel.app](https://brightmeal.vercel.app)

**Module:** CM32027 Entrepreneurship
**Team:** Group I — Rawand Ali, Leonid Shevchenko, Tori Rybalka, Riad Mehyar, Corbin Saunders, Rafeef Kurdi

---

## What is BrightMeal?

Bath businesses waste tonnes of surplus food while local charities struggle to source enough. BrightMeal is a three-sided platform connecting food donors (restaurants, cafes, bakeries), charities (food banks, shelters, community kitchens), and volunteer drivers. A gamification system with points, badges, streaks, and a leaderboard drives sustained engagement across all roles.

## Key Features

- **Three-role system** — Donors post surplus, charities accept offers, drivers handle logistics
- **Full allergen compliance** — All 14 UK/EU legally mandated allergens (Natasha's Law / Food Information Regulations 2014)
- **FSA hygiene ratings** — Food Hygiene Rating (1-5) visible to charities when browsing offers
- **Use-by vs best-before** — Date type toggle per UK food law
- **Real-time status tracking** — Donation lifecycle from posted through to delivered with live notifications
- **Gamification** — Points (10/kg), 19 badges across 4 tiers, weekly streaks, cross-role leaderboard with efficiency metric
- **Security** — Row-Level Security, trigger-enforced state machine, 7 SECURITY DEFINER RPCs, role-based field restrictions
- **Food safety** — In-app guidelines page, driver onboarding, food issue reporting

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, Tailwind CSS v4 |
| Components | shadcn/ui, Radix UI, Lucide icons |
| Backend | Supabase (PostgreSQL, Auth, Realtime) |
| Deployment | Vercel |
| Design | DM Sans, custom olive/gold brand palette |

## Repository Structure

```
src/
  app/              # Next.js App Router pages (authenticated + public routes)
  components/       # React components (DonationForm, AuthLayout, BottomNav, etc.)
  lib/              # Utilities, config, Supabase clients, types
supabase/
  migrations/       # 7 SQL migrations (schema, RLS, triggers, RPCs, gamification)
  seed.sql          # Demo seed data (paste into Supabase SQL Editor)
evidence/           # Interviews, usability testing, outreach materials
branding/           # Logo SVGs and brand assets
```

## Demo Accounts

All accounts use password `demo1234`. Seed the database by running `supabase/seed.sql` in the Supabase SQL Editor.

| Role | Email | Name |
|------|-------|------|
| Donor | bathbuns@demo.com | Bath Buns Bakery |
| Donor | greenrocket@demo.com | The Green Rocket Cafe |
| Donor | noyaskitchen@demo.com | Noya's Kitchen |
| Donor | thirdspace@demo.com | Third Space Cafe |
| Charity | julianhouse@demo.com | Julian House |
| Charity | genesistrust@demo.com | Genesis Trust |
| Charity | oasispantry@demo.com | Oasis Pantry |
| Driver | james@demo.com | James Wilson |
| Driver | sarah@demo.com | Sarah Ahmed |
| Driver | mike@demo.com | Mike Chen |

## Local Development

```bash
git clone https://github.com/Sonorhc314/BrightMeal.git
cd BrightMeal
npm install
```

Create `.env.local` with your Supabase credentials (see `.env.example`), then:

```bash
npm run dev
```

## Where to find everything

Quick tour for anyone marking this. Group I spent Semester 2 building and testing BrightMeal, and most of the evidence sits in this repo.

**The pitch itself.** Slide deck, poster, and pitch video all live under `evidence/` once finalised:
- `evidence/slides/` for the Canva slide deck (PDF export)
- `evidence/poster/` for the A3 poster (PDF and PNG)
- `evidence/video/` for the pitch video

**The working app.** It's deployed at [brightmeal.vercel.app](https://brightmeal.vercel.app), and the demo accounts above all use the password `demo1234`. The source code is in [`src/`](src/), and the database schema (row-level security, triggers, and 7 SECURITY DEFINER RPCs) is in [`supabase/migrations/`](supabase/migrations/). If you'd rather not click through the live app, [`evidence/screenshots/`](evidence/screenshots/) has 16 numbered shots covering every main page.

**User research.** Seven semi-structured interviews with real Bath stakeholders sit in [`evidence/interviews/`](evidence/interviews/): four charities (Action Pantry, Community Kitchen, The Hive, Oasis Pantry), two restaurants (Friends Takeaway, Tasty Kitchen), and a write-up of driver feedback. These shaped a lot of the product decisions, especially the charity self-collection flow and the simplified posting form.

**Usability testing.** Six think-aloud tests in [`evidence/usability-testing/`](evidence/usability-testing/), two per role. Donor flow was tested with Rafeef and Rawand, charity flow with Leo and Tori, driver flow with Riad and Corbin. Each report follows the same template (tasks attempted, observations, issues found, fixes applied), so they're easy to compare.

**Outreach.** [`evidence/outreach/instagram/`](evidence/outreach/instagram/) has the Instagram posts we ran (intro, charity callout, volunteer recruitment, statistics, and so on) plus a screenshot of the profile. [`evidence/outreach/info-sheets/`](evidence/outreach/info-sheets/) has the printable handouts we used when approaching restaurants, charities, and potential volunteer drivers. The QR code that links to the live app is at [`evidence/outreach/brightmeal-qr-code.png`](evidence/outreach/brightmeal-qr-code.png), and the brand assets are split between [`evidence/outreach/branding/`](evidence/outreach/branding/) (branding sheet and rendered logos) and [`branding/`](branding/) (source SVGs).

**GenAI declaration.** [`GENAI-DISCLOSURE.md`](GENAI-DISCLOSURE.md) covers everything per the Type B assessment requirements.
