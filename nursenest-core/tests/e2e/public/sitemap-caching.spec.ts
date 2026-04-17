import { expect, test } from "@playwright/test";
import { parseCacheControlDirectives } from "../helpers/public-marketing-data-request-tracker";

const SITEMAP_SLA_MS = 1_000;

function isLikelyNextDev(baseURL: string): boolean {
  if (process.env.PLAYWRIGHT_SKIP_WEB_SERVER === "1") return false;
  return /127\.0\.0\.1|localhost/.test(baseURL);
}

test.describe("Public — sitemap caching", () => {
  test("sitemap.xml is cacheable, validator-backed, and fast", async ({ request, baseURL }, testInfo) => {
    test.setTimeout(60_000);
    const origin = baseURL ?? "http://127.0.0.1:3000";
    const warnings: string[] = [];

    if (isLikelyNextDev(origin)) {
      warnings.push(
        "Likely running against next dev. Prefer BASE_URL=<next-start-or-prod> with PLAYWRIGHT_SKIP_WEB_SERVER=1 for production-grade sitemap caching evidence.",
      );
    }

    const t0 = Date.now();
    const first = await request.get("/sitemap.xml", { failOnStatusCode: false });
    const firstElapsedMs = Date.now() - t0;

    expect(first.status(), "First sitemap request should succeed").toBe(200);
    expect(firstElapsedMs, `sitemap.xml exceeded ${SITEMAP_SLA_MS}ms`).toBeLessThanOrEqual(SITEMAP_SLA_MS);

    const cacheControl = first.headers()["cache-control"] ?? null;
    const etag = first.headers().etag ?? null;
    const lastModified = first.headers()["last-modified"] ?? null;
    const directives = parseCacheControlDirectives(cacheControl);
    const sMaxAge = typeof directives["s-maxage"] === "string" ? Number(directives["s-maxage"]) : NaN;

    expect(cacheControl, "sitemap.xml must send Cache-Control").toBeTruthy();
    expect(Number.isFinite(sMaxAge) && sMaxAge > 0, "sitemap.xml must send positive s-maxage").toBe(true);
    expect(Boolean(etag || lastModified), "sitemap.xml must send ETag or Last-Modified").toBe(true);

    let conditionalStatus: number | null = null;
    let conditionalCacheControl: string | null = null;
    let conditionalAge: string | null = null;

    if (etag) {
      const conditional = await request.get("/sitemap.xml", {
        failOnStatusCode: false,
        headers: { "If-None-Match": etag },
      });
      conditionalStatus = conditional.status();
      conditionalCacheControl = conditional.headers()["cache-control"] ?? null;
      conditionalAge = conditional.headers().age ?? null;
      expect(conditional.status(), "Conditional sitemap request should revalidate").toBe(304);
    }

    await testInfo.attach("sitemap-caching.json", {
      body: Buffer.from(
        JSON.stringify(
          {
            origin,
            firstElapsedMs,
            firstStatus: first.status(),
            cacheControl,
            etag,
            lastModified,
            conditionalStatus,
            conditionalCacheControl,
            conditionalAge,
            warnings,
          },
          null,
          2,
        ),
      ),
      contentType: "application/json",
    });
  });
});
