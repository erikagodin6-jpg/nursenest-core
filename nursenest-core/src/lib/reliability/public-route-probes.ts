import { fetchWithTimeout } from "@/lib/reliability/fetch-with-timeout";
import { analyzeProbeHtml, extractHtmlTitle } from "@/lib/reliability/probe-content-guards";

export const DEFAULT_PUBLIC_ROUTE_PATHS = [
  "/",
  "/sitemap.xml",
  "/robots.txt",
  "/pricing",
  "/blog",
  "/ca/rn",
  "/ca/rpn",
  "/ca/np",
  "/ca/new-grad",
  "/ca/allied-health",
] as const;

export type PublicRouteProbeResult = {
  kind: "public";
  path: string;
  requestedUrl: string;
  finalUrl: string;
  status: number;
  durationMs: number;
  ok: boolean;
  issues: string[];
  title: string | null;
};

export type SitemapProbeResult = {
  kind: "sitemap";
  path: "/sitemap.xml";
  requestedUrl: string;
  finalUrl: string;
  status: number;
  durationMs: number;
  ok: boolean;
  issues: string[];
};

export type PricingProbeResult = {
  kind: "pricing";
  path: "/pricing";
  requestedUrl: string;
  finalUrl: string;
  status: number;
  durationMs: number;
  ok: boolean;
  issues: string[];
  title: string | null;
};

export type PublicRouteProbeReport = {
  checkedAt: string;
  baseUrl: string;
  probes: PublicRouteProbeResult[];
  failures: string[];
  warnings: string[];
  ok: boolean;
};

function joinBaseAndPath(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

function sameOrigin(finalUrl: string, baseUrl: string): boolean {
  try {
    return new URL(finalUrl).origin === new URL(baseUrl).origin;
  } catch {
    return false;
  }
}

async function probeOnePublicPath(baseUrl: string, path: string): Promise<PublicRouteProbeResult> {
  const requestedUrl = joinBaseAndPath(baseUrl, path);
  const started = Date.now();
  let status = 0;
  let finalUrl = requestedUrl;
  let body = "";
  try {
    const res = await fetchWithTimeout(requestedUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        Accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8",
        "User-Agent": "NurseNest-ReliabilityProbe/1.0",
      },
    });
    status = res.status;
    finalUrl = res.url;
    body = await res.text();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      kind: "public",
      path,
      requestedUrl,
      finalUrl,
      status,
      durationMs: Date.now() - started,
      ok: false,
      issues: [`${path}: fetch_failed:${msg}`],
      title: null,
    };
  }

  const issues: string[] = [];
  if (!sameOrigin(finalUrl, baseUrl)) {
    issues.push(`${path}: final_url_cross_origin:${finalUrl}`);
  }
  if (status < 200 || status >= 400) {
    issues.push(`${path}: unexpected_status:${status}`);
  }

  const isTextLike =
    path.endsWith(".xml") || path.endsWith(".txt") || path === "/robots.txt" || path.endsWith("/sitemap.xml");
  if (!isTextLike) {
    issues.push(...analyzeProbeHtml(path, body));
    const title = extractHtmlTitle(body);
    if (!title) {
      issues.push(`${path}: missing_document_title`);
    }
    return {
      kind: "public",
      path,
      requestedUrl,
      finalUrl,
      status,
      durationMs: Date.now() - started,
      ok: issues.length === 0,
      issues,
      title: title ?? null,
    };
  }

  const plain = body.replace(/\u0000/g, " ").slice(0, 500_000);
  issues.push(...analyzeProbeHtml(path, plain));
  return {
    kind: "public",
    path,
    requestedUrl,
    finalUrl,
    status,
    durationMs: Date.now() - started,
    ok: issues.length === 0,
    issues,
    title: null,
  };
}

export async function runPublicRouteProbes(baseUrl: string): Promise<PublicRouteProbeReport> {
  const checkedAt = new Date().toISOString();
  const probes: PublicRouteProbeResult[] = [];
  const failures: string[] = [];
  const warnings: string[] = [];

  for (const path of DEFAULT_PUBLIC_ROUTE_PATHS) {
    const row = await probeOnePublicPath(baseUrl, path);
    probes.push(row);
    if (!row.ok) {
      for (const issue of row.issues) failures.push(issue);
    }
    if (row.durationMs > 12_000) {
      warnings.push(`${path}: slow_probe_ms:${row.durationMs}`);
    }
  }

  return {
    checkedAt,
    baseUrl,
    probes,
    failures,
    warnings,
    ok: failures.length === 0,
  };
}

export async function runSitemapProbe(baseUrl: string): Promise<SitemapProbeResult> {
  const path = "/sitemap.xml" as const;
  const requestedUrl = joinBaseAndPath(baseUrl, path);
  const started = Date.now();
  let status = 0;
  let finalUrl = requestedUrl;
  let body = "";
  try {
    const res = await fetchWithTimeout(requestedUrl, {
      method: "GET",
      redirect: "follow",
      headers: { Accept: "application/xml,text/xml,*/*", "User-Agent": "NurseNest-ReliabilityProbe/1.0" },
    });
    status = res.status;
    finalUrl = res.url;
    body = await res.text();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      kind: "sitemap",
      path,
      requestedUrl,
      finalUrl,
      status,
      durationMs: Date.now() - started,
      ok: false,
      issues: [`sitemap: fetch_failed:${msg}`],
    };
  }

  const issues: string[] = [];
  if (!sameOrigin(finalUrl, baseUrl)) {
    issues.push(`sitemap: final_url_cross_origin:${finalUrl}`);
  }
  if (status < 200 || status >= 400) {
    issues.push(`sitemap: unexpected_status:${status}`);
  }
  const head = body.slice(0, 4000).trimStart().toLowerCase();
  if (!head.includes("<?xml") && !head.includes("<urlset")) {
    issues.push("sitemap: body_missing_xml_urlset");
  }
  issues.push(...analyzeProbeHtml("sitemap.xml", body));

  return {
    kind: "sitemap",
    path,
    requestedUrl,
    finalUrl,
    status,
    durationMs: Date.now() - started,
    ok: issues.length === 0,
    issues,
  };
}

export async function runPricingProbe(baseUrl: string): Promise<PricingProbeResult> {
  const path = "/pricing" as const;
  const requestedUrl = joinBaseAndPath(baseUrl, path);
  const started = Date.now();
  let status = 0;
  let finalUrl = requestedUrl;
  let body = "";
  try {
    const res = await fetchWithTimeout(requestedUrl, {
      method: "GET",
      redirect: "follow",
      headers: { Accept: "text/html,*/*", "User-Agent": "NurseNest-ReliabilityProbe/1.0" },
    });
    status = res.status;
    finalUrl = res.url;
    body = await res.text();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      kind: "pricing",
      path,
      requestedUrl,
      finalUrl,
      status,
      durationMs: Date.now() - started,
      ok: false,
      issues: [`pricing: fetch_failed:${msg}`],
      title: null,
    };
  }

  const issues: string[] = [];
  if (!sameOrigin(finalUrl, baseUrl)) {
    issues.push(`pricing: final_url_cross_origin:${finalUrl}`);
  }
  if (status < 200 || status >= 400) {
    issues.push(`pricing: unexpected_status:${status}`);
  }
  issues.push(...analyzeProbeHtml("/pricing", body));
  const title = extractHtmlTitle(body);
  if (!title) issues.push("pricing: missing_document_title");

  return {
    kind: "pricing",
    path,
    requestedUrl,
    finalUrl,
    status,
    durationMs: Date.now() - started,
    ok: issues.length === 0,
    issues,
    title: title ?? null,
  };
}
