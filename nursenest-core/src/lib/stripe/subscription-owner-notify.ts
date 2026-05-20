import "server-only";

import type Stripe from "stripe";
import { Prisma, SubscriptionStatus, type TierCode } from "@prisma/client";
import { after } from "next/server";
import { prisma } from "@/lib/db";
import { sendTransactionalEmailHtml, htmlEmailShell } from "@/lib/email/resend-transactional";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { firstSubscriptionPriceId } from "@/lib/stripe/stripe-subscription-field-map";
import {
  shouldOwnerNotifyPaidSubscriptionCheckout,
  type OwnerCheckoutNotifyEligibilityInput,
} from "@/lib/stripe/subscription-owner-notify-eligibility";

const LOG_SCOPE = "stripe_owner_subscription_notify";

export type { OwnerCheckoutNotifyEligibilityInput };
export { shouldOwnerNotifyPaidSubscriptionCheckout };

export async function claimStripeOwnerPaidSubscriptionNotifyOrDuplicate(eventId: string): Promise<"claimed" | "duplicate"> {
  try {
    await prisma.stripeOwnerPaidSubscriptionNotify.create({ data: { id: eventId } });
    return "claimed";
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return "duplicate";
    }
    throw e;
  }
}

function formatMoney(amount: number, currency: string | null | undefined): string {
  const cur = (currency ?? "usd").toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: cur }).format(amount / 100);
  } catch {
    return `${(amount / 100).toFixed(2)} ${cur}`;
  }
}

async function resolveCustomerEmail(stripe: Stripe, session: Stripe.Checkout.Session): Promise<string | null> {
  const direct =
    session.customer_email ??
    (session.customer_details && typeof session.customer_details === "object"
      ? (session.customer_details as { email?: string | null }).email
      : null) ??
    null;
  if (direct && typeof direct === "string" && direct.trim()) return direct.trim();
  const custId = typeof session.customer === "string" ? session.customer : session.customer?.id;
  if (!custId) return null;
  try {
    const c = await stripe.customers.retrieve(custId);
    if (c.deleted || !("email" in c)) return null;
    const em = c.email;
    return typeof em === "string" && em.trim() ? em.trim() : null;
  } catch {
    return null;
  }
}

async function sendTwilioSmsIfConfigured(to: string, body: string): Promise<{ ok: boolean; skippedReason?: string }> {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_SMS_FROM?.trim() || process.env.TWILIO_FROM_NUMBER?.trim();
  if (!sid || !token || !from) {
    safeServerLog(LOG_SCOPE, "sms_skipped", { reason: "twilio_not_configured" });
    return { ok: false, skippedReason: "twilio_not_configured" };
  }
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const params = new URLSearchParams({ To: to, From: from, Body: body.slice(0, 1500) });
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      safeServerLog(LOG_SCOPE, "sms_failed", { status: res.status, snippet: t.slice(0, 160) });
      return { ok: false, skippedReason: `http_${res.status}` };
    }
    return { ok: true };
  } catch (e) {
    safeServerLog(LOG_SCOPE, "sms_error", { message: e instanceof Error ? e.message.slice(0, 200) : String(e) });
    return { ok: false, skippedReason: "network" };
  }
}

type ScheduleArgs = {
  stripe: Stripe;
  event: Stripe.Event;
  session: Stripe.Checkout.Session;
  userId: string;
  subscriptionId: string;
  customerId: string;
  stripeSubscription: Stripe.Subscription | null;
  stripeSubStatus: Stripe.Subscription.Status | null;
  statusForDb: SubscriptionStatus;
  planTierLabel: string | null;
  planCountryLabel: string | null;
  billingRegionSlug: string | undefined;
  correlation: string;
  planTier: TierCode | null | undefined;
};

/**
 * Queues internal owner email/SMS after the HTTP webhook response (Next `after`), when checkout is a paid active subscription.
 * Never throws to callers; failures are logged only.
 */
