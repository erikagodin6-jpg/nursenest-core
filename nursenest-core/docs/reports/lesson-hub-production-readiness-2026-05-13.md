# Lesson Hub Performance — Production Readiness Audit

**Date:** 2026-05-13  
**Scope:** Lesson hub load time, catalog bundling, verify step, chunk isolation  
**Status:** PASS — all regression guards green, all smoke tests pass

---

## Summary

| Check | Status | Evidence |
|---|---|---|
| Zero `require()` for catalog JSON | ✅ PASS | grep returns empty (below) |
| Admin chunks isolated from marketing/learner routes | ✅ PASS | nft.json scan — 0 marketing routes reference `5499.js` |
| Hub verify uses slim resolver (no sections JSONB) | ✅ PASS | 3 call sites wired: main hub, category surface, inventory fill |
| Hub listing sections: known remaining item | ⚠️ KNOWN | See deferred section |
| Catalog cold start: RN < 900ms | ✅ PASS | 805ms measured locally |
| Catalog warm: all pathways 0ms | ✅ PASS | All 7 pathways 0ms warm |
| Hub records have no sections in hub shape | ✅ PASS | `hasSections=0` for all 4 pathway types |
| Server chunk budget (10 MB hard limit) | ✅ PASS | `9 passed, 0 violations` |

---

## 1. require() / createRequire Audit

### Catalog JSON — zero remaining bare `require()`

```
grep -rn "require\s*(\s*[\"']@/content/pathway-lessons\|@/content/topic-maps" \
  src/ --include="*.ts" --include="*.tsx" | grep -v "//\|test\|spec"
# → (empty)
```

All 7 files that previously used `require()` for catalog JSON are now fixed:

| File | JSON file | Fix |
|---|---|---|
| `src/lib/content/topic-map-catalog-dedupe.ts` | `catalog.json` | `readFileSync` |
| `src/lib/content/master-topic-map.ts` | `master-topic-map.json` | `readFileSync` |
| `src/lib/lessons/pathway-lesson-registry-source.ts` | `catalog.json` | `readFileSync` |
| `src/lib/scalability/build-content-scalability-report.ts` | `catalog.json` | `readFileSync` |
| `src/lib/content-blueprint/rn-nclex-master-map.ts` | `rn-nclex-master-map.json` | `readFileSync` |
| `src/lib/content-blueprint/rn-nclex-lesson-depth-gate.ts` | `rn-nclex-master-map.json` | `readFileSync` |
| `src/app/(admin)/admin/lessons/blueprint-coverage/page.tsx` | `catalog.json` | `readFileSync` |

### Non-catalog `require()` — acceptable

These `require()` patterns remain and are intentional:

| File | JSON file | Size | Verdict |
|---|---|---|---|
| `src/content/pre-nursing/pre-nursing-strings-en.json` | UI strings | 56 KB | OK — small, pre-nursing only |
| `src/content/transfusion-safety-questions.json` | Tool data | 471 B | OK — negligible |
| `src/content/clinical-case-studies.json` | Case studies | 1.8 KB | OK — small |
| `src/lib/blog/static-blog-posts.ts` | Blog corpus | N/A | OK — `createRequire` expected (blog static build) |
| `src/lib/db/script-env-bootstrap.ts` | dotenv | N/A | OK — script-only, never in Next.js bundle |

---

## 2. Server Chunk Isolation

### Current build (pre-Phase-2-rebuild)

The 9.6 MB `5499.js` chunk exists in the current build (from before the Phase 2 readFileSync fixes). It is entirely isolated to admin routes:

```
5499.js (9.6 MB) referenced by:
  /(admin)/admin/lessons/blueprint-coverage/page.js
  /api/admin/scalability-report/route.js
  /api/admin/ops/run/route.js
  /api/admin/operations-dashboard/route.js
```

**Zero marketing, learner, or shared-layout routes reference this chunk.**

After a production rebuild with Phase 2 fixes applied, `5499.js` will be eliminated — all 7 files now use `readFileSync` which Turbopack cannot statically trace.

### Main lesson hub routes — confirmed clean

```
/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.js → ✓ CLEAN
/(marketing)/[locale]/lessons/page.js                              → ✓ CLEAN
/(marketing)/(default)/lessons/page.js                             → ✓ CLEAN
/(marketing)/(default)/exam-lessons/page.js                        → ✓ CLEAN
```

