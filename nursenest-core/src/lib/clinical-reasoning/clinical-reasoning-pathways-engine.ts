export type ClinicalReasoningProfession =
  | "rn"
  | "rpn_lpn"
  | "np"
  | "rt"
  | "paramedic"
  | "ot"
  | "pt"
  | "mlt"
  | "psw";

export type ClinicalReasoningPathwayType =
  | "assessment"
  | "diagnostic"
  | "medication"
  | "lab_interpretation"
  | "clinical_deterioration"
  | "emergency_response"
  | "discharge_planning"
  | "patient_education";

export type ClinicalReasoningStepKey =
  | "recognize_cues"
  | "analyze_cues"
  | "prioritize_problems"
  | "generate_solutions"
  | "take_action"
  | "evaluate_outcomes";

export type ReasoningScoreDomain =
  | "cueRecognition"
  | "analysis"
  | "prioritization"
  | "decisionMaking"
  | "evaluation";

export type ThinkingError =
  | "anchoring_bias"
  | "confirmation_bias"
  | "premature_closure"
  | "tunnel_vision"
  | "task_fixation"
  | "availability_bias";

export type DeteriorationStage = "early" | "intermediate" | "late" | "critical";

export type ReasoningDecisionOption = {
  id: string;
  label: string;
  quality: "best" | "partial" | "delayed" | "unsafe";
  feedback: string;
  consequence: string;
  thinkingError?: ThinkingError;
  scoreImpact: Partial<Record<ReasoningScoreDomain, number>>;
};

export type ClinicalReasoningStep = {
  key: ClinicalReasoningStepKey;
  title: string;
  ncjmmLabel: string;
  prompt: string;
  expertThinking: string;
  noviceThinking: string;
  breakpointQuestions: string[];
  prioritizationPrinciples: string[];
  options: ReasoningDecisionOption[];
};

export type DeteriorationTrack = {
  stage: DeteriorationStage;
  signs: string[];
  requiredActions: string[];
  escalationPoint: string;
};

export type ClinicalReasoningPathway = {
  id: string;
  title: string;
  type: ClinicalReasoningPathwayType;
  professions: ClinicalReasoningProfession[];
  patient: string;
  setting: string;
  summary: string;
  cues: string[];
  steps: ClinicalReasoningStep[];
  deteriorationTrack: DeteriorationTrack[];
  integrations: Array<{
    label: string;
    href: string;
    surface: "question_bank" | "ngn" | "simulation" | "ecg" | "labs" | "clinical_skills" | "care_plans" | "concept_maps" | "documentation";
  }>;
};

export type ClinicalReasoningAttempt = {
  pathwayId: string;
  selections: Partial<Record<ClinicalReasoningStepKey, string>>;
};

export type ClinicalReasoningScore = Record<ReasoningScoreDomain, number> & {
  overall: number;
  selectedQualities: Record<ClinicalReasoningStepKey, ReasoningDecisionOption["quality"] | "missing">;
  thinkingErrors: ThinkingError[];
  outcomeSummary: string[];
};

export const NCJMM_STEPS: Array<{ key: ClinicalReasoningStepKey; label: string }> = [
  { key: "recognize_cues", label: "Recognize Cues" },
  { key: "analyze_cues", label: "Analyze Cues" },
  { key: "prioritize_problems", label: "Prioritize Problems" },
  { key: "generate_solutions", label: "Generate Solutions" },
  { key: "take_action", label: "Take Action" },
  { key: "evaluate_outcomes", label: "Evaluate Outcomes" },
];

export const THINKING_ERROR_LABELS: Record<ThinkingError, string> = {
  anchoring_bias: "Anchoring Bias",
  confirmation_bias: "Confirmation Bias",
  premature_closure: "Premature Closure",
  tunnel_vision: "Tunnel Vision",
  task_fixation: "Task Fixation",
  availability_bias: "Availability Bias",
};

export const PROFESSION_TRACKS: Record<ClinicalReasoningProfession, { label: string; focus: string }> = {
  rn: { label: "RN", focus: "Assessment, intervention priorities, safety, escalation, and evaluation." },
  rpn_lpn: { label: "RPN/LPN", focus: "Predictability, focused assessment, reporting changes, and safe care within scope." },
  np: { label: "NP", focus: "Differential diagnosis, diagnostic planning, prescribing safety, and follow-up." },
  rt: { label: "RT", focus: "Airway, ventilation, oxygenation, respiratory equipment, and escalation." },
  paramedic: { label: "Paramedic", focus: "Scene safety, rapid assessment, transport decisions, and emergency stabilization." },
  ot: { label: "OT", focus: "Functional assessment, ADLs, adaptive strategies, safety, and discharge readiness." },
  pt: { label: "PT", focus: "Mobility, gait, transfer safety, endurance, and functional progression." },
  mlt: { label: "MLT", focus: "Specimen integrity, critical values, diagnostic interpretation, and communication." },
  psw: { label: "PSW", focus: "Observation, safety, assistance with care, and timely reporting of concerning changes." },
};

