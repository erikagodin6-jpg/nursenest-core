# HESI & TEAS Launch Readiness Audit

Generated: 2026-05-29

## Executive Verdict

NurseNest should **not** confidently sell or publicly launch HESI A2 or ATI TEAS today.

Both pathways are currently **internal scaffold / architecture-only** products, not production-ready learner pathways. The repository contains hidden pathway registry rows, taxonomy definitions, academy blueprints, readiness self-assessments, navigation labels that route users to Pre-Nursing, and static preview framing. It does **not** contain launch-ready HESI/TEAS learner inventory, commerce, entitlements, public sitemap exposure, dedicated learner dashboard access, or end-to-end study flows.

| Product | Launch classification | Architecture readiness | Commercial launch readiness | Sell today? |
| --- | --- | ---: | ---: | --- |
| HESI A2 | PARTIAL / INTERNAL SCAFFOLD | 31/100 | 0/100 | No |
| ATI TEAS | PARTIAL / INTERNAL SCAFFOLD | 31/100 | 0/100 | No |

The 31/100 score comes from the repository's own admissions readiness model in `src/lib/admissions/admissions-slice-readiness.ts`. Commercial readiness is 0/100 because the products are intentionally hidden, free-tier isolated, non-checkoutable, non-indexed, and lack content pools.

## Discovery Findings

### Routes

No dedicated public route files exist for HESI or TEAS under `src/app`.

The hidden internal routes are registry-driven:

- `/us/allied/hesi-a2`
- `/us/allied/ati-teas`

Evidence:

- `src/lib/exam-pathways/exam-pathways-data-segment-f-internal-admissions.ts`
  - `status: "hidden"`
  - `acquisitionMode: "info_only"`
  - `stripeTier: TierCode.PRE_NURSING`
  - `contentExamKeys: []`
