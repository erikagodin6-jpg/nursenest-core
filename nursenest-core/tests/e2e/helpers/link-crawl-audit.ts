import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { APIRequestContext, Page } from "@playwright/test";
import { absoluteUrl } from "./auth-audit";

const OUT = path.join("test-results", "link-crawl-audit");
const SHOTS = path.join(OUT, "screenshots");

export type LinkCrawlRow = {
  sourcePage: string;
  linkText: string;
  href: string;
  /** Resolved request URL (pathname+search; hash stripped for HTTP) */
  requestUrl: string;
  resultStatus: string;
  httpStatus: number | null;
  finalUrlAfterRedirects: string | null;
  kind: "http" | "anchor" | "button" | "same-page";
  screenshotPath?: string;
};

export function normalizePathname(p: string): string {
  try {
    const x = p.replace(/\/$/, "") || "/";
    return x;
  } catch {
    return p;
  }
}

export function isInternalHref(href: string, origin: string): boolean {
  try {
    const u = new URL(href, origin);
    if (u.protocol === "mailto:" || u.protocol === "tel:" || u.protocol === "javascript:") return false;
    return u.origin === new URL(origin).origin;
  } catch {
    return false;
  }
}

export type FetchHeadResult = {
  status: number;
  finalUrl: string;
  redirected: boolean;
};

const fetchCache = new Map<string, FetchHeadResult>();

export async function fetchInternalUrl(request: APIRequestContext, absoluteUrlToFetch: string): Promise<FetchHeadResult> {
  const key = absoluteUrlToFetch.split("#")[0]!;
  if (fetchCache.has(key)) return fetchCache.get(key)!;
  try {
    const resp = await request.get(key, { maxRedirects: 10, timeout: 30_000 });
    const status = resp.status();
    const finalUrl = resp.url();
    const redirected = normalizePathname(new URL(key).pathname) !== normalizePathname(new URL(finalUrl).pathname);
    const out = { status, finalUrl, redirected };
    fetchCache.set(key, out);
    return out;
  } catch {
    /** Do not cache failures — allows a follow-up retry under load. */
    return { status: 0, finalUrl: key, redirected: false };
  }
}

export async function captureLinkIssueShot(page: Page, slug: string): Promise<string> {
  await mkdir(SHOTS, { recursive: true });
  const safe = slug.replace(/[^\w-]+/g, "_").slice(0, 100);
  const fp = path.join(SHOTS, `${safe}-${randomUUID().slice(0, 8)}.png`);
  await page.screenshot({ path: fp, fullPage: false });
  return fp;
}

export async function writeLinkCrawlReport(rows: LinkCrawlRow[], baseURL: string): Promise<{ json: string; md: string }> {
  await mkdir(OUT, { recursive: true });
  const jsonPath = path.join(OUT, "link-crawl-audit-report.json");
  const mdPath = path.join(OUT, "link-crawl-audit-report.md");
  const issueRows = rows.filter((r) => !r.resultStatus.startsWith("OK"));
  const payload = {
    generatedAt: new Date().toISOString(),
    baseURL,
    summary: {
      totalRows: rows.length,
      issueRows: issueRows.length,
    },
    rows,
    issueRows,
  };
  await writeFile(jsonPath, JSON.stringify(payload, null, 2), "utf8");

  const esc = (s: string) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
  const rowLine = (r: LinkCrawlRow) =>
    `| ${esc(r.sourcePage)} | ${esc(r.linkText.slice(0, 120))} | ${esc(r.href)} | ${esc(r.resultStatus)} | ${r.screenshotPath ? esc(r.screenshotPath) : "—"} |`;
  const md = [
    "# Link crawl audit",
    "",
    `Base URL: \`${esc(baseURL)}\``,
    "",
    `Rows: ${payload.summary.totalRows} · rows with non-OK status: ${payload.summary.issueRows}`,
    "",
    "| Source | Text | href | Status | Screenshot |",
    "|---|---|---|---|---|",
    ...rows.map(rowLine),
    "",
    "## Issues only (non-OK)",
    "",
    "| Source | Text | href | Status | Screenshot |",
    "|---|---|---|---|---|",
    ...issueRows.map(rowLine),
    "",
  ].join("\n");
  await writeFile(mdPath, md, "utf8");
  return { json: jsonPath, md: mdPath };
}

export function absoluteFromSeed(pathOrUrl: string, base: string): string {
  return absoluteUrl(pathOrUrl, base);
}

/** Bounded parallelism for HTTP checks (Playwright request context is thread-safe). */
export async function runWithConcurrency<T>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<void>,
): Promise<void> {
  if (items.length === 0) return;
  const c = Math.max(1, Math.min(concurrency, items.length));
  let idx = 0;
  const worker = async () => {
    for (;;) {
      const j = idx++;
      if (j >= items.length) break;
      await fn(items[j]!);
    }
  };
  await Promise.all(Array.from({ length: c }, () => worker()));
}
