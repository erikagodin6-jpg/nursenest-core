/**
 * Clinically validated premium ECG items for `ecgVideoQuestion` upserts.
 * Strip configs align with {@link defaultEcgStripConfigForRhythm} + {@link validateEcgStripClinicalConfig}.
 *
 * RN/NP access only — pathway gates remain server-side (`allowedTiers`).
 *
 * Lesson tags reference existing catalog slugs (see pathway preview lists); used for remediation metadata only.
 */
import type { Prisma } from "@prisma/client";
import { getEcgRhythmTemplate } from "@/lib/ecg-module/ecg-rhythm-templates";
import type { EcgStripMediaConfig } from "@/lib/ecg-module/ecg-waveform-generator";
import { defaultEcgStripConfigForRhythm } from "@/lib/ecg-module/ecg-waveform-generator";

export type EcgPremiumCategoryTag =
  | "rhythm_interpretation_mcq"
  | "waveform_identification_drill"
  | "ngn_ecg_case"
  | "telemetry_prioritization"
  | "medication_ecg_integration"
  | "acls_rhythm_progression"
  | "electrolyte_ecg"
  | "artifact_vs_true_rhythm"
  | "progressive_curated_set";

const LESSON = {
  dysrhythmiasUs: "us-rn-dysrhythmias",
  dysrhythmiasCa: "ca-rn-dysrhythmias",
  fluidsElectrolytes: "fluids-electrolytes-emergencies-gold",
  acs: "acute-coronary-syndrome-gold",
  cardiacMeds: "med-family-cardiac-gold",
} as const;

function stripConfig(
  rhythmKey: string,
  patch: Partial<EcgStripMediaConfig> & Record<string, unknown> = {},
): EcgStripMediaConfig {
  const base = defaultEcgStripConfigForRhythm(rhythmKey);
  return {
    ...base,
    ...patch,
    mediaType: "ecg_live_strip",
    manualReviewed: true,
    manuallyReviewedAt: "2026-05-09",
  };
}

function fourOptions(correct: string, d2: string, d3: string, d4: string): Array<{ id: string; text: string }> {
  return [
    { id: "a", text: correct },
    { id: "b", text: d2 },
    { id: "c", text: d3 },
    { id: "d", text: d4 },
  ];
}

function difficultyForRhythm(rhythmKey: string): string {
  return getEcgRhythmTemplate(rhythmKey)?.difficulty ?? "intermediate";
}

type MakeArgs = {
  id: string;
  rhythmKey: string;
  stem: string;
  rationale: string;
  options: Array<{ id: string; text: string }>;
  correctAnswerId: string;
  category: EcgPremiumCategoryTag;
  level: "basic" | "advanced";
  mode: "lesson" | "quiz" | "drill";
  clinicalPriority?: string | null;
  lessonSlug?: keyof typeof LESSON;
  progressiveLevel?: "level-1" | "level-2" | "level-3";
  /** Override deterministic strip (must still pass clinical validation). */
  mediaPatch?: Partial<EcgStripMediaConfig>;
  rhythmTag?: string;
};

function makeRow(args: MakeArgs): Prisma.EcgVideoQuestionCreateInput {
  const lessonSlug = args.lessonSlug ? LESSON[args.lessonSlug] : undefined;
  const topicTags = [
    "ecg",
    `category:${args.category}`,
    ...(lessonSlug ? [`lesson:${lessonSlug}`, `remediation:${lessonSlug}`] : []),
    ...(args.progressiveLevel ? [`progressive:${args.progressiveLevel}`] : []),
  ];
  const rk = args.rhythmKey;
  return {
    id: args.id,
    videoUrl: "",
    thumbnailUrl: null,
    durationSeconds: null,
    mediaType: "ecg_live_strip",
    mediaConfig: stripConfig(rk, args.mediaPatch ?? {}) as unknown as Prisma.InputJsonValue,
    questionText: args.stem,
    answerOptions: args.options as unknown as Prisma.InputJsonValue,
    correctAnswerId: args.correctAnswerId,
    rationale: args.rationale,
    difficulty: difficultyForRhythm(rk),
    rhythmTag: args.rhythmTag ?? rk,
    clinicalPriority: args.clinicalPriority ?? null,
    allowedTiers: ["RN", "NP"],
    isPremium: true,
    level: args.level,
    mode: args.mode,
    topicTags,
    lessonLinkCount: lessonSlug ? 1 : 0,
    medicalQaStatus: "approved",
    manualReviewedAt: new Date("2026-05-09T12:00:00.000Z"),
    manualReviewedBy: "ecg-premium-curated-pack-v1",
  };
}

/**
 * Curated rows for `prisma.ecgVideoQuestion.upsert`. IDs are stable across runs.
 */
