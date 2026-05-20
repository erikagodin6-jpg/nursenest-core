# Educational Navigation & Breadcrumb Governance (Second Pass)

This document is the deliverable for the second-pass expansion of the breadcrumb intent and educational navigation system.

## Primary goal

Transform breadcrumbs from a visual trail into a **governed educational navigation ontology** with:

- Explicit **intent** (discovery / education / learner / seo)
- **Education-first** pathway trails (no geo-depth pollution)
- **Schema ownership** (≤1 `BreadcrumbList` per indexable page)
- **Competency-graph** and **remediation** integration hooks
- **Learner-route** schema suppression (visible crumbs only)

---

## 1. Full breadcrumb + hierarchy audit

### Governed (resolver + `Breadcrumbs` / `BreadcrumbsFromResolution`)

| Surface | Module | Schema |
|---------|--------|--------|
| Pathway lessons (marketing) | `pathway-education-breadcrumbs.ts` | Yes (education) |
| Learner pathway lessons | `resolveBreadcrumbResolution({ kind: "learner-pathway-lesson" })` | **No** |
| ECG / labs / hemodynamics academies | `academy-breadcrumbs.ts` | Yes (education) |
| Blog, programmatic SEO, allied | `pathway-breadcrumbs.ts`, `programmatic-breadcrumbs.ts` | Yes |
| Case studies | `breadcrumb-resolver` | Yes |

### Partial

| Surface | Issue |
|---------|--------|
| Marketing layout fallback | `MarketingMainI18nShards` — blocked when `pageOwnsBreadcrumbSchema` |
| Legacy ECG inline `@graph` | Nested `BreadcrumbList` inside `Article` on some pages — migrate to resolver-only |
| Clinical interpretation | Builders ready; routes mostly `figma_pending` |
| Glossary | `glossary-breadcrumbs.ts` ready when public routes ship |

### Ungoverned

| Surface | Issue |
|---------|--------|
| Learner `/app/*` ad-hoc trails | Labs, practice tests, coach — inconsistent `BreadcrumbTrail` arrays |
| CAT / LOFT results | No shared remediation breadcrumb |
| Post-exam coaching | No navigation component |

### Verification checklist

- [x] Learner routes: `intent: "learner"` → empty `schemaItems`
- [x] Layout fallback suppressed on owned prefixes (`schema-ownership.ts`)
- [x] `OrganizationJsonLd` no longer emits duplicate fallback breadcrumb
- [ ] All ECG pages use `AcademyBreadcrumbBar` only (no nested duplicate `@graph`)
- [ ] All learner surfaces use `learner-navigation.ts` helpers

Registry: `auditNavigationGovernance()` in `navigation-governance-registry.ts`.

---

## 2. Educational navigation ontology

**Module:** `navigation-ontology.ts`

Layers: `site` → `pathway` → `academy` → `topic_cluster` → `competency` → `mechanism` → `lesson` → `interpretation` → `glossary` → `remediation` → `learner_session`.

**Good trail:**

`Home → NCLEX-RN → Lessons → Cardiovascular → Heart Failure → Loop Diuretics`

**Bad trail (geo pollution):**

`Home → Canada → RN → NCLEX → Medical → Topic → Page`

Use `validateEducationFirstTrail()` and `auditTopicClusterCrumbs()` before shipping new hubs.

---

## 3. Competency-graph navigation

**Module:** `competency-navigation.ts`

- `buildCompetencyNavigationFrame({ topicSlug })` → competency band + hierarchy nodes
- Wired to `rn-competency-ontology.ts` and `competency-graph-orchestration.ts`

**Future:** mastery-aware crumbs (“Step 2 of remediation ladder”) using `buildRemediationNavigationLadder()`.

---

## 4. Learner-state-aware navigation

**Module:** `learner-navigation.ts`

- `learnerStudyTrailCrumbs()` — study plan / weak areas
- `learnerRemediationTrailCrumbs()` — remediation continuity example

**Rule:** Never emit `BreadcrumbList` on `/app/*` (robots noindex + `intent: "learner"`).

Learner lesson detail already uses `resolveBreadcrumbResolution({ kind: "learner-pathway-lesson" })`.

---

## 5. Structured-data governance V2

**Module:** `structured-data-governance.ts`

