import "server-only";

import type Stripe from "stripe";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { htmlEmailShell, sendTransactionalEmailHtml } from "@/lib/email/resend-transactional";

const LOG_SCOPE = "subscriber_confirmation_email";

export type SubscriberConfirmationEmailInput = {
  /** The subscriber's email address (from Stripe checkout). */
  subscriberEmail: string;
  /** Plan name / tier label (e.g. "RN", "RPN", "NP"). */
  planLabel: string | null;
  /** Pathway or exam track (e.g. "NCLEX-RN Canada", "REx-PN"). */
  pathway: string | null;
  /** Formatted amount string (e.g. "$29.99"). */
  amountLabel: string;
  /** Country / region (e.g. "CA", "US"). */
  country: string | null;
  /** ISO timestamp of the Stripe event. */
  occurredAt: string;
  /** Stripe subscription ID (for support reference). */
  subscriptionId: string;
  /** Stripe event livemode flag. */
  livemode: boolean;
};

export type SubscriberConfirmationEmailResult =
  | { ok: true }
  | { ok: false; skippedReason: string };

function formatMoney(amountCents: number | null, currency: string | null | undefined): string {
  if (amountCents == null) return "—";
  const cur = (currency ?? "usd").toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: cur }).format(amountCents / 100);
  } catch {
    return `${(amountCents / 100).toFixed(2)} ${cur}`;
  }
}

function buildSubscriberEmailHtml(input: SubscriberConfirmationEmailInput): string {
  const plan = input.planLabel ?? "NurseNest";
  const pathway = input.pathway ?? "your selected exam track";
  const country = input.country ?? "—";
  const ts = input.occurredAt.slice(0, 10);

  const body = `
    <p style="margin:0 0 16px">Thank you for subscribing to NurseNest!</p>
    <table style="border-collapse:collapse;width:100%;max-width:480px;font-size:14px;">
      <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;width:40%">Plan</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${plan}</td></tr>
      <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600">Exam track</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${pathway}</td></tr>
      <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600">Amount</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${input.amountLabel}</td></tr>
      <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600">Country</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${country}</td></tr>
      <tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600">Date</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${ts}</td></tr>
    </table>
    <p style="margin:20px 0 8px">You now have full access to:</p>
    <ul style="margin:0 0 16px;padding-left:20px">
      <li>All lessons and study guides for your exam pathway</li>
      <li>Adaptive question bank with clinical reasoning explanations</li>
      <li>Flashcards and spaced-repetition review</li>
      <li>Computerized Adaptive Testing (CAT) practice</li>
      <li>Readiness tracking and study planning tools</li>
    </ul>
    <p style="margin:16px 0"><a href="https://nursenest.ca/app" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Start Studying Now</a></p>
    <p style="margin:16px 0 8px;font-size:13px;color:#6b7280">If you have any questions, reply to this email or contact our support team. Your subscription reference: <code style="background:#f3f4f6;padding:2px 4px;border-radius:4px;font-size:12px">${input.subscriptionId.slice(0, 20)}…</code></p>
  `;
  return htmlEmailShell("Welcome to NurseNest!", body);
}

function buildSubscriberEmailText(input: SubscriberConfirmationEmailInput): string {
  return [
    "Thank you for subscribing to NurseNest!",
    "",
    `Plan: ${input.planLabel ?? "NurseNest"}`,
    `Exam track: ${input.pathway ?? "your selected exam track"}`,
    `Amount: ${input.amountLabel}`,
    `Country: ${input.country ?? "—"}`,
    `Date: ${input.occurredAt.slice(0, 10)}`,
    "",
    "You now have full access to all lessons, flashcards, the adaptive question bank, CAT practice, and study planning tools.",
    "",
    "Start studying: https://nursenest.ca/app",
    "",
    `Subscription reference: ${input.subscriptionId.slice(0, 20)}…`,
  ].join("\n");
}

/**
 * Sends a confirmation email to the subscriber (not the admin) after a successful checkout.
 *
 * Required: RESEND_API_KEY (uses the same transactional transport as password reset).
 * Does NOT throw — subscriber email failure is logged but does not cause Stripe to retry.
 * Admin notification paths are responsible for the retry-forcing throw.
 */
