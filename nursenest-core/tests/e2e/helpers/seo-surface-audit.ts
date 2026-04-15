import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { Page } from "@playwright/test";
import { absoluteUrl } from "./auth-audit";

const OUT = path.join("test-results", "seo-audit");
const SHOTS = path.join(OUT, "screenshots");

export type HeadSignals = {
  title: string;
  metaDescription: string | null;
  canonical: string | null;
  alternates: { hreflang: string; href: string }[];
  robots: string | null;
  h1Count: number;
  h2Count: number;
  h1Texts: string[];
};

export type SeoRouteConfig = {
  path: string;
  /** Marketing pages that should be indexed */
  mustBeIndexable: boolean;
  /** Expect `<link rel="canonical">` */
  expectCanonical: boolean;
  /** Minimum `link[rel="alternate"][hreflang]` rows (0 = auth-only / special) */
  minAlternateLinks: number;
  /** Expect visible `nav[aria-label="Breadcrumb"]` */
  expectBreadcrumb: boolean;
  /** Minimum same-origin `a[href^="/"]` in main (rough internal-link signal) */
  minInternalLinks: number;
};

export type SeoCheckKey =
  | "http_200"
  | "title_present"
  | "title_not_generic"
  | "meta_description"
  | "canonical"
  | "hreflang_alternates"
  | "robots_indexability"
  | "heading_h1_reasonable"
  | "internal_links"
  | "breadcrumb_when_expected";

export type SeoRouteResult = {
  route: string;
  finalUrl: string;
  httpStatus: number | null;
  checks: Record<SeoCheckKey, boolean>;
  flags: string[];
  head: HeadSignals | null;
  mainTextLength: number;
  internalLinkCount: number;
  screenshotPath?: string;
};

const GENERIC_TITLE = /^(untitled|nursenest\s*$|nursenest\s*\|\s*nursenest|next\.js|create next app)/i;

export function isGenericTitle(title: string): boolean {
  const t = title.trim();
  if (t.length < 8) return true;
  return GENERIC_TITLE.test(t);
}

export async function extractHeadSignals(page: Page): Promise<HeadSignals> {
  return page.evaluate(() => {
    const title = document.title || "";
    const metaDescription =
      document.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() ?? null;
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href")?.trim() ?? null;
    const alternates = [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => ({
      hreflang: l.getAttribute("hreflang") || "",
      href: l.getAttribute("href") || "",
    }));
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute("content")?.trim() ?? null;
    const h1Els = [...document.querySelectorAll("h1")];
    const h1Texts = h1Els.map((h) => (h.textContent || "").trim()).filter(Boolean);
    return {
      title,
      metaDescription,
      canonical,
      alternates,
      robots,
      h1Count: h1Els.length,
      h2Count: document.querySelectorAll("h2").length,
      h1Texts,
    };
  });
}

export async function captureSeoScreenshot(page: Page, routeSlug: string): Promise<string> {
  await mkdir(SHOTS, { recursive: true });
  const safe = routeSlug.replace(/[^\w-]+/g, "_").slice(0, 120) || "route";
  const fp = path.join(SHOTS, `${safe}-${randomUUID().slice(0, 8)}.png`);
  await page.screenshot({ path: fp, fullPage: false });
  return fp;
}

export async function writeSeoAuditReport(
  results: SeoRouteResult[],
  baseURL: string,
): Promise<{ json: string; md: string }> {
  await mkdir(OUT, { recursive: true });
  const jsonPath = path.join(OUT, "seo-surface-audit-report.json");
  const mdPath = path.join(OUT, "seo-surface-audit-report.md");

  const summary = {
    total: results.length,
    allChecksPass: results.filter((r) => Object.values(r.checks).every(Boolean)).length,
    anyFlag: results.filter((r) => r.flags.length > 0).length,
  };

  await writeFile(
    jsonPath,
    JSON.stringify({ generatedAt: new Date().toISOString(), baseURL, summary, results }, null, 2),
    "utf8",
  );

  const esc = (s: string) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
  const checkLine = (r: SeoRouteResult) =>
    Object.entries(r.checks)
      .filter(([, v]) => !v)
      .map(([k]) => k)
      .join(", ") || "all pass";

  const md = [
    "# SEO surface audit",
    "",
    `Base URL: \`${esc(baseURL)}\``,
    "",
    `Routes: ${summary.total} · routes with all checks pass: ${summary.allChecksPass} · routes with flags: ${summary.anyFlag}`,
    "",
    "| Route | HTTP | Checks failed | Flags | Screenshot |",
    "|---|---:|---|---|---|",
    ...results.map((r) => {
      const failed = checkLine(r);
      const shot = r.screenshotPath ? esc(r.screenshotPath) : "—";
      return `| \`${esc(r.route)}\` | ${r.httpStatus ?? "—"} | ${failed === "all pass" ? "—" : esc(failed)} | ${esc(r.flags.join("; ") || "—")} | ${shot} |`;
    }),
    "",
    "## Detail",
    "",
    ...results.map((r) => {
      const h = r.head;
      const meta = h
        ? `title: ${esc(h.title.slice(0, 120))}${h.title.length > 120 ? "…" : ""} · desc: ${h.metaDescription ? `${esc(h.metaDescription.slice(0, 80))}…` : "MISSING"} · canonical: ${h.canonical ? "yes" : "no"} · alternates: ${h.alternates.length} · robots: ${h.robots ?? "—"} · h1: ${h.h1Count}`
        : "no head extract";
      return [`### \`${esc(r.route)}\` (${r.finalUrl})`, "", meta, "", `Main text length: ${r.mainTextLength} · internal links: ${r.internalLinkCount}`, ""].join("\n");
    }),
  ].join("\n");

  await writeFile(mdPath, md, "utf8");
  return { json: jsonPath, md: mdPath };
}

export function buildAbsolutePath(pathname: string, base: string): string {
  return absoluteUrl(pathname, base);
}
