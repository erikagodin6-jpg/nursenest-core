"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { PublicHomeStatsPayload } from "@/lib/marketing/public-home-stats";

const PaywallHomeStatsContext = createContext<PublicHomeStatsPayload | null>(null);

export function PaywallHomeStatsProvider({
  value,
  children,
}: {
  value: PublicHomeStatsPayload;
  children: ReactNode;
}) {
  return <PaywallHomeStatsContext.Provider value={value}>{children}</PaywallHomeStatsContext.Provider>;
}

export function usePaywallHomeStats(): PublicHomeStatsPayload {
  const v = useContext(PaywallHomeStatsContext);
  if (v == null) {
    throw new Error("usePaywallHomeStats must be used under PaywallHomeStatsProvider (learner layout)");
  }
  return v;
}
