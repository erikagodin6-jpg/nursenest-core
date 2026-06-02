# Admin View-As-User System

**Implemented:** 2026-06-01  
**Phase 5 Extended:** 2026-06-01  
**Status:** ✅ Complete

---

## Phase 5 Additions (2026-06-01)

### New: Real User Impersonation

Admin can now view-as any specific real user account (not just simulated presets). The system loads the target user's actual subscription state from DB, maps it to QA simulation parameters, and sets the simulation cookie.

**New route:** `POST /api/admin/view-as/real-user` → loads real user subscription → sets QA cookie with `targetUserId` + `targetEmail`  
**New route:** `GET /api/admin/view-as/user-search?q=` → searches non-admin users by email/name  
**New page:** `/admin/view-as` → unified selection page with Real Users + Simulated Profiles tabs

### New: Subscription Lifecycle States

Added 5 new lifecycle states covering the full subscription state matrix:

| New Lifecycle | hasAccess | reason | Use case |
|---|---|---|---|
| `paid_monthly` | ✓ | `active_subscription` | Monthly billing cadence |
| `paid_annual` | ✓ | `active_subscription` | Annual billing cadence |
| `trial_expired` | ✗ | `no_access` | Trial ended, no conversion |
| `canceled` | ✓ | `canceled_paid_through` | Cancelled but within paid period |
| `past_due` | ✓ | `past_due_grace` | Failed payment, grace period |

### New: Persistent Bottom Banner

`AdminViewAsBanner` — fixed to bottom of every learner page (z-index: 9999). Shows:
- Mode badge: `REAL USER` (purple) or `SIMULATED` (blue)
- Exit, Switch User, Return to Admin actions
- Debug overlay: live entitlement details (hasAccess, reason, tier, country, etc.)

### New: `targetUserId` + `targetEmail` in Cookie Payload

The `AdminLearnerQaPayloadV1` now includes optional `targetUserId` and `targetEmail` fields for real-user sessions. These are used for banner display and audit logging only. No study data is loaded from the target user's account.

---

## Overview

The View As Customer system lets admins simulate the exact platform experience of any user type — paywalls, subscriptions, content access, dashboards, CAT exams, and study flows — without touching real user accounts. Every activation is logged with the admin's user ID, target persona, and timestamp.

---

## Architecture

The system layers on top of the existing **QA Simulation cookie** infrastructure (`nn_admin_learner_qa`), which was already wired into the entitlement resolution pipeline. The View As Customer portal provides a curated, product-friendly interface on top of this technical foundation.

```
Admin selects user type
  → POST /api/admin/learner-qa/simulate { track, lifecycle, country, source: "view_as_customer" }
  → HMAC-signed cookie written: nn_admin_learner_qa (httpOnly, 2h TTL)
  → Admin redirected to /app
  → Every page request reads cookie, overrides entitlements
  → Persistent "VIEWING AS USER" banner shown in learner shell
  → Admin taps "Return To Admin" → navigates back
  → Admin taps "Stop Viewing" → cookie cleared, simulation ends
```

### Entitlement Override Chain

```
getUserAccess(userId)
  ├── Check staff role → if ADMIN/SUPER_ADMIN: full access regardless of cookie
  ├── Read nn_admin_learner_qa cookie (HMAC-verified)
  ├── If cookie valid and staff session present:
  │     → Override tier with cookie track
  │     → Override subscription status with cookie lifecycle
  │     → Override country with cookie country
  │     → Override NP specialty / allied career if specified
  └── Return overridden UserAccess object
```

This means the entire platform — lessons, flashcards, CAT exams, practice tests, study plans, weak areas, readiness analytics, paywalls — all respond to the simulated entitlements.

---

## New Files

| File | Description |
|---|---|
| `src/app/(admin)/admin/view-as-customer/page.tsx` | Server page — admin auth gate + active simulation status |
| `src/app/(admin)/admin/view-as-customer/view-as-customer-client.tsx` | Client component — 8 user type cards + interaction |

## Modified Files

| File | Change |
|---|---|
| `src/components/admin/admin-learner-qa-app-toolbar.tsx` | Banner redesigned: "VIEWING AS USER" badge + "Return To Admin" link + "Stop Viewing" button |
| `src/app/api/admin/learner-qa/simulate/route.ts` | Added `source` field to Zod schema; logs `source: "view_as_customer"` in audit events |

