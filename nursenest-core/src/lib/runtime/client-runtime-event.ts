"use client";

import { trackClientEvent } from "@/lib/observability/posthog-client";

type RuntimeEventPayload = Record<string, string | number | boolean | null | undefined>;

function isSafariUserAgent(ua: string): boolean {
  return /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox/i.test(ua);
}

function compactPayload(payload: RuntimeEventPayload = {}): Record<string, string | number | boolean | undefined> {
  const out: Record<string, string | number | boolean | undefined> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value == null) continue;
    out[key] = typeof value === "string" ? value.slice(0, 240) : value;
  }
  if (typeof window !== "undefined") {
    const ua = navigator.userAgent || "";
    out.route = window.location.pathname.slice(0, 240);
    out.isSafari = isSafariUserAgent(ua);
    out.userAgent = ua.slice(0, 180);
  }
  return out;
}

export function emitRuntimeEvent(event: string, payload?: RuntimeEventPayload): void {
  const props = compactPayload(payload);
  if (process.env.NODE_ENV !== "production") {
    console.info(`[nn-runtime] ${event}`, props);
  }
  void trackClientEvent(event, props);
}
