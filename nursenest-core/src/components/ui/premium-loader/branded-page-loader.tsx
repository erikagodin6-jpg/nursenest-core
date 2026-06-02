"use client";

import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { JitterBrandedLoaderLottie } from "@/components/ui/premium-loader/jitter-branded-loader-lottie";
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
  /**
   * Jitter / Bodymovin JSON URL or same-origin path. When omitted, uses
   * `NEXT_PUBLIC_NN_JITTER_LOTTIE_SRC` or `/animations/nursenest-loader-jitter.json`.
   */
  jitterLottieSrc?: string | null;
};

/**
 * Premium branded loading shell: immediate skeleton children + deferred leaf / glass strip
 * to avoid flicker on fast navigations. Leaf motion uses Jitter-compatible Lottie when JSON
 * loads (`lottie-react`, code-split + idle fetch); otherwise CSS + SVG leaf.
 */
export function BrandedPageLoader({
  active = true,
  message,
  delayMs = 320,
  children,
  tall = false,
  contentClassName,
  className,
  jitterLottieSrc,
}: BrandedPageLoaderProps) {
  const showDeferred = useDelayedLoading(active, { delayMs });
  const [lottieCentered, setLottieCentered] = useState(false);
  const onLottieMode = useCallback((mode: "css" | "lottie") => {
    setLottieCentered(mode === "lottie");
  }, []);

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
            <div className={styles.leafDriftTrack} aria-hidden>
              <div className={cn(styles.leafDrone, lottieCentered && styles.leafDroneNnLottie)}>
                <span className={styles.pulseRing} />
                <span className={cn(styles.leafMotion, lottieCentered && styles.leafMotionNnLottie)}>
                  <JitterBrandedLoaderLottie src={jitterLottieSrc} onModeChange={onLottieMode} />
                </span>
              </div>
            </div>
            <p className={styles.caption}>{message}</p>
          </div>
        ) : null}
        <div className={cn(styles.bodyPadding, contentClassName)}>{children}</div>
      </div>
    </section>
  );
}
