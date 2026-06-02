export type IpeProfessionId =
  | "rn"
  | "rpn-lpn"
  | "np"
  | "respiratory-therapy"
  | "paramedicine"
  | "occupational-therapy"
  | "physiotherapy"
  | "medical-laboratory-technology"
  | "social-work"
  | "psw"
  | "pharmacy"
  | "medicine";

export type IpeCaseId =
  | "stroke"
  | "copd-exacerbation"
  | "heart-failure"
  | "trauma"
  | "septic-shock"
  | "pediatric-respiratory-distress"
  | "mental-health-crisis"
  | "postoperative-complications"
  | "polypharmacy-older-adult"
  | "community-care-transitions";

export type IpeProfessionProfile = {
  readonly id: IpeProfessionId;
  readonly label: string;
  readonly status: "active" | "future";
  readonly scope: readonly string[];
  readonly responsibilities: readonly string[];
  readonly commonMisconceptions: readonly string[];
  readonly collaborationOpportunities: readonly string[];
  readonly escalationTriggers: readonly string[];
};

export type RolePerspective = {
  readonly professionId: IpeProfessionId;
  readonly professionLabel: string;
  readonly priorities: readonly string[];
  readonly assessments: readonly string[];
  readonly actions: readonly string[];
  readonly communicationNeeds: readonly string[];
  readonly expectedOutcomes: readonly string[];
};

export type TeamHuddlePrompt = {
  readonly speakerProfessionId: IpeProfessionId;
  readonly prompt: string;
  readonly strongResponse: string;
  readonly feedbackCriteria: readonly string[];
};

export type ConsultDecision = {
  readonly consultProfessionId: IpeProfessionId;
  readonly whenToInvolve: string;
  readonly why: string;
  readonly informationToCommunicate: readonly string[];
  readonly expectedOutcomes: readonly string[];
};

export type CommunicationExercise = {
  readonly id: string;
  readonly title: string;
  readonly fromProfessionId: IpeProfessionId;
  readonly toProfessionId: IpeProfessionId;
  readonly situation: string;
  readonly expectedSbar: readonly string[];
  readonly coachingFeedback: readonly string[];
};

export type DischargePlanningItem = {
  readonly domain: string;
  readonly teamContributions: readonly string[];
  readonly safetyRisk: string;
  readonly followUpNeed: string;
};

export type ConflictScenario = {
  readonly title: string;
  readonly conflict: string;
  readonly professionsInvolved: readonly IpeProfessionId[];
  readonly resolutionStrategy: readonly string[];
};

export type DeteriorationResponse = {
  readonly trigger: string;
  readonly activation: string;
  readonly teamActions: readonly string[];
  readonly sharedDecisionPoint: string;
};

export type IpeCase = {
  readonly id: IpeCaseId;
  readonly title: string;
  readonly patientSummary: string;
  readonly setting: string;
  readonly acuity: "stable" | "watcher" | "unstable" | "critical";
  readonly learningGoals: readonly string[];
  readonly involvedProfessions: readonly IpeProfessionId[];
  readonly rolePerspectives: readonly RolePerspective[];
  readonly teamHuddle: readonly TeamHuddlePrompt[];
  readonly consultDecisions: readonly ConsultDecision[];
  readonly communicationExercises: readonly CommunicationExercise[];
  readonly dischargePlanning: readonly DischargePlanningItem[];
  readonly conflictScenarios: readonly ConflictScenario[];
  readonly deteriorationResponse: DeteriorationResponse;
};

export type IpeAssessmentSystem = {
  readonly communication: readonly string[];
  readonly collaboration: readonly string[];
  readonly professionalism: readonly string[];
  readonly advocacy: readonly string[];
  readonly clinicalReasoning: readonly string[];
  readonly teamAwareness: readonly string[];
};

export type InstitutionalIpeVersion = {
  readonly assignCases: readonly string[];
  readonly trackCompletion: readonly string[];
  readonly measureCompetencies: readonly string[];
  readonly reports: readonly string[];
};

