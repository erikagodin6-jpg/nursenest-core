"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { stampCheckoutGlobalRegionContextFromPathname } from "@/app/actions/stamp-checkout-global-region-context-from-path";

/** Keeps `nn_co_region_ctx` aligned with regional marketing URLs (Policy A path stamp). */
export function CheckoutGlobalRegionContextPathStamp() {
  const pathname = usePathname() ?? "";
  useEffect(() => {
    void stampCheckoutGlobalRegionContextFromPathname(pathname);
  }, [pathname]);
  return null;
}
