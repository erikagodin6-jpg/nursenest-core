#!/usr/bin/env npx tsx
/**
 * CI / post-deploy: fetch deployed `BASE_URL/sitemap.xml`, extract `<loc>` URLs, HEAD/GET each
 * (same rules as `seo-http-emit-validation.ts`).
 *
 * Usage:
 *   BASE_URL=https://www.example.com npm run seo:validate-http-sitemap
 *
 * Optional: `SEO_HTTP_VALIDATE_MAX_URLS`, `SEO_HTTP_VALIDATE_CONCURRENCY` (match runtime validator).
 * `SEO_SITEMAP_VALIDATE_WARN_ONLY=1` — log bad URLs but exit 0 (not for strict CI).
 *
 * Resolves origin from `BASE_URL`, else `https://$VERCEL_URL`, else `NEXT_PUBLIC_APP_URL`.
 */
import {
  fetchHttpStatusForSeoValidation,
  isSeoHttpValidationBadStatus,
} from "@/lib/seo/seo-http-emit-validation";

const SOURCE_FILE = "scripts/validate-seo-http-sitemap.mts";
const GENERATOR = "cli:sitemapLocHttpCheck";

function resolveOrigin(): string {
  const fromBase = process.env.BASE_URL?.replace(/\/$/, "");
  if (fromBase) return fromBase;
  const vu = process.env.VERCEL_URL?.replace(/\/$/, "");
  if (vu) return vu.startsWith("http") ? vu : `https://${vu}`;
  const pub = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (pub) return pub;
  console.error(
    "[nursenest-core] seo sitemap_http_validate_missing_base Set BASE_URL (or VERCEL_URL / NEXT_PUBLIC_APP_URL)",
  );
  process.exit(2);
  return "";
}

function maxUrls(): number {
  const raw = process.env.SEO_HTTP_VALIDATE_MAX_URLS?.trim();
  const n = raw ? Number.parseInt(raw, 10) : 2000;
  return Number.isFinite(n) && n > 0 ? Math.min(n, 50_000) : 2000;
}

function conc(): number {
  const raw = process.env.SEO_HTTP_VALIDATE_CONCURRENCY?.trim();
  const n = raw ? Number.parseInt(raw, 10) : 8;
  return Number.isFinite(n) && n > 0 ? Math.min(n, 32) : 8;
}

function parseLocs(xml: string): string[] {
  const out: string[] = [];
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const u = m[1]?.trim();
    if (u) out.push(u);
  }
  return out;
}

async function runPool<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);
    out.push(...(await Promise.all(chunk.map(worker))));
  }
  return out;
}

function logBad(meta: Record<string, string>): void {
  console.error(`[nursenest-core] seo http_emit_url_bad_response ${JSON.stringify(meta)}`);
}

async function main() {
  const base = resolveOrigin();
  const sitemapUrl = `${base}/sitemap.xml`;
  const warnOnly =
    process.env.SEO_SITEMAP_VALIDATE_WARN_ONLY === "1" ||
    process.env.SEO_SITEMAP_VALIDATE_WARN_ONLY === "true";

  const smRes = await fetch(sitemapUrl, {
    method: "GET",
    redirect: "follow",
    headers: { "user-agent": "NurseNest-SeoSitemapValidator/1.0", Accept: "application/xml,text/xml,*/*" },
  });
  if (!smRes.ok) {
    console.error(
      `[nursenest-core] seo sitemap_http_validate_fetch_failed ${JSON.stringify({
        url: sitemapUrl.slice(0, 800),
        status: String(smRes.status),
      })}`,
    );
    process.exit(warnOnly ? 0 : 1);
  }

  const xml = await smRes.text();
  const locs = [...new Set(parseLocs(xml))];
  const cap = maxUrls();
  const slice = locs.slice(0, cap);
  if (locs.length > cap) {
    console.error(
      `[nursenest-core] seo http_validate_url_cap ${JSON.stringify({
        sourceFile: SOURCE_FILE,
        generator: GENERATOR,
        total: String(locs.length),
        cap: String(cap),
      })}`,
    );
  }

  console.log(
    `[nursenest-core] seo sitemap_http_validate_start ${JSON.stringify({ origin: base, locs: String(slice.length) })}`,
  );

  const failures: Array<{ url: string; status: number; detail?: string }> = [];
  await runPool(slice, conc(), async (url) => {
    const { status, detail } = await fetchHttpStatusForSeoValidation(url);
    if (isSeoHttpValidationBadStatus(status)) {
      failures.push({ url, status, detail });
      logBad({
        url: url.slice(0, 800),
        status: String(status),
        kind: "sitemap",
        sourceFile: SOURCE_FILE,
        generator: GENERATOR,
        detail: (detail ?? "").slice(0, 200),
      });
    }
    return null;
  });

  if (failures.length > 0) {
    console.error(
      `[nursenest-core] seo sitemap_http_validate_done ${JSON.stringify({
        failed: String(failures.length),
        warnOnly: String(warnOnly),
      })}`,
    );
    process.exit(warnOnly ? 0 : 1);
  }

  console.log(
    `[nursenest-core] seo sitemap_http_validate_ok ${JSON.stringify({ checked: String(slice.length) })}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
