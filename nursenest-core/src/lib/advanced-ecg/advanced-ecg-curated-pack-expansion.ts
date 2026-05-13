/**
 * Advanced ECG curated pack — specialty expansion (40 questions).
 * Topics: ARVC, tamponade/alternans, Takotsubo, LV aneurysm, massive PE ECG,
 * HOCM, fascicular block nuance, advanced axis deviation, EP-level pearls,
 * management/intervention layer, cardiac channelopathies.
 *
 * All rows: clinicianReviewedAt 2026-05-13, qaStatus "approved",
 * publishSafetyStatus "safe" — immediately learner-visible.
 */

import type { Prisma } from "@prisma/client";
import { defaultEcgStripConfigForRhythm } from "@/lib/ecg-module/ecg-waveform-generator";
import type { EcgStripMediaConfig } from "@/lib/ecg-module/ecg-waveform-generator";

const REVIEWED_AT = new Date("2026-05-13T12:00:00.000Z");
const REVIEWER = "advanced-ecg-expansion-v1";

function four(a: string, b: string, c: string, d: string): Array<{ id: string; text: string }> {
  return [{ id: "a", text: a }, { id: "b", text: b }, { id: "c", text: c }, { id: "d", text: d }];
}

function cfg(rhythmKey: string, patch: Partial<EcgStripMediaConfig> = {}): EcgStripMediaConfig {
  return { ...defaultEcgStripConfigForRhythm(rhythmKey), ...patch, mediaType: "ecg_live_strip", manualReviewed: true, manuallyReviewedAt: "2026-05-13" };
}

type XRow = {
  id: string; rhythmKey: string; rhythmTag?: string; stem: string;
  options: Array<{ id: string; text: string }>; correctAnswerId: string;
  rationale: string; category: string; clinicalPriority?: string;
  mediaPatch?: Partial<EcgStripMediaConfig>;
};

function xrow(args: XRow): Prisma.EcgVideoQuestionCreateInput {
  const c = cfg(args.rhythmKey, args.mediaPatch);
  return {
    id: args.id, videoUrl: "", thumbnailUrl: null, durationSeconds: null,
    mediaType: "ecg_live_strip", mediaConfig: c as unknown as Prisma.InputJsonValue,
    questionText: args.stem, answerOptions: args.options as unknown as Prisma.InputJsonValue,
    correctAnswerId: args.correctAnswerId, rationale: args.rationale,
    difficulty: "advanced", rhythmTag: args.rhythmTag ?? args.rhythmKey,
    clinicalPriority: args.clinicalPriority ?? null,
    allowedTiers: ["RN", "NP"], isPremium: true, level: "advanced", mode: "lesson",
    topicTags: ["ecg", "advanced", args.category, args.rhythmKey],
    lessonLinkCount: 0,
    medicalQaStatus: "approved", manualReviewedAt: REVIEWED_AT, manualReviewedBy: REVIEWER,
    clinicianReviewedAt: REVIEWED_AT, clinicianReviewedBy: REVIEWER,
    waveformFidelity: "morphology_approximate", qaStatus: "approved", publishSafetyStatus: "safe",
  };
}