export function scheduleOwnerPaidSubscriptionCheckoutNotificationsIfEligible(args: ScheduleArgs): void {
  const amountTotal = typeof args.session.amount_total === "number" ? args.session.amount_total : null;
  if (
    !shouldOwnerNotifyPaidSubscriptionCheckout({
      sessionMode: args.session.mode,
      amountTotal,
      statusForDb: args.statusForDb,
      stripeSubStatus: args.stripeSubStatus,
      stripeSubscription: args.stripeSubscription,
      eventLivemode: args.event.livemode,
      planTier: args.planTier,
    })
  ) {
    safeServerLog(LOG_SCOPE, "checkout_notify_skipped_ineligible", {
      eventIdPrefix: args.event.id.slice(0, 12),
      correlation: args.correlation,
      stripeSubStatus: args.stripeSubStatus ?? "",
      sessionAmountTotal: amountTotal ?? -1,
      statusForDb: String(args.statusForDb),
      severity: "info",
    });
    return;
  }

  safeServerLog(LOG_SCOPE, "checkout_notify_scheduled", {
    eventIdPrefix: args.event.id.slice(0, 12),
    correlation: args.correlation,
    stripeSubStatus: args.stripeSubStatus ?? "",
    sessionAmountTotal: amountTotal ?? -1,
    subscriptionIdPrefix: args.subscriptionId.slice(0, 14),
    customerIdPrefix: (args.customerId || "").slice(0, 12),
    severity: "info",
  });

  after(async () => {
    try {
      await runOwnerPaidSubscriptionCheckoutNotificationsJob(args, amountTotal!);
    } catch (e) {
      safeServerLog(LOG_SCOPE, "job_unhandled_error", {
        message: e instanceof Error ? e.message.slice(0, 240) : String(e),
        eventIdPrefix: args.event.id.slice(0, 12),
        correlation: args.correlation,
      });
    }
  });
}

