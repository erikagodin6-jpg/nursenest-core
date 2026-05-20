# UI preview capture — analytics / report / readiness

Use a **paid** test account (`QA_PAID_EMAIL` + `QA_PAID_PASSWORD` or `E2E_PAID_*`).

## Suggested (Playwright codegen or trace)

1. Start app: `npm run dev:next` (from `nursenest-core/`) with valid `DATABASE_URL` + auth secrets.
2. Log in as paid user.
3. Capture full viewport:
   - `/app` — dashboard
   - `/app/account/analytics` — performance report + scroll to detail panels
   - `/app/account/report` — report card (`#rc-readiness`, trends, next steps)
   - `/app/account/readiness` — hero + factors
4. **Mobile 375:** resize to 375×812 before `/app/account/analytics` and `/app/account/report`.
5. **Dark:** toggle theme (Midnight/Apex) and repeat analytics + report card.

Save PNGs into `preview-screenshots/` and copies under `reports/ui-redesign-preview/` if your process mirrors other redesign reports.

Or run: `npm run visual-qa:capture` when env is configured for the visual-qa route pack (includes report-card slug).
