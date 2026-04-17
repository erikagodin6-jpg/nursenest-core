import assert from "node:assert/strict";
import test from "node:test";
import { listNpPracticeTestSegmentPaths } from "@/lib/exam-pathways/np-practice-test-segments";
import { collectPathwayTopicProgrammaticPublicPaths } from "@/lib/seo/pathway-topic-programmatic-registry";
import {
  assertLocaleMarketingUrlsExcludePrefixedPathwayTopics,
  stripForbiddenLocalePrefixedPathwayTopics,
} from "@/lib/seo/sitemap-locale-prefixed-path-guard";

const ORIGIN = "https://example.test";

test("stripForbiddenLocalePrefixedPathwayTopics removes forbidden prefixed URLs", () => {
  const p = collectPathwayTopicProgrammaticPublicPaths()[0];
  assert.ok(p, "registry should expose at least one pathway topic path");
  const poison = `${ORIGIN}/fr${p.startsWith("/") ? p : `/${p}`}`;
  const { urls, removed } = stripForbiddenLocalePrefixedPathwayTopics(
    [poison, `${ORIGIN}/fr/pricing`],
    ORIGIN,
    "fr",
  );
  assert.equal(removed, 1);
  assert.deepEqual(urls, [`${ORIGIN}/fr/pricing`]);
});

test("assertLocaleMarketingUrlsExcludePrefixedPathwayTopics throws when a forbidden prefixed URL is present", () => {
  const p = collectPathwayTopicProgrammaticPublicPaths()[0];
  assert.ok(p, "registry should expose at least one pathway topic path");
  const poison = `${ORIGIN}/fr${p.startsWith("/") ? p : `/${p}`}`;
  assert.throws(
    () => assertLocaleMarketingUrlsExcludePrefixedPathwayTopics([poison], ORIGIN, "fr"),
    /removed_count=/,
  );
});

test("assertLocaleMarketingUrlsExcludePrefixedPathwayTopics passes for typical locale pages", () => {
  assertLocaleMarketingUrlsExcludePrefixedPathwayTopics(
    [`${ORIGIN}/fr/pricing`, `${ORIGIN}/fr/lessons`],
    ORIGIN,
    "fr",
  );
});

test("stripForbiddenLocalePrefixedPathwayTopics removes locale-prefixed NP practice-test alias hubs", () => {
  const first = listNpPracticeTestSegmentPaths()[0];
  assert.ok(first, "NP practice segment list should be non-empty");
  const poison = `${ORIGIN}/fr/${first.countrySlug}/${first.roleTrack}/${first.segment}`;
  const { urls, removed } = stripForbiddenLocalePrefixedPathwayTopics(
    [poison, `${ORIGIN}/fr/pricing`],
    ORIGIN,
    "fr",
  );
  assert.equal(removed, 1);
  assert.deepEqual(urls, [`${ORIGIN}/fr/pricing`]);
});
