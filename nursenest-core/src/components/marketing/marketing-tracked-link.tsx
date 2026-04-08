"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackClientEvent } from "@/lib/observability/posthog-client";

type Props = {
  href: string;
  event: string;
  eventProps?: Record<string, string | number | boolean | undefined>;
  /** Optional second capture (e.g. funnel alias) — still O(1); PostHog batches network I/O. */
  secondaryCapture?: { event: string; eventProps?: Record<string, string | number | boolean | undefined> };
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  "data-testid"?: string;
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
  children,
  ...rest
}: Props) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        trackClientEvent(event, eventProps);
        if (secondaryCapture) trackClientEvent(secondaryCapture.event, secondaryCapture.eventProps);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
