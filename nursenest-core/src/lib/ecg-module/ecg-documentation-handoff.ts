/**
 * ECG Documentation and Handoff Module — Phase 2
 *
 * Provides structured documentation templates and SBAR communication
 * exercises for ECG-related clinical events.
 *
 * Used by:
 *   - Simulation engine (documentation task rendering)
 *   - NGN clinical judgment cases (documentation format questions)
 *   - Learner skill-building exercises
 *
 * CLINICAL ACCURACY
 *   All documentation templates align with Joint Commission requirements,
 *   AHA ACLS documentation standards, and SBAR communication frameworks.
 */

// ─── SBAR templates ────────────────────────────────────────────────────────────

export type SbarTemplate = {
  id: string;
  title: string;
  rhythmKeys: ReadonlyArray<string>;
  /** Clinical scenario for which this SBAR is used */
  scenario: string;
  situationTemplate: string;
  backgroundTemplate: string;
  assessmentTemplate: string;
  recommendationTemplate: string;
  /** Required elements that must appear in a complete SBAR for this scenario */
  requiredElements: ReadonlyArray<string>;
  /** Model answer for teaching/debrief */
  modelAnswer: string;
  /** Common SBAR errors for this scenario */
  commonErrors: ReadonlyArray<string>;
};

export const ECG_SBAR_TEMPLATES: ReadonlyArray<SbarTemplate> = [
  {
    id: "sbar-new-afib",
    title: "SBAR — New-Onset Atrial Fibrillation",
    rhythmKeys: ["atrial_fibrillation"],
    scenario: "A client on a medical unit develops new-onset AFib while under telemetry monitoring.",
    situationTemplate:
      "Dr./NP [name], this is [your name], RN on [unit]. I am calling about [client name] in room [number]. " +
      "I am reporting a new rhythm change — the client appears to be in atrial fibrillation at [rate] BPM.",
    backgroundTemplate:
      "The client is a [age]-year-old [sex] admitted for [diagnosis]. " +
      "Baseline rhythm on admission was [baseline rhythm]. " +
      "Relevant history includes [PMH]. " +
      "Current medications include [medications, specifically any rate-controlling or anticoagulant agents].",
    assessmentTemplate:
      "Current vital signs: HR [rate], BP [BP], SpO₂ [%], RR [rate]. " +
      "The client [is/is not] symptomatic — [specific symptoms or 'no complaints']. " +
      "I am concerned about [hemodynamic instability/stroke risk/rate control need].",
    recommendationTemplate:
      "I am requesting [assessment/orders for rate control/anticoagulation assessment/cardioversion preparation]. " +
      "Should I [specific action — prepare adenosine/apply pads/obtain additional ECG leads]?",
    requiredElements: [
      "Rhythm identification (atrial fibrillation)",
      "Current ventricular rate",
      "Hemodynamic status (BP, symptoms)",
      "Relevant cardiac history",
      "Current medications (especially cardiac)",
      "Specific recommendation request",
    ],
    modelAnswer:
      "S: Dr. [Name], this is RN [Name] calling from Unit 4B about Mr. Chen in room 412. " +
      "He has developed a new irregular rhythm at 132 BPM — I believe this is new atrial fibrillation.\n\n" +
      "B: Mr. Chen is a 68-year-old male admitted 2 days ago for pneumonia. " +
      "His baseline rhythm on admission was NSR at 88. He has a history of hypertension and type 2 diabetes. " +
      "His metoprolol was held this morning due to borderline-low BP. " +
      "He is not currently on anticoagulation.\n\n" +
      "A: Current vital signs: HR 132 irregular, BP 108/70 (down from 122/78 this morning), " +
      "SpO₂ 94% on 2L, RR 20. He reports palpitations and mild shortness of breath. " +
      "I'm concerned about hemodynamic impact from the rapid ventricular response and his anticoagulation status.\n\n" +
      "R: I'm requesting orders for rate control and anticoagulation assessment. " +
      "Should I obtain a 12-lead ECG stat and prepare for IV rate control?",
    commonErrors: [
      "Reporting only the heart rate number without naming the rhythm",
      "Omitting hemodynamic status (BP is essential for the provider's decision)",
      "Failing to mention anticoagulation status (critical for cardioversion decision)",
      "Recommending a specific medication without provider order or assessment",
    ],
  },
  {
    id: "sbar-vt-emergency",
    title: "SBAR — Sustained VT Emergency (Rapid Response Call)",
    rhythmKeys: ["ventricular_tachycardia"],
    scenario: "A client on a step-down unit develops pulsatile sustained VT at 172 BPM with hemodynamic compromise.",
    situationTemplate:
      "RAPID RESPONSE: [your name], RN on [unit]. I need immediate assistance at [room number] for [client name]. " +
      "Wide-complex tachycardia on the monitor at [rate] BPM. " +
      "Patient [status — diaphoretic/hypotensive/altered mentation/pulse present or absent].",
    backgroundTemplate:
      "Client is [age]-year-old [sex], admitted for [diagnosis]. [Cardiac history]. Baseline rhythm: [rhythm].",
    assessmentTemplate:
      "Vital signs: HR [rate], BP [BP], SpO₂ [%]. Client [is/is not] responsive. " +
      "Peripheral pulse [palpable/absent]. I believe this is [pulsatile VT/pulseless VT].",
    recommendationTemplate:
      "I have [called the code/activated rapid response/applied pads/started CPR]. " +
      "Requesting [immediate assessment/cardioversion/crash cart].",
    requiredElements: [
      "Rhythm type (wide-complex tachycardia/VT)",
      "Rate",
      "Pulse present or absent",
      "Blood pressure",
      "Mental status",
      "Actions already taken",
    ],
    modelAnswer:
      "RAPID RESPONSE PAGE: This is RN [Name] calling from 5C — I need rapid response to room 512 NOW.\n\n" +
      "S: I have a 64-year-old male in wide-complex tachycardia at 168 BPM. " +
      "He is diaphoretic and confused. BP is 78/50.\n\n" +
      "B: Post-MI day 2, EF 32%. Baseline NSR.\n\n" +
      "A: Peripheral pulse is weak but present. I believe this is pulsatile VT with hemodynamic instability.\n\n" +
      "R: I have applied defibrillation pads and called rapid response. " +
      "I need immediate assessment and authorization for synchronized cardioversion.",
    commonErrors: [
      "Forgetting to state pulse status (determines cardioversion vs. CPR)",
      "Saying 'fast heartbeat' instead of naming the rhythm type (wide-complex or VT)",
      "Not stating actions already completed before the call",
    ],
  },
  {
    id: "sbar-stemi-alert",
    title: "SBAR — STEMI Alert Activation",
    rhythmKeys: ["stemi_pattern"],
    scenario: "An emergency nurse recognizes inferior STEMI on a 12-lead ECG and activates the STEMI alert.",
    situationTemplate:
      "STEMI ALERT: This is RN [name] in the emergency department. I have a STEMI. " +
      "[Client description]. 12-lead shows [ST elevation description] in [leads]. Time of ECG: [time].",
    backgroundTemplate:
      "[Age]-year-old [sex], [symptoms and onset]. [Risk factors]. " +
      "No prior cardiac history OR [prior history]. Last known well: [time].",
    assessmentTemplate:
      "Vital signs: HR [rate], BP [BP], SpO₂ [%]. " +
      "Client [is/is not] in pain [rating]. Hemodynamically [stable/unstable].",
    recommendationTemplate:
      "Requesting cath lab activation. I have [aspirin given/IV access/anticoagulation ordered]. " +
      "[Right-sided leads status — obtained/pending]. Nitroglycerin [given/withheld — reason].",
    requiredElements: [
      "Time of ECG (DTB clock start)",
      "Lead territory of ST elevation",
      "Reciprocal changes noted",
      "Aspirin given",
      "Right-sided lead status (for inferior STEMI)",
      "Nitroglycerin status with rationale if withheld",
      "Cath lab activation confirmation",
    ],
    modelAnswer:
      "STEMI ALERT — 1342:\n\n" +
      "S: Cardiologist on call, this is ED RN [Name]. I have an inferior STEMI. " +
      "12-lead shows 3mm ST elevation in II, III, aVF with reciprocal depression in I and aVL. " +
      "Time of ECG: 1342.\n\n" +
      "B: 62-year-old male, 45-minute history of crushing chest pressure radiating to jaw. " +
      "Smoker, hypertension, hyperlipidemia. No prior cardiac history.\n\n" +
      "A: HR 58, BP 138/88, SpO₂ 97%. Diaphoretic. Pain 9/10. Hemodynamically stable.\n\n" +
      "R: STEMI alert activated. Aspirin 325 mg given. IV access × 2. " +
      "Right-sided leads in progress. Nitroglycerin WITHHELD pending right-sided leads " +
      "(HR 58 + inferior STEMI = possible RV MI). Requesting cath lab activation — ETA?",
    commonErrors: [
      "Not stating the time of ECG (D2B calculation starts here)",
      "Giving nitroglycerin before right-sided leads in inferior STEMI",
      "Saying 'abnormal ECG' instead of 'STEMI'",
      "Waiting for troponin results before activating",
    ],
  },
  {
    id: "sbar-rosc-icu-transfer",
    title: "SBAR — Post-ROSC ICU Transfer Handoff",
    rhythmKeys: ["ventricular_fibrillation", "normal_sinus_rhythm"],
    scenario: "Transferring a post-cardiac arrest patient from the floor to the ICU after ROSC.",
    situationTemplate:
      "ICU team, this is [name], RN on [unit]. I am transferring [client name], " +
      "who had a [VF/pulseless VT] cardiac arrest at [time]. ROSC achieved at [time].",
    backgroundTemplate:
      "[PMH, baseline rhythm, reason for admission]. " +
      "Code team composition. Interventions during code: [CPR duration, shocks × number, medications].",
    assessmentTemplate:
      "Current status: HR [rate] in [rhythm], BP [BP], SpO₂ [%] on [O₂ delivery], GCS [score]. " +
      "Temperature [temp]. Last 12-lead: [findings — STEMI present/absent].",
    recommendationTemplate:
      "Priority actions: [12-lead/STEMI workup/TTM consideration/neurological assessment/continuous monitoring]. " +
      "Current medications: [vasopressors, antiarrhythmics]. Family [at bedside/notified/en route].",
    requiredElements: [
      "Arrest time and ROSC time",
      "Type of arrest rhythm",
      "Interventions during code (shocks, medications, CPR duration)",
      "Current vital signs and rhythm",
      "Post-ROSC 12-lead ECG findings",
      "GCS and neurological status",
      "Temperature (TTM assessment)",
      "Priority next actions",
    ],
    modelAnswer:
      "S: ICU team, this is RN [Name] from 6B. I'm transferring Ms. Johnson who had a VF cardiac arrest " +
      "at 0218 with ROSC at 0221 — 3 minutes of arrest time.\n\n" +
      "B: 58-year-old female, admitted for NSTEMI. Baseline NSR. " +
      "Code interventions: CPR × 2 cycles, 1 shock (200 J biphasic), epinephrine 1 mg × 1.\n\n" +
      "A: Currently in sinus tachycardia at 106, BP 92/58 on norepinephrine 0.08 mcg/kg/min, " +
      "SpO₂ 95% on 100% NRB. GCS 8 (E2V2M4). Temp 36.9°C. " +
      "Post-ROSC 12-lead: no STEMI pattern — diffuse ST depression consistent with demand ischemia.\n\n" +
      "R: Priority actions: (1) Cardiology consult for post-ROSC management, " +
      "(2) Targeted temperature management assessment (GCS 8, comatose), " +
      "(3) Continuous invasive hemodynamic monitoring, " +
      "(4) Neuro assessment q1h. Family notified — will arrive within 30 minutes.",
    commonErrors: [
      "Omitting ROSC time (duration of arrest is critical for neurological prognosis)",
      "Not mentioning temperature (TTM window is 4–6 hours post-ROSC)",
      "Failing to state the post-ROSC ECG findings (STEMI present/absent changes next steps completely)",
    ],
  },
];

