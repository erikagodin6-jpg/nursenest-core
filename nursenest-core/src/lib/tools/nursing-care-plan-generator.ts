export type NursingCarePlanRole = "rn" | "rpn-lpn" | "np";

export type NursingCareSetting =
  | "medical-surgical"
  | "icu"
  | "emergency"
  | "pediatrics"
  | "maternal-child"
  | "mental-health"
  | "community"
  | "long-term-care"
  | "rehabilitation";

export type NursingCarePriorityLevel = "stable" | "moderate-acuity" | "high-acuity" | "critical";

export type NursingCarePlanInput = {
  role: NursingCarePlanRole;
  demographics: {
    age: string;
    sex: string;
    weight: string;
    medicalDiagnosis: string;
    surgicalDiagnosis: string;
    comorbidities: string;
  };
  clinicalData: {
    vitalSigns: string;
    laboratoryValues: string;
    assessmentFindings: string;
    symptoms: string;
    currentMedications: string;
    allergies: string;
  };
  careSetting: NursingCareSetting;
  priorityLevel: NursingCarePriorityLevel;
  examPrepMode: boolean;
  learningMode: boolean;
};

export type CarePlanIntervention = {
  action: string;
  rationale: string;
};

export type NursingDiagnosisPlan = {
  rank: number;
  problem: string;
  relatedTo: string;
  asEvidencedBy: string;
  priorityReason: string;
  shortTermGoals: string[];
  longTermGoals: string[];
  independentInterventions: CarePlanIntervention[];
  collaborativeInterventions: CarePlanIntervention[];
  evaluation: {
    goalMet: string[];
    partiallyMet: string[];
    notMet: string[];
  };
};

export type ComplicationWatchItem = {
  warningSign: string;
  whyItMatters: string;
  immediateNursingResponse: string;
};

export type NursingCarePlanOutput = {
  patientSummary: string;
  diagnoses: NursingDiagnosisPlan[];
  patientEducation: {
    diseaseEducation: string[];
    medicationTeaching: string[];
    dischargeTeaching: string[];
    safetyTeaching: string[];
    selfManagementTeaching: string[];
  };
  clinicalReasoning: {
    priorityFramework: string;
    abcReasoning: string;
    maslowReasoning: string;
    safetyRisks: string[];
    deteriorationRisks: string[];
    potentialComplications: string[];
  };
  complicationWatch: ComplicationWatchItem[];
  sbar: {
    situation: string;
    background: string;
    assessment: string;
    recommendation: string;
  };
  examPrep?: {
    clinicalPearls: string[];
    commonExamTraps: string[];
    priorityNursingActions: string[];
    delegationConsiderations: string[];
    patientSafetyAlerts: string[];
  };
  learning?: {
    pathophysiologySummary: string;
    nursingConsiderations: string[];
    pharmacologyConsiderations: string[];
    priorityAssessments: string[];
    redFlags: string[];
  };
};

type Signal =
  | "respiratory"
  | "cardiac"
  | "infection"
  | "pain"
  | "fluid"
  | "glucose"
  | "neuro"
  | "mobility"
  | "skin"
  | "mental"
  | "knowledge";

type DiagnosisTemplate = {
  signal: Signal;
  problem: string;
  relatedTo: string;
  asEvidencedBy: string;
  priorityReason: string;
  shortTermGoals: string[];
  longTermGoals: string[];
  independentInterventions: CarePlanIntervention[];
  collaborativeInterventions: CarePlanIntervention[];
  evaluation: NursingDiagnosisPlan["evaluation"];
  priority: number;
};

const SETTING_LABELS: Record<NursingCareSetting, string> = {
  "medical-surgical": "medical-surgical",
  icu: "ICU",
  emergency: "emergency",
  pediatrics: "pediatric",
  "maternal-child": "maternal-child",
  "mental-health": "mental health",
  community: "community",
  "long-term-care": "long-term care",
  rehabilitation: "rehabilitation",
};

const PRIORITY_LABELS: Record<NursingCarePriorityLevel, string> = {
  stable: "stable",
  "moderate-acuity": "moderate acuity",
  "high-acuity": "high acuity",
  critical: "critical",
};

export function generateNursingCarePlan(input: NursingCarePlanInput): NursingCarePlanOutput {
  const context = buildContext(input);
  const signals = detectSignals(context);
  const diagnoses = selectDiagnoses(input, context, signals);

  return {
    patientSummary: buildPatientSummary(input, context, diagnoses),
    diagnoses,
    patientEducation: buildPatientEducation(input, signals),
    clinicalReasoning: buildClinicalReasoning(input, signals, diagnoses),
    complicationWatch: buildComplicationWatch(input, signals),
    sbar: buildSbar(input, context, diagnoses),
    examPrep: input.examPrepMode ? buildExamPrep(input, signals, diagnoses) : undefined,
    learning: input.learningMode ? buildLearningMode(input, signals) : undefined,
  };
}

export function formatCarePlanForCopy(plan: NursingCarePlanOutput): string {
  const lines: string[] = [];
  lines.push("Nursing Care Plan");
  lines.push("");
  lines.push("Patient Summary");
  lines.push(plan.patientSummary);
  lines.push("");

  for (const diagnosis of plan.diagnoses) {
    lines.push(`${diagnosis.rank}. ${diagnosis.problem}`);
    lines.push(`Related To: ${diagnosis.relatedTo}`);
    lines.push(`As Evidenced By: ${diagnosis.asEvidencedBy}`);
    lines.push(`Priority Reason: ${diagnosis.priorityReason}`);
    lines.push("Short-Term Goals:");
    diagnosis.shortTermGoals.forEach((goal) => lines.push(`- ${goal}`));
    lines.push("Long-Term Goals:");
    diagnosis.longTermGoals.forEach((goal) => lines.push(`- ${goal}`));
    lines.push("Independent Nursing Interventions:");
    diagnosis.independentInterventions.forEach((item) => {
      lines.push(`- Intervention: ${item.action}`);
      lines.push(`  Rationale: ${item.rationale}`);
    });
    lines.push("Collaborative Interventions:");
    diagnosis.collaborativeInterventions.forEach((item) => {
      lines.push(`- Intervention: ${item.action}`);
      lines.push(`  Rationale: ${item.rationale}`);
    });
    lines.push("");
  }

  lines.push("Clinical Reasoning");
  lines.push(plan.clinicalReasoning.priorityFramework);
  lines.push(plan.clinicalReasoning.abcReasoning);
  lines.push(plan.clinicalReasoning.maslowReasoning);
  lines.push("");
  lines.push("SBAR");
  lines.push(`Situation: ${plan.sbar.situation}`);
  lines.push(`Background: ${plan.sbar.background}`);
  lines.push(`Assessment: ${plan.sbar.assessment}`);
  lines.push(`Recommendation: ${plan.sbar.recommendation}`);

  return lines.join("\n");
}

function buildContext(input: NursingCarePlanInput) {
  const raw = [
    input.demographics.medicalDiagnosis,
    input.demographics.surgicalDiagnosis,
    input.demographics.comorbidities,
    input.clinicalData.vitalSigns,
    input.clinicalData.laboratoryValues,
    input.clinicalData.assessmentFindings,
    input.clinicalData.symptoms,
    input.clinicalData.currentMedications,
    input.clinicalData.allergies,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    raw,
    normalized: raw.toLowerCase(),
    findings: compactList([input.clinicalData.symptoms, input.clinicalData.assessmentFindings, input.clinicalData.vitalSigns, input.clinicalData.laboratoryValues]).join("; "),
    diagnosisLabel: input.demographics.medicalDiagnosis || input.demographics.surgicalDiagnosis || "the stated clinical condition",
  };
}

