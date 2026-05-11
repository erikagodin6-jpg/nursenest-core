# Aesthetic regression report

**Generated:** 2026-05-11T04:26:12.372Z
**Gate:** `major` **(FAILED)**
**Captured shards:** 1
**Catalog expected routes:** 26
**Catalog missing (no shard this run):** 25

## Severity summary

| Severity | Count |
|----------|-------|
| critical | 0 |
| major | 1 |
| moderate | 5 |
| cosmetic | 0 |

## Catalog gaps (expected routes with no shard this run)

- `auth-account`
- `auth-account-settings`
- `auth-cat-hub`
- `auth-cat-launch`
- `auth-dashboard`
- `auth-flashcards-hub`
- `auth-lesson-detail`
- `auth-lessons-hub`
- `auth-practice-hub`
- `learner-allied-premium-preview`
- `learner-cat-results`
- `learner-cat-session`
- `learner-flashcard-session`
- `learner-labs-ventilator-preview`
- `learner-practice-session`
- `learner-report-card`
- `public-allied-hub`
- `public-allied-mlt`
- `public-allied-respiratory`
- `public-blog`
- `public-blog-article`
- `public-marketing-lesson`
- `public-np-hub`
- `public-rn-hub`
- `public-rpn-hub`

## Top issues (ordered by severity)

| Severity | Category | Rule | Route | Theme | Viewport | Message |
|----------|----------|------|-------|-------|----------|---------|
| major | layout-heuristic | low-contrast-gradient | public-home | ocean | desktop | Gradient background may be unreadable (ratio 2.03) |
| moderate | layout-heuristic | card-height-imbalance | public-home | ocean | desktop | Card heights vary 1.95× in div.relative (max 189 / min 97) |
| moderate | layout-heuristic | empty-vertical-gap | public-home | ocean | desktop | Empty vertical gap 450px (50% of viewport) |
| moderate | layout-heuristic | empty-vertical-gap | public-home | ocean | desktop | Empty vertical gap 430px (48% of viewport) |
| moderate | token-violation | hardcoded-color | public-home | ocean | desktop | Hardcoded color #1da2d8, #1583b1, #0f172a on html.dm_sans_d096191e-module__sFdC_a__variable (style) |
| moderate | token-violation | hardcoded-color | public-home | ocean | desktop | Hardcoded color #2D7FD3, #FFFFFF, #236BBC on div.sticky (style) |

## Per-route detail

### `public-home`

| Theme | Viewport | Status | Baseline diff | Figma drift | Max severity | Issues |
|-------|----------|--------|---------------|-------------|--------------|--------|
| ocean | desktop | captured | — | — | major | 6 |

## Screenshots

Captures live under `docs/screenshots/aesthetic-audit-2026/`. Baselines under `baselines/`. Optional Figma exports under `figma/`. With `AESTHETIC_AUDIT_WRITE_DIFF_PNG=1`, baseline overlays are written to `diffs/`.

## Regenerating

```bash
cd nursenest-core
npm run test:e2e:aesthetic-audit
npm run aesthetic-audit:report
```
