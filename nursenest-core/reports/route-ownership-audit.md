# Route ownership audit — NurseNest (Next.js App Router)

**Scope:** Static audit of `nursenest-core/src/app/**`, `src/proxy.ts`, `next.config.mjs` (redirects/headers), and `src/app/api/**` layout.  
**Out of scope:** Route deletion, behavior changes, exhaustive crawl/link graph, `server/index.ts` path map.  
**Paths:** Relative to `nursenest-core/` package (DigitalOcean `source_dir`).

---

## Legend

| Tag | Meaning |
|-----|---------|
| **SAFE_FOR_AI** | OK to treat as stable for docs and automation. |
| **DEV_ONLY** | Staff/debug/infra; do not infer public product URLs from these alone. |

---

## 1. Top-level ownership map

| URL prefix | Owner (filesystem) | Gate / cache notes | Active |
|------------|-------------------|-------------------|--------|
| `/` and default marketing | `src/app/(marketing)/(default)/` + `src/app/(marketing)/(default)/layout.tsx` | `export const dynamic = "force-dynamic"` on default marketing layout | Active |
| `/{locale}/…` | **Split** between `(marketing)/[locale]/…` and `(marketing)/(default)/[locale]/…` | `next.config.mjs` sets `X-Robots-Tag: noindex, follow` on `/fr` and `/fr/:path*` | Active |
| `/app`, `/app/*` | `src/app/(student)/app/layout.tsx` + `(learner)/**` | Root `metadata.robots` noindex on app segment; `Cache-Control` private on `/app` in `next.config.mjs`; `src/proxy.ts` matcher includes `/app/:path*` | Active |
| `/admin`, `/admin/*` | `src/app/(admin)/admin/**` | `src/proxy.ts` redirects unauthenticated users to `/login` with `callbackUrl` for `/admin`; server RBAC still required per project rules | Active |
| `/internal`, `/internal/*` | `src/app/internal/**` | Same unauthenticated redirect as `/admin` in `src/proxy.ts` | Active (narrow) |
| `/modules/*` | `src/app/modules/**` (ecg, lab-values, ecg-interpretation) | **Not** listed in `src/proxy.ts` `config.matcher` — edge proxy behavior differs from `/app` | Active |
| `/api/*` | `src/app/api/**` (300+ route modules) | Per-route Cache-Control; blanket public cache only for `/api/public/:path*` in config; matcher includes `/api/:path*` | Active |
| Probes | `/healthz`, `/readyz`, sitemaps, `/robots.txt`, `/api/health*` | `isPublicProbeOrCrawlerBypassPath` in `src/proxy.ts` skips heavy auth work | Active |

---

## 2. Route groups (App Router)

| Group | Role | URL impact |
|-------|------|------------|
| `(marketing)` | Parent for public site | None (parentheses) |
| `(marketing)/(default)` | English-first marketing + nested `[locale]` exam hub shortcuts | `/`, `/us`, `/canada`, `/blog`, `/tools`, `/[locale]/rn`, etc. |
| `(marketing)/[locale]` | Locale-root tree; layout rejects unknown locales (`notFound`) | `/fr`, `/fr/tools`, `/fr/{slug}`, … |
| `(student)` | Wraps authenticated product | None |
| `(learner)` | All listed `/app/*` pages live here | `/app/dashboard` paths map under this segment |
| `(admin)` | Staff console | `/admin/...` |
| `(study-tools)` | Nested learner tools | Under `/app/...` |

---

## 3. Edge proxy (`src/proxy.ts`)

| Responsibility | Detail |
|----------------|--------|
| Matcher | `"/"`, `"/app"`, `"/app/:path*"`, `"/admin"`, `"/admin/:path*"`, `"/internal"`, `"/internal/:path*"`, `"/api"`, `"/api/:path*"` |
| Admin gate | `enforceAdmin` for `/admin` and `/internal` when JWT has no user identity → redirect `/login` |
| Auth | Delegates to lazy-loaded `@/lib/auth-middleware` |
| Crawler bypass | Health, sitemap, robots, `/api/health` paths |

**Ownership gap (runtime):** Most marketing URLs (`/us`, `/canada`, `/blog`, `/modules`, …) are **outside** the proxy matcher. Those flows depend on **page layouts**, **route handlers**, and **redirects**, not on `src/proxy.ts`.

---

## 4. `next.config.mjs` (platform)

| Layer | Owner | Examples |
|-------|--------|----------|
| `redirects()` | Next | `/sitemap-index.xml` → `/sitemap.xml`; allied host sitemap; HTTP→HTTPS on www/naked; `/nursing/rn/blog` → `/blog/rn`; `/us|/canada/allied/allied-health` → `/allied/allied-health` |
| `headers()` | Next | French locale noindex; `/app` private cache; `/api/public` edge cache |

---

## 5. Legacy Vite / Replit / client monolith (routing-adjacent)

| Artifact | Routing impact |
|----------|----------------|
| `@legacy-client` → `workspace/client/src` | **Bundler alias only** in `next.config.mjs` (webpack + turbopack). No parallel Next tree. |
| `npm run dev:client` (Vite) | Separate dev server; URLs are **not** the App Router map. |
| `src/lib/legacy/**` | Runtime helpers; not a router. |

---

## 6. API ownership (by prefix)

| Prefix | Owner intent |
|--------|--------------|
| `/api/admin/*` | Staff operations |
| `/api/learner/*` | Signed-in learner |
| `/api/modules/ecg/*` | Module APIs aligned with `/modules/ecg` |
| `/api/practice-tests/*` | Practice / CAT flows |
| `/api/exams/*` | Parallel “exam” HTTP API naming (see duplicate report) |
| `/api/debug/*`, parts of `/api/internal/*` | **DEV_ONLY** |

---

## 7. Programmatic SEO ownership

| English | Localized |
|---------|-----------|
| `(marketing)/(default)/seo/[slug]/page.tsx` → `/seo/[slug]` | `(marketing)/[locale]/[slug]/page.tsx` → `/{locale}/{slug}` (file comment: English canonical under `/seo/[slug]`) |

Admin: `(admin)/admin/seo/page.tsx`.

---

## Summary

Marketing is split across **`(default)`** and **`[locale]`** siblings plus **`(default)/[locale]/...`** nested hubs. Learner product is **`(student)/app/(learner)`**. Admin + a thin **`/internal`** tree share the **proxy login gate**. **`/modules`** is a third public product tree. **`next.config.mjs`** owns several **canonical redirects** that override page trees.

See `duplicate-route-systems.md` and `dead-route-candidates.md` for collisions and drift.

