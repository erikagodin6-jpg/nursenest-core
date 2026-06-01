# NurseNest Nursing Authority & Content Dominance Audit

Date: 2026-06-01  
Status: Repository-evidenced audit  
Scope: Nursing education authority, content dominance, commercial readiness, and organic acquisition readiness  
Exclusions: This is not an E-E-A-T audit, not a technical SEO audit, and not a future-product planning document.

## Audit Rules

This audit gives credit only for committed repository evidence. It does not award credit for planned work, hidden/admin-only future products, roadmap documents, placeholders, scaffolding, or unpublished architecture. Counts are exact only where the repository provides exact source files or committed snapshots.

Primary evidence sources:

- `src/config/pathway-readiness-snapshot.json`
- `docs/content-instrumentation-report.md`
- `docs/content-maturity-dashboard.md`
- `docs/question-quality-dashboard.md`
- `src/content/pathway-lessons/generated-indexes/*.json`
- `src/content/blog-static-longtail/*.md`
- `src/content/questions/*.ts`
- `src/content/clinical-case-studies.json`
- `src/content/flashcard-samples.json`
- `src/content/cases/cnple-case-catalog.ts`
- `src/lib/physiology-monitor/simulation-catalog.ts`
- `src/lib/ecg-module/*simulation*`

Important boundary: `pathway-readiness-snapshot.json` is treated as the committed launch-gate count source because the repository says those counts gate public launch checks. Generated lesson indexes prove additional lesson inventory, but they do not replace the launch-gate snapshot until regenerated, reviewed, and approved.

## 1. Executive Summary

NurseNest has strong repository evidence for broad nursing lesson coverage, extensive long-tail blog inventory, and a serious platform-level content architecture. It does not yet have repository evidence that every major nursing pathway deserves "most authoritative" status across questions, flashcards, simulations, cases, CAT, practice exams, and readiness analytics.

The strongest authority areas are:

| Area | Evidence | Audit conclusion |
| --- | ---: | --- |
| Blog breadth | 4,595 long-tail markdown files | Strong organic footprint potential, especially RN, clinical skills, labs, pharmacology, allied, and international clusters |
| RN lesson inventory | 796 US RN and 797 Canada RN generated lessons | Strong educational surface, but launch snapshot still shows only 200 US RN and 190 Canada RN lessons |
| CNPLE inventory | 436 lessons and 1,496 questions in launch snapshot | Strongest NP pathway by repository evidence |
| Canadian RPN lesson inventory | 410 effective generated lessons | Good lesson depth, but question and simulation counts remain below commercial threshold |
| FNP lesson inventory | 496 effective generated lessons | Strong generated lesson base, but launch snapshot shows only 91 lessons and 280 questions |

The weakest authority and commercial areas are:

| Area | Evidence | Audit conclusion |
| --- | ---: | --- |
| Flashcards | Pathway-level counts not reliably evidenced; instrumentation report limits measurement to `flashcard-samples.json` | Cannot claim flashcard dominance |
| Simulations | Maturity dashboard scores simulations at 45% overall and 30% coverage | Not commercially mature as a clinical judgment engine |
| Question quality | `docs/question-quality-dashboard.md` says scores are not live-audited | Cannot claim 95% quality until DB-backed scoring runs |
| NP specialties beyond CNPLE | Launch snapshot ranges from 95-110 lessons and 230-280 questions | Not commercially dominant versus NP exam competitors |
| New Graduate | 40 lessons and 120 questions in launch snapshot | Early-stage, not market-ready |
| US NCLEX-RN commercial depth | 200 lessons and 480 questions in launch snapshot | Strong architecture, but below premium QBank volume expectations |

Bottom line: NurseNest is closest to authority readiness in RN lessons, Canadian RN/RPN lesson breadth, CNPLE, and long-tail nursing SEO. It is not yet commercially dominant in the major monetization layer: questions, flashcards, simulations, practice exams, CAT, readiness analytics, and externally visible clinical authority proof.

## 2. Program Inventory Report

### Launch-Gate Snapshot Counts

These are exact committed counts from `src/config/pathway-readiness-snapshot.json`.

