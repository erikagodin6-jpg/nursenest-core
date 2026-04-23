import { isSentryServerRuntimeEnabled } from "@/lib/observability/sentry-flags";
import { importSentryNextjs } from "@/lib/observability/sentry-nextjs-dynamic";
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
  | "signup_captcha_failed"
  | "admin_learner_qa_started"
  | "admin_learner_qa_cleared";

/**
 * Lightweight product/system signals: stderr + optional Sentry breadcrumb (no PII).
 */
export function productEvent(name: ProductEventName, meta?: SafeLogMeta): void {
  safeServerLog("product_event", name, meta);
  if (!isSentryServerRuntimeEnabled()) return;
  void importSentryNextjs()
    .then((Sentry) => {
      Sentry.addBreadcrumb({
        category: "product",
        message: name,
        level: "info",
        data: (meta ?? {}) as Record<string, unknown>,
      });
    })
    .catch(() => {});
}
