# Ecosystem entitlement + subscription audit

**Date:** YYYY-MM-DD  
**Environment:**  
**Owner:**

## Roles tested

| Role | Method | Result |
|------|--------|--------|
| Anonymous | Playwright guest / manual | |
| Free account | | |
| Paid subscriber | `paid-user-entitlements` / manual | |
| Staff / admin | env creds | |

## Premium surface checks

| Surface | Expected gate | Observed | OK? |
|---------|----------------|----------|-----|
| `/app/labs` | | | |
| `/app/med-calculations` | | | |
| `/app/osce` | | | |
| ECG modules | Advanced ECG separate per guardrails | | |
| Report card mastery | Paid-only sections | | |

## Advanced ECG separation

- Accidental core bundling: YES / NO  
- Evidence:

## Adaptive recommendations + entitlements

| Check | OK? |
|-------|-----|
| Free users do not see paid-only mastery as unlocked | |
| Recommendations respect tier | |

## Failures / warnings

| ID | Severity | Route | Issue | Fix |
|----|----------|-------|-------|-----|
| | | | | |
