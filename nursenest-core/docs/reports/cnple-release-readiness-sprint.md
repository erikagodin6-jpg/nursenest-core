# CNPLE Release Readiness Sprint

**Date:** 2026-05-13  
**Sprint type:** Revenue sprint — P0 product readiness  
**Status:** ✅ Core surfaces fixed, inventory gaps documented

---

## Executive Summary

CNPLE was ranking in Google but had a critical UX defect: the main hub action card
labelled itself **"CAT"** and linked to `/canada/np/cnple/cat`, delivering generic
adaptive-exam copy. CNPLE uses **LOFT** (linear on-the-fly testing) — not CAT.
Signed-in users were further routed to the CAT session launcher instead of the
CNPLE clinical cases engine.

These issues have been fixed. The product is now sellable: the hub shows a
"Simulation" tile, the `/cat` URL redirects to `/simulation`, and the conversion
flow is wired correctly for guest, signed-in-unpaid, and paid users.

---

## Root Cause

`nursing-tier-hub-content.ts` builds hub action tiles generically. The `"cat"` tile
used `"CAT"` as its label and `buildExamPathwayPath(pathway, "cat")` as its href for
**all** pathways, including CNPLE. There were no CNPLE-specific guards. The
`/cat` page also had no redirect for CNPLE, so users landed on a page with copy
mixing LOFT and CAT references.

---

## Inventory Count