---

## Admin Portal: `/admin/view-as-customer/`

### Access Control

- Route is under `/admin/*` — requires admin session (ADMIN, SUPER_ADMIN roles)
- `requireAdmin()` is called server-side; non-admins receive a redirect to `/login`
- Page load is logged: `admin_view_as_customer / page_loaded` with admin user ID

### User Type Cards

| Card | Track | Lifecycle | Country | Description |
|---|---|---|---|---|
| 🔒 Free User | RN | none | US | No subscription — paywalls active, upgrade prompts shown |
| ⏳ Trial User | RN | trial | US | Free trial period — full access with countdown |
| ✅ Active Subscriber | RN | paid_active | US | Paid + active — all content accessible |
| ⚠️ Expired Subscriber | RN | expired | US | Previously subscribed — renewal prompts shown |
| 🍁 RN User | RN | paid_active | CA | Canadian RN scope, NCLEX-RN pathway |
| 🇨🇦 RPN User | RPN | paid_active | CA | Canadian RPN scope, REx-PN pathway |
| 🩺 NP User | NP | paid_active | US | FNP pathway, advanced pharmacology scope |
| 🚑 Allied User | ALLIED | paid_active | US | Paramedic career scope, limited nursing content |

### Active Session Status

When a simulation is active, the portal shows:
- Current persona name and parameters
- "Open Learner View →" link to `/app`
- "Stop Viewing" button to clear the session
- Quick verification links to all 8 study surfaces

---

## Persistent Banner: Learner Shell

When a QA simulation is active, the learner shell (`/app/*`) displays a persistent amber banner:

```
┌─────────────────────────────────────────────────────────────────────┐
│ [VIEWING AS USER]  RN Paid Active · US            [← Return To Admin] [Stop Viewing] │
│ Simulated: RN · paid_active · US · No writes performed as this user  │
│ View As Customer · Full QA tools · Mobile preview (390px)            │
└─────────────────────────────────────────────────────────────────────┘
```

- **VIEWING AS USER** badge (amber) — immediately visible, cannot be missed
- **Banner title** — shows the simulation description (e.g., "RN — Paid (active) · US")
- **Return To Admin** — navigates to `/admin/view-as-customer/` while keeping the simulation active
- **Stop Viewing** — calls `/api/admin/learner-qa/clear` and ends the simulation
- **Audit line** — "No writes performed as this user · All actions audited"

---

## What Is Verified Per Persona

The admin should verify the following surfaces for each persona. Quick-access links are shown in the active session panel:

| Surface | URL | What to Check |
|---|---|---|
| Lesson hub & content | `/app/lessons` | Paywalled vs. open lessons, topic access, preview limits |
| Flashcard hub & study | `/app/flashcards` | Deck availability, premium decks locked/unlocked, study session |
| Practice test | `/app/practice-tests` | Test availability, question access, paywall for premium tests |
| CAT exam | `/app/cat` | CAT eligibility by tier, exam family scope |
| Dashboard | `/app` | Study plan visible, weak areas, readiness score, upgrade CTAs |
| Study plan | `/app/study-plan` | Adaptive recommendations, topic recommendations |
| Weak areas | `/app/weak-areas` | Performance data, upgrade prompts for non-subscribers |
| Account & billing | `/app/account` | Subscription status display, upgrade buttons, billing history |

### Expected Behavior by Persona

| Persona | Lessons | Flashcards | Practice Tests | CAT | Study Plan |
|---|---|---|---|---|---|
| Free User | Preview only | Preview decks | Locked | Locked | Basic only |
| Trial User | Full access | Full access | Full access | Full access | Full plan visible |
| Active Subscriber | Full access | Full access | Full access | Full access | Full plan |
| Expired Subscriber | Paywalled | Paywalled | Locked | Locked | Renewal prompt |
| RN User | RN scope | RN decks | RN tests | RN CAT | RN recommendations |
| RPN User | RPN scope | RPN decks | RPN tests | REx-PN | RPN recommendations |
| NP User | NP scope (advanced) | NP decks | NP tests | NP adaptive | NP pathway plan |
| Allied User | Allied scope | Allied decks | Allied tests | N/A | Allied pathway |

---

## Security

