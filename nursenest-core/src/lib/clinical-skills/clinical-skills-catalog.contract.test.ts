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
});
