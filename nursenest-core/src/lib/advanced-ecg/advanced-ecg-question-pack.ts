import type { Prisma } from "@prisma/client";
import { getEcgRhythmTemplate } from "@/lib/ecg-module/ecg-rhythm-templates";
import { defaultEcgQaMetadataForRhythm } from "@/lib/ecg-module/ecg-safety-governance";
import { defaultEcgStripConfigForRhythm, type EcgStripMediaConfig } from "@/lib/ecg-module/ecg-waveform-generator";
import type { AdvancedEcgLessonTopicKey } from "@/lib/advanced-ecg/advanced-ecg-lesson-content";

type QuestionFamily =
  | "strip_identification"
  | "priority_action"
  | "complication_escalation"
  | "comparison"
  | "clinical_causes";

type TopicBlueprint = {
  topicKey: AdvancedEcgLessonTopicKey;
  title: string;
  rhythmKey: string;
  examStyle: "telemetry" | "icu" | "acls" | "nclex" | "np" | "mixed";
  stripCue: string;
  correctLabel: string;
  lookalikes: [string, string, string];
  priorityAction: string;
  escalationAction: string;
  distinguishingFeature: string;
  clinicalCause: string;
};

const BLUEPRINTS: readonly TopicBlueprint[] = [
  {
    topicKey: "systematic_interpretation",
    title: "Systematic ECG Interpretation",
    rhythmKey: "normal_sinus_rhythm",
    examStyle: "telemetry",
    stripCue: "monitor lead quality must be verified before naming the rhythm",
    correctLabel: "Use a full stepwise rhythm assessment before naming the strip",
    lookalikes: [
      "Trust the monitor auto-label if the rate looks plausible",
      "Call the rhythm from QRS width alone",
      "Focus on ST segments before confirming the rhythm family",
    ],
    priorityAction: "Assess the patient, confirm signal quality, and work through the strip in a fixed sequence",
    escalationAction: "Escalate when the strip plus the patient suggest instability before the exact label is perfect",
    distinguishingFeature: "The premium method checks signal quality, rate, regularity, atrial activity, intervals, QRS width, and ST-T behavior in order",
    clinicalCause: "Unsystematic interpretation causes missed unstable rhythms, false artifact calls, and delayed escalation",
  },
  {
    topicKey: "axis_basics",
    title: "Axis Basics",
    rhythmKey: "normal_sinus_rhythm",
    examStyle: "np",
    stripCue: "frontal-plane QRS polarity in leads I and aVF is the starting point",
    correctLabel: "Identify the frontal axis from leads I and aVF before refining the interpretation",
    lookalikes: [
      "Treat axis alone as a STEMI diagnosis",
      "Ignore lead placement and calculate axis anyway",
      "Call every negative aVF tracing right-axis deviation",
    ],
    priorityAction: "Verify limb-lead placement before acting on an apparent axis shift",
    escalationAction: "Escalate only when the axis change travels with ischemia, wide-complex rhythm, or instability",
    distinguishingFeature: "True axis change stays physiologically plausible across leads, while lead reversal creates inconsistent patterns",
    clinicalCause: "Axis shifts often reflect fascicular block, ventricular activation changes, infarction, or technical error",
  },
  {
    topicKey: "rate_calculation",
    title: "Rate Calculation",
    rhythmKey: "sinus_tachycardia",
    examStyle: "telemetry",
    stripCue: "regular strips use box methods while irregular strips require counted complexes over time",
    correctLabel: "Choose the rate-calculation method that matches strip regularity",
    lookalikes: [
      "Use the 300 method for atrial fibrillation",
      "Count only monitor labels and ignore the tracing",
      "Assume the atrial and ventricular rates are identical in flutter and block",
    ],
    priorityAction: "Correlate the measured rate with pulse and perfusion before deciding urgency",
    escalationAction: "Escalate when rate extremes are driving hypotension, chest pain, dyspnea, or altered mentation",
    distinguishingFeature: "Irregular rhythms require longer strip counting rather than a regular-box shortcut",
    clinicalCause: "Pain, shock, fever, AV block, and toxic or metabolic causes can all change the clinically meaningful rate",
  },
  {
    topicKey: "intervals_pr_qrs_qt",
    title: "Intervals: PR, QRS, QT and QTc",
    rhythmKey: "drug_induced_qt_prolongation",
    examStyle: "icu",
    stripCue: "measurement depends on identifying PR, QRS width, and QT or QTc correctly",
    correctLabel: "Measure conduction and repolarization intervals before assigning the rhythm risk",
    lookalikes: [
      "Treat all wide QRS rhythms as benign bundle branch block",
      "Ignore QT prolongation when the patient is on a risk medication",
      "Assume a long PR interval always means a stable patient",
    ],
    priorityAction: "Compare interval changes with symptoms, perfusion, meds, and electrolyte risk",
    escalationAction: "Escalate progressive block, new wide-complex rhythm, or prolonged QT with ectopy or syncope",
    distinguishingFeature: "Interval interpretation links timing abnormalities to conduction disease, pacing, or torsades risk",
    clinicalCause: "AV nodal delay, bundle branch disease, ischemia, electrolyte problems, and medications all distort intervals",
  },
  {
    topicKey: "sinus_rhythms",
    title: "Sinus Rhythms",
    rhythmKey: "sinus_arrhythmia",
    examStyle: "nclex",
    stripCue: "upright sinus P waves remain present even when rate or respiratory variation changes",
    correctLabel: "Recognize the rhythm as sinus first, then classify the rate or variability",
    lookalikes: [
      "Call sinus arrhythmia atrial fibrillation because the rhythm varies",
      "Treat all sinus tachycardia as a primary arrhythmia needing cardioversion",
      "Ignore symptoms because the tracing still looks sinus",
    ],
    priorityAction: "Search for the physiologic driver when sinus rate changes are signaling deterioration",
    escalationAction: "Escalate symptomatic bradycardia or persistent sinus tachycardia with shock, hypoxia, or ischemic symptoms",
    distinguishingFeature: "Sinus rhythms keep a sinus P-wave pattern before each conducted QRS",
    clinicalCause: "Pain, fever, vagal tone, drugs, hypovolemia, hypoxia, and sinus-node disease all shape sinus behavior",
  },
  {
    topicKey: "atrial_rhythms",
    title: "Atrial Rhythms",
    rhythmKey: "atrial_fibrillation",
    examStyle: "telemetry",
    stripCue: "atrial activity and ventricular response pattern separate AFib, flutter, ectopy, and atrial tachycardia",
    correctLabel: "Use atrial activity and ventricular response to classify the atrial rhythm",
    lookalikes: [
      "Assume every narrow rapid rhythm is sinus tachycardia",
      "Call all irregular artifact atrial fibrillation",
      "Treat flutter and fibrillation as identical bedside problems",
    ],
    priorityAction: "Assess rate, perfusion, symptoms, and whether this atrial rhythm is new or poorly tolerated",
    escalationAction: "Escalate rapid atrial tachyarrhythmia with hypotension, ischemia, pulmonary edema, or syncope",
    distinguishingFeature: "Sawtooth flutter activity, fibrillatory baseline, or premature atrial activation each points to a different atrial mechanism",
    clinicalCause: "Atrial stretch, valvular disease, ischemia, sepsis, thyroid disease, pulmonary stress, and stimulants all trigger atrial rhythms",
  },
  {
    topicKey: "junctional_rhythms",
    title: "Junctional Rhythms",
    rhythmKey: "junctional_rhythm",
    examStyle: "icu",
    stripCue: "absent or retrograde P waves with a narrow regular escape pattern suggest a junctional focus",
    correctLabel: "Recognize the AV junction as the pacemaker when sinus atrial activation is lost or retrograde",
    lookalikes: [
      "Call a junctional rhythm sinus bradycardia because the QRS is narrow",
      "Assume every absent P wave means ventricular tachycardia",
      "Ignore digoxin history when a new junctional rhythm appears",
    ],
    priorityAction: "Check perfusion, meds, ischemic symptoms, and digoxin or nodal-blocker exposure immediately",
    escalationAction: "Escalate new symptomatic junctional rhythm or junctional activity suggesting inferior MI or toxicity",
    distinguishingFeature: "The P-wave relationship to the QRS, not just the rate, separates junctional rhythm from sinus bradycardia",
    clinicalCause: "Sinus-node suppression, inferior ischemia, digoxin toxicity, and postoperative conduction stress commonly produce junctional rhythms",
  },
  {
    topicKey: "av_blocks",
    title: "AV Blocks",
    rhythmKey: "third_degree_av_block",
    examStyle: "telemetry",
    stripCue: "PR behavior over multiple cycles determines the AV block pattern",
    correctLabel: "March out atrial and ventricular activity separately before naming the block",
    lookalikes: [
      "Call blocked PACs complete heart block without analyzing sequence",
      "Assume every prolonged PR is harmless",
      "Ignore QRS width when risk-stratifying a high-grade block",
    ],
    priorityAction: "Determine if the block is symptomatic or likely to progress while pacing readiness is considered",
    escalationAction: "Escalate Mobitz II, complete heart block, or any symptomatic conduction block immediately",
    distinguishingFeature: "Progressive PR change, non-conducted beats, or AV dissociation distinguish the major block families",
    clinicalCause: "Ischemia, nodal blockers, fibrosis, myocarditis, electrolyte problems, and postoperative injury can all produce AV block",
  },
  {
    topicKey: "ventricular_rhythms",
    title: "Ventricular Rhythms",
    rhythmKey: "ventricular_tachycardia",
    examStyle: "acls",
    stripCue: "wide-complex ventricular activation with ectopy, tachycardia, or arrest behavior signals ventricular origin",
    correctLabel: "Treat ventricular morphology as high risk until proven otherwise",
    lookalikes: [
      "Assume a wide fast rhythm is SVT with aberrancy by default",
      "Delay treatment until every wide-complex differential is resolved",
      "Ignore worsening PVC burden in an ischemic patient",
    ],
    priorityAction: "Check for pulse and perfusion while bringing defibrillation or cardioversion support close",
    escalationAction: "Escalate sustained VT, polymorphic VT, VF, asystole, or worsening ventricular ectopy with instability",
    distinguishingFeature: "QRS width, AV dissociation, fusion or capture beats, and VF chaos separate ventricular rhythms from supraventricular lookalikes",
    clinicalCause: "Ischemia, scar re-entry, electrolyte shifts, cardiomyopathy, shock, hypoxia, and drug toxicity commonly trigger ventricular rhythms",
  },
  {
    topicKey: "paced_rhythms",
    title: "Paced Rhythms",
    rhythmKey: "paced_rhythm",
    examStyle: "telemetry",
    stripCue: "pacing spikes, chamber capture, and device timing determine whether the paced rhythm is functioning safely",
    correctLabel: "Analyze pacing spikes and capture before calling the rhythm safe or unsafe",
    lookalikes: [
      "Treat every wide paced complex as ventricular tachycardia",
      "Assume every pacing spike captures mechanically",
      "Ignore failure-to-sense or failure-to-capture clues because spikes are present",
    ],
    priorityAction: "Correlate spikes with capture and perfusion while preparing device troubleshooting if needed",
    escalationAction: "Escalate pacing failure, poor capture, symptomatic paced bradycardia, or unstable temporary pacing immediately",
    distinguishingFeature: "Spike timing plus actual depolarization and pulse response separates functioning pacing from malfunction or mimic",
    clinicalCause: "Temporary or permanent pacing, lead problems, battery or connection issues, and high thresholds all shape paced ECG behavior",
  },
  {
    topicKey: "stemi_localization_basics",
    title: "STEMI Localization Basics",
    rhythmKey: "stemi_pattern",
    examStyle: "icu",
    stripCue: "contiguous lead elevation and reciprocal change localize the likely infarct territory",
    correctLabel: "Use contiguous lead groups and reciprocal change to localize STEMI",
    lookalikes: [
      "Call any ST elevation a STEMI without checking territory or reciprocity",
      "Ignore posterior or right-sided extension in an unstable inferior pattern",
      "Rely on telemetry alone instead of obtaining a 12-lead",
    ],
    priorityAction: "Obtain a clean 12-lead, assess symptoms, and activate reperfusion pathways without delay",
    escalationAction: "Escalate suspected occlusion patterns with symptoms, instability, new block, or ongoing pain immediately",
    distinguishingFeature: "True localization depends on contiguous leads and clinical context, not one isolated elevated segment",
    clinicalCause: "Acute coronary occlusion, especially in inferior, anterior, lateral, or posterior territories, drives localization patterns",
  },
  {
    topicKey: "ischemia_infarction_patterns",
    title: "Ischemia and Infarction Patterns",
    rhythmKey: "stemi_pattern",
    examStyle: "np",
    stripCue: "dynamic ST-T and Q-wave changes help distinguish ischemia, injury, and infarction",
    correctLabel: "Interpret ischemic patterns as evolving coronary physiology, not just abnormal ST segments",
    lookalikes: [
      "Assume one normal ECG excludes evolving ACS",
      "Call chronic repolarization change acute infarction without comparison",
      "Ignore dynamic ischemic change because there is no STEMI label",
    ],
    priorityAction: "Trend symptoms, repeat ECGs, and correlate the tracing with perfusion and chest pain pathway timing",
    escalationAction: "Escalate dynamic ischemic changes, recurrent pain, dysrhythmia, or shock features immediately",
    distinguishingFeature: "Contiguity, reciprocity, serial change, and symptom context distinguish ischemia or infarction from common mimics",
    clinicalCause: "Acute coronary syndrome, demand ischemia, vasospasm, shock, and severe structural stress all produce ischemic ECG change",
  },
  {
    topicKey: "electrolyte_ecg_changes",
    title: "Electrolyte ECG Changes",
    rhythmKey: "hyperkalemia_pattern",
    examStyle: "icu",
    stripCue: "diffuse repolarization or conduction changes can reveal potassium, magnesium, or calcium derangement",
    correctLabel: "Interpret the ECG as a metabolic warning sign that may precede malignant rhythm change",
    lookalikes: [
      "Treat peaked T waves as STEMI by default",
      "Ignore U waves and QT issues because the rhythm is still organized",
      "Wait for the chemistry result before acting on a severe hyperkalemic pattern",
    ],
    priorityAction: "Check labs urgently, review renal status and meds, and place the patient on continuous monitoring",
    escalationAction: "Escalate severe electrolyte patterns with ectopy, widening QRS, bradycardia, syncope, or instability immediately",
    distinguishingFeature: "Diffuse metabolic change plus the right clinical context separates electrolyte patterns from focal ischemia and other mimics",
    clinicalCause: "Renal failure, diuretics, GI loss, DKA treatment, sepsis, and medication interactions frequently create electrolyte-linked ECG patterns",
  },
  {
    topicKey: "drug_toxicity_ecg_changes",
    title: "Drug and Toxicity ECG Changes",
    rhythmKey: "digoxin_toxicity_pattern",
    examStyle: "icu",
    stripCue: "medication exposure can create nodal block, QT risk, QRS widening, or toxic ventricular irritability",
    correctLabel: "Interpret the ECG through the lens of toxic pharmacology and conduction injury",
    lookalikes: [
      "Keep rate-slowing or QT-risk medication running without reassessment",
      "Treat digoxin toxicity like routine AFib management",
      "Ignore sodium-channel blockade widening because the rhythm is still organized",
    ],
    priorityAction: "Review the medication list, renal function, symptoms, and rhythm danger signs immediately",
    escalationAction: "Escalate toxic bradycardia, QT prolongation with ectopy, or conduction widening suggesting overdose",
    distinguishingFeature: "Medication history plus repolarization or conduction pattern separates toxicity from primary structural rhythm disease",
    clinicalCause: "Digoxin toxicity, QT-prolonging agents, nodal blockers, and sodium-channel blockade are common ECG-toxic patterns",
  },
  {
    topicKey: "artifact_vs_true_rhythm",
    title: "Artifact vs True Rhythm",
    rhythmKey: "normal_sinus_rhythm",
    examStyle: "telemetry",
    stripCue: "signal quality and patient correlation decide whether the monitor is lying",
    correctLabel: "Confirm the patient and the tracing before treating a dramatic monitor pattern",
    lookalikes: [
      "Defibrillate a noisy tracing before checking pulse and lead quality",
      "Assume every chaotic lead is ventricular fibrillation",
      "Trust a single noisy lead over the clinical assessment",
    ],
    priorityAction: "Check the patient first, then fix the monitor input while evaluating real rhythm risk",
    escalationAction: "Escalate when true instability remains likely or monitor failure is hiding deterioration",
    distinguishingFeature: "Real rhythms stay physiologically plausible across leads and correlate with the patient, while artifact often does not",
    clinicalCause: "Movement, tremor, loose leads, poor skin prep, electrical noise, and procedures commonly generate artifact",
  },
  {
    topicKey: "unstable_rhythm_recognition",
    title: "Unstable Rhythm Recognition",
    rhythmKey: "ventricular_tachycardia",
    examStyle: "acls",
    stripCue: "the same rhythm becomes an emergency when it is no longer supporting perfusion",
    correctLabel: "Define instability by the patient’s perfusion and symptoms, not by the strip label alone",
    lookalikes: [
      "Wait for a perfect rhythm label before mobilizing rescue care",
      "Treat monitor appearance as more important than blood pressure and mentation",
      "Assume familiar rhythms are always low risk",
    ],
    priorityAction: "Check perfusion, call for help, and prepare the appropriate rescue pathway immediately",
    escalationAction: "Escalate any rhythm causing hypotension, chest pain, severe dyspnea, altered mentation, or collapse",
    distinguishingFeature: "Instability is a bedside physiologic diagnosis supported by the ECG, not replaced by it",
    clinicalCause: "Shock, ischemia, severe tachycardia, bradycardia, conduction failure, electrolyte disaster, and toxicity all create unstable rhythm states",
  },
  {
    topicKey: "acls_rhythm_priorities",
    title: "ACLS Rhythm Priorities",
    rhythmKey: "ventricular_fibrillation",
    examStyle: "acls",
    stripCue: "shockability, pulse status, and symptom burden decide the ACLS branch",
    correctLabel: "Match the rhythm to the correct ACLS branch before intervening",
    lookalikes: [
      "Shock a non-shockable or artifactual tracing",
      "Forget synchronization in unstable tachycardia with a pulse",
      "Call PEA from the monitor without checking for pulse",
    ],
    priorityAction: "Determine pulse status, shockability, and pacing or cardioversion needs immediately",
    escalationAction: "Escalate into ACLS-level rescue care for shockable arrest, non-shockable arrest, unstable tachycardia, or symptomatic bradycardia",
    distinguishingFeature: "ACLS priorities turn rhythm recognition into action by separating shockable, non-shockable, unstable, and pacing pathways",
    clinicalCause: "Ischemia, toxins, hypoxia, electrolytes, thrombosis, tamponade, tension physiology, and conduction collapse all feed ACLS rhythm emergencies",
  },
] as const;

