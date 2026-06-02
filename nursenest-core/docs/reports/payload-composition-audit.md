# Route Payload Composition Audit
**Date:** 2026-05-31
**Method:** Playwright Chromium network interception (warm requests, production DB)
**Server:** Next.js 16.2.6 standalone, local loopback (uncompressed sizes)
**Note:** Sizes are uncompressed. With Brotli at CDN: JS compresses ~75%, CSS ~89%, HTML ~70%.

---

## Summary Table

| Route | Total | HTML | JS | CSS | Images | Fonts | JSON | JS% | CSS% | HTML% |
|---|---|---|---|---|---|---|---|---|---|---|
| Homepage `/` | 10.1 MB | 907 KB (9%) | 6,842 KB (68%) | 2,299 KB (23%) | 7 KB | 27 KB | 0 | 68% | 23% | 9% |
| US RN Hub `/us/rn/nclex-rn` | 12.0 MB | 1,632 KB (13%) | 7,286 KB (61%) | 2,299 KB (19%) | 802 KB (7%) | 27 KB | 0 | 61% | 19% | 13% |
| Pricing `/pricing` | 12.8 MB | 2,100 KB (16%) | 8,401 KB (66%) | 2,299 KB (18%) | 15 KB | 27 KB | 0 | 66% | 18% | 16% |
| Lessons Hub `/us/rn/nclex-rn/lessons` | 10.8 MB | 1,764 KB (16%) | 6,713 KB (62%) | 2,299 KB (21%) | 7 KB | 27 KB | 0 | 62% | 21% | 16% |
| Lesson Detail `/us/rn/nclex-rn/lessons/cardiovascular` | 12.5 MB | 1,813 KB (14%) | 8,420 KB (67%) | 2,299 KB (18%) | 4 KB | 27 KB | 0 | 67% | 18% | 14% |

---

## Per-Route Breakdown

### Homepage `/`
**Total: 10.1 MB uncompressed | ~2.0 MB with Brotli**

| Type | Size | % |
|---|---|---|
| JavaScript | 6,842 KB | 68% |
| CSS | 2,299 KB | 23% |
| HTML (SSR) | 907 KB | 9% |
| Fonts | 27 KB | 0.3% |
| Images | 7 KB | 0.1% |
| JSON/API | 0 KB | 0% |

**JS breakdown (top resources):**
- `src_12m8d1g._.js` — 1,168 KB (app shared chunk)
- `node_modules_next_dist_compiled_react-dom_*.js` — 1,033 KB (React DOM)
- `node_modules_0~w2pl2._.js` — 857 KB (Next.js vendor)
- `node_modules_next_dist_compiled_next-devtools_*.js` — 729 KB (Next DevTools)
- `node_modules_next_dist_client_*.js` — 727 KB (Next.js client runtime)
- Remaining ~37 chunks — 2,328 KB

**Notes:** Homepage loads 50 resources. The 907 KB HTML payload includes inline JSON for server stats, homepage hero content, and marketing copy. Deferred stats load correctly from API.

---

### US RN Hub `/us/rn/nclex-rn`
**Total: 12.0 MB uncompressed | ~2.3 MB with Brotli**

| Type | Size | % |
|---|---|---|
| JavaScript | 7,286 KB | 61% |
| CSS | 2,299 KB | 19% |
| HTML (SSR) | 1,632 KB | 13% |
| Images | 802 KB | 7% |
| Fonts | 27 KB | 0.2% |
| JSON/API | 0 KB | 0% |

**Notable:** 802 KB of images — this is the hub page loading hero screenshots/product images. Images are not lazy-loaded on hub pages (they appear above the fold). The 1,632 KB HTML payload includes full pathway hub content, lesson previews, and structured data JSON-LD.

**Additional chunk vs Homepage:** `src_0d.4arn._.js` (580 KB) — hub-specific app code.

---

### Pricing `/pricing`
**Total: 12.8 MB uncompressed | ~2.6 MB with Brotli**

| Type | Size | % |
|---|---|---|
| HTML (SSR) | 2,100 KB | 16% |
| JavaScript | 8,401 KB | 66% |
| CSS | 2,299 KB | 18% |
| Fonts | 27 KB | 0.2% |
| Images | 15 KB | 0.1% |
| JSON/API | 0 KB | 0% |

**Heaviest HTML page:** 2,100 KB — the pricing page SSR-renders the full plan comparison, feature lists, FAQ, and all tier details into the initial HTML. This is intentional for SEO but inflates the initial payload.

