# NurseNest Evidence Coverage & Reference Governance Audit

Generated: 2026-06-01  
Scope: lessons, questions and rationales, flashcards, CAT/practice exam source fields, blogs, ECG, labs, pharmacology, clinical skills, care plans, simulations, authority infrastructure, and governance code.  
Method: repository-evidenced counts only. No database rows were queried because no live database snapshot was available in this audit run.

## 1. Executive Summary

NurseNest has a meaningful reference governance foundation, but evidence coverage is not yet mature enough to claim platform-wide clinical source traceability.

The strongest evidence infrastructure is in the blog and verified study card systems:

- `BlogPost` supports `sourcesJson`, `apaReferences`, `sourceReliabilityScore`, `requiresReferences`, `medicalRiskFlags`, `reviewDueAt`, and `lastReviewedAt`.
- `blog-citation-safety.ts` blocks high-sensitivity blog saves without verified admin/retrieved citations unless intentionally overridden.
- `blog-publish-quality-validator.ts` checks reference relevance against the article topic and blocks irrelevant citation clusters.
- `VerifiedStudyCard` and `ClinicalNursingScenario` support `referencesJson`.
- `ExamQuestion` supports `referenceSource`.
- Dedicated evidence audit engines exist in `src/lib/evidence/evidence-governance.ts`, `src/lib/evidence/reference-validation-evidence-governance-engine.ts`, and `src/lib/questions/evidence-governance.ts`.

The primary gap is attachment and traceability. Most static content inventories do not carry structured references, source IDs, source versions, citation locators, claim-to-source mapping, or source freshness metadata. The evidence engines can evaluate content items, but the majority of repository-stored educational assets do not yet provide the structured inputs needed for a 95% evidence governance target.

Strict evidence coverage result:

| Metric | Repository-evidenced result |
| --- | ---: |
| Static blog files scanned | 4,595 |
| Static blog files with structured frontmatter citation fields | 0 |
| Pathway lesson catalog records scanned | 3,045 |
| Pathway lesson records with structured citation/source keys | 0 |
| Static question source files scanned | 9 |
| Static question-like objects detected | 237 |
| Static question files with structured evidence fields | 0 |
| Static clinical case files scanned | 4 |
| CNPLE static cases with `guidelineSources` | 17 |
| CNPLE static cases with `reviewedAt` | 1 |
| CNPLE guideline source strings with URL/DOI locators | 0 of 45 |
| Nursing mechanism explainers with APA reference support | 11 of 12 records include `apa7References` key occurrences |

Evidence governance maturity: **early-stage operational infrastructure, low asset-level coverage**.

Recommended launch gate: **do not treat clinical evidence coverage as complete until every publishable clinical asset has structured sources, citation locators, source freshness metadata, and claim-level support mapping.**

## 2. Evidence Coverage Report

### Repository Evidence Sources

Counts were derived from:

- `src/content/blog-static-longtail/`
- `src/content/pathway-lessons/`
- `src/content/questions/`
- `src/content/flashcards/`
- `src/content/cases/`
- `src/content/clinical-case-studies.json`
- `src/content/nursing-mechanism-explainers.ts`
- code path scans for ECG, labs, pharmacology, skills, simulations, and care plan tooling.

### Blog Evidence Coverage

| Blog metric | Count |
| --- | ---: |
| Static blog files | 4,595 |
| Structured frontmatter reference fields | 0 |
| Markdown `References` heading | 0 |
| Files containing URLs | 3,839 |
| Files containing DOI-like text | 279 |
| Files with `requiresReferences` frontmatter | 0 |
| Files with `medicalRiskFlags` frontmatter | 0 |

Interpretation:

- URLs and DOI-like strings exist in some static blog bodies, but this does not equal compliant evidence coverage.
- No static blog file in this scan carries normalized citation metadata equivalent to `sourcesJson`, `apaReferences`, `requiresReferences`, or `medicalRiskFlags`.
- The database-backed blog model supports evidence fields, but static long-tail markdown does not consistently use them.

