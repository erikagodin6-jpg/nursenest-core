/**
 * Known API denial codes from web subscriber gate and related routes.
 * Mobile must treat server JSON as authoritative — these drive UX only.
 */
export const PAYWALL_AND_AUTH_CODES = [
  "not_subscribed",
  "unauthorized",
  "access_verify_failed",
  "region_tier_locked",
  "learner_path_invalid",
] as const;

export type PaywallOrAuthCode = (typeof PAYWALL_AND_AUTH_CODES)[number];

export function parseApiErrorCode(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const code = (body as { code?: unknown }).code;
  return typeof code === "string" ? code : undefined;
}

export function isPaywallOrAuthCode(code: string | undefined): code is PaywallOrAuthCode {
  if (!code) return false;
  return (PAYWALL_AND_AUTH_CODES as readonly string[]).includes(code);
}

export function shouldShowUpgradeUi(status: number, body: unknown): boolean {
  if (status === 401) return true;
  if (status !== 403) return false;
  const code = parseApiErrorCode(body);
  return code === "not_subscribed" || code === "region_tier_locked";
}
