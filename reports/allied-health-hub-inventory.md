# Allied Health hub inventory

**Generated from codebase (no DB counts invented).** Pathway registry: `exam-pathways-data-segment-d.ts`. Occupations: `ALLIED_PROFESSIONS` in `allied-professions-registry.ts` (**19** rows). Exam family / Stripe: `ExamFamily.ALLIED`, `TierCode.ALLIED`.

**Truthpack:** `.vibecheck/truthpack/` not present in this workspace clone — registry + Prisma enums used as source.

## Summary — pathway IDs (exam-product-registry)

| Public marketing base | Pathway ID | Exam code | Region | Stripe tier |
|-----------------------|------------|-----------|--------|-------------|
| `/canada/allied/allied-health` (legacy → `/allied/...`) | `ca-allied-core` | `allied-health` | CA | ALLIED |
| `/us/allied/allied-health` (legacy → `/allied/...`) | `us-allied-core` | `allied-health` | US | ALLIED |

Canonical global hub path: **`/allied/allied-health`** (`ALLIED_GLOBAL_HUB_PATH`). Occupation hubs: **`/allied/{professionKey}`** (`buildAlliedOccupationMarketingHubPath`). Hero segments `/allied-health/{segment}` redirect to pathway hubs per registry comments.

## Occupation inventory (all registry professions)

Columns 6–14 are **TBD** unless filled by a DB-connected audit in your environment. Commands:

- Lessons (published, pathway): Prisma `pathwayLesson` with `pathwayId=us-allied-core` / `ca-allied-core`, `status=PUBLISHED`, optional `topicSlug in topicSlugsIn`
- Questions: `exam_questions` filtered by exam keys from `contentExamKeys` (`ALLIED`) + tier/region gates — see `npm run audit:exam-bank`, `scripts/audit-exam-question-bank.ts`
- Flashcard decks: `flashcardDeck` by `pathwayId`
- CAT: `pathway-readiness-config` lists **SIMULATION** for allied cores; adaptive marketing gates in `pathway-marketing-practice-gates.ts`
- Scenarios / labs / med calc / skill refresher: surface via hub cards → app routes; **volume TBD** per audit scripts

