import type {
  PathwayLessonRelatedRef,
  PathwayLessonSection,
} from "@/lib/lessons/pathway-lesson-types";
import type { ScopedGoldLessonInput, ScopedGoldProvider } from "@/lib/lessons/scoped-lessons/scoped-gold-registry";

export const ECG_RATE_CALC_GOLD_SLUG = "ecg-rate-calculation-basics-gold" as const;
export const ECG_INTERVALS_GOLD_SLUG = "ecg-interval-interpretation-pr-qrs-qt-gold" as const;
export const ECG_SINUS_ARRHYTHMIA_GOLD_SLUG = "ecg-sinus-arrhythmia-recognition-gold" as const;
export const ECG_JUNCTIONAL_GOLD_SLUG = "ecg-junctional-rhythm-recognition-gold" as const;

const ECG_ELIGIBLE_PATHWAYS = new Set<string>([
  "us-rn-nclex-rn",
  "ca-rn-nclex-rn",
  "us-np-fnp",
  "us-np-agpcnp",
  "us-np-pmhnp",
  "us-np-whnp",
  "us-np-pnp-pc",
  "ca-np-cnple",
]);

function examLabel(pathwayId: string): string {
  if (pathwayId === "ca-rn-nclex-rn") return "NCLEX-RN Canada";
  if (pathwayId === "ca-np-cnple") return "NP Canada";
  if (pathwayId.includes("-np-")) return "NP";
  return "NCLEX-RN US";
}

function related(...refs: Array<[string, string]>): PathwayLessonRelatedRef[] {
  return refs.map(([slug, titleHint]) => ({ slug, titleHint }));
}

function section(id: string, kind: string, heading: string, body: string): PathwayLessonSection {
  return { id, kind: kind as PathwayLessonSection["kind"], heading, body };
}

function buildLesson(input: {
  pathwayId: string;
  slug: string;
  title: string;
  seoDescription: string;
  relatedLessonRefs: PathwayLessonRelatedRef[];
  sections: PathwayLessonSection[];
}): ScopedGoldLessonInput {
  return {
    slug: input.slug,
    title: input.title,
    topic: "Cardiovascular",
    topicSlug: "cardiovascular",
    bodySystem: "Cardiovascular",
    previewSectionCount: 2,
    seoTitle: `${input.title} | ${examLabel(input.pathwayId)} | NurseNest`,
    seoDescription: input.seoDescription,
    relatedLessonRefs: input.relatedLessonRefs,
    sections: input.sections,
  };
}

function toHubRow(full: ScopedGoldLessonInput): Omit<ScopedGoldLessonInput, "sections" | "preTest" | "postTest"> {
  const { sections: _sections, preTest: _preTest, postTest: _postTest, ...hub } = full;
  return hub;
}

