# NurseNest Content Authority Score (NCAS) Framework

Date: 2026-06-01  
Status: Governance specification only. No routes, navigation, schemas, or learner-facing systems changed.

## Purpose

The NurseNest Content Authority Score (NCAS) is a 0-100 composite score that answers whether a content asset is clinically safe, evidence-backed, reviewed, current, educationally valuable, and authority-building.

NCAS should apply to:

- lessons
- questions
- rationales and distractors
- flashcards
- authority pages
- blogs
- pharmacology assets
- lab interpretation assets
- ECG assets
- clinical skills
- care plans and concept maps
- simulations and cases
- CAT and practice exam items

NCAS is not a marketing score. It is a publication and governance score. Content that fails NCAS gates should remain unpublished, noindexed, draft-only, or removed from learner-facing pools until remediated.

## 1. Scoring Model

NCAS combines 16 component scores into 8 weighted domains.

| Domain | Weight | Component scores included |
| --- | ---: | --- |
| Clinical Safety & Accuracy | 20% | Clinical Review Score, Reviewer Coverage Score, clinical safety blockers |
| Evidence & References | 15% | Evidence Coverage Score, Reference Freshness Score |
| Educational Value | 15% | Educational Quality Score, Question Quality Score, Rationale Quality Score, Distractor Quality Score, Clinical Pearl Score |
| Trust & E-E-A-T | 15% | E-E-A-T Score, Trust Signal Score, Author Coverage Score |
| Freshness & Maintenance | 10% | Content Freshness Score, review due status, update status |
| SEO Authority | 10% | SEO Authority Score, Schema Coverage Score |
| Internal Learning Graph | 10% | Internal Linking Score, remediation links, related content links |
| Operational Governance | 5% | workflow status, audit logs, lifecycle compliance, publication gate status |

Formula:

```text
NCAS =
  (Clinical Safety & Accuracy * 0.20) +
  (Evidence & References * 0.15) +
  (Educational Value * 0.15) +
  (Trust & E-E-A-T * 0.15) +
  (Freshness & Maintenance * 0.10) +
  (SEO Authority * 0.10) +
  (Internal Learning Graph * 0.10) +
  (Operational Governance * 0.05)
```

### Component Score Definitions

| Component | What it measures | Primary evidence |
| --- | --- | --- |
| E-E-A-T Score | Experience, expertise, authoritativeness, and transparency. | author profile, reviewer profile, editorial policy links, citations, organization signals. |
| Clinical Review Score | Whether the asset passed appropriate clinical review for its risk level. | reviewer assignment, decision, review date, expiry date, audit log. |
| Evidence Coverage Score | Whether clinical claims are supported by structured sources. | `sourcesJson`, `referencesJson`, `ContentCitation`, `referenceSource`, source IDs. |
| Reference Freshness Score | Whether sources are current and validated. | publication year, version, last validated date, review cadence, access status. |
| Educational Quality Score | Depth, reasoning, learner usefulness, clarity, scope fit. | lesson/question rubrics, learning objective coverage, clinical reasoning depth. |
| Question Quality Score | Stem realism, cue relevance, difficulty, blueprint fit. | question quality engine, item metadata, blueprint mapping. |
| Rationale Quality Score | Whether explanations teach clinical reasoning and safety. | correct rationale, distractor rationales, decision-rule teaching. |
| Distractor Quality Score | Plausibility and learner misconception value. | distractor taxonomy, misconception mapping, safety risk mapping. |
| Clinical Pearl Score | Bedside relevance, memorability, actionability. | pearl rubric, duplicate check, clinical usefulness. |
| Internal Linking Score | How well the asset supports adaptive study loops. | linked lessons, flashcards, questions, simulations, remediation targets. |
| SEO Authority Score | Search intent fit, topical depth, metadata quality, uniqueness. | title/meta, H structure, topical map, keyword intent, duplication audit. |
| Schema Coverage Score | Valid structured data for public content. | Article, FAQ, Breadcrumb, Course, Person, Organization, Review where appropriate. |
| Content Freshness Score | Whether the asset itself is current. | updated date, review due date, stale flags, content version. |
| Trust Signal Score | Visible trust and transparency signals. | reviewed date, author, reviewer, references, disclaimers, methodology links. |
| Reviewer Coverage Score | Whether reviewer identity/specialty matches risk. | reviewer credentials, specialty, license/certification evidence. |
| Author Coverage Score | Whether creator/editor attribution is sufficient. | author page, credentials, content contribution history. |

