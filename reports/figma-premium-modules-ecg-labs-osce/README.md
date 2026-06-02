# Premium clinical modules — Figma frames (ECG, Labs, OSCE)

## Figma file

- **URL:** https://www.figma.com/design/phkliV8apmge3MJDmOzS9j/NurseNest-Premium-Modules-%E2%80%94-ECG-Labs-OSCE
- **File key:** `phkliV8apmge3MJDmOzS9j`
- **Owner context:** Created in the authenticated Figma team drafts via MCP (`create_new_file`).

## Pages (IA)

| Page | Purpose |
|------|---------|
| `Premium Modules / ECG` | Telemetry workstation, midnight-optimized shell |
| `Premium Modules / Labs` | Interpretation-first labs dashboard (Ocean surfaces) |
| `Premium Modules / OSCE` | Simulation-center branching + charting |
| `Premium Modules / Hub` | Learner hub mobile rail — **Continue ECG / Labs / OSCE** |

## Key frames & node IDs

| Frame name | Node ID | Theme / breakpoint | Notes |
|------------|---------|--------------------|-------|
| `ecg-midnight-desktop-waveform` | `3:2` | Midnight · Desktop | Hub context strip, waveform card (telemetry grid copy), synthetic Lead II trace, multi-hue badges (perfusion / QTc / axis), progression map list |
| `labs-ocean-desktop-critical` | `7:2` | Ocean · Desktop | Hub strip, **grouped systems** cards (Renal / Heme), **critical K+ 5.9** styling, interpretation line primary |
| `osce-branching-tablet` | `9:2` | Neutral light · Tablet (834×1040) | Evolving vitals chips, branching options, SBAR charting panel |
| `hub-integrated-rail-ocean-mobile` | `11:2` | Ocean · Mobile (390×844) | **Not separate app chrome** — header + vertical **Continue** rail with three premium cards (semantic stroke accents) |

## Exported PNGs (this folder)

Absolute paths:

- `/root/nursenest-core/reports/figma-premium-modules-ecg-labs-osce/ecg-midnight-desktop-waveform.png`
- `/root/nursenest-core/reports/figma-premium-modules-ecg-labs-osce/labs-ocean-desktop-critical.png`
- `/root/nursenest-core/reports/figma-premium-modules-ecg-labs-osce/osce-branching-tablet.png`
- `/root/nursenest-core/reports/figma-premium-modules-ecg-labs-osce/hub-integrated-rail-ocean-mobile.png`

(Captured via Figma MCP `get_screenshot` at `maxDimension` 2048 for desktop/tablet-sized frames.)

## Cross-module design notes

- **Unified card primitive:** Shared radius (~14px), light drop shadow on Ocean, stroke + fill stack on dark ECG; **multi-hue** status (teal brand stroke, green/sky/amber chips) — aligned with `.cursor/rules/semantic-color-guardrails.mdc` spirit (avoid single-hue dashboards).
- **Ocean = canonical structure:** Auto-layout vertical stacks + horizontal splits; **Blossom / Midnight** in implementation = duplicate these frames (or bind variables) with **same layout tree**, swapping only surface fills, text contrast, and glow/shadow tokens.
- **Hub integration:** Shown explicitly on ECG + Labs headers and on the **Hub** mobile page rail — learners always see RN/PN hub context and “Continue …” next steps.
- **Copy:** Plausible vitals, labs, and SBAR strings — no lorem ipsum.

## Module bullets

### ECG
- Dark workstation canvas, telemetry-style waveform panel, rhythm metadata row, **progression map** column for mastery pathing.

### Labs
- **Interpretation-first:** “Why it matters” copy on each row; critical value row uses danger-tinted surface; secondary note calls out ranges as **drawer/secondary** (not spreadsheet-first).

### OSCE / Scenarios
- **Simulation-center** chrome: dense vitals strip, **branching** choices, **charting** column for SBAR documentation; tablet aspect for touch-first station flow.

## Follow-ups (optional in Figma)

- Duplicate the four frames for **Blossom** and **Midnight** token passes (Labs/OSCE light shells → Midnight inverted surfaces) without changing auto-layout structure.
- Add `ecg-ocean-desktop` / `labs-*-tablet` / `osce-mobile` frames mirroring the same components for a full responsive matrix.

