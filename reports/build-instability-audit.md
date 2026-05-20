# Build instability audit (NurseNest / DigitalOcean)

**Purpose:** explain why `next build` can OOM / SIGKILL on small VMs and what is **already mitigated** in-repo — without changing product features or SEO.

**Operational scripts:** `npm run audit:build-stability` (repo root or `nursenest-core`). Strict mode: `AUDIT_BUILD_STABILITY_STRICT=1`.

---

## 1. Next.js build configuration (actual `next.config.mjs`)

| Knob | Value / behavior | Why it matters |
|------|------------------|----------------|
| **`experimental.cpus`** | `1` | Caps worker fan-out for experimental features. |
| **`staticGenerationMaxConcurrency`** | `1` | Limits parallel SSG — high concurrency multiplies memory per page. |
| **`webpackBuildWorker`** | `false` | Keeps webpack in the **main** Node process — avoids a second heap during compile. |
| **`memoryBasedWorkersCount`** | `false` | Prevents Next from scaling workers from “free RAM” heuristics that overshoot on DO builders. |
| **`parallelServerCompiles` / `parallelServerBuildTraces`** | `false` | Reduces concurrent server compile / trace work. |
| **`webpack` `config.parallelism`** | `1` | Serializes webpack internal parallelism — slower wall time, **lower peak RAM**. |
| **`webpack` cache (prod)** | `config.cache = false` when `!dev` | Avoids PackFileCacheStrategy mmap / ENOENT issues under load; trades speed for stability. |
| **`typescript.ignoreBuildErrors`** | `true` | **Intentional:** avoids integrated TypeScript pass inside `next build` (saves RAM). **CI must run `npm run typecheck` before deploy.** Config comment also references ESLint — run lint in CI separately if not folded into `validate:prebuild`. |
| **`output`** | `standalone` | DigitalOcean / container runtime expects standalone bundle (`start-standalone.mjs`). |

**Low-memory heuristics:** `NN_LOW_MEMORY_BUILD`, `CI`, `GITHUB_ACTIONS`, `NN_APP_PLATFORM_BUILD`, or host RAM ≤ ~9 GiB auto-enable diagnostic logging (`[nn-next-build-config]` JSON during `build`).

**Heap for Node:** `scripts/ensure-node-memory.mjs` merges `--max-old-space-size` (default 4096 MB unless `BUILD_NODE_MAX_OLD_SPACE_SIZE_MB` overrides). Invoked from `build`, `start`, `dev`.

---

## 2. Build pipeline order (`nursenest-core/package.json`)

1. **`prebuild`:** toolchain → `guard:build-scripts` → **`i18n:compile`** (large JSON merge) → i18n validate meta → git meta.  
2. **`build`:** `ensure-node-memory` → **`run-lesson-indexes-for-build.mjs`** (unless `NN_SKIP_LESSON_INDEX_BUILD`) → **`next build`** → `verify-dist-artifacts` (from repo root script).

**OOM hotspots (expected):**

- **`i18n:compile`** — merges all locale shards.  
- **`build:lesson-indexes`** — walks catalogs; CPU + disk.  
- **`next build`** — webpack/turbopack + RSC compilation + SSG for marketing pages.

**Escape hatch:** `NN_SKIP_LESSON_INDEX_BUILD=1` skips index generation on constrained builders (indexes must exist or be regenerated before release).

---

## 3. Turbopack vs Webpack

Next 16 defaults Turbopack for `next build`. This repo keeps an explicit **`turbopack`** stanza **and** a **`webpack`** hook for `parallelism` / cache when webpack is used (`--webpack` or fallback paths). Do not remove without re-measuring DO builder RAM.

---

## 4. DigitalOcean–specific notes

- App Platform / build containers often have **limited RAM** and **no swap** — SIGKILL is immediate past cgroup limit.  
- Prefer **raising builder size** or **`BUILD_NODE_MAX_OLD_SPACE_SIZE_MB`** over re-enabling parallel workers unless profiling proves headroom.  
- `verify-digitalocean-runtime.mjs` (repo root) validates spec + Dockerfile alignment — run in CI before promote.

---

## 5. What this audit does *not* do

- It does **not** replace `next build` profiling or bundle analyzer output.  
- It does **not** change routes, metadata, or redirects (SEO-neutral).

---

## 6. Related commands

| Command | Role |
|---------|------|
| `npm run audit:build-stability` | Static config + package.json chain checks. |
| `npm run audit:runtime-payloads` | Large JSON + import isolation heuristics. |
| `npm run typecheck` | Required before production build if `ignoreBuildErrors` is true. |
| `npm --prefix nursenest-core run build` | Full production compile. |
