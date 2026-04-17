import assert from "node:assert/strict";
import test from "node:test";
import { filterTopicClustersForSitemapByTopicPageTotal } from "@/lib/lessons/pathway-topic-sitemap-filter";

test("filterTopicClustersForSitemapByTopicPageTotal keeps clusters with total>0 and preserves order", async () => {
  const clusters = [
    { topicSlug: "a", label: "A", count: 1 },
    { topicSlug: "b", label: "B", count: 2 },
    { topicSlug: "c", label: "C", count: 3 },
  ];
  const out = await filterTopicClustersForSitemapByTopicPageTotal(clusters, async (slug) => ({
    total: slug === "b" ? 0 : 1,
  }));
  assert.deepEqual(
    out.map((x) => x.topicSlug),
    ["a", "c"],
  );
});

test("filterTopicClustersForSitemapByTopicPageTotal drops blank slugs", async () => {
  const clusters = [{ topicSlug: "  ", label: "x", count: 0 }, { topicSlug: "ok", label: "OK", count: 1 }];
  const out = await filterTopicClustersForSitemapByTopicPageTotal(clusters, async () => ({ total: 99 }));
  assert.deepEqual(
    out.map((x) => x.topicSlug),
    ["ok"],
  );
});
