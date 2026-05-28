export type QaPersonaTier = "RN" | "RPN_LPN" | "NP";
export type QaPersonaLifecycle = "brand_new" | "struggling" | "progressing" | "advanced" | "returning_inactive";
export type QaPersonaWeakness =
  | "telemetry"
  | "prioritization"
  | "delegation"
  | "pharmacology"
  | "med_calculations"
  | "labs"
  | "clinical_skills"
  | "diagnostics"
  | "documentation"
  | "escalation";

export type QaPersonaTemplateId =
  | "rn-telemetry-weak"
  | "rn-prioritization-weak"
  | "rn-med-calc-strong"
  | "rn-new-grad-acute-care"
  | "rpn-escalation-hesitation"
  | "rpn-medication-safety"
  | "rpn-documentation-weak"
  | "np-diagnostics-weak"
  | "np-polypharmacy-weak"
  | "np-systems-strong";

export type QaPersonaTemplate = {
  id: QaPersonaTemplateId;
  displayName: string;
  tier: QaPersonaTier;
  lifecycle: QaPersonaLifecycle;
  country: "US" | "CA";
  pathwayId: string;
  description: string;
  weaknessPattern: readonly QaPersonaWeakness[];
  strengths: readonly string[];
  dashboardExpectation: string;
  recommendedFirstReplay: string;
};

export type QaPersonaStateInjection = {
  readiness: {
    overall: number;
    telemetry: number;
    prioritization: number;
    medicationSafety: number;
    clinicalSkills: number;
    diagnostics: number;
  };
  confidence: {
    calibration: "underconfident" | "accurate" | "overconfident";
    telemetry: number;
    prioritization: number;
    medicationSafety: number;
  };
  activityHistory: {
    completedActivities: number;
    failedScenarios: number;
    remediationDue: number;
    flashcardsDue: number;
    lastActiveDaysAgo: number;
  };
  remediationTriggers: readonly {
    area: QaPersonaWeakness;
    reason: string;
    expectedSurface: string;
  }[];
};

export type QaPersonaPlaywrightPlan = {
  personaId: QaPersonaTemplateId;
  setupTags: readonly string[];
  flows: readonly {
    id: string;
    name: string;
    route: string;
    action: string;
    expected: readonly string[];
  }[];
};

export type QaPersonaReplayEvent = {
  timestampOffsetMin: number;
  surface: "onboarding" | "dashboard" | "ecg" | "scenario" | "skills" | "med_math" | "report_card";
  action: string;
  expectedStateChange: string;
};

