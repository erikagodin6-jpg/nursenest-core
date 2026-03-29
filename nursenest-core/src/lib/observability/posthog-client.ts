"use client";

import posthog from "posthog-js";

let initialized = false;

export function initPosthogClient(): void {
  if (initialized || typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  if (!key) return;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com";
  posthog.init(key, {
    api_host: host,
    capture_pageview: false,
    capture_pageleave: true,
    persistence: "localStorage",
    loaded: () => {
      initialized = true;
    },
  });
}

export function trackClientEvent(
  event: string,
  props?: Record<string, string | number | boolean | undefined>,
): void {
  if (!initialized || !process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  try {
    posthog.capture(event, props);
  } catch {
    // ignore
  }
}

export { posthog };