- `src/lib/exam-pathways/admissions-prep-internal-pathways.ts`
  - Requires `NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS=1`
  - Allows only exact overview route for HESI A2 and ATI TEAS
  - Blocks sibling routes such as pricing, questions, CAT, and lessons
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/layout.tsx`
  - `notFound()` for hidden routes unless the internal overview route is explicitly allowed
- `docs/reports/hesi-teas-phase-1-scaffold.md`
  - States no public routes were added and sibling subroutes remain blocked

### Navigation

HESI and TEAS appear as marketing header labels, but both link to `/pre-nursing`, not dedicated HESI/TEAS surfaces.

Evidence:

- `src/components/layout/site-header.tsx`
  - Comment: `HESI and TEAS have no dedicated routes — both map to /pre-nursing.`
  - HESI link: `{ key: "hesi", href: "/pre-nursing", matchBase: "/hesi", label: "HESI" }`
  - TEAS link: `{ key: "teas", href: "/pre-nursing", matchBase: "/teas", label: "TEAS" }`
- `src/components/layout/site-header-server.tsx`
  - Same server-side precomputed nav behavior

Risk: prospective learners may see HESI/TEAS labels and assume dedicated products exist, but they are redirected into generic Pre-Nursing.

### Marketing / SEO / Authority References

Marketing and planning references exist, but launch controls keep the products non-public.

Evidence:

- `scripts/gen-prenursing-preview-html.py`
  - Static preview only; labels say `No /teas route` and `No /hesi route`
- `preview-screenshots/prenursing/teas-prep.html`
  - Static TEAS readiness framing; no canonical product route
- `preview-screenshots/prenursing/hesi-prep.html`
  - Static HESI readiness framing; no canonical product route
- `docs/prenursing-figma-redesign-summary.md`
  - States no `/pre-nursing/teas` route and no `/pre-nursing/hesi` route
- `docs/prenursing-modules-lessons-quizzes-audit.md`
  - States TEAS/HESI named product routes are absent

### Sitemaps / Indexing

HESI and TEAS are intentionally excluded from public discovery.

Evidence:

- `docs/reports/hesi-teas-phase-1-scaffold.md`
  - `collectExamPathwayUrls()` does not emit HESI / TEAS URLs
  - hidden admissions metadata remains `noindex, nofollow`
  - no public hreflang alternates
- `docs/governance/admissions-prep-launch-gate.md`
  - Requires no sitemap URLs and noindex/nofollow until full launch sign-off
- `tests/contracts/admissions-prep-phase2.contract.test.ts`
  - Asserts HESI/TEAS are excluded from public pathway lists and sitemap URLs

### Feature Flags

Internal route access is gated by:

- `NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS=1`

Evidence:

- `src/lib/exam-pathways/admissions-prep-internal-pathways.ts`

Production expectation in docs:

- Flag remains unset in production until launch.

### Entitlements / Checkout

HESI A2 and ATI TEAS are not purchasable products.

Evidence:

- `src/lib/exam-pathways/exam-pathways-data-segment-f-internal-admissions.ts`
  - HESI A2 and ATI TEAS use `stripeTier: TierCode.PRE_NURSING`
- `src/lib/pricing/display-catalog.ts`
  - `PRE_NURSING` is a free, non-Stripe billing tier
- `src/app/api/subscriptions/checkout/route.ts`
  - Checkout rejects free tiers with `checkout_free_pathway_no_stripe`
- `tests/contracts/admissions-prep-phase2.contract.test.ts`
  - Asserts HESI A2 and ATI TEAS remain on `PRE_NURSING`
  - Asserts no Stripe checkout

## Content Inventory

### HESI A2

| Inventory Area | Actual status | Count / Evidence |
| --- | --- | --- |
| Dedicated question bank | Missing | `contentExamKeys: []`; question access fails closed |
| Flashcards | Missing | taxonomy defines future `nn.flashcard_pool.admissions.*` IDs only |
| Published lessons | Missing | blueprints exist, but no published learner lesson route/pool mapping |
| Lesson blueprints | Partial scaffold | 8 domains, 16 lesson blueprints in `HESI_A2_ACADEMY` |
| Readiness assessment | Missing | readiness model marks section diagnostic missing |
| Practice exams | Missing | readiness model marks timed practice partial only because platform engine exists |
| CAT availability | Not launchable | taxonomy says future eligible; CAT currently info-only/hidden |
| Adaptive remediation | Missing/partial scaffold | requires HESI blueprint linkage and tagged pools |
| Study plans | Missing/partial scaffold | reusable engine exists; no HESI section logic wired |
| Clinical skills | Not HESI-specific | no dedicated HESI clinical skills surface |
| Pharmacology | Not HESI-specific | no dedicated HESI pharmacology surface |
| Analytics | Missing | section analytics marked partial/missing |

Repository readiness model:

- HESI A2 Readiness: 31%
- Complete items: 1 of 9
- Missing required:
  - Dedicated HESI A2 hub
  - HESI A2 blueprint registry
  - HESI-style question bank
  - Section diagnostic
  - Section-based study plan
  - Timed practice tests
  - Section analytics

### ATI TEAS

| Inventory Area | Actual status | Count / Evidence |
| --- | --- | --- |
| Dedicated question bank | Missing | `contentExamKeys: []`; question access fails closed |
| Flashcards | Missing | taxonomy defines future `nn.flashcard_pool.admissions.*` IDs only |
| Published lessons | Missing | blueprints exist, but no published learner lesson route/pool mapping |
| Lesson blueprints | Partial scaffold | 4 domains, 9 lesson blueprints in `ATI_TEAS_ACADEMY` |
| Readiness assessment | Missing | readiness model marks diagnostic missing |
| Practice exams | Missing | timed tests marked partial only because practice engine exists |
| CAT availability | Not launchable | taxonomy says future eligible; CAT currently info-only/hidden |
| Adaptive remediation | Missing/partial scaffold | requires TEAS blueprint linkage and tagged pools |
| Study plans | Missing/partial scaffold | no TEAS-specific plan generation wired |
| Clinical skills | Not applicable / not TEAS-specific | no dedicated TEAS clinical skills surface |
| Pharmacology | Not TEAS-specific | no dedicated TEAS pharmacology surface |
| Analytics | Missing | section analytics marked partial/missing |

Repository readiness model:

- ATI TEAS Readiness: 31%
- Complete items: 1 of 9
- Missing required:
  - Dedicated TEAS hub
  - TEAS blueprint registry
  - TEAS-style question bank
  - TEAS diagnostic
  - Timed TEAS practice tests
  - Adaptive remediation
  - TEAS section analytics

## User Journey Audit

### Anonymous User

| Step | HESI | TEAS | Status |
| --- | --- | --- | --- |
| Homepage discovery | Header may show label but links to Pre-Nursing | Header may show label but links to Pre-Nursing | Partial / confusing |
| Dedicated public landing page | Not available | Not available | Missing |
| Pricing product | Not available | Not available | Missing |
| Checkout | Rejected/free-tier isolated | Rejected/free-tier isolated | Missing |
| Access content | No dedicated pools | No dedicated pools | Missing |

### Paid User

| Step | HESI | TEAS | Status |
| --- | --- | --- | --- |
| Dashboard tile | Hidden / not exposed as launched learner pathway | Hidden / not exposed as launched learner pathway | Missing |
| Questions | `contentExamKeys: []` fails closed | `contentExamKeys: []` fails closed | Missing |
| Flashcards | Future pool IDs only | Future pool IDs only | Missing |
| Lessons | Academy blueprints only; no published route mapping | Academy blueprints only; no published route mapping | Missing |
| Study plan | No product-specific section plan | No product-specific section plan | Missing |
| Readiness | No active diagnostic/readiness workflow | No active diagnostic/readiness workflow | Missing |
| Analytics | No section analytics | No section analytics | Missing |

## Commercial Readiness Audit

| Question | HESI | TEAS |
| --- | --- | --- |
| Can a user actually purchase it? | No | No |
| Is there a Stripe mapping? | No; `PRE_NURSING` free tier | No; `PRE_NURSING` free tier |
| Is there a subscription entitlement? | No dedicated entitlement | No dedicated entitlement |
| Is there server-side feature gating? | Only hidden/internal route gating | Only hidden/internal route gating |
| Is it visible in learner dashboard as a product? | No | No |
| Does progress tracking exist for the pathway? | No dedicated pathway progress | No dedicated pathway progress |
| Does analytics/reporting exist? | No section analytics | No section analytics |

## SEO Audit

| SEO Area | HESI | TEAS |
| --- | --- | --- |
| Public indexable page | No | No |
| Sitemap inclusion | No | No |
| Hreflang alternates | Omitted for internal admissions pathways | Omitted for internal admissions pathways |
| Authority cluster | Planning/blueprint only | Planning/blueprint only |
| Long-tail content cluster | Not launch-ready | Not launch-ready |
| Risk if indexed today | Critical | Critical |

If indexed before product completion, both would create a commercial and trust risk because users would land on incomplete or non-functional product surfaces.

## Gap Classification

| Component | HESI | TEAS |
| --- | --- | --- |
| Routes | PARTIAL internal overview-only scaffold | PARTIAL internal overview-only scaffold |
| Marketing | PARTIAL Pre-Nursing framing | PARTIAL Pre-Nursing framing |
| SEO | NOT PUBLIC / intentionally noindex | NOT PUBLIC / intentionally noindex |
| Question bank | NOT IMPLEMENTED | NOT IMPLEMENTED |
| Flashcards | NOT IMPLEMENTED | NOT IMPLEMENTED |
| Lessons | BLUEPRINT ONLY | BLUEPRINT ONLY |
| Practice exams | NOT IMPLEMENTED | NOT IMPLEMENTED |
| CAT | NOT IMPLEMENTED / future eligible only | NOT IMPLEMENTED / future eligible only |
| Readiness assessment | NOT IMPLEMENTED | NOT IMPLEMENTED |
| Study plans | NOT IMPLEMENTED | NOT IMPLEMENTED |
| Analytics | NOT IMPLEMENTED | NOT IMPLEMENTED |
| Checkout | NOT IMPLEMENTED | NOT IMPLEMENTED |
| Entitlements | NOT IMPLEMENTED | NOT IMPLEMENTED |
| Learner dashboard | NOT IMPLEMENTED | NOT IMPLEMENTED |

Overall classification:

- HESI A2: **PARTIAL / INTERNAL SCAFFOLD**
- ATI TEAS: **PARTIAL / INTERNAL SCAFFOLD**

Neither is marketing-only, because there is real architecture and taxonomy scaffolding. Neither is content-only, because there is no dedicated live content inventory. Neither is ready.

## P0 Launch Blockers

1. No dedicated public HESI/TEAS route surfaces.
2. Products are `status: "hidden"` and require internal-only flag resolution.
3. No purchasable plan or Stripe mapping.
4. No dedicated server-side entitlement model.
5. No question pools; `contentExamKeys: []` ensures question access fails closed.
6. No flashcard decks.
7. No published learner lessons tied to pathway routes.
8. No diagnostics or readiness assessments.
9. No timed practice exams.
10. No CAT/adaptive launch behavior.
11. No section analytics or report cards.
12. No product-specific study plans.
13. SEO is intentionally blocked by noindex/sitemap exclusion.
14. Navigation currently names HESI/TEAS but sends users to Pre-Nursing, which may overstate readiness.
15. Legal/trademark/compliance review is explicitly incomplete.

## Minimum Launch Plan

### Content Minimums

Recommended minimum before any public paid launch:

| Product | Questions | Flashcards | Lessons | Diagnostics / exams |
| --- | ---: | ---: | ---: | --- |
| HESI A2 | 800-1,200 tagged questions across 8 domains | 400-600 cards | 16-24 authored lessons | 1 baseline diagnostic + 4 timed section exams + 1 full-length simulation |
| ATI TEAS | 800-1,200 tagged questions across 4 domains | 400-600 cards | 12-18 authored lessons | 1 baseline diagnostic + 4 timed section exams + 1 full-length simulation |

Each item must include educator-quality rationales, distractor explanations, blueprint tags, difficulty, domain/subdomain, and remediation mapping.

### Product Requirements

Before launch:

- Dedicated HESI A2 public hub.
- Dedicated ATI TEAS public hub.
- Dedicated learner dashboard tiles.
- Question bank launch routes.
- Flashcard deck routes.
- Lesson routes.
- Timed practice exam routes.
- Baseline diagnostic assessment.
- Readiness score by domain.
- Study plan generation by exam date and weak domain.
- Adaptive remediation linked to content pools.
- Progress analytics and report-card support.
- Server-enforced entitlements.
- Pricing/checkout plan and Stripe mapping if paid.
- Mobile and theme QA.

### SEO Requirements

Before indexation:

- Trademark-safe titles and disclaimers.
- HESI A2 authority cluster.
- ATI TEAS authority cluster.
- Sitemap entries only in the same release as working product surfaces.
- FAQ schema and breadcrumb schema.
- No placeholder or future-tense claims.
- Internal links from Pre-Nursing, pricing, and relevant science foundations pages.

## Estimated Work Remaining

| Workstream | HESI | TEAS |
| --- | --- | --- |
| Product architecture wiring | 1-2 weeks | 1-2 weeks |
| Content authoring/import/QA | 4-8 weeks | 4-8 weeks |
| Diagnostics/readiness/study plans | 2-3 weeks | 2-3 weeks |
| Checkout/entitlements | 1 week | 1 week |
| SEO/public launch surfaces | 1-2 weeks | 1-2 weeks |
| End-to-end QA/accessibility/mobile | 1-2 weeks | 1-2 weeks |

Estimated realistic launch window if staffed in parallel: **8-12 weeks**.

Recommended launch date: **no earlier than August 24, 2026**, assuming immediate staffing and weekly clinical/editorial QA. If content authoring is not already underway, a safer target is **September 2026**.

## Final Answer

Can NurseNest confidently sell and support HESI and TEAS today?

**No.**

The repository has hidden scaffolding and strong architectural intent, but HESI A2 and ATI TEAS are not production-ready learner products. They should remain hidden/noindex/non-checkoutable until the written launch gate is satisfied and the missing content, commerce, learner, analytics, and QA pieces are complete.

