# Premium design system — handoff summary

**Full spec:** [`docs/design-system/nursenest-premium-ecosystem-master-spec.md`](../docs/design-system/nursenest-premium-ecosystem-master-spec.md)

**Purpose:** Single canonical blueprint for Figma + Cursor: one DM Sans / token-driven system; themes (**Ocean, Garden, Aurora, Midnight**) map to curated `[data-theme]` keys in `theme-palettes.css`; product semantics stay in `semantic-status-tokens.css`. No rebrand; routes, auth, entitlements, i18n, contracts unchanged.

**Figma:** Frames listed in the master spec require **authenticated Figma MCP** (use plugin skills: load `figma-use` before `use_figma`; code→Figma via `figma-generate-design`). Cursor cannot create frames until Figma is connected.

**Implementation:** Phased rollout (audit → tokens → primitives → surfaces); avoid forked layouts per tier—only accent/tint/chart expression changes.

**Validation:** Typecheck, targeted Playwright, mobile/theme/contrast checks; grep guardrails for hot pink and monochrome data UI.
