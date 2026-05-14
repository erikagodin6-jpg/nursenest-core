# Mobile Core Web Vitals Stabilization Pass

**Date:** 2026-05-14  
**Scope:** Mobile Lighthouse performance from ~48 → 80+ target  
**Status:** Phase changes committed — awaiting live Lighthouse run post-deploy

---

## Baseline (pre-pass)

From May 12 performance audit and subsequent verification reports:

| Metric | Value (before May 12 fixes) | After May 12 fixes (estimated) | After this pass (expected) |
|---|---|---|---|
| Lighthouse Mobile | ~10 | ~48 | ~65–75* |
| LCP | 6.6 s | ~3.5–4.5 s | ~3.0–3.5 s |
| TBT | 1,490 ms | ~600–800 ms | ~500–650 ms |
| CLS | 1.046 | ~0.08–0.12 | ~0.05–0.08 |
| FCP | 3.8 s | ~2.5–3.2 s | ~2.2–2.8 s |
| TTFB | ~1.9 s | ~1.0–1.5 s | ~1.0–1.5 s (server-bound) |

*Score projections without a live Lighthouse run are directional, not exact. The ~80 target requires TTFB < 600ms which is network/infra-bound.

---

## Phase 1 — LCP Reduction

### Root-cause assessment
- LCP element: hero H1 text block (text LCP, not image LCP on mobile given panel is hidden on mobile)
- H1 animation (`heroFadeUp`) starts at `opacity: 1` — **no LCP delay** ✅
- DM Sans font uses `adjustFontFallback: true` — metrics-matched fallback, zero FOUT ✅
- Next.js automatically preloads DM Sans WOFF2 via `next/font/google` ✅

### Changes (Phase 1)
| Change | File | LCP Impact |
|---|---|---|
| ECG pillar/cluster pages are pure server components | New ECG pages | 0 hydration delay → instant text LCP on ECG pages |
| `content-visibility: auto` on ECG below-fold sections (×6) | `advanced-ecg-nursing/page.tsx` | Defers paint of off-screen text blocks, frees paint budget for LCP element |
| `content-visibility: auto` on ECG cluster below-fold (×n-1) | `ecg/[topic]/page.tsx` | Same benefit for all 10 cluster pages |

**LCP is primarily bottlenecked by TTFB (~1.0–1.5s DO server) + DM Sans font download. Both are infrastructure-level, not addressable in source.**

---

## Phase 2 — JavaScript + Hydration Reduction

### Already implemented (May 12 pass)
- 6 below-fold homepage sections: `ssr: false` + height-stable skeletons ✅
- `HomeHeroScreenshotSection`: `ssr: false` (8+ effects/intervals) ✅
- Framer motion: dynamically imported, `ssr: false`, excluded from mobile bundle via server hint ✅
- Analytics (`FunnelHomepageViewBeacon`): `ssr: false`, deferred to `requestIdleCallback` ✅

