# Clinical Interpretation SEO + Learning Ecosystem

Premium roadmap: nursing-authoritative interpretation hubs, rigorous teaching, funneling to lessons/CAT/flashcards/scenarios, **free SEO + premium mastery**.

**Implementation gate:** Figma first (desktop/tablet/mobile × Ocean/Blossom/Midnight), then routes — `docs/governance/figma-premium-ui-mandatory-process.md`.

## Registry

Source: `nursenest-core/src/lib/clinical-interpretation/clinical-interpretation-registry.ts`

Nine clusters; hub `/clinical-interpretation`; guides `/clinical-interpretation/{slug}`. Status `figma_pending` → `noindex,follow` until `published`.

## Free vs premium

Layered content (registry `segmentation.*`): free = frameworks, examples, FAQ, trust; premium = adaptive drills, progressive cases, CAT-linked practice, remediation.

## Figma deliverables

Hub + article template; panels; waveforms; ECG; ABG tree; CXR overlays; lab trends; alerts; workflows; NCLEX blocks; premium dashboard; sticky mobile; differential cards; fluid/sepsis/hemodynamic visuals; lock/preview; quiz; related rails — all themes.

## Conversion links

`/app/labs`, `/app/practice-tests`, `/app/flashcards`, `/app/clinical-scenarios`, `/app/account/report`, `/app/med-calculations`, `/app/lab-drills`, `/modules/ecg`, `/modules/lab-values`; lesson slugs + topic slugs for pathway drills.

## Phases

P0 registry+tests; P1 Figma; P2 routes+metadata; P3 gates+CTAs; P4 Playwright QA.

## Validation

`cd nursenest-core && npm run test:unit:clinical-interpretation`

## Figma refs

(TBD: file URL + node IDs after design freeze.)

