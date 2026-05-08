# Phase 5B — Homepage QA polish (after live body)

## Scope

Marketing homepage premium components, `premium-redesign-2026.css`, `marketing-hero-pattern.ts`, and English marketing shard only. No routing, auth, entitlements, SEO, or emergency-wrapper changes.

## Files changed

| Area | Path |
|------|------|
| Hero + ECG | `src/components/marketing/home/premium-homepage-hero.tsx` |
| Pathway cards (icon badge) | `src/components/marketing/home/premium-pathway-showcase.tsx` |
| Copy fallbacks (sentence case) | `src/components/marketing/home/premium-clinical-depth.tsx`, `premium-study-ecosystem.tsx`, `premium-readiness-preview.tsx` |
| CTA overflow | `src/lib/theme/marketing-hero-pattern.ts` |
| Tokens / dark / rhythm | `src/app/premium-redesign-2026.css` |
| i18n EN baseline | `tools/i18n/marketing/marketing-en.json` (repo root) |
| Compiled shards | Regenerated via `npm run i18n:compile` → `public/i18n/` |

## Screenshot-driven fixes (inferred; no preview screenshots in workspace)

- **Dark readability**: Dark-theme selectors align hero secondary CTAs, rhythm-strip container, trust pills, panel chrome, and stat tiles with `--palette-heading`, `--surface` / `--theme-card-bg`, `--border-subtle`, and `--bg-inset`.
- **Button overflow**: Primary/secondary marketing CTA classes use `overflow-visible`, slightly tighter horizontal padding on mobile, and `max-w` capped with `min(…, calc(100vw - 2rem))`.
- **Whitespace**: Hero vertical padding scaled (~0.9–0.92× rhythm vars); `.nn-home-marketing-root .nn-premium-home-section` uses tighter `padding-block` with a matching mobile clamp.
- **Placeholder-like UI**: Pathway card icon uses pathway id abbreviations (`RN`, `PN`, `IRN`, …) instead of the first word of the localized title.
- **Copy polish**: English fallbacks aligned to sentence case where appropriate; hero panel tag fallback matches shard (“Sample readiness snapshot”); primary CTA fallback aligned to shard (“Start Practice”).

## ECG (illustrative only)

- **Intent**: Decorative **normal sinus rhythm–style** silhouette (Lead II–like): rounded P, narrow QRS, upright T — **not diagnostic**, not rate-calibrated.
- **Implementation**: `singleNsrBeatPath()` builds one RR interval; repeated for three beats. Same file documents educational-only use.

## i18n status

- **Issue**: Missing keys caused dev warnings when `t()` echoed keys for premium sections.
- **Fix**: Added homepage premium keys to `tools/i18n/marketing/marketing-en.json`.
- **Pipeline**: Ran `npm run i18n:compile` successfully.

## Regression checks

- **CTAs**: No changes to `href` targets in hero or routes helper.
- **`HomeRestoredClient`**: Component order unchanged.

## Validation commands & results

| Command | Result |
|---------|--------|
| `npm run i18n:compile` | Exit **0** |
| `npm run typecheck:critical` | Exit **0** |
| `npm run test:homepage` | Exit **0** (13 tests, 12 pass, 1 skip) |
| Playwright homepage specs | **Failed**: `ERR_CONNECTION_REFUSED` to `http://localhost:3000/` (no dev server) |

## Blockers / follow-up

1. **Playwright**: Requires Next dev server on port 3000 (or configured base URL).
2. **Reference screenshots**: `preview-screenshots/` not present in workspace for visual diff.