export const QA_PERSONA_TEMPLATES: readonly QaPersonaTemplate[] = [
  {
    id: "rn-telemetry-weak",
    displayName: "RN telemetry-weak learner",
    tier: "RN",
    lifecycle: "struggling",
    country: "US",
    pathwayId: "us-rn-nclex-rn",
    description: "Misses rhythm escalation and monitor-context questions despite moderate confidence.",
    weaknessPattern: ["telemetry", "escalation", "prioritization"],
    strengths: ["fundamentals", "basic med-surg"],
    dashboardExpectation: "ECG remediation, telemetry simulation, and rationale-linked flashcards should surface first.",
    recommendedFirstReplay: "Miss telemetry escalation, then validate ECG remediation and readiness-score movement.",
  },
  {
    id: "rn-prioritization-weak",
    displayName: "RN prioritization-weak learner",
    tier: "RN",
    lifecycle: "progressing",
    country: "US",
    pathwayId: "us-rn-nclex-rn",
    description: "Answers content facts correctly but delays unstable-patient recognition and delegation decisions.",
    weaknessPattern: ["prioritization", "delegation", "escalation"],
    strengths: ["pharmacology", "labs"],
    dashboardExpectation: "Prioritization & delegation simulations plus branching scenarios should lead recommendations.",
    recommendedFirstReplay: "Rank a stable post-op patient above an unstable respiratory patient and verify remediation.",
  },
  {
    id: "rn-med-calc-strong",
    displayName: "RN med-calc strong learner",
    tier: "RN",
    lifecycle: "advanced",
    country: "US",
    pathwayId: "us-rn-nclex-rn",
    description: "High medication calculation mastery with weaker clinical application in high-alert holds.",
    weaknessPattern: ["pharmacology", "labs"],
    strengths: ["med_calculations", "dosage_safety"],
    dashboardExpectation: "Advanced medication safety drills should appear without repeating basic arithmetic.",
    recommendedFirstReplay: "Pass calculations, miss a hold-parameter question, and validate pharmacology remediation.",
  },
  {
    id: "rn-new-grad-acute-care",
    displayName: "New grad acute-care learner",
    tier: "RN",
    lifecycle: "returning_inactive",
    country: "US",
    pathwayId: "us-rn-new-grad-transition",
    description: "Returning after inactivity with weak rapid-response confidence and uneven clinical skills completion.",
    weaknessPattern: ["clinical_skills", "escalation", "prioritization"],
    strengths: ["communication"],
    dashboardExpectation: "Clinical Skills simulation lab and rapid-response scenarios should anchor the restart plan.",
    recommendedFirstReplay: "Resume after inactivity, complete a rapid-response skill, then verify streak and dashboard refresh.",
  },
  {
    id: "rpn-escalation-hesitation",
    displayName: "RPN/LPN escalation-hesitation learner",
    tier: "RPN_LPN",
    lifecycle: "struggling",
    country: "CA",
    pathwayId: "ca-rpn-rex-pn",
    description: "Provides safe routine care but delays reassessment and RN/provider notification.",
    weaknessPattern: ["escalation", "clinical_skills", "documentation"],
    strengths: ["foundational care", "communication"],
    dashboardExpectation: "Foundational clinical skills, reassessment prompts, and escalation flashcards should surface.",
    recommendedFirstReplay: "Delay escalation in a stable-to-unstable scenario and validate RPN-scoped remediation.",
  },
  {
    id: "rpn-medication-safety",
    displayName: "RPN/LPN medication-safety learner",
    tier: "RPN_LPN",
    lifecycle: "progressing",
    country: "CA",
    pathwayId: "ca-rpn-rex-pn",
    description: "Needs reinforcement around insulin timing, anticoagulant bleeding cues, and patient teaching.",
    weaknessPattern: ["pharmacology", "med_calculations", "documentation"],
    strengths: ["bedside assessment"],
    dashboardExpectation: "Medication safety, patient teaching, and foundational calculation drills should be recommended.",
    recommendedFirstReplay: "Miss insulin meal-timing teaching and verify medication-safety remediation.",
  },
  {
    id: "rpn-documentation-weak",
    displayName: "RPN/LPN documentation-weak learner",
    tier: "RPN_LPN",
    lifecycle: "brand_new",
    country: "CA",
    pathwayId: "ca-rpn-rex-pn",
    description: "New learner with adequate care choices but incomplete handoff and charting patterns.",
    weaknessPattern: ["documentation", "clinical_skills"],
    strengths: ["infection control"],
    dashboardExpectation: "SBAR, incident documentation, and clinical-skill retention cards should appear early.",
    recommendedFirstReplay: "Complete onboarding, skip documentation detail, and verify dashboard coaching.",
  },
  {
    id: "np-diagnostics-weak",
    displayName: "NP diagnostics-weak learner",
    tier: "NP",
    lifecycle: "struggling",
    country: "US",
    pathwayId: "us-np-fnp",
    description: "Strong assessment collection but weak differential prioritization and diagnostic test selection.",
    weaknessPattern: ["diagnostics", "labs", "escalation"],
    strengths: ["patient education", "communication"],
    dashboardExpectation: "Diagnostic reasoning, lab interpretation, and safety-net follow-up should dominate next actions.",
    recommendedFirstReplay: "Order low-yield tests before red-flag triage and verify diagnostic remediation.",
  },
  {
    id: "np-polypharmacy-weak",
    displayName: "NP polypharmacy-weak learner",
    tier: "NP",
    lifecycle: "progressing",
    country: "US",
    pathwayId: "us-np-agpcnp",
    description: "Needs support with deprescribing, renal dosing, and medication-risk counseling.",
    weaknessPattern: ["pharmacology", "labs", "diagnostics"],
    strengths: ["systems thinking"],
    dashboardExpectation: "Advanced pharmacotherapy and lab-linked medication safety should surface.",
    recommendedFirstReplay: "Miss renal dosing adjustment and verify NP pharmacology remediation.",
  },
  {
    id: "np-systems-strong",
    displayName: "NP systems-thinking learner",
    tier: "NP",
    lifecycle: "advanced",
    country: "US",
    pathwayId: "us-np-pmhnp",
    description: "Advanced learner ready for complex longitudinal cases and specialty progression.",
    weaknessPattern: ["documentation"],
    strengths: ["diagnostics", "treatment planning", "follow-up"],
    dashboardExpectation: "Advanced pathways should unlock while documentation refinement remains visible.",
    recommendedFirstReplay: "Pass advanced diagnostics and verify progression toward advanced simulations.",
  },
] as const;

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function weaknessPenalty(template: QaPersonaTemplate, area: QaPersonaWeakness, base = 78): number {
  return template.weaknessPattern.includes(area) ? base - 38 : base;
}

