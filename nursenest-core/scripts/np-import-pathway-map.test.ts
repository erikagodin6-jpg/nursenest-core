import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveImportedNpPathwayId } from "./np-import-pathway-map";

describe("resolveImportedNpPathwayId", () => {
  it("maps AANP-FNP content to the live US FNP pathway", () => {
    assert.equal(resolveImportedNpPathwayId("AANP-FNP"), "us-np-fnp");
  });

  it("keeps CNPLE content on the Canadian NP pathway", () => {
    assert.equal(resolveImportedNpPathwayId("CNPLE-NP"), "ca-np-cnple");
  });
});
