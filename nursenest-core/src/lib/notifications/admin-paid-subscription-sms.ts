import "server-only";

import type Stripe from "stripe";
import { Prisma, SubscriptionStatus, type TierCode } from "@prisma/client";
import { prisma as defaultPrisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { isFreeStripeBillingNursingTier } from "@/lib/pricing/display-catalog";
import { firstSubscriptionPriceId } from "@/lib/stripe/stripe-subscription-field-map";

const LOG_SCOPE = "admin_paid_subscription_sms";
const NOTIFICATION_KIND = "admin_paid_subscription_sms";

type Env = Record<string, string | undefined>;

type NotificationPrisma = Pick<typeof defaultPrisma, "stripeOwnerPaidSubscriptionNotify" | "emailNotificationLog">;

export type AdminPaidSubscriptionSmsInput = {
  eventId: string;
  eventType: string;
  userId: string;
  email: string;
  customerId: string;
  subscriptionId: string;
  planName: string;
  amountCents: number;
  currency: string;
  interval: string;
  timestamp: Date;
  stripeSubscriptionStatus: Stripe.Subscription.Status;
  planTier?: TierCode | null;
};

export type AdminPaidSubscriptionSmsDeps = {
  prisma?: NotificationPrisma;
  fetchImpl?: typeof fetch;
  env?: Env;
  log?: typeof safeServerLog;
};

export type AdminPaidSubscriptionSmsResult =
  | { status: "sent"; messageSid?: string }
  | { status: "skipped"; reason: string }
  | { status: "duplicate" }
  | { status: "failed"; reason: string };

function enabled(env: Env): boolean {
  return env.ADMIN_SMS_NOTIFICATIONS_ENABLED?.trim().toLowerCase() === "true";
}

function testOrPreviewEnvironment(env: Env): boolean {
  return env.VERCEL_ENV === "preview" || env.NODE_ENV === "test";
}

function configuredProvider(env: Env): "twilio" | null {
  const provider = env.SMS_PROVIDER?.trim().toLowerCase();
  return provider === "twilio" ? "twilio" : null;
}

function twilioFromNumber(env: Env): string | null {
  return env.TWILIO_FROM_NUMBER?.trim() || env.TWILIO_SMS_FROM?.trim() || null;
}

function twilioConfig(env: Env): { accountSid: string; authToken: string; from: string; to: string } | null {
  const accountSid = env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = env.TWILIO_AUTH_TOKEN?.trim();
  const from = twilioFromNumber(env);
  const to = env.ADMIN_SMS_TO_NUMBER?.trim();
  if (!accountSid || !authToken || !from || !to) return null;
  return { accountSid, authToken, from, to };
}

export function adminPaidSubscriptionSmsEnvStatus(env: Env = process.env): {
  enabled: boolean;
  provider: string | null;
  configured: boolean;
  previewOrTestNoop: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  if (!env.STRIPE_WEBHOOK_SECRET?.trim()) missing.push("STRIPE_WEBHOOK_SECRET");
  if (!env.ADMIN_SMS_NOTIFICATIONS_ENABLED?.trim()) missing.push("ADMIN_SMS_NOTIFICATIONS_ENABLED");
  if (!env.ADMIN_SMS_TO_NUMBER?.trim()) missing.push("ADMIN_SMS_TO_NUMBER");
  if (!env.SMS_PROVIDER?.trim()) missing.push("SMS_PROVIDER");
  if (!env.TWILIO_ACCOUNT_SID?.trim()) missing.push("TWILIO_ACCOUNT_SID");
  if (!env.TWILIO_AUTH_TOKEN?.trim()) missing.push("TWILIO_AUTH_TOKEN");
  if (!twilioFromNumber(env)) missing.push("TWILIO_FROM_NUMBER or TWILIO_SMS_FROM");

  return {
    enabled: enabled(env),
    provider: env.SMS_PROVIDER?.trim() || null,
    configured: enabled(env) && configuredProvider(env) === "twilio" && twilioConfig(env) !== null,
    previewOrTestNoop: testOrPreviewEnvironment(env),
    missing,
  };
}

export function formatSubscriptionAmountPerMonth(amountCents: number, currency: string): string {
  const normalizedCurrency = (currency || "usd").toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: 2,
    }).format(amountCents / 100);
  } catch {
    return `${(amountCents / 100).toFixed(2)} ${normalizedCurrency}`;
  }
}

export function buildAdminPaidSubscriptionSmsMessage(input: AdminPaidSubscriptionSmsInput): string {
  return `New NurseNest paid subscriber: ${input.email} subscribed to ${input.planName} at ${formatSubscriptionAmountPerMonth(
    input.amountCents,
    input.currency,
  )}/mo. Stripe customer: ${input.customerId}`;
}

