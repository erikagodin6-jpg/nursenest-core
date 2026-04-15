"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { parseGlobalRegionCookie, GLOBAL_REGION_COOKIE } from "@/lib/region/global-region-cookie";

function readGlobalRegionFromDocument(): GlobalRegionSlug | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${GLOBAL_REGION_COOKIE}=`));
  const v = raw?.split("=")[1];
  return parseGlobalRegionCookie(v) ?? null;
}

/**
 * Reads `nn_global_region` on the client (SSR-safe initial `null`).
 * Re-reads after navigation so the header country label matches cookies set by
 * {@link saveContextPreferences} + region toggle.
 */
export function useClientGlobalRegionCookie(): GlobalRegionSlug | null {
  const pathname = usePathname();
  const [region, setRegion] = useState<GlobalRegionSlug | null>(null);

  useEffect(() => {
    setRegion(readGlobalRegionFromDocument());
  }, [pathname]);

  return region;
}
