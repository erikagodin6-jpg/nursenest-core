"use client";

import type { ReactNode } from "react";
import { PageTransitionShell } from "@/lib/motion/page-transition-shell";
import { MarketingMobilePerfProvider } from "@/lib/ui/marketing-mobile-perf-context";
import { useIsMobile } from "@/lib/ui/use-is-mobile";

/**
 * Marketing-only: provides mobile viewport flag for motion/carousel budget,
 * and wraps the route transition shell.
 */
export function MarketingMobileMotionShell({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  return (
    <MarketingMobilePerfProvider value={isMobile}>
      <PageTransitionShell>{children}</PageTransitionShell>
    </MarketingMobilePerfProvider>
  );
}
