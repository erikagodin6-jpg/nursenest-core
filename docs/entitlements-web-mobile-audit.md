# Entitlements audit: auth, Stripe, web vs app APIs, mobile

**Date:** 2026-05-06  
**Scope:** `nursenest-core/` Next.js app — Prisma `User` / `Subscription`, NextAuth, Stripe webhooks, `getUserAccess`, subscriber APIs, learner `/app/*` RSC.

---

## Explicit answer

**Website subscriptions unlock app APIs for the same authenticated user: YES**

**Evidence:** Subscriber-only Route Handlers use `requireSubscriberSession()` → `auth()` (NextAuth) + **`getUserAccess(userId)`** on Postgres (`Subscription` + `User`). Learner `/app/*` pages use **`resolveEntitlementForPage` → `resolveEntitlement` → `getUserAccess`** — the same resolver. Stripe updates the DB via `applyStripeWebhookEvent`; runtime gates do not call Stripe. There is **no** `apps/mobile` native app in-repo; mobile browser / WebView clients using the same session cookies hit the **same** APIs. No mobile-only Stripe product or bypass route was found.

---

## 1) Canonical user model (Prisma)

**File:** `nursenest-core/prisma/schema.prisma`

### `User` (fields relevant to tier / subscription / auth)

| Field | Role |
|--------|------|
| `id` | Session `user.id` |
| `email`, `normalizedEmail` | Identity |
| `role` | `UserRole` — staff roles trigger learner entitlement bypass inside `getUserAccess` |
| `country` | `CountryCode` — content region |
| `tier` | `TierCode` — profile; subscription `planTier` participates in effective access |
| `trialStatus`, `trialEndsAt`, … | In-app trial |
| `credentialVersion` | JWT invalidation on password change |
| `authProvider` | Sign-in provenance |

### `Subscription` (Stripe mirror)

| Field | Role |
|--------|------|
| `userId` | FK to `User` |
| `stripeCustomerId`, `stripeSubscriptionId` | Stripe linkage (`stripeSubscriptionId` unique) |
| `status` | `ACTIVE`, `GRACE`, `PAST_DUE`, `CANCELLED` |
| `planTier`, `planCountry`, `planCode`, `billingRegionSlug`, `alliedCareer` | Plan scope from checkout / Stripe |
| `currentPeriodEnd`, `trialEnd`, `cancelAtPeriodEnd`, `pastDueSince` | Lifecycle (incl. canceled paid-through, past-due policy) |

### Enums (from schema)

- **`TierCode`:** RPN, LVN_LPN, RN, NP, ALLIED, PRE_NURSING, NEW_GRAD  
- **`UserRole`:** LEARNER, ADMIN (deprecated), SUPER_ADMIN, CONTENT_ADMIN, SUPPORT_ADMIN  
- **`SubscriptionStatus`:** ACTIVE, GRACE, PAST_DUE, CANCELLED  
- **`TrialStatus`:** NONE, ACTIVE, EXPIRED, EXHAUSTED  

---

## 2) Auth provider / session sources

| Mechanism | Location | Notes |
|------------|----------|--------|
| **NextAuth** | `nursenest-core/src/lib/auth.ts` | Exports `auth`, credentials provider, JWT session |
| **JWT callbacks** | `nursenest-core/src/lib/auth-callbacks.ts` | Normalizes `tier`, `country`, `subscriptionStatus` on token — **UI hints** |
| **Login snapshot** | `auth.ts` (credentials success) | Calls `getUserAccess` to seed session fields at sign-in |
| **RSC protected session** | `nursenest-core/src/lib/auth/protected-route-session.ts` | `getProtectedRouteSession` → dynamic `import("@/lib/auth")` → `auth()` + JWT cookie fallback |
| **Session sync payload** | `nursenest-core/src/lib/auth/session-identity-from-db.ts` | `loadSessionIdentityResult` → **`getUserAccess`** — DB-backed identity for `/api/auth/sync-session` |
| **Admin RBAC** | `nursenest-core/src/lib/auth/guards.ts` (RSC), `nursenest-core/src/lib/admin/ensure-admin.ts` (API) | Staff dashboards — separate from learner paywall |
| **Staff learner bypass** | `nursenest-core/src/lib/auth/staff-roles.ts` — `isLearnerEntitlementStaffBypassRole` | Used in **`getUserAccess`**: `hasPremium: true`, `reason: "admin_override"` |

---

## 3) Stripe customer / subscription mapping

| Stage | File | Behavior |
|-------|------|----------|
| **Webhooks** | `nursenest-core/src/app/api/subscriptions/webhook/route.ts` | Verify signature → idempotent claim → `applyStripeWebhookEvent` |
| **Apply + comments** | `nursenest-core/src/lib/stripe/apply-stripe-webhook-event.ts` | Stripe authoritative for billing events; **Postgres `Subscription` + `User`** are the app mirror; **entitlements = DB only via `getUserAccess`** |
| **Checkout** | `nursenest-core/src/app/api/subscriptions/checkout/route.ts` | Server-created sessions for authenticated users |

**Web app runtime:** does not re-fetch Stripe for gating; reads Prisma.

