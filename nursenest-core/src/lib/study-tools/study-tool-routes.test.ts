import test from "node:test";
import assert from "node:assert/strict";
import { getStudyToolsPublicSitemapUrls, withStudyToolPathwayQuery } from "./study-tool-routes";

test("getStudyToolsPublicSitemapUrls never emits /app URLs (auth surfaces stay off sitemap)", () => {
  const urls = getStudyToolsPublicSitemapUrls();
  assert.equal(urls.length, 0);
});

test("withStudyToolPathwayQuery appends pathwayId", () => {
  assert.equal(withStudyToolPathwayQuery("/app/study-tools", "rn-1"), "/app/study-tools?pathwayId=rn-1");
  assert.equal(withStudyToolPathwayQuery("/app/study-tools", null), "/app/study-tools");
});
