# Pre-Nursing Figma-style redesign summary

**Branch:** `audit/prenursing-theme-figma`  
**Status:** Phase 1–2 deliverables on branch. **Phase 3 (code) deferred** until preview sign-off.

## Previews

PNG mockups: `preview-screenshots/prenursing/`  
Specs: `reports/ui-redesign-preview/prenursing/README.md`

## Design principles

- Premium **science learning** SaaS: layered cards, semantic multi-hue data, readable hierarchy.
- **Token-only** implementation: `var(--theme-*)`, `var(--semantic-*)`, existing `nn-*` patterns — support Blossom, Ocean, Garden, Midnight.
- Tone: academically focused, approachable, **not** hospital telemetry.

## Phase 3 (after review)

Update `pre-nursing/*` pages and module TSX for contrast, spacing, mobile; preserve SEO, i18n, PostHog, entitlements, URLs. Run `pathway-prenursing-allied-access.spec.ts` with full env.
