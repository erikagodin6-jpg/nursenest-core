import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildGlossaryGraphNode, validateGlossaryGraphNode } from "@/lib/educational-graph/glossary-graph-node";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";

describe("Glossary traversal governance", () => {
  it("buildGlossaryGraphNode produces native traversal with glossary steps", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const node = buildGlossaryGraphNode(
      {
        termSlug: "sepsis",
        termLabel: "Sepsis",
        topicSlug: "sepsis",
        pathway,
      },
      pathway.id,
    );
    assert.equal(validateGlossaryGraphNode(node), null);
    assert.ok(node.traversal.steps.some((s) => s.stepKind === "glossary"));
    assert.equal(node.traversal.sourceSurface, "glossary_traversal");
  });
});
