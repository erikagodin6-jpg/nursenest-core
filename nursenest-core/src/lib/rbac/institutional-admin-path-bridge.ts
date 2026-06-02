import type { StaffTier } from "@/lib/auth/staff-roles";
import { isPathAllowedForStaffTier } from "@/lib/auth/admin-path-policy";

/**
 * Single import surface for admin Route Handlers + layouts to delegate path RBAC.
 * Extends later with institutional path prefixes without churn in every caller.
 */
export function tierAllowsAdminApiPath(tier: StaffTier, pathname: string): boolean {
  return isPathAllowedForStaffTier(tier, pathname);
}