function buildRateCalculationLesson(pathwayId: string): ScopedGoldLessonInput {
  return buildLesson({
    pathwayId,
    slug: ECG_RATE_CALC_GOLD_SLUG,
    title: "ECG rate calculation and regularity basics",
    seoDescription:
      "Foundational ECG lesson on rate calculation, regular vs irregular rhythms, atrial vs ventricular rate, and the nursing priorities that make monitor math clinically meaningful.",
    relatedLessonRefs: related(
      ["us-rn-dysrhythmias", "General dysrhythmia review"],
      ["heart-blocks-degrees-mobitz-nclex-rn", "Heart block interpretation"],
    ),
    sections: [
      section(
        "introduction",
        "introduction",
        "Overview",
        "Rate calculation is the part of ECG interpretation that turns a strip into a bedside decision. Premium learners should not only know the 300-150-100 shortcut, the six-second strip method, and when to count actual complexes on an irregular tracing, but also understand why the rate matters clinically. A fast rhythm can shorten diastolic filling and worsen ischemia. A slow rhythm can drop cerebral and coronary perfusion. In real nursing care, rate is never interpreted in isolation from symptoms, perfusion, and the broader rhythm family.",
      ),
      section(
        "pathophysiology_overview",
        "pathophysiology_overview",
        "Pathophysiology",
        "Rate reflects how quickly atrial or ventricular depolarization is occurring. Sinus tachycardia often reflects a physiologic response to hypovolemia, fever, pain, sepsis, or hypoxia. Bradycardia may reflect vagal tone, nodal suppression, medication effect, or high-grade conduction disease. Atrial and ventricular rates can diverge in atrial flutter, complete heart block, and some paced rhythms, so premium interpretation requires deciding which chamber is being counted and why the mismatch matters. This is why rate calculation is a clinical reasoning skill, not just a box-counting exercise.",
      ),
      section(
        "signs_symptoms",
        "signs_symptoms",
        "Signs and Symptoms",
        "When the rate matters, the bedside changes first. Tachycardia can travel with chest pain, diaphoresis, worsening dyspnea, hypotension, and anxiety that reflects shock physiology rather than emotion alone. Bradycardia can produce dizziness, syncope, nausea, weakness, or acute confusion when cardiac output falls. Irregular fast rhythms may create palpitations and poor exercise tolerance, while slow escape rhythms may look deceptively calm until the patient stands up, gets chest pressure, or loses consciousness. Rate interpretation becomes safer when the strip and the patient are evaluated together.",
      ),
      section(
        "red_flags",
        "red_flags",
        "Red Flags",
        "Red flags include a monitor rate that does not match the pulse, rapidly worsening tachycardia with hypotension or chest pain, severe bradycardia with confusion or syncope, and any rate change that appears with shock, hypoxia, or active ischemia. Another warning sign is when the atrial and ventricular rates no longer match, because flutter, block, pacing issues, and ventricular rhythms can hide behind one misleading number. Nurses should escalate these patterns early instead of trying to perfect the math while perfusion is getting worse.",
      ),
      section(
        "labs_diagnostics",
        "labs_diagnostics",
        "Labs and Diagnostics",
        "The first diagnostic step is deciding whether the strip is regular enough for a box method. Regular rhythms allow 300-150-100 or large-box counting. Irregular rhythms require longer sample windows and actual complex counting. Diagnostic support then comes from vitals, pulse confirmation, telemetry trend, oxygenation, temperature, medication review, and labs that explain why the rate changed. Potassium, magnesium, hemoglobin, troponin, and lactate can all change the urgency of the same heart rate. If the monitor rate and pulse do not match, the nurse should suspect artifact, poor perfusion, or monitor error before documenting a false number.",
      ),
      section(
        "nursing_assessment_interventions",
        "nursing_assessment_interventions",
        "Nursing Assessment and Interventions",
        "Core nursing priorities are to verify the tracing, correlate with the pulse, obtain blood pressure, assess symptoms, and determine whether the patient is compensating or decompensating. A heart rate of 140 in a comfortable patient with preserved pressure may be managed very differently from a rate of 140 with chest pain and dropping mentation. A rate of 42 can be benign during sleep or dangerous in complete heart block. The intervention is not to memorize one magic cutoff, but to connect rate to perfusion, conduction, and likely cause. Escalation, repeat ECG, medication review, oxygenation support, fluid resuscitation, or pacing preparation all begin with that framework.",
      ),
      section(
        "clinical_pearls",
        "clinical_pearls",
        "Clinical Pearls",
        "Common exam traps include using a regular rhythm box method on atrial fibrillation, mistaking monitor labels for true rate, or assuming atrial and ventricular rates are the same in flutter and block. Another trap is focusing on a mathematically precise rate while ignoring the patient’s deteriorating perfusion. In telemetry practice, trend often matters more than one snapshot. A patient moving from 92 to 128 with new ectopy, rising oxygen need, and diaphoresis is telling you something clinically important even before the rhythm label changes.",
      ),
      section(
        "client_education",
        "client_education",
        "Client Education",
        "Patients with palpitations, bradycardia symptoms, or recurrent tachycardia should be taught to report dizziness, syncope, chest pain, unexplained shortness of breath, or worsening exercise intolerance early. Teaching should also connect rate to triggers such as dehydration, stimulant use, medication nonadherence, and infection. For chronic arrhythmia patients, education includes explaining why monitoring, medication review, and symptom correlation matter more than self-diagnosing from wearable devices alone.",
      ),
      section(
        "tier_specific_relevance",
        "tier_specific_relevance",
        "Your Exam Focus",
        "RN and NP learners should be able to calculate rate correctly, explain why the rate is clinically important, and choose the safest first action when rate and symptoms conflict. NCLEX-style stems often test whether the nurse recognizes instability, not whether they can do monitor arithmetic faster than everyone else in the room.",
      ),
      section(
        "related_next_steps",
        "related_next_steps",
        "Next Steps",
        "After rate calculation basics, move to interval interpretation, sinus rhythm patterning, and AV block logic. Those next steps explain when the rate is a sinus response and when it reflects a conduction or ventricular emergency.",
      ),
    ],
  });
}

