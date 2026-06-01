# United States NCLEX Conversion Layer Audit

Generated: 2026-06-01

Scope: major US NCLEX acquisition surfaces and required conversion elements.

## Evidence Base

| Evidence | Finding |
|---|---|
| `docs/us-conversion-audit.md` | Prior audit identified pricing currency, trial prominence, social proof, OAuth, and signup friction issues. |
| `docs/us-launch-scorecard.md` | Overall US launch score was 65/100; conversion readiness was 58/100 and pricing readiness 35/100. |
| `src/lib/seo/nclex-commercial-landing-pages.ts` | Commercial pages include primary/secondary CTAs, comparison sections, internal links, and FAQ. |
| `src/app/(marketing)/(default)/pricing/page.tsx` | Pricing metadata and plan stream exist. |
| `src/app/(marketing)/(default)/signup/page.tsx` | Signup route is noindex utility page. |
| `src/app/api/subscriptions/checkout/route.ts` | Checkout route supports subscription checkout and regional pricing logic. |

## Conversion Element Matrix

| Surface | Primary CTA | Secondary CTA | Trial CTA | Pricing CTA | Trust CTA | Social proof | FAQ | Outcome statement | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| `/us/rn/nclex-rn` | Present through pathway hub | Present | Needs visual QA | Present through pricing links | Partial | Not verified | Likely dynamic/pathway dependent | Present in SEO description | Needs QA |
| `/nclex-question-bank` | Present | Present | Not explicit enough | Indirect | Partial | Not verified | Present | Strong rationale/remediation framing | Good foundation |
| `/cat-nclex-simulator` | Present | Present | Not explicit enough | Indirect | Partial | Not verified | Present | Readiness signal, no guarantee | Good foundation |
| `/nclex-study-plan` | Present | Present | Not explicit enough | Indirect | Partial | Not verified | Present | Study rhythm and readiness framing | Good foundation |
| `/nclex-next-gen-question-types` | Present | Present | Not explicit enough | Indirect | Partial | Not verified | Present | Clinical judgment framing | Good foundation |
| `/free-nclex-practice-questions` | Present | Present | Natural free-entry intent | Indirect | Partial | Not verified | Present | Free sample value | Strong top-of-funnel |
| `/best-nclex-prep-course` | Present | Present | Not explicit enough | Indirect | Partial | Not verified | Present | Whole study loop | Good foundation |
| `/pricing` | Present | Plan-dependent | Needs stronger trial treatment | Core surface | Needs US trust proof | Not verified | Deferred SEO part exists | Pricing value unclear for US if currency not obvious | Conversion blocker |
| `/signup` | Present | OAuth likely present but not audited here | Not product-specific | Not primary | Weak | Not applicable | No | Account creation utility | Needs US defaulting |

## Highest-Impact Conversion Fixes

1. Add explicit US currency clarity on pricing.
2. Prominently state the trial offer on commercial pages and pricing; keep exact trial length in one constant.
3. Add route-specific CTA copy:
   - Question bank: “Start NCLEX-RN practice.”
   - CAT: “Run a CAT readiness session.”
   - Study plan: “Build my NCLEX study plan.”
   - Flashcards: “Start NCLEX flashcards.”
4. Add trust blocks that are truthful today:
   - “Built for US NCLEX-RN pathway.”
   - “Clinical judgment, rationales, CAT, lessons, and remediation in one study loop.”
   - Avoid pass-rate or student-count claims until evidenced.
5. Add sample-question preview modules to commercial pages where feasible.
6. Add persistent comparison-to-action CTAs on competitor pages.

## Page Template Conversion Requirements

Every NCLEX acquisition page should include:

- Primary CTA above the fold.
- Secondary CTA for lower-commitment study action.
- Pricing/trial CTA by first 60% scroll depth.
- FAQ near bottom.
- Trust/editorial block.
- Product screenshot or truthful product preview.
- Internal links to hub, questions, CAT, flashcards, study plan, and related topic pages.

## Launch Blockers From Conversion Lens

| Blocker | Evidence | Fix |
|---|---|---|
| USD pricing not confirmed | `docs/us-launch-scorecard.md` | Configure and verify Stripe USD prices. |
| Trial value not prominent | `docs/us-conversion-audit.md` | Promote trial consistently across commercial pages. |
| Social proof not verified | `docs/us-conversion-audit.md` | Use neutral trust proof until US learner proof exists. |
| OAuth path not E2E verified | `docs/us-conversion-audit.md` | Add US OAuth QA before paid growth. |
| Blog-to-conversion path weak | `docs/blog-surfacing-limit-audit.md` | Retag US RN content and add structured CTAs. |

## Recommended Conversion KPIs

- Commercial page CTA click rate.
- Commercial page to signup rate.
- Signup start to account-created rate.
- Signup to trial-start rate.
- Trial-start to paid conversion.
- Blog-to-question-bank click rate.
- Question preview to signup rate.
- Pricing page plan-selection rate by US region.
