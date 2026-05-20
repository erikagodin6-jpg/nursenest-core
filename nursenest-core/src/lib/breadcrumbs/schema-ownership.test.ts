import assert from "node:assert/strict";
import test from "node:test";
import {
  pageOwnsBreadcrumbSchema,
  shouldEmitLayoutBreadcrumbFallback,
} from "@/lib/breadcrumbs/schema-ownership";
import { shouldEmitMarketingLayoutBreadcrumbFallback } from "@/lib/breadcrumbs/layout-fallback-policy";

test("page ownership covers pathway, ECG, labs, lessons, glossary", () => {
  assert.equal(pageOwnsBreadcrumbSchema("/canada/rn/nclex-rn/lessons/fluid-balance"), true);
  assert.equal(pageOwnsBreadcrumbSchema("/ecg/sinus-rhythm"), true);
  assert.equal(pageOwnsBreadcrumbSchema("/labs-interpretation"), true);
  assert.equal(pageOwnsBreadcrumbSchema("/hemodynamics-monitoring"), true);
  assert.equal(pageOwnsBreadcrumbSchema("/canada/rn/nclex-rn/glossary"), true);
});

test("layout fallback blocked when page owns crumbs", () => {
  assert.equal(shouldEmitLayoutBreadcrumbFallback("/ecg"), false);
  assert.equal(shouldEmitMarketingLayoutBreadcrumbFallback("/ecg"), false);
  assert.equal(shouldEmitLayoutBreadcrumbFallback("/about"), true);
  assert.equal(shouldEmitMarketingLayoutBreadcrumbFallback("/about"), true);
});