## 2. Weighting Framework

### Default Weights

| Domain | Weight | Rationale |
| --- | ---: | --- |
| Clinical Safety & Accuracy | 20% | Nursing education is YMYL-adjacent and must not teach unsafe care. |
| Evidence & References | 15% | Clinical claims need source traceability, especially high-risk domains. |
| Educational Value | 15% | Content must improve reasoning, not merely exist. |
| Trust & E-E-A-T | 15% | Authority depends on transparent authorship, review, and governance. |
| Freshness & Maintenance | 10% | Guidelines, exams, and practice standards change. |
| SEO Authority | 10% | Public pages must build topical authority and match intent. |
| Internal Learning Graph | 10% | NurseNest value comes from adaptive loops across lessons, questions, flashcards, cases, and remediation. |
| Operational Governance | 5% | Lifecycle and audit compliance prevents accidental publication. |

### High-Risk Weight Override

For pharmacology, labs, ECG, clinical skills, simulations, NP prescribing, maternity, pediatrics, critical care, emergency, mental health safety, and scope-of-practice content:

| Domain | Default | High-risk override |
| --- | ---: | ---: |
| Clinical Safety & Accuracy | 20% | 30% |
| Evidence & References | 15% | 25% |
| Educational Value | 15% | 15% |
| Trust & E-E-A-T | 15% | 10% |
| Freshness & Maintenance | 10% | 10% |
| SEO Authority | 10% | 3% |
| Internal Learning Graph | 10% | 5% |
| Operational Governance | 5% | 2% |

Reason: high-risk clinical content should not score well because it has strong SEO or linking while evidence or review is weak.

### Question-Specific Weight Override

For questions, CAT items, and practice exam items:

| Domain | Weight |
| --- | ---: |
| Clinical Safety & Accuracy | 20% |
| Evidence & References | 15% |
| Educational Value | 30% |
| Trust & E-E-A-T | 5% |
| Freshness & Maintenance | 5% |
| SEO Authority | 0% |
| Internal Learning Graph | 20% |
| Operational Governance | 5% |

Question NCAS should reward teaching power: rationales, distractors, pearls, remediation, and readiness mapping.

## 3. Threshold Definitions

| NCAS | Label | Publication meaning |
| ---: | --- | --- |
| 95-100 | Flagship Authority Content | Eligible for featured placement, flagship pages, acquisition funnels, institutional demos, and public authority campaigns. |
| 90-94 | Authority Content | Publishable and authority-building; suitable for normal public indexing and learner delivery. |
| 85-89 | Publishable | Publishable for routine/low-risk content; high-risk content may require remediation before publication. |
| 70-84 | Needs Improvement | Not eligible for new public launch; may remain draft, internal review, or limited-access remediation queue. |
| Below 70 | Not Publishable | Block publication and remove from learner-facing pools until remediated. |

### Mandatory Minimums

Even if composite NCAS is high, content must fail publication if any mandatory minimum is missed:

| Component | Routine minimum | High-risk minimum |
| --- | ---: | ---: |
| Clinical Review Score | 80 | 95 |
| Evidence Coverage Score | 75 | 95 |
| Reference Freshness Score | 75 | 90 |
| Educational Quality Score | 85 | 90 |
| Trust Signal Score | 75 | 85 |
| Reviewer Coverage Score | 70 | 95 |
| Author Coverage Score | 70 | 80 |

## 4. Content-Type Overrides

