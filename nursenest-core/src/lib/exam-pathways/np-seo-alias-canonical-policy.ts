/**
 * NP SEO alias canonical & structured-data policy
 * ================================================
 *
 * **Registered NP keyword segments** (`aanp-practice-test`, `ancc-fnp-practice-test`, …) resolve to the same
 * {@link ExamPathwayDefinition} as the canonical hub (`/us/np/fnp`, etc.) via
 * `resolveExamPathwayFromMarketingHubSegment`.
 *
 * ### Canonical URLs (`<link rel="canonical">` + `openGraph.url`)
 *
 * | Route shape | Canonical |
 * |-------------|-----------|
 * | `/{country}/np/{alias}` (overview) | **Self** — the keyword URL is the indexable landing. |
 * | `…/lessons`, `…/lessons/{slug}`, `…/lessons/topics/{topic}`, `…/questions`, `…/pricing` | **Core pathway URL** — `buildExamPathwayPath(pathway, …)` so Google consolidates depth on one URL tree. |
 *
 * Users may still browse under the alias path for session continuity (pagination, lesson links); metadata
 * identity stays on the core pathway for subpages.
 *
 * ### BreadcrumbList JSON-LD + visible crumbs
 *
 * For **subpages**, breadcrumbs omit `hubBasePath` so hub + child URLs in schema match **canonical** pathway paths.
 * That keeps BreadcrumbList aligned with `alternates.canonical` and avoids claiming a different URL as the current
 * document in structured data.
 *
 * For the **alias overview only**, pass `hubBasePath` so the third crumb / schema item is the keyword URL, matching
 * self-canonical on that page.
 *
 * ### FAQ / other schema
 *
 * Unchanged: FAQ JSON-LD on the hub is pathway-scoped, not URL-alias-scoped.
 */

export {};
