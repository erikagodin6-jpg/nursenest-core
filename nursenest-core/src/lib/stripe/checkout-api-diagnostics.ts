/** Matches POST /api/subscriptions/checkout when no Stripe price env is mapped. */
export const STRIPE_PRICE_NOT_CONFIGURED_CODE = "stripe_price_not_configured";

/** Structured checkout error codes (POST /api/subscriptions/checkout). */
export const CHECKOUT_UNAUTHORIZED_CODE = "checkout_unauthorized";
/** Demo / QA accounts cannot start real Stripe checkout. */
export const CHECKOUT_DEMO_USER_FORBIDDEN_CODE = "checkout_demo_user_forbidden";
export const CHECKOUT_INVALID_PAYLOAD_CODE = "checkout_invalid_payload";
export const CHECKOUT_POLICY_VERSION_MISMATCH_CODE = "checkout_policy_version_mismatch";
export const CHECKOUT_STRIPE_UNAVAILABLE_CODE = "checkout_stripe_unavailable";
export const CHECKOUT_SESSION_FAILED_CODE = "checkout_session_failed";

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
  /** Prefer `message` from API; fall back to legacy `error`. */
  message: string;
  code?: string;
  envKey?: string;
};

export function parseCheckoutApiErrorBody(body: unknown): ParsedCheckoutErrorBody {
  if (!body || typeof body !== "object") return { message: "" };
  const o = body as Record<string, unknown>;
  const message =
    typeof o.message === "string"
      ? o.message
      : typeof o.error === "string"
        ? o.error
        : "";
  return {
    message,
    code: typeof o.code === "string" ? o.code : undefined,
    envKey: typeof o.envKey === "string" ? o.envKey : undefined,
  };
}
