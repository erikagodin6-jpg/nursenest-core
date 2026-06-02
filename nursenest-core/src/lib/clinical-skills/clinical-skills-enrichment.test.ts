import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { listClinicalSkills } from "@/lib/clinical-skills/clinical-skills-catalog";
import { getClinicalSkillCheckpoints } from "@/lib/clinical-skills/clinical-skills-checkpoints";
import {
  getClinicalSkillEnrichment,
  sequencingLabelsForSkill,
} from "@/lib/clinical-skills/clinical-skills-enrichment";

describe("clinical-skills-enrichment", () => {
  it("provides competency-lab practice, review, and error scenarios for every catalog skill", () => {
    for (const skill of listClinicalSkills()) {
      const e = getClinicalSkillEnrichment(skill);
      assert.ok(e.simulationOverview.length > 20, `${skill.slug} overview`);
      assert.ok(e.flashcards.length >= 10, `${skill.slug} flashcards`);
      assert.ok(
        e.errorScenario.options.length >= 4,
        `${skill.slug} error options`,
      );
      assert.ok(e.retentionItems.length >= 3, `${skill.slug} retention items`);
      assert.ok(
        getClinicalSkillCheckpoints(skill.slug).length >= 20,
        `${skill.slug} practice items`,
      );
      assert.equal(
        e.steps.length,
        skill.steps.length,
        `${skill.slug} step parity`,
      );
      const seq = sequencingLabelsForSkill(skill);
      assert.deepEqual(
        seq,
        skill.steps.map((s) => s.title),
      );
    }
  });
});
