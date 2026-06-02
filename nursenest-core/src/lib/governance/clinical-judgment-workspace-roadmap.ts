export type ClinicalJudgmentWorkspaceKey =
  | "clinical_judgment_engine"
  | "multi_patient_assignment"
  | "chart_review"
  | "timeline_deterioration"
  | "medication_administration"
  | "handoff_sbar"
  | "clinical_skills_decision_trees"
  | "fetal_monitoring"
  | "ems_scene_assessment"
  | "shift_management";

export type ClinicalJudgmentWorkspacePriority = "foundation" | "p0_next" | "p1_reusable" | "p2_specialty";

export type ClinicalJudgmentWorkspace = {
  key: ClinicalJudgmentWorkspaceKey;
  priority: ClinicalJudgmentWorkspacePriority;
  title: string;
  learnerTask: string;
  requiredDataSurfaces: readonly string[];
  requiredDecisions: readonly string[];
  reusableAcross: readonly string[];
  mustReuseSharedShell: boolean;
};

export const CLINICAL_JUDGMENT_WORKSPACES: readonly ClinicalJudgmentWorkspace[] = [
  {
    key: "clinical_judgment_engine",
    priority: "foundation",
    title: "Clinical Judgment Engine",
    learnerTask: "Recognize cues, analyze findings, prioritize hypotheses, take action, and evaluate outcomes.",
    requiredDataSurfaces: ["patient summary", "assessment cues", "orders", "response to intervention"],
    requiredDecisions: ["recognize", "prioritize", "intervene", "evaluate", "escalate", "document"],
    reusableAcross: ["RN", "RPN/PN", "NP", "RT", "Allied", "New Grad", "ECG", "Ventilator", "Simulations"],
    mustReuseSharedShell: true,
  },
  {
    key: "multi_patient_assignment",
    priority: "p0_next",
    title: "Multi-Patient Assignment Workspace",
    learnerTask: "Manage competing patient needs and choose what to do first, next, later, delegate, or escalate.",
    requiredDataSurfaces: ["patient list", "acuity", "tasks due", "staffing", "time pressure", "safety risks"],
    requiredDecisions: ["prioritize", "delegate", "cluster care", "escalate", "reassess"],
    reusableAcross: ["RN", "RPN/PN", "New Grad", "Leadership", "Long-Term Care", "Home Care"],
    mustReuseSharedShell: true,
  },
  {
    key: "chart_review",
    priority: "p0_next",
    title: "Chart Review Workspace",
    learnerTask: "Extract meaningful cues from the chart before making care decisions.",
    requiredDataSurfaces: ["history", "MAR", "allergies", "labs", "provider orders", "notes", "vitals"],
    requiredDecisions: ["identify abnormal cues", "spot contradictions", "clarify orders", "prepare SBAR"],
    reusableAcross: ["RN", "RPN/PN", "NP", "RT", "Allied", "New Grad", "Medication Administration"],
    mustReuseSharedShell: true,
  },
  {
    key: "timeline_deterioration",
    priority: "p0_next",
    title: "Timeline Deterioration Engine",
    learnerTask: "Follow vitals, labs, ECG, or ventilator changes over time and identify deterioration points.",
    requiredDataSurfaces: ["vital trends", "lab trends", "ECG progression", "ventilator progression", "clinical notes"],
    requiredDecisions: ["recognize trend", "name deterioration", "choose escalation threshold", "evaluate response"],
    reusableAcross: ["RN", "RPN/PN", "NP", "RT", "New Grad", "ECG", "Ventilator", "Simulations"],
    mustReuseSharedShell: true,
  },
  {
    key: "medication_administration",
    priority: "p0_next",
    title: "Medication Administration Workspace",
    learnerTask: "Use MAR, allergies, labs, and orders to decide whether to hold, administer, or clarify a medication.",
    requiredDataSurfaces: ["MAR", "allergies", "labs", "provider orders", "vitals", "medication profile"],
    requiredDecisions: ["administer", "hold", "clarify order", "monitor", "teach", "document"],
    reusableAcross: ["RN", "RPN/PN", "NP", "Paramedicine", "Pharmacy Technician", "New Grad", "Pharmacology"],
    mustReuseSharedShell: true,
  },
  {
    key: "handoff_sbar",
    priority: "p1_reusable",
    title: "Handoff & SBAR Engine",
    learnerTask: "Identify missing handoff data, correct weak reports, and build complete SBAR communication.",
    requiredDataSurfaces: ["situation", "background", "assessment", "recommendation", "pending items", "safety concerns"],
    requiredDecisions: ["include", "omit", "clarify", "escalate", "grade communication quality"],
    reusableAcross: ["RN", "RPN/PN", "NP", "RT", "Allied", "New Grad", "Leadership", "Simulations"],
    mustReuseSharedShell: true,
  },
  {
    key: "clinical_skills_decision_trees",
    priority: "p1_reusable",
    title: "Clinical Skills Decision Trees",
    learnerTask: "Move through assessment, preparation, procedure, complication response, intervention, and documentation.",
    requiredDataSurfaces: ["assessment", "equipment", "procedure steps", "complications", "documentation requirements"],
    requiredDecisions: ["prepare", "perform", "pause", "respond to complication", "document"],
    reusableAcross: ["RN", "RPN/PN", "NP", "RT", "Allied", "New Grad", "Clinical Skills"],
    mustReuseSharedShell: true,
  },
  {
    key: "fetal_monitoring",
    priority: "p2_specialty",
    title: "Fetal Monitoring Workspace",
    learnerTask: "Interpret contraction and fetal heart rate tracing patterns and decide when to intervene or escalate.",
    requiredDataSurfaces: ["contraction tracing", "FHR tracing", "variability", "accelerations", "decelerations"],
    requiredDecisions: ["classify tracing", "reposition", "stop oxytocin", "notify provider", "prepare escalation"],
    reusableAcross: ["RN", "RPN/PN", "NP", "New Grad", "Maternal", "Simulations"],
    mustReuseSharedShell: true,
  },
  {
    key: "ems_scene_assessment",
    priority: "p2_specialty",
    title: "EMS Scene Assessment Workspace",
    learnerTask: "Assess scene safety, mechanism of injury, resources, triage, and transport priorities.",
    requiredDataSurfaces: ["scene safety", "mechanism of injury", "available resources", "patient count", "transport options"],
    requiredDecisions: ["enter scene", "request resources", "triage", "treat", "transport"],
    reusableAcross: ["Paramedicine", "Emergency", "RT", "New Grad", "Allied", "Simulations"],
    mustReuseSharedShell: true,
  },
  {
    key: "shift_management",
    priority: "p1_reusable",
    title: "Shift Management Simulator",
    learnerTask: "Manage admissions, critical labs, family concerns, staffing issues, and provider requests across a shift.",
    requiredDataSurfaces: ["assignment timeline", "new admissions", "critical labs", "family concerns", "staffing", "provider requests"],
    requiredDecisions: ["prioritize", "delegate", "delay", "escalate", "handoff"],
    reusableAcross: ["RN", "RPN/PN", "New Grad", "Leadership", "Long-Term Care", "Community", "Simulations"],
    mustReuseSharedShell: true,
  },
] as const;

