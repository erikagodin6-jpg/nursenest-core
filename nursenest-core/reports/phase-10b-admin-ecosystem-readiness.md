# Phase 10B — Admin-controlled ecosystem readiness

## Summary

Phase 10B adds **staff-only** visibility for Phase 10 contract work: extensibility kinds, marketplace metadata shapes, integration event domains, governance samples, and moderation pipeline labels. There is **no** public marketplace, **no** partner HTTP API, and **no** webhook delivery runtime.

## Admin surface

| Item | Detail |
|------|--------|
| Route | `/admin/platform-ecosystem` |
| Guard | `await requireAdmin()` (`@/lib/auth/guards`) plus `getStaffSession()` for parity with other admin hubs |
| RBAC | Path prefix `/admin/platform-ecosystem` is on the **support** staff allowlist (`src/lib/auth/admin-path-policy.ts`); super and content tiers follow existing rules |

## Static registry

- Module: `src/lib/admin/admin-ecosystem-readiness-registry.ts`
- All rows are **sample / planning** data until dedicated DB models exist.
- UI stresses: extension context and hints are **non-authoritative**; `getUserAccess` / server guards remain mandatory on every protected path.

## Verification commands

```bash
npm run test:unit:phase10-platform
npm run audit:phase10-public-surface
npm run test:learner-shell-imports
npm run typecheck:critical
```

- **`test:unit:phase10-platform`**: Phase 10 enum contracts plus admin gate / public-import guard tests.
- **`audit:phase10-public-surface`**: Fails if any file under `src/app/` outside `(admin)` and outside `api/admin` references Phase 10 barrels or the admin ecosystem registry.

## Constraints honored

- No new public API routes.
- No runtime webhook dispatcher.
- No e-commerce or real marketplace checkout.
- No changes to learner CAT, practice, flashcards, lessons, or adaptive flows.
- No SEO/marketing page edits beyond an **admin dashboard** link to the new hub.

## OOM note

If `npm run typecheck` or `npm run build` exits **137** (OOM) in your environment, treat that as an infra limit — use `typecheck:critical` and targeted unit tests above for CI signal instead of claiming full `tsc` / `next build` passed.
