import {
  clinicalSkillsForRoleTrack,
  listClinicalSkills,
  type ClinicalSkillDefinition,
} from "@/lib/clinical-skills/clinical-skills-catalog";
import { getClinicalSkillCheckpoints } from "@/lib/clinical-skills/clinical-skills-checkpoints";
import { getClinicalSkillEnrichment } from "@/lib/clinical-skills/clinical-skills-enrichment";

export type ClinicalSkillLabModeKey =
  | "learn"
  | "practice"
  | "competency"
  | "simulation"
  | "review";

export type ClinicalSkillRequiredSectionKey =
  | "overview"
  | "when_used"
  | "why_matters"
  | "equipment"
  | "safety"
  | "procedure"
  | "common_mistakes"
  | "clinical_reasoning"
  | "documentation"
  | "patient_teaching"
  | "complications"
  | "exam_relevance"
  | "practice_questions"
  | "mastery_assessment"
  | "reflection"
  | "remediation";

export type ClinicalSkillLabMode = {
  key: ClinicalSkillLabModeKey;
  label: string;
  outcome: string;
  href: string;
  interactions: string[];
};

export type ClinicalSkillRequiredSection = {
  key: ClinicalSkillRequiredSectionKey;
  label: string;
  body: string;
};

export type ClinicalSkillCompetencyLabProfile = {
  skillSlug: string;
  modes: ClinicalSkillLabMode[];
  requiredSections: ClinicalSkillRequiredSection[];
  practiceQuestionCount: number;
  simulationAvailable: boolean;
  remediationAvailable: boolean;
};

export type ClinicalSkillAuditFinding = {
  skillSlug: string;
  title: string;
  status: "implemented" | "partial" | "missing";
  flags: string[];
  practiceQuestionCount: number;
  flashcardCount: number;
  retentionItemCount: number;
};

export type ClinicalSkillsAuditSummary = {
  totalSkills: number;
  implemented: number;
  partial: number;
  missing: number;
  duplicateTitles: string[];
  roleCoverage: {
    rn: number;
    rpnPn: number;
    np: number;
  };
  volumeTargets: {
    preNursing: "not_modeled";
    rn: "met" | "gap";
    rpnPn: "met" | "gap";
    np: "met" | "gap";
    allied: "not_modeled";
  };
  findings: ClinicalSkillAuditFinding[];
};

const REQUIRED_SECTION_LABELS: Record<ClinicalSkillRequiredSectionKey, string> =
  {
    overview: "Overview",
    when_used: "When the skill is used",
    why_matters: "Why the skill matters",
    equipment: "Required equipment",
    safety: "Safety considerations",
    procedure: "Step-by-step procedure",
    common_mistakes: "Common mistakes",
    clinical_reasoning: "Clinical reasoning",
    documentation: "Documentation requirements",
    patient_teaching: "Patient teaching",
    complications: "Complications",
    exam_relevance: "NCLEX / REx-PN relevance",
    practice_questions: "Practice questions",
    mastery_assessment: "Mastery assessment",
    reflection: "Reflection prompts",
    remediation: "Remediation activities",
  };

function section(
  key: ClinicalSkillRequiredSectionKey,
  body: string,
): ClinicalSkillRequiredSection {
  return {
    key,
    label: REQUIRED_SECTION_LABELS[key],
    body,
  };
}

function firstStep(skill: ClinicalSkillDefinition): string {
  return skill.steps[0]?.title ?? "Prepare safely";
}

function lastStep(skill: ClinicalSkillDefinition): string {
  return skill.steps.at(-1)?.title ?? "Document and reassess";
}

