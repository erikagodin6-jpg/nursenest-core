# Clinical measurement intelligence — third-pass architecture audit

**Date:** 2026-05-20  
**Scope:** `nursenest-core/src/lib/measurements/` and measurement-consuming learner surfaces  
**Objective:** Evolve canonical measurement governance into a unified RN clinical interpretation and educational cognition layer.

---

## Executive summary

The measurement stack now has **persisted third-pass modules** on disk: V2 token grammar (including multi-point trends), bedside interpretation engine, trend intelligence V2, educational semantics expansion, competency semantic linkage, AI tutoring governance, coaching bridge, consumer registry, and CI audit scripts.

**Governed today:** lessons, CAT/practice runners, flashcards, SEO programmatic lessons (token resolution + pathway instructional metadata).  
**Partial / debt:** LOFT cases, labs hub, med-cal, AI tutors (guardrails defined, not universally wired), PDF/print, interpretation UI panels in product chrome.

**Verification:** `npm run test:measurement-architecture` (27 tests) and `npm run audit:measurement-intelligence`.

---

## 1. Full measurement intelligence audit

| Surface | Status | Tokens | Pathway context | Interpretation engine | AI governance |
|--------|--------|--------|-----------------|----------------------|---------------|
| Lesson bodies (SSR) | Governed | V1 + V2 | Yes | Optional hook | N/A |
| NCLEX CAT runner | Governed | V1 + V2 | Yes | No | No |
| Practice / question bank | Governed | V1 + V2 | Yes | No | No |
| Flashcards | Governed | V1 + V2 | Yes | No | No |
| LOFT / cases | Partial | No | No | No | No |
| Post-exam coaching | Partial | No | Yes | Bridge available | **sanitizeCoachingNarrative** |
| RN coaching v3 | Partial | Topic tags only | Yes | Via `measurement-coaching-bridge` | Not auto-wired |
| Labs / med-cal | Partial | Toggle only | Weak | Engine ready | N/A |
| AI tutors (scattered) | Partial | — | — | — | `validateAiMeasurementCopy` at boundary |
| PDF / print | Ungoverned | — | — | — | — |
| Telemetry | Governed | — | Yes | Event types expanded | `measurement_ai_semantic_flag` |

**Verified invariants**

- No double conversion on unknown legacy `{{tokens}}` (left unchanged).
- High-risk categories (`drug_dosage`, `abg`, `hemodynamics`, `pediatric_dosing`) block dual equivalents and cross-system rewrite.
- Instructional system remains pathway-native when learner toggles display units.
- V2 comma/chained trends resolve through `TOKEN_V2_RE` + `parseMeasurementTokenV2` (fixed wiring in `measurement-token-governance.ts`).

---

## 2. RN clinical interpretation engine

**Module:** `measurement-interpretation-engine.ts`

**Domains:** electrolyte, acid-base, renal, sepsis, glucose, hemodynamic, oxygenation, pharmacology monitoring.

**Panel outputs:** prioritization, escalation, intervention implications, monitoring, delegation, instability signals, educational semantics, competency links, optional trend summary.

**Example chain (hyperkalemia):**  
`[[potassium:6.2:mmol/L|critical]]` → interpretation domain `electrolyte` → abnormality `critical` → competency keys (`hyperkalemia`, `ecg_interpretation`, …) → interpretation guides (`electrolyte-interpretation`, `ecg-interpretation`).

---

## 3. Trend intelligence V2

**Module:** `measurement-trend-intelligence.ts`

**Token grammar (authoring):**

- Two-point: `[[potassium:5.2>6.1:mmol/L|trend]]`
- Multi-point: `[[potassium:4.8,5.2,6.1:mmol/L|trend]]` or `[[potassium:4.8>5.2>6.1:mmol/L|trend]]`

**Trajectories:** stable, improving, worsening, volatile, acute_change.

**Outputs:** priority score (0–100), escalation/monitoring/coaching cues for remediation ordering.

**Roadmap:** author multi-point trends in lesson remediation copy; surface compact trend sparkline in learner UI (Figma-first).

---

## 4. Competency graph integration

**Module:** `measurement-semantic-layer.ts`

Links `ClinicalMeasurement` entities to:

- RN coaching topic keys (`competencyTopicKeys`)
- `clinical-interpretation-registry` guide IDs
- Glossary keys
- `remediationPriority` score

**Integration plan:** call `deriveMeasurementCoachingSignals()` from `remediation-planner-v3` when weak-area labels match electrolyte/glucose/ABG topics; pass `trendValuesSi` from session analytics.

---

## 5. Remediation + coaching integration

**Module:** `measurement-coaching-bridge.ts`

**Weakness patterns:** interpretation_failure, critical_lab_hesitation, trend_recognition, unsafe_prioritization, monitoring_omission.

**Wired:** `sanitizeCoachingNarrative` in `post-exam-coaching/coaching-semantics.ts` runs `validateAiMeasurementCopy` and replaces blocking AI copy with safe remediation language.

**Next:** orchestrator should emit `measurement_remediation_signal` analytics when bridge fires.

---

## 6. AI + tutoring governance V2

**Module:** `measurement-ai-governance.ts`

