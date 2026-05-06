import test from "node:test";
import assert from "node:assert/strict";
import { BLOG_SLUG_FORMAT_RE, coerceAdminOptionalSlugFromRawInput } from "@/lib/blog/blog-optional-slug";
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

test("accepts normal article titles as topics without slug validation", () => {
  const titles = [
    "Nephrotic Syndrome and Low Urine Output: What Nurses Need to Know",
    "Why does COPD cause CO2 retention?",
    "CABG: Priority Nursing Assessments After Surgery",
    "Parkinson’s Disease: Nursing Priorities & Red Flags",
  ];

  for (const topic of titles) {
    const parsed = blogGenerateByTopicRequestSchema.safeParse({
      topic,
      exam: "nclex-rn",
      template: "TOPIC_EXPLAINED",
    });
    assert.equal(parsed.success, true, topic);
  }
});

test("rejects whitespace-only topic clearly", () => {
  const parsed = blogGenerateByTopicRequestSchema.safeParse({
    topic: "   \n\t   ",
    exam: "nclex-rn",
    template: "TOPIC_EXPLAINED",
  });
  assert.equal(parsed.success, false);
  if (!parsed.success) {
    assert.equal(parsed.error.issues[0]?.path.join("."), "topic");
    assert.match(parsed.error.issues[0]?.message ?? "", /Topic must be at least 3/);
  }
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

test("accepts article-like optional slug in payload (Zod trim only; server coerces to kebab slug)", () => {
  const raw = "Why does COPD cause CO2 retention?";
  const parsed = blogGenerateByTopicRequestSchema.safeParse({
    topic: "one two thr",
    exam: "nclex-rn",
    template: "TOPIC_EXPLAINED",
    slug: raw,
  });
  assert.equal(parsed.success, true);
  const coerced = coerceAdminOptionalSlugFromRawInput(raw);
  assert.ok(coerced && BLOG_SLUG_FORMAT_RE.test(coerced));
  assert.equal(coerced, "why-does-copd-cause-co2-retention");
});

test("accepts slug with leading/trailing spaces (trim only; server normalizes case)", () => {
  const parsed = blogGenerateByTopicRequestSchema.safeParse({
    topic: "one two thr",
    exam: "nclex-rn",
    template: "TOPIC_EXPLAINED",
    slug: "  Fluid-Balance-Nclex  ",
  });
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.slug, "Fluid-Balance-Nclex");
  }
});

test("treats empty slug as omitted", () => {
  const parsed = blogGenerateByTopicRequestSchema.safeParse({
    topic: "one two thr",
    exam: "nclex-rn",
    template: "TOPIC_EXPLAINED",
    slug: "   ",
  });
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.slug, undefined);
  }
});
