export type AdmissionsSliceId = "pre-nursing" | "casper" | "hesi" | "teas";

export type AdmissionsSliceDomain =
  | "academic-foundations"
  | "situational-judgment"
  | "exam-prep"
  | "application-readiness";

export type AdmissionsSliceReadinessItem = {
  id: string;
  label: string;
  required: boolean;
  weight: number;
  status: "complete" | "partial" | "missing";
  note: string;
};

export type AdmissionsSliceDefinition = {
  id: AdmissionsSliceId;
  title: string;
  domain: AdmissionsSliceDomain;
  learnerPromise: string;
  targetLearner: string;
  coreOutcomes: string[];
  readinessItems: AdmissionsSliceReadinessItem[];
};

export type AdmissionsSliceReadinessResult = {
  id: AdmissionsSliceId;
  title: string;
  readinessPercent: number;
  completeItems: number;
  totalItems: number;
  missingRequiredItems: string[];
  nextActions: string[];
};

function item(
  id: string,
  label: string,
  required: boolean,
  weight: number,
  status: AdmissionsSliceReadinessItem["status"],
  note: string,
): AdmissionsSliceReadinessItem {
  return { id, label, required, weight, status, note };
}

export const admissionsSliceDefinitions: AdmissionsSliceDefinition[] = [
  {
    id: "pre-nursing",
    title: "Pre-Nursing Readiness",
    domain: "application-readiness",
    targetLearner: "Learners preparing for nursing prerequisites, applications, and early program readiness.",
    learnerPromise:
      "Help applicants build prerequisite mastery, admission readiness, study habits, and early nursing identity before program entry.",
    coreOutcomes: [
      "Prerequisite science confidence",
      "Academic planning and time management",
      "Nursing-program application readiness",
      "Foundational clinical vocabulary",
    ],
    readinessItems: [
      item("hub", "Dedicated learner hub", true, 12, "partial", "Route/hub may exist indirectly; needs explicit pre-nursing admissions surface."),
      item("diagnostic", "Pre-nursing diagnostic assessment", true, 14, "missing", "Needs baseline academic/application readiness diagnostic."),
      item("study-plan", "Prerequisite study plan generator", true, 12, "partial", "Can reuse study infrastructure; needs slice-specific plan logic."),
      item("question-bank", "Foundational question bank", true, 14, "partial", "Needs anatomy/physiology, microbiology, dosage math, reading comprehension tagging."),
      item("application-tools", "Application checklist + timeline", true, 12, "missing", "Needs program application workflow content."),
      item("remediation", "Adaptive remediation loop", true, 12, "partial", "Governance/CAT systems exist; needs pre-nursing linkage."),
      item("seo", "Public SEO landing pages", false, 8, "partial", "Needs long-tail admissions/prerequisite clusters."),
      item("analytics", "Progress analytics", false, 8, "partial", "Can reuse learner report card; needs admissions KPIs."),
      item("governance", "Quality governance", true, 8, "complete", "Shared clinical/psychometric governance can cover content quality."),
    ],
  },
  {
    id: "casper",
    title: "CASPer Situational Judgment Prep",
    domain: "situational-judgment",
    targetLearner: "Applicants preparing for CASPer-style ethics, communication, professionalism, and judgment scenarios.",
    learnerPromise:
      "Teach structured, ethical, empathetic responses to admissions situational-judgment scenarios without scripted or inauthentic answers.",
    coreOutcomes: [
      "Ethical reasoning",
      "Communication and empathy",
      "Professionalism under ambiguity",
      "Structured written response practice",
    ],
    readinessItems: [
      item("hub", "Dedicated CASPer hub", true, 12, "complete", "Dedicated `/pre-nursing/casper` response-training surface is live."),
      item("scenario-bank", "Situational judgment scenario bank", true, 18, "complete", "Scenario engine covers ethics, professionalism, conflict, advocacy, equity, bias, communication, interprofessional, confidentiality, and safety."),
      item("rubric", "Response rubric", true, 14, "complete", "Rubric scores empathy, professionalism, stakeholder awareness, communication, reasoning, ethics, conflict resolution, and bias awareness."),
      item("timed-practice", "Timed response practice", true, 12, "complete", "Written and video-style timed prompts are available with coaching."),
      item("feedback", "Structured feedback engine", true, 14, "complete", "CASPer-specific structured response review provides dimension scores, strengths, and next steps."),
      item("model-answers", "Model response library", false, 8, "complete", "Every scenario includes excellent, average, and poor responses with scoring explanations."),
      item("analytics", "Competency analytics", true, 10, "partial", "Dimension scoring exists; persistence and longitudinal trend storage still need production wiring."),
      item("seo", "Public SEO landing pages", false, 6, "missing", "Needs launch-approved CASPer admissions content clusters before indexing."),
      item("governance", "Professionalism/safety governance", true, 6, "partial", "Needs bias/fairness/professionalism checks."),
    ],
  },
  {
    id: "hesi",
    title: "HESI A2 Readiness",
    domain: "exam-prep",
    targetLearner: "Applicants preparing for HESI A2 nursing entrance exam sections.",
    learnerPromise:
      "Build targeted HESI A2 readiness across math, reading, vocabulary, grammar, anatomy/physiology, and science foundations.",
    coreOutcomes: [
      "HESI math fluency",
      "Reading comprehension",
      "Vocabulary/grammar readiness",
      "Anatomy and physiology mastery",
    ],
    readinessItems: [
      item("hub", "Dedicated HESI A2 hub", true, 12, "missing", "Needs explicit HESI route/surface."),
      item("blueprint", "HESI A2 blueprint registry", true, 14, "missing", "Needs section map and distribution targets."),
      item("question-bank", "HESI-style question bank", true, 18, "partial", "Existing question infrastructure can support; needs HESI tags/imports."),
      item("diagnostic", "Section diagnostic", true, 12, "missing", "Needs HESI baseline diagnostic."),
      item("study-plan", "Section-based study plan", true, 10, "partial", "Can reuse study plan logic with HESI sections."),
      item("practice-tests", "Timed practice tests", true, 12, "partial", "CAT/practice engine exists; needs HESI mode."),
      item("analytics", "Section analytics", true, 10, "partial", "Needs HESI section reporting."),
      item("seo", "Public SEO landing pages", false, 6, "missing", "Needs HESI admissions content."),
      item("governance", "Question quality governance", true, 6, "complete", "Shared governance infrastructure applies."),
    ],
  },
  {
    id: "teas",
    title: "ATI TEAS Readiness",
    domain: "exam-prep",
    targetLearner: "Applicants preparing for ATI TEAS entrance-exam readiness.",
    learnerPromise:
      "Build TEAS readiness across reading, math, science, English/language usage, and timed exam strategy.",
    coreOutcomes: [
      "TEAS reading readiness",
      "TEAS math fluency",
      "TEAS science readiness",
      "English and language usage mastery",
    ],
    readinessItems: [
      item("hub", "Dedicated TEAS hub", true, 12, "missing", "Needs explicit TEAS route/surface."),
      item("blueprint", "TEAS blueprint registry", true, 14, "missing", "Needs TEAS section/subsection distribution targets."),
      item("question-bank", "TEAS-style question bank", true, 18, "partial", "Existing question bank can support; needs TEAS tagging/imports."),
      item("diagnostic", "TEAS diagnostic", true, 12, "missing", "Needs baseline section diagnostic."),
      item("timed-tests", "Timed TEAS practice tests", true, 12, "partial", "Practice engine exists; needs TEAS mode/timing."),
      item("remediation", "Adaptive remediation", true, 10, "partial", "Governance/CAT systems exist; needs TEAS blueprint linkage."),
      item("analytics", "TEAS section analytics", true, 10, "partial", "Needs section/subsection reporting."),
      item("seo", "Public SEO landing pages", false, 6, "missing", "Needs TEAS admissions content."),
      item("governance", "Question quality governance", true, 6, "complete", "Shared governance infrastructure applies."),
    ],
  },
];

