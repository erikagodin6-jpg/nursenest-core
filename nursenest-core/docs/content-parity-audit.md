# Content Parity Audit

Date: 2026-05-31
Status: Content parity and coverage expansion audit

Future content flags: `published=false`, `launchReady=false`, `adminOnly=true` until reviewed.

## Audit Standard

This audit measures educational parity from repository evidence. It separates measured inventory from planned or implied coverage.

Primary evidence reviewed:

- `src/config/pathway-readiness-snapshot.json`
- `src/content/pre-nursing/pre-nursing-registry.ts`
- `src/content/allied-mastery/generated-scaffolds.json`
- `reports/content-completeness-audit-2026-05-29.md`
- `docs/platform-completion-audit.md`
- `reports/allied-profession-completeness-audit.json`
- `reports/nursing-lesson-inventory.json`

Repository evidence shows strong architecture and partial content depth, but several content types are not consistently counted across all pathways. When no reliable count exists, this audit marks the field as "not evidenced" instead of inventing a number.

## Minimum Launch Thresholds

| Pathway | Lessons | Flashcards | Questions | Simulations |
| --- | ---: | ---: | ---: | ---: |
| RN | 500 | 10,000 | 8,000 | 250 |
| RPN / PN | 300 | 5,000 | 4,000 | 150 |
| NP certification | 250 per certification | 3,000 per certification | 2,000 per certification | Not yet standardized |
| Allied Health profession | 200 per profession | 2,500 per profession | 2,000 per profession | Not yet standardized |

## Coverage Audit By Pathway

| Pathway | Lessons | Flashcards | Questions | Cases | Simulations | Clinical Skills | Hints | Clinical Pearls | Rationales | Readiness Domains | Analytics Coverage |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- |
| RN aggregate | 390 measured in readiness snapshot; 430 in prior completeness audit | Not evidenced as reliable pathway count | 900 measured in readiness snapshot; 1,020 in prior completeness audit | 2 clinical case files detected globally | Not evidenced; prior audit shows 0 DB scenario count | 171 RN clinical skills in prior audit | Present in authored question files | Present in question/content standards; not counted | Present in authored question files | Mature core readiness engine evidence | Mature but not module-complete |
| RPN / PN aggregate | 355 measured in readiness snapshot and prior audit | Not evidenced as reliable pathway count | 730 measured in readiness snapshot and prior audit | Not evidenced by pathway | Not evidenced; prior audit shows 0 DB scenario count | 107 RPN/PN clinical skills in prior audit | Present in PN/NGN expansion patterns | Present in standards; not counted | Present in question files | Core readiness present; PN-specific proof thinner than RN | Partial |
| NP aggregate | 937 in prior completeness audit; 436 CNPLE plus US specialty counts in snapshot | Not evidenced as reliable pathway count | 2,756 in prior completeness audit; 2,756 across CNPLE and US NP snapshot | NP case files exist for CNPLE | Not evidenced as complete inventory | 71 NP clinical skills in prior audit | Present in NP-style content | Present in NP content standards; not counted | Present in question/rationale systems | Specialty readiness architecture exists; uneven by certification | Partial |
| Pre-Nursing | 27 registry modules, 114 lesson slots | Not evidenced as reliable count | Mini-assessments and review quiz exist; total not evidenced | Not applicable or not evidenced | Not required for launch target | Foundational skills not evidenced as catalog | Study hints present in requirement and some modules | Study pearls not counted | Study-tip rationale pattern partial | Readiness categories planned, not fully counted | Partial |
| Admissions | TEAS/HESI/CASPER architecture requested previously; count evidence not found in reviewed sources | Not evidenced | Not evidenced | Not evidenced | Not required for CAT | Not evidenced | Not evidenced | Not evidenced | Not evidenced | Planned only | Early |
| Allied Health aggregate | 125 lessons in prior completeness audit; CA/US core 125 in snapshot | Not evidenced as reliable count | 310 questions in prior completeness audit; CA/US core 310 in snapshot | Not evidenced | Not evidenced | 22 allied generated scaffolds detected, but not full profession catalogs | Standards exist; profession-specific count not evidenced | Standards exist; not counted | Framework exists; not consistently evidenced per profession | Profession-specific readiness planned; not complete | Partial |
| ECG | ECG lesson count not evidenced as full catalog | ECG flashcards not evidenced | 43 curated ECG questions in prior audit | ECG cases not complete; pediatric case routes exist | Deterioration/simulation coverage developing | ECG interpretation activities exist | Present in ECG question standards | Present in ECG standards | Present in ECG answer flows | ECG readiness route exists | Developing |
| Labs | Lab lesson count not evidenced as full catalog | Not evidenced | Lab question count not evidenced | Lab cases planned; not reliable count | Lab simulations not reliable count | Lab interpretation activities developing | Not evidenced as count | Lab pearls not counted | Interpretation rationale standards exist | Measurement/readiness systems exist | Mature foundation, incomplete activity coverage |
| Medication Math | 10 lessons, 10 categories, 50 questions, 50 flashcards in prior audit | 50 in prior audit | 50 in prior audit | Not applicable | Not evidenced | Calculation activities exist | Not evidenced as count | Not evidenced as count | Not evidenced as count | Partial | Partial |
| Clinical Skills | Skill catalog evidence exists; 221 total clinical skills in prior audit | Not evidenced | Not evidenced | Skill scenarios not separately counted | Not evidenced as simulation inventory | 221 total; RN 171, RPN/PN 107, NP 71 | Not evidenced | Not evidenced | Not evidenced | Competency/readiness integration developing | Partial |
| Pharmacology | 20 categories and 100 medication mentions in prior audit | Not evidenced | Not evidenced as persisted class-level bank | Not evidenced | Not evidenced | Medication administration links exist | Not evidenced | Not evidenced | Not evidenced | Mastery profile planned; incomplete | Developing |

