import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientPath = join(__dirname, "practice-question-session-client.tsx");

describe("PracticeQuestionSessionClient rationale timing", () => {
  it("reveals rationale only in tutor / weak_area modes after grading (not raw stem phase)", () => {
    const src = readFileSync(clientPath, "utf8");
    assert.ok(src.includes('showRationaleNow = Boolean(g && (mode === "tutor" || mode === "weak_area"))'));
    assert.ok(src.includes('itemStep === "answering"'));
    assert.ok(src.includes('showRationaleNow && rationaleText'));
  });
});
