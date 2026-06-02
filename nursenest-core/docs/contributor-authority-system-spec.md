# NurseNest Contributor Authority System Specification

Date: 2026-06-01  
Status: Architecture specification only. Do not implement code from this document without a separate approved engineering task.  
Replaces: `docs/author-system-spec.md` as the recommended future authority model.  
Scope: RN, RPN/LPN, NCLEX-RN, NCLEX-PN, CNPLE, FNP, AGPCNP, PMHNP, WHNP, PNP-PC, Pre-Nursing, New Graduate, Allied Health, and future NurseNest products.

## 1. Executive Summary

The current NurseNest author specification is a useful starting point, but it is too narrow for healthcare E-E-A-T. Nursing education authority cannot be proven by a simple author profile alone. NurseNest needs a contributor infrastructure that records who wrote, clinically reviewed, educationally reviewed, edited, advised on, referenced, and approved each piece of content.

Current repository evidence shows partial foundations:

- `BlogPost` supports `authorDisplayName`, `authorCredentials`, `authorBio`, `medicalReviewerName`, `medicalReviewerCredentials`, `lastReviewedAt`, `reviewDueAt`, `requiresReferences`, `medicalRiskFlags`, `sourcesJson`, and `apaReferences`.
- Static long-tail blog markdown commonly includes `authorDisplayName: NurseNest Editorial` and `medicalReviewerName: Clinical review board (educational)`.
- `BlogPostingJsonLd` can emit author/reviewer `Person` JSON-LD when data exists.
- `PathwayLessonMedicalEducationJsonLd` supports YMYL-oriented `MedicalWebPage`, `Article`, and `LearningResource` schema.
- Generated question, flashcard, and lesson draft models include `reviewStatus`, `reviewedById`, and `reviewedAt`.
- ECG video questions include `manualReviewedAt`, `manualReviewedBy`, `clinicianReviewedAt`, `clinicianReviewedBy`, `medicalQaStatus`, `qaStatus`, and `publishSafetyStatus`.
- Admin E-E-A-T dashboard and scoring infrastructure exists under `src/lib/admin/eeat-*` and `src/lib/eeat/eeat-scoring.ts`.

Critical gaps:

- No first-class contributor registry exists in Prisma.
- Blog attribution is string-based, not entity-based.
- Clinical review is not universal across lessons, question banks, CAT, readiness methodology, labs, ECG, pharmacology, clinical skills, and care plans.
- "Clinical review board (educational)" is not enough for high-risk healthcare trust unless the board composition, review scope, and verification process are public.
- Public contributor pages do not yet exist.
- Contributor verification, audit logs, specialty scope, and review expiry are not normalized.

Recommended architecture: create a Contributor Authority System with a canonical contributor registry, credential verification records, content contribution links, review events, public trust surfaces, structured data emitters, and publish gates. This system should make a Google quality rater able to answer: who created this, who reviewed it, what qualifies them, when was it reviewed, what evidence supports it, and how NurseNest corrects mistakes.

## 2. Contributor Architecture

### Contributor Types

| Type | Responsibilities | Permissions | Public visibility | Schema requirements | Publication requirement |
| --- | --- | --- | --- | --- | --- |
| Author | Drafts or materially writes educational content. | May create drafts; may not self-approve high-risk content. | Public when profile is verified and content is indexable. | `Person` for profile; `author` on Article/LearningResource. | Required for blogs, authority pages, lessons, and methodology pages unless institutional author is explicitly used. |
| Clinical Reviewer | Reviews clinical accuracy, patient safety, scope, and risk-sensitive claims. | May approve or block clinical publication gate within verified scope. | Public for moderate/high/critical YMYL content. | `Person` or named review board; `reviewedBy` style attribution through page graph. | Required for pharmacology, labs, ECG, clinical skills, NP, question banks, CAT/readiness methodology, and high-risk lessons/blogs. |
| Educational Reviewer | Reviews pedagogy, clarity, cognitive level, learning objective alignment, and exam relevance. | May approve educational readiness gate. | Public optional; visible on methodology and flagship educational pages. | `Person` optional; internal evidence required. | Required for lessons, questions, flashcards, cases, and simulations. |
| Subject Matter Expert | Provides domain expertise without necessarily writing final copy. | May advise, annotate, and sign off on specialty content. | Public when permission and verification exist. | `Person`, `knowsAbout`, `affiliation`. | Required for advanced specialty content when the clinical reviewer does not cover that specialty. |
| Editor | Ensures style, accuracy of claims, formatting, SEO safety, and policy compliance. | May move content from editorial review to clinical/SEO review. | Usually internal; public only if editorial leadership page exists. | Usually none on page; Organization/editorial policy references. | Required for public content before publication. |
| Advisory Board Member | Provides strategic, curricular, clinical, or regulatory guidance. | May not approve individual content unless also assigned as reviewer. | Public when verified and consented. | `Person`, `memberOf`, `knowsAbout`. | Supports platform authority but does not replace content-level review. |
| Research Contributor | Provides evidence reviews, reference packets, guideline summaries, or literature support. | May attach evidence packages; cannot clinically approve unless credentialed. | Usually internal; public optional on major authority pages. | `Person` optional; citation package required. | Required when content depends on complex evidence synthesis. |
| Curriculum Lead | Owns pathway blueprint alignment, sequence, assessment design, and readiness model. | May approve curriculum structure and blueprint mapping. | Public for major pathway hubs when verified. | `Person` or `OrganizationRole` pattern through profile page. | Required for exam pathways, CAT methodology, readiness methodology, and institutional products. |