Central ownership for: `BreadcrumbList`, `FAQPage`, `MedicalWebPage`, `DefinedTerm`, `Course`, `LearningResource`, `MedicalCondition`, `MedicalEntity`, `Organization`, `WebSite`, `Article`.

- `resolveSchemaOwnership(pathname, schemaType)`
- `detectDuplicateBreadcrumbSchema({ pageEmits, layoutEmits })`

**Policy:** Page-owned graphs win; layout emits org/website + breadcrumb fallback **only** when `shouldEmitMarketingLayoutBreadcrumbFallback()` is true.

---

## 6. Topic cluster governance

**Module:** `topic-cluster-governance.ts`

- Rejects geo-depth pollution and chains >6 crumbs
- Duplicate label detection

Pathway education builders already collapse geo into exam hub label (`pathway-education-breadcrumbs.ts`).

---

## 7. Remediation graph integration

**Module:** `remediation-navigation.ts`

- `buildRemediationNavigationLadder()` wraps `buildRnRemediationGraphSteps()`
- Surfaces mechanism → interpretation → drill ordering

Breadcrumbs should show **current study context**; full ladder belongs in study UI / coaching panels.

---

## 8. Academy + clinical module governance

**Module:** `academy-breadcrumbs.ts`

Canonical trails for ECG, advanced ECG, labs, clinical modules, hemodynamics.

**Migration status:** ECG hub (`/ecg`) uses `ecgHubBreadcrumbs()` via `AcademyBreadcrumbBar`. Remaining inline pages should migrate to `resolveBreadcrumbResolution({ kind: "ecg-*" | "labs-*" })`.

---

## 9. Glossary + reference layer

**Module:** `glossary-breadcrumbs.ts`

Example:

`Home → NCLEX-RN → Glossary → Electrolytes → Hyperkalemia`

**Module:** `clinical-interpretation-breadcrumbs.ts`

Example:

`Home → Clinical Interpretation → Acid–base & ABG → Respiratory Acidosis`

Resolver kinds: `clinical-interpretation-hub`, `clinical-interpretation-category`, `clinical-interpretation-guide`.

---

## 10. UI/UX recommendations

- Max **5** visible crumbs (`RECOMMENDED_MAX_VISIBLE_CRUMBS`)
- Use `min-h-9 mb-4` wrapper (`Breadcrumbs` default) for consistent spacing
- Mobile: truncate middle crumbs in UI layer (future); keep schema chain ≤5 items
- Do not show country + role + exam as three separate crumbs on lesson pages
- Semantic emphasis: current crumb = `aria-current="page"` (in `BreadcrumbTrail`)

---

## 11. Analytics + telemetry

**Module:** `navigation-analytics.ts`

Events: `breadcrumb_click`, `breadcrumb_trail_view`, `remediation_step_open`, `topic_cluster_nav`, `learner_trail_continue`, `interpretation_hub_open`, `breadcrumb_abandon`.

Payloads include `intent`, `pathname`, optional `competencyId` — **never** full JSON-LD graphs.

---

## 12. SEO + canonical governance

- Page-owned breadcrumbs must align with canonical URLs (`toAbsoluteSiteUrl` / `isValidPublicUrl`)
- Blog: category may appear in UI but omitted from schema (existing policy)
- Clinical interpretation: no sitemap until `status: "published"` in registry

---

## 13. Static analysis + CI

Tests (run via `scripts/seo-guardrails.mjs`):

- `breadcrumb-intent.test.ts`
- `schema-ownership.test.ts`
- `layout-fallback-policy.test.ts`
- `breadcrumb-governance.test.ts`

Checks: geo pollution, duplicate schema detection, learner suppression, interpretation/glossary builders, registry audit.

**Recommended CI additions:**

- AST/grep rule: no inline `"@type": "BreadcrumbList"` in page files that import `Breadcrumbs`
- Contract: indexable HTML contains ≤1 `BreadcrumbList` (e2e)

---

## 14. Future architecture

Prepared modules for:

- AI tutoring (trail labels in prompts, not schema)
- Semantic search (`EducationalHierarchyNode.slug`)
- Adaptive study plans (`learner-navigation.ts`)
- Educator dashboards (aggregate `trackNavigationEvent`)
- Competency forecasting (competency frame + analytics)
- Bedside simulation labs (academy + interpretation hierarchies)

