# NurseNest Schema Expansion Roadmap

Date: 2026-06-01

Status: Technical SEO roadmap based on current schema helpers.

## Current Schema Evidence

Implemented in `src/components/seo/seo-json-ld.tsx`:

- `OrganizationJsonLd`
- `WebSiteJsonLd`
- `WebPageJsonLd`
- `BlogPostingJsonLd`
- `PathwayLessonMedicalEducationJsonLd`
- `ExamPrepCourseProgramJsonLd`
- `BlogFaqPageJsonLd`
- `ProgrammaticPageJsonLd`
- Marketing fallback breadcrumb JSON-LD

Observed usage:

- Homepage and many marketing surfaces emit `WebPageJsonLd`.
- Blog pages emit `BlogPostingJsonLd` and FAQ JSON-LD when available.
- Lesson detail pages emit `PathwayLessonMedicalEducationJsonLd`.
- Exam pathway hubs emit `ExamPrepCourseProgramJsonLd`.
- Legal pages emit breadcrumb JSON-LD.

## Gaps

| Schema | Current status | Gap |
|---|---|---|
| Organization | Present | Needs `sameAs`, logo, contactPoint, founding info if verified. |
| WebSite | Present | SearchAction points to `/question-bank`; can improve with site search only if actual search exists. |
| WebPage | Present | Good base coverage. |
| BlogPosting | Present | Needs `author.url`, `reviewedBy.url`, `citation`/`isBasedOn` where reliable. |
| BreadcrumbList | Present | Good coverage through components/fallbacks. |
| FAQPage | Present | Must remain only for visible FAQ content. |
| Course / EducationalOccupationalProgram | Present | Needs richer `hasCourseInstance`, `teaches`, `about`, `audience`, no unsupported credential-awarded claims. |
| Person | Partial within BlogPosting | Needs dedicated author/reviewer profile pages and stable `@id`s. |
| Review / AggregateRating | Not recommended yet | Do not add until verified review collection and moderation methodology exists. |
| Product / Offer | Not part of this audit | Use carefully only on pricing/product pages with real offers and no exam outcome exaggeration. |
| LearningResource | Present | Expand to flashcards, question banks, practice exams, labs, ECG, pharmacology when trust metadata exists. |

## Expanded Schema Strategy

### Author and Reviewer Entities

Add stable `Person` nodes:

- `https://nursenest.ca/authors/{slug}#person`
- `https://nursenest.ca/reviewers/{slug}#person` or shared author profiles where appropriate.

Use:

- `name`
- `jobTitle`
- `description`
- `knowsAbout`
- `sameAs`
- `worksFor`
- `hasCredential` only when modeled carefully and supported.

### Content References

For high-risk educational pages:

- Use `citation` for visible citations when stable.
- Use `isBasedOn` for major guidelines where appropriate.
- Avoid hidden citation schema that is not visible on the page.

### Course and Program Pages

Use `Course` and `EducationalOccupationalProgram` for:

- NCLEX-RN
- REx-PN
- NCLEX-PN
- CNPLE
- NP certification pathways

Do not claim an occupational credential is awarded by NurseNest. Use `teaches` and `educationalCredentialAwarded` only when the schema meaning is accurate.

### Practice and CAT Pages

Use `LearningResource` and `WebPage`. Avoid claiming official NCLEX simulation equivalence beyond accurate "exam-style" language unless independently validated.

### Outcomes Pages

If future outcomes are published:

- Use `Dataset` or `Report`-style Article schema only when methodology is public.
- Avoid `AggregateRating` for pass rates.

## Implementation Order

1. Add Person schema IDs to blog author/reviewer JSON-LD once author pages exist.
2. Expand lesson JSON-LD to support named author/reviewer and review dates.
3. Add `citation` where visible references exist.
4. Add Course schema to all current revenue pathway hubs.
5. Add schema contract tests for FAQ visibility, Person URL presence, and no unsupported Review/AggregateRating.