**Additional chunks vs Homepage:**
- `src_0fx8215._.js` — 935 KB (pricing-specific client component)
- `node_modules_06p29~r._.js` — 893 KB (additional vendor chunk)

**42 JS chunks** — most JS of any measured route. Pricing page loads the full interactive pricing client, checkout flow, and plan comparison components.

---

### Lessons Hub `/us/rn/nclex-rn/lessons`
**Total: 10.8 MB uncompressed | ~2.1 MB with Brotli**

| Type | Size | % |
|---|---|---|
| JavaScript | 6,713 KB | 62% |
| CSS | 2,299 KB | 21% |
| HTML (SSR) | 1,764 KB | 16% |
| Fonts | 27 KB | 0.3% |
| Images | 7 KB | 0.1% |
| JSON/API | 0 KB | 0% |

**Notes:** 1,764 KB HTML includes the full lesson catalog with all lesson metadata, category filters, and pagination. 54 resources — close to homepage.

---

### Lesson Detail `/us/rn/nclex-rn/lessons/cardiovascular`
**Total: 12.5 MB uncompressed | ~2.5 MB with Brotli**

| Type | Size | % |
|---|---|---|
| JavaScript | 8,420 KB | 67% |
| CSS | 2,299 KB | 18% |
| HTML (SSR) | 1,813 KB | 14% |
| Fonts | 27 KB | 0.2% |
| Images | 4 KB | 0.03% |
| JSON/API | 0 KB | 0% |

**Notes:** Second-heaviest JS load. 1,813 KB HTML contains the full lesson article, clinical content, tables, rationale blocks, and structured data. Additional chunks:
- `node_modules_0hdaasj._.js` — 1,055 KB (lesson viewer vendor)
- `src_0cou2l0._.js` — 745 KB (lesson detail client code)

---

## Top 25 Largest Individual Resources (all routes combined)

| Rank | Type | Size | Resource |
|---|---|---|---|
| 1 | HTML | 2,100 KB | `/pricing` — largest SSR payload |
| 2 | HTML | 1,813 KB | `/us/rn/nclex-rn/lessons/cardiovascular` |
| 3 | CSS | 1,773 KB | `/_next/static/chunks/[root-of-server]__*.css` — global Tailwind |
| 4 | HTML | 1,764 KB | `/us/rn/nclex-rn/lessons` |
| 5 | HTML | 1,632 KB | `/us/rn/nclex-rn` |
| 6 | JS | 1,168 KB | `src_12m8d1g._.js` — large shared app chunk |
| 7 | JS | 1,055 KB | `node_modules_0hdaasj._.js` — lesson viewer vendor |
| 8 | JS | 1,033 KB | `node_modules_next_dist_compiled_react-dom_*.js` — React DOM |
| 9 | JS | 935 KB | `src_0fx8215._.js` — pricing client component |
| 10 | HTML | 907 KB | `/` — homepage |
| 11 | JS | 893 KB | `node_modules_06p29~r._.js` — vendor chunk |
| 12 | JS | 857 KB | `node_modules_0~w2pl2._.js` — vendor chunk |
| 13 | JS | 745 KB | `src_0cou2l0._.js` — lesson detail client |
| 14 | JS | 729 KB | `node_modules_next_dist_compiled_next-devtools_*.js` — **DevTools** |
| 15 | JS | 727 KB | `node_modules_next_dist_client_*.js` — Next.js client runtime |
| 16 | JS | 580 KB | `src_0d.4arn._.js` — hub app code |
| 17 | CSS | 574 KB | `src_app_(marketing)_marketing-styles_*.css` — marketing CSS |
| 18 | JS | 378 KB | `node_modules_0dtz6ca._.js` — vendor chunk |
| 19 | Image | 341 KB | `/images/homepage/question-bank-demo.png` |
| 20 | Image | 244 KB | `/images/homepage/readiness-report-demo.png` |
| 21 | JS | 243 KB | `node_modules_next_dist_115brz8._.js` — Next.js vendor |
| 22 | JS | 237 KB | `src_0o~5vgg._.js` — app code |
| 23 | JS | 226 KB | `node_modules_0xi64u3._.js` — vendor chunk |
| 24 | Image | 211 KB | `/images/homepage/cat-exam-demo.png` |
| 25 | JS | 197 KB | `src_08tii4s._.js` — app code |

---

## CSS Analysis

