# NurseNest Reference Management Specification

Date: 2026-06-01

Status: Specification only.

## Purpose

Create a single evidence infrastructure for APA references, nursing textbooks, clinical guidelines, regulatory references, drug references, and professional standards.

## Current State Evidence

- `BlogPost` has `sourcesJson`, `apaReferences`, `sourceReliabilityScore`, `requiresReferences`, and `medicalRiskFlags`.
- `blog-citation-safety.ts` partitions verified admin-supplied/retrieved sources from AI-suggested stubs and excludes AI stubs from published APA lists.
- Blog pages render "References (APA 7)" when `apaReferences` exist.
- `VerifiedStudyCard` and `ClinicalNursingScenario` include `referencesJson`.
- `ExamQuestion` includes `referenceSource`.
- `evidence-governance.ts` defines source confidence, source types, risk domains, citation support targets, reviewer attribution checks, and freshness checks.
- `reference-validation-evidence-governance-engine.ts` supports reference quality, currency, broken/missing reference queues, and high-risk clinical review queue outputs.

## Reference Entity Model

Recommended future entities:

| Entity | Required fields |
|---|---|
| `EvidenceSource` | id, title, organization, sourceType, publicationYear, version, url, doi, confidence, riskDomains, reviewCadenceMonths. |
| `ContentCitation` | id, sourceId, contentType, contentId, claim, supports, quoteOrLocator, addedByUserId, reviewedByUserId, reviewedAt. |
| `ReferenceValidation` | sourceId, accessStatus, lastValidatedAt, validationMethod, notes. |
| `ApaReferenceSnapshot` | contentType, contentId, apaLines, generatedAt, sourceEnvelopeVersion. |

## Source Types

- Clinical guideline
- Drug reference
- Textbook
- Peer-reviewed study
- Regulatory source
- Professional standard
- Local/institutional policy
- Expert review

## Required Source Confidence

| Content risk | Minimum source confidence |
|---|---|
| Routine study skills | Moderate |
| General nursing education | High |
| Medication safety | Authoritative |
| Pediatrics/maternity | Authoritative |
| ECG/labs/critical care | High or authoritative |
| NP prescribing | Authoritative |
| Regulatory/licensing | Primary regulatory source |

## APA 7 Support

All public references should support:

- Generated APA line.
- Machine-readable source object.
- Original URL/DOI when available.
- Access/retrieval date only when source changes over time.
- Version/year when applicable.
- Source quality label.

## Public Rendering

Public pages should render:

- References section for high-risk content.
- "Sources reviewed" compact list for commercial pages where full citations would be too heavy.
- "Clinical references are educational and do not replace institutional policy" disclaimer for ECG/labs/pharmacology/clinical skills.

## Citation Gate

Publication should fail when:

- High-risk content has zero verified sources.
- Source is only AI-suggested.
- URL is not HTTPS unless a DOI/textbook locator exists.
- Claim lacks a locator/page/section for audit.
- Reviewer/review date missing for high-risk domains.
- Source is stale beyond review cadence.

## Priority Implementation

1. Normalize `BlogPost.sourcesJson` and `apaReferences` into reusable reference entities.
2. Add references to high-risk lesson pages.
3. Add references to ECG/lab/pharmacology pages and public samples.
4. Add reference support for question rationales and distractor rationales.
5. Build broken/stale/reference-missing queues from existing evidence governance.