### Contributor Principles

1. One person can hold multiple contributor roles, but each contribution must be recorded separately.
2. Public pages must not imply active licensure, specialty certification, or clinical practice unless verification supports that claim.
3. A contributor may be public-facing only after consent, profile completeness review, and credential display approval.
4. Board-level review labels may be used only when board composition, scope, and process are documented.
5. Contributor authority must be scoped by profession, specialty, country/region, and content risk tier.

## 3. Database Design

No schema changes are implemented here. The following model is the recommended future database design.

### Core Entities

| Entity | Purpose | Key fields |
| --- | --- | --- |
| `Contributor` | Canonical person/entity registry. | `id`, `slug`, `displayName`, `credentialsDisplay`, `profession`, `primaryRole`, `status`, `publicProfileStatus`, `profileCompletenessScore`, `consentToPublicProfile`, `createdAt`, `updatedAt`. |
| `ContributorProfile` | Public and internal profile details. | `contributorId`, `shortBio`, `longBio`, `profileImageAssetId`, `clinicalBackground`, `teachingBackground`, `educationSummary`, `affiliationsSummary`, `disclosureStatement`, `sameAsLinks`, `publicContactPolicy`. |
| `ContributorCredential` | Credential and license evidence. | `contributorId`, `credentialType`, `credentialText`, `issuingBody`, `licenseRegion`, `verificationStatus`, `verifiedAt`, `verifiedByUserId`, `expiresAt`, `internalEvidenceNote`, `publicDisplayAllowed`. |
| `ContributorSpecialty` | Scoped specialty authority. | `contributorId`, `specialty`, `professionScope`, `countryScope`, `examScope`, `verificationStatus`, `verifiedAt`, `expiresAt`. |
| `ContributorRoleAssignment` | Role capability within NurseNest. | `contributorId`, `contributorType`, `allowedContentTypes`, `allowedRiskTiers`, `allowedPathways`, `status`, `assignedByUserId`. |
| `ContentContribution` | Links contributors to assets. | `id`, `contributorId`, `contentType`, `contentId`, `contentVersion`, `contributionRole`, `contributionSummary`, `publicDisplayMode`, `contributedAt`. |
| `ContentReviewEvent` | Auditable review decision. | `id`, `contributorId`, `contentType`, `contentId`, `contentVersion`, `reviewType`, `riskTier`, `decision`, `reviewedAt`, `expiresAt`, `notes`, `evidenceSnapshotId`, `auditLogId`. |
| `EvidenceSnapshot` | Captures references used during review. | `id`, `contentType`, `contentId`, `version`, `referencesJson`, `guidelineSources`, `sourceFreshnessScore`, `createdAt`. |
| `ContentCorrectionEvent` | Public/internal correction trail. | `id`, `contentType`, `contentId`, `reportedBy`, `issueType`, `severity`, `status`, `resolutionSummary`, `resolvedAt`, `publicCorrectionRequired`. |
| `ContributorAuditLog` | Immutable authority audit trail. | `id`, `actorUserId`, `action`, `entityType`, `entityId`, `beforeJson`, `afterJson`, `createdAt`. |

### Public vs Internal Profile Fields

