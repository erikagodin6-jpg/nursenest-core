# Bundle Analysis — NurseNest 2026

**Date:** 2026-05-13  
**Build tool:** Turbopack (Next.js 16.2.6)  
**Measured against:** existing `.next/` output (production build)

---

## 1. CSS Payload Summary

### Built CSS bundles (`.next/static/css/`)

| File | Size | Contents |
|---|---|---|
| `e8390ba6...css` | **1,170 KB** | globals.css (tailwind + design tokens) + all learner-layout CSS |
| `e64ee3b5...css` | **375 KB** | globals.css + premium-redesign-2026.css + marketing CSS |
| `65a95e60...css` | **130 KB** | Learner-only shell CSS (exam/flashcard/cockpit) |
| `779463c6...css` | 60 KB | Smaller route-specific bundles |
| others | ~35 KB | Error/loading boundaries |

### Source CSS files

| File | Size | Route scope |
|---|---|---|
| `globals.css` | 213 KB | **All routes** (root layout) |
| `premium-redesign-2026.css` | 214 KB | Marketing routes only |
| `theme-palettes.css` | 68 KB | All routes (imported by globals) |
| `semantic-status-tokens.css` | 51 KB | All routes (imported by globals) |
| `learner-exam-session-premium.css` | 31 KB | Learner layout only |
| `learner-premium-ds.css` | 31 KB | Learner layout only |
| `learner-flashcard-premium.css` | 18 KB | Learner layout only |
| `marketing-brand-atmosphere.css` | 11 KB | All routes (via globals) |
| `marketing-dark-utilities.css` | 11 KB | All routes (root layout) |
| `full-platform-convergence.css` | 5 KB | All routes (via globals) |
| **Total source CSS** | **724 KB** | |

### Key finding: globals.css is 213 KB uncompressed

The single largest optimization opportunity is the 213 KB `globals.css` which loads on
**every route** including admin and API-adjacent pages. It contains `@import` for
`theme-palettes.css` (68 KB) and `semantic-status-tokens.css` (51 KB), which together
account for 119 KB of the global payload. These are true design-system globals and
cannot be removed, but Tailwind CSS v4's tree-shaking should eliminate unused utilities.

---

## 2. JavaScript Chunk Summary

### Static client chunks (`.next/static/chunks/`)

| Chunk | Size | Contains | Load timing |
|---|---|---|---|
| `56734-...js` | **736 KB** | lucide-react (161 icons, tree-shaken) | Shared across all routes |
| `dc112a36...js` | 299 KB | lottie-react | Lazy — `dynamic()` ssr:false |
| `93794-...js` | 218 KB | (shared vendor) | — |
| `7709...js` | 199 KB | (shared vendor) | — |
| `4bd1b696...js` | 195 KB | (shared vendor) | — |
| `framework-...js` | 185 KB | React 19 + React DOM | All routes (critical path) |
| `9da6db1e...js` | 185 KB | posthog-js | Lazy — `requestIdleCallback` |
| `12642...js` | 154 KB | (shared vendor) | — |
| `main-...js` | 146 KB | Next.js client runtime | All routes |
| `84286-...js` | 117 KB | framer-motion | Lazy — desktop only, `dynamic()` |
| `polyfills-...js` | 110 KB | Browser polyfills | All routes |
| **Total chunks** | **~5 MB** | 167 chunks | |

### Route-level JS (route-specific page bundles)

| Route | Page chunk | Notes |
|---|---|---|
| Homepage `(marketing)/(default)` | **384 bytes** | Near-zero — hero is RSC island |
| Marketing `(default)` layout | 8 KB | Header/nav client components |
| Learner dashboard | 78 KB | Active study session, quick actions |
| Learner layout | 61 KB | Full shell, nav, provider tree |
| Practice tests `[id]` | 205 KB | Full CAT exam runner |
| CNPLE cases `[caseId]` | 166 KB | Clinical case simulator |
| Admin blog | 98 KB | Rich text editor (Monaco/TipTap?) |
| Marketing lesson slug | 76 KB | Pathway lesson detail page |

---

## 3. Heavy Dependency Analysis

### lucide-react — 736 KB shared chunk

- **161 distinct icons** imported across 150+ components
- Already tree-shaken by Turbopack (only used icons bundled)
- The 736 KB is the **minimum footprint** for 161 icons; reducing to ~50 icons would
  cut this chunk to approximately 250 KB
- **Highest-impact optimization**: audit rarely-used icons and replace with inline SVG
  or a custom sprite for the marketing critical path
- Marketing hero currently imports: `ArrowRight, BookMarked, Flame, ShieldCheck, Target`
  from the server component — these are server-only (no client bundle cost)
- **Priority**: Review all client components (`"use client"`) importing lucide icons in
  above-fold marketing paths

### lottie-react — 299 KB

- Already correctly `dynamic()` with `ssr: false`
- Only used by `jitter-branded-loader-lottie.tsx` (branded page loader)
- **Status**: SAFE — never on critical path

### posthog-js — 185 KB

