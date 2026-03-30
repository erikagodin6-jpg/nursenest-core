import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { analyticsDistinctId, captureServerEvent } from "@/lib/observability/posthog-server";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { stripePriceEnvKey } from "@/lib/pricing/display-catalog";
import { findPriceEntry, type BillingDuration } from "@/lib/stripe/pricing-map";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { TierCode } from "@prisma/client";

/** Dynamic import so Next build (collect page data) never loads Stripe without a key. */
async function getStripeClient(): Promise<Stripe | null> {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  const { default: Stripe } = await import("stripe");
  return new Stripe(key);
}

const bodySchema = z.object({
  country: z.enum(["CA", "US"]),
  tier: z.enum(["RPN", "LVN_LPN", "RN", "NP", "ALLIED"]),
  duration: z.enum(["monthly", "3-month", "6-month", "yearly"]),
});

function sessionUserId(session: { user?: unknown } | null): string | undefined {
  const u = session?.user;
  if (u && typeof u === "object" && "id" in u && typeof (u as { id: unknown }).id === "string") {
    return (u as { id: string }).id;
  }
  return undefined;
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = sessionUserId(session);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  setSentryServerContext({ route: "/api/subscriptions/checkout", feature: "payment", userId });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { country, tier, duration } = parsed.data;
  const tierCode = tier as TierCode;
  const durationCode = duration as BillingDuration;
  const price = findPriceEntry(country, tierCode, durationCode);
  if (!price) {
    safeServerLog("stripe_checkout", "rejected_missing_stripe_price_env", {
      country,
      tier: String(tier),
      duration: String(duration),
      envKey: stripePriceEnvKey(country, tierCode, durationCode).slice(0, 80),
    });
    return NextResponse.json({ error: "Plan unavailable" }, { status: 400 });
  }

  const stripe = await getStripeClient();
  if (!stripe) {
    safeServerLog("stripe_checkout", "stripe_client_unavailable", {});
    return NextResponse.json({ error: "Billing unavailable" }, { status: 503 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: price.priceId, quantity: 1 }],
      success_url: `${appUrl}/app?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
      client_reference_id: userId,
      metadata: {
        userId,
        country,
        tier,
        duration,
        app: "nursenest-core",
      },
    });

    await captureServerEvent(analyticsDistinctId(userId), "checkout_session_created", {
      country,
      tier: String(tier),
      duration: String(duration),
    });
    return NextResponse.json({ url: checkoutSession.url });
  } catch (e) {
    safeServerLog("stripe_checkout", "checkout_session_create_failed", {
      country,
      tier: String(tier),
      duration: String(duration),
    });
    safeServerLogCritical(
      "stripe_checkout",
      "stripe_checkout_session_failed",
      { country, tier: String(tier), duration: String(duration) },
      e,
    );
    return NextResponse.json({ error: "Unable to start checkout. Try again shortly." }, { status: 503 });
  }
}