| Field | Public? | Notes |
| --- | --- | --- |
| Name | Yes | Required for indexable public profile. |
| Credentials | Yes, if verified | Use display-safe credential line. |
| Profession | Yes | Must not exceed verified evidence. |
| Specialty | Yes, if verified or clearly framed as experience area | Avoid unverified board-certification implication. |
| Education | Public summary optional; details internal | Do not publish sensitive documents. |
| Experience | Public summary optional | Use factual, verifiable phrasing. |
| Affiliations | Public if current/consented | Internal if unverifiable or sensitive. |
| Clinical background | Public summary | Must avoid patient or employer confidential details. |
| Teaching background | Public summary | Useful for educational E-E-A-T. |
| Profile image | Public optional | Consent required. |
| Bio | Public | Reviewed for unsupported claims. |
| Contribution history | Public for published/indexable assets | Internal for drafts, hidden products, or sensitive work. |
| License region | Public only if verified and consented | Internal record required for review permissions. |
| Verification status | Public simplified label; internal detail retained | Example: "Credentials verified by NurseNest on [date]." |
| Credential verification date | Public optional; internal required | Public date supports trust. |
| Specialty verification date | Public optional; internal required | Required for specialty reviewer pages. |
| Public disclosure statement | Yes | Required if conflicts or advisory/paid role exists. |
| Verification evidence files | No | Internal only. |
| Legal name different from display name | No | Internal only unless contributor chooses disclosure. |
| Reviewer notes | No | Internal only. |

### Content Type Coverage

The contribution layer must support:

- Blog posts.
- Lessons and pathway lessons.
- Question banks and individual questions.
- Flashcards.
- Practice exams.
- CAT methodology and CAT item pools.
- Readiness methodology pages.
- ECG lessons/cases/simulations.
- Lab interpretation content.
- Pharmacology content.
- Clinical skills.
- Care plans and assignment tools.
- Authority pages.
- Simulations and clinical cases.

## 4. Workflow Design

### Universal Lifecycle

| State | Meaning | Public eligibility |
| --- | --- | --- |
| `draft` | Content exists but has not entered review. | Not public. |
| `review` | Content is under editorial, educational, clinical, SEO, or methodology review. | Not public unless already published and undergoing routine update. |
| `approved` | Required gates passed for the current version. | Can be staged. |
| `published` | Public and indexable if SEO/indexing gates pass. | Public. |
| `stale` | Review date expired, guideline changed, or risk flagged. | Public only if low risk; noindex or demote high-risk content. |
| `archived` | Retired or replaced. | Redirect/noindex. |

### Review Requirements By Content Type

| Content type | Minimum review requirements |
| --- | --- |
| Blog | Author or institutional editorial author, editor review, references for medical-risk flags, clinical reviewer for moderate/high/critical health topics, last updated, next review date. |
| Lesson | Author/curriculum source, educational review, clinical review for clinical content, blueprint/pathway review, references for high-risk topics. |
| Authority page | Named author or curriculum lead, clinical reviewer if clinical claims exist, SEO review, references/methodology, trust panel. |
| Pharmacology | Clinical reviewer with medication safety competence, reference evidence, review expiry 6-12 months, scope check by role. |
| Labs | Clinical reviewer, normal range context disclaimer, critical-value/escalation review, references, review expiry 6-12 months. |
| ECG | Clinical reviewer, waveform/interpretation fidelity review, escalation safety review, review expiry 6-12 months. |
| Care plans | Nursing educator review, clinical reviewer for diagnosis/intervention safety, educational-use disclaimer. |
| Clinical skills | Clinical reviewer, procedure safety check, documentation considerations, role/scope check. |
| Question banks | Item writer/contributor, educational reviewer, clinical reviewer for moderate/high-risk items, psychometric/item-quality review, rationale/hint/pearl gate. |
| CAT methodology | Psychometric/curriculum lead review, clinical safety review for item selection, transparency statement, limitations. |
| Readiness methodology | Educational measurement review, data limitations, outcome-claim compliance review, no unsupported pass-rate claims. |

### Risk-Tiered Reviewer Requirements

| Risk tier | Examples | Required reviewer evidence |
| --- | --- | --- |
| Low | Study tips, time management, admissions planning | Editor or educational reviewer. |
| Moderate | General assessment, common disorders, care planning | Nursing educator or clinician reviewer. |
| High | Pharmacology, labs, ECG, pediatrics, maternity, mental health, emergency, NP management | Licensed clinician or verified specialty reviewer within scope. |
| Critical | Medication dosing, high-alert meds, suicide risk, shock, sepsis, cardiac arrest, pediatric emergencies, pregnancy/lactation, prescribing | Specialty reviewer plus evidence snapshot and shorter review expiry. |