- `measurementAiPromptGuardrail` for system prompts
- `validateAiMeasurementCopy` / `assertAiMeasurementCopySafe`
- Blocks: unsafe dual equivalency, invented conversions, high-risk rewrites, unsupported trend claims without tokens

**Recommendations:** attach guardrail string to all lab-tutor and rationale-generation prompts; log `measurement_ai_semantic_flag` when warnings (non-block) fire.

---

## 7. High-risk safety governance

**Module:** `measurement-safety-governance.ts` (expanded annotations: insulin, vasopressor, infusion, heparin, anticoagulation, ventilator)

| Tier | Behavior |
|------|----------|
| `blocked_conversion` | No dual display, no cross-system rewrite |
| `elevated` | Conversion allowed with cognitive anchoring warning |
| `standard` | Dual equivalent permitted when pedagogically safe |

---

## 8. Educational semantics expansion

**Module:** `measurement-educational-semantics.ts`

Added: `remediationPriorityScore`, `cognitiveComplexity`, `monitoringBurden`, `reassessmentTimingMinutes`, `instabilitySeverity`, sodium/creatinine bands.

---

## 9. UI/UX interpretation experience

**Recommendations (Figma-first before chrome changes):**

- Compact dual rendering: primary value + muted `(≈ …)` only when `allowDualEquivalent`
- Trend chip: trajectory label + severity hue from semantic tokens
- Escalation callout: single line, not tooltip stack
- Matrix/table: pre-resolve tokens server-side; avoid client-only re-parse on hydration

**Anti-patterns:** tooltip overload, duplicate unit strings, neon severity without semantic tokens.

---

## 10. Lesson + exam integration

V2 tokens work in `resolveMeasurementTokens` via `resolveCanonicalTokensWithProvenance`. **Adoption debt:** authored content still mostly `{{legacy}}` and scalar `[[glucose:…]]`; trend tokens need content pipeline adoption.

**SSR:** lesson bodies already SSR-resolve tokens. **Hydration:** exam runners client-resolve — keep instructional/rendered systems stable across toggle to avoid mismatch flashes.

---

## 11. Telemetry + observability

**Module:** `measurement-analytics.ts` — new events:

- `measurement_trend_engagement`
- `measurement_interpretation_difficulty`
- `measurement_unsafe_render_detected`
- `measurement_ai_semantic_flag`
- `measurement_remediation_signal`

**Debt:** instrument UI surfaces (labs interpretation open, hint views, conversion friction).

---

## 12. Structured-data + semantic layer

Entity kinds: `LabValue`, `VitalSign`, `ClinicalMeasurement`, `MedicalEntity`, `DrugMonitoring`, `InterpretationGuide`.

**Roadmap:** JSON-LD on published interpretation hubs referencing governed measurement entities; glossary bidirectional links.

---

## 13. Static analysis + CI governance

| Command | Purpose |
|---------|---------|
| `npm run test:measurement-architecture` | Pathway policy, conversions, V2 trends, interpretation, AI blocks, registry |
| `npm run audit:measurement-intelligence` | Module presence, registry snapshot, forbidden shortcut scan |

**Future:** ESLint custom rule for raw `mg/dL = mmol/L` in TSX strings; hydration snapshot tests for lesson SSR vs client toggle.

---

## 14. Future architecture

Prepared hooks for: conversational AI tutoring (guardrails + tokens), adaptive remediation (bridge + priority scores), educator dashboards (governance registry metrics), cohort analytics (trend engagement), bedside simulation labs (LOFT + interpretation panels), semantic search (entity IDs), competency forecasting (longitudinal trend series).

---

## 15. Technical debt inventory

| ID | Item | Priority |
|----|------|----------|
| M1 | Wire LOFT/case copy through `resolveMeasurementTokens` | P1 |
| M2 | Labs hub: `buildInterpretationPanel` in drill UI | P1 |
| M3 | Universal AI tutor boundary: `validateAiMeasurementCopy` | P1 |
| M4 | PDF/print pre-render governed HTML | P2 |
| M5 | Author V2 trend tokens in lesson/remediation content | P2 |
| M6 | `remediation-planner-v3` ← `deriveMeasurementCoachingSignals` | P2 |
| M7 | Client analytics instrumentation for new events | P2 |
| M8 | Interpretation panel learner component (compact) | P2 |
| M9 | Fix potassium `kind` when generic `mmol/L` spec used (governance override applied) | Done |
| M10 | Potassium token kind in multi-point parse (verify content) | P3 |

---

## File map (third-pass modules)

```
src/lib/measurements/
  measurement-token-v2.ts
  render-measurement-token-v2.ts
  measurement-trend-intelligence.ts
  measurement-interpretation-engine.ts
  measurement-semantic-layer.ts
  measurement-ai-governance.ts
  measurement-coaching-bridge.ts
  measurement-governance-registry.ts
  measurement-educational-semantics.ts (expanded)
  measurement-clinical-reasoning.ts
  measurement-safety-governance.ts
  measurement-token-governance.ts (V2 resolve wired)
scripts/audit-measurement-intelligence.mjs
```

---

## Related docs

- `docs/cnple-psychometric-integrity-audit-THIRD-PASS.md` (separate track: LOFT vs CAT psychometrics)
- `.cursor/rules/ecosystem-platform-guardrails.mdc` (Labs / ECG integration)
- `docs/planning/lab-values-educational-depth.md`
