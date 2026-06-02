# NurseNest Clinical Review System Specification

**Date:** 2026-05-31  
**Purpose:** Define the clinical review workflow and data model required to make NurseNest visibly trustworthy and clinically credible.

## Current Evidence

- Public healthcare authority pages display clinical review status, reviewer name, credentials, specialty, reviewed date, updated date, next review date, quality gate, references, and related learning.
- ECG curriculum configs include `clinicalReviewStatus`, `reviewedAt`, `reviewedBy`, guideline version, stale checks, and advanced-topic CI-style governance.
- Pediatric ECG governance tests require advanced pediatric ECG topics and cases to be reviewed and dated.
- Blog pages can display `lastReviewedAt` and reviewer metadata.
- Evidence governance flags missing reviewers and missing review dates as blockers for high-risk content.
- Content review policy exists publicly, but it states reviewer attribution appears "when provided" and reviewers are used "where available"; this is not strong enough for broad YMYL authority.

## Clinical Review States

Use one canonical review state model:

| State | Meaning | Public behavior |
| --- | --- | --- |
| `draft` | Authored but not ready for review. | Not indexable. |
| `editorial_review` | Structure, clarity, SEO, internal links, and policy checks underway. | Not indexable unless already published legacy content. |
| `clinical_review` | Assigned to qualified reviewer. | Not indexable for new YMYL content. |
| `clinically_reviewed` | Approved by qualified reviewer with date and scope. | Eligible for publication. |
| `needs_update` | Published but guideline/source/blueprint/freshness issue detected. | Public page may remain live with update queue; high-risk pages should show review notice if stale. |
| `archived` | No longer current or strategically useful. | Noindex, redirect, or remove based on SEO decision. |

## Reviewer Profile Requirements

Required:

- Name.
- Credentials.
- Profession.
- Specialty areas.
- License region or jurisdiction.
- Bio.
- Reviewable content areas.
- Active/inactive status.
- Credential verification date.

Optional:

- Public profile photo.
- External profile links.
- Institutional affiliations.
- Conflict disclosure.

## Review Record Requirements

Each review event should record:

- `contentId`
- `contentType`
- `reviewerId`
- `reviewScope`: `clinical_accuracy | medication_safety | exam_alignment | scope_of_practice | pediatrics | critical_care | mental_health | pharmacology | labs | ecg`
- `decision`: `approved | approved_with_edits | changes_requested | rejected`
- `reviewedAt`
- `nextReviewDue`
- `guidelineVersion`
- `referenceSetVersion`
- `notesInternal`
- `publicSummary`
- `auditActorId`

## Workflow

1. **Author submits content.**
2. **Editorial review checks:**
   - Required sections.
   - Reading level.
   - Duplicate content.
   - Internal links.
   - SEO metadata.
   - Disclaimer fit.
3. **Evidence review checks:**
   - Source quality.
   - Source freshness.
   - Claim-to-source mapping for high-risk claims.
   - Reference formatting.
4. **Clinical reviewer reviews:**
   - Clinical accuracy.
   - Safety and escalation.
   - Scope of practice.
   - Exam alignment.
   - Profession/jurisdiction specificity.
5. **Approval is logged.**
6. **Public trust panel updates.**
7. **Freshness timer starts.**

## Content-Type Review Policy

| Content type | Reviewer required before publication? | Review cadence |
| --- | --- | --- |
| Medication/pharmacology | Yes | 6-12 months, sooner for safety alerts. |
| Labs | Yes | 12 months. |
| ECG/telemetry | Yes | 12 months or guideline update. |
| Clinical skills | Yes | 12 months. |
| Disease/care plan pages | Yes | 12 months. |
| Public lessons | Yes for high-risk topics; phased for legacy lessons. | 12 months. |
| Questions/rationales | Yes for high-risk topics and flagship pools. | Per item pool cycle. |
| CAT/readiness methodology | Yes plus measurement methodology owner. | 6 months. |
| Career/admissions pages | Editorial/factual review. | 6 months. |

## Public UI Standard

Every clinically reviewed page should display:

- Review status.
- Reviewer name and credentials.
- Specialty.
- Review date.
- Last updated date.
- Next review due date for authority pages and high-risk clinical pages.
- References or evidence summary.
- Report-an-issue link.

Team labels such as "NurseNest Clinical Content Team" may appear as secondary attribution, but they should not replace named reviewer profiles for YMYL authority pages.

## Admin Requirements

Extend `/admin/eeat-editorial` with:

- Reviewer assignment queue.
- Overdue review queue.
- High-risk unreviewed content queue.
- Review audit log.
- CSV export by reviewer/status/content type.
- Blockers for public indexing when required reviewer data is missing.

## Migration Plan

1. Normalize existing team labels into temporary internal reviewer groups.
2. Add named reviewer profiles for real clinical reviewers.
3. Backfill public authority pages first.
4. Backfill medication, labs, ECG, and clinical skills.
5. Backfill highest-traffic lessons and question-bank previews.
6. Require named review for all new YMYL authority content.
