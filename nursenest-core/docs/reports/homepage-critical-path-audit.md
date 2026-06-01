# Homepage Critical Path Audit

Generated: 2026-06-01

## Executive Summary

The homepage is already safer than the readiness endpoint was: it uses ISR, bounded optional fetches, fail-soft stats, server-rendered hero/trust islands, disabled route prefetch on tracked marketing links, and below-fold dynamic sections.

The main remaining production risk was below-fold optional work still being allowed to hold the page render for up to 1000ms. This was reduced to 150ms in this pass.

## Current Critical Path

| Area | Current Path | DB Usage | Network Usage | Filesystem Usage | Cost/Risk |
|---|---|---:|---:|---:|---|
| Server render | `src/app/(marketing)/(default)/page.tsx` | optional only | none direct | none direct | moderate CPU from large React tree |
| Metadata | static functions from marketing labels | none | none | none | low |
| Region | `getMarketingRegionFromCookies()` | none | none | cookie access only | low |
| Region cards | `listPublishedHomeGlobalRegionCardIds()` | none | none | static module data | low |
| Stats | `HomeRestoredWithDeferredStats(skipOptionalDbReads: true)` | skipped on homepage render | none | none direct | low |
| Blog teaser | `HomeBlogTeaserSectionAsync()` | optional blog query | DB socket if cache miss | none | bounded to 150ms |
| Hero/trust | server islands | none | image references only | none direct | low hydration cost |
| Below-fold sections | `dynamic(..., { ssr:false })` behind visibility gate | none on initial render | chunk fetch later | none | protects initial JS |
| Analytics | lazy after paint/idle | network after interaction/idle | analytics only | none | low initial impact |
| Images | homepage screenshot/hero assets | none | image fetch | static assets/CDN | likely LCP-sensitive |

## Implemented Changes

| Change | File | Impact | Effort | Risk |
|---|---|---:|---:|---:|
| Reduced below-fold blog teaser timeout from 1000ms to 150ms | `src/app/(marketing)/(default)/page.tsx` | high | low | low |
| Removed DB work from readiness so homepage crawl bursts no longer eject healthy origin instances | `/readyz`, `/api/health/ready`, `/api/healthz` | high | low | low |
| Moved DB diagnostics to `/healthz/deep` | `src/app/(runtime)/healthz/deep/route.ts` | high | low | low |
| Removed `DATABASE_URL` fingerprinting/logging from `/api/health` | `src/app/api/health/route.ts` | medium | low | low |

## Bottleneck Ranking

| Rank | Bottleneck | Impact | Effort | Risk | Recommendation |
|---:|---|---:|---:|---:|---|
| 1 | Readiness tied to DB during crawl pressure | very high | low | low | implemented |
| 2 | Below-fold blog query could block homepage up to 1000ms | high | low | low | implemented, now 150ms |
| 3 | Large homepage client wrapper imports many static sections | high | medium | medium | convert more below-fold sections to server islands or split client wrappers |
| 4 | Image LCP depends on hero/screenshot asset chain | high | medium | medium | verify `fetchpriority`, dimensions, and compressed WebP/AVIF variants |
| 5 | Homepage React tree size is large | medium | medium | medium | reduce above-fold component count and props |
| 6 | Blog teaser still does optional DB work on request | medium | low | low | serve only from cached/static manifest on homepage |
| 7 | Shared stats background refresh may run during traffic | medium | low | low | keep refresh off critical path; monitor DB reads |
| 8 | Marketing messages/server island message loading | medium | medium | low | precompile minimal homepage message bundle |
| 9 | Below-fold dynamic chunks are numerous | medium | medium | medium | consolidate chunk boundaries by viewport order |
| 10 | Analytics beacons still hydrate eventually | low | low | low | keep after paint/idle |
| 11 | Header/footer CSS and nav assets apply globally | low | medium | medium | audit critical CSS payload |
| 12 | Public route cards are synchronously built | low | low | low | keep static module data |
| 13 | JSON-LD generation | low | low | low | keep static |
| 14 | Fallback logging on optional fetch failures | low | low | low | sample if noisy under crawl |
| 15 | Server stdout from health probes | medium | low | low | implemented for `/api/health`; keep readiness logs startup/slow only |
| 16 | Homepage ISR interval 300s | medium | low | medium | keep unless regeneration collisions show up |
| 17 | Client-side visibility observers | low | low | low | acceptable |
| 18 | Marketing link click analytics dynamic import | low | low | low | acceptable |
| 19 | Trust/hero server islands pass message objects | low | medium | low | trim message object if bundle analysis shows waste |
| 20 | Static CSS atmosphere/gradient paints | low | medium | medium | validate with Lighthouse trace before changing visuals |

## Target Assessment

| Metric | Target | Current Confidence After This Pass |
|---|---:|---|
| TTFB | < 300ms | improved; requires production measurement |
| LCP | < 2.5s | unchanged; image/hero trace required |
| Homepage payload | < 300KB | not certified; bundle analysis required |
| Server render | < 150ms | improved by reducing blog blocker; needs production trace |

## Next Measurement Commands

Run after deploying readiness fix:

```bash
npm run build:production
node scripts/googlebot-load-analysis.mjs --sizes 100,500,1000,2000 --concurrency 4,8,12
```

For Lighthouse/trace certification, run the existing homepage PageSpeed contracts and a production Lighthouse capture against `/`.

## Launch Readiness Assessment

Current certification remains **B to B+ pending redeploy validation**:

- Origin crawl survival should improve because readiness is no longer DB-coupled.
- Homepage render has one fewer slow optional blocker.
- Certification still requires proving `/readyz` p95 < 25ms and homepage TTFB/LCP/payload targets under crawl pressure.
