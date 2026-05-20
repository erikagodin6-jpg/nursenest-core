# NurseNest premium ecosystem — master design system spec

**Status:** Canonical guidance for Figma + Cursor implementation  
**Intent:** Evolution of NurseNest into a **premium adaptive clinical learning platform** — **not** a rebrand.  
**Scope:** RN, PN/RPN, NP, Allied Health, New Grad, CAT, practice exams, flashcards, lesson hubs, dashboards/report cards, study plans, analytics/progress, clinical tools — **one shared system**, theme-aware accents only.

---

## 1. Non-negotiables (brand + product)

| Preserve | Do not |
|----------|--------|
| Real NurseNest **leaf logo** + **wordmark** | Invent logos or wordmarks |
| **DM Sans** (`globals.css` → `--font-sans` / `--font-dm-sans`) | Serif editorial headings, playful fonts, compressed body |
| Existing **routes**, **exam hierarchy**, **entitlements/paywall**, **SEO**, **i18n**, **DB/API contracts** | New nav topology, route forks per tier for “different branding” |
| **PathwayLesson** architecture and server-enforced access | Client-only entitlement or paywall logic |

**Visual target:** Premium, calming, intelligent, clinically trustworthy, emotionally supportive — **not** generic LMS, SaaS analytics wall, gamer RGB, hospital enterprise gray, or Pinterest pastel.

---

## 2. Single canonical design system (code)

Everything derives from **two coordinated layers**:

1. **Identity / theme expression:** `[data-theme="…"]` in `src/app/theme-palettes.css` — controls accent, glow-adjacent primary/secondary, borders, rings, and extended surfaces where defined.
2. **Semantic product semantics:** `src/app/semantic-status-tokens.css` — success/info/warning/danger, charts (`--semantic-chart-1`…`5`), panels, progress fills, practice-runner aliases (`--nn-*`). **Data/status UI must not collapse to brand-only hues.**

**Rules**

- Layout shells, spacing scale, radius, elevation patterns, and component anatomy are **shared across all tiers** (RN/PN/NP/Allied/New Grad). **Themes change expression (accent, tint, gradient lighting, chart emphasis), not grid structure.**
- Prefer existing helpers/classes tied to tokens (e.g. `nn-progress-fill-semantic-*`, semantic badges) per `.cursor/rules/semantic-color-guardrails.mdc`.
- **No hardcoded hex/rgb** in new TSX/CSS for product UI; use `color-mix(in srgb, var(--semantic-*) …)` when needed.

---

## 3. Theme direction → implementation mapping

Your named directions align with **curating** existing palette keys (names are **UX labels**; implementation keeps `[data-theme]` as source of truth):

| Experience direction | Role | Implementation note |
|---------------------|------|----------------------|
| **Ocean** | Default study — calm, trustworthy | Map to **`ocean`** (and semantic defaults already mirror ocean/clinical-blue in comments). Strongest “everyday study” baseline. |
| **Garden** | Warm, encouraging, sage/mint/gold | Prefer **`soft-sage`**, **`forest`**, **`meadow`**, **`mint`** — pick **one** default “Garden” alias for marketing copy; avoid muddy desaturation. |
| **Aurora** | Soft lilac + blue + mint glow; restrained | Prefer **`pastel-lilac`**, **`lavender`**, **`lavender-dream`**, **`arctic-frost`**, **`mint-breeze`** — **not** `blush`/`strawberry`/rainbow multi-pastel as the default Aurora bundle. |
| **Midnight** | Deep navy workstation; immersive CAT/high focus | Prefer **`midnight-ink`**, **`deep-twilight`**, **`midnight-indigo`**, or **`dark-clinical`** for dark readability; ensure `--theme-heading-text` / `--theme-body-text` / cards meet contrast (no black-on-dark body). |

**CAT vs practice (expression, not layout forks):**

- **CAT:** Dark/high-focus **Midnight** family + minimal chrome; same shell components, fewer decorative bands; semantic danger/warning for stakes, not neon.
- **Practice:** Brighter **Ocean** / **Garden** + rationale panels using `--nn-review-panel-bg`, semantic success/info for feedback — **same question shell**, different default theme preset where product allows.

---

## 4. Typography

- **Single family:** DM Sans everywhere — already wired via CSS variables in `globals.css`.
- Scale: Define **one** type ramp (e.g. display / h1 / h2 / body / caption / label) in tokens or shared utility classes; **do not** vary font family by pathway tier.
- Avoid oversized display serif, ultra-thin weights for body, or dense legal-sized paragraphs on learner surfaces.

---

## 5. Surface-by-surface guidance (same components)

