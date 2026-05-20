import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { auditNursingGlossaryRegistry, glossaryGraphMetadataForTerm } from "@/lib/educational-graph/nursing-glossary-governance";
import { listNursingGlossaryTerms } from "@/lib/seo/nursing-glossary-registry";
import { GLOSSARY_TARGET_TERM_COUNT } from "@/lib/educational-graph/nursing-glossary-governance";

describe("Glossary graph governance — fifth pass scale", () => {
  it("registry meets phased term count target", () => {
    const audit = auditNursingGlossaryRegistry();
    assert.ok(audit.termCount >= 150, `expected >=150 terms, got ${audit.termCount}`);
    assert.ok(audit.termCount <= GLOSSARY_TARGET_TERM_COUNT + 50);
    assert.equal(audit.issues.length, 0, JSON.stringify(audit.issues.slice(0, 5)));
  });

  it("each term exposes graph metadata for traversal", () => {
    const sample = listNursingGlossaryTerms().slice(0, 20);
    for (const term of sample) {
      const meta = glossaryGraphMetadataForTerm(term);
      assert.ok(meta.canonicalHref.startsWith("/nursing-glossary/"));
      assert.ok(meta.telemetryNamespace.includes("glossary"));
      assert.equal(meta.remediationTopicSlug, term.topicSlug);
    }
  });
});
