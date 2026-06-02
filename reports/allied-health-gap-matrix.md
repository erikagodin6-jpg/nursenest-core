# Allied Health — gap matrix (current vs minimum standard)

**Legend:** ✓ = implemented in code/marketing | **TBD** = requires DB or runtime audit (never guessed) | **N/A** = not applicable

## Registry & Stripe

| Item | Required | Current | Gap |
|------|----------|---------|-----|
| Allied Stripe tier (`TierCode.ALLIED`) | ✓ | `ca-allied-core`, `us-allied-core` in `exam-pathways-data-segment-d.ts` | None |
| Distinct pathway per country | ✓ | CA + US rows | None |
| Occupation-specific marketing hubs | ✓ | `ALLIED_PROFESSIONS` (19 occupations) | Dedicated **psychotherapy** hub: not a separate registry row (see `social-work`, `mental-health-addictions`) |

## Premium hub modules (public marketing)

| Module | Allied standard | Current | Gap |
|--------|-----------------|---------|-----|
| Flashcards | Present | ✓ | None |
| Practice exams | Present | ✓ | None |
| Labs | Present | ✓ | None |
| Med calc | Present | ✓ | None |
| Pharmacology | Present | ✓ | None |
| Weak areas | Present | ✓ | None |
| NCLEX / NGN tools tile | **Must not** imply RN NCLEX on allied | **Omitted** for `roleTrack === "allied"` | None |
| ECG deep-link | RN/NP tier only | Omitted (`pathwayAllowsEcgLinkedLearning` false for ALLIED tier) | None |
| OSCE | Present; may be locked by feature flag | Card present; locked when `oscePublic` false | **TBD** env flag |
| Progress / exam plan | Present | Links to `/app/account/progress`, `/app/exam-plan` | **TBD** depth of wiring vs subscriber-only |

## Content volumes (honest)

| Metric | Per occupation | Current | How to fill |
|--------|----------------|---------|-------------|
| Published lessons | Product numeric standard **TBD** | **TBD** | `countPublishedPathwayLessonsForAlliedMarketing`; Prisma `pathwayLesson` |
| Practice questions (ALLIED exam keys) | **TBD** | **TBD** | `npm run audit:exam-bank`; `scripts/audit/generate-full-parity-audit.mts` |
| Flashcard decks | **TBD** | **TBD** | `flashcardDeck` `groupBy pathwayId` |
| CAT-ready pool | Marketing gates | **TBD** | `pathway-question-bank-snapshot` |
| Taxonomy categories | ≥ 9 | ✓ (`ALLIED_PROFESSION_TAXONOMIES`) | — |

## SEO & theme

| Check | Status |
|-------|--------|
| `generateMetadata` on `/allied/[career]` | ✓ (`safeGenerateMetadata`, canonical, OG) |
| Global hub `/allied/allied-health` | Uses allied shell + SEO helpers (**spot-check live**) |
| Theme / semantic surfaces | Premium grids use semantic panels + `alliedPremiumAccentChartVar` in hub component |

## Tests

| Gate | Status |
|------|--------|
| Playwright `tests/e2e/public/allied-health-hubs.spec.ts` | Added |
| Contract: allied omits ECG + NGN tile | ✓ |