export type InterprofessionalCaseCollaborationHub = {
  readonly selectedCase: IpeCase;
  readonly caseLibrary: readonly IpeCase[];
  readonly professionExplorer: readonly IpeProfessionProfile[];
  readonly assessmentSystem: IpeAssessmentSystem;
  readonly institutionalVersion: InstitutionalIpeVersion;
  readonly qualityStandard: readonly string[];
};

export const IPE_PROFESSION_PROFILES: readonly IpeProfessionProfile[] = [
  {
    id: "rn",
    label: "RN",
    status: "active",
    scope: ["comprehensive assessment", "care coordination", "medication safety", "patient education", "escalation"],
    responsibilities: ["monitor clinical change", "coordinate bedside priorities", "teach patients and families", "advocate for safe care"],
    commonMisconceptions: ["RNs only complete tasks", "RNs are separate from discharge planning"],
    collaborationOpportunities: ["rounds", "handoff", "rapid response", "discharge planning", "medication safety reviews"],
    escalationTriggers: ["acute deterioration", "unsafe discharge risk", "uncontrolled symptoms", "new abnormal findings"],
  },
  {
    id: "rpn-lpn",
    label: "RPN/LPN",
    status: "active",
    scope: ["focused assessment", "stable or predictable care", "medication administration", "monitoring", "timely escalation"],
    responsibilities: ["recognize changes from baseline", "provide routine interventions", "document focused findings", "report concerns"],
    commonMisconceptions: ["RPN/LPN learners cannot contribute to clinical reasoning", "focused assessment is low value"],
    collaborationOpportunities: ["baseline monitoring", "medication pass updates", "personal care coordination", "SBAR escalation"],
    escalationTriggers: ["change from baseline", "unstable vitals", "unexpected pain", "scope uncertainty"],
  },
  {
    id: "np",
    label: "NP",
    status: "active",
    scope: ["advanced assessment", "diagnostic reasoning", "management planning", "prescribing where authorized", "follow-up planning"],
    responsibilities: ["clarify diagnoses", "order or interpret diagnostics where authorized", "adjust treatment plans", "coordinate longitudinal care"],
    commonMisconceptions: ["NP care is only a physician substitute", "NPs do not need team input"],
    collaborationOpportunities: ["complex case review", "medication optimization", "chronic disease management", "follow-up planning"],
    escalationTriggers: ["diagnostic uncertainty", "failed therapy", "high-risk medication concern", "need for specialty referral"],
  },
  {
    id: "respiratory-therapy",
    label: "Respiratory Therapy",
    status: "active",
    scope: ["oxygen therapy", "ventilation", "ABG interpretation", "airway management", "respiratory deterioration"],
    responsibilities: ["assess oxygenation and ventilation", "troubleshoot respiratory equipment", "guide airway support", "communicate respiratory risk"],
    commonMisconceptions: ["RT involvement begins only after intubation", "oxygen therapy does not need reassessment"],
    collaborationOpportunities: ["dyspnea assessment", "ventilator rounds", "ABG review", "rapid response", "weaning planning"],
    escalationTriggers: ["rising work of breathing", "worsening ABG", "oxygen escalation", "airway compromise"],
  },
  {
    id: "paramedicine",
    label: "Paramedicine",
    status: "active",
    scope: ["scene assessment", "prehospital stabilization", "trauma care", "ECG interpretation", "transport decisions"],
    responsibilities: ["identify immediate threats", "stabilize during transport", "communicate timeline and interventions", "select appropriate destination"],
    commonMisconceptions: ["paramedicine ends at transport", "prehospital information is less important than hospital findings"],
    collaborationOpportunities: ["handoff", "trauma activation", "stroke or STEMI pathways", "community paramedicine transitions"],
    escalationTriggers: ["unsafe scene", "time-sensitive condition", "airway risk", "shock", "major trauma"],
  },
  {
    id: "occupational-therapy",
    label: "Occupational Therapy",
    status: "active",
    scope: ["functional assessment", "ADLs", "cognitive-functional safety", "home safety", "adaptive equipment"],
    responsibilities: ["assess function", "plan meaningful activity support", "recommend equipment", "identify discharge barriers"],
    commonMisconceptions: ["OT is only upper-extremity exercise", "function can be inferred from diagnosis alone"],
    collaborationOpportunities: ["discharge planning", "home safety", "cognition and ADL planning", "equipment teaching"],
    escalationTriggers: ["unsafe home setup", "new cognitive barrier", "ADL decline", "caregiver support gap"],
  },
  {
    id: "physiotherapy",
    label: "Physiotherapy",
    status: "active",
    scope: ["mobility assessment", "rehabilitation progression", "exercise prescription", "transfer safety", "fall prevention"],
    responsibilities: ["assess mobility", "progress activity safely", "recommend mobility aids", "identify rehab readiness"],
    commonMisconceptions: ["PT is only walking patients", "mobilization is optional until discharge day"],
    collaborationOpportunities: ["early mobility", "fall prevention", "discharge planning", "activity tolerance review"],
    escalationTriggers: ["unsafe transfer", "new weakness", "poor activity tolerance", "high fall risk"],
  },
  {
    id: "medical-laboratory-technology",
    label: "Medical Laboratory Technology",
    status: "active",
    scope: ["specimen integrity", "quality assurance", "critical result reporting", "laboratory interpretation support"],
    responsibilities: ["protect specimen quality", "recognize invalid results", "report critical values", "support diagnostic accuracy"],
    commonMisconceptions: ["MLT work is disconnected from bedside decisions", "all lab abnormalities reflect true patient change"],
    collaborationOpportunities: ["critical value notification", "specimen recollection decisions", "diagnostic trend review", "quality concerns"],
    escalationTriggers: ["critical result", "hemolyzed or contaminated sample", "unexpected trend", "quality control concern"],
  },
  {
    id: "social-work",
    label: "Social Work",
    status: "active",
    scope: ["psychosocial assessment", "resource navigation", "safety planning", "discharge barriers", "advocacy"],
    responsibilities: ["identify social risks", "coordinate resources", "support family meetings", "advocate for safe transitions"],
    commonMisconceptions: ["social work is only discharge paperwork", "social barriers are separate from clinical outcomes"],
    collaborationOpportunities: ["family meetings", "community supports", "safety planning", "resource access", "care transitions"],
    escalationTriggers: ["unsafe discharge", "abuse or neglect concern", "housing instability", "resource access barrier"],
  },
  {
    id: "psw",
    label: "PSW",
    status: "active",
    scope: ["personal care", "mobility assistance", "safety observation", "comfort support", "communication"],
    responsibilities: ["support ADLs", "observe day-to-day changes", "report concerns", "protect dignity and safety"],
    commonMisconceptions: ["PSWs do not contribute to clinical awareness", "routine care observations are not important"],
    collaborationOpportunities: ["baseline changes", "mobility safety", "skin concerns", "comfort and personal care planning"],
    escalationTriggers: ["new confusion", "skin breakdown", "fall concern", "refusal of care", "new pain"],
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    status: "future",
    scope: ["medication reconciliation", "drug interaction review", "dosing support", "adherence planning"],
    responsibilities: ["identify medication risks", "support safe prescribing", "teach medication use", "optimize therapy"],
    commonMisconceptions: ["pharmacy only dispenses medications", "medication review is optional"],
    collaborationOpportunities: ["polypharmacy review", "renal dosing", "antimicrobial stewardship", "discharge medications"],
    escalationTriggers: ["high-risk medication", "interaction concern", "renal dose issue", "access or adherence barrier"],
  },
  {
    id: "medicine",
    label: "Medicine",
    status: "future",
    scope: ["diagnosis", "orders", "medical management", "specialty consultation", "prognosis discussion"],
    responsibilities: ["lead diagnostic workup", "write or adjust orders", "coordinate medical plan", "consult specialties"],
    commonMisconceptions: ["medicine works without bedside team data", "orders alone solve team coordination"],
    collaborationOpportunities: ["rounds", "diagnostic uncertainty", "family meetings", "care escalation", "discharge readiness"],
    escalationTriggers: ["new instability", "diagnostic uncertainty", "treatment failure", "urgent order need"],
  },
] as const;

