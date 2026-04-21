"use server";

import { cookies } from "next/headers";
import { globalRegionSlugFromRegionalMarketingPublicPath } from "@/lib/marketing/regional-marketing-public-gate";
import {
  CHECKOUT_GLOBAL_REGION_CONTEXT_MAX_AGE_SEC,
  decodeCheckoutGlobalRegionContextToken,
  encodeCheckoutGlobalRegionContextToken,
  GLOBAL_CHECKOUT_REGION_CONTEXT_COOKIE,
} from "@/lib/region/checkout-global-region-context";

/**
 * Stamps HttpOnly signed checkout region context from the current marketing pathname.
 * No-op when the path does not map to a regional hub/topic tree (preserves prior stamp on e.g. `/pricing`).
 */
export async function stampCheckoutGlobalRegionContextFromPathname(
  pathname: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const slug = globalRegionSlugFromRegionalMarketingPublicPath(pathname);
    if (slug == null) return { ok: true };
    const jar = await cookies();
    const existing = decodeCheckoutGlobalRegionContextToken(jar.get(GLOBAL_CHECKOUT_REGION_CONTEXT_COOKIE)?.value);
    if (existing === slug) return { ok: true };
    const stamp = encodeCheckoutGlobalRegionContextToken(slug);
    if (!stamp) return { ok: true };
    jar.set(GLOBAL_CHECKOUT_REGION_CONTEXT_COOKIE, stamp, {
      path: "/",
      maxAge: CHECKOUT_GLOBAL_REGION_CONTEXT_MAX_AGE_SEC,
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "stamp_failed" };
  }
}