function detectSignals(context: ReturnType<typeof buildContext>): Signal[] {
  const text = context.normalized;
  const signals: Signal[] = [];
  addSignal(signals, "respiratory", text, ["dyspnea", "shortness of breath", "spo2", "hypoxia", "oxygen", "pneumonia", "copd", "asthma", "respiratory", "wheeze"]);
  addSignal(signals, "cardiac", text, ["chest pain", "heart failure", "acs", "mi", "troponin", "edema", "dysrhythmia", "tachycardia", "bradycardia", "hypertension"]);
  addSignal(signals, "infection", text, ["sepsis", "infection", "fever", "wbc", "lactate", "purulent", "cellulitis", "pneumonia", "uti"]);
  addSignal(signals, "pain", text, ["pain", "post-op", "postoperative", "surgery", "fracture", "incision", "burn"]);
  addSignal(signals, "fluid", text, ["vomiting", "diarrhea", "dehydration", "bleeding", "hypotension", "creatinine", "bun", "electrolyte", "sodium", "potassium", "hgb", "hemoglobin"]);
  addSignal(signals, "glucose", text, ["diabetes", "dka", "insulin", "glucose", "hypoglycemia", "hyperglycemia", "a1c"]);
  addSignal(signals, "neuro", text, ["stroke", "seizure", "confusion", "weakness", "slurred", "headache", "altered mental", "gcs"]);
  addSignal(signals, "mobility", text, ["fall", "weakness", "immobility", "rehab", "fracture", "transfer", "gait"]);
  addSignal(signals, "skin", text, ["wound", "incision", "pressure", "ulcer", "skin", "drainage"]);
  addSignal(signals, "mental", text, ["anxiety", "depression", "suicide", "psychosis", "panic", "substance", "mental health"]);
  if (signals.length < 3) signals.push("knowledge");
  return unique(signals).slice(0, 6);
}

function addSignal(signals: Signal[], signal: Signal, text: string, needles: string[]) {
  if (needles.some((needle) => text.includes(needle))) signals.push(signal);
}

function selectDiagnoses(input: NursingCarePlanInput, context: ReturnType<typeof buildContext>, signals: Signal[]): NursingDiagnosisPlan[] {
  const templates = buildDiagnosisTemplates(input, context);
  const selected = templates
    .filter((template) => signals.includes(template.signal) || template.signal === "knowledge")
    .sort((a, b) => a.priority - b.priority);

  const required = selected.length >= 3 ? selected : [...selected, ...templates.filter((template) => !selected.includes(template))];
  const limit = input.priorityLevel === "stable" ? 3 : input.priorityLevel === "moderate-acuity" ? 4 : 5;

  return required.slice(0, limit).map((template, index) => ({
    rank: index + 1,
    problem: template.problem,
    relatedTo: template.relatedTo,
    asEvidencedBy: template.asEvidencedBy,
    priorityReason: template.priorityReason,
    shortTermGoals: template.shortTermGoals,
    longTermGoals: template.longTermGoals,
    independentInterventions: enforceInterventionMinimum(template.independentInterventions, commonIndependentInterventions(input), 5),
    collaborativeInterventions: enforceInterventionMinimum(template.collaborativeInterventions, commonCollaborativeInterventions(input), 3),
    evaluation: template.evaluation,
  }));
}