const CASE_LIBRARY_BASE: readonly Omit<IpeCase, "rolePerspectives" | "teamHuddle" | "consultDecisions" | "communicationExercises" | "dischargePlanning" | "conflictScenarios" | "deteriorationResponse">[] = [
  {
    id: "stroke",
    title: "Stroke With Dysphagia and Discharge Risk",
    patientSummary: "A 72-year-old presents with right-sided weakness, expressive aphasia, dysphagia risk, and family concern about returning home.",
    setting: "Emergency to stroke unit",
    acuity: "watcher",
    learningGoals: ["role clarity during time-sensitive stroke care", "communication across handoffs", "safe discharge planning"],
    involvedProfessions: ["rn", "np", "paramedicine", "occupational-therapy", "physiotherapy", "social-work", "psw", "medical-laboratory-technology"],
  },
  {
    id: "copd-exacerbation",
    title: "COPD Exacerbation With Rising Work of Breathing",
    patientSummary: "A 68-year-old with COPD has dyspnea, wheeze, increasing oxygen needs, abnormal ABG, and anxiety about breathlessness.",
    setting: "Emergency department",
    acuity: "unstable",
    learningGoals: ["respiratory collaboration", "oxygen and ABG communication", "deterioration escalation"],
    involvedProfessions: ["rn", "rpn-lpn", "np", "respiratory-therapy", "medical-laboratory-technology", "social-work", "psw"],
  },
  {
    id: "heart-failure",
    title: "Heart Failure With Functional Decline",
    patientSummary: "A 76-year-old with edema, dyspnea, elevated BNP, low potassium, mobility decline, and limited home support.",
    setting: "Medical unit",
    acuity: "watcher",
    learningGoals: ["team-based monitoring", "mobility and home safety planning", "medication and lab risk recognition"],
    involvedProfessions: ["rn", "rpn-lpn", "np", "respiratory-therapy", "occupational-therapy", "physiotherapy", "medical-laboratory-technology", "social-work", "psw", "pharmacy"],
  },
  {
    id: "trauma",
    title: "Multi-System Trauma After Collision",
    patientSummary: "A young adult arrives after a high-speed collision with hypotension, suspected internal bleeding, pain, and family distress.",
    setting: "Trauma bay",
    acuity: "critical",
    learningGoals: ["rapid role coordination", "handoff precision", "shared decision-making under pressure"],
    involvedProfessions: ["rn", "np", "paramedicine", "respiratory-therapy", "medical-laboratory-technology", "social-work", "medicine"],
  },
  {
    id: "septic-shock",
    title: "Septic Shock With Organ Dysfunction",
    patientSummary: "An older adult has fever, hypotension, lactate elevation, altered mental status, and suspected pneumonia source.",
    setting: "Emergency to ICU",
    acuity: "critical",
    learningGoals: ["sepsis bundle teamwork", "critical lab escalation", "rapid communication"],
    involvedProfessions: ["rn", "np", "respiratory-therapy", "medical-laboratory-technology", "pharmacy", "medicine", "social-work"],
  },
  {
    id: "pediatric-respiratory-distress",
    title: "Pediatric Respiratory Distress",
    patientSummary: "A 4-year-old has retractions, wheeze, fatigue, low oxygen saturation, and a distressed caregiver.",
    setting: "Pediatric emergency",
    acuity: "unstable",
    learningGoals: ["family-centred communication", "respiratory escalation", "pediatric safety"],
    involvedProfessions: ["rn", "np", "respiratory-therapy", "medical-laboratory-technology", "social-work", "medicine"],
  },
  {
    id: "mental-health-crisis",
    title: "Mental Health Crisis With Safety Concerns",
    patientSummary: "A patient presents with suicidal ideation, agitation, limited supports, and uncertainty about safe discharge.",
    setting: "Emergency mental health area",
    acuity: "watcher",
    learningGoals: ["safety planning", "therapeutic communication", "advocacy and scope clarity"],
    involvedProfessions: ["rn", "np", "social-work", "psw", "medicine"],
  },
  {
    id: "postoperative-complications",
    title: "Postoperative Complications After Abdominal Surgery",
    patientSummary: "A postoperative patient has increasing pain, tachycardia, reduced mobility, wound drainage, and nausea.",
    setting: "Surgical unit",
    acuity: "watcher",
    learningGoals: ["early complication recognition", "mobility and wound collaboration", "patient advocacy"],
    involvedProfessions: ["rn", "rpn-lpn", "np", "physiotherapy", "occupational-therapy", "medical-laboratory-technology", "psw", "medicine"],
  },
  {
    id: "polypharmacy-older-adult",
    title: "Polypharmacy in an Older Adult With Falls",
    patientSummary: "An 84-year-old has recurrent falls, dizziness, multiple medications, mild cognitive change, and caregiver strain.",
    setting: "Primary care and community transition",
    acuity: "stable",
    learningGoals: ["medication risk teamwork", "function and home safety", "advocacy for safe supports"],
    involvedProfessions: ["rn", "np", "occupational-therapy", "physiotherapy", "social-work", "psw", "pharmacy"],
  },
  {
    id: "community-care-transitions",
    title: "Community Care Transition After Hospitalization",
    patientSummary: "A patient discharged after pneumonia needs home oxygen review, medication teaching, mobility support, and community services.",
    setting: "Hospital to home",
    acuity: "stable",
    learningGoals: ["safe care transitions", "interprofessional handoff", "home support planning"],
    involvedProfessions: ["rn", "rpn-lpn", "respiratory-therapy", "occupational-therapy", "physiotherapy", "social-work", "psw", "pharmacy"],
  },
] as const;

