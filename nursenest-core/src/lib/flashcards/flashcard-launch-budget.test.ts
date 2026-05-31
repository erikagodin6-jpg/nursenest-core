import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const flashcardsPagePath = join(__dirname, "../../app/(app)/app/(learner)/flashcards/page.tsx");
const flashcardsHubClientPath = join(__dirname, "../../components/flashcards/flashcards-hub-client.tsx");

function read(path: string): string {
  return readFileSync(path, "utf8");
}

test("flashcard launch budget: server shell does not block on inventory or profile lookups", () => {
  const page = read(flashcardsPagePath);
  assert.match(page, /FLASHCARDS_PROFILE_BOOTSTRAP_TIMEOUT_MS\s*=\s*1200/);
  assert.match(page, /FLASHCARDS_INVENTORY_BOOTSTRAP_TIMEOUT_MS\s*=\s*100/);
  assert.match(page, /Promise\.race\(\[/);
  assert.match(page, /builderCategoryOptionsForPathway\(scopedPathwayId\)/);
  assert.doesNotMatch(page, /Could not load flashcard tracks/);
});

test("flashcard launch budget: client inventory fetch has 2 second timeout and keeps visible categories", () => {
  const client = read(flashcardsHubClientPath);
  assert.match(client, /FLASHCARDS_HUB_CLIENT_FETCH_TIMEOUT_MS\s*=\s*2000/);
  assert.match(client, /AbortController/);
  assert.match(client, /inventory_timeout_kept_stale/);
  assert.match(client, /data-nn-e2e-flashcards-retry-counts/);
  assert.match(client, /Retry Counts/);
});

test("flashcard launch budget: hub does not block startup on analytics or readiness components", () => {
  const client = read(flashcardsHubClientPath);
  const hubReturnStart = client.indexOf("return (");
  const analyticsIndex = client.indexOf("<FlashcardsHubAnalytics");
  if (analyticsIndex !== -1) {
    assert.ok(analyticsIndex > hubReturnStart, "analytics must render below primary hub shell");
  }
  assert.doesNotMatch(client.slice(hubReturnStart, analyticsIndex), /FlashcardsHubAnalytics/);
});