function buildDiagnosisTemplates(input: NursingCarePlanInput, context: ReturnType<typeof buildContext>): DiagnosisTemplate[] {
  const evidence = evidenceFrom(context);
  const roleScope = scopePhrase(input.role);
  return [
    {
      signal: "respiratory",
      problem: "Impaired Gas Exchange",
      relatedTo: "ventilation-perfusion imbalance and increased work of breathing",
      asEvidencedBy: evidence("oxygenation concerns, respiratory symptoms, abnormal lung assessment findings, or oxygen requirement"),
      priorityReason: "Breathing is an ABC priority because worsening gas exchange can rapidly progress to respiratory failure.",
      shortTermGoals: [
        "Patient will maintain oxygen saturation within the ordered target range within 4 hours.",
        "Patient will report decreased shortness of breath within the current shift.",
      ],
      longTermGoals: [
        "Patient will demonstrate stable respiratory status with reduced work of breathing before discharge or transfer.",
        "Patient will verbalize when to seek help for worsening respiratory symptoms before discharge teaching is complete.",
      ],
      independentInterventions: [
        intervention("Assess respiratory rate, work of breathing, lung sounds, oxygen saturation, and mental status at least every 2-4 hours or more often if unstable.", "Respiratory deterioration can appear first as increased work of breathing, declining saturation, or new confusion before severe distress is obvious."),
        intervention("Position in high Fowler's or the most comfortable upright position unless contraindicated.", "Upright positioning improves lung expansion, decreases diaphragmatic pressure, and can reduce the sensation of dyspnea."),
        intervention("Coach slow breathing, coughing, splinting, and incentive spirometry when appropriate for the diagnosis and surgical status.", "These measures promote ventilation, secretion clearance, and prevention of atelectasis while maintaining patient participation."),
        intervention("Cluster care and allow rest periods during episodes of dyspnea.", "Reducing oxygen demand helps prevent fatigue and supports recovery during respiratory compromise."),
        intervention("Trend oxygen needs against symptoms instead of relying on a single saturation reading.", "A rising oxygen requirement or worsening distress at the same saturation may indicate clinical decline."),
      ],
      collaborativeInterventions: [
        intervention(`Administer oxygen, bronchodilators, antibiotics, diuretics, or other prescribed therapies within ${roleScope}.`, "Ordered therapies address reversible causes of impaired oxygenation such as bronchospasm, infection, fluid overload, or inflammation."),
        intervention("Notify the provider or rapid response team for escalating oxygen needs, severe distress, cyanosis, or altered level of consciousness.", "Timely escalation prevents delayed treatment of respiratory failure."),
        intervention("Collaborate with respiratory therapy for oxygen delivery changes, airway clearance support, arterial blood gas review, or noninvasive ventilation needs.", "Respiratory therapy support helps match intervention intensity to the patient's oxygenation and ventilation status."),
      ],
      evaluation: evaluationFor("oxygen saturation remains in target range, breathing effort improves, and the patient can speak or mobilize with less dyspnea", "oxygenation improves but symptoms or oxygen needs persist", "oxygenation worsens, work of breathing increases, or urgent escalation is required"),
      priority: 10,
    },
    {
      signal: "cardiac",
      problem: "Decreased Cardiac Output",
      relatedTo: "altered cardiac function, impaired contractility, rhythm disturbance, or increased cardiac workload",
      asEvidencedBy: evidence("abnormal heart rate or blood pressure, chest discomfort, edema, fatigue, perfusion changes, or relevant cardiac markers"),
      priorityReason: "Circulation is an ABC priority because impaired cardiac output threatens perfusion to the brain, kidneys, and other vital organs.",
      shortTermGoals: [
        "Patient will maintain blood pressure, heart rate, urine output, and mentation within ordered or expected parameters during the shift.",
        "Patient will report no worsening chest discomfort, dizziness, or new shortness of breath within 4 hours.",
      ],
      longTermGoals: [
        "Patient will demonstrate stable perfusion without preventable deterioration before discharge or transfer.",
        "Patient will explain key warning signs that require urgent medical attention before discharge.",
      ],
      independentInterventions: [
        intervention("Monitor heart rate, blood pressure, peripheral pulses, capillary refill, mentation, edema, and urine output on a scheduled and PRN basis.", "Perfusion trends reveal whether the heart is meeting metabolic demand and whether deterioration is developing."),
        intervention("Assess chest pain characteristics, associated symptoms, and response to rest or prescribed therapy.", "Changes in pain pattern, diaphoresis, nausea, or dyspnea may indicate ischemia or worsening cardiac stress."),
        intervention("Maintain activity pacing and rest periods based on symptoms and hemodynamic response.", "Balancing activity with cardiac tolerance prevents excess myocardial workload."),
        intervention("Monitor intake, output, daily weight when ordered, and signs of fluid overload or deficit.", "Fluid status directly affects preload, cardiac workload, and perfusion."),
        intervention("Keep emergency equipment accessible when the patient has unstable rhythm, chest pain, or high acuity findings.", "Preparedness reduces response time if the patient deteriorates."),
      ],
      collaborativeInterventions: [
        intervention(`Administer prescribed cardiac medications, fluids, oxygen, diuretics, anticoagulants, or analgesics within ${roleScope}.`, "Medication and fluid strategies support perfusion, reduce workload, or treat the underlying cardiac problem."),
        intervention("Obtain or prepare for ECG, cardiac enzymes, telemetry, or imaging as ordered and escalate abnormal changes promptly.", "Objective cardiac data guides timely diagnosis and treatment decisions."),
        intervention("Collaborate with the provider, rapid response team, pharmacy, and cardiology for worsening perfusion, chest pain, or unstable rhythm.", "Interprofessional management is required when circulation is threatened."),
      ],
      evaluation: evaluationFor("perfusion markers remain stable, symptoms improve, and no new ischemic or rhythm concerns appear", "some perfusion markers improve but monitoring or therapy changes are still needed", "hypotension, chest pain, altered mentation, low urine output, or rhythm instability persists"),
      priority: 15,
    },
    {
      signal: "infection",
      problem: "Risk For Shock",
      relatedTo: "suspected or confirmed infection with potential systemic inflammatory response",
      asEvidencedBy: evidence("fever, abnormal white blood cell count, elevated lactate, hypotension, tachycardia, source of infection, or acute change from baseline"),
      priorityReason: "Infection with instability is prioritized because sepsis can progress quickly to shock, organ dysfunction, and death.",
      shortTermGoals: [
        "Patient will remain hemodynamically stable with no new signs of sepsis progression during the shift.",
        "Temperature, heart rate, blood pressure, mentation, and urine output will be trended during the shift and escalated promptly for concerning changes.",
      ],
      longTermGoals: [
        "Patient will show improving infection markers and clinical stability before discharge or step-down.",
        "Patient will understand infection warning signs, medication instructions, and follow-up needs before discharge.",
      ],
      independentInterventions: [
        intervention("Trend temperature, heart rate, respiratory rate, blood pressure, oxygen saturation, mental status, urine output, and skin perfusion.", "Sepsis deterioration is often recognized through patterns across vital signs and perfusion rather than one isolated value."),
        intervention("Assess likely infection source, wound appearance, respiratory status, urinary symptoms, lines, drains, and changes from baseline.", "Source-focused assessment helps identify worsening infection and guides timely communication."),
        intervention("Use strict hand hygiene, aseptic technique, and line or wound care precautions.", "Reducing microbial transmission lowers the risk of additional infection or worsening source control issues."),
        intervention("Encourage fluids or nutrition as appropriate to the care plan and monitor tolerance.", "Hydration and nutrition support perfusion and immune response when safe for the patient's condition."),
        intervention("Escalate new confusion, mottling, hypotension, decreased urine output, or rapidly rising respiratory rate immediately.", "These findings may indicate shock or organ dysfunction requiring urgent intervention."),
      ],
      collaborativeInterventions: [
        intervention(`Administer prescribed antimicrobials, fluids, antipyretics, vasopressors, or supportive therapies within ${roleScope}.`, "Timely treatment targets infection, supports circulation, and reduces progression to shock."),
        intervention("Collect cultures, lactate, CBC, chemistry, urinalysis, imaging, or other ordered diagnostics before antibiotics when this does not delay care.", "Diagnostics support source identification and treatment adjustment."),
        intervention("Collaborate with the provider, rapid response team, pharmacy, and infection prevention for sepsis concerns or source-control needs.", "Sepsis management requires coordinated escalation and timely therapy."),
      ],
      evaluation: evaluationFor("vital signs stabilize, mentation and urine output remain adequate, and infection markers trend in the expected direction", "some infection indicators improve but fever, tachycardia, or labs still require monitoring", "hypotension, altered mentation, low urine output, rising lactate, or escalating oxygen needs occur"),
      priority: 20,
    },
    {
      signal: "pain",
      problem: "Acute Pain",
      relatedTo: "tissue injury, inflammation, procedure, surgery, or disease process",
      asEvidencedBy: evidence("reported pain, guarding, facial grimacing, limited movement, elevated heart rate, or functional limitation"),
      priorityReason: "Pain affects mobility, breathing, sleep, recovery, and willingness to participate in care, but it follows immediate airway, breathing, and circulation threats.",
      shortTermGoals: [
        "Patient will report pain at or below the agreed functional goal within 60 minutes of intervention.",
        "Patient will demonstrate improved comfort with deep breathing, repositioning, or necessary activity during the shift.",
      ],
      longTermGoals: [
        "Patient will use pharmacologic and nonpharmacologic pain strategies safely before discharge.",
        "Patient will maintain function needed for recovery while avoiding oversedation or preventable adverse effects.",
      ],
      independentInterventions: [
        intervention("Assess pain location, quality, intensity, onset, aggravating factors, functional impact, and previous relief measures.", "A complete pain assessment helps distinguish expected pain from complications and guides targeted intervention."),
        intervention("Reassess pain and sedation after interventions using the time frame appropriate for the route and medication.", "Evaluation confirms effectiveness and detects oversedation or inadequate relief."),
        intervention("Use positioning, splinting, heat or cold if appropriate, relaxation, distraction, and environmental comfort measures.", "Nonpharmacologic measures can reduce pain and improve coping without increasing medication risk."),
        intervention("Encourage timely reporting of pain before it becomes severe.", "Earlier intervention often improves control and supports mobility, breathing, and sleep."),
        intervention("Monitor respiratory rate, sedation, bowel function, fall risk, and nausea when analgesics are used.", "Analgesics can cause adverse effects that create new safety risks."),
      ],
      collaborativeInterventions: [
        intervention(`Administer prescribed analgesics and adjuvant medications within ${roleScope}.`, "Appropriate medication therapy reduces pain enough to support healing and function."),
        intervention("Notify the provider for sudden severe pain, pain out of proportion, new neurovascular changes, or pain unrelieved by ordered therapy.", "Unexpected or refractory pain may signal a complication that needs urgent evaluation."),
        intervention("Collaborate with pharmacy, physiotherapy, or pain services when pain control limits recovery or causes adverse effects.", "Interprofessional input supports safer multimodal pain management."),
      ],
      evaluation: evaluationFor("pain is at the patient's functional goal and activity, breathing, and rest improve", "pain decreases but still limits function or requires regimen adjustment", "pain worsens, remains uncontrolled, or concerning associated symptoms appear"),
      priority: 40,
    },
    {
      signal: "fluid",
      problem: "Deficient Fluid Volume",
      relatedTo: "fluid losses, inadequate intake, bleeding, fever, diuretic therapy, or third spacing",
      asEvidencedBy: evidence("hypotension, tachycardia, dry mucous membranes, decreased urine output, vomiting, diarrhea, bleeding, abnormal BUN/creatinine, or electrolyte changes"),
      priorityReason: "Fluid volume affects circulation, renal perfusion, medication safety, and electrolyte stability.",
      shortTermGoals: [
        "Patient will maintain urine output and vital signs within expected parameters during the shift.",
        "Patient will show no new signs of dehydration, bleeding, or electrolyte-related deterioration within 8 hours.",
      ],
      longTermGoals: [
        "Patient will demonstrate stable hydration status and improving relevant labs before discharge or transfer.",
        "Patient will explain fluid, diet, medication, or follow-up instructions related to the underlying cause before discharge.",
      ],
      independentInterventions: [
        intervention("Monitor intake, output, urine characteristics, daily weight when ordered, mucous membranes, skin turgor, mentation, and orthostatic symptoms.", "Fluid status is best evaluated by combining objective trends with physical assessment."),
        intervention("Trend blood pressure, heart rate, capillary refill, temperature, and signs of bleeding or ongoing losses.", "Hemodynamic changes can signal worsening volume depletion or active loss."),
        intervention("Encourage oral fluids when appropriate and not contraindicated by the diagnosis or orders.", "Oral replacement can support hydration when the patient can safely drink."),
        intervention("Maintain accurate documentation of emesis, stool, drainage, bleeding, and fluid intake.", "Precise data guides replacement decisions and escalation."),
        intervention("Implement fall precautions when hypotension, weakness, dizziness, or electrolyte abnormalities are present.", "Volume depletion increases fall and injury risk."),
      ],
      collaborativeInterventions: [
        intervention(`Administer prescribed IV fluids, blood products, electrolyte replacement, antiemetics, or antidiarrheals within ${roleScope}.`, "Collaborative therapies replace losses, treat causes, and prevent complications."),
        intervention("Review or obtain ordered electrolytes, renal function, CBC, coagulation studies, or type and screen based on clinical context.", "Laboratory trends help identify dehydration severity, bleeding, renal stress, and electrolyte risk."),
        intervention("Notify the provider for persistent hypotension, low urine output, active bleeding, critical labs, or worsening mental status.", "These findings may indicate shock, renal injury, or dangerous electrolyte imbalance."),
      ],
      evaluation: evaluationFor("urine output, vital signs, mentation, and relevant labs stabilize", "hydration markers improve but continued replacement or monitoring is needed", "hypotension, low urine output, worsening labs, or ongoing losses persist"),
      priority: 25,
    },
    {
      signal: "glucose",
      problem: "Risk For Unstable Blood Glucose Level",
      relatedTo: "diabetes, altered intake, stress response, infection, steroid therapy, insulin therapy, or acute illness",
      asEvidencedBy: evidence("abnormal glucose results, diabetes history, insulin or oral hypoglycemic use, altered intake, or symptoms of hypo- or hyperglycemia"),
      priorityReason: "Glucose instability can impair mentation, healing, fluid balance, and safety, and severe changes can become life-threatening.",
      shortTermGoals: [
        "Patient will maintain glucose within ordered target range during the shift.",
        "Patient will remain free from symptomatic hypo- or hyperglycemia during care.",
      ],
      longTermGoals: [
        "Patient will describe glucose monitoring, medication timing, nutrition, and sick-day concerns before discharge.",
        "Patient will demonstrate a plan to prevent and respond to glucose extremes.",
      ],
      independentInterventions: [
        intervention("Monitor blood glucose at ordered times and with symptoms such as sweating, tremor, confusion, thirst, frequent urination, or weakness.", "Timely monitoring detects glucose extremes before complications progress."),
        intervention("Assess meal intake, nausea, activity changes, infection signs, steroid use, and medication timing.", "Glucose is affected by nutrition, stress, infection, activity, and pharmacology."),
        intervention("Keep rapid carbohydrate available when hypoglycemia risk is present and policy allows.", "Immediate access reduces delay in treating symptomatic hypoglycemia."),
        intervention("Teach the patient to report symptoms of hypo- and hyperglycemia promptly.", "Early reporting supports rapid intervention and prevents deterioration."),
        intervention("Protect skin and feet, especially when neuropathy, poor perfusion, or wounds are present.", "Glucose instability increases infection and delayed-healing risk."),
      ],
      collaborativeInterventions: [
        intervention(`Administer insulin, oral agents, dextrose, glucagon, fluids, or electrolyte replacement as prescribed and within ${roleScope}.`, "Therapy corrects glucose extremes and prevents progression to complications such as DKA or severe hypoglycemia."),
        intervention("Collaborate with dietitian, diabetes educator, pharmacy, or provider for recurrent glucose extremes or discharge planning.", "Interprofessional planning supports safe self-management."),
        intervention("Obtain ordered ketones, electrolytes, renal function, or additional labs when severe hyperglycemia or DKA risk is present.", "These labs identify metabolic complications and guide urgent treatment."),
      ],
      evaluation: evaluationFor("glucose remains in target range and the patient has no symptoms of instability", "glucose is improving but still requires regimen adjustment or close monitoring", "symptomatic hypoglycemia, severe hyperglycemia, ketones, or mental status changes occur"),
      priority: 35,
    },
    {
      signal: "neuro",
      problem: "Ineffective Cerebral Tissue Perfusion",
      relatedTo: "altered cerebral blood flow, neurologic injury, seizure activity, or acute change in neurologic status",
      asEvidencedBy: evidence("confusion, weakness, speech change, seizure, altered level of consciousness, abnormal pupils, headache, or focal neurologic deficit"),
      priorityReason: "Neurologic changes are time-sensitive because delayed recognition can lead to permanent injury or missed deterioration.",
      shortTermGoals: [
        "Patient will have neurologic assessments completed and escalated according to acuity during the shift.",
        "Patient will remain protected from aspiration, injury, and preventable complications while neurologic status is monitored.",
      ],
      longTermGoals: [
        "Patient will show stable or improving neurologic function before discharge, transfer, or transition of care.",
        "Patient and support persons will understand urgent neurologic warning signs and follow-up needs.",
      ],
      independentInterventions: [
        intervention("Perform focused neurologic checks including level of consciousness, pupils, speech, motor strength, sensation, orientation, and new deficits.", "Serial neurologic assessment detects subtle deterioration and supports rapid escalation."),
        intervention("Maintain airway protection, aspiration precautions, seizure precautions, and fall precautions based on presentation.", "Neurologic impairment increases risk of airway compromise, injury, and aspiration."),
        intervention("Note exact time of symptom onset or last known well when acute neurologic changes are present.", "Time-sensitive neurologic care depends on accurate onset information."),
        intervention("Minimize overstimulation while maintaining frequent reassessment and safe positioning.", "A controlled environment supports safety and reduces avoidable neurologic stress."),
        intervention("Monitor glucose and oxygenation when neurologic symptoms are present.", "Hypoglycemia and hypoxia can mimic or worsen neurologic deficits and require prompt correction."),
      ],
      collaborativeInterventions: [
        intervention(`Prepare for ordered imaging, labs, ECG, medications, airway support, or neurologic protocols within ${roleScope}.`, "Rapid diagnostics and treatment determine cause and reduce risk of progression."),
        intervention("Notify the provider or stroke/rapid response team immediately for new focal deficits, seizure, declining consciousness, or airway risk.", "Neurologic emergencies require immediate team-based response."),
        intervention("Collaborate with speech therapy, physiotherapy, occupational therapy, pharmacy, or neurology as indicated.", "Rehabilitation and specialty input support recovery, safety, and complication prevention."),
      ],
      evaluation: evaluationFor("neurologic findings remain stable or improve and safety precautions prevent injury", "some findings improve but deficits or risks remain", "new deficits, seizure, reduced consciousness, aspiration, or worsening symptoms occur"),
      priority: 18,
    },
    {
      signal: "mobility",
      problem: "Impaired Physical Mobility",
      relatedTo: "weakness, pain, injury, deconditioning, neurologic impairment, or activity intolerance",
      asEvidencedBy: evidence("limited range of motion, impaired gait, need for assistance, falls, fatigue, weakness, or inability to perform usual activity"),
      priorityReason: "Mobility affects fall risk, skin integrity, pulmonary hygiene, venous thromboembolism risk, and discharge readiness.",
      shortTermGoals: [
        "Patient will transfer or mobilize with the safest appropriate assistance level during the shift.",
        "Patient will remain free from falls or mobility-related injury during care.",
      ],
      longTermGoals: [
        "Patient will demonstrate improved functional mobility or safe use of assistive devices before discharge.",
        "Patient will verbalize activity precautions and a realistic mobility plan.",
      ],
      independentInterventions: [
        intervention("Assess baseline mobility, strength, balance, gait, pain, endurance, cognition, and assistive device needs.", "Mobility planning must match the patient's functional ability and risk factors."),
        intervention("Implement fall precautions, clear pathways, non-slip footwear, call bell access, and appropriate assist level.", "Environmental and supervision strategies reduce preventable injury."),
        intervention("Encourage progressive mobility within ordered restrictions and patient tolerance.", "Gradual activity prevents deconditioning while respecting safety limits."),
        intervention("Reposition at least every 2 hours if bedbound and inspect pressure-prone areas.", "Immobility increases pressure injury risk and circulation problems."),
        intervention("Coordinate activity with pain control, meals, toileting, and rest periods.", "Timing mobility around patient needs improves participation and safety."),
      ],
      collaborativeInterventions: [
        intervention("Collaborate with physiotherapy, occupational therapy, or rehabilitation services for mobility assessment and progression.", "Therapy input supports safe functional recovery and discharge planning."),
        intervention(`Administer prescribed analgesics, anticoagulants, or other supportive therapies within ${roleScope}.`, "Pain control and complication prevention can improve mobility tolerance."),
        intervention("Notify the provider for new weakness, neurovascular changes, uncontrolled pain, or inability to safely mobilize.", "Unexpected mobility decline may indicate a complication requiring reassessment."),
      ],
      evaluation: evaluationFor("patient mobilizes safely at the planned assistance level and remains injury-free", "mobility improves but assistance or therapy remains necessary", "mobility declines, falls occur, or new concerning findings appear"),
      priority: 55,
    },
    {
      signal: "skin",
      problem: "Impaired Skin Integrity",
      relatedTo: "wound, incision, pressure, moisture, impaired perfusion, reduced mobility, or invasive devices",
      asEvidencedBy: evidence("wound, incision, redness, drainage, pressure injury, skin breakdown, or delayed healing risk"),
      priorityReason: "Skin breakdown increases infection risk, pain, delayed recovery, and discharge complexity.",
      shortTermGoals: [
        "Skin or wound status will show no worsening during the shift.",
        "Drainage, redness, pain, temperature, and surrounding tissue will be assessed and documented as ordered.",
      ],
      longTermGoals: [
        "Patient will demonstrate wound improvement or prevention of new breakdown before discharge.",
        "Patient will describe wound care, pressure prevention, and infection warning signs before discharge.",
      ],
      independentInterventions: [
        intervention("Assess wound size, drainage, odor, surrounding skin, pain, temperature, and pressure areas using consistent documentation.", "Trendable assessment identifies healing progress or early complications."),
        intervention("Reposition regularly, offload pressure points, and use support surfaces as indicated.", "Pressure reduction improves perfusion and prevents worsening breakdown."),
        intervention("Keep skin clean and dry while protecting from moisture, friction, and shear.", "Moisture and shear contribute to breakdown and delayed healing."),
        intervention("Promote adequate nutrition and hydration within the care plan.", "Protein, calories, and hydration support tissue repair."),
        intervention("Teach the patient not to scratch, pick, or apply unapproved products to wounds or incisions.", "Unapproved manipulation increases infection and delayed healing risk."),
      ],
      collaborativeInterventions: [
        intervention("Perform ordered dressing changes, wound care, drains, or topical therapies using aseptic technique.", "Ordered care supports healing and reduces contamination risk."),
        intervention("Collaborate with wound care, dietitian, provider, or therapy services for complex wounds or pressure injury risk.", "Specialty input improves treatment selection and prevention planning."),
        intervention("Notify the provider for increasing redness, warmth, purulent drainage, dehiscence, fever, or rapidly worsening pain.", "These findings may indicate infection or tissue compromise requiring prompt treatment."),
      ],
      evaluation: evaluationFor("wound or skin findings remain stable or improve with no new breakdown", "partial improvement occurs but risk factors persist", "skin breakdown worsens or infection signs appear"),
      priority: 60,
    },
    {
      signal: "mental",
      problem: "Anxiety",
      relatedTo: "health status change, unfamiliar environment, perceived threat, pain, dyspnea, or psychosocial stressors",
      asEvidencedBy: evidence("reported worry, restlessness, insomnia, fear, agitation, panic symptoms, or difficulty concentrating"),
      priorityReason: "Anxiety can worsen symptoms, impair learning, reduce coping, and interfere with treatment participation.",
      shortTermGoals: [
        "Patient will identify at least one anxiety trigger and one coping strategy during the shift.",
        "Patient will report decreased anxiety or demonstrate calmer behavior after supportive interventions.",
      ],
      longTermGoals: [
        "Patient will participate in care decisions and use coping resources before discharge or transition.",
        "Patient will know when and how to seek support for worsening anxiety or safety concerns.",
      ],
      independentInterventions: [
        intervention("Assess anxiety level, triggers, coping strategies, sleep, pain, dyspnea, safety concerns, and support system.", "Anxiety may be primary or secondary to physiologic distress that needs treatment."),
        intervention("Use calm communication, brief explanations, active listening, and repeated orientation to the plan of care.", "Predictability and validation can reduce distress and improve trust."),
        intervention("Offer breathing exercises, grounding, quiet environment, and family or support involvement when appropriate.", "Nonpharmacologic strategies can reduce sympathetic activation and improve coping."),
        intervention("Provide education in small chunks and confirm understanding with teach-back.", "Anxiety reduces information processing; paced teaching improves retention."),
        intervention("Assess for self-harm, psychosis, substance withdrawal, or severe agitation when clinically indicated.", "Safety screening identifies risks that require urgent escalation."),
      ],
      collaborativeInterventions: [
        intervention(`Administer prescribed anxiolytics, sleep aids, analgesics, or symptom-directed therapy within ${roleScope}.`, "Treating physiologic and psychological contributors can reduce anxiety and improve participation."),
        intervention("Collaborate with mental health professionals, social work, spiritual care, or crisis resources when support needs exceed bedside interventions.", "Interprofessional support addresses psychosocial and safety needs."),
        intervention("Notify the provider for suicidal ideation, severe agitation, delirium, panic with physiologic instability, or inability to participate in essential care.", "High-risk anxiety presentations require prompt assessment and treatment planning."),
      ],
      evaluation: evaluationFor("patient reports lower anxiety and uses coping strategies without safety concerns", "anxiety improves but continues to affect sleep, learning, or participation", "anxiety escalates, safety concerns appear, or distress prevents necessary care"),
      priority: 65,
    },
    {
      signal: "knowledge",
      problem: "Risk For Falls",
      relatedTo: "acute illness, unfamiliar care environment, possible weakness, medications, equipment, or changing functional status",
      asEvidencedBy: evidence("care setting exposure, current symptoms, medications, mobility status, age, acuity level, or need for assisted care"),
      priorityReason: "Fall prevention is prioritized because injury risk can increase quickly when illness, medications, equipment, or unfamiliar surroundings affect mobility and judgment.",
      shortTermGoals: [
        "Patient will remain free from falls or near-falls during the shift.",
        "Patient will call for assistance before mobilizing when instructed during the shift.",
      ],
      longTermGoals: [
        "Patient will demonstrate safe mobility strategies or appropriate use of assistive devices before discharge or transfer.",
        "Patient and caregiver will verbalize fall-prevention steps for the next care setting before discharge.",
      ],
      independentInterventions: [
        intervention("Assess fall history, gait, balance, strength, cognition, toileting needs, footwear, lines, drains, and medication-related dizziness or sedation.", "Fall risk is multifactorial and changes as symptoms, medications, and equipment change."),
        intervention("Keep call bell, personal items, water if allowed, and mobility aids within reach.", "Reducing the need to stretch or get up unassisted decreases preventable falls."),
        intervention("Maintain bed or chair alarms, low bed position, clear pathways, adequate lighting, and non-slip footwear based on risk level.", "Environmental controls reduce injury risk while preserving independence when appropriate."),
        intervention("Schedule toileting and rounding for patients with urgency, confusion, weakness, or high fall risk.", "Anticipating needs reduces impulsive unsupervised movement."),
        intervention("Teach the patient to pause before standing and report dizziness, weakness, or new confusion.", "Orthostatic symptoms and acute changes are common triggers for falls."),
      ],
      collaborativeInterventions: [
        intervention("Collaborate with physiotherapy or occupational therapy when mobility status, transfer technique, or equipment needs are unclear.", "Therapy assessment supports safer mobility progression and discharge planning."),
        intervention(`Review sedating, antihypertensive, diuretic, opioid, or glucose-lowering medications with the team within ${roleScope}.`, "Medication effects can increase dizziness, hypotension, hypoglycemia, sedation, and fall risk."),
        intervention("Notify the provider or RN lead for new weakness, syncope, head injury, or acute change in mental status.", "These findings may signal a new complication and require reassessment before further mobilization."),
      ],
      evaluation: evaluationFor("patient remains injury-free and uses assistance appropriately during the shift", "patient remains injury-free but still needs cueing, supervision, or therapy input", "fall, near-fall, new dizziness, or unsafe mobility behavior occurs"),
      priority: 75,
    },
    {
      signal: "knowledge",
      problem: "Risk For Infection",
      relatedTo: "acute illness, comorbidities, invasive devices, wounds, impaired mobility, altered nutrition, or exposure to healthcare procedures",
      asEvidencedBy: evidence("diagnosis, comorbidities, medications, wounds, lines, procedures, abnormal labs, or current care environment"),
      priorityReason: "Infection prevention is prioritized because early recognition and basic nursing practices reduce avoidable complications and delayed recovery.",
      shortTermGoals: [
        "Patient will show no new fever, purulent drainage, spreading redness, or unexpected deterioration during the shift.",
        "Infection-prevention measures will be maintained during every relevant care interaction.",
      ],
      longTermGoals: [
        "Patient will remain free from preventable healthcare-associated infection before discharge or transfer.",
        "Patient will explain infection warning signs and prevention steps before discharge teaching is complete.",
      ],
      independentInterventions: [
        intervention("Assess temperature, wound or device sites, respiratory symptoms, urinary symptoms, skin condition, pain changes, and mental status for infection cues.", "Early infection recognition depends on targeted assessment and change-from-baseline thinking."),
        intervention("Perform hand hygiene, standard precautions, and transmission-based precautions as indicated.", "Consistent infection-control practice reduces pathogen transmission."),
        intervention("Use aseptic technique for dressing, line, catheter, drain, and procedure-related care.", "Aseptic technique reduces contamination of vulnerable sites."),
        intervention("Encourage nutrition, hydration, mobility, coughing and deep breathing, and skin care as appropriate.", "Basic supportive care strengthens host defenses and reduces complications such as pneumonia or skin breakdown."),
        intervention("Teach the patient to report fever, chills, increasing pain, drainage, redness, cough changes, urinary symptoms, or feeling suddenly worse.", "Patients often notice early changes between scheduled assessments."),
      ],
      collaborativeInterventions: [
        intervention("Obtain ordered cultures, CBC, imaging, urinalysis, or other diagnostics when infection is suspected.", "Diagnostics support source identification and treatment decisions."),
        intervention(`Administer prescribed antimicrobials, antipyretics, wound therapies, or supportive medications within ${roleScope}.`, "Therapies target infection, reduce symptoms, and prevent progression."),
        intervention("Collaborate with infection prevention, wound care, pharmacy, or the provider for complex infection risks or worsening findings.", "Specialty input improves source control, antimicrobial safety, and prevention planning."),
      ],
      evaluation: evaluationFor("no new infection cues appear and prevention measures are consistently maintained", "risk factors remain but findings are stable and teaching is progressing", "new fever, drainage, redness, worsening pain, abnormal labs, or deterioration appears"),
      priority: 78,
    },
    {
      signal: "knowledge",
      problem: "Deficient Knowledge",
      relatedTo: "new diagnosis, treatment plan, medications, self-management requirements, or discharge instructions",
      asEvidencedBy: evidence("questions, inaccurate understanding, new therapy, new diagnosis, medication changes, or need for discharge planning"),
      priorityReason: "Knowledge gaps can lead to medication errors, missed warning signs, poor follow-up, and preventable readmission.",
      shortTermGoals: [
        "Patient will identify the main reason for care and one priority safety instruction before the end of teaching.",
        "Patient will demonstrate teach-back for one medication or self-management action during the shift.",
      ],
      longTermGoals: [
        "Patient will explain diagnosis-specific warning signs, medications, follow-up, and self-care plan before discharge.",
        "Patient will identify when to call the provider, seek urgent care, or use emergency services.",
      ],
      independentInterventions: [
        intervention("Assess current understanding, health literacy, preferred language, cultural needs, readiness to learn, and barriers such as pain or anxiety.", "Teaching is more effective when matched to patient readiness and communication needs."),
        intervention("Use plain language, teach-back, written instructions, and demonstrations for priority self-care tasks.", "Multiple teaching methods improve retention and reveal misunderstandings."),
        intervention("Prioritize the highest-risk discharge information first: medications, red flags, follow-up, activity limits, diet or fluid instructions, and equipment use.", "Safety-critical teaching reduces preventable deterioration after discharge."),
        intervention("Include family or caregivers when the patient consents and support is needed.", "Caregiver understanding may be essential for safe follow-through."),
        intervention("Document teaching topics, patient response, and remaining learning needs.", "Documentation supports continuity and avoids assuming education was understood."),
      ],
      collaborativeInterventions: [
        intervention("Refer to diabetes education, pharmacy, dietitian, social work, physiotherapy, respiratory therapy, or wound care based on identified needs.", "Specialists reinforce detailed teaching and help remove barriers."),
        intervention("Coordinate discharge instructions, prescriptions, equipment, follow-up appointments, and community resources with the care team.", "Coordinated discharge planning reduces confusion and gaps in care."),
        intervention("Notify the provider or care coordinator when the patient cannot safely perform required self-care or lacks needed resources.", "Unresolved barriers can make discharge unsafe."),
      ],
      evaluation: evaluationFor("patient accurately teaches back priority instructions and identifies warning signs", "patient understands some instructions but needs reinforcement or caregiver support", "patient cannot explain essential safety instructions or lacks resources for safe self-care"),
      priority: 80,
    },
  ];
}