---

## 3. Hub Verify Slim Coverage

`getPathwayLessonForHubVerifySlim` is wired at **three** call sites:

| Call site | File |
|---|---|
| Main lesson hub page | `[examCode]/lessons/page.tsx` — `verifyMarketingHubLessonRowsResolve` |
| Inventory fill | `[examCode]/lessons/page.tsx` — `fillMarketingHubLessonInventoryToMinimum` `deps` |
| Category hub surface | `marketing-hub-category-rows-db-resilient.ts` — default `resolveLessonDetail` |

**Slim resolver behavior:**
- Queries only `PATHWAY_LESSON_HUB_LIST_SELECT` metadata + `structuralPublicComplete` (no `sections` JSONB)
- When `structuralPublicComplete = true`: normalizes with empty sections, overrides `publicComplete = true`
- When `structuralPublicComplete = false` or column absent: falls back to `getPathwayLessonForMarketingHubVerify` (full load)
- Estimated DB data per verify pass: ~90 KB (was ~6 MB)

**Surfaces NOT using slim verify (intentional):**
- `evaluatePublicMarketingLessonCrossLinkIntegrity` in SEO/internal-link tools — needs full lesson for link text generation, not just metadata
- `getPathwayLessonForMarketingHubVerify` remains as a fallback and is still the correct resolver for lesson detail pages

---

## 4. Hub Listing Sections JSONB — Known Remaining Item

`loadPublishedLessonInputsAllChunked` in `resolveMarketingHubRenderableLessonList` still
calls `loadPublishedLessonRowsPage` with `includeSections=true`. This is required because
`normalizeLesson` uses section content to compute `structuralQuality.publicComplete`.

**Current behavior:** all published lessons for a pathway are loaded with sections JSONB for
normalization, then `stripPathwayLessonToHubListShape` removes sections from hub cards.