| # | Public hub route | Pathway ID | Exam / key | Modules visible (premium grid) | Locked / gated | Missing vs standard |
|---|------------------|------------|------------|----------------------------------|----------------|---------------------|
| 1 | `/allied/pta` | `us-allied-core` | `ALLIED / allied-health` | Flashcards, Practice exams, Labs, Med calc, Pharmacology, Weak areas, OSCE (may lock); **NGN tile omitted** for allied; **no ECG** (tier). | OSCE when `isOsceScenariosPubliclyEnabled` false; optional mastery previews admin-gated only. | See `reports/allied-health-gap-matrix.md`; numeric content TBD. |
| 2 | `/allied/ota` | `us-allied-core` | `ALLIED / allied-health` | Flashcards, Practice exams, Labs, Med calc, Pharmacology, Weak areas, OSCE (may lock); **NGN tile omitted** for allied; **no ECG** (tier). | OSCE when `isOsceScenariosPubliclyEnabled` false; optional mastery previews admin-gated only. | See `reports/allied-health-gap-matrix.md`; numeric content TBD. |
| 3 | `/allied/mlt` | `us-allied-core` | `ALLIED / allied-health` | Flashcards, Practice exams, Labs, Med calc, Pharmacology, Weak areas, OSCE (may lock); **NGN tile omitted** for allied; **no ECG** (tier). | OSCE when `isOsceScenariosPubliclyEnabled` false; optional mastery previews admin-gated only. | See `reports/allied-health-gap-matrix.md`; numeric content TBD. |
| 4 | `/allied/imaging` | `us-allied-core` | `ALLIED / allied-health` | Flashcards, Practice exams, Labs, Med calc, Pharmacology, Weak areas, OSCE (may lock); **NGN tile omitted** for allied; **no ECG** (tier). | OSCE when `isOsceScenariosPubliclyEnabled` false; optional mastery previews admin-gated only. | See `reports/allied-health-gap-matrix.md`; numeric content TBD. |
| 5 | `/allied/respiratory` | `us-allied-core` | `ALLIED / allied-health` | Flashcards, Practice exams, Labs, Med calc, Pharmacology, Weak areas, OSCE (may lock); **NGN tile omitted** for allied; **no ECG** (tier). | OSCE when `isOsceScenariosPubliclyEnabled` false; optional mastery previews admin-gated only. | See `reports/allied-health-gap-matrix.md`; numeric content TBD. |
| 6 | `/allied/paramedic` | `us-allied-core` | `ALLIED / allied-health` | Flashcards, Practice exams, Labs, Med calc, Pharmacology, Weak areas, OSCE (may lock); **NGN tile omitted** for allied; **no ECG** (tier). | OSCE when `isOsceScenariosPubliclyEnabled` false; optional mastery previews admin-gated only. | See `reports/allied-health-gap-matrix.md`; numeric content TBD. |
| 7 | `/allied/pharmacy-tech` | `us-allied-core` | `ALLIED / allied-health` | Flashcards, Practice exams, Labs, Med calc, Pharmacology, Weak areas, OSCE (may lock); **NGN tile omitted** for allied; **no ECG** (tier). | OSCE when `isOsceScenariosPubliclyEnabled` false; optional mastery previews admin-gated only. | See `reports/allied-health-gap-matrix.md`; numeric content TBD. |
| 8 | `/allied/social-work` | `us-allied-core` | `ALLIED / allied-health` | Flashcards, Practice exams, Labs, Med calc, Pharmacology, Weak areas, OSCE (may lock); **NGN tile omitted** for allied; **no ECG** (tier). | OSCE when `isOsceScenariosPubliclyEnabled` false; optional mastery previews admin-gated only. | See `reports/allied-health-gap-matrix.md`; numeric content TBD. |
| 9 | `/allied/psw-hca` | `us-allied-core` | `ALLIED / allied-health` | Flashcards, Practice exams, Labs, Med calc, Pharmacology, Weak areas, OSCE (may lock); **NGN tile omitted** for allied; **no ECG** (tier). | OSCE when `isOsceScenariosPubliclyEnabled` false; optional mastery previews admin-gated only. | See `reports/allied-health-gap-matrix.md`; numeric content TBD. |
| 10 | `/allied/community-health-worker` | `us-allied-core` | `ALLIED / allied-health` | Flashcards, Practice exams, Labs, Med calc, Pharmacology, Weak areas, OSCE (may lock); **NGN tile omitted** for allied; **no ECG** (tier). | OSCE when `isOsceScenariosPubliclyEnabled` false; optional mastery previews admin-gated only. | See `reports/allied-health-gap-matrix.md`; numeric content TBD. |
| 11 | `/allied/mental-health-addictions` | `us-allied-core` | `ALLIED / allied-health` | Flashcards, Practice exams, Labs, Med calc, Pharmacology, Weak areas, OSCE (may lock); **NGN tile omitted** for allied; **no ECG** (tier). | OSCE when `isOsceScenariosPubliclyEnabled` false; optional mastery previews admin-gated only. | See `reports/allied-health-gap-matrix.md`; numeric content TBD. |
| 12 | `/allied/medical-assistant` | `us-allied-core` | `ALLIED / allied-health` | Flashcards, Practice exams, Labs, Med calc, Pharmacology, Weak areas, OSCE (may lock); **NGN tile omitted** for allied; **no ECG** (tier). | OSCE when `isOsceScenariosPubliclyEnabled` false; optional mastery previews admin-gated only. | See `reports/allied-health-gap-matrix.md`; numeric content TBD. |
| 13 | `/allied/dental-assistant` | `us-allied-core` | `ALLIED / allied-health` | Flashcards, Practice exams, Labs, Med calc, Pharmacology, Weak areas, OSCE (may lock); **NGN tile omitted** for allied; **no ECG** (tier). | OSCE when `isOsceScenariosPubliclyEnabled` false; optional mastery previews admin-gated only. | See `reports/allied-health-gap-matrix.md`; numeric content TBD. |
| 14 | `/allied/dental-hygiene` | `us-allied-core` | `ALLIED / allied-health` | Flashcards, Practice exams, Labs, Med calc, Pharmacology, Weak areas, OSCE (may lock); **NGN tile omitted** for allied; **no ECG** (tier). | OSCE when `isOsceScenariosPubliclyEnabled` false; optional mastery previews admin-gated only. | See `reports/allied-health-gap-matrix.md`; numeric content TBD. |
| 15 | `/allied/dietetic-technician` | `us-allied-core` | `ALLIED / allied-health` | Flashcards, Practice exams, Labs, Med calc, Pharmacology, Weak areas, OSCE (may lock); **NGN tile omitted** for allied; **no ECG** (tier). | OSCE when `isOsceScenariosPubliclyEnabled` false; optional mastery previews admin-gated only. | See `reports/allied-health-gap-matrix.md`; numeric content TBD. |
| 16 | `/allied/emt` | `us-allied-core` | `ALLIED / allied-health` | Flashcards, Practice exams, Labs, Med calc, Pharmacology, Weak areas, OSCE (may lock); **NGN tile omitted** for allied; **no ECG** (tier). | OSCE when `isOsceScenariosPubliclyEnabled` false; optional mastery previews admin-gated only. | See `reports/allied-health-gap-matrix.md`; numeric content TBD. |
| 17 | `/allied/sonography` | `us-allied-core` | `ALLIED / allied-health` | Flashcards, Practice exams, Labs, Med calc, Pharmacology, Weak areas, OSCE (may lock); **NGN tile omitted** for allied; **no ECG** (tier). | OSCE when `isOsceScenariosPubliclyEnabled` false; optional mastery previews admin-gated only. | See `reports/allied-health-gap-matrix.md`; numeric content TBD. |
| 18 | `/allied/radiography` | `us-allied-core` | `ALLIED / allied-health` | Flashcards, Practice exams, Labs, Med calc, Pharmacology, Weak areas, OSCE (may lock); **NGN tile omitted** for allied; **no ECG** (tier). | OSCE when `isOsceScenariosPubliclyEnabled` false; optional mastery previews admin-gated only. | See `reports/allied-health-gap-matrix.md`; numeric content TBD. |
| 19 | `/allied/lab-assistant` | `us-allied-core` | `ALLIED / allied-health` | Flashcards, Practice exams, Labs, Med calc, Pharmacology, Weak areas, OSCE (may lock); **NGN tile omitted** for allied; **no ECG** (tier). | OSCE when `isOsceScenariosPubliclyEnabled` false; optional mastery previews admin-gated only. | See `reports/allied-health-gap-matrix.md`; numeric content TBD. |


