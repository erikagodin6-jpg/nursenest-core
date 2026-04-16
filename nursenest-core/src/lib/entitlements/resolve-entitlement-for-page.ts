import { resolveEntitlement, type AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { correlationIdFromHeaders } from "@/lib/observability/request-correlation-headers";
import { recordEntitlementResolveFailureSignal } from "@/lib/observability/production-signal-metrics";
import { emitStructuredLog } from "@/lib/observability/structured-log";
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
    const correlationId = await correlationIdFromHeaders();
    productEvent("entitlement_resolve_failed", { surface: "page" });
    recordEntitlementResolveFailureSignal("page", correlationId);
    emitStructuredLog("entitlement_resolve_failed", "error", {
      correlationId,
      route: "rsc:resolveEntitlementForPage",
      method: "GET",
      flow: "content",
      errorClass: e instanceof Error ? e.name : typeof e,
      message: "entitlement resolve failed in server component",
    });
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
