import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clinicalSkillsForCompetencyTier,
  clinicalSkillsForRoleTrack,
  listClinicalSkills,
} from "@/lib/clinical-skills/clinical-skills-catalog";

describe("clinical skills catalog contract", () => {
  it("has unique slugs and non-empty steps", () => {
    const skills = listClinicalSkills();
    const slugs = skills.map((s) => s.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    for (const s of skills) {
      assert.ok(s.steps.length > 0, s.slug);
      assert.ok(s.title.trim().length > 0, s.slug);
      assert.ok(s.roleTracks && s.roleTracks.length > 0, `${s.slug}: missing role tracks`);
      assert.ok(s.competencyDomain?.trim(), `${s.slug}: missing competency domain`);
      assert.ok(s.simulationFocus?.trim(), `${s.slug}: missing simulation focus`);
      assert.ok(s.relatedSystems && s.relatedSystems.length > 0, `${s.slug}: missing ecosystem links`);
    }
  });

  it("includes substantial skills across every competency tier", () => {
    assert.ok(clinicalSkillsForCompetencyTier("foundation").length >= 50, "foundation tier should include a full bedside library");
    assert.ok(clinicalSkillsForCompetencyTier("proficiency").length >= 50, "proficiency tier should include a full bedside library");
    assert.ok(clinicalSkillsForCompetencyTier("simulation_ready").length >= 50, "simulation-ready tier should include a full bedside library");
  });

  it("supports tier-scoped role pathways with at least fifty skills per learner stream", () => {
    assert.ok(clinicalSkillsForRoleTrack("rn").length >= 50, "RN stream should expose at least 50 role-scoped skills");
    assert.ok(clinicalSkillsForRoleTrack("rpn_lpn").length >= 50, "RPN/LPN stream should expose at least 50 role-scoped skills");
    assert.ok(clinicalSkillsForRoleTrack("np").length >= 50, "NP stream should expose at least 50 role-scoped skills");
  });
});