| Pathway | Lessons | Questions | Commercial count status |
| --- | ---: | ---: | --- |
| ca-rpn-rex-pn | 180 | 350 | Below premium threshold |
| ca-rn-nclex-rn | 190 | 420 | Below premium threshold |
| ca-np-cnple | 436 | 1,496 | Strongest repository-evidenced pathway |
| us-lpn-nclex-pn | 175 | 380 | Below premium threshold |
| us-rn-nclex-rn | 200 | 480 | Below premium threshold |
| us-rn-new-grad-transition | 40 | 120 | Early-stage |
| us-np-fnp | 91 | 280 | Below premium threshold |
| us-np-agpcnp | 110 | 260 | Below premium threshold |
| us-np-pmhnp | 105 | 250 | Below premium threshold |
| us-np-whnp | 100 | 240 | Below premium threshold |
| us-np-pnp-pc | 95 | 230 | Below premium threshold |
| ca-allied-core | 60 | 150 | Not in nursing authority scope, but below launch threshold |
| us-allied-core | 65 | 160 | Not in nursing authority scope, but below launch threshold |
| uk-rn-nmc-test-of-competence | 0 | 0 | No learner-accessible credit |
| au-rn-iqnm-pathway | 0 | 0 | No learner-accessible credit |
| ph-rn-prc-pnle | 0 | 0 | No learner-accessible credit |
| in-rn-state-nursing-council-registration | 0 | 0 | No learner-accessible credit |
| ng-rn-nmcn-licensure | 0 | 0 | No learner-accessible credit |
| sa-rn-scfhs-licensure | 0 | 0 | No learner-accessible credit |

### Generated Lesson Inventory

These are exact generated-index counts from `docs/content-instrumentation-report.md`.

| Pathway | Effective lessons | Procedures and skills | Category count | Audit interpretation |
| --- | ---: | ---: | ---: | --- |
| ca-allied-core | 15 | 0 | 21 | Sparse |
| ca-np-cnple | 436 | 0 | 21 | Strong, but has category holes |
| ca-rn-nclex-rn | 797 | 45 | 21 | Strong lesson inventory |
| ca-rpn-rex-pn | 410 | 0 | 21 | Strong lesson inventory, weak skills evidence |
| us-allied-core | 87 | 1 | 21 | Sparse |
| us-lpn-nclex-pn | 86 | 0 | 21 | Sparse generated lesson evidence |
| us-np-fnp | 496 | 0 | 21 | Strong generated lesson inventory |
| us-rn-nclex-rn | 796 | 45 | 21 | Strong lesson inventory |
| us-rn-new-grad-transition | 39 | 0 | 21 | Sparse |

### Authored Static Question Catalogs

Exact counts from static TypeScript question files:

| Source | Question objects |
| --- | ---: |
| `src/content/questions/nclex-tier1-foundational-questions.ts` | 29 |
| `src/content/questions/nclex-tier2-clinical-judgment-questions.ts` | 2 |
| `src/content/questions/nclex-tier3-advanced-review-questions.ts` | 2 |
| `src/content/questions/cnple-practical-nursing-ngn-expansion.ts` | 21 |
| `src/content/questions/allied-pharmacy-technician.ts` | 13 |

The larger pathway question counts come from the committed launch-gate snapshot, not from individually counted static question objects.

### Blog Inventory

Exact scan of `src/content/blog-static-longtail/*.md`: 4,595 files.

| Cluster | Files |
| --- | ---: |
| nclex | 685 |
| rn | 2,763 |
| rpn_rex_pn_cnple_pn | 1,203 |
| cnple | 216 |
| np | 770 |
| fnp | 42 |
| agpcnp | 19 |
| pmhnp | 12 |
| whnp | 66 |
| pnp | 4 |
| new_grad | 499 |
| ecg | 249 |
| labs | 655 |
| pharm | 676 |
| clinical_skills | 1,538 |
| international | 1,666 |
| allied | 1,079 |
| rt | 310 |
| paramedic_ems | 364 |
| mlt | 123 |
| ot | 51 |
| pt | 156 |
| social_work | 98 |

Blog breadth is real, but blog inventory alone is not enough to prove commercial readiness. A commercially dominant topic needs a full loop: lesson, questions, flashcards, cases, simulation, readiness signal, internal links, and conversion path.

### Published, Draft, Hidden, Placeholder, Monetizable

The repository does not provide a complete status inventory by asset type. Therefore this audit does not invent exact published/draft/hidden counts. The only reliable status conclusion is:

| Asset class | Exact status count? | Audit decision |
| --- | --- | --- |
| Pathway launch snapshot | Lessons/questions only | Counted |
| Generated lessons | Inventory count only | Counted as repository inventory, not launch-gate commercial count |
| Flashcards | No pathway-level reliable count | Not credited for pathway dominance |
| Simulations | Scattered files and maturity report | Credited only as immature system-level evidence |
| Future international products | Snapshot zero or hidden planning docs | No learner-accessible credit |
| Future academies | Hidden/admin-only roadmap docs | No learner-accessible credit |

