"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
import { MarketingMobilePerfProvider } from "@/lib/ui/marketing-mobile-perf-context";

/**
 * Framer route shell is desktop-only: dynamic import keeps `framer-motion` off the network/parse
 * path when `narrow` stays true (SSR hint + `matchMedia` — marketing-only).
 */
const PageTransitionShellLazy = dynamic(
  () =>
    import("@/lib/motion/page-transition-shell").then((mod) => ({
      default: mod.PageTransitionShell,
    })),
  { ssr: false },
);

/**
 * Marketing-only: narrow viewport for motion/carousel + homepage gating.
 * `serverNarrowViewportHint` comes from Edge `proxy` (`x-nn-marketing-narrow-viewport-hint`) so the
 * first paint matches mobile layout without waiting for `matchMedia`. Client syncs on resize.
 *
 * CLS guard: `narrow || !mounted` renders children directly until hydration completes.
 * Without it, `PageTransitionShellLazy` mounts as null (ssr:false) then swaps in the Framer
 * wrapper, causing a layout shift on the first paint frame on desktop. The single extra
 * re-render when `mounted` flips is negligible vs the CLS saved.
 *
 * CLS guard (Phase 2): `mounted` is only set true AFTER the framer-motion chunk is pre-loaded
 * into the browser module cache. This eliminates the null-loading-state window that previously
 * caused content to vanish during the switch from `children` to `<PageTransitionShellLazy>`.
 * On mobile (`narrow=true`), `mounted` is set immediately (framer-motion is never used).
 */
export function MarketingMobileMotionShell({
  children,
  serverNarrowViewportHint = false,
}: {
  children: ReactNode;
  serverNarrowViewportHint?: boolean;
}) {
  const [narrow, setNarrow] = useState(serverNarrowViewportHint);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);

    if (mq.matches) {
      // Mobile: set mounted immediately — PageTransitionShellLazy is never used on mobile.
      setMounted(true);
    } else {
      // Desktop: pre-load the framer-motion chunk before switching to PageTransitionShellLazy.
      // When the module is already cached, PageTransitionShellLazy renders synchronously on
      // the next React render — no null-loading-state gap, no CLS spike.
      void import("@/lib/motion/page-transition-shell").then(() => {
        setMounted(true);
      }).catch(() => {
        // Fallback: mount without pre-load if import fails.
        setMounted(true);
      });
    }

    return () => mq.removeEventListener("change", sync);
  }, []);
  return (
    <MarketingMobilePerfProvider value={narrow}>
      {narrow || !mounted ? children : <PageTransitionShellLazy>{children}</PageTransitionShellLazy>}
    </MarketingMobilePerfProvider>
  );
}
