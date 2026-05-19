import assert from "node:assert/strict";
import test from "node:test";

import { isPublicProbeOrCrawlerBypassPath } from "@/proxy";

test("proxy bypasses sitemap index, all child sitemap urlsets, robots, and health probes", () => {
  for (const pathname of [
    // Sitemap index
    "/sitemap.xml",
    // All child urlsets listed in SITEMAP_INDEX_CHILD_FILENAMES — previously missing from bypass
    "/sitemap-core.xml",
    "/sitemap-blog.xml",
    "/sitemap-fr-blog.xml",
    "/sitemap-es-blog.xml",
    "/sitemap-pathways.xml",
    "/sitemap-lessons.xml",
    "/sitemap-localized.xml",
    "/sitemap-clinical-modules.xml",
    "/sitemap-allied.xml",
    "/sitemap-new-grad.xml",
    "/sitemap-cnple.xml",
    "/sitemap-authority-clusters.xml",
    // robots.txt and health probes
    "/robots.txt",
    "/healthz",
    "/readyz",
    "/api/health",
    "/api/health/ready",
  ]) {
    assert.equal(isPublicProbeOrCrawlerBypassPath(pathname), true, pathname);
  }
});

test("proxy bypass does not broaden to unrelated public or api paths", () => {
  for (const pathname of ["/blog", "/pricing", "/api/users", "/api/healthcheck", "/sitemap"]) {
    assert.equal(isPublicProbeOrCrawlerBypassPath(pathname), false, pathname);
  }
});
