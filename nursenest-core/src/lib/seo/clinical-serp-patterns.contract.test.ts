import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { SeoPageDefinition } from "@/lib/seo/programmatic-seo-definitions";
import {
  auditMetaDescriptionQuality,
  META_DESCRIPTION_CHAR_MIN,
} from "@/lib/seo/clinical-meta-description-patterns";
import {
  auditProgrammaticSerpPage,
  titleH1SimilarityRisk,
} from "@/lib/seo/clinical-serp-quality-audit";
import {
  buildExamPrepTitle,
  buildMechanismWhyCausesTitle,
  buildVersusTitle,
  inferSerpIntentFromTitle,
  looksLikeBareTopicTitle,
  titleTruncationRiskMobile,
} from "@/lib/seo/clinical-title-patterns";

describe("clinical SERP title patterns", () => {
  it("builds mechanism and exam titles", () => {
    const t = buildMechanismWhyCausesTitle({
      cause: "Hyperkalemia",
      effect: "Cardiac Arrhythmias",
      qualifier: "NCLEX Review",
    });
    assert.ok(t.includes("Why Hyperkalemia Causes"));
    assert.equal(inferSerpIntentFromTitle("Why COPD Causes Barrel Chest (Air Trapping)"), "mechanism");
    assert.equal(inferSerpIntentFromTitle("ABG Interpretation Explained for Nurses"), "interpretation");
  });

  it("detects bare topics and truncation", () => {
    assert.equal(looksLikeBareTopicTitle("Hyperkalemia"), true);
    assert.equal(looksLikeBareTopicTitle("Why Hyperkalemia Causes ECG Changes for Nurses"), false);
    assert.equal(titleTruncationRiskMobile("Short"), "low");
    assert.equal(titleTruncationRiskMobile("x".repeat(75)), "high");
  });

  it("builds versus and exam prep titles", () => {
    assert.ok(
      buildVersusTitle({ a: "SIADH", b: "Diabetes Insipidus", context: "Key Nursing Differences" }).includes(
        "vs",
      ),
    );
    assert.ok(buildExamPrepTitle({ topic: "Fluid Balance", exam: "NCLEX-RN", variant: "Review" }).includes("NCLEX-RN"));
  });
});

describe("clinical meta description patterns", () => {
  it("flags weak filler", () => {
    const flags = auditMetaDescriptionQuality(
      "Learn about hyperkalemia and symptoms. Click here to read more.",
    );
    assert.ok(flags.includes("weak_filler"));
    assert.ok(flags.includes("vague_opener"));
  });

  it("accepts substantive nursing descriptions", () => {
    const good =
      "Understand why hyperkalemia shifts cardiac resting potential and produces peaked T waves and conduction risk, with nursing assessment priorities and NCLEX-style interpretation cues.";
    const flags = auditMetaDescriptionQuality(good);
    assert.ok(!flags.includes("missing_clinical_anchor"));
    assert.ok(good.length >= META_DESCRIPTION_CHAR_MIN);
  });
});

describe("clinical SERP audit", () => {
  function minimalPage(overrides: Partial<SeoPageDefinition>): SeoPageDefinition {
    return {
      slug: "test-slug",
      title: "Test Title",
      description: "x".repeat(120),
      h1: "Test H1",
      cluster: "study-guide",
      keywords: [],
      sections: [{ heading: "Overview", level: 2, body: ["Body paragraph for SERP audit contract tests."] }],
      ...overrides,
    };
  }

  it("warns on bare topic title", () => {
    const findings = auditProgrammaticSerpPage(
      minimalPage({
        slug: "hyperkalemia",
        title: "Hyperkalemia",
        description:
          "Understand hyperkalemia recognition and nursing priorities with NCLEX-focused prioritization and clinical interpretation cues for acute care practice.",
        h1: "Hyperkalemia Nursing Guide",
      }),
    );
    assert.ok(findings.some((f) => f.code === "bare_topic_title"));
  });

  it("measures title vs H1 similarity", () => {
    assert.equal(titleH1SimilarityRisk("Same", "Same"), "high");
    assert.equal(titleH1SimilarityRisk("Distinct SERP Title for Snippets", "Different On-Page H1"), "low");
  });
});