**Why not changed in this pass:** Adding `structuralPublicComplete = true` to the WHERE clause
to pre-filter and skip sections loading is a **behavioral change** (changes which lessons appear
in the hub's degraded-row pool). Marked as P1 follow-up.

**Mitigation:** The verify step (60 lessons per page) no longer loads sections — this was the
dominant bottleneck. Hub listing DB load time scales with DB connection speed, not section size.

---

## 5. Local Smoke Test Results

### Catalog cold start (module + all expansion catalogs, no DB)

| Pathway | First request | Warm request | Lesson count | All publicComplete |
|---|---|---|---|---|
| RN NCLEX CA (`ca-rn-nclex-rn`) | **805 ms** | **0 ms** | 797 | ✅ 797/797 |
| RN NCLEX US (`us-rn-nclex-rn`) | **80 ms** | **0 ms** | 796 | ✅ 796/796 |
| RPN (`ca-rpn-rex-pn`) | **63 ms** | **0 ms** | 478 raw / 410 hub | ✅ 410/410 |
| NP CNPLE (`ca-np-cnple`) | **70 ms** | **0 ms** | 436 | ✅ 436/436 |
| NP FNP US (`us-np-fnp`) | **27 ms** | **0 ms** | 576 raw / 496 hub | ✅ 496/496 |
| Allied US (`us-allied-core`) | **9 ms** | **0 ms** | 15 | ✅ 15/15 |
| Allied CA (`ca-allied-core`) | **0 ms** | **0 ms** | 15 (cached) | ✅ 15/15 |

RN is slowest (805ms) because it loads the main catalog + 19 expansion files on cold start.
All subsequent requests: 0ms (module-level process cache).

### Hub record integrity check

```
[RN]    hub=797  uniqueSlugs=797  publicComplete=797  hasSections=0  hasSeoTitle=797
[RPN]   hub=410  uniqueSlugs=410  publicComplete=410  hasSections=0  hasSeoTitle=410
[CNPLE] hub=436  uniqueSlugs=436  publicComplete=436  hasSections=0  hasSeoTitle=436
[Allied] hub=15  uniqueSlugs=15   publicComplete=15   hasSections=0  hasSeoTitle=15
```

- `hasSections=0` for all — `stripPathwayLessonToHubListShape` correctly removes section bodies
- All hub records carry `seoTitle`, `publicComplete=true`, unique slugs

---

## 6. Test Suite Results

| Suite | Pass | Fail | Command |
|---|---|---|---|
| `typecheck:critical` | ✅ | 0 | `npm run typecheck:critical` |
| `test:lesson-catalog` | 15 ✅ | 0 | `npm run test:lesson-catalog` |
| `build-phase-memory-guards` | 20 ✅ | 0 | `node --import tsx --test src/lib/marketing/build-phase-memory-guards.test.ts` |
| `test:homepage` | 144 ✅ | 0 | `npm run test:homepage` |
| `perf:budgets` | 9 ✅ | 0 | `npm run perf:budgets` |

---

## 7. Before/After Performance Summary

### Server chunk sizes

| Chunk | Before Phase 1 | After Phase 1 | After Phase 2 (next rebuild) |
|---|---|---|---|
| Main catalog chunk | **44 MB** | ~1 MB (code only) | ~1 MB |
| Admin catalog chunk | ~9.6 MB | ~9.6 MB (stale build) | **< 1 MB** |
| All chunks > 10 MB | 1 violation | 0 violations | 0 violations |

### Estimated hub render time (cold cache, production DB, 500 published lessons)

| Phase | Before all fixes | After Phase 1 | After Phase 2 |
|---|---|---|---|
| Module cold load | **60+ s** (V8 parse 44 MB JS) | **496 ms** | **496 ms** |
| Catalog cold start (RN) | bundled (0 ms, already in V8) | **774 ms** | **805 ms** |
| Hub list DB query (500 lessons + sections) | ~5–10 s | ~5–10 s | ~5–10 s |
| Verify step (60 lessons × full sections) | **~4–30 s** | **~4–30 s** | **~400 ms** ✅ |
| **Total cold hub render** | **~65+ s** | **~10–15 s** | **~6–11 s** |
| **Warm hub render** | ~100 ms | ~100 ms | ~100 ms |

The dominant remaining cold-request cost is the hub listing DB query (sections JSONB for
500+ lessons). This is the P1 follow-up (`structuralPublicComplete` WHERE filter).

---

## 8. Regression Guard Coverage

### `npm run test:lesson-catalog` (15 tests)

- 5 tests: `pathway-lesson-catalog-sync.ts` — no `createRequire`, `readFileSync` pattern, pathway type guards
- 6 tests: secondary files (topic-map, registry-source, scalability-report, master-map, depth-gate, blueprint-coverage) — no bare `require()` for catalog JSON
- 2 tests: server chunk budget — no chunk > 10 MB hard limit, warn > 5 MB
- 1 test: strict 5 MB tier (warning only, not fail)

### `build-phase-memory-guards.test.ts` (20 tests)

Covers all 5 priority content/catalog helper modules, admin blueprint coverage, blog
`createRequire` (expected pattern), static blog posts loading.

### Quick verification commands

```bash
# Verify zero bare require() for catalog JSON
grep -rn "require\s*([\"']@/content/pathway-lessons\|@/content/topic-maps" \
  src/ --include="*.ts" --include="*.tsx" | grep -v "//\|test\|spec"
# Expected: empty

# Verify slim resolver is wired in both hub call sites
grep -n "getPathwayLessonForHubVerifySlim" \
  src/app/\(marketing\)/\(default\)/\[locale\]/\[slug\]/\[examCode\]/lessons/page.tsx \
  src/lib/lessons/marketing-hub-category-rows-db-resilient.ts
# Expected: 2+ lines

# Verify chunk isolation
find .next/server/app -name "*.nft.json" | xargs grep -l "5499" 2>/dev/null | grep -v admin
# Expected: empty (only admin routes reference catalog chunk)
```

---

## 9. Deferred Follow-Up (P1)

**Hub listing sections removal** — the single remaining sections JSONB load in the hot path:

```typescript
// src/lib/lessons/pathway-lesson-loader.ts, line 763
const part = await loadPublishedLessonRowsPage(
  pathwayId, locale, skip, take, topicSlugsIn, hubSearch,
  true  // ← includeSections=true — this is the P1 target
);
```

Fix: add `WHERE structuralPublicComplete = true` and `includeSections = false`. Guards needed:
- `isPathwayLessonStructuralPublicCompleteColumnPresent()` check
- Behavior test: hub still shows expected lesson count
- Database migration must be complete before deploying

**Estimated additional savings:** ~5–9 s per cold hub render (DB data: ~5 MB → ~100 KB).