function fourOptions(correct: string, second: string, third: string, fourth: string): Array<{ id: string; text: string }> {
  return [
    { id: "a", text: correct },
    { id: "b", text: second },
    { id: "c", text: third },
    { id: "d", text: fourth },
  ];
}

function stripConfig(rhythmKey: string, patch: Partial<EcgStripMediaConfig> = {}): EcgStripMediaConfig {
  const base = defaultEcgStripConfigForRhythm(rhythmKey);
  return {
    ...base,
    ...patch,
    mediaType: "ecg_live_strip",
  };
}

function difficultyForRhythm(rhythmKey: string): string {
  return getEcgRhythmTemplate(rhythmKey)?.difficulty ?? "advanced";
}

function rationale(correct: string, wrongA: string, wrongB: string, wrongC: string): string {
  return `Correct: ${correct}. Distractor rationale: ${wrongA}; ${wrongB}; ${wrongC}.`;
}

function row(args: {
  id: string;
  blueprint: TopicBlueprint;
  family: QuestionFamily;
  stem: string;
  correct: string;
  distractors: [string, string, string];
  mode: "lesson" | "quiz" | "drill";
  mediaPatch?: Partial<EcgStripMediaConfig>;
  clinicalPriority?: string | null;
}): Prisma.EcgVideoQuestionCreateInput {
  const governance = defaultEcgQaMetadataForRhythm(args.blueprint.rhythmKey, "draft_promoted");
  return {
    id: args.id,
    videoUrl: "",
    thumbnailUrl: null,
    durationSeconds: null,
    mediaType: "ecg_live_strip",
    mediaConfig: stripConfig(args.blueprint.rhythmKey, args.mediaPatch ?? {}) as unknown as Prisma.InputJsonValue,
    questionText: args.stem,
    answerOptions: fourOptions(args.correct, ...args.distractors) as unknown as Prisma.InputJsonValue,
    correctAnswerId: "a",
    rationale: rationale(args.correct, args.distractors[0], args.distractors[1], args.distractors[2]),
    difficulty: difficultyForRhythm(args.blueprint.rhythmKey),
    rhythmTag: args.blueprint.rhythmKey,
    clinicalPriority: args.clinicalPriority ?? null,
    allowedTiers: ["RN", "NP"],
    isPremium: true,
    level: "advanced",
    mode: args.mode,
    topicTags: [
      "ecg",
      "advanced-ecg",
      `topic:${args.blueprint.topicKey}`,
      `rhythm:${args.blueprint.rhythmKey}`,
      `family:${args.family}`,
      `exam_style:${args.blueprint.examStyle}`,
      "review:clinical_required",
      "rationale:distractors_included",
    ],
    lessonLinkCount: 0,
    medicalQaStatus: governance.qaStatus,
    manualReviewedAt: null,
    manualReviewedBy: null,
    clinicianReviewedAt: null,
    clinicianReviewedBy: null,
    waveformFidelity: governance.waveformFidelity,
    qaStatus: governance.qaStatus,
    publishSafetyStatus: governance.publishSafetyStatus,
  };
}

