export type AdaptiveCaseVitalFlag = "normal" | "watch" | "urgent" | "critical";

export type AdaptiveCaseVital = {
  label: string;
  value: string;
  unit?: string;
  flag?: AdaptiveCaseVitalFlag;
};

export type AdaptiveCaseStage = {
  id: string;
  timeLabel: string;
  title: string;
  narrative: string;
  vitals: AdaptiveCaseVital[];
  nursingNote?: string;
  providerOrders?: string[];
};

export type AdaptiveCaseDecision = {
  id: string;
  label: string;
  priorityLevel: "optimal" | "acceptable" | "delayed" | "unsafe";
  responseTitle: string;
  response: string;
  followUpVitals?: AdaptiveCaseVital[];
};

export type AdaptiveCaseSimulation = {
  id: string;
  title: string;
  focus: string;
  patientSummary: string;
  stages: AdaptiveCaseStage[];
  decisions: AdaptiveCaseDecision[];
  teachingPoint: string;
};

type BuildAdaptiveCaseSimulationArgs = {
  id: string;
  questionType?: string | null;
  stem: string;
  topic?: string | null;
  subtopic?: string | null;
  rationale?: string | null;
};

function normalizedQuestionType(raw: string | null | undefined): string {
  return String(raw ?? "").trim().toLowerCase().replace(/[_\s]+/g, "-");
}

function shouldUseAdaptiveCase(args: BuildAdaptiveCaseSimulationArgs): boolean {
  const type = normalizedQuestionType(args.questionType);
  if (
    /case-study|decision-tree|simulation|chart-review|trend|deterioration|safety-deterioration|prioritization|priority/.test(
      type,
    )
  ) {
    return true;
  }

  const text = `${args.stem} ${args.topic ?? ""} ${args.subtopic ?? ""}`.toLowerCase();
  return /\b(worsen|deteriorat|new confusion|increasing|dropping|falls?|sepsis|shortness of breath|hypoxi|postoperative|unstable)\b/.test(
    text,
  );
}

function topicFamily(args: BuildAdaptiveCaseSimulationArgs): "sepsis" | "respiratory" | "postop" | "medication" | "neuro" | "general" {
  const text = `${args.stem} ${args.topic ?? ""} ${args.subtopic ?? ""}`.toLowerCase();
  if (/sepsis|infection|fever|wbc|lactate|confusion/.test(text)) return "sepsis";
  if (/respiratory|copd|pneumonia|oxygen|spo2|shortness of breath|hypoxi|wheez/.test(text)) return "respiratory";
  if (/post[-\s]?op|surgery|operative|incision|morphine|opioid/.test(text)) return "postop";
  if (/medication|insulin|digoxin|warfarin|heparin|opioid|anticoagul/.test(text)) return "medication";
  if (/stroke|neuro|confusion|speech|weakness|pupil|glasgow/.test(text)) return "neuro";
  return "general";
}

function firstSentence(text: string | null | undefined, fallback: string): string {
  const clean = String(text ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!clean) return fallback;
  return clean.match(/^(.+?[.!?])(\s|$)/)?.[1]?.trim() ?? clean.slice(0, 180);
}

