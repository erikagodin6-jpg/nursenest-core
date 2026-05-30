import "server-only";

import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { htmlEmailShell, sendTransactionalEmailHtml } from "@/lib/email/resend-transactional";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const LOG_SCOPE = "revenue_alerts";
export const REVENUE_ALERT_LOG_KIND = "revenue_alert";

export type RevenueAlertEventType =
  | "new_subscription"
  | "trial_started"
  | "trial_converted"
  | "subscription_renewal"
  | "failed_payment"
  | "payment_method_expiring"
  | "subscription_cancelled"
  | "refund_issued"
  | "chargeback_initiated"
  | "chargeback_won"
  | "chargeback_lost"
  | "institutional_inquiry"
  | "enterprise_inquiry"
  | "affiliate_conversion"
  | "coupon_redemption"
  | "high_value_purchase"
  | "notification_service_failure"
  | "test";

export type RevenueAlertPayload = {
  eventType: RevenueAlertEventType;
  subject: string;
  sms: string;
  occurredAt?: Date;
  userId?: string | null;
  stripeEventId?: string | null;
  stripeEventType?: string | null;
  tier?: string | null;
  planLength?: string | null;
  country?: string | null;
  provinceOrState?: string | null;
  amountCents?: number | null;
  currency?: string | null;
  trialOrDirect?: string | null;
  referralSource?: string | null;
  marketingAttribution?: string | null;
  failureReason?: string | null;
  recoveryStatus?: string | null;
  cancellationReason?: string | null;
  timeAsSubscriber?: string | null;
  totalRevenueCents?: number | null;
  metadata?: Record<string, unknown>;
};

type ChannelResult = {
  status: "sent" | "failed" | "skipped";
  detail?: string;
};

export type RevenueAlertSendResult = {
  delivered: boolean;
  channels: {
    email: ChannelResult;
    sms: ChannelResult;
    adminDashboard: ChannelResult;
    discord: ChannelResult;
    slack: ChannelResult;
  };
  auditLogId: string | null;
};

function money(amountCents: number | null | undefined, currency: string | null | undefined): string {
  if (typeof amountCents !== "number") return "—";
  const cur = (currency ?? "usd").toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: cur }).format(amountCents / 100);
  } catch {
    return `${(amountCents / 100).toFixed(2)} ${cur}`;
  }
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function ownerEmail(): string | null {
  return process.env.REVENUE_ALERT_EMAIL?.trim() || process.env.ADMIN_SUBSCRIPTION_NOTIFY_EMAIL?.trim() || null;
}

function ownerPhone(): string | null {
  return (
    process.env.REVENUE_ALERT_SMS_TO?.trim() ||
    process.env.ADMIN_SUBSCRIPTION_NOTIFY_PHONE?.trim() ||
    process.env.ADMIN_SMS_TO_NUMBER?.trim() ||
    null
  );
}

export function revenueAlertHealthStatus(env: Record<string, string | undefined> = process.env): {
  stripeWebhookConfigured: boolean;
  emailConfigured: boolean;
  smsConfigured: boolean;
  discordConfigured: boolean;
  slackConfigured: boolean;
  missingCritical: string[];
} {
  const missingCritical: string[] = [];
  if (!env.STRIPE_WEBHOOK_SECRET?.trim()) missingCritical.push("STRIPE_WEBHOOK_SECRET");
  if (!(env.REVENUE_ALERT_EMAIL?.trim() || env.ADMIN_SUBSCRIPTION_NOTIFY_EMAIL?.trim())) {
    missingCritical.push("REVENUE_ALERT_EMAIL or ADMIN_SUBSCRIPTION_NOTIFY_EMAIL");
  }
  return {
    stripeWebhookConfigured: Boolean(env.STRIPE_WEBHOOK_SECRET?.trim()),
    emailConfigured: Boolean(env.REVENUE_ALERT_EMAIL?.trim() || env.ADMIN_SUBSCRIPTION_NOTIFY_EMAIL?.trim()),
    smsConfigured: Boolean(
      (env.REVENUE_ALERT_SMS_TO?.trim() || env.ADMIN_SUBSCRIPTION_NOTIFY_PHONE?.trim() || env.ADMIN_SMS_TO_NUMBER?.trim()) &&
        env.TWILIO_ACCOUNT_SID?.trim() &&
        env.TWILIO_AUTH_TOKEN?.trim() &&
        (env.TWILIO_SMS_FROM?.trim() || env.TWILIO_FROM_NUMBER?.trim()),
    ),
    discordConfigured: Boolean(env.REVENUE_ALERT_DISCORD_WEBHOOK_URL?.trim() || env.DISCORD_WEBHOOK_URL?.trim()),
    slackConfigured: Boolean(env.REVENUE_ALERT_SLACK_WEBHOOK_URL?.trim() || env.SLACK_WEBHOOK_URL?.trim()),
    missingCritical,
  };
}