export const RECOMMENDED_POST_ECG_VENTILATOR_SEQUENCE: readonly ClinicalJudgmentWorkspaceKey[] = [
  "clinical_judgment_engine",
  "multi_patient_assignment",
  "chart_review",
  "timeline_deterioration",
  "medication_administration",
] as const;

export function workspaceForClinicalJudgmentKey(key: ClinicalJudgmentWorkspaceKey): ClinicalJudgmentWorkspace {
  const workspace = CLINICAL_JUDGMENT_WORKSPACES.find((item) => item.key === key);
  if (!workspace) throw new Error(`Missing clinical judgment workspace: ${key}`);
  return workspace;
}

export function auditClinicalJudgmentWorkspaceRoadmap(): string[] {
  const issues: string[] = [];
  const keys = new Set<ClinicalJudgmentWorkspaceKey>();
  for (const workspace of CLINICAL_JUDGMENT_WORKSPACES) {
    if (keys.has(workspace.key)) issues.push(`duplicate workspace key: ${workspace.key}`);
    keys.add(workspace.key);
    if (!workspace.mustReuseSharedShell) issues.push(`${workspace.key} must reuse the shared learner shell`);
    if (workspace.requiredDataSurfaces.length < 3) issues.push(`${workspace.key} needs at least three data surfaces`);
    if (workspace.requiredDecisions.length < 3) issues.push(`${workspace.key} needs at least three learner decisions`);
    if (workspace.reusableAcross.length < 3) issues.push(`${workspace.key} must be reusable across at least three pathways`);
  }
  for (const key of RECOMMENDED_POST_ECG_VENTILATOR_SEQUENCE) {
    if (!keys.has(key)) issues.push(`recommended sequence references missing workspace: ${key}`);
  }
  return issues;
}
