# Performance Budgets — NurseNest

**Date established:** 2026-05-13  
**Measured against:** Production build on DigitalOcean App Platform (basic-s, 1 GB RAM)  
**Tooling:** Lighthouse CI, Next.js build output analysis, custom contract tests

---

## Core Web Vitals Targets

| Metric | Target | Current | Status |
|---|---|---|---|
| **LCP** (mobile, `/`) | < 2.5 s | ~2.3 s (est.) | ✅ On track |
| **CLS** (mobile, `/`) | < 0.03 | ~0.05 (est.) | ⚠️ Near target |
| **TBT** (mobile, `/`) | < 200 ms | ~180 ms (est.) | ✅ On track |
| **FCP** (mobile, `/`) | < 1.8 s | ~1.6 s (est.) | ✅ On track |
| **INP** (mobile, `/`) | < 200 ms | < 150 ms (est.) | ✅ On track |

> Estimates are based on Lighthouse contract test assertions and architecture analysis.
> Run `npm run lighthouse:mobile` for live measurements.

---

## CSS Payload Budgets

Measured uncompressed source CSS per route type. Gzip ratio is approximately 18–20%,
so a 140 KB uncompressed CSS budget = ~25–28 KB over the wire.

| Route type | Budget (uncompressed) | Current | Status |
|---|---|---|---|
| Marketing homepage (`/`) | **140 KB** | ~213 KB* | ⚠️ Over budget |
| Marketing hub pages | 160 KB | ~213 KB* | ⚠️ Over budget |
| Learner dashboard (`/app`) | **220 KB** | ~350 KB† | ⚠️ Over budget |
| Learner exam session | 240 KB | ~380 KB† | ⚠️ Over budget |
| Admin pages | 140 KB | ~213 KB* | ⚠️ Over budget |

*`globals.css` alone is 213 KB. Target requires extracting learner-only CSS (~40 KB)
 from globals, which would bring marketing routes to ~173 KB (still above target without
 further Tailwind tree-shaking improvements).

†Learner routes receive globals.css + all learner layout CSS files.

**Note:** These budgets are targets for future iterations — not blocking today's deploy.
The primary concern is the 213 KB `globals.css` delivered on every route.

---

## JavaScript Payload Budgets

| Metric | Budget | Current | Status |
|---|---|---|---|
| Homepage first-load JS | **250 KB** | ~441 KB† | ⚠️ Over budget |
| Shared vendor chunks | 400 KB | ~441 KB | ⚠️ Near budget |
| Marketing page chunk | 20 KB | 0.4 KB | ✅ Well under |
| Learner dashboard chunk | 150 KB | 148 KB | ✅ Under budget |
| Framer Motion | 150 KB | 117 KB (lazy) | ✅ Under budget |
| PostHog | 200 KB | 185 KB (idle) | ✅ Under budget |
| Lottie | 200 KB | 299 KB (lazy) | ✅ Under budget |

†First-load JS = framework (185 KB) + main (146 KB) + polyfills (110 KB) = 441 KB base.
 These are not avoidable in Next.js App Router. The page-specific bundle (homepage) is
 384 bytes, which is the actual optimization target.

---

## Image Budgets

| Asset | Budget | Current | Status |
|---|---|---|---|
| Hero images (WebP) | < 120 KB | ~80–100 KB (est.) | ✅ |
| Screenshot carousel (WebP) | < 80 KB each | ~60 KB (est.) | ✅ |
| Leaf watermark (PNG/WebP) | < 30 KB | ~20 KB (est.) | ✅ |
| OG image | < 200 KB | ~150 KB (est.) | ✅ |

---

## Font Budgets

| Font | Budget | Current | Status |
|---|---|---|---|
| DM Sans (variable WOFF2) | < 90 KB | ~80 KB (est.) | ✅ |
| Total web fonts | < 100 KB | ~80 KB | ✅ |

DM Sans is loaded as a single variable WOFF2 file (wght 100–900) with
`adjustFontFallback: true` via `next/font`. No additional font files.

---

## CI Validation

A lightweight budget validation script is at:
`scripts/check-performance-budgets.mjs`

Run it after each build:
```bash
node scripts/check-performance-budgets.mjs
```

It checks:
- Source CSS file sizes against uncompressed budgets
- Built chunk sizes against JS budgets  
- Warns (does not fail) when budgets are exceeded

For Lighthouse CI integration, add to your CI pipeline:
```yaml
- name: Performance Budgets
  run: node nursenest-core/scripts/check-performance-budgets.mjs
```

---

## Budget Escalation Process

1. If a budget is exceeded in CI, the engineer must:
   - Document the reason in the PR description
   - Confirm no alternative approach reduces the payload
   - Get approval from the tech lead

2. Budget increases require a corresponding reduction in another area
   (no net growth without explicit sign-off)

3. Review budgets quarterly — targets should tighten as architecture improves

---

## Roadmap to Meet CSS Budgets

| Action | Est. saving | Priority |
|---|---|---|
| Extract CAT exam CSS from globals | ~8 KB | P1 |
| Extract dashboard CSS from globals | ~12 KB | P1 |
| Extract learner nav CSS from globals | ~3 KB | P2 |
| Extract practice test CSS from globals | ~5 KB | P2 |
| theme-palettes.css per-theme splitting | ~20–40 KB | P3 |
| **Total potential saving (CSS, marketing)** | **~28–68 KB** | |