export function listIpeProfessionProfiles(): readonly IpeProfessionProfile[] {
  return IPE_PROFESSION_PROFILES;
}

export function generateInterprofessionalCaseCollaborationHub(caseId: IpeCaseId = "heart-failure"): InterprofessionalCaseCollaborationHub {
  const caseLibrary = CASE_LIBRARY_BASE.map(buildCase);
  return {
    selectedCase: caseLibrary.find((item) => item.id === caseId) ?? caseLibrary[0],
    caseLibrary,
    professionExplorer: IPE_PROFESSION_PROFILES,
    assessmentSystem: {
      communication: ["shares concise, relevant information", "uses closed-loop language", "adapts message to recipient"],
      collaboration: ["invites profession-specific input", "integrates recommendations", "clarifies shared goals"],
      professionalism: ["uses respectful language", "acknowledges scope", "responds constructively to conflict"],
      advocacy: ["identifies patient priorities", "raises safety barriers", "protects patient dignity and access"],
      clinicalReasoning: ["recognizes relevant cues", "prioritizes risk", "links actions to outcomes"],
      teamAwareness: ["knows who to involve", "understands handoff needs", "anticipates downstream impact"],
    },
    institutionalVersion: {
      assignCases: ["assign by course, cohort, profession, or IPE competency"],
      trackCompletion: ["case viewed", "role perspective completed", "huddle response submitted", "reflection completed"],
      measureCompetencies: ["communication", "collaboration", "role clarity", "advocacy", "team-based decision-making"],
      reports: ["cohort completion", "profession comparison", "competency trends", "case difficulty insights"],
    },
    qualityStandard: [
      "Every profession must have authentic responsibilities, escalation triggers, and communication needs.",
      "Future pharmacy and medicine profiles remain marked as future until full content depth is approved.",
      "Cases must show shared patient outcomes, not isolated task lists.",
      "No profession is presented as secondary; each contribution must affect safety, function, diagnosis, treatment, advocacy, or transition planning.",
    ],
  };
}