| Content type | Minimum NCAS to publish | Required component gates |
| --- | ---: | --- |
| Lessons | 85 | Educational Quality >= 85, Evidence Coverage >= 75, Clinical Review >= 80. |
| Questions | 90 | Question Quality >= 90, Rationale Quality >= 90, Distractor Quality >= 85, Evidence Coverage >= 75. |
| Flashcards | 85 | Educational Quality >= 85, source lesson/question link required, duplicate check passed. |
| Authority pages | 90 | E-E-A-T >= 90, Trust Signal >= 90, Schema >= 85, SEO Authority >= 90. |
| Pharmacology | 95 | Evidence Coverage >= 95, Clinical Review >= 95, Reference Freshness >= 90. |
| Labs | 95 | Evidence Coverage >= 95, Reference Freshness >= 90, clinical significance reviewed. |
| ECG | 95 | Clinical Review >= 95, Evidence Coverage >= 90, escalation safety reviewed. |
| Clinical skills | 95 | Clinical Review >= 95, Evidence Coverage >= 90, procedure safety reviewed. |
| Care plans | 90 | Educational Quality >= 90, Evidence Coverage >= 85, scope safety reviewed. |
| Simulations | 90 | Clinical Review >= 90, Evidence Coverage >= 85, debrief quality >= 90. |
| CAT items | 90 | Question Quality >= 90, blueprint mapping present, difficulty calibrated, remediation mapped. |
| Practice exams | 90 | question pool NCAS average >= 90 and no critical blockers. |
| Blogs | 85 | Trust Signal >= 80, Evidence Coverage >= 75 for clinical articles, SEO Authority >= 85. |

High-risk YMYL content may never publish below NCAS 90 and should target 95+ for flagship surfaces.

## 5. Automation Rules

### Hard Publication Blocks

Block publication when:

- NCAS < 85 for routine content.
- NCAS < 90 for high-risk content.
- Clinical Review Score below required minimum.
- Evidence Coverage Score below required minimum.
- Reference Freshness Score below required minimum for high-risk content.
- reviewer is missing for high-risk clinical content.
- clinical content has no source object or only AI-suggested sources.
- question is missing rationale, distractor rationale, hint, clinical pearl, difficulty, blueprint mapping, or remediation mapping.
- clinical skill lacks procedural safety review.
- pharmacology asset lacks authoritative drug reference support.
- public authority page lacks author/reviewer transparency.

### Warnings

Create warnings when:

- NCAS is 85-89 on routine content.
- SEO score is below 80 but clinical safety is strong.
- schema is missing on a public page.
- internal links are weak but content is clinically complete.
- content is within 60 days of review expiry.
- author profile exists but specialty attribution is incomplete.

### Remediation Tickets

Create tickets when:

- NCAS is 70-84.
- any component score falls below 75.
- duplicate content risk is detected.
- static source strings need conversion to structured references.
- a source is stale, broken, unavailable, or missing a locator.
- question distractors lack misconception mapping.
- rationale quality is below 90.
- public page lacks visible trust signals.

Ticket fields:

```ts
type NcasRemediationTicket = {
  contentId: string;
  contentType: string;
  pathway?: string;
  riskLevel: "routine" | "moderate" | "high" | "critical";
  currentNcas: number;
  targetNcas: number;
  failedComponents: string[];
  blockerCodes: string[];
  recommendedOwner: "clinical-reviewer" | "editorial" | "seo" | "content-engineering" | "product";
  dueDate: string;
};
```

### Reviewer Assignments

Assign reviewers automatically when:

- Clinical Review Score < required threshold.
- Reviewer Coverage Score is missing or expired.
- source risk domains include medication safety, pediatrics, maternity, ECG, critical care, mental health safety, NP prescribing, or scope-of-practice.
- content changed after last clinical review.
- source registry marks a guideline as superseded.

Reviewer assignment should match specialty and jurisdiction when region-specific guidance is involved.

## 6. Dashboard Design

Create a Content Authority Dashboard with three levels:

### Asset-Level View

Display:

- NCAS
- component scores
- publication status
- risk level
- blocker list
- remediation tickets
- author
- reviewer
- last reviewed
- next review due
- source count
- stale source count
- internal link count
- schema status

Recommended visual grouping:

| Pillar | Display |
| --- | --- |
| Authority score | NCAS, tier label, trend. |
| Evidence score | coverage, freshness, broken/stale sources. |
| Review score | reviewer status, expiry, specialty match. |
| Trust score | author/reviewer visibility, references, policies. |
| SEO score | metadata, schema, intent fit, internal links. |

### Program-Level View

Group by:

