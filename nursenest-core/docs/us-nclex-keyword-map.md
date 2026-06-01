# United States NCLEX Keyword Map

Generated: 2026-06-01

Purpose: map existing United States NCLEX-RN assets to search intent and identify acquisition gaps using repository evidence only.

## Evidence Base

| Evidence | Finding |
|---|---|
| `src/lib/exam-pathways/exam-pathways-data-segment-b.ts` | `us-rn-nclex-rn` is active and subscription-acquired with SEO copy claiming 200 lessons and 480+ questions. |
| `docs/content-instrumentation-report.md` | Source-of-truth table lists `us-rn-nclex-rn` with 200 lessons and 480 questions; generated index lists 796 effective lessons, 45 procedures/skills, 21 categories. |
| `src/content/pathway-lessons/generated-indexes/us-rn-nclex-rn.json` | Generated lesson index has 796 effective lessons. |
| `docs/reports/us-rn-nclex-rn-practice-hub-count-audit.md` | DB-backed practice hub audit found 5,235 matching published rows across body-system hubs. |
| `docs/flashcard-platform-parity-audit.generated.md` | US NCLEX-RN has lesson-derived virtual flashcards and 4,805 CAT-available items in the flashcard/CAT parity view; dedicated flashcard table rows are not the primary evidence source. |
| `src/lib/seo/nclex-commercial-landing-pages.ts` | Published commercial SEO pages exist for NCLEX question bank, study plan, NGN types, CAT simulator, free questions, and best prep course. |
| `src/lib/seo/sitemap-index-children.ts` | NCLEX commercial pages are in sitemap children. |
| `src/app/(marketing)/(default)/blog/us-rn/page.tsx` and `docs/blog-surfacing-limit-audit.md` | `/blog/us-rn` exists, but scoped live `careerSlug = us-rn` count was 0 in the audit; global blog corpus is large but poorly attributed to US RN scoped discovery. |

## Inventory By Asset Type

| Asset type | Current evidence | Acquisition implication |
|---|---:|---|
| Pathway hub | `/us/rn/nclex-rn` resolves through the dynamic exam pathway route. | Primary commercial hub; should become the canonical NCLEX-RN hub. |
| Lessons | 200 source-of-truth count; 796 generated effective lessons. | Strong informational depth; must reconcile public count claims before scaling SEO copy. |
| Practice questions | 480 source-of-truth count; 5,235 DB-backed marketing hub matches. | Strongest commercial acquisition lever, but count discrepancy needs governance. |
| CAT | US RN testing model uses CAT; CAT route exists through `/us/rn/nclex-rn/cat`; app routes include `/app/cat` and `/app/practice-tests`. | High-intent conversion surface. Claims should say readiness signal, not pass guarantee. |
| Flashcards | Route and virtual flashcards exist; dedicated table rows are not the only source. | Useful conversion feature, but public claims should clarify integrated/lesson-derived flashcards. |
| Practice exams | `/practice-exams` and app practice-test routes exist. | Commercial page opportunity; needs public NCLEX-RN-specific landing page. |
| Blog content | Global NCLEX long-tail corpus exists; `/blog/us-rn` scoped discovery may show 0 live rows because career attribution is missing. | Major acquisition gap: republish/retag US RN articles into the scoped hub. |
| Learning paths | `structured-study-path.ts`, `/app/study-plan`, and `/nclex-study-plan` exist. | Strong study-plan intent capture, especially 30/60/90-day queries. |

## Search Intent Map

