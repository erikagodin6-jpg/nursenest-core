# Theme token consistency audit

**Scope:** `nursenest-core/src` (TS, TSX, CSS). Workspace: `/root/nursenest-core`.  
**Method:** Read canonical token layers + ripgrep + spot-read of high-hit files.  
**Reference:** `.cursor/rules/semantic-color-guardrails.mdc`.

---

## 1. Executive summary

The stack is **layered, not single-sourced**: `[data-theme]` blocks in `theme-palettes.css`; semantics in `semantic-status-tokens.css` (`:root` first-paint + `:where([data-theme])`); roles in `color-roles.css`; **parallel** learner tokens `--lv-*` in `styles/tokens.css`; very large `globals.css` with repeated `html[data-theme="dark-*"]` lists; runtime `ThemeStateHydration` + `theme-palette-tokens.ts` / `nav-chrome.ts` inject computed hex on `documentElement`.

**Good:** One `ThemeProvider` (`AppThemeProvider`); `attribute="data-theme"`; `globals.css` documents avoiding `:root` `--theme-*` overrides that broke theme switching.

**Risk:** Many **hex literals in TSX** (charts, inline styles, `var(--token, #fallback)`). Coexisting **`--semantic-*`**, **`--palette-*`**, **`--lv-*`**, **`--theme-*`**, **`--nn-*`**, **`--role-*`** increase drift vs guardrails.

### Hardcoded color hit counts (approx.)

| Metric | Approx. |
|--------|--------|
| Lines with `#hex` under `nursenest-core/src` (all extensions) | **~5,972** |
| Lines with `#hex` in `*.tsx` only | **~568** |
| Lines with `rgb(`, `rgba(`, `hsl(` in `*.tsx` only | **~110** |

Interpretation: **~5.9k** is dominated by **token definition** files (`theme-palettes.css`, `theme-palette-tokens.ts`, etc.). For **component-level** literals, use **~568 + ~110 ≈ 650+** as the actionable ballpark.

---

## 2. Token drift findings

- **Parallel planes:** `--semantic-*` / `--nn-*` vs `--lv-*` (“strict hex source of truth” in `tokens.css`) vs `--palette-*` on `:root` in `globals.css` vs per-theme `--theme-*`.
- **Specificity discipline:** Documented in `globals.css` / `semantic-status-tokens.css` — keep monitoring so `:root` does not override `[data-theme]`.
- **`--semantic-mastery-*`** duplicates success/warning/danger hues by design — naming can confuse authors.

---

## 3. Hardcoded offenders (grouped samples)

### High `#` count in TSX (rg `-c`, descending sample)

| File | ~Matches | Notes |
|------|----------|--------|
| `pre-nursing/anatomy-diagrams.tsx` | 109 | SVG/diagram — exception candidate |
| `ui-preview/homepage-premium-preview.tsx` | 105 | Preview / demo |
| `ui-preview/_preview-shared.tsx` | 63 | Preview shared |
| `study/flashcard-review-section.tsx` | 24 | Learner flashcards |
| `study/readiness-hero-card.tsx` | 17 | Dashboard |
| `study/readiness-strength-grid.tsx` | 16 | Dashboard |
| `study/readiness-focus-plan.tsx` | 16 | Dashboard |
| `study/concept-risk-section.tsx` | 16 | Analytics |
| `study/flashcard-deck-card.tsx` | 15 | Flashcards |
| `app/global-error.tsx` | 10 | Isolated error UI |

### Patterns

1. **`var(--semantic-*, #fallback)`** — e.g. `readiness-hero-card.tsx` `bandAccent()`.
2. **Inline `style={{}}`** with `color-mix` + CSS vars — e.g. `pricing-sections.tsx` (token-forward but inline-heavy).
3. **Canonical hex** in `theme-palettes.css`, `theme-palette-tokens.ts`, `semantic-status-tokens.css`, `globals.css` — **expected**, not ad-hoc UI drift.

### Scans

