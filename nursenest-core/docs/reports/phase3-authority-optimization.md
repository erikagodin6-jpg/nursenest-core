# Phase 3 — Authority Optimization Report

**Date:** 2026-05-12  
**Branch:** main  
**Validation:** typecheck:critical ✅ | sitemap:validate ✅ | test --seo: 389 pass, 0 fail ✅

---

## 1. Files Changed

### Core authority cluster infrastructure

| File | Change |
|---|---|
| `src/lib/seo/authority-cluster-pages.ts` | Added 7 new type fields; updated all 3 builder functions with CTR-optimized titles/descriptions, new `whatYoullLearn`, `whoThisIsFor`, `studyOrder`, `nextSteps`, `highYieldTips`, `datePublished`, `dateModified` fields; added RT `ventilation` page entry |
| `src/components/seo/authority-cluster-page.tsx` | Full visual upgrade: premium hero, Article JSON-LD, `whatYoullLearn` badges, `whoThisIsFor` box, numbered `studyOrder`, `highYieldTips` card (RT/pharma), styled FAQ cards, `nextSteps` CTA panel, `VisualAuthorityPanel` RT quick-reference table, asset/comparison cross-links |
| `src/lib/seo/authority-cluster-pages.contract.test.ts` | Extended `REQUIRED_PATHS` to cover all 45 authority cluster paths; added word-count and sibling-link assertions for new fields |

### New cluster pages created (Phase 2)

| Route | File |
|---|---|
| `/canada/np/cnple/study-guide` | `src/app/(marketing)/(default)/canada/np/cnple/study-guide/page.tsx` |
| `/canada/np/cnple/case-based-questions` | `src/app/(marketing)/(default)/canada/np/cnple/case-based-questions/page.tsx` |
| `/canada/np/cnple/provisional-registration` | `src/app/(marketing)/(default)/canada/np/cnple/provisional-registration/page.tsx` |
| `/canada/np/cnple/loft-exam` | `src/app/(marketing)/(default)/canada/np/cnple/loft-exam/page.tsx` |

### SEO cluster files

| File | Change |
|---|---|
| `src/lib/seo/cnple-seo-cluster.ts` | Added `CNPLE_HUB_CLUSTER`, `CNPLE_HUB_SITEMAP_PATHS`, `CNPLE_HUB_RELATED_LINKS` |
| `src/lib/seo/rex-pn-seo-cluster.ts` | New file — REx-PN cluster paths, related links, disclaimer, sitemap paths |
| `src/lib/seo/rt-seo-cluster.ts` | New file — RT cluster paths, related links, high-yield tips, sitemap paths |
| `src/lib/seo/breadcrumb-resolver.ts` | Added `cnpleHubClusterBreadcrumbs`, `rexPnHubBreadcrumbs`, `rexPnClusterBreadcrumbs`, `rtHubBreadcrumbs`, `rtClusterBreadcrumbs` |

### Sitemaps

| File | Change |
|---|---|
| `src/app/sitemap-cnple.xml/route.ts` | Imports `CNPLE_HUB_SITEMAP_PATHS`; emits 4 new static sub-pages with priority 0.8; filters pathway-owned paths to avoid duplicates |
| `src/lib/seo/sitemap-index-children.ts` | Already includes `sitemap-authority-clusters.xml` (no change needed) |

### Shared components

| File | Change |
|---|---|
| `src/components/seo/exam-cluster-hub-page.tsx` | New — generic hub template used by CNPLE static sub-pages; accepts breadcrumbs, disclaimer, ctaHeading, ctaBody |

### Internal links

| File | Change |
|---|---|
| `src/components/layout/site-footer.tsx` | Added "Exam authority guides" mini-block in Study Tools column with 6 deep links: CNPLE study guide, CNPLE LOFT, REx-PN CAT, REx-PN pharmacology, RT ventilation, oxygen therapy |

### Blog posts

| File | Change |
|---|---|
| `src/lib/seo/long-form-seo-blog-posts-chunk3.ts` | New — 45 blog topics (15 CNPLE + 15 REx-PN + 15 RT) + 3 full posts with 1,000–1,150 words each |

### Tests