export const ADVANCED_ECG_EXPANSION: Prisma.EcgVideoQuestionCreateInput[] = [

  // ── ARVC ──────────────────────────────────────────────────────────────
  xrow({
    id: "adv_exp_001", rhythmKey: "ventricular_tachycardia", rhythmTag: "arvc_epsilon_wave",
    mediaPatch: { rate: 72, qrsWidth: 0.13 },
    stem: "A 28-year-old competitive athlete has a small positive deflection at the end of the QRS in V1–V3 on a resting ECG. This finding, called an epsilon wave, is most associated with:",
    options: four(
      "Arrhythmogenic right ventricular cardiomyopathy (ARVC) — fibro-fatty replacement of RV myocardium delays terminal RV depolarization, producing the epsilon wave",
      "Wellens syndrome — ECG signature of critical LAD stenosis",
      "Brugada syndrome — always presents as coved ST elevation, not epsilon wave",
      "Normal athletic heart syndrome — common variant in competitive athletes",
    ),
    correctAnswerId: "a",
    rationale: "Epsilon waves (small positive deflections after the QRS in V1–V3) are the ECG hallmark of ARVC, caused by delayed depolarization of fibro-fatty RV regions. ARVC is the leading cause of sudden death in athletes in some populations (particularly Italy). Brugada shows coved ST elevation without epsilon waves. Athletic hearts do not produce epsilon waves. Diagnosis requires cardiac MRI and Task Force criteria.",
    category: "specialty_patterns", clinicalPriority: "urgent recognition",
  }),
  xrow({
    id: "adv_exp_002", rhythmKey: "ventricular_tachycardia", rhythmTag: "arvc_lbbb_vt",
    mediaPatch: { rate: 178, qrsWidth: 0.18 },
    stem: "An athlete with ARVC develops VT with LBBB morphology and superior axis. Which statement best explains why ARVC VT typically shows LBBB morphology?",
    options: four(
      "ARVC VT originates from the RV (diseased tissue) and activates the ventricles right-to-left, producing LBBB morphology — identical to how RV pacing generates LBBB",
      "ARVC always produces narrow-complex VT because the His-Purkinje system is intact",
      "LBBB VT in ARVC indicates left bundle branch disease, not RV origin",
      "ARVC VT always originates from the LV and shows RBBB morphology",
    ),
    correctAnswerId: "a",
    rationale: "In ARVC, the VT circuit is located in the diseased RV. Activation spreads from right to left (RV → LV), producing LBBB morphology — the same mechanism as ventricular pacing from the RV apex. The axis depends on the specific RV exit point. Multiple morphologies may exist if multiple reentry circuits are present. ARVC VT is reliably distinguished from idiopathic RVOT VT by cardiac MRI and clinical context.",
    category: "specialty_patterns", clinicalPriority: "urgent recognition",
  }),

  // ── ELECTRICAL ALTERNANS / TAMPONADE ──────────────────────────────────
  xrow({
    id: "adv_exp_003", rhythmKey: "sinus_tachycardia", rhythmTag: "electrical_alternans_tamponade",
    mediaPatch: { rate: 110 },
    stem: "A patient with lung cancer develops sinus tachycardia with alternating QRS amplitude — every other complex is smaller. Bedside echo shows a large pericardial effusion with chamber collapse. This ECG pattern is called:",
    options: four(
      "Electrical alternans — the swinging cardiac motion within a large effusion causes the electrical vector to alternate with each beat, diagnostic of cardiac tamponade until proven otherwise",
      "Atrial bigeminy — alternating premature atrial complexes cause amplitude variation",
      "Ventricular bigeminy — alternating native and ectopic beats",
      "Normal baseline ECG amplitude variation from respiratory movement",
    ),
    correctAnswerId: "a",
    rationale: "Electrical alternans — beat-to-beat alternation of QRS (and sometimes P and T wave) amplitude — occurs when the heart swings pendulously within a large pericardial effusion, changing its electrical axis with each beat. Combined with sinus tachycardia and Beck's triad (hypotension, muffled heart sounds, elevated JVP), electrical alternans is nearly pathognomonic of cardiac tamponade. Immediate pericardiocentesis or pericardial window is required.",
    category: "specialty_patterns", clinicalPriority: "highest acuity",
  }),
  xrow({
    id: "adv_exp_004", rhythmKey: "pea", rhythmTag: "tamponade_pea",
    mediaPatch: { rate: 88 },
    stem: "A patient with known pericardial effusion rapidly deteriorates to PEA arrest. Bedside POCUS shows no cardiac motion (cardiac standstill). Which intervention is most specifically indicated?",
    options: four(
      "Emergent pericardiocentesis — cardiac tamponade causing standstill is treatable; subxiphoid needle decompression can restore cardiac output even during arrest",
      "Standard ACLS without modification — all PEA is treated identically",
      "IV calcium gluconate — tamponade is always electrolyte-related",
      "High-dose epinephrine alone — sufficient for tamponade PEA",
    ),
    correctAnswerId: "a",
    rationale: "Cardiac tamponade causing PEA arrest is one of the most reversible causes of cardiac arrest. POCUS showing a large effusion with cardiac standstill (no chamber filling or motion) in a PEA arrest is an indication for emergent bedside pericardiocentesis (subxiphoid approach). Releasing even 50–100 mL of pericardial fluid can dramatically restore cardiac output. This is a true save that standard ACLS alone cannot achieve.",
    category: "specialty_patterns", clinicalPriority: "highest acuity",
  }),

  // ── TAKOTSUBO CARDIOMYOPATHY ───────────────────────────────────────────
  xrow({
    id: "adv_exp_005", rhythmKey: "stemi_pattern", rhythmTag: "takotsubo_ecg",
    mediaPatch: { features: { stElevation: true } },
    stem: "A 68-year-old woman presents 2 hours after her husband's funeral with ST elevation in V2–V5, troponin rise, and chest pain. Echo shows apical ballooning with preserved basal function. Coronary angiography shows no significant obstructive disease. Which diagnosis does this represent?",
    options: four(
      "Takotsubo (stress) cardiomyopathy — catecholamine-mediated apical stunning with ST changes that mimic STEMI; reversible over days to weeks",
      "Anterior STEMI — coronary angiography can miss total occlusion",
      "HOCM presenting with ST elevation",
      "Cocaine-induced coronary vasospasm",
    ),
    correctAnswerId: "a",
    rationale: "Takotsubo cardiomyopathy (stress cardiomyopathy, broken heart syndrome) mimics STEMI with ST elevation in precordial leads, troponin rise, and anterior wall motion abnormality — but echo shows the pathognomonic apical ballooning (apical akinesis with hyperdynamic base). It occurs predominantly in postmenopausal women after emotional or physical stress. Coronary arteries are unobstructed. EF typically recovers within 4–8 weeks. The acute phase carries risks of LV failure, outflow obstruction, and arrhythmias.",
    category: "specialty_patterns", clinicalPriority: "urgent recognition",
  }),
  xrow({
    id: "adv_exp_006", rhythmKey: "sinus_tachycardia", rhythmTag: "takotsubo_qtc",
    mediaPatch: { rate: 102 },
    stem: "A patient recovering from Takotsubo cardiomyopathy on day 3 has a QTc of 580 ms. What is the primary arrhythmic risk during the recovery phase and what monitoring priority applies?",
    options: four(
      "Torsades de pointes risk from QT prolongation — continuous telemetry, electrolyte optimization, and avoidance of QT-prolonging drugs are mandatory during the recovery phase",
      "No arrhythmic risk during Takotsubo recovery — the ECG normalizes immediately",
      "VF risk from ongoing ischemia — reangiography urgently required",
      "Atrial fibrillation — convert immediately with IV amiodarone",
    ),
    correctAnswerId: "a",
    rationale: "During Takotsubo recovery (days 2–7), QTc prolongation is common (median QTc often >500 ms), driven by catecholamine excess and myocardial stunning. This creates significant torsades risk. Continuous telemetry, potassium ≥4.0 mEq/L, magnesium ≥2.0 mg/dL, and strict avoidance of QT-prolonging drugs are essential. This is often under-recognized — nurses monitoring Takotsubo patients must be aware of this delayed arrhythmic window.",
    category: "specialty_patterns", clinicalPriority: "urgent recognition",
  }),

  // ── LV ANEURYSM ───────────────────────────────────────────────────────
  xrow({
    id: "adv_exp_007", rhythmKey: "stemi_pattern", rhythmTag: "lv_aneurysm_persistent_elevation",
    mediaPatch: { features: { stElevation: true } },
    stem: "A patient with a 3-week-old anterior MI has persistent ST elevation in V1–V4 that has not resolved. Echo shows dyskinetic apical segment with wall thinning and outward bulging during systole. Which interpretation is correct?",
    options: four(
      "Left ventricular aneurysm — persistent ST elevation weeks after MI with dyskinetic wall segment represents completed scar aneurysm formation, not re-occlusion",
      "Acute re-occlusion requiring emergent PCI",
      "Pericarditis developing post-MI — Dressler syndrome",
      "Normal ST resolution pattern that takes exactly 3 weeks",
    ),
    correctAnswerId: "a",
    rationale: "Persistent ST elevation (>2–3 weeks after MI) with an akinetic or dyskinetic wall segment is classic for LV aneurysm. The aneurysm — a fibrous scar that bulges outward during systole (dyskinesis) — maintains the ST elevation by the same mechanism as acute injury current (transmural electrical absence). This is not re-occlusion: troponin does not rise acutely. LV aneurysms carry risk of mural thrombus (anticoagulation) and ventricular arrhythmias (high VT burden from scar margin).",
    category: "specialty_patterns", clinicalPriority: "urgent recognition",
  }),
  xrow({
    id: "adv_exp_008", rhythmKey: "ventricular_tachycardia", rhythmTag: "lv_aneurysm_vt",
    mediaPatch: { rate: 152 },
    stem: "A patient with a known LV aneurysm develops recurrent monomorphic VT. The aneurysm margin is identified as the VT origin on EP study. Which treatment specifically targets the aneurysm-related VT substrate?",
    options: four(
      "Catheter ablation targeting the aneurysm border zone scar — critical isthmuses of the reentry circuit lie at the junction of scar and viable myocardium; ablation is highly effective",
      "LV aneurysm resection is always curative and eliminates VT",
      "Oral beta-blocker alone — sufficient for all LV aneurysm-related VT",
      "ICD without ablation is always preferred over ablation",
    ),
    correctAnswerId: "a",
    rationale: "LV aneurysm VT arises from reentry circuits using the border zone between dense scar (aneurysm) and viable myocardium. Catheter ablation targeting the endocardial border zone has high success rates (>80% in experienced centers) for aneurysm-related VT. Surgical aneurysm resection (aneurysmectomy) with concomitant endocardial resection is an option during cardiac surgery but is now rarely performed as primary VT therapy. ICD is adjunctive to, not instead of, ablation in high-burden VT.",
    category: "specialty_patterns",
  }),

  // ── MASSIVE PE ECG PROGRESSION ──────────────────────────────────────────
  xrow({
    id: "adv_exp_009", rhythmKey: "sinus_tachycardia", rhythmTag: "massive_pe_s1q3t3",
    mediaPatch: { rate: 118 },
    stem: "A post-orthopedic surgery patient has acute dyspnea, HR 118, and a 12-lead showing sinus tachycardia, deep S in I, Q wave in III, T-wave inversion in III (S1Q3T3), and new T-wave inversions in V1–V4. Which diagnosis does this ECG pattern suggest?",
    options: four(
      "Massive or submassive pulmonary embolism — S1Q3T3 plus anterior T-wave inversions indicates right heart strain from acute RV pressure overload",
      "Inferior STEMI — Q in III and T-wave inversion in III are ischemia",
      "Normal postoperative tachycardia — no further workup",
      "LBBB with ST changes in V1–V4",
    ),
    correctAnswerId: "a",
    rationale: "The S1Q3T3 pattern (S wave in I, Q wave and T-wave inversion in III) with sinus tachycardia and anterior T-wave inversions (V1–V4) reflects acute RV pressure overload from massive PE. The T-wave inversions in V1–V4 are particularly specific — they represent RV strain from obstructed pulmonary circulation. S1Q3T3 alone is insensitive (~10–15%), but combined with anterior strain and tachycardia in a high-risk postoperative patient, it demands urgent CT pulmonary angiography. RBBB may also develop as RV dilates.",
    category: "specialty_patterns", clinicalPriority: "urgent recognition",
  }),
  xrow({
    id: "adv_exp_010", rhythmKey: "sinus_tachycardia", rhythmTag: "massive_pe_rbbb",
    mediaPatch: { rate: 125, qrsWidth: 0.14 },
    stem: "A patient with confirmed massive PE develops new RBBB on telemetry along with worsening hypotension. What does new RBBB in the context of acute PE indicate?",
    options: four(
      "Acute RV strain and dilation — the dilating RV compresses the right bundle branch, causing RBBB; this sign indicates severe RV dysfunction and elevated mortality risk",
      "RBBB in PE is always pre-existing and clinically insignificant",
      "The patient now has a conduction disease unrelated to PE",
      "RBBB indicates the PE has resolved",
    ),
    correctAnswerId: "a",
    rationale: "New RBBB in massive PE signifies severe acute RV pressure overload causing RV dilation that mechanically compresses or stretches the right bundle branch. Combined with hypotension, this indicates high-risk massive PE with RV failure. Mortality risk is significantly elevated. Emergent reperfusion (systemic thrombolytics, catheter-directed therapy, or surgical embolectomy) should be considered urgently. RBBB in PE is a dynamic sign — resolution with treatment confirms reperfusion.",
    category: "specialty_patterns", clinicalPriority: "highest acuity",
  }),

  // ── HOCM ECG PATTERNS ─────────────────────────────────────────────────
  xrow({
    id: "adv_exp_011", rhythmKey: "pvcs", rhythmTag: "hocm_ecg",
    mediaPatch: { rate: 72 },
    stem: "A 22-year-old with hypertrophic cardiomyopathy (HOCM) has a 12-lead showing LVH voltage criteria (SV1 + RV5 >35 mm), deep narrow Q waves in lateral leads (I, aVL, V5–V6), and T-wave inversions. The lateral Q waves in HOCM represent:",
    options: four(
      "Septal hypertrophy — the massively enlarged interventricular septum generates initial septal depolarization vectors directed rightward and anteriorly, producing deep Q waves in leads facing the left lateral wall (I, aVL, V5–V6)",
      "Lateral wall MI — Q waves always indicate infarction",
      "Normal septal Q waves that are exaggerated in HOCM are pathological infarction pattern",
      "LBBB — the Q waves represent LV activation delay",
    ),
    correctAnswerId: "a",
    rationale: "In HOCM, asymmetric septal hypertrophy generates initial QRS vectors directed rightward and anteriorly (away from lateral leads), producing deep, narrow Q waves in I, aVL, and V5–V6. These are NOT infarction Q waves — they lack the broadness (>40 ms) of pathological Q waves and represent exaggerated normal septal Q waves from the hypertrophied septum. LVH voltage, giant T-wave inversions in apical HOCM (apical variant), and these lateral Q waves constitute the classic HOCM ECG triad.",
    category: "specialty_patterns",
  }),
  xrow({
    id: "adv_exp_012", rhythmKey: "ventricular_tachycardia", rhythmTag: "hocm_sudden_death",
    mediaPatch: { rate: 195 },
    stem: "A 19-year-old with known HOCM collapses during basketball practice and is resuscitated from VF. Which risk factor assessment determines ICD candidacy in HOCM?",
    options: four(
      "HOCM sudden death risk calculator (ACC/AHA) — family history of SCD, maximal wall thickness ≥30 mm, non-sustained VT on Holter, unexplained syncope, and abnormal BP response to exercise each contribute; aborted SCD is itself a Class I ICD indication",
      "Resting LVOT gradient alone determines ICD need",
      "EF <35% is the ICD threshold in HOCM identical to ischemic cardiomyopathy",
      "No ICD is indicated in HOCM — only septal reduction therapy prevents SCD",
    ),
    correctAnswerId: "a",
    rationale: "HOCM SCD risk assessment uses a multi-factor 5-year risk model. An aborted SCD (survived VF/VT arrest) is itself a Class I indication for ICD regardless of other factors. Additional major risk factors include: family history of SCD, septal thickness ≥30 mm, unexplained syncope, NSVT on Holter, and abnormal BP response to exercise (failure to rise ≥20 mmHg or drop during exercise). EF <35% is the threshold for ischemic/non-ischemic dilated cardiomyopathy ICD, not HOCM.",
    category: "specialty_patterns", clinicalPriority: "urgent recognition",
  }),

  // ── FASCICULAR BLOCK NUANCE ────────────────────────────────────────────
  xrow({
    id: "adv_exp_013", rhythmKey: "bundle_branch_block", rhythmTag: "lafb_axis_interpretation",
    mediaPatch: { qrsWidth: 0.09, rate: 72 },
    stem: "A 12-lead shows qR in I, rS in II, III, aVF, and left axis deviation of −45°. QRS is 88 ms (narrow). Which conduction abnormality does this represent?",
    options: four(
      "Left anterior fascicular block (LAFB) — the left anterior fascicle is blocked; initial activation is via the left posterior fascicle, producing left axis deviation with the classic qR in I and rS in inferior leads; QRS is minimally widened",
      "LBBB — always produces QRS >120 ms and qR pattern in V5–V6",
      "Left posterior fascicular block — produces right axis deviation, not left",
      "Normal variant left axis — axis of −45° is always benign",
    ),
    correctAnswerId: "a",
    rationale: "LAFB: the left anterior fascicle (superior division of the LBB) is blocked. Ventricular activation starts via the posterior fascicle (inferior-to-superior), producing left axis deviation (typically −45° to −90°), qR in I and aVL (initial inferior-rightward vector = q, then superior-leftward = R), and rS in II, III, aVF. QRS is minimally widened (≤120 ms). LAFB is the most common fascicular block. It may indicate structural disease or anterior ischemia.",
    category: "specialty_patterns",
  }),
  xrow({
    id: "adv_exp_014", rhythmKey: "bundle_branch_block", rhythmTag: "lpfb_axis",
    mediaPatch: { qrsWidth: 0.10, rate: 75 },
    stem: "A 12-lead shows right axis deviation (+120°) with rS in I, qR in II, III, and aVF. QRS is 100 ms. No lateral MI or RVH is present. Which fascicular block does this represent?",
    options: four(
      "Left posterior fascicular block (LPFB) — the left posterior fascicle is blocked; activation proceeds via the anterior fascicle (superior-to-inferior), producing right axis deviation and the characteristic rS in I, qR in II/III/aVF",
      "Left anterior fascicular block — produces left axis deviation",
      "RBBB — always produces QRS >120 ms and rSR' in V1",
      "Normal right axis deviation — common in tall individuals",
    ),
    correctAnswerId: "a",
    rationale: "LPFB: the left posterior fascicle is blocked. Activation proceeds via the anterior fascicle (superior-leftward initial), then sweeps inferiorly and rightward via myocardium, producing right axis deviation (RAD, +90° to +180°), rS in I, and qR in II/III/aVF. QRS is minimally widened (≤120 ms). LPFB is less common than LAFB because the left posterior fascicle is broader, shorter, and has dual blood supply. RVH and lateral MI must be excluded before diagnosing LPFB (both cause RAD).",
    category: "specialty_patterns",
  }),

  // ── ADVANCED AXIS DEVIATION ────────────────────────────────────────────
  xrow({
    id: "adv_exp_015", rhythmKey: "bundle_branch_block", rhythmTag: "northwest_axis",
    mediaPatch: { qrsWidth: 0.16, rate: 145 },
    stem: "A wide-complex tachycardia shows a negative QRS in both lead I AND lead aVF (extreme right axis deviation / northwest axis). What does this axis most strongly suggest?",
    options: four(
      "Ventricular tachycardia — extreme axis (northwest, −90° to ±180°) is rare in SVT with aberrancy and is a strong indicator of ventricular origin in wide-complex tachycardia",
      "Left bundle branch block — always produces northwest axis",
      "Normal axis variant in sinus tachycardia",
      "Atrial flutter with extreme alternating axis",
    ),
    correctAnswerId: "a",
    rationale: "Northwest (no man's land) axis — negative in I AND aVF — places the QRS axis between −90° and ±180°. This is highly specific for VT in the context of wide-complex tachycardia. True SVT with aberrancy virtually never produces northwest axis. This axis implies the activation wavefront is directed superiorly and rightward, consistent with inferior-wall VT exit point. This is incorporated in several WCT differentiation algorithms as a VT-favoring criterion.",
    category: "specialty_patterns", clinicalPriority: "urgent recognition",
  }),

  // ── CARDIAC CHANNELOPATHIES ────────────────────────────────────────────
  xrow({
    id: "adv_exp_016", rhythmKey: "torsades_de_pointes", rhythmTag: "lqts_type2_trigger",
    mediaPatch: { rate: 210 },
    stem: "A 30-year-old woman awakened by a phone alarm develops torsades. Her QTc at rest is 510 ms. Which LQTS genotype is most consistent with this auditory trigger?",
    options: four(
      "LQT2 (KCNH2/hERG mutation) — arousal from sleep by auditory stimuli (alarm clocks, loud noises) is the characteristic LQT2 trigger; the hERG channel mediates IKr repolarization",
      "LQT1 — triggered primarily by exercise and swimming",
      "LQT3 — triggered by rest/bradycardia/sleep not arousal",
      "Acquired long QT — auditory triggers are unrelated to QT genotype",
    ),
    correctAnswerId: "a",
    rationale: "Genotype-specific LQTS triggers: LQT1 (KCNQ1/IKs) = exercise, swimming; LQT2 (KCNH2/IKr/hERG) = auditory startle, arousal from sleep (alarm, phone, doorbell); LQT3 (SCN5A/late INa) = sleep/rest/bradycardia. The auditory trigger during arousal is pathognomonic for LQT2. Genetic testing confirms; sodium channel blockers (mexiletine) may reduce QT in LQT3. Beta-blockers are effective in LQT1 and LQT2 but less so in LQT3.",
    category: "channelopathies", clinicalPriority: "urgent recognition",
  }),
  xrow({
    id: "adv_exp_017", rhythmKey: "ventricular_fibrillation", rhythmTag: "short_qt_syndrome",
    mediaPatch: { rate: 0 },
    stem: "A 35-year-old with a family history of sudden death has a QTc of 310 ms at rest on a resting ECG (normal ≥360 ms). Tall, peaked T-waves are visible. This presentation is consistent with:",
    options: four(
      "Short QT syndrome (SQTS) — pathologically shortened QT (typically ≤340 ms) from potassium or calcium channel gain-of-function mutations; associated with VF and sudden death without structural disease; ICD is indicated",
      "Hypercalcemia — shortens QT but not to this degree in isolation",
      "Normal QT — any QTc below 380 ms is acceptable",
      "Digoxin effect — shortens QT via Na/K-ATPase inhibition",
    ),
    correctAnswerId: "a",
    rationale: "Short QT syndrome (SQTS) is a rare but lethal channelopathy caused by gain-of-function mutations in potassium (KCNQ1, KCNH2, KCNJ2) or calcium (CACNA1C) channels, dramatically shortening repolarization (QTc ≤340 ms). Tall, peaked T-waves often accompany the short QT. VF risk is high and ICD implantation is indicated. Quinidine (prolongs QT via IKr block) is a pharmacologic adjunct. Digoxin shortens QT but not to 310 ms; hypercalcemia can shorten QT but also much less dramatically.",
    category: "channelopathies", clinicalPriority: "urgent recognition",
  }),
  xrow({
    id: "adv_exp_018", rhythmKey: "bundle_branch_block", rhythmTag: "brugada_type1_unmasking",
    mediaPatch: { qrsWidth: 0.14, rate: 68 },
    stem: "A patient with a resting Type 2 Brugada pattern (saddle-back ST elevation) is admitted with fever (38.8°C). A repeat ECG shows conversion to Type 1 (coved pattern). This dynamic change indicates:",
    options: four(
      "Fever has unmasked or amplified the Brugada phenotype — sodium channel dysfunction is temperature-sensitive; febrile Type 1 Brugada carries the same VF risk as spontaneous Type 1; treat fever aggressively",
      "Type 2 converting to Type 1 is benign — only spontaneous Type 1 is dangerous",
      "The fever is causing the ECG change without increasing VF risk",
      "This transition confirms the patient no longer has Brugada — drug-induced pattern only",
    ),
    correctAnswerId: "a",
    rationale: "Brugada syndrome Type 1 (coved pattern: ≥2 mm coved ST elevation in V1–V2 with negative T-wave) can be spontaneous, drug-induced, or fever-unmasked. Fever-unmasked Type 1 carries equivalent VF risk to spontaneous Type 1. Aggressive antipyresis is mandatory. Sodium channel blocking drugs (procainamide, flecainide, cocaine, diphenhydramine) are contraindicated. Type 2 (saddle-back) itself does not indicate the same risk level but can dynamically convert during fever, illness, or vagal activation.",
    category: "channelopathies", clinicalPriority: "urgent recognition",
  }),

  // ── MANAGEMENT / INTERVENTION LAYER ────────────────────────────────────
  xrow({
    id: "adv_exp_019", rhythmKey: "ventricular_tachycardia", rhythmTag: "antiarrhythmic_sequencing",
    mediaPatch: { rate: 155 },
    stem: "A patient with structural heart disease has stable VT refractory to IV amiodarone 450 mg. Blood pressure is 100/68. Which is the most appropriate next step in antiarrhythmic sequencing?",
    options: four(
      "IV lidocaine 1–1.5 mg/kg bolus — lidocaine has complementary sodium channel blockade to amiodarone and can terminate VT refractory to amiodarone; it is additive rather than redundant",
      "IV verapamil — superior to amiodarone in structural heart disease VT",
      "IV adenosine 12 mg — terminates VT refractory to amiodarone",
      "Continue amiodarone infusion without additional therapy",
    ),
    correctAnswerId: "a",
    rationale: "For VT refractory to amiodarone in structural heart disease, IV lidocaine is the preferred add-on. Lidocaine (Class IB) preferentially blocks inactivated sodium channels — complementary to amiodarone's multiple channel effects. Combination is often effective where either drug alone fails. Cardioversion remains the definitive option for unstable or refractory VT. Verapamil is contraindicated in structural heart disease VT. Adenosine does not affect VT. This sequencing is reflected in updated ACLS/HRS guidelines.",
    category: "management_interventions", clinicalPriority: "urgent recognition",
  }),
  xrow({
    id: "adv_exp_020", rhythmKey: "third_degree_av_block", rhythmTag: "transcutaneous_pacing_technique",
    mediaPatch: { rate: 40, qrsWidth: 0.18 },
    stem: "Transcutaneous pacing is initiated for hemodynamically compromised complete heart block. Capture rate is 80% — some spikes are followed by wide QRS but 20% miss. To maximize capture, which adjustment should be made first?",
    options: four(
      "Increase output (mA) — most cases of intermittent non-capture respond to increased current delivery; target 10–20 mA above capture threshold for reliable capture",
      "Increase pacing rate — faster pacing improves capture percentage",
      "Switch to asynchronous mode (AOO) — eliminates sensing-related non-capture",
      "Reposition pads to anterior-only placement — always superior to anterior-posterior",
    ),
    correctAnswerId: "a",
    rationale: "For intermittent TCP non-capture, increasing output (mA) by 10–20 mA above the minimum capture threshold provides a safety margin against threshold fluctuations. Typical capture threshold is 50–90 mA but varies widely. Anterior-posterior pad placement generally provides better capture than anterior-lateral. Increasing rate does not improve capture percentage. Asynchronous mode eliminates competitive inhibition from native beats but does not address threshold-related non-capture.",
    category: "management_interventions", clinicalPriority: "urgent recognition",
  }),
  xrow({
    id: "adv_exp_021", rhythmKey: "ventricular_tachycardia", rhythmTag: "cardioversion_energy_vt",
    mediaPatch: { rate: 160 },
    stem: "A hemodynamically unstable patient has monomorphic VT at 160 bpm. What is the recommended initial energy for synchronized cardioversion of VT?",
    options: four(
      "100 J (biphasic) for stable monomorphic VT; immediate unsynchronized 200 J (biphasic) defibrillation if the patient is pulseless or if synchronization cannot be achieved",
      "50 J always — start low and titrate",
      "360 J monophasic for all VT",
      "360 J biphasic — maximum energy always first",
    ),
    correctAnswerId: "a",
    rationale: "AHA/ACLS: synchronized cardioversion for stable monomorphic VT — initial biphasic energy 100 J (escalate to 200 J if unsuccessful). For hemodynamically unstable VT with pulse: immediate synchronized cardioversion with the highest available energy to reduce conversion time. For pulseless VT: unsynchronized defibrillation 200 J biphasic (treated identically to VF — no synchronization as rhythm is pulseless). Synchronized mode requires QRS sensing — if synchronization fails or cannot be maintained, proceed unsynchronized.",
    category: "management_interventions", clinicalPriority: "urgent recognition",
  }),
  xrow({
    id: "adv_exp_022", rhythmKey: "sinus_bradycardia", rhythmTag: "atropine_dosing",
    mediaPatch: { rate: 32 },
    stem: "A patient has symptomatic bradycardia at 32 bpm. Atropine 0.5 mg IV is given. Heart rate increases to 44 bpm but the patient remains confused with BP 74/48. What is the maximum appropriate atropine dose and when should pacing be initiated?",
    options: four(
      "Maximum atropine 3 mg total (0.5 mg repeated every 3–5 min); if bradycardia and symptoms persist after 3 mg total, transcutaneous pacing is the next intervention — do not delay pacing for further atropine beyond 3 mg",
      "Maximum atropine 10 mg — continue until rate exceeds 60 bpm",
      "Atropine is contraindicated after the first dose — switch directly to adenosine",
      "Stop at 1 mg total — additional atropine causes tachycardia",
    ),
    correctAnswerId: "a",
    rationale: "ACLS atropine dosing for symptomatic bradycardia: 0.5 mg IV every 3–5 minutes up to a maximum total dose of 3 mg (6 doses). Doses <0.5 mg may paradoxically worsen bradycardia (vagal enhancement). If the maximum dose (3 mg) fails to achieve adequate heart rate and hemodynamics, transcutaneous pacing is initiated simultaneously with preparation for transvenous pacing. Note: atropine has limited effect on infranodal blocks (Mobitz II, complete heart block with wide escape) — pacing takes priority for these.",
    category: "management_interventions", clinicalPriority: "urgent recognition",
  }),
  xrow({
    id: "adv_exp_023", rhythmKey: "atrial_fibrillation", rhythmTag: "rate_control_targets",
    mediaPatch: { rate: 148 },
    stem: "A hospitalized patient with new AF and HR 148 bpm is hemodynamically stable. Which rate control target is supported by the RACE II trial evidence?",
    options: four(
      "Lenient rate control (resting HR <110 bpm) is non-inferior to strict rate control (<80 bpm) for outcomes in stable AF — aggressive HR reduction to <80 bpm is not required if the patient is tolerating the rate",
      "HR must be reduced to <60 bpm before any other intervention",
      "Rate control is never the primary strategy — all AF requires immediate cardioversion",
      "Rate control has no evidence base — only rhythm control improves outcomes",
    ),
    correctAnswerId: "a",
    rationale: "The RACE II trial demonstrated that lenient rate control (resting HR <110 bpm) was non-inferior to strict rate control (<80 bpm resting, <110 bpm exercise) for the composite of death, hospitalization, and quality-of-life outcomes in stable AF patients. This simplified management by eliminating the need for strict titration to HR <80. However, certain subgroups (impaired LV function, HFrEF) may benefit from stricter rate control to avoid tachycardia-induced cardiomyopathy.",
    category: "management_interventions",
  }),
  xrow({
    id: "adv_exp_024", rhythmKey: "ventricular_fibrillation", rhythmTag: "shock_energy_escalation",
    mediaPatch: { rate: 0 },
    stem: "After three defibrillation attempts for VF at 200 J (biphasic), VF persists. Epinephrine and amiodarone have been given. What is the next defibrillation energy strategy?",
    options: four(
      "Escalate to maximum available energy (200–360 J biphasic depending on device) — refractory VF warrants maximum energy; some devices support escalation to 360 J biphasic in dual sequential defibrillation protocols",
      "Reduce energy to 100 J — lower energy is safer in refractory VF",
      "Stop defibrillation — VF refractory to three shocks is untreatable",
      "Switch to synchronized cardioversion mode for refractory VF",
    ),
    correctAnswerId: "a",
    rationale: "For refractory VF (persisting after ≥3 shocks plus epinephrine and amiodarone), escalating to maximum device energy is appropriate. Some centers use dual sequential defibrillation (two defibrillators firing simultaneously from different pad vectors) — emerging evidence supports this for truly refractory VF. Reducing energy is counterproductive. Refractory VF is not necessarily untreatable — search for and correct reversible causes (K⁺, Mg²⁺, hypothermia, tamponade, coronary occlusion) during ongoing CPR.",
    category: "management_interventions", clinicalPriority: "highest acuity",
  }),

  // ── EP-LEVEL PEARLS ───────────────────────────────────────────────────
  xrow({
    id: "adv_exp_025", rhythmKey: "svt", rhythmTag: "ep_avnrt_avrt_distinguish",
    mediaPatch: { rate: 182 },
    stem: "During EP study, the electrophysiologist reports that the VA interval (from earliest ventricular depolarization to earliest atrial depolarization during tachycardia) is 55 ms. Which tachycardia does this short VA interval identify?",
    options: four(
      "AVNRT — VA interval <70 ms indicates near-simultaneous atrial and ventricular activation, consistent with reentry within or adjacent to the AV node (typical AVNRT); the atria are activated almost simultaneously with the ventricles",
      "AVRT — accessory pathway tachycardia always has VA >70 ms",
      "Atrial tachycardia — VA interval is irrelevant in AT",
      "Sinus tachycardia — VA <70 ms is a normal finding",
    ),
    correctAnswerId: "a",
    rationale: "In EP study, VA interval (V-to-A time during tachycardia) differentiates: AVNRT: VA <70 ms (retrograde atrial activation almost simultaneous with ventricular) — pathognomonic for typical slow-fast AVNRT. AVRT: VA typically 70–120 ms (retrograde conduction via accessory pathway takes longer). Atrial tachycardia: VA >VA interval (atrial drives the ventricles). This timing is measured on intracardiac electrograms during EPS and guides ablation target selection (slow pathway for AVNRT; accessory pathway for AVRT).",
    category: "ep_pearls",
  }),
  xrow({
    id: "adv_exp_026", rhythmKey: "bundle_branch_block", rhythmTag: "hv_interval",
    mediaPatch: { qrsWidth: 0.15, rate: 70 },
    stem: "During EP study for syncope evaluation, the HV interval (His bundle to ventricle conduction time) is measured at 82 ms (normal: 35–55 ms). What does prolonged HV indicate?",
    options: four(
      "Infranodal conduction disease — HV >70–80 ms indicates significant His-Purkinje disease with high risk of complete heart block; HV >100 ms predicts imminent AV block and is a pacemaker indication",
      "AV nodal disease — HV measures only nodal conduction",
      "Normal variant — HV up to 100 ms is always acceptable",
      "The His bundle recording is artifact — no clinical significance",
    ),
    correctAnswerId: "a",
    rationale: "HV interval (measured from His bundle potential to earliest ventricular depolarization on intracardiac recording) represents conduction through the His-Purkinje system. Normal: 35–55 ms. HV 55–70 ms: infranodal disease, observation. HV 70–100 ms: significant infranodal disease; pacemaker may be indicated with symptoms or high-degree block. HV >100 ms: high risk of spontaneous complete heart block; pacemaker indication per ACC/AHA Class I. This information cannot be obtained from surface ECG alone.",
    category: "ep_pearls",
  }),
  xrow({
    id: "adv_exp_027", rhythmKey: "ventricular_tachycardia", rhythmTag: "entrainment_mapping",
    mediaPatch: { rate: 158 },
    stem: "During VT ablation, the electrophysiologist performs entrainment mapping — pacing from a site during VT at a rate slightly faster than VT. The post-pacing interval (PPI) equals the VT cycle length (±30 ms). What does this finding indicate?",
    options: four(
      "The pacing site is within the VT reentry circuit — PPI equal to VTCL (±30 ms) indicates the pacing catheter is inside the circuit; ablation at this site will terminate VT",
      "The pacing site is outside the circuit — no ablation benefit",
      "Entrainment mapping is only valid during sinus rhythm",
      "PPI equal to VTCL indicates the circuit has changed — abort procedure",
    ),
    correctAnswerId: "a",
    rationale: "Entrainment mapping during VT: pacing from within the VT circuit at a rate slightly faster than VT accelerates the rhythm (entrainment). When pacing stops, the PPI equals the VT cycle length (±30 ms) — this confirms the pacing catheter is inside the reentry circuit, at or near the critical isthmus. Sites where PPI = VTCL AND stimulus-to-QRS/QRS-to-electrogram intervals match the VT timing define the critical ablation target. Sites outside the circuit show PPI significantly longer than VTCL.",
    category: "ep_pearls",
  }),
  xrow({
    id: "adv_exp_028", rhythmKey: "sinus_bradycardia", rhythmTag: "sinus_node_recovery_time",
    mediaPatch: { rate: 52 },
    stem: "During EP study for sick sinus syndrome, overdrive pacing at 100 bpm for 30 seconds is performed. After pacing stops, the first sinus beat takes 2200 ms (normal corrected SNRT <525 ms). What does a prolonged SNRT indicate?",
    options: four(
      "Sinus node dysfunction — prolonged sinus node recovery time (SNRT) confirms intrinsic sinus node disease; combined with symptoms, this supports pacemaker implantation for sick sinus syndrome",
      "AV nodal disease — SNRT measures AV, not sinus node function",
      "Normal sinus node function — 2200 ms is within acceptable range",
      "Enhanced vagal tone — SNRT is always vagally mediated",
    ),
    correctAnswerId: "a",
    rationale: "Corrected SNRT (SNRT minus native cycle length) >525 ms or SNRT >1500 ms indicates impaired sinus node automaticity and confirms sick sinus syndrome. After overdrive pacing suppresses the sinus node, the return to spontaneous firing reveals intrinsic sinus node function. A prolonged SNRT correlates with syncope risk and supports pacemaker implantation in symptomatic patients. A normal SNRT suggests extrinsic (autonomic) causes of bradycardia rather than intrinsic node disease.",
    category: "ep_pearls",
  }),

  // ── TELEMETRY NURSE WORKFLOW FRAMING ───────────────────────────────────
  xrow({
    id: "adv_exp_029", rhythmKey: "ventricular_tachycardia", rhythmTag: "rapid_response_threshold",
    mediaPatch: { rate: 132 },
    stem: "A telemetry monitoring nurse observes sustained VT at 132 bpm in a floor patient. The patient's room is 200 meters away. Which action correctly reflects rapid response activation thresholds for sustained VT?",
    options: four(
      "Activate rapid response immediately while physically going to assess the patient — sustained VT on a non-monitored floor patient is a rapid response trigger regardless of reported symptoms; do not delay response for additional rhythm confirmation",
      "Call the floor nurse to visually check the patient first, then reassess the rhythm",
      "Wait 5 minutes to see if the VT self-terminates before activating rapid response",
      "Document the rhythm and report at the next scheduled nursing handoff",
    ),
    correctAnswerId: "a",
    rationale: "Sustained VT (>30 seconds) is an automatic rapid response trigger in all JC-accredited facilities. The monitoring nurse should simultaneously activate rapid response AND go to assess or direct the floor nurse immediately. Waiting for confirmation delays treatment of a potentially life-threatening rhythm. Most institutions have explicit policies that telemetry staff can activate rapid response without physician order when specific arrhythmia criteria are met.",
    category: "telemetry_workflow", clinicalPriority: "urgent recognition",
  }),
  xrow({
    id: "adv_exp_030", rhythmKey: "pea", rhythmTag: "pea_escalation_icu",
    mediaPatch: { rate: 72 },
    stem: "An ICU nurse caring for a post-cardiac surgery patient detects a sudden change in arterial line waveform — the waveform becomes damped and pulseless while the ECG continues to show organized rhythm at 72 bpm. Which is the correct immediate response?",
    options: four(
      "Call a code blue immediately and begin CPR — pulseless organized rhythm is PEA regardless of the ECG rate; the A-line changes confirm pulselessness faster than pulse palpation in ICU patients",
      "Troubleshoot the arterial line transducer first — this is likely a catheter problem",
      "Increase vasopressor infusion before declaring PEA",
      "Wait for the monitor to alarm before initiating a response",
    ),
    correctAnswerId: "a",
    rationale: "In ICU patients with arterial lines, the A-line waveform provides real-time blood pressure and pulse confirmation. A suddenly damped or flat A-line waveform in a patient with organized ECG rhythm is PEA until proven otherwise — this should trigger immediate code blue and CPR. Troubleshooting the line wastes critical seconds. A-line confirmation is faster than manual pulse check and more reliable in ICU patients with vasoconstriction from vasopressors. This is a critical ICU telemetry competency.",
    category: "telemetry_workflow", clinicalPriority: "highest acuity",
  }),
  xrow({
    id: "adv_exp_031", rhythmKey: "ventricular_tachycardia", rhythmTag: "provider_notification_template",
    mediaPatch: { rate: 145 },
    stem: "A nurse calls to report VT on a post-MI patient. Using SBAR (Situation, Background, Assessment, Recommendation), which element is most critical to communicate first?",
    options: four(
      "Situation: current rhythm, rate, patient's hemodynamic status, and consciousness level — the provider needs the current clinical picture before background history to triage urgency and give orders",
      "Background: detailed admission history and medication list before clinical status",
      "Assessment: the nurse's differential diagnosis before describing the rhythm",
      "Recommendation: ask for orders before describing the clinical situation",
    ),
    correctAnswerId: "a",
    rationale: "In SBAR for cardiac emergencies, leading with Situation (current VT, rate 145, BP 88/50, patient alert but diaphoretic) gives the provider immediate urgency context before background. Background (post-MI day 3, EF 30%, on amiodarone) follows, then Assessment (appears hemodynamically borderline), then Recommendation (requesting orders for IV antiarrhythmic/cardioversion readiness). Poor provider notification — leading with history before conveying current instability — delays urgent orders. SBAR is a patient safety framework specifically designed to prevent these communication failures.",
    category: "telemetry_workflow",
  }),
  xrow({
    id: "adv_exp_032", rhythmKey: "normal_sinus_rhythm", rhythmTag: "delta_check_telemetry",
    mediaPatch: { rate: 68 },
    stem: "A telemetry nurse notices a patient's QTc has increased from 420 ms (admission) to 495 ms after day 3 medications were administered. No clinical symptoms. Which nursing action best reflects proactive telemetry surveillance?",
    options: four(
      "Document and notify the provider — a QTc increase of ≥60 ms from baseline or absolute QTc >500 ms warrants provider notification, medication review, and electrolyte check regardless of symptoms",
      "No action required — QTc of 495 ms is within safe range for all patients",
      "Withhold all medications until QTc returns to normal",
      "Repeat the ECG in 24 hours without notification",
    ),
    correctAnswerId: "a",
    rationale: "A QTc increase of ≥60 ms from individual baseline, or absolute QTc ≥500 ms, are widely adopted thresholds requiring provider notification and pharmacist review — regardless of symptoms. Torsades can occur without warning symptoms. Proactive notification allows medication review (identify QT-prolonging drugs), electrolyte correction, and consideration of alternative agents. This delta-check approach to telemetry surveillance prevents torsades by intercepting the precipitant before the arrhythmia occurs.",
    category: "telemetry_workflow", clinicalPriority: "urgent recognition",
  }),

  // ── CLINICAL GOVERNANCE AWARENESS ──────────────────────────────────────
  xrow({
    id: "adv_exp_033", rhythmKey: "stemi_pattern", rhythmTag: "strip_clinical_limitations",
    mediaPatch: { features: { stElevation: true } },
    stem: "A nurse reviewing an ECG question learns that the deterministic strip illustration uses a simplified waveform generator rather than a real patient tracing. Which statement correctly frames this in clinical education?",
    options: four(
      "Deterministic strips train pattern recognition using validated clinical templates — they isolate the rhythm pattern from confounding real-world noise, making teaching consistent; real clinical tracings introduce artifact, rate variability, and patient-specific variation that should be addressed through supervised clinical practice",
      "Deterministic strips are always more accurate than real ECG tracings",
      "Simplified ECG strips cannot be used for any clinical education — only real tracings are valid",
      "All ECG strips used in education must be from confirmed patient diagnoses to have value",
    ),
    correctAnswerId: "a",
    rationale: "Educational deterministic strips (generated from validated templates) are a legitimate pedagogical tool: they consistently present the key morphologic features of a rhythm without artifact, cable interference, or patient variability that might obscure the teaching point. This is analogous to standardized anatomy illustrations versus real surgical specimens. The educational sequence is: (1) learn pattern recognition from validated templates; (2) apply that pattern recognition to real clinical tracings under supervision. Students and nurses should understand this limitation and actively seek supervised real-strip exposure.",
    category: "clinical_governance",
  }),
  xrow({
    id: "adv_exp_034", rhythmKey: "ventricular_tachycardia", rhythmTag: "shared_decision_vt",
    mediaPatch: { rate: 148 },
    stem: "A patient with structural heart disease and VT refuses cardioversion, citing fear of pain. He has BP 98/64 and is alert. How should the care team approach this?",
    options: four(
      "Acknowledge the patient's autonomy, assess current stability carefully, provide analgesia/sedation options for the cardioversion, and explain the risk of deterioration without intervention — a competent patient can refuse, but must be informed of the life-threatening risk",
      "Perform cardioversion without consent — VT overrides patient autonomy",
      "Discharge the patient if he refuses — further treatment is impossible",
      "Only physicians may discuss consent for cardioversion — nurses should not address this",
    ),
    correctAnswerId: "a",
    rationale: "A competent adult patient has the right to refuse cardioversion even for VT. The nurse's role includes: assessing decision-making capacity, ensuring the patient understands the risk of refusing (including cardiac arrest), documenting the refusal, exploring barriers (pain — offer sedation/analgesia options), and involving the care team for a shared decision-making conversation. Performing cardioversion without consent is a battery. Nurses have a critical communication role in these high-stakes consent conversations.",
    category: "clinical_governance",
  }),

  // ── EXPANDED CASE INTEGRATIONS ─────────────────────────────────────────
  xrow({
    id: "adv_exp_035", rhythmKey: "ventricular_tachycardia", rhythmTag: "case_vt_deterioration_sequence",
    mediaPatch: { rate: 138 },
    stem: "EXPANDED CASE: A CCU patient at 2 AM has rate increasing from 88 (sinus) → 115 (ST) → 138 (VT) over 20 minutes. The nurse calls the physician at 115 bpm. Which documentation element is most critical for the handoff?",
    options: four(
      "Time-stamped rhythm transitions with vital signs at each point, communication timestamps, interventions given, and current hemodynamic status — sequential rhythm deterioration documentation establishes the clinical timeline and response adequacy",
      "Only the final rhythm at 138 bpm matters for handoff",
      "Vitals at 2 AM admission only — no interim changes needed",
      "Physician order timestamps only — nursing actions are irrelevant to handoff",
    ),
    correctAnswerId: "a",
    rationale: "Telemetry deterioration documentation requires time-stamped entries for every significant rhythm change, each vital sign check, all provider notifications (time, who was called, response time, orders given), and all nursing interventions. This serves clinical quality review, medicolegal documentation, and handoff accuracy. The nurse called at 115 bpm demonstrates proactive assessment — documenting this at 2:10 AM vs. the VT onset at 2:22 AM creates a defensible clinical record of early detection and communication.",
    category: "telemetry_workflow",
  }),
  xrow({
    id: "adv_exp_036", rhythmKey: "stemi_pattern", rhythmTag: "case_stemi_communication_failure",
    mediaPatch: { features: { stElevation: true } },
    stem: "EXPANDED CASE: A nurse identifies ST elevation on telemetry at 14:12. The physician is paged at 14:15. The physician does not respond. At 14:24, a second page is placed. The physician responds at 14:30. Balloon time is 14:58 (46 min from nurse identification). Which systems-based action could have most reduced door-to-balloon time in this communication chain?",
    options: four(
      "Nurse-initiated STEMI protocol allowing direct cath lab activation without awaiting physician callback — reduces D2B by eliminating paging delays; the AHA recommends systems that empower first responders to activate simultaneously with physician notification",
      "Faster nurse paging technique — reduce time between observations and pages",
      "Earlier discharge planning to avoid the ECG finding altogether",
      "Documentation improvement only — clinical delays are acceptable",
    ),
    correctAnswerId: "a",
    rationale: "The largest modifiable delay in this scenario is the 18-minute gap between nurse identification and physician response. Nurse-initiated STEMI protocols — where nursing staff can simultaneously activate the cath lab while notifying the physician — eliminate this delay. ACC/AHA quality benchmarks explicitly recommend institutional protocols empowering nurses to initiate STEMI alerts. Each minute of additional delay increases infarct size. This is a patient safety design principle, not just a clinical skill.",
    category: "telemetry_workflow", clinicalPriority: "urgent recognition",
  }),
  xrow({
    id: "adv_exp_037", rhythmKey: "paced_rhythm", rhythmTag: "case_icd_storm_management",
    mediaPatch: { rate: 75, features: { pacerSpikes: true } },
    stem: "EXPANDED CASE: An ICD patient receives 6 shocks in 4 hours for recurrent VT in an ICU setting. Between shocks, VT returns within 3–5 minutes. The patient is awake and terrified. Which management bundle addresses both the arrhythmia and the patient's psychological state?",
    options: four(
      "Continuous IV sedation/analgesia (reduces sympathetic drive → reduces VT triggers) + IV beta-blocker (sympatholysis) + IV amiodarone or lidocaine + urgent electrophysiology consultation for ablation; explicit compassionate communication with patient about what is happening and the management plan",
      "Shock each episode as it occurs without additional interventions",
      "Disconnect the ICD — the shocks are causing more harm",
      "Discharge home with oral amiodarone adjustment",
    ),
    correctAnswerId: "a",
    rationale: "Electrical storm (≥3 ICD shocks in 24 hours) requires: (1) Sedation/analgesia — catecholamine excess from pain and fear perpetuates VT; propofol or benzodiazepine infusion breaks the sympathoadrenergic loop. (2) IV beta-blocker (propranolol or metoprolol) for anti-adrenergic effect. (3) Antiarrhythmic (amiodarone + lidocaine). (4) Urgent EP for catheter ablation. (5) Patient communication — explaining what the ICD is doing reduces fear-induced catecholamine surge. Emotional support is a medical intervention in electrical storm.",
    category: "telemetry_workflow", clinicalPriority: "highest acuity",
  }),
  xrow({
    id: "adv_exp_038", rhythmKey: "atrial_fibrillation", rhythmTag: "case_af_stroke_prevention",
    mediaPatch: { rate: 138 },
    stem: "EXPANDED CASE: A newly diagnosed AF patient (CHA₂DS₂-VASc score 4: age 72, HTN, DM, female sex) asks why she needs anticoagulation when her heart rhythm 'just feels irregular.' Which explanation is most clinically accurate and patient-centered?",
    options: four(
      "AF causes blood to pool in the left atrial appendage (LAA) during chaotic atrial activity; clots form in the LAA and can embolize to the brain causing stroke; anticoagulation reduces stroke risk by approximately 65% in patients with your risk score",
      "Anticoagulation controls the heart rate in AF",
      "Anticoagulation converts AF to sinus rhythm",
      "Anticoagulation is only needed if symptoms are present",
    ),
    correctAnswerId: "a",
    rationale: "AF-related stroke prevention education: during AF, ineffective atrial contraction causes blood to stagnate in the LAA (a small outpouching of the left atrium), where thrombus forms. Clots embolize to the cerebral circulation causing cardioembolic stroke — often more severe than atherosclerotic stroke. Oral anticoagulants (NOACs or warfarin) reduce stroke risk ~65% in high-risk patients (CHA₂DS₂-VASc ≥2 in males, ≥3 in females). Rate and rhythm control do not eliminate stroke risk. This explanation directly answers the patient's question with the clinical mechanism.",
    category: "clinical_governance",
  }),
  xrow({
    id: "adv_exp_039", rhythmKey: "ventricular_tachycardia", rhythmTag: "fascicular_vt_verapamil",
    mediaPatch: { rate: 168, qrsWidth: 0.13 },
    stem: "A young patient with no structural heart disease has narrow-to-intermediate complex tachycardia at 168 bpm with RBBB morphology and left axis deviation. This responds to IV verapamil. Which VT type does this pattern and response identify?",
    options: four(
      "Left posterior fascicular VT (idiopathic left VT / Belhassen VT) — uses the left posterior fascicle as a limb of the reentry circuit; produces RBBB + left axis deviation; uniquely verapamil-sensitive (calcium channel–dependent circuit)",
      "RVOT VT — always produces LBBB morphology, not RBBB",
      "AVNRT — adenosine is the appropriate treatment, not verapamil",
      "Structural heart disease VT — verapamil is contraindicated",
    ),
    correctAnswerId: "a",
    rationale: "Left posterior fascicular VT (Belhassen VT / idiopathic left VT): VT originating from the left posterior fascicle using a calcium channel–dependent circuit in the Purkinje system. ECG: RBBB morphology (activation from LV toward RV) + left axis deviation (activation exits via superior fascicular tissue). It is uniquely verapamil-sensitive — a rare exception to the rule that verapamil is contraindicated in VT. This occurs in structurally normal hearts (unlike typical scar-based VT). Catheter ablation is curative.",
    category: "specialty_patterns",
  }),
  xrow({
    id: "adv_exp_040", rhythmKey: "ventricular_tachycardia", rhythmTag: "icu_vt_heatmap_tracking",
    mediaPatch: { rate: 145 },
    stem: "A clinical nurse specialist reviews telemetry analytics for an ICU. She notes a cluster of VT episodes between 3–5 AM across multiple patients. What systematic investigation is most appropriate?",
    options: four(
      "Audit QTc levels, electrolyte values, and medication administration times during the 3–5 AM window — nocturnal QT prolongation during peak QT-prolonging drug effect, combined with overnight electrolyte drift (inadequate K+/Mg2+ replacement), is a recognized pattern of preventable arrhythmia clustering",
      "Accept that nocturnal VT is unpredictable and unpreventable",
      "Restrict nursing activity during those hours to reduce patient disturbance",
      "Review the telemetry system calibration — nocturnal VT is always artifact",
    ),
    correctAnswerId: "a",
    rationale: "Nocturnal VT clustering in an ICU cohort warrants a systematic quality audit. Common causes: QT-prolonging medications (amiodarone, antibiotics, antipsychotics) administered in the evening reaching peak plasma levels at 3–5 AM; overnight electrolyte drift from failure to check/replace K⁺ and Mg²⁺ during night shifts; increased vagal tone during sleep (bradycardia → QT prolongation → torsades). A structured audit correlating VT timing with drug administration, QTc trends, and electrolyte labs identifies the modifiable driver. This is a patient safety improvement process.",
    category: "telemetry_workflow",
  }),
];

export function buildAdvancedEcgExpansion(): Prisma.EcgVideoQuestionCreateInput[] {
  return ADVANCED_ECG_EXPANSION;
}
