/**
 * English-only emergency strings for `(marketing)/(default)` layout when chrome shards fail.
 *
 * HARD GUARANTEES:
 * - Never returns empty object
 * - Never allows invalid/empty values to override fallback
 * - Always produces a render-safe chrome bundle
 */

function assertNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export const MINIMAL_MARKETING_LAYOUT_SHELL_MESSAGES: Record<string, string> = {
  "brand.nurseNest": "NurseNest",
  "brand.homeAriaLabel": "NurseNest home",
  "nav.logIn": "Log in",
  "nav.language": "Language",
  "nav.theme": "Theme",
  "nav.pricing": "Pricing",
  "footer.blog": "Blog",
  "footer.faq": "FAQ",
};

function sanitizeIncomingMessages(
  messages: Record<string, string> | null | undefined,
): Record<string, string> {
  if (!messages || typeof messages !== "object") return {};

  const cleaned: Record<string, string> = {};

  for (const [key, value] of Object.entries(messages)) {
    if (assertNonEmptyString(value)) {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

/**
 * Safe merge:
 * - fallback provides baseline
 * - valid incoming messages override
 * - invalid values are ignored
 */
export function mergeMinimalMarketingLayoutShellMessages(
  messages: Record<string, string> | null | undefined,
): Record<string, string> {
  const safeIncoming = sanitizeIncomingMessages(messages);

  const merged = {
    ...MINIMAL_MARKETING_LAYOUT_SHELL_MESSAGES,
    ...safeIncoming,
  };

  // Final guard: never allow empty result
  if (Object.keys(merged).length === 0) {
    throw new Error(
      "[marketing-layout] CRITICAL: merged chrome messages empty — this should never happen",
    );
  }

  return merged;
}