import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { mltGramStainReference } from "@/content/morphology/mlt-gram-stain-reference";

const REQUIRED_GRAM_STAIN_PATTERNS = [
  "gram-positive-cocci-clusters",
  "gram-positive-cocci-chains",
  "gram-negative-rods",
  "gram-positive-rods",
  "yeast-budding",
] as const;

describe("MLS/MLT Gram stain reference metadata", () => {
  it("ships the foundational Gram stain visual reasoning patterns", () => {
    assert.ok(
      mltGramStainReference.length >= REQUIRED_GRAM_STAIN_PATTERNS.length,
      `expected at least ${REQUIRED_GRAM_STAIN_PATTERNS.length} Gram stain patterns`,
    );

    const ids = new Set(mltGramStainReference.map((entry) => entry.id));
    for (const required of REQUIRED_GRAM_STAIN_PATTERNS) {
      assert.ok(ids.has(required), `missing Gram stain reference: ${required}`);
    }
  });

  it("keeps every Gram stain entry workflow-aware and source-aware", () => {
    for (const entry of mltGramStainReference) {
      assert.ok(entry.pattern.length > 6, `${entry.id} must include a pattern label`);
      assert.ok(entry.morphology.length > 2, `${entry.id} must include morphology`);
      assert.ok(entry.arrangement.length > 2, `${entry.id} must include arrangement`);
      assert.ok(entry.description.length > 40, `${entry.id} description is too thin`);
      assert.ok(entry.commonOrganismGroups.length >= 1, `${entry.id} must include organism groups`);
      assert.ok(entry.specimenContext.length >= 1, `${entry.id} must include specimen context`);
      assert.ok(entry.differentialPatterns.length >= 1, `${entry.id} must include differential patterns`);
      assert.ok(entry.workflowImplications.length >= 1, `${entry.id} must include workflow implications`);
      assert.ok(entry.escalationTriggers.length >= 1, `${entry.id} must include escalation triggers`);
      assert.ok(entry.examRelevance.length > 50, `${entry.id} exam relevance is too thin`);
      assert.ok(entry.gramStainTags.length >= 1, `${entry.id} must include Gram stain tags`);
    }
  });

  it("preserves sterile-site escalation reasoning", () => {
    const sterileSiteEntries = mltGramStainReference.filter((entry) =>
      entry.specimenContext.some((context) => /blood culture|sterile/i.test(context)) ||
      entry.escalationTriggers.some((trigger) => /sterile|blood culture|bacteremia/i.test(trigger)),
    );

    assert.ok(sterileSiteEntries.length >= 4, "expected multiple sterile-site escalation patterns");
    for (const entry of sterileSiteEntries) {
      const combined = [entry.specimenContext.join(" "), entry.escalationTriggers.join(" "), entry.workflowImplications.join(" ")].join(" ");
      assert.match(combined, /blood culture|sterile|preliminary|communication|bacteremia|sepsis/i);
    }
  });
});
