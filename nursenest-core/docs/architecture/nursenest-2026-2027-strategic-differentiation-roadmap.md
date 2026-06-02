# NurseNest 2026-2027 Strategic Differentiation Roadmap

This document turns the 2026-2027 product direction into an implementation-governance artifact. It does not mark the phases complete. Each phase still requires Figma exploration where visual surfaces change, database review where persistence changes, analytics verification, screenshots, Playwright validation, and operational evidence before release.

Machine-readable contract: `src/lib/governance/strategic-differentiation-roadmap.ts`

Contract test: `src/lib/governance/strategic-differentiation-roadmap.test.ts`

## Non-Negotiables

Every phase must remain:

- Theme aware
- Mobile first
- Accessible
- Premium
- Fully integrated
- Adaptive
- Measurable

NurseNest must stay one cohesive adaptive clinical learning ecosystem. New work must converge toward shared learner shells, semantic surfaces, canonical navigation, shared adaptive study loops, and existing design tokens. No phase may create a disconnected product, duplicated engine, or profession-specific UI fork unless a formal architecture exception is approved.

## Architecture Map

```text
Learner activity events
  -> Learning graph
  -> Readiness snapshots
  -> Forecasting snapshots
  -> Adaptive Learning Command Center
  -> Start My Session

Content inventory
  -> Blueprint mappings
  -> Scope classifications
  -> Reference quality
  -> Question quality
  -> Tutor and remediation links

Institution and cohort activity
  -> Faculty reporting
  -> Cohort readiness
  -> Seat utilization

Business and billing events
  -> Revenue rollups
  -> Conversion rollups
  -> Executive Business Command Center

Synthetic learner monitoring
  -> Activity startup health
  -> Deployment gates
  -> Emergency Study Mode
  -> Rollback decision
```

## Phase Scorecard

| Phase | Status | Core Deliverable | Primary Shared Surfaces | Completion Evidence |
| --- | --- | --- | --- | --- |
| 1. Adaptive Learning Command Center | Partial foundation | Today's plan, readiness, exam goal, weak areas, strong areas, one-click session launch | `/app/dashboard`, `/app/study-coach`, `/app/account/readiness` | Figma, Playwright learner journey, analytics persistence, readiness report |
| 2. Exam Success Forecasting | Requires schema | Pass probability, projected readiness date, hours remaining, trend, confidence intervals | `/app/account/readiness`, `/app/dashboard`, `/app/study-coach` | Model documentation, calibration report, screenshots, readiness tests |
| 3. AI Tutor System | Requires schema | Question-specific tutor, distractor explanations, exam traps, memory aids, related content | Flashcards, questions, CAT, LOFT, simulations | Content QA, rationale journey, analytics report, SME review |
| 4. Clinical Skills Ecosystem | Requires content scale | 100+ skills per pathway with lessons, simulations, questions, flashcards, competency tracking | `/app/clinical-skills`, lessons, flashcards, practice | Inventory report, competency map, screenshots, accessibility checks |
| 5. Pharmacology Ecosystem | Requires content scale | Drug-class platform with monitoring, labs, safety, interactions, cases, readiness | `/app/pharmacology`, lessons, flashcards, practice | Inventory report, reference report, pharmacology journey, scoring tests |
| 6. Exam Blueprint Compliance | Partial foundation | Target vs actual coverage, objective coverage, distribution variance, content priorities | Admin content audit, blueprints, readiness | Heatmap, admin screenshots, variance tests, priority report |
| 7. Question Quality Intelligence | Partial foundation | Difficulty, discrimination, response time, distractor performance, review queue | Admin quality, flashcards, practice | Flagged item report, admin screenshots, persistence tests |
| 8. AI Content Auditor | Partial foundation | Scope leakage, country mismatch, exam mismatch, guideline currency, references | Admin content audit, scope, references | Scope report, reference report, review queue export |
| 9. Institutional Licensing | Partial foundation | Seats, faculty dashboards, readiness, completion, cohort analytics, reporting | Admin institutions, readiness, learner dashboard | Seat workflow, privacy review, entitlement tests, billing report |
| 10. New Grad Residency | Requires content scale | Orientation, competencies, specialty readiness, documentation, clinical judgment reports | New Grad, skills, simulations, readiness | Residency inventory, heatmap screenshots, simulation journey |
| 11. Clinical Placement Companion | Planned | Unit, week, shift, medication, skill, question, flashcard, simulation preparation plans | Study coach, skills, pharmacology, simulations | Figma, placement plan journey, link report, analytics |
| 12. NurseNest Academy | Planned | Professional tracks, certificates, transcripts, completion records | Academy, lessons, skills, progress | Track screenshots, certificate sample, completion journey |
| 13. Executive Business Command Center | Implemented foundation | MRR, ARR, revenue, subscribers, chargebacks, refunds, uptime, usage, conversion, referrals, institutions | `/admin/business-command-center`, operations, business protection | Loader tests, TypeScript verification, admin screenshots, metric source notes |
| 14. Reliability First Architecture | Partial foundation | Deployment gates, rollback, emergency study mode, backup environment, read replicas, synthetic monitoring | Health checks, operations, learner activities | Synthetic report, deployment logs, runbook, Playwright launch evidence |