### Review Decisions

| Decision | Meaning |
| --- | --- |
| `approved` | Can proceed to next gate. |
| `approved_with_minor_edits` | Editor can apply non-clinical edits without re-review. |
| `changes_required` | Must return to draft/review. |
| `blocked` | Cannot publish until clinical/educational issue is resolved. |
| `scope_escalation_required` | Reviewer lacks sufficient scope or specialty verification. |
| `stale_review` | Previous approval expired or source changed. |

## 5. EducationalTrustPanel Specification

### Purpose

Create a universal public trust surface that shows attribution and review evidence without pretending NurseNest provides medical advice. It should work across lessons, blogs, ECG, labs, pharmacology, authority pages, clinical skills, care plans, CAT, and readiness pages.

### Component Name

`EducationalTrustPanel`

This is a specification only; do not implement in this task.

### Required Display Fields

| Field | Display rule |
| --- | --- |
| Written By | Show named author if verified; otherwise show "NurseNest Editorial" with transparent institutional-author explanation. |
| Clinically Reviewed By | Required for moderate/high/critical YMYL content. Link to reviewer profile if public and verified. |
| Educational Review | Show named reviewer or NurseNest educational review process for lessons/questions/methodology. |
| References | Show citations or "References available in content" link. High-risk content cannot omit references. |
| Last Updated | Always show for indexable health education. |
| Last Reviewed | Show when clinical or educational review occurred. |
| Next Review Date | Required for high/critical content; optional for low-risk content. |
| Editorial Policy | Link to editorial policy. |
| Content Review Policy | Link to content review process. |
| Report Issue | Link to correction/report issue workflow. |
| Disclaimer | Educational-use disclaimer, scoped to page context. |

### Content-Type Variants

| Surface | Panel placement | Required emphasis |
| --- | --- | --- |
| Blog | Below title/hero and near references | Author, reviewer, references, dates |
| Lesson | Near lesson header and at footer | Review status, updated date, related methodology |
| ECG | Near top of page/module | Clinical reviewer, waveform fidelity, escalation disclaimer |
| Labs | Near top and near reference ranges | Reviewer, range caveat, critical-value disclaimer |
| Pharmacology | Near top and medication safety sections | Reviewer, medication safety, review cadence |
| Authority pages | Below hero and near methodology | Author/reviewer, methodology, references |
| Clinical skills | Near skill overview | Reviewer, scope/safety, documentation |
| Care plans | Near output area | Educational support disclaimer, reviewer if public template |
| CAT | Methodology page and CAT start surface | Psychometric/curriculum review, limitations |
| Readiness pages | Methodology and results explanation | Measurement limits, reviewer/curriculum lead |

### Fallback Rules

1. If no named author exists, use institutional attribution and mark `AUTHOR_BACKFILL_REQUIRED`.
2. If high-risk content lacks a verified clinical reviewer, block publication or noindex existing content until reviewed.
3. If review date is expired, show stale status internally and trigger update queue; for high/critical content, prevent promotional use.
4. If references are missing for high-risk content, block publication.

## 6. Structured Data Plan

### Contributor Pages

| Page type | Required schema | Optional schema | Indexing rule |
| --- | --- | --- | --- |
| Contributor profile | `ProfilePage`, `Person`, `BreadcrumbList` | `Organization` connection through `worksFor` or `affiliation` | Index only when verified, consented, and complete. |
| Reviewer profile | `ProfilePage`, `Person`, `BreadcrumbList` | `knowsAbout`, `sameAs`, `hasCredential` where safe | Index only for verified public reviewers. |
| Advisory board page | `AboutPage`, `Organization`, `Person` list | `ItemList` | Index if real members, credentials, disclosures, and consent are complete. |
| Contributor directory | `CollectionPage`, `ItemList` | `BreadcrumbList` | Index only after profiles are meaningful and not thin. |

### Content Pages

