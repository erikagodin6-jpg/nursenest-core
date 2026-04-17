import type { APIRequestContext, APIResponse } from "@playwright/test";

export type RedirectTraceResult = {
  /** Every URL visited including the final one. */
  chain: string[];
  response: APIResponse;
  finalUrl: string;
};

/**
 * Manual redirect following so we record the full chain (Playwright default collapses redirects).
 */
export async function fetchWithRedirectTrace(
  request: APIRequestContext,
  startUrl: string,
  /** Max HTTP round-trips (each redirect consumes one). */
  maxRoundTrips: number,
): Promise<RedirectTraceResult> {
  const chain: string[] = [];
  let url = startUrl;
  for (let round = 0; round < maxRoundTrips; round++) {
    const res = await request.fetch(url, {
      method: "GET",
      maxRedirects: 0,
      timeout: 60_000,
      headers: { Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" },
    });
    chain.push(url);
    const status = res.status();
    if (status >= 300 && status < 400) {
      const loc = res.headers()["location"];
      if (!loc) {
        return { chain, response: res, finalUrl: url };
      }
      url = new URL(loc, url).href;
      continue;
    }
    return { chain, response: res, finalUrl: url };
  }
  throw new Error(`redirect_exceeded_max_round_trips:${maxRoundTrips}`);
}
