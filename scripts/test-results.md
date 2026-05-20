# Subscription Lifecycle Test Results
Run: 2026-03-18T07:34:18.121Z
Test user: testuser_sub_1773819256943
Base URL: http://localhost:5000

## Summary
Total: 23 | Passed: 23 | Failed: 0

## Detailed Results

| Step | Status | Details |
|------|--------|---------|
| 1. Register | PASS | Created user 31e2bf4e-9b3d-46c1-8f90-4767e1467a10 |
| 1a. Register tier=free | PASS | tier=free confirmed |
| 1b. Register subscriptionStatus=inactive | PASS | subscriptionStatus=inactive confirmed |
| 1c. Register testerAccess=false | PASS | testerAccess=false confirmed |
| 2. Login | PASS | Got userToken, tier=free |
| 2a. Login tier=free | PASS | tier=free confirmed on login |
| 3. GET /api/user/:userId | PASS | Profile retrieved |
| 3a. Profile tier=free | PASS | tier=free confirmed |
| 3b. Profile subscriptionStatus=inactive | PASS | subscriptionStatus=inactive confirmed |
| 3c. GET /api/auth/me (authenticated) | PASS | id=31e2bf4e-9b3d-46c1-8f90-4767e1467a10, tier=free |
| 3d. /api/auth/me tier=free | PASS | tier=free confirmed |
| 3e. /api/auth/me testerAccess=false | PASS | testerAccess=false confirmed (pre-grant) |
| 3f. GET /api/auth/me (no auth) returns 401 | PASS | 401 returned as expected |
| 4. Entitlement resolve (free tier) | PASS | hasAccess=true, accessSource=free, reason=emergency_mode_override |
| 4a. Free user entitlement source is not paid | PASS | accessSource=free (expected non-paid source for free user) |
| 5. Admin grant tester access | PASS | testerAccess=true, testerExpiry=2026-04-17T07:34:17.744Z |
| 6. Re-fetch profile reflects tester access | PASS | testerAccess=true, testerExpiry=2026-04-17T07:34:17.744Z |
| 6b. /api/auth/me reflects tester access | PASS | testerAccess=true |
| 7. Entitlement resolve (post-grant) | PASS | hasAccess=true, accessSource=tester, reason=active_tester |
| 7a. Tester has access after grant | PASS | hasAccess=true, source=tester |
| 8. Re-login succeeds | PASS | Got new userToken |
| 8a. Re-login preserves testerAccess | PASS | testerAccess=true persisted after re-login |
| 8b. /api/auth/me with new token persists state | PASS | testerAccess=true, tier=free |
