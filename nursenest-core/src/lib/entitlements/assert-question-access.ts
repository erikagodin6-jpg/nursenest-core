import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Preserves session order; drops question IDs the current entitlement no longer allows (downgrade / tier change).
 */
/** Keeps `IN (...)` clauses bounded for memory and planner stability on huge sessions. */
const SESSION_ID_CHUNK = 400;

export async function filterSessionQuestionIdsInScope(
  sessionIds: string[],
  entitlement: AccessScope,
): Promise<string[]> {
  if (sessionIds.length === 0) return [];
  const allowed = new Set<string>();
  const baseWhere = questionAccessWhere(entitlement);
  for (let i = 0; i < sessionIds.length; i += SESSION_ID_CHUNK) {
    const chunk = sessionIds.slice(i, i + SESSION_ID_CHUNK);
    const rows = await prisma.examQuestion.findMany({
      where: { AND: [{ id: { in: chunk } }, baseWhere] },
      select: { id: true },
    });
    for (const r of rows) allowed.add(r.id);
  }
  return sessionIds.filter((id) => allowed.has(id));
}

/**
 * Returns a where clause that restricts to this question id if and only if the learner may read it.
 */
export function questionIdWhereIfAllowed(
  questionId: string,
  entitlement: AccessScope,
): Prisma.ExamQuestionWhereInput {
  return {
    AND: [{ id: questionId }, questionAccessWhere(entitlement)],
  };
}

export async function isQuestionReadableByEntitlement(
  questionId: string,
  entitlement: AccessScope,
): Promise<boolean> {
  if (!entitlement.hasAccess) return false;
  const row = await prisma.examQuestion.findFirst({
    where: questionIdWhereIfAllowed(questionId, entitlement),
    select: { id: true },
  });
  return !!row;
}

export function logPaywallDeny(route: string, reason: string, meta?: Record<string, string | number | boolean>): void {
  safeServerLog("access", "denied", { route, reason, ...(meta ?? {}) });
}
