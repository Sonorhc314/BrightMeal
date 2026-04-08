# Charity Interview: Hive

| Field | Detail |
|---|---|
| **Organisation** | Hive |
| **Location** | Bath |
| **Type** | Community fridge + pantry (~1000kg food/month, 5-star hygiene rating) |
| **Date** | March 2026 |
| **Interviewer** | Leo |
| **Interest Level** | 3/5 |

---

## Key Findings

- **Public safety is the top priority.** They operate under strict food safety protocols and hold a 5-star FSA food hygiene rating themselves. Any platform facilitating food redistribution must prioritise safety above convenience.
- **Trust is based on FSA food hygiene ratings.** They use the donor's hygiene rating as a primary decision factor. A rating of 3 or above is acceptable; below 3 they would decline. This rating should be visible to charities before they accept a donation.
- **Strict on use-by vs best-before distinction.** They follow UK food law precisely. Use-by dates are hard deadlines (food must not be distributed past this date). Best-before dates indicate quality, and food past best-before can still be distributed if in good condition. The platform must clearly distinguish between these.
- **Volunteer food hygiene training required.** All their volunteers undergo basic food hygiene training. They expect donors to meet a similar standard of food safety awareness.
- **Will accept cooked food only from trusted, regulated sources.** Cooked food from unregulated kitchens or home cooking is not accepted. They need assurance that the donor operates under proper food safety management (HACCP or equivalent).

## Direct Quotes

> "Public safety has to be the number one priority."

> "Trust comes from hygiene ratings. If a restaurant has a 3+, we'd accept their food."

## What Changed in the App

| Change | Implementation |
|---|---|
| FSA food hygiene rating added to donor profiles | Migration 006 (`profiles.food_hygiene_rating`, integer 1-5) |
| Use-by vs best-before date type toggle | Migration 006 (`donations.date_type`: `'use_by'` or `'best_before'`) |
| Allergen tracking on all donations | Migration 006 (14 UK/EU allergens in `allergenOptions`) |

---

## Full Notes

Hive runs a community fridge and pantry in Bath, handling around 1000kg of food a month. They hold a 5-star FSA food hygiene rating themselves and take food safety very seriously. The whole conversation was really centred on trust, safety, and regulatory compliance.

The coordinator was clear that public safety comes first, full stop. They've built their reputation on safe food handling and aren't going to risk that by accepting food from sources they can't verify. The FSA food hygiene rating is their main trust signal. They check it before accepting food from any new donor. A 3 or above is the threshold, anything below that they decline regardless of how the food looks.

The use-by vs best-before distinction came up without me prompting it. They follow UK food law strictly: food past its use-by date is never distributed, while food past its best-before date is assessed case by case. They were worried a platform might treat these the same, which would be a real safety risk, so the app has to label clearly which type of date applies to each donation.

On cooked food, they only accept it from regulated commercial kitchens. They need to know the donor is operating under a food safety management system (HACCP or equivalent). Home-cooked food or anything from an unregulated source is a no.

All their volunteers get basic food hygiene training, and they expect a similar level of awareness from anyone using the platform. They suggested the app could include basic food safety guidance or a link to training resources.

Their interest was 3/5. They already have established supply chains through FareShare and direct supermarket partnerships, so they'd use BrightMeal as an additional source (especially for restaurant surplus) but only if the safety and trust features are solid. Hygiene rating visibility and the date type distinction were their conditions for taking part.
