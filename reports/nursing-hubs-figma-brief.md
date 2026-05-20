# Nursing pathway hubs — premium Figma documentation

Product scope: **public nursing** hubs for **RN**, **RPN**, **NP**, **New Grad**. Routing is unchanged (`/[locale]/[slug]/[examCode]`). No public `/admin` or staff links in hub chrome.

## Reference implementation (parity target)

Production reference: tier hub shell `NursingTierHubPage` + `ExamPathwayHubPremiumModules` (semantic pastel panels + `StudyCard` grid).

## Frames to maintain (URLs + nodes)

Paste Figma URLs when ready. **TBD** until file access.

| Surface | Canonical URL | Desktop frame (file + node) | Mobile frame |
|--------|-----------------|----------------------------|--------------|
| US RN | `/us/rn/nclex-rn` | **TBD** | **TBD** |
| CA RPN REx-PN | `/canada/pn/rex-pn` | **TBD** | **TBD** |
| US NP FNP | `/us/np/fnp` | **TBD** | **TBD** |
| US New Grad | `/us/rn/new-grad-transition` | **TBD** | **TBD** |

## Screenshot matrix (light / dark families)

Playwright smoke: desktop + mobile × themes `ocean`, `blossom`, `midnight` → output `docs/screenshots/nursing-hubs-e2e/` (see `tests/e2e/public/nursing-pathway-hubs-smoke.spec.ts`).

## Tier QA hooks

- ECG marker: RN + NP only (`pathwayAllowsEcgLinkedLearning`); omitted on NEW_GRAD, RPN PN tier, allied.
- NP cases marker: `data-nn-qa-hub-np-cases` only on NP hubs.
- Generic scenarios marker: `data-nn-qa-hub-clinical-scenarios` on nursing non‑NP hubs.