### Lesson hubs (all pathways)

- **Category-first** index; paginated category drill-down; **no** full-catalog card walls on first paint.
- Cards: compact, information-rich, semantic multi-hue progress/status — **no empty image wells**; use icon/category sigils if no artwork.
- Progress chrome **only** when entitled + session resolves (server-driven); anonymous hubs stay fast (index-first patterns already in codebase direction).

### Allied Health

- **Occupation differentiation** via metadata-driven accents/icons — **token tint shifts**, not a second hub layout.
- Preserve **`alliedProfessionKey`** filtering and SEO differentiation.

### New Grad

- Preserve **unit/floor** structure; emphasize **progression** and career framing with typography hierarchy + semantic panels — same dashboard shell as RN.

### CAT & practice exams

- Shared **exam runner shell**; CAT defaults to dark theme preset; practice defaults to brighter preset.
- NGN types (MCQ, SATA, Bowtie, Trend, case study, ECG, labs, dosage): **one** question frame — variants are **content blocks** inside the shell, not separate page templates.

### Flashcards

- Compact practice shell; rationale/confidence/mastery use **semantic** fills and chart hues — avoid generic “flip card” toy styling.

### Dashboard / report card

- Clinically intelligent, actionable — **multi-hue** charts and readiness bands; avoid metric grids without narrative hierarchy.

### Navigation

- **One** marketing/learner nav system; preserve locale/country/theme controls and logo placement (see production governance: no clipping/wrap). Responsive behavior shared across tiers.

---

## 6. Figma deliverables (frames)

**Cursor cannot push pixels to Figma without your Figma MCP session authenticated.** Use the Figma plugin skills (`figma-use` before `use_figma`, `figma-generate-design` for code→Figma, `figma-implement-design` for Figma→code).

### Minimum frame set (desktop + mobile each)

| Frame | Must show |
|-------|-----------|
| RN lesson hub — category index | Category tiles, search, semantic chips |
| PN/RPN hub | Same shell; region/exam copy differs only |
| NP hub | Same shell |
| Allied hub | Occupation accent strip + category-first |
| New Grad hub | Unit/floor pathway emphasis |
| CAT — in session | Midnight preset, question shell, minimal distractions |
| Practice exam — review/rationale | Brighter preset, rationale panel |
| Flashcards — session | Compact shell, mastery/confidence |
| Dashboard / report card | Readiness, streak, weak/strong, next steps |
| Shared nav | Header + drawer states |

Export: PNG **and** PDF optional; attach **theme name** and **`[data-theme]` key** in frame labels.

---

## 7. Engineering rollout (recommended phases)

**Phase 0 — Audit (read-only)**  
Inventory shells: learner layout, marketing lesson layout, exam runners, flashcards, dashboards; list duplicate spacing/radius patterns.

**Phase 1 — Tokens**  
Tighten semantic + premium aliases; add missing radius/shadow steps **once**; document theme alias table (Ocean/Garden/Aurora/Midnight → `[data-theme]`).

**Phase 2 — Shared primitives**  
Cards, section headers, hub toolbars, progress bands — **one** implementation each.

**Phase 3 — Surface rollout**  
Lesson hubs → exams → flashcards → dashboards; **small PRs** per surface with screenshots.

---

## 8. Validation checklist

Run per milestone:

- `npm run typecheck` or `npm run typecheck:critical` (as agreed by team)
- Targeted Playwright packs for touched routes (hubs, exams, dashboard)
- Manual: mobile breakpoints, theme switcher, dark readability (**no** illegible muted-on-muted)
- Grep guard: no `#ff69b4`-style hot pink; no raw gray-only chart rows on learner dashboards

---

## 9. Known limitations / honesty

- **Full visual parity** across every tier in one sprint is unrealistic; this spec defines **rules** and **order of operations**.
- **Figma frames** require designer + authenticated MCP or manual export; this document is the **single source of rules** until frames exist.
- Tier names and SKUs must match internal product source of truth — confirm against your production **product/tier** doc if paths or copy reference SKUs.

---

## 10. Related repo files

- `src/app/globals.css` — DM Sans, base layout tokens  
- `src/app/theme-palettes.css` — `[data-theme]` identity  
- `src/app/semantic-status-tokens.css` — semantic + chart + `--nn-*`  
- `.cursor/rules/semantic-color-guardrails.mdc`  
- `.cursor/rules/nursenest-production-governance.mdc`  

---

*This document is the master reference for “premium NurseNest ecosystem” evolution: **one system**, **theme-aware accents**, **no rebrand**, **no entitlement regressions**.*
