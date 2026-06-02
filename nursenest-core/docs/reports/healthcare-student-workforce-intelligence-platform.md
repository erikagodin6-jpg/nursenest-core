# Healthcare Student Insights & Workforce Intelligence Platform

Generated: 2026-05-31T05:45:35.529Z

## Implementation Summary

The workforce intelligence foundation is implemented in `src/lib/workforce/healthcare-student-workforce-intelligence.ts`.

It supports:

- Annual healthcare student survey contracts.
- Nursing, RPN/LPN, NP, RT, paramedicine, OT, PT, MLT, PSW, social work, and future profession coverage.
- Annual report definitions for nursing education, allied health education, student stress, clinical placement, exam preparation, new graduate readiness, workforce pipeline, student technology, and Canadian healthcare education.
- Aggregate-only survey reporting with a 30-response privacy threshold.
- Clinical placement insight summaries.
- Licensing exam preparation trend summaries.
- Media center assets for press summaries, downloadable graphics, and citation resources.
- Institutional benchmark summaries that never expose identifiable learner records.
- Workforce authority scoring across reports, publishable aggregates, media assets, backlink angles, and institutional use cases.

## Survey Coverage

Survey fields:

- Profession
- Country
- Province/State
- Program
- Academic Year
- Clinical Placement Status
- Employment Status
- Exam Preparation Status
- Career Goals
- Study Habits
- Technology Use
- Stress Levels
- Burnout Indicators
- Financial Concerns
- Confidence Levels
- Career Intentions

## Annual Report Library

- 2027 State of Nursing Education (2027-state-nursing-education)
- 2027 State of Allied Health Education (2027-state-allied-health-education)
- 2027 Healthcare Student Stress Report (2027-student-stress)
- 2027 Clinical Placement Experience Report (2027-clinical-placement)
- 2027 Exam Preparation Trends Report (2027-exam-prep-trends)
- 2027 New Graduate Readiness Report (2027-new-grad-readiness)
- 2027 Healthcare Workforce Pipeline Report (2027-workforce-pipeline)
- 2027 Healthcare Student Technology Report (2027-student-technology)
- 2027 Canadian Healthcare Education Report (2027-canadian-healthcare-education)

## Demo Aggregate Signals

- National cohort publishable: Yes
- National responses: 60
- Average stress: 7
- Average confidence: 7.5
- AI tool use rate: 50.0%
- Mobile study rate: 66.7%

## Placement & Exam Insights

- Placement insights publishable: Yes
- Placement delay rate: 10.0%
- Placement availability concern rate: 10.0%
- Exam: NCLEX-RN
- Active exam preparation rate: 100.0%
- Average exam study hours: 9.5

## Institutional Benchmark Posture

- Benchmark: Northern College BScN
- Publishable: Yes
- Confidence vs national: above
- Stress vs national: above
- Readiness vs national: above
- Note: Benchmark uses aggregate-only survey data and does not expose identifiable learner records.

## Media & Authority Assets

- Annual reports: 9
- Publishable aggregates: 2
- Media assets: 27
- Backlink angles: 8
- Institutional use cases: 5
- Workforce authority score: 100/100

## Next Integration Points

1. Add an annual survey collection surface with consent language and respondent anonymity controls.
2. Persist survey responses and generate aggregate-only report datasets.
3. Build public report pages only from publishable aggregates.
4. Connect media assets to the creator/affiliate ecosystem for outreach and backlink campaigns.
5. Feed institutional benchmarks into hidden school sales and reporting surfaces.
6. Refresh reports annually and publish quarterly trend updates once data volume supports it.