export function buildClinicalSkillCompetencyLabProfile(
  skill: ClinicalSkillDefinition,
): ClinicalSkillCompetencyLabProfile {
  const enrichment = getClinicalSkillEnrichment(skill);
  const questionCount = getClinicalSkillCheckpoints(skill.slug).length;
  const domain = skill.competencyDomain ?? "Clinical competency";
  const focus = skill.simulationFocus ?? skill.summary;
  const equipment = [
    "Patient identifiers and current order or policy",
    "Hand hygiene and PPE appropriate to the risk",
    "Procedure-specific supplies from the facility checklist",
    "Documentation access and escalation pathway",
  ].join("; ");

  return {
    skillSlug: skill.slug,
    modes: [
      {
        key: "learn",
        label: "Learn Mode",
        href: "#clinical-skills-learn-mode",
        outcome:
          "Build the clinical context, safety rationale, visual workflow, memory aids, and exam-relevant cues before practicing.",
        interactions: [
          "Overview",
          "Clinical pearls",
          "Decision checkpoints",
          "Memory aids",
        ],
      },
      {
        key: "practice",
        label: "Practice Mode",
        href: "#clinical-skills-checkpoint",
        outcome: `Complete ${questionCount}+ assessment items that test prioritization, error recognition, delegation, patient teaching, and documentation.`,
        interactions: [
          "MCQs",
          "Prioritization",
          "Delegation",
          "Case-based questions",
          "Error recognition",
        ],
      },
      {
        key: "competency",
        label: "Competency Mode",
        href: "#clinical-skills-competency-mode",
        outcome:
          "Perform steps in order and track omissions, sequencing errors, safety breaks, and competency readiness.",
        interactions: [
          "Procedure sequence",
          "Safety checks",
          "Omission tracking",
          "Competency meter",
        ],
      },
      {
        key: "simulation",
        label: "Simulation Mode",
        href: "#clinical-skills-simulation-mode",
        outcome:
          "Work through a patient-status change: assess, recognize, intervene, monitor, document, and escalate.",
        interactions: [
          "Dynamic scenario",
          "Unsafe practice detection",
          "Escalation decision",
          "Outcome feedback",
        ],
      },
      {
        key: "review",
        label: "Review Mode",
        href: "#clinical-skills-review-mode",
        outcome:
          "Use flashcards, retention prompts, reflection, and remediation activities to maintain mastery over time.",
        interactions: [
          "Flashcards",
          "Retention checks",
          "Reflection prompts",
          "Targeted remediation",
        ],
      },
    ],
    requiredSections: [
      section(
        "overview",
        `${skill.title} is a ${domain.toLowerCase()} competency focused on ${focus}.`,
      ),
      section(
        "when_used",
        `Use this skill when patient condition, orders, scope, and policy support ${focus}.`,
      ),
      section("why_matters", enrichment.clinicalRationale),
      section("equipment", equipment),
      section(
        "safety",
        "Verify patient identity, baseline status, orders, allergies or contraindications, infection-control needs, and stop criteria before continuing.",
      ),
      section(
        "procedure",
        `Start with ${firstStep(skill)}, proceed through the ordered procedure flow, and close with ${lastStep(skill)}.`,
      ),
      section("common_mistakes", enrichment.errorScenario.rationale),
      section(
        "clinical_reasoning",
        `The learner must decide whether findings support continuing, pausing, delegating supportive tasks, or escalating care during ${skill.title}.`,
      ),
      section(
        "documentation",
        "Document indication, assessment findings, action performed, patient response, teaching, notifications, and follow-up plan.",
      ),
      section(
        "patient_teaching",
        "Use plain language, explain what the patient should report, and confirm understanding with teach-back.",
      ),
      section(
        "complications",
        "Stop and reassess for unexpected pain, bleeding, respiratory distress, altered mental status, contamination, device failure, or deterioration.",
      ),
      section(
        "exam_relevance",
        "NCLEX/REx-PN items reward safety, prioritization, delegation boundaries, infection control, and timely escalation over rote task completion.",
      ),
      section(
        "practice_questions",
        `${questionCount} checkpoint items are available for this skill, with rationales and retesting support.`,
      ),
      section(
        "mastery_assessment",
        "Mastery requires procedure-step completion, sequencing pass, error-spotting pass, retention checks, and competency checkpoint performance.",
      ),
      section(
        "reflection",
        "Reflection prompt: what cue would make this skill unsafe, and what would you do first?",
      ),
      section(
        "remediation",
        "If missed, repeat the procedure flow, review rationales, complete flashcards, and retest with targeted scenario questions.",
      ),
    ],
    practiceQuestionCount: questionCount,
    simulationAvailable: Boolean(
      enrichment.simulationOverview && enrichment.errorScenario,
    ),
    remediationAvailable:
      enrichment.retentionItems.length > 0 && enrichment.flashcards.length > 0,
  };
}

export function auditClinicalSkill(
  skill: ClinicalSkillDefinition,
): ClinicalSkillAuditFinding {
  const enrichment = getClinicalSkillEnrichment(skill);
  const profile = buildClinicalSkillCompetencyLabProfile(skill);
  const flags: string[] = [];

  if (skill.steps.length === 0) flags.push("missing_procedure_steps");
  if (profile.practiceQuestionCount < 20) flags.push("practice_items_below_20");
  if (enrichment.flashcards.length < 10) flags.push("flashcards_below_10");
  if (enrichment.retentionItems.length < 3)
    flags.push("retention_items_below_3");
  if (!profile.simulationAvailable) flags.push("missing_simulation");
  if (!profile.remediationAvailable) flags.push("missing_remediation");
  if (profile.requiredSections.length < 16)
    flags.push("missing_required_sections");

  return {
    skillSlug: skill.slug,
    title: skill.title,
    status:
      flags.length === 0
        ? "implemented"
        : flags.length <= 2
          ? "partial"
          : "missing",
    flags,
    practiceQuestionCount: profile.practiceQuestionCount,
    flashcardCount: enrichment.flashcards.length,
    retentionItemCount: enrichment.retentionItems.length,
  };
}

export function auditClinicalSkillsCatalog(): ClinicalSkillsAuditSummary {
  const skills = [...listClinicalSkills()];
  const titleCounts = new Map<string, number>();
  for (const skill of skills) {
    const key = skill.title.trim().toLowerCase();
    titleCounts.set(key, (titleCounts.get(key) ?? 0) + 1);
  }
  const duplicateTitles = [...titleCounts.entries()]
    .filter(([, count]) => count > 1)
    .map(([title]) => title);
  const findings = skills.map(auditClinicalSkill);
  const implemented = findings.filter(
    (finding) => finding.status === "implemented",
  ).length;
  const partial = findings.filter(
    (finding) => finding.status === "partial",
  ).length;
  const missing = findings.filter(
    (finding) => finding.status === "missing",
  ).length;
  const rn = clinicalSkillsForRoleTrack("rn").length;
  const rpnPn = clinicalSkillsForRoleTrack("rpn_lpn").length;
  const np = clinicalSkillsForRoleTrack("np").length;

  return {
    totalSkills: skills.length,
    implemented,
    partial,
    missing,
    duplicateTitles,
    roleCoverage: { rn, rpnPn, np },
    volumeTargets: {
      preNursing: "not_modeled",
      rn: rn >= 150 ? "met" : "gap",
      rpnPn: rpnPn >= 100 ? "met" : "gap",
      np: np >= 150 ? "met" : "gap",
      allied: "not_modeled",
    },
    findings,
  };
}
