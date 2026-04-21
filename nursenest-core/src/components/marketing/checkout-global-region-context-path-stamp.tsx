"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const STAMP_API_PATH = "/api/marketing/stamp-checkout-global-region-context";

/** Keeps `nn_co_region_ctx` aligned with regional marketing URLs (Policy A path stamp). */
export function CheckoutGlobalRegionContextPathStamp() {
  const pathname = usePathname() ?? "";
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(STAMP_API_PATH, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pathname }),
          credentials: "same-origin",
          cache: "no-store",
        });
        if (cancelled) return;
        if (!res.ok) {
          // Non-fatal: cookie may lag until next navigation or retry; avoids Server Action deploy skew.
          return;
        }
      } catch {
        /* network / abort — ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);
  return null;
}
