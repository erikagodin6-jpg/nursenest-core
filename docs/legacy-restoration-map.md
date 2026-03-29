# Legacy → current restoration map (NurseNest)

This document records a **structured audit** of where Replit-era behavior lives today, what is **preserved**, what is **partial / duplicated**, and what must stay **out** of the hot path to avoid historical failures (white screens, blocking loads, stale SW caches, oversized i18n payloads).

**Do not flatten everything into one giant rewrite.** Restore in **controlled layers**, in order—each layer can ship independently; skip ahead only when a downstream layer has nothing to do yet.

| # | Layer | Purpose | Where in this doc |
|---|--------|---------|-------------------|
| **1** | **Audit** | Find originals (`legacy/`, monolith, `git`, remotes), note gaps and risks | [Sources](#legacy-sources-in-repo) below; search per [Restoration workflow](#restoration-workflow-reuse-old-code-first) |
| **2** | **Feature matrix** | Map feature → old path → current path → status → action → priority | [Feature matrix](#feature-matrix-summary) |
| **3** | **Critical user-facing restoration** | Smallest vertical slices (nav, paywall, key flows); **reuse/adapt** old code first | [Restoration workflow](#restoration-workflow-reuse-old-code-first) |
| **4** | **Reliability / performance protections** | SW, i18n pipeline, lazy boundaries, server-side access—**before** or **with** code changes | [Performance protections](#performance-protections-do-not-regress) |
| **5** | **Validation** | Typecheck, build, targeted tests, route sanity | [Validation](#validation) |
| **6** | **Commit and push** | Prefer one logical commit per layer or per vertical slice; push when that slice is green | — |

---

## Legacy sources (in-repo)

**Sources inspected (in-repo):**

| Source | Role |
|--------|------|
| `nursenest-core/src/legacy/marketing/*` | Extracted marketing UI (heroes, grids, CTAs) used by Next marketing home |
| `nursenest-core/src/components/marketing/home-restored-client.tsx` | Controlled re-integration: dynamic imports, hero image tiers, proxy fallbacks |
| `client/src/pages/home.tsx` + `client/src/components/home-*` | **Parallel** Vite SPA marketing implementation (same conceptual sections, different file tree) |
| `client/public/sw.js` | Service worker: versioned caches, bounded runtime cache, network-first navigate |
| `server/lesson-content-api.ts`, `server/admin-auth.ts`, `server/entitlements.ts`, `server/trial-subscription.ts` | Server-side lessons, paywall, trials, entitlements |
| `client/src/App.tsx` | Route-level lazy loading, multiple error boundaries, protected routes |
| `tools/i18n/*`, `script/compile-i18n.ts`, `docs/i18n-architecture.md` | Canonical i18n pipeline (avoids duplicate runtime translation systems) |
| `.local/tasks/*` (internal) | Historical task notes (e.g. paywall enforcement) — cross-check against current code |
| Git remotes `subrepl-*` | Optional Replit workspace mirrors for line-by-line archaeology (`git fetch`, `git diff`) |

**Not available as a full tree in this workspace:** a single frozen export of the entire old app. Use remotes + `nursenest-core/src/legacy` + monolith `client/` as the practical baseline.

---

## Restoration workflow (reuse old code first)

When bringing back legacy behavior, **do not re-implement from memory**. Follow this order:

1. **Find the original** — Search the repo (including `nursenest-core/src/legacy/`, `client/src/components/`, `server/`, `scripts/`) and, when needed, **`git log -p -- path`** or a **`subrepl-*`** remote for the last known Replit-era version of the feature.
2. **Compare** — Read old vs current side by side: completeness, edge cases, error handling, and any comments or tests that show production hardening.
3. **Prefer adapt and restore** — If the old code is **more complete** or **production-proven**, **adapt it** into the current architecture (same hooks, types, and file layout as surrounding code). Wire it through existing integration points (e.g. `home-restored-client.tsx` for marketing, server middleware for paywall).
4. **Only then write new code** — New code is justified when no usable original exists, or when the original is incompatible with non-negotiable safeguards below (without a focused refactor).
5. **Still obey safeguards** — Reused code must respect [Performance protections](#performance-protections-do-not-regress) (lazy boundaries, i18n pipeline, SW/cache behavior, server-side access checks).

This workflow is also captured for the agent in `.cursor/rules/legacy-restoration.mdc`.

---

## Performance protections (do not regress)

| Risk (historical) | Current mitigation |
|---------------------|-------------------|
| Oversized translation payloads | Merged JSON from `tools/i18n`; compile pipeline; see `docs/i18n-architecture.md` |
| Stale service worker | `CACHE_VERSION` bumps in `client/public/sw.js`; `activate` deletes old caches; clients notified via `SW_UPDATED` |
| Broken chunks / white screen | Heavy use of `React.lazy`, route-level code splitting in `App.tsx`, `Suspense` fallbacks |
| Hero / CDN images failing | Tiered fallbacks in `home-restored-client.tsx` (`getHeroSlideSrc`, local SVG); `marketing-assets` proxy |
| Unbounded API caching | SW only caches allowlisted `/api/*` paths; runtime cache trimmed (`MAX_RUNTIME_CACHE_ITEMS`) |
| Auth / billing bypass | Prefer **server** checks (`requireAnyPaidTier`, lesson content API, entitlements); client guards are additive |

---

## Feature matrix (summary)

Columns: **feature** | **old / legacy location** | **current location** | **status** | **recommended action** | **priority**

### A — Design / UI / theme

| Feature | Legacy / old | Current | Status | Action | Pri |
|---------|--------------|---------|--------|--------|-----|
| Marketing hero sections | `nursenest-core/src/legacy/marketing/*` | `home-restored-client.tsx` (dynamic imports) | Preserved (controlled) | Keep current integration; edit legacy components, not duplicate copies | High |
| Vite home marketing | `client/src/components/hero-*.tsx`, `home-*.tsx` | Same names under `client/src/components/` | Partial / duplicate vs Next | Long-term: extract shared primitives or document “change both” policy | Medium |
| Global theme tokens | `client/src/index.css`, Tailwind, `next-themes` | Monolith + core | Preserved | Keep | Medium |
| Navigation / footer | `client/src/components/navigation.tsx`, `footer.tsx` | Used by Vite app; core has its own layout | Partial | Align IA labels via shared constants where possible (`@shared/*`) | High |

### B — Auth / session

| Feature | Legacy / old | Current | Status | Action | Pri |
|---------|--------------|---------|--------|--------|-----|
| Session / JWT | Replit patterns | `client/src/lib/auth.tsx`, server `resolveAuthUser` | Preserved | Keep; do not duplicate token logic | Critical |
| Admin | `requireAdmin` | `server/admin-auth.ts`, admin routes | Preserved | Keep | Critical |
| Protected routes | — | `client/src/components/protected-route.tsx`, `App.tsx` | Preserved | Keep | Critical |
| Preview tier (admin) | — | `PreviewBanner` in `App.tsx` | Preserved | Keep | Medium |

### C — Paywall / Stripe / access

| Feature | Legacy / old | Current | Status | Action | Pri |
|---------|--------------|---------|--------|--------|-----|
| Lesson tier derivation | Slug heuristics | `deriveTier()` in `server/lesson-content-api.ts` (defaults unmatched → `rpn`, not `general`) | Preserved | Keep | Critical |
| Free preview cap | — | `FREE_LESSON_PREVIEW_LIMIT`, content API checks | Preserved | Keep; extend tests | Critical |
| Paid middleware | — | `requireAnyPaidTier`, `trial-subscription.ts` | Partial | Audit remaining premium routes per `.local/tasks/enforce-server-side-paywall.md` | Critical |
| Entitlements | — | `server/entitlements.ts` | Preserved | Keep | High |

### D — Exam / study tools

| Feature | Legacy / old | Current | Status | Action | Pri |
|---------|--------------|---------|--------|--------|-----|
| Exam routes + error boundaries | — | `ExamErrorBoundary`, `App.tsx` routing | Preserved | Keep lazy exam bundles | Critical |
| CAT / mock / adaptive | — | `client/src/pages/*` | Preserved | Incremental fixes with profiling | High |

### E — Content / lessons / translations

| Feature | Legacy / old | Current | Status | Action | Pri |
|---------|--------------|---------|--------|--------|-----|
| Lesson API | — | `server/lesson-content-api.ts` | Preserved | Keep | Critical |
| UI i18n | Multiple tables | Single compile pipeline + `docs/i18n-architecture.md` | Merged | Do not reintroduce parallel loaders | Critical |
| Marketing copy | JSON packs | `tools/i18n/marketing/*` merged at compile | Merged | Keep | High |

### F — Marketing / SEO / conversion

| Feature | Legacy / old | Current | Status | Action | Pri |
|---------|--------------|---------|--------|--------|-----|
| Next home | — | `nursenest-core/src/app/(marketing)/(default)/page.tsx` → `HomeRestoredClient` | Preserved | Keep lazy legacy sections | High |
| SEO metadata | — | `SEO` component, `seo-metadata`, core `metadata` | Preserved | Keep | High |
| Legacy route mapping | — | `nursenest-core/src/lib/legacy-marketing-routes.ts` | Preserved | Keep when changing URLs | Medium |

### G — Media / assets

| Feature | Legacy / old | Current | Status | Action | Pri |
|---------|--------------|---------|--------|--------|-----|
| Marketing images | gs:// URLs | `marketing-assets` proxy + `getHeroSlideSrc` tiers | Preserved | Never load raw `gs://` in `<img>` | Critical |
| Logos | — | `ThemedLogo`, etc. | Preserved | Keep | Medium |

### H — Reliability

| Feature | Legacy / old | Current | Status | Action | Pri |
|---------|--------------|---------|--------|--------|-----|
| Error boundaries | — | `AppErrorBoundary`, `PlatformErrorBoundary`, `RouteErrorBoundary`, exam/flashcard/lesson safe fallbacks | Preserved | Keep | Critical |
| Service worker | Aggressive SW (old) | `client/public/sw.js` v7 + bounded caches | Adapted | Bump `CACHE_VERSION` on asset contract changes | High |
| Offline | — | `offline.html`, offline API cache | Partial | Keep | Medium |

### I — Admin / CMS

| Feature | Legacy / old | Current | Status | Action | Pri |
|---------|--------------|---------|--------|--------|-----|
| Admin dashboards | — | `client/src/pages/admin*.tsx`, APIs under `/api/admin/*` | Preserved | Incremental | Medium |
| i18n diagnostics | Monolith `/admin/i18n` | Monolith + **Next** `/admin/i18n`, `server/i18n-diagnostics-report.ts`, Next `/api/admin/i18n-diagnostics` | Active | Keep single builder | Medium |

---

## Intentionally not restored (or deferred)

| Item | Reason |
|------|--------|
| Blind copy of entire Replit tree | Would reintroduce duplicate routers, env, and bundle bloat |
| Second client-side translation runtime | Replaced by compile pipeline + documented architecture |
| Eager import of all legacy marketing | Replaced by `dynamic()` + `LazySection` in `home-restored-client.tsx` |
| Full route parity between Vite and Next in one pass | Requires product decision; track as medium-term merge |

---

## What was restored in this documentation pass (changelog)

- **Documentation only (this commit):** `docs/legacy-restoration-map.md` (this file), `nursenest-core/src/legacy/README.md`.
- **No mass file copy** from remotes; architecture was validated against current `server/` and `client/`/`nursenest-core/` sources.

---

## Recommended next steps (engineering)

1. **P1 — Server paywall audit:** Close gaps on any premium API still missing `requireAnyPaidTier` / lesson rules (see internal task notes).
2. **P1 — Marketing parity:** Decide whether Vite `client/src/components/home-*` and Next `legacy/marketing/*` should share a **single** package or codegen to prevent drift.
3. **P2 — SW cache:** Document release checklist entry when bumping `CACHE_VERSION` in `client/public/sw.js`.
4. **P2 — Locale + SEO:** Regression pass on localized marketing routes after i18n merges.

---

## Validation

Layer **5** — run after each meaningful restoration slice, not only at the end.

| Check | Command / note |
|-------|----------------|
| Server TS | `npm run check:server` (uses `tsconfig.server.json`; lighter than full `tsc`). Keep `server/storage.ts` free of implicit-`any` parameters so this stays green. |
| Full TS | `npm run check` (may require `NODE_OPTIONS=--max-old-space-size=8192` on large workspaces) |
| i18n | `npm run i18n:status`, `npm run i18n:compile` per `docs/i18n-architecture.md` |
| Build | `npm run build` / nursenest-core build per CI |

---

## References

- `docs/i18n-architecture.md` — translation pipeline and safeguards  
- `nursenest-core/src/legacy/README.md` — how legacy marketing components are consumed  
- `.local/tasks/enforce-server-side-paywall.md` — paywall hardening checklist (if present in clone)
