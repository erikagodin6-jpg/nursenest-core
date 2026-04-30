import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientPath = join(__dirname, "marketing-practice-questions-hub-client.tsx");

describe("MarketingPracticeQuestionsHubClient", () => {
  it("exposes body-system card test ids and practiceHubIds in start link flow", () => {
    const src = readFileSync(clientPath, "utf8");
    assert.ok(src.includes('data-testid="practice-body-system-cards"'));
    assert.ok(src.includes('data-testid="start-selected-systems-practice"'));
    assert.ok(src.includes("practiceHubIds"));
  });
});
