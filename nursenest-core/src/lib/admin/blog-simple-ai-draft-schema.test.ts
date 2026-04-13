import test from "node:test";
import assert from "node:assert/strict";
import { blogGenerateByTopicRequestSchema } from "./blog-simple-ai-draft-schema";

test("rejects topic batches larger than 3", () => {
  const parsed = blogGenerateByTopicRequestSchema.safeParse({
    topics: ["topic one", "topic two", "topic three", "topic four"],
    exam: "nclex-rn",
    template: "TOPIC_EXPLAINED",
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
