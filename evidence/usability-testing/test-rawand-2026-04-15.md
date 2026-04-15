# Usability Test Report

## Details

- **Conducted by:** Rawand Ali
- **Date:** 15/04/2026
- **Participant:** Family member (brother), no prior experience with food donation apps
- **Role tested:** Donor
- **Device:** Laptop (browser)
- **Duration:** ~8 minutes
- **Consent:** Participant gave verbal consent to the test being documented.

## Method

**Think-aloud protocol:** The participant was asked to say what he was thinking as he went through each task: what he was looking at, what he expected, and where he got confused. I only stepped in if he got completely stuck.

## Pre-Test Questions

1. Have you used any food donation, delivery, or volunteering apps before? No
2. What would you expect an app like BrightMeal to let you do? Post leftover food and have someone come pick it up

## Tasks

1. Sign up and create a donor profile
2. Post a new donation with allergens and a pickup window
3. Check the leaderboard and badge progress
4. View donation history

## Observations

| # | Task | Completed? | Difficulty (1-5) | Time | Think-Aloud Notes |
|---|------|-----------|-----------------|------|-------------------|
| 1 | Create donor profile | Yes | 1 | ~1 min | Went through signup without issues. Found the role selection and form fields straightforward. |
| 2 | Post a donation | Yes | 2 | ~3 min | Completed the full donation form including allergens, storage type, and pickup window. Got annoyed at the date picker when trying to set it for today, said most donors would be posting same-day so it should be quicker. Also noted that page transitions felt slow. |
| 3 | Check leaderboard | Yes | 1 | ~1 min | Found it immediately from the bottom nav. Understood the ranking and points system without explanation. |
| 4 | View history | Yes | 1 | ~1 min | No issues navigating to history. |

## Direct Quotes

- "It's quite inconvenient that there is no option for today because most donors will probably upload it for today so that's the main concern."
- "I don't like how it takes quite a lot of time to load the pages, especially if a restaurant is busy. It's annoying to wait for the pages to load."
- "The UI is very intuitive and easy to use."
- "It looks really good."

## Post-Test Questions

1. How easy was the app to use overall? (1 = very difficult, 5 = very easy) **5**
2. What was the most confusing part? Nothing really, everything made sense.
3. What did you like the most? The design and how easy it was to navigate.
4. Would you use an app like this? Why or why not? Yes, if he ran a restaurant he would use it because it's simple and quick to post food.

## Issues Found

1. **Medium**: No quick way to set the expiry date to today. Donors posting same-day surplus have to scroll through the date picker manually, which slows down a time-sensitive workflow.
2. **Medium**: Page load times feel slow, particularly when navigating between pages. For a restaurant environment where staff are busy and time-pressured, waiting for pages to load could discourage regular use.

## Suggestions from Participant

- A "Today" button for the date fields so you don't have to manually pick the date every time.
- Pages should load faster. In a busy kitchen you don't want to be waiting around.

## Reflections

He got through every task without needing help, which tells me the donor flow holds up for someone using it for the first time. Two things came out of it: the date picker had no quick way to set it to today, and the pages felt slow. The first one I fixed after the test by adding "Today" and "Tomorrow" quick buttons above the expiry date field, and then simplifying the whole timing section into a 2-tap selector. The second one is more of an infrastructure thing (cold starts on Vercel, Supabase query times) and I've noted it down as a future optimisation rather than trying to fix it for this deadline. The positive feedback on the design and layout was nice to hear and suggests the form is working fine for first-time users.
