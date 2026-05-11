export type AdvancedEcgLessonStatus = "draft" | "review_ready" | "published";

export type AdvancedEcgLessonTopicKey =
  | "systematic_interpretation"
  | "axis_basics"
  | "rate_calculation"
  | "intervals_pr_qrs_qt"
  | "sinus_rhythms"
  | "atrial_rhythms"
  | "junctional_rhythms"
  | "av_blocks"
  | "ventricular_rhythms"
  | "paced_rhythms"
  | "stemi_localization_basics"
  | "ischemia_infarction_patterns"
  | "electrolyte_ecg_changes"
  | "drug_toxicity_ecg_changes"
  | "artifact_vs_true_rhythm"
  | "unstable_rhythm_recognition"
  | "acls_rhythm_priorities";

export const ADVANCED_ECG_REQUIRED_TOPIC_KEYS: readonly AdvancedEcgLessonTopicKey[] = [
  "systematic_interpretation",
  "axis_basics",
  "rate_calculation",
  "intervals_pr_qrs_qt",
  "sinus_rhythms",
  "atrial_rhythms",
  "junctional_rhythms",
  "av_blocks",
  "ventricular_rhythms",
  "paced_rhythms",
  "stemi_localization_basics",
  "ischemia_infarction_patterns",
  "electrolyte_ecg_changes",
  "drug_toxicity_ecg_changes",
  "artifact_vs_true_rhythm",
  "unstable_rhythm_recognition",
  "acls_rhythm_priorities",
] as const;

export type AdvancedEcgLessonSections = {
  electrophysiology: string;
  lead_method: string;
  criteria: string;
  findings: string;
  morphology: string;
  common_causes: string;
  clinical_significance: string;
  hemodynamic_risk: string;
  nursing_priorities: string;
  escalation: string;
  acls_relevance: string;
  treatment_overview: string;
  telemetry_icu_pearls: string;
  common_misreads: string;
  lookalikes: string;
  safety_warnings: string;
};

export type AdvancedEcgLessonContent = {
  topicKey: AdvancedEcgLessonTopicKey;
  unitSlug: string;
  title: string;
  status: AdvancedEcgLessonStatus;
  stripAssetReviewStatus: "clinical-review-required" | "generated_review_required" | "curated_static_review";
  clinicalReviewNotes: string;
  sections: AdvancedEcgLessonSections;
};

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function countAdvancedEcgLessonWords(lesson: AdvancedEcgLessonContent): number {
  return Object.values(lesson.sections).reduce((sum, section) => sum + countWords(section), 0);
}

function lesson(input: AdvancedEcgLessonContent): AdvancedEcgLessonContent {
  return input;
}

