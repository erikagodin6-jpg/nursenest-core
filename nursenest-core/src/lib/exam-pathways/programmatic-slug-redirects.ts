/**
 * Optional permanent redirects: `/{programmaticSlug}` → a single exam hub path.
 *
 * **Do not** add entries for slugs that:
 * - Are indexable programmatic SEO pages (rewritten to `/seo/[slug]` for everyone), or
 * - Apply to **multiple** country or product hubs with no single canonical destination.
 *
 * **Why NCLEX-RN, NP practice, allied guides, and PN practice slugs are omitted:** the same
 * public URL serves US and Canada (or multiple NP specialties). Redirecting to one hub
 * would send the wrong audience to the wrong country or track. Breadcrumbs and internal
 * links use `getPathwayProgrammaticSeoLanding` for context-specific navigation instead.
 *
 * **History:** `rex-pn-practice-questions` and `rex-pn-exam-prep` previously redirected only
 * to the Canada REx-PN hub, which stranded US NCLEX-PN users who followed those URLs.
 * Those redirects were removed so the shared PN programmatic pages stay canonical at `/{slug}`.
 */
export const PROGRAMMATIC_SLUG_TO_PATHWAY_PATH: Record<string, string> = {};