function commonIndependentInterventions(input: NursingCarePlanInput): CarePlanIntervention[] {
  return [
    intervention("Verify patient identity, allergies, code status, care setting precautions, and baseline assessment findings before interventions.", "Foundational safety checks prevent wrong-patient care, allergy exposure, and missed changes from baseline."),
    intervention("Trend data over time and compare current findings with the patient's usual baseline.", "Clinical reasoning depends on recognizing direction of change, not only isolated numbers."),
    intervention("Use teach-back for all safety-critical education.", "Teach-back confirms understanding and reveals gaps before discharge or self-management."),
    intervention(`Document assessments, interventions, patient response, and escalation clearly for the ${SETTING_LABELS[input.careSetting]} team.`, "Clear documentation supports continuity, legal protection, and safe handoff."),
    intervention("Escalate findings that are unexpected, worsening, or inconsistent with the current plan.", "Prompt escalation prevents delayed recognition of deterioration."),
  ];
}

function commonCollaborativeInterventions(input: NursingCarePlanInput): CarePlanIntervention[] {
  return [
    intervention(`Coordinate with the RN, provider, and interprofessional team according to ${scopePhrase(input.role)} and local policy.`, "Collaboration ensures the plan matches scope, acuity, and available resources."),
    intervention("Request updated orders or reassessment when the patient's status changes.", "Treatment plans must be adjusted when assessment data no longer match expected progress."),
    intervention("Prepare for transfer, higher level of care, or additional monitoring when deterioration risk increases.", "Early preparation reduces delay if the patient becomes unstable."),
  ];
}

