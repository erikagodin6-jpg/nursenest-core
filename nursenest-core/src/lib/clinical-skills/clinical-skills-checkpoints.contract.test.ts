import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { listClinicalSkills } from "@/lib/clinical-skills/clinical-skills-catalog";
import { CLINICAL_SKILL_MIN_MCQ_COUNT, getClinicalSkillCheckpoints } from "@/lib/clinical-skills/clinical-skills-checkpoints";

describe("clinical skills checkpoints", () => {
  it("every skill has at least seven MCQs with rationales", () => {
    for (const skill of listClinicalSkills()) {
      const items = getClinicalSkillCheckpoints(skill.slug);
      assert.ok(items.length >= CLINICAL_SKILL_MIN_MCQ_COUNT, `${skill.slug}: expected at least ${CLINICAL_SKILL_MIN_MCQ_COUNT}`);
      for (const item of items) {
        assert.ok(item.question.trim().length > 10, skill.slug);
        assert.equal(item.options.length, 4, skill.slug);
        assert.ok(item.rationale?.trim().length, skill.slug);
        assert.ok(item.correct >= 0 && item.correct < 4, skill.slug);
      }
    }
  });
});
