import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSimpleCorrectRationale,
  buildSimpleDistractorRationale,
  hasSimpleRationaleTeachingShape,
  isGenericRationaleText,
} from "@/lib/questions/rationale-quality";

test("detects vague placeholder rationales", () => {
  assert.equal(
    isGenericRationaleText("This option does not address the priority assessment or intervention implied by the stem."),
    true,
  );
  assert.equal(isGenericRationaleText("This is incorrect."), true);
});

test("builds compact correct rationale with reasoning and nursing principle", () => {
  const rationale = buildSimpleCorrectRationale({
    stem: "A client with COPD is increasingly restless and has an SpO2 of 84% on room air. Which action should the nurse take first?",
    correctOptionText: "Place the client in high Fowler's position",
  });

  assert.match(rationale, /because/i);
  assert.match(rationale, /priority|safety|airway|breathing/i);
  assert.equal(hasSimpleRationaleTeachingShape(rationale), true);
});

test("builds distractor rationale that explains the missed stem risk", () => {
  const rationale = buildSimpleDistractorRationale({
    stem: "A client with COPD is increasingly restless and has an SpO2 of 84% on room air. Which action should the nurse take first?",
    optionText: "Encourage oral fluids",
    correctOptionText: "Place the client in high Fowler's position",
  });

  assert.match(rationale, /stem supports/i);
  assert.match(rationale, /delay/i);
  assert.match(rationale, /client's specific risk pattern/i);
  assert.match(rationale, /airway|breathing/i);
});
