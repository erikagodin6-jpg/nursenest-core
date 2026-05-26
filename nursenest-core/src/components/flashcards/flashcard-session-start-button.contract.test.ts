import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const APP_ROOT = path.resolve(__dirname, "../../..");

function read(relPath: string): string {
  return fs.readFileSync(path.join(APP_ROOT, relPath), "utf8");
}

describe("FlashcardSessionStartButton route contract", () => {
  it("starts deck study in the current learner flashcard shell, not the legacy session player", () => {
    const src = read("src/components/flashcards/flashcard-session-start-button.tsx");
    assert.ok(src.includes("`/app/flashcards/${encodeURIComponent(ref)}?${params.toString()}`"));
    assert.equal(src.includes("/session/"), false);
    assert.equal(src.includes("startOrResumeSessionAction"), false);
  });
});
