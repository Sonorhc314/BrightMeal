# Charity Interview: Action Pantry (Mercy in Action)

| Field | Detail |
|---|---|
| **Organisation** | Action Pantry (Mercy in Action) |
| **Location** | Twerton, Bath |
| **Type** | Community pantry / referral-based food support (~120 families/week) |
| **Date** | February 2026 |
| **Interviewer** | Leo |
| **Interest Level** | 4/5 |

---

## Key Findings

- **Allergen compliance is critical.** They serve vulnerable populations including families with young children and individuals with dietary restrictions. Full Natasha's Law (Food Information Regulations 2014) compliance is non-negotiable.
- **Simplicity is essential.** Charities are time-poor and volunteer-run. If the platform requires too many steps or is confusing, adoption will fail.
- **Self-collection preferred.** They already have volunteers who can collect food; they want the option to pick up rather than waiting for a delivery driver.
- **Trust through known brands/partners.** They are more likely to accept food from established restaurants or businesses they recognise. Transparency about the donor matters.
- **Currently use Foodiverse, Neighbourly, and FareShare** for surplus food sourcing. Any new platform needs to offer something these don't, or integrate alongside them.

## Direct Quotes

> "If you make it too complicated, charities won't use it."

> "Allergen info is critical. We serve vulnerable people and need full Natasha's Law compliance."

## What Changed in the App

| Change | Implementation |
|---|---|
| All 14 UK/EU legally mandated allergens added to donation form | Migration 006 (`allergenOptions` in `donation-config.tsx`) |
| Delivery method toggle for self-collection | Migration 007 |
| Kept UI simple with minimal steps for charity acceptance workflow | Streamlined offers page design |

---

## Full Notes

Action Pantry is a referral-based community pantry under Mercy in Action in Twerton, Bath. They serve around 120 families a week, most of whom are referred by social services, health visitors, and local schools. A lot of those families include people with specific dietary needs, allergies, or health conditions, so food safety is central to what they do.

They currently source food from a mix of platforms (Foodiverse, Neighbourly, FareShare) and direct relationships with local supermarkets. The coordinator was clear that any new platform can't add admin burden on top of what they already have. Their volunteers aren't particularly tech-savvy, so fewer steps and fewer decisions is always going to win.

Allergens came up as a hard requirement. They've had a near-miss before where unlabelled food got distributed, and since then they've been strict about requiring full ingredient and allergen info before accepting anything. The coordinator specifically brought up Natasha's Law and the 14 mandated allergens.

They were interested in a self-collection option. They already have a van and volunteers doing regular pickups, so a platform that only supports driver delivery wouldn't fit how they actually work.

Trust kept coming back through the conversation. They want to know who the donor is, whether it's a regulated business, and ideally see a hygiene rating before they commit. Accepting food from an unknown source isn't really on the table for them.

Their overall interest was 4/5, conditional on the platform being simple for their volunteers and covering the allergen information properly.
