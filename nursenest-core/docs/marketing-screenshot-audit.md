# Marketing Screenshot Audit

**Program:** Marketing Screenshot Replacement  
**Last updated:** 2026-05-29  
**Status:** Phase 1 complete · Site wiring in progress · Capture refresh running

### Site wiring (conversion-first deployment)

| Surface | Status |
|---------|--------|
| Homepage hero carousel | ✓ Local themed WebP slots 1–15 |
| Homepage feature deep-dives | ✓ Study plan, smart review, CAT results screenshots |
| Pricing TierValueExperience | ✓ Generated pathway hub WebPs |
| Pricing interactive showcase | ✓ Real product shots (ECG, labs proxy, med math, skills, analytics) |
| Pricing ECG / Med Math / Clinical Skills blocks | ✓ Product proof bands added |
| RN / RPN / NP nursing tier hubs | ✓ `MarketingPathwayHubProductPreview` |
| Allied Health hub | ✓ Tier-specific product preview |
| New Grad marketing landing | ✓ Hub screenshot band |
| ECG interpretation SEO page | ✓ ECG workstation product preview |
| About / FAQ / Institutions | ✓ Registry CDN chain (local WebP preferred) |

This document inventories every marketing screenshot surface, flags legacy assets, and tracks replacement priority. Generated assets live under `public/marketing/generated-screenshots/`; homepage carousel slots sync to `public/marketing/homepage-screenshots/` via `scripts/sync-homepage-screenshot-variants.mjs`.

---

## Executive summary

| Metric | Count |
|--------|------:|
| CDN hero slots (1–15) | 15 |
| Local homepage WebP slots synced | 15 |
| Core generated captures (Ocean) | 14 keys |
| Marketing hub captures | 10 keys |
| Theme variant directories | ocean, blossom, midnight (+ aurora, sage-garden partial) |
| Legacy runtime fallbacks removed | ✓ (now generated WebP only) |
| Pathway authenticated captures pending | rn, pn, np, allied, newgrad tiers |

**Theme distribution target:** 40% Ocean · 35% Blossom · 25% Midnight  
**Current capture bias:** Ocean-primary desktop 1440×900; partial midnight/blossom variants for key core shots.

---

## Phase 1 — Full inventory

### CDN slots (homepage / FAQ / about / institutions)

Resolved via `getMarketingHeroImageUrlChain()` — local WebP preferred, CDN PNG fallback.

| Current Screenshot | Location | Date Created | Still Accurate? | Replacement Needed? | Priority |
|--------------------|----------|--------------|-----------------|---------------------|----------|
| `screenshot1` — Practice rationale | Homepage carousel (primary), pricing preview, feature sections | 2026-05-29 (local WebP) | ✓ Yes — live practice + rationale panel | No (refresh on UI change) | P0 |
| `screenshot2` — Flashcards custom study | Homepage carousel (primary), institutional montage | 2026-05-29 | ✓ Yes — active flashcard session | No | P0 |
| `screenshot3` — Learner dashboard | Homepage platform preview, FAQ/about | 2026-05-29 | ✓ Yes — dashboard with progress | No | P1 |
| `screenshot4` — Practice exam hub | Institutional why-features, homepage preview | 2026-05-29 | ✓ Yes — practice hub UI | No | P1 |
| `screenshot5` — Progress report | Results groups, institutional montage | 2026-05-29 | ✓ Yes — topic accuracy bars | No | P1 |
| `screenshot6` — CAT exam session | Homepage carousel (primary), CAT landing, pricing | 2026-05-29 | ✓ Yes — adaptive CAT in progress | No | P0 |
| `screenshot7` — CAT results | Homepage carousel (primary), results sections | 2026-05-29 | ✓ Yes — readiness output | No | P0 |
| `screenshot8` — Study plan | Study plan sections, institutional workflow | 2026-05-29 | ✓ Yes — adaptive day cards | No | P2 |
| `screenshot9` — Smart review | Smart review sections, ecosystem narrative | 2026-05-29 | ✓ Yes — confidence grouping | No | P2 |
| `screenshot10` — Question bank | Homepage preview, practice groups | 2026-05-29 | ✓ Yes — category launchers | No | P1 |
| `screenshot11` — Confidence analytics | Analytics sections, educator blocks | 2026-05-29 | ✓ Yes — account analytics | No | P1 |
| `screenshot12` — Lesson detail | Lessons groups, institutional montage | 2026-05-29 | ✓ Yes — structured lesson | No | P1 |
| `screenshot13` — Lesson library | Homepage preview, institutional blocks | 2026-05-29 | ✓ Yes — filterable library | No | P2 |
| `screenshot14` — Marketing homepage | FAQ/about, institutional showcase | 2026-05-29 | ✓ Yes — signed-out hero | No | P1 |
| `screenshot15` — ECG workstation | Homepage carousel (primary), clinical readiness | 2026-05-29 | ✓ Yes — telemetry workspace | No | P0 |

