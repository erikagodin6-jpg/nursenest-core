"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";

/**
 * `undefined` = consumer is not under the marketing bridge (legacy / tests).
 * `null` = server read found no valid `nn_global_region` cookie.
 */
export const MarketingHeaderGlobalRegionServerContext = createContext<GlobalRegionSlug | null | undefined>(
  undefined,
);

/** Server union of `nn_global_region` + signed `nn_co_region_ctx` for NA billing soft-gate UI. */
export const MarketingNaBillingSoftGateServerContext = createContext(false);

export function useMarketingNaBillingSoftGateServer(): boolean {
  return useContext(MarketingNaBillingSoftGateServerContext);
}

export function MarketingHeaderGlobalRegionServerBridge({
  serverGlobalRegion,
  serverNaBillingSoftGate,
  children,
}: {
  serverGlobalRegion: GlobalRegionSlug | null;
  /** True when checkout would require `naBillingScopeAcknowledged` (matches POST union). */
  serverNaBillingSoftGate: boolean;
  children: ReactNode;
}) {
  return (
    <MarketingNaBillingSoftGateServerContext.Provider value={serverNaBillingSoftGate}>
      <MarketingHeaderGlobalRegionServerContext.Provider value={serverGlobalRegion}>
        {children}
      </MarketingHeaderGlobalRegionServerContext.Provider>
    </MarketingNaBillingSoftGateServerContext.Provider>
  );
}
