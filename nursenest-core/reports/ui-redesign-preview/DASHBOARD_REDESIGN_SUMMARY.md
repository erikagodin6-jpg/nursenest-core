# Dashboard redesign summary

See **LEARNER_ECOSYSTEM_REDESIGN_SUMMARY.md** for the full list. Dashboard-specific work:

- **Shell:** `nn-learner-ds-ambient` on `[data-nn-learner-ds]` root — soft chart-1 / chart-3 / chart-4 radials over `--semantic-bg-base` (homepage-adjacent, scoped to learner app only).
- **Hero:** `nn-learner-dashboard-hero` on `LearnerDashboardPageShell` header — light diagonal wash for depth; children stay above via `z-index` in CSS.
- **Study home sections** unchanged in structure; existing `nn-dash-*` rhythm and semantic surfaces preserved.

**Tested by:** `typecheck:critical`, `test:homepage`. E2E paid dashboard still `learner-surfaces.smoke` `/app` step.