## Minimum Threshold Gap Analysis

| Pathway | Current Count Evidence | Minimum Threshold | Gap |
| --- | --- | --- | --- |
| RN lessons | 390 snapshot aggregate | 500 | 110 lessons |
| RN flashcards | Not reliably evidenced | 10,000 | Full count audit required before gap can be numeric |
| RN questions | 900 snapshot aggregate | 8,000 | 7,100 questions |
| RN simulations | Not reliably evidenced | 250 | Full inventory required; prior report found no scored DB simulation baseline |
| RPN/PN lessons | 355 snapshot aggregate | 300 | Meets minimum by aggregate count |
| RPN/PN flashcards | Not reliably evidenced | 5,000 | Full count audit required before gap can be numeric |
| RPN/PN questions | 730 snapshot aggregate | 4,000 | 3,270 questions |
| RPN/PN simulations | Not reliably evidenced | 150 | Full inventory required |
| CNPLE lessons | 436 snapshot | 250 | Meets minimum |
| CNPLE questions | 1,496 snapshot | 2,000 | 504 questions |
| US FNP lessons | 91 snapshot | 250 | 159 lessons |
| US FNP questions | 280 snapshot | 2,000 | 1,720 questions |
| US AGPCNP lessons | 110 snapshot | 250 | 140 lessons |
| US AGPCNP questions | 260 snapshot | 2,000 | 1,740 questions |
| US PMHNP lessons | 105 snapshot | 250 | 145 lessons |
| US PMHNP questions | 250 snapshot | 2,000 | 1,750 questions |
| US WHNP lessons | 100 snapshot | 250 | 150 lessons |
| US WHNP questions | 240 snapshot | 2,000 | 1,760 questions |
| US PNP-PC lessons | 95 snapshot | 250 | 155 lessons |
| US PNP-PC questions | 230 snapshot | 2,000 | 1,770 questions |
| Allied lessons | 125 aggregate in prior audit | 200 per profession | Per-profession gap remains large; aggregate does not prove parity |
| Allied questions | 310 aggregate in prior audit | 2,000 per profession | Per-profession gap remains large |