| Content type | Required schema | Optional/recommended schema |
| --- | --- | --- |
| Blog | `Article` or `BlogPosting`, `Person`/Organization author, `BreadcrumbList` | `MedicalWebPage` if clinically educational, `FAQPage` if visible FAQ exists |
| Lesson | `MedicalWebPage`, `Article`, `LearningResource`, `BreadcrumbList` | `Course` when part of course/pathway |
| Authority page | `MedicalWebPage`, `WebPage`, `LearningResource`, `BreadcrumbList` | `FAQPage`, `Course`, `EducationalOccupationalProgram` |
| Pharmacology | `MedicalWebPage`, `LearningResource` | `Course`, `FAQPage`; avoid unsupported drug advice schema |
| Labs | `MedicalWebPage`, `LearningResource` | `DefinedTermSet` for glossary-like pages |
| ECG | `MedicalWebPage`, `LearningResource`, `Course` for academy surfaces | `FAQPage`, `Article` for cluster pages |
| Clinical skills | `LearningResource`, `MedicalWebPage` | `HowTo` only if steps are educational and safe; avoid procedural medical-advice framing |
| Question bank | `LearningResource`, `Course` or `WebPage` | `FAQPage`; avoid fake reviews/ratings |
| CAT methodology | `WebPage`, `LearningResource` | `Article`; include limitations in visible content |
| Readiness methodology | `WebPage`, `LearningResource` | `Article`; no unsupported outcome schema |

### Schema Safety Rules

- Do not emit `Person` credentials that have not been verified for public display.
- Do not emit `review` or aggregate ratings unless real review data exists.
- Do not imply medical treatment advice; frame content as nursing education and exam preparation.
- Use `Organization` author only when named author is not yet available, and pair it with a transparent editorial policy.

## 7. Governance Requirements

### Publication Gates

| Content type | Minimum gate |
| --- | --- |
| Blog | Author/institutional author, editor review, references if `requiresReferences`, reviewer if medical-risk flags, trust panel metadata, schema-safe attribution. |
| Lesson | Contributor source, educational review, clinical review for clinical content, blueprint/pathway mapping, reference evidence for high-risk topics. |
| Pharmacology | Verified reviewer, medication safety references, monitoring/escalation check, role-scope check, review due date. |
| Labs | Verified reviewer, clinical significance and escalation review, range caveat, reference evidence, review due date. |
| ECG | Verified reviewer, rhythm/interpretation fidelity check, escalation safety check, review due date. |
| Clinical Skills | Verified clinical or educational reviewer, scope/safety check, documentation guidance, role applicability. |
| Authority Articles | Named or institutional author, reviewer if clinical, reference package, methodology statement, internal links, trust panel. |
| Question Banks | Item writer/contributor, clinical/educational review, rationale/distractor/hint/pearl quality gate, remediation mapping, blueprint mapping. |
| CAT Methodology | Psychometric/curriculum reviewer, limitations statement, item eligibility methodology, no unsupported pass prediction claims. |
| Readiness Methodology | Measurement reviewer, transparency statement, confidence/limitations language, no unsupported outcomes. |

### Blocking Statuses

- `CONTRIBUTOR_REQUIRED`
- `PUBLIC_PROFILE_INCOMPLETE`
- `CREDENTIAL_UNVERIFIED`
- `SPECIALTY_SCOPE_UNVERIFIED`
- `CLINICAL_REVIEW_REQUIRED`
- `EDUCATIONAL_REVIEW_REQUIRED`
- `REVIEW_EXPIRED`
- `REFERENCE_PACKAGE_REQUIRED`
- `METHODOLOGY_REVIEW_REQUIRED`
- `PUBLIC_TRUST_PANEL_INCOMPLETE`
- `SCHEMA_ATTRIBUTION_UNSAFE`

### Correction Governance

Every public content page must support a report issue path. Reports should create a correction event with:

- Content ID and version.
- Issue category.
- Clinical risk severity.
- Assigned owner.
- Resolution SLA.
- Public correction note requirement.
- Contributor/reviewer notification requirement.

## 8. Migration Roadmap

### Current Systems To Reuse

| Existing system | Reuse path |
| --- | --- |
| Blog author/reviewer fields | Backfill into `Contributor`, `ContentContribution`, and `ContentReviewEvent`. |
| `BlogPostingJsonLd` | Extend to entity-backed contributor data. |
| `PathwayLessonMedicalEducationJsonLd` | Add contributor/reviewer nodes when verified. |
| `EeatContentAttribution` | Evolve into or wrap with `EducationalTrustPanel`. |
| Admin E-E-A-T dashboard | Add contributor coverage, reviewer expiry, credential verification, and trust panel completeness. |
| Generated draft review fields | Map `reviewedById` events into `ContentReviewEvent` for promoted assets. |
| ECG clinician/manual review fields | Backfill as review events and specialty review metadata. |
| Existing publish gates | Add contributor/reviewer/reference gates instead of replacing current quality gates. |

