import { getResendClient } from "./resend-client";
import { getTwilioClient, getTwilioFromPhoneNumber } from "./twilio-client";

const ADMIN_EMAIL = "erikagodin6@gmail.com";
const ADMIN_PHONE = "+16132198982";

interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  adminEmail: string;
  adminPhone: string;
  notifyOnNewSubscription: boolean;
  notifyOnCancellation: boolean;
  notifyOnPaymentFailed: boolean;
  notifyOnLifetimePurchase: boolean;
  notifyOnTrialStart: boolean;
  notifyOnCriticalIncident: boolean;
  notifyOnWarningIncident: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  emailEnabled: true,
  smsEnabled: true,
  adminEmail: ADMIN_EMAIL,
  adminPhone: ADMIN_PHONE,
  notifyOnNewSubscription: true,
  notifyOnCancellation: true,
  notifyOnPaymentFailed: true,
  notifyOnLifetimePurchase: true,
  notifyOnTrialStart: true,
  notifyOnCriticalIncident: true,
  notifyOnWarningIncident: false,
};

export async function getNotificationSettings(pool: any): Promise<NotificationSettings> {
  try {
    const result = await pool.query(
      `SELECT value FROM admin_settings WHERE key = 'notification_settings'`
    );
    if (result.rows.length > 0) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(result.rows[0].value) };
    }
  } catch (e: any) {
    console.warn("[Notifications] Failed to load settings:", e.message);
  }
  return DEFAULT_SETTINGS;
}

export async function saveNotificationSettings(pool: any, settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
  const current = await getNotificationSettings(pool);
  const merged = { ...current, ...settings };
  await pool.query(
    `INSERT INTO admin_settings (key, value, updated_at) VALUES ('notification_settings', $1, NOW())
     ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()`,
    [JSON.stringify(merged)]
  );
  return merged;
}

export type NotificationEvent =
  | "new_subscription"
  | "subscription_cancelled"
  | "payment_failed"
  | "lifetime_purchase"
  | "trial_started"
  | "test"
  | "reliability_alert"
  | "payment_failure"
  | "service_down"
  | "memory_critical"
  | "synthetic_test_failure"
  | "content_integrity_failure"
  | "emergency_mode_activated"
  | "reliability_warning";

interface NotificationPayload {
  event: NotificationEvent;
  stripeEventId?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  tier?: string;
  amount?: string;
  currency?: string;
  subscriptionId?: string;
  details?: string;
  alertType?: string;
  alertSeverity?: string;
}

export function shouldNotify(settings: NotificationSettings, event: NotificationEvent, payload?: NotificationPayload): boolean {
  switch (event) {
    case "new_subscription": return settings.notifyOnNewSubscription;
    case "subscription_cancelled": return settings.notifyOnCancellation;
    case "payment_failed":
    case "payment_failure": return settings.notifyOnPaymentFailed;
    case "lifetime_purchase": return settings.notifyOnLifetimePurchase;
    case "trial_started": return settings.notifyOnTrialStart;
    case "reliability_alert": {
      const sev = payload?.alertSeverity;
      if (sev === "warning") return settings.notifyOnWarningIncident;
      return settings.notifyOnCriticalIncident;
    }
    case "service_down":
    case "memory_critical":
    case "emergency_mode_activated": return settings.notifyOnCriticalIncident;
    case "synthetic_test_failure":
    case "content_integrity_failure": return settings.notifyOnCriticalIncident;
    case "reliability_warning": return settings.notifyOnWarningIncident;
    default: return false;
  }
}

function formatEventTitle(event: NotificationEvent, alertType?: string): string {
  switch (event) {
    case "new_subscription": return "New Subscription";
    case "subscription_cancelled": return "Subscription Cancelled";
    case "payment_failed":
    case "payment_failure": return "Payment Failed";
    case "lifetime_purchase": return "Lifetime Purchase";
    case "trial_started": return "New Trial Started";
    case "service_down": return "Service Down";
    case "memory_critical": return "Memory Critical";
    case "synthetic_test_failure": return "Synthetic Test Failure";
    case "content_integrity_failure": return "Content Integrity Failure";
    case "emergency_mode_activated": return "Emergency Mode Activated";
    case "reliability_warning": return "Reliability Warning";
    case "reliability_alert": return `Reliability Alert: ${alertType || "System Issue"}`;
    case "test": return "Test Notification";
    case "service_down": return "Service Down";
    case "synthetic_test_failure": return "Synthetic Test Failure";
    case "content_integrity_failure": return "Content Integrity Failure";
    case "reliability_warning": return "Reliability Warning";
    default: return "Notification";
  }
}

