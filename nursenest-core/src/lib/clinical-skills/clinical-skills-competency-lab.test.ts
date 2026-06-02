import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  auditClinicalSkillsCatalog,
  buildClinicalSkillCompetencyLabProfile,
} from "@/lib/clinical-skills/clinical-skills-competency-lab";
import { listClinicalSkills } from "@/lib/clinical-skills/clinical-skills-catalog";

describe("clinical skills competency lab", () => {
  it("builds the five-mode competency lab profile for every skill", () => {
    for (const skill of listClinicalSkills()) {
      const profile = buildClinicalSkillCompetencyLabProfile(skill);
      assert.deepEqual(
        profile.modes.map((mode) => mode.key),
        ["learn", "practice", "competency", "simulation", "review"],
        skill.slug,
      );
      assert.equal(
        profile.requiredSections.length,
        16,
        `${skill.slug}: required sections`,
      );
      assert.ok(
        profile.practiceQuestionCount >= 20,
        `${skill.slug}: practice question count`,
      );
      assert.equal(
        profile.simulationAvailable,
        true,
        `${skill.slug}: simulation`,
      );
      assert.equal(
        profile.remediationAvailable,
        true,
        `${skill.slug}: remediation`,
      );
    }
  });

  it("audits catalog quality and known volume targets without hiding gaps", () => {
    const audit = auditClinicalSkillsCatalog();
    assert.ok(audit.totalSkills >= 150);
    assert.equal(audit.duplicateTitles.length, 0);
    assert.equal(audit.implemented, audit.totalSkills);
    assert.equal(audit.partial, 0);
    assert.equal(audit.missing, 0);
    assert.equal(audit.volumeTargets.rn, "met");
    assert.equal(audit.volumeTargets.rpnPn, "met");
    assert.equal(audit.volumeTargets.np, "gap");
    assert.equal(audit.volumeTargets.preNursing, "not_modeled");
    assert.equal(audit.volumeTargets.allied, "not_modeled");
  });
});
