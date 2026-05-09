# Learner dashboard + settings UI audit (2026-05-08)


## Branch

`feat/learner-dashboard-settings-ui-audit` (not pushed)

## Summary

- **Canonical aliases**: App Router redirects: `/app/dashboard` → `/app`, `/app/settings` → `/app/account/settings`, top-level `/app/report-card` → `/app/account/report` (existing `/app/account/report-card` unchanged).
- **Settings hub**: Exam plan card → `/app/exam-plan` using existing keys `learner.personalPage.section.examPlan` / `learner.personalPage.section.examPlanSub`. CTA arrow uses `var(--semantic-brand)` instead of `text-primary`.
- **Account shell**: Account hub back link + analytics teaser use semantic tokens; account header CTAs `sm:flex-wrap`; cross-link chips use `--semantic-text-primary`.
- **Performance nav**: Active state includes `/app/report-card` for report.

## Files changed

- `nursenest-core/src/app/(student)/app/(learner)/dashboard/page.tsx` (new)
- `nursenest-core/src/app/(student)/app/(learner)/settings/page.tsx` (new)
- `nursenest-core/src/app/(student)/app/(learner)/report-card/page.tsx` (new)
- `nursenest-core/src/app/(student)/app/(learner)/account/settings/page.tsx`
- `nursenest-core/src/components/student/learner-account-center-overview.tsx`
- `nursenest-core/src/components/student/learner-account-shell-header.tsx`
- `nursenest-core/src/components/student/learner-account-cross-links.tsx`
- `nursenest-core/src/components/student/learner-performance-workspace-nav.tsx`
- `nursenest-core/src/lib/learner/learner-account-center.contract.test.ts`
- `nursenest-core/tests/e2e/learner-surfaces/learner-dashboard-settings-audit.spec.ts` (new)
- `reports/learner-dashboard-settings-ui-audit-2026-05-08.md` (this file)

## Screenshot output path

`reports/learner-dashboard-settings-ui-audit-2026-05-08/screenshots/` when `LEARNER_UI_AUDIT_SCREENSHOTS=1` and paid QA creds are set (see e2e spec header).

## Commands

| Command | Result |
|---------|--------|
| `npm run typecheck:critical` | Pass |
| `npm run test:learner-account` | New contract tests pass; `learner-legacy-parity.contract.test.ts` still fails (pre-existing allied health URL expectation) |

Playwright: not fully run (port 3000 EADDRINUSE). Use `PLAYWRIGHT_SKIP_WEB_SERVER=1` + `BASE_URL` for remote smoke.

## Truthpack

`.vibecheck/truthpack/` not found in this workspace; exam-plan copy uses existing generated marketing keys only.

## Deploy / readiness

No auth/entitlement/billing/schema changes. Push manually when ready.

*Verified By VibeCheck ✅*
