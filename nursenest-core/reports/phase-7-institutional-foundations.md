# Phase 7 — Institutional & cohort-learning foundations

**Scope:** architecture-first contracts, RBAC abstractions, instructor/analytics stubs, and audit documentation.  
**Explicitly out of scope:** full LMS, billing rewrite, Prisma migrations (this pass), public cohort APIs, org-level Stripe.

**Truthpack:** `.vibecheck/truthpack/` was not present in this workspace clone; assumptions below are grounded in code (`docs/admin-permissions.md`, `get-user-access.ts`, Prisma `schema.prisma`).

---

## 1. Audit — current system (May 2026)

### 1.1 Admin routes & staff RBAC

| Layer | Location | Behavior |
|--------|-----------|----------|
| Edge / proxy | `src/proxy.ts` | Forwards admin path hints for RBAC alignment. |
| Staff session | `src/lib/auth/staff-session.ts` | **DB-backed** `User.role` → `StaffTier` (`staffTierFromRole`); JWT not sufficient alone. |
| Page guard | `src/lib/auth/guards.ts` → `requireAdmin()` | Session + `getStaffSession` + `adminRouteGateDecision` (path RBAC). |
| API guard | `src/lib/admin/ensure-admin.ts` → `requireAdmin(req)` | **Always pass `req`** so pathname comes from `req.url`; 403 on missing session or RBAC deny. |
| Path policy | `src/lib/auth/admin-path-policy.ts` | `super`: allow all; `support`: allowlist; `content`: broad allow minus content-forbidden + super-only prefixes. |

Canonical doc: `docs/admin-permissions.md`.

### 1.2 Entitlement resolution (DTC learner)

| Concern | Location | Single-user assumption |
|---------|----------|-------------------------|
| Subscription access | `src/lib/entitlements/get-user-access.ts` | `userId` → `User` + `subscription.findMany` **per user**; no org or seat pool. |
| Staff bypass | Same file | `isLearnerEntitlementStaffBypassRole` → full premium scope, `reason: admin_override` (legacy name); **no org**. |
| Narrower scope | `resolveEntitlement`, `resolveEducationalContentAccessForUser` | Wrap `getUserAccess`; still user-centric. |

**Risk note:** Institutional “seat” must **not** replace `getUserAccess` for learners without explicit product rules — dual sources of truth would break paywall consistency.

### 1.3 Progress & remediation models (Prisma — descriptive only)

- **`UserTopicStat`**: per-user topic ledger for weak-area signals (`topic-performance.ts`).
- **`UserRemediationEvent` / `UserRemediationQueue`**: remediation engine; **per user**, no cohort foreign keys today.
- **`User`**: pathway hint `targetExamPathwayId`; feature toggles (`enableAdaptivePlan`, etc.) are **per user**.

### 1.4 Billing / account

- **Stripe / subscriptions** remain on `User` + `Subscription` rows (see `get-user-access.ts`, `load-billing-page-payload.ts`).
- No organization customer id in schema today.

### 1.5 Adaptive / linked-learning hooks (for future instructor orchestration)

- **Weak topics / adaptive practice:** `@/lib/learner/topic-performance`, `@/lib/practice-tests/cat-pool.ts`, `pick-question-ids.ts`.
- **Linked learning signals on lessons:** `@/lib/lessons/pathway-lesson-linked-learning-assets.ts`, used from pathway lesson catalog sync.

---

## 2. Cohort architecture (contracts shipped in code)

TypeScript contracts live under `src/lib/institutional/`:

- `contracts.ts` — `Organization`, `Cohort`, `InstructorRef`, `CohortMembership`, assignment types, `CohortAnalyticsSnapshot`.
- `cohort-analytics-dto.ts` — **server-only** DTOs for readiness rows, weak-topic clusters, completion, remediation, engagement.
- `instructor-assignment-orchestration.ts` — **server-only** `InstructorAssignmentOrchestrator` interface + Phase 7 stub factory.
- `index.ts` — re-exports.

**Prisma direction (markdown only):** add `Organization`, `Cohort`, `CohortMembership` (and optional assignment tables) with FKs from membership to `User`; keep `Subscription` user-scoped until org billing is specified; consider `organizationId` nullable on `User` for migration path.