const FAMILY_STAGES: Record<ReturnType<typeof topicFamily>, Omit<AdaptiveCaseSimulation, "id" | "patientSummary" | "teachingPoint">> = {
  sepsis: {
    title: "Evolving infection case",
    focus: "Cue clustering and escalation",
    stages: [
      {
        id: "baseline",
        timeLabel: "0700",
        title: "Initial cue",
        narrative: "The client is quieter than baseline and reports feeling chilled. The change is subtle but new.",
        vitals: [
          { label: "T", value: "37.9", unit: "C", flag: "watch" },
          { label: "HR", value: "104", unit: "/min", flag: "watch" },
          { label: "RR", value: "22", unit: "/min", flag: "watch" },
        ],
        nursingNote: "Family reports the client is usually more alert in the morning.",
      },
      {
        id: "progression",
        timeLabel: "0830",
        title: "New pattern",
        narrative: "The client is now more confused and has decreased oral intake. The trend is becoming more concerning.",
        vitals: [
          { label: "T", value: "38.4", unit: "C", flag: "urgent" },
          { label: "HR", value: "116", unit: "/min", flag: "urgent" },
          { label: "BP", value: "96/58", unit: "mmHg", flag: "urgent" },
          { label: "Urine", value: "low", flag: "urgent" },
        ],
        providerOrders: ["Obtain vital signs every 15 minutes", "Prepare SBAR update", "Anticipate cultures/labs per policy"],
      },
    ],
    decisions: [
      {
        id: "escalate",
        label: "Recognize possible sepsis and escalate with SBAR",
        priorityLevel: "optimal",
        responseTitle: "Priority recognized",
        response: "Early escalation fits the trend: infection cue plus mental status change, tachycardia, lower blood pressure, and reduced output.",
        followUpVitals: [
          { label: "BP", value: "94/56", unit: "mmHg", flag: "urgent" },
          { label: "Mentation", value: "worse", flag: "urgent" },
        ],
      },
      {
        id: "wait",
        label: "Wait for a higher fever before calling",
        priorityLevel: "unsafe",
        responseTitle: "Delay increases risk",
        response: "Waiting for a dramatic fever can miss sepsis, especially in older or immunocompromised clients. Trend recognition matters more than one number.",
      },
      {
        id: "routine",
        label: "Encourage fluids and recheck at lunch",
        priorityLevel: "delayed",
        responseTitle: "Supportive but incomplete",
        response: "Fluids may help, but the worsening vital-sign cluster requires escalation and closer reassessment now.",
      },
    ],
  },
  respiratory: {
    title: "Evolving respiratory case",
    focus: "Work of breathing and oxygenation trend",
    stages: [
      {
        id: "baseline",
        timeLabel: "Now",
        title: "Initial respiratory cue",
        narrative: "The client reports increasing shortness of breath and has to pause while speaking.",
        vitals: [
          { label: "SpO2", value: "91%", flag: "watch" },
          { label: "RR", value: "24", unit: "/min", flag: "watch" },
          { label: "HR", value: "102", unit: "/min", flag: "watch" },
        ],
        nursingNote: "Mild accessory muscle use is present.",
      },
      {
        id: "progression",
        timeLabel: "+10 min",
        title: "Deterioration cue",
        narrative: "The client becomes more restless and is leaning forward to breathe.",
        vitals: [
          { label: "SpO2", value: "86%", flag: "critical" },
          { label: "RR", value: "30", unit: "/min", flag: "critical" },
          { label: "Speech", value: "short phrases", flag: "urgent" },
        ],
        providerOrders: ["Apply oxygen per protocol", "Prepare focused respiratory assessment", "Notify RN/provider of acute change"],
      },
    ],
    decisions: [
      {
        id: "assess-escalate",
        label: "Position upright, assess breathing, apply oxygen per protocol, escalate",
        priorityLevel: "optimal",
        responseTitle: "Breathing priority protected",
        response: "This addresses airway/breathing first while collecting the assessment data needed for rapid escalation.",
        followUpVitals: [{ label: "SpO2", value: "89%", flag: "urgent" }],
      },
      {
        id: "document",
        label: "Document restlessness and continue routine rounds",
        priorityLevel: "unsafe",
        responseTitle: "Acute change missed",
        response: "Restlessness with falling oxygen saturation can signal hypoxia. Documentation cannot replace immediate assessment and escalation.",
      },
      {
        id: "teach",
        label: "Begin discharge teaching about inhaler use",
        priorityLevel: "delayed",
        responseTitle: "Teaching is not the priority",
        response: "Education matters after stabilization. The immediate risk is respiratory compromise.",
      },
    ],
  },
  postop: {
    title: "Postoperative change case",
    focus: "Complication recognition after surgery",
    stages: [
      {
        id: "baseline",
        timeLabel: "PACU/Unit",
        title: "Post-op baseline",
        narrative: "The client is drowsy after surgery but arouses to voice.",
        vitals: [
          { label: "BP", value: "118/72", unit: "mmHg" },
          { label: "HR", value: "88", unit: "/min" },
          { label: "SpO2", value: "94%", flag: "watch" },
        ],
      },
      {
        id: "progression",
        timeLabel: "+30 min",
        title: "New safety concern",
        narrative: "The client is harder to arouse and respirations are shallow.",
        vitals: [
          { label: "RR", value: "8", unit: "/min", flag: "critical" },
          { label: "SpO2", value: "88%", flag: "critical" },
          { label: "Sedation", value: "increased", flag: "urgent" },
        ],
        providerOrders: ["Hold sedating medications and clarify", "Notify RN/provider", "Prepare reversal/support per policy"],
      },
    ],
    decisions: [
      {
        id: "hold-escalate",
        label: "Hold unsafe sedating medication and escalate respiratory depression",
        priorityLevel: "optimal",
        responseTitle: "Medication safety protected",
        response: "Respiratory depression after opioids or sedation is an airway/breathing priority and requires immediate escalation.",
      },
      {
        id: "pain-first",
        label: "Give the next opioid dose because pain control prevents complications",
        priorityLevel: "unsafe",
        responseTitle: "Breathing risk worsened",
        response: "Additional opioid can worsen respiratory depression. Assessment and escalation come before more sedation.",
      },
      {
        id: "sleep",
        label: "Let the client sleep and reassess later",
        priorityLevel: "unsafe",
        responseTitle: "Deterioration delayed",
        response: "A low respiratory rate and hypoxemia are not normal sleep findings after surgery.",
      },
    ],
  },
  medication: {
    title: "Medication safety case",
    focus: "Assessment before administration",
    stages: [
      {
        id: "baseline",
        timeLabel: "Medication pass",
        title: "Pre-administration check",
        narrative: "The client is due for a scheduled medication. A new symptom appears during the safety check.",
        vitals: [
          { label: "Pulse", value: "52", unit: "/min", flag: "urgent" },
          { label: "BP", value: "104/62", unit: "mmHg", flag: "watch" },
        ],
        nursingNote: "The client reports dizziness and nausea.",
      },
      {
        id: "progression",
        timeLabel: "Before dose",
        title: "Clarifying cue",
        narrative: "The symptom pattern suggests the medication may be unsafe to give without clarification.",
        vitals: [{ label: "Symptoms", value: "new/worse", flag: "urgent" }],
        providerOrders: ["Hold and clarify medication parameters", "Document assessment", "Notify RN/provider per policy"],
      },
    ],
    decisions: [
      {
        id: "hold",
        label: "Hold/clarify the dose and report the assessment findings",
        priorityLevel: "optimal",
        responseTitle: "Right assessment before right medication",
        response: "The safest action is to stop before administration when assessment findings suggest harm.",
      },
      {
        id: "give",
        label: "Give the dose because it is scheduled",
        priorityLevel: "unsafe",
        responseTitle: "Schedule does not override safety",
        response: "Scheduled administration still requires current assessment, hold parameters, and clinical judgment.",
      },
      {
        id: "chart",
        label: "Document the symptom and continue the medication pass",
        priorityLevel: "delayed",
        responseTitle: "Documentation is incomplete care",
        response: "Charting matters, but unsafe medication cues require action before moving on.",
      },
    ],
  },
  neuro: {
    title: "Evolving neurologic case",
    focus: "New neurologic change",
    stages: [
      {
        id: "baseline",
        timeLabel: "Initial",
        title: "Subtle neuro cue",
        narrative: "The client answers slowly and family says this is not baseline.",
        vitals: [
          { label: "BP", value: "168/94", unit: "mmHg", flag: "watch" },
          { label: "Speech", value: "slurred", flag: "urgent" },
        ],
      },
      {
        id: "progression",
        timeLabel: "+5 min",
        title: "Objective change",
        narrative: "The client now has facial droop and weak grip on one side.",
        vitals: [
          { label: "Neuro", value: "worse", flag: "critical" },
          { label: "Glucose", value: "check now", flag: "urgent" },
        ],
        providerOrders: ["Activate stroke/emergency protocol per policy", "Check glucose", "Document last known well"],
      },
    ],
    decisions: [
      {
        id: "stroke",
        label: "Recognize acute neuro change and activate protocol",
        priorityLevel: "optimal",
        responseTitle: "Time-sensitive change recognized",
        response: "New unilateral weakness or speech change requires rapid escalation and last-known-well thinking.",
      },
      {
        id: "rest",
        label: "Let the client rest because they seem tired",
        priorityLevel: "unsafe",
        responseTitle: "Stroke cues minimized",
        response: "Fatigue does not explain focal neurologic findings. Delay can reduce treatment options.",
      },
      {
        id: "meal",
        label: "Offer a meal and reassess after eating",
        priorityLevel: "unsafe",
        responseTitle: "Swallowing and neuro risk ignored",
        response: "Feeding before assessing acute neuro change can create aspiration risk and delays escalation.",
      },
    ],
  },
  general: {
    title: "Evolving bedside case",
    focus: "Trend recognition and prioritization",
    stages: [
      {
        id: "baseline",
        timeLabel: "Initial",
        title: "First cue",
        narrative: "A new finding appears during routine care. The safest nurse notices whether it is expected or a change.",
        vitals: [
          { label: "Trend", value: "changing", flag: "watch" },
          { label: "Risk", value: "needs reassessment", flag: "watch" },
        ],
      },
      {
        id: "progression",
        timeLabel: "Recheck",
        title: "Priority changes",
        narrative: "The finding persists and is now linked with another abnormal cue, increasing urgency.",
        vitals: [
          { label: "Status", value: "less stable", flag: "urgent" },
          { label: "Action", value: "escalate", flag: "urgent" },
        ],
        providerOrders: ["Reassess", "Escalate abnormal trend", "Document response"],
      },
    ],
    decisions: [
      {
        id: "trend",
        label: "Compare to baseline, reassess, and escalate the abnormal trend",
        priorityLevel: "optimal",
        responseTitle: "Trend thinking used",
        response: "NCLEX-style clinical judgment rewards recognizing change over memorizing isolated values.",
      },
      {
        id: "single",
        label: "Treat it as one isolated finding",
        priorityLevel: "delayed",
        responseTitle: "Pattern missed",
        response: "Single cues matter less than clusters and trends. Reassessment prevents missed deterioration.",
      },
      {
        id: "ignore",
        label: "Continue routine care without reassessment",
        priorityLevel: "unsafe",
        responseTitle: "Safety cue ignored",
        response: "Routine care is unsafe when a new abnormal trend suggests instability.",
      },
    ],
  },
};

export function buildAdaptiveCaseSimulation(args: BuildAdaptiveCaseSimulationArgs): AdaptiveCaseSimulation | null {
  if (!shouldUseAdaptiveCase(args)) return null;
  const family = topicFamily(args);
  const base = FAMILY_STAGES[family];
  return {
    id: `adaptive-case-${args.id}`,
    title: base.title,
    focus: base.focus,
    patientSummary: firstSentence(args.stem, "A client has changing assessment cues that require prioritization."),
    stages: base.stages,
    decisions: base.decisions,
    teachingPoint: firstSentence(
      args.rationale,
      "Use changing cues, not a single isolated detail, to decide when to reassess, intervene, and escalate.",
    ),
  };
}
