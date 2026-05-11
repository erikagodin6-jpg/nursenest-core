# MLT / MLS — Figma parity screenshots

**Purpose:** Store **before / Figma target / after implementation** evidence for the MLT premium expansion program.

## Folder layout

Suggested prefixes (align with [`docs/reports/mlt-figma-parity-audit.md`](../reports/mlt-figma-parity-audit.md)):

| Prefix | Meaning |
|--------|---------|
| `before-*` | Current production or pre-change captures |
| `figma-*` | Exported frames or Figma MCP screenshots |
| `after-*` | Post-implementation app captures |

## Naming convention

`mlt-<surface>-<theme>-<width>x<height>-<variant>.png`

Examples:

- `mlt-hub-ocean-1440x900-before.png`
- `mlt-dashboard-midnight-390x844-after.png`

**Themes:** `ocean`, `blossom` (or project-approved Blossom token alias), `midnight`.

## Minimum capture set (program gate)

For each **major** surface in the audit doc:

- Desktop (≈1440) + mobile (≈390×844)  
- Ocean + Blossom + Midnight  
- Critical states: default, empty, locked premium, loading skeleton

## Related

- [`docs/governance/figma-premium-ui-mandatory-process.md`](../../governance/figma-premium-ui-mandatory-process.md)  
- [`docs/screenshots/theme-parity/README.md`](../theme-parity/README.md) — structural parity discipline for themes  
