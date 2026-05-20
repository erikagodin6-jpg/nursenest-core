# SEO Authority Cluster Rollout

Date: 2026-05-12

## Pages Created Or Hardened

This rollout adds a registry-backed public authority cluster for:

- CNPLE: `/canada/np/cnple` plus questions, study guide, case-based questions, provisional registration, LOFT exam, pharmacology, and clinical judgment.
- REx-PN: `/canada/rpn/rex-pn` plus questions, study guide, CAT, pharmacology, client needs, practice exam, and test plan.
- Respiratory Therapy: `/allied-health/respiratory-therapy` plus exam prep, practice questions, ABGs, mechanical ventilation, oxygen therapy, airway management, and pulmonary function testing.

Each page includes unique metadata, self-referencing canonical URL, visible breadcrumbs, FAQ content, structured WebPage/Breadcrumb/FAQ JSON-LD, sibling internal links, tables, case-based reasoning, common mistakes, exam-day guidance, and CTAs into lessons, questions, CAT/simulation, flashcards, or RT drills.

## Sitemap Additions

- Added `/sitemap-authority-clusters.xml`.
- Added that child sitemap to the canonical `/sitemap.xml` index.
- The sitemap is static, DB-free, deduplicated, and uses the shared XML response headers/ETag path.

## Internal Linking Changes

- Every authority page links to sibling pages in the same topical cluster.
- CTAs link into live learning surfaces: questions, lessons, flashcards, CAT/simulation, and RT ventilator/ABG surfaces.
- Footer now includes natural links to CNPLE questions, REx-PN questions, and RT ABG practice.

## Structured Data Added

- `WebPage` JSON-LD on every authority page.
- `BreadcrumbList` JSON-LD matching visible breadcrumbs.
- `FAQPage` JSON-LD matching visible FAQ copy.

## Indexing Risks

- The project historically normalizes practical nursing marketing hubs to `/canada/pn/rex-pn`; this rollout intentionally supports the requested `/canada/rpn/rex-pn` authority routes with self-canonicals. Watch Search Console for duplicate clustering between PN and RPN URL families.
- RT pages are public and indexable; future allied occupation sitemap work should avoid adding duplicate RT URLs under a second route pattern.
- Content is registry-backed and static. If later AI generation expands this cluster, it should pass the same unique-title, FAQ, internal-link, and non-thin-content contract before publication.

## Remaining Gaps

- Homepage body copy was not changed to avoid destabilizing the premium redesign without a Figma process.
- Blog and lesson body cross-linking was not bulk-edited; the footer and authority cluster provide the initial crawl graph.
- Full visual CLS validation depends on running the app with Playwright in a local browser session.

## Highest-Priority Future Keywords

- CNPLE practice exam
- CNPLE prescribing questions
- CNPLE blueprint domains
- REx-PN medication questions
- REx-PN prioritization questions
- REx-PN client needs practice
- Respiratory therapy ABG interpretation practice
- Mechanical ventilation practice questions
- Oxygen delivery device questions

## Fastest-Win Opportunities

- `/canada/np/cnple/questions`
- `/canada/np/cnple/loft-exam`
- `/canada/rpn/rex-pn/questions`
- `/canada/rpn/rex-pn/cat`
- `/allied-health/respiratory-therapy/abgs`
- `/allied-health/respiratory-therapy/mechanical-ventilation`
