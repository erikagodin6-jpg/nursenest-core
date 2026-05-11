"use client";

import type React from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useMarketingMobilePerfIsMobile } from "@/lib/ui/marketing-mobile-perf-context";
import { trackProductEvent } from "@/lib/observability/product-analytics";

type Props = {
  href: string;
  event: string;
  eventProps?: Record<string, string | number | boolean | undefined>;
  /** Optional second capture (e.g. funnel alias) — still O(1); PostHog batches network I/O. */
  secondaryCapture?: { event: string; eventProps?: Record<string, string | number | boolean | undefined> };
  className?: string;
  style?: React.CSSProperties;
  /** Forwarded to Next.js `Link` (both perf branches). */
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

/**
 * Internal marketing link with optional PostHog capture (no-op when PostHog is off).
 */
export function MarketingTrackedLink({
  href,
  event,
  eventProps,
  secondaryCapture,
  className,
  prefetch,
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
      onClick={() => {
        trackProductEvent(event, eventProps);
        if (secondaryCapture) trackProductEvent(secondaryCapture.event, secondaryCapture.eventProps);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
