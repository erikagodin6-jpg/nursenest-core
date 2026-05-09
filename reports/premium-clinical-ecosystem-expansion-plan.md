# Expansion plan — 50+ meaningful items & ecosystem readiness

**Date:** 2026-05-09  
**Basis:** `premium-clinical-ecosystem-inventory.md`

## Lab Values

- Add lessons/content until **≥50** distinct assessment experiences OR document lesson+Q combined metric.
- Current: 7 lessons, 42 Q — expand lessons + question banks.

## Medication dosage

- Q/FC already **50** — maintain parity when adding lessons; extend **MedCalcTrack** for allied if product requires.

## OSCE

- Author published stations (target **50** interactions definition from product) OR fewer stations with measured interaction depth.
- Add report-card inset after persistence.

## ECG

- Populate `EcgVideoQuestion`; audit counts with DB; gate Advanced SKU separately.

## Adaptive cases

- Ship graph runtime + content (`adaptive-case-study-ecosystem.md`); retire marketing-only JSON as sole “case product.”

## CAT / practice / lessons

- `audit-exam-question-bank.ts` with production DB.

## Priority order

1. DB-backed inventory audit (ECG, OSCE, exam bank).  
2. Labs + OSCE content expansion.  
3. Branching case MVP.  
4. Report-card + adaptive topic wiring.

## QA / entitlement

- No public exposure of premium content without entitlement checks.
- Advanced ECG messaging matches separate SKU.

*Roadmap only — no code changes in this task.*