function buildCase(base: (typeof CASE_LIBRARY_BASE)[number]): IpeCase {
  return {
    ...base,
    rolePerspectives: base.involvedProfessions.map((professionId) => buildRolePerspective(professionId, base.id)),
    teamHuddle: buildTeamHuddle(base.involvedProfessions, base.id),
    consultDecisions: base.involvedProfessions.filter((professionId) => professionId !== "rn").map((professionId) => buildConsultDecision(professionId, base.id)),
    communicationExercises: buildCommunicationExercises(base.involvedProfessions, base.id),
    dischargePlanning: buildDischargePlanning(base.involvedProfessions),
    conflictScenarios: buildConflictScenarios(base.involvedProfessions),
    deteriorationResponse: buildDeteriorationResponse(base.id),
  };
}

function profileFor(id: IpeProfessionId): IpeProfessionProfile {
  const profile = IPE_PROFESSION_PROFILES.find((item) => item.id === id);
  if (!profile) throw new Error(`Unknown IPE profession: ${id}`);
  return profile;
}

function buildRolePerspective(professionId: IpeProfessionId, caseId: IpeCaseId): RolePerspective {
  const profile = profileFor(professionId);
  const caseFocus = caseSpecificFocus(caseId, professionId);
  return {
    professionId,
    professionLabel: profile.label,
    priorities: [caseFocus.priority, ...profile.responsibilities.slice(0, 3)],
    assessments: [caseFocus.assessment, ...profile.scope.slice(0, 3)],
    actions: [caseFocus.action, ...profile.collaborationOpportunities.slice(0, 3)],
    communicationNeeds: [
      `Share ${caseFocus.communication} with the team.`,
      `Clarify what ${profile.label} needs before acting.`,
      `Document the ${profile.label} recommendation and follow-up need.`,
    ],
    expectedOutcomes: [caseFocus.outcome, "Clearer role boundaries", "Safer shared care plan"],
  };
}

