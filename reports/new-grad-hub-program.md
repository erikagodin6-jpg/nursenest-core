# New Grad hub — inventory, minimums, and QA program

Generated: 2026-05-30T00:37:26.116Z

## Part 1 — Pathway inventory (source: exam registry + navigation constants)

| Public hub route | Pathway ID | Exam code | Exam key | Stripe tier |
| --- | --- | --- | --- | --- |
| /us/rn/new-grad-transition | us-rn-new-grad-transition | new-grad-transition | NEW_GRAD_TRANSITION | NEW_GRAD |
| /us/new-grad (marketing shell) | *(lessons/questions/CAT resolve to us-rn-new-grad-transition)* | — | — | — |
| /canada/new-grad (marketing shell) | *(CA mega-menu destinations use US transition pathway for CAT; lessons beside RN hub per region policy)* | — | — | — |

### Premium module cards (transition hub, guest flags: scenarios off / OSCE off)

- **Study tools:** hub_lessons, flashcards, practice_tests, pathway_cat_landing, labs, med_calc, clinical_skills, pharmacology, ngn_tools, weak_areas, clinical_scenarios, osce
- **Readiness & progress:** progress, exam_plan
- **New graduate strip:** transition, clinical_judgment, new_grad_pathway_cat, skills_refresher, new_grad_delegation

When scenarios/OSCE public flags are **on**, locked state may change for: `clinical_cases` (NP only), `osce`. New Grad is **not** NP — `clinical_cases` never appears.

### Gated vs public-safe modules

- **Public marketing URLs:** transition lessons, questions, CAT landing, and new-grad strip cards with `wrapGuestWithLoginCallback: false` stay on marketing hosts.
- **Subscriber app surfaces:** flashcards, practice exams, labs, med calc, weak areas, medication drills use `/login?callbackUrl=` for guests (no admin/staff hrefs).
- **OSCE:** Tile remains visible for nursing pathways; when the public OSCE flag is off, `resolvePremiumCardHref` keeps locked navigation safe (`/` or login callback per card).

## Part 1B — Digital residency foundation

### Specialty transition tracks

| Track | Work-area slug | Package | First-month priorities | Signature simulations |
| --- | --- | --- | --- | --- |
| Medical-Surgical | `med-surg` | new-grad-base | shift organization, post-op assessment, infection risk, falls prevention | Four-patient medical assignment, New admission during medication pass, Post-op deterioration |
| Emergency | `emergency-department` | emergency-specialty | primary survey, triage acuity, stroke/STEMI/sepsis pathways, handoff under pressure | Stroke alert, STEMI arrival, Overdose with airway risk, Sepsis in a crowded department |
| ICU | `icu` | icu-specialty | ICU orientation, ventilator basics, hemodynamic basics, critical labs | Septic shock, ARDS, Mechanical ventilation, CRRT safety check, Cardiogenic shock |
| Telemetry | `cardiac-icu` | telemetry-specialty | telemetry lead placement, artifact recognition, atrial fibrillation, heart block escalation | New atrial fibrillation, Complete heart block, Ventricular tachycardia, Pacemaker failure |
| Cardiac | `cardiac-icu` | cardiac-specialty | chest pain assessment, heart failure trends, diuretic monitoring, post-PCI safety | Acute chest pain, Decompensated heart failure, Post-PCI complication |
| Perioperative | `operating-room` | perioperative-specialty | surgical checklist, sterile field awareness, specimen handling, OR communication | Wrong-site prevention, Instrument count discrepancy, Intraoperative instability |
| PACU | `pacu` | perioperative-specialty | airway positioning, sedation scoring, pain reassessment, bleeding surveillance | Post-anesthesia airway obstruction, Uncontrolled pain, Post-op bleeding |
| Labour & Delivery | `labour-delivery` | specialty-library | fetal heart rate baseline, uterine activity, postpartum hemorrhage readiness, neonatal transition | Shoulder dystocia, Postpartum hemorrhage, Nonreassuring fetal tracing |
| Postpartum | `maternal-newborn` | specialty-library | fundal assessment, lochia changes, preeclampsia warning signs, newborn safety | Delayed postpartum hemorrhage, Postpartum hypertension, Newborn feeding concern |
| Pediatrics | `pediatrics` | specialty-library | age-adjusted vitals, weight-based meds, respiratory distress, family partnership | Bronchiolitis deterioration, Pediatric dehydration, Asthma exacerbation |
| NICU | `neonatal-icu` | specialty-library | gestational-age context, temperature stability, glucose surveillance, apnea/bradycardia events | Apnea and bradycardia, Neonatal hypoglycemia, Feeding intolerance |
| Mental Health | `mental-health` | specialty-library | suicide risk language, de-escalation, withdrawal safety, antipsychotic adverse effects | Suicide precautions, Escalating agitation, Medication refusal |
| Community | `community-public-health` | new-grad-base | health teaching, resource navigation, infection prevention, follow-up coordination | Missed follow-up risk, Community outbreak call, Unsafe discharge supports |
| Home Care | `home-care` | new-grad-base | visit safety, oxygen safety, home medication storage, wound/line escalation | Solo visit safety concern, Home oxygen hazard, Wound vac troubleshooting |
| Long-Term Care | `long-term-care` | new-grad-base | baseline comparison, falls response, delirium vs dementia, SBAR to provider | Unwitnessed fall, UTI with delirium, Family concern during med pass |
| Dialysis | `renal-dialysis` | specialty-library | access bruit/thrill, hypotension response, potassium risk, post-treatment teaching | Intradialytic hypotension, Access infection concern, Hyperkalemia escalation |
| Oncology | `oncology-hematology` | specialty-library | fever in neutropenia, central line care, nausea/dehydration, pain and psychosocial support | Febrile neutropenia, Central line occlusion, Uncontrolled chemotherapy nausea |

