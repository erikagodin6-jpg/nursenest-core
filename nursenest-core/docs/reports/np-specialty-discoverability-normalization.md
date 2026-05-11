# NP specialty discoverability normalization

## Goal

Normalize public NP SEO so generic Nurse Practitioner entrypoints behave like a specialty-discovery ecosystem rather than defaulting public traffic into `us-np-fnp` or `ca-np-cnple`.

## Sitemap URLs restored / protected

These shared discovery slugs are now explicitly treated as self-canonical, non-redirecting sitemap entries unless a real live redirect is reintroduced:

- `/np-exam-practice-questions`
- `/np-exam-prep`
- `/np-clinical-cases`
- `/cnple-practice-questions`
- `/canada-np-exam-prep`
- `/np-study-guide-canada`

Normalization details:

- `PROGRAMMATIC_SLUG_TO_PATHWAY_PATH` remains empty for shared programmatic SEO slugs.
- `SELF_CANONICAL_PROGRAMMATIC_DISCOVERY_SLUGS` now explicitly covers all six NP/CNPLE discovery slugs.
- English and localized sitemap tests verify these pages remain emitted in `seo-pages.xml` and locale marketing slices.

## Specialty pages now discoverable

Generic public NP entrypoints now resolve to discovery-first pages:

- US generic NP hub: `/np-exam-prep`
- US generic NP practice/questions: `/np-exam-practice-questions`
- US generic NP CAT / cases: `/np-clinical-cases`
- Canada generic NP hub: `/canada-np-exam-prep`
- Canada generic NP practice/questions: `/cnple-practice-questions`

Direct specialty discovery remains available for:

- `/us/np/fnp`
- `/us/np/agpcnp`
- `/us/np/pmhnp`
- `/us/np/whnp`
- `/us/np/pnp-pc`
- `/canada/np/cnple`

Public distribution changes in this workstream:

- Homepage, tier-strip, and mega-menu generic NP hubs resolve through the shared discovery pages.
- Footer specialty links remain direct-to-hub for FNP, AGPCNP, PMHNP, WHNP, PNP-PC, and CNPLE.
- Header active-state logic now recognizes both canonical NP hubs and shared NP discovery slugs.

## Remaining thin specialties

No newly identified launch blockers remain for WHNP, PNP-PC, or CNPLE after the current content expansion.

Residual depth notes:

- AGPCNP and PMHNP still rely more on the shared NP discovery ecosystem than on newly expanded specialty-specific long-tail inventory in this pass.
- Future optional expansion should prioritize more AGPCNP / PMHNP specialty-specific long-form topics if search data shows imbalance against FNP / WHNP / PNP-PC coverage.

## Canonical / hreflang risk assessment

Overall risk: low.

Why:

- Generic NP discovery URLs remain self-canonical public pages instead of ambiguous hub redirects.
- Specialty-specific hubs remain stable and country-scoped.
- Localized sitemap slices continue to emit locale-prefixed variants for shared NP discovery slugs.
- No mass redirect rewrite was introduced.

Residual watchouts:

- Generic NP discovery pages still depend on region-aware UI context for the strongest specialty ordering, so visual QA should continue checking US vs Canada presentation.
- If any of the six discovery slugs are later re-added to redirect config, sitemap emission and canonical assumptions must be revalidated immediately.

## Tests run

Focused routing and SEO contracts:

- `node --import tsx --test "src/lib/navigation/marketing-tier-nav-hub-routes.test.ts" "src/lib/marketing/marketing-route-integrity.test.ts" "src/lib/navigation/marketing-mega-menu.test.ts" "src/lib/marketing/nursing-exam-nav-validation.test.ts" "src/lib/navigation/marketing-mega-menu-active-prefixes.test.ts" "src/lib/exam-pathways/programmatic-slug-redirects.test.ts"`

Required validation commands:

- `npm run typecheck:critical`
- `npm run sitemap:validate`

Additional focused coverage referenced by this workstream:

- `src/lib/seo/sitemap-public-index-filter.test.ts`
- `src/lib/seo/pathway-programmatic-seo.test.ts`
- `src/lib/seo/programmatic-page-links.test.ts`

## Files changed

Helper / routing / redirect policy:

- `src/lib/marketing/canonical-pathway-hubs.ts`
- `src/lib/marketing/country-exam-offerings.ts`
- `src/lib/marketing/nursing-exam-nav-validation.ts`
- `src/lib/navigation/marketing-mega-menu-active-prefixes.ts`
- `src/lib/exam-pathways/practice-exams-cat-start.ts`

Existing discovery/content work included in this normalization pass:

- `src/lib/seo/programmatic-page-links.ts`
- `src/components/marketing/np-marketing-product-discovery.tsx`
- `src/lib/seo/np-advanced-seo-topics.ts`
- `src/lib/seo/np-advanced-seo-posts.ts`
- `src/lib/seo/pathway-programmatic-seo.ts`
- `src/components/layout/site-footer.tsx`
- `src/components/marketing/home/premium-homepage-routes.ts`

Tests and QA artifacts:

- `src/lib/exam-pathways/programmatic-slug-redirects.test.ts`
- `src/lib/marketing/marketing-route-integrity.test.ts`
- `src/lib/marketing/nursing-exam-nav-validation.test.ts`
- `src/lib/navigation/marketing-mega-menu-active-prefixes.test.ts`
- `src/lib/navigation/marketing-mega-menu.test.ts`
- `src/lib/navigation/marketing-tier-nav-hub-routes.test.ts`
- `tests/e2e/helpers/tier-product-matrix.ts`
- `tests/e2e/visual-qa/visual-qa-route-pack.spec.ts`
- `tests/e2e/visual-qa/aesthetic-visual-audit.public.spec.ts`
- `docs/visual-qa.md`
