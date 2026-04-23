import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate } from "@prisma/client";
import {
  buildAdminBlogGenerateAiRequestBody,
  formatAdminBlogGenerateAiBlockedError,
  parseBatchTopicLines,
  validateStructuredSourceRecordsJson,
} from "./admin-blog-generate-ai-client-payload";

const baseBuild = {
  keywords: "",
  exam: "NCLEX",
  template: BlogPostTemplate.TOPIC_EXPLAINED,
  tone: "professional" as const,
  intent: BlogPostIntent.EXAM_PREP,
  funnelStage: BlogFunnelStage.CONSIDERATION,
  targetKeyword: "",
  keywordCluster: "",
  includeImage: true,
  includeAiImage: false,
  sourceRecords: undefined,
  publishNow: true,
};

describe("parseBatchTopicLines", () => {
  it("returns line numbers for short non-empty lines (app-level message)", () => {
    const r = parseBatchTopicLines("good line here\nab\nanother good", 20);
    assert.equal(r.ok, false);
    if (r.ok) return;
    assert.match(r.message, /Invalid line number/i);
    assert.match(r.message, /\b2\b/);
  });

  it("requires at least one topic", () => {
    const r = parseBatchTopicLines("   \n\n  ", 20);
    assert.equal(r.ok, false);
  });

  it("allows 1–10 topics and slices to maxTopics", () => {
    const lines = Array.from({ length: 10 }, (_, i) => `Topic number ${i + 1} here`);
    const r = parseBatchTopicLines(lines.join("\n"), 10);
    assert.equal(r.ok, true);
    if (!r.ok) return;
    assert.equal(r.topics.length, 10);
  });
});

describe("buildAdminBlogGenerateAiRequestBody", () => {
  it("does not include slug in batch mode even if a stale slug were passed in", () => {
    const body = buildAdminBlogGenerateAiRequestBody({
      ...baseBuild,
      enableBatch: true,
      topicTrimmed: "ignored",
      batchTopics: ["one topic here", "two topic here"],
      slugCleanedOptional: "evil slug!!!",
    });
    const wire = JSON.parse(JSON.stringify(body)) as Record<string, unknown>;
    assert.equal("slug" in wire, false);
    assert.equal("topic" in wire, false);
    assert.deepEqual(wire.topics, ["one topic here", "two topic here"]);
    assert.equal(wire.topic, undefined);
  });

  it("includes slug in single mode when provided", () => {
    const body = buildAdminBlogGenerateAiRequestBody({
      ...baseBuild,
      enableBatch: false,
      topicTrimmed: "hello world topic",
      batchTopics: [],
      slugCleanedOptional: "valid-slug",
    });
    const wire = JSON.parse(JSON.stringify(body)) as Record<string, unknown>;
    assert.equal(wire.slug, "valid-slug");
    assert.equal(wire.topic, "hello world topic");
    assert.equal("topics" in wire, false);
  });

  it("omits slug in single mode when blank", () => {
    const body = buildAdminBlogGenerateAiRequestBody({
      ...baseBuild,
      enableBatch: false,
      topicTrimmed: "hello world topic",
      batchTopics: [],
      slugCleanedOptional: undefined,
    });
    const wire = JSON.parse(JSON.stringify(body)) as Record<string, unknown>;
    assert.equal("slug" in wire, false);
  });
});

describe("validateStructuredSourceRecordsJson", () => {
  it("rejects bad URLs with an app-level message", () => {
    const r = validateStructuredSourceRecordsJson([{ title: "x", url: "not-a-url" }]);
    assert.equal(r.ok, false);
    if (r.ok) return;
    assert.match(r.message, /Structured sources JSON is invalid/i);
    assert.match(r.message, /https/i);
  });
});

describe("formatAdminBlogGenerateAiBlockedError", () => {
  it("returns env-oriented copy for disabled gate", () => {
    const msg = formatAdminBlogGenerateAiBlockedError({
      error: "AI admin generation is disabled.",
      code: "ADMIN_AI_DISABLED",
      hint: "Enable AI_ADMIN_GENERATION_ENABLED (true, 1, yes, or on) and set AI_INTEGRATIONS_OPENAI_API_KEY or OPENAI_API_KEY.",
    });
    assert.match(msg, /AI_ADMIN_GENERATION_ENABLED/i);
    assert.match(msg, /OPENAI_API_KEY|AI_INTEGRATIONS_OPENAI_API_KEY/);
  });
});
