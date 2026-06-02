# Multi-Country Content Audit

Date: 2026-05-30

## Objective

NurseNest should support one account-level primary exam pathway that scopes lessons, questions, flashcards, simulations, ECG, labs, medication math, clinical skills, pharmacology, analytics, and readiness without forcing learners to constantly switch countries.

This audit uses the existing exam pathway catalog and user fields:

- `User.country`
- `User.tier`
- `User.learnerPath`
- `User.targetExamPathwayId`
- `User.examFocus`
- `EXAM_PATHWAYS`

The new account preference helper is `src/lib/exam-pathways/account-exam-preference.ts`.

## Supported Primary Pathways

| Pathway | Country | Exam | Status |
| --- | --- | --- | --- |
| `ca-rn-nclex-rn` | Canada | NCLEX-RN | Active |
| `us-rn-nclex-rn` | United States | NCLEX-RN | Active |
| `ca-rpn-rex-pn` | Canada | REx-PN | Active |
| `us-lpn-nclex-pn` | United States | NCLEX-PN | Active |
| `ca-np-cnple` | Canada | CNPLE | Active |
| `us-np-fnp` | United States | FNP | Active |
| `us-np-agpcnp` | United States | AGPCNP | Active |
| `us-np-pmhnp` | United States | PMHNP | Active |
| `us-np-whnp` | United States | WHNP | Active |
| `us-np-pnp-pc` | United States | PNP-PC | Active |
| `pre-nursing` | United States | Pre-Nursing | Active |
| `pre-nursing-ca` | Canada | Pre-Nursing | Active |
| `admissions-ati-teas` | Admissions | ATI TEAS | Planned |
| `admissions-hesi-a2` | Admissions | HESI A2 | Planned |
| `admissions-casper` | Admissions | CASPER | Planned |

Future international pathways can be added by extending `EXAM_PATHWAYS` with country, exam, blueprint, and content scope metadata.

## Content Scope Model

Recommended scope values:

| Scope | Meaning | Use Case |
| --- | --- | --- |
| `shared` | Safe for every country/pathway | Heart failure basics, sepsis recognition, medication safety fundamentals |
| `both` | Explicitly valid for Canada and U.S. | Shared NCLEX clinical judgment content |
| `canada` | Canada only | REx-PN terminology, Canadian scope, Canadian health system examples |
| `united-states` | U.S. only | NCLEX-PN terminology, U.S. delegation rules, U.S. licensure references |
| `international` | Future non-Canada/U.S. content | NMC CBT, Australia RN, Saudi/UAE exams |

The helper `contentCountryScopeMatchesPathway()` provides a small contract for preventing country-specific leakage while still allowing shared content reuse.

## Content Area Audit

