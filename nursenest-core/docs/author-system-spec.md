# NurseNest Author System Specification

Date: 2026-06-01

Status: Architecture specification only. Do not create public routes until implementation approval.

## Purpose

Create a durable author infrastructure that proves who creates NurseNest educational content, what expertise they bring, which assets they contributed to, and how their work is reviewed.

## Current State Evidence

- `BlogPost` already supports `authorDisplayName`, `authorCredentials`, and `authorBio`.
- `BlogPostingJsonLd` emits a `Person` author when blog author fields exist.
- `EeatContentAttribution` displays author data when present and falls back to NurseNest editorial disclosure.
- No repository evidence was found for dedicated public author profile routes such as `/authors/[slug]`.
- Lessons, questions, flashcards, ECG, labs, clinical skills, CAT, and practice exams do not share a first-class author model in Prisma.

## Author Entity Requirements

Recommended database additions for a future migration:

| Entity | Required fields |
|---|---|
| `ContentAuthor` | id, slug, displayName, credentials, profession, licenseRegion, specialtyAreas, shortBio, longBio, headshotAssetId, sameAsLinks, status, createdAt, updatedAt. |
| `AuthorCredential` | authorId, credentialText, credentialType, issuingBody, country, verificationStatus, verifiedAt, expiresAt. |
| `AuthorContribution` | authorId, contentType, contentId, contributionRole, contributionSummary, contributedAt. |
| `AuthorReviewerRelationship` | authorId, reviewerId, contentType, contentId, reviewStage, approvedAt. |

Credential display must avoid implying active licensure unless verified. If a license cannot be verified, use credential format such as "RN educator" only when evidence exists.

## Contribution Roles

- Primary author
- Clinical contributor
- Nursing education writer
- Psychometric/item writer
- SEO/editorial contributor
- Localization contributor
- Updating editor

## Public Author Pages

Future route pattern:

- `/authors/[slug]`

Required page sections:

- Name and credentials.
- Clinical/education background.
- Specialty expertise.
- Content contribution summary.
- Reviewed/approved relationship summary.
- Publicly verifiable professional links when available.
- Recent contributed content.
- Editorial disclosure: "NurseNest validates content through editorial and clinical review workflows; author pages do not replace clinical advice."

## SEO Requirements

Each author page should include:

- Canonical URL.
- `Person` JSON-LD with `name`, `jobTitle`, `description`, `knowsAbout`, `sameAs`, `worksFor`.
- Breadcrumb JSON-LD.
- `noindex` for incomplete/unverified author profiles.
- Index only when minimum profile completeness is met: verified display name, credential line, specialty areas, bio, at least three reviewed content contributions or explicit reviewer relationship.

## UI Requirements

Public content pages should use a shared author/reviewer strip:

- Blog: byline near title, full attribution card after hero.
- Lessons: compact "Written by / Clinically reviewed by / Updated" row near lesson header.
- Public question samples: "Reviewed under NurseNest item-writing standards" with linked methodology.
- ECG/labs/pharmacology: reviewer specialty displayed next to review date.

Use existing shared primitives where possible:

- `EeatContentAttribution`
- `BreadcrumbJsonLd`
- semantic surfaces/tokens

## Admin Requirements

Admin author tools should support:

- Searchable author registry.
- Credential verification status.
- Contribution assignment.
- Bulk author backfill for legacy/static content.
- "Needs author" queue from E-E-A-T audit output.
- Profile completeness score.

## Publish Gate

Indexable YMYL content should require one of:

- Named author plus editorial review.
- Named clinical reviewer plus NurseNest editorial author.
- Institutional author with explicit explanation and queued named-author remediation.

Flag status:

- `AUTHOR_REQUIRED`
- `AUTHOR_PROFILE_INCOMPLETE`
- `AUTHOR_CREDENTIAL_UNVERIFIED`
- `AUTHOR_OK`

