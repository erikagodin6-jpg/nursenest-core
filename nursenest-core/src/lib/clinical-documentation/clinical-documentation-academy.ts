export type DocumentationLearnerLevel = "student" | "new-graduate" | "independent-nurse" | "charge-nurse" | "advanced-practice";

export type DocumentationTrackId =
  | "foundations"
  | "charting-simulator"
  | "soap-note"
  | "dar-charting"
  | "focus-charting"
  | "sbar-documentation"
  | "shift-note"
  | "medication-documentation"
  | "wound-documentation"
  | "pain-documentation"
  | "fall-documentation"
  | "rapid-response-documentation"
  | "pediatric-documentation"
  | "mental-health-documentation"
  | "home-care-documentation"
  | "np-documentation";

export type DocumentationJurisdiction = "canada" | "us" | "international";

export type DocumentationAcademyInput = {
  track: DocumentationTrackId;
  level: DocumentationLearnerLevel;
  jurisdiction: DocumentationJurisdiction;
  learnerEntry: string;
};

export type DocumentationEhrTab = {
  id: "summary" | "assessments" | "flowsheets" | "mar" | "notes" | "orders" | "labs";
  label: string;
  content: string[];
};

export type DocumentationScenario = {
  id: string;
  title: string;
  setting: string;
  patient: string;
  event: string;
  ehrTabs: DocumentationEhrTab[];
  expectedElements: string[];
  unsafePhrases: string[];
  legalRisks: string[];
  modelDocumentation: {
    format: string;
    example: string;
    rationale: string;
  };
};

export type DocumentationFeedback = {
  accuracyScore: number;
  completenessScore: number;
  professionalLanguageScore: number;
  legalSafetyScore: number;
  clinicalCompletenessScore: number;
  overallScore: number;
  missingInformation: string[];
  ambiguousWording: string[];
  legalConcerns: string[];
  objectiveLanguageIssues: string[];
  coaching: string[];
  badgesEarned: string[];
};

export type DocumentationAcademyOutput = {
  title: string;
  learningPathway: {
    level: DocumentationLearnerLevel;
    objectives: string[];
    standards: string[];
  };
  scenario: DocumentationScenario;
  feedback: DocumentationFeedback;
  commonErrors: Array<{ error: string; unsafeExample: string; saferApproach: string; rationale: string }>;
  integrationLinks: Array<{ label: string; href: string; rationale: string }>;
};

const TRACK_TITLES: Record<DocumentationTrackId, string> = {
  foundations: "Fundamentals of Documentation",
  "charting-simulator": "Charting Simulator",
  "soap-note": "SOAP Note Builder",
  "dar-charting": "DAR Charting",
  "focus-charting": "Focus Charting",
  "sbar-documentation": "SBAR Documentation",
  "shift-note": "Shift Note Writing",
  "medication-documentation": "Medication Documentation",
  "wound-documentation": "Wound Documentation",
  "pain-documentation": "Pain Documentation",
  "fall-documentation": "Fall Documentation",
  "rapid-response-documentation": "Rapid Response Documentation",
  "pediatric-documentation": "Pediatric Documentation",
  "mental-health-documentation": "Mental Health Documentation",
  "home-care-documentation": "Home Care Documentation",
  "np-documentation": "NP Documentation Track",
};

const LEVEL_OBJECTIVES: Record<DocumentationLearnerLevel, string[]> = {
  student: [
    "Separate subjective statements from objective assessment data.",
    "Chart only observed, assessed, reported, or performed information.",
    "Use professional language and include reassessment after interventions.",
  ],
  "new-graduate": [
    "Document assessment trends, time-sensitive events, notifications, and patient response.",
    "Avoid vague phrases that create legal risk during deterioration or medication events.",
    "Write concise notes that support continuity of care.",
  ],
  "independent-nurse": [
    "Document clinical judgment, escalation, teaching, and reassessment efficiently.",
    "Use flowsheets, MAR, notes, orders, and labs together without duplicating irrelevant detail.",
    "Identify missing documentation before handoff or end of shift.",
  ],
  "charge-nurse": [
    "Document team communication, delegation, escalation, incident follow-up, and risk mitigation.",
    "Coach others on objective wording and legally defensible charting.",
    "Recognize documentation patterns that require leadership follow-up.",
  ],
  "advanced-practice": [
    "Document differential diagnosis, clinical reasoning, plan, follow-up, and prescribing considerations.",
    "Support diagnostic and therapeutic decisions with assessment findings and relevant evidence.",
    "Create clear plans that communicate risk, return precautions, and reassessment needs.",
  ],
};