- RN
- RPN/PN
- NP
- Pre-Nursing
- New Graduate
- Allied Health
- ECG
- Labs
- Pharmacology
- Clinical Skills
- Simulations

Display:

- average NCAS
- median NCAS
- lowest 10% NCAS
- high-risk pass rate
- review backlog
- evidence backlog
- freshness backlog
- flagship content count
- launch blockers

### Site-Wide Executive View

Display:

- site-wide NCAS average
- traffic-weighted NCAS
- revenue-weighted NCAS
- program-level NCAS
- indexed-page NCAS
- noindex/draft NCAS
- high-risk content compliance
- authority trend over 30/90/180 days

Traffic-weighted authority score:

```text
Traffic-Weighted NCAS =
  sum(page NCAS * organic sessions) / sum(organic sessions)
```

Program-level authority score:

```text
Program NCAS =
  weighted average of all assets in pathway
  weighted by content criticality, traffic, learner usage, and high-risk status
```

Site-wide authority score:

```text
Site-wide NCAS =
  40% public indexed content NCAS +
  30% revenue-pathway content NCAS +
  20% high-risk clinical content NCAS +
  10% authority/trust infrastructure NCAS
```

## 7. Publication Workflow Integration

NCAS should become a required gate in the existing lifecycle:

1. Draft
2. Internal review
3. Educational review
4. Clinical review
5. SEO review
6. Ready for publication
7. Published
8. Needs update
9. Archived

### Workflow Rules

| Lifecycle state | NCAS rule |
| --- | --- |
| Draft | NCAS may be incomplete; missing components create setup tasks. |
| Internal review | structural and operational component scores required. |
| Educational review | Educational Quality, Question Quality, Rationale, Distractor, Pearl scores required where applicable. |
| Clinical review | Clinical Review, Evidence Coverage, Reference Freshness, Reviewer Coverage required. |
| SEO review | SEO Authority, Schema, Trust Signal, Internal Linking required for public assets. |
| Ready for publication | all hard gates pass; NCAS meets type/risk threshold. |
| Published | NCAS monitored continuously. |
| Needs update | triggered by stale sources, expired review, content drift, broken schema, or NCAS drop. |
| Archived | asset removed, redirected, or replaced; score retained for audit history. |

### Publication Status Mapping

| NCAS result | Status |
| --- | --- |
| Passes all gates and meets threshold | `READY_FOR_PUBLICATION` |
| Fails clinical/evidence gate | `BLOCKED_CLINICAL_EVIDENCE` |
| Fails education gate | `BLOCKED_EDUCATIONAL_QUALITY` |
| Fails SEO/trust gate | `BLOCKED_AUTHORITY_SEO` |
| Review expired | `NEEDS_UPDATE_REVIEW_EXPIRED` |
| Source stale/broken | `NEEDS_UPDATE_EVIDENCE` |
| Score below 70 | `NOT_PUBLISHABLE` |

## 8. Governance Integration Plan

### Existing Systems to Integrate

| Existing system | NCAS integration |
| --- | --- |
| `evidence-governance.ts` | feeds Evidence Coverage, Reference Freshness, Clinical Safety. |
| `reference-validation-evidence-governance-engine.ts` | feeds source quality, broken source, stale source, missing locator. |
| `questions/evidence-governance.ts` | feeds question evidence confidence. |
| question quality scoring | feeds Question Quality, Rationale Quality, Distractor Quality, Clinical Pearl Score. |
| clinical review workflow | feeds Clinical Review and Reviewer Coverage. |
| blog citation safety | feeds blog Evidence Coverage and publication blockers. |
| blog publish quality validator | feeds Educational Quality, Evidence relevance, SEO quality. |
| E-E-A-T dashboard | feeds Author Coverage, Trust Signal, Schema, SEO Authority. |
| internal linking audits | feeds Internal Linking Score and remediation graph completeness. |

### Recommended NCAS Data Contract

