/**
 * ECG Simulation Expansions — Content Sprint 1
 *
 * Promotes 21 partial simulations to complete status.
 * Imported by ecg-simulation-catalog.ts to override skeleton entries.
 *
 * Priority selection rationale:
 *   RN:      CHB pacing, torsades, SVT vagal, Wenckebach, WPW AFib
 *   RPN:     Bradycardia symptoms, known AFib monitoring, code assist,
 *            chest pain escalation, PVC notification
 *   NP:      STEMI orders, stable VT amiodarone, AFib CHA₂DS₂-VASc,
 *            Mobitz II pacing decision, post-ROSC management
 *   RT:      Tension pneumo/PEA, cardiac arrest ACLS team role,
 *            ventilator-induced bradycardia
 *   New Grad: When to run, rapid response activation, code blue first time
 */

import type { EcgSimulationRecord } from "@/lib/ecg-module/ecg-simulation-schema";

export const ECG_SIMULATION_EXPANSIONS: ReadonlyArray<EcgSimulationRecord> = [

  // ══════════════════════════════════════════════════════════════════════
  // RN EXPANSIONS
  // ══════════════════════════════════════════════════════════════════════

  {
    id: "ecg-rn-bradycardia-chb",
    title: "Complete Heart Block — Emergency Transcutaneous Pacing",
    summary: "A 72-year-old develops syncope and complete heart block with ventricular rate 32 BPM. Navigate the atropine decision, apply transcutaneous pacing, confirm mechanical capture, and document the event.",
    publishStatus: "published",
    targetProfessions: ["RN"],
    environment: {
      specialty: "telemetry",
      unitLabel: "Cardiac Telemetry — 3A",
      monitorContext: "bedside_monitor",
      timeOfDay: "night",
      staffingContext: "adequate",
    },
    patient: {
      age: 72,
      sex: "female",
      admissionDiagnosis: "Syncope evaluation — rule out cardiac cause",
      admissionReason: "Two witnessed syncopal episodes in the past week, each lasting 30–60 seconds",
      relevantHistory: ["HTN", "Type 2 diabetes", "COPD — mild", "No known cardiac history"],
      medications: ["Metformin 1000 mg BID", "Amlodipine 10 mg daily", "Atorvastatin 40 mg"],
      allergies: ["Sulfa — rash"],
      baselineRhythmKey: "sinus_bradycardia",
      baselineVitals: { hr: 58, sbp: 118, dbp: 76, spo2: 96, rr: 16, temp: 37.0 },
    },
    rhythmProgression: [
      {
        nodeId: "baseline-sinus-brady",
        rhythmKey: "sinus_bradycardia",
        onsetSeconds: 0,
        vitals: { hr: 58, sbp: 118, spo2: 96 },
        clinicalSigns: ["Patient sleeping — admitted earlier today", "1:1 P-to-QRS relationship on monitor", "Occasional near-syncope symptoms reported on history"],
        activeAlarms: [],
        riskLevel: "moderate",
        missableWarnings: ["PR interval slowly lengthening over 3 strips from 0.18s to 0.22s — progressive AV conduction disease"],
        transitions: [
          { targetNodeId: "wenckebach-transition", trigger: "no_action", label: "AV conduction worsens", scoreImpact: 0 },
          { targetNodeId: "wenckebach-transition", trigger: "incorrect_action", label: "Alarm silenced — AV block progresses undetected", scoreImpact: -2 },
        ],
      },
      {
        nodeId: "wenckebach-transition",
        rhythmKey: "second_degree_type_i_av_block",
        onsetSeconds: 60,
        vitals: { hr: 44, sbp: 108, spo2: 95 },
        clinicalSigns: ["Monitor shows progressive PR lengthening followed by a dropped QRS every 4th beat", "Patient arouses to voice — 'I feel a little lightheaded'", "HR irregular — effectively 44 BPM"],
        activeAlarms: ["Heart rate low — 44"],
        riskLevel: "high",
        missableWarnings: [
          "Wenckebach progressing: PR is already at 0.28s and increasing — next progression may be Mobitz II or CHB",
          "Lightheadedness signals inadequate cerebral perfusion at this rate",
          "RN delay in provider notification allows further AV node ischemia",
        ],
        transitions: [
          { targetNodeId: "chb-unstable", trigger: "no_action", label: "AV block progresses to CHB without intervention", scoreImpact: -2 },
          { targetNodeId: "chb-managed", trigger: "correct_action", label: "Provider notified, cardiology at bedside, pacing pads applied", scoreImpact: 2 },
        ],
      },
      {
        nodeId: "chb-unstable",
        rhythmKey: "third_degree_av_block",
        onsetSeconds: 150,
        vitals: { hr: 32, sbp: 74, spo2: 92 },
        clinicalSigns: ["P waves marching at 68/min; QRS at 32/min — completely independent", "Patient pale, diaphoretic, responds to sternal rub only", "BP 74/48", "Carotid pulse weak, rate 32"],
        activeAlarms: ["Heart rate critical — 32", "Blood pressure critical low"],
        riskLevel: "life_threatening",
        missableWarnings: [],
        transitions: [
          { targetNodeId: "paced-capture", trigger: "correct_action", label: "Transcutaneous pacing initiated — electrical and mechanical capture confirmed", scoreImpact: 3 },
          { targetNodeId: "atropine-wasted", trigger: "incorrect_action", label: "Atropine given — no improvement (infranodal block)", scoreImpact: -1 },
          { targetNodeId: "asystole", trigger: "no_action", label: "No intervention — escape pacemaker fails", scoreImpact: -3 },
        ],
      },
      {
        nodeId: "paced-capture",
        rhythmKey: "paced_rhythm",
        onsetSeconds: 210,
        vitals: { hr: 70, sbp: 98, spo2: 95 },
        clinicalSigns: ["Paced QRS complexes at 70/min on monitor", "Carotid pulse palpable at 70 — mechanical capture confirmed", "BP improving to 98/62", "Patient opening eyes, responding to name"],
        activeAlarms: [],
        riskLevel: "high",
        missableWarnings: [],
        transitions: [],
      },
      {
        nodeId: "atropine-wasted",
        rhythmKey: "third_degree_av_block",
        onsetSeconds: 200,
        vitals: { hr: 34, sbp: 70, spo2: 91 },
        clinicalSigns: ["Atropine 0.5 mg given — no rate improvement", "Ventricular rate 34 — infranodal block does not respond to atropine", "Time lost waiting for drug effect"],
        activeAlarms: ["Heart rate critical"],
        riskLevel: "life_threatening",
        missableWarnings: [],
        transitions: [
          { targetNodeId: "paced-capture", trigger: "correct_action", label: "Transcutaneous pacing initiated after atropine failure", scoreImpact: 2 },
        ],
      },
      {
        nodeId: "chb-managed",
        rhythmKey: "third_degree_av_block",
        onsetSeconds: 120,
        vitals: { hr: 38, sbp: 88, spo2: 94 },
        clinicalSigns: ["Cardiology at bedside with pads ready", "BP 88/56 — marginal but stable", "Patient alert, talking"],
        activeAlarms: ["Heart rate low"],
        riskLevel: "high",
        missableWarnings: [],
        transitions: [
          { targetNodeId: "paced-capture", trigger: "correct_action", label: "Transcutaneous pacing applied", scoreImpact: 2 },
        ],
      },
      {
        nodeId: "asystole",
        rhythmKey: "asystole",
        onsetSeconds: 240,
        vitals: { hr: 0, sbp: 0, spo2: 0 },
        clinicalSigns: ["Escape pacemaker failed", "Flatline on monitor", "Patient unresponsive, no pulse"],
        activeAlarms: ["CODE ALARM"],
        riskLevel: "life_threatening",
        missableWarnings: [],
        transitions: [],
      },
    ],
    decisionPoints: [
      {
        atNodeId: "chb-unstable",
        decisionType: "escalation",
        stem: "The patient is now in complete heart block with HR 32, BP 74/48, and is responding only to sternal rub. What is the MOST appropriate immediate intervention?",
        ngnFormat: "mcq",
        options: [
          {
            id: "a",
            text: "Apply transcutaneous pacing pads and initiate pacing at 60–80 BPM",
            correct: true,
            consequenceNodeId: "paced-capture",
            rationale: "Hemodynamically unstable CHB (HR 32, BP 74/48, altered mentation) requires immediate transcutaneous pacing. This is the definitive bridging intervention before transvenous pacing can be arranged.",
          },
          {
            id: "b",
            text: "Administer atropine 0.5 mg IV and repeat every 3 minutes to a maximum of 3 mg",
            correct: false,
            consequenceNodeId: "atropine-wasted",
            rationale: "Atropine accelerates the SA node but NOT the infranodal conduction system. CHB is typically infranodal — atropine produces no improvement in ventricular rate and wastes precious minutes.",
            safetyFlag: "SAFETY FLAG: Atropine for infranodal CHB is ineffective. Do not delay pacing waiting for drug effect.",
          },
          {
            id: "c",
            text: "Start a dopamine infusion at 5 mcg/kg/min to support heart rate and blood pressure",
            correct: false,
            consequenceNodeId: "chb-unstable",
            rationale: "Dopamine may provide some chronotropic support but is not the definitive treatment for CHB and requires IV access, mixing, and titration — pacing is faster and more reliable in this emergency.",
          },
          {
            id: "d",
            text: "Call for a 12-lead ECG and await cardiology consultation before initiating treatment",
            correct: false,
            consequenceNodeId: "asystole",
            rationale: "A 12-lead ECG delays pacing. The bedside rhythm strip is sufficient to diagnose CHB. Awaiting consultation while the patient has BP 74/48 risks progression to asystole.",
            safetyFlag: "SAFETY FLAG: Diagnostic delay in hemodynamically unstable CHB.",
          },
        ],
        timeLimitSeconds: 60,
      },
      {
        atNodeId: "paced-capture",
        decisionType: "recognition",
        stem: "After setting the pacemaker to 70 BPM at 60 mA, the ECG shows paced QRS complexes. The nurse must verify capture. Which finding CONFIRMS mechanical capture?",
        ngnFormat: "mcq",
        options: [
          {
            id: "a",
            text: "A paced QRS complex appears after every pacemaker spike on the ECG",
            correct: false,
            consequenceNodeId: "paced-capture",
            rationale: "This is ELECTRICAL capture — a necessary but not sufficient condition. Electrical capture (QRS on ECG) does not guarantee the ventricles are actually contracting and producing cardiac output.",
          },
          {
            id: "b",
            text: "A palpable carotid or femoral pulse at the paced rate of 70 BPM",
            correct: true,
            consequenceNodeId: "paced-capture",
            rationale: "MECHANICAL capture = the electrical stimulus produces actual ventricular contraction and blood ejection, confirmed by a palpable pulse at the paced rate. This is the definitive confirmation of effective pacing.",
          },
          {
            id: "c",
            text: "The patient's BP improves on the next automated reading",
            correct: false,
            consequenceNodeId: "paced-capture",
            rationale: "BP improvement supports mechanical capture but automated cuffs cycle every 2–5 minutes — you need immediate confirmation at the bedside, not a wait for the next reading.",
          },
          {
            id: "d",
            text: "The pacemaker threshold meter shows 60 mA delivered",
            correct: false,
            consequenceNodeId: "paced-capture",
            rationale: "The mA reading confirms energy delivery but not myocardial response. You must verify the patient's pulse.",
          },
        ],
      },
    ],
    documentationTasks: [
      {
        id: "chb-escalation-doc",
        atNodeId: "chb-unstable",
        taskType: "escalation_documentation",
        prompt: "Document the rhythm change and nursing interventions in the nursing note. Include: rhythm description, time, hemodynamic status, provider notifications, and pacing initiation.",
        requiredElements: [
          "Time of rhythm change to CHB",
          "Ventricular rate and description of AV dissociation",
          "Hemodynamic status (BP, symptoms) at time of identification",
          "Provider notification (name, time, response)",
          "Pacing pad application and activation",
          "Paced rate, mA, electrical capture confirmation",
          "Mechanical capture confirmed with pulse check",
        ],
        modelAnswer:
          "0223: Telemetry monitor alarming for new rhythm. At bedside immediately. " +
          "Rhythm: complete heart block — P waves marching independently at 68/min, " +
          "QRS at 32/min with no consistent P-to-QRS relationship. " +
          "VS: HR 32, BP 74/48, SpO₂ 92%, patient responsive to sternal rub only — pale, diaphoretic.\n\n" +
          "0223: Dr. [Name] called STAT — responded in 2 minutes. " +
          "Transcutaneous pacing pads applied anterior/posterior per standing protocol.\n\n" +
          "0225: Transcutaneous pacing initiated at 70 BPM, starting at 40 mA, " +
          "increased to 60 mA. Electrical capture confirmed (paced QRS after each spike). " +
          "Mechanical capture confirmed — carotid pulse palpable at 70 BPM.\n\n" +
          "0226: BP improving to 96/62. Patient opens eyes to voice, responds to name. " +
          "Cardiology (Dr. [Name]) notified — plans transvenous temporary pacemaker. " +
          "Monitoring q5 min. Patient and family informed of plan.",
      },
    ],
    debrief: {
      clinicalNarrative:
        "This simulation demonstrates the progression from Wenckebach (Mobitz I) to complete heart block " +
        "in a patient presenting with syncope. The key missed opportunity was the gradual PR interval " +
        "lengthening that preceded Wenckebach — a 10-minute earlier notification could have had cardiology " +
        "at the bedside before hemodynamic compromise. The critical clinical decisions were: (1) atropine " +
        "is largely ineffective for infranodal CHB — do not waste time; (2) transcutaneous pacing is the " +
        "correct bridging intervention; (3) electrical capture (QRS on ECG) is not the same as mechanical " +
        "capture (pulse at paced rate).",
      missedWarnings: [
        "PR interval lengthening from 0.18s to 0.22s over 3 strips — progressive AV conduction disease visible on telemetry",
        "Lightheadedness complaint correlated with HR 44 — early symptom of cerebral hypoperfusion",
        "Wenckebach in a patient presenting with syncope has a higher likelihood of progressing to CHB than in an asymptomatic patient",
      ],
      preventionOpportunities: [
        "Earlier provider notification when PR interval began lengthening and the patient reported lightheadedness",
        "Proactive transcutaneous pacing pad application at the Wenckebach stage in a high-risk patient",
        "12-lead ECG at the Wenckebach stage to better characterize the block level",
      ],
      learningObjectives: [
        "Recognize complete heart block by identifying independent P and QRS march-outs (AV dissociation)",
        "Understand that atropine is ineffective for infranodal CHB and does not substitute for pacing",
        "Apply transcutaneous pacing correctly: set rate 60–80 BPM, titrate mA until electrical capture, confirm mechanical capture with pulse check",
        "Document CHB event including rhythm description, hemodynamics, provider notification, pacing details, and capture confirmation",
      ],
      clinicalPearls: [
        "Electrical capture (paced QRS on ECG) ≠ mechanical capture (palpable pulse). Always pulse-check after pacing initiation.",
        "Atropine increases SA node rate but does NOT improve AV nodal or infranodal conduction. In infranodal CHB, atropine may paradoxically worsen the block.",
        "Walking out P waves across the entire strip is the key skill for CHB identification — they march at a different rate than QRS complexes.",
        "Wenckebach in a syncope patient is a warning of possible progression — treat it as an emergency until cardiology has assessed.",
      ],
      guidelineReferences: [
        "AHA ACLS Provider Manual 2020 — Bradycardia Algorithm",
        "Kusumoto FM et al. 2018 ACC/AHA/HRS Bradycardia Guideline",
      ],
    },
    primaryDomains: ["conduction_disorders", "rhythm_recognition"],
    estimatedMinutes: 22,
    difficulty: 4,
    requiresCodeBlueDecision: false,
    requiresStemiActivation: false,
    criticalSafetyDecisions: [
      "Atropine is ineffective for infranodal CHB — do not delay pacing",
      "Mechanical capture must be confirmed with pulse check, not ECG alone",
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "ecg-rn-torsades-magnesium",
    title: "Torsades de Pointes — QTc Identification and Magnesium Protocol",
    summary: "A 56-year-old on azithromycin develops polymorphic VT with axis twisting. Identify torsades, stop the offending drug, administer IV magnesium (NOT amiodarone), and recognize the defibrillation threshold for pulseless torsades.",
    publishStatus: "published",
    targetProfessions: ["RN"],
    environment: {
      specialty: "telemetry",
      unitLabel: "Medical Telemetry — 5B",
      monitorContext: "central_station",
      timeOfDay: "day",
      staffingContext: "adequate",
    },
    patient: {
      age: 56,
      sex: "female",
      admissionDiagnosis: "Community-acquired pneumonia — antibiotic therapy",
      admissionReason: "Hypoxia, fever 39.2°C, bilateral infiltrates — IV antibiotic course",
      relevantHistory: ["No known cardiac history", "Hypokalemia documented on previous admission 2 years ago"],
      medications: ["Azithromycin 500 mg IV daily (day 3)", "Ondansetron 4 mg IV q8h PRN", "Ceftriaxone 1g IV daily", "IV fluids at 75 mL/hr"],
      allergies: ["NKDA"],
      baselineRhythmKey: "normal_sinus_rhythm",
      baselineVitals: { hr: 88, sbp: 124, dbp: 78, spo2: 94, rr: 20, temp: 38.1 },
    },
    rhythmProgression: [
      {
        nodeId: "nsr-baseline",
        rhythmKey: "normal_sinus_rhythm",
        onsetSeconds: 0,
        vitals: { hr: 88, sbp: 124, spo2: 94 },
        clinicalSigns: ["Patient resting, on antibiotics", "On morning labs: K⁺ 3.1 mEq/L, Mg²⁺ 1.4 mg/dL — below normal"],
        activeAlarms: [],
        riskLevel: "moderate",
        missableWarnings: [
          "K⁺ 3.1 mEq/L on morning labs — hypokalemia is a major QTc-prolonging co-factor",
          "Mg²⁺ 1.4 mg/dL — low-normal, combined with azithromycin increases torsades risk significantly",
          "Azithromycin + ondansetron: two QTc-prolonging agents given concurrently",
          "QTc on most recent ECG was 478 ms — above 450 ms threshold in a woman",
        ],
        transitions: [
          { targetNodeId: "qtc-prolonged", trigger: "no_action", label: "QTc continues to lengthen — electrolytes unreplaced", scoreImpact: -1 },
          { targetNodeId: "nsr-prevented", trigger: "correct_action", label: "Provider notified, K⁺ and Mg²⁺ replaced, azithromycin reconsidered", scoreImpact: 3 },
        ],
      },
      {
        nodeId: "nsr-prevented",
        rhythmKey: "normal_sinus_rhythm",
        onsetSeconds: 60,
        vitals: { hr: 84, sbp: 122, spo2: 95 },
        clinicalSigns: ["K⁺ 40 mEq replacement initiated", "Mg²⁺ 2g IV given", "Azithromycin flagged with provider for substitution"],
        activeAlarms: [],
        riskLevel: "low",
        missableWarnings: [],
        transitions: [],
      },
      {
        nodeId: "qtc-prolonged",
        rhythmKey: "hypokalemia_pattern",
        onsetSeconds: 90,
        vitals: { hr: 92, sbp: 118, spo2: 94 },
        clinicalSigns: ["Monitor shows prolonged QT with flat T waves and visible U waves", "Patient reports 'heart fluttering' intermittently", "QTc now 512 ms on repeat ECG"],
        activeAlarms: ["QT alarm"],
        riskLevel: "high",
        missableWarnings: ["QTc 512 ms — immediate torsades risk; electrolytes still unreplaced"],
        transitions: [
          { targetNodeId: "torsades-pulsatile", trigger: "no_action", label: "R-on-T triggers torsades", scoreImpact: -2 },
        ],
      },
      {
        nodeId: "torsades-pulsatile",
        rhythmKey: "torsades_de_pointes",
        onsetSeconds: 150,
        vitals: { hr: 220, sbp: 74, spo2: 88 },
        clinicalSigns: ["Polymorphic VT with axis twisting on monitor — amplitude alternates above and below baseline", "Patient unconscious — unresponsive to voice", "Peripheral pulse barely palpable"],
        activeAlarms: ["Wide complex tachycardia — URGENT"],
        riskLevel: "life_threatening",
        missableWarnings: [],
        transitions: [
          { targetNodeId: "magnesium-success", trigger: "correct_action", label: "Magnesium sulfate 2g IV over 15 min — torsades terminates", scoreImpact: 3 },
          { targetNodeId: "amiodarone-error", trigger: "incorrect_action", label: "Amiodarone administered — QTc further prolonged, torsades worsens", scoreImpact: -3 },
          { targetNodeId: "torsades-pulseless", trigger: "no_action", label: "Torsades degenerates to pulseless VT/VF", scoreImpact: -3 },
        ],
      },
      {
        nodeId: "magnesium-success",
        rhythmKey: "normal_sinus_rhythm",
        onsetSeconds: 300,
        vitals: { hr: 86, sbp: 112, spo2: 95 },
        clinicalSigns: ["Torsades terminated after MgSO₄ 2g IV", "Patient recovering — confused briefly then oriented", "Electrolyte replacement ongoing"],
        activeAlarms: [],
        riskLevel: "moderate",
        missableWarnings: [],
        transitions: [],
      },
      {
        nodeId: "amiodarone-error",
        rhythmKey: "torsades_de_pointes",
        onsetSeconds: 240,
        vitals: { hr: 240, sbp: 60, spo2: 84 },
        clinicalSigns: ["Torsades worsening after amiodarone — amiodarone prolongs QTc further", "Patient now pulseless"],
        activeAlarms: ["CODE"],
        riskLevel: "life_threatening",
        missableWarnings: [],
        transitions: [
          { targetNodeId: "torsades-defibrillated", trigger: "correct_action", label: "Code called, defibrillation performed", scoreImpact: 2 },
        ],
      },
      {
        nodeId: "torsades-pulseless",
        rhythmKey: "ventricular_fibrillation",
        onsetSeconds: 220,
        vitals: { hr: 0, sbp: 0, spo2: 0 },
        clinicalSigns: ["VF — patient pulseless", "CPR in progress"],
        activeAlarms: ["CODE"],
        riskLevel: "life_threatening",
        missableWarnings: [],
        transitions: [
          { targetNodeId: "torsades-defibrillated", trigger: "correct_action", label: "Defibrillation + MgSO₄", scoreImpact: 2 },
        ],
      },
      {
        nodeId: "torsades-defibrillated",
        rhythmKey: "normal_sinus_rhythm",
        onsetSeconds: 340,
        vitals: { hr: 90, sbp: 104, spo2: 94 },
        clinicalSigns: ["ROSC after defibrillation + MgSO₄", "Offending medications stopped", "ICU transfer required"],
        activeAlarms: [],
        riskLevel: "high",
        missableWarnings: [],
        transitions: [],
      },
    ],
    decisionPoints: [
      {
        atNodeId: "nsr-baseline",
        decisionType: "recognition",
        stem: "Morning lab results show K⁺ 3.1 mEq/L and Mg²⁺ 1.4 mg/dL. The patient is on day 3 of azithromycin and ondansetron. The previous ECG showed QTc 478 ms. Which action is MOST appropriate?",
        ngnFormat: "sata",
        options: [
          { id: "a", text: "Notify the provider of the hypokalemia, hypomagnesemia, and elevated QTc", correct: true, consequenceNodeId: "nsr-prevented", rationale: "K⁺ 3.1 + Mg²⁺ 1.4 + QTc 478 ms on two QTc-prolonging agents is a high-risk constellation for torsades. Immediate provider notification allows electrolyte replacement and drug review." },
          { id: "b", text: "Initiate IV potassium replacement per the standing protocol", correct: true, consequenceNodeId: "nsr-prevented", rationale: "Hypokalemia (K⁺ 3.1) is a major torsades risk factor. Replacement should be initiated per protocol while notifying the provider." },
          { id: "c", text: "Request an order for IV magnesium replacement", correct: true, consequenceNodeId: "nsr-prevented", rationale: "Hypomagnesemia (Mg²⁺ 1.4) potentiates QTc prolongation. Replacement requires a provider order." },
          { id: "d", text: "Continue current medications — QTc of 478 ms does not yet require action", correct: false, consequenceNodeId: "qtc-prolonged", rationale: "QTc > 460 ms in a woman (and > 450 ms in a man) is prolonged and requires action, especially with concurrent QTc-prolonging agents.", consequence: "No intervention allows further QTc lengthening toward 500 ms — torsades threshold" },
          { id: "e", text: "Administer ondansetron as scheduled — nausea control is the priority", correct: false, consequenceNodeId: "qtc-prolonged", rationale: "Ondansetron prolongs QTc. In a patient already at 478 ms on azithromycin, administering ondansetron adds cumulative QTc prolongation risk.", consequence: "Second QTc-prolonging dose pushes QTc toward dangerous range" },
        ],
      },
      {
        atNodeId: "torsades-pulsatile",
        decisionType: "escalation",
        stem: "The monitor shows polymorphic VT with twisting axis (torsades de pointes). The patient is unresponsive but a weak peripheral pulse is palpable. BP 74/48. What is the CORRECT immediate pharmacologic intervention?",
        ngnFormat: "mcq",
        options: [
          { id: "a", text: "Magnesium sulfate 2g IV over 15 minutes", correct: true, consequenceNodeId: "magnesium-success", rationale: "IV magnesium sulfate 2g is the definitive pharmacologic treatment for torsades de pointes. It suppresses the triggered activity responsible for torsades by blocking calcium channels, reducing afterdepolarizations." },
          { id: "b", text: "Amiodarone 150 mg IV over 10 minutes", correct: false, consequenceNodeId: "amiodarone-error", rationale: "Amiodarone PROLONGS the QTc interval. Using amiodarone for torsades will worsen the underlying substrate and increase the risk of degeneration to VF.", safetyFlag: "CRITICAL SAFETY ERROR: Amiodarone for torsades prolongs QTc and worsens the arrhythmia." },
          { id: "c", text: "Lidocaine 1 mg/kg IV push", correct: false, consequenceNodeId: "torsades-pulsatile", rationale: "Lidocaine shortens action potential duration and may transiently suppress torsades but is not the first-line agent. Magnesium is more effective and more specific." },
          { id: "d", text: "Adenosine 6 mg IV rapid push", correct: false, consequenceNodeId: "torsades-pulsatile", rationale: "Adenosine targets the AV node and is used for SVT — it has no mechanism of action against torsades de pointes, which is a ventricular arrhythmia." },
        ],
      },
    ],
    documentationTasks: [
      {
        id: "torsades-event-doc",
        atNodeId: "torsades-pulsatile",
        taskType: "escalation_documentation",
        prompt: "Document the torsades event, the drug safety issue, interventions, and patient outcome.",
        requiredElements: [
          "Time of torsades onset and identification",
          "Rhythm description (polymorphic VT with axis twisting)",
          "Hemodynamic status",
          "Drug identified as QTc-prolonging contributor",
          "Medications HELD (azithromycin, ondansetron)",
          "Magnesium sulfate dose, route, and time",
          "Patient response and outcome",
          "Provider notification",
        ],
        modelAnswer:
          "1048: Telemetry alarm — polymorphic wide-complex tachycardia at 220 BPM. At bedside immediately. " +
          "Rhythm: torsades de pointes — QRS amplitude alternates above and below baseline with axis twisting. " +
          "Patient unresponsive to voice; weak carotid pulse palpable at 220 BPM. BP 74/48.\n\n" +
          "1048: Code Blue called. Dr. [Name] at bedside at 1050.\n" +
          "1049: Azithromycin and ondansetron HELD — identified as QTc-prolonging agents in setting of hypokalemia and hypomagnesemia.\n" +
          "1050: Magnesium sulfate 2g IV over 15 min per order. Torsades terminated at 1052.\n" +
          "Post-termination: Sinus rhythm at 86 BPM, BP 112/68. Patient alert and oriented.\n" +
          "Electrolyte replacement ongoing. ICU transfer arranged for QTc monitoring. " +
          "Drug interaction flagged with pharmacy and documented in incident report.",
      },
    ],
    debrief: {
      clinicalNarrative:
        "This case demonstrates the convergence of three QTc-prolonging factors: azithromycin (antibiotic), ondansetron (antiemetic), and hypokalemia/hypomagnesemia. Each factor alone poses moderate risk; together, they pushed the QTc to 512 ms — well above the 500 ms torsades threshold. The preventable intervention was electrolyte replacement and drug substitution before QTc reached dangerous levels.",
      missedWarnings: [
        "QTc 478 ms on the previous ECG — already above the 460 ms threshold in women",
        "K⁺ 3.1 and Mg²⁺ 1.4 on morning labs — both unreplaced",
        "Concurrent azithromycin + ondansetron: two QTc-prolonging agents not flagged for interaction review",
      ],
      preventionOpportunities: [
        "Electronic drug interaction alerts for QTc-prolonging agent combinations should have prompted review",
        "K⁺ < 3.5 and Mg²⁺ < 1.8 should trigger replacement protocols, especially on QTc-prolonging antibiotics",
        "Daily QTc monitoring for any patient on ≥2 QTc-prolonging agents",
      ],
      learningObjectives: [
        "Recognize torsades de pointes by the characteristic polymorphic VT with axis twisting (amplitude oscillation around the baseline)",
        "Select magnesium sulfate 2g IV as first-line therapy — NOT amiodarone, which worsens torsades by prolonging QTc",
        "Identify common QTc-prolonging medication classes: antibiotics (azithromycin, fluoroquinolones), antiemetics (ondansetron), antipsychotics, antiarrhythmics",
        "Apply the QTc threshold: > 450 ms in men and > 460 ms in women requires action; > 500 ms in either is a torsades emergency",
      ],
      clinicalPearls: [
        "Amiodarone for torsades = the most dangerous possible drug error in this scenario. It prolongs QTc and converts torsades to fatal VF.",
        "QTc risk is additive. Each QTc-prolonging drug and each electrolyte deficit adds to the total risk.",
        "Pulseless torsades = defibrillate + MgSO₄. Pulsatile torsades = MgSO₄ first, defibrillation if no response.",
        "QTc in women: use 460 ms, not 450 ms, as the threshold. Women have intrinsically longer QTc than men.",
      ],
      guidelineReferences: [
        "AHA ACLS 2020 — Torsades de Pointes Management",
        "Roden DM. Drug-induced prolongation of the QT interval. NEJM 2004;350:1013.",
      ],
    },
    primaryDomains: ["acls_critical_rhythms", "electrolyte_abnormalities"],
    estimatedMinutes: 20,
    difficulty: 4,
    requiresCodeBlueDecision: false,
    requiresStemiActivation: false,
    criticalSafetyDecisions: [
      "Amiodarone is CONTRAINDICATED for torsades — it prolongs QTc and worsens the arrhythmia",
      "Magnesium sulfate 2g IV is the first-line drug for torsades regardless of serum magnesium level",
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "ecg-rn-svt-vagal",
    title: "SVT — Modified Valsalva and Adenosine Decision",
    summary: "A 38-year-old presents with sudden-onset palpitations at 192 BPM with narrow QRS. Apply the modified Valsalva maneuver, determine adenosine candidacy, and prepare the correct administration technique.",
    publishStatus: "published",
    targetProfessions: ["RN"],
    environment: {
      specialty: "emergency",
      unitLabel: "Emergency Department — Bay 2",
      monitorContext: "bedside_monitor",
      timeOfDay: "evening",
      staffingContext: "adequate",
    },
    patient: {
      age: 38,
      sex: "male",
      admissionDiagnosis: "Palpitations — rapid heart rate",
      admissionReason: "Sudden-onset rapid heartbeat starting 45 minutes ago; reports similar episode 2 years ago that self-terminated",
      relevantHistory: ["No cardiac history", "Anxiety disorder on sertraline", "Occasional caffeine excess"],
      medications: ["Sertraline 100 mg daily"],
      allergies: ["NKDA"],
      baselineRhythmKey: "svt",
      baselineVitals: { hr: 192, sbp: 118, dbp: 78, spo2: 98, rr: 18, temp: 37.1 },
    },
    rhythmProgression: [
      {
        nodeId: "svt-stable",
        rhythmKey: "svt",
        onsetSeconds: 0,
        vitals: { hr: 192, sbp: 118, spo2: 98 },
        clinicalSigns: ["Regular narrow-complex tachycardia at 192 BPM", "Patient alert, anxious — 'my heart is racing'", "No chest pain, no dyspnea", "BP 118/78 — stable"],
        activeAlarms: ["Heart rate high — 192"],
        riskLevel: "high",
        missableWarnings: ["Delta waves absent — no WPW on this presentation (AV nodal agents safe)"],
        transitions: [
          { targetNodeId: "vagal-success", trigger: "correct_action", label: "Modified Valsalva terminates SVT", scoreImpact: 2 },
          { targetNodeId: "svt-stable", trigger: "incorrect_action", label: "Vagal maneuver performed incorrectly — no conversion", scoreImpact: -1 },
          { targetNodeId: "adenosine-needed", trigger: "no_action", label: "Vagal maneuver not attempted — moves directly to adenosine", scoreImpact: 0 },
        ],
      },
      {
        nodeId: "vagal-success",
        rhythmKey: "normal_sinus_rhythm",
        onsetSeconds: 60,
        vitals: { hr: 78, sbp: 122, spo2: 98 },
        clinicalSigns: ["SVT terminated with modified Valsalva — abrupt conversion to sinus", "Patient: 'Oh, that's better!' — immediate symptom relief", "Brief asystole (1–2 seconds) visible on monitor as AV node recovers — normal"],
        activeAlarms: [],
        riskLevel: "low",
        missableWarnings: [],
        transitions: [],
      },
      {
        nodeId: "adenosine-needed",
        rhythmKey: "svt",
        onsetSeconds: 120,
        vitals: { hr: 194, sbp: 112, spo2: 97 },
        clinicalSigns: ["SVT continues — vagal maneuvers not attempted or unsuccessful", "Patient now mildly diaphoretic — HR has been 192+ for 75 minutes", "BP trending slightly down"],
        activeAlarms: ["Heart rate high"],
        riskLevel: "high",
        missableWarnings: [],
        transitions: [
          { targetNodeId: "adenosine-success", trigger: "correct_action", label: "Adenosine 6 mg IV rapid push — SVT converts", scoreImpact: 3 },
          { targetNodeId: "adenosine-slow-error", trigger: "incorrect_action", label: "Adenosine given slowly — no effect", scoreImpact: -2 },
        ],
      },
      {
        nodeId: "adenosine-success",
        rhythmKey: "normal_sinus_rhythm",
        onsetSeconds: 180,
        vitals: { hr: 82, sbp: 120, spo2: 98 },
        clinicalSigns: ["Adenosine caused transient AV block — 3-second flatline visible then sinus rhythm", "Patient: 'I felt like I was going to die for a second' — expected adenosine effect", "Sinus rhythm maintained at 82 BPM"],
        activeAlarms: [],
        riskLevel: "low",
        missableWarnings: [],
        transitions: [],
      },
      {
        nodeId: "adenosine-slow-error",
        rhythmKey: "svt",
        onsetSeconds: 180,
        vitals: { hr: 192, sbp: 110, spo2: 97 },
        clinicalSigns: ["Adenosine metabolized before reaching AV node — no effect", "SVT continues"],
        activeAlarms: [],
        riskLevel: "high",
        missableWarnings: [],
        transitions: [
          { targetNodeId: "adenosine-success", trigger: "correct_action", label: "Adenosine 12 mg rapid push — SVT converts", scoreImpact: 2 },
        ],
      },
    ],
    decisionPoints: [
      {
        atNodeId: "svt-stable",
        decisionType: "intervention",
        stem: "A 38-year-old presents with narrow-complex SVT at 192 BPM. BP 118/78. He is alert and anxious but hemodynamically stable. What is the MOST appropriate first intervention?",
        ngnFormat: "mcq",
        options: [
          {
            id: "a",
            text: "Modified Valsalva maneuver: strain for 15 seconds while supine, then have legs elevated immediately after straining ceases",
            correct: true,
            consequenceNodeId: "vagal-success",
            rationale: "The modified Valsalva (legs elevated during the release phase) converts SVT in approximately 43% of cases vs. 17% for standard Valsalva (REVERT trial, 2015). It is non-invasive, immediate, and has no side effects. It should always be attempted before adenosine in stable patients.",
          },
          {
            id: "b",
            text: "Administer adenosine 6 mg IV rapid push immediately",
            correct: false,
            consequenceNodeId: "adenosine-success",
            rationale: "Adenosine is appropriate but should not be the first step in a hemodynamically stable patient. Vagal maneuvers should be attempted first. Adenosine carries a risk of transient asystole and patient anxiety.",
          },
          {
            id: "c",
            text: "Prepare for synchronized cardioversion at 50 J",
            correct: false,
            consequenceNodeId: "svt-stable",
            rationale: "Cardioversion is reserved for hemodynamically unstable SVT. This patient has BP 118/78 and is alert — stable SVT. Vagal maneuvers and adenosine are appropriate first steps.",
            safetyFlag: "Cardioversion for stable SVT is premature — try vagal maneuvers and adenosine first.",
          },
          {
            id: "d",
            text: "Apply carotid massage to the left carotid artery",
            correct: false,
            consequenceNodeId: "svt-stable",
            rationale: "Carotid massage is a vagal maneuver but carries risk of stroke from carotid plaque dislodgement, especially in older patients. It should not be performed without first checking for carotid bruits. Modified Valsalva is safer and more effective.",
          },
        ],
      },
      {
        atNodeId: "adenosine-needed",
        decisionType: "intervention",
        stem: "Vagal maneuvers were unsuccessful. The provider orders adenosine 6 mg IV. Which administration technique is CORRECT?",
        ngnFormat: "sata",
        options: [
          { id: "a", text: "Use the most proximal IV site available (antecubital or more central)", correct: true, consequenceNodeId: "adenosine-success", rationale: "Peripheral antecubital or central IV preferred. Adenosine's half-life is < 10 seconds — the faster it reaches central circulation, the more likely it is to reach the AV node at therapeutic concentration before being metabolized." },
          { id: "b", text: "Push the adenosine as fast as possible (1–2 seconds) then immediately flush with 20 mL NS", correct: true, consequenceNodeId: "adenosine-success", rationale: "Rapid push + immediate flush is the correct technique. The push gets adenosine into the circulation; the flush drives it rapidly into the central circulation before metabolism." },
          { id: "c", text: "Warn the patient they may feel chest pressure, flushing, or a brief 'doom' sensation — this is expected", correct: true, consequenceNodeId: "adenosine-success", rationale: "Adenosine commonly causes transient chest pressure, flushing, and dyspnea for 10–15 seconds. Pre-warning prevents panic. The monitor will also show a brief asystole — warn the patient and document it is expected." },
          { id: "d", text: "Administer over 2 minutes to minimize the side effects", correct: false, consequenceNodeId: "adenosine-slow-error", rationale: "Slow infusion allows adenosine to be metabolized before reaching the AV node at therapeutic concentration — it will have no effect. Adenosine MUST be a rapid push.", consequence: "Slow adenosine administration = no therapeutic effect; SVT continues" },
          { id: "e", text: "Confirm no WPW (no delta waves, no short PR) on the ECG before administering", correct: true, consequenceNodeId: "adenosine-success", rationale: "In WPW with AFib, adenosine can precipitate rapid conduction through the accessory pathway → VF. Confirming no delta waves before adenosine is a safety check." },
        ],
      },
    ],
    documentationTasks: [
      {
        id: "svt-event-doc",
        atNodeId: "vagal-success",
        taskType: "rhythm_documentation",
        prompt: "Document the SVT episode including onset, interventions, conversion, and plan.",
        requiredElements: [
          "Onset time and rate at presentation",
          "Hemodynamic status",
          "Vagal maneuver performed (type and technique)",
          "Conversion time and post-conversion rhythm",
          "Provider notification",
          "Monitoring plan and discharge teaching",
        ],
        modelAnswer:
          "1918: Patient presents with complaint of rapid heartbeat onset at 1830. " +
          "Telemetry: narrow-complex regular tachycardia at 192 BPM. VS: BP 118/78, SpO₂ 98%, patient alert, anxious. " +
          "No chest pain, no dyspnea. No delta waves on ECG (WPW excluded).\n" +
          "1920: Modified Valsalva performed: patient instructed to strain for 15 seconds supine, legs immediately elevated. " +
          "Abrupt conversion to sinus rhythm at 1920. Rhythm: NSR at 78 BPM. " +
          "Patient reports immediate relief. Brief 1.5-second pause on monitor during conversion — expected and documented.\n" +
          "Dr. [Name] notified. Cardiology referral placed for Holter monitoring and SVT management plan. " +
          "Patient educated on SVT, vagal maneuver technique for home use, and when to call EMS.",
      },
    ],
    debrief: {
      clinicalNarrative:
        "SVT (AVNRT or AVRT) is the most common sustained supraventricular tachycardia seen in the ED. " +
        "The modified Valsalva converts approximately 43% of SVT episodes — making it an effective, safe, and drug-free first line. " +
        "When adenosine is needed, technique determines success: slow push = no effect, rapid push + flush = conversion. " +
        "The most important safety check before adenosine is ruling out WPW (delta waves on ECG).",
      missedWarnings: [
        "Prolonged SVT (> 60 minutes) increases patient discomfort and hemodynamic risk — earlier intervention is better",
        "WPW screening (delta waves, short PR) should be performed on the 12-lead before adenosine in any SVT — missing this risks fatal pre-excited AFib if WPW is present",
      ],
      preventionOpportunities: ["Patient education on home vagal maneuver technique (modified Valsalva) for future episodes"],
      learningObjectives: [
        "Apply the modified Valsalva maneuver correctly (15 seconds straining + immediate leg elevation during release phase)",
        "Administer adenosine correctly: fastest possible IV push into the most proximal site, immediate 20 mL NS flush",
        "Screen for WPW (delta waves, short PR) before administering adenosine — adenosine in WPW + AFib causes VF",
        "Recognize the transient asystole after adenosine conversion as expected, not an emergency",
      ],
      clinicalPearls: [
        "Modified Valsalva (REVERT technique) converts 43% of SVT — try it before reaching for adenosine",
        "Slow adenosine = no effect. The drug is metabolized in < 10 seconds — rapid push is non-negotiable",
        "The 'doom' feeling, chest pressure, and flushing from adenosine last 10–20 seconds. Warn the patient first",
        "After SVT: 12-lead ECG, cardiology referral for Holter, patient teaching on home vagal maneuver",
      ],
      guidelineReferences: [
        "Appelboam A et al. REVERT trial. Lancet. 2015;386:1747–1753",
        "AHA/ACC/HRS 2015 SVT Guideline",
      ],
    },
    primaryDomains: ["rhythm_recognition", "acls_critical_rhythms"],
    estimatedMinutes: 18,
    difficulty: 3,
    requiresCodeBlueDecision: false,
    requiresStemiActivation: false,
    criticalSafetyDecisions: [
      "Screen for WPW before adenosine — delta waves = adenosine may precipitate VF",
      "Adenosine must be rapid IV push — slow infusion produces no effect",
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // RPN EXPANSIONS
  // ══════════════════════════════════════════════════════════════════════

  {
    id: "ecg-rpn-bradycardia-symptoms",
    title: "Symptomatic Bradycardia — RPN Assessment and Escalation",
    summary: "An LTC resident with HR 42 reports dizziness. Apply the RPN scope-appropriate assessment: assess symptoms, check BP, determine urgency, and escalate appropriately to the RN.",
    publishStatus: "published",
    targetProfessions: ["RPN"],
    environment: {
      specialty: "long_term_care",
      unitLabel: "Long-Term Care — Ward B",
      monitorContext: "bedside_monitor",
      timeOfDay: "night",
      staffingContext: "short_staffed",
    },
    patient: {
      age: 79,
      sex: "female",
      admissionDiagnosis: "Sick sinus syndrome — cardiac monitoring",
      admissionReason: "Referred from community after syncope at home. Permanent pacemaker recently declined by patient.",
      relevantHistory: ["Sick sinus syndrome", "HTN — controlled", "Mild cognitive impairment"],
      medications: ["Metoprolol 25 mg BID", "Amlodipine 5 mg daily", "Aspirin 81 mg daily"],
      allergies: ["Penicillin — rash"],
      baselineRhythmKey: "sinus_bradycardia",
      baselineVitals: { hr: 54, sbp: 128, dbp: 78, spo2: 95, rr: 16, temp: 37.0 },
    },
    rhythmProgression: [
      {
        nodeId: "new-brady-alarm",
        rhythmKey: "sinus_bradycardia",
        onsetSeconds: 0,
        vitals: { hr: 42, sbp: 92, spo2: 94 },
        clinicalSigns: ["Monitor alarm: HR 42 BPM — below baseline of 54", "Resident presses call bell: 'I feel dizzy and my heart feels slow'", "Resident pale, sitting on bed edge"],
        activeAlarms: ["Heart rate low — 42"],
        riskLevel: "high",
        missableWarnings: ["HR dropped 12 BPM from baseline — new change, not chronic", "New dizziness correlates with rate drop — symptomatic bradycardia"],
        transitions: [
          { targetNodeId: "rpn-escalated", trigger: "correct_action", label: "RPN assessed, called RN immediately", scoreImpact: 3 },
          { targetNodeId: "rpn-delayed", trigger: "incorrect_action", label: "RPN reassured without BP check — resident deteriorates", scoreImpact: -2 },
        ],
      },
      {
        nodeId: "rpn-escalated",
        rhythmKey: "sinus_bradycardia",
        onsetSeconds: 60,
        vitals: { hr: 42, sbp: 90, spo2: 94 },
        clinicalSigns: ["RN at bedside within 3 minutes", "BP confirmed 90/58 — hypotensive", "Provider notified by RN"],
        activeAlarms: [],
        riskLevel: "high",
        missableWarnings: [],
        transitions: [],
      },
      {
        nodeId: "rpn-delayed",
        rhythmKey: "third_degree_av_block",
        onsetSeconds: 180,
        vitals: { hr: 28, sbp: 72, spo2: 91 },
        clinicalSigns: ["Resident now unresponsive to voice", "Rate dropped to 28 — escape pacemaker", "Complete heart block on monitor"],
        activeAlarms: ["Heart rate critical"],
        riskLevel: "life_threatening",
        missableWarnings: [],
        transitions: [
          { targetNodeId: "rpn-escalated", trigger: "correct_action", label: "Emergency escalation to RN/provider", scoreImpact: 1 },
        ],
      },
    ],
    decisionPoints: [
      {
        atNodeId: "new-brady-alarm",
        decisionType: "recognition",
        stem: "A resident with sick sinus syndrome has a monitor alarm for HR 42. The resident says 'I feel dizzy.' The baseline HR was 54 BPM. Which interpretation is CORRECT?",
        ngnFormat: "mcq",
        options: [
          { id: "a", text: "New symptomatic bradycardia — HR 42 with dizziness in a patient whose baseline is 54 BPM requires immediate assessment and RN notification", correct: true, consequenceNodeId: "rpn-escalated", rationale: "A drop from baseline HR 54 to 42 BPM with new dizziness is symptomatic bradycardia, not a chronic finding. The new symptom + rate change = escalation." },
          { id: "b", text: "Expected finding — this patient has sick sinus syndrome and always runs slow", correct: false, consequenceNodeId: "rpn-delayed", rationale: "The baseline was 54, not 42. A 12-BPM drop below baseline with new dizziness is a change requiring assessment, not dismissal.", consequence: "Reassurance without assessment misses symptomatic bradycardia" },
          { id: "c", text: "HR 42 is borderline — reassure the resident and recheck in 30 minutes", correct: false, consequenceNodeId: "rpn-delayed", rationale: "HR 42 with dizziness is not 'borderline' — it is symptomatic bradycardia. 30-minute delay risks progression to CHB.", consequence: "30-minute wait allows HR to drop further toward complete heart block" },
        ],
        timeLimitSeconds: 90,
      },
      {
        atNodeId: "new-brady-alarm",
        decisionType: "escalation",
        stem: "The monitor alarms at 0220 for HR 42. The resident reports dizziness. As the RPN, which actions are within your scope and are MOST appropriate? Select all that apply.",
        ngnFormat: "sata",
        options: [
          { id: "a", text: "Go to the resident immediately and assess for symptoms (dizziness, near-syncope, diaphoresis)", correct: true, consequenceNodeId: "rpn-escalated", rationale: "Bedside assessment is always the first step. Symptomatic bradycardia (dizziness at HR 42) requires immediate assessment." },
          { id: "b", text: "Measure blood pressure and oxygen saturation at the bedside", correct: true, consequenceNodeId: "rpn-escalated", rationale: "Vital signs are within RPN scope. A BP of 90/58 with HR 42 confirms hemodynamic compromise requiring urgent escalation." },
          { id: "c", text: "Call the RN immediately with your assessment findings: HR 42, BP, symptoms", correct: true, consequenceNodeId: "rpn-escalated", rationale: "Symptomatic bradycardia (HR 42 + dizziness + any BP drop) requires immediate RN notification. This is a required escalation within RPN scope." },
          { id: "d", text: "Administer atropine 0.5 mg IV from the unit stock", correct: false, consequenceNodeId: "rpn-delayed", rationale: "Atropine administration is outside RPN scope without a specific order and RN oversight. The correct action is to escalate, not medicate.", consequence: "Administering atropine without order = scope violation; delays correct escalation" },
          { id: "e", text: "Reassure the resident that dizziness is normal and monitor for 30 minutes", correct: false, consequenceNodeId: "rpn-delayed", rationale: "New dizziness with HR 42 (below baseline 54) is symptomatic bradycardia — reassurance without assessment and escalation is a missed escalation.", consequence: "30-minute delay allows progression to complete heart block" },
        ],
      },
    ],
    documentationTasks: [
      {
        id: "rpn-brady-handoff",
        atNodeId: "rpn-escalated",
        taskType: "sbar_communication",
        prompt: "Communicate the bradycardia finding to the RN using SBAR.",
        requiredElements: ["Resident name and room", "HR at alarm and current", "BP at bedside", "Resident symptoms", "Your actions taken", "Request for RN assessment"],
        modelAnswer:
          "S: RN [name], this is [your name] calling about Mrs. [resident name] in Room 12. Her monitor alarmed at 0220 for HR 42 — she's also complaining of dizziness.\n\n" +
          "B: She has sick sinus syndrome, baseline HR around 54. She's on metoprolol. No pacemaker — patient declined.\n\n" +
          "A: I went to her bedside. HR is 42, BP is 92/58 — down from her usual 128/78. SpO₂ 94%. She's pale and says she feels lightheaded. The metoprolol was given at 2100.\n\n" +
          "R: I need you to come assess her now. I'm concerned this is symptomatic bradycardia. Should I position her flat and stay with her until you get here?",
      },
    ],
    debrief: {
      clinicalNarrative:
        "Symptomatic bradycardia in an LTC resident requires immediate RPN response: assess, check vitals, and escalate to the RN within minutes. The key scope distinction: RPNs assess and escalate; RPNs do not independently initiate atropine or other cardiac medications without an order and RN oversight. A 30-minute reassessment delay is a serious missed escalation — HR 42 with dizziness is an emergency.",
      missedWarnings: ["HR dropped 12 BPM below baseline — not chronic, new change", "Dizziness new complaint correlating with the rate change"],
      preventionOpportunities: ["Shift-start review of baseline vitals to recognize new changes quickly"],
      learningObjectives: [
        "Assess symptomatic bradycardia at the bedside: symptoms, BP, SpO₂",
        "Recognize that HR 42 + dizziness + BP drop = immediate RN escalation, not reassurance",
        "Apply SBAR to communicate the clinical picture efficiently to the RN",
        "Understand that medication administration (atropine) is outside RPN scope without order and RN oversight",
      ],
      clinicalPearls: [
        "RPN scope: assess, measure, escalate. Not: diagnose, medicate independently, defer.",
        "A heart rate below the patient's own baseline with new symptoms is more concerning than the number alone.",
        "The 30-minute 'wait and reassess' is appropriate for stable, asymptomatic findings — not for HR 42 + dizziness + BP drop.",
      ],
      guidelineReferences: ["CNO Nursing Practice Standards — Scope of Practice"],
    },
    primaryDomains: ["rhythm_recognition"],
    estimatedMinutes: 15,
    difficulty: 2,
    requiresCodeBlueDecision: false,
    requiresStemiActivation: false,
    criticalSafetyDecisions: ["Symptomatic bradycardia requires immediate RN escalation — do not reassure without vital signs"],
  },

  // ══════════════════════════════════════════════════════════════════════
  // NP EXPANSIONS
  // ══════════════════════════════════════════════════════════════════════

  {
    id: "ecg-np-stemi-orders",
    title: "STEMI — Writing the Emergent Orders as the NP Lead",
    summary: "As the NP on call, confirm inferior STEMI, write the emergent medication orders, manage the RV MI nitrate contraindication, activate the cath lab, and coordinate the time-sensitive handoff.",
    publishStatus: "published",
    targetProfessions: ["NP"],
    environment: {
      specialty: "emergency",
      unitLabel: "ED — NP Lead Resuscitation Bay",
      monitorContext: "bedside_monitor",
      timeOfDay: "day",
      staffingContext: "adequate",
    },
    patient: {
      age: 61,
      sex: "male",
      admissionDiagnosis: "Chest pain — STEMI",
      admissionReason: "Crushing substernal chest pain × 60 minutes, radiation to jaw, diaphoresis",
      relevantHistory: ["HTN", "Type 2 diabetes on insulin", "Hyperlipidemia", "Smoker 25 pack-years", "No prior cardiac history"],
      medications: ["Metformin 1000 mg BID", "Insulin glargine 20 units QHS", "Lisinopril 10 mg daily"],
      allergies: ["Contrast dye — urticaria (premedication protocol in chart)"],
      baselineRhythmKey: "sinus_bradycardia",
      baselineVitals: { hr: 54, sbp: 138, dbp: 90, spo2: 97, rr: 18, temp: 37.0 },
    },
    rhythmProgression: [
      {
        nodeId: "stemi-confirmed",
        rhythmKey: "stemi_pattern",
        onsetSeconds: 0,
        vitals: { hr: 54, sbp: 138, spo2: 97 },
        clinicalSigns: ["12-lead: 3mm ST elevation II, III, aVF; reciprocal I, aVL", "Bradycardia 54 BPM — RCA supplies SA node", "Diaphoretic, severe chest pain 9/10"],
        activeAlarms: [],
        riskLevel: "life_threatening",
        missableWarnings: ["Bradycardia with inferior STEMI = RCA involvement of SA node — RV MI highly likely"],
        transitions: [
          { targetNodeId: "stemi-managed", trigger: "correct_action", label: "Right-sided leads, correct orders, cath lab activated", scoreImpact: 3 },
          { targetNodeId: "nitro-error", trigger: "incorrect_action", label: "Nitroglycerin ordered without right-sided leads", scoreImpact: -3 },
        ],
      },
      {
        nodeId: "stemi-managed",
        rhythmKey: "stemi_pattern",
        onsetSeconds: 60,
        vitals: { hr: 58, sbp: 136, spo2: 97 },
        clinicalSigns: ["Right-sided leads: V4R shows 1.5mm ST elevation — RV MI confirmed", "Cath lab activated at 12 minutes from ECG", "Aspirin, heparin, ticagrelor given — nitroglycerin withheld"],
        activeAlarms: [],
        riskLevel: "high",
        missableWarnings: [],
        transitions: [],
      },
      {
        nodeId: "nitro-error",
        rhythmKey: "sinus_bradycardia",
        onsetSeconds: 90,
        vitals: { hr: 48, sbp: 62, spo2: 93 },
        clinicalSigns: ["After nitroglycerin: BP crashed to 62/40 — RV MI confirmed on right-sided leads obtained post-crisis", "Patient diaphoretic, confused", "Hypotension from reduced preload to preload-dependent RV"],
        activeAlarms: ["Blood pressure critical low"],
        riskLevel: "life_threatening",
        missableWarnings: [],
        transitions: [
          { targetNodeId: "rv-mi-rescue", trigger: "correct_action", label: "IV fluid bolus, nitro held, cath lab still activated", scoreImpact: 1 },
        ],
      },
      {
        nodeId: "rv-mi-rescue",
        rhythmKey: "stemi_pattern",
        onsetSeconds: 180,
        vitals: { hr: 58, sbp: 96, spo2: 95 },
        clinicalSigns: ["1L NS bolus given — BP recovering to 96/64", "Nitroglycerin stopped", "Cath lab proceeding"],
        activeAlarms: [],
        riskLevel: "high",
        missableWarnings: [],
        transitions: [],
      },
    ],
    decisionPoints: [
      {
        atNodeId: "stemi-confirmed",
        decisionType: "recognition",
        stem: "The 12-lead shows 3mm ST elevation in II, III, aVF with reciprocal depression in I and aVL. HR is 54 BPM. What does the sinus bradycardia in the context of an inferior STEMI most likely indicate?",
        ngnFormat: "mcq",
        options: [
          { id: "a", text: "RCA occlusion involving the SA node and likely RV MI — check right-sided leads before ordering nitroglycerin", correct: true, consequenceNodeId: "stemi-managed", rationale: "The RCA supplies the inferior wall, the SA node, and the RV in 80% of patients. Bradycardia with inferior STEMI = RCA territory = high probability of RV MI. V4R must be obtained before any nitrates." },
          { id: "b", text: "Vagal response to pain — administer atropine and nitroglycerin concurrently", correct: false, consequenceNodeId: "nitro-error", rationale: "While pain can cause vagal bradycardia, the combination with inferior STEMI means RCA involvement is the primary etiology. Nitroglycerin before right-sided leads is contraindicated.", safetyFlag: "Nitrates before right-sided leads in inferior STEMI with bradycardia risks fatal RV MI hypotension." },
          { id: "c", text: "Beta-blocker effect from home metformin — adjust medications only", correct: false, consequenceNodeId: "nitro-error", rationale: "Metformin is an antidiabetic medication with no cardiac conduction effects. The bradycardia is from RCA ischemia of the SA node." },
        ],
      },
      {
        atNodeId: "stemi-confirmed",
        decisionType: "escalation",
        stem: "You confirm inferior STEMI (II/III/aVF elevation) with HR 54 BPM. As the NP lead, which orders are correct at this time? Select all that apply.",
        ngnFormat: "sata",
        options: [
          { id: "a", text: "Aspirin 325 mg PO chewed STAT", correct: true, consequenceNodeId: "stemi-managed", rationale: "Aspirin is Class I for STEMI. Give immediately — do not wait for anything." },
          { id: "b", text: "Ticagrelor 180 mg PO loading dose STAT (no contraindications to P2Y12 inhibitor)", correct: true, consequenceNodeId: "stemi-managed", rationale: "P2Y12 inhibitor loading is a Class I recommendation for STEMI before PCI." },
          { id: "c", text: "Obtain right-sided ECG leads (V4R) before ordering nitroglycerin", correct: true, consequenceNodeId: "stemi-managed", rationale: "Inferior STEMI + bradycardia (HR 54) = high probability of RV MI. Right-sided leads MUST be obtained before any nitrates." },
          { id: "d", text: "Nitroglycerin 0.4 mg SL STAT for chest pain relief", correct: false, consequenceNodeId: "nitro-error", rationale: "CONTRAINDICATED before right-sided leads in inferior STEMI. If RV MI is present, nitroglycerin causes fatal preload reduction.", safetyFlag: "SAFETY FLAG: Nitrates in inferior STEMI before V4R screening = potential fatal hypotension." },
          { id: "e", text: "Heparin weight-based bolus per ACS protocol", correct: true, consequenceNodeId: "stemi-managed", rationale: "Anticoagulation is a Class I recommendation for STEMI PCI strategy." },
          { id: "f", text: "Activate the STEMI alert and notify interventional cardiology directly", correct: true, consequenceNodeId: "stemi-managed", rationale: "Cath lab activation is the primary goal — D2B time clock runs from ECG time." },
          { id: "g", text: "Supplemental oxygen via non-rebreather mask at 15L regardless of SpO₂", correct: false, consequenceNodeId: "stemi-managed", rationale: "Routine oxygen in a normoxic patient (SpO₂ 97%) causes coronary vasoconstriction and worsens outcomes. Use oxygen only if SpO₂ < 94%." },
        ],
      },
    ],
    documentationTasks: [
      {
        id: "np-stemi-handoff",
        atNodeId: "stemi-managed",
        taskType: "handoff_report",
        prompt: "Write the NP-to-cardiologist handoff for this STEMI patient going to the cath lab.",
        requiredElements: [
          "Patient identifier and age",
          "STEMI territory and ECG findings",
          "RV MI status (V4R finding)",
          "Medications given and held (especially nitrate status)",
          "Current hemodynamics",
          "Contrast allergy premedication status",
          "D2B clock start time",
        ],
        modelAnswer:
          "Cardiology handoff: Mr. [name], 61M. Inferior STEMI confirmed — ST elevation 3mm II/III/aVF, reciprocal I/aVL. " +
          "Right-sided leads: V4R elevation 1.5mm — RV MI confirmed. " +
          "MEDS GIVEN: Aspirin 325mg (1342), ticagrelor 180mg (1344), heparin 4000 units IV (1346). " +
          "NITRATES HELD — RV MI contraindication documented. " +
          "HR 58, BP 136/88, SpO₂ 97% on RA. Alert and oriented. " +
          "CONTRAST ALLERGY: urticaria — premedication protocol (methylprednisolone + diphenhydramine) initiated at 1340. " +
          "ECG time 1342. Currently 1354 — DTB clock at 12 minutes. " +
          "Patient and spouse briefed. Consent signed for PCI.",
      },
    ],
    debrief: {
      clinicalNarrative:
        "The NP role in STEMI is to confirm the diagnosis, write the correct emergent orders, and minimize D2B time. " +
        "The two most consequential decisions in this simulation were: not giving nitroglycerin before right-sided leads in inferior STEMI (which would have caused catastrophic hypotension), and completing the contrast allergy premedication protocol without delaying cath lab activation.",
      missedWarnings: [
        "Bradycardia 54 BPM with inferior STEMI is a reliable indicator of RCA involvement and RV MI risk",
        "Contrast allergy documented (urticaria) — premedication protocol (methylprednisolone + diphenhydramine) must be started promptly without delaying cath lab activation",
      ],
      preventionOpportunities: ["Institutional protocol for automatic right-sided lead acquisition in all inferior STEMI presentations"],
      learningObjectives: [
        "Write the correct STEMI order set: aspirin, P2Y12, heparin, cath lab activation — and correctly WITHHOLD nitroglycerin pending right-sided leads",
        "Interpret right-sided leads (V4R) to confirm or exclude RV MI before any nitrate order",
        "Manage contrast allergy premedication without delaying PCI activation",
        "Complete an accurate cath lab handoff with all required clinical decision information",
      ],
      clinicalPearls: [
        "Inferior STEMI + bradycardia = RCA involvement = RV MI until V4R proves otherwise",
        "Nitroglycerin in RV MI reduces preload to the pressure-dependent RV causing immediate hemodynamic collapse",
        "Your cath lab handoff must include: what you gave, what you held, and why — for the interventionalist to proceed safely",
      ],
      guidelineReferences: ["O'Gara PT et al. 2013 ACCF/AHA STEMI Guideline"],
    },
    primaryDomains: ["ischemia_stemi"],
    estimatedMinutes: 20,
    difficulty: 4,
    requiresCodeBlueDecision: false,
    requiresStemiActivation: true,
    criticalSafetyDecisions: [
      "Right-sided leads BEFORE nitroglycerin in inferior STEMI",
      "Contrast allergy premedication must not delay cath lab activation",
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // RT EXPANSIONS
  // ══════════════════════════════════════════════════════════════════════

  {
    id: "ecg-rt-tension-pneumo-pea",
    title: "Tension Pneumothorax → PEA — Obstructive Arrest",
    summary: "A ventilated patient develops sudden high peak pressures, severe hypoxia, and PEA arrest. Identify tension pneumothorax as the obstructive cause, communicate to the team for needle decompression, and manage the airway through the arrest.",
    publishStatus: "published",
    targetProfessions: ["RT"],
    environment: {
      specialty: "critical_care",
      unitLabel: "Medical ICU — Bay 4",
      monitorContext: "bedside_monitor",
      timeOfDay: "night",
      staffingContext: "adequate",
    },
    patient: {
      age: 49,
      sex: "male",
      admissionDiagnosis: "ARDS — mechanically ventilated",
      admissionReason: "Sepsis-induced ARDS, intubated, lung-protective ventilation strategy",
      relevantHistory: ["COPD", "No prior pneumothorax"],
      medications: ["Norepinephrine 0.15 mcg/kg/min", "Fentanyl infusion", "Propofol infusion"],
      allergies: ["NKDA"],
      baselineRhythmKey: "sinus_tachycardia",
      baselineVitals: { hr: 108, sbp: 96, dbp: 62, spo2: 92, rr: 28, temp: 38.2 },
    },
    rhythmProgression: [
      {
        nodeId: "ards-baseline",
        rhythmKey: "sinus_tachycardia",
        onsetSeconds: 0,
        vitals: { hr: 108, sbp: 96, spo2: 92 },
        clinicalSigns: ["Ventilator alarms: high peak pressure 44 cmH₂O (limit 40)", "SpO₂ dropping from 92% to 84% over 5 minutes", "BP falling: 96 → 82 → 68 mmHg", "Tracheal deviation toward the left visible on neck exam"],
        activeAlarms: ["High peak pressure", "Low SpO₂"],
        riskLevel: "life_threatening",
        missableWarnings: [
          "Peak pressure alarm is the FIRST warning — rising pressure with falling SpO₂ = tension pneumothorax until proven otherwise",
          "Unilateral absence of breath sounds on right (if auscultated) confirms the diagnosis",
          "BP falling progressively — tension is compressing the IVC, reducing venous return",
        ],
        transitions: [
          { targetNodeId: "needle-decompression", trigger: "correct_action", label: "RT communicates tension pneumothorax to team — needle decompression performed", scoreImpact: 3 },
          { targetNodeId: "pea-arrest", trigger: "no_action", label: "Tension pneumothorax unrecognized — PEA arrest", scoreImpact: -3 },
          { targetNodeId: "pea-arrest", trigger: "incorrect_action", label: "Ventilator settings changed without recognizing the obstructive cause", scoreImpact: -2 },
        ],
      },
      {
        nodeId: "needle-decompression",
        rhythmKey: "sinus_tachycardia",
        onsetSeconds: 90,
        vitals: { hr: 98, sbp: 112, spo2: 94 },
        clinicalSigns: ["Needle decompression performed at 2nd ICS MCL right side — rush of air confirmed tension", "Peak pressures immediately normalized to 28 cmH₂O", "SpO₂ improving 94%", "BP recovering 112/74"],
        activeAlarms: [],
        riskLevel: "high",
        missableWarnings: [],
        transitions: [],
      },
      {
        nodeId: "pea-arrest",
        rhythmKey: "pea",
        onsetSeconds: 180,
        vitals: { hr: 0, sbp: 0, spo2: 0 },
        clinicalSigns: ["Patient pulseless — no carotid pulse despite organized sinus rhythm on monitor", "PEA arrest from obstructive shock (tension pneumothorax)", "CPR in progress"],
        activeAlarms: ["CODE"],
        riskLevel: "life_threatening",
        missableWarnings: [],
        transitions: [
          { targetNodeId: "pea-post-decompression", trigger: "correct_action", label: "Needle decompression during CPR — ROSC", scoreImpact: 2 },
        ],
      },
      {
        nodeId: "pea-post-decompression",
        rhythmKey: "sinus_tachycardia",
        onsetSeconds: 280,
        vitals: { hr: 118, sbp: 88, spo2: 90 },
        clinicalSigns: ["ROSC after needle decompression during CPR", "Chest tube to be placed immediately", "Hemodynamics recovering"],
        activeAlarms: [],
        riskLevel: "high",
        missableWarnings: [],
        transitions: [],
      },
    ],
    decisionPoints: [
      {
        atNodeId: "ards-baseline",
        decisionType: "recognition",
        stem: "A ventilated ARDS patient develops sudden high peak pressures (44 cmH₂O), SpO₂ dropping to 84%, and BP falling to 68/42. Tracheal deviation is noted toward the LEFT. As the RT, which is the MOST accurate assessment and action?",
        ngnFormat: "mcq",
        options: [
          {
            id: "a",
            text: "Communicate 'suspected RIGHT-side tension pneumothorax' to the team and request immediate needle decompression at the right 2nd ICS MCL",
            correct: true,
            consequenceNodeId: "needle-decompression",
            rationale: "Tracheal deviation TOWARD the left means the mediastinum is being pushed away from the right — indicating RIGHT-sided tension pneumothorax. Needle decompression at the RIGHT 2nd ICS MCL is correct. High peak pressures + dropping SpO₂ + hemodynamic collapse = tension pneumothorax until proven otherwise.",
          },
          {
            id: "b",
            text: "Increase the FiO₂ to 1.0 and add 5 cmH₂O PEEP to treat the hypoxia",
            correct: false,
            consequenceNodeId: "pea-arrest",
            rationale: "Increasing PEEP in tension pneumothorax will worsen the tension by pushing more air into the pleural space through the tear. This is the opposite of the correct action.",
            safetyFlag: "SAFETY FLAG: Adding PEEP to tension pneumothorax worsens the obstruction.",
          },
          {
            id: "c",
            text: "Silence the peak pressure alarm — ARDS patients commonly have high pressures",
            correct: false,
            consequenceNodeId: "pea-arrest",
            rationale: "A sudden increase in peak pressure (not gradual worsening typical of ARDS) with hemodynamic collapse is an emergency. Silencing the alarm removes the primary warning signal.",
            safetyFlag: "SAFETY FLAG: Never silence an acute alarm without identifying and treating the cause.",
          },
          {
            id: "d",
            text: "Suction the endotracheal tube — mucus plugging may be causing the obstruction",
            correct: false,
            consequenceNodeId: "pea-arrest",
            rationale: "Mucus plugging causes peak pressure rise without the associated hemodynamic collapse (falling BP, tracheal deviation). The combination of hemodynamic collapse + peak pressure rise + tracheal deviation is tension pneumothorax.",
          },
        ],
      },
      {
        atNodeId: "pea-arrest",
        decisionType: "escalation",
        stem: "The patient is now in PEA cardiac arrest. CPR is in progress. As the RT managing the airway during the code, which actions are correct? Select all that apply.",
        ngnFormat: "sata",
        options: [
          { id: "a", text: "Confirm ETT position — still in correct position or assess for dislodgement", correct: true, consequenceNodeId: "pea-post-decompression", rationale: "ETT displacement is a reversible cause of PEA. Confirm via EtCO₂, auscultation, and direct visualization if needed." },
          { id: "b", text: "Deliver 2 ventilations every 30 compressions in the 30:2 CPR cycle (until advanced airway)", correct: true, consequenceNodeId: "pea-post-decompression", rationale: "With an ETT in place, continuous compressions with asynchronous ventilations (8–10/min) is the standard ACLS approach." },
          { id: "c", text: "Communicate to the team that tension pneumothorax is the most likely reversible cause (the 'T' in 5Ts)", correct: true, consequenceNodeId: "pea-post-decompression", rationale: "Obstructive causes (tension, tamponade) are 'T' causes in the 6Hs/5Ts framework. The RT observing peak pressure alarms before arrest is key clinical information for the team." },
          { id: "d", text: "Increase the respiratory rate on the ventilator to 20 to maximize oxygenation during CPR", correct: false, consequenceNodeId: "pea-arrest", rationale: "High RR during CPR increases intrathoracic pressure and impairs venous return, reducing CPR effectiveness. Ventilation rate during CPR should be 8–10 breaths/min with an advanced airway.", consequence: "High RR during CPR reduces venous return and reduces CPR effectiveness" },
          { id: "e", text: "Monitor EtCO₂ — a sudden rise in EtCO₂ during CPR indicates ROSC", correct: true, consequenceNodeId: "pea-post-decompression", rationale: "Waveform capnography during CPR: EtCO₂ < 10 mmHg suggests poor CPR quality; a sudden rise > 40 mmHg suggests ROSC." },
        ],
      },
    ],
    documentationTasks: [
      {
        id: "rt-tension-pneumo-doc",
        atNodeId: "needle-decompression",
        taskType: "escalation_documentation",
        prompt: "Document the tension pneumothorax event in the respiratory therapy record. Include: warning signs you observed, your assessment, team communication, and airway status throughout.",
        requiredElements: [
          "Time of peak pressure alarm",
          "Peak pressure values and SpO₂ trend",
          "Hemodynamic deterioration observed",
          "Tracheal deviation noted",
          "Communication to team (what you said, to whom)",
          "Needle decompression outcome (air rush, SpO₂ improvement)",
          "Ventilator status before and after decompression",
        ],
        modelAnswer:
          "0318: Ventilator high peak pressure alarm — 44 cmH₂O (limit 40). SpO₂ declining from 92% to 84% over 5 min. " +
          "BP falling: 96→82→68 mmHg. Tracheal deviation toward left noted on neck exam.\n\n" +
          "0318: Communicated to bedside RN and intensivist: 'I suspect right-sided tension pneumothorax — rising peak pressure, falling SpO₂, BP dropping, tracheal deviation leftward. We need immediate needle decompression right 2nd ICS MCL.'\n\n" +
          "0320: Needle decompression performed right 2nd ICS by Dr. [Name] — audible rush of air confirmed tension. " +
          "Peak pressures immediately normalized to 28 cmH₂O. SpO₂ improving — 94% at 0321. BP 112/74.\n\n" +
          "Ventilator settings: FiO₂ maintained at 0.70, PEEP held at 8 cmH₂O pending chest tube placement. " +
          "Chest tube inserted right side at 0330 — 650 mL air evacuated. Breath sounds now equal bilaterally.",
      },
    ],
    debrief: {
      clinicalNarrative:
        "Tension pneumothorax in a ventilated patient is the most time-critical obstructive emergency in the ICU. The warning sequence is classic: peak pressure alarm → SpO₂ drop → BP fall → tracheal deviation → PEA. Every step in this sequence is a minutes-long intervention window. The RT's role is to recognize the peak pressure alarm as the primary early warning, communicate it immediately to the team, and manage the airway throughout the emergency.",
      missedWarnings: [
        "Peak pressure alarm rising acutely (not gradually) is the primary tension pneumothorax warning — do not silence",
        "Tracheal deviation toward left = RIGHT-sided tension (mediastinum pushed away from tension side)",
        "BP falling progressively with rising peak pressures = obstructive physiology",
      ],
      preventionOpportunities: ["ICU protocol for 'sudden high peak pressure + hemodynamic change = tension pneumothorax protocol'"],
      learningObjectives: [
        "Recognize the tension pneumothorax triad: high peak pressure + falling SpO₂ + hemodynamic collapse",
        "Correctly identify the tension side from tracheal deviation (deviation is AWAY from the tension)",
        "Communicate the tension pneumothorax assessment to the team to expedite needle decompression",
        "Apply correct ACLS ventilation during CPR: 8–10/min asynchronous with chest compressions",
      ],
      clinicalPearls: [
        "Tracheal deviation TOWARD left = tension on the RIGHT. The mediastinum is pushed away from the high-pressure side.",
        "Never add PEEP to a suspected tension pneumothorax — it forces more air through the tear.",
        "EtCO₂ during CPR: sudden rise > 40 mmHg = ROSC. This is one of the RT's most valuable contributions during a code.",
        "The RT's peak pressure observation BEFORE arrest is the critical clue — communicate it early.",
      ],
      guidelineReferences: ["AHA ACLS 2020 — Cardiac Arrest in Special Circumstances", "ACLS Pulseless Electrical Activity (PEA) Algorithm"],
    },
    primaryDomains: ["acls_critical_rhythms"],
    estimatedMinutes: 22,
    difficulty: 5,
    requiresCodeBlueDecision: true,
    requiresStemiActivation: false,
    criticalSafetyDecisions: [
      "Tracheal deviation: identify the correct side (deviation away from tension)",
      "Never increase PEEP in suspected tension pneumothorax",
      "Ventilation rate during CPR: 8-10/min, not 20+",
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // NEW GRAD EXPANSIONS
  // ══════════════════════════════════════════════════════════════════════

  {
    id: "ecg-ng-rapid-response-activation",
    title: "When to Activate Rapid Response — Building the Confidence",
    summary: "A post-MI patient's VT alarm fires at 168 BPM. Walk through the pulse check, the rapid response call, and the SBAR communication — building the psychological readiness to act without hesitation.",
    publishStatus: "published",
    targetProfessions: ["new_grad"],
    environment: {
      specialty: "telemetry",
      unitLabel: "Medical-Surgical Telemetry — 6B",
      monitorContext: "central_station",
      timeOfDay: "evening",
      staffingContext: "adequate",
    },
    patient: {
      age: 62,
      sex: "male",
      admissionDiagnosis: "NSTEMI — post-cath day 2",
      admissionReason: "Cardiac monitoring following right coronary intervention",
      relevantHistory: ["HTN", "Diabetes", "Prior PCI 3 years ago"],
      medications: ["Aspirin 81 mg", "Ticagrelor 90 mg BID", "Metoprolol 25 mg BID", "Atorvastatin 80 mg"],
      allergies: ["NKDA"],
      baselineRhythmKey: "normal_sinus_rhythm",
      baselineVitals: { hr: 72, sbp: 122, dbp: 78, spo2: 97, rr: 16, temp: 37.0 },
    },
    rhythmProgression: [
      {
        nodeId: "vt-alarm",
        rhythmKey: "ventricular_tachycardia",
        onsetSeconds: 0,
        vitals: { hr: 168, sbp: 88, spo2: 94 },
        clinicalSigns: ["Central monitor alarm — wide complex tachycardia 168 BPM", "Patient sitting up in bed when nurse enters — confused and diaphoretic", "BP 88/54 — patient says 'I don't feel right'"],
        activeAlarms: ["Wide complex tachycardia — URGENT"],
        riskLevel: "high",
        missableWarnings: [],
        transitions: [
          { targetNodeId: "rrt-called-correctly", trigger: "correct_action", label: "Nurse assessed, called rapid response, stayed at bedside", scoreImpact: 3 },
          { targetNodeId: "nurse-froze", trigger: "no_action", label: "Nurse froze — walked to nursing station to ask for help rather than staying", scoreImpact: -2 },
        ],
      },
      {
        nodeId: "rrt-called-correctly",
        rhythmKey: "ventricular_tachycardia",
        onsetSeconds: 60,
        vitals: { hr: 168, sbp: 84, spo2: 93 },
        clinicalSigns: ["Rapid response team arriving — nurse at bedside throughout", "Crash cart brought to room", "Patient deteriorating — increasingly confused"],
        activeAlarms: [],
        riskLevel: "high",
        missableWarnings: [],
        transitions: [],
      },
      {
        nodeId: "nurse-froze",
        rhythmKey: "ventricular_tachycardia",
        onsetSeconds: 120,
        vitals: { hr: 174, sbp: 72, spo2: 90 },
        clinicalSigns: ["2-minute delay while nurse sought help at station — patient alone", "BP further dropped", "Situation is more urgent now"],
        activeAlarms: ["Critical"],
        riskLevel: "life_threatening",
        missableWarnings: [],
        transitions: [
          { targetNodeId: "rrt-called-correctly", trigger: "correct_action", label: "Rapid response called late", scoreImpact: 1 },
        ],
      },
    ],
    decisionPoints: [
      {
        atNodeId: "vt-alarm",
        decisionType: "escalation",
        stem: "You are a new grad nurse on evening shift. The central monitor alarms for a wide-complex tachycardia at 168 BPM. You go to your patient's room and find him sitting up, confused, and diaphoretic. BP is 88/54. What do you do FIRST?",
        ngnFormat: "mcq",
        options: [
          {
            id: "a",
            text: "Check for a pulse, announce you are calling rapid response, and send your aide to the nursing station while you stay at the bedside",
            correct: true,
            consequenceNodeId: "rrt-called-correctly",
            rationale: "The correct sequence is: (1) assess — pulse check confirms pulsatile VT, (2) activate rapid response from the bedside (use the call light or phone, or send another staff member), (3) STAY AT THE BEDSIDE. A new grad should not be alone with this patient — the team will handle advanced management.",
          },
          {
            id: "b",
            text: "Walk to the nursing station to find your charge nurse and explain the situation before doing anything",
            correct: false,
            consequenceNodeId: "nurse-froze",
            rationale: "Leaving the patient alone with hemodynamically unstable VT to find help at the nursing station wastes critical time and leaves the patient unmonitored. Activate from the bedside or send another person.",
            consequence: "2-minute delay + patient left alone allows hemodynamic deterioration",
          },
          {
            id: "c",
            text: "Administer the ordered PRN metoprolol 25 mg PO to reduce the heart rate",
            correct: false,
            consequenceNodeId: "nurse-froze",
            rationale: "Metoprolol is a rate-controlling agent, not a treatment for VT. Administering an oral beta-blocker in hemodynamically unstable VT delays definitive treatment (cardioversion).",
            safetyFlag: "PRN oral metoprolol for VT at 168/88mmHg is an inappropriate and dangerous action.",
          },
          {
            id: "d",
            text: "Start a 12-lead ECG and wait for the attending to call you back before initiating rapid response",
            correct: false,
            consequenceNodeId: "nurse-froze",
            rationale: "The 12-lead can be obtained by another team member, but should not delay rapid response activation when the patient is already hemodynamically compromised.",
          },
        ],
      },
      {
        atNodeId: "rrt-called-correctly",
        decisionType: "communication",
        stem: "The rapid response team is arriving. They ask: 'What happened?' What is the most effective handoff?",
        ngnFormat: "mcq",
        options: [
          {
            id: "a",
            text: "'Post-MI patient, HR 168 wide complex on monitor, BP 88/54, diaphoretic and confused since I got here 3 minutes ago. Baseline was NSR at 72 this morning. No medications given. Crash cart is in the room.'",
            correct: true,
            consequenceNodeId: "rrt-called-correctly",
            rationale: "This is a clear, structured SBAR-style handoff containing all essential information: who, what changed, vital signs, time course, baseline, interventions, and equipment status. The team can act immediately.",
          },
          {
            id: "b",
            text: "'I don't know what's happening — something is wrong with the monitor!'",
            correct: false,
            consequenceNodeId: "rrt-called-correctly",
            rationale: "This communicates fear but no clinical information. The team cannot act without clinical data.",
          },
          {
            id: "c",
            text: "'He has VT. I think his potassium might be low. Can you check his chart?'",
            correct: false,
            consequenceNodeId: "rrt-called-correctly",
            rationale: "Incomplete — no vital signs, no time course, no baseline. Sending the team to the chart wastes time. The team needs the clinical picture verbally.",
          },
          {
            id: "d",
            text: "'Room 412 — the monitor is alarming. He looks bad. He's on aspirin and metoprolol.'",
            correct: false,
            consequenceNodeId: "rrt-called-correctly",
            rationale: "Vague — 'looks bad' gives no actionable information. No vital signs, no rhythm description, no time course.",
          },
        ],
      },
    ],
    documentationTasks: [
      {
        id: "ng-rrt-doc",
        atNodeId: "rrt-called-correctly",
        taskType: "escalation_documentation",
        prompt: "Document the rapid response event in your nursing note. Include: what you saw, what you did, when you called, who responded.",
        requiredElements: [
          "Time of alarm and rhythm identified",
          "Bedside assessment findings (pulse, BP, symptoms)",
          "Rapid response call time",
          "Team members who responded",
          "Your actions before team arrival",
          "Transfer of care to rapid response team",
        ],
        modelAnswer:
          "1924: Central monitor alarm for wide-complex tachycardia at 168 BPM. At bedside immediately. " +
          "Patient sitting up in bed, confused, diaphoretic, reports 'not feeling right.' " +
          "Pulse palpable but rapid. BP 88/54. SpO₂ 94% on RA. Wide-complex rhythm confirmed at bedside — assessed as VT.\n\n" +
          "1924: Rapid Response activated via call light. " +
          "Aide sent to retrieve crash cart — cart at bedside at 1926.\n\n" +
          "1926: Rapid Response Team (RRT) arrived. Full SBAR report given: patient ID, baseline, current rhythm, vitals, interventions none, crash cart present.\n\n" +
          "1927: Care transferred to RRT — RN [name] assumed lead. I remained in room to assist per RRT direction.",
      },
    ],
    debrief: {
      clinicalNarrative:
        "One of the most challenging moments in a new graduate's career is recognizing when a situation is beyond your current skill set and activating the right team — and then staying calm enough to give a clear handoff. This simulation teaches the two-second assessment (pulse check → rapid response call) and the structured SBAR handoff that allows the team to act immediately. Staying at the bedside, not going to find help, is the critical behavioral lesson.",
      missedWarnings: [
        "Choosing an oral medication (metoprolol PO) for hemodynamically unstable VT delays the only effective intervention — cardioversion",
        "Walking to the nursing station to find help leaves the patient alone and wastes 2+ minutes — activate from the bedside or delegate",
      ],
      preventionOpportunities: [],
      learningObjectives: [
        "Apply the correct sequence for wide-complex tachycardia with hemodynamic compromise: pulse check → activate rapid response from bedside → stay at bedside → structured handoff",
        "Deliver a structured SBAR handoff to the rapid response team under stress",
        "Recognize that your role in a rapid response is to assess, activate, stay, and hand off — not to manage the arrhythmia independently",
        "Document the rapid response event accurately including timeline and team communication",
      ],
      clinicalPearls: [
        "Stay at the bedside. Send another person to call for help or use the call light. Never leave a hemodynamically unstable patient alone.",
        "Your handoff takes 20 seconds and must include: who, what rhythm, vital signs, time course, and baseline.",
        "A new grad activating rapid response for VT at 168/88mmHg is the correct clinical judgment — not a sign of weakness.",
        "The rapid response team's job is to take over management; your job is to give them the information they need to start immediately.",
      ],
      guidelineReferences: ["ACLS Provider Manual 2020 — Wide Complex Tachycardia Algorithm"],
    },
    primaryDomains: ["rhythm_recognition", "acls_critical_rhythms"],
    estimatedMinutes: 18,
    difficulty: 3,
    requiresCodeBlueDecision: false,
    requiresStemiActivation: false,
    criticalSafetyDecisions: ["Stay at the bedside — never leave an unstable patient alone to seek help elsewhere"],
  },

];

/**
 * Returns the expansion record for a given simulation ID, or undefined if not expanded.
 * Used by the catalog to override skeleton entries with complete content.
 */
export function getSimulationExpansion(id: string): EcgSimulationRecord | undefined {
  return ECG_SIMULATION_EXPANSIONS.find((s) => s.id === id);
}

export const EXPANDED_SIMULATION_IDS: ReadonlySet<string> = new Set(
  ECG_SIMULATION_EXPANSIONS.map((s) => s.id),
);