### Lesson Evidence Coverage

| Lesson metric | Count |
| --- | ---: |
| Pathway lesson catalog JSON files | 41 |
| Pathway lesson records scanned | 3,045 |
| Lesson records with structured reference/source/citation/guideline/APA/evidence keys | 0 |
| Lesson records with URL references | 0 |
| Lesson records with DOI references | 0 |

Interpretation:

- Many lessons include words such as “evidence,” “guideline,” or “source” in prose, but recursive key inspection found no structured evidence/source fields.
- Lesson records should not be considered source-traceable until a normalized `evidenceCitations` or equivalent field exists per lesson, section, and clinical claim.

### Question and Rationale Evidence Coverage

| Question metric | Count |
| --- | ---: |
| Static question files scanned | 9 |
| Static question-like objects detected | 237 |
| Static files with evidence/reference fields | 0 |
| `referenceSource` occurrences in static question files | 0 |
| `guidelineSources` occurrences in static question files | 0 |

Interpretation:

- The Prisma `ExamQuestion` model has `referenceSource`, but static question bank files do not populate equivalent evidence fields.
- There is no repository-evidenced structured support that maps references separately to correct answer, rationale, distractors, clinical pearl, hint, or remediation.

### Flashcard Evidence Coverage

| Flashcard metric | Count |
| --- | ---: |
| Static flashcard-related files detected | 1 |
| Card-like prompts detected | 2 |
| Files with reference/source fields | 0 |

Interpretation:

- `VerifiedStudyCard` supports `referencesJson`, `verificationStatus`, and `lastVerifiedAt`.
- Static flashcards do not yet show structured reference attachment.
- Flashcards generated from questions should inherit question evidence mappings instead of becoming unsourced standalone claims.

### Case and Simulation Evidence Coverage

| Case metric | Count |
| --- | ---: |
| Case files scanned | 4 |
| Static CNPLE cases | 17 |
| Clinical case JSON items | 2 |
| CNPLE cases with `guidelineSources` | 17 |
| CNPLE cases marked `published` | 1 |
| CNPLE cases marked `internal_review` | 16 |
| CNPLE cases with `reviewedAt` | 1 |
| CNPLE cases with `contentUpdatedAt` | 17 |
| Guideline source strings in CNPLE cases | 45 |
| Guideline source strings with URL/DOI locator | 0 |

Interpretation:

- CNPLE static cases are the best source-bearing static clinical content found in this scan.
- The case sources are partial evidence support only because they are plain strings without URL/DOI, source version, citation locator, reviewer-level citation approval, or claim mapping.
- The two `clinical-case-studies.json` items have no structured references.

### Nursing Mechanism Explainers

| Mechanism explainer metric | Count |
| --- | ---: |
| Explainer records detected by `slug` | 12 |
| `apa7References` key occurrences | 11 |
| Shared APA-style reference strings | 6 |

Interpretation:

- This module has a stronger publishability standard than most static assets. It requires non-empty `apa7References`, nursing priorities, exam relevance, internal links, and minimum word count.
- It still lacks claim-level citation mapping and locator metadata.

### ECG, Labs, Pharmacology, Skills, Simulations, Care Plans

These scans are file-level indicators, not asset-level publication evidence:

| Area | Files scanned | Files with reference/source-like fields | Notes |
| --- | ---: | ---: | --- |
| ECG | 348 | 142 | Many matches are code/test terminology; requires asset-level extraction before claiming coverage. |
| Labs | 281 | 143 | Strong code-level evidence terminology, but not proof of per-lab source traceability. |
| Pharmacology | 240 | 153 | Many matches relate to medication safety and source-like code fields; per-asset references still need normalization. |
| Clinical skills | 57 | 2 | Minimal source-like field evidence. |
| Simulations/scenarios | 149 | 17 | Some scenario infrastructure supports references, but static simulation coverage is not uniformly sourced. |
| Care plans/concept maps/worksheets | 12 | 1 | No broad evidence governance attachment found. |

