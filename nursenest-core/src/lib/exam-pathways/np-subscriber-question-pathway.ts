import type { TierCode } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { subscriptionCoversPathwayBase } from "@/lib/exam-pathways/pathway-entitlements-policy";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/**
 * NP subscribers inherit the RN/PN tier ladder for remediation, but **question list** calls must not
 * silently query the whole ladder when `pathwayId` is missing — that blends RN NCLEX items into NP prep.
 *
 * When `pathwayId` is absent, resolve the first matching **NP** pathway from ordered profile hints.
 * When `pathwayId` is present (valid or not), do not substitute hints (callers surface invalid/mismatch).
 */
export function resolveNpSubscriberQuestionPathway(args: {
  tier: TierCode | null;
  pathwayIdParam: string | null;
  pathwayResolved: ExamPathwayDefinition | null;
  pathwayHintIds: readonly (string | null | undefined)[];
  entitlement: AccessScope;
  getExamPathwayById: (id: string) => ExamPathwayDefinition | undefined | null;
}): ExamPathwayDefinition | null {
  const { tier, pathwayIdParam, pathwayResolved, pathwayHintIds, entitlement, getExamPathwayById } = args;
  if (tier !== "NP") return pathwayResolved;
  if (pathwayResolved) return pathwayResolved;
  if (pathwayIdParam?.trim()) return null;

  for (const raw of pathwayHintIds) {
    const id = raw?.trim();
    if (!id) continue;
    const p = getExamPathwayById(id) ?? null;
    if (!p || p.examFamily !== "NP") continue;
    if (!subscriptionCoversPathwayBase(entitlement, p)) continue;
    return p;
  }
  return null;
}