## System-By-System Completeness

| System | Lessons | Flashcards | Questions | Cases | Clinical Skills | Simulations | Clinical Pearls | Hints | Rationales | Completeness Finding |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cardiovascular | Present in RN topic inventory | Not reliably counted | Present | Partial | Partial | Partial | Present in standards | Present in question files | Present | Core present; simulation and flashcard counts need proof |
| Respiratory | Present in RN topic inventory | Not reliably counted | Present | Partial | Partial | Partial | Present in standards | Present in question files | Present | Core present; high-risk respiratory failure depth should expand |
| Neurological | Present in RN topic inventory | Not reliably counted | Present | Partial | Partial | Partial | Present in standards | Present | Present | Stroke and deterioration cases should expand |
| Endocrine | Present in RN topic inventory | Not reliably counted | Present | Partial | Partial | Partial | Present | Present | Present | DKA and hypoglycemia depth should expand |
| Renal | Present in RN topic inventory | Not reliably counted | Present | Partial | Partial | Partial | Present | Present | Present | Hyperkalemia and AKI cross-links should expand |
| GI | Present in RN topic inventory | Not reliably counted | Present | Partial | Partial | Partial | Present | Present | Present | GI bleed simulation coverage needs expansion |
| Musculoskeletal | Present in RN topic inventory | Not reliably counted | Present | Limited | Partial | Limited | Present | Present | Present | Lower priority than high-risk systems |
| Immune | Present through infection/sepsis topics | Not reliably counted | Present | Partial | Partial | Partial | Present | Present | Present | Sepsis depth high priority |
| Mental Health | Present in RN topic inventory | Not reliably counted | Present | Limited | Partial | Limited | Present | Present | Present | Need specialty case and escalation depth |
| Maternity | Present in RN topic inventory | Not reliably counted | Present | Limited | Partial | Limited | Present | Present | Present | Maternal emergencies need full learning loop |
| Pediatrics | Present in RN topic inventory | Not reliably counted | Present | Limited | Partial | Limited | Present | Present | Present | Pediatric emergencies need full learning loop |
| Emergency | Present via shock, sepsis, safety topics | Not reliably counted | Present | Partial | Partial | Developing | Present | Present | Present | Simulation breadth is a major gap |
| Critical Care | Developing through ECG/labs/pharm | Not reliably counted | Partial | Partial | Partial | Developing | Present | Present | Present | CCRN-level depth remains future/draft |
| Leadership | Present in RN topic inventory | Not reliably counted | Present | Limited | Partial | Limited | Present | Present | Present | Professional practice depth should expand |
| Pharmacology | 20 categories detected | Not reliably counted | Partial | Limited | Medication administration links | Limited | Not counted | Not counted | Not counted | One of the largest current maturity gaps |

## Professional Practice Content

Professional practice content exists but should be treated as a parity priority because it differentiates NurseNest from question-bank-only competitors.

| Topic | Current Evidence | Gap |
| --- | --- | --- |
| Delegation | RN topic inventory includes Leadership & Delegation; questions exist | Needs deeper PN/RPN, RN, New Grad, and allied scope-specific banks |
| Documentation | Present in New Grad/leadership roadmaps and scattered content | Needs dedicated lessons, questions, simulations, and report-card signals |
| Communication | Present in pre-nursing registry and professional standards | Needs scenario depth and specialty escalation scripts |
| Conflict Resolution | Planned in leadership and educator roadmaps | Needs full content bank |
| Ethics | Present in pre-nursing ethics/legal module | Needs exam and practice scenario expansion |
| Professionalism | Present in standards | Needs longitudinal competency tracking |
| Leadership | Present in RN topic inventory | Needs dedicated leadership and management bank |
| Patient Advocacy | Present in standards | Needs cases and simulations |
| Quality Improvement | Planned in leadership content | Needs lessons and cases |
| Risk Management | Planned in leadership content | Needs documentation and safety scenarios |
| Patient Safety | Strong cross-platform theme | Needs simulation and analytics parity |

