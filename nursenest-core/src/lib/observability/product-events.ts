import * as Sentry from "@sentry/nextjs";
import { safeServerLog, type SafeLogMeta } from "@/lib/observability/safe-server-log";

export type ProductEventName =
  | "exam_start"
  | "exam_submit"
  | "exam_pool_empty"
  | "exam_session_save"
  | "entitlement_resolve_failed"
  | "stripe_webhook_ok"
  | "stripe_webhook_failed"
  | "cron_jobs_batch"
  | "signup_ok"
  | "signup_rate_limited"
  | "signup_captcha_failed";

/**
 * Lightweight product/system signals: stderr + optional Sentry breadcrumb (no PII).
 */
export function productEvent(name: ProductEventName, meta?: SafeLogMeta): void {
  safeServerLog("product_event", name, meta);
  Sentry.addBreadcrumb({
    category: "product",
    message: name,
    level: "info",
    data: (meta ?? {}) as Record<string, unknown>,
  });
}
