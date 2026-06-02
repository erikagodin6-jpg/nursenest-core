# Content Portfolio Classification

Date: 2026-06-01
Status: Master content portfolio management system

Source of truth: `docs/future-content-roadmap.md`, supported by `docs/high-priority-content-gaps.md`, `docs/content-investment-priority-report.md`, `docs/content-maturity-dashboard.md`, and the simulation, flashcard, ECG, pharmacology, RN, RPN/PN, and NP completion roadmaps.

Future products remain locked: `published=false`, `launchReady=false`, `visibleInNavigation=false`, `indexable=false`, `adminOnly=true`.

No content should be developed solely because a count is low. Every initiative must improve at least one of: revenue impact, learner impact, retention impact, clinical impact, institutional impact, or SEO impact.

## Portfolio Tracks

| Track | Name | Purpose | Allocation Rule |
| --- | --- | --- | --- |
| Track 1 | Revenue Protection | Protect and complete current revenue-generating RN, RPN/PN, and NP pathways | Highest priority until RN >95%, RPN/PN >95%, NP >90% |
| Track 2 | Revenue Expansion | Build adjacent monetizable products from current engines and reusable content | Begin only after core gaps are actively closing |
| Track 3 | Strategic Future Products | Prepare longer-horizon academies and institutional products | Hidden planning only until Track 1 gates are met |

## Track 1 - Revenue Protection

| Initiative | Evidence Basis | Revenue Score | Clinical Score | Retention Score | Effort Score | Portfolio Decision |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| RN parity | `RN-completion-roadmap.md`: 900/8,000 questions, 390/500 lessons | 100 | 95 | 90 | 85 | Fund immediately |
| RPN/PN parity | `RPN-completion-roadmap.md`: 730/4,000 questions, 355/300 lessons | 98 | 95 | 88 | 75 | Fund immediately |
| NP parity | `np-specialty-completion-roadmap.md`: CNPLE strongest; US NP thin | 92 | 92 | 82 | 90 | Fund after RN/RPN sprint starts |
| Flashcard instrumentation | `flashcard-governance-dashboard.md`: status counts not evidenced | 95 | 75 | 95 | 45 | Fund immediately because readiness cannot be scored without it |
| Simulation parity | `simulation-gap-analysis.md`: RN 33/250, RPN 8/150 | 94 | 100 | 95 | 90 | Fund immediately after mapping layer |
| Pharmacology parity | `pharmacology-parity-roadmap.md`: persisted class-level count not evidenced | 90 | 100 | 90 | 80 | Fund after registry instrumentation |
| ECG parity | `ecg-expansion-roadmap.md`: 43/1,000 ECG questions; 4/500 deterioration pathways | 88 | 98 | 85 | 85 | Fund as high-reuse clinical engine |
| Lab parity | `content-maturity-dashboard.md`: Labs overall 59%, no standalone simulation registry | 82 | 92 | 82 | 70 | Fund after high-risk loop mapping |

### Track 1 Ranked Roadmap

| Rank | Initiative | Why It Comes First |
| ---: | --- | --- |
| 1 | RN question bank completion | Largest current revenue surface and largest exact question gap |
| 2 | RPN/PN question bank completion | Current revenue pathway with large exact question gap and scope-risk exposure |
| 3 | Flashcard status instrumentation | Blocks honest published/draft/review readiness scoring |
| 4 | High-risk clinical loop completion | Increases exam performance, practice readiness, retention, and institutional value |
| 5 | Simulation-to-pathway mapping and expansion | Simulation is becoming a first-class readiness metric |
| 6 | CNPLE and FNP completion | Fastest NP monetization path from current evidence |
| 7 | Pharmacology registry and first-wave parity | Cross-cuts RN, RPN/PN, NP, ECG, labs, and simulation |
| 8 | ECG and lab parity | High-reuse clinical reasoning engines |

## Track 2 - Revenue Expansion

Relative TAM is directional and repo-informed; no external market sizing was performed in this pass.

