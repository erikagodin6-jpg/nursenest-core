import {
  accessScopeFromUserAccess,
  getUserAccess,
  type AccessScope,
} from "@/lib/entitlements/get-user-access";

export type { AccessScope };

/**
 * Resolves premium access scope for SQL helpers (`questionAccessWhere`, lesson scope, CAT gates).
 * Prefer {@link getUserAccess} when you also need plan code, billing region slug, or renewal dates.
 *
 * Staff roles (ADMIN, SUPER_ADMIN, …) receive full learner access via {@link getUserAccess}
 * (`reason: admin_override`) unless a signed **admin learner QA** cookie is active — then entitlement mirrors
 * the selected simulated pathway/subscription state (still no Stripe mutation).
 *
 * For diagnostics and naming clarity, see {@link resolveEducationalContentAccessForUser} and
 * {@link hasFullEducationalContentAccess} in `./resolve-educational-content-access`.
 */
export async function resolveEntitlement(userId: string): Promise<AccessScope> {
  return accessScopeFromUserAccess(await getUserAccess(userId));
}
