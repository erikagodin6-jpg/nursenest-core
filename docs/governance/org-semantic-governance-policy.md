# Organization-Level Semantic Governance Policy

This policy promotes educational navigation and graph OS governance from repository-local checks to **organization-enforced** release controls.

## Required branch protection checks

Configure these as **required status checks** on `main` (and release branches):

| Check | Workflow / command | Blocks merge on |
|-------|-------------------|-----------------|
| Semantic navigation gate (static) | `qa:semantic-navigation-gate:static` | Ontology conflicts, shadow authorities, hydration divergence, telemetry lineage failure, canonical mismatch, duplicate `BreadcrumbList`, orphaned graph routes, unresolved remediation pathways |
| Breadcrumb governance scan | `release-governance-breadcrumbs.yml` | Parallel breadcrumb registries, ungoverned learner trails |
| RN coaching governance | `audit:rn-coaching-governance` | Independent graph synthesis in tutoring, psychometric-unsafe copy |
| Build verify | `verify-build.yml` | Typecheck / unit regressions |

## Governance dashboards (CI artifacts)

The semantic navigation release gate writes `test-results/semantic-navigation-gate/semantic-governance-status.json` with:

- `semanticCoverageScore`
- `ontologyConflictCount`
- `hydrationParityFailures`
- `telemetryLineageViolations`
- `graphContinuityInterruptions`

Source: `reportSemanticGovernanceStatus()` in `semantic-governance-status-reporter.ts`.

## Authoritative architecture

All semantic navigation must follow:

```
resolveEducationalCognitionContext()
  → resolveUnifiedEducationalSubstrate()
  → orchestrateEducationalGraph()
  → governed telemetry lineage
  → thin presentation adapters only
```

## Prohibited regressions

CI must fail when introducing:

- New parallel navigation registries or ontology mappers
- Route-local breadcrumb/glossary builders bypassing `orchestrateBreadcrumbGraph`
- Non-governed adaptive ranking (`buildDashboardCards` without substrate `graphActions`)
- Tutoring surfaces that synthesize graph context outside `composeTutoringPromptFromGraphSteps`
- SEO-only breadcrumb lineage without psychometric stamps on graph-aware surfaces

## Educator data boundary

Educator graph intelligence (`educator-graph-analytics.ts`, `educator-graph-insights.ts`) must:

- Aggregate metrics only
- Never expose raw learner cognition envelopes
- Never expose psychometric internals directly

## Runtime resilience

Ontology failures must **degrade safely** (tiers: healthy, degraded, conflicting, orphaned, replay-divergent) and preserve recoverable graph continuity without crashing learner adapters.