---

## P0 completion (May 2026)

### ECG migration report

- All ECG/academy marketing `page.tsx` files under `ecg`, `advanced-ecg-nursing`, and standalone ECG hubs use `AcademyBreadcrumbBar` + `ClinicalAcademyJsonLdGraph` (no nested `BreadcrumbList` in `@graph`).
- `MarketingFallbackBreadcrumbJsonLd` gated by `shouldEmitMarketingLayoutBreadcrumbFallback()`.
- Contract: `ecg-academy-governance.contract.test.ts`; static scan: `scripts/breadcrumb-governance-scan.mjs`.

### Learner trail standardization report

- **0** remaining `<BreadcrumbTrail` usages under `src/app/(student)/app/(learner)`.
- All trails via `LearnerBreadcrumbTrail` + `resolveLearnerBreadcrumbCrumbs()` (`learner-breadcrumb-resolver.ts`).
- Learner lesson detail fixed to pass `resolution` (not raw crumbs array).
- Analytics: `AnalyticsBreadcrumbTrail` fires `trackNavigationEvent` on crumb clicks.

### Updated governance audit

| Tier | Count | Notes |
|------|-------|-------|
| Governed | +1 learner-app surface | Was ungoverned ad-hoc |
| Partial | clinical-interpretation, glossary | Now wired to resolver on shipped pages |
| Ungoverned | — | Post-exam coaching now uses `PostExamRemediationBreadcrumb` on reports |

### CI expansion

`seo-guardrails.mjs` now runs: `breadcrumb-governance-scan.mjs`, `breadcrumb-governance.test.ts`, `ecg-academy-governance.contract.test.ts`.

---

## Graph + breadcrumb convergence (May 2026)

- **`breadcrumb-graph-convergence.ts`** — `orchestrateBreadcrumbGraph()`, `learnerWeakAreaCrumbsFromGraph()`, `remediationPathwayId()`
- **`remediation-navigation.ts`** — delegates to graph orchestration (same authority as `buildRnRemediationGraphSteps`)
- **`breadcrumb-semantic-integration.ts`** — glossary + interpretation linkage audits
- **`breadcrumb-root-registry.ts`** — canonical roots including `clinical_interpretation`
- **Post-exam:** `PostExamRemediationBreadcrumb` on performance reports when weak topics exist
- **Focus areas:** dynamic `focus-areas` kind with live weak-topic slug from performance data

## E2E schema contract

- `breadcrumb-schema-e2e.contract.test.ts` — learner pages: 0 inline `BreadcrumbList`; academy pages: no nested graph breadcrumbs
- `structured-data-governance.contract.test.ts` — duplicate/forbidden schema rules

## Analytics expansion

Events: `breadcrumb_rendered`, `breadcrumb_click`, `remediation_ladder_opened`, `interpretation_path_opened`, `glossary_navigation_opened`

Payloads: `breadcrumbIntent`, `breadcrumbSurface`, `competencyId`, `remediationPathwayId`, `canonicalRoot`, `learnerStateReason`, `graphDepth`, `sourceSurface`

Marketing: pass `pathname` to `BreadcrumbsFromResolution` / `AcademyBreadcrumbBar` (ECG hub, clinical interpretation hub + guides, nursing glossary hub + terms).

---

## Semantic authority guarantees (graph OS final pass)

**Resolution flow (mandatory):**

```txt
normalizeEducationalPathname()
  → resolveBreadcrumbResolution() | resolveLearnerBreadcrumbResolution()
  → orchestrateBreadcrumbGraph() (when competency/remediation context exists)
  → BreadcrumbsFromResolution | LearnerBreadcrumbTrail
```

No route may invent hierarchy outside this chain.

| Module | Role |
|--------|------|
| `governance/seo-surface-breadcrumb-governance.ts` | Programmatic SEO, pathway overview, exam cluster, authority surfaces |
| `governance/semantic-telemetry-lineage.ts` | Graph-versioned telemetry payloads |
| `governance/runtime-semantic-integrity.ts` | Shadow-authority + namespace tiers |
| `governance/semantic-route-coverage.ts` | Nightly coverage score + shadow inventory |
| `app-shell-breadcrumb-adapter.ts` | Retired `appShellBreadcrumbs` → learner resolver |
| `layout-fallback-diagnostics.ts` | Fallback lineage snapshots + strict flags |

