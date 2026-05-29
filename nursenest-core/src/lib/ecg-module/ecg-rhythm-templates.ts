export type EcgRhythmDifficulty = "basic" | "intermediate" | "advanced";
export type EcgTierScope = "RN" | "PN" | "RPN" | "NP" | "PARAMEDIC" | "CARDIAC_TECH" | "MEDICAL_IMAGING" | "RESPIRATORY_THERAPY";

export type EcgRhythmTemplate = {
  rhythmKey: string;
  rhythmName: string;
  expectedRateRange: [number, number];
  rhythmRegularity: "regular" | "irregular" | "regularly_irregular" | "chaotic" | "absent";
  pWavePresence: "present" | "absent" | "variable" | "flutter" | "dissociated" | "paced";
  prIntervalPattern: "normal" | "prolonged" | "progressive_prolongation" | "dropped_beats" | "av_dissociation" | "not_measurable" | "variable";
  qrsWidthRange: [number, number];
  qtBehavior?: "normal" | "shortened" | "prolonged" | "variable";
  keyRecognitionFeatures: string[];
  contraindicatedIncorrectFeatures: string[];
  difficulty: EcgRhythmDifficulty;
  applicableTiers: EcgTierScope[];
  clinicalTags: string[];
  highRisk?: boolean;
};

