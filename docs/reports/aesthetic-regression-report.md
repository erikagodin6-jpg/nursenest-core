# Aesthetic regression report

**Generated:** 2026-05-11T02:21:07.658Z
**Gate:** `off` (passing)
**Captured shards:** 1

## Severity summary

| Severity | Count |
|----------|-------|
| critical | 1 |
| major | 0 |
| moderate | 1 |
| cosmetic | 0 |

## Top issues (ordered by severity)

| Severity | Category | Rule | Route | Theme | Viewport | Message |
|----------|----------|------|-------|-------|----------|---------|
| critical | layout-heuristic | horizontal-overflow | public-home | ocean | desktop | Synthetic critical for gate test |
| moderate | token-violation | hardcoded-color | public-home | ocean | desktop | Synthetic moderate |

## Per-route detail

### `public-home`

| Theme | Viewport | Status | Baseline diff | Figma drift | Max severity | Issues |
|-------|----------|--------|---------------|-------------|--------------|--------|
| ocean | desktop | captured | — | — | critical | 2 |

## Screenshots

Captures live under `docs/screenshots/aesthetic-audit-2026/`. Baselines, when present, live under `docs/screenshots/aesthetic-audit-2026/baselines/`. Figma frames (optional) under `docs/screenshots/aesthetic-audit-2026/figma/`.

## Regenerating

```bash
cd nursenest-core
npm run test:e2e:aesthetic-audit
npm run aesthetic-audit:report
```
