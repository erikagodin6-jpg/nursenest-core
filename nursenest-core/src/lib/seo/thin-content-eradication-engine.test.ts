import assert from "node:assert/strict";
import test from "node:test";

import {
  AUTHORITY_EXPANSION_REQUIREMENTS,
  auditIndexablePage,
  buildIndexationImpactSummary,
  buildThinContentDashboard,
  classifyContentInventoryPage,
  type ContentInventoryPage,
} from "@/lib/seo/thin-content-eradication-engine";

function page(overrides: Partial<ContentInventoryPage> = {}): ContentInventoryPage {
  return {
    url: "/conditions/heart-failure",
    title: "Heart Failure",
    kind: "Authority Page",
    indexable: true,
    wordCount: 3600,
    uniqueContentScore: 92,
    educationalValueScore: 94,
    internalLinkCount: 20,
    externalReferenceCount: 8,
    conversionPathCount: 4,
    duplicateGroupId: null,
    targetKeywordValue: "high",
    trafficPotential: "high",
    conversionPotential: "high",
    authorityCategory: "conditions",
    profession: "RN",
    contentBlocks: [
      "Definition",
      "Why It Matters",
      "Assessment",
      "Diagnostics",
      "Management",
      "Clinical Pearls",
      "Case Examples",
      "Common Mistakes",
      "Clinical Reasoning",
      "Exam Considerations",
      "Practice Applications",
      "Patient Scenarios",
      "FAQs",
      "References",
      "Related Topics",
    ],
    bodyPreview: "Heart failure is a clinically significant syndrome with assessment findings, diagnostic reasoning, management, and student practice considerations.",
    ...overrides,
  };
}

test("authority expansion requirements define target depth and internal link ranges", () => {
  const conditions = AUTHORITY_EXPANSION_REQUIREMENTS.find((item) => item.category === "conditions");
  const medications = AUTHORITY_EXPANSION_REQUIREMENTS.find((item) => item.category === "medications");
  const certifications = AUTHORITY_EXPANSION_REQUIREMENTS.find((item) => item.category === "certification");
  const career = AUTHORITY_EXPANSION_REQUIREMENTS.find((item) => item.category === "career");

  assert.equal(conditions?.targetWords.min, 3000);
  assert.equal(medications?.targetWords.min, 2500);
  assert.equal(certifications?.targetWords.min, 4000);
  assert.equal(career?.targetWords.min, 3000);
  assert.ok(conditions?.requiredBlocks.includes("Clinical Reasoning"));
  assert.equal(conditions?.minimumInternalLinks.min, 15);
});

test("auditIndexablePage keeps strong authority pages", () => {
  const result = auditIndexablePage(page());

  assert.equal(result.decision, "KEEP");
  assert.equal(result.severity, "none");
  assert.deepEqual(result.signals, []);
  assert.equal(classifyContentInventoryPage(result.page), "Authority Page");
});

test("auditIndexablePage expands high-value thin authority pages", () => {
  const result = auditIndexablePage(
    page({
      wordCount: 900,
      internalLinkCount: 4,
      contentBlocks: ["Definition", "FAQs"],
      bodyPreview: "Heart failure basics with a short summary.",
    }),
  );

  assert.equal(result.decision, "EXPAND");
  assert.equal(result.signals.includes("below_target_depth"), true);
  assert.equal(result.signals.includes("low_internal_links"), true);
  assert.equal(result.signals.includes("missing_authority_blocks"), true);
  assert.ok(result.requiredExpansionBlocks.includes("Clinical Pearls"));
  assert.ok(result.requiredInternalLinks.includes("Related Lessons"));
});

