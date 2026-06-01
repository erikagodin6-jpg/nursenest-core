import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const customStudyClientPath = join(__dirname, "../../components/flashcards/flashcard-custom-study-client.tsx");
const deckStudyClientPath = join(__dirname, "../../components/flashcards/flashcard-study-client.tsx");
const hubClientPath = join(__dirname, "../../components/flashcards/flashcards-hub-client.tsx");
const customSessionRoutePath = join(__dirname, "../../app/api/flashcards/custom-session/route.ts");
const deckStudyRoutePath = join(__dirname, "../../app/api/flashcards/decks/[deckRef]/study/route.ts");

test("custom flashcard sessions expose precise failure copy, not a generic load error", () => {
  const src = readFileSync(customStudyClientPath, "utf8");
  assert.equal(src.includes("Session could not load"), false);
  assert.ok(src.includes("Flashcard pool is empty."));
  assert.ok(src.includes("Your study session could not be created."));
  assert.ok(src.includes("Unable to resume previous session."));
  assert.ok(src.includes("Session data is invalid."));
});

test("deck flashcard sessions expose precise API-backed failures, not a generic load error", () => {
  const src = readFileSync(deckStudyClientPath, "utf8");
  assert.equal(src.includes("Session could not load"), false);
  assert.equal(src.includes("We could not load this flashcard session"), false);
  assert.ok(src.includes("No flashcards were found for this deck."));
  assert.ok(src.includes("Unable to create study session from this deck."));
  assert.ok(src.includes("Unable to verify access to this flashcard deck."));
  assert.ok(src.includes("Study session timed out."));
});

test("flashcard session APIs emit structured failure telemetry with pool counts", () => {
  const customRoute = readFileSync(customSessionRoutePath, "utf8");
  const deckRoute = readFileSync(deckStudyRoutePath, "utf8");
  assert.ok(customRoute.includes("FLASHCARD_SESSION_CREATE"));
  assert.ok(customRoute.includes("empty_flashcard_pool"));
  assert.ok(customRoute.includes("candidateFlashcards"));
  assert.ok(customRoute.includes("eligibleFlashcards"));
  assert.ok(customRoute.includes("finalSessionPoolSize"));
  assert.ok(deckRoute.includes("FLASHCARD_DECK_SESSION_LOAD"));
  assert.ok(deckRoute.includes("deck_study_empty_pool"));
  assert.ok(deckRoute.includes("candidateFlashcards"));
  assert.ok(deckRoute.includes("eligibleFlashcards"));
  assert.ok(deckRoute.includes("finalSessionPoolSize"));
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
