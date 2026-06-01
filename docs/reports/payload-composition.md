# Route Payload Composition Audit

**Date:** 2026-06-01  
**Scope:** All major route groups — learner app, marketing, admin  
**Build:** Turbopack production build at `nursenest-core/.next/`  
**Method:** Static analysis of build artifacts (client-reference manifests, chunk files, i18n JSON, font files, RSC payloads)

---

## Executive Summary

Single-page uncompressed payload ranges from **3.9 MB** (admin routes) to **4.8 MB** (marketing lesson preview). With gzip, actual wire transfer is **1.0–1.3 MB per page**. The "9–11 MB" figure refers to the cumulative download across a first-session multi-route flow (full JS pool exhaustion across 2–3 navigations), not a single page.

**Three assets dominate every single route:**

| Asset | Uncompressed per page | Share |
|---|---|---|
| CSS (all chunks) | 1,805–2,468 KB | 41–53% |
| i18n RSC inline payload | 1,395 KB | 28–35% |
| JavaScript bundles | 640–1,155 KB | 15–25% |
| User/content data (RSC) | 40–275 KB | 1–6% |
| Fonts | 58 KB | ~1% |
| Images | External CDN | — |

---

## Build Pool Totals

| Asset type | Files | Total size |
|---|---|---|
| JavaScript chunks | 401 | **14.34 MB** |
| CSS chunks | 26 | **2.76 MB** |
| i18n JSON (en, all shards) | 11 | **1.60 MB** |
| Web fonts (woff2) | 4 | **57.6 KB** |
| Static images (`/static/media`) | 0 | 0 — all on DigitalOcean CDN |

The full JS pool (14.34 MB) is the worst-case download budget for a user who navigates to every distinct route in a session. Individual routes download a 22–25 chunk subset of that pool.

---

## CSS — Largest Contributor Per Page

26 CSS files, 2.76 MB total. The two biggest account for 78% of CSS weight.

| File | Size | What it is |
|---|---|---|
| `10qp3nd~0f7ve.css` | **1,352 KB** | Tailwind v4 utilities + all `nn-*` component classes (global) |
| `0lk9l20rsfme..css` | **518 KB** | Marketing homepage / hero component CSS |
| `0tr6qnla3e0ce.css` | 206 KB | Marketing layout components |
| `1831gx2x.utel.css` | 204 KB | Learner shell: skeleton, nav, drawer, progress fills |
| `134w88hn8zczn.css` | 107 KB | Additional component styles |
| `0t.t1q.q-hev-.css` | 62 KB | Secondary component styles |
| `0ftusz0qohhsi.css` | 55 KB | Further component styles |
| remaining 19 files | 254 KB | Per-feature styles |

**The 1,352 KB Tailwind CSS file loads on every page** — it is the global stylesheet containing all utility classes and custom `nn-*` component rules (12,402 CSS rule blocks). It cannot be split further without abandoning the utility-class approach or implementing component-level CSS splitting.

**CSS per route group:**
- Learner app routes: ~1,805 KB (global + shell)
- Marketing routes: ~2,468 KB (global + shell + marketing hero)
- Admin routes: ~1,805 KB (global + shell)

---

## i18n RSC Payload — Second Largest Contributor

The i18n system serializes the full merged message object into the RSC payload of every SSR page. This payload is embedded as inline `<script>self.__next_f.push(...)` blocks in the HTML document.

**English shard sizes:**

| Shard file | Size | Loaded on |
|---|---|---|
| `pages.json` | **727 KB** | All marketing + learner routes |
| `learner.json` | **324 KB** | All routes (part of chrome bundle) |
| `marketing.json` | **220 KB** | All routes (chrome bundle) |
| `allied.json` | 168 KB | Allied hub routes only |
| `components.json` | 106 KB | All routes (chrome bundle) |
| `billing.json` | 23 KB | All routes (chrome bundle) |
| `auth.json` | 13 KB | All routes (chrome bundle) |
| `nav.json` | 13 KB | All routes (chrome bundle) |
| `common.json` + `brand.json` + `errors.json` | 2 KB | All routes (chrome bundle) |

**Per-route i18n inline payload:**

| Route group | Shards loaded | Total (en) | Max (hi/ar) |
|---|---|---|---|
| Marketing + Learner routes | chrome + pages | **1,395 KB** | 1,611 KB |
| Allied hub | chrome + allied | 853 KB | ~1,050 KB |
| Admin routes | chrome + pages + admin | ~1,395 KB+ | — |

The `learner.json` (324 KB) and `marketing.json` (220 KB) are loaded on **all routes** as part of `MARKETING_CHROME_MESSAGE_SHARDS`. These 544 KB of always-on shards include copy for features that are only conditionally rendered (e.g., learner-specific UI copy loading on anonymous marketing pages).

