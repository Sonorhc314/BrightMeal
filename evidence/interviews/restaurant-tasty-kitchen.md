# Donor Interview: Tasty Kitchen

| Detail | Value |
|---|---|
| **Organisation** | Tasty Kitchen |
| **Address** | 4 New Street, Bath BA1 2AF |
| **Type** | Restaurant / takeaway |
| **Interest level** | 4/5 |
| **Interviewer** | Riad |
| **Date** | April 2026 |

## Key Findings

- Strong personal motivation to reduce food waste. The owner expressed genuine frustration at discarding edible food nightly.
- Estimates 3-6 kg of surplus food daily, primarily at end of service.
- The timing section was identified as the biggest usability barrier. The original design used 4 datetime fields (available from date, available from time, collect before date, collect before time), which the owner found overly complex for the reality of how surplus food works.
- Requested a "by end of today" shortcut button rather than manually setting date/time pickers each time.
- Needs clear handover confirmation so the donor knows food has been collected and the process is complete.
- Driver reliability is critical. If a driver does not show up, the food is wasted and the donor loses trust in the platform.
- Holds an FSA Food Hygiene Rating of 3 out of 5.

## Direct Quotes

> "We throw away a good amount every night, it feels wrong. If someone could just come and take it, I'd do it every day."

> "Food doesn't expire on the hour. If it's in the fridge, it's fine until tomorrow morning."

## What Changed in the App

We replaced the 4 datetime fields with a 2-tap availability selector. Donors now choose between **Tonight** (available now, collect before closing) and **Storable** (available now, collect within a longer window), with a **Today** quick-set button. The labels were changed from technical datetime terminology to plain language: "Available from" and "Collect before". The Friends Takeaway interview later confirmed this was the right call.

## Summary

Tasty Kitchen confirmed there's real donor demand and the core idea works. The interview drove the biggest UX change in the donation flow, which was simplifying the timing input from 4 fields to a 2-tap selector. The owner's feedback on driver reliability and handover confirmation also fed into the driver assignment and delivery confirmation features.
