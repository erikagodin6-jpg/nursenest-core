import { resolveEntitlement, type AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { productEvent } from "@/lib/observability/product-events";

export type PageEntitlementResult = AccessScope | "error";

/**
 * Server-component safe entitlement read: never throws (shows fallback UI on failure).
 */
export async function resolveEntitlementForPage(userId: string): Promise<PageEntitlementResult> {
  if (!userId) {
    return { hasAccess: false, reason: "no_access", tier: null, country: null };
  }
  try {
    return await resolveEntitlement(userId);
  } catch (e) {
    productEvent("entitlement_resolve_failed", { surface: "page" });
    safeServerLogCritical("entitlement", "resolve_failed_page", { page: "server_component" }, e);
    return "error";
  }
}
