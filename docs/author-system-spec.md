# NurseNest Author System Specification

**Date:** 2026-05-31  
**Purpose:** Design the author infrastructure required for healthcare E-E-A-T across RN, RPN/LPN, NP, New Graduate, Pre-Nursing, and future Allied Health/international pathways.

## Current Architecture Evidence

- Blog pages already pass author fields into `BlogPostingJsonLd` and `EeatContentAttribution`:
  - `authorDisplayName`
  - `authorCredentials`
  - `authorBio`
  - `medicalReviewerName`
  - `medicalReviewerCredentials`
- `EeatContentAttribution` falls back to institutional NurseNest editorial disclosure when no named author is available.
- Lesson pages currently use `EeatContentAttribution variant="lesson"`, which displays a policy/disclaimer block but no named lesson author.
- Generated audit artifact `../data/audit/eeat-final-status.json` says blog posts without named author are `0`, while lessons use institutional author in JSON-LD and per-lesson bylines are future work.
- Healthcare authority pages use organization author plus named `reviewedBy` in schema, but do not yet model named authors separately.

## Author Model Requirements

Create a canonical author system before expanding public E-E-A-T claims.

### Author Profile

Required fields:

- `id`
- `slug`
- `displayName`
- `credentials`
- `roleTitle`
- `profession`
- `licenseRegion`
- `specialtyAreas`
- `bioShort`
- `bioLong`
- `profileImageUrl`
- `affiliations`
- `education`
- `clinicalExperienceSummary`
- `contentFocusAreas`
- `status`: `active | inactive | archived`
- `createdAt`
- `updatedAt`

Optional fields:

- `licenseVerificationUrl`
- `orcid`
- `linkedinUrl`
- `personalWebsiteUrl`
- `sameAs`
- `publicDisclosure`

### Contribution Model

Required fields:

- `contentId`
- `contentType`
- `authorId`
- `contributionRole`: `primary_author | contributing_author | editor | subject_matter_contributor`
- `contributionSummary`
- `assignedAt`
- `completedAt`
- `visibleOnPage`

### Relationship to Reviewers

Authors and reviewers may share a profile table, but the relationship must record the action:

- Author writes or contributes.
- Reviewer clinically approves.
- Editor ensures style, SEO, and policy compliance.

Do not present editors as clinical reviewers unless they have the appropriate clinical credentials and performed the clinical review.

## Database Requirements

No schema change is implemented in this audit. Recommended future tables:

| Table | Purpose |
| --- | --- |
| `ContentContributor` | Canonical person profile for authors, editors, reviewers, and subject-matter contributors. |
| `ContributorCredential` | Credentials, license region, specialty, verification URL, expiry/reverification date. |
| `ContentContribution` | Many-to-many mapping between contributors and content items. |
| `ContributorReviewRelationship` | Tracks reviewer/editor relationships for content governance and public display. |
| `ContributorAuditLog` | Records profile changes, credential updates, visibility changes, and reviewer verification. |

## SEO Requirements

Every public author page should:

- Live at `/authors/{slug}`.
- Be indexable only when profile data is complete and approved.
- Include canonical URL, title, meta description, Open Graph, and Twitter card.
- Emit `Person` schema with `name`, `honorificSuffix`, `jobTitle`, `knowsAbout`, `sameAs`, and affiliation where appropriate.
- Link to authored and reviewed content.
- Link back from content pages through visible bylines.

Avoid:

- Invented credentials.
- Anonymous clinical authors for YMYL content.
- Author profile pages for incomplete profiles.
- Claiming license status unless verified and kept current.

## UI Requirements

### Content Page Author Block

Display:

- Author name and credentials.
- Role: "Written by" or "Contributed by".
- Specialty focus when relevant.
- Link to author profile.
- Last updated date.
- Medical disclaimer link.

### Author Profile Page

Display:

- Name, credentials, role.
- Clinical/educational background.
- Specialty areas.
- Content contributions grouped by type.
- Reviewed content if the person also reviews.
- Editorial disclosure.
- Contact/report concern link routed through NurseNest, not personal medical advice.

## Publication Gates

| Content type | Minimum author requirement |
| --- | --- |
| Blog article | Named author or explicitly labeled NurseNest Editorial Team, with author page for recurring contributors. |
| Public lesson | Named author preferred; institutional author allowed only if clinical reviewer is named and sources are present. |
| Disease/medication/lab/care plan/clinical skill page | Named author plus named clinical reviewer required before indexable publication. |
| Question bank preview | Institutional author acceptable, but rationale methodology and clinical review standard must be visible. |
| CAT/readiness methodology page | Named product/education owner plus clinical/psychometric reviewer required. |

## Migration Plan

1. Reuse existing blog fields as the first public author source.
2. Add author profile routing and schema for existing named blog authors.
3. Add contributor mapping for authority pages.
4. Backfill high-value lesson authorship for RN, RPN/LPN, NP, New Graduate, and Pre-Nursing.
5. Add author completeness checks to the E-E-A-T dashboard.
6. Block new YMYL authority pages from indexing unless author and reviewer requirements are satisfied.
