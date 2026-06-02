# UK RN Blueprint Expansion and Readiness Framework

Date: 2026-05-31

Status: Hidden Draft Foundation

Do not publish. Do not expose in navigation, sitemap, search, learner dashboards, pricing pages, or pathway selectors.

## Pathway

| Field | Value |
| --- | --- |
| Country | United Kingdom |
| Regulator | Nursing and Midwifery Council (NMC) |
| Examination | CBT + OSCE |
| Profession | Registered Nurse |
| Internal Hub | `/admin/global-expansion/hubs/uk/rn` |
| Reserved Public Route | `/uk/rn` |
| Visibility | Hidden |
| Publication Status | Draft |
| Indexing | Noindex |

## Mature Inventory Targets

| Asset Type | Mature Target |
| --- | ---: |
| Lessons | 750 |
| Flashcards | 10,000 |
| Questions | 5,000 |
| Simulations | 200 |
| OSCE Stations | 250 |
| NGN-Style Cases | 250 |
| Bowties | 150 |
| Matrix Cases | 150 |

## Core Blueprint Domains

| Domain | Lessons | Questions | Flashcards | Simulations |
| --- | ---: | ---: | ---: | ---: |
| NHS Structure and Pathways | 40 | 200 | 300 | 8 |
| NMC Code and Professional Practice | 40 | 200 | 300 | 8 |
| Duty of Candour | 30 | 150 | 250 | 6 |
| NEWS2 and Deterioration | 60 | 400 | 700 | 18 |
| SBAR Communication | 30 | 175 | 300 | 10 |
| Safeguarding Adults | 35 | 200 | 350 | 8 |
| Safeguarding Children | 35 | 200 | 350 | 8 |
| Medicines Management | 80 | 600 | 1,000 | 18 |
| Infection Prevention and Control | 40 | 250 | 400 | 8 |
| Adult Nursing | 150 | 1,000 | 1,600 | 35 |
| Mental Health Nursing | 70 | 450 | 800 | 12 |
| Children's Nursing | 60 | 400 | 700 | 12 |
| Leadership and Delegation | 60 | 350 | 600 | 10 |
| Documentation and Record Keeping | 20 | 125 | 250 | 6 |
| End-of-Life Care | 20 | 125 | 250 | 6 |
| **Allocated Total** | **770** | **4,825** | **8,150** | **173** |
| **Remaining Expansion Reserve** | **-20** | **175** | **1,850** | **27** |

The supplied blueprint domain rows allocate 770 lessons against a mature lesson target of 750. This 20-lesson overage is preserved for blueprint-review visibility instead of silently changing domain targets. Remaining question, flashcard, and simulation reserves are intentionally preserved for OSCE-specific remediation, mixed-domain safety cases, and final blueprint balancing after NMC blueprint review.

## OSCE Blueprint Domains

Every OSCE station must map to one or more of these station domains.

### Assessment

- Vital signs.
- Focused assessments.
- Escalation.

### Communication

- Patient interactions.
- Family interactions.
- Difficult conversations.
- Capacity and consent.

### Medication Administration

- Rights of medication administration.
- Safety checks.
- Documentation.

### Clinical Skills

- Wound care.
- Catheters.
- Injections.
- Oxygen therapy.
- Specimen collection.

### Documentation

- Nursing notes.
- Escalation records.
- Safety reporting.

## UK-Specific Clinical Expectations

All content must use UK practice terminology where appropriate.

Use:

- A&E.
- NEWS2.
- SBAR.
- Duty of Candour.
- Registered Nurse Associate references when applicable.
- NHS pathways.

Avoid:

- Excessive American terminology.
- US-only medication, documentation, or escalation framing unless explicitly used for comparison.

## Medication Governance Requirements

UK RN content must include:

- Controlled Drugs.
- Patient Group Directions.
- Medicines Reconciliation.
- Double-Checking Processes.
- Medication Error Reporting.

## Safeguarding Requirements

UK RN content must include:

- Adults at Risk.
- Child Protection.
- Domestic Abuse.
- Modern Slavery Awareness.
- Mental Capacity Considerations.

## Clinical Judgment Requirements

Minimum: 250 UK-specific case studies.

Required case categories:

- Deterioration recognition.
- Escalation.
- Medication safety.
- Safeguarding.
- Communication failures.
- Documentation failures.

## Publication Locks

Every generated asset must contain:

- `status=draft`
- `published=false`
- `visibleInNavigation=false`
- `learnerAccessible=false`
- `launchReady=false`
- `adminOnly=true`
- `noindex=true`
- `country=uk`
- `exam=nmc-cbt-osce`
- `READY_FOR_PUBLICATION=false`
- `defaultState=DRAFT_ONLY`

## Additional Governance Requirements

No content may be published until all review gates are complete:

- NMC blueprint review completed.
- UK terminology audit completed.
- Clinical review completed.
- Editorial review completed.
- SEO localization review completed.
- Translation review completed, when translations are introduced.

## Success Criteria

The UK RN ecosystem should eventually support:

- CBT preparation.
- OSCE preparation.
- International nurse adaptation.
- NHS onboarding.
- Clinical communication training.
- Medication safety competency.
- Deterioration recognition.
- Safeguarding competency.

Until every publication gate clears, this pathway remains hidden, admin-only, noindex, and unavailable to learners or search engines.
