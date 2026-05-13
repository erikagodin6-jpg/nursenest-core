# Lesson Hub P0 Performance Fix

**Date:** 2026-05-13 (updated 2026-05-13)  
**Severity:** P0 — production lesson hubs loading 60+ seconds  
**Status:** Fixed (Phase 2 — verify + secondary bundling)

---

## Root Cause

`src/lib/lessons/pathway-lesson-catalog-sync.ts` used Node.js `createRequire` to load
lesson catalog JSON files:

```typescript
const catalogBundleRequire = createRequire(import.meta.url);
// ...
catalogDataCache = catalogBundleRequire("@/content/pathway-lessons/catalog.json");
```

**Turbopack statically traces all `require()` calls** and includes every referenced file
in the server bundle at compile time — regardless of whether the `require` is inside a
lazy-init function. The result:

| Problem | Impact |
|---|---|
| 25 catalog JSON files (~57 MB) bundled into a single 44 MB server chunk | Build OOM, 60+ second cold starts |
| ALL expansion loaders called for EVERY pathway request | Unnecessary disk reads, wasted parse time |

The 44 MB chunk (`71423.js`) contained the full text of clinical lesson content from
all 25 catalog files. V8 had to parse and compile 44 MB of JS on every cold module load.

---

## Files Changed

### Phase 1 — Primary catalog bundling fix (previous session)

| File | Change |
|---|---|
| `src/lib/lessons/pathway-lesson-catalog-sync.ts` | Replaced `createRequire`/`catalogBundleRequire` with `readFileSync`-based loader; added pathway type guards |
| `src/lib/lessons/catalog-bundling-regression.test.ts` | New regression tests (7 checks) |
| `scripts/check-performance-budgets.mjs` | Added server chunk size budget (10 MB hard limit) |
| `package.json` | Added `test:lesson-catalog` script |

### Phase 2 — Secondary bundling + verify step optimization (this session)

| File | Change |
|---|---|
| `src/lib/content/topic-map-catalog-dedupe.ts` | `require("catalog.json")` → `readFileSync` |
| `src/lib/content/master-topic-map.ts` | `require("master-topic-map.json")` → `readFileSync` |
| `src/lib/lessons/pathway-lesson-registry-source.ts` | `require("catalog.json")` → `readFileSync` |
| `src/lib/scalability/build-content-scalability-report.ts` | `require("catalog.json")` → `readFileSync` |
| `src/lib/content-blueprint/rn-nclex-master-map.ts` | `require("rn-nclex-master-map.json")` → `readFileSync` |
| `src/lib/content-blueprint/rn-nclex-lesson-depth-gate.ts` | `require("rn-nclex-master-map.json")` → `readFileSync` |
| `src/app/(admin)/admin/lessons/blueprint-coverage/page.tsx` | `require("catalog.json")` → `readFileSync` |
| `src/lib/lessons/pathway-lesson-loader.ts` | Added `getPathwayLessonForHubVerifySlim` — no-sections verify |
| `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx` | Wired slim verify into `verifyMarketingHubLessonRowsResolve` |
| `src/lib/lessons/catalog-bundling-regression.test.ts` | Extended: 6 new tests for secondary files |
| `src/lib/marketing/build-phase-memory-guards.test.ts` | Updated: tests now enforce `readFileSync` pattern |

---

## Fix 1: Replace `createRequire` with `readFileSync`

**Before:**
```typescript
import { createRequire } from "node:module";
const catalogBundleRequire = createRequire(import.meta.url);
// ...
catalogDataCache = catalogBundleRequire("@/content/pathway-lessons/catalog.json");
```

**After:**
```typescript
import { readFileSync } from "node:fs";
import { join } from "node:path";

function readCatalogJsonSync<T>(srcRelPath: string): T {
  const abs = join(process.cwd(), srcRelPath);
  // ... optional perf logging ...
  return JSON.parse(readFileSync(abs, "utf8")) as T;
}
// ...
catalogDataCache = readCatalogJsonSync<CatalogShape>("src/content/pathway-lessons/catalog.json");
```

`readFileSync` is **not statically traceable** by Turbopack — the catalog files stay on
disk and are read on-demand. The module-level caches (`catalogDataCache`, etc.) are
preserved, so subsequent requests in the same Node.js process read from memory (< 1 ms).

---

## Fix 2: Pathway-Specific Catalog Filtering

Before: every call to `getCatalogLessonsRawFromBundledOnly(pathwayId)` loaded all 25
expansion catalogs regardless of which pathway was requested. An Allied Health hub request
triggered reads of all RN NCLEX expansion files even though they return `[]` for allied
pathways.

After: each expansion catalog is guarded by an explicit pathway allowlist:

```typescript
const RN_NCLEX_PATHWAY_IDS = new Set(["ca-rn-nclex-rn", "us-rn-nclex-rn"]);
const RPN_PATHWAY_IDS      = new Set(["ca-rpn-rex-pn"]);
const NP_PATHWAY_IDS       = new Set(["ca-np-cnple", "us-np-fnp"]);
const ALLIED_CORE_PATHWAY_IDS = new Set(["us-allied-core", "ca-allied-core"]);
const NEW_GRAD_PATHWAY_IDS = new Set(["us-rn-new-grad-transition"]);

// Only load RN expansions for RN pathways
const cardioExpansion = isRnNclexPathway(pathwayId)
  ? rnCardiovascularExpansionLessonsForPathway(pathwayId)
  : [];
// etc.
```