export function calculateAdmissionsSliceReadiness(
  definition: AdmissionsSliceDefinition,
): AdmissionsSliceReadinessResult {
  const totalWeight = definition.readinessItems.reduce((sum, entry) => sum + entry.weight, 0);
  const earnedWeight = definition.readinessItems.reduce((sum, entry) => {
    if (entry.status === "complete") return sum + entry.weight;
    if (entry.status === "partial") return sum + entry.weight * 0.5;
    return sum;
  }, 0);
  const missingRequiredItems = definition.readinessItems
    .filter((entry) => entry.required && entry.status !== "complete")
    .map((entry) => entry.label);
  const nextActions = definition.readinessItems
    .filter((entry) => entry.status !== "complete")
    .sort((a, b) => Number(b.required) - Number(a.required) || b.weight - a.weight)
    .slice(0, 5)
    .map((entry) => `${entry.label}: ${entry.note}`);

  return {
    id: definition.id,
    title: definition.title,
    readinessPercent: totalWeight ? Math.round((earnedWeight / totalWeight) * 100) : 0,
    completeItems: definition.readinessItems.filter((entry) => entry.status === "complete").length,
    totalItems: definition.readinessItems.length,
    missingRequiredItems,
    nextActions,
  };
}

export function getAdmissionsSliceReadinessReport(): AdmissionsSliceReadinessResult[] {
  return admissionsSliceDefinitions.map(calculateAdmissionsSliceReadiness);
}

export function getAdmissionsSliceDefinition(id: AdmissionsSliceId): AdmissionsSliceDefinition | undefined {
  return admissionsSliceDefinitions.find((definition) => definition.id === id);
}