function enforceInterventionMinimum(primary: CarePlanIntervention[], fallback: CarePlanIntervention[], minimum: number): CarePlanIntervention[] {
  const merged = [...primary];
  const seen = new Set(primary.map((item) => item.action.toLowerCase()));
  for (const item of fallback) {
    if (merged.length >= minimum) break;
    if (seen.has(item.action.toLowerCase())) continue;
    merged.push(item);
    seen.add(item.action.toLowerCase());
  }
  return merged.slice(0, Math.max(minimum, primary.length));
}

function buildPatientSummary(input: NursingCarePlanInput, context: ReturnType<typeof buildContext>, diagnoses: NursingDiagnosisPlan[]): string {
  const ageSex = compactList([input.demographics.age ? `${input.demographics.age}-year-old` : "", input.demographics.sex]).join(" ");
  const diagnosis = context.diagnosisLabel;
  const setting = SETTING_LABELS[input.careSetting];
  const acuity = PRIORITY_LABELS[input.priorityLevel];
  const topPriorities = diagnoses.slice(0, 3).map((item) => item.problem.toLowerCase()).join(", ");
  const findings = context.findings || "the entered symptoms, assessment findings, vital signs, and laboratory trends";
  return `${ageSex || "Patient"} in a ${setting} setting with ${diagnosis} and ${acuity} priority data. Current cues include ${findings}. The immediate nursing focus is to recognize deterioration early, address ${topPriorities}, protect safety, and coordinate timely escalation or teaching based on response to care.`;
}

