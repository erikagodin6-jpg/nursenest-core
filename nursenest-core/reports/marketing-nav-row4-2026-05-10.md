# Marketing nav row 4 (2026-05-10)

See git commit on branch fix/marketing-nav-row4-theme-utilities for full details.

- Figma Option 4: https://www.figma.com/design/fZvJ2pfmWdUPauKPjUfvhU?node-id=9-91
- Desktop utilities merged into auth cluster; ThemePicker gated by publicMarketingThemeChoiceCount().
- Light: data-nn-header-layout=marketing-row4 + premium-redesign-2026.css token row4 tier + utility triggers.
- typecheck:critical passed.


## Update — centered primary row + Log In outline (same session)

- **Layout:** `globals.css` desktop grid uses `1fr / auto / 1fr` with brand `justify-self: start` and auth cluster `justify-self: end` so the Pricing…Tools cluster stays at true horizontal center inside `nn-section-shell` (matches common “logo left / centered links / utilities+CTAs right” pattern).
- **Log In:** Replaced ghost text with `HEADER_DESKTOP_LOGIN_OUTLINE_CLASS` — `min-h-[44px]`, `rounded-xl`, `border`, `px-4 py-2` to align with Start Free primary CTA rhythm.
- **Option 4 polish:** `premium-redesign-2026.css` — row4 primary band gets a soft `semantic-brand` wash; desktop main nav links and tier hub links get matching sky (`semantic-info`) pill chips.