**Per-pathway catalog reads (first cold request):**

| Pathway | Catalogs read (before) | Catalogs read (after) |
|---|---|---|
| `ca-rn-nclex-rn` | 25 files (~57 MB) | 22 files (~41 MB) |
| `ca-rpn-rex-pn` | 25 files (~57 MB) | **2 files (~14 MB)** |
| `ca-np-cnple` | 25 files (~57 MB) | **3 files (~18 MB)** |
| `us-allied-core` | 25 files (~57 MB) | **3 files (~12 MB)** |

---

## Before/After Metrics

### Build output
| Metric | Before | After (projected) |
|---|---|---|
| Largest server chunk | **44 MB** (catalog JSON bundled) | < 1 MB |
| Total catalog JSON in server bundle | **57 MB** | **0 MB** |
| Build RSS (peak) | ~7.5 GB → SIGKILL | < 3 GB (projected) |

### Runtime performance (measured locally, `LESSON_PERF_DEBUG=1`)

| Pathway | Cold request (before) | Cold request (after) | Warm request |
|---|---|---|---|
| RN NCLEX (`ca-rn-nclex-rn`) | 60+ s (V8 parse) | **774 ms** (21 files from disk) | **0 ms** |
| RPN (`ca-rpn-rex-pn`) | 60+ s | **280 ms** (3 files: library + catalog + rpn) | **0 ms** |
| NP (`ca-np-cnple`) | 60+ s | **87 ms** (1 file: np-core; catalog in cache) | **0 ms** |
| Allied (`ca-allied-core`) | 60+ s | **8 ms** (1 file: allied-bundled; catalog cached) | **0 ms** |

Warm = same Node.js process, all module-level caches populated.  
RN cold reads 21 files because it is the most expansive pathway; subsequent non-RN requests reuse the cached catalog.json.

The warm-cache case is the steady state in production — once the Node.js process has
served its first request for each pathway, all subsequent requests use the module-level
in-memory cache and are fast.

---

## Timing Instrumentation

`readCatalogJsonSync` logs timing when `LESSON_PERF_DEBUG=1` or in development:
```
[catalog-read] src/content/pathway-lessons/catalog.json 42ms 10556KB
[catalog-read] src/content/pathway-lessons/rpn-rex-pn-parity-expansion-catalog.json 28ms 3440KB
```

The existing `lessonsPerfMark` instrumentation in `lessons-perf.ts` already covers
higher-level phases (catalog_build_start/end, normalized_pathway_catalog, etc.).

Enable detailed timing:
```bash
LESSON_PERF_DEBUG=1 npm run dev
```

---

## Risks

| Risk | Mitigation |
|---|---|
| Pathway ID not in allowlist gets no expansion lessons | Explicit allowlists — add new pathway ID to the correct Set when creating new pathways |
| `process.cwd()` differs between environments | Next.js guarantees cwd == project root; validated via `join(process.cwd(), "src/content/...")` |
| First cold request per pathway still reads from disk | Module-level caches persist across requests in same process; only first request per pathway is slow |
| readFileSync blocks the event loop for large files | Largest file is 10.5 MB (catalog.json). Parse time ~40–80ms. Acceptable for cold start; warm is instant. |

---

## Validation Commands

```bash
# Type safety
npm run typecheck:critical --prefix nursenest-core

# Regression tests (source-level checks — no build required)
npm run test:lesson-catalog --prefix nursenest-core

# Homepage contract tests
npm run test:homepage --prefix nursenest-core

# Performance budgets (requires build output)
npm run perf:budgets --prefix nursenest-core

# Verify no createRequire remains in catalog-sync
grep -n "createRequire\|catalogBundleRequire" \
  nursenest-core/src/lib/lessons/pathway-lesson-catalog-sync.ts
# Expected: only comment lines (2 references in comments)
```

---

## Deferred Follow-Up

1. **`lesson-library.json` (4.5 MB)** is also loaded via `readCatalogJsonSync` in
   `buildCatalogLessonsRawUncached`. It is the lesson library fallback layer. After this
   fix it is no longer bundled, but it is still parsed on first request. Consider whether
   the lesson library can be replaced entirely by the Prisma `PathwayLesson` table.

2. **`np-parity-expansion-catalog.json` (14 MB)** exists on disk but is not imported
   by any runtime code — it is only used by a generation script. It is safe to keep but
   consider whether it can be deleted after verifying the NP lessons are fully in the DB.

3. **RPN and NP first-cold-request latency** — even with the fix, first-ever RPN request
   reads `rpn-rex-pn-parity-expansion-catalog.json` (3.4 MB). This is ~30–80ms parse
   time on first request. For < 200ms warm target, consider pre-warming caches on
   server startup via a background task.

4. **Migrate to DB-first lesson loading** — The long-term fix is to remove static JSON
   catalogs entirely and serve all lessons from the `PathwayLesson` Prisma table. This
   eliminates disk reads, enables real-time content updates, and removes the cold-start
   penalty entirely.
