# NurseNest Core Guardrails

- No service workers.
- No custom bundle caching.
- No compile-time content generation.
- No file over 500 lines.
- No route-level cross-import contamination:
  - Marketing does not import learner/admin modules.
  - Admin does not load into public routes.
- Server-side entitlement checks only.
- API pagination and bounded queries for memory safety.
- Degraded-safe DB health behavior at `/api/health`.
- **Storage boundary:** see `ARCHITECTURE_STORAGE.md` (app vs DB vs Spaces; no production content growth on container disk).
- **Policy & workflows:** `docs/STORAGE_POLICY.md`, `docs/CONTENT_WORKFLOWS.md`, `docs/STORAGE_OPERATIONS.md`.
- **Automated guardrail:** `npm run storage:check` (warn); `npm run storage:check:strict` fails on oversized non‑i18n `public/` files.
