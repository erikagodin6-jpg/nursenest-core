import assert from "node:assert/strict";
import test from "node:test";
import { NP_ADV_POSTS } from "@/lib/seo/np-advanced-seo-posts";
import { npAdvTopicsForTrack } from "@/lib/seo/np-advanced-seo-topics";

test("WHNP is a first-class advanced NP SEO track across topics and long-form posts", () => {
  assert.ok(npAdvTopicsForTrack("whnp").length >= 4);
  assert.ok(NP_ADV_POSTS.filter((post) => post.track === "whnp").length >= 2);
});

test("CNPLE advanced SEO inventory has more than a thin comparison-only cluster", () => {
  assert.ok(npAdvTopicsForTrack("cnple").length >= 5);
  assert.ok(NP_ADV_POSTS.filter((post) => post.track === "cnple").length >= 2);
});

test("PNP-PC advanced SEO inventory includes deeper specialty coverage than one-off comparisons", () => {
  assert.ok(npAdvTopicsForTrack("pnp-pc").length >= 8);
  assert.ok(NP_ADV_POSTS.filter((post) => post.track === "pnp-pc").length >= 3);
});
