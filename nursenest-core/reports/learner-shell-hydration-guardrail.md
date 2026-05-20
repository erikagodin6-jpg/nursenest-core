# Learner shell — import / hydration guardrail (Phase 1)

## Scope

The global learner shell is `src/app/(student)/app/(learner)/layout.tsx`. Heavy **route-specific** client surfaces (full practice runners, question bank shells, admin blog tooling) must not be added as **static** imports in this layout: they belong on route segments, lazy/dynamic boundaries, or shared primitives under `components/` with intentional loading.

## Enforcement

- **Automated:** `npm run test:learner-shell-imports` runs `learner-shell-import-guardrail.contract.test.ts`, which fails if static import specifiers match blocked substrings (see test file for the denylist).
- **Manual:** Prefer `await import("…")` for optional shell features (already used for study-next and tutor shells in the layout).

## Non-goals (this pass)

- No refactor of the existing shell graph or provider stack.
- Does not analyze re-export graphs or barrel files — extend the test if a new bypass appears.

## Related reports

- `reports/client-component-size-guardrail.md` — size debt for major client islands.
