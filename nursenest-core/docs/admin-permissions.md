# Admin permissions map

Server-side source of truth: `src/lib/auth/admin-path-policy.ts`, `src/lib/admin/ensure-admin.ts`, `src/lib/auth/staff-session.ts`.

## Roles (database `User.role`)

| Role | Staff tier | Typical use |
|------|------------|-------------|
| `SUPER_ADMIN` | `super` | Full admin: dangerous tools, PII-adjacent debug, exports, ops runners |
| `ADMIN` (legacy) | `super` | Same as super |
| `CONTENT_ADMIN` | `content` | Lessons, blog, SEO, media, AI generation — **not** raw user PII lists or subscription analytics |
| `SUPPORT_ADMIN` | `support` | Explicit **allowlist** of support/ops/analytics routes — **not** publishing or super-only tools |
| `LEARNER` | — | Never staff; cannot call `/api/admin/*` successfully |

There is **no separate finance role** in the schema today; billing-heavy surfaces are gated by **super-only** paths or **content-forbidden** (subscription analytics) rules. Add a dedicated role in Prisma + policy if finance must be split from `SUPER_ADMIN`.

## Enforcement layers

1. **Edge/session** — `src/proxy.ts` sets `x-nn-admin-path` for `/admin` and `/api/admin` so RBAC matches the request.
2. **Staff session** — `getStaffSession()` reloads `User.role` from the database (JWT is not sufficient alone).
3. **`requireAdmin(req)`** — every `/api/admin/*` route should call this with **`req`** so the path is taken from `req.url` (falls back to headers if omitted).
4. **Path RBAC** — `isPathAllowedForStaffTier(tier, path)`:
   - **Super**: all paths except none (full access).
   - **Support**: allowlist (`SUPPORT_ALLOWED_PREFIXES`); everything else denied.
   - **Content**: default allow under `/admin` + `/api/admin`, except **content-forbidden** (user lookup, subscription analytics) and **super-only** prefixes.
5. **Super-only prefixes** — e.g. fraud tools, demo user admin, i18n diagnostics, **`/api/admin/ops`**, **`/api/admin/export`**, `/api/debug/*` auth diagnostics.
6. **Dangerous POST** — `/api/admin/ops/run` additionally requires `tier === "super"` in the handler (defense in depth).

## Client-side UI

- Nav visibility uses `isNavHrefAllowedForStaffTier` (same rules). **Never** rely on hiding links alone — all APIs enforce `requireAdmin`.

## Audit logging

- Scope `admin_audit`, event `api_gate` — see `src/lib/admin/admin-audit-log.ts`.
- Fields: `result` (`allowed` | `denied_no_session` | `denied_rbac`), `method`, truncated `path`, `actorPrefix` (8 chars), `tier`, `role`, `correlation` (request/edge id when present).
- Successful **mutations** (POST/PUT/PATCH/DELETE) are logged by default. Set `NN_ADMIN_AUDIT_GET=1` to also log successful GETs (noisy).

## API route inventory (by prefix)

| Prefix | Notes |
|--------|--------|
| `/api/admin/analytics/*` | Mixed; subscription routes forbidden for `content` |
| `/api/admin/ai/*` | Generation — not in support allowlist → support **denied** |
| `/api/admin/blog/*` | Content tier |
| `/api/admin/export/*` | **Super only** |
| `/api/admin/flashcards/*`, `/api/admin/lessons/*`, `/api/admin/questions/*` | Content-tier heavy |
| `/api/admin/ops/*` | **Super only** (+ handler check on `ops/run`) |
| `/api/admin/users/*` | Support + super; **content forbidden** |
| `/api/debug/*` (auth tools) | **Super only** |

A full list of route files lives under `src/app/api/admin/**/route.ts` (100+ handlers); all must import `requireAdmin` from `@/lib/admin/ensure-admin`.

## Learner vs admin data

- Admin-only payloads must not be returned from public or learner API routes. Staff entitlement bypass is server-side only (`getUserAccess` / staff roles).
