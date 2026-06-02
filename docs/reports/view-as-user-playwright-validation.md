# View-As User — Playwright Validation

**Date:** 2026-06-01  
**Test file:** `tests/e2e/admin/view-as-user.spec.ts`

---

## Test Coverage

### Admin Portal Access

| Test | Assertion | Status |
|---|---|---|
| Admin can access `/admin/view-as` | H1 contains "View As User", both tabs visible | ✅ Written |
| Non-admin redirected away | (covered by `requireAdmin()` in route) | ✅ Structural |

---

### Simulated Profile: Free User (RN · none)

| Test | Assertion |
|---|---|
| Banner is visible on /app | `[data-testid="admin-view-as-banner"]` present |
| Banner shows SIMULATED mode | Banner contains "SIMULATED" |
| Lessons page loads | Title matches, no auth redirect |
| Paywall appears for locked content | Page loads without crash; paywall indicators checked |
| Exit returns to admin | URL contains /admin after clicking Exit |

---

### Simulated Profile: Trial User (RN · trial)

| Test | Assertion |
|---|---|
| Banner shows trial state | Banner contains "trial" |
| Flashcards page loads | No auth redirect |
| Dashboard loads | `[data-testid="learner-shell"]` visible |

---

### Simulated Profile: Active Subscriber (RN · paid_active)

| Test | Assertion |
|---|---|
| Banner shows active state | Banner contains "paid_active" |
| Lessons load without paywall gate | Not redirected to sign-in |
| Flashcards load | Not redirected to sign-in |
| Practice tests page loads | Not redirected to sign-in |

---

### Simulated Profile: Expired Subscriber (RN · expired)

| Test | Assertion |
|---|---|
| Paywall enforced | Page body contains subscription/upgrade copy |
| Banner shows expired state | Banner contains "expired" |

---

### Simulated Profile: RPN (RPN · paid_active)

| Test | Assertion |
|---|---|
| RPN pathway in shell | Banner contains "RPN" |
| Lessons load for RPN | Not redirected to sign-in |

---

### Simulated Profile: NP (NP · paid_active)

| Test | Assertion |
|---|---|
| NP pathway in shell | Banner contains "NP" |
| CAT exam page loads | Not redirected to sign-in |

---

### Simulated Profile: Allied (ALLIED · paid_active)

| Test | Assertion |
|---|---|
| Allied pathway in shell | Banner contains "ALLIED" |
| Dashboard loads for Allied | `[data-testid="learner-shell"]` visible |

---

### New Lifecycle States (Phase 5)

| Profile | Test | Assertion |
|---|---|---|
| Cancelled (RN · canceled) | Has access within paid period | Not redirected to sign-in for lessons |
| Failed payment (RN · past_due) | In grace period | Banner shows "past_due" |

---

### Banner Persistence

| Test | Assertion |
|---|---|
| Banner persists through navigation: /app → /app/lessons → /app/flashcards → /app | Banner visible at each stop |

---

### Debug Overlay

| Test | Assertion |
|---|---|
| Toggle debug overlay | Overlay appears/disappears on button click |
| Overlay shows entitlement details | `[data-testid="view-as-debug-overlay"]` contains entitlement fields |

---

### Switch User

| Test | Assertion |
|---|---|
| Switch User link navigates to /admin/view-as | URL changes to /admin/view-as |

---

### Real User Search

| Test | Assertion |
|---|---|
| Search panel appears when Real Users tab selected | `input[type="search"]` visible |
| Search returns results for known email | "View As User" button appears |

---

## Environment Variables Required

| Variable | Purpose |
|---|---|
| `ADMIN_EMAIL` | Admin account email for login |
| `ADMIN_PASSWORD` | Admin account password |
| `BASE_URL` | Target environment (default: http://localhost:3000) |
| `TEST_LEARNER_EMAIL` | (optional) Known learner email for real-user search tests |

---

## Running the Tests

```bash
# Against staging
ADMIN_EMAIL=admin@nursenest.io \
ADMIN_PASSWORD=secret \
BASE_URL=https://staging.nursenest.ca \
npx playwright test tests/e2e/admin/view-as-user.spec.ts

# Against local (requires valid admin + signing secret)
ADMIN_EMAIL=admin@local.test \
ADMIN_PASSWORD=secret \
npx playwright test tests/e2e/admin/view-as-user.spec.ts --headed

# Run a single test group
npx playwright test tests/e2e/admin/view-as-user.spec.ts \
  --grep "Simulated profile — Active Subscriber"
```

---

## Test Count Summary

| Category | Test count |
|---|---|
| Admin portal access | 1 |
| Free User profile | 5 |
| Trial User profile | 3 |
| Active Subscriber | 4 |
| Expired Subscriber | 2 |
| RPN profile | 2 |
| NP profile | 2 |
| Allied profile | 2 |
| New Phase 5 lifecycles | 2 |
| Banner persistence | 1 |
| Debug overlay | 1 |
| Switch user | 1 |
| Real user search | 2 |
| **Total** | **28** |

---

## Profiles × Surfaces Matrix

| Profile | Lessons | Flashcards | Practice Tests | CAT | Dashboard | Paywall | Banner |
|---|---|---|---|---|---|---|---|
| Free User (none) | ✅ | — | — | — | — | ✅ | ✅ |
| Trial (trial) | — | ✅ | — | — | ✅ | — | ✅ |
| Active Subscriber | ✅ | ✅ | ✅ | — | — | — | ✅ |
| Expired (expired) | — | — | — | — | — | ✅ | ✅ |
| RPN | ✅ | — | — | — | — | — | ✅ |
| NP | — | — | ✅ | — | — | — | ✅ |
| Allied | — | — | — | — | ✅ | — | ✅ |
| Cancelled | ✅ | — | — | — | — | — | ✅ |
| Past Due | — | — | — | — | — | — | ✅ |

CAT-specific tests are covered by the practice tests page load assertions. Full CAT session creation tests are in `tests/e2e/flashcards/` and `tests/e2e/practice-tests/`.
