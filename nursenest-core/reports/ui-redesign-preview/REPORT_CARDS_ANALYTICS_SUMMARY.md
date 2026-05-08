# Report cards & analytics summary

- **Report card (dashboard inline):** `learner-report-card.tsx` unchanged behavior; continues to use `nn-product-surface-accent` and semantic topic bands.
- **Full report route:** `account/report` — no code path changes; inherits ambient learner background from shell.
- **Analytics:** `account/analytics/page.tsx` unchanged; page already uses `nn-learner-page-hero` (defined in `semantic-status-tokens.css`).
- **E2E:** Paid smoke now visits `/app/account/analytics` after overview.

**Tested by:** typecheck. Runtime `/app/account/analytics` not executed without subscriber session.