const ALERT_CATEGORY_CONFIG: Record<string, { color: string; icon: string; severity: string }> = {
  payment_failed: { color: "#ef4444", icon: "💳", severity: "critical" },
  payment_failure: { color: "#ef4444", icon: "💳", severity: "critical" },
  service_down: { color: "#dc2626", icon: "🔴", severity: "critical" },
  memory_critical: { color: "#b91c1c", icon: "🧠", severity: "critical" },
  synthetic_test_failure: { color: "#ea580c", icon: "🧪", severity: "warning" },
  content_integrity_failure: { color: "#d97706", icon: "📋", severity: "warning" },
  emergency_mode_activated: { color: "#991b1b", icon: "🚨", severity: "critical" },
  reliability_warning: { color: "#f59e0b", icon: "⚠️", severity: "warning" },
  reliability_alert: { color: "#dc2626", icon: "🔔", severity: "critical" },
  new_subscription: { color: "#10b981", icon: "✅", severity: "info" },
  subscription_cancelled: { color: "#f59e0b", icon: "❌", severity: "warning" },
  lifetime_purchase: { color: "#8b5cf6", icon: "⭐", severity: "info" },
  trial_started: { color: "#3b82f6", icon: "🎯", severity: "info" },
  test: { color: "#6366f1", icon: "🔧", severity: "info" },
  quarantine_event: { color: "#d97706", icon: "🔒", severity: "warning" },
  circuit_breaker_trip: { color: "#ea580c", icon: "⚡", severity: "warning" },
  high_error_rate: { color: "#dc2626", icon: "📈", severity: "critical" },
  health_check_failure: { color: "#ef4444", icon: "❤️", severity: "critical" },
  memory_pressure: { color: "#b91c1c", icon: "🧠", severity: "warning" },
  database_slow: { color: "#ea580c", icon: "🗄️", severity: "warning" },
  emergency_mode: { color: "#991b1b", icon: "🚨", severity: "critical" },
};