## 3. Authority Coverage Matrix

This matrix combines exact inventory with the directional maturity scores already documented in `docs/content-maturity-dashboard.md`. Scores are not marketing claims.

| Pathway | Exact strongest evidence | Exact weakest evidence | Maturity score | Authority status |
| --- | --- | --- | ---: | --- |
| RN | 796-797 generated RN lessons; 685 NCLEX blogs; 2,763 RN blogs | Launch snapshot only 420-480 questions; flashcards and simulations not path-counted | 74% | Strong partial authority |
| RPN / PN | 410 REx-PN generated lessons; 1,203 PN/RPN blogs | 350-380 questions; no pathway flashcard proof; no simulation parity | 66% | Developing authority |
| NCLEX-RN | 796 US RN lessons; 200 launch-gate lessons; 480 launch-gate questions | Question volume far below premium competitors | 72% US RN | Strong SEO base, incomplete product depth |
| NCLEX-PN | 175 launch-gate lessons; 380 questions; 86 generated lessons | Sparse generated lesson evidence and weak system loops | 64% US PN | Incomplete |
| CNPLE | 436 lessons; 1,496 questions; 216 CNPLE blogs | Simulation and category gaps | 70% | Best NP pathway |
| FNP | 496 generated lessons; 770 NP blogs; 42 FNP blogs | Snapshot only 91 lessons and 280 questions; no simulation parity | 44% NP specialties | Lesson-rich but commercially incomplete |
| AGPCNP | 110 lessons and 260 questions in snapshot | No generated specialty lesson index identified | 44% NP specialties | Incomplete |
| PMHNP | 105 lessons and 250 questions in snapshot | Only 12 PMHNP blog files counted | 44% NP specialties | Incomplete |
| WHNP | 100 lessons and 240 questions in snapshot; 66 WHNP blog files | No specialty simulation or flashcard evidence | 44% NP specialties | Incomplete |
| PNP-PC | 95 lessons and 230 questions; 4 PNP blog files | Very thin public authority footprint | 44% NP specialties | Incomplete |
| New Graduate | 40 lessons; 120 questions; 499 blog files | Sparse core product inventory | 40% | SEO-interesting, not product-mature |

## 4. Topic Cluster Analysis

### Strong Partial Clusters

| Cluster | Evidence | Missing for dominance |
| --- | --- | --- |
| RN cardiovascular | 66 Canada RN lessons, similar US RN generated index strength, blog breadth | Topic-level questions, simulations, flashcards, CAT/readiness proof |
| RN respiratory | 50 Canada RN lessons and strong blog presence | Simulation parity and question depth |
| CNPLE primary care and NP fundamentals | 436 CNPLE lessons, 1,496 questions | Heme, fluids, infection, procedures, simulation coverage |
| Clinical skills | 1,538 long-tail blog files and 45 RN procedures/skills lessons | Validated standalone clinical skill catalog, OSCE-style simulations, competency scoring |
| Labs | 655 long-tail blog files; maturity score 59% | Lab simulation depth, trend cases, readiness scoring |
| Pharmacology | 676 long-tail blog files; maturity score 47% | Medication-class loops, monitoring cases, flashcards, safety simulations |

### Incomplete Topic Clusters

| Cluster | Evidence | Gap |
| --- | --- | --- |
| Mental health RN | Canada RN generated lessons: 9 | Thin lesson evidence relative to exam importance |
| Pediatrics RN | Canada RN generated lessons: 18 | Thin lesson evidence and no simulation parity |
| Safety/prioritization RN | Canada RN generated lessons: 12 | Too low for core NCLEX authority |
| RPN maternal/newborn | Canada RPN generated lessons: 2 | Not authoritative |
| RPN procedures and skills | Canada RPN generated lessons: 0 | Not authoritative |
| CNPLE heme/onc | CNPLE generated lessons: 0 | Not authoritative |
| CNPLE fluids/electrolytes | CNPLE generated lessons: 0 | Not authoritative |
| FNP heme/onc | FNP generated lessons: 0 | Not authoritative |
| PNP-PC SEO cluster | 4 counted PNP blog files | Very weak discoverability |

### Full-Funnel Topic Cluster Standard

A topic should not be called dominant unless it has:

1. Public or learner-accessible landing/hub page.
2. Lesson inventory.
3. Question inventory.
4. Flashcard inventory.
5. NGN/case inventory where appropriate.
6. Simulation or scenario inventory for high-risk topics.
7. Readiness or weak-area signal.
8. Internal links upward to hub, sideways to sibling topics, and downward to practice.
9. Conversion path.

Under that strict standard, no audited topic can yet be proven as fully dominant from repository evidence alone.

## 5. Internal Linking Scorecard

Repository evidence shows an internal linking architecture exists, but not enough evidence to prove all assets are linked into authority clusters.

| Linking layer | Evidence | Score | Gap |
| --- | --- | ---: | --- |
| Blog to lesson/tool links | `blog-static-posts.ts` and long-tail content patterns include lesson and question-bank links | 70 | Needs orphan crawl and link-depth report |
| Educational graph | `src/lib/educational-graph/*` and breadcrumb/remediation helpers exist | 75 | Needs coverage validation by topic |
| Question to remediation | `studyLinkPathwayId` and `studyLinkLessonSlug` appear in question schema/search | 60 | Needs complete item-level enforcement |
| ECG structured internal architecture | ECG taxonomy includes schema and route types | 75 | Stronger than general pathway proof |
| Cross-system links | Labs, ECG, pharmacology, clinical skills mentioned across content | 50 | Needs systematic related-content graph |
| Commercial CTAs | Public route count exists, but not item-level conversion audit here | 55 | Needs route-by-route CTA proof |

Exact route count from `src/app` route scan for public content/tool keywords: 161 page files.

Required next audit: generate a URL graph with incoming link count, outgoing link count, hub depth, orphan status, and conversion target for every public lesson, blog, question-bank page, flashcard page, CAT page, and practice exam page.

## 6. Commercial Readiness Report

Commercial readiness here is based on launch-gate counts against previously governed premium targets. It is intentionally stricter than repository lesson inventory.

| Pathway | Launch lessons | Lesson threshold | Lesson readiness | Launch questions | Question threshold | Question readiness | Commercial verdict |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| US NCLEX-RN | 200 | 500 | 40.0% | 480 | 8,000 | 6.0% | Not premium-ready |
| Canada NCLEX-RN | 190 | 500 | 38.0% | 420 | 8,000 | 5.3% | Not premium-ready |
| REx-PN | 180 | 300 | 60.0% | 350 | 4,000 | 8.8% | Not premium-ready |
| NCLEX-PN | 175 | 300 | 58.3% | 380 | 4,000 | 9.5% | Not premium-ready |
| CNPLE | 436 | 250 | 174.4% | 1,496 | 2,000 | 74.8% | Closest to NP commercial readiness |
| FNP | 91 | 250 | 36.4% | 280 | 2,000 | 14.0% | Not premium-ready |
| AGPCNP | 110 | 250 | 44.0% | 260 | 2,000 | 13.0% | Not premium-ready |
| PMHNP | 105 | 250 | 42.0% | 250 | 2,000 | 12.5% | Not premium-ready |
| WHNP | 100 | 250 | 40.0% | 240 | 2,000 | 12.0% | Not premium-ready |
| PNP-PC | 95 | 250 | 38.0% | 230 | 2,000 | 11.5% | Not premium-ready |
| New Graduate | 40 | 300 | 13.3% | 120 | 1,500 | 8.0% | Early-stage |

Commercial conclusion: CNPLE is the nearest revenue pathway by count evidence. RN has strong generated lesson evidence but the launch snapshot and question volume must be reconciled before premium-market claims are safe.

## 7. Competitive Gap Analysis

This benchmark used current public competitor surfaces and official/public sources where possible. It is not a claim that every competitor count is superior in every category; it identifies areas where competitors present clearer commercial proof today.

Public competitor sources checked:

- UWorld NCLEX-RN: `https://nursing.uworld.com/nclex-rn/`
- Kaplan NCLEX practice: `https://www.kaptest.com/nclex/practice/nclex-practice`
- Pocket Prep NCLEX-RN: `https://www.pocketprep.com/exams/nclex-rn/`
- APEA NP exam prep: `https://www.apea.com/`
- Fitzgerald Health Education Associates: `https://www.fhea.com/`
- Nurse.com: `https://www.nurse.com/`
- Springer/Leik FNP review: `https://info.springerpub.com/leik`

