# Build Memory Pressure Audit

**Date:** 2026-05-13  
**Symptom:** Production build peaks at ~7.5 GB RSS before SIGKILL  
**Platform:** DigitalOcean App Platform (basic-s, 1 GB RAM / basic-xs, 512 MB RAM)  
**Build tool:** Turbopack (Next.js 16.2.6) + SWC

---

## Root Cause Summary

The build OOM is **not** primarily caused by CSS. It is caused by **66.7 MB of static
JSON catalog content** being bundled into the server-side JS graph via synchronous
`require()` calls in `src/lib/lessons/pathway-lesson-catalog-sync.ts`.

| Cause | Contribution | Priority |
|---|---|---|
| 31 JSON catalog files (66.7 MB total) bundled via `require()` | **PRIMARY** | P0 |
| 45 MB single server chunk (`71423.js`) containing all catalog content | **PRIMARY** | P0 |
| 9.7 MB secondary server chunk (`5499.js`) | HIGH | P1 |
| CSS `@import` graph fanout from `globals.css` | LOW | P3 |
| Tailwind v4 scan breadth | LOW | P3 |

---

## 1. Primary Cause: Catalog JSON Bundled at Build Time

### Evidence

```
.next/server/chunks/71423.js = 44 MB
```

Inspecting this file confirms it contains **clinical content** (markdown-formatted
lesson rationales, NP primary care content, pharmacology clinical meanings).
This is the 31 JSON catalog files being compiled into a single server bundle.

### Root

`src/lib/lessons/pathway-lesson-catalog-sync.ts` uses Node.js `createRequire`:

```typescript
const catalogBundleRequire = createRequire(import.meta.url);

// Then inside a lazy-init function (but still a static require graph):
catalogDataCache = catalogBundleRequire("@/content/pathway-lessons/catalog.json");
catalogBundleRequire("@/content/pathway-lessons/np-core-catalog.json");
catalogBundleRequire("@/content/pathway-lessons/np-parity-expansion-catalog.json");
// ... 28 more JSON files
```

Even though these are inside functions (lazy init), Turbopack follows `require()` calls
statically and includes ALL referenced modules in the server bundle. The result:

| Catalog file | Size |
|---|---|
| `np-parity-expansion-catalog.json` | 14.0 MB |
| `catalog.json` (master) | 10.5 MB |
| `np-core-catalog.json` | 6.8 MB |
| `rpn-rex-pn-parity-expansion-catalog.json` | 3.4 MB |
| 27 more expansion catalogs | ~32 MB |
| **Total** | **66.7 MB** |

At build time, Turbopack must:
1. Parse all 66.7 MB of JSON
2. Serialize it into the JS module graph
3. Minify/optimize the resulting 44 MB bundle
4. Keep the source map in memory

On a 1 GB container, this alone consumes 200–400 MB of working memory before
any other compilation work begins.

### Why the 9.7 MB Chunk (`5499.js`) Exists

A second large server chunk (9.7 MB) contains overlapping NP content from
the clinical question/flashcard banks, also loaded via `require()` patterns.

---

## 2. CSS Graph Fanout (Secondary)

### Evidence

`globals.css` has 10 direct `@import` statements. The resolved CSS graph:

```
globals.css (185 KB)
├── tailwindcss (scanned across all src/ files)
├── theme-palettes.css (68 KB) ← largest CSS file
├── color-roles.css (10 KB)
├── semantic-status-tokens.css (51 KB)
├── marketing-brand-atmosphere.css (11 KB)
├── full-platform-convergence.css (5 KB)
├── premium-color-depth-convergence.css (10 KB)
├── premium-atmospheric-ecosystem-convergence.css (12 KB)
├── premium-mobile-study-experience-audit.css (8 KB)
└── mobile-ux-standards.css (2 KB)
```

Total CSS graph from root layout: **362 KB** of source CSS (before marketing/learner
layout additions).

Turbopack tracks CSS `@import` chains in the dependency graph. Changes to any file
in this chain invalidate the full CSS bundle, increasing incremental build time.
However, CSS graph fanout is a **minor contributor** to build memory — the primary
pressure is the 44 MB JSON server bundle.

### Tailwind v4 Scan Breadth

Tailwind v4 scans all `src/**/*.{tsx,ts,html}` files for class usage. With 794 routes
and thousands of component files, this scan can consume 50–100 MB during build.
Reducing the scan breadth via `content` configuration would lower build memory, but
this is a P3 optimization given the primary cause is JSON bundling.

---

## 3. Large Dependency Contributors (Server-Side)

| Source | Bundle size | Notes |
|---|---|---|
| Catalog JSON (all 31 files) | **66.7 MB raw → 44 MB bundled** | Primary OOM cause |
| Prisma client | ~903 KB | Normal for ORM; already excluded from client |
| `@sentry/nextjs` | ~482 KB | Already dynamically imported |
| NP clinical question banks | ~9.7 MB | In `5499.js` server chunk |