export function buildQaPersonaStateInjection(templateId: QaPersonaTemplateId): QaPersonaStateInjection {
  const template = getQaPersonaTemplate(templateId);
  const advancedBoost = template.lifecycle === "advanced" ? 10 : template.lifecycle === "brand_new" ? -18 : 0;
  const strugglingPenalty = template.lifecycle === "struggling" ? -16 : 0;
  const inactivePenalty = template.lifecycle === "returning_inactive" ? -10 : 0;
  const base = 72 + advancedBoost + strugglingPenalty + inactivePenalty;
  const remediationTriggers = template.weaknessPattern.map((area) => ({
    area,
    reason: `Persona template ${template.id} intentionally underperforms in ${area.replace(/_/g, " ")}.`,
    expectedSurface:
      area === "telemetry" ? "/app/ecg-video-quiz" :
      area === "prioritization" || area === "delegation" ? "/app/prioritization-delegation" :
      area === "med_calculations" ? "/app/med-calculations" :
      area === "labs" ? "/app/labs" :
      area === "clinical_skills" || area === "documentation" || area === "escalation" ? "/app/clinical-skills" :
      "/app/review",
  }));

  return {
    readiness: {
      overall: clampScore(base - template.weaknessPattern.length * 3),
      telemetry: clampScore(weaknessPenalty(template, "telemetry", base)),
      prioritization: clampScore(Math.min(weaknessPenalty(template, "prioritization", base), weaknessPenalty(template, "delegation", base))),
      medicationSafety: clampScore(Math.min(weaknessPenalty(template, "pharmacology", base), weaknessPenalty(template, "med_calculations", base))),
      clinicalSkills: clampScore(Math.min(weaknessPenalty(template, "clinical_skills", base), weaknessPenalty(template, "documentation", base))),
      diagnostics: clampScore(weaknessPenalty(template, "diagnostics", base)),
    },
    confidence: {
      calibration: template.lifecycle === "struggling" ? "overconfident" : template.lifecycle === "brand_new" ? "underconfident" : "accurate",
      telemetry: template.weaknessPattern.includes("telemetry") ? 2 : 4,
      prioritization: template.weaknessPattern.some((w) => w === "prioritization" || w === "delegation") ? 2 : 4,
      medicationSafety: template.weaknessPattern.some((w) => w === "pharmacology" || w === "med_calculations") ? 2 : 4,
    },
    activityHistory: {
      completedActivities: template.lifecycle === "brand_new" ? 0 : template.lifecycle === "advanced" ? 48 : 14,
      failedScenarios: template.lifecycle === "struggling" ? 9 : template.lifecycle === "advanced" ? 1 : 4,
      remediationDue: Math.max(2, template.weaknessPattern.length * (template.lifecycle === "struggling" ? 4 : 2)),
      flashcardsDue: template.lifecycle === "returning_inactive" ? 42 : 12 + template.weaknessPattern.length * 5,
      lastActiveDaysAgo: template.lifecycle === "returning_inactive" ? 21 : template.lifecycle === "brand_new" ? 0 : 2,
    },
    remediationTriggers,
  };
}