- **Specialty tracks:** 17
- **Tracks without matching New Grad work-area hub slug:** 0

### Residency roadmap

| Window | Focus | Learner questions answered |
| --- | --- | --- |
| First 30 days | Orientation, unit routines, safe escalation, medication pass structure, and knowing when to ask for help. | What should I learn first on this unit?<br>Who do I call when the patient changes?<br>What safety checks must never be skipped? |
| First 60 days | Common deterioration patterns, SBAR handoff, documentation habits, and prioritized patient assignments. | Which cues suggest the patient is worsening?<br>What information belongs in a concise SBAR?<br>How do I organize competing tasks safely? |
| First 90 days | Increasing assignment independence, medication confidence, delegation, and condition-specific readiness. | Which competencies am I missing?<br>Which medications and labs create the highest risk on my unit?<br>How do I delegate without losing accountability? |
| First 180 days | Complex patient clusters, specialty case patterns, teamwork under pressure, and reflection after near misses. | What specialty concepts are still weak?<br>How do I recover after a near miss?<br>Am I ready for a heavier assignment with support? |
| First year | Consolidation, specialty growth, preceptor-ready habits, and readiness for advanced responsibilities. | How have I progressed compared with my specialty roadmap?<br>What should I study before my next career step?<br>Which specialty track should I deepen next? |

### Competency checklist domains

- **Knowledge:** Core concepts, pathophysiology, assessments, labs, and specialty terminology.
- **Clinical Skills:** Procedure preparation, safe technique, complication recognition, and documentation.
- **Communication:** SBAR, handoff, closed-loop team communication, family updates, and respectful inquiry.
- **Documentation:** Defensible notes, trend documentation, reassessment timing, and escalation records.
- **Professional Practice:** Scope, ethics, policy use, preceptor feedback, self-advocacy, and boundaries.
- **Clinical Judgment:** Recognizing cues, analyzing trends, prioritizing hypotheses, taking action, and evaluating outcomes.
- **Time Management:** Shift planning, task clustering, interruption recovery, and assignment reprioritization.
- **Delegation:** Scope-aware delegation, follow-up, accountability, and charge/preceptor communication.
- **Prioritization:** ABCs, unstable vs stable findings, time-sensitive pathways, and workload triage.

### Shift-readiness modules

- **Before Your First Shift:** Unit map, assignment sheet, medication pass rhythm, escalation contacts, and safe questions to ask.
- **Before Your First Night Shift:** Reduced resources, sleep planning, quiet-hour reassessments, overnight provider communication, and safety checks.
- **Before Your First Charge Shift:** Assignment balancing, escalation chains, resource allocation, conflict containment, and documentation of decisions.
- **Before Your First ICU Assignment:** Ventilator alarms, hemodynamic trends, high-alert drips, line safety, and urgent escalation criteria.
- **Before Your First Telemetry Assignment:** Lead placement, alarm response, rhythm change escalation, artifact troubleshooting, and chest pain pathways.

### Clinical survival guides

