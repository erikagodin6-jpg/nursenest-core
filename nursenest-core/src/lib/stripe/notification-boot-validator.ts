import "server-only";

/**
 * Boot-time validation for subscription notification env vars.
 *
 * Call once from `instrumentation.ts` (Node.js runtime) so missing vars surface
 * immediately in deploy logs rather than silently at the first real payment.
 *
 * Does NOT throw — boot should not fail due to missing notification config,
 * but the errors must be visible in production logs.
 */

let _validated = false;

export function validateNotificationEnvVarsOnBoot(): void {
  if (_validated) return;
  _validated = true;

  const missing: string[] = [];
  const warnings: string[] = [];

  // ── Critical — without these, ALL notifications are silent ───────────────
  if (!process.env.STRIPE_WEBHOOK_SECRET?.trim()) {
    missing.push("STRIPE_WEBHOOK_SECRET — webhooks will be rejected (400)");
  }
  if (!process.env.RESEND_API_KEY?.trim()) {
    missing.push("RESEND_API_KEY — ALL transactional emails (admin + subscriber) will silently skip");
  }
  if (!process.env.ADMIN_SUBSCRIPTION_NOTIFY_EMAIL?.trim()) {
    missing.push("ADMIN_SUBSCRIPTION_NOTIFY_EMAIL — admin checkout/invoice notifications will be dropped");
  }

  // ── Recommended — SMS notifications ──────────────────────────────────────
  const hasTwilioSid = Boolean(process.env.TWILIO_ACCOUNT_SID?.trim());
  const hasTwilioToken = Boolean(process.env.TWILIO_AUTH_TOKEN?.trim());
  const hasTwilioFrom = Boolean(
    process.env.TWILIO_SMS_FROM?.trim() || process.env.TWILIO_FROM_NUMBER?.trim(),
  );
  const hasTwilioPhone = Boolean(
    process.env.ADMIN_SUBSCRIPTION_NOTIFY_PHONE?.trim() ||
    process.env.ADMIN_SMS_TO_NUMBER?.trim() ||
    process.env.REVENUE_ALERT_SMS_TO?.trim(),
  );

  if (hasTwilioSid || hasTwilioToken || hasTwilioFrom || hasTwilioPhone) {
    // Twilio is partially configured — check for incomplete setup
    if (!hasTwilioSid) warnings.push("TWILIO_ACCOUNT_SID missing — SMS will not send");
    if (!hasTwilioToken) warnings.push("TWILIO_AUTH_TOKEN missing — SMS will not send");
    if (!hasTwilioFrom) warnings.push("TWILIO_SMS_FROM (or TWILIO_FROM_NUMBER) missing — SMS will not send");
    if (!hasTwilioPhone) warnings.push(
      "No SMS recipient configured — set ADMIN_SUBSCRIPTION_NOTIFY_PHONE, ADMIN_SMS_TO_NUMBER, or REVENUE_ALERT_SMS_TO",
    );
  }

  // ── Emit ─────────────────────────────────────────────────────────────────
  if (missing.length > 0) {
    console.error(
      `[NurseNest][CRITICAL] ${missing.length} critical notification env var(s) missing at boot. Revenue events may be silent.`,
      {
        missing,
        hint: "Set these in DigitalOcean App Platform > App Settings > Environment Variables",
      },
    );
  }

  for (const w of warnings) {
    console.warn(`[NurseNest][WARN] Notification config: ${w}`);
  }

  if (missing.length === 0 && warnings.length === 0) {
    console.log("[NurseNest] Notification env vars: all critical vars present.");
  }
}