## Data Model Plan

The roadmap should use additive, reviewed persistence. No schema change is authorized by this document alone.

Likely new or extended model groups:

- `learner_readiness_snapshot`
- `learner_study_plan`
- `learner_topic_mastery`
- `exam_forecast_snapshot`
- `forecast_input_rollup`
- `tutor_interaction`
- `content_remediation_link`
- `clinical_skill_competency_map`
- `skill_readiness_snapshot`
- `drug_class_profile`
- `pharmacology_readiness_snapshot`
- `blueprint_domain`
- `content_blueprint_mapping`
- `question_quality_snapshot`
- `content_scope_classification`
- `reference_quality_snapshot`
- `institution`
- `institution_seat`
- `institution_cohort`
- `residency_roadmap`
- `placement_profile`
- `academy_track`
- `academy_completion_record`
- `synthetic_monitor_result`
- `activity_startup_health`
- `deployment_health_gate`

## Analytics Flow

Each phase must emit lifecycle events before it is considered measurable. Required event categories:

- Learner plan events: plan generated, plan viewed, recommended session started.
- Forecast events: forecast generated, forecast viewed, recommendation clicked.
- Tutor events: tutor opened, remediation clicked, feedback used.
- Content quality events: quality score generated, flag created, review completed.
- Scope and evidence events: audit generated, reference flagged, remediation task created.
- Institutional events: seat assigned, cohort report generated, faculty readiness viewed.
- Academy events: track started, track completed, certificate generated.
- Reliability events: synthetic monitor run, startup failure, emergency mode enabled.
- Business events: command center viewed, business metric loaded, health status changed.

Events must be persisted, visible in the appropriate dashboard, and included in reports. Client-only console events do not satisfy the requirement.

## Implementation Sequence

1. Governance and measurement foundation
   - Keep `strategic-differentiation-roadmap.ts` as the contract.
   - Add phase-specific reports under `docs/reports/` before release.
   - Confirm each new visual program follows Figma-first governance.

2. Learner command center and forecasting
   - Build the shared study plan and readiness data layer.
   - Add forecasting as educational guidance, not outcome guarantees.
   - Validate with mobile and desktop learner journeys.

3. Tutor, remediation, and quality intelligence
   - Reuse existing flashcard, question, lesson, skill, pharmacology, ECG, CAT, and LOFT surfaces.
   - Link tutor outputs to canonical content.
   - Fail quality checks for generic rationales or dead remediation links.

4. Clinical skills, pharmacology, and New Grad scale
   - Expand content through canonical content systems.
   - Maintain profession and scope alignment.
   - Report inventory, quality, and coverage before marketing claims change.

5. Institutional, placement, and academy expansion
   - Add seat and cohort workflows with server-side admin/faculty authorization.
   - Keep learner experiences shared.
   - Add certificates and transcripts only after completion criteria are testable.

6. Reliability and business continuity
   - Gate deployments on critical learner journeys.
   - Keep non-essential systems off the study startup path.
   - Document rollback and emergency study procedures.

## Validation Requirements

Before any phase is marked complete, provide:

- Figma frames when layout, hierarchy, dashboards, navigation, or premium polish changes.
- Desktop and mobile screenshots across required themes.
- Playwright journeys for the affected learner or admin workflow.
- Accessibility checks for keyboard navigation, contrast, and mobile layout.
- Analytics evidence showing required events are persisted.
- Data source documentation and schema/migration notes when persistence changes.
- Admin authorization proof for staff-only surfaces.
- No broken links, dead remediation routes, or disconnected feature entry points.

## Current Implementation Truth

The roadmap contract is implemented as governance. Phase 13 has an implemented foundation through the Executive Business Command Center. Several phases have partial foundations in existing readiness, content audit, blueprint, institutional, and reliability systems. Most product capabilities still require scoped implementation, content scale, schema review, Figma evidence, and Playwright validation before release.

This document is a launch-control layer, not a marketing claim.
