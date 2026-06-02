# Admin View-As-Customer System

Generated: 2026-06-02

## Summary

The admin View-As-Customer system is implemented as a read-only learner QA simulation flow. It lets staff select a predefined customer persona, sets a signed `nn_admin_learner_qa` cookie, and routes the administrator into `/app` with simulated entitlement state.

No user credentials are accessed. No real learner account is mutated. The simulation is enforced through the existing HMAC-signed admin learner QA cookie and server-side entitlement overlay.

## Implemented Routes

### `/admin/view-as-customer`

File:

- `src/app/(admin)/admin/view-as-customer/page.tsx`

Behavior:

- calls `requireAdmin()`
- loads DB-backed staff session with `getStaffSession()`
- reads active simulation state with `readAdminLearnerQaPublicState()`
- writes a page-load audit event through `safeServerLog("admin_view_as_customer", "page_loaded", ...)`
- renders an admin identity strip
- renders the client persona selector

### Client Persona Selector

File:

- `src/app/(admin)/admin/view-as-customer/view-as-customer-client.tsx`

Includes 8 predefined persona cards:

| Card | Track | Lifecycle |
| --- | --- | --- |
| Free User | RN / US | none |
| Trial User | RN / US | trial |
| Active Subscriber | RN / US | paid_active |
| Expired Subscriber | RN / US | expired |
| RN User | RN / CA | paid_active |
| RPN User | RPN / CA | paid_active |
| NP User | NP / FNP / US | paid_active |
| Allied User | ALLIED / paramedic / US | paid_active |

Each card includes:

- icon
- badge
- description
- access summary
- `View As User` button

Activation:

- posts to `/api/admin/learner-qa/simulate`
- includes `source: "view_as_customer"`
- sets `confirm: true`
- redirects to `/app`

Active session panel includes quick links to:

- `/app/lessons`
- `/app/flashcards`
- `/app/practice-tests`
- `/app/cat`
- `/app`
- `/app/study-plan`
- `/app/weak-areas`
- `/app/account`

## Modified Toolbar

File:

- `src/components/admin/admin-learner-qa-app-toolbar.tsx`

The learner-app toolbar now includes:

- amber `VIEWING AS USER` badge
- `Return To Admin` link to `/admin/view-as-customer`
- inline `Stop Viewing` button
- audit copy: `No writes performed as this user · All actions audited`
- quick persona presets
- custom track/lifecycle/region controls

## Simulation API

File:

- `src/app/api/admin/learner-qa/simulate/route.ts`

Security and logging:

- admin gate: `requireAdmin(req)`
- Zod schema accepts optional `source`
- accepted sources: `view_as_customer`, `learner_qa_panel`, `toolbar`, `api`
- product analytics include `source`
- server logs include `source`
- signed cookie max age uses `ADMIN_LEARNER_QA_MAX_AGE_SEC`

The max age is defined in:

- `src/lib/admin/admin-learner-qa-simulation.ts`

Current value:

- `2 * 60 * 60` seconds
- 2-hour expiry

## Security Posture

| Requirement | Status | Evidence |
| --- | --- | --- |
| Admin-only page | Implemented | `requireAdmin()` in `/admin/view-as-customer/page.tsx` |
| Admin-only API | Implemented | `requireAdmin(req)` in `/api/admin/learner-qa/simulate` |
| No password access | Implemented | simulation uses signed cookie, not credentials |
| No writes as simulated user | Implemented | entitlement overlay only; toolbar states read-only intent |
| Audit logging | Implemented | `safeServerLog`, `productEvent`, page-load audit |
| 2-hour expiry | Implemented | `ADMIN_LEARNER_QA_MAX_AGE_SEC = 2 * 60 * 60` |

## Caveat

The page comment says access is for `ADMIN` and `SUPER_ADMIN`, but the actual guard is `requireAdmin()`. That means access follows the platform's current admin/staff policy, including any support/content roles allowed by `requireAdmin`. This is consistent with existing admin routing, but it is not a super-admin-only gate.

## Verification

Source inspection confirmed:

- route files exist
- 8 cards exist
- view-as activation posts `source: "view_as_customer"`
- toolbar contains the amber `VIEWING AS USER` banner
- stop-viewing action clears the QA simulation cookie through `/api/admin/learner-qa/clear`
- simulation cookie expires after 2 hours

