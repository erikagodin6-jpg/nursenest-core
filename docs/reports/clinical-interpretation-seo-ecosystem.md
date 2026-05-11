# Clinical Interpretation SEO + Learning Ecosystem

This document defines the **Figma-first**, premium-forward roadmap for NurseNest clinical interpretation: authoritative nursing hubs, rigorous education, adaptive funneling into lessons, CAT, flashcards, and scenarios, and a **free SEO acquisition + premium mastery** hybrid.

**Implementation gate:** Public marketing routes and interactive panels ship **after** Figma approval, mobile UX validation, theme parity (Ocean / Blossom / Midnight), and free-vs-premium hierarchy review — see `docs/governance/figma-premium-ui-mandatory-process.md` and `.cursor/rules/ecosystem-platform-guardrails.mdc`.

---

## 1. Interpretation inventory (registry)

Authoritative data: `nursenest-core/src/lib/clinical-interpretation/clinical-interpretation-registry.ts`

| ID | Planned canonical path |
|----|------------------------|
| `abg-interpretation` | `/clinical-interpretation/abg-interpretation` |
| `ecg-interpretation` | `/clinical-interpretation/ecg-interpretation` |
| `chest-xray-interpretation` | `/clinical-interpretation/chest-x-ray-interpretation-for-nurses` |
| `lab-values-explained` | `/clinical-interpretation/lab-values-explained` |
| `critical-lab-values-nclex` | `/clinical-interpretation/critical-lab-values-nclex` |
| `electrolyte-interpretation` | `/clinical-interpretation/electrolyte-interpretation` |
| `fluid-overload-vs-dehydration` | `/clinical-interpretation/fluid-overload-vs-dehydration-assessment` |
| `sepsis-interpretation` | `/clinical-interpretation/sepsis-interpretation` |
| `hemodynamic-interpretation` | `/clinical-interpretation/hemodynamic-interpretation` |

**Hub:** `/clinical-interpretation`. Registry status is **`figma_pending`** until publish → **`noindex,follow`**.

---

## 2. Free vs premium (layered model)

| Layer | Role |
|-------|------|
| **Free** | SEO, authority, trust — frameworks, examples, visuals, FAQ, starter NCLEX-style items |
| **Premium** | Adaptive drills, progressive cases, telemetry/lab engines, CAT-linked tracks, remediation |

See registry `segmentation.freeHighlights` / `premiumHighlights`.

---

## 3. Figma deliverables (before public UI)

Frames for desktop, tablet, mobile; Ocean, Blossom, Midnight: hub, article template, interpretation panels, waveforms, ECG layouts, ABG trees, CXR overlays, lab trends, critical alerts, assessment workflows, NCLEX blocks, premium dashboards, sticky mobile tools, differential cards, fluid/sepsis/hemodynamic visuals, normal vs abnormal, locked sections, quiz blocks, related-lesson rails.

Record **Figma URL + node IDs** in PRs per `docs/governance/figma-premium-ui-mandatory-process.md`.

---

## 4. SEO + conversion

Distinct titles, descriptions, H1s, `targetQueries`; FAQ JSON-LD when reviewed (`schema.faqEligible`). Internal links to `/app/labs`, `/modules/ecg`, `/modules/lab-values`, practice, flashcards, scenarios, report card — via registry `related`.

---

## 5. Launch phases

- **P0:** Registry + unit tests + this report  
- **P1:** Approved Figma (all breakpoints + themes)  
- **P2:** Routes + metadata + breadcrumbs  
- **P3:** Premium gates + CTAs  
- **P4:** Playwright visual QA matrix  

---

## 6. Validation

```bash
cd nursenest-core
npm run typecheck
node --import tsx --test src/lib/clinical-interpretation/clinical-interpretation-registry.test.ts
```

---

## 7. Figma references (fill when designs exist)

| Asset | URL | Node ID |
|-------|-----|---------|
| Hub | _TBD_ | _TBD_ |
| Article + sticky mobile | _TBD_ | _TBD_ |

