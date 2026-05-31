# NurseNest Reference Management Specification

**Date:** 2026-05-31  
**Purpose:** Design a reference system for clinical accuracy, E-E-A-T, evidence freshness, and safe healthcare education publishing.

## Current Evidence

- Healthcare authority pages display references publicly and emit citations in schema.
- `nursing-mechanism-explainers.ts` supports `apa7References`.
- Blog pages sanitize public article HTML and account for structured APA references.
- Evidence governance models:
  - `EvidenceSource`
  - `ContentEvidenceCitation`
  - source confidence
  - risk domains
  - review cadence
  - stale source detection
- Reference validation engine can classify source quality levels such as `primary_guideline`, `peer_reviewed_article`, `textbook`, `regulatory_source`, and `professional_association`.
- Flashcards can carry `primarySources`, guideline version, and accessed date.

## Current Gaps

- References are not uniformly required across lessons, questions, flashcards, CAT/practice exams, labs, ECG, pharmacology, and clinical skills.
- Some systems store references as arrays or raw fields rather than a shared reference registry.
- Public pages do not consistently display source lists or evidence currency.
- Claim-to-reference mapping exists in governance code but is not yet universal in authoring workflow.

## Reference Data Model

Recommended future entities:

### ReferenceSource

- `id`
- `title`
- `authors`
- `organization`
- `sourceType`: `clinical_guideline | drug_reference | textbook | peer_reviewed_study | regulatory_source | professional_standard | local_policy | expert_review`
- `publicationYear`
- `publishedAt`
- `version`
- `url`
- `doi`
- `isbn`
- `accessedAt`
- `confidence`: `low | moderate | high | authoritative`
- `riskDomains`
- `reviewCadenceMonths`
- `apaCitation`

### ContentReference

- `contentId`
- `contentType`
- `sourceId`
- `claim`
- `supports`: `answer | rationale | distractor | clinical_reasoning | exam_strategy | general`
- `locator`: page, chapter, table, guideline section, URL anchor, or DOI.
- `addedBy`
- `reviewedBy`
- `reviewedAt`
- `visiblePublicly`

### ReferenceSet

- `id`
- `contentId`
- `version`
- `approvedBy`
- `approvedAt`
- `nextReviewDue`
- `changeSummary`

## Required Reference Policy

| Content type | Minimum reference requirement |
| --- | --- |
| Medication/pharmacology | Drug reference plus guideline/professional source where relevant. |
| Labs | Laboratory interpretation reference plus clinical guideline/professional source for actions. |
| ECG/telemetry | Guideline/professional cardiology or resuscitation source plus clinical reviewer. |
| Clinical skills | Textbook/professional standard or facility-policy-neutral procedural source. |
| Disease/care plan pages | 3+ sources, including guideline/professional organization where possible. |
| Questions/rationales | Source mapping required for high-risk medication, pediatric, emergency, ECG, and scope-of-practice claims. |
| Flashcards | Source required for dosage, contraindication, emergency, and absolute clinical claims. |
| Blog/SEO authority pages | References visible for clinical education pages; career/admissions pages need official data sources. |

## APA Support

The reference renderer should support:

- APA 7 formatted text.
- Inline source labels.
- External URL.
- Access date where web source is volatile.
- DOI where available.
- Source type badge.
- Review freshness badge.

## Public Display Standard

Public authority and educational pages should show:

- References section.
- "Evidence reviewed" date.
- Reviewer name/credentials.
- Source type labels for high-risk pages.
- Educational disclaimer.

Do not overload simple product landing pages with full reference lists, but always link to the methodology or source policy when clinical claims are present.

## Governance Rules

- High-risk clinical content without references is not publishable.
- Stale references create `needs_update`.
- Broken references enter remediation queue.
- Low-quality web sources cannot be the only support for clinical advice, pharmacology, labs, ECG, pediatric, emergency, or scope content.
- Local facility policy may be mentioned only as a limitation, not as a universal source.

## Migration Plan

1. Preserve current `apa7References`, `primarySources`, and authority-page references.
2. Build a normalizer that extracts references into `ReferenceSource` and `ContentReference`.
3. Backfill medication, lab, ECG, clinical skills, and care plan pages.
4. Add source completeness to `/admin/eeat-editorial`.
5. Block new high-risk YMYL content from publishing without reference coverage.
