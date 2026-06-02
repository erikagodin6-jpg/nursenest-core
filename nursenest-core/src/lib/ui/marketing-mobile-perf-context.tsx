"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * Set only under marketing layouts via {@link MarketingMobileMotionShell}.
 * `undefined` — outside marketing (e.g. learner app): motion behaves as before.
 */
const MarketingMobilePerfContext = createContext<boolean | undefined>(undefined);

export function MarketingMobilePerfProvider({
  value,
  children,
}: {
  value: boolean;
  children: ReactNode;
}) {
  return <MarketingMobilePerfContext.Provider value={value}>{children}</MarketingMobilePerfContext.Provider>;
}

/** `true` when marketing shell + narrow viewport; `undefined` when not under the provider. */
export function useMarketingMobilePerfIsMobile() {
  return useContext(MarketingMobilePerfContext);
}
