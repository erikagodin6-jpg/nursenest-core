import assert from "node:assert/strict";
import test from "node:test";
import {
  isPathwayMarketingPathname,
  shouldEmitMarketingLayoutBreadcrumbFallback,
} from "@/lib/breadcrumbs/layout-fallback-policy";

test("suppresses fallback on pathway lesson detail URLs", () => {
  assert.equal(shouldEmitMarketingLayoutBreadcrumbFallback("/canada/rn/nclex-rn/lessons/fluid-balance"), false);
  assert.equal(isPathwayMarketingPathname("/canada/rn/nclex-rn/lessons/fluid-balance"), true);
});

test("suppresses fallback on blog and case-studies", () => {
  assert.equal(shouldEmitMarketingLayoutBreadcrumbFallback("/blog/my-post"), false);
  assert.equal(shouldEmitMarketingLayoutBreadcrumbFallback("/case-studies"), false);
});

test("allows fallback on shallow marketing pages without dedicated crumbs", () => {
  assert.equal(shouldEmitMarketingLayoutBreadcrumbFallback("/about"), true);
});
