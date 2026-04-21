/**
 * Authoritative checkout global-region context (Policy A: preserve last explicit selection).
 *
 * `nn_global_region` is readable from client JS and can be cleared or drift from marketing UI.
 * This cookie is **HttpOnly** + **signed** + **bounded TTL**, stamped when the user explicitly
 * saves a global region via {@link saveContextPreferences} and when marketing pathname implies a
 * regional hub/topic tree (`stampCheckoutGlobalRegionContextFromPathname` server action). `POST
 * /api/subscriptions/checkout` and marketing SSR merge it with `nn_global_region` and optional
 * JSON body slug for NA billing scope (Policy A: preserve last explicit / path-derived context).
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { isGlobalRegionSlug } from "@/lib/i18n/global-regions";
import { canShowPricing } from "@/lib/navigation/market-readiness";
import { parseGlobalRegionCookie } from "@/lib/region/global-region-cookie";

export const GLOBAL_CHECKOUT_REGION_CONTEXT_COOKIE = "nn_co_region_ctx";

/** Bounded retention for explicit checkout context (not the 1y marketing cookie). */
export const CHECKOUT_GLOBAL_REGION_CONTEXT_MAX_AGE_SEC = 60 * 60 * 24 * 90; // 90 days

const PAYLOAD_VERSION = 1 as const;

function checkoutRegionContextSecret(): string | undefined {
  const s = (process.env.CHECKOUT_BILLING_CONTEXT_SECRET ?? process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET)?.trim();
  return s && s.length > 0 ? s : undefined;
}

/**
 * Encode `slug` + issuance time into `payloadB64url.sigB64url` (HMAC-SHA256 over the payload bytes).
 */
export function encodeCheckoutGlobalRegionContextToken(slug: GlobalRegionSlug): string | null {
  const secret = checkoutRegionContextSecret();
  if (!secret) return null;
  const iat = Math.floor(Date.now() / 1000);
  const payload = `${PAYLOAD_VERSION}:${slug}:${iat}`;
  const sig = createHmac("sha256", secret).update(payload, "utf8").digest("base64url");
  const payloadB64 = Buffer.from(payload, "utf8").toString("base64url");
  return `${payloadB64}.${sig}`;
}

/**
 * Decode and verify TTL. Returns the slug or `undefined` if missing, tampered, or expired.
 */
export function decodeCheckoutGlobalRegionContextToken(raw: string | null | undefined): GlobalRegionSlug | undefined {
  if (!raw || typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  const dot = trimmed.indexOf(".");
  if (dot <= 0 || dot === trimmed.length - 1) return undefined;
  const payloadB64 = trimmed.slice(0, dot);
  const sig = trimmed.slice(dot + 1);
  const secret = checkoutRegionContextSecret();
  if (!secret) return undefined;
  let payload: string;
  try {
    payload = Buffer.from(payloadB64, "base64url").toString("utf8");
  } catch {
    return undefined;
  }
  const expectedSig = createHmac("sha256", secret).update(payload, "utf8").digest("base64url");
  try {
    const a = Buffer.from(expectedSig, "utf8");
    const b = Buffer.from(sig, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return undefined;
  } catch {
    return undefined;
  }
  const parts = payload.split(":");
  if (parts.length !== 3) return undefined;
  const [, slug, iatStr] = parts;
  if (!isGlobalRegionSlug(slug)) return undefined;
  const iat = Number(iatStr);
  if (!Number.isFinite(iat)) return undefined;
  const now = Math.floor(Date.now() / 1000);
  if (now - iat > CHECKOUT_GLOBAL_REGION_CONTEXT_MAX_AGE_SEC) return undefined;
  if (iat > now + 120) return undefined; // small clock skew tolerance forward
  return slug;
}

export type AuthoritativeCheckoutRegionSources = {
  globalRegionCookieRaw?: string | null | undefined;
  checkoutRegionContextCookieRaw?: string | null | undefined;
  checkoutBodyRegionSlug?: GlobalRegionSlug;
};

/**
 * All canonical global region slugs in play for NA billing scope (union, deduped).
 */
export function collectAuthoritativeCheckoutGlobalRegionSlugs(
  args: AuthoritativeCheckoutRegionSources,
): GlobalRegionSlug[] {
  const out = new Set<GlobalRegionSlug>();
  const fromPlain = parseGlobalRegionCookie(args.globalRegionCookieRaw);
  if (fromPlain) out.add(fromPlain);
  const fromStamp = decodeCheckoutGlobalRegionContextToken(args.checkoutRegionContextCookieRaw);
  if (fromStamp) out.add(fromStamp);
  if (args.checkoutBodyRegionSlug) out.add(args.checkoutBodyRegionSlug);
  return [...out];
}

/** Non-PII checkout gate diagnostics (structured logs / metrics). */
export function checkoutRegionGateTelemetry(args: AuthoritativeCheckoutRegionSources): {
  unionSlugs: string;
  gateRequired: boolean;
  contextSources: string;
} {
  const slugs = collectAuthoritativeCheckoutGlobalRegionSlugs(args);
  const bits: string[] = [];
  if (parseGlobalRegionCookie(args.globalRegionCookieRaw)) bits.push("nn_global_region");
  if (decodeCheckoutGlobalRegionContextToken(args.checkoutRegionContextCookieRaw)) bits.push("nn_co_region_ctx");
  if (args.checkoutBodyRegionSlug) bits.push("checkout_body_region");
  return {
    unionSlugs: slugs.join(","),
    gateRequired: slugs.some((s) => !canShowPricing(s)),
    contextSources: bits.join("|"),
  };
}
