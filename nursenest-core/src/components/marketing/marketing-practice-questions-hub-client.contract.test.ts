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

  it("does not render a default lesson-topic grid (topics only in advanced drawer)", () => {
    const src = readFileSync(clientPath, "utf8");
    assert.ok(src.includes("Advanced: refine by lesson topic"));
    assert.ok(src.includes('data-testid="advanced-topic-refine-list"'));
    assert.ok(!src.includes("Angina"));
    assert.ok(!src.includes("Heart failure"));
  });

  it("exposes filter strip and CAT app link with pathway-scoped href", () => {
    const src = readFileSync(clientPath, "utf8");
    assert.ok(src.includes('data-testid="practice-hub-filter-strip"'));
    assert.ok(src.includes('data-testid="quick-cat-app-link"'));
    assert.ok(src.includes("appPathwayCatSessionStartPath(pid)"));
  });

  it("includes studyLaunchPayload on adaptive POST", () => {
    const src = readFileSync(clientPath, "utf8");
    assert.ok(src.includes("studyLaunchPayload"));
    assert.ok(src.includes("selectedCategories"));
  });
});
