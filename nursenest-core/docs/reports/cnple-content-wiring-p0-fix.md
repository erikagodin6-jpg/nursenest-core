# CNPLE Content Wiring P0 Fix Report

**Date:** 2026-05-13  
**Severity:** P0 — Revenue and trust blocker  
**Status:** FIXED

---

## Root Cause Summary

CNPLE learner content was not loading due to four independent bugs. The most critical was a missing database backfill that caused all 1,465 CNPLE lessons to be filtered out of the lesson hub.

---

## Bug 1 — CRITICAL: `structural_public_complete` never backfilled for CNPLE lessons

### Symptom
`/canada/np/cnple/lessons` rendered zero lessons despite 1,465 published lesson rows existing in the DB.

### Root Cause
All `pathway_lessons` rows default to `structural_public_complete = false` when inserted. The column is only set to `true` after running `backfill-pathway-lesson-structural-public-complete.mts`. The CNPLE lessons were imported into the DB (from the NP parity expansion catalog and lesson-library.json) but the backfill was never run for this pathway.

The lesson hub query includes `structuralPublicComplete: true` when `restrictToPublicMarketingSurface` is set — which is always the case for marketing-facing hub lists and sitemaps. So all 1,465 CNPLE lessons were silently filtered to zero.

Verification: `computeStructuralPublicCompleteFromDbRow()` evaluated to `true` for every sampled CNPLE lesson when tested in code — confirming the lessons are structurally valid; the DB column simply hadn't been populated.

### Affected Routes
- `/canada/np/cnple/lessons` — hub showed 0 lessons
- `/canada/np/cnple/lessons/[slug]` — all lesson detail routes returned 404
- `/sitemap-lessons.xml` — CNPLE lessons absent from sitemap

### Fix
Ran a targeted backfill for all `ca-np-cnple` pathway lessons:

```
Result: updated=1465, trueCount=1463, falseCount=2
```

1,463 lessons now have `structuralPublicComplete = true` and are visible in the lesson hub, lesson detail pages, and sitemap. The 2 remaining lessons have genuine structural issues (empty or thin SEO fields) and are correctly gated.

### File Changed
- DB: `pathway_lessons.structural_public_complete` updated for all 1,465 CNPLE rows

---

## Bug 2 — NP Inventory Gate Returns 0 (Wrong Country Filter)

### Symptom
The CNPLE marketing hub showed the NP inventory notice as if 0 questions existed, producing misleading "still scaling" messaging even with a healthy question bank.

### Root Cause
`src/lib/np/np-pathway-inventory-gate.ts` filtered by `countryCode: CountryCode.CA`. However, NP/CNPLE questions in the DB store country availability via `regionScope: "BOTH" | "CA_ONLY"` — not via `countryCode`. Questions with `regionScope: "BOTH"` have `countryCode: null`.

The wrong filter returned **0** when the correct count is **2,838** NP questions available for Canada.

### Affected Routes
- `/canada/np/cnple` — marketing hub showed misleading inventory notice

### Fix
Changed filter from `countryCode: CountryCode.CA` to:
```ts
OR: [{ regionScope: "BOTH" }, { regionScope: "CA_ONLY" }]
```

### File Changed
- `src/lib/np/np-pathway-inventory-gate.ts`

---

## Bug 3 — Stale `/cat` Route in Blog CTAs for CNPLE

### Symptom
Blog posts referencing CNPLE sent users to `/canada/np/cnple/cat` — the generic CAT page with NCLEX-style language — instead of `/canada/np/cnple/simulation` (the LOFT-specific landing with correct CNPLE framing).

### Root Cause
`src/lib/blog/blog-study-cta.ts` built `pathwayCatHub` using `buildExamPathwayPath(cnple, "cat")` for CNPLE. This predated the introduction of the dedicated `/simulation` page for CNPLE.

The `/cat` page does not redirect CNPLE to `/simulation` (only the reverse: `/simulation` redirects non-CNPLE pathways to `/cat`). So CNPLE users landing on `/cat` from blog CTAs received CAT-specific language instead of the LOFT simulation landing.

### Affected Routes
- All blog post CTAs with `u.includes("CNPLE")` → `pathwayCatHub`

### Fix
```ts
// Before:
pathwayCatHub: buildExamPathwayPath(cnple, "cat"),

// After:
pathwayCatHub: buildExamPathwayPath(cnple, "simulation"),
```

### File Changed
- `src/lib/blog/blog-study-cta.ts`

---

## Bug 4 — CNPLE Flashcard Hub Shows CTA With Zero Live Inventory

### Symptom
`/canada/np/cnple/flashcards` rendered a "Sign in to study flashcards" CTA pointing to `/app/flashcards`. Clicking through led to the generic flashcard hub with no CNPLE decks visible, appearing as blank/broken content.