Both CSS bundles load on every page (no route-level CSS splitting):

| Bundle | Raw | Gzip | Route scope |
|---|---|---|---|
| `[root-of-server]__*.css` | 1,773 KB | ~143 KB | All routes |
| `marketing-styles_*.css` | 574 KB | ~53 KB | Marketing routes |
| **Total** | **2,347 KB** | **~196 KB** | |

CSS compresses exceptionally well (89% reduction). The 2.35 MB raw figure is misleading — at CDN it's ~196 KB, acceptable for a Tailwind-based application. No CSS optimization is urgent.

---

## HTML Size Analysis

| Route | HTML Size | Content reason |
|---|---|---|
| `/pricing` | 2,100 KB | Full plan comparison + FAQ + feature lists + JSON-LD |
| Lesson Detail | 1,813 KB | Full lesson article + clinical tables + structured data |
| Lessons Hub | 1,764 KB | Full lesson catalog (paginated but all metadata inline) |
| US RN Hub | 1,632 KB | Pathway overview + lesson previews + JSON-LD |
| Homepage | 907 KB | Marketing content + hero + deferred stats |

HTML is large because these are content-rich SSR pages. This is correct architecture for SEO — the content needs to be in the initial HTML for Googlebot. HTML compresses well (~70%), so the pricing page HTML drops from 2.1 MB to ~630 KB at CDN.

---

## Critical Observations

### 1. Next DevTools Chunk (729 KB) on All Routes
`node_modules_next_dist_compiled_next-devtools_*.js` is loaded on every page. This chunk has `Cache-Control: public, max-age=31536000, immutable` meaning it IS being served in production. In Next.js 16 with Turbopack, the DevTools bundle ships with the production build and is conditionally activated. Verify whether it executes at runtime or is dead code. If it executes: disable with `experimental.devTools: false` in next.config.mjs.

### 2. Two Identical 774 KB Chunks
`0e-69wtt3re5i.js` and `0ohcimmm7dc_2.js` are both 792,528 bytes and contain the same module patterns (lucide, zod, i18next, question-bank, clinical-skills, flashcards, CAT, ventilator, admin). This suggests a Turbopack chunk deduplication failure. Investigation needed.

### 3. Images Not Lazy-Loaded on Hub
The US RN Hub loads 802 KB of images. Three homepage images total 796 KB (`question-bank-demo.png` 341 KB, `readiness-report-demo.png` 244 KB, `cat-exam-demo.png` 211 KB). These should use `loading="lazy"` below the fold.

### 4. No JSON/API Payloads
Zero bytes of client-side JSON fetches on any measured route. All data is SSR-rendered into HTML. This is correct architecture — no client-side data waterfalls.

### 5. Font Efficiency
27 KB of fonts across all routes. Plus Jakarta Sans at 400/500/600 weights loads efficiently. No action needed.

---

## Compressed Reality Check

These are uncompressed local measurements. Production CDN with Brotli:

| Route | Raw | Brotli est. | Mobile 4G (10 Mbps) |
|---|---|---|---|
| Homepage | 10.1 MB | ~1.9 MB | ~1.5s |
| US RN Hub | 12.0 MB | ~2.2 MB | ~1.8s |
| Pricing | 12.8 MB | ~2.4 MB | ~1.9s |
| Lessons Hub | 10.8 MB | ~2.0 MB | ~1.6s |
| Lesson Detail | 12.5 MB | ~2.3 MB | ~1.8s |

On a modern 4G connection (10 Mbps), total transfer takes 1.5–1.9 seconds. The browser can begin rendering before all resources are downloaded, so LCP is typically 1–2 seconds after the initial HTML parse, not after full resource load.

---

## Optimization Opportunities (analysis only)

| Item | Saving | Effort |
|---|---|---|
| Investigate/disable Next DevTools chunk | -729 KB | Low |
| Fix duplicate 774 KB chunks | -774 KB | Medium |
| Lazy-load product images on hub pages | -600 KB (above-fold images) | Low |
| Lazy-load Sentry SDK | -380 KB est. | Medium |
| Lazy-load posthog-js after interaction | -260 KB | Medium |
| Consolidate dayjs + deduplicate | -100 KB | Low |
| Lazy-load stripe-js on checkout pages only | -100 KB | Low |
| Route-level CSS splitting | -574 KB on learner routes | High |
| **Total addressable** | **~3.5 MB raw (~700 KB Brotli)** | |