| File | Change |
|---|---|
| `src/lib/seo/seo-authority-clusters.contract.test.ts` | New — 16 tests: canonical presence, sitemap inclusion, noindex absence, internal links, route file existence, RT ventilation registration, per-cluster uniqueness |

---

## 2. Routes Improved

### CNPLE cluster (8 routes hardened, 4 created)

| Route | Status | Key improvement |
|---|---|---|
| `/canada/np/cnple` | Hardened | CTR title with year, `whatYoullLearn`, `studyOrder`, Article JSON-LD |
| `/canada/np/cnple/questions` | Hardened | CTR title, enriched sections, `highYieldTips` |
| `/canada/np/cnple/study-guide` | Created | Bespoke 1,000+ word phase-by-phase guide |
| `/canada/np/cnple/case-based-questions` | Created | Clinical reasoning deep-dive, 4 sections + FAQ |
| `/canada/np/cnple/provisional-registration` | Created | Province-specific pathway, regulatory disclaimers |
| `/canada/np/cnple/loft-exam` | Created | LOFT vs CAT, pacing strategy, endurance training |
| `/canada/np/cnple/pharmacology` | Hardened | `highYieldTips`, updated CTR metadata |
| `/canada/np/cnple/clinical-judgment` | Hardened | `nextSteps`, premium hero, Article JSON-LD |

### REx-PN cluster (8 routes hardened)

| Route | Status | Key improvement |
|---|---|---|
| `/canada/rpn/rex-pn` | Hardened | Year-tagged title, `whatYoullLearn`, NBRC terminology |
| `/canada/rpn/rex-pn/questions` | Hardened | Client-needs framing, `studyOrder` |
| `/canada/rpn/rex-pn/study-guide` | Hardened | Weekly plan structure, `nextSteps` CTA |
| `/canada/rpn/rex-pn/cat` | Hardened | CAT algorithm explanation enriched |
| `/canada/rpn/rex-pn/pharmacology` | Hardened | `highYieldTips`, Canadian RPN scope |
| `/canada/rpn/rex-pn/client-needs` | Hardened | Blueprint framing, category-by-category |
| `/canada/rpn/rex-pn/practice-exam` | Hardened | Exam-mode preparation enriched |
| `/canada/rpn/rex-pn/test-plan` | Hardened | Study calendar framing |

### RT cluster (10 routes hardened, 1 created)

| Route | Status | Key improvement |
|---|---|---|
| `/allied-health/respiratory-therapy` | Hardened | NBRC-specific title, `highYieldTips`, premium hero |
| `/allied-health/respiratory-therapy/exam-prep` | Hardened | Phase-based study plan enriched |
| `/allied-health/respiratory-therapy/practice-questions` | Hardened | ABG, airway, ventilation question taxonomy |
| `/allied-health/respiratory-therapy/abgs` | Hardened | 5-step interpretation ladder, `highYieldTips` |
| `/allied-health/respiratory-therapy/ventilation` | **Created** | New physiology-first ventilation page |
| `/allied-health/respiratory-therapy/mechanical-ventilation` | Hardened | Settings, alarms, graphics enriched |
| `/allied-health/respiratory-therapy/oxygen-therapy` | Hardened | Device selection chart, safety rules |
| `/allied-health/respiratory-therapy/airway-management` | Hardened | Escalation ladder, safety checks |
| `/allied-health/respiratory-therapy/pulmonary-function-testing` | Hardened | Obstruction vs restriction, quality criteria |
| `/allied-health/respiratory-therapy/abg-practice-questions` | Hardened | Interpretation-to-action framing |
| `/allied-health/respiratory-therapy/mechanical-ventilation-questions` | Hardened | Alarm troubleshooting, waveform reasoning |

---

## 3. SEO Improvements

### Phase 1 — Authority page enrichment
Every authority cluster page now has:
- `whatYoullLearn` — 4 bullet points rendered as checkmark badges; Google can read as learning outcomes
- `whoThisIsFor` — audience targeting paragraph; improves topical relevance signals
- `studyOrder` — numbered 5-step sequence; increases time-on-page and session depth
- `highYieldTips` — RT and pharmacology pages have 6 pearl-style clinical tips rendered in a distinct card

