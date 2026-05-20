import type { Contexts, Event, ErrorEvent } from "@sentry/core";

/**
 * Remove sensitive patterns from Sentry payloads (never send tokens/passwords).
 */
export function scrubSentryEvent(event: ErrorEvent | Event): ErrorEvent | Event {
  const deny = [/password/i, /secret/i, /token/i, /authorization/i, /cookie/i, /set-cookie/i];
  const scrubUnknownRecord = <T extends Record<string, unknown> | undefined>(value: T): T => {
    if (!value) return value;
    const next = { ...value };
    for (const key of Object.keys(next)) {
      if (deny.some((r) => r.test(key))) delete next[key];
    }
    return next as T;
  };
  const scrubHeaders = (
    value: Record<string, string> | undefined,
  ): Record<string, string> | undefined => {
    if (!value) return value;
    const next = { ...value };
    for (const key of Object.keys(next)) {
      if (deny.some((r) => r.test(key))) delete next[key];
    }
    return next;
  };
  if (event.request?.headers) {
    event.request.headers = scrubHeaders(event.request.headers);
  }
  if (event.request?.cookies) {
    event.request.cookies = {};
  }
  if (event.request?.url) {
    try {
      const url = new URL(event.request.url);
      event.request.url = `${url.origin}${url.pathname}`;
    } catch {
      const [pathOnly] = event.request.url.split("?");
      event.request.url = pathOnly || event.request.url;
    }
  }
  if (event.user) {
    event.user = event.user.id ? { id: event.user.id } : {};
  }
  if (event.extra) {
    event.extra = scrubUnknownRecord(event.extra);
  }
  if (event.contexts) {
    event.contexts = scrubUnknownRecord(event.contexts as Contexts) as Contexts;
  }
  return event;
}
