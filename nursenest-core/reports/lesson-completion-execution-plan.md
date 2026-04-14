# Lesson completion execution plan

Derived from root-cause buckets + system inventory (static analysis).

## Allied: bundled catalog vs DB

Not a sync bug: `catalog.json` omits `us-allied-core` / `ca-allied-core` pathways, so bundled helpers return zero rows. Hubs use published DB lessons when present (`getPathwayLessonsPage` DB branch).

- `pathwayHasBundledCatalogLessonsSync(us-allied-core)`: false
- `pathwayHasBundledCatalogLessonsSync(ca-allied-core)`: false

## Primary blocker (overall)

**Content completeness and structural gates** dominate (`missing_required_content_sections` + `present_but_gating_or_merge_logic`). Routes are not implicated by these reports.

## Execution category split (non–public-complete lessons)

{
  "gatingPrimaryOrSubstantialBody": 4580,
  "missingSectionsPrimaryThinBody": 2883,
  "missingSectionsPrimarySubstantialBody": 4196,
  "trulyMissingOrPlaceholder": 16,
  "otherBuckets": 0
}

## Sources breakdown (non–public-complete)

{
  "catalogOnly": 185,
  "databaseOnly": 11043,
  "both": 447,
  "unknown": 0
}

## Ranked phases

### 1. Structural + premium gate compliance (NP/RN/PN bulk)

missing_required_content_sections — add/expand premium spine sections and metadata where body already exists

### 2. Gating / depth / relatedLessonRefs (no route changes)

present_but_gating_or_merge_logic — editorial passes on clinical_scenario depth, relatedLessonRefs targets, subscriber/premium completeness

### 3. Placeholder / banned phrasing cleanup

truly_missing_or_placeholder_content — replace stubs; cross-check legacy map where applicable

### 4. Allied: optional future bundled catalog

Until `catalog.json` includes allied buckets, rely on DB + merged inventory for counts; add JSON only when offline/bundle parity is required

## Machine-readable

- `reports/lesson-completion-execution-plan.json`
