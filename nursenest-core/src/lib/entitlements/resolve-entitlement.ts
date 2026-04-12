import {
  accessScopeFromUserAccess,
  getUserAccess,
  type AccessScope,
} from "@/lib/entitlements/get-user-access";

export type { AccessScope };

/**
 * Resolves premium access scope for SQL helpers (`questionAccessWhere`, lesson scope, CAT gates).
 * Prefer {@link getUserAccess} when you also need plan code, billing region slug, or renewal dates.
 */
export async function resolveEntitlement(userId: string): Promise<AccessScope> {
  return accessScopeFromUserAccess(await getUserAccess(userId));
}