function formatEmailBody(payload: NotificationPayload): string {
  const title = formatEventTitle(payload.event, payload.alertType);
  const time = new Date().toLocaleString("en-CA", { timeZone: "America/Toronto" });

  let details = "";
  if (payload.userName) details += `<tr><td style="padding:4px 8px;color:#64748b;">Student</td><td style="padding:4px 8px;">${payload.userName}</td></tr>`;
  if (payload.userEmail) details += `<tr><td style="padding:4px 8px;color:#64748b;">Email</td><td style="padding:4px 8px;">${payload.userEmail}</td></tr>`;
  if (payload.tier) details += `<tr><td style="padding:4px 8px;color:#64748b;">Tier</td><td style="padding:4px 8px;">${payload.tier.toUpperCase()}</td></tr>`;
  if (payload.amount) details += `<tr><td style="padding:4px 8px;color:#64748b;">Amount</td><td style="padding:4px 8px;">$${payload.amount} ${payload.currency?.toUpperCase() || "CAD"}</td></tr>`;
  if (payload.subscriptionId) details += `<tr><td style="padding:4px 8px;color:#64748b;">Subscription</td><td style="padding:4px 8px;font-size:12px;">${payload.subscriptionId}</td></tr>`;
  if (payload.details) details += `<tr><td style="padding:4px 8px;color:#64748b;">Details</td><td style="padding:4px 8px;">${payload.details}</td></tr>`;

  const categoryConfig = (payload.event === "reliability_alert" && payload.alertType)
    ? (ALERT_CATEGORY_CONFIG[payload.alertType] || ALERT_CATEGORY_CONFIG[payload.event] || null)
    : (ALERT_CATEGORY_CONFIG[payload.event] || ALERT_CATEGORY_CONFIG[payload.alertType || ""] || null);
  const color = categoryConfig?.color || "#6366f1";
  const severityLabel = categoryConfig?.severity || "info";
  const severityBadge = severityLabel === "critical"
    ? `<span style="background:#fee2e2;color:#991b1b;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:bold;">CRITICAL</span>`
    : severityLabel === "warning"
    ? `<span style="background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:bold;">WARNING</span>`
    : `<span style="background:#dbeafe;color:#1e40af;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:bold;">INFO</span>`;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:20px;background:#f8fafc;">
  <div style="max-width:480px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:${color};padding:20px 24px;">
      <h1 style="margin:0;color:white;font-size:18px;">NurseNest</h1>
      <p style="margin:4px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">${title} ${severityBadge}</p>
    </div>
    <div style="padding:24px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:4px 8px;color:#64748b;">Time</td><td style="padding:4px 8px;">${time}</td></tr>
        ${details}
      </table>
    </div>
    <div style="padding:12px 24px;background:#f8fafc;text-align:center;">
      <a href="https://nursenest.ca/admin" style="color:${color};font-size:13px;text-decoration:none;">View Admin Dashboard</a>
    </div>
  </div>
</body>
</html>`;
}

function formatSmsBody(payload: NotificationPayload): string {
  const title = formatEventTitle(payload.event, payload.alertType);
  const parts = [`NurseNest: ${title}`];
  if (payload.userName) parts.push(`Student: ${payload.userName}`);
  if (payload.tier) parts.push(`Tier: ${payload.tier.toUpperCase()}`);
  if (payload.amount) parts.push(`Amount: $${payload.amount} ${payload.currency?.toUpperCase() || "CAD"}`);
  if (payload.details) parts.push(payload.details);
  return parts.join("\n");
}

async function logNotification(
  pool: any,
  payload: NotificationPayload,
  channel: "email" | "sms",
  recipient: string,
  subject: string,
  body: string,
  status: "sent" | "failed",
  errorMessage?: string
) {
  try {
    await pool.query(
      `INSERT INTO notification_log (event_type, channel, recipient, subject, body, status, error_message, stripe_event_id, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        payload.event,
        channel,
        recipient,
        subject,
        body.substring(0, 2000),
        status,
        errorMessage || null,
        payload.stripeEventId || null,
        JSON.stringify({ userId: payload.userId, tier: payload.tier }),
      ]
    );
  } catch (e: any) {
    console.error("[Notifications] Failed to log notification:", e.message);
  }
}

const recentReliabilityAlerts = new Map<string, number>();
const RELIABILITY_ALERT_COOLDOWN_MS = 15 * 60 * 1000;
const MAX_RELIABILITY_ALERT_ENTRIES = 200;

function stableAlertDedupeKey(payload: NotificationPayload): string {
  const alertType = payload.alertType || payload.event || "unknown";
  const msgNormalized = (payload.details || "")
    .replace(/Time:\s*\d{4}-\d{2}-\d{2}T[\d:.Z]+/g, "")
    .replace(/\d{4}-\d{2}-\d{2}T[\d:.Z]+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 150);
  return `${alertType}:${msgNormalized}`;
}

function isReliabilityAlertDuplicate(payload: NotificationPayload): boolean {
  const key = stableAlertDedupeKey(payload);
  const lastSent = recentReliabilityAlerts.get(key);
  if (lastSent && Date.now() - lastSent < RELIABILITY_ALERT_COOLDOWN_MS) {
    return true;
  }
  recentReliabilityAlerts.set(key, Date.now());
  if (recentReliabilityAlerts.size > MAX_RELIABILITY_ALERT_ENTRIES) {
    const now = Date.now();
    for (const [k, ts] of recentReliabilityAlerts) {
      if (now - ts > RELIABILITY_ALERT_COOLDOWN_MS) recentReliabilityAlerts.delete(k);
    }
  }
  return false;
}

