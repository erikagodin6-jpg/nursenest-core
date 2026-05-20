import assert from "node:assert/strict";
import { after, describe, it } from "node:test";
import { resolveExamPathwaySafe } from "@/lib/exam-pathways/resolve-exam-pathway-safe";

describe("resolveExamPathwaySafe — internal admissions QA flag", () => {
  after(() => {
    delete process.env.NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS;
  });

  it("returns null for hidden admissions pathway when flag is unset", async () => {
    delete process.env.NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS;
    const p = await resolveExamPathwaySafe("us", "allied", "hesi-a2", { pathname: "/us/allied/hesi-a2" });
    assert.equal(p, null);
  });

  it("resolves hidden admissions pathway when NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS=1", async () => {
    process.env.NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS = "1";
    const p = await resolveExamPathwaySafe("us", "allied", "ati-teas", { pathname: "/us/allied/ati-teas" });
    assert.ok(p);
    assert.equal(p.id, "us-allied-ati-teas");
  });
});