```ts
type NcasComponentScores = {
  eeat: number;
  clinicalReview: number;
  evidenceCoverage: number;
  referenceFreshness: number;
  educationalQuality: number;
  questionQuality?: number;
  rationaleQuality?: number;
  distractorQuality?: number;
  clinicalPearl: number;
  internalLinking: number;
  seoAuthority: number;
  schemaCoverage: number;
  contentFreshness: number;
  trustSignal: number;
  reviewerCoverage: number;
  authorCoverage: number;
};

type NcasResult = {
  contentId: string;
  contentType: string;
  pathway?: string;
  riskLevel: "routine" | "moderate" | "high" | "critical";
  score: number;
  tier:
    | "flagship_authority"
    | "authority"
    | "publishable"
    | "needs_improvement"
    | "not_publishable";
  componentScores: NcasComponentScores;
  blockers: string[];
  warnings: string[];
  remediationTickets: NcasRemediationTicket[];
  reviewerAssignments: string[];
  calculatedAt: string;
};
```

### Audit Log Requirement

Every NCAS calculation should store:

- content version
- source snapshot
- reviewer snapshot
- component scores
- blockers and warnings
- scoring rules version
- calculated timestamp
- actor or system trigger

## 9. Roadmap for Site-Wide Adoption

### Phase 1: Define NCAS Contracts

Deliverables:

- finalize score contract.
- map existing evidence/review/quality engines into component scores.
- create component score normalization rules.
- define risk-level detection.

Exit criteria:

- NCAS can be calculated for one representative lesson, question, blog, and simulation.

### Phase 2: High-Risk Content Pilot

Scope:

- pharmacology
- labs
- ECG
- NP prescribing
- maternal/pediatric emergencies
- sepsis/shock/ACS/stroke

Exit criteria:

- hard publication blocks work for high-risk assets.
- remediation tickets are generated.
- reviewer assignment rules work.

### Phase 3: Revenue Pathway Rollout

Scope:

- NCLEX-RN
- REx-PN
- NCLEX-PN
- CNPLE
- FNP, AGPCNP, PMHNP, WHNP, PNP-PC

Exit criteria:

- program-level NCAS is available.
- launch readiness can include NCAS.
- high-value gaps are ranked by NCAS improvement impact.

### Phase 4: Public Authority Rollout

Scope:

- homepage
- pricing
- about
- exam landing pages
- authority pages
- blogs
- comparison pages

Exit criteria:

- indexed pages have visible trust signals where appropriate.
- traffic-weighted NCAS is available.
- schema/trust/author gaps generate tickets.

### Phase 5: Learning Graph Integration

Scope:

- lessons
- questions
- flashcards
- simulations
- remediation pathways
- readiness domains

Exit criteria:

- flashcards inherit source credibility from source content.
- wrong-answer remediation links improve Internal Linking Score.
- program NCAS reflects adaptive learning readiness.

### Phase 6: Executive Dashboard

Deliverables:

- asset-level NCAS table.
- program-level authority dashboard.
- traffic-weighted NCAS.
- revenue-weighted NCAS.
- high-risk compliance panel.
- top remediation queue.

Exit criteria:

- leadership can answer what is safe to publish, what is authoritative, and what must be remediated first.

### Phase 7: Continuous Governance

Triggers:

- every deployment.
- every content import.
- every AI generation batch.
- every translation/localization batch.
- every source registry update.
- every clinical guideline supersession.

Exit criteria:

- NCAS declines automatically move assets into `Needs update`.
- expired high-risk reviews block publication.
- stale/broken references create remediation tickets.

## Success Criteria

Every NurseNest asset should have a measurable answer to:

| Question | NCAS evidence |
| --- | --- |
| Is it clinically safe? | Clinical Safety & Accuracy, Clinical Review, Reviewer Coverage. |
| Is it evidence-backed? | Evidence Coverage, Reference Freshness, source quality. |
| Is it reviewed? | Clinical Review Score, reviewer assignment, review audit log. |
| Is it current? | Content Freshness, Reference Freshness, review expiry. |
| Is it educationally valuable? | Educational Quality, rationale, distractor, pearl, learning graph scores. |
| Is it authority-building? | E-E-A-T, Trust Signal, SEO Authority, Schema, Author Coverage. |
| Should it be published? | NCAS threshold plus hard publication gates. |

NCAS should become the single executive language for content quality: not just “how much content exists,” but whether NurseNest can prove that content deserves learner trust.
