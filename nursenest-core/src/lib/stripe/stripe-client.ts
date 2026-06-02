import "server-only";

import type Stripe from "stripe";

let cached: Stripe | null = null;
let cachedKey: string | null = null;

/**
 * Shared Stripe SDK instance. Returns null when STRIPE_SECRET_KEY is not set
 * (build-time page collection, local dev without billing, etc.).
 * Dynamic import keeps `stripe` out of client bundles and Edge middleware.
 */
export async function getStripeClient(): Promise<Stripe | null> {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  if (cached && cachedKey === key) return cached;
  const { default: StripeSDK } = await import("stripe");
  cached = new StripeSDK(key);
  cachedKey = key;
  return cached;
}
