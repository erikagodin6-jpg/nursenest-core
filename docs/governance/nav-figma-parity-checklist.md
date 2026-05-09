# Nav — Figma parity checklist (marketing header v4)

Use this checklist when comparing **approved Figma frames** to **implemented** marketing navigation (`SiteHeader`, utility cluster, tier rail). Check each box with date / PR when satisfied.

**Related:** `docs/governance/figma-premium-ui-mandatory-process.md`, `docs/governance/figma-post-completion-summary-template.md`

---

## Logo and lockup

- [ ] Header uses **leaf** lockup + text wordmark (no unintended full-width raster mark in header).
- [ ] Logo box sizes match spec: **42 / 46 / 50px** breakpoints.
- [ ] Wordmark typography (size, weight, tracking) matches Figma.
- [ ] Logo and wordmark **vertical alignment** and **gap** match spec.

## Spacing and rhythm

- [ ] **Padding** on section shell (`nn-section-shell`) matches: utility band, primary row, tier rail.
- [ ] **Bar A** (utility) height and vertical padding match desktop spec.
- [ ] **Primary row** min-heights, gaps between logo cluster / nav / auth column match.

## Responsive behavior

- [ ] **1280+**: Row-4 layout (utility + primary + tier) matches frame; no unintended clipping.
- [ ] **768–1279**: Tablet wrap behavior; tier chips and marketing links do not collide.
- [ ] **≤390**: Mobile menu, safe areas, and CTA stack match mobile frame.
- [ ] Long locale or region labels **do not overflow** utility triggers (max-width / ellipsis behavior).

## Utility strip / cluster

- [ ] Country, language, and theme controls **visible and aligned** per mode (`row4`, `dark-marketing`, `dark-bar`).
- [ ] Popovers / floating panels **width** (288px country, 208px language) and **z-index** above page content.
- [ ] **Focus rings** and keyboard dismissal (Escape) match interaction spec.

## Theme expression

- [ ] **Ocean** (light): tier + link chips use intended semantic tints (not flat single-hue chrome).
- [ ] **Midnight** (dark): unified dark header; foreground readable on saturated nav bg.
- [ ] **Blossom** (light): soft rose / lilac accents; **no neon / hot pink** chrome (align with semantic guardrails).

## Contrast and readability

- [ ] `--nav-fg` on `--nav-bg` (and `--nn-header-primary-fg` on primary band) meets intended contrast for links and muted text.
- [ ] Active / hover states for `.nn-marketing-nav-link` and tier chips are distinguishable without harsh borders.

## Hover / focus

- [ ] Link hover: underline / background per `.nn-marketing-nav-link` rules.
- [ ] `focus-visible` rings use `var(--ring)` and are visible on keyboard tab through all header controls.

## Mobile menu

- [ ] Menu button opens full-screen / drawer pattern per design.
- [ ] Signed-in **Continue studying** / **Account** / **App** paths present and labeled correctly.
- [ ] Guest **Log in** / **Start free** (or equivalent) match Figma hierarchy.

## Premium shell cohesion

- [ ] Header visually **matches premium homepage** baseline (glass, borders, shadow) — no forked “alternate” nav chrome.
- [ ] `premium-redesign-2026.css` header rules align with Figma **paint targets** (`data-nn-header-band`, `data-nn-header-layout`).

## Screenshots / evidence

- [ ] Desktop + mobile shots stored under **`docs/screenshots/nav-audit-2026/`** (repo root).
- [ ] **Ocean / Midnight / Blossom** captured for at least homepage + one pathway hub.
- [ ] PR or `figma-post-completion-summary-template.md` links **Figma file URL** and **node IDs**.

## Ocean / Blossom / Midnight matrix

| Surface | Ocean desktop | Ocean mobile | Midnight desktop | Midnight mobile | Blossom desktop | Blossom mobile |
|---------|---------------|----------------|-------------------|-----------------|-----------------|----------------|
| Homepage | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Pathway hub (e.g. US RN) | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Pricing | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

---

**Sign-off**

| Role | Name | Date |
|------|------|------|
| Design | | |
| Engineering | | |
