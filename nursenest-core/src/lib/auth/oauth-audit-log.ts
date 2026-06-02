import "server-only";

import type { OAuthProviderId } from "@/lib/auth/auth-flow-governance";
import { captureServerEvent, analyticsDistinctId } from "@/lib/observability/posthog-server";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type OAuthAuditEvent =
  | "oauth_account_linked"
  | "oauth_account_created"
  | "oauth_existing_account_matched"
  | "oauth_relay_email_detected"
  | "oauth_provider_collision_detected"
  | "oauth_signin_success"
  | "oauth_signin_failure"
  | "oauth_provider_disconnected";

export type OAuthAuditMeta = {
  provider: OAuthProviderId;
  learnerId?: string;
  normalizedEmail?: string;
  accountCreated?: boolean;
  bridgeOccurred?: boolean;
  providerSubjectId?: string;
  isApplePrivateRelay?: boolean;
  requestOrigin?: string;
  reason?: string;
};

function redactEmailForLog(email: string | undefined): string | undefined {
  if (!email) return undefined;
  const at = email.indexOf("@");
  if (at <= 1) return "***";
  return `${email.slice(0, 2)}***${email.slice(at)}`;
}

/** Structured OAuth audit — server logs + privacy-safe PostHog (no tokens or secrets). */
export function logOAuthAudit(event: OAuthAuditEvent, meta: OAuthAuditMeta): void {
  const payload = {
    event,
    provider: meta.provider,
    learner_id_prefix: meta.learnerId?.slice(0, 8),
    normalized_email: redactEmailForLog(meta.normalizedEmail),
    account_created: meta.accountCreated,
    bridge_occurred: meta.bridgeOccurred,
    provider_subject_prefix: meta.providerSubjectId?.slice(0, 8),
    is_apple_private_relay: meta.isApplePrivateRelay,
    request_origin: meta.requestOrigin?.slice(0, 120),
    reason: meta.reason?.slice(0, 120),
  };

  safeServerLog("auth", event, payload);

  const distinctId = meta.learnerId ? analyticsDistinctId(meta.learnerId) : undefined;
  if (distinctId) {
    captureServerEvent(distinctId, event, {
      provider: meta.provider,
      account_created: meta.accountCreated ?? false,
      bridge_occurred: meta.bridgeOccurred ?? false,
      is_apple_private_relay: meta.isApplePrivateRelay ?? false,
    });
  }
}