export function adminPaidSubscriptionSmsInputFromSubscription(args: {
  event: Stripe.Event;
  userId: string | null | undefined;
  email: string | null | undefined;
  customerId: string | null | undefined;
  subscription: Stripe.Subscription | null | undefined;
  planName?: string | null;
  planTier?: TierCode | null;
}): AdminPaidSubscriptionSmsInput | null {
  const userId = args.userId?.trim();
  const email = args.email?.trim();
  const customerId = args.customerId?.trim();
  const subscription = args.subscription;
  if (!userId || !email || !customerId || !subscription) return null;
  if (subscription.status !== "active" && subscription.status !== "trialing") return null;
  if (args.planTier && isFreeStripeBillingNursingTier(args.planTier)) return null;

  const price = subscription.items?.data?.[0]?.price;
  const amountCents = typeof price?.unit_amount === "number" ? price.unit_amount : null;
  if (amountCents == null || amountCents <= 0) return null;

  const productName =
    args.planName?.trim() ||
    (price?.nickname && price.nickname.trim()) ||
    (typeof price?.product === "object" && price.product && "name" in price.product
      ? String((price.product as { name?: string | null }).name ?? "").trim()
      : "") ||
    firstSubscriptionPriceId(subscription) ||
    "Paid plan";

  const interval =
    price?.recurring?.interval === "year"
      ? "year"
      : price?.recurring?.interval === "month"
        ? "month"
        : price?.recurring?.interval ?? "month";

  return {
    eventId: args.event.id,
    eventType: args.event.type,
    userId,
    email,
    customerId,
    subscriptionId: subscription.id,
    planName: productName,
    amountCents,
    currency: price?.currency ?? "usd",
    interval,
    timestamp: new Date(args.event.created * 1000),
    stripeSubscriptionStatus: subscription.status,
    planTier: args.planTier,
  };
}

async function writeAttemptLog(
  db: NotificationPrisma,
  input: AdminPaidSubscriptionSmsInput,
  status: string,
  reason?: string,
): Promise<void> {
  await db.emailNotificationLog.create({
    data: {
      userId: input.userId,
      kind: NOTIFICATION_KIND,
      meta: {
        stripeEventId: input.eventId,
        stripeEventType: input.eventType,
        stripeSubscriptionId: input.subscriptionId,
        stripeCustomerId: input.customerId,
        planName: input.planName,
        amountCents: input.amountCents,
        currency: input.currency,
        interval: input.interval,
        timestamp: input.timestamp.toISOString(),
        status,
        reason: reason ? reason.slice(0, 240) : undefined,
      },
    },
  });
}

async function claimOrDuplicate(db: NotificationPrisma, eventId: string): Promise<"claimed" | "duplicate"> {
  try {
    await db.stripeOwnerPaidSubscriptionNotify.create({ data: { id: eventId } });
    return "claimed";
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return "duplicate";
    }
    throw e;
  }
}

export async function sendAdminPaidSubscriptionSms(
  input: AdminPaidSubscriptionSmsInput,
  deps: AdminPaidSubscriptionSmsDeps = {},
): Promise<AdminPaidSubscriptionSmsResult> {
  const db = deps.prisma ?? defaultPrisma;
  const env = deps.env ?? process.env;
  const log = deps.log ?? safeServerLog;
  const status = adminPaidSubscriptionSmsEnvStatus(env);

  if (!enabled(env)) {
    log(LOG_SCOPE, "skipped", { reason: "disabled", eventIdPrefix: input.eventId.slice(0, 12) });
    return { status: "skipped", reason: "disabled" };
  }
  if (testOrPreviewEnvironment(env)) {
    log(LOG_SCOPE, "skipped", { reason: "preview_or_test_environment", eventIdPrefix: input.eventId.slice(0, 12) });
    return { status: "skipped", reason: "preview_or_test_environment" };
  }
  if (status.provider !== "twilio" || !configuredProvider(env)) {
    log(LOG_SCOPE, "skipped", { reason: "unsupported_sms_provider", provider: status.provider ?? "", eventIdPrefix: input.eventId.slice(0, 12) });
    return { status: "skipped", reason: "unsupported_sms_provider" };
  }
  const cfg = twilioConfig(env);
  if (!cfg) {
    log(LOG_SCOPE, "skipped", { reason: "twilio_not_configured", eventIdPrefix: input.eventId.slice(0, 12) });
    return { status: "skipped", reason: "twilio_not_configured" };
  }

  const claim = await claimOrDuplicate(db, input.eventId);
  if (claim === "duplicate") {
    log(LOG_SCOPE, "duplicate_skipped", { eventIdPrefix: input.eventId.slice(0, 12) });
    return { status: "duplicate" };
  }

  const message = buildAdminPaidSubscriptionSmsMessage(input);
  const auth = Buffer.from(`${cfg.accountSid}:${cfg.authToken}`).toString("base64");
  const body = new URLSearchParams({ To: cfg.to, From: cfg.from, Body: message });

  try {
    const res = await (deps.fetchImpl ?? fetch)(
      `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(cfg.accountSid)}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      },
    );
    if (!res.ok) {
      const providerMessage = await res.text().catch(() => "");
      const reason = `twilio_http_${res.status}`;
      await writeAttemptLog(db, input, "failed", reason);
      log(LOG_SCOPE, "send_failed", {
        reason,
        providerMessage: providerMessage.slice(0, 160),
        eventIdPrefix: input.eventId.slice(0, 12),
      });
      return { status: "failed", reason };
    }
    const json = (await res.json().catch(() => ({}))) as { sid?: string };
    await writeAttemptLog(db, input, "sent");
    log(LOG_SCOPE, "sent", {
      eventIdPrefix: input.eventId.slice(0, 12),
      subscriptionIdPrefix: input.subscriptionId.slice(0, 14),
      provider: "twilio",
    });
    return { status: "sent", messageSid: typeof json.sid === "string" ? json.sid : undefined };
  } catch (e) {
    const reason = e instanceof Error ? e.message.slice(0, 200) : "unknown_error";
    await writeAttemptLog(db, input, "failed", reason);
    log(LOG_SCOPE, "send_exception", {
      eventIdPrefix: input.eventId.slice(0, 12),
      reason,
    });
    return { status: "failed", reason };
  }
}

