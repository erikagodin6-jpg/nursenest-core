import "server-only";

/** Cache policy for authenticated subscriber / entitlement-gated API responses. */
export const SUBSCRIBER_CACHE_CONTROL = "private, no-store";

export function mergeSubscriberPrivateCacheHeaders(base?: HeadersInit): Headers {
  const h = new Headers(base ?? undefined);
  h.set("Cache-Control", SUBSCRIBER_CACHE_CONTROL);
  return h;
}
