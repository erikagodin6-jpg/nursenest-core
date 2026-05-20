# New Grad hub — inventory, minimums, and QA program

Generated: 2026-05-09T19:50:27.552Z

## Part 1 — Pathway inventory (source: exam registry + navigation constants)

| Public hub route | Pathway ID | Exam code | Exam key | Stripe tier |
| --- | --- | --- | --- | --- |
| /us/rn/new-grad-transition | us-rn-new-grad-transition | new-grad-transition | NEW_GRAD_TRANSITION | NEW_GRAD |
| /us/new-grad (marketing shell) | *(lessons/questions/CAT resolve to us-rn-new-grad-transition)* | — | — | — |
| /canada/new-grad (marketing shell) | *(CA mega-menu destinations use US transition pathway for CAT; lessons beside RN hub per region policy)* | — | — | — |

### Premium module cards (transition hub, guest flags: scenarios off / OSCE off)

- **Study tools:** flashcards, practice_tests, labs, med_calc, pharmacology, ngn_tools, weak_areas, osce
- **Readiness & progress:** progress, exam_plan
- **New graduate strip:** transition, clinical_judgment, new_grad_pathway_cat, skills_refresher

When scenarios/OSCE public flags are **on**, locked state may change for: `clinical_cases` (NP only), `osce`. New Grad is **not** NP — `clinical_cases` never appears.

### Gated vs public-safe modules

- **Public marketing URLs:** transition lessons, questions, CAT landing, and new-grad strip cards with `wrapGuestWithLoginCallback: false` stay on marketing hosts.
- **Subscriber app surfaces:** flashcards, practice exams, labs, med calc, weak areas, medication drills use `/login?callbackUrl=` for guests (no admin/staff hrefs).
- **OSCE:** Tile remains visible for nursing pathways; when the public OSCE flag is off, `resolvePremiumCardHref` keeps locked navigation safe (`/` or login callback per card).

### Counts from checked-in catalog (not live DB)

| Metric | Value | Notes |
| --- | ---: | --- |
| Lessons in `new-grad-transition-catalog.json` | 40 | Minimum target 60 |
| Catalog meta `totalQuestions` | 120 | Illustrative only; **live** flashcard/question/CAT pools come from Postgres + entitlement gates. Run `cd nursenest-core && npx tsx scripts/write-new-grad-hub-report.mts` with DATABASE_URL for optional Prisma augmentation (future). |

### Topic coverage expectations (content program)

Transition-to-practice, prioritization/delegation, medication safety, clinical judgment, deterioration, shift scenarios, SBAR, documentation, safety/risk, infection control, scope, time management, therapeutic communication, basic labs, med math, skills refreshers, confidence/study plan.

### SEO / theme / leakage (engineering status)

- **SEO:** Pathway `seoTitle` / `seoDescription` present on registry object: Yes.
- **Theme:** Hubs use `[data-theme]` + semantic tokens (`ExamPathwayHubPremiumModules` surfaces). E2E captures ocean + midnight + blossom where configured.
- **Admin/staff leakage:** Forbidden on public hubs — verified in Playwright (`assertNoAdminLinks` / `assertNoForbiddenPublicLinks`).

## Part 2 — Minimum content standards (targets vs catalog snapshot)

| Dimension | Required minimum | Catalog / static snapshot | Meets minimum |
| --- | ---: | ---: | --- |
| Public-facing lessons (catalog) | 60 | 40 | **No — backlog** |
| Flashcards | 300 | *DB* | *Run pool diagnostics with DATABASE_URL* |
| Practice questions | 300 | *DB* | *Run pool diagnostics with DATABASE_URL* |
| Prioritization / delegation / patient safety / NGN-style / labs / med calc / scenarios / comms — granular | see program doc | *DB / taxonomy export* | **TODO** — no fake counts in this report |

## Part 3 — Implementation backlog (explicit)

- **Lessons:** Expand `new-grad-transition-catalog.json` toward ≥60 transition lessons (batched imports per RN lesson library safety rules).
- **Pools:** Align flashcards + exam_questions + CAT readiness floors with `NEW_GRAD_MINIMUM_CONTENT` using existing bank pipelines.
- **Figma / visual cohesion:** New Grad uses the same `StudyCard` + semantic premium panels as RN hubs. Sync card hierarchy and spacing with the design system file used for marketing hubs (see `docs/ecosystem-design-system-convergence.md`); attach Figma frame links when the dedicated New Grad audit frame exists.

## Part 4 — Playwright validation

- Spec: `nursenest-core/tests/e2e/public/new-grad-hubs.spec.ts`
- Command: `cd nursenest-core && npx playwright test tests/e2e/public/new-grad-hubs.spec.ts`
- Screenshots: `nursenest-core/docs/screenshots/new-grad-e2e/`

### Premium module keys when flags ON (reference)

flashcards, practice_tests, labs, med_calc, pharmacology, ngn_tools, weak_areas, osce
