import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { weakTopicSuggestsClinicalSkillsFocus } from "@/lib/clinical-skills/clinical-skills-adaptive-signals";

describe("clinical skills adaptive signals", () => {
  it("matches procedural weak-topic hints", () => {
    assert.equal(weakTopicSuggestsClinicalSkillsFocus("Sterile dressing technique"), true);
    assert.equal(weakTopicSuggestsClinicalSkillsFocus("NG tube placement verification"), true);
    assert.equal(weakTopicSuggestsClinicalSkillsFocus("Fluid & electrolyte labs"), false);
  });
});
