# Largest bundle surfaces (NurseNest)

**Purpose:** orient engineers toward **where client JS grows** and how to measure it — **no bundle rewrite** in this task.

---

## 1. Measurement tools (recommended)

| Tool | When to use |
|------|-------------|
| **Next.js build output** | After `next build`, read listed **First Load JS** per route (stdout). |
| **`@next/bundle-analyzer`** | Not currently wired in this repo — add **devDependency + opt-in** `ANALYZE=true` when profiling (do not enable in production DO build by default — longer builds). |
| **Chrome Coverage** | Runtime unused JS on `/app` learner dashboards and marketing lesson hubs. |

---

## 2. Monolith Vite guard (`scripts/check-bundle-size.mjs`)

Root script scans **`dist/public/assets`** JS chunks (Vite monolith output), default cap **800 KB** per chunk (`BUNDLE_MAX_CHUNK_KB`).  
**Note:** Next standalone chunks live under **`nursenest-core/.next/static/chunks`** — different path; use Next build output or analyzer for App Router.

---

## 3. Surfaces that commonly dominate bundles

| Surface | Why |
|---------|-----|
| **Marketing lesson hub pages** | Many pathway-lesson components, tables, chips; ensure dynamic import for heavy optional panels. |
| **Learner dashboard** | Charts, study widgets — watch `recharts` / data grid imports. |
| **Practice / question flows** | Rich interactive clients; keep server components for data fetch. |
| **Radix / shadcn stacks** | Many small modules — tree-shake unused primitives. |
| **`@legacy-client` alias** | Pulls monolith-era code into Next when imported — **high risk**; audit each import. |

---

## 4. Hydration boundaries

Prefer **server components** for:

- Initial lesson hub lists (metadata + first page).  
- Read-only marketing shells.

Reserve **`use client`** for:

- Interactive filters, timers, session UI.

The **`audit:runtime-payloads`** script flags **`use client` + `@/content/`** imports in `src/app` (forbidden pattern).

---

## 5. Action backlog (documentation only)

1. Optional: add **opt-in** bundle analyzer to `nursenest-core` devDependencies.  
2. Track **First Load JS** regression in CI (upload build log artifact, compare to baseline).  
3. When adding a new **catalog JSON**, run **`npm run audit:runtime-payloads`** and confirm it stays off client critical path.

---

## 6. Related

- `reports/build-instability-audit.md`  
- `reports/runtime-payload-audit.md`  
- `reports/system-source-of-truth.md` (content SoT)