export const ECG_RHYTHM_TEMPLATES: EcgRhythmTemplate[] = [
  template("normal_sinus_rhythm", "Normal sinus rhythm", [60, 100], "regular", "present", "normal", [0.06, 0.10], ["upright P before every QRS", "constant PR interval"], ["irregularly irregular rhythm", "wide chaotic complexes"], "basic", ["RN", "PN", "RPN", "NP", "PARAMEDIC", "CARDIAC_TECH", "RESPIRATORY_THERAPY"], ["sinus", "baseline"]),
  template("sinus_bradycardia", "Sinus bradycardia", [40, 59], "regular", "present", "normal", [0.06, 0.10], ["sinus P waves", "rate below 60"], ["absent P waves", "chaotic rhythm"], "basic", ["RN", "PN", "RPN", "NP", "PARAMEDIC", "CARDIAC_TECH", "RESPIRATORY_THERAPY"], ["sinus", "bradycardia"]),
  template("sinus_tachycardia", "Sinus tachycardia", [101, 160], "regular", "present", "normal", [0.06, 0.10], ["sinus P waves", "rate above 100"], ["irregularly irregular rhythm", "sawtooth flutter waves"], "basic", ["RN", "PN", "RPN", "NP", "PARAMEDIC", "CARDIAC_TECH", "RESPIRATORY_THERAPY"], ["sinus", "tachycardia"]),
  template("atrial_fibrillation", "Atrial fibrillation", [60, 180], "irregular", "absent", "not_measurable", [0.06, 0.11], ["irregularly irregular R-R intervals", "no organized P waves"], ["regular rhythm", "consistent P waves before each QRS"], "basic", ["RN", "PN", "RPN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["atrial", "irregular"]),
  template("atrial_flutter", "Atrial flutter", [75, 150], "regularly_irregular", "flutter", "variable", [0.06, 0.11], ["sawtooth flutter waves", "fixed or variable conduction"], ["chaotic baseline", "flatline"], "intermediate", ["RN", "PN", "RPN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["atrial", "flutter"]),
  template("svt", "SVT", [150, 220], "regular", "absent", "not_measurable", [0.06, 0.10], ["very rapid regular narrow-complex rhythm", "P waves hidden or retrograde"], ["wide polymorphic QRS", "irregularly irregular rhythm"], "intermediate", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["tachycardia", "narrow-complex"], true),
  template("pvcs", "PVCs", [60, 120], "irregular", "variable", "variable", [0.12, 0.18], ["premature wide bizarre QRS", "compensatory pause"], ["all QRS complexes narrow", "progressive PR prolongation"], "basic", ["RN", "PN", "RPN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["ventricular", "ectopy"]),
  template("pacs", "PACs", [60, 120], "irregular", "present", "variable", [0.06, 0.10], ["early atrial beat", "abnormal premature P wave"], ["wide bizarre QRS for every beat", "absent atrial activity"], "basic", ["RN", "PN", "RPN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["atrial", "ectopy"]),
  template("ventricular_tachycardia", "Ventricular tachycardia", [120, 250], "regular", "absent", "not_measurable", [0.14, 0.22], ["rapid wide-complex rhythm", "AV dissociation may be present"], ["narrow QRS", "normal sinus P before each QRS"], "advanced", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["ventricular", "acls"], true),
  template("ventricular_fibrillation", "Ventricular fibrillation", [0, 0], "chaotic", "absent", "not_measurable", [0, 0], ["chaotic waveform", "no organized QRS complexes"], ["organized recurring QRS", "measurable PR interval"], "advanced", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["ventricular", "arrest", "acls"], true),
  template("asystole", "Asystole", [0, 0], "absent", "absent", "not_measurable", [0, 0], ["near-flat baseline", "no ventricular complexes"], ["recurring QRS complexes", "organized rhythm"], "advanced", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["arrest", "acls"], true),
  template("pea", "PEA", [20, 120], "regular", "variable", "variable", [0.06, 0.16], ["organized electrical activity", "pulseless clinical context"], ["shockable VF pattern", "normal perfusing rhythm"], "advanced", ["RN", "NP", "PARAMEDIC"], ["arrest", "acls"], true),
  template("first_degree_av_block", "First-degree AV block", [60, 100], "regular", "present", "prolonged", [0.06, 0.10], ["PR interval greater than 0.20 seconds", "each P conducts to QRS"], ["dropped QRS complexes", "AV dissociation"], "intermediate", ["RN", "PN", "RPN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["av-block"]),
  template("second_degree_type_i_av_block", "Second-degree type I AV block", [40, 90], "regularly_irregular", "present", "progressive_prolongation", [0.06, 0.10], ["progressive PR prolongation", "dropped QRS after lengthening"], ["fixed PR before dropped beats", "complete AV dissociation"], "advanced", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["av-block"]),
  template("second_degree_type_ii_av_block", "Second-degree type II AV block", [30, 80], "regularly_irregular", "present", "dropped_beats", [0.08, 0.14], ["constant PR intervals", "intermittent nonconducted P waves"], ["progressive PR prolongation", "irregularly irregular fibrillatory baseline"], "advanced", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["av-block"], true),
  template("third_degree_av_block", "Third-degree AV block", [20, 60], "regularly_irregular", "dissociated", "av_dissociation", [0.10, 0.18], ["P waves and QRS march independently", "slow escape rhythm"], ["one P before every QRS with fixed PR", "atrial fibrillation baseline"], "advanced", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["av-block"], true),
  template("bundle_branch_block", "Bundle branch block", [50, 120], "regular", "present", "normal", [0.12, 0.18], ["wide QRS", "bundle branch morphology"], ["narrow QRS", "chaotic baseline"], "intermediate", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["conduction"]),
  template("stemi_pattern", "STEMI pattern", [50, 130], "regular", "present", "normal", [0.06, 0.11], ["ST elevation in contiguous leads", "reciprocal changes may appear"], ["normal ST segments", "diffuse flatline"], "advanced", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["ischemia", "stemi"], true),
  template("hyperkalemia_pattern", "Hyperkalemia pattern", [40, 120], "regular", "variable", "variable", [0.10, 0.20], ["peaked T waves", "QRS widening when severe"], ["flat T waves", "prominent U waves as primary feature"], "advanced", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["electrolytes"], true),
  template("hypokalemia_pattern", "Hypokalemia pattern", [50, 120], "regular", "present", "normal", [0.06, 0.11], ["flattened T waves", "prominent U waves"], ["peaked tented T waves", "sine-wave QRS"], "intermediate", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["electrolytes"]),
  template("torsades_de_pointes", "Torsades de pointes", [150, 250], "regularly_irregular", "absent", "not_measurable", [0.14, 0.24], ["polymorphic VT", "twisting QRS amplitude around baseline"], ["monomorphic amplitude", "narrow QRS"], "advanced", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["ventricular", "qt", "acls"], true, "prolonged"),
  template("paced_rhythm", "Paced rhythm", [50, 100], "regular", "paced", "variable", [0.12, 0.18], ["pacemaker spikes", "wide paced QRS capture"], ["no pacer spikes", "narrow native-only QRS"], "advanced", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["pacemaker"]),
  // Pediatric normal variant — cyclic R-R variation, NOT a pathologic arrhythmia.
  // regularity "regularly_irregular" triggers special RSA sinusoidal modulation in beatOffsets().
  template("respiratory_sinus_arrhythmia", "Respiratory sinus arrhythmia", [55, 120], "regularly_irregular", "present", "normal", [0.06, 0.10], ["cyclic R-R variation with breathing", "uniform sinus P-waves throughout", "narrow QRS"], ["chaotic R-R without respiratory correlation", "absent or variable P-wave morphology"], "basic", ["RN", "PN", "RPN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["sinus", "pediatric", "normal_variant"]),

  // ── Junctional rhythms ─────────────────────────────────────────────────────────
  // AV node becomes the primary pacemaker; no sinus P-waves before QRS.
  template("junctional_rhythm", "Junctional rhythm", [40, 60], "regular", "absent", "not_measurable", [0.06, 0.10], ["narrow QRS", "rate 40-60 BPM", "absent or retrograde P-waves", "no upright sinus P before QRS"], ["upright sinus P preceding every QRS", "wide bizarre QRS complexes"], "intermediate", ["RN", "PN", "RPN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["junctional"]),
  template("accelerated_junctional_rhythm", "Accelerated junctional rhythm", [61, 100], "regular", "absent", "not_measurable", [0.06, 0.10], ["narrow QRS", "rate 61-100 BPM", "no sinus P-waves", "AV node rate competes with or suppresses sinus node"], ["wide QRS", "clear upright sinus P before every QRS"], "intermediate", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["junctional"]),

  // ── Ventricular escape rhythms ─────────────────────────────────────────────────
  // Slow idioventricular: backup ventricular pacemaker fires when higher pacemakers fail.
  template("ventricular_escape_rhythm", "Ventricular escape rhythm", [20, 40], "regular", "absent", "not_measurable", [0.12, 0.20], ["wide bizarre QRS", "very slow rate 20-40 BPM", "no sinus P-waves", "backup ventricular pacemaker site"], ["narrow QRS", "normal P-wave axis", "rate above 40 BPM"], "advanced", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["ventricular", "bradycardia", "escape"], true),
  // Accelerated idioventricular rhythm (AIVR): ventricular ectopic pacemaker at 41-100 BPM.
  template("idioventricular_rhythm", "Idioventricular rhythm (AIVR)", [41, 100], "regular", "absent", "not_measurable", [0.12, 0.20], ["wide QRS", "rate 41-100 BPM", "no sinus P-waves", "AV dissociation may be visible", "common post-reperfusion in AMI"], ["narrow QRS", "upright sinus P before every QRS"], "advanced", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["ventricular", "conduction"]),

  // ── Bundle branch blocks ───────────────────────────────────────────────────────
  // RBBB: right bundle fails → delayed right ventricular activation → RSR' in V1, wide S in I/V6.
  template("right_bundle_branch_block", "Right bundle branch block", [50, 120], "regular", "present", "normal", [0.12, 0.18], ["RSR' pattern in V1 (rabbit ears)", "wide S wave in lead I and V6", "wide QRS ≥ 0.12s", "secondary ST-T changes in V1–V3"], ["narrow QRS", "absent P-waves", "QS pattern in V1"], "intermediate", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["conduction", "bundle-branch"]),
  // LBBB: left bundle fails → delayed LV activation → broad notched R in I/V6, QS in V1, discordant T.
  template("left_bundle_branch_block", "Left bundle branch block", [50, 120], "regular", "present", "normal", [0.12, 0.18], ["broad notched R in lead I and V6", "QS or rS pattern in V1", "wide QRS ≥ 0.12s", "discordant ST-T changes opposite to QRS"], ["narrow QRS", "RSR' in V1", "normal ST segments"], "intermediate", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["conduction", "bundle-branch"]),

  // ── NSTEMI pattern ─────────────────────────────────────────────────────────────
  // Subendocardial ischemia: ST depression ± T-wave flattening/inversion, no ST elevation.
  template("nstemi_pattern", "NSTEMI pattern", [50, 130], "regular", "present", "normal", [0.06, 0.11], ["ST depression ≥ 1mm in ≥ 2 contiguous leads", "T-wave flattening or inversion", "no ST elevation in the ischemic territory"], ["ST elevation", "normal ST-T segments throughout", "pathologic Q waves as sole finding"], "advanced", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["ischemia", "nstemi"], true),

  // ── Pediatric-specific rhythm templates ────────────────────────────────────────
  // NOTE: Rate ranges here represent the WIDEST cross-age-group span.
  // Always use defaultPediatricEcgStripConfig(rhythmKey, ageGroup) for age-specific rates.
  // These templates exist so the validator and renderer can look up morphology rules;
  // they are namespaced with "pediatric_" to prevent mixing with adult question banks.

  // Pediatric SVT: narrow-complex, very high rate. Neonates 220–300; adolescents 150–250.
  // Key discriminator vs sinus tachycardia: abrupt onset, rate fixed (not variable with activity).
  template("pediatric_svt", "Pediatric SVT", [150, 300], "regular", "absent", "not_measurable", [0.04, 0.08],
    ["very rapid narrow-complex tachycardia", "abrupt onset/offset", "rate fixed regardless of activity", "P-waves absent or retrograde after QRS"],
    ["gradual rate change with activity (suggests sinus tach)", "wide QRS without aberrancy", "variable rate"],
    "advanced", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["tachycardia", "pediatric", "svt", "pals"], true),

  // Pediatric hypoxic bradycardia: final step before cardiac arrest. Hypoxia primary cause.
  // Rate below age-appropriate threshold + poor perfusion = ventilate immediately.
  template("pediatric_hypoxic_bradycardia", "Pediatric hypoxic bradycardia", [0, 60], "regular", "present", "normal", [0.04, 0.08],
    ["rate below age-appropriate threshold", "sinus P-waves present initially", "progressive rate slowing", "poor perfusion signs"],
    ["adequate perfusion with bradycardia", "complete AV block with narrow QRS", "junctional escape with retrograde P"],
    "advanced", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["bradycardia", "pediatric", "hypoxia", "pals", "arrest"], true),

  // Junctional ectopic tachycardia (JET): post-cardiac-surgery narrow-complex tachycardia.
  // AV dissociation may be subtle. NOT shockable — cardioversion will not terminate JET.
  template("junctional_ectopic_tachycardia", "Junctional ectopic tachycardia (JET)", [180, 250], "regular", "absent", "not_measurable", [0.04, 0.09],
    ["narrow or near-narrow QRS", "rate 180–250 in post-op neonates/infants", "AV dissociation (slower P-waves march independently)", "does NOT terminate with adenosine or cardioversion"],
    ["terminates with adenosine (rules out JET)", "irregular rhythm", "wide QRS without aberrancy"],
    "advanced", ["RN", "NP", "CARDIAC_TECH"], ["tachycardia", "pediatric", "junctional", "post-op", "congenital-heart"], true),

  // Pediatric VT: wide-complex tachycardia in children. Less common than in adults.
  // Primary cause in children: structural heart disease, channelopathy, post-op.
  template("pediatric_ventricular_tachycardia", "Pediatric ventricular tachycardia", [120, 300], "regular", "absent", "not_measurable", [0.12, 0.22],
    ["wide-complex tachycardia", "AV dissociation", "rate above age-normal", "fusion beats or capture beats may be visible"],
    ["narrow QRS", "adenosine-terminable (suggests SVT with aberrancy)", "rate within age-normal sinus range"],
    "advanced", ["RN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["ventricular", "pediatric", "pals", "arrest"], true),

  // Pediatric sinus rhythm — normal variant for age. Rate range spans all age groups.
  // Use defaultPediatricEcgStripConfig("pediatric_normal_sinus", ageGroup) for age-specific rate.
  template("pediatric_normal_sinus", "Pediatric normal sinus rhythm", [55, 160], "regular", "present", "normal", [0.04, 0.09],
    ["upright P before every QRS", "rate within age-appropriate normal range", "narrow QRS for age", "shorter PR interval than adult norms"],
    ["rate outside age-appropriate range", "absent or retrograde P-waves", "irregular rhythm"],
    "basic", ["RN", "PN", "RPN", "NP", "PARAMEDIC", "CARDIAC_TECH"], ["sinus", "pediatric", "normal"]),
];

function template(
  rhythmKey: string,
  rhythmName: string,
  expectedRateRange: [number, number],
  rhythmRegularity: EcgRhythmTemplate["rhythmRegularity"],
  pWavePresence: EcgRhythmTemplate["pWavePresence"],
  prIntervalPattern: EcgRhythmTemplate["prIntervalPattern"],
  qrsWidthRange: [number, number],
  keyRecognitionFeatures: string[],
  contraindicatedIncorrectFeatures: string[],
  difficulty: EcgRhythmDifficulty,
  applicableTiers: EcgTierScope[],
  clinicalTags: string[],
  highRisk = false,
  qtBehavior: EcgRhythmTemplate["qtBehavior"] = "normal",
): EcgRhythmTemplate {
  return {
    rhythmKey,
    rhythmName,
    expectedRateRange,
    rhythmRegularity,
    pWavePresence,
    prIntervalPattern,
    qrsWidthRange,
    qtBehavior,
    keyRecognitionFeatures,
    contraindicatedIncorrectFeatures,
    difficulty,
    applicableTiers,
    clinicalTags,
    highRisk,
  };
}

export function getEcgRhythmTemplate(rhythmKey: string): EcgRhythmTemplate | null {
  return ECG_RHYTHM_TEMPLATES.find((template) => template.rhythmKey === rhythmKey) ?? null;
}

export const ECG_RHYTHM_TEMPLATE_KEYS = ECG_RHYTHM_TEMPLATES.map((template) => template.rhythmKey);
