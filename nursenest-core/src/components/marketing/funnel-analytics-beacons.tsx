"use client";

import posthog from "posthog-js";
import { useEffect, useRef } from "react";
import { initPosthogClient } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";

function captureWhenConfigured(event: string, props: Record<string, string | number | boolean | undefined>) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim()) return;
  initPosthogClient();
  try {
    posthog.capture(event, props);
  } catch {
    // no-op
  }
}

/** One lightweight capture per homepage load (marketing region = US | CA). */
export function FunnelHomepageViewBeacon({ marketingRegion }: { marketingRegion: "US" | "CA" }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    captureWhenConfigured(PH.funnelHomepageViewed, { marketing_region: marketingRegion });
  }, [marketingRegion]);
  return null;
}

/** Exam pathway marketing hub overview — once per mount. */
export function FunnelExamHubViewBeacon({
  pathwayId,
  hubPath,
  countrySlug,
}: {
  pathwayId: string;
  hubPath: string;
  countrySlug: string;
}) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    captureWhenConfigured(PH.funnelExamHubViewed, {
      pathway_id: pathwayId,
      hub_path: hubPath,
      country_slug: countrySlug,
    });
  }, [pathwayId, hubPath, countrySlug]);
  return null;
}
