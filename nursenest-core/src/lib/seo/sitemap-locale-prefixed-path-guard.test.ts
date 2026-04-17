import assert from "node:assert/strict";
import test from "node:test";
import { collectPathwayTopicProgrammaticPublicPaths } from "@/lib/seo/pathway-topic-programmatic-registry";
import { assertLocaleMarketingUrlsExcludePrefixedPathwayTopics } from "@/lib/seo/sitemap-locale-prefixed-path-guard";

const ORIGIN = "https://example.test";

test("assertLocaleMarketingUrlsExcludePrefixedPathwayTopics throws when a forbidden prefixed URL is present", () => {
  const p = collectPathwayTopicProgrammaticPublicPaths()[0];
  assert.ok(p, "registry should expose at least one pathway topic path");
  const poison = `${ORIGIN}/fr${p.startsWith("/") ? p : `/${p}`}`;
  assert.throws(
    () => assertLocaleMarketingUrlsExcludePrefixedPathwayTopics([poison], ORIGIN, "fr"),
    /404/,
  );
});

test("assertLocaleMarketingUrlsExcludePrefixedPathwayTopics passes for typical locale pages", () => {
  assertLocaleMarketingUrlsExcludePrefixedPathwayTopics(
    [`${ORIGIN}/fr/pricing`, `${ORIGIN}/fr/lessons`],
    ORIGIN,
    "fr",
  );
});
