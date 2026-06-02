import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const flashcardsPagePath = join(__dirname, "../../app/(app)/app/(learner)/flashcards/page.tsx");
const flashcardsHubClientPath = join(__dirname, "../../components/flashcards/flashcards-hub-client.tsx");
const flashcardsLayoutCssPath = join(__dirname, "../../app/learner-flashcard-layout-refinement-pass.css");

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

test("flashcard hub: count failures stay studyable instead of rendering false zero-card labels", () => {
  const client = read(flashcardsHubClientPath);
  assert.match(client, /type InventoryStatus = "loading" \| "ready" \| "degraded"/);
  assert.match(client, /const countsReliable = inventoryStatus === "ready"/);
  assert.match(client, /if \(!countsReliable \|\| count <= 0\) return null/);
  assert.match(client, /return `\$\{flashcardCountFormatter\.format\(count\)\} Flashcards`/);
  assert.doesNotMatch(client, />Available</);
  assert.doesNotMatch(client, />Ready to study</);
  assert.doesNotMatch(client, /nn-flashcards-system-card-v2__badge/);
});

test("flashcard hub: exposes explicit all-systems control while preserving additive system selection", () => {
  const client = read(flashcardsHubClientPath);
  assert.match(client, /data-nn-e2e-flashcards-system-actions/);
  assert.match(client, /All Systems/);
  assert.match(client, /toggleFlashcardsHubSystemSelection\(current, system\.id\)/);
});

test("flashcard hub: system cards keep stable geometry during selection", () => {
  const client = read(flashcardsHubClientPath);
  const css = read(flashcardsLayoutCssPath);
  assert.match(client, /nn-flashcards-system-actions/);
  assert.match(client, /pointer-events-none invisible/);
  assert.match(client, /<span className="block min-h-7" aria-hidden \/>/);
  assert.doesNotMatch(client, /className="nn-flashcards-system-card-v2[\s\S]*transition focus-visible/);
  assert.match(css, /\.nn-flashcards-system-grid \{[\s\S]*grid-auto-rows: 10\.75rem;[\s\S]*contain: layout;/);
  assert.match(css, /\.nn-flashcards-system-actions \{[\s\S]*min-height: 2\.5rem;[\s\S]*contain: layout;/);
  assert.match(css, /\.nn-flashcards-system-card-v2 \{[\s\S]*max-height: 10\.75rem;[\s\S]*contain: layout paint;/);
  assert.doesNotMatch(css, /transition:[^;]*(height|width|margin|padding)/);
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
