# Public lesson hub — Blossom-aligned redesign (2026-05-08)

## Branch

`hotfix/production-nav-homepage-copy` (worktree: `/root/nursenest-core-hotfix`)

## Visual direction (approved)

Binding spec when Figma screenshots are not in context:

- White / off-white structure; soft Blossom pastel accents (pink, lavender, periwinkle, mint, teal, yellow) via **semantic tokens** only — multi-hue `--semantic-chart-*`, `--semantic-panel-*`, `color-mix`, no muddy flat grey grids.
- Clean premium medical SaaS: rounded cards, **soft shadows** (`--semantic-shadow-soft`, chart-tinted lifts), strong type hierarchy (`nn-marketing-h1` / `nn-marketing-h3`), compact readable spacing.
- No hot pink nav backgrounds, no neon/childish styling.

## Figma

MCP authenticated earlier in initiative; no dedicated frame URL checked in this session. Detailed layout contract: `nursenest-core/reports/public-lesson-hub-figma/design-spec.md`.

## Scope (this worker)

Public lesson hubs only — category-first index, filtered lesson grid, category drill-down. **Not** lesson detail, ECG, global nav, homepage source, pricing page, entitlements logic.

Routes covered by shared components:

- `/us/rn/nclex-rn/lessons`, `/us/pn/nclex-pn/lessons`, `/canada/pn/rex-pn/lessons`
- NP / Allied pathways using the same `(marketing)/.../lessons` route and/or category surfaces

## Behavior preserved

- SEO metadata, routing, pagination sizes, `MarketingHubSmokeDiagnosticsJson` for smoke.
- Entitlements: anonymous signup CTA + upgrade strip; subscriber hero uses resume/next lesson via `loadPathwayHubSubscriberData`.
- No full-catalog dump beyond existing paginated/filtered paths.

## Clutter removed / reduced

- Removed duplicate **StudyBottomNav** where **LessonHubSurfaceChips** already surfaces the same shortcuts (main hub + category drill-down).
- Category-first index: **clinical area grid moved above** sticky study shortcuts; anonymous upgrade strip once; review-required staging visible only for entitled users.
- Curriculum hub empty state: pipeline JSON diagnostics copy only when `NN_MARKETING_HUB_PIPELINE_DIAGNOSTICS=1`.

## Files touched (hub worker)

- `src/components/pathway-lessons/lessons-page-shell.tsx`
- `src/components/pathway-lessons/marketing-lessons-hub-category-first-index.tsx`
- `src/components/pathway-lessons/marketing-lessons-hub-category-lessons-surface.tsx`
- `src/components/pathway-lessons/marketing-public-lessons-hub-anonymous-upgrade-strip.tsx`
- `src/components/pathway-lessons/pathway-lessons-curriculum-hub.tsx`
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx`
- `src/lib/marketing/public-hub-browse-accent.ts`
- `src/lib/marketing/public-lessons-hub-anonymous.contract.test.tsx`
- `reports/public-lesson-hub-figma/design-spec.md` (updated via prior/spec adjacent docs)

## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck:critical` | **Pass** |
| `node --import tsx --test src/lib/marketing/public-lessons-hub-anonymous.contract.test.tsx` | **Pass** |
| Playwright / dev screenshots (RN/PN/NP/Allied desktop+mobile) | **Not run** — environment-dependent; capture when dev server + browser available |

## Confirmations

- Not pushed, not merged, no stash dropped.
- Did not modify unrelated homepage/i18n/globals churn present elsewhere in worktree (left unstaged).