async function runOwnerPaidSubscriptionCheckoutNotificationsJob(
  args: ScheduleArgs,
  amountTotal: number,
): Promise<void> {
  const notifyEmail = process.env.ADMIN_SUBSCRIPTION_NOTIFY_EMAIL?.trim();
  const notifyPhone = process.env.ADMIN_SUBSCRIPTION_NOTIFY_PHONE?.trim();

  if (!notifyEmail && !notifyPhone) {
    console.error(
      "[NurseNest][CRITICAL] Paid subscription checkout notification dropped — neither ADMIN_SUBSCRIPTION_NOTIFY_EMAIL nor ADMIN_SUBSCRIPTION_NOTIFY_PHONE is set.",
      {
        eventIdPrefix: args.event.id.slice(0, 12),
        userId: args.userId,
        amountTotal,
        hint: "Set ADMIN_SUBSCRIPTION_NOTIFY_EMAIL in DigitalOcean App Platform environment variables.",
      },
    );
    safeServerLog(LOG_SCOPE, "skipped_no_recipients", {
      severity: "error",
      eventIdPrefix: args.event.id.slice(0, 12),
      hint: "Set ADMIN_SUBSCRIPTION_NOTIFY_EMAIL and/or ADMIN_SUBSCRIPTION_NOTIFY_PHONE",
    });
    return;
  }

  const claim = await claimStripeOwnerPaidSubscriptionNotifyOrDuplicate(args.event.id);
  if (claim === "duplicate") {
    safeServerLog(LOG_SCOPE, "skipped_duplicate_event", { eventIdPrefix: args.event.id.slice(0, 12) });
    return;
  }

  const priceId = args.stripeSubscription ? firstSubscriptionPriceId(args.stripeSubscription) : undefined;
  const price = args.stripeSubscription?.items?.data?.[0]?.price;
  const interval =
    price && typeof price === "object" && "recurring" in price && price.recurring?.interval
      ? String(price.recurring.interval)
      : "—";
  const customerEmail = await resolveCustomerEmail(args.stripe, args.session);
  const currency = args.session.currency ?? "usd";
  const amountLabel = formatMoney(amountTotal, currency);
  const ts = new Date(args.event.created * 1000).toISOString();
  const addr =
    args.session.customer_details && typeof args.session.customer_details === "object"
      ? (args.session.customer_details as { address?: { country?: string | null } | null }).address
      : undefined;
  const addrCountry = addr?.country?.trim();
  const countryHint =
    [args.billingRegionSlug, args.planCountryLabel, addrCountry].filter((x) => Boolean(x && String(x).trim())).join(" · ") ||
    "—";

  const lines = [
    `Paid subscription checkout (Stripe)`,
    ``,
    `Customer email: ${customerEmail ?? "—"}`,
    `User id: ${args.userId}`,
    `Amount: ${amountLabel}`,
    `Billing interval: ${interval}`,
    `Price id: ${priceId ?? "—"}`,
    `Plan tier (metadata/app): ${args.planTierLabel ?? "—"}`,
    `Plan country (metadata/app): ${args.planCountryLabel ?? "—"}`,
    `Region / country hint: ${countryHint}`,
    `Subscription id: ${args.subscriptionId}`,
    `Customer id: ${args.customerId || "—"}`,
    `Stripe event: ${args.event.id} (${args.event.type})`,
    `Livemode: ${args.event.livemode ? "live" : "test"}`,
    `Event time (UTC): ${ts}`,
  ];
  const textBody = lines.join("\n");
  const htmlBody = `<pre style="white-space:pre-wrap;font-family:system-ui,monospace;font-size:14px;">${textBody
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")}</pre>`;

  const smsBody = `NurseNest paid sub: ${amountLabel} ${interval} | ${customerEmail ?? "no email"} | sub ${args.subscriptionId.slice(0, 14)}… | ${args.event.id.slice(0, 16)}…`;

  if (notifyEmail) {
    try {
      const r = await sendTransactionalEmailHtml({
        to: notifyEmail,
        subject: `[NurseNest] Paid subscription — ${amountLabel} (${args.subscriptionId.slice(0, 10)}…)`,
        html: htmlEmailShell("Paid subscription checkout", htmlBody),
        text: textBody,
      });
      if (!r.ok) {
        console.error("[NurseNest][CRITICAL] Admin notification email failed to send after paid subscription checkout.", {
          skippedReason: r.skippedReason,
          to: notifyEmail,
          eventIdPrefix: args.event.id.slice(0, 12),
        });
      }
      safeServerLog(LOG_SCOPE, "email_result", {
        ok: r.ok,
        skippedReason: r.skippedReason,
        eventIdPrefix: args.event.id.slice(0, 12),
      });
    } catch (e) {
      console.error("[NurseNest][CRITICAL] Admin notification email threw during paid subscription checkout.", e);
      safeServerLog(LOG_SCOPE, "email_exception", {
        message: e instanceof Error ? e.message.slice(0, 200) : String(e),
        eventIdPrefix: args.event.id.slice(0, 12),
      });
    }
  } else {
    safeServerLog(LOG_SCOPE, "email_skipped", { reason: "ADMIN_SUBSCRIPTION_NOTIFY_EMAIL unset", severity: "warning" });
  }

  if (notifyPhone) {
    try {
      const r = await sendTwilioSmsIfConfigured(notifyPhone, smsBody);
      safeServerLog(LOG_SCOPE, "sms_result", {
        ok: r.ok,
        skippedReason: r.skippedReason,
        eventIdPrefix: args.event.id.slice(0, 12),
      });
    } catch (e) {
      safeServerLog(LOG_SCOPE, "sms_exception", {
        message: e instanceof Error ? e.message.slice(0, 200) : String(e),
        eventIdPrefix: args.event.id.slice(0, 12),
      });
    }
  } else {
    safeServerLog(LOG_SCOPE, "sms_skipped", { reason: "ADMIN_SUBSCRIPTION_NOTIFY_PHONE unset", severity: "warning" });
  }
}

