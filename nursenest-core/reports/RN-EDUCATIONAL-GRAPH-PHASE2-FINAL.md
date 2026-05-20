# RN Educational Graph — Phase 2 Consolidation (FINAL)

**Date:** 2026-05-20  
**Scope:** Traversal unification, governance enforcement, rex-pn route sweep (P0/P1)

## Executive summary

Phase 2 consolidates remaining parallel remediation authorities onto `orchestrateEducationalGraph()` in `src/lib/educational-graph/`. This pass migrates remediation-planner-v3, remediation-navigation, and unified remediation traversal to the same authority with surface caps preserved.

## P0 deliverables

### 1. remediation-planner-v3
- Direct `orchestrateEducationalGraph()` + `graphStepsToCoachingRecommendations`
- `maxGraphStepsForSurface()` + fatigue caps
- File: `src/lib/learner/rn-coaching-intelligence/remediation-planner-v3.ts`

### 2. remediation-navigation
- `orchestrateEducationalGraph()` + `toRemediationNavSteps()`
- File: `src/lib/breadcrumbs/remediation-navigation.ts`

### 3. remediation-traversal
- Single authority via planner (`source: "orchestrator"`)
- File: `src/lib/learner/rn-coaching-intelligence/remediation-traversal.ts`

### 4. Surface caps
- `graph-surface-caps.ts`: marketing 3/1, dashboard 5, study_plan 8, ai_tutor 10

### 5. CI audits (npm)
- audit:remediation-traversal
- audit:route-canonicalization
- audit:parallel-traversal-builders
- audit:educational-graph

### 6. rex-pn
- Canonical: `/canada/pn/rex-pn`
- Blog seeds and audit scripts updated; redirect routes allowlisted

## Verification

```bash
cd nursenest-core
npm run audit:remediation-traversal
npm run audit:route-canonicalization
npm run audit:parallel-traversal-builders
node --import tsx --test src/lib/educational-graph/educational-graph-orchestrator.contract.test.ts
```

## Remaining debt (P1/P2)

- Enum alignment (EducationalIntent / learnerStateReason)
- Glossary expansion toward 200+ (~36 today per audit)
- Reasoning chains: prioritization, delegation, SATA (P2)
- DO runtime DATABASE_URL deploy fix (independent)
