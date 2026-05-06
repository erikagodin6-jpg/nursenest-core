import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pagePath = join(__dirname, "page.tsx");

describe("marketing exam questions hub page", () => {
  it("does not render lesson-topic category grid by default (no Practice by lesson category)", () => {
    const src = readFileSync(pagePath, "utf8");
    assert.ok(!src.includes("Practice by lesson category"), "expected lesson-category heading removed");
    assert.ok(!src.includes("question-set-library-heading"), "expected legacy topic library section removed");
    assert.ok(src.includes("MarketingPracticeQuestionsHubClient"), "expected body-system hub client");
  });

  it("passes pathway into marketing hub client for CAT / app links", () => {
    const src = readFileSync(pagePath, "utf8");
    assert.ok(src.includes("pathway={pathway}"));
    assert.ok(src.includes("loadPathwayPracticeBodySystemHubAggregates"));
  });
});
