import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { listClinicalSkills } from "@/lib/clinical-skills/clinical-skills-catalog";
import { getClinicalSkillEnrichment, sequencingLabelsForSkill } from "@/lib/clinical-skills/clinical-skills-enrichment";

describe("clinical-skills-enrichment", () => {
  it("provides flashcards and error scenarios for every catalog skill", () => {
    for (const skill of listClinicalSkills()) {
      const e = getClinicalSkillEnrichment(skill);
      assert.ok(e.simulationOverview.length > 20, `${skill.slug} overview`);
      assert.ok(e.flashcards.length >= 4, `${skill.slug} flashcards`);
      assert.ok(e.errorScenario.options.length >= 4, `${skill.slug} error options`);
      assert.equal(e.steps.length, skill.steps.length, `${skill.slug} step parity`);
      const seq = sequencingLabelsForSkill(skill);
      assert.deepEqual(seq, skill.steps.map((s) => s.title));
    }
  });
});
