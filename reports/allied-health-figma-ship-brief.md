# Allied Health — Figma ship brief (public hubs)

**Status:** Design intent documented for engineering parity with premium NurseNest marketing shells. **Figma file URL:** **TBD** (no linked design file in-repo; align new frames with `docs/governance/figma-premium-ui-mandatory-process.md`).

## Coverage

| Frame / surface | Desktop | Mobile | Light / dark | Themes (Ocean / Midnight / Blossom) | Node ID |
|-----------------|--------|--------|--------------|----------------------------------------|---------|
| Global hub `/allied/allied-health` + `/us/allied/allied-health` | Yes | Yes | Yes | Yes — semantic panels; occupation grid readable at 390px | **TBD** |
| Occupation hub — **MLT** `/allied/mlt` | Yes | Yes | Yes | Yes — accent via `alliedPremiumAccentChartVar` | **TBD** |
| Occupation hub — **Paramedic** `/allied/paramedic` | Yes | Yes | Yes | Yes | **TBD** |
| OT, SW, Psychotherapy, PSW, RT (respiratory), Physio | Yes | Yes | Yes | Yes — copy via registry `roleHero` | **TBD** |
| Remaining `ALLIED_PROFESSIONS` keys | Yes | Yes | Yes | Yes | **TBD** |

## Visual hierarchy (premium zone)

1. **Dominant:** pathway hero + primary CTAs (lessons / study entry).
2. **Secondary:** premium module grid — multiple semantic hues (`semantic-status-tokens.css`).
3. **Featured:** allied clinical scenarios when scenarios flag is on; honest lock + `alliedClinicalScenariosLockedCta` when off.
4. **Supplements:** skills refresher (medication drills query), pathway CAT when `alliedHubCatSurfaceUnlocked`, career/blog when profession resolves.

## Locked / public-safe states

- Locked tiles use policy + honest CTAs; no fake destinations.
- Premium matrix tests assert **no `/admin`** substrings in resolved guest hrefs.

## Profession accent strategy

- Hero tone: `allied-professions-registry.ts` (`roleHero`).
- Accent tokens: `alliedPremiumAccentChartVar` + semantic chart tokens (themes adjust glow, not layout).

## Figma MCP / screenshots

- **Not pulled** this session (no dedicated Allied Figma file authenticated for MCP).
- **Intent:** premium homepage emotional bar — calm, colorful, breathable; Allied adds occupation grid + CAT/scenarios/career supplements.

## Code anchors

- `allied-health-pathway-hub.tsx`, `exam-pathway-hub-premium-modules.ts` (`pushAlliedSupplementalPremiumStudyTools`), `allied-hub-premium-module-policy.ts`, `buildAlliedGlobalHubPath`, `withAlliedProfessionMarketingQuery`.
