# NurseNest blog — premium Figma-first mockup spec

**Purpose:** Blueprint for **premium, ecosystem-integrated** blog surfaces — aligned with the shared NurseNest design system (`theme-palettes.css`, `semantic-status-tokens.css`, DM Sans in `globals.css`).  
**Not:** A separate content-marketing site, Medium/Substack clone, or SEO-farm grid aesthetic.

**Figma execution:** Actual frames/screenshots require **Figma MCP authenticated** in Cursor; load **`figma-use`** before any `use_figma` write. Use **`figma-generate-design`** when translating existing routes/components into Figma. This document defines **what** to build.

---

## 1. Brand & product guardrails

| Preserve | Avoid |
|----------|--------|
| Real NurseNest **leaf logo** + **wordmark** | Invented marks |
| **DM Sans** (via `--font-sans` / design tokens) | Serif editorial display, playful fonts |
| **`[data-theme]`** behavior — Aurora / Ocean / Garden / Midnight as **curated theme keys** (see master ecosystem spec) | One-off hex blocks disconnected from tokens |
| Existing **blog routing**, **locale SEO surfaces**, **canonical post architecture** | New URL taxonomy without SEO review |

**Tone:** Premium, calming, clinically intelligent, optimistic, educational — **not** enterprise journal, Pinterest lifestyle, generic CMS, or neon “growth blog.”

---

## 2. Design system alignment (single system)

Blog uses the **same** primitives as lesson hubs, exams, and dashboards:

- **Spacing / radius / shadows:** Shared scale — no blog-specific radius fork.
- **Navigation:** Same marketing header/nav bands as core product (tier hubs, locale/theme controls unchanged — see production governance: no clipped labels).
- **Surfaces:** `--semantic-surface`, `--semantic-surface-elevated`, `--semantic-border-soft`, `--semantic-shadow-soft`; panels via `--semantic-panel-cool|warm|positive|muted`.
- **Status & data:** Multi-hue semantics (`--semantic-chart-1`…`5`, success/info/warning) for metrics/trends — **not** brand-only bars everywhere (`.cursor/rules/semantic-color-guardrails.mdc`).
- **Themes:** Only accent/tint/glow/gradient **expression** changes per `[data-theme]`; layout grids stay identical across Aurora/Ocean/Garden/Midnight.

**Readability:** All themes must pass **body text** contrast on article surfaces; Midnight prioritizes **deep navy + teal/cyan glow** with explicit `--theme-body-text` / heading tokens — validate no “black on dark gray.”

---

## 3. Audience & content lanes (visual differentiation via taxonomy, not layout forks)

Support **RN, PN/RPN, NP, Allied, New Grad**, localized SEO, and content types:

| Lane | Visual treatment |
|------|------------------|
| Clinical deep dives (pathophys, pharm) | Long-form column, generous line-height, semantic **info/cool** panels for mechanisms |
| Exam prep / NCLEX strategy | Strong hierarchy, **chart semantic hues** for readiness/skills strips |
| Career / New Grad | Warm panel accents (**Garden**-friendly), progression metaphors — **same article shell** |
| Allied | Occupation-aware **accent chip** + icon slot — **same grid** as RN |

Avoid infinite homogeneous cards: alternate **featured hero**, **horizontal clinical guides**, **compact latest list**, **topic strips**.

---

## 4. Required mockups → Figma frames

Produce **desktop + mobile** for each (label frames with theme name + `[data-theme]` key used).

### 4.1 Blog homepage

**Feel:** “Adaptive nursing knowledge hub,” not a marketing blog landing.

**Sections (top → bottom):**

1. **Premium featured hero** — one flagship clinical/education piece with atmospheric gradient (token-driven `hero-gradient-*` where defined), not stock photo clichés.
2. **Category / topic chips** — pill filters using semantic borders + muted fills.
3. **Featured clinical guides** — 2–3 larger cards, illustration/icon slots optional — **no empty image placeholders** (use abstract clinical motif or category glyph).
4. **Latest nursing articles** — dense-but-readable list or compact cards.
5. **Trending NCLEX / exam topics** — semantic multi-hue mini-rows or chips.
6. **Pharmacology / pathophysiology** — dedicated band with distinct **chart/info** accent (still DM Sans).
7. **Continue reading** — personalized/recency strip with clear typography hierarchy.

**Mobile:** Single column; chips horizontally scroll; hero stacks; touch-friendly tap targets.

### 4.2 Article detail

**Feel:** Immersive, study-grade reading.

**Components:**

- Article typography: constrained measure, comfortable line-height, premium **not** oversized display serif.
- **Sticky TOC** (desktop sidebar / drawer); **collapsible TOC** on mobile.
- **Study callouts:** bordered semantic panels (pearls, warnings, exam relevance).
- **Clinical pearls / key takeaways** — icon + semantic panel-positive/info.
- **APA-style references** — subdued monospace or small caption style **within** DM Sans scale (caption tier).
- **Author / reviewer card** — avatar optional; credibility without journal cliché.
- **Estimated study time** — compact badge (`nn-badge-semantic-*` pattern).
- **Related lessons** — pathway-aware cards linking into lesson hubs (integration zone).
- **Related flashcards / questions** — compact horizontal scroll or stacked CTAs (same iconography language as app).

