# Figma post-completion summary — template (mandatory)

**Program / PR:** `[FILL: hub name, epic, or PR title + link]`  
**Author / date:** `[FILL: name, YYYY-MM-DD]`  
**Figma-first workflow:** This document is the required **post-ship** artifact after any hub or UI program that followed `docs/governance/figma-premium-ui-mandatory-process.md`.

---

## 1. Figma sign-off reference

| Item | Value |
|------|--------|
| **Figma file URL** | `[FILL: https://www.figma.com/design/...]` |
| **Key frames / node IDs used for sign-off** | `[FILL: e.g. page → section → frame; node-id from URL with "-" → ":" for API]` |
| **Branch / version (if applicable)** | `[FILL: branch key, named version, or "main file"]` |

---

## 2. Layout, hierarchy, and spacing vs premium homepage baseline

**Baseline:** Current premium marketing homepage and sibling hubs (convergence target).

`[FILL: Summary of layout and section order, visual hierarchy (what dominates vs secondary), spacing rhythm, grid/card density, and how this aligns with or intentionally diverges from the homepage baseline.]`

---

## 3. Theme variants validated

Document themes exercised in **Figma** and in the **implemented UI**.

| Theme | Light verified | Dark verified | Notes |
|-------|----------------|---------------|--------|
| Ocean (`data-theme` / equivalent) | ☐ / ✅ | ☐ / ✅ | `[FILL]` |
| Midnight | ☐ / ✅ | ☐ / ✅ | `[FILL]` |
| Blossom | ☐ / ✅ | ☐ / ✅ | `[FILL]` |

**Breakpoints / viewports:** `[FILL: e.g. desktop 1280+, tablet 768, mobile 390]`

---

## 4. Component mapping (Figma → code)

| Figma component / frame | Node ID (optional) | Code file(s) |
|-------------------------|-------------------|--------------|
| `[FILL]` | `[optional]` | `path/to/Component.tsx` |

_Add rows as needed._

---

## 5. Routes / pages visually updated

Exact paths:

- `[FILL: /en/..., /app/...]`

---

## 6. Screenshot index

Paths under `docs/screenshots/...` (or `nursenest-core/docs/screenshots/...` from monorepo root, per program convention):

| Path | Route / state | Viewport / theme |
|------|---------------|------------------|
| `docs/screenshots/[FILL]/….png` | `[FILL]` | `[FILL]` |

---

## 7. Implemented UI vs Figma

### Matches

`[FILL: bullets — areas implemented 1:1 with approved frames]`

### Intentional deltas (with rationale)

| Delta | Rationale | Approved by |
|-------|-----------|-------------|
| `[FILL]` | `[FILL]` | `[FILL: PM / design / eng]` |

---

## 8. Playwright / visual QA evidence

| Item | Pointer |
|------|---------|
| **Spec file(s)** | `[FILL: tests/e2e/….spec.ts]` |
| **Run command / CI** | `[FILL]` |
| **Report / PR** | `[FILL: reports/*-FINAL.md or PR link]` |
| **Evidence listing** | `[FILL: screenshot dir tree or paste ls]` |

---

## 9. Open design debt / follow-ups

`[FILL: deferred states, edge cases, a11y, motion, content, or Figma↔code drift to schedule]`

---

## Related

- `docs/governance/figma-premium-ui-mandatory-process.md`  
- `docs/governance/post-completion-delivery-checklist.md` (if used for the program)  
- Program: `reports/*-FINAL.md`, PR description  
