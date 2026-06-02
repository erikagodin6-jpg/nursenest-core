# MLT / MLS allied tier — readiness audit

_Pair with numeric inventory in [`mlt-tier-readiness-counts.generated.md`](./mlt-tier-readiness-counts.generated.md) (run `npm run report:mlt-tier-readiness` from `nursenest-core/`)._

## 1. Allied tier registry support

| Area | Status |
| --- | --- |
| Profession registry | **`mlt`** is registered in `allied-professions-registry.ts` with pathway `us-allied-core`, hub category **lab**, segment `mlt-exam-prep`, and hero copy for MLS/MLT exam prep. |
| Route aliases | **`medical-lab-technology` → `mlt`** resolves allied slug resolution via `ALLIED_ROUTE_PROFESSION_KEY_ALIASES`. Public hubs work at `/allied/mlt` and `/allied/medical-lab-technology`. |
| Exam question scope | `ALLIED_LEGACY_EXAM_QUESTION_CAREER_TYPES.mlt` maps marketing **`mlt`** → legacy **`careerType` `mlt`** (and **`lab-assistant`** overlaps into `mlt`). `prismaWhereForAlliedProfessionExamQuestions` supports profession tags `profession:mlt` / `alliedProfession:mlt`. |

**Risk:** Low — registry predates this tier program; no change to RN/RPN/NP routing.

## 2. Existing MLT routes / content / pools

| Surface | Location / behavior |
| --- | --- |
| Public occupation hub | `(marketing)/allied/[career]/page.tsx` — metadata + `AlliedHealthPathwayHub` for every registered profession including **mlt**. |
| Lessons / questions / CAT marketing | `/allied/allied-health/{lessons,questions,cat}?alliedProfession=mlt` (canonical allied pathway query pattern). |
| Premium landing | `/medical-laboratory-technology/specialty-modules` — gated by **`NEXT_PUBLIC_ENABLE_MLT_SPECIALTY_MARKETING`**; lists eight specialty modules and stable bank tags. |
| Practice pool | `medicalLaboratoryTechnologyExamQuestionPoolWhere()` in `allied-mlt-pool-scope.ts` — allied marketing tier + exam keys + study-bank gates + **`mlt`** profession slice; shared hub inventory excludes **`module:rt-ventilator`** and **all `module:mlt-*`** tags from **general** counts. |
| Taxonomy pillars | `ALLIED_PROFESSION_TAXONOMIES.mlt` + topic mappings in `allied-profession-taxonomy.ts`. |

**Counts:** See generated report for lessons, flashcards, published exam questions, CAT-eligible rows, question types/formats, premium-tagged slices, and diagnostic `career_type = mlt` totals.

## 3. Flashcard / practice / CAT compatibility

| Mode | Notes |
| --- | --- |
| Flashcards | Allied core decks (`tier = ALLIED`, allied pathway IDs) — **not** split per profession in DB; inventory reports shared allied deck/card totals (same pattern as RT tier readiness). |
| Practice | Shared practice runner + MLT pool when pathway + `alliedProfession=mlt` are active. |
| CAT | Eligibility follows existing **`isAdaptiveEligible`** within the MLT pool; no schema change. |

## 4. Image / exhibit / chart renderers

| Capability | Notes |
| --- | --- |
| Practice runner | `PracticeTestRunnerClient` supports MCQ/SATA/Bowtie with exhibit/media hooks (`exhibitData`, `images`). Unsupported payloads use **`practice-runner-question-support.ts`** — dev logs are loud; production uses safe fallback. |
| ECG / labs | ECG module stays **orthogonal** to MLT; lab items should reuse exhibit + token styling (no ad-hoc hex). |
| Microscopy / QC / analyzer UI | **Next slice:** attach **`module:mlt-*`** tags + standard JSON shapes; add dedicated renderers only where exhibit stack is insufficient. |

## 5. Premium module infrastructure (ECG, RT ventilator pattern)

| Pattern | MLT analogue |
| --- | --- |
| RT ventilator | Bank tag `module:rt-ventilator`, excluded from general pool via `usAlliedMarketingHubInventoryWhere`. |
| MLT specialties | Eight bank tags in `mlt-premium-modules-registry.ts`; excluded via `prismaWhereExcludeMltPremiumModuleTags()` on shared hub inventory. |
| Marketing card | Hub shows **`mlt_specialty_modules`** when **`NEXT_PUBLIC_ENABLE_MLT_SPECIALTY_MARKETING`** is true. |
| Allied mastery | Existing admin-preview **`mlt-advanced-lab-interpretation`** in `allied-mastery-modules.ts`; registry complements without replacing. |

## 6. SEO / public marketing readiness

| Item | Status |
| --- | --- |
| Occupation hub | `generateMetadata` on `/allied/[career]` uses profession **`description`** + canonical `/allied/{professionKey}`. |
| Specialty landing | Metadata keys **`pages.mltSpecialtyModulesLanding.*`**; `marketingAlternatesSharedPage` + **index,follow** when route is enabled. |
| Learner URLs | Existing private / **noindex** learner rules unchanged. |

## 7. Mobile / theme compatibility

Marketing landing uses **semantic/theme CSS variables** only. Playwright smoke includes **390×844** hub check.

## 8. Admin / content tooling

| Tool | Recommendation |
| --- | --- |
| Tag authoring | Apply **`module:mlt-*`** on `ExamQuestion.tags`; optional **`profession:mlt`** for filters. |
| Diagnostics | **`npm run report:mlt-tier-readiness`** for pool counts. |
| QA | Use allied modality audit helpers when importing image-heavy items. |

## 9. Schemas / question types

`ExamQuestion` already has `questionType`, `questionFormat`, `exhibitData`, `images`, `labs`, tags — **no migration** in this slice.

## 10. Risks / recommendations

| Risk | Mitigation |
| --- | --- |
| Sparse legacy rows | Inventory prints diagnostic **`career_type = mlt`** count; align imports with tags + career type. |
| Marketing flag off | Enable **`NEXT_PUBLIC_ENABLE_MLT_SPECIALTY_MARKETING`** in staging for QA. |
| Shared flashcard totals | Documented as **allied-wide** — do not treat as MLT-exclusive inventory without deck-level filters. |

---

### Verification commands

From **`nursenest-core/`**:

1. `npm run typecheck:critical`
2. `npm run test:homepage`
3. `npm run sitemap:validate`
4. `npm run report:mlt-tier-readiness` (requires `DATABASE_URL` for real counts)
5. `npm run test:e2e:mlt-tier` (requires `BASE_URL`)

---

### Acceptance (this delivery)

- [x] MLT **profession key**, pool WHERE, and **eight premium bank tags** documented in code.
- [x] Shared hub inventory excludes premium-tagged MLT rows from **general** allied pools (alongside RT ventilator exclusion).
- [x] Marketing landing + hub premium card hook (flagged).
- [x] Playwright smoke **`tests/e2e/mlt/mlt-tier-smoke.spec.ts`**.
