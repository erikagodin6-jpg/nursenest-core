/**
 * ECG Clinical Reasoning Units — Part 2
 * AFib, Atrial Flutter, SVT, Junctional, AJR, AV Blocks, Bundle Branch Blocks
 */

import type { EcgClinicalReasoningUnit } from "./ecg-clinical-reasoning";

export const ECG_CLINICAL_REASONING_UNITS_PART2: EcgClinicalReasoningUnit[] = [

  // ── Atrial Fibrillation ──────────────────────────────────────────────────────
  {
    rhythmKey: "atrial_fibrillation",
    rhythmName: "Atrial Fibrillation",
    recognition: {
      rate: "Ventricular rate variable: 60–180 BPM; atrial rate 350–600/min (chaotic)",
      regularity: "IRREGULARLY IRREGULAR — no two R-R intervals are the same",
      pWaves: "Absent — replaced by chaotic fibrillatory baseline (f-waves)",
      prInterval: "Not measurable — no organised P-waves",
      qrsWidth: "Narrow (< 0.12s) unless BBB or pre-excitation",
      stSegment: "ST changes may indicate ischaemia or rate-related demand",
      keyFeatures: [
        "Irregularly irregular rhythm — the defining feature",
        "No discrete P-waves — fibrillatory baseline",
        "Narrow QRS (if no conduction abnormality)",
        "Ventricular rate varies beat to beat",
      ],
      pearls: [
        "'Irregularly irregular' is NOT the same as 'irregular' — in AFib, no pattern repeats",
        "AFib with a completely regular ventricular rate suggests complete heart block (junctional escape)",
        "AFib + rapid rate + wide QRS = suspect pre-excitation (WPW) — do NOT give adenosine or digoxin",
        "Loss of atrial kick reduces CO by ~20–25% — clinically significant in diastolic dysfunction",
      ],
    },
    mechanism:
      "Multiple simultaneous re-entrant wavelets circulate chaotically through the atria at 350–600 impulses per minute. The AV node acts as a 'gatekeeper', conducting only a fraction of these impulses to the ventricles — and does so unpredictably, producing the characteristic irregularly irregular ventricular response. Because no organised atrial contraction occurs, P-waves are absent and blood pools in the left atrial appendage, creating a thrombotic risk.",
    conductionPath:
      "Multiple chaotic atrial re-entrant circuits → AV node (random conduction) → His-Purkinje → ventricles. The AV node fires when it recovers from refractoriness, which happens at random intervals — hence the irregularity.",
    whyStripLooksThisWay:
      "The fibrillatory baseline replaces organised P-waves. The R-R intervals vary because the AV node conducts randomly rather than in response to organised P-waves. The QRS is narrow because ventricular conduction via His-Purkinje is intact once the AV node conducts.",
    hemodynamicImpact: {
      cardiacOutput: "mildly_reduced",
      cardiacOutputRationale:
        "Loss of organised atrial contraction ('atrial kick') reduces ventricular preload by 15–25%. In patients with diastolic dysfunction, hypertrophic cardiomyopathy, or tight mitral stenosis, loss of atrial kick can cause 50%+ reduction in CO and acute pulmonary oedema.",
      bloodPressureEffect: "variable",
      perfusionStatus:
        "Often tolerated in structurally normal hearts. In heart failure, valvular disease, or HCM, new-onset AFib can cause rapid haemodynamic deterioration.",
      expectedSymptoms: [
        "Palpitations (most common)",
        "Dyspnoea",
        "Fatigue, reduced exercise tolerance",
        "Lightheadedness or near-syncope",
        "Chest discomfort",
        "Acute pulmonary oedema (in decompensated heart failure)",
        "Embolic stroke or TIA (untreated AF with clot formation)",
      ],
      hemodynamicallyStagable: true,
    },
    clinicalPresentation: {
      stable: [
        "Rate-controlled (60–100) AF with no symptoms",
        "Chronic AF, well-tolerated, on anticoagulation",
        "Mildly symptomatic palpitations with normal BP and SpO2",
      ],
      unstable: [
        "Rapid ventricular rate (> 120) with hypotension",
        "New-onset AFib with acute pulmonary oedema",
        "AFib with haemodynamic compromise: SBP < 90, altered LOC, chest pain",
        "AFib with RVR (rapid ventricular response) causing demand ischaemia",
      ],
      redFlags: [
        "Ventricular rate > 120 with any symptoms",
        "New-onset AFib with hypotension",
        "AFib + chest pain (rule out ACS)",
        "AFib + dyspnoea + SpO2 drop",
        "AFib > 48h without anticoagulation (stroke risk if cardioverted)",
      ],
      emergencyTriggers: [
        "AFib with haemodynamic instability (hypotension + symptoms) → immediate synchronised cardioversion",
        "AFib + WPW with wide complex RVR → life-threatening — avoid AV nodal blockers",
      ],
    },
    escalation: {
      defaultLevel: "notify_provider",
      monitoringFrequency: "Continuous with documented rhythm; ventricular rate trending",
      immediateAssessments: [
        "Full vital signs: BP, SpO2, RR, temperature",
        "Assess symptoms: dyspnoea, chest pain, palpitations, near-syncope",
        "12-lead ECG",
        "Duration of AF: < 48h or > 48h (determines cardioversion safety)",
        "Review anticoagulation status",
        "Electrolytes: K⁺, Mg²⁺",
        "Thyroid function if new-onset AF",
      ],
      notifyProviderWhen: [
        "New-onset AFib identified",
        "Ventricular rate > 100 in a previously rate-controlled patient",
        "Any change in AF symptoms",
        "AFib with hypotension or chest pain",
      ],
      rapidResponseWhen: [
        "AFib with RVR and haemodynamic compromise",
        "New AF with acute pulmonary oedema",
        "AFib with hypotension and altered LOC",
      ],
      codeBlueWhen: [
        "AFib degenerating to VF (rare; typically via WPW pre-excitation)",
        "Cardiac arrest with known AFib history",
      ],
      interventionContraindications: [
        "Do NOT cardiovert AF > 48h duration without anticoagulation or TOE to exclude left atrial thrombus (stroke risk)",
        "Do NOT give adenosine for irregular wide-complex tachycardia (possible AF with pre-excitation/WPW)",
        "Do NOT give verapamil or digoxin for AF with WPW — can accelerate conduction through accessory pathway → VF",
        "Do NOT assume an AF patient on anticoagulation cannot have a stroke — compliance and therapeutic levels matter",
      ],
    },
    examTraps: {
      nclex: [
        "The priority action for new AF is NOT cardioversion — it is assessing the patient and verifying duration first",
        "Irregularly irregular = AFib until proven otherwise. Do not label it as 'irregular sinus' — the distinction matters",
        "Cardioversion of AF > 48h without anticoagulation risks stroke — this is a major safety question on NCLEX",
        "Digoxin is NOT the first-line rate control drug for most AF patients today (beta-blockers or CCBs are preferred)",
      ],
      interventionTraps: [
        "Never give adenosine, digoxin, or verapamil for wide-complex irregularly irregular tachycardia — could be WPW",
        "Rate control does NOT prevent stroke — anticoagulation is separate and still needed even when rate is controlled",
      ],
      telemetry: [
        "AFib with complete heart block shows a REGULAR ventricular rate — the irregular irregularity is GONE. Do not miss this",
        "AFib baseline may look like fine tremor — confirm true absence of P-waves vs artefact",
      ],
    },
    professionViews: {
      rn: {
        focus: "Rate, anticoagulation status, and symptom burden determine your priorities in AFib.",
        priorities: [
          "Ventricular rate control (target 60–100)",
          "Anticoagulation status — is the patient protected?",
          "Symptom assessment and haemodynamic status",
          "Duration of AF for cardioversion planning",
        ],
        keyActions: [
          "Obtain 12-lead ECG",
          "Assess and document: rate, BP, symptoms, SpO2",
          "Confirm anticoagulation is in place or ordered",
          "Notify provider for new onset, RVR, or haemodynamic changes",
          "Prepare for IV rate-control medication if ordered (metoprolol, diltiazem)",
        ],
        examFocus: "NCLEX: rate control and anticoagulation are the two concurrent AF management priorities. Neither replaces the other.",
      },
      rpn: {
        focus: "Identify irregular irregularity, document rate, report to RN for any new-onset or symptomatic AF.",
        priorities: ["Recognise irregularly irregular rhythm", "Assess symptoms and VS", "Escalate to RN immediately"],
        keyActions: ["Do not administer AF-specific medications without RN direction", "Report findings and obtain vital signs"],
      },
      np: {
        focus: "Full AF management: CHA₂DS₂-VASc scoring, rhythm vs rate control decision, anticoagulation strategy.",
        priorities: [
          "Calculate CHA₂DS₂-VASc score for stroke risk stratification",
          "Determine: rate control vs rhythm control (AFFIRM/RACE evidence)",
          "Anticoagulation: DOAC vs warfarin based on renal function, patient preference",
          "Identify and treat reversible triggers: hyperthyroidism, infection, PE, alcohol",
        ],
        keyActions: [
          "Initiate anticoagulation if CHA₂DS₂-VASc ≥ 2 (men) or ≥ 3 (women)",
          "Rate control: beta-blocker or non-dihydropyridine CCB",
          "Refer for cardiology or electrophysiology if rhythm control or ablation planned",
          "Cardioversion protocol if < 48h or anticoagulated ≥ 3 weeks",
        ],
        examFocus: "NP boards: CHA₂DS₂-VASc score, DOAC selection, cardioversion criteria.",
      },
      rt: {
        focus: "AF-related respiratory compromise from pulmonary oedema demands ventilatory assessment.",
        priorities: ["Assess SpO2 and work of breathing in rapid AF", "Note if AF correlates with respiratory deterioration in ventilated patients"],
        keyActions: ["Support oxygenation during AF with RVR", "Notify team if AF correlates with ventilatory changes"],
      },
      newGrad: {
        focus: "Irregularly irregular = AFib. Find the rate, check symptoms and BP, and notify the provider.",
        priorities: ["Confirm: is there ANY pattern to the irregularity? If no — it's AFib"],
        keyActions: [
          "Get vital signs",
          "Ask the patient about palpitations, chest pain, dizziness",
          "Notify your charge nurse for any new-onset AF or rate > 100",
        ],
        examFocus: "AFib is the most tested arrhythmia. Know: irregularly irregular, no P-waves, anticoagulation needed, cardioversion only if < 48h without anticoag.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "atrial_flutter",
        compareWithName: "Atrial Flutter",
        keyDifferences: [
          { feature: "Baseline between QRS", thisRhythm: "Chaotic fibrillatory f-waves", otherRhythm: "Organised sawtooth F-waves at 300/min" },
          { feature: "Regularity", thisRhythm: "Irregularly IRREGULAR", otherRhythm: "Regular (fixed ratio) or regularly irregular (variable ratio)" },
          { feature: "Atrial rate", thisRhythm: "350–600/min", otherRhythm: "~300/min" },
          { feature: "Cardioversion response", thisRhythm: "Requires more energy (200J biphasic)", otherRhythm: "Usually converts with less energy (50–100J)" },
          { feature: "Stroke risk", thisRhythm: "Both carry similar stroke risk", otherRhythm: "Both carry similar stroke risk" },
        ],
        clinicalImplication: "Both require anticoagulation. Flutter is often easier to cardiovert. Both can co-exist (atrial flutter can degenerate to AFib).",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "emergency",
        title: "New-Onset AF With RVR and Pulmonary Oedema",
        clinicalContext: "65-year-old with hypertension and diastolic dysfunction. Monitor suddenly shows irregularly irregular rhythm at rate 140 BPM.",
        patientPresentation: "New dyspnoea, SpO2 88% on room air, BP 95/60, HR 140 irregular. Bilateral crackles on auscultation.",
        keyDecisionPoint: "Haemodynamically unstable AF — rate control medications vs immediate synchronised cardioversion?",
        learnerObjective: "Identify unstable AF, prioritise cardioversion decision (haemodynamically unstable), recognise that duration < 48h allows immediate cardioversion.",
      },
    ],
  },

  // ── Atrial Flutter ───────────────────────────────────────────────────────────
  {
    rhythmKey: "atrial_flutter",
    rhythmName: "Atrial Flutter",
    recognition: {
      rate: "Atrial rate ~300/min; ventricular rate depends on conduction ratio (4:1 = 75 BPM, 2:1 = 150 BPM)",
      regularity: "Regular (fixed conduction ratio) or regularly irregular (variable ratio)",
      pWaves: "Replaced by sawtooth flutter waves (F-waves) at ~300/min — inverted in inferior leads (II, III, aVF)",
      prInterval: "Not measurable — no discrete P-waves",
      qrsWidth: "Narrow (< 0.12s)",
      keyFeatures: [
        "Classic sawtooth (picket-fence) F-waves visible between QRS complexes",
        "F-wave rate ~300/min (inverted in II, III, aVF)",
        "Fixed AV conduction ratio gives regular ventricular rate",
        "Every 2nd or 4th F-wave is followed by a QRS (2:1 or 4:1 block)",
      ],
      pearls: [
        "At 2:1 conduction (ventricular rate 150 BPM), one flutter wave is hidden in the QRS — look for the second wave between complexes",
        "Vagal manoeuvres or adenosine will temporarily slow the ventricular rate, making flutter waves more visible — it does NOT convert flutter",
        "Both AFib and flutter carry equal stroke/thromboembolic risk — anticoagulation is required for both",
        "Flutter waves are best seen in leads II, III, aVF (inverted sawtooth) and V1 (biphasic)",
      ],
    },
    mechanism:
      "A single large re-entrant circuit circles the right atrium at approximately 300 times per minute, most commonly rotating around the tricuspid annulus (typical, counter-clockwise flutter). This produces the characteristic sawtooth waveform. The AV node cannot conduct 300 impulses per minute and imposes a physiologic block, typically allowing every 2nd (2:1) or every 4th (4:1) atrial impulse to reach the ventricles.",
    conductionPath:
      "Single re-entrant circuit in right atrium (around tricuspid annulus) at ~300/min → AV node (physiologic block — conducts every 2nd or 4th impulse) → His-Purkinje → ventricles",
    whyStripLooksThisWay:
      "The sawtooth baseline reflects the continuous re-entrant wavefront depolarising the atria. The F-waves are inverted in inferior leads because the wavefront travels superiorly (counter-clockwise around the tricuspid annulus). The regular ventricular response reflects the fixed conduction ratio at the AV node.",
    hemodynamicImpact: {
      cardiacOutput: "mildly_reduced",
      cardiacOutputRationale:
        "Loss of organised atrial contraction reduces CO by 15–25%, similar to AFib. At 2:1 flutter (rate 150 BPM), haemodynamic compromise may be significant, especially in patients with impaired ventricular function.",
      bloodPressureEffect: "variable",
      perfusionStatus: "Dependent on ventricular rate and underlying cardiac function. 4:1 flutter at 75 BPM may be well-tolerated. 2:1 flutter at 150 BPM may cause significant symptoms.",
      expectedSymptoms: [
        "Palpitations",
        "Dyspnoea",
        "Chest tightness",
        "Fatigue",
        "Near-syncope at high ventricular rates",
      ],
      hemodynamicallyStagable: true,
    },
    clinicalPresentation: {
      stable: [
        "Rate-controlled flutter (4:1 at 75 BPM) with minimal symptoms",
        "Chronic flutter on anticoagulation",
      ],
      unstable: [
        "2:1 flutter at 150 BPM with hypotension",
        "Rapid flutter with haemodynamic compromise",
      ],
      redFlags: [
        "Rate 150 BPM regular — think 2:1 flutter until ruled out",
        "Tachycardia at exactly 150 BPM is a classic flutter rate — look for hidden flutter waves",
        "Any flutter > 48h without anticoagulation before cardioversion",
      ],
      emergencyTriggers: [
        "Haemodynamic instability with flutter → synchronised cardioversion",
      ],
    },
    escalation: {
      defaultLevel: "notify_provider",
      monitoringFrequency: "Continuous with ventricular rate trending",
      immediateAssessments: [
        "Confirm flutter vs AFib (regular vs irregularly irregular)",
        "Determine ventricular rate and haemodynamic status",
        "Check anticoagulation status and duration of flutter",
        "12-lead ECG — F-waves best seen in II, III, aVF, V1",
      ],
      notifyProviderWhen: [
        "New-onset flutter identified",
        "Ventricular rate > 120 BPM",
        "Any haemodynamic change",
      ],
      rapidResponseWhen: [
        "Flutter with haemodynamic compromise",
        "Ventricular rate > 150 with hypotension or altered LOC",
      ],
      codeBlueWhen: ["Cardiovascular collapse"],
      interventionContraindications: [
        "Do NOT cardiovert flutter > 48h without anticoagulation or TOE — same stroke risk as AFib",
        "Adenosine does NOT convert flutter — it temporarily slows the ventricular rate to expose flutter waves",
        "Do NOT give adenosine, verapamil, or digoxin if WPW is suspected",
      ],
    },
    examTraps: {
      nclex: [
        "Regular rate of ~150 BPM — ALWAYS suspect 2:1 flutter before diagnosing sinus tachycardia",
        "Adenosine slows the rate temporarily but does NOT convert flutter to sinus rhythm",
        "Both flutter and AFib require anticoagulation — do not treat flutter as a lower-risk rhythm",
      ],
      telemetry: [
        "At 2:1 flutter, one F-wave is hidden in or just after the QRS — count the F-waves, not just the QRS complexes",
        "Flutter can be mistaken for sinus tachycardia at 150 BPM if flutter waves are subtle",
      ],
    },
    professionViews: {
      rn: {
        focus: "Confirm the regular rate, count F-waves per QRS, and assess haemodynamics.",
        priorities: ["Confirm sawtooth baseline in lead II or V1", "Determine conduction ratio", "Assess vital signs and symptoms"],
        keyActions: [
          "Obtain 12-lead ECG",
          "Confirm anticoagulation status",
          "Notify provider for new onset or rate > 120",
          "Prepare for rate control or cardioversion as ordered",
        ],
        examFocus: "A regular rate of 150 BPM: think 2:1 flutter and look for sawtooth baseline.",
      },
      rpn: {
        focus: "Recognise sawtooth F-waves, regular ventricular rate, and escalate to RN.",
        priorities: ["Identify sawtooth flutter waves", "Report regular tachycardia at ~150 BPM to RN"],
        keyActions: ["Obtain vital signs", "Notify RN immediately"],
      },
      np: {
        focus: "Flutter is often more responsive to cardioversion than AFib. Consider catheter ablation for recurrent flutter.",
        priorities: [
          "Rate control with AV nodal agents",
          "Anticoagulation (same as AFib)",
          "Cardioversion if symptomatic or haemodynamically compromised",
          "Cavotricuspid isthmus ablation for recurrent typical flutter — > 95% cure rate",
        ],
        keyActions: [
          "Initiate anticoagulation before cardioversion if duration > 48h or unknown",
          "Ibutilide IV for pharmacologic cardioversion of flutter",
          "Refer for ablation if recurrent — flutter is highly amenable",
        ],
        examFocus: "NP: know that flutter is often cured by ablation and that ibutilide is first-line pharmacologic cardioversion.",
      },
      rt: {
        focus: "Ventricular rate in flutter directly impacts CO and oxygenation delivery.",
        priorities: ["Monitor SpO2 and respiratory work during flutter with RVR"],
        keyActions: ["Optimise oxygenation; notify team if respiratory compromise correlates with flutter rate"],
      },
      newGrad: {
        focus: "Sawtooth baseline = flutter. Count: how many F-waves between each QRS?",
        priorities: ["Identify the regular sawtooth pattern between QRS complexes", "Report to charge nurse"],
        keyActions: ["Get vital signs", "Notify charge RN", "Do not attempt any rate-control interventions independently"],
        examFocus: "Regular rate at exactly 75 or 150 BPM with a wavy baseline between QRS = atrial flutter.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "atrial_fibrillation",
        compareWithName: "Atrial Fibrillation",
        keyDifferences: [
          { feature: "Baseline", thisRhythm: "Organised sawtooth (300/min)", otherRhythm: "Chaotic fibrillatory f-waves" },
          { feature: "Ventricular regularity", thisRhythm: "Regular (fixed ratio)", otherRhythm: "Irregularly irregular" },
          { feature: "Cardioversion response", thisRhythm: "Often converts with low energy (50–100J)", otherRhythm: "Typically requires 200J biphasic" },
          { feature: "Ablation success", thisRhythm: "> 95% with cavotricuspid isthmus ablation", otherRhythm: "70–80% with pulmonary vein isolation" },
        ],
        clinicalImplication: "Both require anticoagulation. Flutter is more amenable to definitive ablation. Both can co-exist in the same patient.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "diagnostic_challenge",
        title: "Regular 150 BPM — Sinus Tachycardia or Flutter?",
        clinicalContext: "Post-op day 1 cardiac surgery. HR 150 BPM, regular. Patient is restless and mildly hypotensive.",
        patientPresentation: "BP 92/60, HR 150 regular, SpO2 94%. Initially called 'sinus tachycardia' by nursing.",
        keyDecisionPoint: "Is this sinus tachycardia or 2:1 flutter? Where do you look and what do you do next?",
        learnerObjective: "Request 12-lead ECG, look for flutter waves in II and V1, and recognise that adenosine can clarify the rhythm (not treat it).",
      },
    ],
  },

  // ── SVT ──────────────────────────────────────────────────────────────────────
  {
    rhythmKey: "svt",
    rhythmName: "SVT — Supraventricular Tachycardia",
    recognition: {
      rate: "150–220 BPM",
      regularity: "Regular",
      pWaves: "Absent or retrograde (inverted, buried in or just after QRS)",
      prInterval: "Not measurable — P-waves hidden",
      qrsWidth: "Narrow (< 0.12s) unless aberrant conduction or pre-excitation",
      keyFeatures: [
        "Very rapid (150–220 BPM) regular narrow-complex tachycardia",
        "Abrupt (paroxysmal) onset and termination",
        "P-waves absent or retrograde",
        "No identifiable underlying cause (unlike sinus tachycardia)",
      ],
      pearls: [
        "Onset is abrupt — patient often describes sudden palpitations that start and stop without warning",
        "AVNRT (AV nodal re-entrant tachycardia) is the most common cause — uses the AV node as a re-entry circuit",
        "AVRT (AV re-entrant tachycardia) uses an accessory pathway — associated with WPW",
        "Vagal manoeuvres FIRST — Valsalva (modified: supine, strain, then leg raise) works best",
        "If vagal fails: adenosine 6mg IV rapid push with flush",
      ],
    },
    mechanism:
      "Most commonly AVNRT: a re-entrant circuit within or near the AV node uses dual pathways (fast and slow) to sustain rapid circular conduction. The ventricles are activated via the His-Purkinje system normally (narrow QRS). Because P-waves and QRS complexes are produced nearly simultaneously (retrograde atrial activation), P-waves are hidden within or just after the QRS. Less commonly, AVRT uses an accessory pathway (Bundle of Kent in WPW) as the retrograde limb.",
    conductionPath:
      "AVNRT: re-entrant circuit within AV node (fast and slow pathways) → ventricles via His-Purkinje (narrow QRS) → retrograde atrial activation (P-wave buried in/after QRS). AVRT: anterograde via AV node → retrograde via accessory pathway (or vice versa).",
    whyStripLooksThisWay:
      "The rapid regular rate reflects the circular re-entrant circuit driving both atrial and ventricular activation simultaneously. The narrow QRS confirms ventricular activation via the normal His-Purkinje system. P-waves are absent or pseudo-S waves in inferior leads (retrograde atrial activation immediately follows the QRS in AVNRT).",
    hemodynamicImpact: {
      cardiacOutput: "mildly_reduced",
      cardiacOutputRationale:
        "At 150–220 BPM, diastolic filling time is severely reduced, decreasing stroke volume. Loss of atrial kick at these rates further reduces CO. Most patients tolerate SVT briefly but can decompensate with prolonged episodes.",
      bloodPressureEffect: "variable",
      perfusionStatus: "Often adequate for short episodes. Prolonged SVT (> 30 minutes) or SVT with underlying cardiac disease may cause significant haemodynamic compromise.",
      expectedSymptoms: [
        "Sudden-onset palpitations",
        "Dizziness or lightheadedness",
        "Dyspnoea",
        "Chest pressure or tightness",
        "Near-syncope",
        "Anxiety",
        "Neck pounding (cannon A-waves from retrograde atrial contraction)",
      ],
      hemodynamicallyStagable: true,
    },
    clinicalPresentation: {
      stable: [
        "Rapid palpitations, aware and conversant",
        "BP maintained (> 90 systolic)",
        "No chest pain or dyspnoea",
        "Short duration",
      ],
      unstable: [
        "Hypotension (SBP < 90) + SVT",
        "Altered consciousness with rapid rate",
        "Severe chest pain or dyspnoea during SVT",
        "Pulmonary oedema during sustained SVT",
      ],
      redFlags: [
        "SVT duration > 20 minutes",
        "SVT with pre-syncope or syncope",
        "SVT in known WPW patient",
        "SVT with rate > 200 BPM",
      ],
      emergencyTriggers: [
        "Haemodynamic instability + SVT → immediate synchronised cardioversion",
        "SVT with chest pain + ST changes → treat as possible ACS with SVT overlay",
      ],
    },
    escalation: {
      defaultLevel: "notify_provider",
      monitoringFrequency: "Continuous; document onset time, rate, and resolution",
      immediateAssessments: [
        "Assess haemodynamic stability: BP, LOC, SpO2",
        "Establish IV access",
        "12-lead ECG during SVT episode",
        "Vagal manoeuvres if stable (do not delay other assessment)",
        "Prepare adenosine 6mg IV",
      ],
      notifyProviderWhen: [
        "SVT identified",
        "SVT not responding to vagal manoeuvres",
        "Any haemodynamic change",
        "First episode of SVT",
      ],
      rapidResponseWhen: [
        "SVT with hypotension",
        "SVT with altered consciousness",
        "SVT not converting with adenosine",
      ],
      codeBlueWhen: [
        "Cardiac arrest with SVT mechanism",
        "SVT degenerating to VF (rare; typically in WPW)",
      ],
      interventionContraindications: [
        "Do NOT give verapamil for wide-complex tachycardia — if the rhythm is actually VT, verapamil is lethal",
        "Do NOT give adenosine for irregular wide-complex tachycardia (possible AF with WPW)",
        "Do NOT give adenosine to asthmatic patients (causes bronchospasm) — use diltiazem or beta-blocker instead",
        "Adenosine requires a large antecubital or central vein with rapid flush — peripheral hand veins will not work",
      ],
    },
    examTraps: {
      nclex: [
        "Vagal manoeuvres are FIRST-LINE for stable SVT before any medication",
        "Adenosine is the first-line medication for stable SVT — not verapamil",
        "Do NOT give verapamil if the rhythm could be VT — this is the most dangerous SVT intervention trap",
        "SVT with haemodynamic instability → synchronised cardioversion (NOT adenosine)",
      ],
      interventionTraps: [
        "Adenosine must be given rapidly as a bolus into a large antecubital vein and flushed immediately — slow infusion is ineffective",
        "Adenosine causes a brief alarming flatline — warn the patient and observe the rhythm for conversion",
        "After adenosine, the rhythm often briefly converts to AF before returning to sinus — this is normal and expected",
      ],
      telemetry: [
        "Regular narrow tachycardia at 150 BPM — think flutter FIRST (rule it out), then SVT",
        "Retrograde P-waves (pseudo-S wave in II, III or pseudo-R' in V1) are the clue that this is SVT, not sinus tach",
      ],
    },
    professionViews: {
      rn: {
        focus: "Assess haemodynamics first — stable SVT is managed with vagal manoeuvres then adenosine; unstable SVT requires immediate cardioversion.",
        priorities: [
          "Establish IV access before any intervention",
          "Assess stability: BP, LOC, symptoms",
          "Initiate vagal manoeuvre if stable",
          "Prepare adenosine 6mg IV flush",
        ],
        keyActions: [
          "Apply 12-lead ECG — document the rhythm",
          "Modified Valsalva: supine, strain 15s, then leg lift — most effective vagal manoeuvre",
          "Adenosine 6mg rapid IV push + 20mL NS flush if vagal fails",
          "If unstable: notify provider STAT — prepare cardioversion",
          "Continuous monitoring post-conversion for recurrence",
        ],
        examFocus: "NCLEX vagal → adenosine → cardioversion sequence is frequently tested. Vagal manoeuvres first.",
      },
      rpn: {
        focus: "Identify rapid regular narrow tachycardia, assess stability, escalate to RN immediately.",
        priorities: ["Confirm narrow QRS", "Assess symptoms and BP", "Escalate to RN without delay"],
        keyActions: ["Notify RN immediately", "Stay with patient", "Obtain IV access if possible"],
      },
      np: {
        focus: "Acute conversion and long-term management plan including electrophysiology referral.",
        priorities: [
          "Acute: confirm narrow-complex mechanism; vagal → adenosine → cardioversion if unstable",
          "Chronic: electrophysiology study + catheter ablation curative in > 90% of AVNRT cases",
          "Exclude WPW (delta waves on baseline ECG)",
        ],
        keyActions: [
          "Order ECG during episode and at baseline (delta waves?)",
          "Refer to EP if recurrent SVT — ablation is first-line for recurrent AVNRT",
          "Verapamil or beta-blocker for long-term suppression if ablation declined",
        ],
        examFocus: "NP: vagal → adenosine → cardioversion acute pathway; ablation is curative for AVNRT.",
      },
      rt: {
        focus: "SVT at high rates severely compromises cardiac output — oxygenation delivery falls; assess respiratory compensation.",
        priorities: ["Monitor SpO2 during SVT", "Note if increased respiratory work correlates with SVT onset"],
        keyActions: ["Supplemental oxygen if SpO2 drops", "Notify team of SpO2 changes during tachycardia"],
      },
      newGrad: {
        focus: "Rapid regular narrow tachycardia — take a breath, assess the patient, and call for help while you get IV access.",
        priorities: ["Is the patient awake and talking? BP?", "Get IV access", "Get your charge nurse NOW"],
        keyActions: [
          "Do the modified Valsalva if the provider agrees — it's safe and sometimes works",
          "Do NOT try to give medications independently — get your charge nurse or provider to the bedside",
        ],
        examFocus: "Vagal manoeuvre FIRST for stable SVT. Adenosine second. Cardioversion for unstable.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "ventricular_tachycardia",
        compareWithName: "Ventricular Tachycardia",
        keyDifferences: [
          { feature: "QRS width", thisRhythm: "NARROW (< 0.12s)", otherRhythm: "WIDE (> 0.12s)" },
          { feature: "Rate", thisRhythm: "150–220 BPM", otherRhythm: "120–250 BPM" },
          { feature: "Haemodynamic tolerance", thisRhythm: "Usually better tolerated", otherRhythm: "More often haemodynamically compromised" },
          { feature: "Response to adenosine", thisRhythm: "Converts to sinus (or reveals flutter)", otherRhythm: "No effect or minimal slowing" },
          { feature: "Treatment if uncertain", thisRhythm: "Vagal → adenosine", otherRhythm: "Amiodarone or cardioversion" },
        ],
        clinicalImplication: "NEVER give verapamil for a wide-complex tachycardia — if it is VT, verapamil causes haemodynamic collapse. When uncertain about wide-complex tachycardia, treat as VT.",
      },
      {
        compareWithRhythmKey: "sinus_tachycardia",
        compareWithName: "Sinus Tachycardia",
        keyDifferences: [
          { feature: "Onset", thisRhythm: "Abrupt (paroxysmal)", otherRhythm: "Gradual" },
          { feature: "P-waves", thisRhythm: "Absent or retrograde", otherRhythm: "Present and upright" },
          { feature: "Rate", thisRhythm: "150–220 BPM", otherRhythm: "100–160 BPM" },
          { feature: "Underlying cause", thisRhythm: "Usually none (paroxysmal)", otherRhythm: "Always has a cause" },
          { feature: "Adenosine", thisRhythm: "Converts to sinus", otherRhythm: "Brief slowing only" },
        ],
        clinicalImplication: "Sinus tachycardia has a cause and does not respond to adenosine with conversion. SVT converts abruptly. This distinction determines whether you treat the rate or treat the cause.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "emergency",
        title: "SVT in the Emergency Department — Stable to Unstable",
        clinicalContext: "28-year-old presents with sudden palpitations. HR 190 BPM regular, narrow QRS. BP 110/70 on arrival.",
        patientPresentation: "Anxiety, palpitations, mild dyspnoea. Vagal manoeuvres fail. Modified Valsalva fails. Adenosine 6mg given — brief flatline, then immediate SVT recurrence.",
        keyDecisionPoint: "BP drops to 88/55 after second adenosine attempt. What is the next step?",
        learnerObjective: "Recognise haemodynamic instability post-failed adenosine, initiate synchronised cardioversion protocol.",
      },
    ],
  },

  // ── Junctional Rhythm ────────────────────────────────────────────────────────
  {
    rhythmKey: "junctional_rhythm",
    rhythmName: "Junctional Rhythm",
    recognition: {
      rate: "40–60 BPM",
      regularity: "Regular",
      pWaves: "Absent OR retrograde (inverted in II, III, aVF — appearing before, during, or after QRS)",
      prInterval: "Not measurable (absent P) or very short (< 0.12s if retrograde P precedes QRS)",
      qrsWidth: "Narrow (< 0.12s) — conduction through ventricles is normal",
      keyFeatures: [
        "Rate 40–60 BPM (slower than normal AV node discharge rate of 40–60)",
        "No upright sinus P-waves before QRS",
        "May have retrograde inverted P-waves",
        "Narrow QRS confirming normal His-Purkinje conduction",
      ],
      pearls: [
        "The AV node is functioning as the primary pacemaker — the SA node has failed or is suppressed",
        "Rate 40–60 BPM = junctional rate; rate > 60 = accelerated junctional",
        "Retrograde P-waves (if visible) are INVERTED in II, III, aVF because atrial activation travels superiorly",
        "Narrow QRS is the key distinguisher from ventricular escape — junctional conducts normally through His-Purkinje",
      ],
    },
    mechanism:
      "When the SA node fails to initiate an impulse (sick sinus syndrome, excessive vagal tone, medication effect, inferior MI) or fires below 40 BPM, the AV node's intrinsic automaticity (40–60 BPM) takes over as the dominant pacemaker. The AV node depolarises simultaneously activating the ventricles normally (via His-Purkinje → narrow QRS) and the atria retrogradely (via AV node → atria in reverse → inverted P-wave).",
    conductionPath:
      "AV node (primary pacemaker) → His-Purkinje (normal conduction) → ventricles (narrow QRS). Simultaneously, retrograde conduction from AV node → atria → inverted P-wave (if visible).",
    whyStripLooksThisWay:
      "The regular narrow QRS at 40–60 BPM is the hallmark. No upright P-waves because the SA node is not initiating the beat. If retrograde P-waves are visible, they are inverted (atria depolarise from below upward rather than the normal top-down SA node direction). The narrow QRS confirms ventricular activation via His-Purkinje is intact.",
    hemodynamicImpact: {
      cardiacOutput: "mildly_reduced",
      cardiacOutputRationale:
        "Rate 40–60 BPM reduces cardiac output primarily by reducing heart rate. Loss of coordinated AV synchrony (if retrograde P-waves cause atrial contraction against closed AV valves) can further reduce ventricular filling.",
      bloodPressureEffect: "mildly_reduced",
      perfusionStatus: "Often adequate if rate ≥ 45 BPM and no structural heart disease. May cause symptoms if rate is at the lower end (40–45 BPM).",
      expectedSymptoms: [
        "Often asymptomatic at rates 50–60 BPM",
        "Fatigue, dizziness, near-syncope at lower rates",
        "Neck pulsations (if retrograde atrial contraction against closed AV valves — 'cannon A-waves')",
        "Dyspnoea on exertion",
      ],
      hemodynamicallyStagable: true,
    },
    clinicalPresentation: {
      stable: [
        "Asymptomatic junctional rhythm in a sleeping or athletic patient",
        "Rate 50–60 with maintained BP",
        "Common with high vagal tone, inferior MI reperfusion",
      ],
      unstable: [
        "Rate < 45 BPM with hypotension",
        "Junctional rhythm from SA node failure with symptoms",
      ],
      redFlags: [
        "New junctional rhythm — always look for the cause",
        "Junctional rhythm + inferior MI (RCA ischaemia affects SA node)",
        "Increasing PR prolongation before junctional escape — may indicate progression of AV block",
        "Junctional rate < 45 BPM",
      ],
      emergencyTriggers: [
        "Haemodynamic compromise with junctional rhythm → pacing may be required",
        "Junctional rhythm progressing to complete heart block",
      ],
    },
    escalation: {
      defaultLevel: "notify_provider",
      monitoringFrequency: "Continuous",
      immediateAssessments: [
        "Assess symptoms: dizziness, near-syncope, chest pain",
        "Check BP and SpO2",
        "12-lead ECG — rule out inferior MI (SA node supplied by RCA)",
        "Review medications: beta-blockers, digoxin, calcium channel blockers",
        "Check electrolytes",
      ],
      notifyProviderWhen: [
        "Any new junctional rhythm",
        "Rate < 50 BPM with symptoms",
        "Junctional rhythm in the context of acute MI",
        "Junctional rhythm secondary to medication toxicity",
      ],
      rapidResponseWhen: [
        "Junctional rhythm with haemodynamic compromise",
        "Rate < 40 BPM with symptoms",
      ],
      codeBlueWhen: ["Progresses to cardiac arrest"],
      interventionContraindications: [
        "Atropine may not reliably increase junctional rate — the AV node may not respond predictably",
        "Do not give AV-nodal-blocking agents to a patient already in junctional rhythm",
      ],
    },
    examTraps: {
      nclex: [
        "Junctional rhythm ≠ complete heart block — in junctional rhythm, the AV node IS the pacemaker. In 3rd degree block, there is AV dissociation",
        "Narrow QRS is key — if the rhythm is wide at 40–60 BPM, think ventricular escape, not junctional",
        "Retrograde P-waves (inverted in II) after the QRS is a PAC only if the preceding beat was normal — in junctional rhythm these are expected",
      ],
      telemetry: [
        "No visible P-waves + narrow QRS + rate 40–60 = junctional escape until proven otherwise",
        "Do not confuse with complete heart block — in complete block, P-waves are visible but marching independently",
      ],
    },
    professionViews: {
      rn: {
        focus: "Identify that the SA node is not driving the rhythm, assess why, and check for haemodynamic impact.",
        priorities: ["Assess patient symptoms and BP", "Identify probable cause (medication, inferior MI, vagal)", "12-lead ECG"],
        keyActions: [
          "Obtain 12-lead ECG (look for inferior MI changes)",
          "Review medication list",
          "Notify provider for any new junctional rhythm",
          "Monitor for progression of block",
        ],
        examFocus: "Junctional rhythm on NCLEX: narrow QRS, rate 40–60, absent or retrograde P-waves. Priority is identifying the cause.",
      },
      rpn: {
        focus: "Recognise narrow QRS at 40–60 BPM without normal P-waves and escalate to RN.",
        priorities: ["Identify rate and QRS width", "Assess symptoms"],
        keyActions: ["Notify RN immediately for any junctional escape rhythm"],
      },
      np: {
        focus: "Determine the cause and decide whether observation, medication reversal, or pacing is needed.",
        priorities: [
          "Identify the underlying cause: medication, inferior MI, sick sinus syndrome, increased vagal tone",
          "Evaluate need for temporary pacing if symptomatic and unresponsive to treatment",
          "Refer for electrophysiology study if persistent and unexplained",
        ],
        keyActions: [
          "Hold or reverse offending medications",
          "Treat inferior MI if present",
          "Temporary pacing for haemodynamically compromised junctional escape",
        ],
        examFocus: "NP: know when junctional escape is benign vs a warning sign of progressive conduction disease.",
      },
      rt: {
        focus: "Junctional rhythm at 40–60 BPM may reduce CO enough to affect oxygenation delivery.",
        priorities: ["Monitor SpO2", "Note if respiratory effort increases with junctional rates"],
        keyActions: ["Notify team if oxygenation deteriorates with junctional escape"],
      },
      newGrad: {
        focus: "Slow narrow rhythm without P-waves — the AV node is the backup. Always find out why the SA node stopped.",
        priorities: ["Confirm narrow QRS", "Look for any P-waves (absent or inverted)"],
        keyActions: ["Report to charge nurse", "Get vital signs", "Prepare 12-lead ECG"],
        examFocus: "Rate 40–60 + narrow QRS + no normal P-waves = junctional escape.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "sinus_bradycardia",
        compareWithName: "Sinus Bradycardia",
        keyDifferences: [
          { feature: "P-wave", thisRhythm: "Absent or retrograde/inverted", otherRhythm: "Upright, before every QRS" },
          { feature: "SA node status", thisRhythm: "SA node not functioning as pacemaker", otherRhythm: "SA node firing slowly" },
          { feature: "Rate", thisRhythm: "40–60 BPM", otherRhythm: "< 60 BPM (overlap possible)" },
          { feature: "Mechanism", thisRhythm: "AV node escape pacemaker", otherRhythm: "SA node suppression" },
        ],
        clinicalImplication: "Both can appear at similar rates, but junctional rhythm indicates SA node failure. P-wave morphology is the key distinguisher.",
      },
      {
        compareWithRhythmKey: "ventricular_escape_rhythm",
        compareWithName: "Ventricular Escape Rhythm",
        keyDifferences: [
          { feature: "QRS width", thisRhythm: "NARROW < 0.12s", otherRhythm: "WIDE > 0.12s" },
          { feature: "Rate", thisRhythm: "40–60 BPM", otherRhythm: "20–40 BPM" },
          { feature: "Origin", thisRhythm: "AV node — His-Purkinje intact", otherRhythm: "Ventricular myocardium — bypasses His-Purkinje" },
          { feature: "Prognosis", thisRhythm: "Better — treatable cause often found", otherRhythm: "Worse — requires pacing almost always" },
        ],
        clinicalImplication: "Narrow QRS at 40–60 = junctional (better). Wide QRS at 20–40 = ventricular escape (worse). QRS width is the critical discriminator.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "medication_effect",
        title: "Digoxin Toxicity Presenting as Junctional Rhythm",
        clinicalContext: "78-year-old with chronic AF on digoxin. Rhythm monitor shows regular narrow QRS at 52 BPM — no longer irregular.",
        patientPresentation: "Patient reports nausea, blurred vision with yellow halos, and mild dizziness. HR 52 regular. Digoxin level: 3.1 nmol/L (therapeutic: 0.8–2.0).",
        keyDecisionPoint: "What does the new regular narrow rhythm signify in an AF patient? What is the priority?",
        learnerObjective: "Recognise junctional rhythm replacing AF as a sign of digoxin toxicity; initiate digoxin hold, toxicology notification, and continuous monitoring.",
      },
    ],
  },

  // ── Accelerated Junctional Rhythm ─────────────────────────────────────────────
  {
    rhythmKey: "accelerated_junctional_rhythm",
    rhythmName: "Accelerated Junctional Rhythm",
    recognition: {
      rate: "61–100 BPM",
      regularity: "Regular",
      pWaves: "Absent or retrograde — same as junctional rhythm",
      prInterval: "Not measurable",
      qrsWidth: "Narrow (< 0.12s)",
      keyFeatures: [
        "Same features as junctional rhythm but rate 61–100 (NOT 40–60)",
        "Rate COMPETES with SA node rate — AV node is inappropriately enhanced",
        "Narrow QRS, no upright sinus P-waves",
        "'Accelerated' = AV node firing faster than its intrinsic 40–60 BPM",
      ],
      pearls: [
        "Most common causes: digoxin toxicity, reperfusion after MI, post-cardiac surgery, myocarditis",
        "Usually BENIGN and self-limiting — does not require treatment in most cases",
        "Does NOT require cardioversion or antiarrhythmic therapy alone",
        "Key trap: do NOT confuse this with NSR just because the rate looks normal — look for absent/retrograde P-waves",
      ],
    },
    mechanism:
      "The AV node's automaticity is pathologically enhanced (by digoxin toxicity, catecholamine surge, ischaemic tissue near the AV node in inferior MI) to a rate of 61–100 BPM, which equals or exceeds the SA node firing rate. The AV node therefore captures the ventricular rhythm. Conduction to the ventricles remains normal (narrow QRS). The SA node may still be firing but is overridden.",
    conductionPath:
      "Enhanced AV node automaticity → His-Purkinje → ventricles (narrow QRS). Retrograde atrial activation may produce inverted P-waves if AV node fires before SA node.",
    whyStripLooksThisWay:
      "Regular narrow QRS at a near-normal rate with absent or retrograde P-waves. The rate overlap with NSR makes this rhythm easily missed if P-wave morphology is not analysed carefully.",
    hemodynamicImpact: {
      cardiacOutput: "normal",
      cardiacOutputRationale: "Rate 61–100 with normal QRS width maintains adequate CO in most patients. Loss of AV synchrony may slightly reduce CO.",
      bloodPressureEffect: "normal",
      perfusionStatus: "Usually normal.",
      expectedSymptoms: ["Usually asymptomatic", "Palpitations (mild)", "Occasionally dizziness"],
      hemodynamicallyStagable: false,
    },
    clinicalPresentation: {
      stable: ["Typically asymptomatic — incidental finding", "Normal BP and SpO2"],
      unstable: ["AJR itself rarely causes instability — assess for the underlying cause (digoxin toxicity, MI)"],
      redFlags: [
        "AJR in context of digoxin toxicity (nausea, visual changes, digoxin level elevated)",
        "AJR in setting of inferior MI",
        "AJR progressing to junctional tachycardia (rate > 100)",
      ],
      emergencyTriggers: [],
    },
    escalation: {
      defaultLevel: "notify_provider",
      monitoringFrequency: "Continuous",
      immediateAssessments: [
        "Confirm absent/retrograde P-waves (distinguish from NSR)",
        "Check digoxin level if patient is on digoxin",
        "12-lead ECG — look for inferior MI changes",
        "Assess for digoxin toxicity symptoms: nausea, vomiting, visual halos, bradycardia",
      ],
      notifyProviderWhen: [
        "AJR identified — determine underlying cause",
        "Suspected digoxin toxicity",
        "AJR in setting of acute MI",
      ],
      rapidResponseWhen: [],
      codeBlueWhen: [],
      interventionContraindications: [
        "Do NOT treat AJR with antiarrhythmics unless it causes haemodynamic compromise",
        "Do NOT cardiovert AJR",
        "If due to digoxin toxicity: HOLD digoxin — do not add additional AV nodal blocking agents",
      ],
    },
    examTraps: {
      nclex: [
        "AJR is NOT NSR — P-waves are absent or retrograde. Always check P-wave morphology for a 'normal-looking' regular rhythm",
        "AJR usually does NOT require antiarrhythmic treatment — it is typically a benign or self-limiting rhythm",
        "Digoxin toxicity commonly presents with AJR — know the associated symptoms (nausea, yellow-green halos, bradycardia from other causes)",
      ],
      telemetry: [
        "AJR at 65 BPM can look deceptively like NSR — examine lead II for inverted or absent P-waves",
        "Regular narrow rhythm without clear upright P-waves ≠ NSR",
      ],
    },
    professionViews: {
      rn: {
        focus: "AJR is usually benign but always has a cause — confirm P-wave morphology and identify the trigger.",
        priorities: ["Confirm absent/retrograde P-waves", "Check digoxin level", "Assess patient symptoms"],
        keyActions: ["Document rhythm with 12-lead ECG", "Hold digoxin if toxicity suspected", "Notify provider"],
        examFocus: "AJR: regular narrow rhythm + no upright P-waves. Cause matters more than the rhythm itself.",
      },
      rpn: {
        focus: "Recognise that a regular narrow rhythm is NOT necessarily NSR — report to RN for P-wave analysis.",
        priorities: ["Alert RN if regular rhythm lacks clear upright P-waves"],
        keyActions: ["Notify RN", "Obtain vital signs"],
      },
      np: {
        focus: "Identify the cause — digoxin level, inferior MI, post-op state. Treat the cause, not the rhythm.",
        priorities: ["Digoxin level", "Electrolytes", "Troponin if MI suspected"],
        keyActions: ["Hold digoxin if level elevated", "Monitor rhythm — typically self-resolves with cause treated"],
        examFocus: "NP: AJR is a digoxin toxicity rhythm — know the serum level therapeutic range and management.",
      },
      rt: {
        focus: "AJR is usually haemodynamically neutral — monitor respiratory and SpO2 for change.",
        priorities: ["Confirm no respiratory compromise from underlying cause (inferior MI, digoxin toxicity)"],
        keyActions: ["Monitor SpO2", "Report any respiratory change to team"],
      },
      newGrad: {
        focus: "Regular narrow rhythm with no clear P-waves: do NOT assume NSR — report to charge nurse.",
        priorities: ["Look for P-waves", "If none or inverted — it is NOT NSR"],
        keyActions: ["Get charge nurse to verify rhythm", "Assess patient symptoms", "Document findings"],
        examFocus: "If the question shows a regular rhythm at 72 BPM with no upright P-waves — this is AJR, not NSR.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "junctional_rhythm",
        compareWithName: "Junctional Rhythm",
        keyDifferences: [
          { feature: "Rate", thisRhythm: "61–100 BPM", otherRhythm: "40–60 BPM" },
          { feature: "Mechanism", thisRhythm: "ENHANCED AV automaticity (above normal junctional rate)", otherRhythm: "ESCAPE — AV node fires because SA node fails" },
          { feature: "Clinical urgency", thisRhythm: "Usually benign, treat the cause", otherRhythm: "Indicates SA node failure — more urgent" },
          { feature: "Treatment", thisRhythm: "Rarely needed", otherRhythm: "Treat cause; may need pacing if haemodynamically compromised" },
        ],
        clinicalImplication: "Rate distinguishes accelerated (enhanced) from escape (backup). The mechanism matters: AJR is enhanced automaticity; junctional rhythm is a safety escape.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "medication_effect",
        title: "Post-MI Day 2 — Regular Rhythm Replacing AF",
        clinicalContext: "Patient admitted for inferior STEMI. Previously in AF, now rhythm shows regular narrow QRS at 74 BPM.",
        patientPresentation: "Asymptomatic. No clear P-waves on telemetry. 12-lead shows no upright P-waves in any lead.",
        keyDecisionPoint: "Is this NSR restoring after cardioversion/reperfusion or AJR? What is the clinical implication?",
        learnerObjective: "Identify AJR from absent P-waves; recognise as a reperfusion rhythm (benign); confirm with 12-lead and notify provider.",
      },
    ],
  },

  // ── 1st Degree AV Block ───────────────────────────────────────────────────────
  {
    rhythmKey: "first_degree_av_block",
    rhythmName: "First-Degree AV Block",
    recognition: {
      rate: "60–100 BPM (rate of the underlying rhythm)",
      regularity: "Regular",
      pWaves: "Present, upright, one before every QRS",
      prInterval: "> 0.20s (> 200ms) — PROLONGED; constant",
      qrsWidth: "Narrow (< 0.12s)",
      keyFeatures: [
        "PR interval > 0.20s (5 small squares on standard ECG paper)",
        "Every P conducts to QRS — no dropped beats",
        "Constant PR interval — does not change",
        "All other features identical to NSR",
      ],
      pearls: [
        "First-degree block is a DELAY, not a block — every P still conducts",
        "No dropped beats distinguishes it from 2nd-degree blocks",
        "Commonly caused by: increased vagal tone, inferior MI, medications (beta-blockers, digoxin, CCBs), Lyme disease",
        "Usually benign — but monitor for progression to higher-degree block, especially in acute MI",
      ],
    },
    mechanism:
      "The AV node takes longer than normal (> 200ms) to conduct each atrial impulse to the ventricles. This could reflect enhanced parasympathetic tone, AV nodal ischaemia (inferior MI/RCA territory), medication effects, or intrinsic conduction disease. All impulses eventually conduct — the delay is prolonged but complete conduction occurs.",
    conductionPath:
      "SA node → atria (P-wave) → AV node (PROLONGED delay > 200ms) → His-Purkinje → ventricles (narrow QRS). Every P conducts.",
    whyStripLooksThisWay:
      "The prolonged AV delay means the P-wave appears further before the QRS than normal. Since all P-waves conduct, the PR is uniformly prolonged but constant. The QRS is narrow because once the impulse exits the AV node, ventricular conduction is normal.",
    hemodynamicImpact: {
      cardiacOutput: "normal",
      cardiacOutputRationale: "Every P conducts to a QRS. AV synchrony is maintained. CO is normal.",
      bloodPressureEffect: "normal",
      perfusionStatus: "Normal.",
      expectedSymptoms: ["Asymptomatic — 1st degree block itself causes no symptoms"],
      hemodynamicallyStagable: false,
    },
    clinicalPresentation: {
      stable: ["Asymptomatic — incidental ECG finding"],
      unstable: ["1st degree block alone does not cause instability"],
      redFlags: [
        "New 1st degree block in inferior MI (watch for progression to 2nd or 3rd degree)",
        "PR > 0.30s — significantly prolonged",
        "PR interval increasing over serial ECGs",
      ],
      emergencyTriggers: ["Progression to 2nd or 3rd degree block in the setting of inferior MI"],
    },
    escalation: {
      defaultLevel: "monitor",
      monitoringFrequency: "Routine; if new in acute MI, continuous with trending",
      immediateAssessments: [
        "Confirm PR > 0.20s on 12-lead ECG",
        "Review medications causing AV node delay",
        "Check for inferior MI (12-lead, troponin, symptoms)",
        "Serial PR interval trending in acute MI patients",
      ],
      notifyProviderWhen: [
        "New 1st degree block in the setting of acute MI",
        "PR interval > 0.30s",
        "PR progressively increasing (early Wenckebach pattern)",
      ],
      rapidResponseWhen: ["Progression to haemodynamically significant 2nd or 3rd degree block"],
      codeBlueWhen: [],
      interventionContraindications: [
        "Do NOT treat isolated 1st degree block with atropine or pacing",
        "Do NOT add AV-nodal-blocking medications if 1st degree block is present without review",
      ],
    },
    examTraps: {
      nclex: [
        "1st degree block requires monitoring, NOT treatment",
        "Do not confuse with 2nd degree block — in 1st degree, EVERY P conducts",
        "A PR interval of 0.22s is 1st degree block — do not call it normal",
        "The priority action for isolated 1st degree block is monitoring, not provider notification (unless new in MI context)",
      ],
      telemetry: [
        "Count the PR interval in small squares: > 5 small squares (> 200ms) = 1st degree block",
        "Distinguish from Wenckebach: 1st degree has CONSTANT prolonged PR; Wenckebach has CHANGING PR",
      ],
    },
    professionViews: {
      rn: {
        focus: "Recognise, document, and monitor for progression — 1st degree block requires no acute intervention.",
        priorities: ["Measure PR interval on 12-lead ECG", "Identify any risk factors for progression (inferior MI)", "Document baseline"],
        keyActions: [
          "Obtain 12-lead ECG",
          "Document PR interval measurement",
          "Monitor for increasing PR or dropped beats",
          "Notify provider only if new in MI context or PR > 0.30s",
        ],
        examFocus: "1st degree = PR > 0.20s, every P conducts, NO treatment. Monitoring only.",
      },
      rpn: {
        focus: "Recognise prolonged PR interval and report to RN for clinical context evaluation.",
        priorities: ["Identify PR > 0.20s", "Escalate to RN for clinical interpretation"],
        keyActions: ["Report finding to RN", "Obtain 12-lead ECG if available"],
      },
      np: {
        focus: "Identify the cause, determine if further workup is needed, and monitor for progression.",
        priorities: [
          "Confirm PR measurement on 12-lead ECG",
          "Review medication list — beta-blockers, CCBs, digoxin commonly cause 1st degree block",
          "Consider Lyme disease in endemic areas + new 1st degree block",
          "Monitor in acute MI patients for progression",
        ],
        keyActions: [
          "Hold or adjust offending medications if clinically appropriate",
          "Lyme serology if indicated",
          "Serial 12-lead ECGs if new in MI context",
        ],
        examFocus: "NP: 1st degree block from Lyme disease is an important — and often tested — clinical scenario.",
      },
      rt: {
        focus: "1st degree block has no respiratory implications — note as baseline rhythm finding.",
        priorities: ["Document as part of clinical baseline"],
        keyActions: ["No specific respiratory intervention required"],
      },
      newGrad: {
        focus: "PR > 0.20s = 1st degree block. Monitor, document, no treatment needed alone.",
        priorities: ["Measure the PR interval", "Is it constant and just prolonged?"],
        keyActions: ["Document and report to charge nurse if new", "No medication intervention needed for isolated 1st degree block"],
        examFocus: "1st degree = observation. The exam will try to trick you into giving atropine. Do not.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "second_degree_type_i_av_block",
        compareWithName: "Wenckebach (Mobitz I)",
        keyDifferences: [
          { feature: "PR interval", thisRhythm: "Prolonged but CONSTANT", otherRhythm: "Progressively INCREASING until dropped beat" },
          { feature: "Dropped beats", thisRhythm: "None — every P conducts", otherRhythm: "QRS dropped after longest PR" },
          { feature: "Treatment", thisRhythm: "Monitoring only", otherRhythm: "May require treatment if symptomatic" },
          { feature: "Severity", thisRhythm: "Benign delay", otherRhythm: "2nd degree block — more significant" },
        ],
        clinicalImplication: "1st degree is a delay; Wenckebach is a partial block with dropped beats. The constant PR in 1st degree vs progressive prolongation in Wenckebach is the key.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "medication_effect",
        title: "New PR Prolongation After Beta-Blocker Uptitration",
        clinicalContext: "Patient admitted for heart failure. Metoprolol succinate dose doubled 2 days ago. New 12-lead shows PR 0.24s.",
        patientPresentation: "Asymptomatic. HR 58 regular. PR was 0.18s prior to dose change.",
        keyDecisionPoint: "Is this clinically significant? Does the metoprolol need to be held?",
        learnerObjective: "Identify medication-induced 1st degree block, determine that isolated 1st degree block is not a reason to hold HF medication without cardiology guidance, and monitor for progressive prolongation.",
      },
    ],
  },

  // ── Wenckebach (Mobitz I) ────────────────────────────────────────────────────
  {
    rhythmKey: "second_degree_type_i_av_block",
    rhythmName: "Second-Degree AV Block — Mobitz I (Wenckebach)",
    recognition: {
      rate: "40–90 BPM (ventricular rate); atrial rate regular",
      regularity: "Regularly irregular — group beating pattern",
      pWaves: "Present, regular P-P interval; progressively closer to QRS before dropped beat",
      prInterval: "PROGRESSIVELY LENGTHENS until one QRS is dropped — then cycle resets",
      qrsWidth: "Narrow (< 0.12s)",
      keyFeatures: [
        "Progressive PR lengthening → dropped QRS → cycle resets",
        "Regular P-waves (P-P interval constant)",
        "Narrow QRS",
        "Group beating pattern: R-R intervals shorten before the pause",
        "Pause is less than twice the shortest R-R interval",
      ],
      pearls: [
        "The classic Wenckebach pattern: PR gets longer and longer and longer until a beat is DROPPED",
        "R-R intervals actually SHORTEN within each group (even though PR is lengthening) — because each increment of PR prolongation is smaller",
        "The P-P interval is CONSTANT — the atria are firing regularly; it is the AV node that is failing progressively",
        "Wenckebach is a NODAL block — usually above the Bundle of His; better prognosis than Mobitz II",
      ],
    },
    mechanism:
      "With each successive beat, the AV node's conduction time increases slightly, reflected in the progressively lengthening PR interval. Eventually the AV node cannot conduct at all and one QRS is dropped. The pause allows the AV node to recover, and the cycle begins again. This progressive fatigue-then-recovery pattern is the hallmark of Wenckebach phenomenon, which occurs in the AV node itself (nodal/supraHisian block) — not in the bundle branches.",
    conductionPath:
      "SA node (regular) → AV node (progressively delayed conduction → eventually blocked) → Beat dropped → AV node recovers → next P conducts with shortest PR → cycle repeats",
    whyStripLooksThisWay:
      "The PR visibly lengthens beat by beat within each group. The QRS drops suddenly (no QRS after the P-wave). Then the PR resets to its shortest value. The group beating pattern creates a characteristic clustering of QRS complexes. R-R intervals within a group are shorter than they appear (because PR increments get smaller with each beat).",
    hemodynamicImpact: {
      cardiacOutput: "mildly_reduced",
      cardiacOutputRationale: "Occasional dropped beats reduce ventricular rate mildly. The narrow QRS preserves ventricular contractility. CO reduction is usually well-tolerated.",
      bloodPressureEffect: "normal",
      perfusionStatus: "Usually adequate. Symptomatic hypoperfusion is uncommon unless the dropped-beat ratio is high.",
      expectedSymptoms: [
        "Often asymptomatic",
        "Dizziness or light-headedness (from the pause at the dropped beat)",
        "Fatigue",
        "Near-syncope (rarely)",
      ],
      hemodynamicallyStagable: true,
    },
    clinicalPresentation: {
      stable: [
        "Asymptomatic with adequate ventricular rate",
        "Mild dizziness that self-resolves",
        "Often associated with inferior MI or medication effects",
      ],
      unstable: [
        "Wenckebach with high dropped-beat ratio (3:1 or 2:1) causing slow ventricular rate with symptoms",
        "Symptomatic hypotension or near-syncope",
      ],
      redFlags: [
        "Wenckebach in inferior MI (RCA territory involvement)",
        "Increasing ratio of dropped beats",
        "Wenckebach with haemodynamic compromise",
        "Wenckebach progressing to higher-degree block",
      ],
      emergencyTriggers: [
        "Progression to 3rd degree block",
        "Wenckebach with haemodynamic instability requiring pacing",
      ],
    },
    escalation: {
      defaultLevel: "notify_provider",
      monitoringFrequency: "Continuous; document group ratios (3:2, 4:3, etc.)",
      immediateAssessments: [
        "Confirm Wenckebach pattern on 12-lead ECG",
        "Assess for inferior MI (inferior ST changes, troponin)",
        "Identify medication causes (beta-blockers, digoxin, CCBs)",
        "Assess patient symptoms and haemodynamics",
      ],
      notifyProviderWhen: [
        "Any new 2nd degree block identification",
        "Associated with inferior MI",
        "Increasing ratio of dropped beats",
        "Patient symptomatic",
      ],
      rapidResponseWhen: [
        "Wenckebach with haemodynamic compromise",
        "Progression to 3rd degree block",
        "Ventricular rate < 40 with symptoms",
      ],
      codeBlueWhen: ["Progression to cardiac arrest"],
      interventionContraindications: [
        "Do NOT give atropine without provider order",
        "Do NOT add AV-nodal blockers to a patient already in Wenckebach",
        "Wenckebach rarely requires permanent pacing — temporary pacing only if symptomatic and haemodynamically compromised",
      ],
    },
    examTraps: {
      nclex: [
        "Wenckebach is NODAL (above Bundle of His) — better prognosis than Mobitz II which is infranodal",
        "The priority differentiator from Mobitz II: progressive PR lengthening (Wenckebach) vs constant PR before sudden drop (Mobitz II)",
        "Wenckebach rarely requires permanent pacing — Mobitz II often does",
        "Atropine may help Wenckebach (AV node responds) but is less effective in Mobitz II (infranodal)",
      ],
      telemetry: [
        "Look at the P-P interval first — it should be CONSTANT in both Mobitz I and II",
        "Then look at PR: CHANGING = Mobitz I; CONSTANT = Mobitz II",
        "The pause should be less than 2× the normal R-R interval in Wenckebach",
      ],
    },
    professionViews: {
      rn: {
        focus: "Document the group pattern, identify the ratio, assess for inferior MI, and notify provider.",
        priorities: [
          "Confirm progressive PR lengthening with dropped beats",
          "Document the conduction ratio (e.g., 4:3, 3:2)",
          "Assess for inferior MI signs",
          "Patient symptoms and BP",
        ],
        keyActions: [
          "Obtain 12-lead ECG",
          "Continuous monitoring with notation of rhythm changes",
          "Notify provider",
          "Prepare IV access and atropine in case needed",
        ],
        examFocus: "Wenckebach = progressive PR + dropped beat. Distinguish from Mobitz II (constant PR + sudden drop). Wenckebach = better prognosis.",
      },
      rpn: {
        focus: "Recognise the group beating pattern and escalate to RN.",
        priorities: ["Identify irregular grouped rhythm", "Escalate to RN immediately"],
        keyActions: ["Notify RN", "Obtain vital signs", "Do not administer medications"],
      },
      np: {
        focus: "Confirm level of block (nodal vs infranodal), identify cause, determine if intervention is required.",
        priorities: [
          "12-lead ECG: narrow QRS + progressive PR = Wenckebach (nodal)",
          "Wide QRS + variable PR = consider infranodal block",
          "Identify cause: inferior MI, medication, Lyme, myocarditis",
          "Rarely requires permanent pacing — reassess if symptomatic",
        ],
        keyActions: [
          "Treat reversible causes",
          "Continuous monitoring for progression",
          "Temporary pacing only if symptomatic and haemodynamically compromised",
          "EP referral for unexplained persistent Wenckebach",
        ],
        examFocus: "NP boards: Wenckebach = AV node (nodal); Mobitz II = infranodal. Only Mobitz II reliably requires pacing.",
      },
      rt: {
        focus: "The intermittent pause may cause brief drops in oxygenation delivery — monitor SpO2.",
        priorities: ["Monitor SpO2 for changes correlating with pauses"],
        keyActions: ["Notify team of SpO2 drops during pauses"],
      },
      newGrad: {
        focus: "PR getting longer and longer until a beat drops, then starts over. Group pattern. Go to the bedside and report.",
        priorities: ["Can you see the PR getting longer?", "Is there a pause (dropped beat)?", "Assess patient symptoms"],
        keyActions: ["Get vital signs", "Notify charge nurse immediately", "Continuous monitoring"],
        examFocus: "Wenckebach: longer longer longer PAUSE reset. Mobitz II: constant constant PAUSE. Same PR = Mobitz II.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "second_degree_type_ii_av_block",
        compareWithName: "Mobitz II",
        keyDifferences: [
          { feature: "PR before dropped beat", thisRhythm: "PROGRESSIVE LENGTHENING", otherRhythm: "CONSTANT (no change)" },
          { feature: "Level of block", thisRhythm: "AV node (nodal — supraHisian)", otherRhythm: "Bundle of His / bundle branches (infranodal)" },
          { feature: "QRS width", thisRhythm: "Narrow", otherRhythm: "Often wide (associated bundle branch block)" },
          { feature: "Risk of progression to 3rd degree", thisRhythm: "Lower", otherRhythm: "HIGH — can progress suddenly to complete heart block" },
          { feature: "Pacing requirement", thisRhythm: "Rarely needed unless symptomatic", otherRhythm: "Almost always requires pacing" },
          { feature: "Atropine efficacy", thisRhythm: "May help (nodal block)", otherRhythm: "Usually ineffective or may worsen" },
        ],
        clinicalImplication: "This is the most important AV block distinction on every nursing and medical exam. Mobitz II requires pacing. Wenckebach usually does not. Misidentifying Mobitz II as Wenckebach can cost a patient their life.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "deterioration",
        title: "Inferior STEMI Complication: Wenckebach → 3rd Degree Block",
        clinicalContext: "Patient admitted with inferior STEMI (RCA occlusion). Telemetry shows Wenckebach pattern at 4:3. 30 minutes later, the pattern changes.",
        patientPresentation: "HR drops to 32 BPM, P-waves and QRS now march independently. BP falls to 78/50. Patient becomes diaphoretic.",
        keyDecisionPoint: "What has happened and what is the immediate priority intervention?",
        learnerObjective: "Identify Wenckebach → complete heart block progression; initiate transcutaneous pacing while notifying physician for transvenous pacing preparation.",
      },
    ],
  },

  // ── Mobitz II ────────────────────────────────────────────────────────────────
  {
    rhythmKey: "second_degree_type_ii_av_block",
    rhythmName: "Second-Degree AV Block — Mobitz II",
    recognition: {
      rate: "30–80 BPM",
      regularity: "Regularly irregular — pauses at fixed intervals",
      pWaves: "Regular P-P interval; some P-waves conduct and some do not",
      prInterval: "CONSTANT PR on conducted beats — no progressive change; then sudden dropped QRS",
      qrsWidth: "0.08–0.14s; often wide (associated bundle branch block in infranodal location)",
      keyFeatures: [
        "Constant PR interval on conducted beats",
        "Sudden abrupt QRS dropped without prior PR change",
        "Non-conducted P-wave visible in the pause (the P-wave is there; no QRS follows it)",
        "QRS is often wide (associated BBB due to infranodal block location)",
      ],
      pearls: [
        "The most dangerous 2nd degree block — can progress to complete heart block WITHOUT WARNING",
        "Requires urgent pacing consultation even when asymptomatic",
        "The non-conducted P-wave IS visible in the pause (distinguish from a pause without P-waves)",
        "In a 2:1 block ratio, it is IMPOSSIBLE to determine Mobitz I vs II by rhythm strip alone — need clinical context and QRS width",
      ],
    },
    mechanism:
      "The block occurs below the AV node — in the Bundle of His or bundle branches (infranodal). The AV node conducts without fatigue (PR stays constant), but one or more bundle branch bundles suddenly fail to conduct an impulse. Because this block is below the AV node, the His-Purkinje system is often diseased — hence the frequently wide QRS. The block can progress to complete heart block suddenly, without the warning of progressive PR lengthening seen in Wenckebach.",
    conductionPath:
      "SA node → AV node (NORMAL conduction, constant PR) → Bundle of His / bundle branches (BLOCKED at fixed intervals) → some beats conduct to ventricles (wide or narrow QRS), others do not (P-wave without QRS in the pause)",
    whyStripLooksThisWay:
      "The P-waves are regular and the PR interval is constant on all conducted beats — the AV node is fine. The dropped QRS occurs because the infranodal system suddenly fails to conduct. The non-conducted P-wave is visible in the pause because the SA node and AV node continue firing normally — only the bundle branch/His level block prevents the QRS.",
    hemodynamicImpact: {
      cardiacOutput: "moderately_reduced",
      cardiacOutputRationale: "Dropped beats reduce the effective ventricular rate. If block ratio is 2:1 (every other beat dropped), the ventricular rate is halved. Combined with the slow escape rate of the infranodal pacemaker, CO may be significantly reduced.",
      bloodPressureEffect: "variable",
      perfusionStatus: "Often inadequate at high block ratios. Sudden complete block can cause immediate haemodynamic collapse.",
      expectedSymptoms: [
        "Dizziness or near-syncope during pauses",
        "Syncope (Adams-Stokes attacks) from sudden complete block",
        "Fatigue",
        "Dyspnoea",
        "Chest pain (if underlying MI is the cause)",
      ],
      hemodynamicallyStagable: true,
    },
    clinicalPresentation: {
      stable: [
        "3:1 or 4:1 block maintaining adequate ventricular rate",
        "Asymptomatic at presentation",
        "Chronic infranodal conduction disease",
      ],
      unstable: [
        "2:1 block with slow ventricular rate and hypotension",
        "Sudden complete block causing syncope",
        "Mobitz II in setting of acute anterior MI (extremely high risk)",
      ],
      redFlags: [
        "ANY Mobitz II in the setting of anterior MI (LAD territory) — pacing required urgently",
        "Increasing ratio of dropped beats (2:1 block)",
        "Any syncopal episode associated with Mobitz II",
        "Wide QRS Mobitz II (more advanced infranodal disease)",
      ],
      emergencyTriggers: [
        "Progression to 3rd degree block with haemodynamic collapse",
        "Syncope from Mobitz II",
        "2:1 Mobitz II with hypotension",
      ],
    },
    escalation: {
      defaultLevel: "notify_provider",
      monitoringFrequency: "Continuous; document block ratio and QRS width",
      immediateAssessments: [
        "Confirm CONSTANT PR interval on conducted beats (distinguishes from Wenckebach)",
        "Measure QRS width — wide QRS indicates infranodal disease",
        "12-lead ECG STAT",
        "Assess for anterior MI (LAD territory — Mobitz II + anterior STEMI = immediate pacing need)",
        "Vital signs and LOC assessment",
      ],
      notifyProviderWhen: [
        "ANY Mobitz II identification — this is always an urgent call",
        "Increasing block ratio",
        "Any change in patient symptoms",
        "Newly identified in anterior MI context",
      ],
      rapidResponseWhen: [
        "Mobitz II with haemodynamic compromise",
        "Syncope associated with Mobitz II",
        "Any widening of QRS or increasing block ratio",
      ],
      codeBlueWhen: [
        "Progression to complete heart block with cardiac arrest",
        "Sudden collapse from complete block",
      ],
      interventionContraindications: [
        "Do NOT give atropine as the primary treatment — atropine is usually ineffective for infranodal block and may paradoxically worsen block",
        "If atropine is given and worsens block — proceed immediately to transcutaneous pacing",
        "Do NOT delay pacing consultation while awaiting medication trial in anterior MI with Mobitz II",
      ],
    },
    examTraps: {
      nclex: [
        "Mobitz II ALWAYS requires a pacing consultation — even when asymptomatic",
        "The key distinction from Wenckebach: constant PR before drop (Mobitz II) vs progressive PR lengthening (Wenckebach)",
        "Atropine is first-line ACLS treatment for bradycardia but may be INEFFECTIVE for Mobitz II — pacing is the priority",
        "Mobitz II in anterior MI = emergency — pacemaker insertion, not watchful waiting",
      ],
      interventionTraps: [
        "Atropine may worsen Mobitz II by increasing the atrial rate without improving infranodal conduction — more P-waves attempting to conduct with an already-diseased bundle",
        "Temporary transcutaneous pacing while preparing transvenous pacing is the correct stepwise approach",
      ],
      telemetry: [
        "Count the P-waves in a pause: if there is ONE P-wave without a QRS, this is a 2:1 block or dropped beat — identify if the PR was constant on the previous conducted beat",
        "2:1 block ratio: alternating P-QRS and P-only pattern — cannot reliably distinguish Mobitz I from II without looking at PR variability across multiple cycles",
      ],
    },
    professionViews: {
      rn: {
        focus: "Mobitz II is always urgent — constant PR + dropped beats = call the provider immediately.",
        priorities: [
          "Confirm constant PR on conducted beats",
          "Assess patient symptoms",
          "Obtain 12-lead ECG",
          "Prepare transcutaneous pacemaker",
        ],
        keyActions: [
          "Notify provider IMMEDIATELY",
          "Continuous ECG monitoring",
          "Establish or confirm IV access",
          "Prepare transcutaneous pacing pads",
          "Atropine 0.5mg IV on hand but know it may not work",
        ],
        examFocus: "NCLEX: Mobitz II = immediate notification and pacing readiness. It is never a 'monitor and reassess' situation.",
      },
      rpn: {
        focus: "Recognise constant PR with sudden dropped beats and escalate to RN as an emergency.",
        priorities: ["Identify non-progressive PR with pause", "Escalate to RN IMMEDIATELY"],
        keyActions: ["Stay with patient", "Notify RN", "Obtain vital signs", "Do not leave patient unattended"],
      },
      np: {
        focus: "Mobitz II = infranodal block = pacing indication. Identify the cause and arrange pacing.",
        priorities: [
          "Confirm infranodal location: wide QRS, constant PR",
          "Rule out anterior MI (urgent if present)",
          "Arrange cardiology/EP consultation immediately",
          "Initiate temporary pacing if symptomatic",
        ],
        keyActions: [
          "Transcutaneous pacing for symptomatic or haemodynamically compromised patient",
          "Urgent cardiology referral for transvenous pacing",
          "Permanent pacemaker if persistent Mobitz II",
          "Do NOT wait for symptoms if anterior MI is the cause",
        ],
        examFocus: "NP boards: Mobitz II = infranodal = permanent pacing indication by ACC/AHA guidelines.",
      },
      rt: {
        focus: "Haemodynamic compromise from Mobitz II will affect oxygenation delivery — ensure adequate monitoring.",
        priorities: ["Monitor SpO2", "Assess respiratory rate for compensatory changes"],
        keyActions: ["Support oxygenation", "Notify team immediately of SpO2 or work-of-breathing changes"],
      },
      newGrad: {
        focus: "Constant PR and then a dropped beat: this is always an emergency notification — not a wait-and-see.",
        priorities: ["Is the PR constant before the pause? Check every conducted beat", "Get to the patient and notify the charge nurse NOW"],
        keyActions: [
          "Do not leave the patient",
          "Call for your charge nurse immediately",
          "Get vital signs",
          "Be ready to apply transcutaneous pacing pads",
        ],
        examFocus: "Mobitz II is the most dangerous AV block. Constant PR + sudden drop = call immediately. Never treat with observation.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "second_degree_type_i_av_block",
        compareWithName: "Wenckebach (Mobitz I)",
        keyDifferences: [
          { feature: "PR interval before drop", thisRhythm: "CONSTANT — no change", otherRhythm: "PROGRESSIVELY LENGTHENS" },
          { feature: "Location of block", thisRhythm: "INFRANODAL (His bundle / branch blocks)", otherRhythm: "AV node (nodal)" },
          { feature: "QRS width", thisRhythm: "Often wide (bundle branch disease)", otherRhythm: "Usually narrow" },
          { feature: "Risk of complete block", thisRhythm: "HIGH — can progress suddenly", otherRhythm: "Lower — gradual progression" },
          { feature: "Pacing requirement", thisRhythm: "YES — almost always", otherRhythm: "Rarely — only if symptomatic" },
          { feature: "Atropine efficacy", thisRhythm: "Usually NOT effective", otherRhythm: "May help" },
        ],
        clinicalImplication: "This is the distinction that determines whether a patient needs a pacemaker. Getting it wrong in an anterior MI context can lead to sudden complete heart block and death.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "deterioration",
        title: "Mobitz II During Anterior STEMI",
        clinicalContext: "Patient with anterior STEMI in the CCU, awaiting PCI. Telemetry shows wide QRS Mobitz II with 3:1 block.",
        patientPresentation: "HR 42 BPM, BP 90/58, alert but dizzy. QRS 0.14s. Constant PR on conducted beats.",
        keyDecisionPoint: "Atropine first or transcutaneous pacing? What is the danger of waiting?",
        learnerObjective: "Recognise Mobitz II in anterior MI as a pacing emergency; understand that atropine is unlikely to help and may worsen block; initiate transcutaneous pacing and notify cardiology.",
      },
    ],
  },

];