- **Tailwind `bg-[#...]` / `text-[#...]`** in `*.tsx`: **no matches** (pattern: `(bg|text|border|from|to|via|ring|fill|stroke)-\[#`).
- **`style={{` with color keys:** **40+** TSX files (pricing, pathway lesson orchestrator, lesson notes, flashcard viewer, analytics/readiness, etc.).

---

## 4. Duplicate theme logic

- **Single React root:** `app-theme-provider.tsx` — do not nest second provider (comment).
- **Duplicate data:** CSS `[data-theme]` blocks + TS token tables + `nav-chrome` — mitigated by **contract tests** (`theme-palettes-order`, `theme-registry-palette-coverage`, `premium-palettes.contract`, etc.).
- **`styles/tokens.css`:** second dark-theme selector list for `--lv-*` vs `globals.css` / palettes — keep lists in sync via tests or codegen.

### Gradients

`linear-gradient(` ~counts: `globals.css` ~98, `premium-redesign-2026.css` ~59, `semantic-status-tokens.css` ~16, plus scattered TSX — **dedupe opportunity** via named `--gradient-*` tokens.

---

## 5. Semantic inconsistencies / naming

- **`--role-success` vs `--semantic-success`** — fallback pattern in pricing / study-card paths.
- **`--palette-primary` vs `--theme-primary`** — both used in marketing; risk of mixing “hydrated seed” vs theme identity.
- **`--lv-*` vs `--semantic-*`** — two documented philosophies for learner color.

---

## 6. Contrast + dark mode

### Contrast (heuristic; **manual WCAG required**)

- Muted text on `color-mix` tinted surfaces (readiness/study cards).
- Low-chroma themes (e.g. slate) + brand-tinted surfaces.
- SVG/chart literals not tied to `--semantic-text-*`.

### Dark mode

- **Primary:** `html[data-theme="dark-*"]` + `data-theme` from `next-themes`.
- **`styles/tokens.css`:** mirrors dark ids for `--lv-*`.
- **Tailwind `dark:`:** **~50+** TSX files — often admin/marketing; learner uses mixed — **paradigm split** vs `[data-theme]`.

### Hover

Not exhaustively audited; rely on `nn-elevation-panel` / shared button motion tokens for many cards — spot-check low-contrast hover on dense dashboard rows.

---

## 7. Typography / spacing (sampled)

- Study trees mix `text-xs`–`text-lg` without a single documented ramp per surface (`learner-command-center-client.tsx` is dense).
- **Shadows:** `--shadow-*` (globals) vs `--lv-shadow-*` (tokens.css) — two systems.

---

## 8. Recommended cleanup plan (phased)

1. **Phase 0:** CI grep / lint for new `#RRGGBB` in app/components TSX (allowlist previews, anatomy SVGs, `global-error`); document “which token when.”
2. **Phase 1:** Bridge `--lv-*` → `--semantic-*` where safe; extend tests so dark theme id lists match across `tokens.css` / `globals.css` / registry.
3. **Phase 2:** Migrate readiness → flashcards → lesson pathway → pricing: reduce inline styles; move repeated gradients to CSS variables.
4. **Phase 3:** Learner routes: prefer `[data-theme]` + semantic classes over `dark:`; document admin-only `dark:` exception.
5. **Phase 4:** Per-theme contrast + screenshot QA (dashboard, lesson, flashcards, pricing, homepage) preserving **multi-hue** semantics per governance.

---

## 9. Consulted paths

`nursenest-core/src/app/semantic-status-tokens.css`, `nursenest-core/src/app/theme-palettes.css`, `nursenest-core/src/app/globals.css` (excerpts), `.cursor/rules/semantic-color-guardrails.mdc`, `nursenest-core/src/components/theme/app-theme-provider.tsx`, `nursenest-core/src/components/theme/theme-state-hydration.tsx` (partial), `nursenest-core/src/components/marketing/pricing-sections.tsx`, `nursenest-core/src/components/study/readiness-hero-card.tsx`, `nursenest-core/styles/tokens.css`.

---

**Deliverable:** This file. **No code changes** (audit only).

**Parent return:** `reports/theme-token-consistency-audit.md` + approx. **5,972** total `#hex` lines under `nursenest-core/src`, **~568** in TSX, **~110** TSX rgb/hsl lines.
