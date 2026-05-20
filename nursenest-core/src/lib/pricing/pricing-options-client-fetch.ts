"use client";

/**
 * Dedupe concurrent in-flight fetches of display pricing (StrictMode double-mount, rapid remounts).
 * Response body is consumed once and cloned to JSON for each waiter.
 */
export type PricingOptionsClientPayload = Record<string, unknown>;

let inflight: Promise<PricingOptionsClientPayload> | null = null;

export function fetchPricingOptionsPayloadDeduped(): Promise<PricingOptionsClientPayload> {
  if (!inflight) {
    inflight = (async () => {
      const res = await fetch("/api/pricing/options", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`load_failed:${res.status}`);
      }
      return (await res.json()) as PricingOptionsClientPayload;
    })().finally(() => {
      queueMicrotask(() => {
        inflight = null;
      });
    });
  }
  return inflight;
}