function alertLines(input: RevenueAlertPayload): string[] {
  return [
    `Event: ${input.eventType}`,
    `Timestamp: ${(input.occurredAt ?? new Date()).toISOString()}`,
    `Subscription tier: ${input.tier ?? "—"}`,
    `Plan length: ${input.planLength ?? "—"}`,
    `Country: ${input.country ?? "—"}`,
    `Province/State: ${input.provinceOrState ?? "—"}`,
    `Payment amount: ${money(input.amountCents, input.currency)}`,
    `Currency: ${(input.currency ?? "—").toUpperCase()}`,
    `Trial or direct purchase: ${input.trialOrDirect ?? "—"}`,
    `Referral source: ${input.referralSource ?? "—"}`,
    `Marketing attribution: ${input.marketingAttribution ?? "—"}`,
    `User ID: ${input.userId ?? "—"}`,
    `Failure reason: ${input.failureReason ?? "—"}`,
    `Recovery status: ${input.recoveryStatus ?? "—"}`,
    `Cancellation reason: ${input.cancellationReason ?? "—"}`,
    `Time as subscriber: ${input.timeAsSubscriber ?? "—"}`,
    `Total revenue generated: ${money(input.totalRevenueCents, input.currency)}`,
    `Stripe event: ${input.stripeEventId ?? "—"}${input.stripeEventType ? ` (${input.stripeEventType})` : ""}`,
  ];
}

function emailHtml(input: RevenueAlertPayload): string {
  return `<pre style="white-space:pre-wrap;font-family:system-ui,monospace;font-size:14px;">${escapeHtml(
    alertLines(input).join("\n"),
  )}</pre>`;
}

async function sendSms(body: string): Promise<ChannelResult> {
  const to = ownerPhone();
  if (!to) return { status: "skipped", detail: "no_sms_recipient" };
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_SMS_FROM?.trim() || process.env.TWILIO_FROM_NUMBER?.trim();
  if (!sid || !token || !from) return { status: "skipped", detail: "twilio_not_configured" };
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const params = new URLSearchParams({ To: to, From: from, Body: body.slice(0, 1500) });
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    if (!res.ok) return { status: "failed", detail: `twilio_http_${res.status}` };
    return { status: "sent" };
  } catch (e) {
    return { status: "failed", detail: e instanceof Error ? e.message.slice(0, 180) : "sms_network_error" };
  }
}

async function sendWebhook(url: string | null, body: string, label: "discord" | "slack"): Promise<ChannelResult> {
  if (!url) return { status: "skipped", detail: `${label}_not_configured` };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: body, content: body }),
    });
    if (!res.ok) return { status: "failed", detail: `${label}_http_${res.status}` };
    return { status: "sent" };
  } catch (e) {
    return { status: "failed", detail: e instanceof Error ? e.message.slice(0, 180) : `${label}_network_error` };
  }
}