export type ScheduleInvoicePaymentSucceededArgs = {
  stripe: Stripe;
  event: Stripe.Event;
  invoice: Stripe.Invoice;
  /** Stripe `billing_reason` on the invoice (e.g. `subscription_create`). */
  billingReason: string | null | undefined;
  userId: string | null;
  subscriptionId: string;
  customerId: string | null;
  stripeSubscription: Stripe.Subscription | null;
  subscriptionStatus: string | null;
  planTierLabel: string | null;
  planCountryLabel: string | null;
  billingRegionSlug: string | null;
  correlation: string;
  paymentKind: string;
};

/** Exported for tests — first-cycle invoices can be $0 during trial. */
export function invoiceOwnerNotifyAmountEligible(
  amountPaid: number | null | undefined,
  billingReason: string | null | undefined,
): boolean {
  if (typeof amountPaid !== "number") return false;
  if (amountPaid > 0) return true;
  const br = billingReason?.trim() ?? "";
  return amountPaid === 0 && br === "subscription_create";
}

/**
 * Owner email/SMS after `invoice.payment_succeeded` (first subscription charge path in webhook).
 * Mirrors checkout notify: dedupes by Stripe event id, never throws to webhook handler.
 */
export function scheduleOwnerPaidSubscriptionInvoicePaymentSucceededNotification(args: ScheduleInvoicePaymentSucceededArgs): void {
  if (!args.userId) return;
  const rawPaid = args.invoice.amount_paid;
  if (!invoiceOwnerNotifyAmountEligible(rawPaid, args.billingReason)) {
    safeServerLog(LOG_SCOPE, "invoice_notify_skipped_amount", {
      eventIdPrefix: args.event.id.slice(0, 12),
      correlation: args.correlation,
      amountPaid: typeof rawPaid === "number" ? rawPaid : -1,
      billingReason: (args.billingReason ?? "").slice(0, 40),
      severity: "info",
    });
    return;
  }
  const amountPaid = rawPaid as number;
  if (!args.event.livemode && !shouldIncludeTestModeOwnerNotifies()) return;
  if (args.subscriptionStatus && args.subscriptionStatus !== "active" && args.subscriptionStatus !== "trialing") {
    return;
  }

  safeServerLog(LOG_SCOPE, "invoice_notify_scheduled", {
    eventIdPrefix: args.event.id.slice(0, 12),
    correlation: args.correlation,
    subscriptionIdPrefix: args.subscriptionId.slice(0, 14),
    customerIdPrefix: (args.customerId ?? "").slice(0, 12),
    userIdPrefix: args.userId.slice(0, 8),
    amountPaid,
    billingReason: (args.billingReason ?? "").slice(0, 40),
    severity: "info",
  });

  after(async () => {
    try {
      await runOwnerInvoicePaymentSucceededNotificationsJob(args, amountPaid);
    } catch (e) {
      safeServerLog(LOG_SCOPE, "invoice_job_unhandled_error", {
        message: e instanceof Error ? e.message.slice(0, 240) : String(e),
        eventIdPrefix: args.event.id.slice(0, 12),
        correlation: args.correlation,
      });
    }
  });
}

