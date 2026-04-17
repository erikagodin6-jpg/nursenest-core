import { expect, test } from "@playwright/test";
import {
  classifyPublicDataResponseEntry,
  parseCacheControlDirectives,
} from "../helpers/public-marketing-data-request-tracker";

const SITEMAP_PATH = "/sitemap.xml";
const SITEMAP_SLA_MS = 1_000;

test.describe("Public — sitemap caching", () => {
  test("sitemap is cached, conditional, and fast", async ({ request, baseURL }, testInfo) => {
    test.setTimeout(30_000);

    const appOrigin = new URL(baseURL ?? process.env.BASE_URL ?? "http://127.0.0.1:3000").origin;
    const sitemapUrl = new URL(SITEMAP_PATH, appOrigin).href;

    const t0 = Date.now();
    const first = await request.get(sitemapUrl, { failOnStatusCode: false });
    const firstMs = Date.now() - t0;
    const firstHeaders = first.headers();
    const firstCacheControl = firstHeaders["cache-control"] ?? null;
    const firstEtag = firstHeaders.etag ?? null;
    const firstLastModified = firstHeaders["last-modified"] ?? null;
    const firstAge = firstHeaders.age ?? null;
    const firstClassification = classifyPublicDataResponseEntry({
      status: first.status(),
      age: firstAge,
    });
    const directives = parseCacheControlDirectives(firstCacheControl);

    const artifact: Record<string, unknown> = {
      appOrigin,
      sitemapUrl,
      firstRequest: {
        status: first.status(),
        durationMs: firstMs,
        cacheControl: firstCacheControl,
        etag: firstEtag,
        age: firstAge,
        lastModified: firstLastModified,
        classification: firstClassification,
      },
    };

    expect(first.status(), `sitemap should return HTTP 200 for ${sitemapUrl}`).toBe(200);
    expect(firstMs, `sitemap should respond in under ${SITEMAP_SLA_MS}ms (got ${firstMs}ms)`).toBeLessThanOrEqual(SITEMAP_SLA_MS);
    expect(firstCacheControl, "sitemap missing Cache-Control header").toBeTruthy();
    expect(
      typeof directives["s-maxage"] === "string" ? Number(directives["s-maxage"]) : 0,
      `sitemap should expose a positive s-maxage (got ${String(directives["s-maxage"] ?? "missing")})`,
    ).toBeGreaterThan(0);
    expect(firstEtag || firstLastModified, "sitemap missing ETag/Last-Modified validator").toBeTruthy();

    if (firstEtag) {
      const second = await request.get(sitemapUrl, {
        failOnStatusCode: false,
        headers: { "If-None-Match": firstEtag },
      });
      const secondHeaders = second.headers();
      artifact.secondRequest = {
        status: second.status(),
        cacheControl: secondHeaders["cache-control"] ?? null,
        etag: secondHeaders.etag ?? null,
        age: secondHeaders.age ?? null,
        classification: classifyPublicDataResponseEntry({
          status: second.status(),
          age: secondHeaders.age ?? null,
        }),
      };
      expect(
        second.status(),
        `sitemap conditional request should revalidate cleanly (expected 304, got ${second.status()})`,
      ).toBe(304);
    }

    await testInfo.attach("sitemap-caching.json", {
      body: Buffer.from(JSON.stringify(artifact, null, 2)),
      contentType: "application/json",
    });
  });
});
