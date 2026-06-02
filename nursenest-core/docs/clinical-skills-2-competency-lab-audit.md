# Clinical Skills 2.0 Competency Lab Audit

Date: 2026-05-28

## Scope

Audited the learner Clinical Skills ecosystem:

- `src/lib/clinical-skills/clinical-skills-catalog.ts`
- `src/lib/clinical-skills/clinical-skills-enrichment.ts`
- `src/lib/clinical-skills/clinical-skills-checkpoints.ts`
- `src/components/clinical-skills/clinical-skill-detail-client.tsx`
- `src/components/clinical-skills/clinical-skills-procedure-workspace.tsx`
- `src/lib/clinical-skills/clinical-skills-adaptive-signals.ts`

## Audit Result

| Area | File | Function / Surface | Status |
|---|---|---|---|
| Catalog depth | `clinical-skills-catalog.ts` | `listClinicalSkills()` | Implemented: 221 skills available |
| Role scope | `clinical-skills-catalog.ts` | `clinicalSkillsForRoleTrack()` | Partial: RN 171 and RPN/PN 107 meet targets; NP 71 below 150; Pre-Nursing and Allied not modeled as role tracks |
| Skill uniqueness | `clinical-skills-competency-lab.ts` | `auditClinicalSkillsCatalog()` | Implemented: 0 duplicate titles detected |
| Learn mode | `clinical-skills-competency-lab.ts` | `buildClinicalSkillCompetencyLabProfile()` | Implemented |
| Practice mode | `clinical-skills-checkpoints.ts` | `getClinicalSkillCheckpoints()` | Implemented: 20+ assessment items per skill |
| Competency mode | `clinical-skill-detail-client.tsx` | Procedure workspace + sequencing | Implemented |
| Simulation mode | `clinical-skills-simulation-mode.tsx` | Patient status simulation | Implemented |
| Review mode | `clinical-skills-enrichment.ts` | Flashcards + retention prompts | Implemented |
| Error recognition | `clinical-skills-error-spotting.tsx` | Unsafe practice detection | Implemented |
| Remediation | `clinical-skills-competency-lab.ts` | Required remediation section | Implemented |
| Adaptive integration | `clinical-skills-adaptive-signals.ts` | `weakTopicSuggestsClinicalSkillsFocus()` | Implemented for weak-topic routing |

## Current Counts

- Total Clinical Skills: 221
- Skills passing current competency-lab audit: 221
- Skills partial: 0
- Skills missing required lab scaffolding: 0
- RN role-scoped skills: 171
- RPN/PN role-scoped skills: 107
- NP role-scoped skills: 71

## Remaining Gaps

- NP does not yet meet the 150+ completed-skill volume target.
- Pre-Nursing is not yet modeled as a Clinical Skills role track.
- Allied Health is not yet modeled as profession-specific Clinical Skills pathways.
- The current question renderer supports MCQ-style checkpoint items; SATA, matrix, hotspot, and bowtie-style procedural items need a richer clinical-skills question renderer before they can be fully represented as distinct interactions.
- This audit validates coverage and interaction scaffolding. It does not certify that every generated seed skill has the same hand-authored narrative depth as the core procedure set.

## Implemented 2.0 Foundation

Every skill now resolves to a competency lab profile containing:

- Overview
- When the skill is used
- Why the skill matters
- Required equipment
- Safety considerations
- Step-by-step procedure
- Common mistakes
- Clinical reasoning
- Documentation requirements
- Patient teaching
- Complications
- NCLEX / REx-PN relevance
- Practice questions
- Mastery assessment
- Reflection prompts
- Remediation activities

The learner-facing detail page now explicitly surfaces:

- Learn Mode
- Practice Mode
- Competency Mode
- Simulation Mode
- Review Mode

## Verification

Focused tests:

```bash
node --import tsx --test src/lib/clinical-skills/clinical-skills-catalog.contract.test.ts src/lib/clinical-skills/clinical-skills-enrichment.test.ts src/lib/clinical-skills/clinical-skills-competency-lab.test.ts
```

Audit command:

```bash
node --import tsx -e "const { auditClinicalSkillsCatalog } = require('./src/lib/clinical-skills/clinical-skills-competency-lab.ts'); console.log(auditClinicalSkillsCatalog())"
```
