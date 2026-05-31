# Global Quality Audit Scorecards

## Scoring Model

Every NurseNest content asset is scored from `1-100`.

Minimum publication score: `90/100`.

| Dimension | Required For | Publish Requirement |
| --- | --- | --- |
| Clinical Accuracy | All clinical and exam content | No unresolved clinical accuracy defects |
| Educational Value | All learner-facing content | Must teach application, not just recognition |
| Exam Relevance | Questions, exams, lessons, flashcards, blogs | Must map to exam or pathway intent |
| Originality | All content | Must not be duplicate, scaffold, or filler |
| Flashcard Reusability | Lessons, questions, rationales, flashcards | Must produce retention-ready takeaways |
| Practice Exam Readiness | Questions, NGN, exams | Must support realistic exam delivery |
| CAT Readiness | CAT-eligible questions and pools | Must include blueprint, difficulty, and adaptive metadata |
| Adaptive Learning | All premium learning assets | Must route weak areas to remediation |
| Publication Score | All assets | Must be `90+` |

## Asset Scorecard Requirements

| Asset | Minimum Score | Required Special Checks |
| --- | ---: | --- |
| Lesson | 90 | Word count, pathophysiology, assessment, interventions, safety, prioritization, knowledge checks |
| Question | 90 | Plausibility, clinical realism, blueprint mapping, rationale, hint, pearl |
| Rationale | 90 | Why correct, why incorrect, safety, clinical application, exam strategy |
| Hint | 90 | Guides reasoning without revealing the answer |
| Clinical Pearl | 90 | Memorable bedside, safety, escalation, or exam insight |
| Flashcard | 90 | Clinical application, memory anchor, common mistake, exam relevance |
| NGN Case | 90 | NCJMM flow, chart data, consequence logic, remediation mapping |
| Blog | 90 | Depth, references, internal links, EEAT, no filler |
| Simulation | 90 | Patient progression, decisions, consequences, debrief |
| Practice Exam | 90 | Blueprint weighting, mixed difficulty, rationales, analytics |
| CAT Pool | 90 | CAT eligibility, discrimination metadata, blueprint balance |

## Current Governance Evidence

- `src/lib/content-quality/global-content-quality-governance.ts`
- `src/lib/questions/rationale-quality-score.ts`
- `src/lib/questions/distractor-quality-score.ts`
- `src/lib/questions/content-quality-score.ts`
- `src/lib/lessons/lesson-educational-quality-standards.ts`
- `src/lib/blog/blog-content-quality-gate.ts`
- `src/lib/blueprints/blueprint-compliance-engine.ts`

## Weekly Output

Each weekly scorecard should publish:

- Total assets audited
- Average score by asset type
- Average score by pathway
- Assets below `90`
- Critical clinical accuracy issues
- Lowest-scoring topics
- Highest-risk publication candidates
- Recommended remediation queue
