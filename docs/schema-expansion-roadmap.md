# NurseNest Schema Expansion Roadmap

**Date:** 2026-05-31  
**Purpose:** Strengthen entity recognition, E-E-A-T, crawlability, AI visibility, and rich-result eligibility while keeping schema truthful to visible page content.

## Current Schema Evidence

- `OrganizationJsonLd` and `WebSiteJsonLd` are mounted in the default marketing layout.
- `WebSiteJsonLd` includes `SearchAction`.
- `BreadcrumbJsonLd` validates public URLs and logs rejected private/system URLs.
- `BreadcrumbJsonLd` has a test verifying `BreadcrumbList` output and filtering behavior.
- Blog pages emit `BlogPosting` schema with optional `Person` author and `reviewedBy`.
- Pathway lessons have `PathwayLessonMedicalEducationJsonLd` combining `MedicalWebPage`, `Article`, and `LearningResource`.
- Authority pages emit `MedicalWebPage`, `FAQPage`, `Article`, `Organization`, references, and `reviewedBy`.
- Authority cluster pages emit `Article`, `FAQPage`, `WebPage`, and `Course`/`EducationalOccupationalProgram` for exam-prep hubs.
- Existing SEO audit docs previously flagged partial/missing schema in some page classes; some of that has since been implemented.

## Schema Guardrails

- Schema must match visible content.
- Do not add ratings, reviews, guarantees, pass rates, or claims unless visible and methodology-backed.
- Do not use medical schema to imply individualized medical advice.
- Do not emit `FAQPage` unless the FAQ is visible.
- Do not emit `Person` for fake or incomplete profiles.
- Do not put private `/app`, `/admin`, or `/api` URLs in public schema.

## Expansion Priorities

### 1. Organization and Website

Current: Present in marketing layout.

Improve:

- Add verified `sameAs` URLs when official social/professional profiles are available.
- Add `EducationalOrganization` node only if visible About/profile content supports it.
- Add contact/customer-support details if visible on Contact page.

### 2. Author and Reviewer Schema

Add:

- `Person` schema on `/authors/{slug}`.
- `ProfilePage` for author/reviewer pages.
- `reviewedBy` on clinical content where reviewer is visible.
- `knowsAbout` and credential fields for named reviewers.

### 3. Educational Content Schema

Use:

- `LearningResource` for lessons, flashcards previews, care plan guides, clinical skill guides, and study guides.
- `Course` or `EducationalOccupationalProgram` for structured exam/program hubs.
- `hasPart` relationships from hubs to lessons/questions/flashcards where public preview URLs exist.

### 4. Healthcare Authority Schema

Use carefully:

- `MedicalWebPage` for disease, medication, lab, ECG, care plan, and clinical skill pages.
- `MedicalCondition` only for actual condition entities.
- `Drug` only for medication pages with sufficient visible drug details.
- `DefinedTerm` for glossary terms.

### 5. Breadcrumb Schema

Standardize across:

- Blog.
- Lessons.
- Authority pages.
- Healthcare library.
- Pricing.
- Certification guides.
- Career/admissions pages.
- Allied Health pages.

Current `BreadcrumbJsonLd` should remain the shared primitive because it filters invalid public URLs.

### 6. FAQ Schema

Use on:

- Blog posts with two or more visible FAQ items.
- Authority pages.
- Certification guides.
- Pricing FAQs.
- Career/admissions pages.

Do not emit FAQ schema from hidden or collapsed-only content if it is not visible to users.

### 7. Outcome and Testimonial Schema

Defer broad testimonial/review schema until:

- Real user consent is captured.
- Moderation is implemented.
- Claims are visible.
- Outcome methodology is documented.

Avoid aggregate ratings unless legally and evidentially supportable.

## Implementation Roadmap

| Timeframe | Work | Effort | Risk |
| --- | --- | ---: | --- |
| 30 days | Add author/reviewer profile schema spec and shared trust panel schema mapping. | 2-4 days | Low |
| 30 days | Audit all `FAQPage` emissions for visible FAQ parity. | 1-2 days | Low |
| 30 days | Add schema coverage fields to `/admin/eeat-editorial`. | 1 day | Low |
| 90 days | Implement author/reviewer `Person` and `ProfilePage` schema after profiles exist. | 1 week | Medium |
| 90 days | Add `DefinedTerm` schema to glossary/terminology system. | 2-3 days | Low |
| 90 days | Add `Drug` and enhanced `MedicalWebPage` for medication pages with reference coverage. | 1 week | Medium |
| 12 months | Build entity graph schema relationships across conditions, meds, labs, skills, care plans, certifications, and careers. | 3-6 weeks | Medium |

## Success Metric

Schema success is not "more schema." Success is:

- Accurate structured data.
- Visible-page parity.
- Higher breadcrumb/schema coverage.
- Clear author/reviewer/entity relationships.
- Fewer orphan pages.
- Stronger AI/search understanding of NurseNest as a healthcare education network.
