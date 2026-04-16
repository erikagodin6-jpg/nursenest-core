#!/usr/bin/env npx tsx
/**
 * Build-time / CI link integrity: HEAD/GET a bounded set of public URLs derived from the same
 * published-only pathway list as marketing (snapshot readiness), plus core marketing roots.
 *
 * Usage:
 *   BASE_URL=https://www.nursenest.ca npm run audit:links
 *   npm run audit:links   # defaults to http://127.0.0.1:3000 (dev server must be up)
 *
 * Does not crawl the full DOM — deterministic URL list only (performance-safe).
 */
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { listPublishedExamPathwaysForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";
import { listPublishedExpansionExamMarketingPaths } from "@/lib/marketing/published-regional-marketing-urls";

const DEFAULT_ORIGIN = process.env.BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:3000";
const TIMEOUT_MS = 25_000;
const FAIL_ON_ERROR = process.env.AUDIT_LINKS_STRICT === "1";

function collectCandidateUrls(origin: string): string[] {
  const urls = new Set<string>();
  const add = (path: string) => {
    if (!path.startsWith("/")) return;
    urls.add(`${origin}${path}`);
  };

  add("/");
  add("/lessons");
  add("/pricing");
  add("/login");
  add("/signup");

  for (const p of listPublishedExamPathwaysForPublicSite()) {
    add(buildExamPathwayPath(p));
    add(buildExamPathwayPath(p, "lessons"));
    add(buildExamPathwayPath(p, "questions"));
    add(buildExamPathwayPath(p, "pricing"));
  }

  for (const path of listPublishedExpansionExamMarketingPaths()) {
    add(path);
  }

  return [...urls].sort((a, b) => a.localeCompare(b));
}

async function checkUrl(url: string): Promise<{ url: string; status: number; ok: boolean; detail?: string }> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: ctrl.signal,
      headers: { Accept: "text/html,application/xhtml+xml" },
    });
    const ok = res.status >= 200 && res.status < 400;
    return { url, status: res.status, ok };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { url, status: 0, ok: false, detail: msg };
  } finally {
    clearTimeout(t);
  }
}

async function main() {
  const origin = DEFAULT_ORIGIN;
  const urls = collectCandidateUrls(origin);
  console.log(`Link integrity: ${urls.length} URLs against ${origin}`);

  const results = await Promise.all(urls.map((u) => checkUrl(u)));
  const bad: typeof results = [];
  for (const r of results) {
    if (!r.ok) {
      bad.push(r);
      console.error(`FAIL ${r.status}\t${r.url}${r.detail ? `\t${r.detail}` : ""}`);
    } else {
      console.log(`OK   ${r.status}\t${r.url}`);
    }
  }

  console.log(`\nSummary: ${bad.length} failed, ${results.length - bad.length} ok`);
  if (FAIL_ON_ERROR && bad.length > 0) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
