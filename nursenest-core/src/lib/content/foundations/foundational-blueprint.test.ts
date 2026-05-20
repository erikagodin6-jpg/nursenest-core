/**
 * Validation tests for the foundational lesson library blueprint.
 *
 * Run via:
 *   tsx --test src/lib/content/foundations/foundational-blueprint.test.ts
 *
 * Guards against:
 * - Wrong total topic count
 * - Domain count drift
 * - Duplicate slugs
 * - Non-URL-safe slugs
 * - Invalid lesson / question target ranges
 * - Light / heavy weight rule violations
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  loadFoundationalBlueprint,
  validateFoundationalBlueprint,
  clearBlueprintCache,
  getTopicsForDomain,
  getTopicsInSequenceOrder,
  getDomainSummaries,
  projectTotalLessonRange,
  projectTotalQuestionRange,
  buildGenerationBatches,
  getHeavyTopics,
  getLightTopics,
  EXPECTED_TOTAL_TOPICS,
  EXPECTED_DOMAINS,
  LIGHT_LESSON_MIN,
  LIGHT_LESSON_MAX,
  LIGHT_QUESTION_MIN,
  LIGHT_QUESTION_MAX,
  HEAVY_LESSON_MIN,
  HEAVY_LESSON_MAX,
  HEAVY_QUESTION_MIN,
  HEAVY_QUESTION_MAX,
} from "./foundational-blueprint";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

// Clear cache before each test file run so test isolation is maintained
clearBlueprintCache();
const doc = loadFoundationalBlueprint();
const result = validateFoundationalBlueprint(doc);

// ---------------------------------------------------------------------------
// Top-level blueprint structure
// ---------------------------------------------------------------------------

describe("foundational blueprint — structure", () => {
  it("has version, description, and generatedAt fields", () => {
    assert.ok(doc.version, "missing version");
    assert.ok(doc.description, "missing description");
    assert.ok(doc.generatedAt, "missing generatedAt");
  });

  it("has contentWeightRules for light and heavy", () => {
    assert.ok(doc.contentWeightRules.light, "missing contentWeightRules.light");
    assert.ok(doc.contentWeightRules.heavy, "missing contentWeightRules.heavy");
  });

  it("has domainTopicCounts map", () => {
    assert.ok(
      typeof doc.domainTopicCounts === "object",
      "domainTopicCounts must be an object"
    );
  });

  it("topics array exists and is an array", () => {
    assert.ok(Array.isArray(doc.topics), "topics must be an array");
  });
});

// ---------------------------------------------------------------------------
// Total count
// ---------------------------------------------------------------------------

describe("foundational blueprint — total count", () => {
  it(`contains exactly ${EXPECTED_TOTAL_TOPICS} topics`, () => {
    assert.strictEqual(
      doc.topics.length,
      EXPECTED_TOTAL_TOPICS,
      `Expected ${EXPECTED_TOTAL_TOPICS} topics, got ${doc.topics.length}`
    );
  });
});

// ---------------------------------------------------------------------------
// Domain counts
// ---------------------------------------------------------------------------

describe("foundational blueprint — domain counts", () => {
  const domainCounts: Record<string, number> = {};
  for (const t of doc.topics) {
    domainCounts[t.domain] = (domainCounts[t.domain] ?? 0) + 1;
  }

  for (const [domain, expected] of Object.entries(EXPECTED_DOMAINS)) {
    it(`domain "${domain}" has exactly ${expected} topics`, () => {
      const actual = domainCounts[domain] ?? 0;
      assert.strictEqual(
        actual,
        expected,
        `Domain "${domain}": expected ${expected}, got ${actual}`
      );
    });
  }

  it("no unexpected domains appear", () => {
    const unexpected = Object.keys(domainCounts).filter(
      (d) => !(d in EXPECTED_DOMAINS)
    );
    assert.deepStrictEqual(
      unexpected,
      [],
      `Unexpected domains: ${unexpected.join(", ")}`
    );
  });
});

// ---------------------------------------------------------------------------
// Slug uniqueness
// ---------------------------------------------------------------------------

describe("foundational blueprint — slug uniqueness", () => {
  it("all topicSlug values are unique", () => {
    const seen = new Map<string, number>();
    for (const t of doc.topics) {
      seen.set(t.topicSlug, (seen.get(t.topicSlug) ?? 0) + 1);
    }
    const duplicates = [...seen.entries()]
      .filter(([, count]) => count > 1)
      .map(([slug]) => slug);
    assert.deepStrictEqual(
      duplicates,
      [],
      `Duplicate slugs found: ${duplicates.join(", ")}`
    );
  });
});

// ---------------------------------------------------------------------------
// Slug URL-safety
// ---------------------------------------------------------------------------

describe("foundational blueprint — slug URL-safety", () => {
  it("all topicSlug values are URL-safe (lowercase letters, digits, hyphens)", () => {
    const invalid = doc.topics
      .filter((t) => !SLUG_PATTERN.test(t.topicSlug))
      .map((t) => t.topicSlug);
    assert.deepStrictEqual(
      invalid,
      [],
      `Non-URL-safe slugs: ${invalid.join(", ")}`
    );
  });

  it("no slug starts or ends with a hyphen", () => {
    const bad = doc.topics
      .filter((t) => t.topicSlug.startsWith("-") || t.topicSlug.endsWith("-"))
      .map((t) => t.topicSlug);
    assert.deepStrictEqual(bad, [], `Bad slugs: ${bad.join(", ")}`);
  });
});

// ---------------------------------------------------------------------------
// Required fields
// ---------------------------------------------------------------------------

describe("foundational blueprint — required fields", () => {
  const requiredFields = [
    "domain",
    "topicName",
    "topicSlug",
    "contentWeight",
    "targetLessonCountMin",
    "targetLessonCountMax",
    "targetQuestionCountMin",
    "targetQuestionCountMax",
    "recommendedSequenceOrder",
    "searchKeywords",
    "prerequisiteTopicSlugs",
    "downstreamTopicSlugs",
    "status",
  ] as const;

  it("every topic has all required fields present and non-null", () => {
    const missing: string[] = [];
    for (const topic of doc.topics) {
      for (const field of requiredFields) {
        if (topic[field] === undefined || topic[field] === null) {
          missing.push(`${topic.topicSlug}.${field}`);
        }
      }
    }
    assert.deepStrictEqual(missing, [], `Missing fields: ${missing.join(", ")}`);
  });

  it("every topic has status of 'planned', 'in_progress', or 'published'", () => {
    const valid = new Set(["planned", "in_progress", "published"]);
    const bad = doc.topics
      .filter((t) => !valid.has(t.status))
      .map((t) => `${t.topicSlug}:${t.status}`);
    assert.deepStrictEqual(bad, [], `Invalid statuses: ${bad.join(", ")}`);
  });

  it("every topic has a non-empty searchKeywords array", () => {
    const bad = doc.topics
      .filter((t) => !Array.isArray(t.searchKeywords) || t.searchKeywords.length === 0)
      .map((t) => t.topicSlug);
    assert.deepStrictEqual(bad, [], `Missing searchKeywords: ${bad.join(", ")}`);
  });

  it("every topic has recommendedSequenceOrder >= 1", () => {
    const bad = doc.topics
      .filter((t) => typeof t.recommendedSequenceOrder !== "number" || t.recommendedSequenceOrder < 1)
      .map((t) => t.topicSlug);
    assert.deepStrictEqual(bad, [], `Bad sequenceOrder: ${bad.join(", ")}`);
  });
});

// ---------------------------------------------------------------------------
// Content weight rules
// ---------------------------------------------------------------------------

describe("foundational blueprint — content weight rules", () => {
  it("all contentWeight values are 'light' or 'heavy'", () => {
    const bad = doc.topics
      .filter((t) => t.contentWeight !== "light" && t.contentWeight !== "heavy")
      .map((t) => `${t.topicSlug}:${t.contentWeight}`);
    assert.deepStrictEqual(bad, [], `Invalid weights: ${bad.join(", ")}`);
  });

  it(`light topics use lesson range ${LIGHT_LESSON_MIN}–${LIGHT_LESSON_MAX}`, () => {
    const bad = getLightTopics(doc)
      .filter(
        (t) =>
          t.targetLessonCountMin < LIGHT_LESSON_MIN ||
          t.targetLessonCountMax > LIGHT_LESSON_MAX
      )
      .map((t) => `${t.topicSlug}(${t.targetLessonCountMin}-${t.targetLessonCountMax})`);
    assert.deepStrictEqual(bad, [], `Light lesson range violations: ${bad.join(", ")}`);
  });

  it(`light topics use question range ${LIGHT_QUESTION_MIN}–${LIGHT_QUESTION_MAX}`, () => {
    const bad = getLightTopics(doc)
      .filter(
        (t) =>
          t.targetQuestionCountMin < LIGHT_QUESTION_MIN ||
          t.targetQuestionCountMax > LIGHT_QUESTION_MAX
      )
      .map((t) => `${t.topicSlug}(${t.targetQuestionCountMin}-${t.targetQuestionCountMax})`);
    assert.deepStrictEqual(bad, [], `Light question range violations: ${bad.join(", ")}`);
  });

  it(`heavy topics use lesson range ${HEAVY_LESSON_MIN}–${HEAVY_LESSON_MAX}`, () => {
    const bad = getHeavyTopics(doc)
      .filter(
        (t) =>
          t.targetLessonCountMin < HEAVY_LESSON_MIN ||
          t.targetLessonCountMax > HEAVY_LESSON_MAX
      )
      .map((t) => `${t.topicSlug}(${t.targetLessonCountMin}-${t.targetLessonCountMax})`);
    assert.deepStrictEqual(bad, [], `Heavy lesson range violations: ${bad.join(", ")}`);
  });

  it(`heavy topics use question range ${HEAVY_QUESTION_MIN}–${HEAVY_QUESTION_MAX}`, () => {
    const bad = getHeavyTopics(doc)
      .filter(
        (t) =>
          t.targetQuestionCountMin < HEAVY_QUESTION_MIN ||
          t.targetQuestionCountMax > HEAVY_QUESTION_MAX
      )
      .map((t) => `${t.topicSlug}(${t.targetQuestionCountMin}-${t.targetQuestionCountMax})`);
    assert.deepStrictEqual(bad, [], `Heavy question range violations: ${bad.join(", ")}`);
  });

  it("all topics have lessonCountMin <= lessonCountMax", () => {
    const bad = doc.topics
      .filter((t) => t.targetLessonCountMin > t.targetLessonCountMax)
      .map((t) => t.topicSlug);
    assert.deepStrictEqual(bad, [], `Inverted lesson ranges: ${bad.join(", ")}`);
  });

  it("all topics have questionCountMin <= questionCountMax", () => {
    const bad = doc.topics
      .filter((t) => t.targetQuestionCountMin > t.targetQuestionCountMax)
      .map((t) => t.topicSlug);
    assert.deepStrictEqual(bad, [], `Inverted question ranges: ${bad.join(", ")}`);
  });
});

// ---------------------------------------------------------------------------
// validateFoundationalBlueprint helper
// ---------------------------------------------------------------------------

describe("validateFoundationalBlueprint()", () => {
  it("returns valid:true for the production blueprint", () => {
    assert.strictEqual(result.valid, true, `Errors: ${result.errors.join("; ")}`);
  });

  it("reports zero errors", () => {
    assert.strictEqual(result.errors.length, 0, result.errors.join("\n"));
  });

  it("reports correct heavyCount and lightCount that sum to total", () => {
    assert.strictEqual(
      result.heavyCount + result.lightCount,
      result.totalTopics,
      "heavyCount + lightCount should equal totalTopics"
    );
  });

  it("reports zero duplicate slugs", () => {
    assert.deepStrictEqual(result.duplicateSlugs, []);
  });

  it("reports zero invalid slugs", () => {
    assert.deepStrictEqual(result.invalidSlugTopics, []);
  });
});

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

describe("getTopicsForDomain()", () => {
  it("returns correct count for Anatomy & Physiology", () => {
    const ap = getTopicsForDomain(doc, "Anatomy & Physiology");
    assert.strictEqual(ap.length, EXPECTED_DOMAINS["Anatomy & Physiology"]);
  });

  it("returns topics in ascending recommendedSequenceOrder", () => {
    for (const domain of Object.keys(EXPECTED_DOMAINS)) {
      const topics = getTopicsForDomain(doc, domain);
      for (let i = 1; i < topics.length; i++) {
        assert.ok(
          topics[i].recommendedSequenceOrder >= topics[i - 1].recommendedSequenceOrder,
          `Domain "${domain}": sequence order not ascending at index ${i}`
        );
      }
    }
  });
});

describe("getTopicsInSequenceOrder()", () => {
  it("returns all 90 topics", () => {
    const all = getTopicsInSequenceOrder(doc);
    assert.strictEqual(all.length, EXPECTED_TOTAL_TOPICS);
  });
});

describe("getDomainSummaries()", () => {
  it("returns one summary per expected domain", () => {
    const summaries = getDomainSummaries(doc);
    assert.strictEqual(summaries.length, Object.keys(EXPECTED_DOMAINS).length);
  });

  it("every summary lessonRangeMin > 0", () => {
    const bad = getDomainSummaries(doc).filter((s) => s.lessonRangeMin <= 0);
    assert.strictEqual(bad.length, 0);
  });
});

describe("projectTotalLessonRange()", () => {
  it("min > 0 and max >= min", () => {
    const range = projectTotalLessonRange(doc);
    assert.ok(range.min > 0, "projected lesson min should be > 0");
    assert.ok(range.max >= range.min, "projected lesson max >= min");
  });
});

describe("projectTotalQuestionRange()", () => {
  it("min > 0 and max >= min", () => {
    const range = projectTotalQuestionRange(doc);
    assert.ok(range.min > 0, "projected question min should be > 0");
    assert.ok(range.max >= range.min, "projected question max >= min");
  });
});

// ---------------------------------------------------------------------------
// Batch grouping
// ---------------------------------------------------------------------------

describe("buildGenerationBatches()", () => {
  const batches = buildGenerationBatches(doc);

  it("produces at least 1 batch", () => {
    assert.ok(batches.length >= 1);
  });

  it("covers all 90 topics across batches (no topic missing or duplicated)", () => {
    const covered = new Set<string>();
    for (const batch of batches) {
      for (const slug of batch.includedTopicSlugs) {
        assert.ok(!covered.has(slug), `Topic "${slug}" appears in multiple batches`);
        covered.add(slug);
      }
    }
    assert.strictEqual(covered.size, EXPECTED_TOTAL_TOPICS);
  });

  it("no batch has more than 2 heavy topics", () => {
    for (const batch of batches) {
      const heavyCount = batch.includedTopicSlugs.filter((slug) => {
        const topic = doc.topics.find((t) => t.topicSlug === slug);
        return topic?.contentWeight === "heavy";
      }).length;
      assert.ok(
        heavyCount <= 2,
        `Batch "${batch.batchId}" has ${heavyCount} heavy topics (max 2)`
      );
    }
  });

  it("batchIds are unique", () => {
    const ids = batches.map((b) => b.batchId);
    const unique = new Set(ids);
    assert.strictEqual(unique.size, ids.length, "Batch IDs must be unique");
  });

  it("recommendedGenerationPriority is sequential starting at 1", () => {
    for (let i = 0; i < batches.length; i++) {
      assert.strictEqual(batches[i].recommendedGenerationPriority, i + 1);
    }
  });

  it("each batch has estimatedLessonCountMin > 0", () => {
    const bad = batches.filter((b) => b.estimatedLessonCountMin <= 0);
    assert.strictEqual(bad.length, 0);
  });

  it("each batch has at least one domain in domainMix", () => {
    const bad = batches.filter((b) => b.domainMix.length === 0);
    assert.strictEqual(bad.length, 0);
  });
});