function buildPatientEducation(input: NursingCarePlanInput, signals: Signal[]): NursingCarePlanOutput["patientEducation"] {
  const diagnosis = input.demographics.medicalDiagnosis || "the current diagnosis";
  return {
    diseaseEducation: [
      `Explain ${diagnosis} using plain language, including what is happening, expected recovery or monitoring needs, and which symptoms require prompt help.`,
      "Connect teaching to the patient's current assessment findings so the plan feels relevant rather than generic.",
      signals.includes("respiratory") ? "Teach breathing, coughing, inhaler or oxygen safety instructions as applicable to the ordered plan." : "Review the most important body-system changes related to the diagnosis.",
    ],
    medicationTeaching: [
      "Review each current medication by purpose, timing, common side effects, and when to hold or call for guidance.",
      "Highlight high-risk medications such as anticoagulants, insulin, opioids, sedatives, antibiotics, antihypertensives, or diuretics when present.",
      "Teach allergy reporting and the importance of avoiding unapproved over-the-counter or herbal products without checking with the care team.",
    ],
    dischargeTeaching: [
      "Review follow-up appointments, ordered labs or diagnostics, activity limits, diet or fluid instructions, wound or device care, and who to contact with concerns.",
      "Use teach-back for the top three discharge safety points before the patient leaves the care setting.",
      "Confirm the patient has prescriptions, equipment, transportation, caregiver support, and community resources needed for safe transition.",
    ],
    safetyTeaching: [
      "Teach warning signs that require urgent care, including worsening breathing, chest pain, fainting, confusion, uncontrolled bleeding, severe weakness, or signs of infection.",
      "Review fall prevention, safe mobility, medication safety, and when to ask for help.",
      "Encourage the patient to report new or worsening symptoms early rather than waiting for scheduled reassessment.",
    ],
    selfManagementTeaching: [
      "Help the patient connect daily self-monitoring to action steps, such as checking symptoms, weight, glucose, blood pressure, wound appearance, or medication adherence when relevant.",
      "Create a realistic plan for rest, nutrition, hydration, activity progression, and follow-up based on the diagnosis.",
      "Identify barriers such as cost, transportation, health literacy, language, caregiver availability, or anxiety and connect resources before discharge.",
    ],
  };
}

