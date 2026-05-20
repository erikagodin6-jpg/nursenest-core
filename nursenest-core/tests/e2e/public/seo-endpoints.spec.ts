import { expect, test } from "@playwright/test";

/**
 * SEO surface smoke: crawler entrypoints must be fast, successful, and non-degenerate.
 *
 * A **warm-up round** runs first so `next dev` route compilation does not dominate wall time; the
 * timed assertions still enforce the SLA on steady-state responses (matches how crawlers retry).
 *
 * @see src/app/sitemap.xml/route.ts
 * @see src/app/robots.txt/route.ts
 */
const SEO_ENDPOINT_SLA_MS = 1_000;

const PATHS = ["/sitemap.xml", "/robots.txt"] as const;

function assertValidSitemapBody(body: string): void {
  const trimmed = body.trimStart();
  expect(
    trimmed.toLowerCase().startsWith("<?xml") || /<urlset\b/i.test(trimmed),
    "sitemap.xml should look like XML urlset content",
  ).toBeTruthy();
  expect(trimmed.length, "sitemap.xml body should not be empty").toBeGreaterThan(80);
}

function assertValidRobotsBody(body: string): void {
  expect(body, "robots.txt should not be empty").toBeTruthy();
  expect(body, "robots.txt should declare User-agent").toMatch(/User-agent\s*:/i);
  expect(body, "robots.txt should declare a Sitemap URL").toMatch(/^\s*Sitemap\s*:/im);
}

test.describe("Public — SEO endpoints", () => {
  test("/sitemap.xml and /robots.txt return 200, valid bodies, and respond within SLA", async ({
    request,
    baseURL,
  }) => {
    test.setTimeout(180_000);

    /** Match `playwright.config.ts` default (`http://localhost:3000`) so requests hit the same bind as `webServer`. */
    const appOrigin = new URL(baseURL ?? process.env.BASE_URL ?? "http://localhost:3000").origin;

    for (const pathname of PATHS) {
      const url = new URL(pathname, appOrigin).href;
      const warm = await request.get(url, { failOnStatusCode: false, timeout: 180_000 });
      await warm.text();
    }

    for (const pathname of PATHS) {
      const url = new URL(pathname, appOrigin).href;
      const t0 = Date.now();
      const res = await request.get(url, { failOnStatusCode: false, timeout: 60_000 });
      const body = await res.text();
      const ms = Date.now() - t0;

      expect(res.status(), `${pathname} should return HTTP 200 (got ${res.status()} for ${url})`).toBe(200);
      expect(
        ms,
        `${pathname} should fully respond (status + body) in under ${SEO_ENDPOINT_SLA_MS}ms (got ${ms}ms for ${url})`,
      ).toBeLessThanOrEqual(SEO_ENDPOINT_SLA_MS);
      if (pathname === "/sitemap.xml") {
        assertValidSitemapBody(body);
      } else {
        assertValidRobotsBody(body);
      }
    }
  });
});