## High-Risk Clinical Topic Coverage

| Topic | Required Complete Loop | Current Finding |
| --- | --- | --- |
| Sepsis | Lesson, flashcards, questions, case, simulation, clinical skill | Lessons/questions present; simulation and flashcard count not proven |
| Shock | Lesson, flashcards, questions, case, simulation, clinical skill | Lessons/questions present; simulation depth incomplete |
| ACS | Lesson, flashcards, questions, case, simulation, clinical skill | Present in topic inventory; ECG/case fidelity needs expansion |
| Stroke | Lesson, flashcards, questions, case, simulation, clinical skill | Present; simulation/case depth incomplete |
| Respiratory Failure | Lesson, flashcards, questions, case, simulation, clinical skill | Present across respiratory/ABG; simulation depth incomplete |
| DKA | Lesson, flashcards, questions, case, simulation, clinical skill | Present in endocrine patterns; loop completion not proven |
| Hyperkalemia | Lesson, flashcards, questions, case, simulation, clinical skill | Present in potassium/ECG themes; ECG deterioration needs expansion |
| GI Bleed | Lesson, flashcards, questions, case, simulation, clinical skill | Present in blog/topic content; full learning loop not proven |
| Trauma | Lesson, flashcards, questions, case, simulation, clinical skill | Limited in current core; stronger in future CEN/paramedic plans |
| Maternal Emergencies | Lesson, flashcards, questions, case, simulation, clinical skill | Present maternity topic; emergency loop not proven |
| Pediatric Emergencies | Lesson, flashcards, questions, case, simulation, clinical skill | Present pediatrics topic; emergency loop not proven |

## Clinical Reasoning Parity

| Pathway | Recognition | Interpretation | Prioritization | Intervention | Evaluation | Escalation | Finding |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RN | Strong | Strong | Strong | Moderate | Moderate | Moderate | Best current parity, but simulations and evaluation loops need expansion |
| RPN / PN | Moderate | Moderate | Moderate | Moderate | Partial | Partial | Needs PN-scope escalation and delegation depth |
| NP | Moderate | Moderate | Moderate | Partial | Partial | Partial | CNPLE stronger than US specialty certification pathways |
| Pre-Nursing | Foundational | Foundational | Early | Early | Early | Not primary | Appropriate for pathway, but needs more practice questions |
| Admissions | Early | Early | Early | Not primary | Not primary | Not primary | TEAS/HESI/CASPER need first-class banks |
| Allied Health | Early | Early | Early | Early | Early | Early | Profession-specific reasoning is the main gap |
| ECG | Strong recognition direction | Moderate | Moderate | Developing | Developing | Developing | Clinical fidelity and deterioration pathways must expand |
| Labs | Moderate | Strong direction | Developing | Developing | Developing | Developing | Needs more active cases and simulations |
| Medication Math | Moderate | Moderate | Moderate | Moderate | Partial | Low | Needs more scenarios and safety rationales |
| Clinical Skills | Moderate | Moderate | Moderate | Moderate | Developing | Developing | Needs competency-based simulations |
| Pharmacology | Developing | Developing | Developing | Developing | Developing | Developing | Needs class-level content and medication safety analytics |

## Recommendations

1. Finish numeric content instrumentation for flashcards, cases, simulations, hints, pearls, and rationales by pathway.
2. Prioritize RN question expansion, RPN/PN question expansion, and NP specialty depth before launching new products.
3. Build complete high-risk clinical topic loops before adding lower-priority topics.
4. Treat allied health as per-profession products, not one aggregate pathway.
5. Use simulation coverage as the main next maturity lever because it is the weakest high-value content type across ecosystems.

