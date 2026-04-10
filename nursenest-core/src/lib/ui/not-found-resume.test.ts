import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loadResumeStudyingForNotFound } from "@/lib/ui/not-found-resume";

describe("not-found-resume", () => {
  it("returns null for empty user id without resume CTA surface", async () => {
    assert.equal(await loadResumeStudyingForNotFound(""), null);
    assert.equal(await loadResumeStudyingForNotFound("   "), null);
  });
});