// ─── Rhythm documentation templates ───────────────────────────────────────────

export type RhythmDocumentationTemplate = {
  id: string;
  title: string;
  rhythmKey: string;
  documentationType: "routine" | "urgent" | "emergency" | "code";
  template: string;
  requiredElements: ReadonlyArray<string>;
  modelAnswer: string;
};

export const ECG_DOCUMENTATION_TEMPLATES: ReadonlyArray<RhythmDocumentationTemplate> = [
  {
    id: "doc-afib-new-onset",
    title: "New-Onset AFib Nursing Note",
    rhythmKey: "atrial_fibrillation",
    documentationType: "urgent",
    template:
      "[Date/Time]: Telemetry monitor alarming for rhythm change. " +
      "Assessment: [patient status]. Rhythm: [rhythm description, rate]. " +
      "Vital signs: HR [rate], BP [BP], SpO₂ [%]. " +
      "Provider notification: [provider name], time [time], response [orders]. " +
      "Interventions: [actions taken]. Patient response: [response]. Plan: [plan].",
    requiredElements: [
      "Time of rhythm change",
      "Rhythm name and rate description",
      "Patient symptoms/status",
      "Vital signs at time of recognition",
      "Provider notification (name, time, orders received)",
      "Nursing interventions performed",
      "Plan and monitoring frequency",
    ],
    modelAnswer:
      "1436: Telemetry alarm — new rhythm change identified. Nurse at bedside immediately. " +
      "Client alert, reports palpitations and mild shortness of breath. " +
      "Rhythm: irregularly irregular at 128 BPM, consistent with atrial fibrillation — no organized P waves. " +
      "VS: HR 128 irregular, BP 106/68 (baseline 124/80), SpO₂ 94% on 2L NC, RR 20. " +
      "Dr. [Name] notified at 1438: new order for diltiazem 0.25 mg/kg IV received and administered at 1444. " +
      "Rate decreased to 88 BPM by 1500. BP 114/72. SpO₂ 96%. " +
      "Repeat 12-lead obtained at 1440 — no ST changes. " +
      "Continue monitoring q1h. Anticoagulation status discussed with provider.",
  },
  {
    id: "doc-stemi-event",
    title: "STEMI Event Documentation",
    rhythmKey: "stemi_pattern",
    documentationType: "emergency",
    template:
      "[Time]: 12-lead ECG obtained for [indication]. " +
      "Findings: ST elevation [magnitude] mm in [leads]; reciprocal [changes]. " +
      "STEMI alert activated [time]. [Provider] notified at [time]. " +
      "Medications given: [list with doses, routes, times]. " +
      "Right-sided leads: [obtained/not obtained, findings]. " +
      "Nitroglycerin: [given/withheld, reason]. " +
      "Cath lab ETA: [time]. Transfer: [time].",
    requiredElements: [
      "Time of ECG (D2B start)",
      "ST elevation description (leads, magnitude)",
      "STEMI alert activation time",
      "Aspirin documentation",
      "Right-sided lead status",
      "Nitroglycerin given or withheld with rationale",
      "Anticoagulation (type, dose, time)",
      "Cath lab transfer time",
    ],
    modelAnswer:
      "1342: 12-lead ECG obtained for chest pain complaint at rest. " +
      "Findings: ST elevation 2–3 mm in leads II, III, aVF; reciprocal ST depression in leads I, aVL. " +
      "Rhythm: sinus bradycardia, HR 58. Inferior STEMI pattern.\n" +
      "1342: STEMI alert activated. Interventional cardiology (Dr. [Name]) notified.\n" +
      "1344: Aspirin 325 mg PO (chewed), client tolerated without issue.\n" +
      "1344: Right-sided ECG leads obtained — V4R shows ST elevation 1.5 mm (RV MI confirmed).\n" +
      "1345: Nitroglycerin WITHHELD — RV MI confirmed on right-sided leads. " +
      "Provider informed and confirmed hold order.\n" +
      "1346: IV access × 2 (18G bilateral AC). Heparin 60 units/kg IV bolus per ACS protocol.\n" +
      "1348: Client transferred to cath lab. Door-to-balloon time clock: 1342–transfer 1348 = 6 min floor time.",
  },
  {
    id: "doc-code-blue",
    title: "Code Blue Documentation",
    rhythmKey: "ventricular_fibrillation",
    documentationType: "code",
    template:
      "[Time]: [Arrest recognition]. CPR initiated [time]. Code Blue called [time]. " +
      "Initial rhythm: [rhythm]. Interventions: [list with times]. " +
      "ROSC [time] or No ROSC. Post-arrest disposition: [plan].",
    requiredElements: [
      "Time of arrest recognition",
      "CPR initiation time",
      "Initial rhythm",
      "Each defibrillation (time, energy, synchronization mode)",
      "Each medication (name, dose, route, time)",
      "ROSC time (if achieved)",
      "Post-ROSC disposition",
    ],
    modelAnswer:
      "CODE BLUE DOCUMENTATION — INITIATED 0218\n\n" +
      "0218: Telemetry alarm — patient unresponsive. No carotid pulse. Code Blue called.\n" +
      "0218: CPR initiated by [Name], RN. High-quality compressions 100–120/min at 5–6 cm depth.\n" +
      "0218: Rhythm identified: ventricular fibrillation.\n" +
      "0219: Defibrillator charged — UNSYNCHRONIZED defibrillation 200 J delivered. " +
      "CPR immediately resumed.\n" +
      "0219: Epinephrine 1 mg IV push via right AC (confirmed patent IV).\n" +
      "0221: 2-minute CPR cycle complete. Rhythm check: sinus tachycardia. Carotid pulse palpable.\n" +
      "0221: ROSC achieved. HR 108, BP 90/58, SpO₂ 93% on 100% BVM.\n" +
      "0222: Post-ROSC 12-lead obtained — no STEMI. Cardiology and ICU notified.\n" +
      "0225: Patient transferred to ICU. GCS 7. Temperature 37.1°C.\n" +
      "CPR quality: continuous, no pause > 5s. Compression fraction estimated > 80%.",
  },
];

// ─── Accessor functions ────────────────────────────────────────────────────────

export function getSbarTemplate(id: string): SbarTemplate | undefined {
  return ECG_SBAR_TEMPLATES.find((t) => t.id === id);
}

export function getDocumentationTemplate(id: string): RhythmDocumentationTemplate | undefined {
  return ECG_DOCUMENTATION_TEMPLATES.find((t) => t.id === id);
}

export function getSbarTemplatesForRhythm(rhythmKey: string): ReadonlyArray<SbarTemplate> {
  return ECG_SBAR_TEMPLATES.filter((t) => t.rhythmKeys.includes(rhythmKey));
}

export const SBAR_TEMPLATE_IDS: ReadonlyArray<string> = ECG_SBAR_TEMPLATES.map((t) => t.id);
export const DOCUMENTATION_TEMPLATE_IDS: ReadonlyArray<string> = ECG_DOCUMENTATION_TEMPLATES.map((t) => t.id);