### 4.3 Category / topic hubs

**Examples:** Pharmacology, Cardiology, Pediatrics, NCLEX strategy, New Grad survival, Allied Health, NP prep.

**Must include:**

- **Category hero** — title + short positioning + optional readiness/context strip (semantic hues).
- **Search/filter** — prominent but calm; no noisy SEO chrome.
- **Article grid** — filterable; vary card density (featured + grid) to avoid “farm” repetition.
- **Recommended study pathways** — cards linking to lessons/practice (ecosystem bridge).

### 4.4 Mobile blog experience

- Reading progress (thin **semantic-brand** or success gradient bar, top or bottom — pick one system-wide pattern).
- Sticky header behavior that **does not** hide locale/theme controls.
- Integrated **study actions** (Practice questions, Flashcards, Continue studying) in a **single** bottom or floating cluster — theme-aware.

### 4.5 Lesson + blog integration (concept frames)

Dedicated **annotation frames** or overlays showing:

- Related lesson deep link
- Practice question entry (exam relevance)
- Flashcard deck tie-in
- Continue studying → dashboard/next step
- Weak-area reinforcement (semantic warning/info framing — supportive copy)

These are **zones** in article sidebar/footer/mobile sheet — same components as learner surfaces where possible.

---

## 5. Theme presets for mockups (four variants each frame)

| Direction | Suggested `[data-theme]` keys to visualize *(curate in implementation)* |
|-----------|--------------------------------------------------------------------------|
| **Ocean** | `ocean`, `clinical-light` — default reading |
| **Garden** | `soft-sage`, `forest`, `meadow` |
| **Aurora** | `pastel-lilac`, `lavender`, `mint-breeze`, `arctic-frost` |
| **Midnight** | `dark-clinical`, `midnight-ink`, `deep-twilight` |

Export PNG/PDF with frame name suffix `-ocean`, `-garden`, `-aurora`, `-midnight`.

---

## 6. Routing reality (preserve — implementation)**

Canonical marketing blog paths include (non-exhaustive):

| Surface | Route pattern (examples) |
|---------|--------------------------|
| Blog index | `(marketing)/(default)/blog/page.tsx` |
| Post | `(marketing)/(default)/blog/[slug]/page.tsx` |
| Category | `(marketing)/(default)/blog/category/[category]/page.tsx` |
| Tag | `(marketing)/(default)/blog/tag/[tag]/page.tsx` |
| RN segment | `(marketing)/(default)/blog/rn/...` |
| Allied blog | `(marketing)/(default)/allied-health/[slug]/blog/...` |
| Locale exam blog | `(marketing)/[locale]/[slug]/[examCode]/[exam]/blog/...` |
| Nursing career | `(marketing)/(default)/nursing/[careerSlug]/blog/...` |

Mockups must **not** imply new URL schemes unless product/SEO signs off.

---

## 7. Cursor implementation guidance (post-mockup)

1. Map frames to **theme-aware components** — reuse marketing shells, `Blog*` layouts where they exist; extend with tokens only.
2. **No hardcoded colors** in TSX/CSS for article/marketing UI — semantic + theme variables only.
3. Preserve **BlogPost** canonical fields, **i18n** loaders, **metadata/sitemap** behavior — no silent SEO regressions.
4. Single nav/header story — do not fork blog-specific header chrome.
5. Validation: typecheck, targeted blog/marketing Playwright or smoke routes, theme switch regression, mobile snapshot checks.

---

## 8. Deliverables checklist

| # | Deliverable |
|---|-------------|
| 1 | Blog homepage mockups (desktop + mobile) |
| 2 | Article detail mockups (desktop + mobile) |
| 3 | Topic/category hub mockups |
| 4 | Mobile-specific reading/progress/TOC variants |
| 5 | Four theme variants (Ocean, Garden, Aurora, Midnight) for key frames |
| 6 | Nav/header alignment vs homepage (single system) |
| 7 | Lesson/practice/flashcard integration concept zones |
| 8 | Export-ready assets (PNG/PDF from Figma) |
| 9 | Token/style notes referencing `semantic-status-tokens.css` + `theme-palettes.css` |

---

## 9. Related documents

- [`nursenest-premium-ecosystem-master-spec.md`](./nursenest-premium-ecosystem-master-spec.md) — global tokens and theme philosophy  
- `.cursor/rules/semantic-color-guardrails.mdc`  
- `.cursor/rules/nursenest-production-governance.mdc`  

---

*Final bar: The blog should read as **“premium adaptive nursing knowledge inside the same ecosystem as lessons and exams,”** not a detached CMS.*
