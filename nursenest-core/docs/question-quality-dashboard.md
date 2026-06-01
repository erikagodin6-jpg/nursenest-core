# Question Quality Dashboard

Date: 2026-06-01
Status: Executive premium question quality transformation dashboard

Source documents:

- `docs/question-quality-audit.md`
- `docs/question-quality-contract-v2.md`
- `docs/rationale-style-guide-v2.md`
- `docs/distractor-quality-framework.md`
- `docs/hint-quality-framework.md`
- `docs/clinical-pearl-standard-v2.md`
- `docs/enhanced-review-gate-framework.md`
- `docs/question-scoring-framework.md`
- `docs/question-quality-parity-report.md`
- `src/lib/questions/question-quality-score.ts`

Future academies remain locked: `published=false`, `launchReady=false`, `visibleInNavigation=false`, `indexable=false`, `adminOnly=true`.

## Executive Target

| Metric | Current Score | Target Score | Gap | Estimated Effort | Priority |
| --- | ---: | ---: | ---: | --- | --- |
| Question Quality | Not live-audited | 95% | Not scoreable | Large | P0 |
| Rationale Quality | Not live-audited | 95% | Not scoreable | Large | P0 |
| Hint Quality | Not live-audited | 95% | Not scoreable | Medium-large | P0 |
| Clinical Pearl Quality | Not live-audited | 95% | Not scoreable | Medium-large | P0 |
| Distractor Quality | Not live-audited | 95% flagship / 85% publish | Not scoreable | Large | P0 |
| Related-Content Quality | Not live-audited | 90%+ | Not scoreable | Medium | P1 |

## Why Current Scores Are Not Live-Audited

Existing question enrichment and enforcement dashboard runs report that the live `exam_questions` database could not be reached in this environment. Until a DB-backed audit runs successfully, pathway-level averages must remain `Not live-audited`.

## Pathway Ranking

| Priority | Pathway / Bank | Current Score | Target | Gap | Effort | Primary Quality Risk |
| ---: | --- | ---: | ---: | ---: | --- | --- |
| 1 | RN | Not live-audited | 95% | Not scoreable | Large | Full-pool parity, high-risk loop item quality |
| 2 | RPN / PN | Not live-audited | 95% | Not scoreable | Large | Scope, escalation, generated-template repetition |
| 3 | Pharmacology | Not live-audited | 95% | Not scoreable | Large | Medication safety, toxicity, interactions, monitoring |
| 4 | ECG | Not live-audited | 95% | Not scoreable | Large | Rhythm reasoning, escalation, medication effects |
| 5 | Labs | Not live-audited | 95% | Not scoreable | Medium-large | Trend interpretation, critical values, action thresholds |
| 6 | CNPLE | Not live-audited | 95% | Not scoreable | Medium-large | Advanced reasoning and management depth |
| 7 | FNP | Not live-audited | 95% | Not scoreable | Very large | Diagnostic reasoning, prescribing, follow-up |
| 8 | AGPCNP | Not live-audited | 95% | Not scoreable | Very large | Specialty management depth |
| 9 | PMHNP | Not live-audited | 95% | Not scoreable | Very large | Psychiatric safety and psychopharmacology |
| 10 | WHNP | Not live-audited | 95% | Not scoreable | Very large | Women's health and pregnancy risk |
| 11 | PNP-PC | Not live-audited | 95% | Not scoreable | Very large | Pediatric specificity and family education |
| 12 | Medication Math | Not live-audited | 95% | Not scoreable | Medium | Safety, unit interpretation, dose reasoning |
| 13 | Clinical Skills | Not live-audited | 95% | Not scoreable | Medium-large | Procedure reasoning and documentation |
| 14 | Pre-Nursing | Not live-audited | 95% | Not scoreable | Medium | Foundational reasoning scaffolding |
| 15 | Admissions | Not live-audited | 95% | Not scoreable | Medium | Sparse question-bank evidence |
| 16 | Allied Health | Not live-audited | 95% | Not scoreable | Very large | Profession-specific authenticity |

## Quality Backlog

| Backlog | Priority | Exit Criteria |
| --- | --- | --- |
| Run live DB-backed V2 scoring | P0 | Average scores by pathway and dimension |
| Rewrite generic rationales | P0 | No publish-eligible item contains repeated template phrasing |
| Add distractor taxonomy | P0 | Every distractor maps to a misconception type and consequence |
| Rebuild answer-safe hints | P0 | No hint reveals answer, option letter, or keyed terminology |
| Rewrite weak pearls | P1 | Pearls are bedside-relevant, exam-relevant, and non-duplicative |
| Add related-content links | P1 | Every item links to remediation content |
| Flag high-risk review queues | P1 | Critical care, emergency, pediatrics, NP, pharmacology, complex ECG reviewed |
| Identify flagship library | P2 | Top 10% score 95+ and pass enhanced review |

## Flagship Metrics To Add

Future dashboard runs should display:

- Average quality score
- Lowest-quality pools
- Highest-quality pools
- Review backlog count
- Enhanced review backlog count
- Flagship question count
- Flagship percentage by pathway
- Rationale rewrite queue
- Hint rewrite queue
- Pearl rewrite queue
- Distractor rewrite queue

## Success Criteria

The program is successful when every published question teaches what to do, why to do it, what not to do, why not to do it, and what happens if the cue is missed.

