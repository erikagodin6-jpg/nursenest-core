/** Matches POST /api/subscriptions/checkout when no Stripe price env is mapped. */
export const STRIPE_PRICE_NOT_CONFIGURED_CODE = "stripe_price_not_configured";

/**
 * Include `envKey` in checkout 400 JSON only when not on Vercel production.
 * Local dev and preview/staging keep ops-friendly detail; production responses stay minimal.
 */
export function includeStripePriceEnvKeyInCheckoutResponse(): boolean {
  if (process.env.VERCEL_ENV === "production") return false;
  if (process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "development") return true;
  return process.env.NODE_ENV !== "production";
}

/**
 * Client: show env var hint only in non-production Vercel targets or local dev builds.
 * Uses NEXT_PUBLIC_VERCEL_ENV so preview deployments can surface ops text safely.
 */
export function showStripePriceEnvKeyOnCheckoutError(): boolean {
  const v = process.env.NEXT_PUBLIC_VERCEL_ENV;
  if (v === "production") return false;
  if (v === "preview" || v === "development") return true;
  return process.env.NODE_ENV !== "production";
}

export type ParsedCheckoutErrorBody = {
  error: string;
  code?: string;
  envKey?: string;
};

export function parseCheckoutApiErrorBody(body: unknown): ParsedCheckoutErrorBody {
  if (!body || typeof body !== "object") return { error: "" };
  const o = body as Record<string, unknown>;
  return {
    error: typeof o.error === "string" ? o.error : "",
    code: typeof o.code === "string" ? o.code : undefined,
    envKey: typeof o.envKey === "string" ? o.envKey : undefined,
  };
}