### Residual authority retirement

- `appShellBreadcrumbs` delegates to `resolveLearnerBreadcrumbCrumbs()` (grandfathered definition only in `breadcrumb-resolver.ts` + adapter).
- CI: `residual-authority-governance.contract.test.ts` — learner tree + critical SEO shells.
- Static scan: `breadcrumb-governance-scan.mjs` flags `shadow_seo_trail_critical` on programmatic/exam/authority components.

### SEO surface governance

All critical SEO shells (`programmatic-seo-page`, `exam-cluster-hub-page`, `exam-pathway-hub`, `authority-cluster-page`) use `BreadcrumbsFromResolution` with governed resolutions.

### Runtime semantic integrity

Tiers: `healthy` | `degraded` | `conflicting` | `orphaned` | `shadow-authority-detected`

Strict env flags: `NN_SEMANTIC_AUTHORITY_STRICT`, `NN_BREADCRUMB_STRICT_FALLBACK`, `NN_QA_BREADCRUMB_STRICT`

### Semantic telemetry lineage

`breadcrumb-telemetry.ts` enriches every event with: `normalizedPathname`, `semanticRouteKind`, `ontologyNamespace`, `graphVersion`, `educationalIntent`, `cognitionReliabilityTier`.

### Client hydration and navigation integrity

E2E: `tests/e2e/seo/breadcrumb-intent.spec.ts` — glossary term, ECG alias rejection, layout fallback schema safety.

### Shadow authority detection

`computeSemanticRouteCoverage()` emits `shadowAuthorityCount`, `unresolvedCanonicalCount`, `orphanedNodeCount`. CI contract asserts report shape; scan fails on critical SEO regressions.

**Run:** `npm run qa:breadcrumb-governance` (unit + contracts), `npm run audit:educational-graph` (includes coverage report when wired).

---

## Third pass deliverables (orchestration completion)

### 1. Breadcrumb / graph convergence report

| Authority | Role |
|-----------|------|
| `orchestrateEducationalGraph()` | Single remediation + competency traversal |
| `orchestrateBreadcrumbGraph()` | Breadcrumb-specific projection of graph steps |
| `remediation-navigation.ts` | Ladders + pathway IDs — no parallel `buildRnRemediationGraphSteps`-only paths |
| `learnerWeakAreaCrumbsFromGraph()` | Weak-area + focus-area trails share graph ontology |

**Invariant:** competency IDs, topic slugs, canonical hrefs, and `remediationPathwayId` derive from one orchestration pass — breadcrumbs cannot diverge from remediation CTAs on the same surface.

### 2. E2E schema contract audit

| Check | Enforcement |
|-------|-------------|
| ≤1 `BreadcrumbList` per indexable page | `structured-data-governance.ts` + contract tests |
| 0 `BreadcrumbList` on `/app/*` learner routes | `breadcrumb-schema-e2e.contract.test.ts` |
| No nested academy graph crumbs | ECG/academy contract + `breadcrumb-governance-scan.mjs` |
| Layout fallback suppressed on owned routes | `schema-ownership.ts` + e2e contract |

**CI:** `seo-guardrails.mjs` runs `breadcrumb-schema-e2e.contract.test.ts` and `structured-data-governance.contract.test.ts` (46 breadcrumb tests passing).

### 3. Remediation ladder governance summary

- `learnerRemediationLadderCrumbs()` → graph-backed, max depth capped in resolver
- `PostExamRemediationBreadcrumb` on adaptive performance reports when `persistentWeakTopics[0]` exists
- `buildRemediationNavigationLadder()` returns `competencyId` + `remediationPathwayId` for analytics
- Scan blocks duplicate remediation ladders and traversal divergence in page sources

### 4. Ontology hardening report

**`breadcrumb-root-registry.ts`** — every root defines `rootId`, `canonicalLabel`, `href`, `ontologyClassification`, `schemaOwner`, `telemetryNamespace`, `educationalIntent`.

Canonical roots: NCLEX-RN, Lessons, ECG, Clinical Modules, Glossary, Interpretation, Case Studies, Pharmacology, Med-Surg, Pediatrics, Critical Care (+ `clinical_interpretation`).

