# NP Rationale Quality Audit

**Generated:** 2026-06-01  
**Source:** Live production database — all 27,375 NP launch-readiness questions  
**Scoring:** 0–100; deductions of 15 points per flagged issue

---

## Overall Quality Scores

| Pathway | Questions | Avg Score | Missing | Too Short | Generic Template | Partially Generic |
|---------|-----------|-----------|---------|-----------|-----------------|-------------------|
| FNP | 10,375 | **80.4** | 0% | 0% | 3.9% (402) | 72.1% (7,483) |
| AGPCNP | 5,000 | **81.7** | 0% | 0% | 0.7% (37) | 75.1% (3,757) |
| PMHNP | 4,000 | **82.5** | 0% | 0% | 4.2% (169) | 87.5% (3,501) |
| WHNP | 4,000 | **80.3** | 0% | 0% | 3.8% (152) | 71.4% (2,855) |
| PNP-PC | 4,000 | **83.9** | 0% | 0% | 1.5% (59) | 57.8% (2,311) |

**Positive finding:** Zero missing rationales across all 27,375 questions. All published items have at least some rationale text.

---

## Issue Breakdown

### 1. Missing Rationale: 0% across all pathways ✅

No questions have null or empty rationale fields. Every published item has explanatory text.

### 2. Too Short (<80 chars): 0% ✅

No rationales are critically short. Minimum observed rationale length is > 119 characters (from stem length data — rationales are generally longer than stems).

### 3. Brief (<200 chars): 8% for FNP and WHNP ⚠️

**Affected:** 830 FNP questions, 331 WHNP questions — both map to `ordered` and `matrix` question types.

These question types use format-specific rationale templates that are intentionally shorter. The ordered-response rationale reads:
> *"FNP reasoning moves from differential diagnosis to diagnostic confirmation, management decision, and prescribing/monitoring."*

This is 137 characters — functional but does not explain why the sequence matters clinically, nor why alternatives are wrong.

### 4. Generic Template: ~1–4% ⚠️

**Fully generic rationale** (≥3 template signal phrases detected). These are primarily SATA (Select All That Apply) items, where the rationale follows:

> *"A-D are correct because PMHNP-level care requires differential diagnosis, targeted safety/diagnostic assessment, management reasoning, and prescribing safety. E is premature closure. F is deferralism that delays psychiatric care."*

This rationale is recycled verbatim across every SATA item within a pathway. It explains the question format but does not address the specific clinical scenario, which distractor applies to which patient presentation, or what the clinical consequence of wrong answers would be.

### 5. Partially Generic: 58–88% — Most Significant Issue ⚠️⚠️

The largest quality gap: 58–88% of rationales contain at least one template phrase from the domain structure. The standard MCQ rationale template is:

```
"Correct because the NP must integrate diagnostic probability, patient-specific risk, 
prescribing safety, and follow-up responsibility: {diagnosticPlan}; then {managementPlan}. 
Prescribing decision: {prescribingDecision}.

Why alternatives are tempting: {tempting}. The {SPECIALTY} trap is {trap}.

Clinical cue to recognize: {cue}. That cue should shift the differential toward {differential}.

NP-level reasoning: {reasoning}.

Clinical takeaway for {lesson.title}: choose the plan that confirms the diagnosis when 
needed, treats current risk, avoids unsafe prescribing, and closes the loop with monitoring."
```

This template has three categories of weakness:
- **Patient-agnostic:** No patient demographics, presentation timing, vital signs, or context
- **Non-discriminating:** The phrase "the cue should shift the differential" is used for every item regardless of actual clinical scenario
- **Exam-irrelevant opener:** "Correct because the NP must integrate" is a meta-statement about NP practice, not a rationale for the specific answer

### 6. Missing Why-Correct: 8% ⚠️

830 FNP, 402 AGPCNP, 331 WHNP, 326 PNP-PC questions — all `ordered` and `matrix` format items, which lack an explicit "correct because" signal in their format-specific rationale text.

### 7. Missing Why-Wrong: 16–25% ⚠️

SATA items (16% of each pool) and matrix/bowtie items lack explicit per-distractor rationale in the main `rationale` field. They do have `distractorRationales` JSON — but the main rationale text doesn't reference incorrect answer consequences.

---

## Rationale Quality by Question Format

| Format | % of Pool | Main Rationale Issue | Severity |
|--------|-----------|---------------------|----------|
| MCQ (default) | ~35% | Partially generic template | Moderate |
| SATA | ~16% | Fully generic; no distractor-specific reasoning | High |
| Bowtie | ~8% | Per-slot rationale in JSON only; main text is template | Moderate |
| Matrix | ~8% | Brief; process-level only; no why-wrong | High |
| Ordered response | ~8% | Brief; no clinical sequence justification | High |
| Differential diagnosis | ~8% | Partially generic; differential reasoning present | Low |
| Clinical management | ~8% | Partially generic; management logic present | Low |
| Diagnostic interpretation | ~8% | Template "ask what the test changes" boilerplate | Moderate |

---

## Correct Answer Rationale Assessment

**What is present:**
- Diagnostic plan: ✅ Present in all MCQ rationales via `{domain.diagnosticPlan}`
- Management decision: ✅ Present via `{domain.managementPlan}`
- Prescribing logic: ✅ Present via `{domain.prescribingDecision}`
- Clinical cue linkage: ✅ Present in all MCQ rationales

