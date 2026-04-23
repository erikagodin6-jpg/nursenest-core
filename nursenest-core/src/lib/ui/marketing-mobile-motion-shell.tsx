"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PageTransitionShell } from "@/lib/motion/page-transition-shell";
import { MarketingMobilePerfProvider } from "@/lib/ui/marketing-mobile-perf-context";

/**
 * Marketing-only: narrow viewport for motion/carousel + homepage gating.
 * `serverNarrowViewportHint` comes from Edge `proxy` (`x-nn-marketing-narrow-viewport-hint`) so the
 * first paint matches mobile layout without waiting for `matchMedia`. Client syncs on resize.
 */
export function MarketingMobileMotionShell({
  children,
  serverNarrowViewportHint = false,
}: {
  children: ReactNode;
  serverNarrowViewportHint?: boolean;
}) {
  const [narrow, setNarrow] = useState(serverNarrowViewportHint);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return (
    <MarketingMobilePerfProvider value={narrow}>
      <PageTransitionShell>{children}</PageTransitionShell>
    </MarketingMobilePerfProvider>
  );
}
