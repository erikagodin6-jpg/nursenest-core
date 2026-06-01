import { NextResponse } from "next/server";
import { revenueAlertHealthStatus } from "@/lib/revenue-alerts/revenue-alerts";
import { adminPaidSubscriptionSmsEnvStatus } from "@/lib/notifications/admin-paid-subscription-sms";

export const dynamic = "force-dynamic";

/**
 * GET /api/subscriptions/notification-health
 *
 * Returns a structured status of every notification channel used by the subscription
 * notification pipeline. Safe to poll from monitoring dashboards.
 *
 * Does not require auth — returns only config status (no secrets, no user data).
 * Protected in production by the admin IP allowlist via middleware/reverse proxy.
 */
export async function GET(): Promise<NextResponse> {
  const revenueAlertStatus = revenueAlertHealthStatus(process.env);
  const smsEnvStatus = adminPaidSubscriptionSmsEnvStatus(process.env);

  const checkoutNotifyEmail = Boolean(process.env.ADMIN_SUBSCRIPTION_NOTIFY_EMAIL?.trim());
  const checkoutNotifyPhone = Boolean(process.env.ADMIN_SUBSCRIPTION_NOTIFY_PHONE?.trim());
  const resendApiKey = Boolean(process.env.RESEND_API_KEY?.trim());
  const stripeWebhookSecret = Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim());
  const includeTestMode = Boolean(process.env.ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE?.trim());

  const allCriticalPresent =
    stripeWebhookSecret &&
    resendApiKey &&
    (checkoutNotifyEmail || revenueAlertStatus.emailConfigured);

  const payload = {
    ok: allCriticalPresent,
    checkedAt: new Date().toISOString(),
    channels: {
      email: {
        configured: resendApiKey && (checkoutNotifyEmail || revenueAlertStatus.emailConfigured),
        resendApiKey,
        adminNotifyEmail: checkoutNotifyEmail,
        revenueAlertEmail: Boolean(process.env.REVENUE_ALERT_EMAIL?.trim()),
        detail: !resendApiKey
          ? "RESEND_API_KEY missing — all emails will silently skip"
          : !checkoutNotifyEmail && !process.env.REVENUE_ALERT_EMAIL?.trim()
            ? "No recipient configured — set ADMIN_SUBSCRIPTION_NOTIFY_EMAIL or REVENUE_ALERT_EMAIL"
            : "ok",
      },
      sms: {
        configured: revenueAlertStatus.smsConfigured,
        adminNotifyPhone: checkoutNotifyPhone,
        twilioAccountSid: Boolean(process.env.TWILIO_ACCOUNT_SID?.trim()),
        twilioAuthToken: Boolean(process.env.TWILIO_AUTH_TOKEN?.trim()),
        twilioFrom: Boolean(process.env.TWILIO_SMS_FROM?.trim() || process.env.TWILIO_FROM_NUMBER?.trim()),
        legacySmsPath: smsEnvStatus,
        detail: revenueAlertStatus.smsConfigured ? "ok" : "Twilio not fully configured — SMS will be skipped",
      },
      adminDashboard: {
        configured: true,
        detail: "emailNotificationLog DB write always attempted — requires DB connectivity",
      },
      discord: {
        configured: revenueAlertStatus.discordConfigured,
        detail: revenueAlertStatus.discordConfigured
          ? "ok"
          : "Set REVENUE_ALERT_DISCORD_WEBHOOK_URL to enable",
      },
      slack: {
        configured: revenueAlertStatus.slackConfigured,
        detail: revenueAlertStatus.slackConfigured
          ? "ok"
          : "Set REVENUE_ALERT_SLACK_WEBHOOK_URL to enable",
      },
    },
    webhook: {
      stripeWebhookSecret,
      detail: stripeWebhookSecret
        ? "ok"
        : "STRIPE_WEBHOOK_SECRET missing — all webhooks will be rejected with 400",
    },
    testMode: {
      included: includeTestMode,
      detail: includeTestMode
        ? "Test-mode Stripe events will fire notifications"
        : "Set ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE=1 to receive test-mode notifications",
    },
    missingCritical: revenueAlertStatus.missingCritical,
  };

  return NextResponse.json(payload, {
    status: allCriticalPresent ? 200 : 503,
    headers: {
      "Cache-Control": "no-store",
      "X-Notification-Health": allCriticalPresent ? "ok" : "degraded",
    },
  });
}
