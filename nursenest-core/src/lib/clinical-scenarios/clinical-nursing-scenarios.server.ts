import "server-only";

import type {
  ClinicalNursingScenarioDifficulty,
  ClinicalNursingScenarioPublishStatus,
  ClinicalNursingScenarioTier,
} from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getExamPathwayById } from "@/lib/exam-pathways";
import { CANONICAL_STUDY_CATEGORIES } from "@/lib/study/normalize-study-category";

const LIST_TAKE = 60;

export async function listClinicalNursingScenariosForAdmin(opts: { pathwayId?: string | null }) {
  const pid = opts.pathwayId?.trim();
  return prisma.clinicalNursingScenario.findMany({
    where: pid ? { pathwayId: pid } : {},
    orderBy: { updatedAt: "desc" },
    take: LIST_TAKE,
    select: {
      id: true,
      title: true,
      pathwayId: true,
      canonicalCategoryId: true,
      tierFocus: true,
      difficulty: true,
      publishStatus: true,
      updatedAt: true,
      _count: { select: { stages: true } },
    },
  });
}

export async function listClinicalNursingScenariosForLearnerCatalog(opts: {
  pathwayId: string;
  includeDraftsForStaff: boolean;
}) {
  const pid = opts.pathwayId.trim();
  return prisma.clinicalNursingScenario.findMany({
    where: {
      pathwayId: pid,
      ...(opts.includeDraftsForStaff ? {} : { publishStatus: "APPROVED" as ClinicalNursingScenarioPublishStatus }),
    },
    orderBy: { updatedAt: "desc" },
    take: LIST_TAKE,
    select: {
      id: true,
      title: true,
      pathwayId: true,
      canonicalCategoryId: true,
      tierFocus: true,
      difficulty: true,
      publishStatus: true,
      patientAgeContext: true,
      presentingConcern: true,
    },
  });
}

export async function getClinicalNursingScenarioDetailForViewer(opts: {
  id: string;
  viewerMaySeeDrafts: boolean;
}) {
  const row = await prisma.clinicalNursingScenario.findUnique({
    where: { id: opts.id },
    include: { stages: { orderBy: { orderIndex: "asc" } } },
  });
  if (!row) return null;
  if (!opts.viewerMaySeeDrafts && row.publishStatus !== "APPROVED") return null;
  return row;
}

export async function updateClinicalNursingScenarioPublishStatus(
  id: string,
  status: ClinicalNursingScenarioPublishStatus,
) {
  await prisma.clinicalNursingScenario.update({
    where: { id },
    data: { publishStatus: status },
  });
}

const PLACEHOLDER_CONCERN =
  "Replace with pathway-specific, educator-reviewed case copy before any learner rollout. Staging content only — not individualized medical advice.";

/**
 * Minimal draft row + one stage so admins can open the preview shell and iterate in the DB/editor.
 */
export async function createClinicalNursingScenarioDraft(opts: {
  pathwayId: string;
  tierFocus: ClinicalNursingScenarioTier;
  difficulty: ClinicalNursingScenarioDifficulty;
  title?: string | null;
  createdByUserId?: string | null;
}): Promise<{ id: string }> {
  const pathwayId = opts.pathwayId.trim();
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway) {
    throw new Error("unknown_pathway");
  }

  const canonicalCategoryId = CANONICAL_STUDY_CATEGORIES[0]!.id;
  const title =
    (opts.title?.trim() && opts.title.trim().slice(0, 240)) ||
    `Draft clinical scenario — ${pathway.displayName ?? pathway.id}`;

  const optSafe = "opt_safe";
  const optUnsafe = "opt_unsafe";
  const optionsJson: Prisma.InputJsonValue = [
    { id: optSafe, label: "Escalate to the RN / charge nurse and stay with the patient while monitoring vitals." },
    {
      id: optUnsafe,
      label: "Act outside scope without reporting changes or seeking supervision (unsafe — for contrast only).",
    },
  ];
  const whyWrongByOptionId: Prisma.InputJsonValue = {
    [optUnsafe]: "Outside-scope actions without escalation can delay needed interventions; always loop in the RN.",
  };
  const consequencesByOptionId: Prisma.InputJsonValue = {
    [optSafe]: "patient improves",
    [optUnsafe]: "patient deteriorates",
  };

  const initialVitals: Prisma.InputJsonValue = {
    HR: "—",
    BP: "— / —",
    RR: "—",
    SpO2: "—%",
    T: "—°C",
  };

  return prisma.$transaction(async (tx) => {
    const scenario = await tx.clinicalNursingScenario.create({
      data: {
        title,
        pathwayId,
        canonicalCategoryId,
        tierFocus: opts.tierFocus,
        difficulty: opts.difficulty,
        patientAgeContext: "Replace with age and care setting (e.g., 72 y, medical-surg day 2).",
        presentingConcern: PLACEHOLDER_CONCERN,
        briefHistory:
          "Replace with concise background. Include allergies/meds in the dedicated field when relevant.",
        medicationsAllergies: null,
        initialVitals,
        assessmentFindings: "Replace with focused physical / head-to-toe cues appropriate to the tier and setting.",
        referencesJson: [],
        publishStatus: "DRAFT",
        createdByUserId: opts.createdByUserId?.trim() || null,
      },
    });

    await tx.clinicalNursingScenarioStage.create({
      data: {
        scenarioId: scenario.id,
        orderIndex: 0,
        scenarioText:
          "Stage 1 — replace with unfolding narrative. Keep escalation criteria explicit and cite references for specific numeric thresholds.",
        vitals: { HR: "—", BP: "— / —", RR: "—", SpO2: "—%", T: "—°C" },
        assessmentFindings: "Replace with stage-specific assessment updates.",
        questionStem: "What is the best next action for this patient right now?",
        optionsJson,
        correctOptionId: optSafe,
        rationale:
          "Safe practice prioritizes monitoring, scope-appropriate actions, and timely escalation when clinical cues worsen or exceed your authorized role.",
        whyWrongByOptionId,
        clinicalJudgmentFocus: "Prioritization · noticing cues · escalation / SBAR",
        consequencesByOptionId,
        nextStageOrder: null,
      },
    });

    return { id: scenario.id };
  });
}