async function isDuplicateForChannel(pool: any, stripeEventId: string, channel: "email" | "sms"): Promise<boolean> {
  if (!stripeEventId) return false;
  try {
    const result = await pool.query(
      `SELECT 1 FROM notification_log WHERE stripe_event_id = $1 AND channel = $2 AND status = 'sent' LIMIT 1`,
      [stripeEventId, channel]
    );
    return result.rows.length > 0;
  } catch {
    return false;
  }
}

async function sendEmail(pool: any, settings: NotificationSettings, payload: NotificationPayload): Promise<void> {
  if (!settings.emailEnabled) return;
  if (payload.stripeEventId && await isDuplicateForChannel(pool, payload.stripeEventId, "email")) {
    console.log(`[Notifications] Skipping duplicate email for ${payload.stripeEventId}`);
    return;
  }
  const subject = `NurseNest: ${formatEventTitle(payload.event, payload.alertType)}`;
  const html = formatEmailBody(payload);
  const to = settings.adminEmail;

  try {
    const { client, fromEmail } = await getResendClient();
    await client.emails.send({
      from: fromEmail || "NurseNest <notifications@nursenest.ca>",
      to: [to],
      subject,
      html,
    });
    console.log(`[Notifications] Email sent: ${payload.event} -> ${to}`);
    await logNotification(pool, payload, "email", to, subject, html, "sent");
  } catch (e: any) {
    console.error(`[Notifications] Email failed: ${e.message}`);
    await logNotification(pool, payload, "email", to, subject, html, "failed", e.message);
  }
}

async function sendSms(pool: any, settings: NotificationSettings, payload: NotificationPayload): Promise<void> {
  if (!settings.smsEnabled) return;
  if (payload.stripeEventId && await isDuplicateForChannel(pool, payload.stripeEventId, "sms")) {
    console.log(`[Notifications] Skipping duplicate SMS for ${payload.stripeEventId}`);
    return;
  }
  const body = formatSmsBody(payload);
  const to = settings.adminPhone;

  try {
    const twilioClient = await getTwilioClient();
    const fromNumber = await getTwilioFromPhoneNumber();
    await twilioClient.messages.create({
      body,
      to,
      from: fromNumber,
    });
    console.log(`[Notifications] SMS sent: ${payload.event} -> ${to}`);
    await logNotification(pool, payload, "sms", to, "", body, "sent");
  } catch (e: any) {
    console.error(`[Notifications] SMS failed: ${e.message}`);
    await logNotification(pool, payload, "sms", to, "", body, "failed", e.message);
  }
}

export async function sendAdminNotification(pool: any, payload: NotificationPayload): Promise<void> {
  try {
    const settings = await getNotificationSettings(pool);
    if (!shouldNotify(settings, payload.event, payload)) {
      console.log(`[Notifications] Event ${payload.event} disabled, skipping`);
      return;
    }

    const isReliabilityEvent = ["reliability_alert", "service_down", "synthetic_test_failure", "content_integrity_failure", "reliability_warning"].includes(payload.event);
    if (isReliabilityEvent) {
      if (isReliabilityAlertDuplicate(payload)) {
        console.log(`[Notifications] Suppressed duplicate reliability alert within cooldown`);
        return;
      }
    }

    await Promise.allSettled([
      sendEmail(pool, settings, payload),
      sendSms(pool, settings, payload),
    ]);
  } catch (e: any) {
    console.error(`[Notifications] Error sending notification:`, e.message);
  }
}

export async function sendTestNotification(pool: any, channel?: "email" | "sms"): Promise<{ success: boolean; error?: string }> {
  const settings = await getNotificationSettings(pool);
  const payload: NotificationPayload = {
    event: "test",
    userName: "Test Student",
    userEmail: "test@example.com",
    tier: "RN",
    amount: "29.99",
    currency: "CAD",
    details: "This is a test notification from NurseNest admin.",
  };

  try {
    if (!channel || channel === "email") {
      await sendEmail(pool, { ...settings, emailEnabled: true }, payload);
    }
    if (!channel || channel === "sms") {
      await sendSms(pool, { ...settings, smsEnabled: true }, payload);
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
