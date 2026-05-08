# Public lesson hub — design spec (Figma workflow fallback)

Figma MCP is authenticated; no in-repo Figma file URL. This spec is the implementation contract.

## Layout

1. Hero: title, subtitle, single primary CTA (signup anonymous / resume or start entitled).
2. LessonsToolbar unchanged.
3. Sticky strip: LessonHubSurfaceChips with backdrop blur.
4. Library section: existing grid; anonymous hides review-required block, live sync banner, bottom nav duplicate.
5. One anonymous upgrade strip (signup + view plans).
6. StudyModeCards once at bottom.

## Tokens

Use `--semantic-*`, `--theme-*`, `--palette-*`, `color-mix` only per semantic guardrails.

## Pipeline diagnostics copy

Technical verify empty-state copy only when `NN_MARKETING_HUB_PIPELINE_DIAGNOSTICS=1`.
