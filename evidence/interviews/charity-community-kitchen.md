# Charity Interview: Community Kitchen

| Field | Detail |
|---|---|
| **Organisation** | Community Kitchen |
| **Location** | Bath |
| **Type** | Community kitchen / same-day cooking programme |
| **Date** | February 2026 |
| **Interviewer** | Leo |
| **Interest Level** | 5/5 (best fit) |

---

## Key Findings

- **Extremely flexible on food types.** They cook from whatever they receive on the day. No rigid menu planning; the chef adapts to available ingredients. This makes them an ideal recipient for unpredictable surplus.
- **Self-pickup strongly preferred.** They have their own transport and prefer to collect food directly from donors. This gives them control over timing and reduces dependency on third-party drivers.
- **Photos are very important.** Seeing photos of the food before accepting helps them plan what to cook and assess condition/quantity at a glance. This was raised as a high-priority feature.
- **Early information needed (before 2pm).** Their cooking programme runs in the afternoon/evening. To incorporate donated food, they need to know what is available before 2pm at the latest.
- **Exact quantities and condition details required.** Vague descriptions like "some leftover food" are not useful. They need to know weight, number of portions, and storage condition (chilled, frozen, ambient).
- **Zero storage capacity.** Everything received must be used the same day. They cannot hold anything overnight, which makes timely information and same-day collection essential.

## Direct Quotes

> "I just take what I get and work out what to cook."

## What Changed in the App

| Change | Implementation |
|---|---|
| Photo URL field added to donation form | Migration 006 (`donations.photo_url`) |
| Self-collection feature with delivery method toggle | Migration 007 |
| Detailed quantity, unit, and storage type fields in donation form | `DonationForm` component with `formUnits` and `formStorageTypes` |

---

## Full Notes

Community Kitchen runs a same-day cooking programme in Bath. They take whatever ingredients come in and cook meals for the community that same day. The chef described their whole workflow as reactive: they don't plan menus in advance, they build meals around whatever food is available that day.

That flexibility makes them a really good fit for what we're building. Unlike a pantry that needs specific items to fill shelves, they can use almost anything as long as it arrives in time and is in good condition.

The coordinator was very clear about needing photos. Their current process is phone calls and text messages with donors, and photos are already part of how they decide whether to accept something. Putting this in the app would fit their existing habits instead of adding new steps.

Timing matters a lot. Their cooking starts early afternoon, so they need to know about available food by 2pm at the latest. Anything posted after that isn't useful to them for the same day.

They have no cold storage beyond what they need for that day's prep. Nothing stays overnight. This means the platform has to clearly show storage type and expiry info so they can make quick decisions.

They strongly prefer self-collection. A driver delivering is fine in theory, but in practice they want to see the food, check the quality, and load it themselves. They have a small van and do regular collection runs.

Quantities and condition details came up as essential. They need exact weights or portion counts so the chef can plan. Vague descriptions waste their time because they might drive across town to collect food and find it's not enough or not right.

Interest was 5/5, the highest of all the interviews. Their operating model lines up with what BrightMeal is trying to do, and they'd be an ideal early adopter.
