# Allied Health ecosystem — redesign plan (2026-05-08)

## Design references (Figma gap)

No embedded Figma keys in-repo. Alignment inferred from **homepage premium CSS** (`premium-redesign-2026.css`, `globals.css`), **`NursingTierHubPage`** (`nn-premium-pathway-hub`, `nn-nursing-tier-hub-hero-band`), and **`semantic-status-tokens.css`** (badges, chart mixes).

## Routes audited

| Surface | Location |
|---------|-----------|
| Locale pathway hub | `[locale]/[slug]/[examCode]/page.tsx` → `AlliedHealthPathwayHub` |
| Allied marketing landing | `/allied-health` |
| Occupation hubs | `/allied/[career]` |
| Global allied shell | `/allied/allied-health`, `/allied/allied-health/*` |

## Occupations (registry)

All **`professionKey`** values live in `ALLIED_PROFESSIONS` (19 entries). Nuance via **`hubCategory`**: therapy, lab, acute, clinical, support — see `ALLIED_HUB_CATEGORY_META`.

## Implementation strategy

1. Shared **`AlliedHealthPathwayHub`** shell (hero band, typography, H2s, spacing, category badges on occupation cards).  
2. **`/allied-health`** hero + vertical rhythm.  
3. **`AlliedHubProfessionSections`** spacing.  
4. **`/allied/[career]`** context label.  
5. **`globals.css`** hero band parity with RN tier hub.

## Validation

`npm run typecheck:critical`, `npm run test:homepage`; Playwright allied routes (`visual-qa-route-pack`, `cat-entrypoints`) when toolchain permits; optional `npm run test:allied-health`, `npm run test:pathway-lessons`.

---

*Also save a copy under `reports/ui-redesign-preview/` if your PR checklist expects that path.*
