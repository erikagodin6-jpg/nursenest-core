# Settings / account hub redesign summary

- **Workspace:** `nn-learner-account-workspace` wraps account layout with `min-w-0` to reduce horizontal overflow on mobile.
- **Header:** Replaced flat `border-border` strip with `nn-product-surface-accent` card, semantic text colors, and focus-visible rings on Back / Sign out.
- **Nav:** `nn-card-cool` for cool-panel semantics + semantic section header bar.

Routes: all `/app/account/*` pages inherit the layout.

**Tested by:** typecheck; E2E extended with `/app/account/overview` when paid creds exist.