| Expansion Product | Relative TAM | Content Reuse % | Institutional Potential | SEO Potential | Monetization Potential | Portfolio Decision |
| --- | --- | ---: | --- | --- | --- | --- |
| ECG Academy | High | 90% | Medium-high | High | High | Medium-term expansion after ECG parity improves |
| Clinical Skills Academy | High | 85% | Very high | Medium-high | High | Medium-term institutional expansion |
| Lab Academy | Medium-high | 90% | Medium-high | High | Medium-high | Medium-term expansion after lab registry |
| Pharmacology Academy | High | 85% | High | High | High | Medium-term expansion after pharmacology parity |
| New Graduate Residency | High | 80% | Very high | High | High | Medium-term retention and institutional expansion |

### Track 2 Ranked Roadmap

| Rank | Initiative | Rationale |
| ---: | --- | --- |
| 1 | New Graduate Residency | Strong retention and institutional promise; extends learner lifetime after exam prep |
| 2 | Clinical Skills Academy | Highest institutional fit and direct clinical competency value |
| 3 | Pharmacology Academy | Cross-pathway value and medication safety differentiator |
| 4 | ECG Academy | Strong premium differentiation, especially after ECG deterioration expansion |
| 5 | Lab Academy | High clinical reuse, but needs clearer standalone inventory first |

## Track 3 - Strategic Future Products

| Future Product | Readiness % Evidence | Commercialization Horizon | Dependencies | Content Reuse % | Portfolio Decision |
| --- | ---: | --- | --- | ---: | --- |
| CCRN | Not independently scored in current evidence set | Long-term | RN critical care, ECG, labs, pharmacology, simulations | 85% | Keep hidden; plan only |
| CEN | Not independently scored in current evidence set | Long-term | RN emergency, triage, trauma, ECG, pharmacology, simulations | 80% | Keep hidden; plan only |
| Leadership | Not independently scored in current evidence set | Medium-long | RN/RPN professional practice, documentation, delegation | 80% | Build as reusable professional-practice layer first |
| Preceptor | Not independently scored in current evidence set | Long-term | New Graduate, institutional reporting, competency model | 75% | Hidden planning only |
| Additional Allied Professions | Allied aggregate 36% in `content-maturity-dashboard.md` | Long-term | Shared core, profession-specific standards, simulations | Variable | Pause until core revenue pathways improve |

### Track 3 Ranked Roadmap

| Rank | Initiative | Rationale |
| ---: | --- | --- |
| 1 | Leadership | Most reusable across RN, RPN/PN, New Graduate, and institutional products |
| 2 | CCRN | Strong reuse from RN critical care, ECG, labs, pharmacology, and simulations |
| 3 | CEN | Strong reuse but needs broader emergency/triage foundation |
| 4 | Preceptor | Depends on New Graduate and institutional competency infrastructure |
| 5 | Additional Allied Professions | Requires profession-specific credibility; not ready for broad expansion |

## Learning Graph Prioritization

| Initiative | Lesson Reuse | Flashcard Reuse | Question Reuse | Simulation Reuse | ECG Integration | Lab Integration | Pharmacology Integration | Reuse Priority |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| High-risk clinical loops | 95 | 95 | 95 | 95 | 85 | 90 | 90 | 94 |
| Pharmacology parity | 85 | 95 | 90 | 85 | 80 | 90 | 100 | 89 |
| ECG deterioration | 80 | 85 | 85 | 95 | 100 | 70 | 80 | 86 |
| Lab interpretation | 85 | 90 | 85 | 85 | 70 | 100 | 90 | 86 |
| RN parity | 90 | 90 | 95 | 85 | 70 | 75 | 80 | 84 |
| RPN/PN parity | 80 | 85 | 90 | 80 | 55 | 65 | 75 | 76 |
| NP parity | 80 | 85 | 90 | 75 | 70 | 75 | 90 | 81 |
| New Graduate | 75 | 80 | 70 | 90 | 60 | 65 | 80 | 74 |
| Clinical Skills Academy | 80 | 75 | 70 | 90 | 50 | 55 | 65 | 69 |

## High-Risk Topic Accelerator

