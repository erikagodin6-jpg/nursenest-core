import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  LESSON_AI_EXPAND_NP_PATHWAY_IDS,
  LESSON_AI_EXPAND_RN_PATHWAY_IDS,
  parseTierCliArg,
  pathwayIdsForTiers,
} from "@/lib/lessons/lesson-ai-expand-shared";

describe("lesson-ai-expand-shared", () => {
  it("parseTierCliArg accepts np and comma lists", () => {
    const tiers = parseTierCliArg(["--tier", "rn,np,rpn"], new Set(["rn"]));
    assert.ok(tiers.has("rn"));
    assert.ok(tiers.has("np"));
    assert.ok(tiers.has("rpn"));
  });

  it("pathwayIdsForTiers np selects only NP pathway ids", () => {
    const ids = pathwayIdsForTiers(new Set(["np"]));
    for (const id of LESSON_AI_EXPAND_NP_PATHWAY_IDS) assert.ok(ids.has(id));
    for (const id of LESSON_AI_EXPAND_RN_PATHWAY_IDS) assert.ok(!ids.has(id));
  });
});
