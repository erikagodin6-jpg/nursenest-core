import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";

const CLINICAL_SKILLS_CONTEXT_DB_TIMEOUT_MS = 650;

export type ClinicalSkillsRouteContext = {
  userId: string | null;
  pathwayId: string | null;
};

export async function loadClinicalSkillsRouteContext(routeKey: string): Promise<ClinicalSkillsRouteContext> {
  const session = await getProtectedRouteSession(routeKey);
  const userId = (session?.user as { id?: string })?.id?.trim() || null;

  const pathwayRow =
    userId && userId.length > 0
      ? await withDatabaseFallbackTimeout(
          () =>
            prisma.user.findUnique({
              where: { id: userId },
              select: { learnerPath: true },
            }),
          null,
          CLINICAL_SKILLS_CONTEXT_DB_TIMEOUT_MS,
          { scope: "clinical_skills_route", label: "learner_path" },
        )
      : null;

  return {
    userId,
    pathwayId: pathwayRow?.learnerPath?.trim() || null,
  };
}
