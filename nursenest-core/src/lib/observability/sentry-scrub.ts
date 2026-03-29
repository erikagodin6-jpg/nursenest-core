import type { Event, ErrorEvent } from "@sentry/core";

/**
 * Remove sensitive patterns from Sentry payloads (never send tokens/passwords).
 */
export function scrubSentryEvent(event: ErrorEvent | Event): ErrorEvent | Event {
  const deny = [/password/i, /secret/i, /token/i, /authorization/i, /cookie/i, /set-cookie/i];
  if (event.request?.headers) {
    const h = { ...event.request.headers };
    for (const key of Object.keys(h)) {
      if (deny.some((r) => r.test(key))) delete h[key];
    }
    event.request.headers = h;
  }
  if (event.request?.cookies) {
    event.request.cookies = {};
  }
  return event;
}