const PROFESSIONAL_STANDARDS = [
  "Chart promptly, accurately, chronologically, and objectively.",
  "Document assessment findings, nursing actions, patient response, and required notifications.",
  "Correct errors according to policy; do not erase, obscure, or back-date documentation.",
  "Protect confidentiality and avoid unnecessary identifiers or judgmental language.",
  "Use approved abbreviations and local policy for late entries, refusals, incidents, and electronic signatures.",
];

const SCENARIOS: Record<DocumentationTrackId, DocumentationScenario> = {
  foundations: baseScenario("documentation-foundations", "Objective vs subjective charting", "Med-Surg", "68-year-old admitted with pneumonia", "Patient reports shortness of breath after ambulation; SpO2 decreased from 94% to 89% on room air."),
  "charting-simulator": baseScenario("charting-simulator", "Deteriorating respiratory assessment", "Med-Surg", "72-year-old with heart failure exacerbation", "At 0935 patient became more dyspneic, RR 28, SpO2 87% room air, crackles increased bilaterally."),
  "soap-note": soapScenario(),
  "dar-charting": darScenario(),
  "focus-charting": focusScenario(),
  "sbar-documentation": sbarScenario(),
  "shift-note": shiftScenario(),
  "medication-documentation": medicationScenario(),
  "wound-documentation": woundScenario(),
  "pain-documentation": painScenario(),
  "fall-documentation": fallScenario(),
  "rapid-response-documentation": rapidScenario(),
  "pediatric-documentation": pediatricScenario(),
  "mental-health-documentation": mentalHealthScenario(),
  "home-care-documentation": homeCareScenario(),
  "np-documentation": npScenario(),
};

export function generateDocumentationAcademy(input: DocumentationAcademyInput): DocumentationAcademyOutput {
  const scenario = SCENARIOS[input.track];
  const feedback = evaluateDocumentationEntry(input.learnerEntry, scenario, input.track);
  return {
    title: TRACK_TITLES[input.track],
    learningPathway: {
      level: input.level,
      objectives: LEVEL_OBJECTIVES[input.level],
      standards: standardsForJurisdiction(input.jurisdiction),
    },
    scenario,
    feedback,
    commonErrors: COMMON_ERRORS,
    integrationLinks: integrationLinks(input.track),
  };
}

export function formatDocumentationAcademyForCopy(output: DocumentationAcademyOutput): string {
  const lines = [output.title, "", "Scenario", `${output.scenario.patient} - ${output.scenario.event}`, "", "Model Documentation", output.scenario.modelDocumentation.example, ""];
  lines.push("Feedback");
  lines.push(`Overall score: ${output.feedback.overallScore}`);
  output.feedback.coaching.forEach((item) => lines.push(`- ${item}`));
  lines.push("", "Missing Information");
  output.feedback.missingInformation.forEach((item) => lines.push(`- ${item}`));
  lines.push("", "Legal Concerns");
  output.feedback.legalConcerns.forEach((item) => lines.push(`- ${item}`));
  return lines.join("\n");
}