## 3. Source Quality Report

### Existing Source Quality Infrastructure

`src/lib/evidence/reference-validation-evidence-governance-engine.ts` defines:

- content types: `question`, `flashcard`, `lesson`, `pharmacology`, `clinical_skill`, `ecg`, `cat`, `blog_post`, `authority_page`, and others.
- quality levels: `primary_guideline`, `peer_reviewed_article`, `textbook`, `regulatory_source`, `professional_association`, `low_quality_web_source`, and `missing`.
- access statuses: `accessible`, `broken`, `unavailable`, `retracted`, and `unknown`.
- source flags: broken, missing, outdated, duplicate, low-quality, unavailable, retracted, missing URL, and missing locator.

This is the correct direction. The current limitation is that most assets do not provide enough structured reference data for the engine to evaluate them.

### High-Quality Source Signals Found

CNPLE sample cases cite recognizable guideline or professional source families, including:

- Hypertension Canada
- Diabetes Canada
- KDIGO
- Canadian Cardiovascular Society
- Choosing Wisely Canada
- IDSA
- SOGC
- Canadian Task Force preventive care guidance
- Canadian Thoracic Society
- GOLD
- CAMH
- College and professional guidance strings

Mechanism explainers cite:

- KDIGO
- American Diabetes Association
- American Burn Association
- GOLD
- Surviving Sepsis Campaign
- American Heart Association

### Source Quality Gaps

| Gap | Current evidence |
| --- | --- |
| Plain-string sources | CNPLE cases use 45 guideline strings without URL/DOI locators. |
| Missing source version fields | Source strings sometimes include years but not structured `version`. |
| Missing source registry IDs | No source IDs map CNPLE case claims to a registry. |
| Missing claim locators | No section/page/table/algorithm locators for static case claims. |
| Missing source access status | Static strings cannot be checked for broken links. |
| Missing retraction status | Static strings cannot identify retracted or superseded sources. |
| Missing authoritative hierarchy enforcement | Engine exists, but source-bearing static content does not use normalized source quality levels. |

## 4. High-Risk Content Report

The evidence engine correctly treats high-risk domains with stricter expectations. Risk markers include medication safety, pediatrics, pregnancy/lactation, critical care, cardiac/ACLS, sepsis, infection control, mental health safety, and scope of practice.

High-risk categories requiring immediate evidence normalization:

| Area | Evidence status | Risk |
| --- | --- | --- |
| Pharmacology | Infrastructure exists; static per-asset source coverage not proven. | Medication errors, contraindications, toxicity, outdated dosing guidance. |
| Labs | Strong educational footprint; asset-level source coverage not proven. | Critical-value escalation and diagnostic interpretation errors. |
| ECG | Strong module footprint; asset-level source coverage not proven. | Rhythm misclassification, escalation timing, deterioration misses. |
| Maternal-newborn | CNPLE cases have plain-string sources; broader inventory not sourced. | Severe preeclampsia, postpartum hemorrhage, fetal/maternal safety. |
| Pediatrics | CNPLE case source strings exist; broad pathway evidence not proven. | Age-specific dosing, deterioration, fever and respiratory risk. |
| Critical care and emergency | Source coverage not proven across simulations/questions. | Failure-to-rescue, shock, sepsis, ACS, stroke, airway emergencies. |
| NP prescribing | CNPLE sample cases have partial strings; NP question/lesson source mapping not complete. | Prescribing, differential diagnosis, follow-up management. |
| Clinical skills | Minimal source-like field evidence. | Procedure safety, infection prevention, documentation liability. |
| Care plans/concept maps | Minimal source-like field evidence. | Learners may receive unsupported intervention rationales. |
| CAT/practice exams | `ExamQuestion.referenceSource` exists, but static content attachment not proven. | High-stakes readiness decisions may be based on unsourced rationales. |