**Recommended theme per slot (Phase 3+ captures):**

| Slot | Feature | Preferred theme |
|------|---------|-----------------|
| 1 | Practice rationale | Ocean |
| 2 | Flashcards | Blossom |
| 3 | Dashboard | Ocean |
| 4 | Practice hub | Ocean |
| 5 | Progress report | Midnight |
| 6 | CAT session | Midnight |
| 7 | CAT results | Midnight |
| 8 | Study plan | Blossom |
| 9 | Smart review | Blossom |
| 10 | Question bank | Ocean |
| 11 | Analytics | Midnight |
| 12 | Lesson detail | Blossom |
| 13 | Lesson library | Blossom |
| 14 | Marketing home | Ocean |
| 15 | ECG | Ocean |

---

### Generated WebP — pricing (`TierValueExperience`)

| Current Screenshot | Location | Date Created | Still Accurate? | Replacement Needed? | Priority |
|--------------------|----------|--------------|-----------------|---------------------|----------|
| `core/learner-dashboard.webp` | Pricing — all tiers (learn default) | 2026-05-29 | ✓ | No | P1 |
| `core/flashcards.webp` | Pricing — practice default | 2026-05-29 | ✓ | No | P1 |
| `core/practice-rationale.webp` | Pricing — RN practice override | 2026-05-29 | ✓ | No | P0 |
| `core/cat-exam-session.webp` | Pricing — assess default / RN fallback | 2026-05-29 | ✓ | No | P0 |
| `core/cat-results.webp` | Pricing — new grad assess fallback | 2026-05-29 | ✓ | No | P1 |
| `core/smart-review.webp` | Pricing — remediate all tiers | 2026-05-29 | ✓ | No | P1 |
| `core/confidence-analytics.webp` | Pricing — master all tiers | 2026-05-29 | ✓ | No | P1 |
| `marketing/rn-marketing-hub.webp` | Pricing RN learn | 2026-05-29 | ✓ | No | P0 |
| `marketing/rn-questions-marketing.webp` | Pricing RN practice | 2026-05-29 | ✓ | No | P0 |
| `marketing/rn-lessons-marketing.webp` | RN lessons marketing route | 2026-05-29 | ✓ | No | P1 |
| `marketing/pn-marketing-hub.webp` | Pricing PN learn + practice | 2026-05-29 | ✓ | No | P0 |
| `marketing/np-marketing-hub.webp` | Pricing NP all stages | 2026-05-29 | ✓ | No | P0 |
| `marketing/allied-marketing-hub.webp` | Pricing Allied | 2026-05-29 | ✓ | No | P0 |
| `marketing/new-grad-marketing-hub.webp` | Pricing New Grad | 2026-05-29 | ✓ | No | P0 |
| `marketing/pricing.webp` | Pricing page hero | 2026-05-29 | ✓ | No | P1 |
| `marketing/faq.webp` | FAQ promotional | 2026-05-29 | ✓ | No | P2 |
| `rn/rn-cat-exam.webp` | Pricing RN assess (target) | — | ✗ Missing | **Yes** — pathway-specific CAT | P0 |
| `pn/pn-cat.webp` | Pricing PN assess (target) | — | ✗ Missing | **Yes** | P0 |
| `rn/rn-hub.webp`, `rn/rn-flashcards.webp` | Pathway-specific learner UI | — | ✗ Missing | **Yes** | P1 |
| `np/np-loft-simulation.webp`, `np/np-cnple.webp` | NP simulation / CNPLE | — | ✗ Missing | **Yes** | P1 |

---

### Legacy assets — flagged for removal (Phase 2)

| Asset | Former use | Status |
|-------|------------|--------|
| `/dashboard-redesign-preview/*.png` | Pricing `ProofImage` onError fallback | **Removed from runtime** — registry now uses generated WebP |
| `/landing-polish-preview/png/*.png` | Flashcards/CAT legacy fallback | **Removed from runtime** |
| CDN `screenshot{N}.png` (unreplaced) | OG + CDN fallback when local WebP absent | **Stale until CDN upload** — local WebP overrides in app |
| Stock / SVG-only pathway hubs | RN/RPN/NP/Allied/ECG/Med Math marketing pages | **No product screenshots yet** — icon-only heroes |

---

## Phase 3 — Viewport matrix (backlog)