---

## JavaScript — Third Contributor

390 JS files in the chunks pool. Per page, 19–25 chunks are loaded.

**Largest JS chunks (top 15):**

| File | Size | Identified contents |
|---|---|---|
| `0ohcimmm7dc_2.js` | **774 KB** | `RichTextDisplay`, `RichTextEditor`, `AnatomyLabeling`, pre-nursing module components |
| `0e-69wtt3re5i.js` | **774 KB** | Duplicate/split of the above (pre-nursing content editor) |
| `0u5pdnf596dqo.js` | 357 KB | Clinical simulation data (physiology monitor conditions/interventions) |
| `0rwvlt_ft1gql.js` | 342 KB | `framer-motion`, Sentry, Next.js prefetch/navigation runtime |
| `0cjjys2rlo-za.js` | 316 KB | `VentRtSimulationPlayer` (ventilator simulation) |
| `0s~li0t7s.pmd.js` | 307 KB | `framer-motion` animation engine |
| `0~54zw72z7lpx.js` | 255 KB | Unknown (needs bundle analyzer) |
| `0ftyiukx802fc.js` | 226 KB | Unknown (needed by most routes) |
| `0stossngpmwo_.js` | 188 KB | Unknown |
| `0rwcm4nf_od2y.js` | 164 KB | Unknown |
| `0xvcl7zlwnyk6.js` | 152 KB | Unknown |
| `00rh2iircu..g.js` | 147 KB | Unknown |

Two near-identical 774 KB chunks (`0ohcimmm7dc_2.js` and `0e-69wtt3re5i.js`) are the single biggest JS cost and contain the content editor and pre-nursing module UI. These are only needed on admin/author surfaces but may be getting pulled into learner routes via shared component imports.

**JS per route (uncompressed):**

| Route | JS load | Chunks |
|---|---|---|
| Q-Bank | **1,155 KB** | 25 |
| Lesson Detail | 947 KB | 23 |
| Learner Dashboard | 928 KB | 22 |
| Marketing Lesson Page | 928 KB | 23 |
| Flashcards | 907 KB | 22 |
| Pricing | 887 KB | 20 |
| Pharmacology | 876 KB | 21 |
| Practice Tests | 865 KB | 21 |
| Account Analytics | 860 KB | 22 |
| Lessons Page | 831 KB | 21 |
| Practice Test Runner | 799 KB | 21 |
| Allied Hub | 775 KB | 20 |
| Marketing Homepage | 740 KB | 19 |
| Blog Post | 707 KB | 21 |
| Admin Analytics | 664 KB | 16 |
| Admin Dashboard | 640 KB | 16 |

The Q-Bank carries the highest JS weight (1,155 KB / 25 chunks), driven by its virtualized question list, filtering state, and category tree.

---

## Fonts

4 woff2 files, **57.6 KB total** — negligible. All preloaded with `<link rel="preload">`.

| File | Size | Purpose |
|---|---|---|
| `fba5a26ea33df6a3-s.p.woff2` | 26.6 KB | Plus Jakarta Sans (primary) |
| `1a099d89ee94ee96-s.woff2` | 21.2 KB | Plus Jakarta Sans weight variant |
| `e629b5bc06499d58-s.woff2` | 8.1 KB | Plus Jakarta Sans italic |
| `0b1dc8ddaa74ba49-s.woff2` | 1.7 KB | Plus Jakarta Sans small caps |

---

## Images

No images are served from the Next.js static bundle. All production images are hosted on **DigitalOcean Spaces CDN** (`nursenest-images.tor1.cdn.digitaloceanspaces.com`). Per-page image weight depends on content but is not part of the HTML/JS/CSS response measured here.

---

## Per-Route Breakdown (Uncompressed)

Methodology: JS from client-reference manifests; CSS estimated from chunk pool minus unused; i18n from shard files on disk; user data estimated from server component data-loading patterns; fonts measured.

> **Reading the table:** All sizes are *uncompressed*. Gzip reduces these by ~73–75% for text assets, so `Total × 0.27 ≈ wire size`. User/HTML includes the structural HTML document and inline RSC data payloads from DB queries.

### Learner App Routes