## 5. Freshness Report

Freshness support exists in several places:

- `BlogPost.reviewDueAt`
- `BlogPost.lastReviewedAt`
- `VerifiedStudyCard.lastVerifiedAt`
- `ClinicalNursingScenario.updatedAt`
- CNPLE case `contentUpdatedAt`
- one CNPLE case `reviewedAt`
- evidence engine freshness scoring via publication year, reviewed date, and review cadence

Freshness is not yet complete because:

- most static content lacks structured source publication years.
- most static content lacks source-specific `lastValidatedAt`.
- source strings are not normalized enough to compare current versus stale guidance.
- only 1 of 17 CNPLE static cases has `reviewedAt`.
- 45 of 45 CNPLE guideline source strings lack URL/DOI locators.

Strict freshness status: **not auditable at platform scale**.

Minimum freshness requirement for 95% readiness:

- each source has `publicationYear` or `publishedAt`.
- each source has `version` when applicable.
- each source has `lastValidatedAt`.
- each content-source relationship has `reviewedBy` and `reviewedAt`.
- high-risk sources refresh at least every 12 months or sooner when guidelines change.
- routine educational sources refresh at least every 24 months.

## 6. Traceability Report

Current traceability strengths:

- `ContentEvidenceCitation` supports `sourceId`, `claim`, `supports`, `quoteOrLocator`, `addedBy`, `reviewedBy`, and `reviewedAt`.
- `evaluateEvidenceGovernance()` blocks missing answer support and missing rationale support.
- `reference-validation-evidence-governance-engine.ts` can extract references from explicit references, raw references, `sourcesJson`, `apaReferences`, and body URLs.

Current traceability gaps:

- no platform-wide required `ContentEvidenceCitation[]` attachment on lessons, questions, flashcards, cases, simulations, CAT items, practice exams, or clinical skills.
- no claim-level mapping in static lesson catalogs.
- no answer/rationale/distractor-level evidence mapping in static question files.
- no inherited source mapping from questions to generated flashcards.
- no source locator standard enforced across CNPLE case strings.
- no source-to-section mapping in lessons.
- no source-to-decision mapping in simulations.

Traceability readiness: **engine design exists; asset adoption is incomplete**.

## 7. Authority Source Registry

Create a canonical source registry before attempting platform-wide evidence remediation.

Required registry object:

```ts
type AuthoritySource = {
  id: string;
  title: string;
  organization: string;
  sourceType:
    | "clinical-guideline"
    | "drug-reference"
    | "regulatory-source"
    | "professional-standard"
    | "peer-reviewed-study"
    | "textbook"
    | "exam-blueprint"
    | "institutional-policy";
  countryScope: string[];
  professionScope: string[];
  examScope: string[];
  clinicalDomains: string[];
  publicationYear?: number;
  version?: string;
  url?: string;
  doi?: string;
  accessStatus: "accessible" | "broken" | "unavailable" | "retracted" | "unknown";
  confidence: "low" | "moderate" | "high" | "authoritative";
  reviewCadenceMonths: number;
  lastValidatedAt?: string;
  validatedBy?: string;
};
```

Recommended source hierarchy:

| Tier | Use case | Examples |
| --- | --- | --- |
| Tier 1 | High-risk clinical claims | national guidelines, regulator standards, official drug monographs, major clinical societies. |
| Tier 2 | Teaching depth | peer-reviewed review articles, clinical textbooks, StatPearls only when reviewed and source-matched. |
| Tier 3 | Exam and regulatory context | NCSBN, CCRNR, provincial colleges, board/regulator documents. |
| Tier 4 | Local workflow context | institutional policies, documentation standards, local escalation procedures. |
| Rejected for clinical claims | Unsupported web references | generic blogs, forums, Wikipedia, unverified AI stubs, marketing pages. |

High-risk source families to register first:

