import test from "node:test";
import assert from "node:assert/strict";
import { ADMIN_BLOG_GENERATE_AI_MAX_TOPICS_PER_RUN } from "./blog-generate-ai-constants";
import { blogGenerateByTopicRequestSchema } from "./blog-simple-ai-draft-schema";

test("rejects topic batches larger than ADMIN_BLOG_GENERATE_AI_MAX_TOPICS_PER_RUN", () => {
  const topics = Array.from({ length: ADMIN_BLOG_GENERATE_AI_MAX_TOPICS_PER_RUN + 1 }, (_, i) => `topic line ${i} xx`);
  const parsed = blogGenerateByTopicRequestSchema.safeParse({
    topics,
    exam: "nclex-rn",
    template: "TOPIC_EXPLAINED",
  });
  assert.equal(parsed.success, false);
});

test("accepts multi-topic batch within cap", () => {
  const parsed = blogGenerateByTopicRequestSchema.safeParse({
    topics: ["one two thr", "two two thr", "thr two fou", "fou two fiv"],
    exam: "nclex-rn",
    template: "TOPIC_EXPLAINED",
  });
  assert.equal(parsed.success, true);
});

test("rejects topic and topics together", () => {
  const parsed = blogGenerateByTopicRequestSchema.safeParse({
    topic: "one two thr",
    topics: ["one two thr", "two two thr"],
    exam: "nclex-rn",
    template: "TOPIC_EXPLAINED",
  });
  assert.equal(parsed.success, false);
});

test("rejects generateTranslations with multiple topics", () => {
  const parsed = blogGenerateByTopicRequestSchema.safeParse({
    topics: ["one two thr", "two two thr"],
    exam: "nclex-rn",
    template: "TOPIC_EXPLAINED",
    generateTranslations: true,
    translationLocales: ["fr"],
    translationRegion: "france",
  });
  assert.equal(parsed.success, false);
});

test("rejects translation locale batches larger than 4", () => {
  const parsed = blogGenerateByTopicRequestSchema.safeParse({
    topic: "hyperkalemia nursing interventions",
    exam: "nclex-rn",
    template: "TOPIC_EXPLAINED",
    generateTranslations: true,
    translationLocales: ["en", "fr", "es", "tl", "ar"],
  });
  assert.equal(parsed.success, false);
});

test("rejects empty payload", () => {
  const parsed = blogGenerateByTopicRequestSchema.safeParse({});
  assert.equal(parsed.success, false);
});

test("accepts sourceRecords with empty url string (treated as omitted)", () => {
  const parsed = blogGenerateByTopicRequestSchema.safeParse({
    topic: "one two thr",
    exam: "nclex-rn",
    template: "TOPIC_EXPLAINED",
    sourceRecords: [{ title: "CDC", url: "" }],
  });
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.sourceRecords?.[0]?.url, undefined);
  }
});

test("normalizes slug trim and lowercase before regex", () => {
  const parsed = blogGenerateByTopicRequestSchema.safeParse({
    topic: "one two thr",
    exam: "nclex-rn",
    template: "TOPIC_EXPLAINED",
    slug: "  Fluid-Balance-Nclex  ",
  });
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.slug, "fluid-balance-nclex");
  }
});
