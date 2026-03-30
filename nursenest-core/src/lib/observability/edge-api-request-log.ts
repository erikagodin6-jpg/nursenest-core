/**
 * Edge-safe (no Sentry / Node-only imports). Used from `src/proxy.ts` for `/api/*` request visibility.
 * Log drains receive JSON lines; not merged into the Node observation ring.
 */
export function logEdgeApiRequestStart(pathname: string, method: string): void {
  console.error(
    JSON.stringify({
      v: 1,
      ts: new Date().toISOString(),
      source: "edge",
      service: "nursenest-core",
      event: "api_request_start",
      pathname: pathname.slice(0, 240),
      method: method.slice(0, 16),
    }),
  );
}
