#!/usr/bin/env npx tsx
/**
 * Fetches public routes from BASE_URL and rejects leaked i18n keys / placeholder copy.
 * Run with a live `next start` or production origin:
 *   PRODUCTION_SURFACE_HTTP=1 BASE_URL=http://127.0.0.1:3000 npx tsx scripts/validate-production-public-html.mts
 */
import {
  collectForbiddenProductionTextViolations,
  htmlToProbePlainText,
} from "../src/lib/validation/forbidden-production-text";
import {
  getProductionSmokePublicPaths,
  PRODUCTION_ROUTE_HTML_SUBSTRING_ASSERTIONS,
} from "../src/lib/validation/production-public-route-manifest";

const baseRaw = (process.env.BASE_URL ?? process.env.SITEMAP_VALIDATE_URL ?? "http://127.0.0.1:3000").trim();
const base = baseRaw.replace(/\/+$/, "");

async function fetchText(path: string): Promise<{ status: number; body: string; ct: string }> {
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, { redirect: "follow", headers: { "user-agent": "nursenest-validate-production-surface/1" } });
  const ct = res.headers.get("content-type") ?? "";
  const body = await res.text();
  return { status: res.status, body, ct };
}

async function main() {
  const failures: string[] = [];
  const paths = getProductionSmokePublicPaths();

  for (const path of paths) {
    let status = 0;
    let body = "";
    let ct = "";
    try {
      ({ status, body, ct } = await fetchText(path));
    } catch (e) {
      failures.push(`${path}: fetch error: ${e instanceof Error ? e.message : String(e)}`);
      continue;
    }

    if (status >= 500) failures.push(`${path}: HTTP ${status}`);
    if (body.trim().length === 0) failures.push(`${path}: empty body`);

    const probeText = path.endsWith(".xml") ? body : htmlToProbePlainText(body);
    const violations = collectForbiddenProductionTextViolations(probeText);
    if (violations.length) {
      failures.push(`${path}: forbidden copy — ${violations.slice(0, 6).map((v) => v.kind).join(", ")}`);
    }

    const needles = PRODUCTION_ROUTE_HTML_SUBSTRING_ASSERTIONS[path];
    if (needles?.length) {
      const lower = probeText.toLowerCase();
      for (const n of needles) {
        if (!lower.includes(n.toLowerCase())) {
          failures.push(`${path}: expected substring not found: ${JSON.stringify(n)}`);
        }
      }
    }

    if (path === "/sitemap.xml" && status === 200 && !ct.toLowerCase().includes("xml")) {
      failures.push(`${path}: expected XML content-type, got ${JSON.stringify(ct)}`);
    }
    if (path === "/robots.txt" && status === 200 && !ct.toLowerCase().includes("text/plain")) {
      failures.push(`${path}: expected text/plain content-type, got ${JSON.stringify(ct)}`);
    }
  }

  if (failures.length) {
    console.error("[validate:production-public-html] FAILED");
    for (const f of failures) console.error("  -", f);
    process.exit(1);
  }
  console.log(`[validate:production-public-html] OK ${paths.length} paths @ ${base}`);
}

await main();
