# Footer redesign — Figma package

**Date:** 2026-05-10  
**Figma file key:** `fZvJ2pfmWdUPauKPjUfvhU`  
**Page:** `Footer redesign — premium`

## Figma URLs

| Surface | URL |
|---------|-----|
| Page (canvas) | https://www.figma.com/design/fZvJ2pfmWdUPauKPjUfvhU?node-id=43-2 |
| Desktop frame | https://www.figma.com/design/fZvJ2pfmWdUPauKPjUfvhU?node-id=43-3 |
| Mobile frame | https://www.figma.com/design/fZvJ2pfmWdUPauKPjUfvhU?node-id=43-56 |
| Theme variants | https://www.figma.com/design/fZvJ2pfmWdUPauKPjUfvhU?node-id=43-142 |
| States | https://www.figma.com/design/fZvJ2pfmWdUPauKPjUfvhU?node-id=43-155 |

## Node IDs (same order)

| Frame | Node ID |
|-------|---------|
| Page | `43:2` |
| NN Footer — Desktop 1440 | `43:3` |
| NN Footer — Mobile 390 | `43:56` |
| NN Footer — Theme variants | `43:142` |
| NN Footer — States | `43:155` |

## Exported PNGs (MCP `get_screenshot`)

Relative to repo app root `nursenest-core/`:

| Artifact | Path |
|----------|------|
| Desktop | `reports/footer-redesign-mockups-2026-05-10/footer-desktop-1440.png` |
| Mobile | `reports/footer-redesign-mockups-2026-05-10/footer-mobile-390.png` |
| Theme strip | `reports/footer-redesign-mockups-2026-05-10/footer-theme-variants.png` |
| Hover + newsletter | `reports/footer-redesign-mockups-2026-05-10/footer-states-hover-newsletter.png` |

## Preserved-features table (nothing removed)

| Feature | Production source | Figma frame coverage |
|---------|-------------------|----------------------|
| Brand slot + wordmark | `SiteBrandLogoMark` + “NurseNest” | Desktop / Mobile — placeholder “use production FooterBrand” |
| Supporting copy (3 lines) | `footer.supportingNursesGlobally`, `footer.brandTagline`, `footer.globalPathwaysLine` | Labeled in brand column |
| Exam Pathways (4) | `publicExamPrepHubDestinations` | Column |
| Explore (6) | `publicMarketingExploreDestinations` + `/for-institutions` | Column |
| Regional hubs (3) | `countryNav.footerFeatured` | Column (CA example labels) |
| Account column | Session branches | Anonymous variant shown; matrix in analysis doc |
| Language card | `footer.studyInYourLanguage`, preference list, `footer.viewAllLanguages` | Desktop + Mobile |
| Email banner | `EmailSignupBanner` | Desktop, Mobile, States |
| Copyright + terms + privacy | `brand.nurseNest`, `footer.rights`, `footer.terms`, `footer.privacy` | Desktop + Mobile |
| Legal disclaimer | `footer.legalDisclaimer` | Desktop + Mobile |
| Leaf watermark | `FooterLeafWatermark` | Note only (do not redraw in Figma) |
| Social | *none* | Not shown |
| `data-testid` | *none* | N/A |

## Truthpack

`.vibecheck/truthpack/copy.json` was **not** present in this workspace clone. Labels in Figma use **i18n key names** and stable English CTAs from `cta-copy.ts` where applicable.

## Implementation notes (after approval — do not edit until sign-off)

**Primary files**

- `nursenest-core/src/components/layout/site-footer.tsx` — layout, columns, session branches, `getNavChromeStyle`, legal row.
- `nursenest-core/src/components/marketing/email-signup-banner.tsx` — newsletter field + phase-2 stub.
- `nursenest-core/src/components/i18n/marketing-language-preference.tsx` — locale chips (consumed by footer).
- `nursenest-core/src/components/brand/site-brand-logo.tsx` — footer logo variant.
- `nursenest-core/src/lib/theme/nav-chrome.ts` — footer/nav shared chrome colors (align redesign tokens here + `theme-palettes.css` / semantic tokens as needed).

**CSS / tokens**

- Footer uses CSS variables `--footer-border`, `--footer-fg`, `--footer-bg`, `--footer-muted` (see `site-footer.tsx` classes).
- Email banner uses semantic panel / shadow tokens (`email-signup-banner.tsx`).

**Risk**

- Preserve `resolveMarketingHref`, `withMarketingLocale`, and country `footerFeatured` wiring — no hardcoded country-specific footer columns in TSX beyond titles.

## Analysis document

Full inventory: `reports/footer-redesign-figma-analysis-2026-05-10.md`
