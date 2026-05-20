"use client";

import { createContext, type ReactNode } from "react";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";

/**
 * `undefined` = consumer is not under the marketing bridge (legacy / tests).
 * `null` = server read found no valid `nn_global_region` cookie.
 */
export const MarketingHeaderGlobalRegionServerContext = createContext<GlobalRegionSlug | null | undefined>(
  undefined,
);

export function MarketingHeaderGlobalRegionServerBridge({
  serverGlobalRegion,
  children,
}: {
  serverGlobalRegion: GlobalRegionSlug | null;
  children: ReactNode;
}) {
  return (
    <MarketingHeaderGlobalRegionServerContext.Provider value={serverGlobalRegion}>
      {children}
    </MarketingHeaderGlobalRegionServerContext.Provider>
  );
}
