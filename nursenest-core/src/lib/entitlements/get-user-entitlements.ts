/**
 * Convenience wrapper: resolve entitlement + freemium snapshot in one call.
 *
 * Use server-side in page components or API routes.
 * For client-side, call /api/learner/entitlements instead.
 */

import { auth } from "@/lib/auth";
import { accessScopeFromUserAccess, getUserAccess, type UserAccess } from "@/lib/entitlements/get-user-access";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { getFreemiumSnapshot, type FreemiumSnapshot } from "@/lib/entitlements/freemium";

export type UserEntitlements = {
  authenticated: boolean;
  userId: string | null;
  access: AccessScope;
  /** Full subscription snapshot (region, profession, exam goal, plan, renewal). */
  subscription: UserAccess | null;
  freemium: FreemiumSnapshot | null;
};

const NO_ACCESS: UserEntitlements = {
  authenticated: false,
  userId: null,
  access: { hasAccess: false, reason: "no_access", tier: null, country: null, alliedCareer: null },
  subscription: null,
  freemium: null,
};

export async function getUserEntitlements(): Promise<UserEntitlements> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) return NO_ACCESS;

  const [userAccess, freemium] = await Promise.all([getUserAccess(userId), getFreemiumSnapshot(userId)]);

  return {
    authenticated: true,
    userId,
    access: accessScopeFromUserAccess(userAccess),
    subscription: userAccess,
    freemium,
  };
}
