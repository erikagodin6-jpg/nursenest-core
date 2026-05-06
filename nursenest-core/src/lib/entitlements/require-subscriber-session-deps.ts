import { auth } from "@/lib/auth";
import { accessScopeFromUserAccess, getUserAccess } from "@/lib/entitlements/get-user-access";
import { correlationIdFromHeaders } from "@/lib/observability/request-correlation-headers";
import { maybeBlockOrTouchAccountSharingAfterSubscriberOk } from "@/lib/security/learner-session-activity.server";

/**
 * Injectable collaborators for {@link requireSubscriberSession} — default to production implementations;
 * tests swap methods with `mock.method(requireSubscriberSessionDeps, "auth", ...)`.
 */
export const requireSubscriberSessionDeps = {
  auth,
  getUserAccess,
  accessScopeFromUserAccess,
  maybeBlockOrTouchAccountSharingAfterSubscriberOk,
  correlationIdFromHeaders,
};