| Route | JS | CSS | i18n | User/HTML | Font | **Total** | Gzip~ |
|---|---|---|---|---|---|---|---|
| Learner Dashboard `/app` | 928 KB | 1,805 KB | 1,395 KB | 225 KB | 58 KB | **4.31 MB** | ~1.16 MB |
| Lesson Detail `/app/lessons/[id]` | 947 KB | 1,805 KB | 1,395 KB | 175 KB | 58 KB | **4.28 MB** | ~1.15 MB |
| Account Analytics | 860 KB | 1,805 KB | 1,395 KB | 275 KB | 58 KB | **4.29 MB** | ~1.16 MB |
| Account Overview | 850 KB | 1,805 KB | 1,395 KB | 225 KB | 58 KB | **4.23 MB** | ~1.14 MB |
| Q-Bank | 1,155 KB | 1,805 KB | 1,395 KB | 145 KB | 58 KB | **4.45 MB** | ~1.20 MB |
| Flashcards | 907 KB | 1,805 KB | 1,395 KB | 105 KB | 58 KB | **4.17 MB** | ~1.13 MB |
| Practice Test Runner | 799 KB | 1,805 KB | 1,395 KB | 125 KB | 58 KB | **4.08 MB** | ~1.10 MB |
| Practice Tests | 865 KB | 1,805 KB | 1,395 KB | 105 KB | 58 KB | **4.13 MB** | ~1.11 MB |
| Lessons Page | 831 KB | 1,805 KB | 1,395 KB | 105 KB | 58 KB | **4.10 MB** | ~1.11 MB |
| Study Plan | 850 KB | 1,805 KB | 1,395 KB | 105 KB | 58 KB | **4.11 MB** | ~1.11 MB |
| Pharmacology | 876 KB | 1,805 KB | 1,395 KB | 85 KB | 58 KB | **4.12 MB** | ~1.11 MB |
| Exam Day | 852 KB | 1,805 KB | 1,395 KB | 105 KB | 58 KB | **4.12 MB** | ~1.11 MB |
| Prioritization | 851 KB | 1,805 KB | 1,395 KB | 85 KB | 58 KB | **4.10 MB** | ~1.11 MB |

**% breakdown (typical learner route):**
- CSS: **41%**
- i18n RSC: **32%**
- JS: **21%**
- User data/HTML: **5%**
- Fonts: **1%**

### Marketing Routes

| Route | JS | CSS | i18n | User/HTML | Font | **Total** | Gzip~ |
|---|---|---|---|---|---|---|---|
| Marketing Lesson Page | 928 KB | 2,468 KB | 1,395 KB | 105 KB | 58 KB | **4.84 MB** | ~1.31 MB |
| Pricing Page | 887 KB | 2,468 KB | 1,395 KB | 40 KB | 58 KB | **4.73 MB** | ~1.28 MB |
| Marketing Homepage | 740 KB | 2,468 KB | 1,395 KB | 45 KB | 58 KB | **4.60 MB** | ~1.24 MB |
| Blog Post | 707 KB | 2,468 KB | 1,395 KB | 55 KB | 58 KB | **4.57 MB** | ~1.23 MB |
| Allied Hub | 775 KB | 2,468 KB | 853 KB | 65 KB | 58 KB | **4.12 MB** | ~1.11 MB |

**% breakdown (typical marketing route):**
- CSS: **52%** ← marketing hero CSS adds 518 KB vs app routes
- i18n RSC: **29%**
- JS: **16%**
- User data/HTML: **2%**
- Fonts: **1%**

### Admin Routes

| Route | JS | CSS | i18n | User/HTML | Font | **Total** | Gzip~ |
|---|---|---|---|---|---|---|---|
| Admin Dashboard | 640 KB | 1,805 KB | 1,395 KB | 55 KB | 58 KB | **3.86 MB** | ~1.04 MB |
| Admin Analytics | 664 KB | 1,805 KB | 1,395 KB | 75 KB | 58 KB | **3.90 MB** | ~1.05 MB |

---

## Top Contributors — Ranked by Savings Potential

### 1. CSS Tailwind Monolith — 1,352 KB on every page (49% of CSS pool)

`10qp3nd~0f7ve.css` is generated by Tailwind v4 and contains 12,402 CSS rule blocks. It includes every utility class and every `nn-*` component rule used anywhere in the application, delivered to every page regardless of which components are actually rendered.

**Impact:** Shaving 30% of unused utilities from this file would remove ~400 KB from every single page load.

**Fix directions:**
- Enable Tailwind's `@source` directive to scope utility generation to actually-used components
- Audit `nn-*` component classes — split component CSS into per-feature chunks so inactive routes don't pay for unused components
- Marketing homepage hero CSS (`0lk9l20rsfme..css`, 518 KB) loads on all marketing routes — scope it to the hero component only via CSS Modules

### 2. i18n RSC Monolith — 1,395 KB embedded inline per page

The full `pages.json` (727 KB) is embedded in every learner and marketing page's RSC payload via `LEARNER_APP_MESSAGE_SHARDS`. Additionally, `learner.json` (324 KB) is included in `MARKETING_CHROME_MESSAGE_SHARDS`, meaning anonymous marketing visitors pay for 324 KB of authenticated-user copy they will never see.