function buildIntervalsLesson(pathwayId: string): ScopedGoldLessonInput {
  return buildLesson({
    pathwayId,
    slug: ECG_INTERVALS_GOLD_SLUG,
    title: "ECG interval interpretation: PR, QRS and QT/QTc",
    seoDescription:
      "Core ECG lesson on measuring PR, QRS, QT and QTc, linking conduction timing to AV block, wide-complex rhythms, torsades risk, and safe nursing escalation.",
    relatedLessonRefs: related(
      ["heart-blocks-degrees-mobitz-nclex-rn", "Heart blocks"],
      ["digoxin-toxicity-nursing-safety", "Digoxin toxicity"],
    ),
    sections: [
      section(
        "introduction",
        "introduction",
        "Overview",
        "Intervals are the timing language of ECG interpretation. The PR interval shows atrial conduction through the AV node. QRS width shows how the ventricles are being activated. QT and QTc describe depolarization plus repolarization time and therefore influence torsades risk. A premium foundational lesson should teach not only how to measure them, but why those measurements change nursing urgency. Interval interpretation helps the learner recognize when a patient with a familiar-looking strip is actually drifting into a much more dangerous conduction or repolarization problem.",
      ),
      section(
        "pathophysiology_overview",
        "pathophysiology_overview",
        "Pathophysiology",
        "PR prolongation often reflects AV-nodal delay or conduction disease. QRS widening may reflect bundle branch block, ventricular activation outside the normal conduction system, hyperkalemia, or ventricular pacing. QT prolongation reflects delayed repolarization and can set up torsades, especially when combined with ectopy, low magnesium, low potassium, bradycardia, or QT-prolonging drugs. The same interval abnormality can be low-risk or high-risk depending on the patient’s perfusion, medication history, ischemic symptoms, and trend over time.",
      ),
      section(
        "signs_symptoms",
        "signs_symptoms",
        "Signs and Symptoms",
        "Patients rarely complain that their PR interval is long. They complain of dizziness, near-syncope, chest pressure, fatigue, palpitations, or dyspnea when conduction timing is affecting output. A wide QRS in a stable patient may be a chronic baseline. A wide QRS in a shocked patient with chest pain may be a ventricular emergency. QT prolongation becomes especially clinically meaningful when the patient is having syncope, seizure-like activity, recurrent PVCs, or medication changes that raise torsades risk.",
      ),
      section(
        "red_flags",
        "red_flags",
        "Red Flags",
        "Red flags include progressive PR change with dropped beats, new wide-complex rhythm, QT prolongation with ectopy or syncope, bradycardia with poor perfusion, and interval changes occurring in the setting of acute coronary syndrome, digoxin toxicity, or severe electrolyte disturbance. These findings deserve fast clinical correlation because timing abnormalities can be the warning shot before a larger rhythm collapse.",
      ),
      section(
        "labs_diagnostics",
        "labs_diagnostics",
        "Labs and Diagnostics",
        "Measure intervals in the clearest lead rather than the noisiest one. Compare the tracing to previous ECGs, review medication exposures, and check potassium, magnesium, calcium, renal function, troponin, and acid-base status when relevant. If the patient is unstable, the diagnostic priority is not cosmetic precision; it is deciding whether the interval change is supporting a dangerous conduction or repolarization diagnosis that changes the immediate plan.",
      ),
      section(
        "nursing_assessment_interventions",
        "nursing_assessment_interventions",
        "Nursing Assessment and Interventions",
        "The nursing role is to verify the strip, assess symptoms and perfusion, correlate interval change with meds and labs, and escalate when the timing abnormality may reflect block, ventricular origin, or torsades risk. Common interventions include repeat ECG acquisition, telemetry intensification, medication review, electrolyte replacement preparation, and pacing or cardioversion readiness in the right clinical scenario. Documentation should connect the interval finding to why the team should care now.",
      ),
      section(
        "clinical_pearls",
        "clinical_pearls",
        "Clinical Pearls",
        "Exam traps include measuring the wrong T-wave end, counting U waves as QT, assuming every wide QRS is ventricular tachycardia, and ignoring QT risk because the patient’s rhythm is still organized. A useful clinical pearl is that interval changes are often trend problems: one borderline value matters less than a clearly worsening pattern in a symptomatic patient.",
      ),
      section(
        "client_education",
        "client_education",
        "Client Education",
        "Patients starting QT-prolonging medication, taking digoxin, living with conduction disease, or recovering from electrolyte disturbance should be taught to report syncope, presyncope, new palpitations, chest pain, and medication interactions. They should also understand that ‘normal heart rate’ does not mean the ECG is safe if conduction timing is changing. Teaching should connect the ECG finding to why medication lists, lab follow-up, and symptom diaries matter in preventing sudden deterioration.",
      ),
      section(
        "tier_specific_relevance",
        "tier_specific_relevance",
        "Your Exam Focus",
        "RN and NP learners should be able to measure intervals, connect them to block, ventricular activation, or repolarization risk, and choose the safest action when the patient is unstable. The scoring point is usually clinical judgment, not ruler perfection. Many exam distractors sound technical but ignore symptoms, medication exposures, or perfusion. The safest answer usually ties the interval finding to the reason the patient is at risk now, such as worsening AV block, torsades risk, or a wide-complex emergency.",
      ),
      section(
        "related_next_steps",
        "related_next_steps",
        "Next Steps",
        "After interval interpretation, practice heart block sequences, ventricular rhythm recognition, drug-toxicity ECG changes, and electrolyte-linked patterns. Those next steps reinforce why timing changes matter in real patient care. Learners should also compare interval findings on strips with the patient’s medication list, symptoms, and telemetry trend so that interval interpretation becomes part of a complete nursing judgment workflow instead of an isolated measurement skill.",
      ),
    ],
  });
}

