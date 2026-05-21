import assert from "node:assert/strict";
import test from "node:test";

import { isPublicProbeOrCrawlerBypassPath, isStaticAssetBypassPath } from "@/proxy";

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

test("proxy bypasses static public assets and image delivery routes", () => {
  for (const pathname of [
    "/_next/static/chunks/app.js",
    "/_next/image",
    "/favicon.ico",
    "/logos/aurora-leaf.png",
    "/brand/leaf-logo.svg",
    "/marketing/homepage-screenshots/screenshot10-480w.webp",
    "/api/marketing-assets/marketing/homepage-screenshots/screenshot10-480w.webp",
    "/api/assets/i18n/en.json",
    "/images/example.jpg",
    "/fonts/dm-sans.woff2",
  ]) {
    assert.equal(isStaticAssetBypassPath(pathname), true, pathname);
  }
});

test("static asset bypass does not skip application routes", () => {
  for (const pathname of ["/", "/pricing", "/about", "/blog", "/app", "/admin", "/api/users"]) {
    assert.equal(isStaticAssetBypassPath(pathname), false, pathname);
  }
});