- **Top 25 ICU Emergencies:** Shock, airway, ventilator, line, sedation, renal, and electrolyte events requiring immediate escalation.
- **Top 25 Telemetry Pitfalls:** Artifact, missed heart block, inappropriate alarm silencing, chest pain delay, and electrolytes.
- **Top 25 ER Priorities:** Triage misses, sepsis delay, stroke/STEMI timing, unsafe discharge, and reassessment gaps.
- **Top 25 Medication Errors:** High-alert medications, insulin, anticoagulants, opioids, antibiotics, and pump programming.
- **Top 25 Documentation Mistakes:** Missing reassessment, unclear escalation, late entries, copy-forward risk, and incomplete handoff notes.

### Simulation center seed map

| Simulation | Track | Judgment focus |
| --- | --- | --- |
| Four-patient medical assignment | medical-surgical | prioritization, interruption recovery, escalation timing |
| New admission during medication pass | medical-surgical | time management, medication safety, handoff |
| Septic shock | icu | hypoperfusion cues, lactate trend, vasoactive safety |
| ARDS and mechanical ventilation | icu | oxygenation trend, ventilator alarm response, provider escalation |
| New atrial fibrillation | telemetry | rhythm recognition, rate symptoms, anticoagulation awareness |
| Complete heart block | telemetry | bradycardia danger signs, monitoring, rapid escalation |
| Stroke alert | emergency | last-known-well, neurologic cues, time-sensitive pathway |
| STEMI arrival | emergency | ECG recognition, chest pain pathway, team activation |
| Febrile neutropenia | oncology | infection risk, urgent antibiotics, protective precautions |

### Readiness dimensions

| Dimension | Weight | Evidence sources |
| --- | ---: | --- |
| Clinical Confidence | 20% | questions, flashcards, simulations, case-studies |
| Skill Readiness | 18% | clinical-skills, lessons, questions |
| Medication Readiness | 18% | pharmacology, questions, case-studies |
| Telemetry Readiness | 14% | ecg, questions, simulations |
| Simulation Readiness | 18% | simulations, case-studies |
| Orientation Progress | 12% | lessons, clinical-skills, case-studies |

### Commercial package mapping

| Package | Included tracks | Entitlement strategy |
| --- | --- | --- |
| New Grad Base Package | medical-surgical, community, home-care, long-term-care | Use the existing NEW_GRAD tier entitlement for transition-to-practice foundations. |
| ICU Specialty Add-On | icu, nicu | Gate as a New Grad specialty add-on layered on top of NEW_GRAD. |
| Telemetry Add-On | telemetry | Gate as a telemetry-focused New Grad add-on with ECG dependencies. |
| Emergency Add-On | emergency | Gate as an emergency-readiness New Grad add-on. |
| Perioperative Add-On | perioperative, pacu | Gate perioperative and PACU transition modules together as a New Grad add-on. |
| Cardiac Add-On | cardiac | Gate cardiac transition modules as a New Grad add-on with optional ECG/Advanced ECG upgrade routing. |
| Specialty Library Add-On | labour-delivery, postpartum, pediatrics, mental-health, dialysis, oncology | Gate less-common specialty transition tracks as a bundled New Grad add-on library. |

### Counts from checked-in catalog (not live DB)

| Metric | Value | Notes |
| --- | ---: | --- |
| Lessons in `new-grad-transition-catalog.json` | 40 | Minimum target 60 |
| Catalog meta `totalQuestions` | 120 | Illustrative only; **live** flashcard/question/CAT pools come from Postgres + entitlement gates. Run `cd nursenest-core && npx tsx scripts/write-new-grad-hub-report.mts` with DATABASE_URL for optional Prisma augmentation (future). |

### Topic coverage expectations (content program)

Transition-to-practice, prioritization/delegation, medication safety, clinical judgment, deterioration, shift scenarios, SBAR, documentation, safety/risk, infection control, scope, time management, therapeutic communication, basic labs, med math, skills refreshers, confidence/study plan.

### SEO / theme / leakage (engineering status)

- **SEO:** Pathway `seoTitle` / `seoDescription` present on registry object: Yes.
- **Theme:** Hubs use `[data-theme]` + semantic tokens (`ExamPathwayHubPremiumModules` surfaces). E2E captures ocean + midnight + aurora where configured.
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

hub_lessons, flashcards, practice_tests, pathway_cat_landing, labs, med_calc, clinical_skills, pharmacology, ngn_tools, weak_areas, clinical_scenarios, osce