export const CLINICAL_REASONING_PATHWAYS: ClinicalReasoningPathway[] = [
  {
    id: "chf-deterioration-oxygenation-fluid-overload",
    title: "CHF Deterioration: Oxygenation And Fluid Overload",
    type: "clinical_deterioration",
    professions: ["rn", "rpn_lpn", "np", "rt", "paramedic", "psw"],
    patient: "72-year-old with chronic heart failure and worsening dyspnea",
    setting: "Medical-surgical unit with possible escalation to higher acuity care",
    summary:
      "Learners reason through crackles, dyspnea, oxygen saturation 88%, weight gain, and edema to identify worsening heart failure and prevent respiratory deterioration.",
    cues: ["Crackles", "Dyspnea", "O2 Sat 88%", "3 kg weight gain", "Bilateral lower-extremity edema", "Fatigue", "Needs extra pillows to breathe"],
    steps: [
      {
        key: "recognize_cues",
        title: "Which Findings Matter Most?",
        ncjmmLabel: "Recognize Cues",
        prompt: "Select the cue cluster that should immediately get your attention.",
        expertThinking:
          "An expert groups oxygen saturation 88%, dyspnea, crackles, rapid weight gain, and edema as a pattern of congestion with oxygenation risk.",
        noviceThinking:
          "A novice may notice edema and weight gain but treat them as routine chronic heart failure findings rather than deterioration cues.",
        breakpointQuestions: [
          "What are you concerned about?",
          "What could kill the patient first?",
          "Which cue is abnormal enough that it cannot wait?",
        ],
        prioritizationPrinciples: ["ABCs", "Expected vs Unexpected", "Deterioration Risk"],
        options: [
          {
            id: "oxygenation-congestion-cluster",
            label: "O2 Sat 88%, dyspnea, crackles, weight gain, and edema together",
            quality: "best",
            feedback: "Correct. This cluster suggests fluid overload affecting breathing and possible clinical deterioration.",
            consequence: "You recognize the high-risk pattern early and move toward focused respiratory and perfusion assessment.",
            scoreImpact: { cueRecognition: 100, analysis: 80 },
          },
          {
            id: "edema-only",
            label: "Edema only",
            quality: "partial",
            feedback: "Edema matters, but it is not the whole problem. The oxygenation cues make this more urgent.",
            consequence: "You may under-triage the patient if you do not connect edema with respiratory findings.",
            thinkingError: "tunnel_vision",
            scoreImpact: { cueRecognition: 55, analysis: 40 },
          },
          {
            id: "fatigue-only",
            label: "Fatigue because older adults often feel tired in hospital",
            quality: "unsafe",
            feedback: "This normalizes an abnormal pattern and misses oxygenation risk.",
            consequence: "Delayed recognition may allow worsening pulmonary edema and respiratory distress.",
            thinkingError: "premature_closure",
            scoreImpact: { cueRecognition: 20, analysis: 10 },
          },
        ],
      },
      {
        key: "analyze_cues",
        title: "What Do These Findings Suggest?",
        ncjmmLabel: "Analyze Cues",
        prompt: "Interpret what the cue pattern most likely means.",
        expertThinking:
          "The expert connects left-sided congestion to crackles and dyspnea, while weight gain and edema suggest fluid retention. The pattern suggests decompensating heart failure.",
        noviceThinking:
          "A novice may look for a single abnormal value and miss the pathophysiology linking fluid retention to oxygenation.",
        breakpointQuestions: ["What are you missing?", "What complication may be developing?", "Does one cue explain all findings?"],
        prioritizationPrinciples: ["Pattern Recognition", "Mechanism To Assessment", "Acute vs Chronic"],
        options: [
          {
            id: "decompensating-heart-failure",
            label: "Worsening heart failure with pulmonary congestion and hypoxemia risk",
            quality: "best",
            feedback: "Correct. The cues point to pulmonary congestion and possible respiratory compromise.",
            consequence: "You prepare to assess breathing, perfusion, fluid status, medications, and escalation thresholds.",
            scoreImpact: { analysis: 100, prioritization: 80 },
          },
          {
            id: "routine-chronic-edema",
            label: "Expected chronic edema that can wait until rounds",
            quality: "unsafe",
            feedback: "The O2 Sat 88% and dyspnea make this acute, not routine.",
            consequence: "Waiting may delay treatment for pulmonary edema or worsening hypoxemia.",
            thinkingError: "anchoring_bias",
            scoreImpact: { analysis: 20, prioritization: 20 },
          },
          {
            id: "pneumonia-primary",
            label: "Likely pneumonia because crackles are present",
            quality: "partial",
            feedback: "Pneumonia could be a differential, but the weight gain and edema strongly support fluid overload. Do not anchor on one cue.",
            consequence: "You may pursue an incomplete problem representation and miss fluid overload management.",
            thinkingError: "availability_bias",
            scoreImpact: { analysis: 55, prioritization: 45 },
          },
        ],
      },
      {
        key: "prioritize_problems",
        title: "What Should Be Prioritized?",
        ncjmmLabel: "Prioritize Problems",
        prompt: "Choose the priority problem before selecting interventions.",
        expertThinking:
          "The expert prioritizes breathing and oxygenation first, then circulation, fluid overload, medication safety, and teaching once stable.",
        noviceThinking:
          "A novice may jump to discharge teaching or daily weights because those are common heart failure topics, but they do not address acute instability.",
        breakpointQuestions: ["What can wait?", "What requires escalation?", "Which problem is unstable?"],
        prioritizationPrinciples: ["ABCs", "Stable vs Unstable", "Safety Risks", "Maslow"],
        options: [
          {
            id: "impaired-gas-exchange",
            label: "Impaired gas exchange / worsening oxygenation related to pulmonary congestion",
            quality: "best",
            feedback: "Correct. Breathing is the priority because O2 Sat 88% with dyspnea and crackles is unstable.",
            consequence: "You focus first on respiratory assessment, positioning, oxygen per order or protocol, and escalation.",
            scoreImpact: { prioritization: 100, decisionMaking: 80 },
          },
          {
            id: "knowledge-deficit",
            label: "Knowledge deficit about low-sodium diet",
            quality: "delayed",
            feedback: "Teaching is important later, but not before oxygenation and deterioration risk are addressed.",
            consequence: "The patient remains hypoxemic while lower-priority teaching occurs.",
            thinkingError: "task_fixation",
            scoreImpact: { prioritization: 35, decisionMaking: 25 },
          },
          {
            id: "activity-intolerance",
            label: "Activity intolerance because the patient is tired",
            quality: "partial",
            feedback: "Activity intolerance is real, but it is downstream from oxygenation and congestion.",
            consequence: "You may improve comfort but miss the immediate physiologic threat.",
            scoreImpact: { prioritization: 55, decisionMaking: 45 },
          },
        ],
      },
      {
        key: "generate_solutions",
        title: "What Solutions Fit The Problem?",
        ncjmmLabel: "Generate Solutions",
        prompt: "Select the solution set that best matches the priority.",
        expertThinking:
          "The expert generates actions that address oxygenation, positioning, focused assessment, fluid overload, medication review, and escalation readiness.",
        noviceThinking:
          "A novice may pick one task, such as documenting or rechecking later, instead of a bundled safety response.",
        breakpointQuestions: ["What should happen first?", "What action reduces harm?", "What data do you need next?"],
        prioritizationPrinciples: ["First Assess vs First Intervene", "Safety", "Deterioration Risk"],
        options: [
          {
            id: "respiratory-fluid-response-bundle",
            label: "Upright positioning, focused respiratory/perfusion assessment, oxygen per order or protocol, review diuretic plan, notify RN/provider if worsening",
            quality: "best",
            feedback: "Correct. This solution set addresses the physiologic threat and prepares escalation.",
            consequence: "The patient receives timely assessment and support while the team evaluates treatment needs.",
            scoreImpact: { decisionMaking: 100, evaluation: 70 },
          },
          {
            id: "document-recheck-hour",
            label: "Document findings and recheck in one hour",
            quality: "unsafe",
            feedback: "O2 Sat 88% with dyspnea requires action now, not passive documentation.",
            consequence: "Delayed intervention may worsen hypoxemia and distress.",
            thinkingError: "premature_closure",
            scoreImpact: { decisionMaking: 15, evaluation: 15 },
          },
          {
            id: "teach-daily-weights",
            label: "Teach daily weights and sodium restriction",
            quality: "delayed",
            feedback: "This is appropriate after stabilization, but it does not correct the immediate breathing concern.",
            consequence: "Education is poorly timed and the priority physiologic problem persists.",
            thinkingError: "task_fixation",
            scoreImpact: { decisionMaking: 40, evaluation: 25 },
          },
        ],
      },
      {
        key: "take_action",
        title: "What Should Happen First?",
        ncjmmLabel: "Take Action",
        prompt: "Choose the safest immediate action.",
        expertThinking:
          "The expert acts on breathing while gathering data: sit upright, assess, apply oxygen within orders/protocol, and communicate deterioration clearly.",
        noviceThinking:
          "A novice may call without reassessing or may keep collecting nonurgent information while the patient remains hypoxemic.",
        breakpointQuestions: ["What requires escalation?", "What can you do while help is coming?", "What intervention is most appropriate?"],
        prioritizationPrinciples: ["ABCs", "Scope", "Escalation"],
        options: [
          {
            id: "position-assess-oxygen-escalate",
            label: "Raise head of bed, assess ABCs/lung sounds/perfusion, apply ordered oxygen, and escalate worsening status",
            quality: "best",
            feedback: "Correct. This combines immediate supportive action with reassessment and escalation.",
            consequence: "The patient's oxygenation is supported while clinical decisions are made with better data.",
            scoreImpact: { decisionMaking: 100, evaluation: 80 },
          },
          {
            id: "wait-provider",
            label: "Wait for the provider to assess before changing anything",
            quality: "unsafe",
            feedback: "Waiting ignores nursing responsibility to assess, support breathing within orders/protocol, and escalate.",
            consequence: "The patient may deteriorate during avoidable delay.",
            thinkingError: "confirmation_bias",
            scoreImpact: { decisionMaking: 15, evaluation: 10 },
          },
          {
            id: "give-water",
            label: "Offer fluids because the patient looks tired",
            quality: "unsafe",
            feedback: "Fluids may worsen overload. The cue pattern suggests congestion, not dehydration.",
            consequence: "Wrong-direction intervention can worsen dyspnea and pulmonary congestion.",
            thinkingError: "tunnel_vision",
            scoreImpact: { decisionMaking: 10, evaluation: 10 },
          },
        ],
      },
      {
        key: "evaluate_outcomes",
        title: "What Should Be Reassessed?",
        ncjmmLabel: "Evaluate Outcomes",
        prompt: "Choose what to reassess after intervention.",
        expertThinking:
          "The expert evaluates whether breathing, oxygenation, perfusion, urine output, weight trend, and distress improve or whether escalation is still needed.",
        noviceThinking:
          "A novice may chart that oxygen was applied but fail to evaluate whether the patient improved.",
        breakpointQuestions: ["What should be reassessed?", "What outcome tells you the plan worked?", "What finding means the patient is still unsafe?"],
        prioritizationPrinciples: ["Evaluation", "Trend Recognition", "Failure To Rescue Prevention"],
        options: [
          {
            id: "reassess-respiratory-perfusion-response",
            label: "Reassess O2 saturation, work of breathing, lung sounds, mentation, blood pressure, urine output, and symptom response",
            quality: "best",
            feedback: "Correct. Evaluation must confirm whether the patient is improving or needs escalation.",
            consequence: "You catch nonresponse early and prevent silent deterioration.",
            scoreImpact: { evaluation: 100, cueRecognition: 80 },
          },
          {
            id: "only-chart-oxygen",
            label: "Document oxygen was applied",
            quality: "partial",
            feedback: "Documentation matters, but evaluation requires patient response and trend data.",
            consequence: "A patient can remain unstable even when the task was completed.",
            thinkingError: "task_fixation",
            scoreImpact: { evaluation: 45 },
          },
          {
            id: "reassess-diet-knowledge",
            label: "Ask the patient to repeat sodium restriction instructions",
            quality: "delayed",
            feedback: "Teaching evaluation can wait until respiratory status is safe.",
            consequence: "The immediate outcome of the breathing intervention remains unknown.",
            scoreImpact: { evaluation: 35 },
          },
        ],
      },
    ],
    deteriorationTrack: [
      {
        stage: "early",
        signs: ["Weight gain", "Increasing edema", "More pillows needed to sleep", "Reduced activity tolerance"],
        requiredActions: ["Focused assessment", "Trend weight and intake/output", "Review medication adherence", "Notify nurse/provider per scope if worsening"],
        escalationPoint: "Symptoms are worsening from baseline but oxygenation is not yet critically impaired.",
      },
      {
        stage: "intermediate",
        signs: ["Crackles", "Dyspnea with minimal exertion", "O2 Sat below target", "Tachycardia"],
        requiredActions: ["Position upright", "Assess respiratory status", "Apply oxygen per order/protocol", "Escalate for treatment review"],
        escalationPoint: "Oxygenation and breathing are now affected.",
      },
      {
        stage: "late",
        signs: ["Severe dyspnea at rest", "New confusion", "Pink frothy sputum", "Falling blood pressure"],
        requiredActions: ["Urgent escalation", "Prepare for higher-acuity monitoring", "Support airway and breathing", "Communicate using SBAR"],
        escalationPoint: "Possible acute pulmonary edema or poor perfusion.",
      },
      {
        stage: "critical",
        signs: ["Severe hypoxemia", "Exhaustion", "Cyanosis", "Decreased level of consciousness"],
        requiredActions: ["Rapid response/emergency activation", "Airway and ventilation support", "Continuous monitoring", "Prepare transfer"],
        escalationPoint: "Life-threatening respiratory failure risk.",
      },
    ],
    integrations: [
      { label: "Heart Failure Care Plan", href: "/healthcare/care-plans/heart-failure-care-plan", surface: "care_plans" },
      { label: "Potassium Lab Interpretation", href: "/healthcare/labs/potassium", surface: "labs" },
      { label: "Furosemide Medication Guide", href: "/healthcare/medications/furosemide", surface: "question_bank" },
      { label: "Clinical Scenarios", href: "/app/clinical-scenarios", surface: "simulation" },
      { label: "Documentation Practice", href: "/app/printables", surface: "documentation" },
    ],
  },
];

