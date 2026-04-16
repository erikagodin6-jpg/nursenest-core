import { resolveEntitlement, type AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { productEvent } from "@/lib/observability/product-events";

export type PageEntitlementResult = AccessScope | "error";

/**
 * Server-component safe entitlement read: never throws (shows fallback UI on failure).
 */
export async function resolveEntitlementForPage(userId: string): Promise<PageEntitlementResult> {
  if (!userId) {
    return { hasAccess: false, reason: "no_access", tier: null, country: null, alliedCareer: null };
  }
  try {
    return await resolveEntitlement(userId);
  } catch (e) {
    productEvent("entitlement_resolve_failed", { surface: "page" });
    safeServerLog("entitlement", "resolve_failed_page_warning", {
      surface: "page",
      userIdPrefix: userId.slice(0, 8),
      errorName: e instanceof Error ? e.name : typeof e,
      severity: "warning",
    });
    safeServerLogCritical("entitlement", "resolve_failed_page", { page: "server_component" }, e);
    return "error";
  }
}
