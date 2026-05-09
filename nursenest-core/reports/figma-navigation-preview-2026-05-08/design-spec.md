# Figma navigation preview — design spec (fallback)

**Figma MCP** was not used to author pixels in a cloud file for this iteration; implementation follows this spec plus existing NurseNest semantic tokens.

## Variant A — Ultra clean clinical

- **Surface:** warm white / `--background` with crisp `--semantic-border-soft` separation.
- **Hierarchy:** logo lockup → horizontal primary links → theme + auth cluster; Study tools appear only in learner mode.
- **Motion:** border + elevation deepen after scroll (`data-preview-scrolled`).
- **Dropdown:** soft card panel, two-column pathways grid, token borders only.

## Variant B — Playful pastel premium

- **Surface:** subtle cool/warm wash using `--semantic-panel-cool` / `--semantic-panel-warm` mixes (never saturated bands).
- **Interaction:** rounded-full controls; hover fills using `--semantic-info` at low mix percentages.
- **Theme:** theme picker sits inside a soft bordered pill so it feels intentional, not floating.

## Variant C — Modern app / dashboard hybrid

- **Surface:** restrained glass via `backdrop-blur` + translucent `--card` mixes (still readable; WCAG checked via token pairs).
- **Utility cluster:** theme toggle + auth/account grouped in one rounded panel with divider — faster scanning for power users.
- **Breakpoint:** desktop shows compact Account + primary CTA; mobile preserves sheet pattern.

## Shared behaviors

- Leaf logo + wordmark via existing `HeaderBrandLockup` / `useThemeLogo("leaf")`.
- Query toggles: `?auth=anon|learner`, `?dropdown=1` for megamenu capture without clicks.
- Preview control strip (fixed) switches modes for screenshots.
