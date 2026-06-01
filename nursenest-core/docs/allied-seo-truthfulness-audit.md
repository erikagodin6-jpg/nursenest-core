# Allied SEO Truthfulness Audit

Generated: 2026-06-01T12:00:37.987Z

Scope: meta titles, descriptions, canonical URLs, Open Graph, WebPage JSON-LD, breadcrumb schema, and FAQ/schema risk after the homepage.

## Executive Verdict

Profession page metadata is mostly safe because it is track-specific and count-neutral. The main SEO risks are broad claims in pricing metadata and CAT/adaptive metadata. Schema should not imply complete flashcard, mock exam, CAT, or simulation capability for Allied professions until each profession can demonstrate those surfaces after signup.

## SEO Surface Matrix

| Surface | Evidence | Verdict | Action |
| --- | --- | --- | --- |
| Profession page title/meta description | `/allied-health/[slug]` uses `prof.title` and `prof.description`. | Partially supported | Keep count-neutral metadata. Avoid adding completion, unlimited, or full-certification claims. |
| Profession canonical/Open Graph | `alternates.canonical` and OG URL use profession route. | Supported | No duplicate canonical issue found for profession landing pages in this pass. |
| Profession WebPage JSON-LD | `WebPageJsonLd` uses the same title/description/path. | Partially supported | Safe if title/description remain truth-scoped. |
| Breadcrumb schema | `alliedProfessionBreadcrumbs()` renders profession breadcrumb trail. | Supported | No unsupported feature claim identified in breadcrumbs. |
| Allied CAT metadata | `/allied/allied-health/cat` title/lead claims CAT/adaptive assessment. | Risk | No profession-specific CAT launch gate evidence in this audit; noindex or qualify until validated. |
| Pricing metadata | `/pricing` fallback description claims flashcards and mock exams. | Unsupported for Allied | Use generic pricing copy or conditional Allied metadata without flashcards/mock exams until evidenced. |
| FAQ schema | No profession-specific FAQ schema evidence was identified in audited profession page file; homepage FAQ is out of scope. | Supported with caveat | If FAQ schema is later added to profession pages, each answer must be inventory-backed. |

## Profession Metadata Review

| Profession | Route | Title verdict | Description verdict | Primary risk |
| --- | --- | --- | --- | --- |
| Respiratory Therapy | /allied-health/rrt-exam-prep | Supported | Partially supported | High readiness claims elsewhere may conflict with metadata. |
| Paramedicine | /allied-health/paramedic-exam-prep | Supported | Partially supported | High readiness claims elsewhere may conflict with metadata. |
| Medical Laboratory Technology | /allied-health/mlt-exam-prep | Supported | Partially supported | High readiness claims elsewhere may conflict with metadata. |
| Physiotherapy | /allied-health/physiotherapy-exam-prep | Supported | Partially supported | High readiness claims elsewhere may conflict with metadata. |
| Occupational Therapy | /allied-health/occupational-therapy-exam-prep | Supported | Partially supported | High readiness claims elsewhere may conflict with metadata. |
| PSW | /allied-health/psw-hca-exam-prep | Supported | Partially supported | High readiness claims elsewhere may conflict with metadata. |
| Social Work | /allied-health/social-work-exam-prep | Supported | Partially supported | High readiness claims elsewhere may conflict with metadata. |
| Psychotherapy | /allied-health/psychotherapy-exam-prep | Supported | Partially supported | High readiness claims elsewhere may conflict with metadata. |

## SEO Guardrail

No indexable Allied page should claim CAT, mock exams, flashcards, simulations, or complete readiness unless the corresponding post-signup module is demonstrable for that exact profession.
