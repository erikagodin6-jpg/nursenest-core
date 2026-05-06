/**
 * Central tags for release-gate / deploy automation triage (stdout, reporters, annotations).
 * Use {@link attachFailureClassification} from specs; reporters may echo `failure_classification` annotations.
 */
import type { TestInfo } from "@playwright/test";

export const FAILURE_CLASSIFICATION_TAGS = [
  "auth_failure",
  "entitlement_failure",
  "empty_pool",
  "route_crash",
  "timeout",
  "mobile_overflow",
  "missing_env",
  "stripe_webhook_skipped",
] as const;

export type FailureClassificationTag = (typeof FAILURE_CLASSIFICATION_TAGS)[number];

export function isFailureClassificationTag(s: string): s is FailureClassificationTag {
  return (FAILURE_CLASSIFICATION_TAGS as readonly string[]).includes(s);
}

/** Record a single primary classification for the current test (Playwright annotations). */
export function attachFailureClassification(testInfo: TestInfo, tag: FailureClassificationTag): void {
  testInfo.annotations.push({ type: "failure_classification", description: tag });
}

/** Best-effort tag from a skip message or annotation (for summary reporters). */
export function inferFailureClassificationFromSkipReason(reason: string): FailureClassificationTag | "skipped_other" {
  const r = reason.toLowerCase();
  if (/credential-gated|missing\s+e2e_|missing\s+qa_|requires\s+env|not configured/i.test(r)) {
    return "missing_env";
  }
  if (/stripe|webhook/i.test(r)) return "stripe_webhook_skipped";
  if (/overflow|horizontal scroll/i.test(r)) return "mobile_overflow";
  if (/timeout|timed out/i.test(r)) return "timeout";
  if (/401|403|unauthorized|session|login/i.test(r)) return "auth_failure";
  if (/paywall|entitlement|subscription required/i.test(r)) return "entitlement_failure";
  if (/empty pool|no cards|zero pool/i.test(r)) return "empty_pool";
  if (/crash|5\d\d|runtime error/i.test(r)) return "route_crash";
  return "skipped_other";
}