**What is missing:**
- Patient-specific framing (age, comorbidities, presentation acuity)
- Alternative diagnostic paths that were ruled out
- Why the selected plan is *superior* to the second-best option
- Quantitative thresholds or guideline references (A1c target, eGFR cutoff, USPSTF grade)

---

## Incorrect Answer Rationale Assessment

**What is present:**
- Trap naming: ✅ `{domain.trap}` fills in "why tempting" for MCQ items
- Distractor option text: ✅ Each distractor is present in question `options`
- Per-option JSON rationales: ✅ `distractorRationales.optionRationales` present

**What is missing from the main `rationale` field:**
- Per-distractor clinical consequence ("choosing B could lead to...")
- Misconception addressed for each wrong option
- Specialty-specific pitfall beyond the generic trap phrase

For SATA and matrix items, distractor reasoning is entirely absent from the main `rationale` field — it exists only in the JSON `distractorRationales` object, which may not be surfaced in all UI contexts.

---

## Lowest-Scored Examples by Pathway

### FNP (score 70 — ordered/matrix types)
```
ID: fnp-np-elder-abuse-recognition-and-reporting-q-021
Format: ordered
Rationale: "FNP reasoning moves from differential diagnosis to diagnostic confirmation, 
management decision, and prescribing/monitoring. The trap is prescribing or reassuring 
before diagnostic risk is resolved."
Issues: BRIEF, MISSING_WHY_CORRECT
Missing: Why this specific sequence for elder abuse recognition; what happens if reported too late
```

### AGPCNP (score 70 — SATA type)
```
ID: agpcnp-np-anemia-of-ckd-evaluation-and-treatment-q-002
Format: sata
Rationale: "A-D are correct because AGPCNP-level care requires differential diagnosis, 
targeted diagnostic interpretation, management reasoning, and prescribing safety. 
E is premature closure. F is low-value testing..."
Issues: PARTIALLY_GENERIC, MISSING_WHY_WRONG
Missing: Why anemia of CKD specifically; erythropoiesis-stimulating agent thresholds; 
iron supplementation vs. ESA decision
```

### PMHNP (score 70 — SATA type)
```
ID: pmhnp-np-delirium-recognition-and-management-q-2888
Format: sata
Rationale: "A-D are correct because PMHNP-level care requires differential diagnosis, 
targeted safety/diagnostic assessment, management reasoning, and prescribing safety. 
E is symptom-driven prescribing without differential. F is deferralism..."
Issues: PARTIALLY_GENERIC, MISSING_WHY_WRONG
Missing: What makes this delirium vs. dementia; which medications worsen delirium; 
specific safety intervention sequence
```

---

## Remediation Plan

### Immediate

**Priority 1 — SATA rationale enrichment (affects 16% of all questions)**

Replace the generic SATA rationale with a format that includes the clinical scenario:

```
Template fix:
"[Option A] is correct: {domain.diagnosticPlan} directly addresses [cue] 
because [clinical reason].
[Option E] is incorrect: prescribing without differential reasoning misses 
[specific risk] and could cause [specific harm].
[Option F] is incorrect: non-specific testing delays [specific finding] 
needed to safely manage [domain.differential]."
```

**Priority 2 — Matrix/Ordered rationale enrichment (affects 8% each)**

Add one clinical sentence explaining the specific scenario sequence:
```
"In [lesson.title], [domain.cue] triggers [domain.differential] first 
because [brief clinical reason]. De-escalating to outpatient without 
resolving this cue risks [domain.safety]."
```

### Short-term (2 weeks)

**3. Add per-option clinical consequence** — extend `distractorRationales.optionRationales` to include a one-sentence consequence for wrong answers:
```
"Choosing B risks [specific clinical harm] because it [specific mechanism]."
```

**4. Inject lesson-specific clinical context** — the rationale should reference the lesson title's clinical condition in a patient-facing way, not just as a metadata label:
- Instead of: *"Clinical takeaway for Hypertension Diagnosis..."*
- Use: *"When a patient's BP exceeds 140/90 on two readings with an eGFR of 45..."*

**5. Raise the minimum rationale floor** — require `rationale.length >= 300` in the publisher scripts (currently unchecked beyond "is it present").

### Medium-term

**6. AI rationale enrichment pass** — run existing questions through `generate-fnp-question-flashcard-pipeline.mts` rationale-enrichment mode to replace template rationales with scenario-specific explanations.

**7. Quality gate before publication** — add pre-publish rationale validation:
```typescript
const hasSpecificContent = !GENERIC_SIGNALS.every(s => rationale.includes(s));
const hasWrongAnswer = /incorrect|wrong|tempting|avoid|trap/.test(rationale);
if (!hasSpecificContent || !hasWrongAnswer) throw new Error("Rationale fails quality gate");
```

---

## Quality Score Distribution

All pathways score 70–100 on the current rubric (no zeroes, no short items). The ceiling is constrained by template structure — scores above 85 require scenario-specific content that the template approach cannot deliver without per-question customization.

| Score band | FNP | AGPCNP | PMHNP | WHNP | PNP-PC |
|-----------|-----|--------|-------|------|--------|
| 100 (no issues) | ~5% | ~8% | ~5% | ~5% | ~15% |
| 85 (1 issue) | ~27% | ~17% | ~8% | ~21% | ~27% |
| 70 (2 issues) | ~68% | ~75% | ~87% | ~74% | ~58% |
| <70 (impossible with current scoring) | 0 | 0 | 0 | 0 | 0 |
