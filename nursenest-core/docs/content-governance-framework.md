# NurseNest Content Governance Framework

Date: 2026-06-01

Status: Governance design based on current architecture.

## Current Governance Evidence

NurseNest already has several governance foundations:

- Public editorial policy and content review policy.
- `BlogPost` workflow fields: `postStatus`, `workflowStatus`, `requiresReferences`, `medicalRiskFlags`, `lastReviewedAt`, `reviewDueAt`, `updateNeeded`, `adminPublishLog`.
- Citation-safe blog persistence that excludes AI-suggested citation stubs from published APA references.
- Question publish gate in `governExamQuestionPublish`.
- Lesson publish gate in `governContentItemLessonPublish`.
- Lesson editorial governance rules for role/country overlays and unsafe content merges.
- Evidence governance libraries that score citations, freshness, reviewer attribution, source confidence, and risk-domain support.
- Admin E-E-A-T dashboard model that surfaces missing attribution, stale content, thin content, low internal links, and structure gaps.

## Universal Lifecycle

All lessons, questions, flashcards, practice exams, CAT pools, blogs, simulations, ECG assets, labs, pharmacology assets, and clinical skills should use:

1. Draft
2. Internal review
3. Educational review
4. Clinical review
5. SEO review
6. Ready for publication
7. Published
8. Needs update
9. Archived

## Status Mapping

| Lifecycle state | Public eligibility | Required evidence |
|---|---|---|
| Draft | No | Owner, content type, pathway, target learner, draft source. |
| Internal review | No | Structural completeness and duplicate check. |
| Educational review | No | Learning objective, reasoning depth, exam relevance. |
| Clinical review | No | Reviewer assignment and evidence package. |
| SEO review | No | Metadata, canonical, schema, internal links, no unsupported claims. |
| Ready for publication | Staged only | All gates passed; launch checklist complete. |
| Published | Yes | Public trust signals visible. |
| Needs update | Conditional | Visible page should show updated/review status or noindex if unsafe. |
| Archived | No or redirected | Archive reason and canonical replacement. |

## Quality Measurement

### Lessons

Measure:

- Structural completeness.
- Word count/depth.
- Clinical reasoning.
- Pathophysiology.
- Assessment/intervention/safety.
- References for high-risk topics.
- Role/country/exam scope.

### Questions

Measure:

- Stem realism.
- Correct answer accuracy.
- Rationale quality.
- Distractor rationales.
- Hint quality.
- Clinical pearl.
- Difficulty/cognitive level.
- Blueprint mapping.
- Readiness/remediation mapping.
- Evidence/reference source.

### Flashcards

Measure:

- Source lesson/question.
- Clinical application.
- Memory anchor.
- Exam relevance.
- Duplicate risk.
- Role scope.

### Practice/CAT Exams

Measure:

- Blueprint distribution.
- Item eligibility.
- Difficulty calibration.
- Remediation links.
- Scoring limitations.
- Psychometric review.

### Blog Posts

Measure:

- Author/reviewer attribution.
- APA references.
- Medical risk flags.
- Published/reviewed dates.
- Internal links to learning assets.
- Schema validity.
- No unsupported outcomes or clinical advice.

## Publication Blocking Rules

Block publication when:

- High-risk content lacks references.
- Clinical claims lack reviewer attribution.
- Lessons are thin or structurally incomplete.
- Questions lack rationale or fail item-shape validation.
- Blog medical-risk flags require references but citation gate fails.
- Content contains AI meta-disclaimer or placeholder language.
- Scope, country, or exam overlay is unsafe.
- Outcome/pass-rate claims lack methodology.

## Governance Metrics

Track:

- Content readiness percent.
- Clinical review coverage.
- Reference coverage.
- Author attribution coverage.
- Reviewer attribution coverage.
- Freshness compliance.
- Schema coverage.
- Correction SLA.
- Audit backlog.

## Operating Principle

Content is not trustworthy because it exists. It is trustworthy when the platform can prove who created it, who reviewed it, what evidence supports it, when it was last reviewed, and what learner outcome it is intended to support.

