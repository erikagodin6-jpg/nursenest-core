import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  SCREENSHOT_PROOF_TARGETS,
  SEO_PRICING_FAQ_BANK,
  SEO_TIER_VALUE_KEYS,
  SEO_TIER_VALUE_PROFILES,
  TIER_COMPARISON_METRIC_KEYS,
  TIER_FEATURE_COMPARISON,
  buildSeoFaqPageJsonLd,
  buildTierBreadcrumbJsonLd,
  buildTierCourseJsonLd,
  buildTierSoftwareApplicationJsonLd,
  type SeoFaqCategory,
} from "./seo-tier-value-expansion";

describe("SEO tier value expansion inventory", () => {
  it("defines every public tier profile with SEO keywords and required internal links", () => {
    const requiredIntents = new Set([
      "subscription comparison",
      "retrieval practice",
      "clinical readiness",
      "medication readiness",
      "rhythm interpretation",
      "authority content",
    ]);

    for (const tierKey of SEO_TIER_VALUE_KEYS) {
      const profile = SEO_TIER_VALUE_PROFILES[tierKey];
      assert.equal(profile.key, tierKey);
      assert.ok(profile.canonicalPath.startsWith("/"));
      assert.ok(profile.primaryKeywords.length >= 3);
      assert.ok(profile.includedFeatures.length >= 4);

      const intents = new Set(profile.internalLinks.map((link) => link.intent));
      for (const intent of requiredIntents) {
        assert.ok(intents.has(intent), `${profile.label} is missing ${intent}`);
      }
    }
  });

  it("covers each comparison row for all paid pricing tiers without generic checkmarks", () => {
    const paidTierKeys = SEO_TIER_VALUE_KEYS.filter(
      (key) => key !== "preNursing",
    );

    for (const rowKey of TIER_COMPARISON_METRIC_KEYS) {
      const row = TIER_FEATURE_COMPARISON[rowKey];
      for (const tierKey of paidTierKeys) {
        const cell = row[tierKey];
        assert.ok(
          cell.label.trim().length > 8,
          `${rowKey}/${tierKey} needs a value statement`,
        );
        assert.notEqual(cell.label.trim(), "✓");
        assert.notEqual(cell.label.toLowerCase().trim(), "included");
        assert.ok(
          cell.evidencePath.trim().length > 0,
          `${rowKey}/${tierKey} needs evidence`,
        );
      }
    }
  });

  it("keeps public quantity claims inventory-backed instead of hardcoded", () => {
    const quantitativeRows = [
      "questions",
      "lessons",
      "flashcards",
      "caseStudies",
      "ngnQuestions",
    ] as const;
    for (const rowKey of quantitativeRows) {
      const row = TIER_FEATURE_COMPARISON[rowKey];
      for (const cell of Object.values(row)) {
        assert.equal(cell.source, "databaseInventory");
        assert.match(cell.label, /Inventory-backed/i);
      }
    }
  });

  it("provides a substantial FAQ bank across required categories", () => {
    const requiredCategories: SeoFaqCategory[] = [
      "Subscriptions",
      "Billing",
      "Refunds",
      "Exam Prep",
      "NCLEX",
      "REx-PN",
      "CNPLE",
      "NP Exams",
      "Clinical Skills",
      "Pharmacology",
      "ECG",
      "Adaptive Learning",
      "Flashcards",
      "CAT Exams",
      "Simulations",
      "Mobile Access",
      "Study Plans",
      "Question Types",
      "Readiness Scores",
      "Progress Tracking",
    ];

    assert.ok(SEO_PRICING_FAQ_BANK.length >= 50);
    const categories = new Set(
      SEO_PRICING_FAQ_BANK.map((item) => item.category),
    );
    for (const category of requiredCategories) {
      assert.ok(categories.has(category), `FAQ bank is missing ${category}`);
    }
  });

  it("builds valid JSON-LD shapes from the same source data", () => {
    const faqJsonLd = buildSeoFaqPageJsonLd(SEO_PRICING_FAQ_BANK.slice(0, 3));
    assert.equal(faqJsonLd["@type"], "FAQPage");
    assert.equal(faqJsonLd.mainEntity.length, 3);
    assert.equal(faqJsonLd.mainEntity[0]["@type"], "Question");

    const profile = SEO_TIER_VALUE_PROFILES.rn;
    const breadcrumb = buildTierBreadcrumbJsonLd(profile);
    const app = buildTierSoftwareApplicationJsonLd(profile);
    const course = buildTierCourseJsonLd(profile);
    assert.equal(breadcrumb["@type"], "BreadcrumbList");
    assert.equal(app["@type"], "SoftwareApplication");
    assert.equal(course["@type"], "Course");
  });

  it("documents screenshot proof targets for the requested feature surfaces", () => {
    const keys = new Set(SCREENSHOT_PROOF_TARGETS.map((target) => target.key));
    for (const key of [
      "questions",
      "flashcards",
      "lessons",
      "cat",
      "clinical-skills",
      "pharmacology",
      "ecg",
      "analytics",
    ]) {
      assert.ok(keys.has(key), `missing screenshot target for ${key}`);
    }
  });
});
