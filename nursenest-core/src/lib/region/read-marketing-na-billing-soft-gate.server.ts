import "server-only";

import { cookies } from "next/headers";
import { GLOBAL_CHECKOUT_REGION_CONTEXT_COOKIE } from "@/lib/region/checkout-global-region-context";
import { GLOBAL_REGION_COOKIE } from "@/lib/region/global-region-cookie";
import { naBillingScopeAckRequiredForCheckout } from "@/lib/stripe/checkout-na-billing-scope-gate";

const STATIC_GENERATION_PHASE = "phase-production-build";

/** SSR + marketing layouts: align pricing soft-gate UI with checkout POST union policy. */
export async function readMarketingNaBillingSoftGateFromCookies(): Promise<boolean> {
  if (process.env.NEXT_PHASE === STATIC_GENERATION_PHASE) return false;
  try {
    const jar = await cookies();
    return naBillingScopeAckRequiredForCheckout({
      globalRegionCookieRaw: jar.get(GLOBAL_REGION_COOKIE)?.value,
      checkoutRegionContextCookieRaw: jar.get(GLOBAL_CHECKOUT_REGION_CONTEXT_COOKIE)?.value,
    });
  } catch {
    return false;
  }
}