export function getQaPersonaTemplate(templateId: QaPersonaTemplateId): QaPersonaTemplate {
  const template = QA_PERSONA_TEMPLATES.find((p) => p.id === templateId);
  if (!template) throw new Error(`Unknown QA persona template: ${templateId}`);
  return template;
}

export function listQaPersonaTemplatesForTier(tier?: QaPersonaTier): QaPersonaTemplate[] {
  return tier ? QA_PERSONA_TEMPLATES.filter((template) => template.tier === tier) : [...QA_PERSONA_TEMPLATES];
}

export function buildQaPersonaPlaywrightPlan(templateId: QaPersonaTemplateId): QaPersonaPlaywrightPlan {
  const template = getQaPersonaTemplate(templateId);
  const injection = buildQaPersonaStateInjection(templateId);
  return {
    personaId: template.id,
    setupTags: [template.tier, template.lifecycle, template.country, ...template.weaknessPattern],
    flows: [
      {
        id: "onboarding",
        name: "Onboarding personalization",
        route: "/app/onboarding",
        action: `Select ${template.tier}, apply weak areas ${template.weaknessPattern.join(", ")}, complete onboarding.`,
        expected: ["First activity route is personalized", "Dashboard initialization payload includes weakness pattern"],
      },
      {
        id: "dashboard",
        name: "Dashboard state validation",
        route: "/app",
        action: "Load dashboard with injected readiness state.",
        expected: [
          `Overall readiness near ${injection.readiness.overall}%`,
          template.dashboardExpectation,
          "No empty recommendation widgets",
        ],
      },
      {
        id: "remediation",
        name: "Remediation loop validation",
        route: injection.remediationTriggers[0]?.expectedSurface ?? "/app/review",
        action: template.recommendedFirstReplay,
        expected: ["Remediation recommendation appears", "Report-card domain updates", "Flashcard due count changes"],
      },
    ],
  };
}

export function buildQaPersonaReplayTimeline(templateId: QaPersonaTemplateId): QaPersonaReplayEvent[] {
  const template = getQaPersonaTemplate(templateId);
  const firstWeakness = template.weaknessPattern[0] ?? "clinical_skills";
  return [
    {
      timestampOffsetMin: 0,
      surface: "onboarding",
      action: `Persona starts as ${template.displayName}.`,
      expectedStateChange: "Learner pathway, confidence baseline, and first-session route are initialized.",
    },
    {
      timestampOffsetMin: 5,
      surface: firstWeakness === "telemetry" ? "ecg" : firstWeakness === "med_calculations" ? "med_math" : firstWeakness === "clinical_skills" ? "skills" : "scenario",
      action: template.recommendedFirstReplay,
      expectedStateChange: `${firstWeakness.replace(/_/g, " ")} readiness and remediation queue change.`,
    },
    {
      timestampOffsetMin: 12,
      surface: "dashboard",
      action: "Return to dashboard.",
      expectedStateChange: template.dashboardExpectation,
    },
    {
      timestampOffsetMin: 16,
      surface: "report_card",
      action: "Open report card.",
      expectedStateChange: "Readiness, confidence calibration, and competency trend reflect injected learner behavior.",
    },
  ];
}
