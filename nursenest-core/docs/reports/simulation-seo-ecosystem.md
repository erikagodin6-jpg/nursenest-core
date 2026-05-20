# Simulation + NGN / OSCE SEO Ecosystem

## Figma-first gate

Public marketing routes for `/clinical-simulation/*` ship **after** Figma (desktop/tablet/mobile × Ocean/Blossom/Midnight), mobile simulation UX validation, theme parity, and progression review — see `docs/governance/figma-premium-ui-mandatory-process.md`.

Design surfaces: simulation landings, NGN/OSCE layouts, virtual patient UI, vitals/telemetry panels, branching UX, free preview vs premium lock, result summaries, rubric dashboards.

## Registry (source of truth)

`nursenest-core/src/lib/simulations/simulation-seo-registry.ts`

| ID | Planned URL |
|----|-------------|
| nursing-simulation-cases | `/clinical-simulation/nursing-simulation-cases` |
| ngn-clinical-judgment-scenarios | `/clinical-simulation/ngn-clinical-judgment-scenarios` |
| nclex-case-studies | `/clinical-simulation/nclex-case-studies` |
| osce-practice-scenarios | `/clinical-simulation/osce-practice-scenarios` |
| clinical-decision-making-simulations | `/clinical-simulation/clinical-decision-making-simulations` |
| virtual-patient-cases | `/clinical-simulation/virtual-patient-cases` |
| next-gen-nclex-scenarios | `/clinical-simulation/next-gen-nclex-scenarios` |

Hub: `/clinical-simulation`. Status `figma_pending` → **noindex** until `published`.

## Free vs premium

Layered access (registry `segmentation`): previews and partial branches free; full branching, adaptive difficulty, dynamic vitals, analytics, CAT-linked flows premium — **no parallel entitlement system**; server gates unchanged.

## SEO targeting

Queries: nursing simulation, NGN scenarios, NCLEX case studies, OSCE practice, virtual patient, clinical judgment, Next Gen NCLEX.

Per page when live: unique metadata, canonical, H1, FAQ/breadcrumb/schema where eligible (`schema` flags), internal links to lessons, `/app/clinical-scenarios`, practice, flashcards, labs, calculators, interpretation hubs.

## Capabilities model

`capabilities`: `ngnModalities`, `osceFeatures`, `branching`, `adaptiveDifficulty`, `dynamicVitals` — editorial/product alignment; engines live in clinical-scenarios / practice stacks.

## Internal linking

Simulation ↔ interpretation (`/clinical-interpretation`, labs, ECG/lab modules), lessons (topic slugs), CAT/practice/report card — use `related` fields when wiring routes.

## NGN / OSCE roadmap

- **NGN:** modalities listed per cluster (bowtie, matrix, trend, SATA, drag/drop, cloze, prioritization).  
- **OSCE:** timed stations, rubric, handoff, escalation — progressive rollout post-Figma.

## Launch phases

| Phase | Deliverable |
|-------|-------------|
| P0 | Registry + tests + this doc |
| P1 | Figma approved |
| P2 | Marketing routes + metadata + JSON-LD |
| P3 | Premium previews + analytics events |
| P4 | Playwright matrix (themes × viewports) |

## Risks

Thin “interactive” shells; accessibility on dense sim UI; paywall perception — mitigate with substantive free previews.

## Validation

```bash
cd nursenest-core
npm run test:unit:simulation-seo
```

## Figma references

(TBD: file URL + node IDs.)

