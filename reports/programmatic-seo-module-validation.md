# Programmatic SEO module validation (narrow)

## Files

| File | Role |
|------|------|
| `src/lib/seo/programmatic-seo-definitions.ts` | `SeoCluster`, `SeoPageDefinition` (shared, no cycle) |
| `src/lib/seo/programmatic-seo-authority-batch.ts` | `export const PROGRAMMATIC_SEO_AUTHORITY_BATCH` |
| `src/lib/seo/programmatic-registry.ts` | Imports batch from `./programmatic-seo-authority-batch`; spreads into `PROGRAMMATIC_SEO_PAGES` |

## Verification

- **Sibling import**: `import { PROGRAMMATIC_SEO_AUTHORITY_BATCH } from "./programmatic-seo-authority-batch"`
- **No circular dependency**: batch file imports only `./programmatic-seo-definitions` for types.
- **Quality gate**: `npm run validate:programmatic-seo` — duplicate slug detection and depth checks.

## Machine-readable

See `programmatic-seo-module-validation.json`.