export const ADVANCED_ECG_LESSON_CONTENT: readonly AdvancedEcgLessonContent[] = [
  lesson({
    topicKey: "systematic_interpretation",
    unitSlug: "foundations",
    title: "Systematic ECG Interpretation",
    status: "review_ready",
    stripAssetReviewStatus: "generated_review_required",
    clinicalReviewNotes: "Framework content is ready for clinician review; strip examples must stay review-gated until validated.",
    sections: {
      electrophysiology:
        "A systematic ECG read is valuable because every rhythm strip is a snapshot of atrial depolarization, AV-node delay, ventricular depolarization, and repolarization. Premium interpretation starts by understanding what each waveform represents physiologically rather than jumping to pattern labeling.",
      lead_method:
        "Use the same order every time: confirm signal quality, identify the lead, calculate rate, judge regularity, inspect P waves, measure PR, evaluate QRS width, assess QT or QTc when relevant, then integrate ST-T changes with the clinical presentation. This preserves speed under pressure without sacrificing accuracy.",
      criteria:
        "The method is considered complete when it identifies whether the tracing is sinus or non-sinus, narrow or wide, regular or irregular, perfusing or unstable, and whether ischemia, conduction delay, pacing, artifact, or metabolic toxicity needs to be considered before naming a final diagnosis.",
      findings:
        "Premium-level findings include explicit attention to rate range, regularity pattern, atrial activity, PR behavior, QRS width and morphology, QT behavior, ST shift, T-wave contour, and whether the strip quality is good enough to trust. Each finding should either strengthen or weaken the leading interpretation.",
      morphology:
        "Morphology clues matter because similar rates can carry very different risk. A wide monomorphic rhythm suggests a different bedside response than a narrow regular tachycardia, and subtle beat-to-beat variability can separate artifact, ectopy, and progressive conduction disease.",
      common_causes:
        "Interpretation errors often happen in pain, sepsis, electrolyte shifts, ischemia, medication exposure, device pacing, hypoxia, and shock because clinicians anchor on a single feature. The systematic method is designed to prevent that by forcing a full review before action.",
      clinical_significance:
        "The significance of a systematic read is not academic; it determines whether the nurse monitors, notifies, activates rapid response, prepares cardioversion, defibrillation, pacing support, electrolyte correction, or urgent reperfusion. A premium course should train the decision pathway, not only the label.",
      hemodynamic_risk:
        "Hemodynamic risk rises when rate is too fast or too slow to maintain output, when AV synchrony is lost, when ventricular activation is severely abnormal, or when ischemia impairs contractility. Systematic interpretation must always ask whether the patient can perfuse through the rhythm that is being seen.",
      nursing_priorities:
        "Bedside priorities are to verify lead placement and monitor quality, assess symptoms and perfusion, compare with baseline, obtain vitals, confirm pulse, and bring the rhythm into the clinical story. Nursing action begins with whether the patient is stable, not with memorizing the prettiest rhythm name.",
      escalation:
        "Escalate immediately for chest pain, hypotension, diaphoresis, syncope, acute mental-status change, respiratory distress, poor waveform quality masking instability, new wide-complex tachycardia, high-grade block, arrest rhythm patterns, or any tracing that suggests ongoing infarction.",
      acls_relevance:
        "The ACLS link is that the same systematic steps help decide whether a rhythm is shockable, whether synchronized cardioversion is possible, whether bradycardia pacing is indicated, and whether the tracing represents pulseless arrest, peri-arrest deterioration, or a stable dysrhythmia requiring monitoring.",
      treatment_overview:
        "Treatment follows the interpretation: fix artifact, oxygenate and support perfusion, correct electrolytes, hold toxic medications, prepare reperfusion, cardiovert unstable tachyarrhythmias, defibrillate shockable arrest rhythms, or pace severe symptomatic bradycardia according to the clinical context.",
      telemetry_icu_pearls:
        "In telemetry and ICU settings, the systematic method must be fast enough for repeated use but disciplined enough to avoid false reassurance from monitor labels. Trend changes, compare to previous strips, and treat the monitor as a clue generator rather than the final authority.",
      common_misreads:
        "Common errors include trusting automated rhythm labels, ignoring artifact before measuring intervals, miscalling wide tachycardia as SVT with aberrancy, overlooking AV dissociation, naming PEA from the strip alone, and calling ischemia without checking lead placement or baseline abnormalities.",
      lookalikes:
        "Systematic interpretation is especially helpful when comparing AFib vs artifact, SVT vs VT, Wenckebach vs blocked PACs, paced rhythm vs wide ventricular escape, and STEMI vs repolarization abnormality. The method forces the clinician to compare evidence rather than chase a hunch.",
      safety_warnings:
        "Never diagnose arrest or instability from monitor rhythm alone without checking the patient. Never shock artifact. Never assume a regular monitor tracing means perfusion is present. Never treat the strip in isolation when symptoms, medication history, electrolyte status, and ischemic risk change urgency.",
    },
  }),
  lesson({
    topicKey: "axis_basics",
    unitSlug: "foundations",
    title: "Axis Basics",
    status: "review_ready",
    stripAssetReviewStatus: "generated_review_required",
    clinicalReviewNotes: "Axis teaching uses educational examples and remains review-gated until mapped against validated 12-lead references.",
    sections: {
      electrophysiology:
        "Axis describes the overall direction of ventricular depolarization in the frontal plane. It changes when conduction pathways are altered, ventricular mass shifts, infarction removes electrical contribution, or lead placement is wrong. Knowing the axis helps connect morphology to mechanism instead of memorizing lead trivia.",
      lead_method:
        "Use the frontal limb leads method: inspect QRS polarity in leads I and aVF first, then refine with lead II if the axis is borderline. In a premium workflow, axis is always interpreted only after lead quality and limb-lead placement look trustworthy.",
      criteria:
        "Normal axis usually has a positive QRS in I and aVF. Left axis deviation usually leaves lead I positive and aVF negative, while right axis deviation often makes lead I negative and aVF positive. Extreme axis tends to push both leads negative.",
      findings:
        "Axis findings should be documented with the clinical meaning attached. For example, new left axis deviation in a patient with chest pain raises different questions than chronic left-axis deviation in a patient with known conduction disease and stable vitals.",
      morphology:
        "Morphology clues such as left anterior fascicular block patterns, inferior infarction, bundle branch block, ventricular pacing, and ventricular tachycardia can all distort axis. The premium learner should use axis as one clue among many, not as a solitary diagnosis engine.",
      common_causes:
        "Common causes of axis change include ventricular hypertrophy, fascicular block, prior infarction, paced activation, congenital anatomy, severe pulmonary disease, and technical errors such as reversed limb leads. The wrong setup can mimic pathology, so lead verification matters.",
      clinical_significance:
        "Axis helps localize conduction disease, supports recognition of fascicular involvement, and can sharpen suspicion for ventricular origin when a rhythm is wide. It is rarely the first lifesaving clue, but it becomes valuable when the rhythm or 12-lead picture is ambiguous.",
      hemodynamic_risk:
        "Axis by itself does not define instability, but abrupt axis shifts can accompany ischemia, conduction injury, ventricular rhythms, or worsening cardiomyopathy. In unstable patients, axis findings should speed deeper investigation rather than delay resuscitation priorities.",
      nursing_priorities:
        "Verify limb-lead placement, review the current clinical question, compare with prior ECGs, and avoid over-interpreting axis without the rest of the tracing. If the strip is noisy or limb leads are suspicious, fix that first before escalating a false abnormality.",
      escalation:
        "Escalate when axis change accompanies chest pain, new block, wide-complex tachycardia, syncope, hemodynamic compromise, or suspected lead reversal that is obscuring a critical rhythm diagnosis. The escalation point is the full picture, not the axis number alone.",
      acls_relevance:
        "Axis does not directly drive ACLS algorithms, but it supports interpretation of wide-complex rhythms, paced rhythms, and conduction disease in peri-arrest situations. In that setting, axis should clarify the rhythm, not distract from the shock-or-support decision.",
      treatment_overview:
        "There is no therapy for axis alone. Treatment targets the cause: ischemia, electrolyte derangement, fascicular or bundle branch disease, hypertrophy, pacing problems, or ventricular arrhythmia. Axis is a diagnostic signpost that helps direct the next intervention.",
      telemetry_icu_pearls:
        "Telemetry often lacks the full 12-lead context for reliable axis work, so ICU or telemetry staff should use axis mainly when a proper 12-lead or validated multi-lead tracing is available. If only a bedside monitor is present, rhythm and perfusion still come first.",
      common_misreads:
        "Common misreads include calling left axis deviation from reversed arm leads, treating isolated axis shift as STEMI, and using axis as the main reason to choose VT over SVT with aberrancy without checking AV association, capture beats, or the clinical context.",
      lookalikes:
        "Lead reversal, ventricular pacing, fascicular block, and ventricular ectopy can all distort frontal-plane appearance. Comparing current and prior ECGs and examining more than one lead prevents false certainty when the tracing looks unusual.",
      safety_warnings:
        "Never delay reperfusion, cardioversion, defibrillation, or bradycardia treatment while chasing axis calculations. Never act on axis if lead placement is clearly questionable. Axis is useful only when signal quality and clinical context make it trustworthy.",
    },
  }),
  lesson({
    topicKey: "rate_calculation",
    unitSlug: "foundations",
    title: "Rate Calculation",
    status: "review_ready",
    stripAssetReviewStatus: "generated_review_required",
    clinicalReviewNotes: "Rate-calculation instruction is procedural and review-gated while example strips are still under clinician validation.",
    sections: {
      electrophysiology:
        "Heart rate is the bedside expression of how quickly atrial or ventricular depolarization is occurring. Rate matters because cardiac output, coronary perfusion, diastolic filling, and oxygen demand all change as rhythms accelerate or slow.",
      lead_method:
        "For regular rhythms, use the 300-150-100 method or the six-second strip method consistently. For irregular rhythms, use a longer strip and count actual complexes rather than forcing a regular-rate shortcut. Premium interpretation always states whether the rate is atrial, ventricular, or both.",
      criteria:
        "A useful rate calculation should answer: is the rhythm bradycardic, normal, or tachycardic; is the rate likely driving symptoms; and is the measured rate trustworthy given artifact or variable conduction. A rate number without rhythm context is incomplete.",
      findings:
        "Rate findings should include whether the strip is regular enough for a box method, whether conduction is fixed or variable, and whether the atrial and ventricular rates diverge. Those details prevent missing atrial flutter, AV block, and ventricular escape states.",
      morphology:
        "Morphology still matters while calculating rate. A narrow tachycardia at 160 bpm implies a different bedside differential than a wide tachycardia at 160 bpm, and a slow rhythm with pacer spikes should not be interpreted like a native escape rhythm.",
      common_causes:
        "Rates rise with fever, pain, shock, hypovolemia, sepsis, stimulants, hypoxia, and re-entry tachycardia. Rates fall with vagal tone, medication effect, conduction disease, ischemia of the conduction system, hypothermia, and device malfunction.",
      clinical_significance:
        "Rate changes are clinically meaningful because they may be the first visible sign of compensation failing. Fast is dangerous when filling time and perfusion fall. Slow is dangerous when cerebral and coronary flow are compromised or when a block is progressing.",
      hemodynamic_risk:
        "Hemodynamic risk depends on more than the number, but extreme rates often predict instability. Narrow tachycardia can still cause shock if persistent, and moderate bradycardia can be catastrophic if it reflects high-grade block or poor perfusion.",
      nursing_priorities:
        "Confirm the monitor is accurate, compare pulse to monitor rate, assess symptoms, blood pressure, mental status, oxygenation, and chest pain, then decide whether this rate needs observation, urgent provider notification, rapid response, or ACLS-level action.",
      escalation:
        "Escalate for bradycardia with hypotension, altered mentation, ischemic symptoms, or shock signs; for tachycardia with chest pain, severe dyspnea, hypotension, poor perfusion, or collapse; and for any rate measurement that is being distorted by artifact in an unstable patient.",
      acls_relevance:
        "ACLS algorithms depend on whether the bradycardia or tachycardia is causing symptoms and whether a pulse exists. Accurate rate calculation is part of deciding whether to observe, medicate, cardiovert, pace, or move into arrest management.",
      treatment_overview:
        "Treatment is cause-based: restore volume, oxygenate, stop toxic drugs, correct electrolytes, address ischemia, manage sepsis, cardiovert unstable tachycardia, or pace symptomatic bradycardia. Rate calculation identifies urgency; it does not replace diagnosis.",
      telemetry_icu_pearls:
        "In telemetry and ICU settings, trending rate change often matters more than one isolated number. A patient who moves from sinus tachycardia at 110 to 145 with increasing ectopy or from 60 to 38 with new PR change deserves more concern than the raw number alone suggests.",
      common_misreads:
        "Common errors include using the regular rhythm box method on AFib, counting artifact spikes as QRS complexes, confusing atrial flutter atrial rate with ventricular response, and documenting a machine-generated rate without correlating it to pulse and symptoms.",
      lookalikes:
        "Rates can look similar across sinus tachycardia, atrial flutter with 2:1 conduction, SVT, monomorphic VT, junctional tachycardia, and paced rhythms. The number alone never distinguishes the rhythm family; it only frames the next interpretation step.",
      safety_warnings:
        "Never treat a monitor rate as real before checking waveform quality and the patient. Never ignore severe symptoms because the rate does not look extreme. Never assume a stable heart rate means a stable patient when the rhythm or perfusion picture is changing.",
    },
  }),
  lesson({
    topicKey: "intervals_pr_qrs_qt",
    unitSlug: "foundations",
    title: "Intervals: PR, QRS, QT and QTc",
    status: "review_ready",
    stripAssetReviewStatus: "generated_review_required",
    clinicalReviewNotes: "Interval teaching uses educational measurement examples and requires clinician review before broad learner exposure.",
    sections: {
      electrophysiology:
        "Intervals summarize conduction timing. PR reflects atrial-to-ventricular conduction through the AV node, QRS reflects ventricular depolarization, and QT covers depolarization plus repolarization. These timings connect directly to conduction disease, medication effects, ischemia, and arrhythmia risk.",
      lead_method:
        "Measure PR from P-wave onset to QRS onset, QRS from first ventricular deflection to final return to baseline, and QT from QRS onset to T-wave end. Use the lead with the clearest morphology, slow down if needed, and remember QTc adjusts QT for heart rate.",
      criteria:
        "Normal PR is usually 0.12 to 0.20 seconds. Normal QRS is usually narrow, often under 0.12 seconds. A prolonged QT or QTc raises concern for torsades risk, especially when the patient has syncope, electrolyte disturbance, or QT-prolonging medications.",
      findings:
        "Interval findings should describe whether delay is stable or progressive and whether it matches the patient’s rhythm. A long PR with every beat suggests first-degree AV block, while progressive change with dropped beats suggests Wenckebach. A wide QRS changes the differential for tachycardia and pacing.",
      morphology:
        "Morphology must be considered alongside intervals. A QRS that is wide because of bundle branch block is interpreted differently from a wide QRS due to ventricular tachycardia or ventricular pacing. A long QT in a noisy strip can be false if the T-wave end is unclear.",
      common_causes:
        "PR prolongation can result from AV nodal delay, ischemia, and medication effect. QRS widening can come from bundle branch block, hyperkalemia, ventricular rhythms, or pacing. QT prolongation can reflect electrolyte imbalance, congenital syndromes, ischemia, or drug toxicity.",
      clinical_significance:
        "Intervals matter because they predict instability before collapse happens. Progressive PR change may warn of worsening block. A newly wide QRS in an unstable patient may point toward ventricular origin. A prolonged QT warns that a seemingly organized rhythm may degenerate into torsades.",
      hemodynamic_risk:
        "Not every interval abnormality causes immediate shock, but certain combinations are dangerous: wide fast rhythms, high-grade block with bradycardia, QT prolongation with ectopy, or interval changes accompanying chest pain and hypotension. Premium interpretation connects interval change to perfusion risk.",
      nursing_priorities:
        "Ensure the strip is clean, compare to baseline ECGs, review medications and electrolytes, assess symptoms, and determine whether the interval change is an observation issue, a provider-notification issue, or a rapid-response issue. Interval findings become actionable when tied to the bedside picture.",
      escalation:
        "Escalate for new wide-complex rhythm, progressive AV block, QT prolongation with syncope or ectopy, bradycardia with poor perfusion, hyperkalemia features, or interval changes during acute coronary syndrome. These findings often move patients into a higher-risk bucket quickly.",
      acls_relevance:
        "PR and QRS findings guide ACLS bradycardia and tachycardia interpretation, while QT and QTc matter in torsades prevention and treatment. Interval measurement supports the resuscitation decision tree by clarifying what rhythm family the team is actually facing.",
      treatment_overview:
        "Treat the cause and protect the patient: correct electrolytes, stop offending drugs, monitor continuously, obtain a 12-lead, prepare pacing or cardioversion when indicated, and escalate ischemia management if interval change reflects acute injury or conduction compromise.",
      telemetry_icu_pearls:
        "In telemetry and ICU care, intervals should be trended rather than documented once. Repeatedly widening QRS, lengthening QTc after a medication change, or new PR prolongation in a septic or ischemic patient can signal deterioration before a dramatic rhythm change appears.",
      common_misreads:
        "Common errors include measuring the wrong T-wave end, calling U waves part of QT, overcalling QRS widening in paced rhythms without recognizing spikes, and ignoring lead quality when a prolonged PR or QT may be a measurement artifact.",
      lookalikes:
        "Long QT and prominent U waves can be confused in hypokalemia. Wide QRS from bundle branch block can mimic ventricular origin. Blocked PACs can mimic AV block. Measuring intervals correctly helps sort these lookalikes before a wrong escalation path is chosen.",
      safety_warnings:
        "Never give QT-prolonging drugs casually when the QTc is already long. Never dismiss a wide-complex rhythm as benign without assessing perfusion. Never assume a stable patient will stay stable when interval changes suggest conduction or repolarization failure is progressing.",
    },
  }),
  lesson({
    topicKey: "sinus_rhythms",
    unitSlug: "rhythm-interpretation",
    title: "Sinus Rhythms",
    status: "review_ready",
    stripAssetReviewStatus: "generated_review_required",
    clinicalReviewNotes: "Sinus rhythm topic is comprehensive but remains clinician-review-required until strip examples are validated against final learning objectives.",
    sections: {
      electrophysiology:
        "Sinus rhythms begin in the sinoatrial node and preserve the normal atrial-to-ventricular activation pathway. The premium learner should understand how sinus automaticity changes with autonomic tone, volume status, fever, pain, drugs, and intrinsic sinus-node disease.",
      lead_method:
        "Interpret sinus strips by first confirming that each QRS is preceded by a sinus P wave with consistent morphology and that the PR relationship remains appropriate. Then decide whether the issue is rate, respiratory variation, or superimposed ectopy rather than abandoning the sinus diagnosis entirely.",
      criteria:
        "The sinus family includes normal sinus rhythm, sinus bradycardia, sinus tachycardia, and sinus arrhythmia. All retain a sinus P-wave pattern before each conducted QRS, but the rate and regularity differ. Premium interpretation explains the difference instead of memorizing isolated numbers.",
      findings:
        "Findings should explicitly mention the rate range, whether the R-R interval is regular or phasically irregular, whether the PR interval stays stable, and whether there is evidence of physiologic compensation or pathologic stress driving the sinus response.",
      morphology:
        "Morphology clues are subtle but useful: normal upright P waves, narrow QRS complexes, consistent atrial activation, and a lack of dissociation. Changes in rate do not erase the sinus origin if the atrial morphology remains sinus.",
      common_causes:
        "Bradycardia may come from high vagal tone, medications, hypothermia, or sinus-node dysfunction. Tachycardia may come from pain, fever, shock, anemia, hypoxia, or stimulant exposure. Sinus arrhythmia is often respiratory and benign, but context still matters in critically ill patients.",
      clinical_significance:
        "Sinus rhythms are often physiologic responses, so the premium task is to decide when the rhythm is the problem and when it is a marker of another problem. Sinus tachycardia is often a warning sign of shock, infection, bleeding, or respiratory failure rather than a rhythm to suppress blindly.",
      hemodynamic_risk:
        "Risk is usually tied to the underlying cause and the rate’s effect on output. Severe bradycardia can reduce perfusion, and persistent tachycardia can shorten filling time and worsen ischemia. Sinus arrhythmia is usually low risk unless the patient’s broader picture is unstable.",
      nursing_priorities:
        "Assess why the sinus rate changed. Correlate it with pain, fever, oxygenation, volume status, medications, telemetry trend, and perfusion. The premium move is to treat the driver, monitor the response, and escalate when the sinus rhythm is signaling deterioration.",
      escalation:
        "Escalate symptomatic bradycardia, inappropriate persistent tachycardia with poor perfusion, and any sinus pattern accompanied by chest pain, hypotension, new oxygen requirement, acute confusion, or signs of shock. The rhythm may look simple while the patient is not.",
      acls_relevance:
        "Sinus rhythms intersect ACLS mainly through symptomatic bradycardia and the recognition that sinus tachycardia is not treated with unstable tachyarrhythmia algorithms. Learners must avoid using ACLS rhythm algorithms on a compensatory sinus response without identifying the cause.",
      treatment_overview:
        "Treatment is cause-focused: fluids for hypovolemia, oxygenation and respiratory support for hypoxia, fever or sepsis treatment, medication review, analgesia, and pacing support or atropine when true symptomatic bradycardia is compromising perfusion.",
      telemetry_icu_pearls:
        "In ICU and telemetry settings, sinus tachycardia is often the first objective clue that the patient is worsening. Trend the rate alongside urine output, oxygen need, blood pressure, lactate, pain, and temperature rather than congratulating yourself that the rhythm is still technically sinus.",
      common_misreads:
        "Common errors include dismissing sinus tachycardia as anxiety, overcalling sinus arrhythmia as AFib, and treating sinus bradycardia as benign without checking symptoms, conduction delay, drug effect, or inferior ischemia.",
      lookalikes:
        "Sinus tachycardia can resemble atrial flutter with 2:1 conduction or SVT. Sinus bradycardia can be confused with junctional rhythm when P waves are small. Sinus arrhythmia can be mistaken for AFib if the atrial activity is not inspected carefully.",
      safety_warnings:
        "Never treat sinus tachycardia reflexively with rate-slowing medication before checking whether the patient is compensating for shock, sepsis, hemorrhage, or hypoxia. Never ignore symptomatic bradycardia because the strip looks familiar or non-dramatic.",
    },
  }),
  lesson({
    topicKey: "atrial_rhythms",
    unitSlug: "rhythm-interpretation",
    title: "Atrial Rhythms",
    status: "review_ready",
    stripAssetReviewStatus: "generated_review_required",
    clinicalReviewNotes: "Atrial rhythm topic is review-ready, but strip examples remain internal until clinician signoff.",
    sections: {
      electrophysiology:
        "Atrial rhythms arise from ectopic atrial foci, re-entry circuits, or disorganized atrial activation. Premium learners should separate triggered ectopy such as PACs from sustained re-entry or fibrillatory patterns because bedside risk and treatment priorities differ.",
      lead_method:
        "Start by defining whether organized atrial activity is present. Then determine if the ventricular response is regular, irregularly irregular, or fixed with a conduction ratio. This method prevents mistaking flutter, fibrillation, atrial tachycardia, and frequent PACs for each other.",
      criteria:
        "Key atrial rhythm criteria include abnormal or absent sinus P waves, sawtooth flutter activity, irregularly irregular ventricular response, premature atrial beats with altered P-wave morphology, and narrow-complex tachycardia driven above the ventricles.",
      findings:
        "Document the atrial pattern, ventricular response, conduction ratio when visible, and whether the rhythm is intermittent or sustained. Premium interpretation names the atrial mechanism and also identifies why the patient may be unstable or thromboembolic risk may be elevated.",
      morphology:
        "Morphology clues include fibrillatory baseline in AFib, sawtooth flutter waves in atrial flutter, hidden retrograde atrial activation in certain SVTs, and premature differently shaped P waves in PACs. These clues matter most when the rate alone is misleading.",
      common_causes:
        "Atrial rhythms commonly emerge with structural heart disease, atrial stretch, valvular disease, ischemia, pulmonary disease, infection, alcohol use, thyroid dysfunction, postoperative stress, stimulant exposure, and electrolyte disturbance. The same rhythm can be benign in one context and dangerous in another.",
      clinical_significance:
        "Atrial rhythms matter because they can reduce atrial contribution to ventricular filling, produce rapid ventricular response, trigger hypotension, worsen heart failure, and increase embolic risk. In a premium course, the significance extends beyond naming AFib or flutter correctly.",
      hemodynamic_risk:
        "Risk rises when ventricular response is fast, the patient depends on atrial kick, or perfusion is marginal already. New AFib in sepsis, postoperative atrial flutter in ischemic heart disease, or SVT in decompensated heart failure can destabilize patients quickly.",
      nursing_priorities:
        "Confirm rate and perfusion, review symptoms, check for chest pain or dyspnea, correlate with blood pressure and oxygenation, obtain a 12-lead when needed, review anticoagulation history, and determine whether the rhythm is new, rapid, controlled, or intermittent.",
      escalation:
        "Escalate rapid AFib or flutter with hypotension, chest pain, pulmonary edema, altered mentation, or syncope. Escalate recurrent SVT that is not breaking, or frequent atrial ectopy if it signals worsening ischemia, stimulant toxicity, or electrolyte derangement.",
      acls_relevance:
        "Atrial rhythms intersect ACLS mainly through unstable tachycardia management. The premium learner should know when synchronized cardioversion is appropriate and when the patient instead needs cause-directed therapy, rate control, anticoagulation planning, or more careful monitoring.",
      treatment_overview:
        "Treatment can include rate control, rhythm control, anticoagulation assessment, vagal maneuvers for certain SVTs, synchronized cardioversion for unstable tachyarrhythmia, and treatment of infection, ischemia, hypoxia, thyroid disease, or electrolyte triggers.",
      telemetry_icu_pearls:
        "In telemetry and ICU care, atrial rhythms often appear as part of a bigger deterioration picture. New AFib in a critically ill patient should prompt evaluation of sepsis, volume status, ischemia, magnesium or potassium level, and medication exposures rather than rhythm labeling alone.",
      common_misreads:
        "Common errors include calling flutter AFib because the ventricular response is irregular, labeling artifact as fibrillation, missing blocked PACs that mimic AV block, and assuming every narrow regular tachycardia is sinus tachycardia without checking atrial activity.",
      lookalikes:
        "Compare AFib with irregular artifact, flutter with SVT, frequent PACs with sinus arrhythmia, and atrial tachycardia with sinus tachycardia. The premium move is to use atrial activity plus clinical context to separate them.",
      safety_warnings:
        "Never delay cardioversion of an unstable atrial tachyarrhythmia while debating the exact atrial label. Never assume AFib is chronic or low-risk without confirming history. Never ignore thromboembolic implications when a new atrial rhythm is identified.",
    },
  }),
  lesson({
    topicKey: "junctional_rhythms",
    unitSlug: "rhythm-interpretation",
    title: "Junctional Rhythms",
    status: "review_ready",
    stripAssetReviewStatus: "generated_review_required",
    clinicalReviewNotes: "Junctional examples remain internal until clinician review confirms teaching strips and lookalike comparisons.",
    sections: {
      electrophysiology:
        "Junctional rhythms arise from the AV junction when the sinus node fails to dominate or when conduction favors a junctional escape or accelerated junctional focus. The atria may activate retrograde, simultaneously, or not at all in visible fashion.",
      lead_method:
        "Interpret junctional rhythms by looking deliberately for absent, inverted, or retrograde P waves and then asking whether the QRS is narrow and whether the rate fits escape, accelerated, or tachycardic junctional behavior. Do not rely on rate alone.",
      criteria:
        "Core criteria are a regular narrow-complex rhythm with absent or inverted P waves and a junctional rate pattern. Escape rhythms are often slower, accelerated junctional rhythms are faster than escape but below classic SVT range, and junctional tachycardia is faster still.",
      findings:
        "Findings should document P-wave relationship, rate, regularity, QRS width, and whether there is evidence of AV dissociation, retrograde atrial activation, or medication effect. Premium interpretation explains why the rhythm is junctional rather than sinus or ventricular.",
      morphology:
        "Morphology is often deceptively simple because the QRS may remain narrow. The key clue is the P-wave relationship. Inverted P waves in inferior leads, P waves after the QRS, or absent visible P waves should raise suspicion that the junction is pacing the heart.",
      common_causes:
        "Common causes include sinus-node suppression, digoxin toxicity, inferior ischemia, postoperative states, excessive vagal tone, myocarditis, and transient conduction-system irritation. Junctional rhythms are often a marker of conduction-system stress rather than a standalone diagnosis.",
      clinical_significance:
        "Junctional rhythms matter because they may represent a backup escape state or a toxic or ischemic conduction disturbance. Losing normal atrial contribution can worsen symptoms in patients who depend on atrial kick, especially older adults and patients with ventricular stiffness.",
      hemodynamic_risk:
        "Slow junctional escape rhythms can reduce output, while accelerated junctional activity can signal digoxin toxicity or postoperative irritation. Risk is highest when the rhythm accompanies hypotension, ischemia, syncope, or progressive conduction disease.",
      nursing_priorities:
        "Assess symptoms, medication history, digoxin use, potassium and magnesium risk, ischemic symptoms, and recent procedures. Obtain a 12-lead if needed, compare with prior tracings, and confirm that the patient is perfusing adequately while you sort escape versus toxic or ischemic causes.",
      escalation:
        "Escalate symptomatic junctional bradycardia, junctional rhythms with hypotension or chest pain, and any tracing suspicious for digoxin toxicity or evolving inferior MI. Junctional rhythms deserve rapid escalation when they are new and the patient is not clearly stable.",
      acls_relevance:
        "Junctional escape or bradycardic junctional rhythms may enter symptomatic bradycardia pathways. Accelerated junctional rhythms are not ACLS shock rhythms, but they can signal clinical deterioration or toxicity that changes urgency and monitoring intensity.",
      treatment_overview:
        "Treatment depends on cause: hold offending medications, correct electrolytes, address ischemia, monitor, support perfusion, and use atropine or pacing support if symptomatic bradycardia is present. Toxic and postoperative causes require different follow-up plans.",
      telemetry_icu_pearls:
        "Junctional rhythms are easy to undercall in telemetry because the monitor often labels them sinus bradycardia or ‘regular rhythm.’ Slow down, inspect P-wave relationship, and connect the tracing to drug exposure, inferior wall symptoms, and pacing history.",
      common_misreads:
        "Common errors include calling junctional rhythm sinus bradycardia because the QRS is narrow, missing subtle retrograde P waves, and overlooking digoxin toxicity when nausea, vision changes, and junctional rhythm occur together.",
      lookalikes:
        "Junctional rhythm can resemble sinus bradycardia, low atrial rhythm, blocked PAC patterns, and ventricular pacing with poor spike visibility. The P-wave relationship and clinical context are the tie-breakers.",
      safety_warnings:
        "Never assume a narrow regular bradycardia is benign without checking for inferior ischemia, medication toxicity, or poor perfusion. Never continue digoxin casually when a new junctional rhythm appears in a symptomatic patient.",
    },
  }),
  lesson({
    topicKey: "av_blocks",
    unitSlug: "rhythm-interpretation",
    title: "AV Blocks",
    status: "review_ready",
    stripAssetReviewStatus: "curated_static_review",
    clinicalReviewNotes: "High-grade block content uses curated static references because unsupported generated conduction morphologies remain quarantined.",
    sections: {
      electrophysiology:
        "AV blocks reflect delayed or interrupted conduction from atria to ventricles. The premium learner must understand where the delay may sit, how conduction can worsen over time, and why some block patterns are observation problems while others are pre-pacing emergencies.",
      lead_method:
        "Read AV blocks by marching out the P waves first, then the QRS complexes, then studying PR behavior over time. The mistake to avoid is measuring one beat and calling the block without tracking conduction sequence across multiple cycles.",
      criteria:
        "First-degree AV block prolongs the PR but conducts every beat. Mobitz I progressively lengthens PR before dropping a beat. Mobitz II drops beats without progressive PR change. Third-degree block separates atrial and ventricular activity entirely with AV dissociation.",
      findings:
        "Document atrial regularity, ventricular regularity, PR pattern, dropped beats, QRS width, escape behavior, and symptoms. Premium interpretation should connect the tracing to whether the conduction problem is nodal, infranodal, evolving, or likely to destabilize the patient.",
      morphology:
        "Morphology helps risk-stratify block. A wide QRS in Mobitz II or complete heart block suggests more distal conduction disease and a lower threshold for pacing concern. Narrow complexes may still be serious but often imply a different substrate.",
      common_causes:
        "Causes include ischemia, myocarditis, fibrosis, medications such as beta blockers or calcium-channel blockers, digoxin effect, electrolyte disturbance, postoperative conduction injury, and degenerative conduction-system disease. Context is essential because treatment depends on the driver.",
      clinical_significance:
        "AV blocks matter because they can progress from well-tolerated delay to profound bradycardia, syncope, low output, or sudden deterioration. Premium teaching should separate memorized PR patterns from the real bedside question: how dangerous is this block for this patient right now?",
      hemodynamic_risk:
        "Risk is highest with Mobitz II, wide-complex escape, complete heart block, or any block causing symptoms, hypotension, ischemia, or poor perfusion. First-degree block alone is often low risk, but it can still be a clue to medication effect or conduction-system stress.",
      nursing_priorities:
        "Assess pulse, blood pressure, mental status, chest pain, oxygenation, medication exposures, and ischemic risk. Obtain a 12-lead, compare with previous tracings, verify whether the patient is symptomatic, and be ready to escalate if conduction is worsening or perfusion is falling.",
      escalation:
        "Escalate Mobitz II, complete heart block, any symptomatic block, and block with hypotension, syncope, acute MI, or wide-complex escape. These are not ‘watch and wait’ rhythms when the patient is unstable or progression is evident.",
      acls_relevance:
        "AV blocks intersect ACLS bradycardia management through atropine consideration, transcutaneous pacing preparation, vasoactive support, and pacing consultation. The premium learner should know that high-grade block often needs pacing readiness even if the patient has not yet collapsed.",
      treatment_overview:
        "Treatment includes stopping offending drugs, correcting electrolytes, addressing ischemia, continuous monitoring, and preparing temporary pacing when indicated. Complete heart block and symptomatic Mobitz II deserve urgent support rather than passive observation.",
      telemetry_icu_pearls:
        "Telemetry teams should compare serial strips and pay attention to rate slowing, PR evolution, and new wide escape rhythms. ICU staff should connect block patterns to inferior vs anterior ischemia, postoperative conduction injury, and drug infusions that can worsen AV delay.",
      common_misreads:
        "Common errors include confusing blocked PACs with second-degree block, calling every prolonged PR ‘benign,’ and missing complete heart block because the atrial and ventricular rates each look regular when inspected separately.",
      lookalikes:
        "Blocked PACs, atrial flutter with variable conduction, junctional escape, and paced rhythms can all mimic AV block patterns. Marching out the atria and ventricles separately prevents many dangerous miscalls.",
      safety_warnings:
        "Never trust a stable appearance alone in Mobitz II or complete heart block. Never assume atropine will solve all high-grade block. Never delay pacing readiness when perfusion is poor or distal conduction disease is suspected.",
    },
  }),
  lesson({
    topicKey: "ventricular_rhythms",
    unitSlug: "telemetry",
    title: "Ventricular Rhythms",
    status: "review_ready",
    stripAssetReviewStatus: "generated_review_required",
    clinicalReviewNotes: "High-volume ventricular rhythm content is review-ready but remains internal until strip sets are clinically validated.",
    sections: {
      electrophysiology:
        "Ventricular rhythms arise below the AV node and activate the ventricles cell-to-cell rather than through the normal His-Purkinje system. That produces wide complexes, abnormal depolarization vectors, and a higher chance that the rhythm reflects severe instability or impending arrest.",
      lead_method:
        "Approach ventricular rhythms by determining whether the rhythm is perfusing, wide-complex, monomorphic or polymorphic, regular or chaotic, and whether capture beats, fusion beats, or AV dissociation are present. Perfusion status is checked in parallel with rhythm recognition.",
      criteria:
        "This topic covers PVCs, ventricular escape or idioventricular patterns where relevant, monomorphic VT, polymorphic VT including torsades, ventricular fibrillation, and asystole as an arrest rhythm endpoint. The premium learner should distinguish ectopy, sustained tachycardia, and arrest patterns clearly.",
      findings:
        "Key findings include wide bizarre QRS morphology, absent organized P-wave conduction, rapid ventricular rate, capture or fusion beats, twisting polymorphic amplitude in torsades, chaotic baseline in VF, and near-flatline with no organized ventricular complexes in asystole.",
      morphology:
        "Morphology drives management. Monomorphic VT suggests a stable re-entry circuit, polymorphic VT suggests dynamic repolarization failure, and VF represents complete loss of coordinated ventricular depolarization. PVC burden, couplets, triplets, and R-on-T timing can signal worsening electrical instability before collapse.",
      common_causes:
        "Common causes include ischemia, scar-related re-entry, cardiomyopathy, hypoxia, acidosis, electrolyte derangement, stimulant or drug toxicity, prolonged QT, severe heart failure, and worsening shock states. Ventricular rhythms rarely appear without a dangerous substrate.",
      clinical_significance:
        "Ventricular rhythms matter because they can collapse cardiac output quickly and may represent the final common pathway of ischemia, metabolic failure, or toxic conduction disturbance. A premium course must teach not only recognition but pre-arrest pattern detection and escalation timing.",
      hemodynamic_risk:
        "Risk ranges from palpitations with isolated PVCs to complete circulatory arrest in VF and asystole. Sustained VT can be tolerated briefly or can produce immediate hypotension depending on rate, ventricular function, and associated ischemia, so perfusion assessment is inseparable from the strip read.",
      nursing_priorities:
        "Check pulse, blood pressure, oxygenation, symptoms, mental status, and monitor quality immediately. Bring defibrillation resources close for unstable or arrest rhythms, draw attention to reversible causes, and review electrolytes, QT risk, ischemic symptoms, and medication exposures.",
      escalation:
        "Escalate sustained VT, polymorphic VT, frequent worsening ventricular ectopy with symptoms, VF, asystole, and any ventricular rhythm causing hypotension, chest pain, syncope, or acute respiratory distress. Escalation should be immediate because delay can close the window for successful intervention.",
      acls_relevance:
        "This topic is central to ACLS. VT with a pulse may require synchronized cardioversion or antiarrhythmic support. Pulseless VT and VF are shockable arrest rhythms. Torsades points toward magnesium and defibrillation support. Asystole is non-shockable and requires high-quality CPR and cause reversal.",
      treatment_overview:
        "Treatment can include oxygenation, reperfusion, electrolyte correction, magnesium, antiarrhythmics, cardioversion, defibrillation, CPR, vasopressors in arrest, and cause-targeted interventions. The premium learner must connect the exact rhythm pattern to the appropriate urgency and intervention branch.",
      telemetry_icu_pearls:
        "Telemetry and ICU staff should watch for increasing PVC burden, short-long-short sequences before torsades, new wide-complex tachycardia, and monitor-label overconfidence. In high-risk patients, the precursor patterns matter nearly as much as the final arrest rhythm itself.",
      common_misreads:
        "Common mistakes include calling VT SVT with aberrancy without enough evidence, missing torsades because the rhythm is only briefly captured, labeling artifact VF, and underestimating frequent ventricular ectopy in a patient with ischemia or severe electrolyte imbalance.",
      lookalikes:
        "Wide regular SVT with aberrancy, paced rhythms, artifact, hyperkalemia, bundle branch block, and ventricular escape can mimic ventricular pathology. The premium learner should compare width, regularity, P-wave relationship, clinical setting, and monitor quality before deciding.",
      safety_warnings:
        "Never delay treatment of unstable wide-complex tachycardia because the differential is not fully settled. Never shock artifact. Never assume isolated PVCs are benign when the patient is ischemic, hypokalemic, or already deteriorating.",
    },
  }),
  lesson({
    topicKey: "paced_rhythms",
    unitSlug: "pacemakers",
    title: "Paced Rhythms",
    status: "review_ready",
    stripAssetReviewStatus: "curated_static_review",
    clinicalReviewNotes: "Paced rhythm teaching remains annotation-led and clinician reviewed; unsupported generated pacing physiology stays internal-only.",
    sections: {
      electrophysiology:
        "Paced rhythms reflect device-triggered depolarization of the atrium, ventricle, or both. Understanding paced rhythms requires linking hardware behavior, chamber capture, sensing, and intrinsic conduction to the ECG appearance instead of treating pacer spikes like decorative marks.",
      lead_method:
        "Read paced rhythms by confirming spike visibility, identifying which chamber is being paced, deciding whether capture follows each spike, assessing the underlying rate and regularity, then looking for malfunction clues or unstable pacing scenarios.",
      criteria:
        "Core criteria include visible pacing spikes when expected, chamber-specific capture, appropriate relation between spikes and depolarization, and recognition of atrial paced, ventricular paced, and AV sequential patterns. Premium interpretation also includes temporary and emergency pacing contexts.",
      findings:
        "Key findings include spike timing, capture success, QRS width, atrial activity, fusion or pseudofusion clues, and any failure-to-pace, failure-to-sense, or failure-to-capture pattern. A paced strip should always be interpreted with the device purpose and patient stability in mind.",
      morphology:
        "Ventricular pacing usually creates a wide paced QRS, atrial pacing changes the P-wave timing, and dual-chamber pacing creates a more coordinated sequence. Morphology must be interpreted carefully because paced activation can mimic ventricular pathology if the device context is ignored.",
      common_causes:
        "Paced rhythms appear in chronic device patients, temporary pacing during unstable bradycardia, transcutaneous or transvenous pacing in emergencies, post-procedure monitoring, and patients with high-grade conduction disease or severe sinus-node dysfunction.",
      clinical_significance:
        "Paced rhythms matter because they often represent the patient’s safety net against severe bradycardia or AV block. Recognizing whether pacing is functioning appropriately may be more important than naming the underlying native rhythm in a deteriorating patient.",
      hemodynamic_risk:
        "Risk is high when capture fails, when sensing is inappropriate, when spikes appear without mechanical support, or when pacing is the only thing preventing profound bradycardia. Temporary pacing patients can destabilize rapidly if the system fails.",
      nursing_priorities:
        "Check pulse and perfusion, compare the strip to the expected device behavior, inspect the pacing system or insertion site when relevant, watch the monitor and the patient together, and be prepared to escalate malfunction or loss of capture immediately.",
      escalation:
        "Escalate failure to capture, failure to sense, failure to pace, symptomatic paced bradycardia, unstable temporary pacing situations, chest pain or hypotension in paced patients, and any situation where the strip suggests the device is not protecting perfusion as intended.",
      acls_relevance:
        "Paced rhythms intersect ACLS through symptomatic bradycardia and temporary pacing pathways. In peri-arrest patients, recognizing that pacing is failing or insufficient changes the algorithm branch and urgency of backup pacing or resuscitation support.",
      treatment_overview:
        "Treatment may include troubleshooting connections, adjusting pacer settings, preparing transcutaneous or transvenous pacing, correcting reversible causes, involving cardiology or electrophysiology, and resuscitating the patient if pacing failure leads to severe instability or arrest.",
      telemetry_icu_pearls:
        "ICU and telemetry teams should trend spike behavior and perfusion together. A beautiful row of pacer spikes means very little if capture is inconsistent or the patient’s blood pressure and mental status are worsening.",
      common_misreads:
        "Common errors include assuming every spike captures, calling all wide paced complexes VT, missing pseudofusion, and overlooking monitor artifact that hides spikes or mimics pacing failure.",
      lookalikes:
        "Paced rhythms can resemble bundle branch block, ventricular rhythms, artifact, and wide escape patterns. Device context, spike timing, and capture analysis separate them.",
      safety_warnings:
        "Never rely on the monitor alone for paced rhythm assessment. Never assume a paced patient is protected if perfusion is poor. Never publish unsupported synthetic pacing physiology as validated teaching content.",
    },
  }),
  lesson({
    topicKey: "stemi_localization_basics",
    unitSlug: "12-lead",
    title: "STEMI Localization Basics",
    status: "review_ready",
    stripAssetReviewStatus: "curated_static_review",
    clinicalReviewNotes: "Localization teaching depends on curated 12-lead references and stays review-gated until validated by clinician review.",
    sections: {
      electrophysiology:
        "STEMI localization links coronary occlusion territory to transmural injury and regional current-of-injury patterns on the 12-lead ECG. A premium course teaches why contiguous leads reflect the same wall rather than asking learners to memorize lead clusters mechanically.",
      lead_method:
        "Start with symptom context and lead quality, then inspect contiguous lead groups for ST elevation, look for reciprocal change, identify the likely wall involved, and ask whether additional posterior or right-sided leads are needed. Localization is more accurate when done systematically.",
      criteria:
        "Localization basics include recognizing inferior, anterior, septal, lateral, and high-lateral patterns through contiguous lead elevation and reciprocal change. The task is not simply to spot elevation but to identify which myocardial territory is signaling injury and how urgent reperfusion is.",
      findings:
        "Findings should include which leads are involved, whether reciprocal change is present, whether there is conduction disturbance or bradycardia suggesting inferior involvement, and whether the pattern looks dynamic or established. Premium interpretation also notes when the ECG is suspicious but not yet definitive.",
      morphology:
        "Morphology clues include convex or straight ST elevation, hyperacute T waves, reciprocal depression, new Q waves, and associated conduction findings. The premium learner should know that morphology plus territory matters more than one isolated tall ST segment.",
      common_causes:
        "The common cause is acute coronary occlusion, but the clinician must still compare the pattern against mimics such as early repolarization, pericarditis, left bundle branch block, paced rhythms, and baseline ventricular hypertrophy strain.",
      clinical_significance:
        "Localization matters because it predicts complications, culprit vessel, associated conduction problems, and the urgency of reperfusion. Inferior STEMI can travel with AV block and RV involvement; anterior STEMI can be large and hemodynamically devastating.",
      hemodynamic_risk:
        "Risk depends on territory size, ventricular function, RV involvement, conduction compromise, and timing. Large anterior infarction and inferoposterior infarction with hypotension can decompensate quickly and require intense monitoring and rapid catheterization activation.",
      nursing_priorities:
        "Obtain or confirm a clean 12-lead, monitor symptoms and vitals, activate the chest pain or STEMI pathway, prepare for reperfusion, avoid delays for nonessential tasks, and assess for complications such as hypotension, bradycardia, pulmonary edema, or cardiogenic shock.",
      escalation:
        "Escalate immediately for suspected STEMI pattern with compatible symptoms, especially with dynamic change, hemodynamic instability, new block, or ongoing pain. Time-to-reperfusion remains the main safety principle.",
      acls_relevance:
        "STEMI localization is not an ACLS rhythm algorithm by itself, but it heavily influences peri-arrest risk, bradycardia support decisions, and post-resuscitation reperfusion urgency. The rhythm and ischemia picture often interact in unstable patients.",
      treatment_overview:
        "Treatment centers on urgent reperfusion, antiplatelet and anticoagulant strategy per protocol, symptom support, oxygen only when indicated, hemodynamic management, and close surveillance for infarct-related dysrhythmia or shock.",
      telemetry_icu_pearls:
        "Telemetry and ICU teams should compare serial 12-leads, not just monitor strips, and recognize that evolving ST change can precede catastrophic rhythm change. Recurrent pain with evolving lead patterns deserves immediate attention.",
      common_misreads:
        "Common errors include calling every ST elevation STEMI, missing reciprocal clues, forgetting posterior involvement, and failing to obtain right-sided leads in inferior MI with hypotension or bradycardia.",
      lookalikes:
        "Pericarditis, early repolarization, ventricular aneurysm, left bundle branch block, and paced rhythms can all look ischemic. Territory consistency, symptoms, reciprocity, and serial change help separate them.",
      safety_warnings:
        "Never let diagnostic perfection delay reperfusion activation when the overall picture is strongly suspicious. Never assume normal telemetry means no STEMI risk. Never ignore posterior or RV extension when the patient is unstable.",
    },
  }),
  lesson({
    topicKey: "ischemia_infarction_patterns",
    unitSlug: "12-lead",
    title: "Ischemia and Infarction Patterns",
    status: "review_ready",
    stripAssetReviewStatus: "curated_static_review",
    clinicalReviewNotes: "Ischemia and infarction pattern content is review-ready and remains hidden from learner publication until clinician review is complete.",
    sections: {
      electrophysiology:
        "Ischemia alters repolarization, injury changes ST segments, and infarction reflects myocyte death with evolving Q-wave and structural changes. Premium interpretation distinguishes these pathophysiologic stages rather than collapsing them into ‘bad ST segments.’",
      lead_method:
        "Read ischemia and infarction patterns by checking symptoms, comparing current and prior ECGs, assessing contiguous changes, deciding whether the pattern is acute, evolving, reciprocal, or chronic, and then identifying whether the ECG fits ischemia, injury, infarction, or a mimic.",
      criteria:
        "Ischemia may produce T-wave inversion or dynamic ST depression, injury may produce ST elevation or depression depending on the process, and infarction may evolve Q waves or persistent changes over time. Premium criteria include time course and the relationship between pattern and symptoms.",
      findings:
        "Findings should state whether changes are contiguous, reciprocal, dynamic, persistent, or old, and whether they correlate with pain, biomarkers, and hemodynamics. The premium learner should articulate what the ECG suggests and how certain that suggestion is.",
      morphology:
        "Hyperacute T waves, straightening of the ST segment, reciprocal depression, new Q waves, and discordant changes in conduction abnormalities all matter. Morphology helps separate acute occlusion from chronic scar or repolarization variants.",
      common_causes:
        "Acute coronary syndrome is the classic cause, but demand ischemia, severe hypertension, shock, vasospasm, tachyarrhythmia, anemia, and structural heart disease can all produce ischemic-looking ECG change. The premium course teaches the ECG as a hemodynamic clue, not a standalone diagnosis.",
      clinical_significance:
        "These patterns matter because they can signal a time-sensitive coronary emergency, ongoing injury, or a patient at risk of dysrhythmia, pump failure, or infarct extension. Recognizing dynamic or worsening change is often more important than a single static label.",
      hemodynamic_risk:
        "Risk rises when ischemic change accompanies hypotension, pulmonary edema, VT or VF, bradycardia, cardiogenic shock, or refractory pain. Even non-ST-elevation patterns can herald severe disease when the patient is unstable.",
      nursing_priorities:
        "Obtain serial ECGs, monitor symptoms and perfusion, activate chest pain pathways appropriately, review biomarkers and timelines, maintain close telemetry surveillance, and escalate rapidly when changes are dynamic or the patient is deteriorating.",
      escalation:
        "Escalate new or worsening ischemic change, recurrent chest pain with dynamic ECGs, ischemic changes with arrhythmia or hypotension, and any pattern suggestive of acute coronary occlusion or infarct extension. The time sensitivity is clinical, not cosmetic.",
      acls_relevance:
        "Ischemic and infarction patterns matter in ACLS-adjacent care because they can precipitate lethal dysrhythmias, bradyarrhythmias, and post-arrest reperfusion decisions. Post-ROSC patients still need ischemia interpretation urgently.",
      treatment_overview:
        "Treatment includes reperfusion when indicated, anti-ischemic therapy, antithrombotic management per protocol, oxygen when appropriate, hemodynamic support, dysrhythmia prevention or treatment, and serial reassessment of pain and ECG response.",
      telemetry_icu_pearls:
        "Telemetry and ICU clinicians should treat evolving ECG changes as trends, not one-off images. Compare with baseline, watch for dysrhythmia coupling, and remember that worsening ischemia may first show as rate change, ectopy, or subtle ST drift before a dramatic STEMI pattern appears.",
      common_misreads:
        "Common errors include calling chronic repolarization abnormalities acute infarction, ignoring reciprocal change, dismissing posterior ischemia, and assuming a single normal ECG rules out evolving ACS in a high-risk symptomatic patient.",
      lookalikes:
        "Early repolarization, pericarditis, LVH strain, bundle branch block, paced rhythms, hyperkalemia, and ventricular aneurysm can mimic ischemia or infarction. Serial ECGs and clinical context are the premium differentiators.",
      safety_warnings:
        "Never reassure a high-risk symptomatic patient solely because the ECG is subtle. Never ignore dynamic change. Never separate ischemic interpretation from perfusion, chest pain, and dysrhythmia risk.",
    },
  }),
  lesson({
    topicKey: "electrolyte_ecg_changes",
    unitSlug: "telemetry",
    title: "Electrolyte ECG Changes",
    status: "review_ready",
    stripAssetReviewStatus: "generated_review_required",
    clinicalReviewNotes: "Electrolyte ECG content remains internal until clinician review confirms the teaching patterns and safety framing.",
    sections: {
      electrophysiology:
        "Electrolytes shape membrane potential, depolarization thresholds, and repolarization timing. Potassium, magnesium, and calcium abnormalities change conduction behavior and therefore change ECG appearance long before the patient necessarily arrests.",
      lead_method:
        "Interpret electrolyte-related ECG change by asking which ion disturbance best explains the morphology, whether the changes are diffuse or focal, and whether the patient’s medications, kidney function, and symptoms support the suspicion. Do not diagnose the electrolyte problem from the strip alone without context.",
      criteria:
        "Hyperkalemia often produces peaked T waves, PR prolongation, P-wave loss, and QRS widening as severity rises. Hypokalemia often produces flattened T waves, ST depression, prominent U waves, and ectopy. Magnesium and calcium disturbances can lengthen or shorten repolarization and raise torsades risk.",
      findings:
        "Findings should note whether the pattern fits early or severe disturbance, whether there is accompanying ectopy or instability, and whether the changes are diffuse enough to suggest a metabolic cause rather than focal ischemia or conduction-system disease.",
      morphology:
        "Morphology matters because peaked T waves, U waves, QT prolongation, and widening QRS complexes each imply different risk and urgency. Premium interpretation connects the morphology to the pathophysiology and to what may happen next if the disturbance is not corrected.",
      common_causes:
        "Common causes include renal failure, diuretics, GI losses, DKA treatment, endocrine disease, medication effects, dialysis issues, sepsis, and profound critical illness. Electrolyte patterns often signal system-wide instability rather than isolated rhythm trivia.",
      clinical_significance:
        "Electrolyte ECG changes matter because they can be reversible warning signs before ventricular dysrhythmia, block, or arrest. The premium learner should recognize them early enough to change labs, medication review, and bedside monitoring intensity.",
      hemodynamic_risk:
        "Risk rises when ECG change is severe, when the patient is already weak, hypotensive, bradycardic, or ectopic, and when QT prolongation or QRS widening suggests the myocardium is becoming electrically unstable. Hyperkalemia in particular can become an arrest rhythm progression problem quickly.",
      nursing_priorities:
        "Priorities are to confirm the tracing, obtain urgent labs, review renal status and medications, assess perfusion and symptoms, prepare continuous monitoring, and escalate when the ECG suggests a dangerous metabolic rhythm substrate rather than waiting for the chemistry result to confirm what is already likely.",
      escalation:
        "Escalate hyperkalemia patterns with bradycardia or widening QRS, hypokalemia with ventricular ectopy, QT prolongation with symptoms or torsades risk, and any electrolyte-linked ECG change in a patient who is unstable or critically ill.",
      acls_relevance:
        "Electrolyte patterns strongly influence ACLS because they create or sustain shockable and non-shockable rhythms. Hyperkalemia and hypomagnesemia are classic reversible causes of arrest and peri-arrest dysrhythmia that must be recognized from the bedside picture quickly.",
      treatment_overview:
        "Treatment is cause-based and urgent when severe: membrane stabilization for hyperkalemia, intracellular shift strategies, definitive potassium removal, potassium or magnesium replacement, QT-risk medication review, and close telemetry until ECG change reverses.",
      telemetry_icu_pearls:
        "ICU and telemetry teams should correlate ECG changes with medication drips, dialysis timing, urine output, GI losses, and serial lab results. Small morphology changes often precede dramatic deterioration and should not be brushed aside.",
      common_misreads:
        "Common errors include calling hyperkalemia STEMI because of peaked T waves, missing U waves in hypokalemia, ignoring torsades risk when QT is prolonged, and assuming a narrow QRS means the electrolyte disturbance is still mild.",
      lookalikes:
        "Hyperacute ischemic T waves, bundle branch block, pacing, and artifact can mimic electrolyte patterns. Potassium and magnesium disturbances also overlap with drug toxicity, so medication history helps separate them.",
      safety_warnings:
        "Never wait for a formal diagnosis when the ECG plus context suggests severe hyperkalemia. Never keep QT-prolonging medications running casually in a patient with electrolyte-linked repolarization risk. Never interpret electrolyte ECGs without connecting them to the chemistry and clinical picture.",
    },
  }),
  lesson({
    topicKey: "drug_toxicity_ecg_changes",
    unitSlug: "cases",
    title: "Drug and Toxicity ECG Changes",
    status: "review_ready",
    stripAssetReviewStatus: "generated_review_required",
    clinicalReviewNotes: "Drug-toxicity ECG content is internal until clinician review confirms the medication-specific framing and strip selection.",
    sections: {
      electrophysiology:
        "Drug and toxin ECG changes occur because medications alter ion channels, autonomic tone, AV nodal conduction, repolarization, or myocardial excitability. A premium course teaches the learner to connect mechanism of toxicity to the waveform rather than memorize isolated buzzwords.",
      lead_method:
        "Interpret toxicity patterns by reading the ECG systematically, then layering medication exposure and symptom context on top. Ask whether the pattern suggests bradycardic nodal suppression, QT prolongation, sodium-channel blockade, digoxin toxicity, or catecholamine-driven tachyarrhythmia.",
      criteria:
        "Important criteria include QT or QTc prolongation, junctional or block patterns in digoxin toxicity, bradycardia from nodal blockers, QRS widening from sodium-channel blockade, and ventricular ectopy or torsades in repolarization-toxic states. The ECG rarely stands alone.",
      findings:
        "Findings should include the exact conduction or repolarization abnormality, whether the patient is symptomatic, which medications or toxins plausibly fit, and whether the ECG suggests escalating electrical instability. This is where the premium learner adds pharmacology to pattern recognition.",
      morphology:
        "Morphology clues include scooped ST changes with digoxin effect, bradyarrhythmia or AV block in digoxin toxicity, long QT with torsades risk, and wide-complex sodium-channel blockade toxicity. Morphology helps sort toxicity patterns from ischemia and electrolyte mimics.",
      common_causes:
        "Common causes include digoxin toxicity, antiarrhythmic accumulation, tricyclic or sodium-channel blocker overdose, antipsychotic or antibiotic QT prolongation, beta-blocker and calcium-channel blocker excess, stimulant intoxication, and polypharmacy in renal or hepatic failure.",
      clinical_significance:
        "Drug ECG changes matter because they can be reversible if recognized early and catastrophic if missed. The premium learner should interpret them as patient-safety emergencies when symptoms, conduction delay, or repolarization failure suggest impending collapse.",
      hemodynamic_risk:
        "Risk is high when toxicity causes severe bradycardia, heart block, refractory hypotension, wide-complex instability, torsades risk, or malignant ventricular ectopy. The ECG may be the clue that pushes a vague overdose story into a high-acuity pathway.",
      nursing_priorities:
        "Review the medication list, timing, renal function, vital signs, symptoms, and labs; place the patient on continuous monitoring; obtain an accurate history when possible; and escalate suspected toxic patterns early rather than waiting for formal drug levels to return.",
      escalation:
        "Escalate symptomatic bradycardia on nodal agents, digoxin toxicity signs, prolonged QT with ectopy, sodium-channel blockade widening QRS, or any rhythm change suggesting overdose plus poor perfusion. These patients can deteriorate rapidly.",
      acls_relevance:
        "Drug toxicity intersects ACLS through reversible-cause recognition. Toxic bradycardia, torsades, ventricular arrest, and conduction-system collapse all require the team to support the patient while specific antidotal or cause-directed treatment is organized.",
      treatment_overview:
        "Treatment includes stopping the offending agent, correcting electrolytes, antidotal therapy when appropriate, pacing or vasoactive support for unstable bradycardia, magnesium for torsades risk, sodium bicarbonate for sodium-channel blockade patterns, and ICU-level monitoring when instability is likely.",
      telemetry_icu_pearls:
        "Telemetry and ICU teams should keep medication exposure in mind whenever the ECG changes without an obvious ischemic or structural explanation. Toxicity patterns often emerge gradually and are easy to undercall if the monitor is viewed without the MAR and lab trend.",
      common_misreads:
        "Common errors include calling digoxin toxicity ‘just AFib management,’ missing QT risk while giving more QT-prolonging medication, and labeling sodium-channel blocker toxicity as VT without recognizing the overdose context.",
      lookalikes:
        "Drug toxicity can resemble ischemia, electrolyte disturbance, ventricular rhythms, and AV block from other causes. Separating them requires medication history, lab review, and careful attention to repolarization and conduction patterns.",
      safety_warnings:
        "Never ignore a suspicious ECG because the medication dose seems routine; renal failure and interactions can change everything. Never keep adding QT-prolonging or nodal-blocking drugs without reassessing the evolving ECG and perfusion picture.",
    },
  }),
  lesson({
    topicKey: "artifact_vs_true_rhythm",
    unitSlug: "telemetry",
    title: "Artifact vs True Rhythm",
    status: "review_ready",
    stripAssetReviewStatus: "generated_review_required",
    clinicalReviewNotes: "Artifact discrimination content remains review-gated until example strips are clinically validated.",
    sections: {
      electrophysiology:
        "Artifact is not electrophysiology, which is why it is dangerous: it can mimic lethal rhythms without reflecting cardiac depolarization at all. Premium learners must know how real electrical activity should look so they can recognize when the tracing is lying.",
      lead_method:
        "Always start artifact evaluation by checking the patient, the pulse, and the monitor setup. Then compare multiple leads, look for preserved QRS marching through the noise, inspect baseline movement, and decide whether the apparent rhythm abnormality fits the patient’s clinical condition.",
      criteria:
        "Artifact is suggested by impossible morphology shifts, abrupt baseline wander, muscle tremor interference, monitor lead instability, and a mismatch between monitor rhythm and patient perfusion. A true rhythm abnormality should remain physiologically plausible across leads and correlate with the patient.",
      findings:
        "Important findings include whether one lead is cleaner than another, whether QRS complexes continue at a stable interval beneath the noise, whether the patient is awake and talking despite ‘VF’ on the monitor, and whether motion or procedure timing explains the change.",
      morphology:
        "Artifact often produces chaotic, erratic, or exaggerated deflections that do not behave like organized depolarization. It may simulate VT, VF, asystole, or ST change. Morphologic impossibility and cross-lead inconsistency are strong clues that the tracing is false.",
      common_causes:
        "Common causes include patient movement, tremor, shivering, loose leads, poor skin prep, electrical interference, chest physiotherapy, transport, and procedure manipulation. In ICU care, bed vibration and equipment movement frequently create misleading strips.",
      clinical_significance:
        "Artifact matters because it causes false alarms, unnecessary treatment, delayed recognition of the real rhythm, and dangerous interventions if clinicians shock or medicate noise. A premium telemetry course should make artifact discrimination a safety skill, not an afterthought.",
      hemodynamic_risk:
        "The main risk is clinical error. The patient may be stable while the monitor screams arrest, or the patient may be unstable while the team debates whether a messy tracing is artifact. The premium approach checks both tracing and perfusion at the same time.",
      nursing_priorities:
        "Check the patient first, verify pulse and mental status, inspect lead placement and cable integrity, stabilize the monitor input, print a strip from multiple leads when possible, and only then decide whether the rhythm truly needs escalation or treatment.",
      escalation:
        "Escalate when a true unstable rhythm remains likely after the artifact check, when the patient is symptomatic regardless of monitor quality, or when poor monitor quality is preventing safe care in a high-risk patient. Escalate equipment issues that repeatedly obscure true deterioration.",
      acls_relevance:
        "Artifact discrimination is an ACLS safety skill because shockable vs non-shockable decisions depend on real rhythm identification. The team must never defibrillate artifact or call PEA from a monitor without confirming the patient.",
      treatment_overview:
        "Treatment is to fix the monitor setup if artifact is the problem. If a true rhythm is present, then move immediately into the correct rhythm-specific response. The premium lesson trains the transition between those two possibilities safely and quickly.",
      telemetry_icu_pearls:
        "In telemetry and ICU environments, artifact often appears during turns, line care, procedures, and shivering. Experienced clinicians compare leads, keep a mental baseline of the patient’s usual rhythm, and know that not every alarm deserves the same kind of panic.",
      common_misreads:
        "Common errors include calling tremor artifact VF, mistaking pacing spikes for noise, assuming one dramatic lead tells the whole story, and ignoring the patient because the alarm tone is so convincing.",
      lookalikes:
        "Artifact can mimic AFib, VT, VF, asystole, ST elevation, and capture failure. Comparing lead consistency and patient perfusion separates fake rhythm from true rhythm.",
      safety_warnings:
        "Never shock a rhythm you have not confirmed. Never let artifact mask a patient who is actually unstable. Never trust monitor interpretation over pulse, pressure, mental status, and direct assessment.",
    },
  }),
  lesson({
    topicKey: "unstable_rhythm_recognition",
    unitSlug: "telemetry",
    title: "Unstable Rhythm Recognition",
    status: "review_ready",
    stripAssetReviewStatus: "generated_review_required",
    clinicalReviewNotes: "Unstable-rhythm content is review-ready and remains internal pending clinician validation of the example cases.",
    sections: {
      electrophysiology:
        "Unstable rhythm recognition is about understanding when electrical activity is no longer supporting effective perfusion. The same rhythm can be tolerated in one patient and catastrophic in another depending on rate, ventricular function, ischemia, and reserve.",
      lead_method:
        "Read the strip and the bedside simultaneously: define the rhythm family, then assess blood pressure, pulse quality, mentation, oxygenation, chest pain, and work of breathing. Premium recognition means the rhythm and the patient are never interpreted separately.",
      criteria:
        "Unstable rhythm criteria are clinical: hypotension, ischemic chest pain, altered mental status, shock signs, pulmonary edema, severe dyspnea, or collapse associated with the rhythm. The ECG supports the diagnosis, but the instability call is made at the bedside.",
      findings:
        "Document both electrical findings and instability markers. A regular narrow tachycardia at 180 bpm in a patient with chest pain and hypotension is unstable. A slow high-grade block with confusion and poor perfusion is unstable. The premium learner frames the whole physiologic picture.",
      morphology:
        "Morphology still matters because wide-complex unstable rhythms carry different differential and treatment paths than narrow-complex unstable rhythms, and paced or artifact patterns can mislead the team if morphology is not checked carefully.",
      common_causes:
        "Instability can result from ischemia, shock, hemorrhage, sepsis, electrolyte disaster, medication toxicity, structural heart disease, acute coronary occlusion, and conduction failure. Rhythm instability is often a marker of larger physiologic collapse.",
      clinical_significance:
        "Recognizing instability changes everything: it moves the team from diagnostic curiosity into rescue. Premium learners should know that an unstable rhythm is an emergency whether or not the exact label has been perfectly refined.",
      hemodynamic_risk:
        "Hemodynamic risk is the center of this topic. Poor cardiac output, coronary perfusion failure, cerebral hypoperfusion, and worsening pulmonary edema are the reasons the rhythm must be treated urgently. The patient’s perfusion tells you when the window is closing.",
      nursing_priorities:
        "Priorities are to call for help, bring the defibrillator or pacing support close, apply oxygen if indicated, obtain immediate vitals, confirm pulse, maintain IV access, prepare synchronized cardioversion or arrest interventions, and continue reassessment while the team mobilizes.",
      escalation:
        "Escalation should be immediate when a rhythm plus symptoms meet instability criteria. Waiting for a consultant, a second 12-lead, or a cleaner tracing is unsafe if the patient is hypotensive, confused, hypoxic, ischemic, or collapsing.",
      acls_relevance:
        "This topic is essentially the handoff point into ACLS: unstable tachycardia, symptomatic bradycardia, peri-arrest ventricular rhythms, and arrest rhythms all depend on recognizing that the patient is failing perfusion now, not later.",
      treatment_overview:
        "Treatment follows the rhythm family and the instability branch: synchronized cardioversion, pacing support, defibrillation, CPR, magnesium, vasopressors, reperfusion activation, oxygenation, or reversible-cause management. Premium teaching must connect symptom burden to intervention choice.",
      telemetry_icu_pearls:
        "In ICU and telemetry care, instability often appears before full collapse as rising ectopy, dropping pressure, changing mentation, or worsening dyspnea. The best clinicians act on the trajectory, not only the final disaster state.",
      common_misreads:
        "Common errors include assuming a stable-looking patient can wait because the rhythm label is not final, treating monitor alarms as the whole story, and underestimating unstable AFib, unstable SVT, or severe bradycardia because they are not classic VT/VF.",
      lookalikes:
        "Artifact can mimic instability, and compensated patients can look deceptively calm. Conversely, a familiar rhythm can become unstable in a fragile patient. That is why clinical assessment and ECG interpretation must travel together.",
      safety_warnings:
        "Never wait for certainty when the patient is clearly unstable. Never separate rhythm interpretation from perfusion assessment. Never let documentation, consultation delays, or device setup distract from immediate rescue priorities.",
    },
  }),
  lesson({
    topicKey: "acls_rhythm_priorities",
    unitSlug: "acls",
    title: "ACLS Rhythm Priorities",
    status: "review_ready",
    stripAssetReviewStatus: "curated_static_review",
    clinicalReviewNotes: "ACLS priority content uses curated algorithm-linked examples and stays internal pending clinician validation.",
    sections: {
      electrophysiology:
        "ACLS rhythm priorities distill electrophysiology into action: shockable ventricular chaos, unstable organized tachycardia, symptomatic bradycardia, and reversible-cause arrest patterns. Premium learners should understand why the electrophysiology maps to each branch rather than memorizing flowcharts alone.",
      lead_method:
        "Use the ACLS method deliberately: does the patient have a pulse, are they stable, is the rhythm shockable, is cardioversion synchronized, is pacing indicated, and what reversible causes are most plausible? The strip supports the algorithm but does not replace patient assessment.",
      criteria:
        "Shockable arrest rhythms are VF and pulseless VT. Non-shockable arrest rhythms are asystole and organized electrical activity without a pulse. Unstable tachycardia with a pulse points toward synchronized cardioversion. Symptomatic bradycardia may require atropine, pacing, or vasoactive support.",
      findings:
        "Findings should connect strip pattern to algorithm branch and patient status. The premium learner should state why a rhythm is shockable or not, why synchronized cardioversion is or is not appropriate, and why certain bradycardic rhythms need pacing readiness immediately.",
      morphology:
        "Morphology matters because it tells you whether you are dealing with polymorphic or monomorphic VT, paced versus native rhythms, wide-complex versus narrow-complex instability, or artifact masquerading as arrest. The algorithm is safer when morphology is respected.",
      common_causes:
        "Common causes include ischemia, hypoxia, electrolyte disaster, tamponade, toxins, thrombosis, tension physiology, hypovolemia, severe conduction disease, and medication effects. ACLS priority is stronger when the team is simultaneously thinking about reversible causes.",
      clinical_significance:
        "ACLS rhythm priorities matter because they convert recognition into lifesaving action under time pressure. The premium course should teach what must happen first, what must not be delayed, and which reversible-cause clues should be pursued in parallel.",
      hemodynamic_risk:
        "By definition these rhythms sit at the highest-risk end of the perfusion spectrum. Either the patient is already pulseless or they are close enough to circulatory failure that delayed intervention will likely worsen outcome.",
      nursing_priorities:
        "Nursing priorities include calling the code or rapid response, attaching monitor-defibrillator pads, confirming pulse status, preparing shocks or pacing, organizing meds and IV access, documenting timing, and communicating the rhythm interpretation in a way the team can act on immediately.",
      escalation:
        "Escalation is not optional in this topic. The whole point is recognizing when routine monitoring has ended and structured rescue care has begun. Delay is unsafe in shockable rhythms, unstable tachycardia, symptomatic high-grade block, or any organized rhythm without a pulse.",
      acls_relevance:
        "This topic is the ACLS relevance anchor. It integrates shockability, cardioversion, pacing, CPR, epinephrine timing, magnesium for torsades, and reversible-cause thinking. Premium learners should be able to explain why the algorithm branch fits the rhythm and patient state.",
      treatment_overview:
        "Treatment follows the priority branch: defibrillation and CPR for shockable arrest, CPR and cause reversal for non-shockable arrest, synchronized cardioversion for unstable tachycardia, atropine or pacing support for symptomatic bradycardia, and continual reassessment after every intervention.",
      telemetry_icu_pearls:
        "ICU and telemetry teams often see the warning phase before the code. Recognizing escalating ectopy, worsening bradycardia, changing conduction, recurrent VT, or pacing failure early can allow intervention before full arrest develops.",
      common_misreads:
        "Common errors include shocking artifact, calling PEA from the strip without checking the patient, forgetting synchronization for unstable tachycardia with a pulse, and treating compensatory sinus tachycardia like a primary unstable tachyarrhythmia.",
      lookalikes:
        "Pulseless VT vs artifact, wide unstable SVT vs VT, severe bradycardia vs pacing failure, and organized electrical activity with or without a pulse are the key lookalike problems that ACLS rhythm priorities must address safely.",
      safety_warnings:
        "Never let algorithm memory replace patient assessment. Never delay shocks for a true shockable rhythm. Never call a non-shockable arrest from the monitor alone. Never forget that reversible causes can make the difference between temporary response and real recovery.",
    },
  }),
].map((entry) => lesson(entry));

export function getAdvancedEcgLessonContent(topicKey: AdvancedEcgLessonTopicKey): AdvancedEcgLessonContent | null {
  return ADVANCED_ECG_LESSON_CONTENT.find((lesson) => lesson.topicKey === topicKey) ?? null;
}
