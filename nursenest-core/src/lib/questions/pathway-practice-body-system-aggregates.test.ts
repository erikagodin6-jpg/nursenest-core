import "../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildSkeletonPracticeHubAggregates,
  hydratePracticeHubAggregatesFromGroupByRows,
} from "@/lib/questions/pathway-practice-hub-inventory";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import {
  auditPracticeHubCountsForPathway,
  practiceHubWhereClauseSummary,
} from "@/lib/questions/pathway-practice-hub-count-audit";

describe("pathway-practice-body-system-aggregates", () => {
  it("returns a full skeleton including pharmacology and leadership_prioritization at zero", () => {
    const s = buildSkeletonPracticeHubAggregates();
    assert.ok(s.some((x) => x.id === "pharmacology" && x.questionCount === 0));
    assert.ok(s.some((x) => x.id === "leadership_prioritization" && x.questionCount === 0));
    assert.ok(s.some((x) => x.id === "uncategorized"));
  });

  it("keeps zero-count hubs after hydration", () => {
    const h = hydratePracticeHubAggregatesFromGroupByRows([]);
    assert.equal(h.find((x) => x.id === "pharmacology")?.questionCount, 0);
    assert.equal(h.find((x) => x.id === "cardiovascular")?.questionCount, 0);
  });

  it("hydrates counts from ExamQuestion-style groupBy rows", () => {
    const h = hydratePracticeHubAggregatesFromGroupByRows([
      {
        bodySystem: "Pharmacology",
        topic: null,
        nclexClientNeedsCategory: null,
        _count: { _all: 3 },
      },
    ]);
    assert.equal(h.find((x) => x.id === "pharmacology")?.questionCount, 3);
  });

  it("uses nclexClientNeedsCategory to route into leadership_prioritization", () => {
    const h = hydratePracticeHubAggregatesFromGroupByRows([
      {
        bodySystem: null,
        topic: "Misc",
        nclexClientNeedsCategory: "Management of Care",
        _count: { _all: 2 },
      },
    ]);
    const lp = h.find((x) => x.id === "leadership_prioritization");
    assert.ok(lp && lp.questionCount >= 2);
  });

  it("keeps total aggregate count equal to grouped input count and reports uncategorized separately", () => {
    const grouped = [
      {
        bodySystem: "Cardiac",
        topic: null,
        nclexClientNeedsCategory: null,
        _count: { _all: 486 },
      },
      {
        bodySystem: "Pharmacology",
        topic: null,
        nclexClientNeedsCategory: null,
        _count: { _all: 448 },
      },
      {
        bodySystem: null,
        topic: "Unmapped mixed topic",
        nclexClientNeedsCategory: null,
        _count: { _all: 2089 },
      },
    ];
    const h = hydratePracticeHubAggregatesFromGroupByRows(grouped);
    const inputTotal = grouped.reduce((sum, row) => sum + row._count._all, 0);
    const aggregateTotal = h.reduce((sum, row) => sum + row.questionCount, 0);

    assert.equal(aggregateTotal, inputTotal);
    assert.equal(h.find((x) => x.id === "cardiovascular")?.questionCount, 486);
    assert.equal(h.find((x) => x.id === "pharmacology")?.questionCount, 448);
    assert.equal(h.find((x) => x.id === "uncategorized")?.label, "Other / multi-topic");
    assert.equal(h.find((x) => x.id === "uncategorized")?.questionCount, 2089);
  });

  it("documents that marketing hub counts do not apply CAT complete-row filters", () => {
    const summary = practiceHubWhereClauseSummary("us-rn-nclex-rn");
    assert.equal(summary.appliesCatCompleteRowFilter, false);
    assert.equal(summary.usesMarketingPathwayWhere, true);
    assert.equal(summary.usesNonEcgPracticeFilter, true);
    assert.equal(summary.usesGeneralStudyBankModuleSurfaceFilter, true);

    const serialized = JSON.stringify(summary.where);
    assert.doesNotMatch(serialized, /stem/);
    assert.doesNotMatch(serialized, /correctAnswer/);
    assert.doesNotMatch(serialized, /rationale/);
    assert.doesNotMatch(serialized, /isAdaptiveEligible/);
  });
});

const dbUrl = Boolean(process.env.DATABASE_URL?.trim());
const testDb = dbUrl && isDatabaseUrlConfigured() ? it : it.skip;

describe("us-rn-nclex-rn practice hub count audit", () => {
  testDb("keeps DB grouped totals equal to final normalized hub totals", async () => {
    const audit = await auditPracticeHubCountsForPathway("us-rn-nclex-rn");
    const groupedTotal = audit.groupedRows.reduce((sum, row) => sum + row._count._all, 0);
    const normalizedTotal = audit.normalizedHubTotals.reduce((sum, row) => sum + row.questionCount, 0);

    assert.equal(audit.pathwayId, "us-rn-nclex-rn");
    assert.equal(audit.country, "US");
    assert.equal(audit.tier, "RN");
    assert.deepEqual(audit.contentExamKeys, ["NCLEX-RN", "NCLEX_RN"]);
    assert.equal(audit.totalMatchingRows, groupedTotal);
    assert.equal(normalizedTotal, audit.totalMatchingRows);
    assert.equal(audit.finalWhereClauseSummary.appliesCatCompleteRowFilter, false);
    assert.equal(audit.normalizedHubTotals.find((row) => row.id === "uncategorized")?.label, "Other / multi-topic");
  });
});