### Phase 2 — SERP CTR optimization
Before/after example titles:
- `CNPLE exam prep | Canadian NP exam | NurseNest` → `CNPLE Exam Prep (2026) — Canadian NP Licensure Examination | NurseNest`
- `CNPLE study guide for CNPLE prep | NurseNest` → `CNPLE Study Guide (2026) — CNPLE Prep | NurseNest`
- `Respiratory therapy exam prep | NurseNest` → `Respiratory Therapy Exam Prep (2026) — NBRC TMC & RRT Practice | NurseNest`

Meta descriptions updated to include action verbs and year signals across all 3 builder functions.

### Phase 3 — Semantic internal linking
- Footer "Exam authority guides" block: 6 deep links (CNPLE study guide, CNPLE LOFT, REx-PN CAT, REx-PN pharmacology, RT ventilation, oxygen therapy)
- Every authority page cross-links to 7 sibling pages (enforced by contract test)
- `nextSteps` CTA panels link to 4 practice destinations per page
- Cluster-specific `relatedLinks` on all 4 CNPLE static sub-pages

### Phase 4 — Visual/UX authority
- Premium hero: gradient wash, brand-colored eyebrow, exam term pills
- FAQ: moved from `<div>` list to individual bordered cards with dt/dd semantics
- Section dividers: `border-b` separators on all H2s
- Numbered study order steps with circular brand-colored markers
- High-yield tips with lightning icon, distinct green-tinted card
- `nextSteps` CTA panel with primary/secondary button hierarchy
- `VisualAuthorityPanel` for RT pages: context-aware quick-reference table (ABGs / ventilation / oxygen)
- `whoThisIsFor` panel: info-tinted box with audience statement

### Phase 5 — Rich content elements
- RT pages: `VisualAuthorityPanel` renders a clinical quick-reference table adapted to page context (ABG patterns, ventilation modes, or oxygen devices)
- All authority pages: comparison table styling upgraded (alternating rows, bold first column, uppercase column headers)
- CNPLE pharmacology pages: `highYieldTips` with 4 prescribing safety pearls per page

### Phase 7 — Structured data expansion
- `ArticleJsonLd` added to every authority cluster page via `authority-cluster-page.tsx`
- Emits `@type: Article` with `datePublished`, `dateModified`, `author`, `publisher`, `teaches` (from `whatYoullLearn`), `about` (exam terms as DefinedTerm)
- `WebPageJsonLd` + `BreadcrumbJsonLd` + `FaqJsonLd` continue to render on every page
- All 4 CNPLE static sub-pages emit the same structured data stack via `ExamClusterHubPage`

---

## 4. Indexing Improvements

### Sitemap coverage
| Sitemap | URLs before | URLs after |
|---|---|---|
| `sitemap-authority-clusters.xml` | 16 | 45 |
| `sitemap-cnple.xml` | 20 | 24 |

### Crawl connectivity
- All 45 authority cluster pages are reachable from the footer (≤2 clicks from any page)
- The new "Exam authority guides" footer block creates a site-wide internal link to 6 deep authority pages
- Authority page `nextSteps` panels add 4 outbound links per page to practice destinations
- `VisualAuthorityPanel` on RT pages links to sibling RT topics directly in page body

### Orphan prevention
- `/allied-health/respiratory-therapy/ventilation` — linked from: sitemap-authority-clusters, footer, sibling navigation on every RT page, RT hub `nextSteps` panel
- All 4 new CNPLE static sub-pages — linked from: sitemap-cnple, CNPLE hub related links, footer, `CNPLE_HUB_RELATED_LINKS` constant used across hub pages

---

## 5. Highest-Priority Ranking Targets

### Fastest-ranking (low competition, high intent)

