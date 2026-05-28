import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { listClinicalSkills } from "@/lib/clinical-skills/clinical-skills-catalog";

describe("clinical skills catalog contract", () => {
  it("has unique slugs and non-empty steps", () => {
    const skills = listClinicalSkills();
    const slugs = skills.map((s) => s.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    for (const s of skills) {
      assert.ok(s.steps.length > 0, s.slug);
      assert.ok(s.title.trim().length > 0, s.slug);
    }
  });

  it("includes substantial skills across every competency tier", () => {
    const skills = listClinicalSkills();
    const byTier = new Map<string, number>();
    for (const skill of skills) {
      byTier.set(skill.competencyTier, (byTier.get(skill.competencyTier) ?? 0) + 1);
    }
    assert.ok((byTier.get("foundation") ?? 0) >= 5, "foundation tier should include multiple bedside skills");
    assert.ok((byTier.get("proficiency") ?? 0) >= 5, "proficiency tier should include multiple bedside skills");
    assert.ok((byTier.get("simulation_ready") ?? 0) >= 4, "simulation-ready tier should include multiple complex skills");
  });
});