1. NCSBN NCLEX-RN Test Plan
2. NCSBN NCLEX-PN Test Plan
3. CCRNR REx-PN Blueprint
4. CNPE/CNPLE official competency and blueprint material
5. FDA/Health Canada drug monographs
6. Lexicomp or equivalent institutional drug reference if licensed
7. Surviving Sepsis Campaign
8. AHA ACLS/BLS first aid rhythm and emergency guidance
9. American Diabetes Association and Diabetes Canada
10. KDIGO
11. GOLD
12. GINA
13. CDC infection control
14. Public Health Agency of Canada infection control
15. SOGC
16. AAP/CPS pediatric references
17. Hypertension Canada
18. Canadian Cardiovascular Society
19. NICE for UK overlays
20. NMBA/Ahpra for Australia overlays
21. NCNZ for New Zealand overlays

## 8. Governance Compliance Report

| Governance requirement | Current status | Evidence |
| --- | --- | --- |
| Evidence model exists | Partial pass | Evidence source and citation types exist in `src/lib/evidence/evidence-governance.ts`. |
| Reference validation engine exists | Partial pass | `reference-validation-evidence-governance-engine.ts` supports reference extraction, quality scoring, currency scoring, and queues. |
| Blog citation safety exists | Pass for DB-backed blog workflow | `blog-citation-safety.ts` excludes AI-suggested stubs and requires verified citations for high-risk topics unless overridden. |
| Blog reference relevance gate exists | Pass | `blog-publish-quality-validator.ts` blocks irrelevant references and off-topic CDC clusters. |
| Static blog evidence coverage | Fail | 4,595 static files; 0 structured frontmatter citation fields. |
| Lesson evidence coverage | Fail | 3,045 lesson records; 0 structured citation/source keys. |
| Static question evidence coverage | Fail | 237 question-like objects; 0 source fields in static files. |
| Flashcard evidence coverage | Fail | static flashcard content does not carry references. |
| Case evidence coverage | Partial | 17 CNPLE cases with `guidelineSources`; plain strings only. |
| Claim-level traceability | Fail | Citation type exists, but not attached platform-wide. |
| Freshness governance | Partial | Fields exist in models/engines; most assets lack source-specific freshness data. |
| Broken-link/source access governance | Partial | Engine supports access status; most static source strings cannot be checked. |
| Publication blocking | Partial | Blog and evidence engines can block; not enforced across all educational asset types. |

Compliance summary: **governance architecture is present, but evidence governance is not yet enforced across the full educational ecosystem.**

## 9. Top 50 Evidence Gaps

1. Static lessons lack structured source fields.
2. Static lessons lack claim-level citation mapping.
3. Static lessons lack source locators.
4. Static lessons lack source freshness metadata.
5. Static lessons lack reviewer attribution per cited claim.
6. Static question files lack `referenceSource` or equivalent source arrays.
7. Correct answers lack answer-specific citation support.
8. Rationales lack rationale-specific citation support.
9. Distractor rationales lack evidence support for why the choice is unsafe or incorrect.
10. Hints lack source or reasoning-framework support.
11. Clinical pearls lack source traceability.
12. Flashcards do not inherit references from source questions.
13. Flashcards do not carry source IDs.
14. Flashcards do not carry last-verified evidence dates.
15. Practice exam items do not show platform-wide evidence linkage.
16. CAT items do not show platform-wide evidence linkage.
17. Static blog markdown lacks structured source metadata.
18. Static blog markdown lacks medical risk flags.
19. Static blog markdown lacks review due dates.
20. Static blog markdown lacks clinical claim locators.
21. CNPLE guideline sources are plain strings.
22. CNPLE guideline sources lack URLs.
23. CNPLE guideline sources lack DOI or formal locator fields.
24. CNPLE cases mostly lack `reviewedAt`.
25. CNPLE cases lack claim-to-source mappings.
26. `clinical-case-studies.json` lacks references.
27. Mechanism explainers use shared APA strings without claim-level mapping.
28. Mechanism explainers lack source validation dates.
29. ECG assets need normalized per-rhythm source support.
30. ECG deterioration pathways need source and guideline mappings.
31. Lab reference ranges need source/version metadata.
32. Lab critical values need institution/regulator caveat metadata.
33. Pharmacology assets need drug-reference source IDs.
34. Pharmacology assets need country/formulary/source-scope metadata.
35. Medication safety questions need contraindication source traceability.
36. Clinical skills need procedure source standards.
37. Care plans need nursing diagnosis/intervention source support.
38. Concept maps need pathophysiology claim traceability.
39. Simulations need decision-point evidence support.
40. Simulation debriefs need source support.
41. High-risk maternal content needs source freshness gates.
42. High-risk pediatric content needs source freshness gates.
43. NP prescribing content needs strict source governance.
44. Scope-of-practice items need regulator source mapping.
45. International overlays need regulator-specific source IDs.
46. No universal authority source registry currently controls all content.
47. No evidence coverage dashboard reports actual source coverage by pathway.
48. No broken-link/source access audit is run against all static assets.
49. No publish gate uniformly blocks unsourced high-risk questions, lessons, or simulations.
50. No automated remediation queue prioritizes evidence gaps by clinical risk and revenue pathway.

