# Nursing Mechanism SEO Expansion

## Scope

This pass adds a fail-closed SEO/content expansion system for high-intent nursing mechanism explainers and clinical interpretation content. It intentionally does not mass-publish incomplete posts.

## Existing Content Audit

- Lesson content: pathway lessons live under `src/content/pathway-lessons/*` and are loaded through existing pathway lesson systems.
- Blog/static posts: static long-tail markdown lives under `src/content/blog-static-longtail`; public blog routing is `/blog/[slug]`.
- Calculators/tools: public clinical tool entry points include `/tools/lab-values` and `/tools/med-math`.
- Clinical scenarios: admin and learner clinical scenario surfaces exist; this pass records scenario hooks as editorial link targets rather than changing scenario routes.
- Flashcards/practice/CAT metadata: related practice hooks point to `/question-bank`, `/practice-exams`, and `/app/dashboard` without changing learner routing.
- Internal linking components: blog auto-linking and related-reading systems already exist; this pass adds registry-level anchors for future controlled linking.
- Sitemap/blog sitemap generators: sitemap segmentation is split across `sitemap-core.xml`, `sitemap-blog.xml`, `sitemap-lessons.xml`, and related child urlsets.
- Metadata helpers: canonical origin and metadata helpers live in `src/lib/seo/canonical-site.ts`, `site-origin.ts`, and `marketing-metadata.ts`.
- Schema helpers: breadcrumb helpers exist in `src/lib/seo/breadcrumbs.ts` and `src/lib/seo/breadcrumb-utils.ts`.

## Clusters Added

Canonical registry: `src/lib/seo/nursing-mechanism-clusters.ts`.

Initial high-priority entries:

1. Why Hyperkalemia Affects the Heart
2. Hyperkalemia vs Hypokalemia ECG Changes
3. Why Burns Cause Hyperkalemia
4. Why AKI Causes Metabolic Acidosis
5. Why Hyperglycemia Causes Osmotic Diuresis
6. Why COPD Causes Barrel Chest
7. Kussmaul Respirations Mechanism
8. SIADH vs Diabetes Insipidus
9. Pyloric Stenosis Hypochloremic Hypokalemic Metabolic Alkalosis
10. Respiratory Acidosis vs Metabolic Acidosis
11. Respiratory Compensation for Metabolic Acidosis
12. ABG Interpretation for Nurses
13. Fluid Overload vs Dehydration Assessment
14. Lab Values Interpretation for Nurses
15. Hemodynamic Shock Types
16. Ventilator Alarms for Nurses
17. Oxygenation vs Ventilation
18. Acid-Base Compensation Rules
19. Anion Gap Metabolic Acidosis
20. DKA vs HHS Mechanism

## Content Status

Initial top 10 content drafts live in `src/content/nursing-mechanism-explainers.ts`.

All initial explainers are `draft`. None are published, indexed, or emitted into sitemap collectors. This is intentional because final publication requires full editorial review, minimum 1000-word body depth, and reference verification.

## SEO Rationale From GSC Query Patterns

The registry targets long-tail, high-intent mechanism queries that commonly show up as nursing learner search behavior:

- "why" mechanism searches, such as why hyperkalemia affects the heart and why AKI causes metabolic acidosis.
- comparison searches, such as SIADH vs diabetes insipidus and respiratory vs metabolic acidosis.
- clinical interpretation searches, such as ABG interpretation for nurses, lab values interpretation, and ventilator alarms.
- exam-intent searches that connect pathophysiology to nursing priorities, assessment cues, and safe escalation.

The system is designed to ingest future GSC exports by mapping query clusters to registry IDs before content is written or published.

## Internal Linking Strategy

- Explainers link back to related lesson hubs, tools, and practice surfaces.
- Registry entries require at least three internal-link targets.
- Draft content includes placeholders for related clinical scenarios without changing scenario routing.
- Lesson/tool/scenario inbound linking should be added only after an explainer is complete and published, to avoid linking learners to unavailable draft pages.

## Sitemap Policy

- Published explainers may emit canonical paths under `/nursing-mechanisms/{slug}`.
- `planned`, `draft`, and `hidden` explainers are excluded from sitemap collectors.
- Draft/hidden route requests fail closed with `notFound()` and noindex metadata.
- Canonical origin remains `https://www.nursenest.ca` through existing canonical helpers.

## Publish-Readiness Checklist

- Registry status is `published`.
- Matching content status is `published`.
- Body is at least 1000 words.
- APA 7 references are current and verified against live sources.
- Metadata title and description are unique.
- Breadcrumb JSON-LD validates and uses canonical URLs.
- At least three internal links are present and safe.
- Related lessons/tools/practice hooks match the tier and exam scope.
- No RN-only fallback is used for NP or Allied-specific topics.
- Sitemap validation passes after publication.

## Remaining Content Gaps

- Expand from the initial 20 registry rows to the full 25-per-topic editorial backlog across all 11 requested SEO clusters.
- Complete long-form 1000+ word reviewed bodies for the top 10 drafts.
- Add controlled inbound links from specific lesson/tool/scenario pages after publication.
- Add GSC export ingestion that tags query rows to registry IDs and priority scores.
- Add reviewer workflow metadata if these explainers move from static draft files to the admin blog publishing system.

## Validation Commands

```bash
npm run test:seo:nursing-mechanisms
npm run typecheck:critical
npm run sitemap:validate
```

This report is implementation evidence for the draft infrastructure pass, not a publication approval.
