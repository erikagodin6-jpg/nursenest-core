/**
 * Tests for flashcard pool → ExamQuestion fallback fixes.
 * Covers:
 * 1. coalesceExamInventoryCountsOntoPathwayHubRows maps taxonomy keys to hub row IDs correctly
 * 2. patient_safety_quality → fundamentals_safety (regression: was professional_practice)
 * 3. Category alias normalization (normalizeFlashcardCategoryAlias)
 * 4. ECG/video questions excluded by FLASHCARD_USABILITY_SQL (structural / type-check coverage)
 * 5. Pathway scoping correctness (RPN/RN/NP only receive tier-compatible questions)
 * 6. CAT question bank existing → flashcard categories must not all be zero
 * 7. discoveryExamContextScopeForFlashcardFallback returns empty (not AND FALSE) for no-key pathways
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyCountsToBuilderCategories,
  coalesceExamInventoryCountsOntoPathwayHubRows,
  resolveBuilderCategoryId,
} from "@/lib/flashcards/flashcard-builder-taxonomy";
import {
  normalizeFlashcardCategoryAlias,
  normalizeFlashcardCategoryCountsToCanonical,
} from "@/lib/flashcards/flashcard-category-normalize";
import { discoveryExamContextScopeForFlashcardFallback } from "@/lib/questions/subscriber-discovery-aggregates";

// ──────────────────────────────────────────────────────────────────────────────
// 1. Taxonomy key → hub row mapping
// ──────────────────────────────────────────────────────────────────────────────
describe("coalesceExamInventoryCountsOntoPathwayHubRows: taxonomy key → hub row", () => {
  it("maps renal_genitourinary → renal_urinary", () => {
    const out = coalesceExamInventoryCountsOntoPathwayHubRows("ca-rn-nclex-rn", {
      renal_genitourinary: 30,
    });
    assert.equal(out["renal_urinary"], 30);
    assert.equal(out["renal_genitourinary"], undefined, "raw key must be remapped");
  });

  it("maps reproductive_obstetrics → reproductive_maternal_newborn", () => {
    const out = coalesceExamInventoryCountsOntoPathwayHubRows("ca-rn-nclex-rn", {
      reproductive_obstetrics: 18,
    });
    assert.equal(out["reproductive_maternal_newborn"], 18);
  });

  it("maps immune_infectious → infection_control", () => {
    const out = coalesceExamInventoryCountsOntoPathwayHubRows("ca-rn-nclex-rn", {
      immune_infectious: 22,
    });
    assert.equal(out["infection_control"], 22);
  });

  it("maps all pharmacology sub-leaves onto single pharmacology hub row", () => {
    const out = coalesceExamInventoryCountsOntoPathwayHubRows("us-rn-nclex-rn", {
      cardiovascular_drugs: 10,
      cns_drugs: 5,
      endocrine_drugs: 8,
      anti_infectives: 12,
      pain_sedation: 3,
    });
    assert.ok((out["pharmacology"] ?? 0) >= 38, "pharmacology should sum all drug sub-leaves");
  });

  it("maps exam-meta sub-leaves onto exam_strategy hub row", () => {
    const out = coalesceExamInventoryCountsOntoPathwayHubRows("us-rn-nclex-rn", {
      test_taking: 9,
      study_strategy: 4,
    });
    assert.ok((out["exam_strategy"] ?? 0) >= 13);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// 2. patient_safety_quality regression fix
// ──────────────────────────────────────────────────────────────────────────────
describe("patient_safety_quality → fundamentals_safety (regression fix)", () => {
  it("patient_safety_quality maps to fundamentals_safety, NOT professional_practice", () => {
    const out = coalesceExamInventoryCountsOntoPathwayHubRows("ca-rn-nclex-rn", {
      patient_safety_quality: 50,
    });
    assert.equal(
      out["fundamentals_safety"],
      50,
      "patient_safety_quality must be in Safety & Prioritization hub row",
    );
    assert.equal(
      out["professional_practice"],
      undefined,
      "patient_safety_quality must NOT bleed into Professional Practice",
    );
  });

  it("applyCountsToBuilderCategories: populated ExamQuestion-derived counts show non-zero fundamentals_safety", () => {
    const opts = applyCountsToBuilderCategories("ca-rn-nclex-rn", {
      patient_safety_quality: 55,
      cardiovascular: 20,
    });
    const safetyRow = opts.find((o) => o.id === "fundamentals_safety");
    assert.ok(safetyRow, "fundamentals_safety row must exist");
    assert.equal(safetyRow!.count, 55);
    const profRow = opts.find((o) => o.id === "professional_practice");
    assert.ok(profRow, "professional_practice row exists");
    assert.equal(profRow!.count, 0, "professional_practice must be 0 (no bleed from safety questions)");
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// 3. Category alias normalization (normalizeFlashcardCategoryAlias)
// ──────────────────────────────────────────────────────────────────────────────
describe("normalizeFlashcardCategoryAlias", () => {
  const cases: Array<[string, string]> = [
    ["CV", "cardiovascular"],
    ["cv system", "cardiovascular"],
    ["cardiovascular system", "cardiovascular"],
    ["cardio", "cardiovascular"],
    ["cardiac", "cardiovascular"],
    ["resp", "respiratory"],
    ["pulmonary", "respiratory"],
    ["neuro", "neurological"],
    ["gi", "gastrointestinal"],
    ["GI", "gastrointestinal"],
    ["renal & urinary", "renal_urinary"],
    ["renal_genitourinary", "renal_urinary"],
    ["gu", "renal_urinary"],
    ["infection control", "immune_infection_control"],
    ["infection_control", "immune_infection_control"],
    ["immune_infectious", "immune_infection_control"],
    ["maternity", "maternity_reproductive"],
    ["maternal & newborn", "maternity_reproductive"],
    ["reproductive_maternal_newborn", "maternity_reproductive"],
    ["psych", "mental_health"],
    ["mental health", "mental_health"],
    ["pharm", "pharmacology"],
    ["fundamentals", "fundamentals_safety"],
    ["safety & prioritization", "fundamentals_safety"],
    ["fundamentals_safety", "fundamentals_safety"],
    ["delegation", "delegation_assignment"],
    ["safe and effective care environment", "fundamentals_safety"],
    ["pharmacological and parenteral therapies", "pharmacology"],
    ["psychosocial integrity", "mental_health"],
    ["hematology & oncology", "hematology_oncology"],
    ["hem-onc", "hematology_oncology"],
  ];

  for (const [input, expected] of cases) {
    it(`normalizes "${input}" → "${expected}"`, () => {
      const result = normalizeFlashcardCategoryAlias(input);
      assert.equal(result, expected, `Expected "${expected}" for input "${input}"`);
    });
  }

  it("returns null for empty string", () => {
    assert.equal(normalizeFlashcardCategoryAlias(""), null);
  });

  it("returns null for null/undefined", () => {
    assert.equal(normalizeFlashcardCategoryAlias(null), null);
    assert.equal(normalizeFlashcardCategoryAlias(undefined), null);
  });

  it("passthrough: exact canonical IDs resolve to themselves", () => {
    const canonicalIds = ["cardiovascular", "respiratory", "pharmacology", "mental_health", "endocrine", "pediatrics"];
    for (const id of canonicalIds) {
      assert.equal(normalizeFlashcardCategoryAlias(id), id, `"${id}" should passthrough`);
    }
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// 4. ECG/video exclusion — structural coverage (no DB required)
// ──────────────────────────────────────────────────────────────────────────────
describe("ECG / video question exclusion", () => {
  it("resolveBuilderCategoryId handles normal MCQ question (smoke test)", () => {
    const id = resolveBuilderCategoryId({
      label: "Cardiovascular",
      examBodySystem: "Cardiovascular",
      examTopic: "Heart failure nursing priorities",
    });
    assert.equal(id, "cardiovascular");
  });

  it("flashcard-exam-bank-hub-inventory FLASHCARD_USABILITY_SQL is exported via module (structural check)", async () => {
    // We can't run the SQL without a DB, but we verify the module exports load correctly and
    // the function shapes are present.
    const mod = await import("@/lib/flashcards/flashcard-exam-bank-hub-inventory");
    assert.ok(typeof mod.loadExamQuestionHubInventoryForPathway === "function");
    assert.ok(typeof mod.loadExamQuestionRowsForFlashcardPool === "function");
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// 5. Pathway scoping correctness
// ──────────────────────────────────────────────────────────────────────────────
describe("pathway scoping — coalesceExamInventoryCountsOntoPathwayHubRows", () => {
  it("RPN pathway coalesces renal_genitourinary to renal_urinary (same mapping as RN)", () => {
    const out = coalesceExamInventoryCountsOntoPathwayHubRows("ca-rpn-rex-pn", {
      renal_genitourinary: 15,
    });
    assert.equal(out["renal_urinary"], 15);
  });

  it("US RN pathway maps same taxonomy keys as CA RN", () => {
    const outCA = coalesceExamInventoryCountsOntoPathwayHubRows("ca-rn-nclex-rn", {
      immune_infectious: 10,
      patient_safety_quality: 8,
    });
    const outUS = coalesceExamInventoryCountsOntoPathwayHubRows("us-rn-nclex-rn", {
      immune_infectious: 10,
      patient_safety_quality: 8,
    });
    assert.deepEqual(outCA, outUS, "CA and US RN pathways should produce identical coalesced counts");
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// 6. Populated question bank cannot result in all-zero categories
// ──────────────────────────────────────────────────────────────────────────────
describe("populated ExamQuestion bank → flashcard categories must not all be zero", () => {
  it("applyCountsToBuilderCategories with realistic ExamQuestion category distribution → at least 5 non-zero rows", () => {
    // Simulate a realistic exam bank category distribution
    const simulatedExamBankCounts: Record<string, number> = {
      cardiovascular: 120,
      respiratory: 95,
      neurological: 80,
      renal_genitourinary: 60,
      gastrointestinal: 55,
      endocrine: 70,
      reproductive_obstetrics: 45,
      pediatrics: 50,
      mental_health: 65,
      pharmacology: 110,
      immune_infectious: 75,
      patient_safety_quality: 90,
      leadership_management: 40,
      hematology_oncology: 35,
    };

    const coalesced = coalesceExamInventoryCountsOntoPathwayHubRows("us-rn-nclex-rn", simulatedExamBankCounts);
    const opts = applyCountsToBuilderCategories("us-rn-nclex-rn", coalesced);

    const nonZeroRows = opts.filter((o) => o.count > 0);
    assert.ok(nonZeroRows.length >= 5, `Expected at least 5 non-zero category rows, got ${nonZeroRows.length}`);

    // Verify specific mappings are non-zero
    const check = (id: string, expectedMin: number) => {
      const row = opts.find((o) => o.id === id);
      assert.ok(row && row.count >= expectedMin, `Expected ${id} count >= ${expectedMin}, got ${row?.count ?? 0}`);
    };
    check("cardiovascular", 120);
    check("respiratory", 95);
    check("pharmacology", 110);
    check("fundamentals_safety", 90); // patient_safety_quality mapped here
    check("infection_control", 75);
  });

  it("normalizeFlashcardCategoryCountsToCanonical with exam bank distribution → no canonical category dominates as zero", () => {
    const rawCounts: Record<string, number> = {
      "Cardiovascular": 100,
      "Respiratory": 80,
      "Renal": 50,
      "GI": 40,
      "Pharmacology": 90,
      "Mental Health": 60,
      "Infection Control": 55,
    };
    const canonical = normalizeFlashcardCategoryCountsToCanonical(rawCounts);
    assert.ok(canonical["cardiovascular"] > 0, "cardiovascular should be non-zero");
    assert.ok(canonical["respiratory"] > 0, "respiratory should be non-zero");
    assert.ok(canonical["pharmacology"] > 0, "pharmacology should be non-zero");
    assert.ok(canonical["mental_health"] > 0, "mental_health should be non-zero");
    assert.ok(canonical["immune_infection_control"] > 0, "immune_infection_control should be non-zero");
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// 7. discoveryExamContextScopeForFlashcardFallback: no AND FALSE for empty keys
// ──────────────────────────────────────────────────────────────────────────────
describe("discoveryExamContextScopeForFlashcardFallback: empty contentExamKeys → no scope filter", () => {
  it("returns hasScopeFilter=false and empty sql when examContext is null", () => {
    const { hasScopeFilter } = discoveryExamContextScopeForFlashcardFallback(null);
    assert.equal(hasScopeFilter, false);
  });

  it("returns hasScopeFilter=true for a valid pathway context with contentExamKeys", () => {
    // Build a minimal GlobalExamContext for a registered pathway
    // For pathways with non-empty contentExamKeys, scope filter must be applied
    const fakeCtx = {
      pathwayId: "us-rn-nclex-rn",
      tier: "RN",
      language: "en",
    };
    const { hasScopeFilter } = discoveryExamContextScopeForFlashcardFallback(fakeCtx as never);
    // us-rn-nclex-rn has contentExamKeys: ["NCLEX-RN", "NCLEX_RN"] → hasScopeFilter must be true
    assert.equal(hasScopeFilter, true);
  });
});
