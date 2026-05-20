# Breadcrumb governance expansion — 2026-05-20

## Executive summary

Breadcrumbs are now a **governed semantic ontology layer**: surface classification drives intent, canonical roots constrain labels/hrefs, depth and schema ownership are CI-enforced, telemetry is normalized, and educational graph traversal shares competency/topic authority with trails.

## Deliverables

| Area | Module(s) |
|------|-----------|
| Type-safe surfaces | `breadcrumb-surface.ts` |
| Canonical roots | `breadcrumb-root-registry.ts` |
| Schema governance | `breadcrumb-schema-governance.ts`, `structured-data-governance.ts` |
| Depth ceilings | `breadcrumb-depth-governance.ts` |
| Href builder | `canonical-breadcrumb-href-builder.ts` |
| Governed resolution | `governed-breadcrumb-resolution.ts` |
| Graph bridge | `breadcrumb-graph-bridge.ts`, `breadcrumb-graph-convergence.ts` |
| Telemetry | `breadcrumb-telemetry.ts` |
| Glossary | `glossary-breadcrumbs.ts`, `/nursing-glossary` pages |
| CI | `npm run qa:breadcrumb-governance` |

## Intent governance (P0)

- **Callers must not pass `intent`** — removed from lesson detail, learner lesson, and tests.
- `resolveSurfaceFromResolverKind()` / `resolveSurfaceFromLearnerKind()` → `intentForSurface()`.
- `BreadcrumbResolution` carries `surface`, `breadcrumbDepth`, `canonicalRoot`, `schemaOwner`, `ontologyClassification`.

## Canonical root registry (P0)

Roots: Home, Lessons, ECG Interpretation (`/ecg`), Clinical Modules, Glossary, Case studies, Pharmacology, Med-Surg, Pediatrics, Critical Care, Clinical Interpretation.

Forbidden ECG aliases: ECG Academy, Heart Rhythms, Clinical ECG, etc.

## Schema ownership (P0)

- `assertSingleBreadcrumbOwner()` — duplicate layout/page, learner schema, orphan trails, forbidden aliases.
- Layout fallback emits `breadcrumb_fallback_used` telemetry only when active.

## Depth governance

| Intent | Max crumbs |
|--------|------------|
| discovery | 4 |
| education | 5 |
| learner | 3 |
| seo | 3 |

## Educational graph integration

- `breadcrumbResolutionFromEducationalGraph()` shares topic/competency IDs with `orchestrateBreadcrumbGraph()`.
- Remediation ladders remain in `breadcrumb-graph-convergence.ts` (no parallel hierarchy).

## Glossary

- Hub: `nursing-glossary-hub` → Home → Glossary
- Term: `nursing-glossary-term` → Home → {Exam} → Glossary → {Term} + competency linkage

## Verification

```bash
cd nursenest-core && npm run qa:breadcrumb-governance
npx playwright test tests/e2e/seo/breadcrumb-intent.spec.ts --project=chromium
```

## Remaining semantic debt

| Item | Tier | Notes |
|------|------|-------|
| Discovery pathway overview/geo crumbs | partial | By design for acquisition; not education-first |
| `/app` ad-hoc trails (labs hub, coach) | partial | Use `resolveLearnerBreadcrumbResolution` everywhere |
| Pathway-specific `/…/glossary` routes | future | Registry + `glossary-index` ready |
| Client `breadcrumb_clicked` wiring | future | `BreadcrumbTrail` supports `onCrumbClick` |
| Strict CI throw on all marketing pages | future | Extend contract tests beyond ECG cluster |