function caseSpecificFocus(caseId: IpeCaseId, professionId: IpeProfessionId) {
  const respiratory = professionId === "respiratory-therapy";
  const rehab = professionId === "physiotherapy" || professionId === "occupational-therapy";
  const social = professionId === "social-work";
  const lab = professionId === "medical-laboratory-technology";
  const paramedic = professionId === "paramedicine";
  const psw = professionId === "psw";

  if (caseId === "heart-failure") {
    if (respiratory) return focus("oxygenation and work of breathing", "SpO2, breath sounds, oxygen response", "recommend oxygen escalation or weaning plan", "respiratory status and oxygen needs", "dyspnea is controlled with safe oxygen strategy");
    if (rehab) return focus("safe function before discharge", "mobility, ADLs, activity tolerance", "recommend mobility or home safety supports", "functional barriers", "patient can function safely with supports");
    if (social) return focus("home support and medication access", "caregiver availability and financial barriers", "coordinate community resources", "discharge barriers", "transition plan is realistic");
    if (lab) return focus("BNP, potassium, renal trend accuracy", "specimen quality and critical values", "escalate abnormal trends", "lab trend significance", "team recognizes electrolyte and renal risk");
  }
  if (caseId === "copd-exacerbation" && respiratory) return focus("ventilation and airway risk", "ABG, work of breathing, accessory muscles", "guide bronchodilator and ventilation support", "ABG interpretation", "respiratory failure is prevented or escalated early");
  if (caseId === "trauma" && paramedic) return focus("prehospital mechanism and timeline", "scene findings, vitals, interventions", "handoff mechanism and response to treatment", "prehospital timeline", "trauma team acts on accurate mechanism and deterioration history");
  if (caseId === "septic-shock" && lab) return focus("critical lactate and cultures", "lactate trend, specimen timing, culture status", "prioritize critical result communication", "time-sensitive critical values", "sepsis decisions use reliable lab data");
  if (caseId === "mental-health-crisis" && social) return focus("safety plan and supports", "risk, protective factors, housing and family supports", "coordinate crisis resources", "safety and resource needs", "discharge plan protects patient safety");
  if (caseId === "community-care-transitions" && psw) return focus("home observation and daily support", "mobility, personal care, confusion, skin", "report changes and support care plan", "changes from baseline", "home team catches deterioration early");

  return focus(
    `${profileFor(professionId).label} contribution to shared safety`,
    profileFor(professionId).scope[0],
    profileFor(professionId).responsibilities[0],
    profileFor(professionId).collaborationOpportunities[0],
    "team has a safer, clearer plan",
  );
}

