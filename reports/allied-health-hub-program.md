# Allied Health hub — program inventory & minimum standards

_Generated: 2026-05-09T21:51:41.017Z (UTC)_

## Executive summary

- **Pathways:** `us-allied-core`, `ca-allied-core` share one marketing occupation model; public occupation hubs live at `/allied/{professionKey}` with canonical lessons/questions under `/allied/allied-health/...?alliedProfession=` when scoped.
- **Counts:** `npm run report:allied-hub` appends **Part 3** with bounded Prisma inventory (see `src/lib/allied/allied-hub-inventory-counts.server.ts`) when `DATABASE_URL` is available; cells show `unavailable (reason)` instead of invented numbers.
- **Figma / UI parity:** See `reports/allied-health-figma-ui-plan.md` for frames, tokens, and acceptance criteria before large UI refactors.

## Part 2 — Minimum content (per occupation)

| Dimension | Minimum | Notes |
|-----------|---------|--------|
| lessons | 60 | Enforce via content pipeline + QA; CAT row applies when occupation unlocks adaptive marketing card |
| flashcards | 300 | Enforce via content pipeline + QA; CAT row applies when occupation unlocks adaptive marketing card |
| practiceQuestions | 300 | Enforce via content pipeline + QA; CAT row applies when occupation unlocks adaptive marketing card |
| practiceExamsOrSets | 2 | Enforce via content pipeline + QA; CAT row applies when occupation unlocks adaptive marketing card |
| catSessionsIfSupported | 1 | Enforce via content pipeline + QA; CAT row applies when occupation unlocks adaptive marketing card |
| scenarioCaseStudyQuestions | 20 | Enforce via content pipeline + QA; CAT row applies when occupation unlocks adaptive marketing card |
| skillsRefresherItems | 25 | Enforce via content pipeline + QA; CAT row applies when occupation unlocks adaptive marketing card |
| labDiagnosticItems | 20 | Enforce via content pipeline + QA; CAT row applies when occupation unlocks adaptive marketing card |
| medCalculationItems | 20 | Enforce via content pipeline + QA; CAT row applies when occupation unlocks adaptive marketing card |
| readinessProgressStudyPlanModules | 1 | Enforce via content pipeline + QA; CAT row applies when occupation unlocks adaptive marketing card |
| weakStrongAreaReportingModules | 1 | Enforce via content pipeline + QA; CAT row applies when occupation unlocks adaptive marketing card |

## Occupation-specific content expectations (curated)

### mlt

- Labs & diagnostics reasoning
- Specimen handling & chain-of-custody
- Quality control
- Hematology / chemistry / microbiology framing
- Transfusion safety awareness
- Pre-analytical & analytical error prevention

### lab-assistant

- Specimen collection
- Pre-analytical handling
- QC awareness
- Safety & escalation

### paramedic

- Emergency assessment
- Trauma & medical priorities
- Airway & ventilation judgment
- Field pharmacology & med calculations
- ECG only where profession-appropriate (not RN-only depth)
- Scenario-heavy prioritization

### emt

- Scene safety
- Primary assessment
- Airway basics
- Transport decisions
- Scope boundaries

### respiratory

- Airway & ventilation
- ABGs & oxygen therapy
- Cardiopulmonary diagnostics
- Equipment & escalation
- Scenario drills

### physiotherapy

- Anatomy & mobility
- MSK assessment
- Rehab progression
- Safety & red flags
- Case scenarios

### pta

- Therapeutic exercise
- Mobility assistance
- Delegation within PTA scope
- Safety judgment

### occupational-therapy

- Functional assessment
- ADLs & occupation-based plans
- Cognitive / perceptual screening
- Assistive devices & training
- Case scenarios

### ota

- Activity analysis
- ADLs
- Safety sequencing
- Documentation support within OTA scope

### social-work

- Ethics & boundaries
- Crisis intervention framing
- Documentation
- Community resources & case management
- Scenario questions

### psychotherapy

- Therapeutic communication
- Ethics & risk assessment
- Modalities & formulation
- Documentation
- Case scenarios

### mental-health-addictions

- Safety
- De-escalation
- Boundaries
- Documentation
- Community linkage

### psw-hca

- Safety & infection control
- ADLs & mobility
- Communication with dignity
- Documentation & reporting
- Care scenarios

### community-health-worker

- Outreach
- Teaching
- Navigation
- Ethics
- Population-health basics

### pharmacy-tech

- Calculations
- High-alert meds
- Sterile technique
- Regulatory edges

### medical-assistant

- Clinical workflows
- Vitals
- Office safety
- Scope & delegation

### dental-assistant

- Infection control
- Chairside flow
- Radiography basics
- Communication

### dental-hygiene