| Competitor | Public strength | NurseNest gap |
| --- | --- | --- |
| UWorld | Mature NCLEX QBank positioning, self-assessment, rationales, CAT, flashcards, study planning, and commercial exam-prep trust | NurseNest launch snapshot has 480 US RN questions and no live-audited quality score |
| Archer Review | NCLEX-focused CAT/readiness positioning and high-volume practice ecosystem | NurseNest CAT/readiness claims need item-volume and analytics proof |
| Kaplan | Established NCLEX QBank and practice test brand trust | NurseNest needs stronger external trust, reviewer proof, and commercial QBank scale |
| BoardVitals | Professional exam-prep positioning across nursing and healthcare specialties | NurseNest needs clearer certification-specific breadth and institutional proof |
| Nurse.com | Strong nursing CE/professional education authority | NurseNest needs visible reviewer/author and CE/professional authority infrastructure |
| Pocket Prep | Mobile-first practice and exam readiness positioning across healthcare exams | NurseNest needs clearer mobile conversion and practice depth proof |
| Fitzgerald | NP certification review authority | NurseNest FNP/NP counts are below specialty commercial threshold |
| APEA | NP review, predictor exam, and certification prep trust | NurseNest lacks NP predictor/readiness proof and sufficient specialty question depth |
| Leik | Recognized NP review book/course brand | NurseNest must build flagship NP content and recognizable clinical reviewer proof |

NurseNest's credible advantage is breadth: RN, PN, NP, labs, ECG, pharmacology, clinical skills, new graduate, allied, international, and long-tail SEO can live in one ecosystem. The current gap is proving that breadth with path-level monetizable depth.

## 8. Content Quality Report

The quality dashboard is explicit: pathway-level question quality is not live-audited because the live question database was unavailable in the prior run. Therefore this audit cannot claim 95% question quality, 95% rationale quality, 95% hint quality, or 95% clinical pearl quality.

Repository-evidenced maturity scores by learning system:

| System | Overall maturity | Audit interpretation |
| --- | ---: | --- |
| Lessons | 75% | Strongest content system |
| Questions | 67% | Developing, but not premium-certified |
| Clinical Skills | 63% | Useful, but not competency-complete |
| Labs | 59% | Good educational opportunity, not mature |
| ECG | 54% | Architecture exists, needs depth |
| Flashcards | 54% | Not instrumented enough for dominance |
| Medication Math | 50% | Needs safety loop development |
| Pharmacology | 47% | Major authority gap |
| Cases | 45% | Major clinical judgment gap |
| Simulations | 45% | Major readiness gap |

Quality blockers before dominance claims:

1. Run DB-backed V2 question scoring.
2. Produce exact rationale, hint, distractor, pearl, and flashcard output counts.
3. Block publish for items without remediation links and readiness mapping.
4. Add simulation/debrief/readiness coverage to high-risk topics.
5. Add duplicate detection and content originality reporting for lessons, questions, flashcards, and blogs.

## 9. NP Expansion Report

| NP pathway | Current evidence | Authority gap | Commercial priority |
| --- | --- | --- | --- |
| CNPLE | 436 lessons, 1,496 questions | Simulation and category gaps | P0 |
| FNP | 496 generated lessons, but launch snapshot 91 lessons and 280 questions | Snapshot mismatch, question gap, readiness proof | P0 |
| AGPCNP | 110 lessons, 260 questions | Specialty management depth and question volume | P1 |
| PMHNP | 105 lessons, 250 questions; 12 PMHNP blog files | Psychopharmacology, safety, therapy/diagnostic depth | P1 |
| WHNP | 100 lessons, 240 questions; 66 WHNP blog files | Pregnancy, gyn, contraception, risk triage depth | P1 |
| PNP-PC | 95 lessons, 230 questions; 4 PNP blog files | Pediatric primary care SEO and clinical depth | P1 |

NP expansion should not start by adding more broad generic NP content. It should complete certification-specific loops:

- Blueprint domain.
- Diagnostic reasoning lesson.
- Prescribing and management question set.
- Flashcard set.
- Case or simulation.
- Follow-up/remediation link.
- Readiness signal.

## 10. Authority Scorecard

Scores are audit judgments anchored to repository counts and the existing maturity dashboard. They are operational scores, not public marketing claims.

| Program | Content authority | Commercial readiness | SEO footprint | Quality proof | Overall authority |
| --- | ---: | ---: | ---: | ---: | ---: |
| RN | 78 | 35 | 82 | 67 | 66 |
| RPN / PN | 66 | 32 | 72 | 62 | 58 |
| NCLEX-RN | 72 | 36 | 80 | 67 | 64 |
| NCLEX-PN | 58 | 28 | 55 | 60 | 50 |
| CNPLE | 74 | 66 | 64 | 65 | 67 |
| FNP | 56 | 25 | 52 | 55 | 47 |
| AGPCNP | 44 | 22 | 35 | 52 | 38 |
| PMHNP | 42 | 22 | 32 | 52 | 37 |
| WHNP | 44 | 22 | 45 | 52 | 41 |
| PNP-PC | 40 | 20 | 25 | 52 | 34 |
| New Graduate | 40 | 18 | 62 | 50 | 43 |