function evaluateDocumentationEntry(entry: string, scenario: DocumentationScenario, track: DocumentationTrackId): DocumentationFeedback {
  const normalized = entry.toLowerCase();
  const hasEntry = normalized.trim().length > 0;
  const missingInformation = scenario.expectedElements.filter((element) => !containsConcept(normalized, element));
  const legalConcerns = scenario.legalRisks.filter((risk) => !containsConcept(normalized, risk));
  const objectiveLanguageIssues = scenario.unsafePhrases.filter((phrase) => normalized.includes(phrase.toLowerCase()));
  const ambiguousWording = AMBIGUOUS_PHRASES.filter((phrase) => normalized.includes(phrase));
  const completenessScore = hasEntry ? Math.max(25, 100 - missingInformation.length * 12) : 0;
  const legalSafetyScore = hasEntry ? Math.max(20, 100 - legalConcerns.length * 10 - objectiveLanguageIssues.length * 18) : 0;
  const professionalLanguageScore = hasEntry ? Math.max(20, 100 - ambiguousWording.length * 15 - objectiveLanguageIssues.length * 15) : 0;
  const accuracyScore = hasEntry ? Math.max(30, 100 - missingInformation.length * 8 - legalConcerns.length * 5) : 0;
  const clinicalCompletenessScore = hasEntry ? Math.round((completenessScore + legalSafetyScore + accuracyScore) / 3) : 0;
  const overallScore = Math.round((accuracyScore + completenessScore + professionalLanguageScore + legalSafetyScore + clinicalCompletenessScore) / 5);

  return {
    accuracyScore,
    completenessScore,
    professionalLanguageScore,
    legalSafetyScore,
    clinicalCompletenessScore,
    overallScore,
    missingInformation,
    ambiguousWording,
    legalConcerns,
    objectiveLanguageIssues,
    coaching: buildCoaching(track, missingInformation, legalConcerns, objectiveLanguageIssues, ambiguousWording, hasEntry),
    badgesEarned: badgesForScores(overallScore, legalSafetyScore, track),
  };
}

function buildCoaching(
  track: DocumentationTrackId,
  missing: string[],
  legal: string[],
  objectiveIssues: string[],
  ambiguous: string[],
  hasEntry: boolean,
): string[] {
  if (!hasEntry) {
    return [
      "Start by documenting the time, focused assessment, intervention, patient response, and required notification.",
      "The coach will not rewrite the note for you; it will explain which required documentation elements are missing.",
    ];
  }
  const coaching: string[] = [];
  if (missing.length) coaching.push(`Add missing clinical elements: ${missing.slice(0, 4).join(", ")}.`);
  if (legal.length) coaching.push(`Address legal safety elements: ${legal.slice(0, 4).join(", ")}.`);
  if (objectiveIssues.length) coaching.push(`Replace judgmental or opinion wording: ${objectiveIssues.join(", ")}.`);
  if (ambiguous.length) coaching.push(`Clarify vague wording: ${ambiguous.join(", ")}.`);
  coaching.push(track === "np-documentation" ? "Document diagnostic reasoning and follow-up plan clearly enough that another clinician can continue care." : "Document what you assessed, what you did, how the patient responded, and who was notified.");
  coaching.push("Use objective, time-linked wording. Avoid conclusions without supporting assessment data.");
  return coaching;
}

function badgesForScores(overall: number, legal: number, track: DocumentationTrackId): string[] {
  const badges: string[] = [];
  if (overall >= 70) badges.push("Documentation Foundations");
  if (track === "medication-documentation" && overall >= 70) badges.push("Medication Documentation");
  if (track === "sbar-documentation" && overall >= 70) badges.push("Clinical Communication");
  if (track === "np-documentation" && overall >= 75) badges.push("Advanced Charting");
  if (overall >= 90 && legal >= 90) badges.push("Documentation Excellence");
  return badges;
}

function standardsForJurisdiction(jurisdiction: DocumentationJurisdiction): string[] {
  if (jurisdiction === "canada") {
    return [
      ...PROFESSIONAL_STANDARDS,
      "Canadian practice emphasis: document according to provincial regulator expectations, employer policy, scope of practice, consent, privacy, and professional accountability.",
    ];
  }
  if (jurisdiction === "us") {
    return [
      ...PROFESSIONAL_STANDARDS,
      "US practice emphasis: document according to state board expectations, facility policy, HIPAA privacy requirements, medication administration policy, and incident reporting workflow.",
    ];
  }
  return [
    ...PROFESSIONAL_STANDARDS,
    "Internationally educated nurse emphasis: use local terminology, local legal standards, local documentation policy, and approved abbreviations after jurisdiction review.",
  ];
}

function containsConcept(text: string, concept: string): boolean {
  const words = concept.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 3);
  return words.length === 0 || words.some((word) => text.includes(word));
}