export function buildEcgPremiumCuratedPack(): Prisma.EcgVideoQuestionCreateInput[] {
  const rows: Prisma.EcgVideoQuestionCreateInput[] = [];

  // --- 1) Rhythm interpretation MCQ (basic quiz + lesson) ---
  rows.push(
    makeRow({
      id: "ecg_cur_rhy001",
      rhythmKey: "atrial_fibrillation",
      stem: "Rhythm interpretation: which diagnosis best matches this irregularly irregular narrow-complex rhythm without organized P waves?",
      rationale:
        "Atrial fibrillation shows an irregularly irregular ventricular response and absence of distinct P waves—often with fibrillatory baseline activity. Distractors: flutter typically shows sawtooth flutter waves; sinus tachycardia has upright P waves before each QRS; VT is wide-complex.",
      options: fourOptions(
        "Atrial fibrillation",
        "Atrial flutter with fixed conduction",
        "Sinus tachycardia",
        "Monomorphic ventricular tachycardia",
      ),
      correctAnswerId: "a",
      category: "rhythm_interpretation_mcq",
      level: "basic",
      mode: "quiz",
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_rhy002",
      rhythmKey: "atrial_flutter",
      stem: "Rhythm interpretation: sawtooth atrial activity with narrow QRS—what is the most accurate rhythm label?",
      rationale:
        "Classic atrial flutter demonstrates flutter (F) waves—often best seen in inferior leads—and variable or fixed AV conduction. AFib lacks organized atrial sawtooth activity; NSR has sinus P morphology; VF is chaotic without discrete QRS.",
      options: fourOptions(
        "Atrial flutter",
        "Atrial fibrillation",
        "Normal sinus rhythm",
        "Ventricular fibrillation",
      ),
      correctAnswerId: "a",
      category: "rhythm_interpretation_mcq",
      level: "basic",
      mode: "lesson",
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_rhy003",
      rhythmKey: "sinus_bradycardia",
      stem: "Rhythm interpretation: regular rhythm ~52/min with normal PR and upright P before each QRS—choose the best label.",
      rationale:
        "Sinus bradycardia is sinus rhythm at under 60 bpm with consistent sinus P-wave morphology. Heart blocks show PR prolongation or non-conducted beats; AFib is irregular without sinus P waves.",
      options: fourOptions(
        "Sinus bradycardia",
        "Third-degree AV block",
        "Atrial fibrillation",
        "Ventricular paced rhythm",
      ),
      correctAnswerId: "a",
      category: "rhythm_interpretation_mcq",
      level: "basic",
      mode: "quiz",
      mediaPatch: { rate: 52 },
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_rhy004",
      rhythmKey: "first_degree_av_block",
      stem: "Rhythm interpretation: sinus rhythm with uniformly prolonged PR beyond 0.20 s—what conduction pattern is present?",
      rationale:
        "First-degree AV block is sinus rhythm with every P wave conducting but PR interval >200 ms. Mobitz patterns involve intermittent non-conducted beats; AFib has no measurable sinus PR.",
      options: fourOptions(
        "First-degree AV block",
        "Second-degree AV block type II",
        "Atrial fibrillation",
        "Bundle branch block without AV delay",
      ),
      correctAnswerId: "a",
      category: "rhythm_interpretation_mcq",
      level: "basic",
      mode: "lesson",
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_rhy005",
      rhythmKey: "third_degree_av_block",
      stem: "Rhythm interpretation: P waves march through QRS independently with a slow escape—select the diagnosis.",
      rationale:
        "Third-degree (complete) AV block shows AV dissociation: atria and ventricles beat independently. Mobitz I shows grouped beating with progressive PR; SVT typically has fast narrow complexes without dissociation.",
      options: fourOptions(
        "Third-degree AV block",
        "Second-degree type I AV block",
        "Sinus tachycardia",
        "Paroxysmal atrial fibrillation",
      ),
      correctAnswerId: "a",
      category: "rhythm_interpretation_mcq",
      level: "advanced",
      mode: "quiz",
      clinicalPriority: "urgent recognition",
      lessonSlug: "dysrhythmiasCa",
    }),
    makeRow({
      id: "ecg_cur_rhy006",
      rhythmKey: "bundle_branch_block",
      stem: "Rhythm interpretation: regular sinus rhythm with prolonged QRS suggesting delayed ventricular depolarization—best summary?",
      rationale:
        "Bundle branch block widens QRS because ventricular activation proceeds through slow muscle-to-muscle spread rather than the rapid His-Purkinje highway. VT is typically faster and often AV dissociated; PVCs are premature, not sustained morphology.",
      options: fourOptions(
        "Bundle branch block pattern",
        "Hyperacute STEMI without conduction delay",
        "Polymorphic ventricular tachycardia",
        "Atrial flutter with aberrancy only",
      ),
      correctAnswerId: "a",
      category: "rhythm_interpretation_mcq",
      level: "basic",
      mode: "quiz",
      lessonSlug: "dysrhythmiasUs",
    }),
  );

  // --- 2) Waveform identification drills ---
  rows.push(
    makeRow({
      id: "ecg_cur_wav001",
      rhythmKey: "ventricular_tachycardia",
      stem: "Waveform ID (drill): rapid wide-complex rhythm ~170/min—what rhythm is displayed?",
      rationale:
        "Monomorphic VT shows consecutive wide QRS complexes at a rapid rate without sinus P waves preceding each beat. SVT with aberrancy can mimic VT but requires correlation to baseline tracings and clinical context.",
      options: fourOptions(
        "Ventricular tachycardia",
        "Supraventricular tachycardia with aberrancy",
        "Atrial fibrillation with WPW",
        "Accelerated idioventricular rhythm",
      ),
      correctAnswerId: "a",
      category: "waveform_identification_drill",
      level: "advanced",
      mode: "drill",
      mediaPatch: { rate: 170 },
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_wav002",
      rhythmKey: "svt",
      stem: "Waveform ID (drill): very regular narrow-complex tachycardia ~190/min—most likely rhythm?",
      rationale:
        "SVT often presents as a regular narrow-complex tachycardia with rates commonly 150–220 bpm; P waves may be buried or retrograde. AFib is irregularly irregular; VT is typically wide-complex.",
      options: fourOptions(
        "Supraventricular tachycardia (SVT)",
        "Atrial fibrillation",
        "Ventricular tachycardia",
        "Sinus tachycardia at 190 with ST elevation",
      ),
      correctAnswerId: "a",
      category: "waveform_identification_drill",
      level: "advanced",
      mode: "drill",
      mediaPatch: { rate: 188 },
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_wav003",
      rhythmKey: "pvcs",
      stem: "Waveform identification: intermittent premature wide beats interrupting underlying rhythm—best description?",
      rationale:
        "PVCs are premature ventricular beats—wide, bizarre QRS morphologies often followed by compensatory pauses when sinus rhythm resumes.",
      options: fourOptions(
        "Premature ventricular contractions",
        "Ventricular paced spikes each beat",
        "Artifact from loose telemetry lead",
        "Non-conducted PACs only",
      ),
      correctAnswerId: "a",
      category: "waveform_identification_drill",
      level: "basic",
      mode: "quiz",
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_wav004",
      rhythmKey: "paced_rhythm",
      stem: "Waveform ID: spikes preceding wide paced captures—what rhythm is shown?",
      rationale:
        "Paced rhythms demonstrate pacemaker spikes with paced wide QRS morphology when ventricular pacing captures.",
      options: fourOptions(
        "Ventricular paced rhythm",
        "Ventricular tachycardia without pacing",
        "Artifact mimicking spikes",
        "Atrial flutter with variable block",
      ),
      correctAnswerId: "a",
      category: "waveform_identification_drill",
      level: "advanced",
      mode: "lesson",
      lessonSlug: "cardiacMeds",
    }),
    makeRow({
      id: "ecg_cur_wav005",
      rhythmKey: "pacs",
      stem: "Waveform identification: early beat with abnormal premature P morphology—what is this ectopy?",
      rationale:
        "PACs originate from atrial tissue outside the sinus node; they produce premature non-sinus P waves that may conduct with narrow or aberrant QRS.",
      options: fourOptions(
        "Premature atrial contraction",
        "Premature ventricular contraction",
        "Fusion beat from dual pathways",
        "Artifact from patient brushing teeth",
      ),
      correctAnswerId: "a",
      category: "waveform_identification_drill",
      level: "basic",
      mode: "quiz",
      lessonSlug: "dysrhythmiasUs",
    }),
  );

  // --- 3) NGN-style ECG cases ---
  rows.push(
    makeRow({
      id: "ecg_cur_ngn001",
      rhythmKey: "stemi_pattern",
      stem: "NGN case: chest pressure telemetry strip shows ST elevation pattern with organized sinus activity—first nursing priority after notifying provider?",
      rationale:
        "STEMI patterns demand rapid escalation per chest pain protocol while maintaining monitoring and preparing for reperfusion pathways. This strip emphasizes **recognition**—definitive therapy follows orders and institutional ACS pathways.",
      options: fourOptions(
        "Repeat/confirm ST changes, obtain serial vitals, prepare ACS pathway per protocol",
        "Immediately cardiovert synchronized without assessment",
        "Give PO aspirin only and wait for labs",
        "Stop all cardiac monitoring to reduce anxiety",
      ),
      correctAnswerId: "a",
      category: "ngn_ecg_case",
      level: "advanced",
      mode: "lesson",
      clinicalPriority: "urgent recognition",
      lessonSlug: "acs",
    }),
    makeRow({
      id: "ecg_cur_ngn002",
      rhythmKey: "pea",
      stem: "NGN case: pulseless patient with organized narrow complexes on monitor—what rhythm classification fits electrical activity without perfusion?",
      rationale:
        "PEA is electrical activity without palpable pulse—treatment follows CPR and reversible causes per ACLS; do not mistake organized complexes for perfusion.",
      options: fourOptions(
        "Pulseless electrical activity (PEA)",
        "Stable sinus rhythm",
        "Ventricular fibrillation",
        "Artifact only—disconnect leads",
      ),
      correctAnswerId: "a",
      category: "ngn_ecg_case",
      level: "advanced",
      mode: "lesson",
      clinicalPriority: "urgent recognition",
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_ngn003",
      rhythmKey: "torsades_de_pointes",
      stem: "NGN case: polymorphic VT twisting baseline with prolonged QT risk context—immediate interventions emphasize what principle?",
      rationale:
        "Torsades is unstable polymorphic VT associated with prolonged QT—stabilize rhythm with ACLS pathways and correct triggers (electrolytes, offending drugs) per orders.",
      options: fourOptions(
        "Treat as unstable tachycardia per ACLS + correct precipitants (magnesium per protocol when indicated)",
        "Observe without escalation because rhythm is polymorphic",
        "Give rapid potassium bolus empirically without monitoring",
        "Disable telemetry alarms to reduce alarm fatigue",
      ),
      correctAnswerId: "a",
      category: "ngn_ecg_case",
      level: "advanced",
      mode: "quiz",
      clinicalPriority: "urgent recognition",
      lessonSlug: "fluidsElectrolytes",
    }),
    makeRow({
      id: "ecg_cur_ngn004",
      rhythmKey: "second_degree_type_i_av_block",
      stem: "NGN case: grouped beating with progressive PR prolongation then dropped beat—what AV block pattern is present?",
      rationale:
        "Mobitz type I (Wenckebach) shows progressive PR lengthening until a non-conducted beat—distinct from Mobitz II’s fixed PR before dropped beats.",
      options: fourOptions(
        "Second-degree AV block type I (Mobitz I)",
        "Second-degree AV block type II",
        "Third-degree AV block",
        "Sinus arrhythmia only",
      ),
      correctAnswerId: "a",
      category: "ngn_ecg_case",
      level: "advanced",
      mode: "lesson",
      lessonSlug: "dysrhythmiasCa",
    }),
    makeRow({
      id: "ecg_cur_ngn005",
      rhythmKey: "second_degree_type_ii_av_block",
      stem: "NGN case: fixed PR interval with sudden dropped QRS—what pattern suggests risk for progression to complete heart block?",
      rationale:
        "Mobitz II often has constant PR when conduction occurs and intermittent non-conducted P waves—requires vigilant monitoring for instability.",
      options: fourOptions(
        "Second-degree AV block type II (Mobitz II)",
        "Mobitz type I Wenckebach",
        "First-degree AV block only",
        "Paroxysmal SVT",
      ),
      correctAnswerId: "a",
      category: "ngn_ecg_case",
      level: "advanced",
      mode: "quiz",
      clinicalPriority: "urgent recognition",
      lessonSlug: "dysrhythmiasUs",
    }),
  );

  // --- 4) Telemetry prioritization ---
  rows.push(
    makeRow({
      id: "ecg_cur_tel001",
      rhythmKey: "ventricular_fibrillation",
      stem: "Telemetry triage: chaotic waveform without organized QRS—what is the immediate priority classification?",
      rationale:
        "VF is a shockable arrest rhythm—prioritize defibrillation + CPR per ACLS and emergency escalation; never defer for routine tasks.",
      options: fourOptions(
        "Shockable arrest rhythm — activate ACLS / code response immediately",
        "Stable rhythm — routine reassessment in 4 hours",
        "Artifact — instruct patient to stop moving only",
        "Atrial fibrillation — rate control only",
      ),
      correctAnswerId: "a",
      category: "telemetry_prioritization",
      level: "advanced",
      mode: "drill",
      clinicalPriority: "highest acuity",
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_tel002",
      rhythmKey: "asystole",
      stem: "Telemetry triage: flatline without recurring ventricular complexes—how should this be prioritized?",
      rationale:
        "Asystole is non-shockable—high-quality CPR, epinephrine per ACLS, and reversible cause search; defibrillation is not indicated for true asystole.",
      options: fourOptions(
        "Non-shockable arrest pattern — CPR + ACLS medications per protocol",
        "Immediate unsynchronized shock first",
        "Low priority — schedule routine ECG in clinic",
        "Normal telemetry variant — ignore alarms",
      ),
      correctAnswerId: "a",
      category: "telemetry_prioritization",
      level: "advanced",
      mode: "drill",
      clinicalPriority: "highest acuity",
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_tel003",
      rhythmKey: "stemi_pattern",
      stem: "Telemetry prioritization: ST elevation pattern on continuous monitoring—what tier of escalation applies?",
      rationale:
        "STEMI signals activate acute coronary workflows—simultaneous monitoring continuation, provider notification, and preparation for reperfusion evaluation.",
      options: fourOptions(
        "ACS/STEMI pathway escalation with continuous monitoring and rapid provider activation",
        "Ambulating patient independently without reassessment",
        "Discontinue telemetry to decrease alarms",
        "Label as benign early repolarization without follow-up",
      ),
      correctAnswerId: "a",
      category: "telemetry_prioritization",
      level: "advanced",
      mode: "lesson",
      clinicalPriority: "urgent recognition",
      lessonSlug: "acs",
    }),
    makeRow({
      id: "ecg_cur_tel004",
      rhythmKey: "sinus_tachycardia",
      stem: "Telemetry floor: stable sinus tachycardia ~118/min after mobilizing—best initial nursing judgment?",
      rationale:
        "Sinus tachycardia is often physiologic or secondary—assess volume status, pain, fever, bleeding, and medications before assuming primary arrhythmia.",
      options: fourOptions(
        "Evaluate reversible causes (pain, hypovolemia, fever, medications) and trend clinically",
        "Synchronized cardiovert immediately",
        "Stop beta-blockers empirically without orders",
        "Ignore because narrow-complex rhythms are always benign",
      ),
      correctAnswerId: "a",
      category: "telemetry_prioritization",
      level: "basic",
      mode: "quiz",
      mediaPatch: { rate: 118 },
      lessonSlug: "dysrhythmiasUs",
    }),
  );

  // --- 5) Medication + ECG integration ---
  rows.push(
    makeRow({
      id: "ecg_cur_med001",
      rhythmKey: "torsades_de_pointes",
      stem: "Medication safety: patient on QT-prolonging agents develops polymorphic VT pattern—what teaching point matches this strip?",
      rationale:
        "Drug-induced QT prolongation predisposes to torsades—team review includes holding culprit drugs when ordered, correcting magnesium/potassium per protocol, and continuous monitoring.",
      options: fourOptions(
        "QT-prolonging drugs increase torsades risk — coordinate medication review with continuous monitoring",
        "QT drugs shorten repolarization — no interaction risk",
        "Polymorphic VT should never be treated emergently",
        "Telemetry is unnecessary once IV access is obtained",
      ),
      correctAnswerId: "a",
      category: "medication_ecg_integration",
      level: "advanced",
      mode: "quiz",
      lessonSlug: "cardiacMeds",
    }),
    makeRow({
      id: "ecg_cur_med002",
      rhythmKey: "hyperkalemia_pattern",
      stem: "Medication + ECG: peaked T waves with QRS widening after potassium supplementation error—what principle applies?",
      rationale:
        "Hyperkalemia produces progressive ECG changes including peaked T waves and QRS widening—urgent lab correlation and membrane stabilization per protocol are priorities.",
      options: fourOptions(
        "Treat as hyperkalemia emergency pending labs — escalate per protocol and stop exogenous potassium",
        "Ignore until potassium returns in 24 hours",
        "Assume hypokalemia and give more potassium",
        "Remove telemetry because rhythm is regular",
      ),
      correctAnswerId: "a",
      category: "medication_ecg_integration",
      level: "advanced",
      mode: "lesson",
      clinicalPriority: "urgent recognition",
      lessonSlug: "fluidsElectrolytes",
    }),
    makeRow({
      id: "ecg_cur_med003",
      rhythmKey: "hypokalemia_pattern",
      stem: "Medication + ECG: loop diuretic therapy with flattened T waves and prominent U waves—what electrolyte pattern is suggested?",
      rationale:
        "Hypokalemia often shows flattened T waves and U waves on ECG—correlate with labs and replacement per orders while monitoring rhythm.",
      options: fourOptions(
        "Hypokalemia pattern — prioritize potassium monitoring and replacement per protocol",
        "Hyperkalemia with sine waves only",
        "Normal variant requiring no action",
        "Acute STEMI without electrolyte contribution",
      ),
      correctAnswerId: "a",
      category: "medication_ecg_integration",
      level: "basic",
      mode: "quiz",
      lessonSlug: "fluidsElectrolytes",
    }),
    makeRow({
      id: "ecg_cur_med004",
      rhythmKey: "sinus_tachycardia",
      stem: "Medication + ECG: beta-agonist bronchodilator given; sinus tachycardia develops—what is the best documentation-focused interpretation?",
      rationale:
        "Sympathomimetic medications commonly raise sinus rate—differentiate medication effect from primary arrhythmia by trend, symptoms, and vital signs.",
      options: fourOptions(
        "Likely physiologic sinus tachycardia from beta-agonist effect — monitor symptoms and vitals",
        "Ventricular fibrillation requiring shock",
        "Third-degree AV block",
        "Immediate amiodarone bolus without monitoring",
      ),
      correctAnswerId: "a",
      category: "medication_ecg_integration",
      level: "basic",
      mode: "lesson",
      mediaPatch: { rate: 112 },
      lessonSlug: "cardiacMeds",
    }),
  );

  // --- 6) ACLS-relevant rhythm progression (scenarios / drills) ---
  rows.push(
    makeRow({
      id: "ecg_cur_acl001",
      rhythmKey: "ventricular_fibrillation",
      stem: "ACLS scenario: chaotic VF on monitor during arrest—first intervention category?",
      rationale:
        "VF is shockable—deliver defibrillation promptly with high-quality CPR between shocks per ACLS algorithms.",
      options: fourOptions(
        "Defibrillate (shockable rhythm) + CPR per ACLS",
        "Give adenosine 6 mg rapid IV push only",
        "Observe for spontaneous conversion without CPR",
        "Wait for chemistry panel before any treatment",
      ),
      correctAnswerId: "a",
      category: "acls_rhythm_progression",
      level: "advanced",
      mode: "drill",
      clinicalPriority: "highest acuity",
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_acl002",
      rhythmKey: "ventricular_tachycardia",
      stem: "ACLS scenario: pulseless wide-complex tachycardia ~190/min—classification and pathway?",
      rationale:
        "Pulseless VT is treated as shockable arrest rhythm—defibrillation + CPR per ACLS without delaying for diagnostics.",
      options: fourOptions(
        "Pulseless VT — treat as shockable arrest rhythm per ACLS",
        "Stable VT — observe only",
        "Atrial flutter — adenosine first",
        "Normal sinus rhythm — discharge",
      ),
      correctAnswerId: "a",
      category: "acls_rhythm_progression",
      level: "advanced",
      mode: "drill",
      mediaPatch: { rate: 188 },
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_acl003",
      rhythmKey: "asystole",
      stem: "ACLS progression: rhythm deteriorates to asystole during resuscitation—next pharmacologic step per ACLS framework?",
      rationale:
        "Asystole care emphasizes CPR, epinephrine, and reversible causes—defibrillation is not indicated for asystole.",
      options: fourOptions(
        "Epinephrine per ACLS + continued CPR while searching for reversible causes",
        "Synchronized cardioversion 200 J",
        "Adenosine 12 mg",
        "Stop resuscitation immediately without reassessment",
      ),
      correctAnswerId: "a",
      category: "acls_rhythm_progression",
      level: "advanced",
      mode: "lesson",
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_acl004",
      rhythmKey: "pea",
      stem: "ACLS scenario: organized rhythm without pulse—what intervention bundle applies?",
      rationale:
        "PEA treatment focuses on CPR, epinephrine, and rapid reversal of treatable causes (5 H’s and 5 T’s).",
      options: fourOptions(
        "CPR + epinephrine + search for reversible causes",
        "Immediate defibrillation only",
        "Wait for spontaneous recovery without CPR",
        "Disconnect monitoring to reduce artifact concern",
      ),
      correctAnswerId: "a",
      category: "acls_rhythm_progression",
      level: "advanced",
      mode: "lesson",
      clinicalPriority: "urgent recognition",
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_acl005",
      rhythmKey: "normal_sinus_rhythm",
      stem: "ACLS post-resuscitation check: organized sinus ~78/min after ROSC—monitoring emphasis?",
      rationale:
        "Post-arrest care focuses on oxygenation, perfusion, electrolytes, and ischemia evaluation—maintain continuous monitoring for recurrence.",
      options: fourOptions(
        "Continuous monitoring + post-arrest bundle elements per protocol",
        "Remove all monitoring once sinus rhythm returns",
        "Discharge immediately from ICU without labs",
        "Ignore recurrent ectopy as benign always",
      ),
      correctAnswerId: "a",
      category: "acls_rhythm_progression",
      level: "basic",
      mode: "lesson",
      mediaPatch: { rate: 78 },
      lessonSlug: "dysrhythmiasUs",
    }),
  );

  // --- 7) Electrolyte ECG recognition ---
  rows.push(
    makeRow({
      id: "ecg_cur_ele001",
      rhythmKey: "hyperkalemia_pattern",
      stem: "Electrolyte pattern: peaked T waves with QRS widening—what clinical correlation is most accurate?",
      rationale:
        "Severe hyperkalemia progresses from peaked T waves to QRS widening and sine-wave morphology—urgent lab correlation and treatment per protocol.",
      options: fourOptions(
        "Hyperkalemia progression — immediate escalation per hyperkalemia protocol",
        "Hypokalemia with U waves only",
        "Benign early repolarization without labs",
        "Pericarditis diffuse PR elevation pattern",
      ),
      correctAnswerId: "a",
      category: "electrolyte_ecg",
      level: "advanced",
      mode: "quiz",
      lessonSlug: "fluidsElectrolytes",
    }),
    makeRow({
      id: "ecg_cur_ele002",
      rhythmKey: "hypokalemia_pattern",
      stem: "Electrolyte ECG: flattened T waves with prominent U waves in diuretic therapy—what pattern fits?",
      rationale:
        "Hypokalemia characteristically flattens T waves and accentuates U waves—risk of dangerous ectopy increases as severity worsens.",
      options: fourOptions(
        "Hypokalemia pattern — aggressive potassium monitoring per clinical status",
        "Hyperkalemia with sine waves",
        "Acute pericarditis",
        "Inferior STEMI pattern only",
      ),
      correctAnswerId: "a",
      category: "electrolyte_ecg",
      level: "basic",
      mode: "quiz",
      lessonSlug: "fluidsElectrolytes",
    }),
    makeRow({
      id: "ecg_cur_ele003",
      rhythmKey: "torsades_de_pointes",
      stem: "Electrolyte + rhythm: polymorphic VT in context of low magnesium—what teaching linkage is correct?",
      rationale:
        "Hypomagnesemia contributes to QT prolongation and torsades risk—magnesium therapy is central per ACLS when indicated.",
      options: fourOptions(
        "Hypomagnesemia lowers threshold for torsades — correct magnesium per protocol",
        "Magnesium excess causes narrow-complex bradycardia only",
        "Torsades never recurs after single beat",
        "Telemetry should be discontinued during IV therapy",
      ),
      correctAnswerId: "a",
      category: "electrolyte_ecg",
      level: "advanced",
      mode: "lesson",
      lessonSlug: "fluidsElectrolytes",
    }),
    makeRow({
      id: "ecg_cur_ele004",
      rhythmKey: "hyperkalemia_pattern",
      stem: "Electrolyte strip quiz: peaked T waves with widened QRS in renal failure patient—first nursing action cluster?",
      rationale:
        "Hyperkalemia with ECG changes is an emergency—notify provider, obtain labs if not available, and prepare protocol-driven therapies per orders.",
      options: fourOptions(
        "Notify provider urgently + continuous monitoring + prepare protocol therapies per orders",
        "Discharge patient with oral potassium",
        "Ignore ECG if blood pressure normal",
        "Stop monitoring leads to reduce anxiety",
      ),
      correctAnswerId: "a",
      category: "electrolyte_ecg",
      level: "advanced",
      mode: "quiz",
      clinicalPriority: "urgent recognition",
      lessonSlug: "fluidsElectrolytes",
    }),
  );

  // --- 8) Artifact vs true rhythm ---
  rows.push(
    makeRow({
      id: "ecg_cur_art001",
      rhythmKey: "normal_sinus_rhythm",
      stem: "Artifact discrimination: organized QRS continues despite baseline noise—best interpretation?",
      rationale:
        "Motion or loose leads can add noise while preserving recurring organized QRS complexes—reapply leads and reassess before treating as VF.",
      options: fourOptions(
        "Sinus rhythm with superimposed artifact — reassess leads and patient movement",
        "Fine ventricular fibrillation without organized activity",
        "Asystole requiring immediate pacing wires",
        "Atrial flutter with 4:1 block only",
      ),
      correctAnswerId: "a",
      category: "artifact_vs_true_rhythm",
      level: "basic",
      mode: "quiz",
      mediaPatch: { rate: 76, artifactLevel: 0.14 },
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_art002",
      rhythmKey: "ventricular_fibrillation",
      stem: "Artifact discrimination: chaotic waveform without recurring organized QRS complexes—this pattern represents?",
      rationale:
        "True VF lacks discrete repeating QRS morphology—treat as arrest rhythm per ACLS, not as artifact.",
      options: fourOptions(
        "Ventricular fibrillation — shockable arrest rhythm",
        "Sinus rhythm with minor artifact",
        "Normal sinus arrhythmia",
        "Atrial flutter with variable block",
      ),
      correctAnswerId: "a",
      category: "artifact_vs_true_rhythm",
      level: "advanced",
      mode: "drill",
      clinicalPriority: "highest acuity",
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_art003",
      rhythmKey: "asystole",
      stem: "Telemetry troubleshooting: flatline but patient awake and talking—what should you suspect first?",
      rationale:
        "Clinical–electrical dissociation with awake patient suggests lead failure or misplacement—not true asystole.",
      options: fourOptions(
        "Lead off / monitoring failure until proven otherwise — reassess connections and alternate leads",
        "Immediate defibrillation without checking patient",
        "Code blue without assessing pulse",
        "Epinephrine prior to any assessment",
      ),
      correctAnswerId: "a",
      category: "artifact_vs_true_rhythm",
      level: "basic",
      mode: "lesson",
      rhythmTag: "asystole",
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_art004",
      rhythmKey: "atrial_fibrillation",
      stem: "Differentiation: irregularly irregular narrow rhythm persists across leads—artifact vs arrhythmia?",
      rationale:
        "AFib remains irregular in multiple leads simultaneously—artifact often changes with single-lead manipulation.",
      options: fourOptions(
        "True atrial fibrillation — confirm in multiple leads and correlate clinically",
        "Artifact only because rhythm is irregular",
        "Sinus rhythm with PVC couplets exclusively",
        "Ventricular paced rhythm",
      ),
      correctAnswerId: "a",
      category: "artifact_vs_true_rhythm",
      level: "basic",
      mode: "quiz",
      lessonSlug: "dysrhythmiasUs",
    }),
  );

  // --- 9) Progressive curated sets (difficulty scaffolding) ---
  rows.push(
    makeRow({
      id: "ecg_cur_prg001",
      rhythmKey: "normal_sinus_rhythm",
      stem: "[Progressive set · Level 1] Baseline recognition: regular rhythm ~72/min with sinus P waves—label the rhythm.",
      rationale:
        "NSR demonstrates upright sinus P waves before each QRS at 60–100 bpm with stable PR—foundation for all comparisons.",
      options: fourOptions(
        "Normal sinus rhythm",
        "Atrial fibrillation",
        "Ventricular tachycardia",
        "Ventricular fibrillation",
      ),
      correctAnswerId: "a",
      category: "progressive_curated_set",
      level: "basic",
      mode: "lesson",
      progressiveLevel: "level-1",
      mediaPatch: { rate: 72 },
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_prg002",
      rhythmKey: "atrial_fibrillation",
      stem: "[Progressive set · Level 2] Compare/contrast: irregularly irregular rhythm without discrete P waves—diagnosis?",
      rationale:
        "AFib diagnosis hinges on irregular RR intervals and absent sinus P waves—rate control and stroke-risk assessment occur outside this recognition stem.",
      options: fourOptions(
        "Atrial fibrillation",
        "Atrial flutter",
        "Sinus arrhythmia only",
        "Third-degree AV block",
      ),
      correctAnswerId: "a",
      category: "progressive_curated_set",
      level: "basic",
      mode: "quiz",
      progressiveLevel: "level-2",
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_prg003",
      rhythmKey: "ventricular_tachycardia",
      stem: "[Progressive set · Level 3] Advanced instability: wide-complex tachycardia ~200/min—immediate priority category?",
      rationale:
        "Unstable wide-complex tachycardia with hypotension/altered perfusion demands escalation per ACLS and orders—recognition drives synchronized cardioversion pathway when pulse present with instability.",
      options: fourOptions(
        "Wide-complex tachycardia — treat as unstable until proven otherwise; escalate per ACLS pathway",
        "Observe until morning rounds",
        "Give adenosine only without monitoring",
        "Label as sinus tachycardia without assessment",
      ),
      correctAnswerId: "a",
      category: "progressive_curated_set",
      level: "advanced",
      mode: "drill",
      progressiveLevel: "level-3",
      mediaPatch: { rate: 200 },
      clinicalPriority: "urgent recognition",
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_prg004",
      rhythmKey: "first_degree_av_block",
      stem: "[Progressive set · Level 2] PR interval consistently prolonged but every P conducts—what block?",
      rationale:
        "First-degree AV block prolongs PR beyond 0.20 s without dropped beats—differentiate from Mobitz patterns with intermittent non-conducted P waves.",
      options: fourOptions(
        "First-degree AV block",
        "Third-degree AV block",
        "Mobitz type II",
        "Atrial fibrillation",
      ),
      correctAnswerId: "a",
      category: "progressive_curated_set",
      level: "basic",
      mode: "quiz",
      progressiveLevel: "level-2",
      lessonSlug: "dysrhythmiasUs",
    }),
    makeRow({
      id: "ecg_cur_prg005",
      rhythmKey: "sinus_tachycardia",
      stem: "[Progressive set · Level 1] Rate ~108/min with visible sinus P waves—most accurate label?",
      rationale:
        "Sinus tachycardia exceeds 100 bpm with maintained sinus P-wave morphology preceding each QRS.",
      options: fourOptions(
        "Sinus tachycardia",
        "Atrial flutter",
        "Ventricular fibrillation",
        "Mobitz type I",
      ),
      correctAnswerId: "a",
      category: "progressive_curated_set",
      level: "basic",
      mode: "lesson",
      progressiveLevel: "level-1",
      mediaPatch: { rate: 108 },
      lessonSlug: "dysrhythmiasUs",
    }),
  );

  return rows;
}

export const ECG_PREMIUM_CURATED_PACK: Prisma.EcgVideoQuestionCreateInput[] = buildEcgPremiumCuratedPack();
