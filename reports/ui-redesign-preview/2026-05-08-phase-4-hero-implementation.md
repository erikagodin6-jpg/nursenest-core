# Phase 4 — Premium homepage hero implementation report

**Date:** 2026-05-08
**Author:** Cline (NurseNest production governance)
**Surface:** Public homepage hero (`/`, `/[locale]`)
**Scope:** Visual treatment + new headline/sub copy (English baseline) for the
top hero only. **Not** a homepage-wide redesign.

---

## 1 · What changed

| File | Status | Lines | Purpose |
| --- | --- | ---: | --- |
| `nursenest-core/src/components/marketing/home/premium-homepage-hero.tsx` | **NEW** | 320 | Premium clinical hero — copy column + clinical dashboard panel (ECG, semantic stats, mini lesson cards). |
| `nursenest-core/src/components/marketing/home-restored-client.tsx` | modified | -1 / +14 | Swap `HomeConversionHero` → `PremiumHomepageHero`; remove unused import; add inline rollback comment. |
| `UICanvas/hero-mockup.html` | new (artifact) | — | Static, real-CSS preview frames used for screenshot capture. Not shipped. |
| `UICanvas/capture-hero-mockup.cjs` | new (artifact) | — | Playwright capture script. Not shipped. |
| `preview-screenshots/phase4-hero-*.png` | new (artifacts) | — | Visual evidence (Ocean / Midnight / Apex desktop + Ocean mobile + canvas). |

`nursenest-core/src/components/marketing/home-conversion-hero.tsx` is **kept on
disk unchanged** for emergency rollback (single import + render swap reverts
to the prior hero with no other code change).

---

## 2 · Production governance — preserved behavior

| Concern | Old hero | New hero | Preserved? |
| --- | --- | --- | --- |
| Outer wrapper class | `nn-hero-bridge nn-home-marketing-rich-hero` | same | ✅ |
| `<h1 id>` | `home-conversion-hero-heading` | same | ✅ |
| Primary CTA destination | `safePath(locale, HUB.questionBank)` | same | ✅ |
| Secondary CTA destination | `safePath(locale, HUB.examLessons)` | same | ✅ |
| Primary analytics event | `PH.marketingHomeHeroPrimaryCta` w/ `{ region }` | same | ✅ |
| Secondary analytics event | `PH.marketingHomeHeroSecondaryCta` w/ `{ region }` | same | ✅ |
| Region wiring | `useNursenestRegion()` w/ try/catch fallback `"CA"` | same | ✅ |
| Locale wiring | `useMarketingI18n()` w/ try/catch fallback `"en"` | same | ✅ |
| `withMarketingLocale` fallback | `safePath` w/ try/catch | same | ✅ |
| Stats line (`q questions · lessons` / fallback) | `pages.home.hero.statsFallback` | same key | ✅ |
| ShieldCheck "no credit card" | `pages.home.hero.noCreditCard` | same key, kept inside trust pill | ✅ |
| Primary/secondary CTA labels | `pages.home.hero.primaryCta` / `secondaryCta` | same keys | ✅ |
| Existing `pages.home.hero.headline` / `subheading` translations | renders | **not used** by new hero (new keys instead) | ✅ no override |

### i18n strategy (no silent copy churn)

The user-requested new copy ships under **new** premium-only keys, leaving
existing translations of `pages.home.hero.headline` /
`pages.home.hero.subheading` untouched on disk. New keys (with English
fallbacks via `safeHomepageMarketingT`):

| Key | English fallback |
| --- | --- |
| `pages.home.hero.eyebrow` | `NurseNest · Premium clinical prep` |
| `pages.home.hero.headlinePremium` | `Pass the boards with a calm, clinical study companion.` |
| `pages.home.hero.subheadingPremium` | `Adaptive lessons, flashcards, real CAT-style practice questions, and a readiness dashboard that follows nursing clinical reasoning — built for RN, PN, NP, and allied health learners.` |
| `pages.home.hero.trust.cat` | `Real CAT-style adaptive engine` |
| `pages.home.hero.trust.evidence` | `Evidence-based rationales` |
| `pages.home.hero.panel.tag` | `Sample · Readiness preview` |
| `pages.home.hero.panel.live` | `Live` |
| `pages.home.hero.panel.readinessLabel` | `Readiness` |
| `pages.home.hero.panel.readinessValue` | `82%` |
| `pages.home.hero.panel.streakLabel` | `Study streak` |
| `pages.home.hero.panel.streakValue` | `12 days` |
| `pages.home.hero.panel.masteredLabel` | `Mastered` |
| `pages.home.hero.panel.masteredValue` | `248 cards` |
| `pages.home.hero.panel.ecgLabel` | `Cardiac rhythm · NSR` |
| `pages.home.hero.panel.ecgBpm` | `78 bpm` |
| `pages.home.hero.panel.mini1.title` | `Heart failure · clinical reasoning` |
| `pages.home.hero.panel.mini1.sub` | `78% mastered · 6 questions left` |
| `pages.home.hero.panel.mini2.title` | `Pharmacology · safety priorities` |
| `pages.home.hero.panel.mini2.sub` | `54% mastered · 11 questions left` |

