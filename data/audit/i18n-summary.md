# i18n completeness audit

Generated: 2026-04-14T18:16:53.118Z

## Scope

- **Admin surfaces** are excluded from required-user UI key gating (see `required-user-ui-i18n-keys.ts`).
- Merged bundles: `nursenest-core/public/i18n/{locale}.json` (regenerate via repo root `npm run i18n:compile`).

## Required user UI chrome (nav, pills, auth, dashboard breadcrumbs, learner account shell)

- Keys checked: **88**
- Status: **pass**
- Locales: **en, fr, es, tl, hi, zh, zh-tw, ar, ko, pt, pa, vi, ht, ur, ja, fa, de, th, tr, id, it, ru**

## Counts

| Locale | Coverage % (distinct from en) | Identical-to-English keys | Empty keys |
|--------|------------------------------|---------------------------|------------|
| ar | 72% | 5711 | 0 |
| fr | 71% | 5995 | 0 |
| tl | 44% | 11562 | 0 |
| es | 27% | 15211 | 0 |
| hi | 21% | 16457 | 0 |
| zh | 21% | 16348 | 0 |
| pt | 21% | 16395 | 0 |
| ko | 20% | 16523 | 0 |
| pa | 20% | 16475 | 0 |
| vi | 20% | 16502 | 0 |
| ht | 20% | 16623 | 0 |
| ur | 20% | 16493 | 0 |
| ja | 20% | 16489 | 0 |
| fa | 20% | 16532 | 0 |
| zh-tw | 18% | 17018 | 0 |
| de | 17% | 17099 | 0 |
| th | 17% | 17166 | 0 |
| tr | 17% | 17191 | 0 |
| id | 17% | 17222 | 0 |
| it | 2% | 20330 | 0 |
| ru | 2% | 20326 | 0 |
| en | 0% | 0 | 0 |

## Placeholder / interpolation fallbacks

- Total events (compile report): **18**
- Details: `tools/i18n/reports/placeholder-fallbacks.json`

## Artifacts

| File | Purpose |
|------|---------|
| i18n-locale-inventory.json | Locales, tiers, sources |
| i18n-key-coverage-audit.json | Namespace + per-locale coverage |
| i18n-missing-keys.json | Missing vs en, empty, required UI |
| i18n-unused-keys.json | Nav key sampling + methodology |
| i18n-fallback-leakage.json | Placeholder report + identical-to-en |
| i18n-mixed-language-surface-audit.json | Heuristic signals |
| i18n-dynamic-string-audit.json | i18n scan pointers |
| i18n-user-surface-audit.json | Required UI + critical prefixes |
| i18n-content-localization-audit.json | Educational overlay files |
| i18n-route-country-exam-locale-audit.json | global-locale-matrix snapshot |
| i18n-runtime-risk-register.json | Risks |
| i18n-repair-plan.json | Next steps |
| i18n-final-status.json | Pass/fail summary |

## CI

- Run: `npm run test:i18n-user-ui` (in nursenest-core) — fails if any marketing locale misses required non-admin chrome keys.
