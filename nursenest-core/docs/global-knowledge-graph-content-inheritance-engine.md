# Global Knowledge Graph and Content Inheritance Engine

Status: architecture contract implemented. This does not publish international content. It defines how approved clinical knowledge can generate downstream educational assets without duplication.

## Objective

Move NurseNest from isolated educational assets to a clinical knowledge graph:

```text
Clinical Concept
-> Learning Objective
-> Role Overlay
-> Country Overlay
-> Exam Overlay
-> Language Overlay
-> Educational Asset
```

Lessons, questions, flashcards, simulations, practice exam items, CAT items, daily questions, and blog content should be generated from approved knowledge nodes and overlays. They should not be treated as the primary source of truth.

## Implementation

Primary contract:

- `src/lib/international-content/global-knowledge-graph-content-inheritance-engine.ts`
- `src/lib/international-content/global-knowledge-graph-content-inheritance-engine.contract.test.ts`

The engine works alongside:

- `src/lib/international-content/international-rn-shared-core-framework.ts`
- `src/lib/international-content/international-content-recovery-classification-engine.ts`

## Knowledge Node Types

The graph currently declares these canonical node types:

| Node Type |
| --- |
| Clinical Condition |
| Medication |
| Laboratory Test |
| ECG Concept |
| Clinical Skill |
| Assessment Finding |
| Symptom |
| Diagnostic Test |
| Safety Principle |
| Communication Principle |
| Leadership Concept |
| Documentation Concept |
| Professional Standard |
| Regulatory Requirement |

## Required Node Metadata

Every node must contain:

| Field | Purpose |
| --- | --- |
| `nodeId` | Stable canonical identifier |
| `nodeType` | Clinical concept category |
| `clinicalDomain` | Body system or professional domain |
| `difficulty` | Foundation, intermediate, advanced, or expert |
| `roleApplicability` | PN, RN, NP |
| `countryApplicability` | Countries that can inherit the node |
| `examApplicability` | Exams that can inherit the node |
| `translationStatus` | Translation and localization state |
| `version` | Regeneration trigger |
| `reviewStatus` | Governance state |
| `inheritanceStatus` | Whether overlays are complete |
| `clinicalAccuracyScore` | Clinical governance score |
| `educationalValueScore` | Teaching value score |
| `translationReadinessScore` | Translation readiness score |
| `examRelevanceScore` | Exam alignment score |
| `publicationScore` | Overall publication score |
| `downstreamAssets` | Assets affected by node changes |

## Generation Gate

A node may generate learner-facing assets only when all conditions pass:

| Requirement | Threshold |
| --- | ---: |
| Review status | `publication_approved` |
| Inheritance status | `asset_generation_ready` |
| Clinical accuracy | 95+ |
| Educational value | 90+ |
| Translation readiness | 90+ |
| Exam relevance | 90+ |
| Publication score | 90+ |

Nodes below threshold may exist in the graph but cannot generate downstream assets.

## Role Overlay Rules

| Role | Required Concepts |
| --- | --- |
| PN | Recognition, monitoring, escalation, safety |
| RN | Assessment, prioritization, clinical judgment, care planning |
| NP | Diagnosis, differential diagnosis, management, prescribing |

Role overlays may not duplicate the core clinical node.

## Country Overlay Rules

| Country | Required Concepts |
| --- | --- |
| United Kingdom | NHS, NEWS2, Duty of Candour, Safeguarding |
| Australia | NMBA, Ahpra, Rural Health, Aboriginal Health |
| New Zealand | NCNZ, Te Tiriti, Cultural Safety |
| Canada | Provincial Regulation, Professional Standards |
| United States | State Boards, NCLEX Requirements |

Country overlays localize practice expectations without copying the clinical core.

## Exam Overlay Rules

| Overlay | Exams | Required Concepts |
| --- | --- | --- |
| RN exam overlay | NCLEX-RN, REx-PN, NMC CBT, NMBA RN, NCNZ RN | Blueprint mapping, clinical judgment, practice exam eligibility, CAT eligibility |
| NP exam overlay | CNPLE, FNP, AGPCNP, PMHNP, WHNP, PNP-PC | Diagnostics, management, prescribing, longitudinal care |

Exam overlays inherit from the same clinical knowledge when clinically appropriate.

## Language Overlay Rules

Translations occur after:

1. Clinical core is complete.
2. Role overlay is complete.
3. Country overlay is complete.
4. Exam overlay is complete.

Translations must not be generated from raw drafts or duplicate content.

Current language overlay contracts:

| Language Overlay | Variants |
| --- | --- |
| French | `fr`, `fr-CA` |
| Spanish | `es`, `es-US`, `es-MX` |

## Asset Generation Rules

The following educational assets are downstream outputs, not primary sources:

| Asset |
| --- |
| Lesson |
| Question |
| Flashcard |
| Simulation |
| Case Study |
| Practice Exam Item |
| CAT Item |
| Daily Question |
| Blog Content |

Every generation rule requires an approved clinical knowledge node. Most generated assets also require role, country, exam, and language overlay completion.

## Sepsis Inheritance Example

```text
Sepsis
-> Recognition of early deterioration
-> RN Overlay
-> United Kingdom Overlay
-> NMC CBT Overlay
-> French Translation
-> Lesson / Question / Flashcard / Simulation / Case Study / Practice Exam Item / CAT Item / Daily Question / Blog Content
```

The sample graph includes:

| Node | Status | Generation |
| --- | --- | --- |
| Sepsis | publication approved | allowed |
| Recognition of Early Deterioration | publication approved | allowed |
| Furosemide | clinical approved, exam overlay required | blocked |

This matters because a clinically reviewed node is not automatically publishable. It must also satisfy inheritance and score thresholds.

## Update Queue Behavior

When an approved node changes, the engine creates update queues for all downstream assets declared on that node.

For example, when `clinical-condition-sepsis` version `3` changes, affected outputs include:

- Lessons
- Questions
- Flashcards
- Simulations
- Case studies
- Practice exam items
- CAT items
- Daily questions
- Blog content

The queue also carries affected roles, countries, exams, and languages so regeneration can preserve:

- Role scope
- Country requirements
- Exam requirements
- Language requirements

## Dashboard Contract

The current seeded dashboard reports:

| Metric | Value |
| --- | ---: |
| Node types | 14 |
| Sample nodes | 3 |
| Approved generation nodes | 2 |
| Blocked generation nodes | 1 |
| Role overlay rules | 3 |
| Country overlay rules | 5 |
| Exam overlay rules | 2 |
| Language overlay rules | 2 |
| Generation rules | 9 |
| Seeded update queue items | 17 |

## Governance Rules

- Educational assets are generated from knowledge nodes.
- Overlays cannot duplicate core nodes.
- Translation occurs only after clinical, role, country, and exam overlays are complete.
- Nodes below score threshold cannot generate learner-facing content.
- Node version changes must trigger downstream update queues.
- Future importers and generators should write into the graph/inheritance model before creating page-level assets.

## Verification

Contract test:

```bash
node --import tsx --test src/lib/international-content/global-knowledge-graph-content-inheritance-engine.contract.test.ts
```

The test verifies:

- Required node type registry.
- Approved inheritance sequence.
- Non-duplicative overlay rules.
- Asset generation from clinical knowledge nodes.
- Publication threshold blocking.
- Downstream update queue generation.
- Graph dashboard counts.