function buildSinusArrhythmiaLesson(pathwayId: string): ScopedGoldLessonInput {
  return buildLesson({
    pathwayId,
    slug: ECG_SINUS_ARRHYTHMIA_GOLD_SLUG,
    title: "Sinus arrhythmia recognition and nursing interpretation",
    seoDescription:
      "Core ECG lesson on sinus arrhythmia, respiratory variation, stable vs unstable irregularity, and how to separate benign sinus variation from atrial fibrillation or artifact.",
    relatedLessonRefs: related(
      ["us-rn-dysrhythmias", "Dysrhythmia overview"],
      ["ecg-rate-calculation-basics-gold", "Rate calculation basics"],
    ),
    sections: [
      section(
        "introduction",
        "introduction",
        "Overview",
        "Sinus arrhythmia is one of the first ‘irregular’ rhythms that teaches an important lesson: irregular does not always mean pathologic. In sinus arrhythmia, the strip still follows the sinus pathway, but the R-R interval varies, often with respiration. Premium foundational training should teach the learner to keep the sinus diagnosis in place while classifying the variation. This prevents overcalling atrial fibrillation, undercalling artifact, and panicking over a rhythm that may be physiologic in one patient and only clinically important in another when paired with broader instability.",
      ),
      section(
        "pathophysiology_overview",
        "pathophysiology_overview",
        "Pathophysiology",
        "Respiratory sinus arrhythmia reflects normal autonomic variation, especially in younger patients, where vagal tone changes the sinus-node firing rate during the breathing cycle. Pathologic sinus irregularity can also occur with sinus-node disease, medication effect, or broader physiologic stress, but the key point is that atrial activation still comes from the sinus node. That means the ECG should retain sinus P-wave morphology and normal conduction even while the spacing varies. This is why inspecting atrial activity matters more than reacting to irregularity alone.",
      ),
      section(
        "signs_symptoms",
        "signs_symptoms",
        "Signs and Symptoms",
        "Most healthy patients with respiratory sinus arrhythmia have no symptoms at all. In contrast, a patient with broader sinus-node dysfunction or medication-related irregularity may report dizziness, exercise intolerance, near-syncope, or fatigue. The premium learning point is that symptoms should push the nurse to look beyond ‘sinus arrhythmia’ as a label and ask whether the patient truly has a benign respiratory pattern or a more consequential sinus-node problem that deserves escalation.",
      ),
      section(
        "red_flags",
        "red_flags",
        "Red Flags",
        "Red flags include irregularity with syncope, chest pain, hypotension, worsening hypoxia, or a tracing that is too noisy to trust. Another important warning sign is an irregular pattern that looks chaotic rather than phasically respiratory, because that should reopen the atrial fibrillation and artifact differential. A patient with medication changes, poor perfusion, or known conduction disease should not be reassured simply because the strip still contains sinus P waves.",
      ),
      section(
        "labs_diagnostics",
        "labs_diagnostics",
        "Labs and Diagnostics",
        "Diagnosis starts by confirming sinus P waves before each QRS and noticing that the rhythm varies in a patterned way rather than becoming chaotically irregular. Respiratory correlation can be helpful, and comparison with a cleaner lead can separate sinus variation from artifact. If symptoms, medications, ischemia, or electrolyte problems suggest a broader issue, the nurse should add vitals, medication review, and a full rhythm workup instead of documenting the irregularity as harmless by default.",
      ),
      section(
        "nursing_assessment_interventions",
        "nursing_assessment_interventions",
        "Nursing Assessment and Interventions",
        "The nursing task is to verify that the irregularity is still sinus, assess whether the patient is symptomatic, and decide whether observation is enough or whether the broader context demands escalation. In telemetry practice, that means checking signal quality, monitoring heart rate trend, assessing perfusion, and avoiding unnecessary emergency responses for a benign respiratory pattern. It also means not missing the patient who has irregular sinus behavior plus hypoxia, medication toxicity, or worsening conduction disease.",
      ),
      section(
        "clinical_pearls",
        "clinical_pearls",
        "Clinical Pearls",
        "A high-yield pearl is that sinus arrhythmia still has sinus P waves. That one detail prevents many exam errors. Another pearl is that irregularly irregular without organized P waves is a very different pattern and should raise the atrial fibrillation differential instead. Premium learners should always decide whether the irregularity is patterned or chaotic.",
      ),
      section(
        "client_education",
        "client_education",
        "Client Education",
        "Teaching should reassure asymptomatic patients when the pattern is clearly physiologic, but it should also explain when to seek help for dizziness, syncope, palpitations, new shortness of breath, or medication-related symptoms. Patients often equate ‘irregular’ with ‘dangerous,’ so precise education reduces anxiety without hiding true warning signs. Education is strongest when it explains the difference between benign respiratory variation and warning signs that deserve reassessment or medication review.",
      ),
      section(
        "tier_specific_relevance",
        "tier_specific_relevance",
        "Your Exam Focus",
        "Exams often test whether the nurse can distinguish benign sinus variation from atrial fibrillation or artifact and whether the nurse prioritizes the patient’s symptoms over the monitor label. The correct answer usually blends pattern recognition with bedside assessment. Watch for distractors that overreact to any irregularity or, just as dangerously, ignore symptoms because the tracing still looks broadly sinus.",
      ),
      section(
        "related_next_steps",
        "related_next_steps",
        "Next Steps",
        "After mastering sinus arrhythmia, compare it with atrial fibrillation, PACs, and artifact. Those comparisons build the pattern-recognition accuracy needed for faster telemetry interpretation.",
      ),
    ],
  });
}

