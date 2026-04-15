import { userShouldSeeBaselinePrompt } from "@/lib/baseline/baseline-assessment";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";

export type LearnerPathwayNavMetadata = {
  showBaselinePrompt: boolean;
  pathwayId: string | null;
  pathwayShortLabel: string | null;
  pathwayHubHref: string | null;
  examsLabel: "CAT Exams" | "Exams";
};

function pillLabelForRoleTrack(roleTrack: string): string {
  if (roleTrack === "rn") return "RN";
  if (roleTrack === "lpn" || roleTrack === "rpn") return "PN";
  if (roleTrack === "np") return "NP";
  if (roleTrack === "allied") return "Allied";
  return "Pathway";
}

export const DEFAULT_LEARNER_PATHWAY_NAV_METADATA: LearnerPathwayNavMetadata = {
  showBaselinePrompt: false,
  pathwayId: null,
  pathwayShortLabel: null,
  pathwayHubHref: null,
  examsLabel: "Exams",
};

export function isLearnerPathwayNavMetadata(v: unknown): v is LearnerPathwayNavMetadata {
  if (v === null || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.showBaselinePrompt === "boolean" &&
    (o.pathwayId === null || typeof o.pathwayId === "string") &&
    (o.pathwayShortLabel === null || typeof o.pathwayShortLabel === "string") &&
    (o.pathwayHubHref === null || typeof o.pathwayHubHref === "string") &&
    (o.examsLabel === "CAT Exams" || o.examsLabel === "Exams")
  );
}

/**
 * Tier-1 pathway + baseline flags for learner chrome (DB-backed).
 * Callers should wrap with {@link safeOptional} — this function may throw on DB errors.
 */
export async function loadLearnerPathwayNavMetadata(userId: string): Promise<LearnerPathwayNavMetadata> {
  if (!userId || !isDatabaseUrlConfigured()) {
    return { ...DEFAULT_LEARNER_PATHWAY_NAV_METADATA };
  }

  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      baselineAssessmentSkippedAt: true,
      baselineAssessmentCompletedAt: true,
      learnerPath: true,
      alliedProfessionKey: true,
    },
  });

  let showBaselinePrompt = false;
  let pathwayShortLabel: string | null = null;
  let pathwayId: string | null = null;
  let pathwayHubHref: string | null = null;
  let examsLabel: "CAT Exams" | "Exams" = "Exams";

  if (u != null) {
    showBaselinePrompt = userShouldSeeBaselinePrompt(u);
    const lp = u.learnerPath?.trim();
    pathwayId = lp && lp.length > 0 ? lp : null;
    if (lp) {
      const p = getExamPathwayById(lp);
      pathwayShortLabel = p ? pillLabelForRoleTrack(p.roleTrack) : lp.slice(0, 48);
      if (p) {
        pathwayHubHref = buildExamPathwayPath(p);
        if (p.roleTrack === "rn" || p.roleTrack === "rpn" || p.roleTrack === "lpn" || p.roleTrack === "np") {
          examsLabel = "CAT Exams";
        }
      }
    } else if (u.alliedProfessionKey) {
      pathwayShortLabel = "Allied";
      pathwayHubHref = "/us/allied/allied-health";
    }
  }

  return {
    showBaselinePrompt,
    pathwayId,
    pathwayShortLabel,
    pathwayHubHref,
    examsLabel,
  };
}
