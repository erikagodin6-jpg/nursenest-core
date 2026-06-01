# NurseNest Clinical Review System Specification

Date: 2026-06-01

Status: Architecture specification only.

## Purpose

Build a clinical reviewer system that makes NurseNest review evidence visible, auditable, and enforceable across nursing education content.

## Current State Evidence

- Blog model supports `medicalReviewerName`, `medicalReviewerCredentials`, `lastReviewedAt`, `reviewDueAt`, `medicalRiskFlags`, and `requiresReferences`.
- Blog pages display reviewer information when present.
- `/healthcare/[category]/[slug]` pages already display reviewer name, credentials, specialty, reviewed date, updated date, next review date, and quality gate.
- Some static CNPLE cases include `reviewStatus`, `reviewedBy`, and `reviewedAt`.
- Question/lesson publish gates exist, but clinical reviewer workflow is not universal across all asset types.

## Reviewer Entity Requirements

Recommended future entities:

| Entity | Required fields |
|---|---|
| `ClinicalReviewer` | id, slug, displayName, credentials, profession, specialtyAreas, licenseOrCertificationEvidence, countries, status, publicProfileStatus. |
| `ReviewerQualification` | reviewerId, qualificationType, issuer, region, verifiedAt, expirationDate, evidenceUrlOrNote. |
| `ClinicalReview` | id, reviewerId, contentType, contentId, riskLevel, reviewDecision, reviewedAt, expiresAt, notes, evidenceSnapshotId, auditLogId. |
| `ClinicalReviewAuditLog` | id, actorUserId, action, contentType, contentId, beforeJson, afterJson, createdAt. |

## Review Workflow

Required states:

1. Draft
2. Editorial review
3. Clinical review required
4. Clinical review in progress
5. Clinically reviewed
6. Approved for publication
7. Published
8. Needs update
9. Archived

## Risk-Tiered Review Requirements

| Risk tier | Examples | Reviewer requirement |
|---|---|---|
| Low | Study strategy, time management, basic exam logistics | Editorial review plus policy disclaimer. |
| Moderate | General pathophysiology, common nursing assessments, care planning | Nursing educator or relevant clinician review before broad indexing. |
| High | Pharmacology, ECG, labs, pediatric, maternity, emergency, critical care, NP prescribing | Licensed clinician or specialty reviewer, references, review date, review expiry. |
| Critical | Medication dosing, high-alert meds, sepsis/shock, cardiac arrest, suicide risk, pregnancy/lactation, pediatric emergencies | Specialty reviewer plus evidence-source validation before publication eligibility. |

## Public Display Rules

Display "Clinically reviewed" only when:

- A reviewer or named review board exists.
- Review date exists.
- Review scope is documented.
- Content has not passed its review due date.

If using a board label, display:

- Board name.
- Board composition summary.
- Review process link.
- Next-review cadence.

Avoid vague claims such as "clinician-reviewed" without reviewer identity, date, or method.

## Audit Logs

Every review action should record:

- Actor.
- Timestamp.
- Content ID and version.
- Review decision.
- Reasons/notes.
- Evidence sources reviewed.
- Expiry or next review date.
- Whether public display is allowed.

## Review Expiry Cadence

| Domain | Maximum review interval |
|---|---:|
| General study strategy | 24 months |
| NCLEX/REx-PN blueprint pages | 12 months or test-plan change |
| Pharmacology | 6-12 months |
| ECG/labs/critical values | 6-12 months |
| NP prescribing | 6 months |
| Legal/regulatory/licensing | 3-6 months |
| Public outcome claims | Before every campaign/launch |

## Blocking Statuses

- `CLINICAL_REVIEW_REQUIRED`
- `REVIEWER_CREDENTIAL_UNVERIFIED`
- `REVIEW_EXPIRED`
- `HIGH_RISK_REFERENCE_MISSING`
- `REVIEW_APPROVED`