| Query cluster | Intent | Existing asset | Status | Gap |
|---|---|---|---|---|
| nclex rn practice questions | Commercial | `/nclex-question-bank`, `/free-nclex-practice-questions`, `/us/rn/nclex-rn/questions` | Partial | Need exact US RN count display and route-specific CTA tests. |
| free nclex practice questions | Commercial/free trial | `/free-nclex-practice-questions`, `/question-bank` | Partial | Need sample question preview path tied to signup funnel. |
| nclex rn cat exam / cat nclex simulator | Commercial | `/cat-nclex-simulator`, `/us/rn/nclex-rn/cat` | Good | Need stronger internal links from NGN, readiness, and question-bank pages. |
| nclex rn flashcards | Commercial | `/flashcards`, `/us/rn/nclex-rn/flashcards` dynamic route | Gap | Need dedicated `/nclex-rn-flashcards/` acquisition page and count-safe copy. |
| nclex study plan | Informational/commercial | `/nclex-study-plan`, `/app/study-plan` | Good | Add segmented 30/60/90-day blocks and email capture. |
| nclex readiness assessment / predictor | Commercial | Readiness report app surface and CAT readiness API | Gap | Need public readiness predictor landing page with no pass-guarantee language. |
| nclex pharmacology | Informational/commercial | Lessons, question bank, pharmacology category; no dedicated page | Gap | Build `/nclex-rn-pharmacology/` architecture before route. |
| nclex priority delegation | Informational/commercial | Leadership/delegation lessons and questions; no dedicated page | Gap | Build `/nclex-rn-priority-delegation/` architecture. |
| nclex sata questions | Informational/commercial | NGN page mentions SATA; no dedicated SATA page | Gap | Build `/nclex-rn-sata/` architecture. |
| next gen nclex / ngn case studies | Informational/commercial | `/nclex-next-gen-question-types`; many long-tail articles | Partial | Add `/nclex-rn-next-gen-nclex/` and `/nclex-rn-case-studies/` specifications. |
| best nclex prep course | Commercial/comparison | `/best-nclex-prep-course` | Good | Needs competitor comparison internal links and evidence-safe matrices. |
| uworld alternative / archer alternative / kaplan alternative / bootcamp alternative | Commercial comparison | No dedicated pages | Gap | Build comparison specs with verified feature claims and honest unknowns. |

## Funnel Gaps

| Funnel stage | Current asset | Gap | Priority |
|---|---|---|---|
| Discovery | Global blog corpus and commercial pages | `/blog/us-rn` scoped attribution gap; commercial pages are broad, not all NCLEX-RN-specific slugs. | Critical |
| Consideration | Question bank, CAT, study plan pages | Missing flashcards, readiness predictor, SATA, pharmacology, priority/delegation, case-study pages. | Critical |
| Conversion | `/pricing`, `/signup`, `/us/rn/nclex-rn` | Prior US audit flags USD pricing/env verification and social proof gaps. | Critical |
| Activation | App dashboard, CAT, flashcards, study plan | Public pages should link users to exactly the first post-signup action. | High |
| Retention | Readiness report, weak areas, flashcards | Need acquisition pages that explain the remediation loop before purchase. | High |

## Internal Linking Gaps

1. Commercial pages link to core study surfaces, but no NCLEX-specific spoke system exists for flashcards, readiness assessment, pharmacology, priority/delegation, SATA, and case studies.
2. Blog posts often link to `/question-bank` or `/app/flashcards`; high-intent US RN content should link to `/us/rn/nclex-rn/questions`, `/us/rn/nclex-rn/cat`, and the proposed commercial spokes.
3. `/blog/us-rn` exists but scoped article attribution is weak. Retag or create US RN blog rows before treating it as a primary hub.
4. Footer links include `/nclex-question-bank`, `/cat-nclex-simulator`, and `/nclex-study-plan`; add new links only after pages are built and conversion-ready.

## Fastest SEO Wins

1. Reconcile count claims: choose one governed public count source for lessons, question bank, CAT pool, and flashcards.
2. Build route specs for high-intent NCLEX-RN spokes before implementation.
3. Retag 100-200 highest-quality global NCLEX posts into `careerSlug = us-rn` or equivalent scoped discovery.
4. Add internal links from high-traffic blog posts to question bank, CAT, study plan, and pathway lesson hubs.
5. Build comparison pages only with evidence-verified competitor claims and avoid pass-rate or superiority claims unless sourced.