export async function sendSubscriberConfirmationEmail(
  input: SubscriberConfirmationEmailInput,
): Promise<SubscriberConfirmationEmailResult> {
  if (!input.livemode && process.env.ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE !== "1") {
    safeServerLog(LOG_SCOPE, "skipped_test_mode", {
      subscriberEmail: input.subscriberEmail.slice(0, 40),
      hint: "Set ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE=1 to send in test mode",
    });
    return { ok: false, skippedReason: "test_mode" };
  }

  const email = input.subscriberEmail.trim();
  if (!email || !email.includes("@")) {
    safeServerLog(LOG_SCOPE, "skipped_invalid_email", {
      reason: "missing_or_invalid_subscriber_email",
      severity: "warning",
    });
    return { ok: false, skippedReason: "missing_subscriber_email" };
  }

  try {
    const result = await sendTransactionalEmailHtml({
      to: email,
      subject: `Welcome to NurseNest — Your ${input.planLabel ?? "subscription"} is active`,
      html: buildSubscriberEmailHtml(input),
      text: buildSubscriberEmailText(input),
    });

    if (!result.ok) {
      safeServerLog(LOG_SCOPE, "send_failed", {
        skippedReason: result.skippedReason,
        subscriberEmail: email.slice(0, 40),
        severity: "error",
      });
      console.error(
        "[NurseNest][CRITICAL] Subscriber confirmation email failed to send.",
        { skippedReason: result.skippedReason, plan: input.planLabel, amount: input.amountLabel },
      );
      return { ok: false, skippedReason: result.skippedReason ?? "send_failed" };
    }

    safeServerLog(LOG_SCOPE, "sent", {
      subscriberEmail: email.slice(0, 40),
      plan: input.planLabel ?? "",
      amount: input.amountLabel,
      severity: "info",
    });
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message.slice(0, 200) : "unknown";
    safeServerLog(LOG_SCOPE, "exception", { message, severity: "error" });
    console.error("[NurseNest][CRITICAL] Subscriber confirmation email threw.", e);
    return { ok: false, skippedReason: `exception:${message}` };
  }
}

/**
 * Build the input for `sendSubscriberConfirmationEmail` from a Stripe checkout session.
 */
export function buildSubscriberConfirmationFromCheckout(args: {
  session: Stripe.Checkout.Session;
  stripeSubscription: Stripe.Subscription | null;
  planLabel: string | null;
  planCountryLabel: string | null;
  billingRegionSlug: string | undefined | null;
  eventCreated: number;
  livemode: boolean;
}): SubscriberConfirmationEmailInput | null {
  const email =
    args.session.customer_email ??
    (args.session.customer_details && typeof args.session.customer_details === "object"
      ? (args.session.customer_details as { email?: string | null }).email
      : null) ??
    null;

  if (!email?.trim()) return null;

  const amountCents =
    typeof args.session.amount_total === "number" ? args.session.amount_total : null;
  const currency = args.session.currency;
  const amountLabel = amountCents != null ? formatMoney(amountCents, currency) : "—";

  const subId =
    typeof args.session.subscription === "string"
      ? args.session.subscription
      : args.session.subscription?.id ?? "";

  const interval = args.stripeSubscription?.items?.data?.[0]?.price?.recurring?.interval;
  const intervalLabel = interval === "year" ? "/year" : interval === "month" ? "/month" : "";
  const fullAmountLabel = amountLabel !== "—" ? `${amountLabel}${intervalLabel}` : "—";

  const countryHint =
    [args.billingRegionSlug, args.planCountryLabel]
      .filter((x) => Boolean(x?.trim()))
      .join(" · ") || null;

  return {
    subscriberEmail: email.trim(),
    planLabel: args.planLabel,
    pathway: args.planLabel, // Plan label doubles as pathway label (RN, RPN, NP, etc.)
    amountLabel: fullAmountLabel,
    country: countryHint,
    occurredAt: new Date(args.eventCreated * 1000).toISOString(),
    subscriptionId: subId,
    livemode: args.livemode,
  };
}