function buildRowsForTopic(blueprint: TopicBlueprint): Prisma.EcgVideoQuestionCreateInput[] {
  const rows: Prisma.EcgVideoQuestionCreateInput[] = [];

  for (let index = 0; index < 15; index += 1) {
    rows.push(
      row({
        id: `adv_ecg_${blueprint.topicKey}_strip_${index + 1}`,
        blueprint,
        family: "strip_identification",
        mode: "drill",
        mediaPatch: { rate: 60 + ((index % 5) * 10) },
        stem: `Advanced ECG strip recognition ${index + 1}: Which interpretation best matches a tracing where ${blueprint.stripCue}?`,
        correct: blueprint.correctLabel,
        distractors: blueprint.lookalikes,
      }),
    );
  }

  for (let index = 0; index < 10; index += 1) {
    rows.push(
      row({
        id: `adv_ecg_${blueprint.topicKey}_priority_${index + 1}`,
        blueprint,
        family: "priority_action",
        mode: "quiz",
        clinicalPriority: "stability triage",
        stem: `Priority action ${index + 1}: A learner identifies ${blueprint.title.toLowerCase()} and the bedside picture is evolving. What is the best next nursing action?`,
        correct: blueprint.priorityAction,
        distractors: [
          "Document the rhythm and reassess later if the patient still looks stable",
          "Treat the monitor label as final before assessing perfusion or symptoms",
          "Delay further action until every lab result returns",
        ],
      }),
    );
  }

  for (let index = 0; index < 5; index += 1) {
    rows.push(
      row({
        id: `adv_ecg_${blueprint.topicKey}_escalation_${index + 1}`,
        blueprint,
        family: "complication_escalation",
        mode: "quiz",
        clinicalPriority: "urgent recognition",
        stem: `Escalation scenario ${index + 1}: Which development would most strongly justify immediate escalation for ${blueprint.title.toLowerCase()}?`,
        correct: blueprint.escalationAction,
        distractors: [
          "The patient says the electrodes feel itchy but vitals are unchanged",
          "A single isolated monitor alarm occurs with no clinical correlation",
          "The tracing looks similar to the prior stable baseline strip",
        ],
      }),
    );
  }

  for (let index = 0; index < 5; index += 1) {
    rows.push(
      row({
        id: `adv_ecg_${blueprint.topicKey}_compare_${index + 1}`,
        blueprint,
        family: "comparison",
        mode: "lesson",
        stem: `Comparison drill ${index + 1}: Which feature best separates ${blueprint.title.toLowerCase()} from a common lookalike?`,
        correct: blueprint.distinguishingFeature,
        distractors: [
          "The lookalikes are separated only by whether the monitor auto-label agrees",
          "The rhythm can be classified correctly without checking P-wave or QRS relationships",
          "The bedside picture is irrelevant once the tracing has been printed",
        ],
      }),
    );
  }

  for (let index = 0; index < 5; index += 1) {
    rows.push(
      row({
        id: `adv_ecg_${blueprint.topicKey}_causes_${index + 1}`,
        blueprint,
        family: "clinical_causes",
        mode: "lesson",
        stem: `Clinical cause drill ${index + 1}: Which cause or trigger best explains why ${blueprint.title.toLowerCase()} may appear on the ECG?`,
        correct: blueprint.clinicalCause,
        distractors: [
          "The ECG pattern exists independently of patient physiology or medication exposure",
          "Only congenital disease can produce this tracing pattern",
          "The pattern should be interpreted without considering clinical context",
        ],
      }),
    );
  }

  return rows;
}

export const ADVANCED_ECG_DRAFT_QUESTION_PACK: Prisma.EcgVideoQuestionCreateInput[] = BLUEPRINTS.flatMap((blueprint) =>
  buildRowsForTopic(blueprint),
);
