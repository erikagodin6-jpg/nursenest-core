"use client";

import type { ReactNode } from "react";
import { BrandedLeafMark } from "@/components/ui/premium-loader/branded-leaf-mark";
import styles from "@/components/ui/premium-loader/premium-loader.module.css";
import { useDelayedLoading } from "@/components/ui/premium-loader/use-delayed-loading";
import { cn } from "@/lib/utils";

export type BrandedPageLoaderProps = {
  /** Visible while the route loading segment is mounted. */
  active?: boolean;
  /** Screen reader label for the busy region. */
  message: string;
  /** Defer brand motion / glass strip (ms). Default 320. */
  delayMs?: number;
  /** Skeleton or placeholder content; renders immediately. */
  children: ReactNode;
  /** Maximize vertical presence for app shell transitions. */
  tall?: boolean;
  /** Override inner content padding (e.g. flush when wrapping full-viewport skeletons). */
  contentClassName?: string;
  className?: string;
};

/**
 * Premium branded loading shell: immediate skeleton children + deferred leaf / glass strip
 * to avoid flicker on fast navigations. CSS-only motion (no framer-motion) for lean bundles.
 */
export function BrandedPageLoader({
  active = true,
  message,
  delayMs = 320,
  children,
  tall = false,
  contentClassName,
  className,
}: BrandedPageLoaderProps) {
  const showDeferred = useDelayedLoading(active, { delayMs });

  return (
    <section
      className={cn(styles.root, className)}
      data-nn-premium-loader="shell"
      aria-busy="true"
      aria-live="polite"
      aria-label={message}
    >
      <div
        className={cn(
          styles.body,
          tall && styles.bodyFullscreen,
          "overflow-hidden",
        )}
      >
        {showDeferred ? (
          <div className={cn(styles.glassStrip, styles.deferredChromeEnter)}>
            <div className={styles.leafCluster}>
              <span className={styles.pulseRing} aria-hidden />
              <span className={styles.leafMotion}>
                <BrandedLeafMark />
              </span>
            </div>
            <p className={styles.caption}>{message}</p>
          </div>
        ) : null}
        <div className={cn(styles.bodyPadding, contentClassName)}>{children}</div>
      </div>
    </section>
  );
}