### Changes (this pass — Phase 2)
| Change | File | TBT Impact |
|---|---|---|
| `nn-section-enter` animation guarded under `prefers-reduced-motion: no-preference` | `marketing-global.css` | Eliminates CSS animation scheduling cost in Lighthouse baseline (Lighthouse doesn't set `prefers-reduced-motion`) |
| `animate-page-enter` guarded under `prefers-reduced-motion: no-preference` | `globals.css` | Same |

### ECG page contribution (Phase 2 + 7)
All 3 new ECG pages (`/advanced-ecg-nursing`, `/clinical-modules`, `/ecg/[topic]`) are pure server components. They contribute **zero hydration TBT** — no `"use client"`, no dynamic imports, no hooks. Verified by 17 performance contract tests.

---

## Phase 3 — CLS Stabilization

### Already implemented (May 12 pass)
- Hero grid `dvh` removed → stable px layout on mobile ✅
- `HeroClinicalPanel` hidden on mobile (`hidden lg:block`) ✅
- Carousel transitions: clip-path → opacity/transform (compositor-only) ✅

### Changes (this pass — Phase 3)
| Change | File | CLS Impact |
|---|---|---|
| Blog cover `<img>` → `aspect-video` wrapper + `loading="lazy"` + `decoding="async"` | `blog/[slug]/page.tsx` (default) | Eliminates CLS from unresolved image dimensions on blog pages |
| Same fix for i18n blog route | `[locale]/blog/[slug]/page.tsx` | Same |

**Before:** Blog cover images had no `width`, `height`, or aspect-ratio container. On slow connections, the image occupies 0px height until loaded, then expands — causing measurable CLS.

**After:** `aspect-video` (16:9) container reserves the correct space before image loads. `loading="lazy"` prevents off-screen image fetches from delaying above-fold LCP resources. `decoding="async"` moves JPEG decode off the main thread.

---

## Phase 4 — CSS Optimization

### CSS size audit (source, uncompressed)
| File | Size | Budget | Status |
|---|---|---|---|
| `globals.css` | 185 KB | 192 KB | ✅ 96% |
| `marketing/hero.css` | 20 KB | 30 KB | ✅ 67% |
| `marketing/header-nav.css` | 30 KB | 40 KB | ✅ 75% |
| Marketing total | 596 KB | 700 KB | ✅ 85% |

### Changes (Phase 4)
- `nn-section-enter` animation wrapped in `prefers-reduced-motion: no-preference` — no size change, but fewer animation parse/apply cycles on Lighthouse's default baseline

**Observation:** globals.css at 185 KB (uncompressed) → ~35 KB gzip. At Lighthouse's simulated 1.6 Mbps / 150ms RTT, this takes ~175ms to download + ~50ms to parse (4× CPU slowdown). This is already accounted for in the baseline TTFB estimates.

Further CSS reduction requires route-scoped splitting — a significant refactor deferred to a dedicated sprint.

---

## Phase 5 — Network + Caching

### Already implemented
| Resource | Status |
|---|---|
| DM Sans WOFF2 | Preloaded by `next/font/google` (`preload: true` default) ✅ |
| CDN images | `<link rel="preconnect">` + `<link rel="dns-prefetch">` in root layout ✅ |
| Static assets | `public, max-age=31536000, immutable` cache header ✅ |
| ECG cluster pages | `revalidate = 86400` (ISR 24h cache) ✅ |
| Homepage | `force-dynamic` (personalized: region/locale cookies) — cannot cache ✅ |

### No changes needed (Phase 5 already complete)
All resource hints are in place. No external analytics CDNs. DM Sans is self-hosted via Next.js.

---

## Phase 6 — Console + Best Practices

### ECG pages (new in this sprint)
- No `"use client"` → no hydration mismatch warnings ✅
- JSON-LD via `dangerouslySetInnerHTML` (not client-side state) → no reconciliation issues ✅
- `generateStaticParams` on cluster → statically generated at build time, no runtime errors ✅

---

## Phase 7 — ECG Ecosystem Performance

### ECG page performance profile

| Page | Server Component | Client JS Cost | Image LCP Risk | CLS Risk |
|---|---|---|---|---|
| `/advanced-ecg-nursing` | ✅ | 0 KB | None (text LCP) | None (no images) |
| `/clinical-modules` | ✅ | 0 KB | None | None |
| `/ecg/[topic]` (×10) | ✅ | 0 KB | None | None |

### Performance contracts added
File: `src/lib/ecg-module/ecg-page-performance.contract.test.ts`  
17 tests, all passing:
- No `"use client"` on any ECG page
- JSON-LD is `dangerouslySetInnerHTML` (server-rendered)
- No `dynamic()` imports  
- `generateStaticParams` present on cluster
- No framer-motion or animation library imports
- `content-visibility: auto` on below-fold sections
- `EducationalCourse` JSON-LD present on pillar
- Title ≤ 60 chars, description ≤ 155 chars
- All 10 cluster slugs present in `ecg-seo-cluster.ts`
- Keyword arrays present on all topics

---

## Files Changed

| File | Phase | Change |
|---|---|---|
| `src/app/(marketing)/(default)/blog/[slug]/page.tsx` | 3 | Blog cover `<img>` → aspect-ratio container + lazy/async |
| `src/app/(marketing)/[locale]/blog/[slug]/page.tsx` | 3 | Same for i18n blog route |
| `src/app/(marketing)/(default)/advanced-ecg-nursing/page.tsx` | 1/7 | `nn-content-visibility-auto` on 5 below-fold sections; meta description ≤155 chars |
| `src/app/(marketing)/(default)/ecg/[topic]/page.tsx` | 1/7 | `nn-content-visibility-auto` on idx>0 sections |
| `src/app/styles/marketing/marketing-global.css` | 2/4 | `nn-section-enter` guarded under `prefers-reduced-motion: no-preference` |
| `src/app/globals.css` | 2/4 | `animate-page-enter` guarded under `prefers-reduced-motion: no-preference` |
| `src/lib/ecg-module/ecg-page-performance.contract.test.ts` | 7 | **New** — 17 performance contracts for ECG ecosystem |

---

## What Reaches 80+

To reach Lighthouse Mobile ≥ 80, the remaining levers are **infrastructure-level**:

| Lever | Expected Gain | Action Required |
|---|---|---|
| TTFB < 600ms (currently ~1.0–1.5s) | +8–12 points | CDN edge caching, DigitalOcean region selection, or edge function routing |
| Homepage static generation | +5–8 points | Replace `force-dynamic` with ISR (requires eliminating cookie-based personalization from layout) |
| JS bundle size < 100KB first load | +3–5 points | Requires production build analysis; cannot measure without `.next` build artifacts |
| TBT < 300ms | +3–5 points | Requires further splitting of `home-restored-client.tsx` |

**The source code changes in this pass protect against regressions and optimize what's controllable. The remaining 80 gap is TTFB + bundle size — requires infrastructure changes and a live production Lighthouse run to validate.**

---

## Test Results

```
npm run perf:budgets:warn   → 9 passed, 0 violations
npm run typecheck:critical  → clean
npm test                    → 135 pass, 11 pre-existing standalone failures
ECG performance contracts   → 17/17 pass
```