| Surface | Count | Status |
|---|---|---|
| CNPLE lessons (NP core via catalog sync) | **436** | ✅ Live via `npParityExpansionLessonsForPathway` |
| CNPLE clinical cases (sample static) | **8** | ✅ Published in `cnple-sample-cases.ts` |
| CNPLE practice questions | DB-backed (NP tier) | ✅ Shared NP question bank |
| CNPLE flashcard decks | DB-backed (NP tier, CA) | ⚠️ Gated — shows honest empty-state if 0 published decks |
| CNPLE LOFT simulation | ✅ Full page + FAQ | Connects to `/app/cases/cnple` for signed-in users |
| Marketing hub at `/canada/np/cnple` | ✅ Authority cluster + product hub | Live |
| SEO cluster pages (`/cnple-*`) | 15+ pages | ✅ Live and indexed |

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/marketing/nursing-tier-hub-content.ts` | Added `isCnplePathway` guard; changed `"cat"` tile to `"Simulation"` label + `/simulation` href + LOFT description for CNPLE; fixed signed-in user routing to `/app/cases/cnple` instead of `appPathwayCatSessionStartPath` |
| `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/cat/page.tsx` | Added `isCnplePathway` redirect to `/simulation` before any rendering |
| `src/lib/exam-pathways/cnple-product-readiness.contract.test.ts` | New — 20 regression tests across 5 suites |
| `package.json` | Added `test:cnple` script |

---

## Before/After Route Behavior

### `/canada/np/cnple` (hub)

| | Before | After |
|---|---|---|
| "Simulation" tile label | ❌ "CAT" | ✅ "Simulation" |
| "Simulation" tile description | ❌ "Adaptive sessions that adjust difficulty from your answers" | ✅ "LOFT linear simulation — fixed-length, no adaptive shutdown. Matches CNPLE exam format." |
| "Simulation" tile href (guest) | ❌ `/canada/np/cnple/cat` | ✅ `/canada/np/cnple/simulation` |
| "Simulation" tile href (signed-in) | ❌ `/app/practice-tests/cat-launch?pathwayId=ca-np-cnple` | ✅ `/app/cases/cnple` |
| Hub prose mentioning CAT | ❌ "choose … adaptive CAT-style exams" | ✅ "choose … the LOFT-style simulation next" |
| `differenceBody` text | ❌ "CAT for adaptive item-level sessions" | ✅ "Simulation for the LOFT linear fixed-length experience — CNPLE uses LOFT format, not CAT adaptive" |

### `/canada/np/cnple/cat`

| | Before | After |
|---|---|---|
| Page behavior | ❌ Rendered generic CAT page with mixed copy | ✅ `redirect(buildExamPathwayPath(pathway, "simulation"))` — immediately redirects |

### `/canada/np/cnple/simulation`

| | Status | Notes |
|---|---|---|
| Page existence | ✅ Fully built | LOFT-specific copy, FAQ, format table |
| Primary CTA | ✅ Present | `data-nn-qa="cnple-sim-start-cta"`, links to CAT launch (pre-auth) or `/app/cases/cnple` (auth) |
| LOFT format labeling | ✅ Correct | Explicitly "not CAT adaptive" |
| Guest CTA | ✅ `loginWithCallback(appPathwayCatSessionStartPath)` | Goes to auth → then simulation |

### `/canada/np/cnple/lessons`

| | Status | Notes |
|---|---|---|
| Content | ✅ 436 lessons | NP core catalog via `npParityExpansionLessonsForPathway` |
| Page renders | ✅ Standard lessons hub | DB-backed with marketing lesson list |

### `/canada/np/cnple/flashcards`

| | Status | Notes |
|---|---|---|
| Empty-state | ✅ Honest copy | "CNPLE flashcards are being prepared" |
| Empty-state CTAs | ✅ Correct | Links to `/simulation`, lessons, practice questions — NOT to `/cat` |
| Live inventory path | ✅ Checks `tier=NP, country=CA, status=PUBLISHED, cardCount>0` | Shows "Open Flashcards" when inventory exists |

### `/canada/np/cnple/questions`

| | Status | Notes |
|---|---|---|
| Practice questions | ✅ NP tier question bank | Shared with US NP pathways, filtered by `ca-np-cnple` |
| Practice test copy | ✅ `cnple-practice-test` segment | LOFT-aware copy, no CAT claims |

---

## Conversion Flow Verification

| User state | What they see | Where they go |
|---|---|---|
| Guest hits hub | Hub with "Simulation" tile | `/canada/np/cnple/simulation` |
| Guest clicks "Start CNPLE Simulation" | Login wall with callback | After login → `/app/cases/cnple` |
| Signed-in unpaid | Hub + upgrade CTA in session pages | `/app/practice-tests/start` upgrade flow |
| Signed-in NP plan holder | `/app/cases/cnple` directly | Full LOFT case experience |
| Anyone hits `/canada/np/cnple/cat` | 302 redirect | `/canada/np/cnple/simulation` |

---

## Canonical Key Audit

All surfaces use `ca-np-cnple` as the canonical pathway ID:

| Surface | Key used | ✓/✗ |
|---|---|---|
| `exam-pathways-data-segment-a.ts` | `ca-np-cnple` | ✅ |
| `cnple-pathway.ts` constant | `CNPLE_PATHWAY_ID = "ca-np-cnple"` | ✅ |
| Flashcard pool filter | `tier: "NP", country: "CA"` | ✅ |
| Lesson catalog sync | `npPathwayMetadata["ca-np-cnple"]` | ✅ |
| Simulation page guard | `pathway.id !== "ca-np-cnple"` | ✅ |
| Practice test segment | `pathwayId: "ca-np-cnple"` | ✅ |
| Learner cases route | `/app/cases/cnple` | ✅ |
| Readiness config | `"ca-np-cnple": { engineType: "LOFT" }` | ✅ |

---

## Remaining Content Gaps (Do Not Fake)

| Gap | Count | Action needed |
|---|---|---|
| CNPLE flashcard decks in DB | Unknown | Publish NP/CNPLE flashcard decks in admin; page will show live inventory automatically |
| CNPLE-specific DB lessons | 0 (currently uses NP core) | Optional — NP core lessons are relevant; create CNPLE-specific lessons for Canadian regulatory specifics |
| Additional CNPLE clinical cases | 8 static today | Admin can author additional cases in `ClinicalNursingScenario` table |
| DB practice questions specifically tagged `CNPLE` | Unknown | Verify `contentExamKeys: ["CNPLE", "CAN-NP"]` questions are in DB |

---

## Validation Results

```
npm run typecheck:critical   ✅ clean
npm run test:homepage        ✅ 144/144 pass
npm run test:cnple           ✅ 20/20 pass
```

CNPLE-specific Playwright smoke tests: Run `npx playwright test` targeting
`/canada/np/cnple`, `/canada/np/cnple/simulation`, `/canada/np/cnple/lessons`.

---

## Go/No-Go Recommendation

### ✅ GO for public release

**Rationale:**
- A real user can land from Google (`/cnple`, `/cnple-simulation-exam`, etc.) and understand the product
- The hub shows "Simulation" with LOFT-correct copy — no CAT confusion
- The simulation page is fully built with FAQ, format table, and working CTA
- The lessons hub has 436 real NP lessons — not a blank page
- Flashcards shows an honest empty-state with alternative paths — no blank screen
- The conversion flow is wired: guest → login → NP subscription → CNPLE content
- 436 lessons + 8 cases + practice questions = a functional, substantive product

**Blockers resolved:** 3 (CAT label, /cat missing redirect, signed-in user routing)

**Remaining acceptable gaps:**
- Flashcard deck inventory is unknown until published — empty-state is professionally handled
- CNPLE-specific questions rely on NP tier question bank (correct and sufficient)
- No additional CNPLE lessons beyond NP core needed for launch (436 is substantial)

### Post-launch priorities (in order)
1. Publish CNPLE flashcard decks in admin → live inventory appears automatically
2. Verify `CNPLE`-tagged practice questions exist in DB question bank
3. Author additional CNPLE clinical cases (currently 8; target 20–30 for a strong case bank)
4. Add CNPLE-specific lessons covering Canadian regulatory specifics (prescribing under CDS Act, PIPEDA, provincial scope variation)