| Topic | Lessons | Flashcards | Questions | Cases | Simulations | Clinical Skills | ECG Integration | Lab Integration | Pharmacology Integration | Completion Plan |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Sepsis | 97 generated lesson evidence | Not topic-evidenced | 9 authored question evidence | 1 clinical case JSON item | 13 simulation references | Not topic-evidenced | Medium | High | High | Finish flashcard, NGN case, skill, readiness mapping |
| Shock | 26 | Not topic-evidenced | 6 | 0 | 8 | Not topic-evidenced | Medium | High | High | Add cases, flashcards, simulation role overlays |
| ACS | 26 | Not topic-evidenced | 1 | 0 | 5 | Not topic-evidenced | High | Medium | High | Expand ECG and med safety loops |
| Stroke | 33 | Not topic-evidenced | 9 | 0 | 3 | Not topic-evidenced | Low-medium | Medium | Medium | Add acute stroke simulations and NGN cases |
| Respiratory Failure | 36 | Not topic-evidenced | 7 | 0 | 8 | Not topic-evidenced | Medium | High | High | Add ABG/lab and oxygenation simulations |
| DKA | 22 | Not topic-evidenced | 2 | 0 | 3 | Not topic-evidenced | Low | High | High | Add potassium/insulin/lab trend loops |
| Hyperkalemia | 31 | Not topic-evidenced | 4 | 1 | 4 | Not topic-evidenced | High | High | High | Add ECG deterioration and medication-cause loops |
| GI Bleed | 16 | Not topic-evidenced | 0 | 0 | 1 | Not topic-evidenced | Low | High | Medium | Build first full case/simulation set |
| Trauma | 12 | Not topic-evidenced | 1 | 0 | 1 | Not topic-evidenced | Medium | Medium | Medium | Build emergency and shock-linked simulations |
| Maternal Emergencies | 24 | Not topic-evidenced | 1 | 0 | 0 | Not topic-evidenced | Low | Medium | Medium | Build postpartum hemorrhage and hypertensive emergency loops |
| Pediatric Emergencies | 100 | Not topic-evidenced | 6 | 0 | 0 physiology-monitor references | Not topic-evidenced | Medium | Medium | High | Build pediatric respiratory distress and med safety loops |

## Content ROI Engine

Weighted ROI Score formula:

`Revenue 25% + Learner 20% + Retention 15% + Clinical 20% + Institutional 10% + SEO 10%`

| Initiative | Revenue | Learner | Retention | Clinical | Institutional | SEO | Weighted ROI |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| RN question bank completion | 100 | 100 | 85 | 95 | 80 | 85 | 93.8 |
| RPN/PN question bank completion | 98 | 98 | 84 | 95 | 78 | 75 | 91.9 |
| High-risk clinical loops | 92 | 100 | 96 | 100 | 95 | 88 | 96.0 |
| Simulation parity | 90 | 96 | 95 | 100 | 98 | 72 | 93.6 |
| Flashcard instrumentation and completion | 95 | 92 | 98 | 75 | 70 | 70 | 85.4 |
| Pharmacology parity | 90 | 90 | 88 | 100 | 80 | 88 | 91.0 |
| ECG parity | 88 | 88 | 84 | 98 | 78 | 90 | 88.4 |
| Lab parity | 82 | 86 | 82 | 92 | 78 | 88 | 85.5 |
| CNPLE completion | 88 | 88 | 76 | 90 | 70 | 70 | 83.6 |
| FNP completion | 92 | 86 | 78 | 88 | 68 | 72 | 84.7 |
| New Graduate Residency | 85 | 90 | 100 | 88 | 98 | 90 | 90.0 |
| Clinical Skills Academy | 82 | 88 | 85 | 92 | 100 | 76 | 87.1 |
| CCRN | 72 | 82 | 78 | 96 | 88 | 76 | 81.8 |
| CEN | 70 | 82 | 76 | 94 | 86 | 76 | 80.6 |
| Additional Allied Professions | 65 | 78 | 70 | 82 | 76 | 72 | 72.9 |