| Content Area | Current Scoping Signals | Readiness | Gaps / Recommendations |
| --- | --- | --- | --- |
| Questions | `pathwayId`, `countryCode`, `regionScope`, exam-specific loaders, question bank SQL filters | Strong foundation | Normalize legacy `regionScope` and `countryCode` usage into the new scope vocabulary for future generated content. Add contract coverage for Canada RN vs U.S. RN and REx-PN vs NCLEX-PN leakage. |
| Lessons | Pathway lesson loaders, `learnerPath`, `countryCode`, catalog pathway IDs, country merge tests | Strong foundation | Continue tagging Canada/U.S. divergent lessons instead of cloning full lesson sets. U.S. RN needs targeted additions for legal scope, delegation, health system differences, and blueprint nuance. |
| Flashcards | Pathway query helpers, exam inventory counts, pathway scope tests, lesson-linked virtual cards | Moderate to strong | Require every generated flashcard pool to resolve through `targetExamPathwayId` or `learnerPath`. Add a content scope field to imported/generated flashcard metadata where absent. |
| Simulations | Simulation SEO registry and clinical scenario tier focus | Moderate | Simulations should declare supported pathway IDs or scope values before launch. Future international simulations should default to `shared` only when no country-specific legal/scope assumptions exist. |
| ECG | ECG module is mostly clinical and reusable; route/module configs exist | Strong reusable base | Keep rhythm recognition shared. Mark escalation, role responsibility, and protocol language as pathway-specific when it differs by country or credential. |
| Labs | Labs engine and route loader exist; clinical lab interpretation is broadly shared | Strong reusable base | Reference ranges and reporting workflows should be tagged by country only where units, policy, or clinical workflow differs. Avoid spreadsheet-first country forks. |
| Medication Math | Med calculation engine and pathway study links exist | Strong reusable base | Keep formulas shared. Tag medication administration policy, abbreviations, and exam wording differences by country/pathway. |
| Clinical Skills | Clinical skills catalog and route context exist | Moderate | Skills should identify role/pathway assumptions. Add country/pathway tags for delegation, documentation, scope, and workplace readiness content. |
| Pharmacology | Pharmacology learning system exists | Moderate | Drug class teaching can remain shared. Add country/pathway-specific handling for naming, prescribing authority, NP scope, and legal/regulatory references. |
| Study Plans / Analytics / Readiness | `targetExamPathwayId`, learner path, benchmark cohorts, exam plan routes | Strong foundation | Prefer `targetExamPathwayId` as the cohort key for peer benchmarks, readiness, and remediation. Keep `learnerPath` synchronized until legacy reads are retired. |

## Canada-Specific Coverage Priorities

- REx-PN terminology and blueprint alignment.
- Canadian RN role language and health system examples.
- Canadian NP CNPLE competencies.
- Canadian scope, delegation, and regulated professional terminology.
- Canadian medication/lab policy examples where jurisdictional differences affect learning.

## U.S.-Specific Coverage Priorities

- NCLEX-PN and LVN/LPN terminology.
- U.S. RN legal considerations and delegation frameworks.
- U.S. health system examples.
- FNP, AGPCNP, PMHNP, WHNP, and PNP-PC specialty-specific rationales and readiness domains.
- U.S. licensure, priority frameworks, and exam blueprint nuance.

## Future International Expansion Priorities

Add new pathways by catalog entry, not by navigation fork:

- Australia RN
- New Zealand RN
- UK NMC CBT
- Ireland nursing registration
- Saudi nursing exams
- UAE nursing exams

Each new pathway should define:

- Country
- Exam
- Role track
- Blueprint
- Public hub URL
- Allowed subscription tier
- Content scope rules
- Shared-content compatibility

## Implementation Recommendations

1. Treat `targetExamPathwayId` as the durable account-level primary exam pathway.
2. Keep `learnerPath` synchronized for existing loaders until they are consolidated.
3. Use `resolvePrimaryExamPathwayId()` during signup and onboarding.
4. Use `currentPathwayLabelForPathway()` in account settings, dashboard, and pathway switchers so identical exams are country-distinct.
5. Tag generated and CMS content with `shared`, `both`, `canada`, `united-states`, or `international`.
6. Add regression tests for country leakage in questions, lessons, flashcards, and simulations.
7. Do not duplicate shared content into separate country libraries unless clinical, legal, or exam-specific differences require it.

## Open Coverage Gaps

- Admissions products are planned but not yet first-class pathway catalog entries.
- CASPER needs a dedicated product pathway and content model.
- Some legacy content still uses mixed fields (`countryCode`, `regionScope`, pathway IDs) instead of one normalized scope vocabulary.
- Clinical skills and simulations need stronger role/pathway metadata before broad international rollout.
- Future international pathways require blueprint metadata and localization policy before launch.

## Readiness Summary

The platform is structurally ready for account-level multi-country scoping because the exam pathway catalog, learner path, target exam pathway, entitlement context, and pathway-aware loaders already exist.

The main remaining work is content metadata normalization: every publishable lesson, question, flashcard, simulation, ECG activity, lab activity, medication math item, clinical skill, and pharmacology workflow should declare whether it is shared, Canada-specific, U.S.-specific, or future-international before it is exposed to learners.