function buildClinicalReasoning(input: NursingCarePlanInput, signals: Signal[], diagnoses: NursingDiagnosisPlan[]): NursingCarePlanOutput["clinicalReasoning"] {
  const top = diagnoses[0]?.problem ?? "the most urgent clinical problem";
  return {
    priorityFramework: `Priorities are ranked by immediacy of harm: ABCs first, then circulation and neurologic status, then pain, mobility, infection prevention, discharge safety, and self-management. In this plan, ${top} is prioritized because it has the greatest short-term deterioration risk based on the entered cues.`,
    abcReasoning: signals.includes("respiratory")
      ? "ABCs place breathing first because oxygenation or ventilation concerns can deteriorate quickly and require rapid reassessment."
      : signals.includes("cardiac") || signals.includes("fluid")
        ? "ABCs place circulation high because perfusion, blood pressure, urine output, mentation, and bleeding trends determine whether the patient is compensating."
        : "ABCs are still used as a safety screen even when the main diagnosis is not primarily airway, breathing, or circulation related.",
    maslowReasoning: "Maslow supports addressing physiologic stability and safety before education-only goals. Teaching becomes more effective after pain, oxygenation, perfusion, anxiety, or acute risk is controlled.",
    safetyRisks: [
      "Delayed escalation when vital signs, mentation, oxygen needs, urine output, pain pattern, or neurologic status worsen.",
      "Medication error risk from allergies, high-risk medications, changing renal function, sedation, glucose instability, or unclear discharge instructions.",
      "Fall, aspiration, pressure injury, infection, or self-management risk depending on the assessment findings and care setting.",
    ],
    deteriorationRisks: buildComplicationWatch(input, signals).slice(0, 4).map((item) => item.warningSign),
    potentialComplications: buildComplicationWatch(input, signals).slice(0, 4).map((item) => item.whyItMatters),
  };
}

function buildComplicationWatch(input: NursingCarePlanInput, signals: Signal[]): ComplicationWatchItem[] {
  const items: ComplicationWatchItem[] = [];
  if (signals.includes("respiratory")) {
    items.push({
      warningSign: "Increasing work of breathing, falling oxygen saturation, cyanosis, or new confusion",
      whyItMatters: "These findings can signal worsening hypoxemia, hypercapnia, or impending respiratory failure.",
      immediateNursingResponse: "Reassess airway and breathing, position upright, apply or titrate oxygen per order or protocol, stop exertion, and escalate immediately.",
    });
  }
  if (signals.includes("cardiac") || signals.includes("fluid")) {
    items.push({
      warningSign: "Hypotension, chest pain, weak pulses, cool clammy skin, low urine output, or altered mentation",
      whyItMatters: "These are perfusion warning signs and may indicate shock, bleeding, dysrhythmia, or cardiac ischemia.",
      immediateNursingResponse: "Assess ABCs and perfusion, obtain vital signs, keep the patient safe at rest, prepare ECG or labs as ordered, and notify provider or rapid response.",
    });
  }
  if (signals.includes("infection")) {
    items.push({
      warningSign: "Fever or hypothermia with tachycardia, tachypnea, hypotension, mottling, confusion, or rising lactate",
      whyItMatters: "Infection plus organ dysfunction cues may represent sepsis progression.",
      immediateNursingResponse: "Escalate urgently, obtain ordered cultures and labs, administer time-sensitive therapies as ordered, and monitor perfusion closely.",
    });
  }
  if (signals.includes("glucose")) {
    items.push({
      warningSign: "Sweating, tremor, confusion, seizures, severe thirst, vomiting, fruity breath, or very high glucose",
      whyItMatters: "Glucose extremes can cause neurologic injury, dehydration, electrolyte shifts, or DKA/HHS.",
      immediateNursingResponse: "Check glucose, follow hypoglycemia or hyperglycemia protocol, protect airway and safety, and notify provider for severe or recurrent abnormalities.",
    });
  }
  if (signals.includes("neuro")) {
    items.push({
      warningSign: "New weakness, facial droop, speech change, seizure, severe headache, unequal pupils, or declining consciousness",
      whyItMatters: "Acute neurologic change can be time-sensitive and may require stroke, seizure, or airway response.",
      immediateNursingResponse: "Note last known well, protect airway and safety, check glucose and oxygenation, and activate facility escalation pathway.",
    });
  }
  items.push({
    warningSign: "Pain suddenly worsens, becomes different in character, or is accompanied by new instability",
    whyItMatters: "A change in pain pattern may indicate bleeding, ischemia, compartment syndrome, infection, or another complication.",
    immediateNursingResponse: "Perform focused reassessment, hold unsafe activity, evaluate vital signs and relevant body system, and escalate unexpected findings.",
  });
  items.push({
    warningSign: "Patient cannot explain medications, red flags, or follow-up plan before discharge",
    whyItMatters: "Poor understanding increases risk of medication errors, missed deterioration, and avoidable readmission.",
    immediateNursingResponse: "Pause discharge teaching, use teach-back, involve caregiver or interpreter as needed, and notify the team about unresolved barriers.",
  });
  return uniqueBy(items, (item) => item.warningSign).slice(0, input.priorityLevel === "stable" ? 4 : 6);
}