### Count columns (6–14) — honest status

| Metric | How to obtain | Allied (`us-allied-core`) |
|--------|---------------|---------------------------|
| Lessons | `count-allied-pathway-lessons.ts` / Prisma | **TBD** |
| Flashcards (decks) | `flashcardDeck` count by pathwayId | **TBD** |
| Practice Qs | Sum `exam_questions` for ALLIED keys + pool rules | **TBD** |
| CAT Qs | CAT-complete pool script (`audit-exam-question-bank`) | **TBD** |
| Scenario / case study | Scenario catalog + flags | **TBD** |
| Lab / diagnostic drill | Study tool routes present from hub | **TBD** volume |
| Med calc | Study tool route present | **TBD** volume |
| Skill refresher | New-grad-only strip on RN hubs; not separate allied card | N/A (allied uses core tools) |

### Column 15 — Study plan / readiness / progress

- Hub exposes **Progress** + **Exam plan** cards linking to `/app/account/progress` and `/app/exam-plan` (with allied profession query when set).
- Pathway readiness engine: `pathway-readiness-config.ts` uses **SIMULATION** for `ca-allied-core` / `us-allied-core`.
- **Placeholder vs wired:** subscriber-only surfaces; treat full behavioral audit as **TBD** outside this doc.

### Column 16 — SEO metadata

- `/allied/[career]/page.tsx`: `generateMetadata` → title from `h1`, description from registry, canonical `/allied/{professionKey}`, OpenGraph.
- Global hub: see `allied/allied-health/page.tsx` (dynamic metadata via loaders).

### Column 17 — Theme support

- Hub premium grids: semantic token surfaces (`premiumSectionSurfaceClass`, `alliedPremiumAccentChartVar`).

### Column 18 — Broken / placeholder copy (sample)

- Registry strings avoid outcome guarantees; spot-check: `grep -r "pass guarantee" nursenest-core/src/lib/allied` (expect empty).
- Allied mastery module pages are **admin-preview only** (`getCurrentAlliedMasteryModuleAccess`).

### Column 19 — Broken links / admin leakage

- Premium module hrefs resolve via `resolvePremiumCardHref`; guest CTAs use login callback.
- **Public HTML must not expose `/admin` in the premium grid** — enforced in contract tests + E2E.
- Note: `allied/[career]/modules/[moduleSlug]` is admin-preview gated (`notFound` for normal users); footer link to `/admin/modules/allied` only renders when admin preview access succeeds.

## Stripe / product

- Tier code: **`ALLIED`** (`TierCode.ALLIED` in Prisma). Single product tier row for both regional cores in registry data.

## Routes discovered (E2E)

- `tests/e2e/public/allied-health-hubs.spec.ts` builds URLs from `ALLIED_PROFESSION_KEYS` + `/allied/allied-health` + `/us/allied/allied-health`.
