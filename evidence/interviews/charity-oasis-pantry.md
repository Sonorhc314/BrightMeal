# Charity Interview: Oasis Pantry

| Field | Detail |
|---|---|
| **Organisation** | Oasis Pantry |
| **Location** | Bath |
| **Type** | Community pantry / food bank (2 pantries in Bath, membership model) |
| **Date** | March 2026 |
| **Interviewer** | Leo, Tori |
| **Interest Level** | 4/5 |

---

## Key Findings

- **Would use the platform if it saved coordination time.** Their current process involves significant manual coordination via phone calls, emails, and WhatsApp messages with donors. A centralised platform that streamlines this would be valuable.
- **Supermarket surplus is logistically difficult.** While supermarket donations sound appealing in theory, the reality involves unpredictable volumes, strict collection windows, and last-minute cancellations. Restaurant surplus may be more manageable.
- **Clear use-by vs best-before labelling is essential.** They distribute food to members who take it home, so accurate date labelling is a legal and safety requirement. Mislabelled food creates liability.
- **Strict on labelling and traceability (Natasha's Law).** All food distributed must be traceable and allergen-labelled in compliance with Natasha's Law. This is particularly important for pre-packed food and food prepared on-premises by donors.
- **Suggested charity profiles to specify accepted food types.** They proposed that charities should be able to set preferences (e.g., "we accept ambient goods only" or "no cooked food") so donors can see at a glance whether their surplus is suitable.
- **Limited storage capacity.** They have 2 commercial fridges across their sites. Cold storage is a bottleneck, so they need to know in advance whether donations require refrigeration.

## Direct Quotes

> "We'd use this if it saved us time coordinating pickups."

> "Supermarket surplus sounds good, but logistically it's very difficult."

## What Changed in the App

| Change | Implementation |
|---|---|
| Date type selector (use-by vs best-before) | Migration 006 (`donations.date_type`) |
| Streamlined charity acceptance workflow | Simplified offers page with clear donation details |
| Storage type clearly displayed on donations | `storageLabel` and `storageIcon` in `donation-config.tsx` |

---

## Full Notes

Oasis Pantry runs two community pantries in Bath on a membership model. Members pay a small weekly fee and choose from what's available. Because their members take food home rather than eating it on-site, accurate labelling and allergen info matters a lot.

The coordinator said their current donation coordination is really time-consuming. They manage relationships with multiple donors, each with different schedules and preferred ways of communicating. A lot of it happens on WhatsApp and over the phone. A platform that centralised everything and let them browse and accept from one place would take a big chunk out of that.

They were honest about supermarket surplus. They do get donations from supermarkets, but it's often frustrating: collection windows are short, the volumes are unpredictable, and last-minute cancellations happen. They reckoned restaurant and cafe surplus might actually be more reliable, just in smaller quantities.

Labelling and traceability kept coming up. Because their members take the food home, Oasis Pantry carries the responsibility for making sure everything distributed is labelled properly. They mentioned Natasha's Law directly and made the point that any pre-packed or donor-prepared food needs full allergen info, so the platform has to capture and display that.

The coordinator also made a nice feature suggestion: charity profiles that say what food types they accept. That way a donor wouldn't waste time offering cooked food to a pantry that only handles ambient goods. We didn't build that in the current version, but it shaped how we labelled storage types and categories on donations.

Storage capacity is a real constraint. With only 2 commercial fridges, they have to manage cold storage carefully. Knowing whether a donation is ambient, chilled, or frozen before accepting helps them plan. The storage type field on the donation form covers this.

Interest was 4/5. They see clear value in a platform that saves them coordination time and gives them structured info about donations. The main condition was that the platform actually enforces proper labelling and allergen compliance.
