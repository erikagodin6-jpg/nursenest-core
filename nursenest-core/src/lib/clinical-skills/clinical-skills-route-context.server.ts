import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";

export type ClinicalSkillsRouteContext = {
  userId: string | null;
  pathwayId: string | null;
};

export async function loadClinicalSkillsRouteContext(routeKey: string): Promise<ClinicalSkillsRouteContext> {
  const session = await getProtectedRouteSession(routeKey);
  const userId = (session?.user as { id?: string })?.id?.trim() || null;

  const pathwayRow =
    userId && userId.length > 0
      ? await withDatabaseFallback(
          () =>
            prisma.user.findUnique({
              where: { id: userId },
              select: { learnerPath: true },
            }),
          null,
        )
      : null;

  return {
    userId,
    pathwayId: pathwayRow?.learnerPath?.trim() || null,
  };
}
