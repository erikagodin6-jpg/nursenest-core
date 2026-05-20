import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { STAGE_PRISMA_IMPORT_PROGRAM_MAP } from "./stage-prisma-import-program-map";

describe("STAGE_PRISMA_IMPORT_PROGRAM_MAP", () => {
  it("maps AANP-FNP Stage-I lesson imports onto the live US NP pathway", () => {
    assert.equal(STAGE_PRISMA_IMPORT_PROGRAM_MAP["np"]?.pathwayId, "us-np-fnp");
  });

  it("keeps Canadian NP on its own separate pathway", () => {
    assert.notEqual(STAGE_PRISMA_IMPORT_PROGRAM_MAP["np"]?.pathwayId, "ca-np-cnple");
  });
});