function baseScenario(id: string, title: string, setting: string, patient: string, event: string): DocumentationScenario {
  return {
    id,
    title,
    setting,
    patient,
    event,
    ehrTabs: ehrTabs(patient, event),
    expectedElements: ["time", "focused assessment", "objective findings", "intervention", "patient response", "notification", "reassessment"],
    unsafePhrases: ["seems fine", "drug seeking", "noncompliant", "lazy", "crazy", "normal for them"],
    legalRisks: ["time", "notification", "response", "reassessment"],
    modelDocumentation: {
      format: "Narrative progress note",
      example:
        "0935 Patient reports increased shortness of breath after ambulating to bathroom. RR 28/min, SpO2 87% on room air, HR 116, BP 98/60. Bilateral crackles increased from baseline. Patient positioned high Fowler's, activity stopped, oxygen applied per order/protocol. Charge nurse and provider notified at 0940. SpO2 improved to 92% on 2 L nasal cannula at 0948; patient states breathing is improving. Continue close monitoring and document reassessment.",
      rationale:
        "The note includes time, subjective cue, objective assessment, intervention, notification, response, and reassessment without judgmental wording.",
    },
  };
}

function soapScenario(): DocumentationScenario {
  return {
    ...baseScenario("soap-note", "SOAP note for worsening cough", "Primary care / clinic", "45-year-old with asthma history", "Patient reports increased cough and wheeze for 2 days."),
    expectedElements: ["subjective symptoms", "objective findings", "assessment", "plan", "follow-up", "return precautions"],
    legalRisks: ["assessment", "plan", "follow-up", "return precautions"],
    modelDocumentation: {
      format: "SOAP",
      example:
        "S: Reports wheeze and cough x2 days, using reliever inhaler more often, denies chest pain. O: Speaking full sentences, mild expiratory wheeze bilaterally, SpO2 95% room air, RR 20. A: Increased asthma symptoms without current severe distress. P: Review inhaler technique, reinforce action plan, administer/continue ordered therapy, advise urgent care for worsening dyspnea, cyanosis, inability to speak full sentences, or poor response to reliever. Follow up as directed.",
      rationale: "SOAP separates patient-reported data, observed findings, clinical assessment, and plan.",
    },
  };
}

function darScenario(): DocumentationScenario {
  return {
    ...baseScenario("dar-charting", "DAR note for pain intervention", "Post-op unit", "60-year-old post-op day 1 abdominal surgery", "Patient reports incisional pain 8/10 with guarded movement."),
    expectedElements: ["data", "action", "response", "pain score", "intervention", "reassessment"],
    legalRisks: ["reassessment", "response", "time"],
    modelDocumentation: {
      format: "DAR",
      example:
        "D: 1010 Reports incisional pain 8/10, guarding abdomen, BP 142/84, HR 96, incision dressing dry and intact. A: Assisted to reposition with splint pillow; PRN analgesic administered per MAR; encouraged slow deep breathing. R: 1045 Pain decreased to 4/10, patient able to cough and reposition with less guarding. No adverse effects noted.",
      rationale: "DAR links data, nursing action, and measurable response.",
    },
  };
}

function focusScenario(): DocumentationScenario {
  return {
    ...darScenario(),
    id: "focus-charting",
    title: "Focus charting for pain",
    expectedElements: ["focus", "assessment", "intervention", "response"],
    modelDocumentation: {
      format: "Focus charting",
      example:
        "Focus: Post-operative incisional pain. Assessment: 1010 Pain 8/10 at incision, guarding with movement, dressing dry/intact. Intervention: Repositioned with splint pillow, administered PRN analgesic per MAR, taught cough/deep breathing with splinting. Response: 1045 Pain 4/10, tolerates repositioning, no sedation or nausea reported.",
      rationale: "Focus charting names the problem and then documents assessment, intervention, and response.",
    },
  };
}

function sbarScenario(): DocumentationScenario {
  return {
    ...baseScenario("sbar-documentation", "SBAR for acute dyspnea", "Med-Surg", "72-year-old admitted with heart failure", "Patient has new dyspnea, SpO2 87% room air, bilateral crackles, BP 98/60."),
    expectedElements: ["situation", "background", "assessment", "recommendation", "provider notification", "time"],
    legalRisks: ["provider notification", "recommendation", "time"],
    modelDocumentation: {
      format: "SBAR documentation",
      example:
        "SBAR call to provider at 0940. S: New dyspnea and SpO2 87% RA. B: Admitted with heart failure exacerbation; crackles previously mild. A: RR 28, HR 116, BP 98/60, bilateral crackles increased, patient anxious but alert. R: Requested provider assessment and orders for oxygen/diuretic adjustment per clinical status. Patient positioned high Fowler's; oxygen applied per order/protocol; reassessment ongoing.",
      rationale: "SBAR documentation records what was communicated, why, to whom, and the immediate patient response plan.",
    },
  };
}

