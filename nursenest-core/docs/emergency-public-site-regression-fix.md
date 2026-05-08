# Emergency public site regression fix

**Branch:** hotfix/public-site-keys-theme-routing  
**Date:** 2026-05-08

## Summary

Blog and adjacent marketing surfaces: em-dash reductions in high-traffic copy, blog title clamping, semantic brand tokens on blog cards, blog index min-w-0, localized exam blog title separator, screenshot mirrors.

## Tests

- npm run typecheck: killed (OOM) in agent environment — re-run on CI.
- npm run i18n:validate: exit 1 (pre-existing RU placeholder mismatches).
- npm run test:i18n: pass.

## Screenshots

nursenest-core/preview-screenshots/emergency-public-site/ and reports/ui-redesign-preview/emergency-public-site/

Copy to reports/emergency-public-site-regression-fix.md at repo root if required by process.