- Periodontal assessment
- Prevention teaching
- Radiographic judgment
- Ethics

### dietetic-technician

- MNT support
- Screening
- Documentation
- Food-service safety

### imaging

- ALARA
- Contrast safety
- Positioning
- Protocol communication

### sonography

- Image optimization
- Safety
- Anatomy correlation
- Handoffs

### radiography

- Positioning
- Contrast safety
- Physics judgment
- Patient communication

## Part 1 — Inventory table (registry + routing + modules)

| Occupation key | Public hub route | Pathway ID | Exam code | Hub category |
|----------------|------------------|------------|-----------|----------------|
| `pta` | `/allied/pta` | `us-allied-core` | `allied-health` | therapy |
| `ota` | `/allied/ota` | `us-allied-core` | `allied-health` | therapy |
| `occupational-therapy` | `/allied/occupational-therapy` | `us-allied-core` | `allied-health` | therapy |
| `physiotherapy` | `/allied/physiotherapy` | `us-allied-core` | `allied-health` | therapy |
| `psychotherapy` | `/allied/psychotherapy` | `us-allied-core` | `allied-health` | support |
| `mlt` | `/allied/mlt` | `us-allied-core` | `allied-health` | lab |
| `imaging` | `/allied/imaging` | `us-allied-core` | `allied-health` | lab |
| `respiratory` | `/allied/respiratory` | `us-allied-core` | `allied-health` | acute |
| `paramedic` | `/allied/paramedic` | `us-allied-core` | `allied-health` | acute |
| `pharmacy-tech` | `/allied/pharmacy-tech` | `us-allied-core` | `allied-health` | clinical |
| `social-work` | `/allied/social-work` | `us-allied-core` | `allied-health` | support |
| `psw-hca` | `/allied/psw-hca` | `us-allied-core` | `allied-health` | support |
| `community-health-worker` | `/allied/community-health-worker` | `us-allied-core` | `allied-health` | support |
| `mental-health-addictions` | `/allied/mental-health-addictions` | `us-allied-core` | `allied-health` | support |
| `medical-assistant` | `/allied/medical-assistant` | `us-allied-core` | `allied-health` | clinical |
| `dental-assistant` | `/allied/dental-assistant` | `us-allied-core` | `allied-health` | clinical |
| `dental-hygiene` | `/allied/dental-hygiene` | `us-allied-core` | `allied-health` | clinical |
| `dietetic-technician` | `/allied/dietetic-technician` | `us-allied-core` | `allied-health` | clinical |
| `emt` | `/allied/emt` | `us-allied-core` | `allied-health` | acute |
| `sonography` | `/allied/sonography` | `us-allied-core` | `allied-health` | lab |
| `radiography` | `/allied/radiography` | `us-allied-core` | `allied-health` | lab |
| `lab-assistant` | `/allied/lab-assistant` | `us-allied-core` | `allied-health` | lab |

Global chooser: `/allied/allied-health`, canonical lessons base: `/allied/allied-health/lessons` (+ `alliedProfession` query).

### Premium module matrix (marketing grid, deterministic flags)

Flags: `clinicalScenariosPublic=false`, `oscePublic=true` (align with contract tests / feature flags).