function buildJunctionalLesson(pathwayId: string): ScopedGoldLessonInput {
  return buildLesson({
    pathwayId,
    slug: ECG_JUNCTIONAL_GOLD_SLUG,
    title: "Junctional rhythm recognition and bedside priorities",
    seoDescription:
      "Core ECG lesson on junctional rhythms, retrograde or absent P waves, digoxin and inferior-MI clues, and how to separate junctional escape from sinus bradycardia.",
    relatedLessonRefs: related(
      ["digoxin-toxicity-nursing-safety", "Digoxin toxicity"],
      ["heart-blocks-degrees-mobitz-nclex-rn", "AV blocks"],
    ),
    sections: [
      section(
        "introduction",
        "introduction",
        "Overview",
        "Junctional rhythms are foundational because they teach the learner that a narrow QRS does not guarantee sinus origin. When the AV junction takes over, the QRS may stay narrow, but the atrial story changes. P waves may be absent, retrograde, or buried. Premium foundational teaching should train learners to look for that P-wave relationship instead of assuming every slow narrow rhythm is sinus bradycardia. This matters clinically because junctional rhythms often point toward digoxin toxicity, inferior ischemia, sinus-node suppression, or conduction-system stress rather than a simple low heart rate.",
      ),
      section(
        "pathophysiology_overview",
        "pathophysiology_overview",
        "Pathophysiology",
        "The AV junction becomes the pacemaker when the sinus node fails to dominate or conduction favors a junctional escape focus. Because ventricular activation still travels through much of the normal conduction system, the QRS can remain narrow. What changes is the atrial relationship: the atria may depolarize retrograde, simultaneously, or not in a clearly visible way. That is why P-wave inspection is the key physiologic step in junctional interpretation and why the rhythm can be missed if the learner focuses only on QRS width.",
      ),
      section(
        "signs_symptoms",
        "signs_symptoms",
        "Signs and Symptoms",
        "Some junctional rhythms are well tolerated, especially if the escape rate is adequate and the patient has preserved ventricular function. Others cause dizziness, weakness, chest pressure, or hypotension because the rate is too slow or atrial contribution to ventricular filling is lost. Symptoms become more concerning when the rhythm is new, when the patient is ischemic, or when medication or toxicity history suggests the conduction system is under stress.",
      ),
      section(
        "red_flags",
        "red_flags",
        "Red Flags",
        "Red flags include new junctional rhythm in a patient with nausea and digoxin exposure, junctional rhythm with chest pain and inferior-lead changes, symptomatic bradycardia, poor perfusion, or a junctional pattern appearing during a broader deterioration picture. These are not rhythms to dismiss casually just because the QRS is narrow.",
      ),
      section(
        "labs_diagnostics",
        "labs_diagnostics",
        "Labs and Diagnostics",
        "Diagnostics should include close strip inspection for absent or retrograde P waves, medication review, electrolyte assessment, and clinical evaluation for ischemia or toxicity. Digoxin level, potassium, magnesium, and a 12-lead ECG may all matter. The premium point is that rhythm recognition should drive diagnostic questions rather than ending the investigation.",
      ),
      section(
        "nursing_assessment_interventions",
        "nursing_assessment_interventions",
        "Nursing Assessment and Interventions",
        "At the bedside, the nurse should verify pulse and pressure, assess symptoms, review medications, compare with prior tracings, and decide whether the patient is stable, toxic, or ischemic. Appropriate interventions may include escalation, repeat ECG acquisition, preparation for pacing support in symptomatic bradycardia, or urgent provider notification if digoxin toxicity or inferior MI is plausible. The nursing role is to connect the rhythm to the likely cause and the immediate risk.",
      ),
      section(
        "clinical_pearls",
        "clinical_pearls",
        "Clinical Pearls",
        "A common exam trap is calling a junctional rhythm sinus bradycardia because both may be slow and narrow. Another is missing the digoxin toxicity connection when nausea, visual symptoms, and junctional rhythm cluster together. Premium learners should make the P-wave relationship their anchor and then interpret the rhythm in clinical context.",
      ),
      section(
        "client_education",
        "client_education",
        "Client Education",
        "Teaching should focus on medication safety, symptom reporting, and when dizziness, syncope, chest pain, or palpitations require urgent review. For patients on nodal blockers or digoxin, education should reinforce why routine medication use still needs monitoring when symptoms or rhythm changes appear. Patients should understand that a narrow rhythm can still be dangerous when it reflects conduction-system stress or toxic medication effects.",
      ),
      section(
        "tier_specific_relevance",
        "tier_specific_relevance",
        "Your Exam Focus",
        "Foundational nursing exams usually test whether the learner can distinguish junctional rhythm from sinus bradycardia and connect it to drug effect, ischemia, or symptomatic bradycardia management. The decision point is often safe escalation, not electrophysiology jargon. Many stems hide the answer in medication history, inferior-wall symptoms, or digoxin clues rather than in the rhythm label alone. The safer answer usually recognizes conduction-system stress and responds before the patient becomes profoundly unstable. Learners should be ready to explain why missing or retrograde P waves change the interpretation even when the QRS is narrow.",
      ),
      section(
        "related_next_steps",
        "related_next_steps",
        "Next Steps",
        "After junctional rhythm basics, compare junctional escape with AV block, paced rhythms, and digoxin toxicity ECG changes. Those links sharpen the learner’s recognition of conduction-system emergencies. Learners should also revisit rate calculation and interval interpretation so they can explain why a narrow rhythm with missing or retrograde atrial activity may be more dangerous than it first appears.",
      ),
    ],
  });
}

