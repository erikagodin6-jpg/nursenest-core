import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const customStudyClientPath = join(__dirname, "../../components/flashcards/flashcard-custom-study-client.tsx");
const hubClientPath = join(__dirname, "../../components/flashcards/flashcards-hub-client.tsx");

test("custom flashcard sessions expose precise failure copy, not a generic load error", () => {
  const src = readFileSync(customStudyClientPath, "utf8");
  assert.equal(src.includes("Session could not load"), false);
  assert.ok(src.includes("Flashcard pool is empty."));
  assert.ok(src.includes("Your study session could not be created."));
  assert.ok(src.includes("Unable to resume previous session."));
  assert.ok(src.includes("Session data is invalid."));
});

test("custom flashcard bootstrap fetches a stable first window, not a single fragile card", () => {
  const src = readFileSync(customStudyClientPath, "utf8");
  assert.equal(src.includes('q.set("cardLimit", "1")'), false);
  assert.ok(src.includes("Math.min(requestedLimit, 8)"));
});

test("flashcard launcher system cards reserve dimensions during selection", () => {
  const src = readFileSync(hubClientPath, "utf8");
  assert.ok(src.includes("data-nn-e2e-flashcards-system-grid"));
  assert.ok(src.includes("h-[10.75rem]"));
  assert.ok(src.includes("border-2"));
  assert.ok(src.includes("min-w-[6.75rem]"));
});
