"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CountryCode } from "@/lib/marketing/countries/types";

const MarketingCountryChromeContext = createContext<CountryCode>("canada");

export function MarketingCountryChromeProvider({
  country,
  children,
}: {
  country: CountryCode;
  children: ReactNode;
}) {
  return <MarketingCountryChromeContext.Provider value={country}>{children}</MarketingCountryChromeContext.Provider>;
}

export function useMarketingChromeCountry(): CountryCode {
  return useContext(MarketingCountryChromeContext);
}