function shiftScenario(): DocumentationScenario {
  return {
    ...baseScenario("shift-note", "End-of-shift summary", "Med-Surg", "70-year-old with pneumonia", "Shift included assessment, antibiotics, ambulation, education, and one dyspnea episode."),
    expectedElements: ["assessment trends", "events", "medications", "interventions", "response", "handoff risks"],
    legalRisks: ["response", "handoff risks"],
    modelDocumentation: {
      format: "Shift note",
      example:
        "Day shift: Alert/oriented, intermittent dyspnea with exertion. Lungs coarse RLL, SpO2 maintained 92-94% on 2 L NC after morning dyspnea episode. IV antibiotics administered per MAR; no reaction noted. Ambulated 20 m with assistance, required rest due to shortness of breath. Education reinforced on call bell use and coughing/deep breathing. Handoff: monitor oxygen needs, fever, work of breathing, and response to antibiotics.",
      rationale: "A shift note summarizes meaningful trends and handoff risks without rewriting every flowsheet value.",
    },
  };
}

function medicationScenario(): DocumentationScenario {
  return {
    ...baseScenario("medication-documentation", "PRN medication and reassessment", "Med-Surg", "55-year-old with renal colic", "Patient received PRN analgesic for flank pain."),
    expectedElements: ["medication", "dose", "route", "reason", "pre-assessment", "reassessment", "effectiveness", "adverse effects"],
    legalRisks: ["reassessment", "effectiveness", "adverse effects"],
    modelDocumentation: {
      format: "Medication documentation",
      example:
        "1430 Reports right flank pain 8/10, grimacing, pacing. PRN hydromorphone 0.5 mg IV administered per MAR after verifying order, allergies, sedation score, RR 18/min, BP 136/82. 1500 Pain 4/10, resting in bed, RR 16/min, easily roused, denies nausea/dizziness. Continue monitoring.",
      rationale: "Medication documentation includes indication, safety checks, administration, effectiveness, and adverse-effect monitoring.",
    },
  };
}

function woundScenario(): DocumentationScenario {
  return {
    ...baseScenario("wound-documentation", "Pressure injury wound note", "LTC", "82-year-old with sacral pressure injury", "Dressing changed during morning care."),
    expectedElements: ["location", "measurements", "appearance", "drainage", "surrounding skin", "pain", "intervention", "response"],
    legalRisks: ["measurements", "intervention", "response"],
    modelDocumentation: {
      format: "Wound note",
      example:
        "0900 Sacral wound cleansed and dressing changed per order. Wound 2.4 cm x 1.8 cm x 0.2 cm, wound bed pink/red with small serous drainage, no odor. Periwound intact with mild blanchable erythema. Reports pain 2/10 during care. Barrier cream applied to surrounding skin; foam dressing applied. Repositioned left lateral with pillows; tolerated care.",
      rationale: "Wound documentation requires measurable descriptors and treatment response, not vague terms like 'looks better'.",
    },
  };
}

function painScenario(): DocumentationScenario {
  return darScenario();
}

function fallScenario(): DocumentationScenario {
  return {
    ...baseScenario("fall-documentation", "Unwitnessed fall documentation", "Med-Surg", "76-year-old admitted with UTI and confusion", "Patient found sitting on floor beside bed at 0210."),
    expectedElements: ["time found", "objective assessment", "patient statement", "injury assessment", "vital signs", "provider notification", "family notification", "follow-up monitoring"],
    legalRisks: ["provider notification", "family notification", "follow-up monitoring", "objective assessment"],
    modelDocumentation: {
      format: "Incident-related charting",
      example:
        "0210 Patient found sitting on floor beside bed, call bell within reach, bed alarm sounding. States, 'I was trying to go to the bathroom.' Denies head strike, dizziness, or pain. VS BP 128/74, HR 92, RR 18, SpO2 95% RA. Full assessment completed: no visible injury, pupils equal/reactive, moving all extremities. Assisted back to bed with two staff using gait belt. Provider notified 0220; family notified per policy. Fall precautions reinforced; bed low, alarm on, toileting schedule initiated. Neuro checks/follow-up monitoring per protocol.",
      rationale: "Fall documentation should chart observed facts, assessment, notifications, interventions, and monitoring without blame.",
    },
  };
}

