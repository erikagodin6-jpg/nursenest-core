# Allied Health hub — program inventory & minimum standards

_Generated: 2026-05-09T20:21:09.491Z (UTC)_

## Executive summary

- **Pathways:** `us-allied-core`, `ca-allied-core` share one marketing occupation model; public occupation hubs live at `/allied/{professionKey}` with canonical lessons/questions under `/allied/allied-health/...?alliedProfession=` when scoped.
- **Counts:** Lesson / flashcard / practice / scenario / lab / med-calc volumes require **bounded DB or inventory API** reads — this report lists **TODO** until wired (no fake numbers).
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
| `pta` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | — | yes |
| `ota` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | `med_calc` | yes |
| `occupational-therapy` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | — | yes |
| `physiotherapy` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | — | yes |
| `psychotherapy` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | `labs`, `med_calc`, `pharmacology` | locked / de-emphasized |
| `mlt` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | — | yes |
| `imaging` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | — | yes |
| `respiratory` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | — | yes |
| `paramedic` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | — | yes |
| `pharmacy-tech` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | — | yes |
| `social-work` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | `labs`, `med_calc`, `pharmacology` | locked / de-emphasized |
| `psw-hca` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | `labs`, `med_calc`, `pharmacology` | locked / de-emphasized |
| `community-health-worker` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | `labs`, `med_calc`, `pharmacology` | locked / de-emphasized |
| `mental-health-addictions` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | `labs`, `med_calc`, `pharmacology` | locked / de-emphasized |
| `medical-assistant` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | — | yes |
| `dental-assistant` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | `med_calc` | yes |
| `dental-hygiene` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | — | yes |
| `dietetic-technician` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | — | yes |
| `emt` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | — | yes |
| `sonography` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | — | yes |
| `radiography` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | — | yes |
| `lab-assistant` | `flashcards`, `practice_tests`, `labs`, `med_calc`, `pharmacology`, `weak_areas`, `osce` | `progress`, `exam_plan` | `pharmacology` | yes |

### Inventory columns deferred to DB / bounded queries (TODO)

- Lesson count (pathway + `alliedProfession` scope)
- Flashcard count
- Practice question count
- CAT item bank / session availability
- Scenario / case-study inventory
- Lab/diagnostic & med-calc tagged items
- Skill refresher inventory (may map to study-tool routes vs dedicated catalog)
- Placeholder / broken copy scan
- Broken link crawl (bounded)
- Admin/staff href leakage in public DOM
- SEO metadata validation per route
- Theme regression snapshots (Ocean / Midnight / Blossom)
- Figma vs implementation visual diff (manual or VR)
- Mobile responsiveness & dark-mode polish scores

## Allied pathway registry reference

- Primary inventory pathway: `us-allied-core`
- See `src/lib/allied/allied-professions-registry.ts` for the authoritative occupation list.