### What Must Be Rebuilt

| Area | Reason |
| --- | --- |
| Author-only model | Too narrow for healthcare authority. |
| String-based reviewer fields | Cannot prove identity, credentials, scope, or audit trail. |
| Board label without composition | Insufficient for high-risk public trust. |
| Per-content-type ad hoc attribution | Does not scale to CAT, readiness, labs, ECG, pharmacology, and future products. |

### What Should Be Deprecated

| Existing pattern | Deprecation path |
| --- | --- |
| `authorDisplayName` as sole source of author truth | Keep as denormalized display fallback; source from `Contributor`. |
| `medicalReviewerName` as sole source of review truth | Keep as legacy/fallback; source from `ContentReviewEvent`. |
| Generic "Clinical review board (educational)" on high-risk content | Replace with named board page, composition, scope, and review event. |
| Public "clinically reviewed" claim without date/scope | Block from public display. |

### Phased Migration

| Phase | Work | Exit criteria |
| --- | --- | --- |
| 1 | Build contributor registry and verification admin model | Contributors can be created, verified, scoped, and hidden/public. |
| 2 | Backfill blog author/reviewer strings | Blog trust surfaces reference entity-backed contributors or institutional fallback. |
| 3 | Add content contribution and review events | Lessons, blogs, questions, ECG, labs, pharmacology, and skills can store review records. |
| 4 | Implement `EducationalTrustPanel` | Public pages display consistent trust evidence. |
| 5 | Add schema expansion | Public profiles and content emit safe structured data. |
| 6 | Enforce publish gates | High-risk content cannot publish without verified review and references. |
| 7 | Build correction workflow | Report issue, triage, resolution, and public correction rules are operational. |

## 9. Risk Analysis

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Fake or overstated expertise | Critical | Verify credentials before public display; block unverified credential schema. |
| Reviewer scope mismatch | Critical | Specialty/country/exam scope on reviewer assignments. |
| High-risk content with generic board review | High | Require named reviewer or documented board composition/process. |
| Public profiles become thin SEO pages | Medium | Noindex incomplete profiles; index only meaningful verified profiles. |
| Contributor availability assumed | High | Do not create fake contributors; use institutional fallback transparently until real contributors are onboarded. |
| Stale clinical reviews | High | Review expiry and stale gates by risk tier. |
| Schema overclaiming | High | Emit only verified `Person` and review metadata. |
| Privacy/licensure exposure | Medium | Separate internal verification from public display. |
| Workflow friction slows publication | Medium | Risk-tiered gates: stricter for high-risk content, lighter for study-strategy content. |
| Legacy content backlog is large | High | Prioritize high-traffic and high-risk pages first. |

## 10. Implementation Priority Matrix

| Priority | Initiative | Impact | Effort | Dependency |
| ---: | --- | --- | --- | --- |
| 1 | Contributor registry data model | Critical | High | Product approval for schema migration |
| 2 | Credential and specialty verification model | Critical | Medium-high | Contributor registry |
| 3 | Content contribution/review event model | Critical | High | Contributor registry |
| 4 | Blog attribution backfill | High | Medium | Contributor registry |
| 5 | EducationalTrustPanel design and implementation | High | Medium | Contribution/review events |
| 6 | High-risk publish gates | High | Medium | Review events and reference model |
| 7 | Contributor profile pages | Medium-high | Medium | Verified profiles and consent |
| 8 | Reviewer/advisory board public pages | Medium-high | Medium | Verified contributors |
| 9 | Structured data expansion | Medium-high | Medium | Public profiles and trust panel |
| 10 | Correction/report issue workflow | High | Medium | Content correction model |
| 11 | E-E-A-T dashboard expansion | High | Medium | Contributor coverage metrics |
| 12 | Legacy string-field deprecation plan | Medium | Low-medium | Backfill complete |

## Success Criteria Checklist

A public quality reviewer should be able to answer:

- Who created this content?
- Who clinically reviewed it?
- Who educationally reviewed it?
- What qualifies each contributor?
- Which credentials were verified?
- Which specialty scope applies?
- When was the content last reviewed?
- When is the next review due?
- What references support the content?
- How can a learner report a concern?
- How does NurseNest correct mistakes?
- How is stale or high-risk content blocked from publication?

The system succeeds when authority is not a marketing claim. It is visible, structured, verifiable, auditable, and enforced.

