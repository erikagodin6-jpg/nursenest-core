"use client";

import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { MarketingHeaderGlobalRegionServerContext } from "@/lib/region/marketing-header-global-region-server-bridge";
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
 * Reads `nn_global_region` on the client. When wrapped by
 * {@link MarketingHeaderGlobalRegionServerBridge} (`lib/region/marketing-header-global-region-server-bridge.tsx`),
 * the initial value matches the server cookie so
 * the public header does not swap labels after hydration. Re-reads after navigation.
 */
export function useClientGlobalRegionCookie(): GlobalRegionSlug | null {
  const pathname = usePathname();
  const serverInitial = useContext(MarketingHeaderGlobalRegionServerContext);
  const [region, setRegion] = useState<GlobalRegionSlug | null>(() =>
    serverInitial !== undefined ? serverInitial : null,
  );

  useEffect(() => {
    setRegion(readGlobalRegionFromDocument());
  }, [pathname]);

  return region;
}
