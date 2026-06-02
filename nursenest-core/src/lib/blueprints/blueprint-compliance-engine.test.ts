import assert from "node:assert/strict";
import test from "node:test";
import { buildBlueprintComplianceReport } from "@/lib/blueprints/blueprint-compliance-engine";
import { EXAM_BLUEPRINTS } from "@/lib/blueprints/exam-blueprint-definitions";
import { normalizeBlueprintDomain } from "@/lib/blueprints/domain-normalization";

test("blueprint compliance computes actual percentages and variance", () => {
  const blueprint = EXAM_BLUEPRINTS.nclex_rn;
  const report = buildBlueprintComplianceReport(blueprint, [
    { domainId: "cardiovascular", questions: 30, flashcards: 10, lessons: 5, simulations: 0 },
    { domainId: "mental_health", questions: 10, flashcards: 5, lessons: 5, simulations: 0 },
  ]);

  const cardio = report.rows.find((row) => row.domainId === "cardiovascular");
  assert.ok(cardio);
  assert.equal(cardio.totalItems, 45);
  assert.equal(cardio.actualPercent, 69.2);
  assert.equal(cardio.status, "overrepresented");
  assert.ok(report.complianceScore < 100);
});

test("blueprint compliance flags missing domains as content priorities", () => {
  const report = buildBlueprintComplianceReport(EXAM_BLUEPRINTS.rex_pn, [
    { domainId: "respiratory", questions: 12, flashcards: 0, lessons: 0, simulations: 0 },
  ]);
  const missing = report.rows.filter((row) => row.status === "missing");
  assert.ok(missing.length > 0);
  assert.ok(report.missingObjectives.length > 0);
  assert.ok(report.underrepresentedDomains.some((row) => row.priority === "critical"));
});

test("domain normalization maps common clinical taxonomy signals into blueprint domains", () => {
  assert.equal(normalizeBlueprintDomain(EXAM_BLUEPRINTS.nclex_rn, ["Cardiovascular", "Heart failure"]), "cardiovascular");
  assert.equal(normalizeBlueprintDomain(EXAM_BLUEPRINTS.nclex_rn, ["Insulin administration"]), "pharmacology");
  assert.equal(normalizeBlueprintDomain(EXAM_BLUEPRINTS.rt, ["Mechanical ventilation and PEEP"]), "airway_ventilation");
});
