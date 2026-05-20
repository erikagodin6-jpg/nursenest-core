# Allied Health hubs — Figma-driven UI plan (NurseNest premium baseline)

This document satisfies **Part 3** of the Allied Health hub brief: what must exist in Figma **before** large UI implementation, and how implementation must stay aligned with RN / RPN / NP / New Grad / Pre-Nursing shells.

## Visual baseline

- **Reference:** current NurseNest premium marketing homepage + existing `AlliedHealthPathwayHub` / `ExamPathwayHubPremiumModules` patterns (`nn-premium-pathway-hub`, semantic tokens, `data-theme`).
- **Branding:** Preserve leaf logo, wordmark, canonical nav — no parallel “Allied sub-brand” chrome.

## Figma deliverables (create or update)

1. **Frames**
   - Global hub: `/allied/allied-health` — desktop + mobile.
   - Representative occupations (minimum): MLT, Paramedic, Respiratory Therapy, Physiotherapy, Occupational Therapy, Social Work, Psychotherapy, PSW — each desktop + mobile.
2. **Themes:** Ocean, Midnight, Blossom — same frames duplicated or component variants with `data-theme` documented.
3. **Specs to annotate on canvas**
   - Card hierarchy (hero → study modes → premium grids → pricing).
   - Spacing scale (reuse existing `nn-marketing-*` rhythm; no ad-hoc px ladders).
   - Typography: H1/H2/body/caption roles tied to `nn-marketing-h1`, `nn-marketing-h2`, `nn-marketing-body`.
   - Section grouping labels (“Study tools”, “Readiness & progress”) and optional allied-specific leads.
   - Icon treatment: Lucide-aligned stroke weights; semantic chart accents via `alliedPremiumAccentChartVar`.
   - Gradients / backgrounds: `semantic-*` + `palette-*` only; **no** hot pink, neon, or muddy grey slabs.
   - Hover / focus: visible focus rings; locked cards clearly disabled but **public-safe** (no admin URLs).
   - Progress / readiness / weak-area tiles: match existing premium card grid density.
   - Study-plan / exam-plan entry: mirror RN hub CTA hierarchy.
   - Module grouping: Study tools vs Readiness; no duplicate strips.
   - Chips / badges: `nn-badge-semantic-*` family.
   - Empty / loading: skeleton or compact copy; avoid “inventory wall” empty states.
   - Locked / gated: `StudyCard` locked variant; `href` must not expose `/admin`.

## Implementation guardrails (Part 4)

- **No routing changes** to `/allied/{professionKey}` or `/allied/allied-health/*`.
- **No entitlement drift** — `applyAlliedOccupationPremiumModuleLocks` remains source of truth for occupation locks.
- **Figma → code:** implement in `allied-health-pathway-hub.tsx` + shared study/primitives; avoid one-off hex in TSX.

## Verification

- Playwright screenshots: `nursenest-core/docs/screenshots/allied-health-e2e/`.
- Optional: Visual Review / Storybook parity if the team uses those gates for marketing.

When Figma file keys exist, append links below:

- **File:** https://www.figma.com/design/A0lUC2ZcBmQ41eeZLXxQ8Q/allied-health-hub-program-qa-frames — Allied Health Hub Program – QA frames (created 2026-05-09 via authenticated MCP; starter canvas for desktop/mobile Ocean · Midnight · Blossom frames).
- **Default page (canvas root) node id:** `0:1` (Page 1 — design to add occupation frames, locked-card states, readiness row, study tools vs CAT locked/unlocked variants per `alliedHubCatSurfaceUnlocked`).
- **Next design steps:** Duplicate page into sections — Global hub; MLT; Paramedic; Respiratory (`respiratory`); PSW (`psw-hca`); Social Work; Psychotherapy; OT (`occupational-therapy`); Physio (`physiotherapy`) — each × desktop/mobile × themes; annotate public-safe `href` rules on locked tiles.

---

## Evidence checklist (PR / FINAL reports)

Attach or link the following for any hub or marketing surface that changes visuals materially:

| Item | Requirement |
|------|----------------|
| Figma file | URL (`figma.com/design/...`) |
| Frames | Node IDs for desktop + mobile; light + dark (Ocean / Midnight / Blossom) |
| Figma screenshots | Exports or `get_screenshot` captures of approved direction |
| Implementation screenshots | Same viewport + theme as Figma (side-by-side in PR) |
| Routes touched | Exact paths (e.g. `/allied/mlt`, `/allied/allied-health/lessons`) |
| Components | TSX/CSS files changed; note if shared primitive vs one-off |
| Playwright | Spec name(s); artifact dir under `docs/screenshots/` |
| Parity notes | Intentional deviations from Figma with rationale |

Automated checks (see `tests/e2e/helpers/visual-layout-assertions.ts`): document + premium root must not gain horizontal overflow on covered flows.

## Premium module grid — frame checklist (2026-05 allied pass)

| Frame | Notes |
|-------|--------|
| Study tools band | Includes pathway_cat tile **only** when CAT marketing unlocked for occupation; locked labs/med calc/pharm per policy |
| Supplement row | Skills refresher (medication drills), allied clinical scenarios (no NP QA marker), track career blog link |
| Readiness band | Progress + My Exam plan (unchanged hierarchy) |
| Themes | Ocean / Midnight / Blossom — verify `data-nn-allied-premium-accent` legibility on top border |

### Figma file (live — populate frames on this canvas)

| Artifact | URL | Node IDs |
|----------|-----|----------|
| Allied hub QA / premium program | https://www.figma.com/design/A0lUC2ZcBmQ41eeZLXxQ8Q | Page `0:1` (initial empty page — frames TBD as design adds them) |
| Theme matrix | **Figma file TBD** | TBD |
