/**
 * Normalize `req.url` for bootstrap liveness/readiness matching (GET/HEAD on public listener).
 * Shared with `start-standalone.mjs` and unit tests so path rules cannot drift.
 *
 * @param {import("node:http").IncomingMessage | { url?: string }} req
 * @returns {string}
 */
export function normalizeBootstrapProbePathname(req) {
  const raw = typeof req?.url === "string" ? req.url : "";
  const noQueryHash = raw.split("?")[0].split("#")[0];
  let pathname = noQueryHash;
  if (!pathname.startsWith("/")) {
    const abs = /^https?:\/\/[^/]+(\/.*)?$/i.exec(pathname);
    pathname = abs && abs[1] && abs[1].length > 0 ? abs[1] : abs ? "/" : pathname;
  }
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }
  return pathname;
}
