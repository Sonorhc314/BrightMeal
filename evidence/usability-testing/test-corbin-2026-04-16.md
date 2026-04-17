# Usability Test Report

## Details

- **Conducted by:** Corbin Saunders
- **Date:** 16/04/2026
- **Participant:** 3rd year Aerospace student on placement, 21, no prior experience with food donation or volunteering apps
- **Role tested:** Driver
- **Device:** iPhone 16 Pro Max
- **Duration:** ~15 minutes
- **Consent:** Participant gave verbal consent to the test being documented.

## Method

**Think-aloud protocol:** The participant was asked to say what he was thinking as he went through each task: what he was looking at, what he expected, and where he got confused. I only stepped in if he got completely stuck.

## Pre-Test Questions

1. Have you used any food donation, delivery, or volunteering apps before? No.
2. What would you expect an app like BrightMeal to let you do? "Directions, quantity of items, maybe a code for pickup, a list of items, and whether it's perishable."

## Tasks

1. Sign up and create a driver profile
2. View available jobs and accept one, then mark as picked up and delivered
3. Check the leaderboard and badge progress
4. View delivery history

## Observations

| # | Task | Completed? | Difficulty (1-5) | Time | Think-Aloud Notes |
|---|------|-----------|-----------------|------|-------------------|
| 1 | Create driver profile | Yes | 2 | ~1 min | Asked how to sign up, worked it out quickly. Complained that there was no confirm-password field on the sign-up form and called this out as a security risk. |
| 2 | View jobs, accept, mark picked up and delivered | Yes | 1 | ~1 min 30 | Completed the full driver flow without hesitation. Liked the food information displayed on the job card, the highlighting of frozen items, the embedded map, and the timeline view. Said he'd also want to know the venue opening/closing times, a clearer drop-off deadline, and a running pickup-to-delivery timer while on the job. |
| 3 | Check leaderboard and badge progress | Yes | 1 | ~20 sec | Found Rank in the nav immediately. "Loves the leaderboard and the stats." |
| 4 | View delivery history | Yes | 1 | ~10 sec | Navigated to History without any prompt. No issues. |

## Direct Quotes

- "There's not even a confirm password, that's dangerous."
- "The colour scheme all blends together, and is hard to read — imagine I'm on a scooter and I need to read this."
- "You need a delivery code, specifically at drop-off."

## Post-Test Questions

1. How easy was the app to use overall? (1 = very difficult, 5 = very easy) **5**: very easy.
2. What was the most confusing part? "Nothing really."
3. What did you like the most? "User-friendliness, well thought out, liked the frozen-item specification."
4. Would you use an app like this? Why or why not? "Yes, because of the user-friendliness."

## Issues Found

1. **High**: No confirm-password field on sign-up. Participant flagged this explicitly as a security risk (typo-protection and credential-confirmation gap).
2. **Medium**: Colour scheme has insufficient contrast for glanceable reading while in motion (participant imagined himself reading the app on a scooter).
3. **Medium**: No delivery/drop-off code for handover confirmation at the charity. Participant expected some form of verification token at drop-off.

## Suggestions from Participant

- Add a confirm-password field to the sign-up screen.
- Improve colour contrast for outdoor and on-the-go readability.
- Add a delivery/drop-off code shown to the driver and confirmed by the charity at handover.
- Show drop-off deadlines more prominently on the job detail view.
- Display the pickup venue's opening and closing times on the job view.
- Add a pickup-to-delivery timer visible to the driver during a job.

## Reflections

Really positive test overall. The participant rated the app 5/5 for ease of use and got through all the driver tasks quickly and without much hesitation. He liked the food information, the frozen-item highlighting, the embedded map, and the timeline view, and brought all of that up without being prompted.

Three issues came out of it. The first is the missing confirm-password field, which he flagged himself as a security risk. That's a quick fix and it affects all three roles, not just drivers. The second is the colour contrast, which matters for drivers specifically because they're using the app on the move (he pictured himself on a scooter, which is exactly the use case the charity and donor tests wouldn't have surfaced). The third is the lack of a handover code, which is a functional gap at drop-off that neither the donor nor charity participants have mentioned.

He also wanted more timing information on the job view: drop-off deadlines, venue opening hours, and a pickup-to-delivery timer. That fits with the general picture that drivers need more live context than the app currently shows.

Comparing with Riad's driver test on 10 April: both participants praised the timeline, the job detail view, and the map, and both scored ease-of-use highly (Riad 4, Corbin 5). Their issues were completely different, which actually helps the evidence. Riad's participant hit the points system, notifications, and confusing labels. This one hit security, contrast, and handover. Between them the two tests cover both the conceptual side (what are points, when does a new job appear) and the practical side (sign-up security, readability on the move, handover verification). Neither test suggests the core flow is broken, but both point to specific polish work before we'd put this in front of real drivers.