No pathway currently reaches 95% authority/commercial readiness under repository-evidenced standards.

## 11. Commercial Authority Matrix

| Pathway | Can confidently sell today? | Can beta sell with caveats? | Reason |
| --- | --- | --- | --- |
| US NCLEX-RN | No | Possibly, if scope is positioned honestly | Strong lesson/blog base, but low launch-gate question count and no live quality audit |
| Canada NCLEX-RN | No | Possibly, if positioned as study support | Same RN gap pattern |
| REx-PN | No | Possibly | Lesson base is decent, but questions and simulations are thin |
| NCLEX-PN | No | No | Generated lesson count is sparse and questions are thin |
| CNPLE | Not full premium | Yes | Closest to readiness, but still needs simulations and quality proof |
| FNP | No | No | Snapshot count is too low despite generated lesson evidence |
| AGPCNP | No | No | Insufficient specialty depth |
| PMHNP | No | No | Insufficient specialty depth |
| WHNP | No | No | Insufficient specialty depth |
| PNP-PC | No | No | Insufficient specialty depth and SEO footprint |
| New Graduate | No | No | Early-stage inventory |

## 12. Top 100 Highest ROI Improvements

Priority score uses 0-100 operational value based on revenue impact, learner impact, clinical risk, reuse, and evidence gap.

