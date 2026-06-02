# Navigation Health Audit
**Generated:** 2026-06-01T00:00:00.000Z (template — updated on each crawl run)
**Base URL:** https://nursenest.ca
**Routes Audited:** 16
**Status:** ✅ Template — run `npx playwright test tests/e2e/navigation/navigation-crawl.spec.ts` to generate live data

---

## How to Run

```bash
# Local
npx playwright test tests/e2e/navigation/navigation-crawl.spec.ts --project=chromium

# Remote (production)
PLAYWRIGHT_SKIP_WEB_SERVER=1 BASE_URL=https://nursenest.ca \
  npx playwright test tests/e2e/navigation/navigation-crawl.spec.ts --project=chromium
```

---

## Routes Covered

| Route | Path | HTTP | Load | Status |
|---|---|---|---|---|
| Homepage | `/` | 200 | — | ✅ |
| RN Hub | `/rn` | 200 | — | ✅ |
| RN NCLEX-RN Hub | `/rn/nclex-rn` | 200/301 | — | ✅ |
| Canada RN Hub | `/canada/rn/nclex-rn` | 200 | — | ✅ |
| RPN/REx-PN Hub | `/canada/pn/rex-pn` | 200 | — | ✅ |
| NP Hub | `/np` | 200 | — | ✅ |
| Canada NP CNPLE | `/canada/np/cnple` | 200 | — | ✅ |
| Allied Health Hub | `/allied-health` | 200 | — | ✅ |
| Marketing Lessons Hub | `/lessons` | 200 | — | ✅ |
| Marketing Flashcards | `/flashcards` | 200 | — | ✅ |
| Blog Hub | `/blog` | 200 | — | ✅ |
| Pricing | `/pricing` | 200 | — | ✅ |
| Login | `/login` | 200 | — | ✅ |
| Signup | `/signup` | 200 | — | ✅ |
| Health Ready API | `/api/health/ready` | 200 | — | ✅ |
| Notification Health | `/api/subscriptions/notification-health` | 200/503 | — | ✅ |

---

## Failed Routes
_None — run crawl to populate_

## Warnings
_None — run crawl to populate_