| Viewport | Status |
|----------|--------|
| Desktop 1440×900 | ✓ Primary capture size |
| Desktop 1366×768 | Backlog |
| Desktop 1728×1117 | Backlog |
| Desktop 1920×1080 | Backlog |
| iPad portrait / landscape | Partial (`*-tablet.webp` for home + pricing) |
| Mobile 390×844, 393×852, 430×932 | Backlog (`mobile/` tier empty) |

**Command:** `npm run generate:marketing-screenshots -- --tier=mobile` + viewport flags (extend script).

---

## Phase 4 — Feature capture backlog

| Feature | Route / hook | Status | Priority |
|---------|--------------|--------|----------|
| Flashcards + rationale | `openFlashcardCustomStudy` | ✓ Captured | — |
| Practice + rationale | `startPracticeExamWithRationale` | ✓ Captured | — |
| SATA / Bowtie / Matrix / Case study | NGN preview routes | Backlog — reference: `docs/screenshots/ngn-formats-blossom/` | P0 |
| Simulation Center | `/app/simulations` | Backlog | P0 |
| Readiness Dashboard | `/app/readiness` or dashboard | Partial (analytics) | P0 |
| Clearance Center | clearance routes | Backlog | P1 |
| Labs interpretation | `/app/labs` | Backlog | P1 |
| Clinical Skills | `/app/clinical-skills` | Backlog | P1 |
| Pharmacology | pharmacology hub | Backlog | P1 |
| Med Math | med calc routes | Backlog | P1 |
| Allied pathways (RT, MLT, etc.) | profession hubs | Backlog | P1 |
| Report cards | analytics/report routes | Partial | P2 |

---

## Phase 5–7 — Page wiring status

| Page / surface | Screenshot source | Status |
|----------------|-------------------|--------|
| Homepage hero carousel | Local WebP slots 1,2,6,7,15 (primary indices) | ✓ Updated for module variety |
| Homepage platform preview | `SCREENSHOT_GROUPS.homepageHero` | ✓ Uses registry IDs |
| Pricing tier panels | `tier-value-experience.ts` + generated registry | ✓ Hub shots live; pathway learner UI pending |
| RN / RPN / NP marketing hubs | Marketing hub WebPs | ✓ Captured (signed-out hubs) |
| ECG / Med Math / Clinical Skills pages | Mostly SVG/icons | **Needs product screenshots** |
| Institutions | CDN slots via registry groups | ✓ Wired; depends on slot freshness |
| About / FAQ | Slots 14, 10, 12, 3 | ✓ Wired |

---

## Phase 8 — Figma marketing library

**Status:** Not yet created in Figma.  
**Recommended structure:** NurseNest Marketing Screenshot Library — frames organized by Feature × Tier × Theme × Viewport × Date.  
**Reference captures:** `docs/screenshots/flashcards-ux-audit-phase2/`, `docs/screenshots/ngn-formats-blossom/`, `public/marketing/generated-screenshots/themes/`.

---

## Phase 9 — Automated refresh

| Command | Purpose |
|---------|---------|
| `npm run marketing:screenshots:refresh` | Capture → sync homepage slots → validate |
| `npm run marketing:screenshots:sync` | Sync only (after manual capture) |
| `npm run validate:marketing-screenshots` | Local file + manifest gates |
| `npm run ci:screenshot-governance` | CI registry + fallback checks |

**Suggested CI hook:** Run `marketing:screenshots:refresh` on release branches or weekly cron against production QA personas when UI changes land.

---

## Priority queue (next actions)

1. **P0** — Capture pathway tiers: `npm run generate:marketing-screenshots:rn` (+ pn, np) with QA credentials  
2. **P0** — NGN format captures (SATA, bowtie, matrix, case study) in Blossom theme  
3. **P0** — Simulation + readiness + clearance screenshots (Ocean/Midnight)  
4. **P1** — Mobile + remaining desktop viewports  
5. **P1** — Upload refreshed PNG/WebP to DigitalOcean Spaces (`docs/SCREENSHOT_CAPTURE_TO_CDN.md`)  
6. **P2** — Figma library frames + social/ad crop exports  

---

## Verification

```bash
cd nursenest-core
npm run marketing:screenshots:sync
npm run validate:marketing-screenshots
npm run ci:screenshot-governance
```

**Homepage carousel primary slots (0-based):** `[0, 1, 5, 6, 14]` → rationale, flashcards, CAT session, CAT results, ECG.

---

## Related docs

- `docs/marketing-screenshot-asset-audit.md` — earlier asset pass  
- `docs/SCREENSHOT_CAPTURE_TO_CDN.md` — CDN upload workflow  
- `src/lib/marketing/screenshot-registry.ts` — CDN slot metadata  
- `src/lib/marketing/generated-screenshot-registry.ts` — pricing/local generated paths  
- `scripts/generate-marketing-screenshots.ts` — Playwright capture engine
