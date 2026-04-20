"use client";

import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
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
 * Reads `nn_global_region` for marketing chrome. When wrapped by
 * {@link MarketingHeaderGlobalRegionServerBridge}, the first client render matches the server
 * cookie (no `null` seed + rAF stomp). `document.cookie` is only consulted after client-side
 * navigations once SSR has already provided the authoritative initial value.
 */
export function useClientGlobalRegionCookie(): GlobalRegionSlug | null {
  const pathname = usePathname() ?? "";
  const serverFromLayout = useContext(MarketingHeaderGlobalRegionServerContext);
  const serverBridged = serverFromLayout !== undefined;

  const [region, setRegion] = useState<GlobalRegionSlug | null>(() => (serverBridged ? serverFromLayout : null));

  useEffect(() => {
    if (!serverBridged) return;
    setRegion(serverFromLayout);
  }, [serverBridged, serverFromLayout]);

  const prevPathnameForCookieSync = useRef<string | null>(null);

  useEffect(() => {
    if (!serverBridged) {
      const id = requestAnimationFrame(() => {
        setRegion(readGlobalRegionFromDocument());
      });
      return () => cancelAnimationFrame(id);
    }

    if (prevPathnameForCookieSync.current === null) {
      prevPathnameForCookieSync.current = pathname;
      return;
    }
    if (prevPathnameForCookieSync.current === pathname) return;
    prevPathnameForCookieSync.current = pathname;

    const id = requestAnimationFrame(() => {
      setRegion(readGlobalRegionFromDocument());
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, serverBridged]);

  return region;
}
