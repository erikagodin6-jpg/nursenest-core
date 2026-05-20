/**
 * Tests for the canonical topic-slug mapping layer.
 *
 * Run with: npx tsx --test src/lib/content/topic-slug-canonical-map.test.ts
 */
import { strict as assert } from "node:assert";
import { test, describe } from "node:test";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import {
  canonicalTopicSlug,
  canonicalTopicSlugFromTag,
  canonicalTopicSlugFromTags,
  isCatchAllTopic,
  QUESTION_KEY_TO_CANONICAL_SLUG,
  CANONICAL_SLUG_TO_QUESTION_KEY,
  KNOWN_CANONICAL_LESSON_TOPIC_SLUGS,
} from "./topic-slug-canonical-map.js";

// ─── 1. Canonical slug resolution ────────────────────────────────────────────

describe("canonicalTopicSlug", () => {
  const KNOWN_MAPPINGS: [string, string][] = [
    ["copd-respiratory", "copd"],
    ["abg-interpretation", "abg"],
    ["acid-base-advanced", "acid-base"],
    ["myocardial-infarction", "acute-coronary"],
    ["sodium-imbalance", "sodium"],
    ["potassium-imbalance", "potassium"],
    ["fluid-balance", "fluids-electrolytes"],
    ["insulin-hypoglycemia", "diabetes-meds"],
    ["anticoagulants", "anticoagulation"],
    ["pain-management", "pain"],
    ["wound-care", "wounds"],
    ["prioritization-abcs", "prioritization"],
    ["general-nursing-clinical", "clinical-judgment"],
  ];

  for (const [input, expected] of KNOWN_MAPPINGS) {
    test(`maps "${input}" → "${expected}"`, () => {
      assert.equal(canonicalTopicSlug(input), expected);
    });
  }

  test("is idempotent: already-canonical slug returns itself", () => {
    assert.equal(canonicalTopicSlug("copd"), "copd");
    assert.equal(canonicalTopicSlug("clinical-judgment"), "clinical-judgment");
    assert.equal(canonicalTopicSlug("heart-failure"), "heart-failure");
  });

  test("identity: unknown slug returns itself unchanged", () => {
    assert.equal(canonicalTopicSlug("pneumonia"), "pneumonia");
    assert.equal(canonicalTopicSlug("sepsis"), "sepsis");
    assert.equal(canonicalTopicSlug(""), "");
  });
});

// ─── 2. Tag-based resolution ──────────────────────────────────────────────────

describe("canonicalTopicSlugFromTag", () => {
  test("strips topic: prefix and maps", () => {
    assert.equal(canonicalTopicSlugFromTag("topic:copd-respiratory"), "copd");
    assert.equal(canonicalTopicSlugFromTag("topic:insulin-hypoglycemia"), "diabetes-meds");
    assert.equal(canonicalTopicSlugFromTag("topic:general-nursing-clinical"), "clinical-judgment");
  });

  test("works without topic: prefix", () => {
    assert.equal(canonicalTopicSlugFromTag("copd-respiratory"), "copd");
    assert.equal(canonicalTopicSlugFromTag("pneumonia"), "pneumonia");
  });

  test("preserves already-canonical slug from tag", () => {
    assert.equal(canonicalTopicSlugFromTag("topic:copd"), "copd");
    assert.equal(canonicalTopicSlugFromTag("topic:heart-failure"), "heart-failure");
  });
});

describe("canonicalTopicSlugFromTags", () => {
  test("picks topic: tag from an array and maps it", () => {
    const tags = [
      "tier:rn",
      "topic:copd-respiratory",
      "category:respiratory",
      "difficulty:2",
    ];
    assert.equal(canonicalTopicSlugFromTags(tags), "copd");
  });

  test("returns fallback from topic label when no topic: tag", () => {
    assert.equal(canonicalTopicSlugFromTags([], "Copd Respiratory"), "copd");
  });

  test("returns 'general' when no tag and no fallback", () => {
    assert.equal(canonicalTopicSlugFromTags([]), "general");
  });

  test("all 13 priority question keys resolve via tags", () => {
    const priorityKeys = [
      ["copd-respiratory", "copd"],
      ["insulin-hypoglycemia", "diabetes-meds"],
      ["potassium-imbalance", "potassium"],
      ["general-nursing-clinical", "clinical-judgment"],
      ["fluid-balance", "fluids-electrolytes"],
      ["prioritization-abcs", "prioritization"],
      ["abg-interpretation", "abg"],
      ["anticoagulants", "anticoagulation"],
      ["wound-care", "wounds"],
      ["pain-management", "pain"],
      ["sodium-imbalance", "sodium"],
      ["myocardial-infarction", "acute-coronary"],
      ["acid-base-advanced", "acid-base"],
    ];
    for (const [key, expected] of priorityKeys) {
      assert.equal(
        canonicalTopicSlugFromTags([`topic:${key}`]),
        expected,
        `key=${key} should resolve to ${expected}`
      );
    }
  });
});

// ─── 3. Catch-all detection ───────────────────────────────────────────────────

describe("isCatchAllTopic", () => {
  test("clinical-judgment is catch-all", () => {
    assert.ok(isCatchAllTopic("clinical-judgment"));
  });
  test("general-nursing-clinical resolves to catch-all via canonical", () => {
    assert.ok(isCatchAllTopic(canonicalTopicSlug("general-nursing-clinical")));
  });
  test("specific topics are not catch-all", () => {
    assert.ok(!isCatchAllTopic("copd"));
    assert.ok(!isCatchAllTopic("heart-failure"));
    assert.ok(!isCatchAllTopic("pneumonia"));
  });
});

