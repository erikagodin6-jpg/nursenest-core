import { safeServerLog } from "@/lib/observability/safe-server-log";

type SaveResult = "ok" | "validation_error" | "db_error" | "revalidate_error" | "unauthorized";

export function logMarketingPublicContentSaveAttempt(meta: {
  messageKeyPrefix: string;
  locale: string;
  surface: string;
  actorPrefix: string;
}): void {
  safeServerLog("admin", "marketing_public_content_save_attempt", meta);
}

export function logMarketingPublicContentSaveResult(meta: {
  result: SaveResult;
  messageKeyPrefix: string;
  locale: string;
  surface: string;
  actorPrefix?: string;
  detail?: string;
}): void {
  safeServerLog("admin", "marketing_public_content_save_result", meta);
}

export function logMarketingPublicContentUnauthorized(meta: { path: string; reason: string }): void {
  safeServerLog("security", "marketing_public_content_edit_unauthorized", meta);
}

export function logMarketingPublicContentOverrideLoadFailure(meta: { detail: string }): void {
  safeServerLog("admin", "marketing_public_content_override_load_failed", meta);
}
