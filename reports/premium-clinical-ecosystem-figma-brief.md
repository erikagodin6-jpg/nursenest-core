# Figma brief — cohesive premium clinical ecosystem

**Date:** 2026-05-09  
**Aligns with:** `.cursor/rules/ecosystem-platform-guardrails.mdc`, `docs/ecosystem-design-system-convergence.md`, `docs/planning/subscription-clinical-readiness-ecosystem.md`

## Non-negotiables

- NurseNest logo + wordmark; **DM Sans** only.
- One navigation grammar — no forked ECG/OSCE/sim nav.
- Shells: `nn-learner-page-hero`, semantic surfaces, shared cards.
- Tokens only (`semantic-status-tokens.css`); no hot pink, muddy gradients, serif, enterprise-gray slabs.
- Themes (Aurora/Ocean/Garden/Midnight): **expression only** — not layout/typography/nav.

## Frame list (minimum)

1. Homepage — readiness band: Labs, Med calc, OSCE, ECG, case sims, New Grad; **Advanced ECG** = upgrade / coming soon (not core bundle).
2. Lesson hub examples — RN + NP placement without grid clutter.
3. Labs hub + lesson + lab–ECG correlation strip.
4. Med calc hub + step workspace.
5. OSCE hub + station + choice rail (`ScenarioStudyShell`).
6. ECG — core workstation; Advanced — **same shell**, upgrade badge.
7. Dashboard/report card — quick links + med calc inset + future labs/OSCE insets + adaptive.
8. CAT/practice + flashcard shells — linked remediation.
9. Adaptive case — timeline + vitals/labs/ECG dock.
10. Mobile 390px — hubs + report card + OSCE.
11. Themes ×4 — duplicate frames; swap glow/tint only.

## Advanced ECG

Separate future paid product — visually aligned but **not** bundled with standard plans in copy; entitlement future-proofing per `ecg-module-config` / integration doc.

## Handoff

PNG/WebP exports; annotate **CSS variables**, not hex.

**Inventory snapshot:** `reports/premium-clinical-ecosystem-inventory.md`