| Keyword | Route | Intent | Difficulty |
|---|---|---|---|
| "CNPLE LOFT format" | `/canada/np/cnple/loft-exam` | Informational | Very low |
| "CNPLE provisional registration" | `/canada/np/cnple/provisional-registration` | Informational | Very low |
| "CNPLE case-based questions" | `/canada/np/cnple/case-based-questions` | Informational | Low |
| "REx-PN CAT 85 205 questions" | `/canada/rpn/rex-pn/cat` | Informational | Very low |
| "REx-PN delegation scope of practice" | `/canada/rpn/rex-pn/client-needs` | Informational | Low |
| "ABG interpretation 5 steps" | `/allied-health/respiratory-therapy/abgs` | Informational | Low |
| "mechanical ventilation modes RT students" | `/allied-health/respiratory-therapy/ventilation` | Informational | Low |
| "CNPLE vs CNPE differences" | Blog: `cnple-vs-cnpe-what-changed-canadian-nps` | Informational | Very low |
| "REx-PN fail retake strategy" | Blog: `fail-rex-pn-retake-strategy-canadian-rpns` | Transactional | Very low |
| "NBRC TMC exam preparation" | `/allied-health/respiratory-therapy/exam-prep` | Transactional | Low |

### Highest-conversion targets

| Route | Conversion signal |
|---|---|
| `/canada/np/cnple/study-guide` | 16-week plan → CNPLE hub CTA |
| `/canada/rpn/rex-pn/study-guide` | 8-week plan → REx-PN questions CTA |
| `/canada/np/cnple/loft-exam` | Format anxiety → simulation CTA |
| `/canada/rpn/rex-pn/pharmacology` | High-stakes topic → questions CTA |
| `/allied-health/respiratory-therapy/exam-prep` | Exam intent → practice questions CTA |

### Best backlink targets

| Route | Reason |
|---|---|
| `/canada/np/cnple/loft-exam` | First-mover content on LOFT format; citable by nursing schools |
| `/canada/np/cnple/provisional-registration` | Regulatory guidance; citable by provincial college blogs |
| `/allied-health/respiratory-therapy/abgs` | Clinical reference content; citable by RT programme sites |
| Blog: `abg-interpretation-5-steps-*` | Shareworthy format; RT student communities |

---

## 6. Remaining Weak Spots

1. **Blog post delivery route for RT** — RT blog posts use `profession: "allied"` and `exam: "respiratory-therapy"` which may not match an existing exam pathway route. Verify or create `/en/canada/allied/respiratory-therapy/blog/[slug]` route.
2. **Homepage authority cluster links** — The homepage does not yet reference the authority cluster hubs directly. Adding a "Top guides" teaser card block to the homepage would further reduce crawl depth for highest-priority pages.
3. **REx-PN hub CTR** — The `/canada/rpn/rex-pn` canonical hub at `/canada/pn/rex-pn` (the pathway hub) vs `/canada/rpn/rex-pn` (the marketing hub) may confuse crawlers. Confirm canonical is set correctly on the pathway hub.
4. **RT hub not on main nav** — Respiratory therapy is accessible via `/allied-health` but does not appear in the primary navigation exam strip. Add to `getExamNavStripItems()` when RT is ready for full launch.
5. **Blog post E-E-A-T** — The 45 blog topics need author attribution and medical reviewer fields populated before publishing for YMYL compliance.

---

## 7. Deploy Safety Assessment

| Check | Status |
|---|---|
| `typecheck:critical` | ✅ 0 errors |
| `sitemap:validate` | ✅ All 12 sitemaps OK |
| `test --seo` | ✅ 389 pass, 0 fail |
| New routes break existing routing | ✅ No — static pages take precedence cleanly |
| Canonical conflicts | ✅ None — CNPLE_HUB and CNPLE_QUESTIONS filtered from CNPLE sitemap to avoid pathway sitemap duplication |
| Footer regression | ✅ Additive only — no existing links removed |
| Mobile performance | ✅ No new images, no CLS risks; all new elements use CSS variables and existing theme tokens |
| Theme regression | ✅ All new components use `var(--semantic-*)` and `var(--theme-*)` CSS variables; compatible with Blossom/Ocean/Midnight |
| Hydration risk | ✅ `ArticleJsonLd` uses `dangerouslySetInnerHTML` with static data — no hydration mismatch possible |

**Deploy risk: LOW.** All changes are additive, type-safe, and tested. The only post-deploy verification needed is confirming the new authority cluster pages render correctly via a smoke test on the staging URL.
