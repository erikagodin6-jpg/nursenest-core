import assert from "node:assert/strict";
import { test } from "node:test";
import {
  auditGlossaryTrailLabels,
  buildGlossaryGraphEntity,
} from "@/lib/breadcrumbs/breadcrumb-semantic-integration";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { DEFAULT_INTERPRETATION_PATHWAY_ID } from "@/lib/clinical-interpretation/clinical-interpretation-registry";

test("glossary graph entity includes competency and remediation pathway", () => {
  const pathway = getExamPathwayById(DEFAULT_INTERPRETATION_PATHWAY_ID);
  assert.ok(pathway);
  const entity = buildGlossaryGraphEntity(
    {
      termSlug: "hyperkalemia",
      termLabel: "Hyperkalemia",
      topicSlug: "hyperkalemia",
      pathway,
    },
    pathway.id,
  );
  assert.equal(entity.ontologyNamespace, "reference.glossary");
  assert.ok(entity.remediationPathwayId.includes("hyperkalemia"));
  assert.ok(entity.canonicalHref.startsWith("/nursing-glossary/"));
});

test("glossary trail audit rejects recursion", () => {
  assert.equal(auditGlossaryTrailLabels(["Home", "Glossary", "Glossary", "Term"]), "glossary_recursion");
  assert.equal(auditGlossaryTrailLabels(["Home", "Glossary", "Hyperkalemia"]), null);
});
