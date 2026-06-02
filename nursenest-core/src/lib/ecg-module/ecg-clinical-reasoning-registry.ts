/**
 * ECG Clinical Reasoning Registry
 *
 * Comprehensive clinical reasoning data for every published ECG rhythm.
 * Consumed by lessons, flashcards, questions, simulations, and clinical
 * judgment cases across all NurseNest pathways.
 *
 * DATA STANDARDS
 *   - All escalation criteria are specific and actionable (no generic "assess patient")
 *   - Unstable presentation signs use objective clinical markers
 *   - Profession notes reflect actual scope of practice
 *   - Compare/contrast rhythms include the clinical consequence of confusion
 *
 * GUIDELINE ALIGNMENT (2026-05)
 *   AHA/ACC 2023 Rhythm Management Guidelines
 *   AHA ACLS Provider Manual 2020 (2023 update)
 *   CCS Atrial Fibrillation Guidelines 2023
 */

import type { EcgClinicalReasoningEntry } from "@/lib/ecg-module/ecg-clinical-reasoning-schema";

// ─── Registry ─────────────────────────────────────────────────────────────────

export const ECG_CLINICAL_REASONING_REGISTRY: ReadonlyArray<EcgClinicalReasoningEntry> = [

  // ══════════════════════════════════════════════════════════════════
  // SINUS RHYTHMS
  // ══════════════════════════════════════════════════════════════════

  {
    rhythmKey: "normal_sinus_rhythm",
    label: "Normal Sinus Rhythm",
    publishStatus: "published",
    clinicalRiskLevel: "low",

    recognition: [
      "Rate 60–100 BPM",
      "Regular R-R intervals (vary < 0.04s beat-to-beat)",
      "Upright P wave before every QRS in Lead II",
      "PR interval 0.12–0.20s, consistent throughout",
      "QRS < 0.12s (narrow)",
      "ST segment and T wave normal morphology",
    ],

    mechanism:
      "The SA node fires at its intrinsic rate (60–100 BPM) under balanced autonomic control. " +
      "The impulse spreads sequentially: SA node → atria → AV node (delay) → Bundle of His → " +
      "bundle branches → Purkinje fibers → ventricular myocardium. Each waveform maps directly " +
      "to one electrical event: P = atrial depolarization, PR delay = AV nodal conduction, " +
      "QRS = ventricular depolarization, T = ventricular repolarization.",
    conductionPath:
      "SA node (primary pacemaker, 60–100 BPM) → atria → AV node (0.12–0.20s delay) → " +
      "Bundle of His → Right and Left Bundle Branches → Purkinje fibers → ventricular myocardium.",
    whyItLooksThisWay:
      "The upright P wave in Lead II reflects right-to-left atrial depolarization traveling " +
      "toward the positive lead electrode. The consistent PR interval confirms stable AV nodal " +
      "conduction. The narrow QRS confirms normal rapid spread through the His-Purkinje system.",

    hemodynamicImpact: {
      cardiacOutputEffect:
        "Optimal cardiac output. HR in the 60–100 range allows adequate diastolic filling " +
        "time while maintaining sufficient cardiac output (CO = HR × SV).",
      perfusionImpact:
        "Normal systemic and coronary perfusion. No hemodynamic compromise expected.",
      stablePresentation: [
        "Alert, oriented, well-perfused",
        "Warm extremities, normal capillary refill (< 2 seconds)",
        "Blood pressure within patient baseline",
        "No dyspnea at rest",
      ],
      unstablePresentation: [
        "NSR does not cause hemodynamic instability — if the patient is unstable with a normal strip, look for a non-cardiac cause",
      ],
    },

    nursingPriorities: [
      "Document NSR as the baseline rhythm to compare against future changes",
      "Assess lead placement and signal quality — artifact can mimic pathology",
      "Correlate the rhythm with the patient's clinical condition (NSR with altered mentation warrants non-cardiac workup)",
    ],

    escalationCriteria: {
      monitor: [
        "NSR in a stable patient — routine monitoring only",
        "Document rhythm strip per unit protocol",
      ],
      notify: [],
      rapidResponse: [],
      codeBlue: [],
    },

    clinicalSafetyFlags: [],

    compareContrast: [
      {
        otherRhythm: "sinus_tachycardia",
        otherLabel: "Sinus Tachycardia",
        keyDifferentiator: "Rate ≤ 100 BPM in NSR; rate > 100 BPM in sinus tachycardia",
        discriminatingFeature: "Heart rate",
        confusionConsequence: "Labeling sinus tachycardia as NSR delays investigation of the underlying cause (fever, pain, sepsis, bleeding).",
      },
      {
        otherRhythm: "first_degree_av_block",
        otherLabel: "First-Degree AV Block",
        keyDifferentiator: "NSR has PR 0.12–0.20s; 1st-degree AV block has PR > 0.20s",
        discriminatingFeature: "PR interval measurement",
        confusionConsequence: "Missing 1st-degree AV block can delay identification of progressive AV conduction disease.",
      },
    ],

    commonTraps: [
      "Calling NSR without confirming P wave morphology — sinus P waves must be upright in Lead II, not just present",
      "Using NSR rate (60–100) for pediatric patients — children's normal rates are age-stratified and higher",
      "Assuming NSR means the patient is clinically stable — patients can be in NSR during septic shock or PE",
    ],

    professionNotes: [
      {
        profession: "RN",
        note: "Document NSR as the established baseline rhythm on admission. Any deviation is interpreted relative to this baseline. Confirm lead placement and signal quality before charting.",
      },
      {
        profession: "RPN",
        note: "Identify NSR and document. Any change from NSR requires notification of the RN or provider per facility protocol.",
      },
      {
        profession: "NP",
        note: "NSR on a resting ECG in a symptomatic patient does not exclude cardiac pathology — Holter monitoring or event recorder may be indicated for intermittent symptoms.",
      },
      {
        profession: "new_grad",
        note: "NSR is your reference point for everything else. Before calling any rhythm 'abnormal,' confirm it deviates from NSR criteria in at least one measurable way.",
      },
    ],

    monitoringRequirements: [
      "Routine telemetry monitoring per unit protocol",
      "No specific increased monitoring required for NSR in a stable patient",
    ],

    remediationLinks: [
      { lessonId: "ecg-paper-grid", label: "ECG Paper & Grid", remediationReason: "Rate and interval measurement foundation" },
      { lessonId: "p-wave-identification", label: "P Wave Identification", remediationReason: "Confirming sinus origin" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────

  {
    rhythmKey: "sinus_tachycardia",
    label: "Sinus Tachycardia",
    publishStatus: "published",
    clinicalRiskLevel: "moderate",

    recognition: [
      "Rate > 100 BPM (same P-wave morphology as NSR)",
      "Regular rhythm",
      "Upright P wave before every QRS in Lead II (sinus morphology)",
      "PR interval 0.12–0.20s (may shorten at very fast rates)",
      "QRS < 0.12s (narrow)",
      "Rate varies with activity, pain, and stimulation (unlike SVT which is fixed)",
    ],

    mechanism:
      "Enhanced SA node automaticity driven by sympathetic stimulation or withdrawal of " +
      "parasympathetic tone. The electrical sequence is identical to NSR — the SA node simply " +
      "fires faster in response to: fever, pain, anxiety, hypovolemia, hypoxia, anemia, " +
      "sepsis, thyrotoxicosis, medications (epinephrine, atropine, beta-agonists), or " +
      "physiologic states (exercise, pregnancy).",
    conductionPath:
      "SA node (firing > 100 BPM) → atria → AV node → His–Purkinje → ventricles. " +
      "Identical to NSR — no conduction abnormality.",
    whyItLooksThisWay:
      "Faster P-to-P intervals compress the baseline, making P waves appear closer together. " +
      "At very fast rates (> 150), P waves may ride the preceding T wave, making them harder " +
      "to identify. The PR interval shortens slightly at high rates as AV nodal conduction " +
      "accelerates under sympathetic drive.",

    hemodynamicImpact: {
      cardiacOutputEffect:
        "Initially compensatory — faster rate supports cardiac output when stroke volume is " +
        "reduced (e.g., hypovolemia). At rates > 150 BPM, diastolic filling time decreases " +
        "significantly, potentially reducing stroke volume and net cardiac output.",
      perfusionImpact:
        "Depends entirely on the underlying cause. Treat the cause, not the rate.",
      stablePresentation: [
        "Warm, well-perfused extremities",
        "Blood pressure maintained",
        "May have subjective palpitations or awareness of heartbeat",
        "Rate decreases with rest, fluids, or analgesia (response to cause treatment)",
      ],
      unstablePresentation: [
        "Hypotension with tachycardia (suggests hypovolemic or cardiogenic shock)",
        "Altered mental status with high rate (systemic sepsis or severe hypoxia)",
        "Rate fails to improve with treatment of suspected cause",
        "Signs of end-organ hypoperfusion: decreased urine output, mottling, confusion",
      ],
      hemodynamicCompromiseThreshold:
        "HR > 150 BPM: diastolic filling begins to be compromised, especially in patients " +
        "with diastolic dysfunction (elderly, cardiomyopathy).",
    },

    nursingPriorities: [
      "Treat the cause, NOT the rate — sinus tachycardia is a symptom, not a primary diagnosis",
      "Assess for treatable causes immediately: fever, pain, anxiety, hypovolemia, hypoxia",
      "Check volume status: skin turgor, mucous membranes, urine output, capillary refill",
      "Obtain vital signs including temperature; fever increases HR by ~10 BPM per 1°C",
      "Review medications: was a sympathomimetic, anticholinergic, or stimulant recently given?",
      "Notify provider if rate > 130 BPM without obvious explanation, or if patient is hemodynamically unstable",
    ],

    immediateActions: [
      "Assess hemodynamic stability: BP, mental status, skin perfusion",
      "Administer O₂ if SpO₂ < 94% — hypoxia is a common driver",
      "Establish IV access; prepare for fluid bolus if hypovolemia suspected",
      "Do NOT administer rate-controlling agents (beta-blockers, diltiazem) — treating the rate suppresses the compensatory response and may cause collapse",
    ],

    escalationCriteria: {
      monitor: [
        "Sinus tachycardia with identifiable cause (fever, pain, anxiety, post-exercise)",
        "Rate responding to treatment of underlying cause",
        "Hemodynamically stable with normal mentation and perfusion",
      ],
      notify: [
        "HR > 130 BPM without an immediately identifiable cause",
        "Tachycardia persisting after treatment of suspected cause",
        "New sinus tachycardia in a post-op or post-MI patient",
        "Tachycardia with any signs of end-organ compromise",
      ],
      rapidResponse: [
        "HR > 150 BPM with hypotension (BP < 90/60 mmHg)",
        "Altered mental status with tachycardia",
        "Signs of cardiogenic or obstructive shock",
      ],
      codeBlue: [],
    },

    clinicalSafetyFlags: [
      {
        rule: "Do NOT administer rate-controlling drugs (beta-blockers, calcium channel blockers) for sinus tachycardia without identifying and treating the cause first.",
        rationale: "Sinus tachycardia is compensatory. Suppressing the rate in a hypovolemic patient removes the only mechanism maintaining cardiac output and can precipitate cardiovascular collapse.",
        triggerLevel: "rapid_response",
      },
      {
        rule: "Sinus tachycardia at rest in a post-op patient is pulmonary embolism until proven otherwise.",
        rationale: "PE is the most common serious missed diagnosis in post-operative tachycardia. Assuming anxiety or pain without ruling out PE delays life-saving anticoagulation.",
        triggerLevel: "notify",
      },
    ],

    compareContrast: [
      {
        otherRhythm: "svt",
        otherLabel: "SVT",
        keyDifferentiator: "Sinus tachycardia rate varies with activity/stimulation; SVT rate is fixed and abrupt onset/offset",
        discriminatingFeature: "Rate variability and onset character",
        confusionConsequence: "Adenosine administration for sinus tachycardia is ineffective and may briefly drop BP; vagal maneuvers will transiently slow sinus tach but won't terminate it.",
      },
      {
        otherRhythm: "atrial_flutter",
        otherLabel: "Atrial Flutter with 2:1 block",
        keyDifferentiator: "Sinus tach has visible upright sinus P waves; flutter has sawtooth waves best seen in leads II, III, aVF",
        discriminatingFeature: "P wave morphology (sawtooth vs. rounded upright)",
        confusionConsequence: "Treating flutter as sinus tachycardia misses a rhythm requiring anticoagulation and rate/rhythm control.",
      },
    ],

    commonTraps: [
      "Administering rate-controlling medications (metoprolol, diltiazem) as the primary treatment — the rate is compensatory; this can cause collapse",
      "Assuming tachycardia in a post-op patient is pain or anxiety — pulmonary embolism must be ruled out",
      "Missing P waves riding on T waves at fast rates — always look carefully for the P before calling it SVT",
      "Confusing 2:1 atrial flutter (rate ~150) with sinus tachycardia — look for sawtooth flutter waves between QRS complexes",
    ],

    professionNotes: [
      {
        profession: "RN",
        note: "Your priority is identifying and treating the underlying cause. Do not reach for rate-controlling drugs. Assess fluid status, pain, temperature, and oxygen saturation first.",
      },
      {
        profession: "RPN",
        note: "Document rate, note the clinical context (fever, pain, post-procedure), and notify the RN. Do not administer rate-controlling medications without a specific order and RN awareness.",
      },
      {
        profession: "NP",
        note: "Order workup appropriate to context: CBC, BMP, troponin, D-dimer, CXR depending on clinical picture. Avoid rate control until the cause is identified and treated.",
      },
      {
        profession: "RT",
        note: "Hypoxia and hypercapnia are common causes of sinus tachycardia in ventilated patients. Assess ventilator settings, secretion clearance, and SpO₂ before attributing tachycardia to anxiety or pain.",
      },
      {
        profession: "new_grad",
        note: "A heart rate of 110 BPM is almost never a reason to call a rapid response by itself. Your job is to find out WHY it's elevated. Check the vitals trend, look at the chart, and ask: what changed?",
      },
    ],

    monitoringRequirements: [
      "Continuous telemetry while cause is being investigated",
      "Vital signs every 15–30 minutes until rate trending down",
      "Urine output monitoring if hypovolemia suspected",
    ],

    remediationLinks: [
      { lessonId: "rate-calculation", label: "Rate Calculation", remediationReason: "Accurate rate measurement at faster rates" },
      { lessonId: "normal-sinus-rhythm", label: "Normal Sinus Rhythm", remediationReason: "Baseline comparison for P wave morphology" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────

  {
    rhythmKey: "sinus_bradycardia",
    label: "Sinus Bradycardia",
    publishStatus: "published",
    clinicalRiskLevel: "moderate",

    recognition: [
      "Rate < 60 BPM",
      "Regular rhythm",
      "Upright P wave before every QRS in Lead II (sinus morphology)",
      "PR interval 0.12–0.20s",
      "QRS < 0.12s (narrow)",
      "May see prominent T waves at slow rates (longer repolarization)",
    ],

    mechanism:
      "Decreased SA node automaticity from enhanced parasympathetic (vagal) tone or " +
      "intrinsic SA node dysfunction. Common causes: trained athletes (physiologic), " +
      "vasovagal response, inferior MI (RCA supplies SA node), hypothyroidism, hypothermia, " +
      "increased ICP, medications (beta-blockers, CCBs, digoxin, amiodarone), sick sinus syndrome.",
    conductionPath:
      "SA node (< 60 BPM) → atria → AV node → His–Purkinje → ventricles. Normal conduction pathway; only the firing rate is slow.",
    whyItLooksThisWay:
      "Wider P-to-P and R-to-R intervals reflect the slower SA node firing rate. Each cycle " +
      "is longer, so the baseline appears more spread out. T waves may appear taller at slow " +
      "rates because the QT interval lengthens, allowing full repolarization.",

    hemodynamicImpact: {
      cardiacOutputEffect:
        "CO = HR × SV. At rates > 50 BPM, compensatory SV increase can maintain adequate " +
        "output. Below 40–50 BPM, SV cannot adequately compensate, and cardiac output falls.",
      perfusionImpact:
        "May be well-tolerated (athlete, sleeping patient) or severely compromised " +
        "(elderly patient with low stroke volume reserve).",
      stablePresentation: [
        "Alert, asymptomatic — common in athletes and during sleep",
        "Blood pressure maintained, warm extremities",
        "No dyspnea, syncope, or near-syncope",
        "Rate > 50 BPM with no symptoms",
      ],
      unstablePresentation: [
        "Hypotension (SBP < 90 mmHg) with bradycardia",
        "Syncope or presyncope — patient collapses or reports 'nearly passing out'",
        "Altered mental status, confusion",
        "Diaphoresis, pallor, or mottling",
        "Signs of acute coronary syndrome (chest pain, inferior MI) with bradycardia",
        "Rate < 40 BPM in any symptomatic patient",
      ],
      hemodynamicCompromiseThreshold:
        "Rates < 40–50 BPM with symptoms or signs of hypoperfusion require intervention.",
    },

    nursingPriorities: [
      "Assess symptoms first: is the patient dizzy, syncopal, hypotensive, or diaphoretic?",
      "Check blood pressure — hypotension with bradycardia is a hemodynamic emergency",
      "Review medication administration record: recent beta-blocker, digoxin, amiodarone, diltiazem?",
      "Obtain 12-lead ECG — look for inferior ST changes suggesting ischemic cause",
      "Prepare atropine 0.5 mg IV at bedside if symptomatic bradycardia is confirmed",
      "Position patient supine if symptomatic to improve venous return",
    ],

    immediateActions: [
      "Confirm symptomatic bradycardia: HR < 60 + hypotension, altered mentation, syncope, or chest pain",
      "Atropine 0.5 mg IV push — may repeat q3–5 min to max 3 mg",
      "If atropine fails: transcutaneous pacing or dopamine/epinephrine infusion",
      "Prepare for transvenous pacing if transcutaneous pacing required for sustained bradycardia",
    ],

    escalationCriteria: {
      monitor: [
        "Asymptomatic bradycardia in an athlete, sleeping patient, or patient on known rate-lowering medications",
        "Rate > 50 BPM with stable blood pressure and normal mentation",
        "Bradycardia responding to vagal tone reduction (patient waking, sitting up)",
      ],
      notify: [
        "New bradycardia not explained by medications or vagal tone",
        "Rate 40–50 BPM with any symptoms",
        "Inferior MI with bradycardia — SA node ischemia",
        "Medication toxicity suspected (digoxin level, beta-blocker overdose)",
      ],
      rapidResponse: [
        "Symptomatic bradycardia: HR < 60 with hypotension, altered mentation, or syncope",
        "Rate < 40 BPM regardless of symptoms",
        "Bradycardia not responding to initial nursing interventions",
      ],
      codeBlue: [
        "Bradycardia deteriorating to asystole or PEA",
        "Loss of pulse with organized bradycardic rhythm (PEA)",
      ],
    },

    clinicalSafetyFlags: [
      {
        rule: "Atropine is ineffective and may worsen bradycardia in third-degree AV block or infranodal blocks — confirm the block level before administering.",
        rationale: "Atropine accelerates the SA node, not the ventricles. In complete heart block, it may speed the atrial rate without improving ventricular rate, worsening AV dissociation.",
        triggerLevel: "notify",
      },
      {
        rule: "Do not leave a symptomatic bradycardic patient alone while contacting the provider — stay at the bedside and have another nurse call.",
        rationale: "Symptomatic bradycardia can progress to asystole without warning. Continuous assessment is required until the patient is stable or a provider is at the bedside.",
        triggerLevel: "rapid_response",
      },
    ],

    compareContrast: [
      {
        otherRhythm: "third_degree_av_block",
        otherLabel: "Third-Degree AV Block",
        keyDifferentiator: "Sinus bradycardia has 1:1 P-to-QRS conduction; 3rd-degree has P and QRS marching independently",
        discriminatingFeature: "P-to-QRS relationship (walk out the P waves)",
        confusionConsequence: "Treating 3rd-degree AV block as simple sinus bradycardia with atropine is ineffective and delays pacing.",
      },
      {
        otherRhythm: "junctional_rhythm",
        otherLabel: "Junctional Rhythm",
        keyDifferentiator: "Sinus bradycardia has upright P before QRS; junctional has absent or retrograde P",
        discriminatingFeature: "P wave morphology and position relative to QRS",
        confusionConsequence: "Junctional rhythm indicates SA node suppression and requires different management than vagal bradycardia.",
      },
    ],

    commonTraps: [
      "Treating asymptomatic bradycardia in athletes — rates in the 40s are physiologic in fit individuals",
      "Administering atropine without first checking for AV block — atropine is ineffective in complete heart block",
      "Missing inferior MI as the cause — RCA occlusion supplies the SA node; bradycardia + inferior ST elevation = emergency",
      "Giving a second dose of atropine before the first has had time to work (allow 1–2 minutes)",
    ],

    professionNotes: [
      {
        profession: "RN",
        note: "Assess symptoms immediately. Asymptomatic bradycardia in an athlete is normal; new bradycardia in an acutely ill patient is not. Have atropine drawn and at the bedside for symptomatic cases.",
      },
      {
        profession: "RPN",
        note: "Check blood pressure and symptoms for every bradycardia strip. Rate < 50 with any symptom requires immediate RN notification.",
      },
      {
        profession: "NP",
        note: "Consider the full differential: medications (hold/reduce if toxic), inferior MI (emergent 12-lead and cath activation if indicated), sick sinus syndrome (electrophysiology referral), and hypothyroidism (TSH).",
      },
      {
        profession: "new_grad",
        note: "Your first step is always symptoms, not the number on the monitor. A rate of 48 BPM in a sleeping patient after cardiac surgery may be expected; the same rate in a patient who just sat up and became diaphoretic is an emergency.",
      },
    ],

    monitoringRequirements: [
      "Continuous cardiac monitoring for all symptomatic bradycardia",
      "Vital signs every 15 minutes until stable or provider at bedside",
      "12-lead ECG stat for any new-onset symptomatic bradycardia",
      "External transcutaneous pacing pads applied for rates < 40 BPM or hemodynamically unstable",
    ],

    simulationLinks: [
      {
        simulationId: "bradycardia-atropine-response",
        label: "Symptomatic Bradycardia — Atropine Response",
        scenario: "Post-op day 1 patient develops HR 38 with hypotension. Manage the rhythm and hemodynamics.",
        minTier: "pro",
      },
    ],

    remediationLinks: [
      { lessonId: "rate-calculation", label: "Rate Calculation", remediationReason: "Accurate rate measurement" },
      { lessonId: "av-blocks-overview", label: "AV Blocks Overview", remediationReason: "Distinguishing sinus brady from infranodal blocks" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // ATRIAL RHYTHMS
  // ══════════════════════════════════════════════════════════════════

  {
    rhythmKey: "atrial_fibrillation",
    label: "Atrial Fibrillation",
    publishStatus: "published",
    clinicalRiskLevel: "high",

    recognition: [
      "Irregularly irregular R-R intervals — no consistent pattern",
      "No discrete P waves — chaotic fibrillatory baseline (best seen in V1, Lead II)",
      "Ventricular rate variable: controlled AF 60–100, rapid AF > 100, slow AF < 60",
      "QRS usually narrow (< 0.12s) — unless aberrant conduction or WPW",
      "Baseline shows fine or coarse oscillations (f-waves) at 350–600 atrial impulses/min",
    ],

    mechanism:
      "Multiple chaotic re-entrant wavelets circulate through atrial tissue simultaneously, " +
      "producing disorganized atrial depolarization at 350–600 impulses/min. The AV node acts " +
      "as a filter — it conducts only the fastest impulses that arrive during its refractory " +
      "period, producing an irregularly irregular ventricular response. No organized atrial " +
      "contraction occurs, eliminating the 'atrial kick' (10–30% of ventricular filling).",
    conductionPath:
      "Chaotic re-entrant circuits throughout both atria → random impulses reach AV node → " +
      "AV node filters and conducts a subset → normal His–Purkinje–ventricular pathway. " +
      "The ventricles conduct normally (narrow QRS) but receive randomly timed impulses.",
    whyItLooksThisWay:
      "The absent P waves reflect no organized atrial depolarization. The fine irregular " +
      "baseline oscillations (f-waves) represent the chaotic atrial activity. The " +
      "irregularly irregular QRS reflects the random subset of atrial impulses that " +
      "penetrate the AV node during its non-refractory periods.",

    hemodynamicImpact: {
      cardiacOutputEffect:
        "Loss of atrial kick reduces cardiac output by 10–30%. In patients with diastolic " +
        "dysfunction (HF, hypertension, elderly), this loss may be 30–40%. Rapid ventricular " +
        "response (AF with RVR, HR > 110) further reduces diastolic filling and CO.",
      perfusionImpact:
        "In healthy hearts: often tolerated long-term. In diseased hearts: AF with RVR can " +
        "precipitate acute pulmonary edema, hypotension, and hemodynamic collapse.",
      stablePresentation: [
        "May be completely asymptomatic (especially chronic/paroxysmal AF)",
        "Palpitations, 'fluttering' sensation in chest",
        "Mild fatigue or reduced exercise tolerance",
        "Blood pressure maintained with controlled ventricular rate",
        "Irregular pulse on palpation (confirm pulse deficit)",
      ],
      unstablePresentation: [
        "Hypotension (SBP < 90 mmHg) with rapid ventricular response",
        "Pulmonary edema, severe dyspnea, hypoxia in patients with HF",
        "Chest pain suggesting myocardial ischemia from demand ischemia",
        "Altered mental status from reduced cerebral perfusion",
        "Syncope or presyncope",
      ],
      hemodynamicCompromiseThreshold:
        "AF with RVR (HR > 110–130 BPM) in patients with diastolic dysfunction, HF, " +
        "valvular disease, or hypertrophic cardiomyopathy often precipitates hemodynamic instability.",
    },

    nursingPriorities: [
      "Assess hemodynamic stability FIRST — is the patient hypotensive, diaphoretic, altered, or in respiratory distress?",
      "Obtain 12-lead ECG stat — characterize the ventricular response rate and any ST changes",
      "Assess for signs of stroke: sudden facial droop, arm weakness, speech changes — AF is a major thromboembolic risk factor",
      "Review anticoagulation status: Is the patient on anticoagulants? When was the last dose? Duration of AF?",
      "Determine onset: New-onset AF < 48 hours may be cardioverted; AF > 48 hours requires anticoagulation before cardioversion",
      "Monitor for pulse deficit: compare apical HR to peripheral pulse rate",
    ],

    immediateActions: [
      "For UNSTABLE AF (hypotension, altered mentation, acute HF): immediate synchronized cardioversion 120–200 J biphasic",
      "For STABLE AF with RVR: rate control medications per provider order (metoprolol IV, diltiazem IV)",
      "Oxygen if SpO₂ < 94%",
      "IV access; draw anticoagulation labs (INR, anti-Xa if on DOAC)",
      "12-lead ECG to assess for WPW or other accessory pathway (contraindication to AV nodal agents)",
    ],

    escalationCriteria: {
      monitor: [
        "Known chronic AF with controlled ventricular rate (60–100 BPM) and stable hemodynamics",
        "Patient on anticoagulation, asymptomatic",
      ],
      notify: [
        "New-onset AF confirmed on ECG",
        "Controlled AF rate becoming rapid (> 100 BPM) without identifiable reversible cause",
        "Patient on anticoagulation reporting new headache, visual changes, or focal weakness",
        "AF in a patient with WPW — risk of pre-excited rapid AF causing VF",
      ],
      rapidResponse: [
        "AF with RVR (HR > 120) causing hypotension or respiratory distress",
        "Suspected stroke in a patient with AF (activate stroke protocol)",
        "New rapid AF with signs of hemodynamic compromise",
      ],
      codeBlue: [
        "Loss of pulse in a patient with AF (AF → cardiac arrest — PEA most likely)",
        "AF with WPW degenerating to VF",
      ],
    },

    clinicalSafetyFlags: [
      {
        rule: "NEVER administer adenosine, digoxin, or AV nodal blocking agents to a patient with AF and suspected WPW (pre-excitation pattern, delta waves on baseline ECG).",
        rationale: "In AF with WPW, blocking the AV node forces all impulses through the accessory pathway, potentially producing a pre-excited AF with ventricular rate > 300 BPM that degenerates to VF. This is immediately life-threatening.",
        triggerLevel: "code_blue",
      },
      {
        rule: "AF of unknown or > 48-hour duration MUST have adequate anticoagulation for ≥ 3 weeks before elective cardioversion, or a transesophageal echocardiogram to rule out atrial thrombus.",
        rationale: "Cardioverting AF without ruling out atrial thrombus can dislodge a clot, causing embolic stroke. This is a permanent, catastrophic iatrogenic harm.",
        triggerLevel: "notify",
      },
      {
        rule: "Assess for pulse deficit (apical minus peripheral rate) in every patient with AF — a large deficit indicates poor cardiac output.",
        rationale: "Not all QRS complexes in AF produce an effective cardiac contraction. A pulse deficit of > 10–20 BPM indicates significant hemodynamic inefficiency.",
        triggerLevel: "monitor",
      },
    ],

    compareContrast: [
      {
        otherRhythm: "atrial_flutter",
        otherLabel: "Atrial Flutter",
        keyDifferentiator: "AF: irregularly irregular with no P waves; Flutter: regularly irregular with sawtooth waves at ~300/min",
        discriminatingFeature: "Rhythm regularity and baseline morphology (sawtooth vs. chaotic)",
        confusionConsequence: "Missing flutter allows a regularly irregular rhythm to be dismissed as AF, missing the opportunity for cardioversion when flutter is more amenable to electrical termination.",
      },
      {
        otherRhythm: "respiratory_sinus_arrhythmia",
        otherLabel: "Respiratory Sinus Arrhythmia",
        keyDifferentiator: "AF: no discrete P waves; RSA: consistent sinus P waves throughout with rate variation tied to breathing",
        discriminatingFeature: "P wave presence and morphology",
        confusionConsequence: "Misdiagnosing RSA as AF leads to inappropriate anticoagulation with bleeding risk.",
      },
    ],

    commonTraps: [
      "Assuming a ventricular rate of 75 BPM means controlled AF — must confirm irregular rhythm and absence of P waves",
      "Missing AF with WPW — wide bizarre QRS at very fast rates can look like VT; delta waves on baseline ECG are the clue",
      "Cardioverting AF of unknown duration without anticoagulation assessment — embolic stroke risk is real",
      "Treating AF rate with AV nodal agents in WPW — this can cause fatal pre-excited AF",
      "Not checking for pulse deficit — patient may report a rate of 90 but only half the beats produce a pulse",
    ],

    professionNotes: [
      {
        profession: "RN",
        note: "Your immediate priority for any new AF is hemodynamic assessment and determining onset duration — these two factors drive every subsequent decision. Know your unit's stroke activation criteria and anticoagulation bridge protocol.",
      },
      {
        profession: "RPN",
        note: "Document the irregularly irregular rhythm, ventricular rate, and patient symptoms. Report to the RN immediately for any new-onset AF or rate > 100. Do not administer new anticoagulants or rate-control medications without provider order and RN oversight.",
      },
      {
        profession: "NP",
        note: "Initiate CHA₂DS₂-VASc scoring to guide anticoagulation. Order rate control or rhythm control strategy. For AF < 48 hours in a stable patient without contraindications, pharmacologic cardioversion (flecainide pill-in-pocket, amiodarone) or electrical cardioversion may be appropriate.",
      },
      {
        profession: "RT",
        note: "AF with RVR in a ventilated patient may reflect hypoxia, hypercapnia, or ventilator dyssynchrony. Optimize oxygenation and ventilation before attributing tachycardia to intrinsic rhythm issues.",
      },
      {
        profession: "new_grad",
        note: "Every new AF has two questions you must answer before calling the provider: (1) Is the patient hemodynamically stable right now? (2) How long has the AF been present? These are the two most important facts the provider will ask you.",
      },
    ],

    monitoringRequirements: [
      "Continuous telemetry — document rate trends and any rhythm changes",
      "Vital signs every 1–4 hours based on ventricular rate and hemodynamic status",
      "Daily 12-lead ECG if new-onset or with rate changes",
      "INR or anti-Xa levels per anticoagulation protocol",
      "Neurological assessment at each contact — stroke surveillance",
    ],

    simulationLinks: [
      {
        simulationId: "af-rvr-rate-control",
        label: "AF with RVR — Hemodynamic Assessment and Rate Control",
        scenario: "A 68-year-old patient with heart failure develops AF with HR 142 and BP 88/60. Prioritize assessment and management.",
        minTier: "pro",
      },
    ],

    remediationLinks: [
      { lessonId: "rhythm-regularity", label: "Rhythm Regularity", remediationReason: "Identifying irregularly irregular baseline" },
      { lessonId: "p-wave-identification", label: "P Wave Identification", remediationReason: "Confirming absence of organized P waves" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // VENTRICULAR RHYTHMS
  // ══════════════════════════════════════════════════════════════════

  {
    rhythmKey: "ventricular_tachycardia",
    label: "Ventricular Tachycardia",
    publishStatus: "published",
    clinicalRiskLevel: "life_threatening",

    recognition: [
      "Rate 100–250 BPM (typically 120–200 in sustained VT)",
      "Regular or slightly irregular rhythm",
      "Wide QRS (≥ 0.12s) — broad, bizarre-looking complexes",
      "P waves absent or dissociated (march at slower atrial rate independent of QRS)",
      "AV dissociation: P waves 'march through' QRS at a different rate",
      "Fusion beats and capture beats confirm VT when present",
      "Axis often extreme (northwest axis: negative I and aVF)",
    ],

    mechanism:
      "Ventricular tachycardia arises from an ectopic ventricular focus or re-entrant circuit " +
      "within ventricular myocardium, below the Bundle of His. Depolarization spreads " +
      "muscle-to-muscle rather than through the fast His–Purkinje system, producing the " +
      "characteristic wide, bizarre QRS. The SA node continues firing at its normal rate " +
      "(AV dissociation) but cannot conduct to the ventricles during the fast VT rhythm.",
    conductionPath:
      "Ectopic ventricular focus or re-entry circuit in ventricular myocardium → slow " +
      "muscle-to-muscle spread → wide QRS. SA node continues firing independently → P waves " +
      "march at normal sinus rate, dissociated from QRS.",
    whyItLooksThisWay:
      "Wide QRS reflects slow, aberrant ventricular conduction (muscle-to-muscle vs. rapid " +
      "Purkinje). The bizarre morphology differs from bundle branch block because VT originates " +
      "lower, producing more chaotic spread. AV dissociation produces independently marching " +
      "P waves visible as notches deforming the wide QRS or ST segments.",

    hemodynamicImpact: {
      cardiacOutputEffect:
        "Severely reduced. Loss of atrial kick + rapid uncoordinated ventricular contraction " +
        "produces markedly reduced stroke volume and cardiac output. VT with rates > 150 BPM " +
        "nearly eliminates effective forward flow.",
      perfusionImpact:
        "Variable: some patients maintain marginal perfusion (pulsatile VT — pulse present); " +
        "others lose pulse immediately (pulseless VT = cardiac arrest).",
      stablePresentation: [
        "Palpitations, rapid heart beating felt in chest or neck",
        "Lightheadedness, presyncope",
        "Diaphoresis",
        "Blood pressure maintained but often reduced",
        "Pulse palpable but rapid and weak",
      ],
      unstablePresentation: [
        "Loss of consciousness — patient unresponsive",
        "Absent or barely palpable pulse (pulseless VT = cardiac arrest)",
        "Severe hypotension (SBP < 80 mmHg)",
        "Chest pain suggesting ischemic substrate",
        "Pulmonary edema with rapidly falling oxygen saturation",
        "Seizure-like activity from cerebral hypoperfusion",
      ],
      hemodynamicCompromiseThreshold:
        "Any VT can degenerate to pulseless VT or VF at any moment. There is no safe 'watch and wait' threshold.",
    },

    nursingPriorities: [
      "CHECK PULSE IMMEDIATELY — pulseless VT = cardiac arrest, initiate CPR and call code blue",
      "For VT with pulse: assess hemodynamic stability, apply supplemental O₂, establish IV access",
      "Do NOT leave the patient alone — VT can deteriorate to pulseless VT or VF rapidly",
      "Call for the crash cart; apply defibrillation pads",
      "If unstable with pulse: immediate synchronized cardioversion (100–200 J biphasic)",
      "Obtain 12-lead ECG if time permits without delaying treatment",
    ],

    immediateActions: [
      "PULSELESS VT: Call code blue → CPR → defibrillate 200 J biphasic (unsynchronized) → ACLS",
      "PULSATILE, UNSTABLE VT: Synchronized cardioversion 100–200 J biphasic (sedate if possible)",
      "PULSATILE, STABLE VT: Amiodarone 150 mg IV over 10 min (may repeat); prepare for cardioversion if medication fails",
      "Correct reversible causes: hypokalemia, hypomagnesemia, ischemia, QT-prolonging drugs",
    ],

    escalationCriteria: {
      monitor: [],
      notify: [
        "Wide-complex tachycardia of any type — provider assessment required immediately",
      ],
      rapidResponse: [
        "VT with pulse and any hemodynamic instability (hypotension, altered mentation, chest pain, dyspnea)",
        "Sustained VT > 30 seconds in any patient",
      ],
      codeBlue: [
        "Pulseless VT — cardiac arrest",
        "VT degenerating to VF",
        "Patient unresponsive with wide-complex tachycardia",
      ],
    },

    clinicalSafetyFlags: [
      {
        rule: "Wide-complex tachycardia is ventricular tachycardia until proven otherwise — NEVER assume SVT with aberrancy in a hemodynamically unstable patient.",
        rationale: "Adenosine given to a patient in VT causes brief vasodilation and AV block without terminating VT, may cause hemodynamic deterioration, and wastes critical time before cardioversion.",
        triggerLevel: "code_blue",
      },
      {
        rule: "Check the pulse before choosing between cardioversion and defibrillation. Pulseless VT requires UNSYNCHRONIZED defibrillation (not synchronized cardioversion).",
        rationale: "Synchronized cardioversion requires a detectable QRS complex to time the shock. If the patient is pulseless, a synchronization delay may prevent shock delivery and costs seconds during cardiac arrest.",
        triggerLevel: "code_blue",
      },
      {
        rule: "Do NOT administer verapamil or diltiazem for wide-complex tachycardia — if the rhythm is VT, these agents cause severe hemodynamic collapse.",
        rationale: "Verapamil and diltiazem are vasodilators and negative inotropes. In VT, they cause profound hypotension without terminating the arrhythmia, rapidly causing arrest.",
        triggerLevel: "code_blue",
      },
    ],

    compareContrast: [
      {
        otherRhythm: "svt",
        otherLabel: "SVT with Aberrant Conduction",
        keyDifferentiator: "VT has AV dissociation (P waves march independently); SVT with aberrancy has retrograde P or no visible P — but both can be wide-complex. In hemodynamically unstable patients, treat as VT.",
        discriminatingFeature: "AV dissociation (march-out P waves), fusion beats, capture beats — if present, confirms VT",
        confusionConsequence: "Treating VT as SVT with adenosine or AV nodal blockers can cause cardiovascular collapse. The safer error is treating SVT as VT (cardioversion is safe for both).",
      },
      {
        otherRhythm: "torsades_de_pointes",
        otherLabel: "Torsades de Pointes",
        keyDifferentiator: "Monomorphic VT has consistent QRS morphology; torsades has polymorphic QRS amplitude twisting around the baseline",
        discriminatingFeature: "QRS morphology consistency (look for axis twisting in torsades)",
        confusionConsequence: "Amiodarone can prolong QT and worsen torsades — the treatment differs fundamentally (magnesium for torsades vs. amiodarone for VT).",
      },
    ],

    commonTraps: [
      "Assuming wide-complex tachycardia is SVT with aberrancy because the patient is young or 'looks OK'",
      "Delaying treatment to obtain a 12-lead ECG in an unstable patient — treat hemodynamic instability first",
      "Using synchronized cardioversion for pulseless VT — requires unsynchronized defibrillation",
      "Administering verapamil or diltiazem for wide-complex tachycardia — lethal error in VT",
      "Equating 'pulse is present' with 'patient is stable' — VT can be pulsatile but still cause rapid deterioration",
    ],

    professionNotes: [
      {
        profession: "RN",
        note: "Your decision tree for VT is: (1) check pulse — pulseless = code blue, CPR, defibrillate; (2) pulse present, unstable = synchronized cardioversion + RRT; (3) pulse present, stable = call provider, amiodarone, prepare for cardioversion. Have the crash cart at the bedside before the provider arrives.",
      },
      {
        profession: "RPN",
        note: "Wide-complex tachycardia = call for help immediately. Do not attempt to diagnose — your priority is to activate rapid response or code, position the patient, apply oxygen, and stay at the bedside until the team arrives.",
      },
      {
        profession: "NP",
        note: "Order baseline metabolic panel (K⁺, Mg²⁺), troponin, and 12-lead ECG. Amiodarone 150 mg IV over 10 min is first-line for stable monomorphic VT. Identify and correct the substrate: ischemia, electrolyte disturbance, QT-prolonging medications, structural heart disease.",
      },
      {
        profession: "new_grad",
        note: "If you see a fast wide-complex rhythm on the monitor, your first action is to go to the patient and check their pulse — not to call the provider, not to adjust the lead placement. Pulse check first. Everything else follows from that answer.",
      },
    ],

    monitoringRequirements: [
      "Continuous telemetry — alert threshold set for any wide-complex tachycardia",
      "Defibrillator pads applied and checked daily in high-risk patients (post-MI, severe HF)",
      "Electrolytes checked every 4–8 hours during VT management (K⁺ target > 4.0, Mg²⁺ target > 2.0)",
      "Continuous SpO₂ and BP monitoring",
    ],

    simulationLinks: [
      {
        simulationId: "vt-pulse-check-decision",
        label: "VT — Pulse Check Decision Tree",
        scenario: "Monitor alarm for wide-complex tachycardia at 168 BPM. Is the patient in pulseless VT or pulsatile VT? Navigate the ACLS algorithm.",
        minTier: "pro",
      },
    ],

    remediationLinks: [
      { lessonId: "qrs-complex", label: "QRS Complex", remediationReason: "Wide QRS identification and measurement" },
      { lessonId: "acls-rhythms", label: "ACLS Rhythms Overview", remediationReason: "VT/VF algorithm" },
    ],
  },

  // ──────────────────────────────────────────────────────────────────

  {
    rhythmKey: "ventricular_fibrillation",
    label: "Ventricular Fibrillation",
    publishStatus: "published",
    clinicalRiskLevel: "life_threatening",

    recognition: [
      "Completely chaotic, disorganized waveform with no identifiable QRS complexes",
      "No discrete P waves, no organized QRS, no measurable rate",
      "Waveform amplitude may be coarse (high amplitude early in VF) or fine (diminishing amplitude with prolonged arrest)",
      "Baseline oscillations are rapid and irregular — 'bag of worms' appearance",
      "ALWAYS CONFIRM: check the patient before calling VF — artifact can mimic VF exactly",
    ],

    mechanism:
      "Multiple disorganized re-entrant electrical circuits circulate simultaneously throughout " +
      "ventricular myocardium, producing chaotic, uncoordinated depolarization. No effective " +
      "ventricular contraction occurs — the ventricles quiver rather than pump. VF may be " +
      "triggered by: R-on-T phenomenon, severe ischemia, electrolyte disturbances (severe " +
      "hypokalemia, hypomagnesemia), QT-prolonging drugs, hypothermia, or degeneration from VT.",
    conductionPath:
      "No organized conduction pathway. Multiple re-entrant circuits of varying sizes and " +
      "directions produce simultaneous, disorganized depolarization wavefronts throughout both ventricles.",
    whyItLooksThisWay:
      "The chaotic waveform reflects the sum of multiple simultaneously active re-entrant " +
      "wavelets, each producing small voltage deflections that add together randomly. " +
      "Early VF ('coarse VF') has higher amplitude because the circuits are still energetic. " +
      "Prolonged VF ('fine VF') has lower amplitude as the metabolically depleted myocardium " +
      "produces smaller signals — approaching asystole.",

    hemodynamicImpact: {
      cardiacOutputEffect:
        "Zero cardiac output. VF is cardiac arrest — no effective ventricular contraction, no pulse, no perfusion.",
      perfusionImpact:
        "Brain death begins within 4–6 minutes without CPR. Every minute without defibrillation reduces survival by 7–10%.",
      stablePresentation: [
        "There is no stable presentation of VF — VF = cardiac arrest",
      ],
      unstablePresentation: [
        "Sudden unresponsiveness — patient collapses without warning",
        "Absent pulse (check carotid and femoral)",
        "No respiratory effort or only agonal gasps",
        "Cyanosis developing rapidly",
        "Pupils dilating (within 1–2 minutes without perfusion)",
      ],
    },

    nursingPriorities: [
      "CALL CODE BLUE and start CPR simultaneously — do not delay CPR to call first",
      "Defibrillate as soon as the defibrillator is available — do not delay for IV access or intubation",
      "Minimize CPR interruptions — pauses > 10 seconds reduce survival significantly",
      "Assign roles immediately: compressor, airway, IV access, rhythm check, timer",
      "Maintain high-quality CPR: 100–120 compressions/min, full chest recoil, depth 5–6 cm",
    ],

    immediateActions: [
      "Confirm VF: check responsiveness, call for help, check pulse (< 10 seconds)",
      "Start CPR: 30:2 ratio (or continuous compressions with advanced airway)",
      "Defibrillate: 200 J biphasic (unsynchronized) → continue CPR 2 min → rhythm check",
      "Epinephrine 1 mg IV/IO every 3–5 min starting after first/second rhythm check",
      "Amiodarone 300 mg IV/IO for persistent VF after ≥ 2 shocks",
      "Treat reversible causes (6 Hs and 5 Ts) throughout resuscitation",
    ],

    escalationCriteria: {
      monitor: [],
      notify: [],
      rapidResponse: [],
      codeBlue: [
        "ANY patient with VF on the monitor — immediately",
        "Confirmed pulseless state with chaotic waveform",
      ],
    },

    clinicalSafetyFlags: [
      {
        rule: "ALWAYS check the patient before calling VF — lead disconnection and artifact are the most common causes of a 'VF' alarm.",
        rationale: "Performing unnecessary CPR and defibrillation on a patient in NSR is harmful. Check responsiveness, look at the patient, and check another lead before calling VF.",
        triggerLevel: "code_blue",
      },
      {
        rule: "Do NOT synchronize the shock for VF — use unsynchronized defibrillation (defibrillation mode, not cardioversion mode).",
        rationale: "Synchronized cardioversion requires a QRS to time the shock delivery. VF has no organized QRS, so the synchronize mode will prevent shock delivery, costing critical seconds.",
        triggerLevel: "code_blue",
      },
      {
        rule: "Fine VF and asystole can appear identical on telemetry — confirm in a second lead before withholding defibrillation.",
        rationale: "Fine VF is shockable; asystole is not. Checking a perpendicular lead clarifies the diagnosis. Defibrillating true asystole is not beneficial and should not be the cause of delay.",
        triggerLevel: "code_blue",
      },
    ],

    compareContrast: [
      {
        otherRhythm: "asystole",
        otherLabel: "Asystole",
        keyDifferentiator: "VF has chaotic high-amplitude waveforms; asystole is near-flat. Fine VF can look like asystole — confirm in two leads",
        discriminatingFeature: "Waveform amplitude and chaos vs. flat line",
        confusionConsequence: "Withholding defibrillation from fine VF (misidentified as asystole) removes the only intervention that can terminate VF. Defibrillating true asystole is ineffective but not harmful.",
      },
      {
        otherRhythm: "torsades_de_pointes",
        otherLabel: "Torsades de Pointes",
        keyDifferentiator: "Torsades has recognizable (though twisting) QRS complexes; VF has no organized complexes at all",
        discriminatingFeature: "Presence vs. absence of any organized QRS",
        confusionConsequence: "Missing the transition from torsades to VF delays defibrillation.",
      },
    ],

    commonTraps: [
      "Calling artifact VF without checking the patient — lead disconnection mimics VF exactly",
      "Delaying defibrillation to intubate or establish IV — defibrillate first, airway second",
      "Using synchronized cardioversion (cardioversion mode) for VF — the sync feature will prevent shock",
      "Confusing fine VF with asystole — always confirm in a second lead before withholding a shock",
    ],

    professionNotes: [
      {
        profession: "RN",
        note: "VF response is: confirm → call code → CPR → defibrillate. The sequence matters. Do not pass the crash cart down the hall — bring the patient to the defibrillator or the defibrillator to the patient immediately.",
      },
      {
        profession: "new_grad",
        note: "When the VF alarm fires: look at the patient first. Are they responsive? Is there a pulse? If yes, it's artifact. If no — start CPR and call the code simultaneously. Practice this sequence in simulation so it's automatic.",
      },
    ],

    monitoringRequirements: [
      "Continuous cardiac monitoring in all post-resuscitation patients (ICU level)",
      "Post-ROSC: 12-lead ECG to identify STEMI requiring emergent PCI",
      "Continuous arterial line for beat-to-beat BP monitoring post-arrest",
      "Targeted temperature management monitoring if TTM initiated",
    ],

    simulationLinks: [
      {
        simulationId: "vf-code-response",
        label: "Ventricular Fibrillation — Code Response",
        scenario: "Your patient's monitor alarms with a chaotic waveform. Lead through the VF recognition and ACLS response.",
        minTier: "pro",
      },
    ],

    remediationLinks: [
      { lessonId: "acls-rhythms", label: "ACLS Rhythms", remediationReason: "VF/pulseless VT algorithm" },
      { lessonId: "defibrillation-cardioversion", label: "Defibrillation vs. Cardioversion", remediationReason: "Energy selection and synchronization" },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // AV CONDUCTION DISORDERS
  // ══════════════════════════════════════════════════════════════════

  {
    rhythmKey: "third_degree_av_block",
    label: "Third-Degree (Complete) AV Block",
    publishStatus: "published",
    clinicalRiskLevel: "life_threatening",

    recognition: [
      "P waves march at regular atrial rate (60–100 BPM if sinus origin)",
      "QRS complexes march at regular but SLOWER escape rate (20–60 BPM)",
      "NO consistent relationship between P waves and QRS complexes (AV dissociation)",
      "P-to-P interval is regular; R-to-R interval is regular — but they march independently",
      "QRS may be narrow (junctional escape, 40–60 BPM) or wide (ventricular escape, 20–40 BPM)",
      "Walk out the P waves: they march through QRS complexes without consistent coupling",
    ],

    mechanism:
      "Complete failure of AV conduction — no atrial impulse reaches the ventricles. The AV " +
      "node, bundle of His, or bundle branches are completely blocked. A subsidiary pacemaker " +
      "below the block site takes over ventricular activation: junctional escape (His bundle, " +
      "40–60 BPM, narrow QRS) or ventricular escape (Purkinje/ventricular, 20–40 BPM, wide QRS). " +
      "Causes: inferior MI (RCA → AV node ischemia), Lyme disease, digoxin toxicity, post-cardiac " +
      "surgery, calcific valve disease, infiltrative disease.",
    conductionPath:
      "SA node fires normally → atria depolarize (visible P waves) → block at AV node or " +
      "infranodal → atrial impulse cannot reach ventricles → junctional or ventricular escape " +
      "pacemaker activates ventricles independently.",
    whyItLooksThisWay:
      "The two independent rhythms (atrial and ventricular) produce two independent march-outs " +
      "on the strip. P waves 'walk through' QRS complexes — sometimes falling just before, " +
      "sometimes after, sometimes hidden inside. The PR interval has no consistent value " +
      "because there is no conducted relationship.",

    hemodynamicImpact: {
      cardiacOutputEffect:
        "Severely reduced — slow ventricular rate (20–60 BPM) combined with loss of atrial " +
        "kick and uncoordinated atrial timing produces dramatically reduced cardiac output. " +
        "The lower the escape rate, the worse the hemodynamics.",
      perfusionImpact:
        "Most patients with complete heart block are symptomatic: syncope, presyncope, " +
        "dyspnea, chest pain, or frank hypotension. Ventricular escape (wide QRS, < 40 BPM) " +
        "is less hemodynamically stable than junctional escape.",
      stablePresentation: [
        "Junctional escape (40–60 BPM, narrow QRS): lightheadedness, fatigue, dyspnea on exertion",
        "Ventricular escape with rate 40–60 BPM and maintained BP — patient may be ambulatory but symptomatic",
      ],
      unstablePresentation: [
        "Syncope (Stokes-Adams attack) — sudden loss of consciousness from ventricular asystole pause",
        "Ventricular escape rate < 30 BPM with hypotension and altered mentation",
        "Chest pain from demand ischemia at slow rate",
        "Pulmonary edema from reduced cardiac output",
        "Progression to asystole — complete failure of escape pacemaker",
      ],
      hemodynamicCompromiseThreshold:
        "Ventricular rate < 40 BPM almost always produces hemodynamic compromise. Any symptomatic CHB requires emergent pacing.",
    },

    nursingPriorities: [
      "Assess hemodynamic stability immediately: BP, mental status, peripheral perfusion, symptoms",
      "Do NOT administer atropine for CHB — it is largely ineffective (speeds atria, not ventricles in infranodal block)",
      "Apply transcutaneous pacing pads immediately — may need emergent pacing",
      "Obtain 12-lead ECG stat to characterize the block and look for ischemia",
      "Establish large-bore IV access for dopamine/epinephrine infusion or emergency medications",
      "Prepare for emergent transvenous temporary pacemaker insertion",
    ],

    immediateActions: [
      "Transcutaneous pacing if hemodynamically unstable: set rate 60–80 BPM, increase mA until mechanical capture",
      "Dopamine 2–10 mcg/kg/min or epinephrine infusion if pacing not immediately available",
      "Atropine 0.5–1 mg IV may have some effect in nodal (supra-Hisian) CHB but avoid in infranodal",
      "Cardiology consultation for emergent transvenous temporary pacemaker",
    ],

    escalationCriteria: {
      monitor: [],
      notify: [
        "Any new diagnosis of complete heart block — cardiology notification required for all cases",
      ],
      rapidResponse: [
        "CHB with any hemodynamic compromise (hypotension, presyncope, altered mentation)",
        "Ventricular escape rate < 40 BPM",
      ],
      codeBlue: [
        "CHB with loss of escape pacemaker → ventricular asystole",
        "CHB progressing to pulseless rhythm",
        "Stokes-Adams attack with prolonged loss of consciousness",
      ],
    },

    clinicalSafetyFlags: [
      {
        rule: "Atropine is generally ineffective for infranodal (below-His) complete heart block and may paradoxically worsen it in some cases — use transcutaneous pacing for symptomatic CHB.",
        rationale: "Atropine accelerates SA node firing and AV nodal conduction. When the block is below the AV node (infranodal), atropine speeds the atrial rate without improving ventricular rate. Wasting time with repeated atropine doses delays pacing.",
        triggerLevel: "rapid_response",
      },
      {
        rule: "Confirm transcutaneous pacing capture with a pulse check, not just an ECG complex — electrical capture (paced QRS) does not guarantee mechanical capture (ventricular contraction).",
        rationale: "A paced ECG complex can appear without effective myocardial contraction (electrical-mechanical dissociation). Always verify with a femoral or carotid pulse after setting pacing.",
        triggerLevel: "rapid_response",
      },
    ],

    compareContrast: [
      {
        otherRhythm: "second_degree_type_ii_av_block",
        otherLabel: "Second-Degree Type II AV Block (Mobitz II)",
        keyDifferentiator: "CHB has NO conducted beats — all QRS are escape. Mobitz II has some conducted beats (constant PR) with intermittent non-conducted P waves",
        discriminatingFeature: "Whether any P waves conduct to QRS (CHB: none; Mobitz II: some)",
        confusionConsequence: "Both require pacing, but the urgency differs — CHB is an emergency requiring immediate pacing; Mobitz II requires urgent cardiology referral within hours.",
      },
      {
        otherRhythm: "junctional_rhythm",
        otherLabel: "Junctional Rhythm",
        keyDifferentiator: "CHB has independent atrial P waves at normal sinus rate marching through the strip; junctional rhythm has absent or retrograde P waves with no dissociated sinus P march-out",
        discriminatingFeature: "Presence of independently marching sinus P waves at a faster atrial rate",
        confusionConsequence: "Junctional rhythm does not necessarily require pacing; CHB almost always does.",
      },
    ],

    commonTraps: [
      "Giving atropine for complete heart block expecting it to work — it is largely ineffective in infranodal block",
      "Confusing AV dissociation in CHB with the PR relationship in NSR — walking out P waves is essential",
      "Assuming the patient is stable because they appear awake — CHB can produce sudden Stokes-Adams syncope without warning",
      "Mistaking narrow-QRS junctional escape in CHB for normal sinus rhythm — always verify 1:1 P-to-QRS conduction",
    ],

    professionNotes: [
      {
        profession: "RN",
        note: "CHB is a pacing emergency. Your job is to have the pacing pads on, IV access established, and the cardiology team notified before the provider arrives. Do not spend time trying atropine — prepare for transcutaneous pacing.",
      },
      {
        profession: "NP",
        note: "Order a stat cardiology consult. Identify the etiology: inferior MI (RCA ischemia — emergent PCI), Lyme carditis (ceftriaxone), medication toxicity (hold digoxin, beta-blocker). Most idiopathic and post-MI CHB not responding to atropine requires transvenous temporary pacing within hours.",
      },
      {
        profession: "new_grad",
        note: "Walk out the P waves on the strip. If the P waves march at one rate and QRS at a different slower rate with no consistent relationship — that is complete heart block, and it needs pacing. Do not let the narrow QRS in junctional escape reassure you; the patient can still arrest.",
      },
    ],

    monitoringRequirements: [
      "Continuous telemetry — transcutaneous pacing pads in place for any symptomatic or hemodynamically significant CHB",
      "Vital signs every 15 minutes until paced or hemodynamically stable",
      "12-lead ECG on admission and after any hemodynamic change",
      "Daily pacemaker threshold check for transvenous temporary pacemakers",
    ],

    simulationLinks: [
      {
        simulationId: "chb-transcutaneous-pacing",
        label: "Complete Heart Block — Transcutaneous Pacing",
        scenario: "A 72-year-old presents with syncope. ECG shows CHB with ventricular rate 32. Apply pacing and verify capture.",
        minTier: "pro",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // ISCHEMIC PATTERNS
  // ══════════════════════════════════════════════════════════════════

  {
    rhythmKey: "stemi_pattern",
    label: "STEMI Pattern",
    publishStatus: "published",
    clinicalRiskLevel: "life_threatening",

    recognition: [
      "ST elevation ≥ 1 mm (0.1 mV) in ≥ 2 anatomically contiguous leads",
      "New LBBB with ischemic symptoms — treated as STEMI equivalent",
      "Reciprocal ST depression in opposing leads (e.g., inferior STEMI: II/III/aVF elevation + I/aVL depression)",
      "Hyperacute T waves may precede ST elevation (earliest finding)",
      "Q waves develop within hours (pathologic Q > 0.04s wide, > 25% of R height)",
      "ST elevation is concave-upward (coved) in STEMI, not flat or saddleback",
    ],

    mechanism:
      "Complete or near-complete occlusion of a coronary artery produces transmural ischemia " +
      "extending from endocardium to epicardium. Myocardial cells in the ischemic territory cannot " +
      "repolarize normally — the ST segment elevates toward the baseline because injured cells " +
      "maintain a lower resting potential. Reciprocal changes occur in leads 'looking' at the " +
      "opposite wall through the injured territory.",
    conductionPath:
      "Normal conduction pathway is maintained (narrow QRS) unless bundle branches or " +
      "the AV node are ischemic. The electrical abnormality is in repolarization (ST-T " +
      "changes), not depolarization (QRS changes — except when bundle branch ischemia develops).",
    whyItLooksThisWay:
      "The ST segment represents the plateau phase of the cardiac action potential. In " +
      "transmural ischemia, injured cells have a reduced resting membrane potential, " +
      "producing a 'current of injury' that shifts the ST segment upward toward the positive " +
      "electrode in leads overlying the infarction. Reciprocal leads see the mirror image.",

    hemodynamicImpact: {
      cardiacOutputEffect:
        "Depends on territory: proximal LAD STEMI (anterior) causes massive LV dysfunction " +
        "and cardiogenic shock. RCA/circumflex STEMI may cause less immediate LV impairment " +
        "but right heart failure (RV MI in inferior STEMI).",
      perfusionImpact:
        "Systemic hypoperfusion in large STEMI, especially anterior. RV MI: hypotension " +
        "worsened by nitrates (preload-dependent RV).",
      stablePresentation: [
        "Classic chest pain: pressure, squeezing, radiation to left arm/jaw",
        "Diaphoresis, nausea, vomiting",
        "Shortness of breath",
        "Blood pressure may be elevated from pain response",
        "Anxiety, 'sense of doom'",
      ],
      unstablePresentation: [
        "Cardiogenic shock: hypotension (SBP < 90) + cold clammy skin + altered mentation",
        "Acute pulmonary edema from LV failure",
        "Ventricular arrhythmias (VT/VF) — ischemic myocardium is electrically unstable",
        "Bradycardia/AV block with inferior STEMI (vagal response, RCA supplies AV node)",
        "Loss of consciousness from cardiogenic shock or VF",
      ],
      hemodynamicCompromiseThreshold:
        "Any STEMI can produce sudden hemodynamic collapse from VF — treat all STEMI as imminently life-threatening.",
    },

    nursingPriorities: [
      "Obtain 12-lead ECG within 10 minutes of first medical contact and interpret immediately",
      "Activate the cath lab: 'STEMI alert' — door-to-balloon time target ≤ 90 minutes",
      "Administer aspirin 162–325 mg (chewed) immediately if not contraindicated",
      "Establish two large-bore IVs and draw: troponin, CBC, BMP, coagulation, type and screen",
      "Oxygen only if SpO₂ < 94% — routine oxygen in normoxic patients worsens outcomes (vasoconstriction)",
      "Do NOT administer nitrates to suspected RV MI (inferior STEMI, right-sided leads) — preload-dependent, nitrates cause severe hypotension",
    ],

    immediateActions: [
      "12-lead ECG interpretation → STEMI confirmed → immediate cath lab activation",
      "Aspirin 162–325 mg chewed + P2Y12 inhibitor (ticagrelor 180 mg or clopidogrel 600 mg) per protocol",
      "IV access × 2; troponin, BMP, CBC, coagulation; continuous cardiac monitoring",
      "Heparin bolus per weight-based protocol (or enoxaparin) if PCI planned",
      "Treat VT/VF per ACLS if arrhythmia occurs — defibrillate and continue",
    ],

    escalationCriteria: {
      monitor: [],
      notify: [],
      rapidResponse: [
        "Suspected STEMI on 12-lead — immediate notification of provider and cath lab",
      ],
      codeBlue: [
        "VF or pulseless VT complicating STEMI",
        "Cardiogenic shock with loss of pulse",
      ],
    },

    clinicalSafetyFlags: [
      {
        rule: "NEVER give nitrates to a patient with suspected inferior or posterior STEMI without checking right-sided leads — RV MI is preload-dependent, and nitrates can cause fatal hypotension.",
        rationale: "The right ventricle in RV MI is operating on a steep Frank-Starling curve — it needs preload. Nitrates reduce venous return, crashing cardiac output in seconds.",
        triggerLevel: "rapid_response",
      },
      {
        rule: "New LBBB with chest pain = STEMI equivalent — activate the cath lab, do not observe.",
        rationale: "LBBB masks the typical STEMI pattern. Sgarbossa criteria can help but are imperfect. Time-to-balloon is the primary determinant of survival — do not delay for ECG interpretation certainty.",
        triggerLevel: "rapid_response",
      },
    ],

    compareContrast: [
      {
        otherRhythm: "nstemi_pattern",
        otherLabel: "NSTEMI",
        keyDifferentiator: "STEMI: ST elevation in contiguous leads; NSTEMI: ST depression ± T wave changes without elevation",
        discriminatingFeature: "Direction of ST change (elevation vs. depression)",
        confusionConsequence: "Missing STEMI as NSTEMI delays cath lab activation and increases infarct size; overtreating NSTEMI as STEMI exposes the patient to unnecessary procedural risk.",
      },
    ],

    commonTraps: [
      "Giving nitroglycerin to a patient with inferior STEMI and hypotension — check right-sided leads first",
      "Giving routine oxygen to a normoxic STEMI patient — causes coronary vasoconstriction",
      "Treating the pain with IV opioids before activating the cath lab — PCI is the definitive treatment, pain management is secondary",
      "Missing early hyperacute T waves before the ST segment elevates — the ECG changes are dynamic, repeat if initial is non-diagnostic",
    ],

    professionNotes: [
      {
        profession: "RN",
        note: "Your job is to get a 12-lead within 10 minutes and have someone interpret it. If you see ST elevation in two or more contiguous leads in a patient with chest pain — call the STEMI alert before waiting for the provider to look at it. Time is muscle.",
      },
      {
        profession: "NP",
        note: "Activate the cath lab and call interventional cardiology directly. Order aspirin + P2Y12 (ticagrelor preferred over clopidogrel in most STEMIs), anticoagulation per protocol, and get the patient moving toward the cath lab. Do not wait for troponin results — STEMI is a clinical and ECG diagnosis.",
      },
      {
        profession: "new_grad",
        note: "Memorize the contiguous lead groups: inferior (II, III, aVF), anterior (V1–V4), lateral (I, aVL, V5–V6). ST elevation in any group of 2 or more from the same territory = STEMI until proven otherwise. Call for help immediately.",
      },
    ],

    monitoringRequirements: [
      "Continuous cardiac telemetry from first STEMI recognition through PCI and 24 hours post-procedure",
      "Repeat 12-lead ECG 60–90 minutes post-PCI to assess for ST resolution",
      "Continuous pulse oximetry and blood pressure monitoring",
      "Serial troponins at 0, 3, 6 hours to assess infarct size",
    ],

    simulationLinks: [
      {
        simulationId: "stemi-inferior-nitro-trap",
        label: "Inferior STEMI — Nitrate Safety Trap",
        scenario: "A patient with chest pain has inferior ST elevation and BP 82/54. Manage the STEMI and navigate the nitrate contraindication.",
        minTier: "premium",
      },
    ],
  },
];

// ─── Accessor functions ─────────────────────────────────────────────────────────

export function getClinicalReasoningEntry(
  rhythmKey: string,
): EcgClinicalReasoningEntry | undefined {
  return ECG_CLINICAL_REASONING_REGISTRY.find((e) => e.rhythmKey === rhythmKey);
}

export const PUBLISHED_REASONING_ENTRIES: ReadonlyArray<EcgClinicalReasoningEntry> =
  ECG_CLINICAL_REASONING_REGISTRY.filter((e) => e.publishStatus === "published");

export const LIFE_THREATENING_ENTRIES: ReadonlyArray<EcgClinicalReasoningEntry> =
  ECG_CLINICAL_REASONING_REGISTRY.filter((e) => e.clinicalRiskLevel === "life_threatening");

export const HIGH_RISK_ENTRIES: ReadonlyArray<EcgClinicalReasoningEntry> =
  ECG_CLINICAL_REASONING_REGISTRY.filter(
    (e) => e.clinicalRiskLevel === "high" || e.clinicalRiskLevel === "life_threatening",
  );

export function getEntriesForProfession(
  profession: "RN" | "RPN" | "NP" | "RT" | "new_grad",
): ReadonlyArray<EcgClinicalReasoningEntry> {
  return PUBLISHED_REASONING_ENTRIES.filter((e) =>
    e.professionNotes.some((n) => n.profession === profession),
  );
}

export const REGISTRY_RHYTHM_KEYS: ReadonlyArray<string> =
  ECG_CLINICAL_REASONING_REGISTRY.map((e) => e.rhythmKey);
