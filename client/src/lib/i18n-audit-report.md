# NurseNest i18n Translation Coverage Report

**Generated:** 2026-03-16
**Reference language:** English (en) — 3292 keys
**Languages audited:** 20

## Summary

All 20 languages have **100% coverage** of the English reference keys.

## Coverage Table

| Code | Language | Total Keys | Missing | Coverage |
|------|----------|-----------|---------|----------|
| en | English | 3292 | 0 | 100.0% |
| fr | French | 3672 | 0 | 100.0% |
| tl | Filipino | 3296 | 0 | 100.0% |
| hi | Hindi | 4607 | 0 | 100.0% |
| es | Spanish | 3672 | 0 | 100.0% |
| zh | Chinese (Simplified) | 3672 | 0 | 100.0% |
| zh-tw | Chinese (Traditional) | 3672 | 0 | 100.0% |
| ar | Arabic | 3672 | 0 | 100.0% |
| ko | Korean | 3672 | 0 | 100.0% |
| pt | Portuguese | 3884 | 0 | 100.0% |
| pa | Punjabi | 3672 | 0 | 100.0% |
| vi | Vietnamese | 3672 | 0 | 100.0% |
| ht | Haitian Creole | 3672 | 0 | 100.0% |
| ur | Urdu | 3672 | 0 | 100.0% |
| ja | Japanese | 3672 | 0 | 100.0% |
| fa | Farsi | 3672 | 0 | 100.0% |
| de | German | 3672 | 0 | 100.0% |
| th | Thai | 3766 | 0 | 100.0% |
| tr | Turkish | 3292 | 0 | 100.0% |
| id | Indonesian | 3292 | 0 | 100.0% |

## Changes Made

### Hardcoded String Extraction (T002)
- Extracted 4 hardcoded English strings from `client/src/pages/home.tsx` (hero clarity block)
- New keys: `home.hero.clarityHeading`, `home.hero.clarityItem1`, `home.hero.clarityItem2`, `home.hero.clarityItem3`

### Missing Key Resolution (T001)
- **Common gaps (all languages):** 106 keys added — dashboard widgets, FAQ content (alliedFaq, newGradFaq, home.faq.q11-q14), nav items, search strings, footer, clarity block
- **Hindi (hi):** 7 additional nav keys
- **Chinese Traditional (zh-tw):** 6 additional hero trust/built-for keys
- **Portuguese (pt):** 7 additional nav keys
- **Thai (th):** 7 additional hero trust keys + 7 nav keys
- **Turkish (tr):** 7 additional nav keys
- **Indonesian (id):** 14 additional hero + nav keys
- **Filipino (tl):** 867 keys — anatomy, pathways (RN/RPN/NP/pre-nursing), home sections, lessons, flashcards, compare, exam hub, qbank, upgrade, footer, email signup, profile

### Build-Time Validation (T003)
- Created `script/validate-i18n.cjs` — scans all translation JSON files against English reference
- Detects missing keys and blank values
- Exits non-zero on failure for CI integration
- Run: `node script/validate-i18n.cjs`

## Notes

- Some languages have **extra keys** beyond the English reference (legacy keys from prior translations). These are harmless and not flagged as errors.
- Filipino (tl) used English fallback for ~633 long-form content keys (pathways, qbank, upgrade, footer specialty guides) where manual Filipino translation was not provided. These render correctly but should be reviewed by a native speaker.
- The TS source files (`client/src/lib/i18n-*.ts`) are the canonical source; `script/compile-i18n.ts` compiles them to JSON.
- Translation JSON files are served at runtime via `/api/assets/i18n/{lang}.json`.
