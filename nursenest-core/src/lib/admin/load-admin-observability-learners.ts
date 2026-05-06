/**
 * Support / super — bounded learner roster for observability (PII: email present).
 */
import "server-only";
import { Prisma, SubscriptionStatus, TrialStatus, UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { userWhereRealMetrics } from "@/lib/admin/admin-metrics-exclude-demo-users";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";

const MAX_PAGE = 25;
const MAX_LIMIT = 40;

export type AdminObservabilityLearnerRow = {
  id: string;
  name: string;
  email: string;
  trialStatus: string;
  tier: string;
  country: string;
  targetExamPathwayId: string | null;
  targetPathwayLabel: string | null;
  lastLoginAt: string | null;
  updatedAt: string;
  subscriptionSummary: string;
};

function pathwayLabel(id: string | null): string | null {
  if (!id?.trim()) return null;
  return EXAM_PATHWAYS.find((p) => p.id === id)?.displayName ?? id;
}

function summarizeSubs(rows: { status: string; planTier: string | null }[]): string {
  if (!rows.length) return "None";
  const parts = rows.slice(0, 3).map((r) => `${r.status}${r.planTier ? ` (${r.planTier})` : ""}`);
  return parts.join(" · ");
}

export async function loadAdminObservabilityLearners(opts: {
  pathwayId?: string | null;
  trialOnly?: boolean;
  page?: number;
  limit?: number;
}): Promise<{ rows: AdminObservabilityLearnerRow[]; page: number; pageSize: number; hasMore: boolean }> {
  const pageSize = Math.min(MAX_LIMIT, Math.max(8, opts.limit ?? 24));
  const page = Math.min(MAX_PAGE, Math.max(1, opts.page ?? 1));
  const skip = (page - 1) * pageSize;

  const where: Prisma.UserWhereInput = {
    ...userWhereRealMetrics({ role: UserRole.LEARNER }),
    ...(opts.pathwayId?.trim()
      ? { targetExamPathwayId: opts.pathwayId.trim() }
      : {}),
    ...(opts.trialOnly ? { trialStatus: TrialStatus.ACTIVE } : {}),
  };

  const batch = await prisma.user.findMany({
    where,
    orderBy: [{ lastLoginAt: "desc" }, { updatedAt: "desc" }],
    skip,
    take: pageSize + 1,
    select: {
      id: true,
      name: true,
      email: true,
      trialStatus: true,
      tier: true,
      country: true,
      targetExamPathwayId: true,
      lastLoginAt: true,
      updatedAt: true,
      subscriptions: {
        where: {
          status: {
            in: [
              SubscriptionStatus.ACTIVE,
              SubscriptionStatus.GRACE,
              SubscriptionStatus.PAST_DUE,
              SubscriptionStatus.CANCELLED,
            ],
          },
        },
        take: 4,
        orderBy: { updatedAt: "desc" },
        select: { status: true, planTier: true },
      },
    },
  });

  const hasMore = batch.length > pageSize;
  const slice = hasMore ? batch.slice(0, pageSize) : batch;

  const rows: AdminObservabilityLearnerRow[] = slice.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    trialStatus: u.trialStatus,
    tier: u.tier,
    country: u.country,
    targetExamPathwayId: u.targetExamPathwayId,
    targetPathwayLabel: pathwayLabel(u.targetExamPathwayId),
    lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
    updatedAt: u.updatedAt.toISOString(),
    subscriptionSummary: summarizeSubs(u.subscriptions),
  }));

  return { rows, page, pageSize, hasMore };
}