async function resolveAuditUserId(inputUserId: string | null | undefined): Promise<string | null> {
  if (inputUserId?.trim()) return inputUserId.trim();
  const envUser = process.env.REVENUE_ALERT_AUDIT_USER_ID?.trim();
  if (envUser) return envUser;
  const admin = await prisma.user.findFirst({
    where: { role: { in: [UserRole.SUPER_ADMIN, UserRole.ADMIN] } },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  return admin?.id ?? null;
}

async function writeAuditLog(input: RevenueAlertPayload, result: Omit<RevenueAlertSendResult, "auditLogId">): Promise<string | null> {
  const userId = await resolveAuditUserId(input.userId);
  if (!userId) {
    safeServerLog(LOG_SCOPE, "audit_log_skipped_no_user", { eventType: input.eventType, severity: "error" });
    return null;
  }
  const row = await prisma.emailNotificationLog.create({
    data: {
      userId,
      kind: REVENUE_ALERT_LOG_KIND,
      meta: {
        event: input.eventType,
        timestamp: (input.occurredAt ?? new Date()).toISOString(),
        subject: input.subject,
        unread: true,
        resolved: false,
        deliveryStatus: result.delivered ? "delivered" : "failed",
        emailStatus: result.channels.email.status,
        smsStatus: result.channels.sms.status,
        adminDashboardStatus: result.channels.adminDashboard.status,
        discordStatus: result.channels.discord.status,
        slackStatus: result.channels.slack.status,
        retryStatus: result.delivered ? "not_required" : "stripe_retry_or_manual_followup_required",
        errorMessages: Object.entries(result.channels)
          .filter(([, channel]) => channel.status === "failed")
          .map(([channel, value]) => `${channel}:${value.detail ?? "failed"}`),
        stripeEventId: input.stripeEventId ?? null,
        stripeEventType: input.stripeEventType ?? null,
        tier: input.tier ?? null,
        planLength: input.planLength ?? null,
        country: input.country ?? null,
        provinceOrState: input.provinceOrState ?? null,
        amountCents: input.amountCents ?? null,
        currency: input.currency ?? null,
        trialOrDirect: input.trialOrDirect ?? null,
        referralSource: input.referralSource ?? null,
        marketingAttribution: input.marketingAttribution ?? null,
        failureReason: input.failureReason ?? null,
        recoveryStatus: input.recoveryStatus ?? null,
        cancellationReason: input.cancellationReason ?? null,
        timeAsSubscriber: input.timeAsSubscriber ?? null,
        totalRevenueCents: input.totalRevenueCents ?? null,
        metadata: input.metadata ?? {},
      },
    },
  });
  return row.id;
}

export async function sendRevenueAlert(input: RevenueAlertPayload): Promise<RevenueAlertSendResult> {
  const emailTo = ownerEmail();
  const email = emailTo
    ? await sendTransactionalEmailHtml({
        to: emailTo,
        subject: input.subject,
        html: htmlEmailShell(input.subject, emailHtml(input)),
        text: alertLines(input).join("\n"),
      }).then((r) => (r.ok ? ({ status: "sent" } as const) : ({ status: "failed", detail: r.skippedReason } as const)))
    : ({ status: "skipped", detail: "no_email_recipient" } as const);
  const sms = await sendSms(input.sms);
  const discord = await sendWebhook(
    process.env.REVENUE_ALERT_DISCORD_WEBHOOK_URL?.trim() || process.env.DISCORD_WEBHOOK_URL?.trim() || null,
    `${input.subject}\n${input.sms}`,
    "discord",
  );
  const slack = await sendWebhook(
    process.env.REVENUE_ALERT_SLACK_WEBHOOK_URL?.trim() || process.env.SLACK_WEBHOOK_URL?.trim() || null,
    `${input.subject}\n${input.sms}`,
    "slack",
  );

  const channels = {
    email,
    sms,
    adminDashboard: { status: "sent" as const },
    discord,
    slack,
  };
  const delivered = Object.values(channels).some((channel) => channel.status === "sent");
  const base = { delivered, channels };
  const auditLogId = await writeAuditLog(input, base).catch((e) => {
    safeServerLog(LOG_SCOPE, "audit_log_failed", {
      eventType: input.eventType,
      message: e instanceof Error ? e.message.slice(0, 180) : "unknown",
      severity: "error",
    });
    return null;
  });

  if (!delivered) {
    safeServerLog(LOG_SCOPE, "no_channel_delivered", {
      eventType: input.eventType,
      stripeEventIdPrefix: input.stripeEventId?.slice(0, 12),
      severity: "error",
    });
  }

  return { ...base, auditLogId };
}

export async function sendRevenueAlertOrThrow(input: RevenueAlertPayload): Promise<RevenueAlertSendResult> {
  const result = await sendRevenueAlert(input);
  if (!result.delivered) throw new Error(`revenue_alert_delivery_failed:${input.eventType}`);
  return result;
}

export function buildRevenueAlertSubject(eventType: RevenueAlertEventType): string {
  switch (eventType) {
    case "new_subscription":
      return "🎉 New NurseNest Subscription";
    case "trial_converted":
      return "🚀 Trial Converted To Paid";
    case "failed_payment":
      return "⚠️ Failed Payment";
    case "subscription_cancelled":
      return "⚠️ Subscription Cancelled";
    case "subscription_renewal":
      return "NurseNest Subscription Renewal";
    case "trial_started":
      return "NurseNest Trial Started";
    case "refund_issued":
      return "NurseNest Refund Issued";
    case "chargeback_initiated":
      return "NurseNest Chargeback Initiated";
    case "chargeback_won":
      return "NurseNest Chargeback Won";
    case "chargeback_lost":
      return "NurseNest Chargeback Lost";
    case "payment_method_expiring":
      return "NurseNest Payment Method Expiring";
    default:
      return `NurseNest Revenue Alert: ${eventType.replaceAll("_", " ")}`;
  }
}