function buildSbar(input: NursingCarePlanInput, context: ReturnType<typeof buildContext>, diagnoses: NursingDiagnosisPlan[]): NursingCarePlanOutput["sbar"] {
  const topDiagnosis = diagnoses[0]?.problem ?? "priority nursing concern";
  return {
    situation: `Patient with ${context.diagnosisLabel} in the ${SETTING_LABELS[input.careSetting]} setting; current priority is ${topDiagnosis}.`,
    background: `Relevant background includes ${compactList([input.demographics.comorbidities, input.demographics.surgicalDiagnosis, input.clinicalData.currentMedications, input.clinicalData.allergies]).join("; ") || "the entered diagnosis, medications, allergies, and comorbidities"}.`,
    assessment: `Current cues include ${context.findings || "the entered vital signs, labs, symptoms, and assessment findings"}. Nursing priorities are ${diagnoses.slice(0, 3).map((item) => item.problem).join(", ")}.`,
    recommendation: `Continue priority assessments, implement the care plan, and reassess response. Escalate promptly for deterioration cues, unmet goals, unsafe discharge barriers, or changes outside expected progress.`,
  };
}

function buildExamPrep(input: NursingCarePlanInput, signals: Signal[], diagnoses: NursingDiagnosisPlan[]): NursingCarePlanOutput["examPrep"] {
  return {
    clinicalPearls: [
      "NCLEX and REx-PN items reward the safest first action, not the most advanced intervention.",
      diagnoses[0]?.problem
        ? `When ${diagnoses[0].problem} is the top problem, reassessment and escalation cues matter as much as the written intervention.`
        : "Prioritize the problem with the highest immediate risk to life or safety.",
      "If an option delays assessment of airway, breathing, circulation, neurologic change, or severe safety risk, it is often not the best first action.",
    ],
    commonExamTraps: [
      "Choosing patient education before stabilizing an acute physiologic problem.",
      "Delegating assessment, teaching, evaluation, or unstable patient care to unregulated assistive personnel.",
      "Treating a normal-looking value as reassuring when the trend is worsening or inconsistent with symptoms.",
    ],
    priorityNursingActions: [
      "Assess first when the situation is unclear; intervene first when an immediate threat is already identified.",
      "Use ABCs, acute versus chronic, unstable versus stable, expected versus unexpected, and least restrictive safety principles.",
      `Match actions to ${PRIORITY_LABELS[input.priorityLevel]} acuity and the available scope in the care setting.`,
    ],
    delegationConsiderations: [
      "RNs retain responsibility for assessment, interpretation, teaching, care planning, evaluation, and unstable patient decisions.",
      "RPN/LPN scope depends on jurisdiction, patient predictability, acuity, and employer policy; escalate unstable or rapidly changing findings.",
      "Assistive personnel may help with routine tasks for stable patients, but abnormal findings must be reported back to the nurse.",
    ],
    patientSafetyAlerts: [
      "Allergies, high-risk medications, fall risk, oxygen needs, infection precautions, and discharge barriers should be visible in the plan.",
      "A patient who looks stable but has worsening trends deserves closer review.",
      signals.includes("infection") ? "Sepsis questions often test early recognition and timely escalation before shock is obvious." : "Unexpected change from baseline is often more important than a single isolated value.",
    ],
  };
}

function buildLearningMode(input: NursingCarePlanInput, signals: Signal[]): NursingCarePlanOutput["learning"] {
  return {
    pathophysiologySummary: `The care plan links ${input.demographics.medicalDiagnosis || "the diagnosis"} to the patient's assessment cues. Nursing reasoning asks what process is driving the findings, which body system can deteriorate first, and which interventions reduce risk while monitoring response.`,
    nursingConsiderations: [
      "Begin with focused assessment, trend recognition, safety precautions, patient response, and escalation thresholds.",
      "Connect every intervention to a patient-specific risk rather than listing routine tasks.",
      "Evaluate whether goals are met by measurable findings such as symptoms, vital signs, labs, functional ability, teaching accuracy, and complication absence.",
    ],
    pharmacologyConsiderations: [
      "Check allergies, indication, dose reasonableness, renal or hepatic concerns, vital-sign hold parameters, and interactions before administration.",
      "Monitor for therapeutic effect and adverse effects rather than documenting medication administration alone.",
      signals.includes("glucose") ? "Coordinate insulin or glucose-lowering therapy with nutrition, glucose trends, and hypoglycemia risk." : "Teach the patient why each medication is used and what symptoms should be reported.",
    ],
    priorityAssessments: [
      "Airway, breathing, circulation, neurologic status, pain, infection signs, intake and output, skin integrity, mobility, and learning readiness.",
      "Trends that move in the wrong direction despite interventions.",
      "Findings that do not match the expected course of the diagnosis.",
    ],
    redFlags: buildComplicationWatch(input, signals).map((item) => item.warningSign).slice(0, 5),
  };
}

function evidenceFrom(context: ReturnType<typeof buildContext>) {
  return (fallback: string) => context.findings || fallback;
}

function evaluationFor(goalMet: string, partiallyMet: string, notMet: string): NursingDiagnosisPlan["evaluation"] {
  return {
    goalMet: [goalMet, "Patient demonstrates expected understanding or behavior related to the diagnosis."],
    partiallyMet: [partiallyMet, "Some measurable indicators improve but continued nursing intervention or reassessment is needed."],
    notMet: [notMet, "Care plan requires reassessment, escalation, or revision based on patient response."],
  };
}

function intervention(action: string, rationale: string): CarePlanIntervention {
  return { action, rationale };
}

function scopePhrase(role: NursingCarePlanRole): string {
  if (role === "np") return "NP scope, prescribing authority, collaborative agreements, and local policy";
  if (role === "rpn-lpn") return "RPN/LPN scope, patient predictability, delegation rules, and local policy";
  return "RN scope and local policy";
}

function compactList(values: Array<string | null | undefined>): string[] {
  return values.map((value) => String(value ?? "").trim()).filter(Boolean);
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function uniqueBy<T>(values: T[], key: (value: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const value of values) {
    const id = key(value).toLowerCase();
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(value);
  }
  return out;
}
