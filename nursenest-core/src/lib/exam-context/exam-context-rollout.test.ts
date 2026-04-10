import assert from "node:assert/strict";
import test from "node:test";
import {
  buildGlobalExamContext,
  getExamRegistryEntryByPathwayId,
  getExamRegistryEntryByRegistryKey,
  registryKeyFromPathway,
} from "@/lib/exam-context/exam-registry";
import { examQuestionPoolWhereForContext, pathwayLessonWhere } from "@/lib/exam-context/query-scope";
import { getTerminologyForPathway } from "@/lib/exam-context/terminology";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";

test("buildGlobalExamContext resolves CA and US pathways", () => {
  const caPn = buildGlobalExamContext("ca-rpn-rex-pn", "en");
  assert.ok(caPn);
  assert.equal(caPn?.country, "CA");
  assert.equal(caPn?.exam, "REX_PN");
  assert.equal(caPn?.tier, "RPN");

  const usPn = buildGlobalExamContext("us-lpn-nclex-pn", "en");
  assert.ok(usPn);
  assert.equal(usPn?.country, "US");
  assert.equal(usPn?.exam, "NCLEX_PN");
  assert.equal(usPn?.tier, "PN");
});

test("registry keys remain unique across country variants", () => {
  const caRnPath = getExamPathwayById("ca-rn-nclex-rn");
  const usRnPath = getExamPathwayById("us-rn-nclex-rn");
  assert.ok(caRnPath);
  assert.ok(usRnPath);

  const caKey = registryKeyFromPathway(caRnPath!);
  const usKey = registryKeyFromPathway(usRnPath!);
  assert.notEqual(caKey, usKey);
  assert.equal(caKey, "CA:NCLEX_RN");
  assert.equal(usKey, "US:NCLEX_RN");
  assert.ok(getExamRegistryEntryByRegistryKey(caKey));
  assert.ok(getExamRegistryEntryByRegistryKey(usKey));
});

test("pathwayLessonWhere scopes to pathway + locale from context", () => {
  const ctx = buildGlobalExamContext("ca-rpn-rex-pn", "en");
  assert.ok(ctx);
  const where = pathwayLessonWhere(ctx!);
  assert.deepEqual(where, { pathwayId: "ca-rpn-rex-pn", locale: "en" });
});

test("examQuestionPoolWhereForContext honors pathway exam + tier aliases", () => {
  const caPn = buildGlobalExamContext("ca-rpn-rex-pn", "en");
  assert.ok(caPn);
  const scoped = examQuestionPoolWhereForContext(caPn!);
  assert.ok(scoped.examIn.includes("REX_PN"));
  assert.ok(scoped.tierMatches.includes("rpn"));
  assert.ok(scoped.tierMatches.includes("lvn"));

  const usRn = buildGlobalExamContext("us-rn-nclex-rn", "en");
  assert.ok(usRn);
  const rnScoped = examQuestionPoolWhereForContext(usRn!);
  assert.deepEqual(rnScoped.tierMatches, ["rn"]);
});

test("terminology resolution differentiates CA PN and US PN", () => {
  assert.equal(getTerminologyForPathway("pn_exam_short", "ca-rpn-rex-pn"), "REx-PN");
  assert.equal(getTerminologyForPathway("pn_exam_short", "us-lpn-nclex-pn"), "NCLEX-PN");
  assert.match(getTerminologyForPathway("unlicensed_assistive", "ca-rpn-rex-pn"), /UCP|care aide/i);
  assert.equal(getTerminologyForPathway("unlicensed_assistive", "us-lpn-nclex-pn"), "UAP");
});

test("registry lookup by pathway remains available for analytics/event plumbing", () => {
  const row = getExamRegistryEntryByPathwayId("us-rn-nclex-rn");
  assert.ok(row);
  assert.equal(row?.registryKey, "US:NCLEX_RN");
});