function getFullLessonForPathway(pathwayId: string, slug: string): ScopedGoldLessonInput | null {
  if (!ECG_ELIGIBLE_PATHWAYS.has(pathwayId)) return null;
  switch (slug) {
    case ECG_RATE_CALC_GOLD_SLUG:
      return buildRateCalculationLesson(pathwayId);
    case ECG_INTERVALS_GOLD_SLUG:
      return buildIntervalsLesson(pathwayId);
    case ECG_SINUS_ARRHYTHMIA_GOLD_SLUG:
      return buildSinusArrhythmiaLesson(pathwayId);
    case ECG_JUNCTIONAL_GOLD_SLUG:
      return buildJunctionalLesson(pathwayId);
    default:
      return null;
  }
}

function provider(slug: string): ScopedGoldProvider {
  return {
    slug,
    topicSlug: "cardiovascular",
    getFullLesson: (pathwayId) => getFullLessonForPathway(pathwayId, slug),
    getHubListRow: (pathwayId) => {
      const full = getFullLessonForPathway(pathwayId, slug);
      return full ? toHubRow(full) : null;
    },
  };
}

export const ECG_CORE_FOUNDATIONS_GOLD_PROVIDERS: ScopedGoldProvider[] = [
  provider(ECG_RATE_CALC_GOLD_SLUG),
  provider(ECG_INTERVALS_GOLD_SLUG),
  provider(ECG_SINUS_ARRHYTHMIA_GOLD_SLUG),
  provider(ECG_JUNCTIONAL_GOLD_SLUG),
];