| Rank | Priority | Improvement | Evidence trigger |
| ---: | ---: | --- | --- |
| 1 | 100 | Reconcile generated RN lesson counts into the launch-gate snapshot after review | RN generated lessons 796-797 vs snapshot 190-200 |
| 2 | 100 | Build exact flashcard instrumentation by pathway | No reliable pathway-level flashcard counts |
| 3 | 100 | Run DB-backed question quality V2 scoring | Quality dashboard says not live-audited |
| 4 | 99 | Build exact simulation inventory by pathway/topic | Simulation maturity 45% |
| 5 | 99 | Complete RN high-risk topic loops | RN commercial readiness blocked by loops |
| 6 | 98 | Expand US NCLEX-RN question bank to premium threshold | Snapshot 480 vs 8,000 target |
| 7 | 98 | Expand Canada NCLEX-RN question bank to premium threshold | Snapshot 420 vs 8,000 target |
| 8 | 97 | Expand REx-PN question bank to premium threshold | Snapshot 350 vs 4,000 target |
| 9 | 97 | Expand NCLEX-PN question bank to premium threshold | Snapshot 380 vs 4,000 target |
| 10 | 96 | Complete CNPLE question gap | Snapshot 1,496 vs 2,000 target |
| 11 | 96 | Add RN sepsis lesson-question-flashcard-case-simulation loop | High-risk topic |
| 12 | 96 | Add RN shock loop | High-risk topic |
| 13 | 95 | Add RN ACS loop | High-risk topic |
| 14 | 95 | Add RN stroke loop | High-risk topic |
| 15 | 95 | Add RN respiratory failure loop | High-risk topic |
| 16 | 94 | Add RN DKA loop | High-risk topic |
| 17 | 94 | Add RN hyperkalemia loop | High-risk topic |
| 18 | 94 | Add RN GI bleed loop | High-risk topic |
| 19 | 93 | Add RN maternal emergency loop | Maternal/peds cluster score 55% |
| 20 | 93 | Add RN pediatric emergency loop | Pediatrics thin |
| 21 | 93 | Strengthen RN mental health lessons | Canada RN mental health count 9 |
| 22 | 92 | Strengthen RN safety/prioritization lessons | Canada RN count 12 |
| 23 | 92 | Strengthen RN pediatric lessons | Canada RN count 18 |
| 24 | 92 | Strengthen RN fundamentals | Canada RN count 11 |
| 25 | 91 | Build RN simulation debrief standard | Simulation missing from completion loop |
| 26 | 91 | Add RPN procedures and skills content | Canada RPN count 0 |
| 27 | 91 | Add RPN nutrition content | Canada RPN count 0 |
| 28 | 90 | Add RPN heme/onc content | Canada RPN count 0 |
| 29 | 90 | Add RPN maternal/newborn content | Canada RPN count 2 |
| 30 | 90 | Add RPN wound/integumentary content | Canada RPN count 1 |
| 31 | 90 | Add RPN infection-control question depth | Canada RPN infection count 10 |
| 32 | 89 | Add RPN safety/prioritization depth | Canada RPN count 10 |
| 33 | 89 | Build RPN predictable-vs-unstable simulation set | PN simulation 35% |
| 34 | 89 | Build RPN escalation and reporting case set | Core PN competency |
| 35 | 88 | Build NCLEX-PN generated lesson parity | US PN generated count 86 |
| 36 | 88 | Build NCLEX-PN medication safety loop | PN commercial topic |
| 37 | 88 | Build NCLEX-PN delegation loop | PN scope topic |
| 38 | 87 | Build NCLEX-PN documentation loop | PN scope topic |
| 39 | 87 | Build NCLEX-PN infection loop | PN exam topic |
| 40 | 87 | Build NCLEX-PN peds/maternal fundamentals | US PN peds/maternal count 2 each |
| 41 | 87 | Fill CNPLE heme/onc | CNPLE count 0 |
| 42 | 86 | Fill CNPLE fluids/electrolytes | CNPLE count 0 |
| 43 | 86 | Fill CNPLE infection control | CNPLE count 0 |
| 44 | 86 | Fill CNPLE procedures and skills | CNPLE count 0 |
| 45 | 85 | Build CNPLE simulation library | NP CNPLE simulation 35% |
| 46 | 85 | Build CNPLE prescribing readiness cases | NP certification requirement |
| 47 | 85 | Build CNPLE diagnostic reasoning cases | NP depth requirement |
| 48 | 85 | Build CNPLE chronic disease management loops | CNPLE commercial topic |
| 49 | 84 | Reconcile FNP generated lessons into launch snapshot | FNP generated 496 vs snapshot 91 |
| 50 | 84 | Expand FNP question bank | Snapshot 280 vs 2,000 target |
| 51 | 84 | Build FNP heme/onc | FNP generated count 0 |
| 52 | 83 | Build FNP procedure/skills content | FNP generated count 0 |
| 53 | 83 | Build FNP prescribing cases | NP competitor gap |
| 54 | 83 | Build FNP pediatric primary care cases | FNP scope |
| 55 | 82 | Build FNP women's health cases | FNP scope |
| 56 | 82 | Expand AGPCNP question bank | Snapshot 260 vs 2,000 |
| 57 | 82 | Expand AGPCNP gerontology cases | Specialty depth |
| 58 | 81 | Expand AGPCNP chronic disease management | Specialty depth |
| 59 | 81 | Expand AGPCNP prescribing safety | Specialty depth |
| 60 | 81 | Expand PMHNP question bank | Snapshot 250 vs 2,000 |
| 61 | 81 | Expand PMHNP psychopharmacology | Specialty depth |
| 62 | 80 | Expand PMHNP crisis/safety cases | Specialty depth |
| 63 | 80 | Expand PMHNP therapy modality content | Specialty depth |
| 64 | 80 | Expand WHNP question bank | Snapshot 240 vs 2,000 |
| 65 | 80 | Expand WHNP pregnancy risk cases | Specialty depth |
| 66 | 79 | Expand WHNP contraception and gyn cases | Specialty depth |
| 67 | 79 | Expand PNP-PC question bank | Snapshot 230 vs 2,000 |
| 68 | 79 | Expand PNP-PC SEO cluster | PNP blog files 4 |
| 69 | 78 | Expand PNP-PC family education cases | Specialty depth |
| 70 | 78 | Build NP readiness predictor evidence | Competitor gap |
| 71 | 78 | Build pharmacology medication-class inventory | Pharmacology maturity 47% |
| 72 | 78 | Build pharmacology monitoring cases | Medication safety gap |
| 73 | 77 | Build pharmacology toxicity cases | Medication safety gap |
| 74 | 77 | Build pharmacology interaction scenarios | Medication safety gap |
| 75 | 77 | Build pharmacology flashcard instrumentation | No pathway flashcard proof |
| 76 | 76 | Build ECG deterioration pathways | ECG maturity 54% |
| 77 | 76 | Build ECG medication-safety links | ECG-pharm integration gap |
| 78 | 76 | Build ECG telemetry workflow cases | ECG commercial expansion |
| 79 | 75 | Build ECG escalation simulations | Simulation gap |
| 80 | 75 | Build lab critical-value simulations | Labs maturity 59% |
| 81 | 75 | Build lab trend interpretation cases | Lab reasoning gap |
| 82 | 74 | Build lab medication-monitoring loops | Lab-pharm integration |
| 83 | 74 | Build ABG reasoning cases | Lab/RT reuse |
| 84 | 74 | Build case library instrumentation | Cases maturity 45% |
| 85 | 73 | Build NGN case inventory by pathway | NGN commercial need |
| 86 | 73 | Build practice exam inventory report | No exact practice exam counts in this audit |
| 87 | 73 | Build CAT item eligibility report | CAT readiness not fully evidenced |
| 88 | 72 | Build readiness signal inventory | Readiness score gaps |
| 89 | 72 | Build internal link orphan crawler | Internal linking not fully scored |
| 90 | 72 | Build topic hub scorecards | Authority clusters need proof |
| 91 | 71 | Add author/reviewer links into content pages | Trust/commercial conversion gap |
| 92 | 71 | Add content last-reviewed dates | Trust/commercial conversion gap |
| 93 | 71 | Add reference infrastructure to lessons | Clinical authority gap |
| 94 | 70 | Add references to high-risk lessons first | Safety topics |
| 95 | 70 | Add comparison landing pages only after count proof | Commercial SEO gap |
| 96 | 69 | Build NCLEX hub linking to lessons/questions/CAT | Acquisition gap |
| 97 | 69 | Build REx-PN hub linking to lessons/questions/practice | Acquisition gap |
| 98 | 68 | Build CNPLE hub linking to diagnostics/prescribing cases | NP conversion gap |
| 99 | 68 | Build new graduate inventory only after RN/PN quality improves | Current 40 lessons/120 questions |
| 100 | 67 | Create weekly executive authority dashboard | Needed to prevent planning drift |

