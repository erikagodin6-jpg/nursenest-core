# ECG Module Clinical Accuracy Audit

Date: 2026-05-11
Scope: learner ECG module, admin ECG workflow, ECG strip renderer, ECG question content, and RN/NP access and exam-scope behavior.

## Evidence base

Clinical validation in this audit was cross-checked against the following references:

- [LITFL: Atrial fibrillation ECG library](https://litfl.com/atrial-fibrillation-ecg-library/)
- [LITFL: Atrial flutter ECG library](https://litfl.com/atrial-flutter-ecg-library/)
- [LITFL: Supraventricular tachycardia ECG library](https://litfl.com/supraventricular-tachycardia-svt-ecg-library/)
- [LITFL: Ventricular fibrillation ECG library](https://litfl.com/ventricular-fibrillation-vf-ecg-library/)
- [LITFL: AV block 2nd degree Mobitz I / Wenckebach](https://litfl.com/av-block-2nd-degree-mobitz-i-wenckebach-phenomenon/)
- [LITFL: AV block 3rd degree / complete heart block](https://litfl.com/av-block-3rd-degree-complete-heart-block/)
- [LITFL: Pacemaker rhythms - normal patterns](https://litfl.com/pacemaker-rhythms-normal-patterns/)
- [StatPearls: Second-Degree Atrioventricular Block](https://www.ncbi.nlm.nih.gov/books/NBK482359/)
- [StatPearls: ST-Segment Elevation Myocardial Infarction](https://www.ncbi.nlm.nih.gov/books/NBK532281/)
- [American Heart Association: Adult Cardiac Arrest Algorithm](https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-CA-250527.pdf?sc_lang=en)
- [American Heart Association: Adult Bradycardia With a Pulse Algorithm](https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-Bradycardia-250514.pdf?sc_lang=en)

## Executive summary

- Access and exam alignment are mostly correct today: ECG is server-gated to RN and NP pathways, excluded from CAT and general study pools, and covered by hidden-module preview protections.
- The most serious clinical problem is not a label typo; it is that the deterministic strip renderer cannot actually express several conduction-pattern morphologies that the templates and validators claim it supports.
- AV block teaching is the highest-risk clinical gap. First-degree AV block, Mobitz I, Mobitz II, and third-degree AV block are represented in metadata, but the waveform engine does not model prolonged PR timing, nonconducted beats for Mobitz II, or visible AV dissociation.
- Publication safety is also too permissive for ECG. Auto-generated or promoted ECG questions can remain `pending` rather than clinically approved while still contributing to readiness counts or existing in the live ECG question table.

## Exam alignment and gating check

### Confirmed passes

- `src/lib/ecg-module/ecg-module-config.ts` limits ECG module access to RN and NP and explicitly blocks RPN and REx-PN exposure through `canAccessEcgModuleForTier()` and `assertNoEcgForRpn()`.
- `src/lib/practice-tests/cat-question-completeness.ts`, `src/lib/practice-tests/cat-pool.ts`, and `src/lib/study-question-pool/get-study-question-pool-for-pathway.ts` explicitly exclude ECG question formats and ECG-tagged rows from CAT and study pools.
- `src/lib/modules/hidden-module-preview.test.ts` covers hidden-module preview and non-indexed behavior, which aligns with the current requirement not to publish hidden ECG surfaces broadly.
- Premium and module-only routing behavior is preserved by `src/lib/ecg-module/ecg-module.server.ts` and the ECG route family under `src/app/modules/ecg/`.

### Scope note

- I did not find evidence in this pass that ECG is leaking into RPN/PN pools or general CAT/practice pools.
- The major risk is not entitlement leakage; it is clinical fidelity within the ECG-specific subsystem.

## Rhythm validation summary

### Acceptable or mostly acceptable at current learner-strip fidelity

- Normal sinus rhythm: metadata and render assumptions are acceptable for entry-level recognition.
- Sinus bradycardia: acceptable simplified sinus pattern with slower regular rate.
- Sinus tachycardia: acceptable simplified sinus pattern with faster regular rate.
- Atrial fibrillation: core teaching points are broadly correct because the strip is irregular and omits organized P waves.
- SVT: broadly acceptable as a rapid regular narrow-complex rhythm with hidden or absent visible P waves.
- PVCs: broadly acceptable for premature wide ectopy teaching.
- Ventricular tachycardia: acceptable as a rapid wide-complex rhythm for learner recognition.
- Ventricular fibrillation: acceptable as chaotic non-organized electrical activity.
- Asystole: acceptable as near-flatline nonshockable arrest rhythm.

### Requires correction or tighter clinical framing

- Atrial flutter: the template mixes ventricular response rate with the rhythm name and does not clearly teach the atrial activity rate or conduction distinction.
- First-degree AV block: label and metadata say prolonged PR, but the rendered strip does not actually prolong the PR interval.
- Second-degree AV block type I: label says progressive PR prolongation with dropped beat, but the renderer only drops a beat every fourth cycle and never visually lengthens the PR interval.
- Second-degree AV block type II: label says fixed PR with intermittent dropped QRS, but the renderer does not model nonconducted P waves for this pattern.
- Third-degree AV block: metadata says AV dissociation, but the renderer does not show independent atrial activity; the default regularity metadata is also misleading.
- STEMI pattern: the module uses a generic ST-elevation flag without lead context or infarction criteria, which is not enough for safe STEMI teaching if labeled too definitively.
- Hyperkalemia pattern: the strip teaches peaked T waves and QRS widening, but it does so as a generic single-strip label without stage framing or broader differential caution.
- Paced rhythm: waveform sequencing is internally inconsistent with standard pacing morphology teaching.

## Findings

### 1. AV block strips cannot visually match their labels

- File path: `src/lib/ecg-module/ecg-waveform-generator.ts`
- Rhythm/pattern: first-degree AV block, second-degree AV block type I/Wenckebach, second-degree AV block type II, third-degree AV block
- Current problem: the waveform generator never changes P-to-QRS timing for prolonged PR intervals, never progressively lengthens PR intervals, does not model dropped conducted QRS complexes for Mobitz II, and does not render independent atrial activity for AV dissociation. The only conduction-specific behavior implemented is a dropped beat every fourth cycle when `prIntervalPattern === "progressive_prolongation"`.
- Clinical risk level: critical
- Recommended correction: do not treat these AV block strips as clinically publishable until the renderer can model prolonged PR timing, true nonconducted beats, and AV dissociation. Add render-aware tests that verify interval timing and visible morphology rather than only metadata flags.
- Source/reference: [LITFL: Mobitz I / Wenckebach](https://litfl.com/av-block-2nd-degree-mobitz-i-wenckebach-phenomenon/), [StatPearls: Second-Degree AV Block](https://www.ncbi.nlm.nih.gov/books/NBK482359/), [LITFL: Third-degree AV block](https://litfl.com/av-block-3rd-degree-complete-heart-block/), [AHA Bradycardia Algorithm](https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-Bradycardia-250514.pdf?sc_lang=en)
- Safe now or needs RN/clinician review: needs RN or clinician review and a renderer rework before learner publication

### 2. Complete heart block regularity metadata is misleading

- File path: `src/lib/ecg-module/ecg-rhythm-templates.ts`
- Rhythm/pattern: third-degree AV block
- Current problem: the template marks complete heart block as `regularly_irregular`. Standard teaching is that atrial and ventricular activity march independently; the escape rhythm is typically regular even though the PR relationship varies because of AV dissociation.
- Clinical risk level: high
- Recommended correction: change the metadata to describe regular escape rhythm plus AV dissociation rather than `regularly_irregular`, but only after deciding how the simplified renderer will teach dual regular atrial and ventricular activity.
- Source/reference: [LITFL: Third-degree AV block](https://litfl.com/av-block-3rd-degree-complete-heart-block/), [AHA Bradycardia Algorithm](https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-Bradycardia-250514.pdf?sc_lang=en)
- Safe now or needs RN/clinician review: needs RN or clinician review because the metadata fix is tied to the broader rendering limitation

### 3. Atrial flutter rate metadata is underspecified and potentially misleading

- File path: `src/lib/ecg-module/ecg-rhythm-templates.ts`
- Rhythm/pattern: atrial flutter
- Current problem: `expectedRateRange: [75, 150]` reads like a rhythm-defining rate, but atrial flutter classically has atrial activity around 250 to 350 per minute with fixed or variable AV conduction. The current template appears to store ventricular response while the rhythm name implies the atrial rhythm itself.
- Clinical risk level: moderate
- Recommended correction: explicitly distinguish atrial flutter-wave rate from ventricular response in the teaching copy or metadata and avoid presenting 75 to 150 as the defining flutter rate.
- Source/reference: [LITFL: Atrial flutter ECG library](https://litfl.com/atrial-flutter-ecg-library/)
- Safe now or needs RN/clinician review: safe to clarify in wording after reviewer sign-off; not safe to silently reinterpret learner-facing teaching without review

### 4. Generic STEMI rendering is not lead-specific enough for a definitive STEMI label

- File path: `src/lib/ecg-module/ecg-rhythm-templates.ts`, `src/lib/ecg-module/ecg-waveform-generator.ts`
- Rhythm/pattern: STEMI / ST-elevation pattern
- Current problem: the renderer adds a generic ST plateau with `features.stElevation` but has no notion of contiguous leads, lead localization, reciprocal changes, or criteria thresholds. That can support a generic ST-elevation teaching pattern, but not a strong STEMI diagnostic claim from a single simplified strip.
- Clinical risk level: high
- Recommended correction: either relabel this content as a generic ST-elevation pattern or redesign the educational framing so learners are told this is a simplified recognition exercise that does not replace lead-based STEMI criteria and patient assessment.
- Source/reference: [StatPearls: STEMI](https://www.ncbi.nlm.nih.gov/books/NBK532281/)
- Safe now or needs RN/clinician review: needs RN or clinician review before any learner-facing diagnostic wording is tightened or expanded

### 5. Hyperkalemia strip framing risks overconfident diagnosis from a single simplified strip

- File path: `src/lib/ecg-module/ecg-rhythm-templates.ts`, `src/lib/ecg-module/ecg-waveform-generator.ts`
- Rhythm/pattern: hyperkalemia pattern
- Current problem: the model reduces hyperkalemia to peaked T waves plus QRS widening and treats that as a fixed rhythm template. That is acceptable as a narrow severe-pattern teaching aid, but not as a stand-alone diagnostic statement without context, differential, or severity staging.
- Clinical risk level: high
- Recommended correction: frame this as a hyperkalemia-associated ECG pattern, not a definitive diagnosis from one strip, and add explicit clinical correlation language if learner-facing rationales mention urgent treatment.
- Source/reference: [AHA Adult Cardiac Arrest Algorithm](https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-CA-250527.pdf?sc_lang=en) for reversible-cause framing, plus standard ECG electrolyte teaching expectations reflected in the module requirement itself
- Safe now or needs RN/clinician review: needs RN or clinician review

### 6. Paced rhythm morphology is internally inconsistent

- File path: `src/lib/ecg-module/ecg-waveform-generator.ts`
- Rhythm/pattern: paced rhythm
- Current problem: when `pWavePattern === "paced"`, the generator renders a small P-wave bump at approximately `-0.18` seconds and a pacer spike at approximately `-0.035` seconds. That makes the paced spike appear after the modeled atrial depolarization. The strip also does not distinguish atrial-paced from ventricular-paced from AV-paced morphology.
- Clinical risk level: moderate
- Recommended correction: choose a single explicit teaching target such as ventricular-paced rhythm with spike immediately before a wide QRS, or implement chamber-specific pacing modes rather than a generic paced label.
- Source/reference: [LITFL: Pacemaker rhythms - normal patterns](https://litfl.com/pacemaker-rhythms-normal-patterns/)
- Safe now or needs RN/clinician review: needs RN or clinician review before changing learner-facing pacing claims

### 7. ECG publish readiness can count pending or placeholder content toward module readiness

- File path: `src/lib/ecg-module/ecg-question-generation.ts`, `src/lib/ecg-module/ecg-module-readiness.ts`
- Rhythm/pattern: module-wide content safety
- Current problem: autogenerated ECG questions are created with generic distractors, generic placeholder rationales, and `medicalQaStatus: "pending"`. The readiness logic counts non-empty rationales and does not require approved medical QA for all ECG questions; it only blocks explicit validation failures and high-risk manual-review misses.
- Clinical risk level: high
- Recommended correction: exclude `pending` ECG questions from publish-readiness counts, require explicit medical QA approval for learner-publishable ECG rows, and prevent placeholder rationales from satisfying rationale coverage.
- Source/reference: internal code-path audit of `generateAndInsertEcgQuestionsForCategory()` and `getEcgModuleReadiness()`; safety concern reinforced by the requirement to avoid unverified AI-generated clinical claims
- Safe now or needs RN/clinician review: needs product plus clinician review because it affects module publish behavior, but it is a strong candidate for a follow-up safety hardening patch

### 8. Admin draft promotion can create ECG rows outside the validated ECG strip-review path

- File path: `src/app/api/admin/ai/drafts/questions/[id]/promote/route.ts`
- Rhythm/pattern: module-wide content safety
- Current problem: the general draft promotion route can create an `EcgVideoQuestion` with stem, options, rationale, rhythm tag, and RN/NP tiers, but it does not set `mediaType`, `mediaConfig`, `medicalQaStatus`, `manualReviewedAt`, or `manualReviewedBy`. That means ECG rows can be created outside the deterministic strip validation and explicit review path.
- Clinical risk level: high
- Recommended correction: hard-block ECG draft promotion unless a validated `mediaConfig` and explicit clinical QA fields are present, or route all ECG promotion through the ECG-specific admin workflow.
- Source/reference: internal code-path audit of `POST` in `src/app/api/admin/ai/drafts/questions/[id]/promote/route.ts`
- Safe now or needs RN/clinician review: needs engineering review first; clinically this should not be considered safe content promotion as-is

### 9. Strip validation checks metadata flags more than rendered morphology

- File path: `src/lib/ecg-module/ecg-strip-clinical-validation.ts`
- Rhythm/pattern: module-wide strip validation
- Current problem: the validator confirms metadata consistency such as rate range, regularity enum, `progressivePr`, or `avDissociation`, but it does not verify that the waveform engine can actually render the claimed morphology. That lets certain conduction and pacing patterns pass validation despite weak visual fidelity.
- Clinical risk level: moderate
- Recommended correction: add render-aware validation or deterministic waveform assertions for PR timing, dropped beats, AV dissociation, paced-spike timing, ST-segment behavior, and atrial activity.
- Source/reference: internal comparison of `validateEcgStripClinicalConfig()` against `generateEcgWaveform()` behavior
- Safe now or needs RN/clinician review: safe to improve technically, but clinician sign-off is still needed for morphology acceptance criteria

## Issues requiring clinician review

- All AV block learner-strip content and any curated questions that rely on current deterministic AV block rendering
- Any learner-facing STEMI wording that implies diagnosis from a simplified single strip without lead context
- Any learner-facing hyperkalemia wording that implies definitive diagnosis rather than pattern recognition plus clinical correlation
- Paced-rhythm teaching, unless the product decides to narrow to one clearly defined pacing mode

## Low-risk fixes applied in this pass

- None. I documented the findings first as requested.
- The currently identified problems are either clinically material or tied to publication behavior, so I did not make silent content or rendering changes in the same pass.

## Recommended next implementation pass

1. Safety-harden ECG publication paths so `pending` or media-less ECG questions cannot count as publish-ready.
2. Remove AV block strips from learner publication until the renderer can express PR timing, nonconducted beats, and AV dissociation.
3. Reframe simplified STEMI and hyperkalemia strips as pattern-recognition teaching assets rather than definitive diagnosis assets unless lead-aware content is added.
4. Add render-aware ECG morphology tests before re-enabling any corrected learner strip variants.
