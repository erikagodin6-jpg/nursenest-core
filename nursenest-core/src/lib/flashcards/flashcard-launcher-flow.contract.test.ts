import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const flashcardsHubPath = join(__dirname, "../../components/flashcards/flashcards-hub-client.tsx");
const flashcardsStudyPath = join(__dirname, "../../components/flashcards/flashcard-study-client.tsx");

describe("flashcards launcher flow", () => {
  const hubSrc = readFileSync(flashcardsHubPath, "utf8");
  const studySrc = readFileSync(flashcardsStudyPath, "utf8");

  it("keeps the pre-session hub setup sections before starting flashcards", () => {
    assert.equal(hubSrc.includes("data-nn-e2e-flashcards-canonical-grid"), true);
    assert.equal(hubSrc.includes("data-nn-e2e-flashcards-setup-panel"), true);
    assert.equal(hubSrc.includes("data-nn-e2e-flashcards-session-size"), true);
    assert.equal(hubSrc.includes("data-nn-e2e-custom-card-limit"), true);
    assert.equal(hubSrc.includes("data-nn-e2e-flashcard-filter-presets"), true);
    assert.equal(hubSrc.includes("data-nn-e2e-flashcards-resume-primary"), true);
    assert.equal(hubSrc.includes("data-nn-e2e-start-review"), true);
  });

  it("does not bypass the deck launcher unless a configured or resumable session exists", () => {
    assert.equal(studySrc.includes("data-nn-e2e-flashcard-session-launcher"), true);
    assert.equal(studySrc.includes("data-nn-e2e-flashcard-launcher-topic"), true);
    assert.equal(studySrc.includes("data-nn-e2e-flashcard-launcher-start"), true);
    assert.equal(studySrc.includes('searchParams.get("configured") === "1"'), true);
    assert.equal(studySrc.includes("!launcherConfirmed && !hasResumeCheckpoint"), true);
    assert.equal(studySrc.includes("setLauncherConfirmed(true)"), true);
  });
});