### Access Gating
- Route `/admin/view-as-customer/` is behind `requireAdmin()` — throws if not ADMIN/SUPER_ADMIN
- The simulate API (`/api/admin/learner-qa/simulate`) has its own `requireAdmin()` check
- Admins cannot impersonate other admin accounts (enforced in the user-specific impersonate route)

### Cookie Security
- Cookie: `nn_admin_learner_qa`
- HMAC-SHA256 signed with `ADMIN_LEARNER_QA_SECRET` (falls back to `AUTH_SECRET` / `NEXTAUTH_SECRET`)
- `httpOnly: true` — inaccessible to JavaScript
- `secure: true` in production — HTTPS only
- `sameSite: "lax"` — CSRF protection
- `maxAge: 7200` (2 hours) — automatic expiry
- Payload includes `sub` (admin user ID) — cookie is bound to the admin, not any learner

### Audit Logging

Every view-as-customer activation produces two audit records:

**1. Server log (`safeServerLog`):**
```
admin_learner_qa / simulate_cookie_set
{
  userIdPrefix: "abc12345",
  track: "RN",
  lifecycle: "paid_active",
  country: "US",
  source: "view_as_customer",
  admin_learner_qa_simulated: 1,
  adminViewAs: 1
}
```

**2. Product analytics event (`productEvent`):**
```
admin_learner_qa_started
{
  track: "RN",
  lifecycle: "paid_active",
  country: "US",
  source: "view_as_customer",
  adminViewAs: 1,
  userIdPrefix: "abc12345"
}
```

**3. Page load audit:**
```
admin_view_as_customer / page_loaded
{
  adminId: "abc12345",
  surface: "view_as_customer_portal"
}
```

**Session clear is also logged** — when admin stops viewing, `admin_learner_qa/clear` clears the cookie and logs the termination event.

### What Cannot Happen
- **No writes as the simulated user** — the simulation overrides read-path entitlements only; all write operations use the admin's own session
- **No password access** — the system uses a separate cookie mechanism, not the user's credentials
- **No cross-contamination** — the simulation cookie is bound to the admin user's session ID; it cannot be transferred or replayed by another session
- **No admin impersonation** — the system does not allow admins to simulate other admin accounts

---

## Configuration

### Required
| Variable | Description |
|---|---|
| `AUTH_SECRET` or `NEXTAUTH_SECRET` | Used as HMAC signing key if dedicated secret is not set |
| Admin user with `ADMIN` or `SUPER_ADMIN` role | Must exist in the `User` table |

### Optional
| Variable | Description |
|---|---|
| `ADMIN_LEARNER_QA_SECRET` | Dedicated HMAC key for the QA cookie (16+ chars) — recommended for production |

### Verify Configuration
```bash
# Check that the simulate API works
curl -X POST /api/admin/learner-qa/simulate \
  -H "Content-Type: application/json" \
  -d '{"track":"RN","lifecycle":"paid_active","country":"US","confirm":true}' \
  --cookie "authjs.session-token=<admin_token>"

# Expected response
{ "ok": true, "dryRun": false, "state": { "active": true, "track": "RN", ... } }
```

If you receive `{ "code": "admin_learner_qa_misconfigured" }`, set `ADMIN_LEARNER_QA_SECRET` or ensure `AUTH_SECRET` is set.

---

## Navigation

| Page | URL |
|---|---|
| View As Customer portal | `/admin/view-as-customer/` |
| Full QA simulation tools | `/admin/learner-qa/` |
| User management | `/admin/users/` |
| Specific user's view-as page | `/admin/users/[userId]/view-as` |

---

## Limitations

1. **No real-user-data impersonation** — The simulation creates synthetic entitlements. It does NOT show a real user's study progress, history, or personal data. For that, use the user-specific view-as portal at `/admin/users/[userId]/view-as`.

2. **Session-bound simulation** — The simulation is bound to the admin's browser session. Each admin gets their own simulation cookie — multiple admins can run different simulations simultaneously without interfering.

3. **No mobile-specific simulation** — The toolbar includes a "Mobile preview (390px)" link that opens a mobile-sized browser window, but this is a viewport simulation, not a device simulation.

4. **2-hour automatic expiry** — If an admin leaves the browser idle for >2 hours, the simulation cookie expires automatically and the learner shell returns to the admin's native experience.