export function listClinicalReasoningPathways(profession?: ClinicalReasoningProfession): ClinicalReasoningPathway[] {
  if (!profession) return [...CLINICAL_REASONING_PATHWAYS];
  return CLINICAL_REASONING_PATHWAYS.filter((pathway) => pathway.professions.includes(profession));
}

export function getClinicalReasoningPathway(id: string): ClinicalReasoningPathway | null {
  return CLINICAL_REASONING_PATHWAYS.find((pathway) => pathway.id === id) ?? null;
}

export function scoreClinicalReasoningAttempt(
  pathway: ClinicalReasoningPathway,
  attempt: ClinicalReasoningAttempt,
): ClinicalReasoningScore {
  const domainTotals: Record<ReasoningScoreDomain, number[]> = {
    cueRecognition: [],
    analysis: [],
    prioritization: [],
    decisionMaking: [],
    evaluation: [],
  };
  const selectedQualities = {} as ClinicalReasoningScore["selectedQualities"];
  const thinkingErrors: ThinkingError[] = [];
  const outcomeSummary: string[] = [];

  for (const step of pathway.steps) {
    const selectedId = attempt.selections[step.key];
    const selected = step.options.find((option) => option.id === selectedId);
    selectedQualities[step.key] = selected?.quality ?? "missing";
    if (!selected) {
      for (const domain of Object.keys(domainTotals) as ReasoningScoreDomain[]) domainTotals[domain].push(0);
      outcomeSummary.push(`${step.ncjmmLabel}: no decision selected.`);
      continue;
    }
    if (selected.thinkingError) thinkingErrors.push(selected.thinkingError);
    outcomeSummary.push(`${step.ncjmmLabel}: ${selected.consequence}`);
    for (const domain of Object.keys(domainTotals) as ReasoningScoreDomain[]) {
      const explicit = selected.scoreImpact[domain];
      if (typeof explicit === "number") domainTotals[domain].push(explicit);
    }
  }

  const scores = {
    cueRecognition: averageOrZero(domainTotals.cueRecognition),
    analysis: averageOrZero(domainTotals.analysis),
    prioritization: averageOrZero(domainTotals.prioritization),
    decisionMaking: averageOrZero(domainTotals.decisionMaking),
    evaluation: averageOrZero(domainTotals.evaluation),
  };
  return {
    ...scores,
    overall: Math.round((scores.cueRecognition + scores.analysis + scores.prioritization + scores.decisionMaking + scores.evaluation) / 5),
    selectedQualities,
    thinkingErrors: [...new Set(thinkingErrors)],
    outcomeSummary,
  };
}

export function expertReasoningSummary(pathway: ClinicalReasoningPathway): string[] {
  return pathway.steps.map((step) => `${step.ncjmmLabel}: ${step.expertThinking}`);
}

function averageOrZero(values: number[]): number {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}