**Impact:** Removing `pages.json` from the learner shell (keeping it only on routes that actually need page-body copy) would save ~727 KB on the learner dashboard. Moving `learner.json` out of the chrome bundle and into only routes that render learner UI would save ~324 KB on marketing pages.

**Fix directions:**
- Audit each route against its actual shard usage; routes using `getLearnerShellMarketingBundle` already exclude `pages` — ensure the dashboard page itself calls the shell variant where the page body is supplied by client components
- Remove `learner` from `MARKETING_CHROME_MESSAGE_SHARDS`; it is a subscriber-only shard and should load only under `/app/*`
- Stream non-critical i18n shards via `Suspense` boundaries so they do not block the initial HTML flush

### 3. Duplicate 774 KB JS Chunks (Content Editor)

Two near-identical JS chunks (`0ohcimmm7dc_2.js` and `0e-69wtt3re5i.js`, 774 KB each) contain `RichTextDisplay`, `RichTextEditor`, and `AnatomyLabeling` — admin-only content creation components. Whether both load on learner routes needs verification via browser profiling; if they do, this is 1.5 MB of leakage.

**Impact:** If either chunk loads on `/app/*` routes, lazy-loading via `dynamic()` would defer it entirely on learner paths.

**Fix directions:**
- Run `next-bundle-analyzer` to confirm which routes trigger these chunks
- Wrap `RichTextEditor`, `RichTextDisplay`, and `AnatomyLabeling` in `dynamic(() => import(...), { ssr: false })` so they only load in admin/author contexts

### 4. framer-motion Duplication — ~614 KB across two chunks

`framer-motion` appears in both `0rwvlt_ft1gql.js` (342 KB) and `0s~li0t7s.pmd.js` (307 KB). If two separate framer-motion bundles are being included (e.g., different import paths or duplicate package), this wastes ~300 KB per page.

**Fix directions:**
- Check `package.json` for duplicate framer-motion entries
- Audit `imports` across components; some may import from `motion/react` vs `framer-motion` causing two copies

### 5. API Payloads (variable, not captured here)

This audit measures static assets only. For the learner dashboard, 12+ database query results are serialized as RSC JSON at render time. Under a real user load, `loadPremiumDashboardSnapshot` + `computeBenchmarkData` + `buildLearnerStudySnapshot` together return several hundred KB of structured data that is embedded inline. The 200–275 KB "user/HTML" estimates above are conservative for power users with large history.

The 15-minute cache (`DASHBOARD_ANALYTICS_TTL_SECONDS = 900`) already limits the frequency of re-serialization. The remaining lever is response shape — returning only the minimum fields needed for the rendered UI rather than full DB row shapes.

---

## The "9–11 MB" Budget — Where It Comes From

A single page loads 4.1–4.8 MB uncompressed. The 9–11 MB total arises from a **first-session multi-route flow**:

| Navigation | Cumulative JS downloaded | Reason |
|---|---|---|
| Page 1: Dashboard (`/app`) | ~928 KB JS | Initial 22-chunk load |
| Page 2: Q-Bank | +~650 KB new chunks | 3 additional chunks not in dashboard set |
| Page 3: Lesson Detail | +~350 KB new chunks | Lesson-specific chunks |
| Repeat i18n × 3 pages | +4,185 KB | i18n re-serialized per navigation (not cached in RSC) |
| CSS × 3 pages | +5,415 KB | No cross-navigation caching of CSS in current setup |
| **3-page session total** | **~11.5 MB** | Before gzip |

With gzip enabled (which it should be on the CDN/server), wire transfer is approximately **3.1 MB for the same 3-page session**.

---

## Quick Wins — Ordered by Impact

| # | Fix | Saves (uncompressed) | Difficulty |
|---|---|---|---|
| 1 | Remove `learner.json` from chrome shards (marketing pages) | **324 KB per marketing page** | Low — shard group config change |
| 2 | Remove `pages.json` from learner shell; load per-route only | **727 KB per page** | Medium — audit per-route shard usage |
| 3 | Prune unused Tailwind utilities via `@source` scoping | **~300–500 KB per page** | Medium — Tailwind config + CI check |
| 4 | Lazy-load `RichTextEditor` / `AnatomyLabeling` behind `dynamic()` | **up to 774 KB per learner route** | Low — `dynamic()` wrapper |
| 5 | Deduplicate framer-motion import paths | **~300 KB per page** | Low — import audit |
| 6 | Split marketing hero CSS into component-scoped file | **518 KB on non-homepage routes** | Medium — CSS Modules refactor |
| 7 | Slim DB response shapes for dashboard RSC | **50–150 KB per learner route** | Medium — query projection |

Completing items 1–5 would reduce a typical learner page from **4.3 MB to ~2.2 MB uncompressed (~590 KB gzipped)**.
