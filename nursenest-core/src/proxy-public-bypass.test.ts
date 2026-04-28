import assert from "node:assert/strict";
import test from "node:test";

import { isPublicProbeOrCrawlerBypassPath } from "@/proxy";

test("proxy bypasses public crawler and health endpoints", () => {
  for (const pathname of ["/sitemap.xml", "/robots.txt", "/healthz", "/readyz", "/api/health", "/api/health/ready"]) {
    assert.equal(isPublicProbeOrCrawlerBypassPath(pathname), true, pathname);
  }
});

test("proxy bypass does not broaden to unrelated public or api paths", () => {
  for (const pathname of ["/blog", "/pricing", "/api/users", "/api/healthcheck"]) {
    assert.equal(isPublicProbeOrCrawlerBypassPath(pathname), false, pathname);
  }
});