**No new keys added to flat UI maps under `tools/i18n`** — fallbacks render
in code; translators may add the keys to per-locale shards in a follow-up
without forcing a deploy. Long-form prose stays out of i18n maps.

> Per `.cursor/rules/i18n-translation-engineering.mdc`: keys are dot-separated,
> English baseline first, no exam/lesson body prose.

### What was *not* touched

- No SEO metadata, OG tags, JSON-LD, canonical, sitemap, robots — those live
  in `app/page.tsx` / `head.tsx` paths and are unchanged.
- No schema, Prisma model, migration, or seed.
- No auth, paywall, entitlement, or admin RBAC.
- No URL structure, redirects, locale routing, or nav wiring.
- No production-imported homepage section other than the hero.
- No new heavy library — only `lucide-react` (already in tree) is added.
- No raw `gs://` URLs, no eager unbounded imports, no Prisma/server-only in
  the client tree (all i18n + region calls already used in `HomeConversionHero`).
- The arch graphic is **not** reintroduced.

---

## 3 · Stability profile

- Component is `"use client"` — same as `HomeConversionHero`, so RSC streaming
  order on `/` is unchanged.
- No `useEffect` / `useState` / `useMemo` / `useRef` — pure render. Avoids the
  TDZ root-cause class documented in `TDZ-ROOT-CAUSE-REPORT.md`.
- Try/catch around `useMarketingI18n` and `useNursenestRegion` mirrors the
  existing `HomeConversionHero` defensive pattern.
- Inline ECG SVG (~360x64) — no external image, no animation, no JS.
- All visual treatment uses already-shipped CSS classes from
  `src/app/premium-redesign-2026.css` (lines 18–280, present in repo since
  Phase 2). **Zero new CSS** added to the bundle.
- Token-driven colors only (`--semantic-chart-*`, `--palette-*`,
  `--border-subtle`, `--surface`, `--page-bg`). No hardcoded hex/rgb in TSX.
  Theme switching across Blossom/Ocean/Forest/Midnight/Apex/Sunset works
  automatically via `[data-theme]`.
- Responsive: `nn-premium-hero-grid` is single-column under 1024px, two-column
  on lg+. Mobile screenshot confirms stacked layout, full-width CTAs visible,
  trust pills wrap cleanly.

---

## 4 · Validation

### Typecheck (project tsconfig)

```
$ cd nursenest-core
$ node_modules/.bin/tsc --noEmit 2>&1 | grep -E "premium-homepage-hero|home-restored-client"
(no output)
```

No TS errors in either modified/new file. The full project tsc run is not
attached because (per AGENTS.md) "treat unrelated pre-existing failures as
separate from the task" — but the two affected files are clean.

### Visual evidence

Captured via Playwright (`UICanvas/capture-hero-mockup.cjs`) against the
real-CSS HTML preview (slice mirrored from `premium-redesign-2026.css`).

| File | Theme | Viewport |
| --- | --- | --- |
| `preview-screenshots/phase4-hero-desktop-ocean.png` | Ocean (light) | 1480×820 @ 2x |
| `preview-screenshots/phase4-hero-mobile-ocean.png` | Ocean (light) | 480×1100 @ 2x |
| `preview-screenshots/phase4-hero-desktop-midnight.png` | Midnight (dark) | 1480×820 @ 2x |
| `preview-screenshots/phase4-hero-desktop-apex.png` | Apex (dark) | 1480×820 @ 2x |
| `preview-screenshots/phase4-hero-canvas-all.png` | full canvas | 1600 fullPage @ 1.5x |

---

## 5 · Rollback

To revert in one diff (no re-deploy required if cached):

```diff
- import { PremiumHomepageHero } from "@/components/marketing/home/premium-homepage-hero";
+ import { HomeConversionHero } from "@/components/marketing/home-conversion-hero";

- <PremiumHomepageHero questionCount={questionCount} lessonCount={lessonCount} />
+ <HomeConversionHero    questionCount={questionCount} lessonCount={lessonCount} />
```

`home-conversion-hero.tsx` is preserved on disk for exactly this case.

---

## 6 · Out of scope (intentional)

- Other homepage sections (`HomeHeroScreenshotSection`,
  `HomeStableMarketingPlaceholder` x3, `HomeTrustStripSection`, audience
  pathway cards, `HomeFinalStudyCta`) — visual identity left as-is for
  Phase 5+ to avoid silent app-wide copy churn.
- Premium hero translations into `fr`, `es`, etc. — new keys ship with
  English fallbacks; translation pass is a follow-up shard PR (no shard
  size or `i18n:validate:production` regression introduced today).
- Server-only / SEO surfaces — `app/page.tsx` server tree is unchanged.

---

*References: `nursenest-core/src/app/premium-redesign-2026.css` lines 18–280;
`nursenest-core/src/components/marketing/home-restored-client.tsx`;
`docs/legacy-restoration-map.md`; `.cursor/rules/nursenest-production-governance.mdc`.*