function rapidScenario(): DocumentationScenario {
  return {
    ...baseScenario("rapid-response-documentation", "Rapid response event", "Med-Surg", "68-year-old with sepsis", "Patient became hypotensive and confused; rapid response called."),
    expectedElements: ["time deterioration recognized", "assessment", "rapid response activation", "interventions", "team communication", "patient response", "transfer or outcome"],
    legalRisks: ["rapid response activation", "interventions", "patient response", "outcome"],
    modelDocumentation: {
      format: "Rapid response note",
      example:
        "1512 Patient newly confused, BP 78/44, HR 128, RR 30, SpO2 91% on 2 L NC, skin cool/mottled. Rapid response activated 1514; charge nurse at bedside. Oxygen increased per protocol, IV access assessed patent, provider/RRT notified. Labs and fluid bolus initiated per orders. 1535 BP 92/54, HR 118, patient remains confused; transferred to ICU with RRT. Report given to ICU RN.",
      rationale: "Deterioration documentation must show recognition, escalation, interventions, team communication, and outcome.",
    },
  };
}

function pediatricScenario(): DocumentationScenario {
  return {
    ...baseScenario("pediatric-documentation", "Pediatric fever and dehydration note", "Pediatrics", "4-year-old with gastroenteritis", "Caregiver reports decreased intake and fewer wet diapers."),
    expectedElements: ["caregiver report", "hydration assessment", "vital signs", "intake output", "weight if relevant", "education", "response"],
    legalRisks: ["caregiver report", "hydration assessment", "education"],
    modelDocumentation: {
      format: "Pediatric note",
      example:
        "Caregiver reports vomiting x3 today and one wet diaper since morning. Child alert, tearful but consolable, mucous membranes dry, cap refill 3 sec, HR 132, T 38.2 C. Oral rehydration encouraged in small frequent amounts per plan; caregiver taught dehydration signs and when to call for help. Intake/output monitoring continued.",
      rationale: "Pediatric documentation includes caregiver report, developmentally appropriate observations, hydration cues, and education.",
    },
  };
}

function mentalHealthScenario(): DocumentationScenario {
  return {
    ...baseScenario("mental-health-documentation", "Mental health safety note", "Mental Health", "28-year-old admitted with depression", "Patient reports worsening hopelessness during evening check-in."),
    expectedElements: ["patient quote", "risk assessment", "protective factors", "intervention", "notification", "safety plan", "follow-up"],
    legalRisks: ["risk assessment", "notification", "safety plan"],
    modelDocumentation: {
      format: "Mental health note",
      example:
        "1930 Patient states, 'I feel like I can't keep doing this.' Affect flat, tearful, maintains eye contact intermittently. Assessed for suicidal ideation, plan, intent, means, and protective factors per policy. Charge nurse/provider notified. Patient moved closer to nursing station; safety precautions maintained per order/policy. Patient agrees to notify staff if urges intensify. Reassessment planned within 30 minutes.",
      rationale: "Mental health documentation should use patient quotes, objective observations, risk assessment, actions, and follow-up.",
    },
  };
}

function homeCareScenario(): DocumentationScenario {
  return {
    ...baseScenario("home-care-documentation", "Home care wound and safety visit", "Community", "79-year-old receiving home wound care", "Home visit for dressing change and fall-risk assessment."),
    expectedElements: ["home environment", "patient consent", "assessment", "wound care", "education", "safety risks", "follow-up"],
    legalRisks: ["consent", "education", "follow-up"],
    modelDocumentation: {
      format: "Home care note",
      example:
        "Home visit completed with patient consent. Patient seated in living room, walker within reach; loose rug noted near hallway and discussed as fall risk. Left lower leg dressing changed per order; wound 1.5 cm x 1.0 cm, scant serous drainage, periwound intact. Patient taught signs of infection and when to call. Follow-up visit scheduled; patient verbalized understanding.",
      rationale: "Home care documentation includes care delivered, environment, consent, education, and follow-up.",
    },
  };
}

