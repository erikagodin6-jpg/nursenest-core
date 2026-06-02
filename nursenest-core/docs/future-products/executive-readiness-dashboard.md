# Future Products Executive Readiness Dashboard

Status: Dashboard specification only. No implementation or routes created.

## Purpose

The executive dashboard should report readiness and blockers for every future academy without exposing unfinished products to learners or search engines.

## Required Dashboard Views

### Portfolio Overview

| Product | Stage | Overall % | Content % | Quality % | Clinical % | Monetization % | Technical % | Marketing % | Launch Blockers |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|

### Category Readiness

Show:

- Content readiness
- Quality readiness
- Clinical readiness
- Monetization readiness
- Institutional readiness
- Marketing readiness
- SEO readiness
- Operational readiness
- Launch readiness

### Risk Scoring

Risk score should include:

- High-risk clinical content unresolved
- Monetization incomplete
- Technical reliability below threshold
- Marketing inventory missing
- SEO/indexation leak risk
- Institutional reporting gap
- Support readiness gap

### Launch Blockers

Every blocker should include:

- Severity
- Product
- Category
- Owner
- Evidence missing
- Required next action
- Due date

### Recommended Next Actions

The dashboard should rank work by:

1. Launch blocker severity
2. Revenue impact
3. Clinical risk
4. Learner impact
5. Institutional sales impact
6. Time to remediate

## Data Contract

Each product row requires:

- Product ID
- Product name
- Stage
- Owner
- Hidden status
- Publication status
- Indexing status
- Category scores
- Overall score
- Blockers
- Last audit date
- Next audit date

## Required Alerts

- Product accidentally indexable
- Product visible in navigation before approval
- Content published before launch gate
- Monetization incomplete at launch request
- High-risk content lacks clinical review
- Product score decreases by 10+ points
- Launch blocker overdue
