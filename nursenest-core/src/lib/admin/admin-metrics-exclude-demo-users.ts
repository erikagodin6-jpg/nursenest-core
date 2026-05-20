import type { Prisma } from "@prisma/client";

/**
 * Demo QA accounts (`User.isDemoUser`) must not pollute product metrics, funnels, or dashboards.
 * Admin-only lists (e.g. demo-users page) may still query `isDemoUser: true` explicitly.
 */
export const realUserMetricsWhere: Pick<Prisma.UserWhereInput, "isDemoUser"> = {
  isDemoUser: false,
};

export function userWhereRealMetrics(extra?: Prisma.UserWhereInput): Prisma.UserWhereInput {
  if (!extra) return { ...realUserMetricsWhere };
  return { AND: [{ ...realUserMetricsWhere }, extra] };
}

export function subscriptionWhereRealUserMetrics(extra?: Prisma.SubscriptionWhereInput): Prisma.SubscriptionWhereInput {
  const base: Prisma.SubscriptionWhereInput = { user: { isDemoUser: false } };
  if (!extra) return base;
  return { AND: [base, extra] };
}