## 10. Roadmap to 95%+ Evidence Coverage

### Definition of 95% Evidence Coverage

An asset counts as evidence-covered only when it has:

1. at least one structured source object.
2. source quality level.
3. URL, DOI, or formal named source locator.
4. source publication year or version.
5. `lastValidatedAt`.
6. reviewer attribution.
7. claim-level citation mapping for high-risk claims.
8. answer and rationale support for questions.
9. inherited citation support for generated flashcards.
10. freshness cadence appropriate to clinical risk.

Plain source strings and body URLs count as **partial support**, not complete evidence coverage.

### Phase 1: Authority Registry Foundation

Deliverables:

- create canonical source registry for exam, regulator, clinical guideline, drug, lab, ECG, and procedure sources.
- assign source IDs, confidence tiers, source type, country scope, role scope, and review cadence.
- normalize CNPLE case `guidelineSources` into registry references.

Exit criteria:

- 100% of accepted source families registered.
- all high-risk source types have review cadence.

### Phase 2: Evidence Schema Contract

Deliverables:

- define `evidenceCitations` contract shared by lessons, questions, flashcards, cases, simulations, blogs, clinical skills, ECG, labs, pharmacology, and care plans.
- require `sourceId`, `claim`, `supports`, `locator`, `reviewedBy`, `reviewedAt`, and `lastValidatedAt`.
- map `supports` values to: `lesson-section`, `answer`, `rationale`, `distractor`, `clinical-pearl`, `hint`, `simulation-decision`, `flashcard`, `blog-claim`.

Exit criteria:

- one reusable evidence contract used by all content types.

### Phase 3: High-Risk Content First

Priority source remediation order:

1. Pharmacology
2. Labs
3. ECG
4. Sepsis
5. Shock
6. ACS
7. Stroke
8. Respiratory failure
9. DKA
10. Hyperkalemia
11. GI bleed
12. Maternal emergencies
13. Pediatric emergencies
14. NP prescribing
15. Clinical skills

Exit criteria:

- 95% of high-risk published assets have structured citations.
- 0 high-risk published assets with missing references.

### Phase 4: Question Evidence Remediation

Deliverables:

- attach citations to correct answers.
- attach citations to rationales.
- attach evidence notes to distractor rationales when they involve safety, medication, escalation, diagnosis, or scope.
- populate `referenceSource` only as display fallback; store structured citations separately.

Exit criteria:

- RN, RPN/PN, and NP question banks reach 95% source attachment.
- all flagship questions have claim-level evidence support.

### Phase 5: Lesson and Blog Remediation

Deliverables:

