import assert from "node:assert/strict";
import test from "node:test";
import { shouldSkipDbBackedSitemapUrlsForBuild } from "@/lib/seo/sitemap-build-skip";

test("shouldSkipDbBackedSitemapUrlsForBuild returns true during build lifecycle", () => {
  const originalLifecycle = process.env.npm_lifecycle_event;
  const originalArgv = process.argv;
  process.env.npm_lifecycle_event = "build";
  process.argv = ["node", "next", "build"];
  try {
    assert.equal(shouldSkipDbBackedSitemapUrlsForBuild(), true);
  } finally {
    process.env.npm_lifecycle_event = originalLifecycle;
    process.argv = originalArgv;
  }
});

test("shouldSkipDbBackedSitemapUrlsForBuild returns false outside build", () => {
  const originalLifecycle = process.env.npm_lifecycle_event;
  const originalArgv = process.argv;
  delete process.env.npm_lifecycle_event;
  process.argv = ["node", "server.js"];
  try {
    assert.equal(shouldSkipDbBackedSitemapUrlsForBuild(), false);
  } finally {
    process.env.npm_lifecycle_event = originalLifecycle;
    process.argv = originalArgv;
  }
});
