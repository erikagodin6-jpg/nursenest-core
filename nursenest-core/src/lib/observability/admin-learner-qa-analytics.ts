/**
 * Central guard for **learner / business** PostHog (or future) captures during admin learner QA simulation.
 *
 * When `getUserAccess` applies the signed QA overlay, `accessScopeFromUserAccess` sets
 * `adminLearnerQaSimulation: true` on the entitlement scope. Funnel / study captures should respect this
 * so simulated staff sessions do not pollute production learner analytics.
 *
 * Client-side suppression: `setAdminLearnerQaClientAnalyticsSuppress` in `posthog-client.ts` (learner layout).
 */

import { getVerifiedAdminLearnerQaSimulation } from "@/lib/admin/admin-learner-qa-simulation";

export function skipLearnerBusinessAnalyticsForAccessScope(scope: {
  adminLearnerQaSimulation?: boolean;
}): boolean {
  return scope.adminLearnerQaSimulation === true;
}

/**
 * Routes that only have `userId` (no `AccessScope`) should call this before `captureServerEvent` for
 * learner-adjacent product events. Uses the same verified cookie read as `getUserAccess` (React `cache` dedupes per request).
 */
export async function serverLearnerPosthogDisabledForVerifiedQaUser(userId: string): Promise<boolean> {
  if (!userId.trim()) return false;
  return (await getVerifiedAdminLearnerQaSimulation(userId)) != null;
}