function npScenario(): DocumentationScenario {
  return {
    ...soapScenario(),
    id: "np-documentation",
    title: "NP SOAP note with differential and plan",
    expectedElements: ["subjective", "objective", "assessment", "differential diagnosis", "plan", "prescribing considerations", "follow-up", "return precautions"],
    legalRisks: ["differential diagnosis", "plan", "follow-up", "return precautions"],
    modelDocumentation: {
      format: "Advanced SOAP",
      example:
        "S: Reports dysuria and urinary frequency x2 days, no flank pain, no fever. O: Afebrile, mild suprapubic tenderness, no CVA tenderness. UA positive leukocytes/nitrites. A: Likely uncomplicated cystitis; differential includes pyelonephritis, STI/urethritis, vaginitis depending on history and exam. P: Send urine culture if indicated by risk/local policy, prescribe guideline-concordant antibiotic considering allergies, renal function, pregnancy status, and local resistance; hydration and symptom education; return urgently for fever, flank pain, vomiting, worsening symptoms, or no improvement as directed.",
      rationale: "NP documentation must show reasoning, differential, prescribing safety, follow-up, and return precautions.",
    },
  };
}

function ehrTabs(patient: string, event: string): DocumentationEhrTab[] {
  return [
    { id: "summary", label: "Summary", content: [patient, event] },
    { id: "assessments", label: "Assessments", content: ["Focused assessment required", "Document objective findings and patient statements separately"] },
    { id: "flowsheets", label: "Flowsheets", content: ["Vital signs", "Pain score", "Neuro/respiratory/cardiac trends as relevant"] },
    { id: "mar", label: "MAR", content: ["Medication administration", "PRN effectiveness", "Refusals or holds with reason"] },
    { id: "notes", label: "Notes", content: ["Narrative note", "SOAP", "DAR", "Focus note", "SBAR communication"] },
    { id: "orders", label: "Orders", content: ["Provider orders", "Parameters", "Escalation instructions"] },
    { id: "labs", label: "Labs", content: ["Relevant abnormal values", "Critical values", "Actions taken"] },
  ];
}

const AMBIGUOUS_PHRASES = ["good", "bad", "better", "worse", "stable", "fine", "okay", "appears"];

const COMMON_ERRORS = [
  {
    error: "Opinion-based charting",
    unsafeExample: "Patient is being dramatic and refuses to cooperate.",
    saferApproach: "Patient states pain is 9/10 and declines ambulation at this time. Education provided on mobility plan; provider notified per protocol if refusal affects care.",
    rationale: "Objective documentation avoids judgment and records behavior, education, and follow-up.",
  },
  {
    error: "Under-charting reassessment",
    unsafeExample: "PRN medication given.",
    saferApproach: "PRN medication given per MAR for pain 8/10; reassessed in 30 minutes, pain 4/10, RR 16, no nausea or sedation reported.",
    rationale: "Medication documentation requires effectiveness and safety reassessment.",
  },
  {
    error: "Late or unclear event timing",
    unsafeExample: "Patient fell earlier.",
    saferApproach: "0210 Patient found sitting on floor beside bed. Assessment completed, provider notified 0220, family notified per policy.",
    rationale: "Legal defensibility depends on clear time-linked facts and actions.",
  },
  {
    error: "Unsafe vague wording",
    unsafeExample: "Patient stable.",
    saferApproach: "BP 118/70, HR 84, RR 18, SpO2 96% RA, denies chest pain or dyspnea; no acute distress observed.",
    rationale: "Concrete findings are safer than labels because another clinician can interpret them.",
  },
];

function integrationLinks(track: DocumentationTrackId): DocumentationAcademyOutput["integrationLinks"] {
  const base = [
    { label: "Clinical Skills", href: "/app/clinical-skills", rationale: "Practice the skill before documenting it." },
    { label: "Clinical Scenarios", href: "/app/clinical-scenarios", rationale: "Simulation completion should include documentation of actions and outcomes." },
    { label: "Care Plans", href: "/app/clinical-assignments", rationale: "Care plans and documentation should use the same assessment findings and priorities." },
    { label: "Labs", href: "/app/labs", rationale: "Lab documentation should include clinical significance and nursing action." },
    { label: "Pharmacology", href: "/app/pharmacology", rationale: "Medication documentation depends on indication, monitoring, and adverse effects." },
  ];
  if (track === "rapid-response-documentation") {
    return [{ label: "Clinical Judgment Cases", href: "/app/clinical-reasoning", rationale: "Deterioration notes should reflect cue recognition, action, and reassessment." }, ...base];
  }
  return base;
}
