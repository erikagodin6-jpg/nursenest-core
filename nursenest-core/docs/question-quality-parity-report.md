# Question Quality Parity Report

Date: 2026-06-01
Status: Repository-evidenced question quality parity report

Source of truth: `docs/question-quality-audit.md`, `docs/reports/question-enrichment/question-quality-report.md`, and `docs/reports/question-enforcement/*-quality-dashboard.md`.

Future academies remain locked: `published=false`, `launchReady=false`, `visibleInNavigation=false`, `indexable=false`, `adminOnly=true`.

## Evidence Boundary

The live `exam_questions` inventory was not audited in the existing question enrichment and enforcement reports because the database was unavailable in this environment. Therefore live average quality scores, pathway-level hint quality, rationale quality, and clinical pearl quality are not currently repository-evidenced.

The current score column below reports the best available repository status:

- Directional finding from `docs/question-quality-audit.md`
- Existing maturity/readiness score where available
- `Not audited` where live scoring is required

## Pathway Quality Parity

| Pathway / Bank | Current Question Quality Score | Target | Gap | Estimated Effort | Priority | Evidence Finding |
| --- | ---: | ---: | ---: | --- | ---: | --- |
| RN | Not live-audited | 95% | Not scoreable | Large | 1 | RN authored files are structurally strong, but parity across all live pools is not evidenced |
| RPN / PN | Not live-audited | 95% | Not scoreable | Large | 2 | CNPLE practical nursing expansion shows generated-template repetition risk |
| CNPLE | Not live-audited | 95% | Not scoreable | Medium-large | 5 | NP/practical nursing quality requires diagnostic and management depth review |
| FNP | Not live-audited | 95% | Not scoreable | Very large | 6 | Specialty-specific advanced reasoning must be proven |
| AGPCNP | Not live-audited | 95% | Not scoreable | Very large | 7 | Specialty depth not live-scored |
| PMHNP | Not live-audited | 95% | Not scoreable | Very large | 8 | Psychiatric safety, diagnosis, and psychopharm quality not live-scored |
| WHNP | Not live-audited | 95% | Not scoreable | Very large | 9 | Women's health specialty depth not live-scored |
| PNP-PC | Not live-audited | 95% | Not scoreable | Very large | 10 | Pediatric primary care depth not live-scored |
| ECG | Not live-audited | 95% | Not scoreable | Large | 3 | ECG inventory maturity is 54%; 43 curated ECG questions are evidenced in prior audit |
| Labs | Not live-audited | 95% | Not scoreable | Medium-large | 4 | Labs maturity is 59%; full question quality parity not evidenced |
| Medication Math | Not live-audited | 95% | Not scoreable | Medium | 11 | Medication math maturity is 50%; quality parity not evidenced |
| Pharmacology | Not live-audited | 95% | Not scoreable | Large | 3 | Pharmacology maturity is 47%; standalone medication question registry not evidenced |
| Clinical Skills | Not live-audited | 95% | Not scoreable | Medium-large | 12 | Clinical Skills maturity is 63%; question quality parity not evidenced |
| Allied Health | Not live-audited | 95% | Not scoreable | Very large | Deferred | Allied pharmacy technician evidence is limited; aggregate allied maturity is 36% |
| Admissions | Not live-audited | 95% | Not scoreable | Medium | Deferred | No first-class question-bank evidence found in reviewed sources |
| Pre-Nursing | Not live-audited | 95% | Not scoreable | Medium | 13 | Modules include rationales but are not mapped to full premium framework |

## Quality Dimensions To Audit

Every live pathway audit must output:

- Average question quality score
- Average rationale quality score
- Average hint quality score
- Average clinical pearl quality score
- Lowest-quality pools
- Highest-quality pools
- Review backlog
- Flagship question count
- Enhanced-review backlog

## Priority Ranking

| Rank | Quality Work | Reason |
| ---: | --- | --- |
| 1 | Run DB-backed live scoring for RN and RPN/PN | Current revenue protection |
| 2 | Audit pharmacology and ECG questions | Highest safety and premium differentiation risk |
| 3 | Audit labs and medication math | Clinical reasoning and safety integration |
| 4 | Audit CNPLE and FNP | Nearer NP monetization opportunities |
| 5 | Audit remaining NP specialties | Required before NP premium expansion |
| 6 | Audit Pre-Nursing and Admissions | Quality matters, but lower clinical-risk priority |
| 7 | Audit Allied Health | Deferred until current revenue pathways mature |