function focus(priority: string, assessment: string, action: string, communication: string, outcome: string) {
  return { priority, assessment, action, communication, outcome };
}

function buildTeamHuddle(professionIds: readonly IpeProfessionId[], caseId: IpeCaseId): readonly TeamHuddlePrompt[] {
  return professionIds.slice(0, 6).map((professionId) => {
    const profile = profileFor(professionId);
    return {
      speakerProfessionId: professionId,
      prompt: `You are the ${profile.label} in rounds for the ${caseId.replaceAll("-", " ")} case. What is your highest-priority update?`,
      strongResponse: `${profile.label} shares the most safety-relevant cue, explains the role-specific concern, and names what the team needs next.`,
      feedbackCriteria: ["specific cue shared", "scope is clear", "team request is actionable", "patient advocacy is visible"],
    };
  });
}

function buildConsultDecision(professionId: IpeProfessionId, caseId: IpeCaseId): ConsultDecision {
  const profile = profileFor(professionId);
  return {
    consultProfessionId: professionId,
    whenToInvolve: `Involve ${profile.label} when the ${caseId.replaceAll("-", " ")} case shows ${profile.escalationTriggers[0]}.`,
    why: `${profile.label} contributes ${profile.responsibilities[0]} and helps prevent missed team-based risks.`,
    informationToCommunicate: ["current concern", "relevant trend", "what has changed", "what decision is needed"],
    expectedOutcomes: ["role-specific recommendation", "safer care plan", "clear documentation and follow-up"],
  };
}

function buildCommunicationExercises(professionIds: readonly IpeProfessionId[], caseId: IpeCaseId): readonly CommunicationExercise[] {
  const pairs: Array<[IpeProfessionId, IpeProfessionId, string]> = [
    ["rn", "medicine", "RN to physician"],
    ["rn", "respiratory-therapy", "RN to RT"],
    ["respiratory-therapy", "rn", "RT to RN"],
    ["physiotherapy", "rn", "PT to nursing"],
    ["occupational-therapy", "rn", "OT to nursing"],
    ["rn", "social-work", "Social work referral"],
  ];
  return pairs
    .filter(([from, to]) => professionIds.includes(from) && professionIds.includes(to))
    .map(([from, to, title]) => ({
      id: `${caseId}-${from}-to-${to}`,
      title,
      fromProfessionId: from,
      toProfessionId: to,
      situation: `Communicate a time-sensitive concern in the ${caseId.replaceAll("-", " ")} case.`,
      expectedSbar: ["Situation: current concern", "Background: relevant history and trend", "Assessment: role-specific interpretation", "Recommendation: clear request"],
      coachingFeedback: ["keep it concise", "avoid assumptions", "state urgency", "ask for a closed-loop response"],
    }));
}

