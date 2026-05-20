# Pre-nursing visual previews (Phase 2)

## How to view

From app root (`nursenest-core/nursenest-core/`):

```bash
npx --yes serve . -p 3456
```

Then open, for example:

- http://localhost:3456/preview-screenshots/prenursing/index.html

Using `file://` can work; some browsers block cross-file CSS — prefer `serve` if styles fail to load.

Regenerate HTML + `reports/ui-redesign-preview/prenursing/` mirror:

```bash
python3 scripts/gen-prenursing-preview-html.py
```

## Files

| File | Description |
|------|-------------|
| `index.html` | Navigator to all Phase 2 HTML previews |
| `hub.html` | Hub grid (Blossom) — maps to `/pre-nursing` |
| `teas-prep.html` | TEAS-style **framing** (Sage Garden) — no `/pre-nursing/teas` route in repo |
| `hesi-prep.html` | HESI-style **framing** (Ocean) — no `/pre-nursing/hesi` route in repo |
| `anatomy.html` | Module emphasis: `anatomy-physiology` |
| `chemistry.html` | Module emphasis: `chemistry` |
| `math.html` | Quantitative proxy → `science-foundations` (no `math` slug) |
| `biology.html` | Cluster: `cell-biology` + `microbiology` |
| `quiz-practice.html` | Practice runner sample (Midnight) |
| `flashcards.html` | Recall / deck strip (Ocean) |
| `mobile-hub.html` | Narrow viewport hub |
| `preview-wire.css` | Bridge so `[data-theme]` + semantic tokens resolve without full `globals.css` |
| `mock-hub-desktop.html` | Earlier mock: hub + theme cycler (`color-roles.css` included) |
| `mock-teas-hesi-tracks.html` | Earlier dual-column TEAS/HESI mock |
| `mock-module-anatomy-chemistry.html` | Earlier anatomy + chemistry layout mock |
| `mock-quiz-flash-mobile.html` | Earlier mobile quiz + flash strip |
| `practice-bank-coverage.html` | Static MCQ bank coverage table |

## CSS sources

**New canonical previews** (`hub.html`, `teas-prep.html`, …) link:

1. `../../src/app/theme-palettes.css`
2. `../../src/app/semantic-status-tokens.css`
3. `./preview-wire.css`

**Legacy `mock-*.html` files** also link `../../src/app/color-roles.css` (kept for older mocks).

## Themes

Featured in previews: **ocean**, **blossom**, **sage-garden**, **midnight** — names match `src/app/theme-palettes.css` selectors.

## `reports/` mirror

HTML + `preview-wire.css` are copied to `reports/ui-redesign-preview/prenursing/` for audit bundles.

Markdown deliverables:

- `reports/prenursing-modules-lessons-quizzes-audit.md` (mirrors `docs/prenursing-modules-lessons-quizzes-audit.md` when synced)
- `reports/prenursing-figma-redesign-summary.md` (mirrors `docs/prenursing-figma-redesign-summary.md` when synced)
