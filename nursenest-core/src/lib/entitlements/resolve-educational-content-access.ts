import { accessScopeFromUserAccess, getUserAccess, type UserAccess } from "@/lib/entitlements/get-user-access";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * High-level entitlement mode for diagnostics (no secrets / no full user ids).
 * Staff full access is **not** a paid subscription — see `UserAccess.reason === "admin_override"`.
 */
export type EducationalEntitlementMode =
  | "staff_full"
  | "active_subscription"
  | "grace_period"
  | "past_due_grace"
  | "active_trial"
  | "denied";

export type EducationalContentAccessDiagnostics = {
  entitlementMode: EducationalEntitlementMode;
  /** Stable identifier for log correlation — which helper produced the snapshot. */
  gatingSource: "resolveEducationalContentAccessForUser";
  hasFullEducationalAccess: boolean;
  reason: AccessScope["reason"];
  /** Redacted Prisma role string prefix only (debug builds). */
  sessionRolePrefix?: string;
};

export type EducationalContentAccess = {
  scope: AccessScope;
  userAccess: UserAccess;
  diagnostics: EducationalContentAccessDiagnostics;
};

function modeFromScope(scope: AccessScope): EducationalEntitlementMode {
  if (accessScopeIsStaffLearnerEntitlementBypass(scope)) return "staff_full";
  switch (scope.reason) {
    case "active_subscription":
      return "active_subscription";
    case "grace_period":
      return "grace_period";
    case "past_due_grace":
      return "past_due_grace";
    case "active_trial":
      return "active_trial";
    default:
      return "denied";
  }
}

/** True when this resolved scope should bypass subscriber tier/country/NP specialty educational gates. */
export function hasFullEducationalContentAccess(scope: AccessScope | null | undefined): boolean {
  return accessScopeIsStaffLearnerEntitlementBypass(scope);
}

/**
 * Authoritative server-side snapshot: subscription-backed learners + staff/admin full educational access.
 * Use {@link hasFullEducationalContentAccess} from an existing `AccessScope` when `getUserAccess` was already loaded.
 */
export async function resolveEducationalContentAccessForUser(userId: string): Promise<EducationalContentAccess | null> {
  const trimmed = userId.trim();
  if (!trimmed) return null;

  const userAccess = await getUserAccess(trimmed);
  const scope = accessScopeFromUserAccess(userAccess);
  const staffFull = accessScopeIsStaffLearnerEntitlementBypass(scope);
  const diagnostics: EducationalContentAccessDiagnostics = {
    entitlementMode: modeFromScope(scope),
    gatingSource: "resolveEducationalContentAccessForUser",
    hasFullEducationalAccess: staffFull,
    reason: scope.reason,
    sessionRolePrefix: userAccess.sessionJwt?.role
      ? String(userAccess.sessionJwt.role).slice(0, 24)
      : undefined,
  };

  if (process.env.EDUCATIONAL_ACCESS_DEBUG === "1" || process.env.EDUCATIONAL_ACCESS_DEBUG === "true") {
    safeServerLog("entitlement", "educational_content_access", {
      entitlementMode: diagnostics.entitlementMode,
      hasFullEducationalAccess: diagnostics.hasFullEducationalAccess,
      userIdPrefix: trimmed.slice(0, 8),
      reason: diagnostics.reason,
    });
  }

  return { scope, userAccess, diagnostics };
}