| Occupation | Study tools (keys) | Readiness | Locked study tools | CAT card unlocked (marketing) |
|------------|--------------------|------------|--------------------|----------------------------------|
| `pta` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `pathway_cat`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `clinical_cases` | yes |
| `ota` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `pathway_cat`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `med_calc`, `skills_refresher`, `clinical_cases` | yes |
| `occupational-therapy` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `pathway_cat`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `clinical_cases` | yes |
| `physiotherapy` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `pathway_cat`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `clinical_cases` | yes |
| `psychotherapy` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `labs`, `med_calc`, `pharmacology`, `skills_refresher`, `clinical_cases` | locked / de-emphasized |
| `mlt` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `pathway_cat`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `clinical_cases` | yes |
| `imaging` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `pathway_cat`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `clinical_cases` | yes |
| `respiratory` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `pathway_cat`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `clinical_cases` | yes |
| `paramedic` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `pathway_cat`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `clinical_cases` | yes |
| `pharmacy-tech` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `pathway_cat`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `clinical_cases` | yes |
| `social-work` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `labs`, `med_calc`, `pharmacology`, `skills_refresher`, `clinical_cases` | locked / de-emphasized |
| `psw-hca` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `labs`, `med_calc`, `pharmacology`, `skills_refresher`, `clinical_cases` | locked / de-emphasized |
| `community-health-worker` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `labs`, `med_calc`, `pharmacology`, `skills_refresher`, `clinical_cases` | locked / de-emphasized |
| `mental-health-addictions` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `labs`, `med_calc`, `pharmacology`, `skills_refresher`, `clinical_cases` | locked / de-emphasized |
| `medical-assistant` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `pathway_cat`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `clinical_cases` | yes |
| `dental-assistant` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `pathway_cat`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `med_calc`, `skills_refresher`, `clinical_cases` | yes |
| `dental-hygiene` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `pathway_cat`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `clinical_cases` | yes |
| `dietetic-technician` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `pathway_cat`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `clinical_cases` | yes |
| `emt` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `pathway_cat`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `clinical_cases` | yes |
| `sonography` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `pathway_cat`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `clinical_cases` | yes |
| `radiography` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `pathway_cat`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `clinical_cases` | yes |
| `lab-assistant` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce`, `skills_refresher`, `pathway_cat`, `clinical_cases`, `allied_career_resources` | `progress`, `exam_plan` | `pharmacology`, `clinical_cases` | yes |

### Inventory columns — DB-backed (see Part 3)

- Part 3 attaches live counts and compliance when the report script runs with database access.
- Deferred from automation: broken link crawl, DOM admin-leak scan, theme VR, Playwright evidence (see allied-health program report).

## Allied pathway registry reference

- Primary inventory pathway: `us-allied-core`
- See `src/lib/allied/allied-professions-registry.ts` for the authoritative occupation list.

## Part 3 — Bounded inventory (DB-backed, per occupation)

Counts use `pathwayExamQuestionMarketingHubInventoryWhere(us-allied-core)` intersected with `prismaWhereForAlliedProfessionExamQuestions` where the legacy career/tag map exists. Flashcards: published ALLIED cards in decks tagged with the `professionKey` slug **or** rows whose `examQuestionId` matches exam questions in the scoped pool (bounded `id IN (...)` materialization; see `MAX_EXAM_QUESTION_IDS_FOR_FLASHCARD_POOL`). Lessons: published `PathwayLesson` with `alliedProfessionKey` OR `topicSlug ∈ topicSlugsIn`; when `allied_profession_key` is missing from the database, counts fall back to topic-slug scope only (occupations without `topicSlugsIn` then surface as DB errors / unavailable).

| Occupation | lessons | flashcards | practice Q | CAT adaptive Q | scenario Q | lab/diag Q | med-calc Q | skill refresher (registry) | practice exams | readiness UI | weak/strong UI |
|------------|---------|------------|-----------|----------------|------------|------------|------------|---------------------------|----------------|--------------|----------------|
| `pta` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `ota` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `occupational-therapy` | 0 | 0 | unavailable (no prismaWhereForAlliedProfessionExamQuestions scope — shared allied pool not attributable to this occupation) | unavailable (no prismaWhereForAlliedProfessionExamQuestions scope — cannot count adaptive items for this occupation) | unavailable (no attributable exam-question scope for scenarios) | unavailable (no attributable exam-question scope for lab/diagnostic tags) | unavailable (no attributable exam-question scope for med-calc tags) | 0 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `physiotherapy` | 0 | 0 | unavailable (no prismaWhereForAlliedProfessionExamQuestions scope — shared allied pool not attributable to this occupation) | unavailable (no prismaWhereForAlliedProfessionExamQuestions scope — cannot count adaptive items for this occupation) | unavailable (no attributable exam-question scope for scenarios) | unavailable (no attributable exam-question scope for lab/diagnostic tags) | unavailable (no attributable exam-question scope for med-calc tags) | 0 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `psychotherapy` | 0 | 0 | unavailable (no prismaWhereForAlliedProfessionExamQuestions scope — shared allied pool not attributable to this occupation) | unavailable (CAT marketing surface locked on hub — adaptive pool not evaluated for this occupation in marketing QA) | unavailable (no attributable exam-question scope for scenarios) | unavailable (no attributable exam-question scope for lab/diagnostic tags) | unavailable (no attributable exam-question scope for med-calc tags) | 0 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `mlt` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `imaging` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `respiratory` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 5 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `paramedic` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 6 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `pharmacy-tech` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `social-work` | 0 | 0 | unavailable (no prismaWhereForAlliedProfessionExamQuestions scope — shared allied pool not attributable to this occupation) | unavailable (CAT marketing surface locked on hub — adaptive pool not evaluated for this occupation in marketing QA) | unavailable (no attributable exam-question scope for scenarios) | unavailable (no attributable exam-question scope for lab/diagnostic tags) | unavailable (no attributable exam-question scope for med-calc tags) | 0 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `psw-hca` | 0 | 0 | unavailable (no prismaWhereForAlliedProfessionExamQuestions scope — shared allied pool not attributable to this occupation) | unavailable (CAT marketing surface locked on hub — adaptive pool not evaluated for this occupation in marketing QA) | unavailable (no attributable exam-question scope for scenarios) | unavailable (no attributable exam-question scope for lab/diagnostic tags) | unavailable (no attributable exam-question scope for med-calc tags) | 0 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `community-health-worker` | 0 | 0 | unavailable (no prismaWhereForAlliedProfessionExamQuestions scope — shared allied pool not attributable to this occupation) | unavailable (CAT marketing surface locked on hub — adaptive pool not evaluated for this occupation in marketing QA) | unavailable (no attributable exam-question scope for scenarios) | unavailable (no attributable exam-question scope for lab/diagnostic tags) | unavailable (no attributable exam-question scope for med-calc tags) | 0 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `mental-health-addictions` | 0 | 0 | unavailable (no prismaWhereForAlliedProfessionExamQuestions scope — shared allied pool not attributable to this occupation) | unavailable (CAT marketing surface locked on hub — adaptive pool not evaluated for this occupation in marketing QA) | unavailable (no attributable exam-question scope for scenarios) | unavailable (no attributable exam-question scope for lab/diagnostic tags) | unavailable (no attributable exam-question scope for med-calc tags) | 0 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `medical-assistant` | 0 | 0 | unavailable (no prismaWhereForAlliedProfessionExamQuestions scope — shared allied pool not attributable to this occupation) | unavailable (no prismaWhereForAlliedProfessionExamQuestions scope — cannot count adaptive items for this occupation) | unavailable (no attributable exam-question scope for scenarios) | unavailable (no attributable exam-question scope for lab/diagnostic tags) | unavailable (no attributable exam-question scope for med-calc tags) | 0 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `dental-assistant` | 0 | 0 | unavailable (no prismaWhereForAlliedProfessionExamQuestions scope — shared allied pool not attributable to this occupation) | unavailable (no prismaWhereForAlliedProfessionExamQuestions scope — cannot count adaptive items for this occupation) | unavailable (no attributable exam-question scope for scenarios) | unavailable (no attributable exam-question scope for lab/diagnostic tags) | unavailable (no attributable exam-question scope for med-calc tags) | 0 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `dental-hygiene` | 0 | 0 | unavailable (no prismaWhereForAlliedProfessionExamQuestions scope — shared allied pool not attributable to this occupation) | unavailable (no prismaWhereForAlliedProfessionExamQuestions scope — cannot count adaptive items for this occupation) | unavailable (no attributable exam-question scope for scenarios) | unavailable (no attributable exam-question scope for lab/diagnostic tags) | unavailable (no attributable exam-question scope for med-calc tags) | 0 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `dietetic-technician` | 0 | 0 | unavailable (no prismaWhereForAlliedProfessionExamQuestions scope — shared allied pool not attributable to this occupation) | unavailable (no prismaWhereForAlliedProfessionExamQuestions scope — cannot count adaptive items for this occupation) | unavailable (no attributable exam-question scope for scenarios) | unavailable (no attributable exam-question scope for lab/diagnostic tags) | unavailable (no attributable exam-question scope for med-calc tags) | 0 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `emt` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `sonography` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `radiography` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |
| `lab-assistant` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | unavailable (no Prisma practice-exam set entity scoped by alliedProfessionKey in this inventory) | progress+plan | not on hub grid |

### Minimum compliance (vs `ALLIED_MINIMUM_CONTENT_PER_OCCUPATION`)

| Occupation | lessons | flashcards | practice Q | CAT adaptive | scenario Q | lab/diag | med-calc | skills (registry) | practice sets | readiness | weak/strong |
|------------|---------|------------|------------|--------------|------------|--------|--------|------------------|---------------|-----------|-------------|
| `pta` | below | below | below | below | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `ota` | below | below | below | below | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `occupational-therapy` | below | below | below | below | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `physiotherapy` | below | below | below | below | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `psychotherapy` | below | below | below | n/a (CAT locked) | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `mlt` | below | below | below | below | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `imaging` | below | below | below | below | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `respiratory` | below | below | below | below | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `paramedic` | below | below | below | below | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `pharmacy-tech` | below | below | below | below | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `social-work` | below | below | below | n/a (CAT locked) | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `psw-hca` | below | below | below | n/a (CAT locked) | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `community-health-worker` | below | below | below | n/a (CAT locked) | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `mental-health-addictions` | below | below | below | n/a (CAT locked) | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `medical-assistant` | below | below | below | below | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `dental-assistant` | below | below | below | below | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `dental-hygiene` | below | below | below | below | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `dietetic-technician` | below | below | below | below | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `emt` | below | below | below | below | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `sonography` | below | below | below | below | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `radiography` | below | below | below | below | below | below | below | below | below (no inventory) | meets | below (tile absent) |
| `lab-assistant` | below | below | below | below | below | below | below | below | below (no inventory) | meets | below (tile absent) |
