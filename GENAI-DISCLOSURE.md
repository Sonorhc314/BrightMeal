# Generative AI Disclosure

**Module:** CM32027 Entrepreneurship
**Assessment:** CW2 Business Presentation (Type B)
**Group:** I (BrightMeal)

## Tools Used

### Claude (Anthropic)

- **Scope:** CW2 development phase only
- **Used for:** Implementing the Next.js application, database schema, RLS policies, trigger logic, RPC functions, Tailwind styling, and component architecture. Used as a pair-programming tool where team members described requirements and architectural decisions; Claude generated implementation code that was reviewed, tested, and iterated on.
- **Not used for:** Architecture decisions, security model design, gamification concept, interview questions or analysis, outreach content, presentation script or content, legal and ethical analysis, business strategy.

### Figma AI

- **Scope:** CW1 only
- **Used for:** Generating initial UI layout suggestions during the wireframing and prototyping phase.
- **Not used in CW2.** All CW2 UI was implemented directly in React and Tailwind CSS.

## What Was Human-Led

- System architecture (three-role model, App Router structure, Supabase integration)
- Security model (RLS policies, trigger-enforced state machine, SECURITY DEFINER RPCs, field restrictions)
- Gamification design (points formula, 21 badges across 4 tiers, streak mechanics, efficiency metric)
- Database schema design (6 migrations, enum types, foreign key relationships)
- All stakeholder interviews (charity, restaurant, driver) and analysis of findings
- Outreach strategy, branding, and marketing materials
- Legal analysis (Food Safety Act 1990, Natasha's Law, Uber v Aslam, UK GDPR, DPA 2018)
- Ethical and sustainability analysis
- Presentation content, structure, slide design, and delivery
- All user testing design and execution
- Business model and forward strategy decisions

## How AI Output Was Verified

1. All generated code was reviewed for correctness by team members
2. Code was tested against the live Supabase instance before deployment
3. Security model was verified through manual testing of RLS policies and trigger enforcement
4. Features were iterated based on real user feedback from charity interviews
