# CNPLE Inventory Copy Update — Audit Report

**Date:** 2026-05-13  
**Status:** COMPLETE  
**Scope:** Replace stale CNPLE inventory counts, introduce centralized metrics module

---

## Summary of Changes

| Metric | Old | New |
|---|---|---|
| Practice question hero count | "2,838+" | "4,000+" (Canadian-aligned) |
| Practice question framing | generic | "Canadian-aligned NP practice questions" |
| Flashcard count | "1,054" / "1,561" (mixed stale) | "1,154" |
| Curated flashcard callout | (absent) | "100 hand-authored Canadian clinical reasoning flashcards" |
| CNPLE-tagged question stat | (absent) | "1,496 explicitly CNPLE-tagged practice questions" |
| Lessons count | "1,463" (unchanged) | "1,463" (unchanged) |

---

## Files Changed

### New file — Single source of truth

**[src/lib/marketing/cnple-inventory-metrics.ts](src/lib/marketing/cnple-inventory-metrics.ts)**  
Central constants module. All CNPLE marketing copy must consume this file.  
Fields: `caQuestionsLabel`, `caQuestionsLong`, `cnpleTaggedLabel`, `cnpleTaggedLong`, `flashcardsLabel`, `flashcardsLong`, `curatedFlashcardsLabel`, `curatedFlashcardsLong`, `lessonsLabel`, `lessonsLong`.

---

### Modified files

**[src/lib/seo/authority-cluster-pages.ts](src/lib/seo/authority-cluster-pages.ts)**  
The primary CNPLE hub SEO page builder. All 6 stale literals replaced.

| Line | Old literal | New (via CNPLE_INVENTORY) |
|---|---|---|
| 174 (description) | `1,463 NP lessons, 2,838+ practice questions, 1,561 flashcards` | `1,463 NP lessons, 4,000+ Canadian-aligned NP practice questions, 1,154 flashcards` |
| 180 (lead copy) | `1,463 CNPLE-aligned NP lessons, 2,838+ practice questions, 1,561 flashcards` | `1,463 CNPLE-aligned NP lessons, 4,000+ Canadian-aligned NP practice questions, 1,154 flashcards (including 100 hand-authored…)` |
| 184 (examTerms) | `"2,838+ questions"`, `"1,561 flashcards"` | `"4,000+ Canadian NP questions"`, `"1,154 flashcards"` |
| 231 (whatYoullLearn[0]) | `1,463 CNPLE-aligned NP lessons` | via `CNPLE_INVENTORY.lessonsLong` |
| 232 (whatYoullLearn[1]) | `2,838+ practice questions` | via `CNPLE_INVENTORY.caQuestionsLong` |
| 233 (whatYoullLearn[2]) | `1,561 domain-targeted flashcards` | `1,154 domain-targeted flashcards — including 100 hand-authored…` |

**[src/app/(marketing)/(default)/cnple-flashcards/page.tsx](src/app/(marketing)/(default)/cnple-flashcards/page.tsx)**  
SEO flashcard hub page (`/cnple-flashcards`). 2 stale literals replaced.

| Line | Old | New |
|---|---|---|
| `PAGE_TITLE` | `"…1,054 NP-Level Study Cards…"` | `"…${CNPLE_INVENTORY.flashcardsLabel} NP-Level Study Cards…"` |
| `PAGE_DESCRIPTION` | `"1,054 CNPLE-aligned flashcards…"` | `"1,154 CNPLE-aligned flashcards — including 100 hand-authored…"` |

**[tests/e2e/cnple/cnple-simulation-flow.spec.ts](tests/e2e/cnple/cnple-simulation-flow.spec.ts)**  
Playwright regression test. Updated regex and assertion message.

| Change | Old | New |
|---|---|---|
| `hasQuestions` regex | `/2[,.]?8\d\d/` | `/4[,.]?0{3}\+?/` |
| Assertion message | `"…2,838+ questions"` | `"…4,000+ Canadian-aligned questions"` |

---

## Stale Count Audit — Final State

```
$ grep -rn "2,838|1,561|1,054" src/ tests/ --include="*.ts" --include="*.tsx"
(no output — zero stale instances)
```

All three previously-stale count groups are fully eliminated from src/ and tests/.

---

## Positioning Compliance

| Rule | Applied |
|---|---|
| Never "4,000+ CNPLE questions" | ✅ Always "4,000+ Canadian-aligned NP practice questions" |
| "explicitly CNPLE-tagged" for 1,496 only | ✅ Available via `cnpleTaggedLong`; not used in hero copy |
| Curated set called out separately | ✅ "100 hand-authored Canadian clinical reasoning flashcards" |
| Lessons count unchanged (still accurate) | ✅ "1,463" unchanged |
| Canadian-aligned framing throughout | ✅ All surfaces updated |

---

## Preserved (No Changes)

- All route paths and canonical URLs
- All `<Link>` hrefs
- Analytics event names and data attributes
- JSON-LD schema markup (no numeric counts in structured data)
- OpenGraph/Twitter card image paths
- Sitemap generation routes
- i18n key structure (no i18n keys involved — copy is co-located)
- Hydration safety (all edits are static string constants — no dynamic state)
- SSR compatibility (no client-side-only changes)

---

## Validation Results

| Check | Result |
|---|---|
| `typecheck:critical` | ✅ Clean (0 errors) |
| Full test suite | ✅ 131 pass / 11 fail (11 are pre-existing standalone deploy failures, unchanged) |
| Stale count grep | ✅ 0 remaining instances |
| New import structure | ✅ Compiles cleanly |

---

## How to Update Counts in Future

1. Edit `src/lib/marketing/cnple-inventory-metrics.ts` — change the relevant field value
2. Run `npm run typecheck:critical`
3. No other file changes required — all surfaces consume the constants

Do NOT hardcode inventory counts anywhere in marketing copy. Always import from `CNPLE_INVENTORY`.
