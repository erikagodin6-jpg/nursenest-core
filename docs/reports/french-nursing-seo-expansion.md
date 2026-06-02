# French Nursing SEO + Learning Expansion (Canada)

## Figma-first gate

Ship French marketing/simulation/calculator surfaces **after** Figma (desktop/tablet/mobile × Ocean/Blossom/Midnight), French text expansion review, bilingual nav, and mobile typography checks — `docs/governance/figma-premium-ui-mandatory-process.md`.

## Registry

**Source:** `nursenest-core/src/lib/i18n/french-nursing-seo-registry.ts`

Planned `/fr/…` ecosystem rows with **native Canadian French** titles/descriptions, English mapping fields for QA, clusters (NCLEX, REx-PN, med math, simulation, interpretation), audiences, free/premium bullets, pipeline/clinical/publish readiness, and French-only `targetQueriesFr`.

## Locale SEO policy (critical)

French is **`partial`** in `marketing-languages.ts`. Per `language-readiness.ts`: **`isLocaleSeoIndexable("fr")` is false** until tier promotion — French-prefixed URLs stay **`noindex`** at locale level; sitemap/hreflang for `/fr/…` follow the same policy helpers.

Use `shouldIndexFrenchNursingSeoEntry()` and `shouldEmitFrenchHreflangAlternate()` when wiring metadata — **do not** bypass with manual `index: true`.

## Audiences

Quebec students, bilingual Canadian nurses, IENs, REx-PN / NCLEX francophones, Haiti/francophone Africa pathways (secondary) — encoded as `audiences` on each row.

## SEO intents

Informational and exam-prep: *test nclex avec corrigé*, *préparation rex-pn*, *calculs médicaux infirmiers*, *simulation clinique*, *interprétation gaz sanguins / ECG / laboratoire*, etc.

## Free vs premium

Layered in `segmentation` — substantive free teaching + premium adaptive/practice; entitlements unchanged server-side.

## Hreflang & canonical

- No mixed-language snippets: French metadata fields stay FR; English in `titleEn`/`metaDescriptionEn` for mapping only.  
- Reciprocal hreflang when **`isLocaleHreflangEligible("fr")`** becomes true and entries are `published`.  
- Canonical: follow existing marketing locale rules (`withMarketingLocale`, programmatic overlays).

## Launch phases

| Phase | Deliverable |
|-------|-------------|
| P0 | Registry + tests + this doc |
| P1 | Figma + copy editorial + clinical review |
| P2 | Routes + metadata + JSON-LD |
| P3 | Promote `fr` tier when checklist green → indexing |

## Risks

Machine translation creep; France-only terminology; layout overflow; false bilingual UX.

## Validation

```bash
cd nursenest-core
npm run test:unit:french-nursing-seo
```

## Figma references

(TBD: file URL + node IDs.)

