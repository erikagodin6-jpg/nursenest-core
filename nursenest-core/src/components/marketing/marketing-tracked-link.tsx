"use client";

import type React from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useMarketingMobilePerfIsMobile } from "@/lib/ui/marketing-mobile-perf-context";

type MarketingEventProps = Record<string, string | number | boolean | undefined>;

type Props = {
  href: string;
  event: string;
  eventProps?: MarketingEventProps;
  /** Optional second capture (e.g. funnel alias) — still O(1); PostHog batches network I/O. */
  secondaryCapture?: { event: string; eventProps?: MarketingEventProps };
  className?: string;
  style?: React.CSSProperties;
  /**
   * Forwarded to Next.js `Link`.
   * Defaults to false because dense marketing CTA grids can trigger large
   * prefetch waterfalls during Lighthouse's critical window.
   */
  prefetch?: boolean;
  children: ReactNode;
  "aria-label"?: string;
  "data-testid"?: string;
  /** Stable QA hooks for homepage exam grid (region + card id) — HTTP/Playwright regression. */
  "data-nn-marketing-region"?: "US" | "CA";
  "data-nn-exam-card-id"?: string;
  /** Homepage tier pathway cards (RN, PN, NP, …) for routing integrity tests. */
  "data-nn-home-tier-card"?: string;
};

function captureMarketingLinkEvent(
  event: string,
  eventProps?: MarketingEventProps,
  secondaryCapture?: { event: string; eventProps?: MarketingEventProps },
): void {
  void import("@/lib/observability/product-analytics")
    .then(({ trackProductEvent }) => {
      trackProductEvent(event, eventProps);
      if (secondaryCapture) trackProductEvent(secondaryCapture.event, secondaryCapture.eventProps);
    })
    .catch(() => {});
}

/**
 * Internal marketing link with optional PostHog capture.
 * Analytics is deferred until click and route prefetch defaults off so the
 * homepage does not eagerly pull many destination chunks into the initial PSI run.
 */
export function MarketingTrackedLink({
  href,
  event,
  eventProps,
  secondaryCapture,
  className,
  prefetch = false,
  children,
  ...rest
}: Props) {
  const marketingNarrow = useMarketingMobilePerfIsMobile() === true;

  if (marketingNarrow) {
    return (
      <Link href={href} className={className} prefetch={prefetch} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      prefetch={prefetch}
      onClick={() => captureMarketingLinkEvent(event, eventProps, secondaryCapture)}
      {...rest}
    >
      {children}
    </Link>
  );
}