---

## 4. CSS Graph Hot Spots

These CSS files have the highest invalidation cost (most commonly change and
trigger full CSS recompilation):

| File | Size | Invalidation Risk |
|---|---|---|
| `theme-palettes.css` | 68 KB | HIGH — theme additions trigger full rebuild |
| `semantic-status-tokens.css` | 51 KB | HIGH — token changes bubble widely |
| `globals.css` | 185 KB | HIGH — imported by all routes |
| `styles/learner/learner-global.css` | 172 KB | MEDIUM — learner-only |
| `styles/marketing/hub-tiers.css` | 41 KB | MEDIUM — marketing-only |
| `styles/marketing/pathway-reading.css` | 33 KB | MEDIUM — marketing-only |

Post-extraction in this session, `globals.css` has been reduced from 213 KB to 185 KB
(-28 KB), which marginally reduces CSS compilation memory for all routes.

---

## 5. Recommended Architectural Mitigations

### P0 — Stop bundling catalog JSON at build time (HIGH IMPACT)

**Current pattern (problematic):**
```typescript
const catalogBundleRequire = createRequire(import.meta.url);
const data = catalogBundleRequire("@/content/pathway-lessons/catalog.json");
```

**Safe migration paths (choose one):**

**Option A — `fs.readFileSync` with lazy init (minimal change):**
```typescript
import { readFileSync } from "node:fs";
import { join } from "node:path";
// Inside the lazy-init function only:
const data = JSON.parse(
  readFileSync(join(process.cwd(), "src/content/pathway-lessons/catalog.json"), "utf8")
);
```
`fs.readFileSync` is NOT statically traced by Turbopack (unlike `require()`), so it
does NOT add JSON files to the bundle. The file is read at runtime from disk.

**Option B — Database-first (architectural preference):**
Migrate catalog content to the Prisma database (already partially done for
`PathwayLesson` table). Query at runtime instead of reading from disk.
Higher effort but removes the disk read dependency entirely.

**Option C — Edge-compatible data loader:**
Use `import()` dynamic import with `assert { type: "json" }` — this creates
a separate chunk per file but avoids the monolithic 44 MB bundle.

**Expected savings:** Reduce build memory by **200–400 MB RSS**; eliminate the 44 MB
server chunk; allow the build to complete on basic-s (1 GB) reliably.

### P1 — Split `theme-palettes.css` by active theme (MEDIUM IMPACT)

`theme-palettes.css` at 68 KB contains all 10+ theme definitions. At build time,
Turbopack processes the full file for every route. A split by theme (one file per
theme, loaded via CSS custom property injection at runtime) would reduce the CSS
compile graph by ~50 KB.

**Risk:** HIGH — themes cascade globally and the split would require runtime theme
detection before CSS injection. Defer until the JSON bundling issue is resolved.

### P2 — Reduce `semantic-status-tokens.css` scope (LOW IMPACT)

At 51 KB, this file defines semantic tokens for every surface (CAT, flashcard,
exam, lesson, dashboard). Many of these tokens are only needed on specific routes.
Splitting into `semantic-tokens-global.css` + `semantic-tokens-learner.css` could
reduce the global CSS graph by 20–30 KB.

### P3 — Reduce Tailwind scan breadth (LOW IMPACT)

Configure Tailwind to scan only active route directories, excluding `legacy/`,
`scripts/`, and generated files. Expected: 10–20 MB build memory reduction.

---

## 6. Safe Next Steps (in priority order)

1. **[P0 — DO NOW]** Migrate `catalogBundleRequire` calls to `fs.readFileSync`
   in `pathway-lesson-catalog-sync.ts`. This is a server-only file, the change is
   backward-compatible, and it eliminates the primary OOM cause.

2. **[P1 — NEXT SPRINT]** Move the 31 expansion catalog files behind a
   database-backed loader using the existing `PathwayLesson` Prisma table.

3. **[P2 — AFTER P1]** Split `semantic-status-tokens.css` into global + route-scoped
   variants, guided by the CSS ownership audit.

4. **[P3 — LONG TERM]** Migrate to a fully database-driven lesson content layer,
   removing all static JSON catalogs from the repository.

---

## 7. What NOT to Do

- ❌ **Increase memory limits as the primary fix** — the 44 MB server bundle will
  still compile slowly and consume production RSS during request handling
- ❌ **Recommend larger droplets first** — the real fix is eliminating the 66 MB
  JSON require graph
- ❌ **Disable type safety or CSS source maps** — these are diagnostic tools, not
  memory costs worth trading
- ❌ **Rewrite `pathway-lesson-catalog-sync.ts` wholesale** — the `require()` → 
  `readFileSync()` change is surgical and low-risk