test("auditIndexablePage noindexes valuable placeholders and deletes low-value scaffolds", () => {
  const valuable = auditIndexablePage(
    page({
      wordCount: 180,
      internalLinkCount: 0,
      bodyPreview: "Coming soon: this page is being developed.",
    }),
  );
  assert.equal(valuable.decision, "NOINDEX");
  assert.equal(valuable.severity, "critical");
  assert.equal(valuable.signals.includes("coming_soon"), true);

  const lowValue = auditIndexablePage(
    page({
      url: "/blog/random-stub",
      title: "Random Stub",
      kind: "Blog Post",
      wordCount: 120,
      targetKeywordValue: "low",
      trafficPotential: "low",
      conversionPotential: "low",
      bodyPreview: "Placeholder scaffold content will be added later.",
    }),
  );
  assert.equal(lowValue.decision, "DELETE");
});

test("auditIndexablePage merges or redirects duplicate content by value", () => {
  const highValueDuplicate = auditIndexablePage(
    page({
      duplicateGroupId: "heart-failure-duplicates",
      wordCount: 1800,
      uniqueContentScore: 42,
      internalLinkCount: 10,
    }),
  );
  assert.equal(highValueDuplicate.decision, "MERGE");
  assert.equal(highValueDuplicate.signals.includes("duplicate_content"), true);

  const lowValueDuplicate = auditIndexablePage(
    page({
      url: "/programmatic/heart-failure-copy",
      kind: "Programmatic Page",
      duplicateGroupId: "heart-failure-duplicates",
      uniqueContentScore: 30,
      targetKeywordValue: "low",
      trafficPotential: "low",
      conversionPotential: "low",
      wordCount: 700,
    }),
  );
  assert.equal(lowValueDuplicate.decision, "REDIRECT");
});

test("allied health weak pages are flagged for profession-specific expansion", () => {
  const result = auditIndexablePage(
    page({
      url: "/rt/abg-interpretation",
      title: "ABG Interpretation For Respiratory Therapy",
      kind: "Career Page",
      authorityCategory: undefined,
      profession: "RT",
      wordCount: 700,
      educationalValueScore: 54,
      internalLinkCount: 3,
      bodyPreview: "ABG interpretation overview for healthcare learners.",
      contentBlocks: ["FAQs"],
    }),
  );

  assert.equal(result.decision, "EXPAND");
  assert.equal(result.signals.includes("weak_allied_specificity"), true);
  assert.ok(result.requiredExpansionBlocks.length > 0);
});

test("buildThinContentDashboard summarizes eradication decisions and indexation risk", () => {
  const dashboard = buildThinContentDashboard([
    page({ url: "/conditions/heart-failure" }),
    page({ url: "/conditions/sepsis", wordCount: 800, internalLinkCount: 4, contentBlocks: ["Definition"], bodyPreview: "Sepsis basics." }),
    page({ url: "/blog/stub", kind: "Blog Post", wordCount: 120, targetKeywordValue: "low", trafficPotential: "low", conversionPotential: "low", bodyPreview: "Coming soon placeholder." }),
    page({ url: "/programmatic/copy", kind: "Programmatic Page", duplicateGroupId: "copy", uniqueContentScore: 30, targetKeywordValue: "low", trafficPotential: "low", conversionPotential: "low", wordCount: 700 }),
  ]);

  assert.equal(dashboard.pagesAudited, 4);
  assert.equal(dashboard.indexablePages, 4);
  assert.equal(dashboard.thinPages, 3);
  assert.equal(dashboard.pagesToExpand, 1);
  assert.equal(dashboard.pagesToRedirect, 1);
  assert.equal(dashboard.pagesToDelete, 1);
  assert.ok(dashboard.crawledNotIndexedRisk > 0);
  assert.equal(dashboard.topExpansionCandidates[0]?.page.url, "/conditions/sepsis");
});

test("buildIndexationImpactSummary measures cleanup impact", () => {
  const before = buildThinContentDashboard([
    page({ url: "/thin", wordCount: 100, bodyPreview: "Coming soon placeholder." }),
    page({ url: "/strong" }),
  ]);
  const after = buildThinContentDashboard([page({ url: "/strong" })]);
  const impact = buildIndexationImpactSummary(before, after);

  assert.equal(impact.thinPagesEliminated, 1);
  assert.ok(impact.authorityScoreChange > 0);
  assert.ok(impact.crawledNotIndexedRiskChange < 0);
});