function buildDischargePlanning(professionIds: readonly IpeProfessionId[]): readonly DischargePlanningItem[] {
  const items: DischargePlanningItem[] = [
    {
      domain: "Home supports",
      teamContributions: contributionFor(professionIds, ["social-work", "psw", "rn"]),
      safetyRisk: "Patient may not have enough support for medications, hygiene, meals, or symptom monitoring.",
      followUpNeed: "Confirm caregiver plan, community referrals, and escalation instructions.",
    },
    {
      domain: "Equipment and function",
      teamContributions: contributionFor(professionIds, ["occupational-therapy", "physiotherapy", "respiratory-therapy"]),
      safetyRisk: "Unsafe mobility, missing assistive devices, or unclear oxygen equipment can cause harm after discharge.",
      followUpNeed: "Confirm equipment, teaching, and reassessment plan.",
    },
    {
      domain: "Medication access",
      teamContributions: contributionFor(professionIds, ["pharmacy", "np", "rn"]),
      safetyRisk: "Medication confusion, affordability barriers, or interactions may cause readmission.",
      followUpNeed: "Confirm reconciliation, teaching, and pharmacy follow-up.",
    },
  ];
  return items.filter((item) => item.teamContributions.length > 0);
}

function contributionFor(professionIds: readonly IpeProfessionId[], candidates: readonly IpeProfessionId[]): readonly string[] {
  return candidates.filter((candidate) => professionIds.includes(candidate)).map((candidate) => `${profileFor(candidate).label}: ${profileFor(candidate).responsibilities[0]}`);
}

function buildConflictScenarios(professionIds: readonly IpeProfessionId[]): readonly ConflictScenario[] {
  return [
    {
      title: "Competing Priorities During Discharge Planning",
      conflict: "One team member believes discharge is medically ready while another identifies functional or social barriers.",
      professionsInvolved: professionIds.filter((id) => ["rn", "occupational-therapy", "physiotherapy", "social-work", "medicine"].includes(id)),
      resolutionStrategy: ["name the shared patient goal", "separate facts from assumptions", "identify the safety barrier", "agree on next decision owner"],
    },
    {
      title: "Scope Misunderstanding",
      conflict: "A learner expects another profession to perform an action outside local scope or without enough information.",
      professionsInvolved: professionIds.slice(0, 4),
      resolutionStrategy: ["clarify scope respectfully", "state what information is needed", "offer a role-appropriate alternative", "document the plan"],
    },
  ];
}

function buildDeteriorationResponse(caseId: IpeCaseId): DeteriorationResponse {
  const triggerByCase: Partial<Record<IpeCaseId, string>> = {
    "copd-exacerbation": "SpO2 drops, respiratory rate rises, and ABG shows worsening ventilation.",
    "septic-shock": "Blood pressure falls, lactate rises, and mental status worsens.",
    trauma: "Hypotension develops with increasing abdominal pain and pallor.",
    stroke: "Neurologic deficits worsen and swallowing safety is uncertain.",
    "pediatric-respiratory-distress": "Retractions worsen and the child becomes fatigued.",
  };
  return {
    trigger: triggerByCase[caseId] ?? "The patient shows a clinically meaningful change from baseline.",
    activation: "Activate the appropriate team response, use closed-loop communication, and clarify immediate priorities.",
    teamActions: ["RN/RPN monitors and escalates bedside changes", "RT or relevant specialist addresses airway or therapy needs", "NP/medicine clarifies diagnostic and treatment plan", "MLT/pharmacy/social work/rehab contribute role-specific safety information when involved"],
    sharedDecisionPoint: "The team decides whether the patient can remain in the current setting, needs urgent intervention, or requires transfer/escalation.",
  };
}

export function summarizeIpeHubForCopy(hub: InterprofessionalCaseCollaborationHub): string {
  return [
    `Interprofessional Case Collaboration Hub: ${hub.selectedCase.title}`,
    hub.selectedCase.patientSummary,
    "",
    "Role Perspectives",
    ...hub.selectedCase.rolePerspectives.map((view) => `- ${view.professionLabel}: ${view.priorities[0]}`),
    "",
    "Consult Decisions",
    ...hub.selectedCase.consultDecisions.map((consult) => `- ${profileFor(consult.consultProfessionId).label}: ${consult.whenToInvolve}`),
    "",
    "Assessment Domains",
    "Communication, Collaboration, Professionalism, Advocacy, Clinical Reasoning, Team Awareness",
  ].join("\n");
}
