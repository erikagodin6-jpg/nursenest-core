# French Canadian Nursing Ecosystem Phase 1 Masterplan

Date: 2026-05-31

Status: `DRAFT - NOT READY FOR PUBLICATION`

## Purpose

Prepare NurseNest for future French Canadian nursing exam publication without machine-translating English content or exposing incomplete French pathways to search engines.

Priority order:

1. REx-PN
2. Canadian NCLEX-RN
3. CNPLE

## Deliverables

This Phase 1 package includes:

1. `docs/french-canadian-content-inventory-audit.md`
2. `docs/french-canadian-blueprint-gap-analysis.md`
3. `docs/french-canadian-lesson-inventory-roadmap.md`
4. `docs/french-canadian-question-inventory-roadmap.md`
5. `docs/french-canadian-flashcard-roadmap.md`
6. `docs/french-canadian-blog-roadmap.md`
7. `docs/french-canadian-seo-roadmap.md`
8. `docs/french-canadian-publication-readiness-report.md`
9. `docs/french-canadian-monetization-readiness-report.md`
10. `docs/french-canadian-workload-estimate.md`

## Key Finding

French infrastructure exists, but French Canadian content readiness is effectively 0% for launch. Existing `fr-intl` pages are not sufficient because they are generic international French resources, not Canadian French exam-prep content with REx-PN, Canadian NCLEX-RN, or CNPLE alignment.

## Readiness Snapshot

| Pathway | French publication readiness | Recommended posture |
|---|---:|---|
| REx-PN | 0% | Build first; keep draft/admin-only. |
| Canadian NCLEX-RN | 0% | Build second after REx-PN workflow proves quality. |
| CNPLE | 0% | Build third with NP reviewer capacity. |

## Non-Negotiables

- Do not machine-translate English lessons, questions, or rationales.
- Do not publish French pathway pages until review gates pass.
- Do not include French pages in sitemap or hreflang while preview/noindex.
- Do not imply French premium readiness before the learner product is actually usable in French.
- Do not mix European-only terminology into Canadian nursing content without validation.

## Recommended Next Build Step

Create the French Canadian content governance schema/tags and authoring templates before writing large volumes:

- `fr-CA` lesson template,
- `fr-CA` question contract,
- `fr-CA` flashcard contract,
- `fr-CA` blog frontmatter standard,
- reviewer checklist,
- publication gate test/report.

Once the templates are approved, commission the first REx-PN pilot batch:

- 50 lessons,
- 500 questions,
- 1,000 flashcards,
- 10 NGN cases,
- 15 bowties,
- 15 matrix questions,
- 50 blog articles.

The pilot should remain `published=false`, `launchReady=false`, `visibleInNavigation=false`, `indexable=false`, and `adminOnly=true` until all clinical, language, and SEO reviews pass.