CI scan flags: duplicate root IDs, href drift, alternate educational roots.

### 5. Analytics expansion summary

| Event | When |
|-------|------|
| `breadcrumb_rendered` | Trail mount (learner + marketing) |
| `breadcrumb_clicked` | Crumb click |
| `remediation_ladder_opened` | Remediation ladder surfaces |
| `interpretation_path_opened` | Clinical interpretation crumbs |
| `glossary_navigation_opened` | Glossary hub/term crumbs |

Payloads include `breadcrumbIntent`, `breadcrumbSurface`, `competencyId`, `remediationPathwayId`, `canonicalRoot`, `learnerStateReason`, `graphDepth`, `sourceSurface`, plus `pathname` on wired marketing routes.

### 6. Glossary + interpretation integration audit

| Surface | Resolver kind | Graph linkage |
|---------|---------------|---------------|
| `/nursing-glossary` | `nursing-glossary-hub` | `breadcrumb-semantic-integration.ts` audits orphan terms |
| `/nursing-glossary/[term]` | `nursing-glossary-term` / `glossary-term` | Topic slug → competency frame |
| `/clinical-interpretation` | hub resolution | No duplicate FAQ/Breadcrumb conflicts |
| Guide pages | `clinical-interpretation-guide` | Recursion + hierarchy audits in semantic integration module |

### 7. Structured-data governance expansion

`auditPageStructuredDataEmissions()` validates: BreadcrumbList uniqueness, FAQPage/LearningResource/MedicalWebPage conflicts, forbidden learner schema on `/app/*`, nested graph duplication.

Contract: `structured-data-governance.contract.test.ts` — interpretation + glossary ownership rules explicit.

### 8. Educational Graph OS (May 2026 completion)

**Semantic authorities:** `orchestrateBreadcrumbGraph()` + `orchestrateEducationalGraph()` + `resolveEducationalCognitionContext()`.

| Deliverable | Status |
|-------------|--------|
| Pathname normalization (all academy `PATH` pages) | Done — `pathname-normalization.ts` + contract |
| Runtime DOM BreadcrumbList enforcement | Done — `playwright-breadcrumb-governance.spec.ts` |
| Focus-area graph routes `/app/account/focus-areas/[topic]` | Done — cognition + reasoning chain |
| Navigation telemetry hardening | Done — `ontologyNamespace`, dedupe, observability metrics |
| Ontology registry (`ontologyNamespace`, `remediationPathwayIds`) | Done |
| Glossary graph entities | Done — `buildGlossaryGraphEntity()` |
| Reasoning-chain convergence | Done — `reasoning-chain-navigation.ts` |

### 9. Operational release governance

| Gate | Command / workflow |
|------|-------------------|
| Static | `npm run qa:semantic-navigation-gate:static` |
| Static + Playwright | `npm run qa:semantic-navigation-gate` |
| CI workflow | `.github/workflows/release-governance-breadcrumbs.yml` |
| Verify Build | `qa:semantic-navigation-gate:static` on every PR |
| Release gate project | `release-semantic-navigation` in `playwright.release-gate.config.ts` |

**Fails on:** >1 `BreadcrumbList` (indexable), any `BreadcrumbList` on `/app/*`, pathname mismatches, glossary client-transition drift, ontology namespace conflicts, remediation traversal divergence, substrate parallel registries.

**Artifacts on failure:** `test-results/semantic-navigation-gate/` — ontology conflicts, coverage JSON, Playwright traces/screenshots/videos.

### 10. Semantic route coverage

Module: `governance/semantic-route-coverage.ts` — nightly via `npm run audit:semantic-route-coverage` (weekly workflow).

Emits: `semanticCoverageScore`, `orphanedRouteCount`, `ontologyConflictCount`, `unreachableGraphNodeCount`.

### 11. Runtime ontology integrity

Module: `governance/ontology-runtime-integrity.ts` — tiers: `healthy` | `degraded` | `conflicting` | `orphaned`.

`guardOntologyIntegrityForSurface()` — never throws in presentation adapters; logs in development.

### 12. Telemetry lineage and psychometric context

Module: `governance/telemetry-lineage-governance.ts`.

