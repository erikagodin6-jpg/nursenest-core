import "server-only";
import { cache } from "react";
import { getStaffSession, type StaffSession } from "@/lib/auth/staff-session";
import {
  getVerifiedAdminLearnerQaSimulation,
  staffGatedVerifiedSimulation,
  type AdminLearnerQaPayloadV1,
} from "@/lib/admin/admin-learner-qa-simulation";
import { resolveEntitlementForPage, type PageEntitlementResult } from "@/lib/entitlements/resolve-entitlement-for-page";
import { getUserAccess } from "@/lib/entitlements/get-user-access";
import type { UserAccess } from "@/lib/entitlements/user-access-types";

export type AdminViewAsLearnerContext = {
  staffSession: StaffSession | null;
  /** Signed cookie + tier/lifecycle simulation — only non-null when staff is present. */
  simulation: AdminLearnerQaPayloadV1 | null;
};

/**
 * Admin "view as learner" / QA simulation: staff session + HMAC-bound cookie (see {@link getVerifiedAdminLearnerQaSimulation}).
 * Use {@link simulation} for learner shell chrome; entitlement resolution already flows through {@link getUserAccess} for staff.
 */
export const getAdminViewAsLearnerContext = cache(async function getAdminViewAsLearnerContext(
  userId: string,
): Promise<AdminViewAsLearnerContext> {
  const [staffSession, raw] = await Promise.all([
    getStaffSession().catch(() => null),
    getVerifiedAdminLearnerQaSimulation(userId),
  ]);
  return {
    staffSession,
    simulation: staffGatedVerifiedSimulation(staffSession != null, raw),
  };
});

/** Page-level entitlements (includes staff QA overlay via {@link getUserAccess}). */
export async function resolveEffectiveEntitlements(userId: string): Promise<PageEntitlementResult> {
  return resolveEntitlementForPage(userId);
}

/**
 * Combined read for admin tooling: real {@link UserAccess} (with QA overlay when applicable) plus view-as shell context.
 * Prefer narrow reads (`resolveEntitlementForPage` only) on hot paths when you do not need `userAccess`.
 */
export async function resolveEffectiveLearnerContext(userId: string): Promise<{
  entitlement: PageEntitlementResult;
  userAccess: UserAccess;
  viewAs: AdminViewAsLearnerContext;
}> {
  const [entitlement, userAccess, viewAs] = await Promise.all([
    resolveEntitlementForPage(userId),
    getUserAccess(userId),
    getAdminViewAsLearnerContext(userId),
  ]);
  return { entitlement, userAccess, viewAs };
}