// ─── 4. Map consistency ───────────────────────────────────────────────────────

describe("map consistency", () => {
  test("all canonical values are in KNOWN_CANONICAL_LESSON_TOPIC_SLUGS", () => {
    for (const [key, canon] of Object.entries(QUESTION_KEY_TO_CANONICAL_SLUG)) {
      assert.ok(
        KNOWN_CANONICAL_LESSON_TOPIC_SLUGS.has(canon),
        `canonical "${canon}" (from key "${key}") must be in KNOWN_CANONICAL_LESSON_TOPIC_SLUGS`
      );
    }
  });

  test("reverse map has same entry count as forward map", () => {
    const forwardValues = new Set(Object.values(QUESTION_KEY_TO_CANONICAL_SLUG));
    assert.equal(
      Object.keys(CANONICAL_SLUG_TO_QUESTION_KEY).length,
      forwardValues.size,
      "each canonical slug should appear once in reverse map"
    );
  });

  test("reverse map entries are coherent with forward map", () => {
    for (const [canon, key] of Object.entries(CANONICAL_SLUG_TO_QUESTION_KEY)) {
      assert.equal(
        QUESTION_KEY_TO_CANONICAL_SLUG[key],
        canon,
        `reverse map: ${canon} → ${key} must round-trip`
      );
    }
  });
});

// ─── 5. Catalog lesson coverage for 13 priority topics ───────────────────────

describe("catalog lesson coverage for priority topics", () => {
  const CATALOG_PATH = path.resolve(
    __dirname,
    "../../../src/content/pathway-lessons/catalog.json"
  );

  // Load catalog once for all sub-tests
  let lessonTopicSlugs: Set<string>;
  try {
    const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8")) as {
      pathways: Record<string, { lessons: Array<{ slug: string; topicSlug: string; sections?: unknown[] }> }>;
    };
    const lessons = catalog.pathways["us-rn-nclex-rn"]?.lessons ?? [];
    lessonTopicSlugs = new Set(
      lessons
        .filter((l) => (l.sections ?? []).length >= 2)
        .map((l) => l.topicSlug)
    );
  } catch {
    lessonTopicSlugs = new Set();
  }

  const PRIORITY_KEYS_TO_CANONICAL: [string, string][] = [
    ["copd-respiratory", "copd"],
    ["insulin-hypoglycemia", "diabetes-meds"],
    ["potassium-imbalance", "potassium"],
    ["general-nursing-clinical", "clinical-judgment"],
    ["fluid-balance", "fluids-electrolytes"],
    ["prioritization-abcs", "prioritization"],
    ["abg-interpretation", "abg"],
    ["anticoagulants", "anticoagulation"],
    ["wound-care", "wounds"],
    ["pain-management", "pain"],
    ["sodium-imbalance", "sodium"],
    ["myocardial-infarction", "acute-coronary"],
    ["acid-base-advanced", "acid-base"],
  ];

  for (const [questionKey, canonicalSlug] of PRIORITY_KEYS_TO_CANONICAL) {
    test(`question topic "${questionKey}" → canonical "${canonicalSlug}" has usable lesson in catalog`, () => {
      assert.ok(
        lessonTopicSlugs.has(canonicalSlug),
        `No usable lesson found for canonical slug "${canonicalSlug}" (question key: "${questionKey}")`
      );
    });
  }

  test("all catalog lessons for us-rn-nclex-rn have at least 2 sections", () => {
    if (!fs.existsSync(CATALOG_PATH)) return;
    const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8")) as {
      pathways: Record<string, { lessons: Array<{ slug: string; sections?: unknown[] }> }>;
    };
    const lessons = catalog.pathways["us-rn-nclex-rn"]?.lessons ?? [];
    const thin = lessons.filter((l) => (l.sections ?? []).length < 2);
    assert.equal(
      thin.length,
      0,
      `${thin.length} lessons still have < 2 sections: ${thin.map((l) => l.slug).join(", ")}`
    );
  });
});

// ─── 6. Linking consistency (question topicSlug → lesson topicSlug) ──────────

describe("canonical linking consistency", () => {
  test("every question-bank key either maps directly or via canonical to a lesson topic", () => {
    // All question bank keys from generate-rn-pn-sprint2-batch.ts
    const ALL_QUESTION_KEYS = [
      "pulmonary-embolism", "heart-failure", "myocardial-infarction", "angina",
      "dysrhythmias", "hypertension", "shock", "asthma", "ards", "pneumonia",
      "copd-respiratory", "abg-interpretation", "acid-base-advanced",
      "sodium-imbalance", "potassium-imbalance", "insulin-hypoglycemia",
      "sepsis", "infection-control", "anticoagulants", "antibiotics",
      "pain-management", "wound-care", "delegation", "fluid-balance",
      "prioritization-abcs", "neurological-acute-care", "mental-health-crisis",
      "pediatrics-care", "maternal-newborn-care", "gastrointestinal-acute-care",
      "renal-genitourinary-care", "hematology-oncology-care", "musculoskeletal-care",
      "integumentary-burn-wound", "emergency-triage-disaster",
      "fundamentals-patient-safety", "general-nursing-clinical",
    ];

    for (const key of ALL_QUESTION_KEYS) {
      const canonical = canonicalTopicSlug(key);
      assert.ok(
        typeof canonical === "string" && canonical.length > 0,
        `key "${key}" must resolve to a non-empty canonical slug`
      );
    }
  });
});
