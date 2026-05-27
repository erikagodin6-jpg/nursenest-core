import assert from "node:assert/strict";
import test from "node:test";

import { evaluateNursingContentVariation } from "./content-variation-standards";

test("passes varied nursing explanations with different structures", () => {
  const result = evaluateNursingContentVariation([
    {
      id: "r1",
      kind: "rationale",
      text:
        "New confusion with falling oxygen saturation is an airway and breathing cue. The safest first move is focused respiratory assessment and escalation before routine teaching.",
    },
    {
      id: "r2",
      kind: "distractor-rationale",
      text:
        "Teaching incentive spirometry can help later, but the stem shows active deterioration. Delaying assessment could allow hypoxia to worsen.",
    },
    {
      id: "r3",
      kind: "hint",
      text:
        "Start by asking which client is unstable right now. Acute breathing changes outrank comfort measures and documentation.",
    },
    {
      id: "r4",
      kind: "rationale",
      text:
        "Delegation is safe only when the task is predictable and the client is stable. Assessment and escalation stay with the nurse when risk is changing.",
    },
  ]);

  assert.equal(result.pass, true);
  assert.equal(result.issues.length, 0);
});

test("flags repeated opening patterns and template phrases", () => {
  const result = evaluateNursingContentVariation([
    {
      id: "a",
      kind: "distractor-rationale",
      text: "This option does not address the priority assessment or intervention implied by the stem.",
    },
    {
      id: "b",
      kind: "distractor-rationale",
      text: "This option can seem reasonable, but this option delays the priority assessment.",
    },
    {
      id: "c",
      kind: "distractor-rationale",
      text: "This option can seem reasonable, but this option delays the priority intervention.",
    },
    {
      id: "d",
      kind: "distractor-rationale",
      text: "This option can seem reasonable, but this option delays the priority safety action.",
    },
  ]);

  assert.equal(result.pass, false);
  assert.ok(result.issues.some((issue) => issue.code === "TEMPLATE_PHRASE"));
  assert.ok(result.issues.some((issue) => issue.code === "REPEATED_OPENING_PATTERN"));
});

test("flags repeated sentence frames across a study set", () => {
  const result = evaluateNursingContentVariation([
    { id: "q1", kind: "rationale", text: "The nurse should assess breathing first. Oxygenation is the priority." },
    { id: "q2", kind: "rationale", text: "The nurse should reassess pain after medication. Timing confirms response." },
    { id: "q3", kind: "rationale", text: "The nurse should notify the provider after gathering safety data." },
    { id: "q4", kind: "rationale", text: "The nurse should delegate only stable predictable care." },
  ]);

  assert.ok(result.issues.some((issue) => issue.code === "REPEATED_SENTENCE_FRAME"));
});
