# BrightMeal

Reducing food waste by connecting surplus food donors with local charities through a real-time logistics platform.

**Live app:** [brightmeal.vercel.app](https://brightmeal.vercel.app)

**Module:** CM32027 Entrepreneurship — CW2 Business Presentation
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
- **Gamification** — Points (10/kg), 21 badges across 4 tiers, weekly streaks, cross-role leaderboard with efficiency metric
- **Security** — Row-Level Security, trigger-enforced state machine, 6 SECURITY DEFINER RPCs, role-based field restrictions
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
  migrations/       # 6 SQL migrations (schema, RLS, triggers, RPCs, gamification)
  seed.sql          # Demo seed data (paste into Supabase SQL Editor)
presentation/       # CW2 slides (16 HTML sources + PPTX + build scripts)
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

## Documentation

| File | Description |
|------|-------------|
| [`GENAI-DISCLOSURE.md`](GENAI-DISCLOSURE.md) | Generative AI usage declaration (Type B assessment) |
| [`evidence/`](evidence/) | Interview write-ups, usability test reports, outreach materials |
| [`presentation/`](presentation/) | CW2 Dragons' Den presentation (slides + PPTX) |
| [`presentation/QA-PREP.md`](presentation/QA-PREP.md) | Anticipated Q&A with prepared answers |
| [`branding/`](branding/) | Logo assets and brand identity |
