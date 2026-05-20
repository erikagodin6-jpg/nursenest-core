/**
 * Neutral copy for subscription-gated lesson APIs — no checkout links, no Stripe CTAs.
 * Server responses today surface `error: "Subscription required"` with HTTP 403.
 */

export const NEUTRAL_LESSON_LIBRARY_LOCKED_BODY =
  "This lesson library is included with your NurseNest plan on the web. You can use other study areas in the app in the meantime.";

export const NEUTRAL_LESSON_DETAIL_LOCKED_BODY =
  "This lesson is not available on your current account access. Open your study hub on the web when you are ready.";

/** Detects known entitlement / subscription gate messages from `createJsonApiClient` failures. */
export function isLessonHubSubscriptionLockedMessage(message: string | undefined | null): boolean {
  if (!message) return false;
  const m = message.toLowerCase();
  return m.includes("subscription required") || m.includes("not_subscribed");
}

/** User-facing body for list/detail when the server reports subscription required. */
export function neutralLessonLockedBodyForSurface(surface: "list" | "detail"): string {
  return surface === "detail" ? NEUTRAL_LESSON_DETAIL_LOCKED_BODY : NEUTRAL_LESSON_LIBRARY_LOCKED_BODY;
}

/** True when the hub should offer a retry (transient / connectivity), not entitlement coaching. */
export function isLessonHubRetryableErrorMessage(message: string | undefined | null): boolean {
  if (!message) return false;
  const m = message.toLowerCase();
  if (isLessonHubSubscriptionLockedMessage(message)) return false;
  return (
    m.includes("network") ||
    m.includes("timeout") ||
    m.includes("abort") ||
    m.includes("try again") ||
    m.includes("503") ||
    m.includes("502") ||
    m.includes("500") ||
    m.includes("unable to verify")
  );
}