---

## 4) Entitlement helpers (paths + symbols)

| Symbol | File |
|--------|------|
| **`getUserAccess`** | `nursenest-core/src/lib/entitlements/get-user-access.ts` |
| **`accessScopeFromUserAccess`** | same |
| **`resolveEntitlement`** | `nursenest-core/src/lib/entitlements/resolve-entitlement.ts` |
| **`resolveEntitlementForPage`** | `nursenest-core/src/lib/entitlements/resolve-entitlement-for-page.ts` |
| **`requireSubscriberSession`**, **`notSubscribedResponse`** | `nursenest-core/src/lib/entitlements/require-subscriber-session.ts` |
| **`requireSubscriberSessionDeps`** | `nursenest-core/src/lib/entitlements/require-subscriber-session-deps.ts` — `auth`, `getUserAccess`, `accessScopeFromUserAccess`, `correlationIdFromHeaders`, `maybeBlockOrTouchAccountSharingAfterSubscriberOk` |
| **`resolveEducationalContentAccessForUser`** | `nursenest-core/src/lib/entitlements/resolve-educational-content-access.ts` |
| **`subscriptionStatusForSession`** | `nursenest-core/src/lib/entitlements/subscription-session-status.ts` — coarse JWT/client mirror; **not** a security gate |
| **State matrix docs** | `nursenest-core/src/lib/entitlements/entitlement-state-matrix.ts` |

**Paywall / policy contract tests:** `nursenest-core/src/lib/security/paywall-surface-policy.test.ts`, `nursenest-core/src/lib/security/authorization-entitlement-policy.test.ts`

---

## 5) `/app/*` vs `/api/*` — same `getUserAccess`?

| Surface | Auth | Entitlement |
|---------|------|-------------|
| **Learner RSC** | `getProtectedRouteSession` / per-page `auth` | **`resolveEntitlementForPage` → `resolveEntitlement` → `getUserAccess`** |
| **Subscriber APIs** | **`requireSubscriberSession` → `auth()`** (via deps) | **`getUserAccess` + `accessScopeFromUserAccess`** |

Some APIs use **`auth()`** alone for non-premium or mixed flows (onboarding, freemium, profile); premium bank/CAT/lessons bulk paths use **`requireSubscriberSession`** or **`resolveEntitlement`** after `auth()`.

---

## 6) Mobile

- **`apps/mobile`:** **Not present** in this repository.
- **Playwright “mobile”:** `nursenest-core/tests/e2e/mobile/*.spec.ts` — responsive **web** app; same cookies and API routes.
- **Gap / future:** A native shell must attach the **same** NextAuth session (or a documented token bridge); no dedicated mobile bypass exists in `src/app/api` today.

---

## 7) Single source of truth; client / duplicated checks

**SoT:** Postgres **`User` + `Subscription`**, read server-side through **`getUserAccess`**.

| Kind | Examples |
|------|-----------|
| **JWT / session hints (UX)** | `learner-shell-user-bar.tsx` (`subscriptionStatus`), `site-header.tsx` / `layout.tsx` tier labels, `subscription-paywall.tsx`, checkout banners merging `sync-session` — must not replace API gates |
| **Documented hint-only** | `subscription-session-status.ts` |
| **Intentional parallel wrappers** | `resolveEntitlement`, `requireSubscriberSession` — all delegate to **`getUserAccess`** |

---

## 8) Code / test changes from this audit

| Change | Purpose |
|--------|---------|
| **`require-subscriber-session-deps.ts`** | Injectable `auth`, `getUserAccess`, `accessScopeFromUserAccess`, `correlationIdFromHeaders`, account-sharing hook — production defaults unchanged |
| **`require-subscriber-session.ts`** | Uses deps (fixes hermetic tests needing request scope for `headers()`) |
| **`require-subscriber-session.test.ts`** | `node:test`: 401 unauthenticated, 403 lapsed `no_access`, 200-path when `getUserAccess` returns `active_subscription`, staff `admin_override`, 503 on `getUserAccess` throw, optional 429 from sharing guard, `not_subscribedResponse` contract |
| **`package.json`** | `audit:paywall-security` now includes `require-subscriber-session.test.ts` |

**Not done:** schema changes, new Stripe products, weakening web paywall, mobile-only subscription.

---

## 9) Verification

```bash
npm --prefix nursenest-core run typecheck:critical
npm --prefix nursenest-core run audit:paywall-security
```

---

## 10) Quick reference index

- `nursenest-core/prisma/schema.prisma`  
- `nursenest-core/src/lib/entitlements/get-user-access.ts`  
- `nursenest-core/src/lib/entitlements/require-subscriber-session.ts`  
- `nursenest-core/src/lib/entitlements/require-subscriber-session-deps.ts`  
- `nursenest-core/src/lib/stripe/apply-stripe-webhook-event.ts`  
- `nursenest-core/src/app/api/subscriptions/webhook/route.ts`  
- `nursenest-core/src/lib/auth/protected-route-session.ts`  
- `nursenest-core/src/app/(student)/app/(learner)/layout.tsx`  
