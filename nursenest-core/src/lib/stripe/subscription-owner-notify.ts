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
  const from = process.env.TWILIO_SMS_FROM?.trim();
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
    return;
  }

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
    safeServerLog(LOG_SCOPE, "skipped_no_recipients", {
      severity: "warning",
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
      safeServerLog(LOG_SCOPE, "email_result", {
        ok: r.ok,
        skippedReason: r.skippedReason,
        eventIdPrefix: args.event.id.slice(0, 12),
      });
    } catch (e) {
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