function shouldIncludeTestModeOwnerNotifies(): boolean {
  const v = process.env.ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

async function runOwnerInvoicePaymentSucceededNotificationsJob(
  args: ScheduleInvoicePaymentSucceededArgs,
  amountPaid: number,
): Promise<void> {
  const userId = args.userId;
  if (!userId) return;

  const notifyEmail = process.env.ADMIN_SUBSCRIPTION_NOTIFY_EMAIL?.trim();
  const notifyPhone = process.env.ADMIN_SUBSCRIPTION_NOTIFY_PHONE?.trim();

  if (!notifyEmail && !notifyPhone) {
    console.error(
      "[NurseNest][CRITICAL] Invoice payment succeeded notification dropped — neither ADMIN_SUBSCRIPTION_NOTIFY_EMAIL nor ADMIN_SUBSCRIPTION_NOTIFY_PHONE is set.",
      {
        eventIdPrefix: args.event.id.slice(0, 12),
        userId,
        amountPaid,
        hint: "Set ADMIN_SUBSCRIPTION_NOTIFY_EMAIL in DigitalOcean App Platform environment variables.",
      },
    );
    safeServerLog(LOG_SCOPE, "invoice_skipped_no_recipients", {
      severity: "error",
      eventIdPrefix: args.event.id.slice(0, 12),
    });
    return;
  }

  const claim = await claimStripeOwnerPaidSubscriptionNotifyOrDuplicate(args.event.id);
  if (claim === "duplicate") {
    safeServerLog(LOG_SCOPE, "invoice_skipped_duplicate_event", { eventIdPrefix: args.event.id.slice(0, 12) });
    return;
  }

  const currency = args.invoice.currency ?? "usd";
  const amountLabel = formatMoney(amountPaid, currency);
  const ts = new Date(args.event.created * 1000).toISOString();
  const lines = [
    `Paid subscription invoice (Stripe) — ${args.paymentKind}`,
    ``,
    `User id: ${userId}`,
    `Amount paid: ${amountLabel}`,
    `Plan tier: ${args.planTierLabel ?? "—"}`,
    `Plan country: ${args.planCountryLabel ?? "—"}`,
    `Region: ${args.billingRegionSlug ?? "—"}`,
    `Subscription id: ${args.subscriptionId}`,
    `Customer id: ${args.customerId ?? "—"}`,
    `Stripe subscription status: ${args.subscriptionStatus ?? "—"}`,
    `Stripe event: ${args.event.id} (${args.event.type})`,
    `Livemode: ${args.event.livemode ? "live" : "test"}`,
    `Event time (UTC): ${ts}`,
  ];
  const textBody = lines.join("\n");
  const htmlBody = `<pre style="white-space:pre-wrap;font-family:system-ui,monospace;font-size:14px;">${textBody
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")}</pre>`;

  const smsBody = `NurseNest invoice paid: ${amountLabel} | user ${userId.slice(0, 8)}… | sub ${args.subscriptionId.slice(0, 12)}…`;

  if (notifyEmail) {
    try {
      const r = await sendTransactionalEmailHtml({
        to: notifyEmail,
        subject: `[NurseNest] Subscription invoice paid — ${amountLabel} (${args.subscriptionId.slice(0, 10)}…)`,
        html: htmlEmailShell("Subscription invoice paid", htmlBody),
        text: textBody,
      });
      safeServerLog(LOG_SCOPE, "invoice_email_result", {
        ok: r.ok,
        skippedReason: r.skippedReason,
        eventIdPrefix: args.event.id.slice(0, 12),
      });
    } catch (e) {
      safeServerLog(LOG_SCOPE, "invoice_email_exception", {
        message: e instanceof Error ? e.message.slice(0, 200) : String(e),
        eventIdPrefix: args.event.id.slice(0, 12),
      });
    }
  }

  if (notifyPhone) {
    try {
      const r = await sendTwilioSmsIfConfigured(notifyPhone, smsBody);
      safeServerLog(LOG_SCOPE, "invoice_sms_result", {
        ok: r.ok,
        skippedReason: r.skippedReason,
        eventIdPrefix: args.event.id.slice(0, 12),
      });
    } catch (e) {
      safeServerLog(LOG_SCOPE, "invoice_sms_exception", {
        message: e instanceof Error ? e.message.slice(0, 200) : String(e),
        eventIdPrefix: args.event.id.slice(0, 12),
      });
    }
  }
}

export type ScheduleInvoicePaymentFailedArgs = {
  stripe: Stripe;
  event: Stripe.Event;
  invoice: Stripe.Invoice;
  userId: string;
  subscriptionId: string;
  customerId: string | null;
  planTierLabel: string | null;
  correlation: string;
};

/**
 * Owner email/SMS after `invoice.payment_failed`. Runs after HTTP response via Next `after`.
 * Never throws to callers.
 */
export function scheduleOwnerInvoicePaymentFailedNotification(args: ScheduleInvoicePaymentFailedArgs): void {
  if (!args.event.livemode && !shouldIncludeTestModeOwnerNotifies()) return;
  safeServerLog(LOG_SCOPE, "invoice_payment_failed_notify_scheduled", {
    eventIdPrefix: args.event.id.slice(0, 12),
    correlation: args.correlation,
    subscriptionIdPrefix: args.subscriptionId.slice(0, 14),
    severity: "warning",
  });
  after(async () => {
    try {
      await runOwnerInvoicePaymentFailedNotificationsJob(args);
    } catch (e) {
      safeServerLog(LOG_SCOPE, "invoice_payment_failed_job_error", {
        message: e instanceof Error ? e.message.slice(0, 240) : String(e),
        eventIdPrefix: args.event.id.slice(0, 12),
      });
    }
  });
}

async function runOwnerInvoicePaymentFailedNotificationsJob(args: ScheduleInvoicePaymentFailedArgs): Promise<void> {
  const notifyEmail = process.env.ADMIN_SUBSCRIPTION_NOTIFY_EMAIL?.trim();
  const notifyPhone = process.env.ADMIN_SUBSCRIPTION_NOTIFY_PHONE?.trim();
  if (!notifyEmail && !notifyPhone) {
    console.error(
      "[NurseNest][CRITICAL] Invoice payment FAILED notification dropped — neither ADMIN_SUBSCRIPTION_NOTIFY_EMAIL nor ADMIN_SUBSCRIPTION_NOTIFY_PHONE is set.",
      { eventIdPrefix: args.event.id.slice(0, 12) },
    );
    return;
  }

  const currency = args.invoice.currency ?? "usd";
  const amountDue = typeof args.invoice.amount_due === "number" ? formatMoney(args.invoice.amount_due, currency) : "—";
  const ts = new Date(args.event.created * 1000).toISOString();
  const lines = [
    `PAYMENT FAILED — subscription invoice`,
    ``,
    `User id: ${args.userId}`,
    `Amount due: ${amountDue}`,
    `Plan tier: ${args.planTierLabel ?? "—"}`,
    `Subscription id: ${args.subscriptionId}`,
    `Customer id: ${args.customerId ?? "—"}`,
    `Stripe event: ${args.event.id} (${args.event.type})`,
    `Livemode: ${args.event.livemode ? "live" : "test"}`,
    `Event time (UTC): ${ts}`,
  ];
  const textBody = lines.join("\n");
  const htmlBody = `<pre style="white-space:pre-wrap;font-family:system-ui,monospace;font-size:14px;color:#dc2626;">${textBody.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</pre>`;
  const smsBody = `NurseNest PAYMENT FAILED: ${amountDue} | user ${args.userId.slice(0, 8)}… | sub ${args.subscriptionId.slice(0, 12)}…`;

  if (notifyEmail) {
    try {
      const r = await sendTransactionalEmailHtml({
        to: notifyEmail,
        subject: `[NurseNest] PAYMENT FAILED — ${amountDue} (${args.subscriptionId.slice(0, 10)}…)`,
        html: htmlEmailShell("Payment failed", htmlBody),
        text: textBody,
      });
      if (!r.ok) {
        console.error("[NurseNest][CRITICAL] Payment-failed admin email did not send.", { skippedReason: r.skippedReason });
      }
      safeServerLog(LOG_SCOPE, "invoice_payment_failed_email_result", {
        ok: r.ok,
        skippedReason: r.skippedReason,
        eventIdPrefix: args.event.id.slice(0, 12),
      });
    } catch (e) {
      console.error("[NurseNest][CRITICAL] Payment-failed admin email threw.", e);
    }
  }

  if (notifyPhone) {
    try {
      const r = await sendTwilioSmsIfConfigured(notifyPhone, smsBody);
      safeServerLog(LOG_SCOPE, "invoice_payment_failed_sms_result", {
        ok: r.ok,
        skippedReason: r.skippedReason,
        eventIdPrefix: args.event.id.slice(0, 12),
      });
    } catch (e) {
      safeServerLog(LOG_SCOPE, "invoice_payment_failed_sms_exception", {
        message: e instanceof Error ? e.message.slice(0, 200) : String(e),
        eventIdPrefix: args.event.id.slice(0, 12),
      });
    }
  }
}
