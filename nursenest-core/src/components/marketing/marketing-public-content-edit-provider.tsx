"use client";

import { createContext, useContext, type ReactNode } from "react";

type MarketingPublicContentEditContextValue = {
  isStaff: boolean;
};

const MarketingPublicContentEditContext = createContext<MarketingPublicContentEditContextValue>({
  isStaff: false,
});

export function MarketingPublicContentEditProvider({
  isStaff,
  children,
}: {
  isStaff: boolean;
  children: ReactNode;
}) {
  return (
    <MarketingPublicContentEditContext.Provider value={{ isStaff }}>
      {children}
    </MarketingPublicContentEditContext.Provider>
  );
}

export function useMarketingPublicContentEdit(): MarketingPublicContentEditContextValue {
  return useContext(MarketingPublicContentEditContext);
}