---

## 3. RBAC expansion (abstractions shipped)

- `src/lib/rbac/institutional-capabilities.ts` — `InstitutionalCapability` + `staffTierHasInstitutionalCapability`.
- `src/lib/rbac/institutional-admin-path-bridge.ts` — `tierAllowsAdminApiPath` delegates to `isPathAllowedForStaffTier` (extension point for institutional prefixes later).

**Hot-path refactors (max two):**

1. `ensure-admin.ts` — path allow uses `tierAllowsAdminApiPath`.
2. `api/admin/ops/run/route.ts` — super-only defense uses `staffTierHasInstitutionalCapability(..., SuperDangerousOps)` (equivalent to `tier === "super"` today).

---

## 4. Instructor workflow foundations

- Documented in `instructor-assignment-orchestration.ts` JSDoc: orchestrator must call existing adaptive/read paths and **never** imply Stripe entitlement from assignments alone.
- Stub implementation returns empty previews / `not_implemented` for enqueue — **no persistence**.

---

## 5. Cohort analytics foundations

- DTOs in `cohort-analytics-dto.ts` are **server-only** (`import "server-only"`).
- **No new public routes** in this phase.

---

## 6. Institutional entitlement — recommendations (audit)

| Topic | Recommendation |
|--------|----------------|
| **Seat licensing** | Model seats as org contract + **mapping table** (user ↔ seat); keep `getUserAccess` authoritative for “can open paywalled content” to avoid split brain. |
| **Org-scoped access** | Add `organizationId` on cohort + membership; gate server loaders by membership, not client hints. |
| **Cohort content** | Assignments store content keys only; enforce `resolveEntitlement` per learner on playback routes. |
| **Admin override** | Staff bypass stays server-only; do not expose “view as org” without audit and explicit support tier allowlist updates. |
| **Analytics privacy** | Aggregate cohort metrics with minimum cohort size / k-anonymity; avoid returning cross-user rows to instructor UI without review. |

---

## 7. RBAC gaps & risks

| Gap | Mitigation (future) |
|-----|---------------------|
| No `ORG_ADMIN` / `INSTRUCTOR` role in `UserRole` | Add Prisma enum + policy module; extend path allowlist or separate `/org` router. |
| Path RBAC vs capability matrix may drift | Keep `tierAllowsAdminApiPath` canonical for HTTP paths; use capabilities for non-path actions (batch ops, future GraphQL). |
| JWT `role` can lag DB | Already mitigated via `getStaffSession` for admin — keep for any new institutional session. |

---

## 8. Roadmap (suggested)

1. Add optional `Organization` / `Cohort` tables + membership (additive migration, backfill null).
2. Server loaders for cohort dashboard (staff-only or org-admin pilot).
3. Wire `InstructorAssignmentOrchestrator` to remediation queue writers with entitlement checks.
4. Cohort analytics job: rollup `UserTopicStat` + session tables → `CohortAnalyticsSnapshot` cache table.
5. Org Stripe customer (if product commits) — parallel to user subscriptions during transition.

---

## 9. Validation

Run from `nursenest-core/`:

- `npm run typecheck`
- `npm run build`

Mobile / release smoke: **not required** unless mobile packages import changed paths (they do not in this pass).

---

## 10. Files added / touched

**Added:** `reports/phase-7-institutional-foundations.md`, `src/lib/institutional/contracts.ts`, `cohort-analytics-dto.ts`, `instructor-assignment-orchestration.ts`, `index.ts`, `src/lib/rbac/institutional-capabilities.ts`, `institutional-admin-path-bridge.ts`.

**Modified:** `src/lib/admin/ensure-admin.ts`, `src/app/api/admin/ops/run/route.ts`.

---

## 11. Intentionally out of scope

- Prisma migrations and runtime persistence for org/cohort.
- Full LMS (gradebook, SCORM, discussion).
- Billing / Stripe org checkout, seat consumption automation.
- Public or partner API routes for cohort data.
- UI pages for instructors or org admins.
- Changes to learner URL structure, paywall, or `getUserAccess` outcome matrix.