Every navigation event is enriched with: `semanticRouteKind`, `ontologyRevision`, `graphVersion`, `ontologyNamespace`, `graphTraversalDepth`, optional `testing_model` / `cognitionReliabilityTier`.

Use `trackNavigationWithPsychometricContext()` when psychometric context is available.

### 13. Graph continuity observability

Expanded `graph-navigation-observability.ts` metrics:

- `graph_continuity.recovered`
- `graph_traversal.interrupted`
- `remediation_return.success`
- `normalization.fallback`

### 14. Client hydration governance

Module: `governance/client-navigation-governance.ts` — SSR vs hydrated trail parity, client transition schema budget, replay snapshots.

### 15. Educator graph analytics

Modules: `governance/educator-graph-analytics.ts`, `governance/graph-os-aggregation.ts`.

Aggregates only educator-safe rollups — never raw cognition envelopes.

### 16. Semantic convergence guarantees

All semantic navigation must resolve through:

- `normalizeEducationalPathname()`
- `orchestrateBreadcrumbGraph()` / `orchestrateEducationalGraph()`
- `resolveEducationalCognitionContext()` (learner cognition surfaces)

**Forbidden:** parallel breadcrumb builders, local glossary hierarchies, route-heuristic remediation ladders, ungoverned `<BreadcrumbTrail>` on `/app/*`.

Substrate audit: `governance/graph-substrate-integrity.ts`.

### 17. Remaining semantic debt

| Priority | Debt |
|----------|------|
| P2 | Wire `testing_model` from live psychometric resolver into all marketing breadcrumb mounts |
| P3 | Educator UI dashboard consuming `getEducatorGraphSummary()` |
| P3 | Mastery step index in remediation crumb labels |

**UX/accessibility:** 5-crumb cap, `aria-current` on terminal crumb, responsive wrap — unchanged and enforced in `LearnerBreadcrumbTrail` / governance tests.

---

## Module map

| File | Role |
|------|------|
| `breadcrumb-intent.ts` | Intent semantics + schema eligibility |
| `breadcrumb-resolver.ts` | Central `resolveBreadcrumbResolution()` |
| `pathway-education-breadcrumbs.ts` | Education-first pathway trails |
| `academy-breadcrumbs.ts` | ECG / labs / hemodynamics |
| `glossary-breadcrumbs.ts` | Glossary hierarchy |
| `clinical-interpretation-breadcrumbs.ts` | Interpretation hierarchy |
| `navigation-ontology.ts` | Hierarchy layers + validation |
| `competency-navigation.ts` | RN competency graph frames |
| `learner-navigation.ts` | Learner trails (no schema) |
| `remediation-navigation.ts` | Remediation ladders |
| `topic-cluster-governance.ts` | Cluster audits |
| `schema-ownership.ts` | Page vs layout breadcrumb ownership |
| `layout-fallback-policy.ts` | Marketing layout fallback gate |
| `structured-data-governance.ts` | Multi-schema ownership V2 |
| `navigation-analytics.ts` | Educational traversal telemetry |
| `pathname-normalization.ts` | Canonical pathname + graph telemetry context |
| `graph-navigation-observability.ts` | Graph OS metrics (schema drift, abandonment) |
| `reasoning-chain-navigation.ts` | Navigable reasoning pathways |
| `focus-area-graph-route.ts` | Focus-area cognition + graph routes |
| `governance/semantic-navigation-release-gate.ts` | Static CI release gate |
| `governance/semantic-route-coverage.ts` | Nightly route coverage diagnostics |
| `governance/telemetry-lineage-governance.ts` | Telemetry lineage + psychometric stamps |
| `governance/ontology-runtime-integrity.ts` | Runtime ontology tiers |
| `governance/graph-substrate-integrity.ts` | No parallel navigation registries |
| `governance/client-navigation-governance.ts` | Hydration + client transitions |
| `governance/educator-graph-analytics.ts` | Educator-safe rollups |
| `governance/graph-os-aggregation.ts` | In-memory graph OS event bucket |
| `navigation-governance-registry.ts` | Consumer audit |
| `build-breadcrumb-schema.ts` | Shared JSON-LD builder |

UI entry: `@/components/navigation/breadcrumbs` (`Breadcrumbs`, `BreadcrumbsFromResolution`).