- Already deferred via `requestIdleCallback` with 1500ms timeout
- Contract test enforces this (`homepage-pagespeed-performance.contract.test.ts` #5)
- **Status**: SAFE — never on critical path

### framer-motion — 117 KB

- Already `dynamic()` ssr:false, desktop-only via `MarketingMobileMotionShell`
- Used by: `page-transition-shell.tsx`, `motion-wrapper.tsx`, `success-leaf.tsx`,
  `brand-leaf-mark.tsx`
- `success-leaf` and `brand-leaf-mark` are decorative — could be replaced with CSS
  animations for ~117 KB savings on desktop routes
- **Priority**: MEDIUM — only loads on desktop, already lazy

---

## 4. Duplication Analysis

### nn-premium-hero-stat* CSS classes

Present in two files:
1. `premium-redesign-2026.css` lines 309–405 — original definitions
2. `learner-premium-ds.css` lines ~774–840 — duplicated after CSS split

**Action (Phase 3)**: Extract to `src/app/styles/shared/premium-stat-tiles.css`,
import from both bundles. Saves ~4 KB of duplication and eliminates drift risk.

### premium-redesign-2026.css — monolithic 214 KB marketing stylesheet

Contains CSS for 12+ distinct surface categories in a single 5,846-line file:

| Lines | Section | Target file |
|---|---|---|
| 1–566 | Hero panel, clinical stats, ECG strip | `hero.css` |
| 567–1212 | Marketing header/nav glass premium | `header-nav.css` |
| 1213–1636 | Homepage body sections + theme overrides | `homepage-sections.css` |
| 1637–2556 | Pre-nursing, lessons, hub category cards | `hub-system.css` |
| 2557–3398 | Pathway lesson reading rail | `pathway-reading.css` |
| 3399–4641 | Tier hubs, pricing, NP/RN/PN/NP | `hub-tiers.css` |
| 4642–5081 | Auth, blog, tools, analytics shells | `content-surfaces.css` |
| 5082–5846 | Footer glass, NCLEX commercial landing | `footer-seo.css` |

**Action (Phase 2)**: Split into section-scoped files. Zero visual change — exact CSS
preserved, only import graph reorganized.

---

## 5. Critical Path for Marketing Homepage

First-load JS delivered to `/` (homepage):
- `framework.js` = 185 KB (React 19)
- `main.js` = 146 KB (Next.js runtime)
- `polyfills.js` = 110 KB
- `layout` chunks = ~35 KB (root layout + marketing layout)
- `page` chunk = 0.4 KB (nearly empty RSC page)
- Shared vendor chunks loaded progressively

**Critical observation**: The homepage page bundle is 384 bytes. The hero, clinical
depth section, and trust section are all RSC islands — zero hydration cost. The only
above-fold hydration is `MarketingTrackedLink` (CTA buttons) and `LeafWatermark`.

**First-load CSS for homepage**:
- `e64ee3b5...css` = **375 KB** — this includes globals + premium-redesign
- After gzip: estimated **~60–70 KB** (CSS gzip ratio ~18–20%)

---

## 6. Prioritized Remediation Plan

### P0 — Immediate (zero risk, high reward)
1. **Phase 3**: Extract shared stat tiles → eliminate duplication
2. **Phase 5**: Add CSS payload budget test (catch regressions early)
3. **Phase 4**: globals.css audit → document learner-only selectors leaking globally

### P1 — Short-term (low risk, medium reward)
4. **Phase 2**: Split `premium-redesign-2026.css` → section-scoped files (maintainability)
5. **lucide-react audit**: Review above-fold marketing client components for icon imports;
   replace decorative icons with CSS where feasible
6. **success-leaf + brand-leaf-mark**: Replace framer-motion with CSS animation
   → removes framer-motion from above-fold desktop hydration

### P2 — Medium-term (requires testing)
7. **globals.css split**: Extract learner-only selectors from globals.css into
   learner layout — potential 30–50 KB savings on marketing CSS payload
8. **theme-palettes.css tree-shaking**: 68 KB loaded on all routes; consider
   splitting active-theme-only tokens via CSS custom property injection at runtime

### P3 — Long-term (architectural)
9. **Icon sprite system**: Replace lucide-react with inline SVG sprite for the 20
   most common icons → cut lucide chunk from 736 KB to ~200 KB
10. **Critical CSS inlining**: Inline the above-fold hero + header CSS (<10 KB)
    in the HTML `<head>` to eliminate render-blocking CSS for LCP

---

## 7. Estimated Savings Summary

| Optimization | Est. saving (uncompressed) | Complexity |
|---|---|---|
| Extract shared stat tiles | 4 KB CSS | Low |
| lucide audit (above-fold) | 0 KB (already server) | N/A |
| Framer Motion CSS animations | 117 KB JS | Medium |
| globals.css learner extraction | 30–50 KB CSS (marketing) | High |
| theme-palettes split | 20–30 KB CSS (per-route) | High |
| Icon sprite (top 20) | 400–500 KB JS | High |
