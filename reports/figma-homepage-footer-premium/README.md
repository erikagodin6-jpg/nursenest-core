# Homepage footer — premium Figma mockups (approval gate)

**Purpose:** Premium marketing homepage **footer only** mockups for stakeholder approval before any Next.js implementation.

**Figma file:** [NurseNest Homepage Footer Premium](https://www.figma.com/design/nPcgL4T9prSDRrGdNhW39R/NurseNest-Homepage-Footer-Premium)

**File key:** `nPcgL4T9prSDRrGdNhW39R`  
**Page:** `Homepage Footer Premium`

**Truthpack:** `.vibecheck/truthpack/copy.json` is **not present in this workspace clone**. Frame copy aligns with in-repo marketing patterns (e.g. independent prep disclaimers). **Phase 2:** reconcile strings with truthpack when available; do not treat Figma as source of truth for tiers or pricing.

---

## Exported PNGs (absolute paths)

| Variant | Absolute path |
|--------|-----------------|
| Desktop — Ocean (canonical structure) | `/root/nursenest-core/reports/figma-homepage-footer-premium/footer-desktop-ocean.png` |
| Desktop — Blossom (same layout, warm token swap) | `/root/nursenest-core/reports/figma-homepage-footer-premium/footer-desktop-blossom.png` |
| Desktop — Midnight (same layout, dark token swap) | `/root/nursenest-core/reports/figma-homepage-footer-premium/footer-desktop-midnight.png` |
| Mobile — Ocean (stacked nav, 390px wide) | `/root/nursenest-core/reports/figma-homepage-footer-premium/footer-mobile-ocean.png` |

**Export map (Figma node → PNG):**

| Frame name | Node ID | PNG filename |
|------------|---------|--------------|
| Footer / Desktop / Ocean | `2:2` | `footer-desktop-ocean.png` |
| Footer / Desktop / Blossom | `8:2` | `footer-desktop-blossom.png` |
| Footer / Desktop / Midnight | `8:52` | `footer-desktop-midnight.png` |
| Footer / Mobile / Ocean | `10:2` | `footer-mobile-ocean.png` |

Screenshots: Figma MCP `get_screenshot`, `contentsOnly: true`, `maxDimension` 2400 (desktop) / 1600 (mobile). Re-export after Figma edits (URLs expire).

---

## Frame list (sections)

Desktop **Ocean** defines auto-layout structure; **Blossom** and **Midnight** duplicate structure with token-style fill/stroke/text swaps only.

1. **Section 1 — Premium CTA** — Trust line, headline, body, **Start free** + **View pricing**, soft gradient, border.
2. **Section 2 — Ecosystem navigation** — Exams, Study tools, Resources, Company (realistic labels: NCLEX-RN, CAT, ECG, Labs, OSCE, Institutions, Policies, etc.).
3. **Section 3 — Brand block** — Emoji = **leaf placeholder** only; wordmark text; Canada/global positioning line; locale/theme/region as **UI labels**.
4. **Section 4 — Legal strip** — © line, independence disclaimer, policy links.

**Mobile / Ocean:** Same sections; nav **vertical** stack; tighter padding; adjusted display sizes.

**Type:** Inter in file = **stand-in** for production **DM Sans** (ecosystem typography).

---

## Phase 2 — Implementation checklist (post-approval; no code in this pass)

- [ ] **`site-footer.tsx`:** `nursenest-core/src/components/layout/site-footer.tsx` — wired from `src/app/(marketing)/(default)/layout.tsx`, `[locale]/layout.tsx`, `marketing-default-layout-chrome-failsafe.tsx`; preserve `trailingChrome` / i18n shard streaming.
- [ ] **Semantic `<footer>`:** Landmark, heading levels, grouped `<nav>` / lists.
- [ ] **SEO:** Anchors and hrefs consistent with `canonical-destinations` and `marketing-route-integrity.test.ts`.
- [ ] **i18n:** Prefer existing `footer.*` keys (`marketing-hero-nav-critical-keys.ts`).
- [ ] **Themes:** Ocean / Blossom / Midnight via `[data-theme]` + semantic tokens (no ad-hoc hex in app).
- [ ] **A11y:** Midnight contrast, focus order, mobile touch targets.
- [ ] **Assets:** Replace emoji with production leaf + wordmark.

---

## Repo impact

- **Added:** This directory, four PNGs, `README.md`.
- **App source:** **No** edits under `nursenest-core/src/`.
- **Figma:** New draft file (URL above). Midnight frame theme label updated to “Midnight” on node `8:98`; bundled `footer-desktop-midnight.png` includes the Midnight theme label (node `8:98`).
