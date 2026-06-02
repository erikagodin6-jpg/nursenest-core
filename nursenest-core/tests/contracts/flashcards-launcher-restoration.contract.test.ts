/**
 * Guard the RN hub -> Flashcards setup flow.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/flashcards-launcher-restoration.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const FLASHCARDS_HUB_CLIENT_PATH = path.resolve(ROOT, "src/components/flashcards/flashcards-hub-client.tsx");
const NURSING_HUB_PAGE_PATH = path.resolve(ROOT, "src/components/marketing/nursing-tier-hub-page.tsx");
const HUB_LINKS_PATH = path.resolve(ROOT, "src/lib/marketing/pathway-hub-app-questions-href.ts");

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

describe("flashcards launcher restoration", () => {
  const flashcardsClient = read(FLASHCARDS_HUB_CLIENT_PATH);
  const nursingHub = read(NURSING_HUB_PAGE_PATH);
  const hubLinks = read(HUB_LINKS_PATH);

  it("keeps the RN hub flashcards CTA pointed at the setup launcher route", () => {
    assert.match(nursingHub, /resolveNursingTierHubStudyCardHref/, "nursing hub must resolve study card links centrally");
    assert.match(hubLinks, /pathwayHubAppFlashcardsHref/, "pathway flashcards href helper must exist");
    assert.match(hubLinks, /return `\/app\/flashcards\?\$\{q\.toString\(\)\}`/, "flashcards helper must route to /app/flashcards setup page");
    assert.doesNotMatch(hubLinks, /\/app\/flashcards\/custom/, "hub flashcards CTA must not bypass setup into a custom session");
  });

  it("renders the original visible flashcards setup flow before starting a session", () => {
    for (const phrase of [
      "data-nn-e2e-flashcards-launcher",
      "Choose What to Study",
      "Select a system, target the cards that need attention, and begin.",
      "1. Systems &amp; Categories",
      "Pick your focus",
      "2. Study Filters",
      "Target your review",
      "3. Card Count",
      "Set session size",
      "Start Flashcards",
    ]) {
      assert.match(flashcardsClient, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${phrase} missing`);
    }
  });

  it("keeps systems, study filters, and card count controls visible instead of collapsed", () => {
    assert.match(flashcardsClient, /CANONICAL_STUDY_CATEGORIES\.map/, "system cards must render from canonical categories");
    assert.match(flashcardsClient, /data-nn-e2e-flashcards-system-card/, "system cards need stable QA hooks");
    assert.match(flashcardsClient, /Weak Areas/, "weak-area study filter must remain visible");
    assert.match(flashcardsClient, /Unstudied/, "unstudied filter must remain visible");
    assert.match(flashcardsClient, /Incorrect Cards/, "incorrect-cards filter must remain visible");
    assert.match(flashcardsClient, /Recently Missed/, "recently-missed filter must remain visible");
    assert.match(flashcardsClient, /All Cards/, "all-cards filter must remain visible");
    assert.match(flashcardsClient, /FLASHCARD_SESSION_PRESETS\.map/, "card count presets must remain visible");
    assert.match(flashcardsClient, /data-nn-e2e-session-size-preset/, "card count presets need stable QA hooks");
    assert.doesNotMatch(flashcardsClient, /Fine-tune session length/, "setup controls must not be hidden in the fine-tune drawer");
    assert.doesNotMatch(flashcardsClient, /<details[\s\S]*data-nn-e2e-flashcards-setup-panel/, "primary setup panel must not be a collapsed details element");
  });
});
