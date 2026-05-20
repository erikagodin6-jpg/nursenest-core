import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getProductionSmokePublicPaths,
  PRODUCTION_ROUTE_HTML_SUBSTRING_ASSERTIONS,
} from "./production-public-route-manifest";

describe("production-public-route-manifest", () => {
  it("returns a non-empty deduped sorted list including sitemap and robots", () => {
    const paths = getProductionSmokePublicPaths();
    assert.ok(paths.length >= 12);
    const uniq = new Set(paths);
    assert.equal(uniq.size, paths.length);
    const sorted = [...paths].sort((a, b) => a.localeCompare(b));
    assert.deepEqual(paths, sorted);
    assert.ok(paths.includes("/"));
    assert.ok(paths.includes("/sitemap.xml"));
    assert.ok(paths.includes("/robots.txt"));
  });

  it("every assertion key is present in the smoke path list", () => {
    const paths = new Set(getProductionSmokePublicPaths());
    for (const key of Object.keys(PRODUCTION_ROUTE_HTML_SUBSTRING_ASSERTIONS)) {
      assert.ok(paths.has(key), `assertion route missing from manifest: ${key}`);
    }
  });
});