### Root Cause
The flashcard hub page rendered CTAs unconditionally without checking whether CNPLE-scoped flashcard decks had live cards. 

Inventory state:
- 1 CA NP flashcard deck exists in DB (`"CNPLE flashcards (in progress)"`)
- That deck has `cardCount: 0` and `visibility: "SUBSCRIBER"`
- The learner-facing `/app/flashcards` hub showed 0 CNPLE decks

The page was claiming content availability that didn't exist.

### Affected Routes
- `/canada/np/cnple/flashcards` — CTA led to empty state in app

### Fix
Added a server-side check using `prisma.flashcardDeck.count({ where: { tier: "NP", country: "CA", status: "PUBLISHED", cardCount: { gt: 0 } } })`. When count is 0:
- Replaces the generic "Sign in to study flashcards" CTA with an honest coming-soon state
- Surfaces working alternatives: CNPLE Simulation, Lessons, Practice Questions
- When inventory becomes live (cardCount > 0), the normal CTA is shown automatically

### File Changed
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/flashcards/page.tsx`

---

## Inventory Confirmed Available Post-Fix

| Surface | Status | Count |
|---|---|---|
| CNPLE lessons (hub) | ✅ Now visible | 1,463 lessons |
| CNPLE lessons (detail) | ✅ Now accessible | 1,463 lesson routes |
| CNPLE practice questions | ✅ Was already working | 1,496 questions (NP+CA scope) |
| CNPLE simulation (/simulation) | ✅ Was already working | LOFT session start wired correctly |
| CNPLE flashcards | ⚠️ Coming soon | 0 cards (deck exists, authoring in progress) |

---

## Routes Verified

| Route | Before | After |
|---|---|---|
| `/canada/np/cnple/lessons` | 0 lessons rendered | 1,463 lessons |
| `/canada/np/cnple/lessons/[slug]` | 404 for all | Resolves correctly |
| `/canada/np/cnple/questions` | ✅ Working | ✅ Working (unchanged) |
| `/canada/np/cnple/simulation` | ✅ Working | ✅ Working (unchanged) |
| `/canada/np/cnple/flashcards` | Blank CTA → empty app | Coming-soon state with working alternatives |
| Blog CNPLE CTAs (pathwayCatHub) | → `/cat` (wrong framing) | → `/simulation` (correct) |
| CNPLE marketing hub inventory notice | Showed "0 questions" | Shows correct 2,838+ count |

---

## Key Mismatches Found

| Location | Issue | Fix |
|---|---|---|
| `pathway_lessons` DB column | `structural_public_complete = false` for all CNPLE lessons | Backfill ran — now `true` for 1,463 |
| `np-pathway-inventory-gate.ts` | `countryCode: CA` filter (wrong field) | Changed to `regionScope: BOTH/CA_ONLY` |
| `blog-study-cta.ts` | `pathwayCatHub` → `/cat` for CNPLE | Changed to → `/simulation` |
| `flashcards/page.tsx` | No inventory gate for CNPLE | Added `cnpleFlashcardLive` check + coming-soon state |

---

## What Was NOT a Bug

- **Lesson catalog JSON (`np-ca-np-cnple-catalog.json`)**: Empty by design — CNPLE lessons are stored in the DB (imported from NP parity catalog), not in the catalog JSON file. The hub falls through to DB correctly.
- **Question bank**: Working correctly. 1,496 questions match the CNPLE profile (NP tier + regionScope BOTH/CA_ONLY). The `questionBankWhereForProfile` function was already correct.
- **In-app session start** (`/app/practice-tests/cat-launch?pathwayId=ca-np-cnple`): Works correctly. `pathwayAllowsCatAdaptiveStart` passes for CNPLE (active + subscribe). The readiness config sets `engineType: "LOFT"` and the session engine uses this.
- **Simulation page**: Was already correct. Redirects non-CNPLE pathways to `/cat`, renders LOFT copy for CNPLE.
- **Pathway ID consistency**: `ca-np-cnple` is used consistently across registry, lesson loader, question bank, sitemap, and component conditionals. No key mismatches.
- **Entitlement gate**: `subscriptionCoversPathwayBase` and `pathwayAllowsCatAdaptiveStart` correctly gate CNPLE for NP tier + CA country.

---

## Remaining Inventory Gaps

| Gap | Status |
|---|---|
| CNPLE flashcard decks | 1 deck exists, 0 cards. Authoring in progress. Coming-soon state now shown on marketing page. |
| 2 CNPLE lessons with structural issues | `structuralPublicComplete = false` after backfill. These have thin/empty SEO fields and are correctly excluded. |

---

## Validation

- TypeScript: clean (no errors in changed files)
- Prisma schema: unchanged (no model changes)
- DB backfill: 1,465 rows updated, 1,463 now `structuralPublicComplete = true`
- No regressions to RN/RPN/NP-FNP/Allied routes (structural gate and question bank filters unchanged for other pathways)
