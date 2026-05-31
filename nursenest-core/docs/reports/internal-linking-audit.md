# Internal Linking Audit

Generated: 2026-05-31T22:26:52.433Z

## Scope

This source-level pass checks for the existence of link, breadcrumb, related-content, and hub-connection systems. Exact orphan/depth metrics require a production crawl export or a full crawl-health artifact.

### Internal link / breadcrumb / related-content sources

- src/app/(admin)/admin/access/page.tsx
- src/app/(admin)/admin/ai/drafts/questions/[id]/page.tsx
- src/app/(admin)/admin/ai/exam-questions/batch/page.tsx
- src/app/(admin)/admin/ai/exam-questions/page.tsx
- src/app/(admin)/admin/ai/flashcards/page.tsx
- src/app/(admin)/admin/ai/review/page.tsx
- src/app/(admin)/admin/analytics/content-quality/page.tsx
- src/app/(admin)/admin/analytics/content/page.tsx
- src/app/(admin)/admin/analytics/educator/page.tsx
- src/app/(admin)/admin/analytics/funnels/page.tsx
- src/app/(admin)/admin/analytics/page.tsx
- src/app/(admin)/admin/analytics/product-intelligence/page.tsx
- src/app/(admin)/admin/analytics/retention-risk/page.tsx
- src/app/(admin)/admin/analytics/study-performance/page.tsx
- src/app/(admin)/admin/analytics/subscriptions/page.tsx
- src/app/(admin)/admin/analytics/users/page.tsx
- src/app/(admin)/admin/analytics/weak-areas/page.tsx
- src/app/(admin)/admin/automation-logs/page.tsx
- src/app/(admin)/admin/beta/actions.ts
- src/app/(admin)/admin/beta/page.tsx
- src/app/(admin)/admin/blog/campaigns/page.tsx
- src/app/(admin)/admin/blog/draft-batch/page.tsx
- src/app/(admin)/admin/blog/library/page.tsx
- src/app/(admin)/admin/blog/page.tsx
- src/app/(admin)/admin/blog/topic-batch/page.tsx
- src/app/(admin)/admin/blueprint-compliance/page.tsx
- src/app/(admin)/admin/business-command-center/page.tsx
- src/app/(admin)/admin/clinical-scenarios/[scenarioId]/page.tsx
- src/app/(admin)/admin/clinical-scenarios/page.tsx
- src/app/(admin)/admin/content-bulk/page.tsx
- src/app/(admin)/admin/content-command-center/page.tsx
- src/app/(admin)/admin/content-coverage/page.tsx
- src/app/(admin)/admin/content-overview/page.tsx
- src/app/(admin)/admin/content-quality/page.tsx
- src/app/(admin)/admin/content/page-copy/page.tsx
- src/app/(admin)/admin/content/page-copy/preview/page.tsx
- src/app/(admin)/admin/content/page.tsx
- src/app/(admin)/admin/conversion-intelligence/page.tsx
- src/app/(admin)/admin/country-exam-readiness/page.tsx
- src/app/(admin)/admin/courses/page.tsx
- src/app/(admin)/admin/curriculum-coverage/page.tsx
- src/app/(admin)/admin/demo-users/page.tsx
- src/app/(admin)/admin/diagnostics/allied-occupation/page.tsx
- src/app/(admin)/admin/diagnostics/cat-blueprint-sessions/page.tsx
- src/app/(admin)/admin/diagnostics/page.tsx
- src/app/(admin)/admin/diagnostics/theme-qa/page.tsx
- src/app/(admin)/admin/eeat-editorial/page.tsx
- src/app/(admin)/admin/flashcards/[flashcardId]/page.tsx
- src/app/(admin)/admin/flashcards/page.tsx
- src/app/(admin)/admin/fraud/page.tsx
- src/app/(admin)/admin/generation/page.tsx
- src/app/(admin)/admin/growth-revenue-command-center/page.tsx
- src/app/(admin)/admin/hotspots/page.tsx
- src/app/(admin)/admin/hub/ai/page.tsx
- src/app/(admin)/admin/hub/publishing/page.tsx
- src/app/(admin)/admin/i18n/page.tsx
- src/app/(admin)/admin/institutions/page.tsx
- src/app/(admin)/admin/inventory/page.tsx
- src/app/(admin)/admin/lessons/blueprint-coverage/page.tsx
- src/app/(admin)/admin/lessons/generate-batch/page.tsx
- src/app/(admin)/admin/lessons/generate/page.tsx
- src/app/(admin)/admin/lessons/page.tsx
- src/app/(admin)/admin/media/page.tsx
- src/app/(admin)/admin/media/screenshots/page.tsx
- src/app/(admin)/admin/modules/allied/page.tsx
- src/app/(admin)/admin/modules/lab-values/page.tsx
- src/app/(admin)/admin/modules/med-calculations/page.tsx
- src/app/(admin)/admin/modules/page.tsx
- src/app/(admin)/admin/observability/page.tsx
- src/app/(admin)/admin/operations/page.tsx
- src/app/(admin)/admin/osce-stations/[id]/page.tsx
- src/app/(admin)/admin/osce-stations/page.tsx
- src/app/(admin)/admin/page.tsx
- src/app/(admin)/admin/pathway-launch-workflow/page.tsx
- src/app/(admin)/admin/pathway-lessons/page.tsx
- src/app/(admin)/admin/platform-ecosystem/page.tsx
- src/app/(admin)/admin/platform-governance/page.tsx
- src/app/(admin)/admin/premium-protection/page.tsx
- src/app/(admin)/admin/printables/[id]/analytics/page.tsx
- src/app/(admin)/admin/printables/[id]/page.tsx
- ... 40 more

## Priority Surfaces

| Surface | Required Link Support | Risk If Missing |
| --- | --- | --- |
| Lessons | Breadcrumbs, related lessons, related questions, flashcards, simulations, pharmacology/skills where applicable. | Thin or orphan-like pages; weaker crawl depth. |
| Blog | Related lessons/topics, exam hubs, glossary links, FAQ/schema. | Authority pages fail to pass relevance to product and education pages. |
| Questions | Related topic, lesson, rationale education, practice set, flashcards. | Question pages look thin and isolated. |
| Glossary / topic pages | Hub links, related concepts, lessons, questions. | Topic pages become sitemap-only and less index-worthy. |
| Simulation pages | Related conditions, skills, report/remediation links, pathway hubs. | High-value clinical content stays disconnected from authority clusters. |

## Unable To Verify Without Crawl Artifact

- Exact orphan page count.
- Crawl depth distribution.
- Weakly linked page list.
- Backlink/internal-link counts per URL.
- Broken internal links from production-rendered HTML.

## Measurement Plan

```bash
npm run qa:crawl-health
PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://nursenest.ca npm run qa:crawl-health:remote
```
