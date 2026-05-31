# NurseNest Content Governance Framework

**Date:** 2026-05-31  
**Purpose:** Define how NurseNest measures, reviews, publishes, refreshes, and retires educational content.

## Current Governance Evidence

NurseNest already has meaningful governance infrastructure:

- E-E-A-T audit artifacts:
  - `../data/audit/eeat-page-scores.json`
  - `../data/audit/eeat-content-audit.json`
  - `../data/audit/eeat-final-status.json`
  - `../data/audit/eeat-completion-queue.json`
- Admin E-E-A-T dashboard:
  - `nursenest-core/src/app/(admin)/admin/eeat-editorial/page.tsx`
  - `nursenest-core/src/components/admin/eeat-editorial-dashboard-client.tsx`
- Clinical authority publication standard:
  - `nursenest-core/docs/clinical-authority-content-standard.md`
  - `validateClinicalAuthorityStandard()` in `healthcare-authority-content-engine.ts`
- Question quality systems:
  - `question-quality-score.ts`
  - `rationale-quality-score.ts`
  - `clinical-pearl-score.ts`
  - `distractor-quality-score.ts`
- Flashcard trust metadata:
  - `flashcard-verification.ts`
- Evidence and reference governance:
  - `evidence-governance.ts`
  - `reference-validation-evidence-governance-engine.ts`
- Freshness and decay governance:
  - `content-freshness-evergreen-authority-engine.ts`
- Public policies:
  - `editorial-policy.md`
  - `content-review-policy.md`

## Current Gaps

- The E-E-A-T dashboard threshold is currently 70, while the clinical authority standard requires 90 for publication readiness.
- Lessons have the largest gap: 456 lessons missing at least one E-E-A-T section and 282 thin-content flags in `eeat-content-audit.json`.
- Public product surfaces do not consistently expose the governance that exists internally.
- Reviewer, reference, and author metadata are not yet normalized across content types.

## Canonical Content Lifecycle

| State | Definition | Indexing behavior |
| --- | --- | --- |
| Draft | Initial authoring state. | Not indexable. |
| Review | Editorial, evidence, and/or clinical review in progress. | Not indexable for new YMYL pages. |
| Clinically Reviewed | Approved by qualified reviewer with date and source set. | Eligible for publication. |
| Published | Live and indexable if SEO gates pass. | Indexable. |
| Needs Update | Published but stale, decayed, source-changed, or flagged. | Case-by-case; high-risk pages may show notice or be noindexed. |
| Archived | Retired or consolidated. | Redirect, noindex, or delete. |

## Governance Gates

### Universal Publication Gates

- No placeholder text.
- No unsupported clinical claims.
- No missing canonical URL.
- Breadcrumb UI and schema where applicable.
- Internal links to related learning assets.
- Content type and audience clearly labeled.
- Educational disclaimer present for health content.
- Author/reviewer requirements satisfied for content type.
- References present when clinical claims are made.

### Clinical YMYL Gates

- Named clinical reviewer required for high-risk topics.
- Review date required.
- Reference set required.
- High-risk medication/lab/ECG/escalation claims mapped to source or reviewer.
- Scope of practice checked for RN, RPN/LPN, NP, and future Allied Health.
- Jurisdiction labels added where content differs by country/region.

### Question Bank Gates

- Question quality score >= 85.
- Rationale quality score >= 85.
- No distractor score below 70.
- Hint does not reveal answer.
- Clinical pearl score >= 4 for publish eligibility.
- Why-incorrect and why-tempting analysis present for distractors.

### Authority Page Gates

- Clinical authority score >= 90.
- Required content blocks complete.
- 15+ meaningful internal links for major pages.
- References list visible.
- Reviewer card visible.
- Schema valid and matches visible content.

## Governance Dashboard Requirements

Extend the current E-E-A-T dashboard to report:

- Author coverage.
- Reviewer coverage.
- Reference coverage.
- Clinical review coverage.
- Review-overdue count.
- Stale content count.
- Evidence blockers.
- Outcome-claim blockers.
- Schema coverage.
- Breadcrumb coverage.
- Internal-link coverage.
- Publication readiness by content type.

## Remediation Order

1. High-traffic public pages with missing trust evidence.
2. Pharmacology, labs, ECG, clinical skills, and care plans.
3. RN/RPN/NP lessons under 70 E-E-A-T score.
4. Question pools with weak rationale/distractor/pearl scores.
5. Programmatic SEO pages flagged thin.
6. Blog posts needing review-date/reference upgrades.

## Governance Principle

NurseNest should publish fewer pages at higher confidence rather than allowing weak indexable pages to dilute topical authority. Internal tools already support that direction; the next maturity step is making the governance model universal and public where it matters.