## 13. Roadmap To 95%+ Authority And Commercial Readiness

### First 30 Days: Measurement And Truth Layer

Exit criteria:

- Exact flashcard count by pathway, topic, system, and status.
- Exact simulation count by pathway, topic, system, and status.
- Exact practice exam and CAT inventory.
- DB-backed question quality scoring.
- Internal link graph with orphan report.
- Readiness snapshot regenerated only after reviewed generated lessons are approved.

Primary outcome: stop debating readiness from partial counts.

### Days 31-90: Revenue Pathway Completion

Prioritize:

1. US NCLEX-RN.
2. Canada NCLEX-RN.
3. REx-PN.
4. CNPLE.
5. NCLEX-PN.

Exit criteria:

- RN and PN high-risk topics have complete loops.
- RN and PN questions reach at least 50% of premium target.
- CNPLE reaches 2,000 reviewed questions.
- Flashcard and simulation coverage is measurable.
- No pathway has unanswered status-count gaps.

### Days 91-180: Clinical Judgment And Simulation Maturity

Prioritize:

1. Simulation coverage from 45% to at least 70%.
2. Cases from 45% to at least 70%.
3. Pharmacology from 47% to at least 75%.
4. ECG from 54% to at least 75%.
5. Labs from 59% to at least 80%.

Exit criteria:

- Every high-risk RN/RPN/PN/CNPLE topic has a simulation and debrief.
- Every question has remediation link candidates.
- Every simulation updates readiness domains.

### Days 181-365: Commercial Dominance Layer

Prioritize:

1. US NCLEX-RN productized QBank, CAT, practice exam, readiness assessment, and study plan.
2. REx-PN and NCLEX-PN commercial packages.
3. CNPLE premium package.
4. FNP rebuild from generated lessons into certified specialty loops.
5. NP specialty sequencing: AGPCNP, PMHNP, WHNP, PNP-PC.

Exit criteria for 95%+ readiness:

- Content coverage >= 95%.
- Question quality >= 95% from live audit.
- Flashcard quality >= 95% from inventory and scoring.
- Simulation coverage >= 85%.
- Readiness analytics >= 90%.
- Commercial conversion layer validated.
- Public claims backed by demonstrable learner-accessible features.

## Final Verdict

NurseNest has enough real repository evidence to justify a serious authority build, especially around RN lessons, CNPLE, clinical skills SEO, labs SEO, pharmacology SEO, and long-tail nursing acquisition. It does not yet have enough repository evidence to claim market-leading commercial dominance across NCLEX-RN, NCLEX-PN, REx-PN, FNP, AGPCNP, PMHNP, WHNP, PNP-PC, or New Graduate.

The fastest path to dominance is not more planning. It is measurement, launch-snapshot reconciliation, question depth, simulation depth, flashcard instrumentation, and high-risk topic loop completion.
