"use client";

import { useEffect, useState } from "react";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { parseGlobalRegionCookie, GLOBAL_REGION_COOKIE } from "@/lib/region/global-region-cookie";

/**
 * Reads `nn_global_region` on the client after mount (SSR-safe).
 * Updates when the cookie is rewritten in-session (same-tab navigation after server action).
 */
export function useClientGlobalRegionCookie(): GlobalRegionSlug | null {
  const [region, setRegion] = useState<GlobalRegionSlug | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const raw = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${GLOBAL_REGION_COOKIE}=`));
    const v = raw?.split("=")[1];
    setRegion(parseGlobalRegionCookie(v) ?? null);
  }, []);

  return region;
}