- add section-level citations to pathway lessons.
- convert static blog markdown to structured citation frontmatter or DB-backed source envelopes.
- mark clinical blogs with `requiresReferences` and `medicalRiskFlags`.
- add `reviewDueAt` for all clinical articles.

Exit criteria:

- 95% of published lessons have structured citations.
- 95% of clinical blogs have verified citations and freshness dates.

### Phase 6: Flashcard Inheritance

Deliverables:

- generated flashcards inherit `sourceQuestionId`, `sourceLessonSlug`, and evidence citations.
- definition-only cards must cite source lesson/claim.
- clinical pearl cards must inherit the clinical pearl evidence source.

Exit criteria:

- 95% of published flashcards have inherited or direct evidence references.

### Phase 7: Simulation and Clinical Skill Evidence

Deliverables:

- map simulation decision points to evidence citations.
- map debrief explanations to evidence citations.
- map clinical skill steps to procedure, infection prevention, medication, and documentation sources.

Exit criteria:

- 95% of high-risk simulations have evidence support.
- 95% of clinical skills have procedure-source support.

### Phase 8: Evidence Dashboard and Publish Gates

Deliverables:

- dashboard by pathway, profession, exam, topic, system, and asset type.
- queues for missing references, stale references, broken references, low-quality sources, and missing locators.
- publish gates that block high-risk unsourced assets.

Exit criteria:

- platform evidence coverage is measurable in CI/admin dashboards.
- no high-risk content can publish without source coverage.

### Phase 9: Freshness Automation

Deliverables:

- scheduled source access checks for URLs.
- review-due queue by source risk cadence.
- stale source alerts for clinical and regulator updates.
- source supersession tracking.

Exit criteria:

- 95% of sources have validated freshness metadata.
- stale high-risk sources become publication blockers.

### Phase 10: 95% Governance Certification

Final certification gates:

- evidence coverage >= 95%.
- high-risk evidence coverage >= 99%.
- broken source rate = 0 for published clinical content.
- retracted source rate = 0.
- claim traceability >= 95%.
- freshness compliance >= 95%.
- reviewer attribution >= 95%.

## Commercial and SEO Implications

Evidence governance is a revenue and authority requirement, not just a clinical quality requirement.

Fastest trust gains:

1. Normalize high-risk question and rationale citations.
2. Add source visibility to flagship lessons and clinical pages.
3. Add clinical review and evidence review dates to public clinical content.
4. Publish transparent editorial and reference methodology pages.
5. Build source-backed comparison and exam authority pages without unsupported claims.

## Final Gate Status

The following gate statuses use only repository-evidenced observations from this audit:

| Gate | Status | Evidence |
| --- | --- | --- |
| Evidence infrastructure exists | Pass | Dedicated evidence engines and reference fields exist in code and Prisma models. |
| Static blog structured evidence coverage | Fail | 4,595 static blog files scanned; 0 structured frontmatter citation fields found. |
| Pathway lesson structured evidence coverage | Fail | 3,045 lesson records scanned; 0 structured citation/source keys found. |
| Static question structured evidence coverage | Fail | 237 question-like static objects detected; 0 source fields found in static question files. |
| CNPLE static case source support | Partial | 17 cases include `guidelineSources`; 45 source strings have no URL/DOI locators. |
| CNPLE static case freshness support | Partial | 17 cases include `contentUpdatedAt`; 1 includes `reviewedAt`. |
| Nursing mechanism explainer reference support | Partial | 12 explainer records detected; 11 `apa7References` key occurrences found. |
| Claim-level traceability | Fail | Citation types exist, but no platform-wide attachment to static lessons/questions/flashcards/cases was found. |
| Platform-wide 95% evidence coverage | Fail | Current measured static asset coverage is materially below the 95% threshold. |

The immediate work is not to invent a new evidence system. The immediate work is to attach the existing governance primitives to every clinical asset and make source coverage a hard publication gate.
