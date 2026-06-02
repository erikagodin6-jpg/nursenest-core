import type { APIRequestContext } from "@playwright/test";

export type RedirectHop = {
  from: string;
  status: number;
  location: string | null;
};

export type RedirectChainResult = {
  hops: RedirectHop[];
  finalUrl: string;
  finalStatus: number;
};

/**
 * Follow HTTP redirects manually (no client auto-follow) for deterministic contract tests.
 */
export async function followHttpRedirectChain(
  request: APIRequestContext,
  startUrl: string,
  opts: { maxHops?: number; cookieHeader?: string } = {},
): Promise<RedirectChainResult> {
  const maxHops = opts.maxHops ?? 12;
  const hops: RedirectHop[] = [];
  let url = startUrl;

  for (let i = 0; i < maxHops; i++) {
    const res = await request.get(url, {
      maxRedirects: 0,
      headers: opts.cookieHeader ? { cookie: opts.cookieHeader } : undefined,
    });
    const status = res.status();
    const location = res.headers().location ?? null;
    hops.push({ from: url, status, location });

    if (status >= 300 && status < 400 && location) {
      url = new URL(location, url).href;
      continue;
    }

    return { hops, finalUrl: url, finalStatus: status };
  }

  throw new Error(`Redirect chain exceeded ${maxHops} hops from ${startUrl}`);
}

export function assertNoRedirectLoop(hops: RedirectHop[], label: string) {
  const paths = hops
    .map((h) => {
      try {
        return new URL(h.from).pathname;
      } catch {
        return h.from;
      }
    })
    .filter(Boolean);
  const seen = new Set<string>();
  for (const p of paths) {
    if (seen.has(p)) {
      throw new Error(`${label}: redirect loop detected at ${p} — chain: ${JSON.stringify(hops)}`);
    }
    seen.add(p);
  }
}
