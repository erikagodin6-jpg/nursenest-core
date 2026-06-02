import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientPath = join(__dirname, "question-bank-practice-client.tsx");

describe("QuestionBankPracticeClient practiceHubIds", () => {
  it("reads practiceHubIds from URL and forwards to /api/questions", () => {
    const src = readFileSync(clientPath, "utf8");
    assert.ok(src.includes('searchParams.get("practiceHubIds")'));
    assert.ok(src.includes('qs.set("practiceHubIds"'));
    assert.ok(src.includes("parsePracticeHubIdsParam"));
  });
});
