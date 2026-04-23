/**
 * Merges flashcard session / deck-study learner strings into en.json and all root locale bundles.
 * Run from nursenest-core/: node scripts/add-flashcard-session-i18n.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const i18nDir = path.join(__dirname, "../public/i18n");

const NEW_KEYS = {
  "learner.flashcards.session.loadingPreparing": "Preparing study session…",
  "learner.flashcards.session.emptyNoItems": "No items match this study session.",
  "learner.flashcards.session.completionEyebrow": "Session complete",
  "learner.flashcards.session.completionBody_one":
    "You completed {{count}} item in {{mode}}.",
  "learner.flashcards.session.completionBody_other":
    "You completed {{count}} items in {{mode}}.",
  "learner.flashcards.session.completionStatsIntro": "This session:",
  "learner.flashcards.session.statKnown": "{{n}} knew",
  "learner.flashcards.session.statUnsure": "{{n}} unsure",
  "learner.flashcards.session.statMissed": "{{n}} missed",
  "learner.flashcards.session.categoriesPrefix": "Categories:",
  "learner.flashcards.session.completionSummaryHeading": "Completion summary",
  "learner.flashcards.session.summaryTotalItems": "Total items completed",
  "learner.flashcards.session.summaryStarred": "Starred",
  "learner.flashcards.session.summarySaved": "Saved / bookmarked",
  "learner.flashcards.session.summaryRevisit": "Revisit / confusing",
  "learner.flashcards.session.summaryNotes": "Notes",
  "learner.flashcards.session.summaryRated": "Items rated",
  "learner.flashcards.session.summaryHighlights": "Rationale highlights",
  "learner.flashcards.session.btnStudyRevisit": "Study revisit items",
  "learner.flashcards.session.btnStudyStarred": "Study starred items",
  "learner.flashcards.session.btnStartNewSession": "Start new session",
  "learner.flashcards.session.btnExitToFlashcards": "Exit back to flashcards",
  "learner.flashcards.session.progressChip": "Progress: {{label}}",
  "learner.flashcards.session.metaRequested": "Requested {{n}}",
  "learner.flashcards.session.metaLoaded": "Loaded {{n}}",
  "learner.flashcards.session.metaAvailable": "Available {{n}}",
  "learner.flashcards.session.metaMoreSuffix": "More available",
  "learner.flashcards.session.exitSession": "Exit session",
  "learner.flashcards.session.ratingRowIncorrect": "1 · Incorrect",
  "learner.flashcards.session.ratingRowUnsure": "2 · Unsure",
  "learner.flashcards.session.ratingRowKnown": "3 · Known",
  "learner.flashcards.session.ratingSubIncorrect": "Need more review",
  "learner.flashcards.session.ratingSubUnsure": "Almost there",
  "learner.flashcards.session.ratingSubKnown": "Got it",
  "learner.flashcards.session.correctAnswerHeading": "Correct answer",
  "learner.flashcards.session.clinicalReferenceHeading": "Clinical reference",
  "learner.flashcards.session.rationaleReviewHeading": "Rationale & review",
  "learner.flashcards.session.whyCorrectHeading": "Why this is correct",
  "learner.flashcards.session.whyIncorrectHeading": "Why other options are incorrect",
  "learner.flashcards.session.clinicalReferenceEmpty":
    "No reference illustration for this item. Reference images appear here when included in the question stem.",
  "learner.flashcards.session.rationaleBlockHeading": "Rationale",
  "learner.flashcards.session.keyTakeawayHeading": "Key takeaway",
  "learner.flashcards.session.topicGeneral": "General",
  "learner.flashcards.session.explanationMissing": "Detailed explanation is not available for this item yet.",
  "learner.flashcards.session.clinicalPearlMissing": "A clinical pearl is not available for this item yet.",
  "learner.flashcards.session.noteLabel": "Note",
  "learner.flashcards.session.navPrevious": "Previous",
  "learner.flashcards.session.navNext": "Next",
  "learner.flashcards.session.starVerb": "Star",
  "learner.flashcards.session.starredState": "Starred",
  "learner.flashcards.session.markConfusingVerb": "Mark confusing",
  "learner.flashcards.session.revisitState": "Revisit",
  "learner.flashcards.session.splitPromptHeading": "Prompt",
  "learner.flashcards.session.revealAnswerCta": "Reveal answer",
  "learner.flashcards.session.correctAnswerLabel": "Correct answer",
  "learner.flashcards.session.rationaleAsideHeading": "Rationale",
  "learner.flashcards.session.revealToSeeRationale": "Reveal the answer to see detailed rationale.",
  "learner.flashcards.session.rationaleStepCorrect": "1. Correct answer",
  "learner.flashcards.session.rationaleStepWhyCorrect": "2. Why it is correct",
  "learner.flashcards.session.rationaleStepWhyWrong": "3. Why the other options are wrong",
  "learner.flashcards.session.rationaleStepPearl": "4. Clinical pearl / exam tip",
  "learner.flashcards.session.rationaleStepRelated": "5. Related lesson link",
  "learner.flashcards.session.distractorMissing": "Detailed distractor explanations are not available for this item yet.",
  "learner.flashcards.session.itemActionsHeading": "Item actions",
  "learner.flashcards.session.starForLater": "Star for later",
  "learner.flashcards.session.saveForLater": "Save for later",
  "learner.flashcards.session.savedState": "Saved",
  "learner.flashcards.session.markConfusingFull": "Mark as confusing",
  "learner.flashcards.session.markedRevisit": "Marked for revisit",
  "learner.flashcards.session.highlightRationale": "Highlight rationale",
  "learner.flashcards.session.highlightedState": "Highlighted",
  "learner.flashcards.session.personalNoteLabel": "Personal note",
  "learner.flashcards.session.notePlaceholder": "Capture your nursing takeaway for this item.",
  "learner.flashcards.session.ratingIncorrect": "Incorrect",
  "learner.flashcards.session.ratingUnsure": "Unsure",
  "learner.flashcards.session.ratingKnown": "Known",
  "learner.flashcards.session.linkReviewLesson": "Review lesson",
  "learner.flashcards.session.linkBrowseRelated": "Browse related lessons",

  "learner.flashcards.deckStudy.loadingDeck": "Loading deck…",
  "learner.flashcards.deckStudy.backToAllDecks": "← All decks",
  "learner.flashcards.deckStudy.noCardsBody": "No cards are available for this deck right now.",
  "learner.flashcards.deckStudy.backShort": "← Back",
  "learner.flashcards.deckStudy.backToFlashcards": "← Back to flashcards",
  "learner.flashcards.deckStudy.shuffle": "Shuffle",
  "learner.flashcards.deckStudy.resetSession": "Reset session",
  "learner.flashcards.deckStudy.previewBanner":
    "Preview sample. Subscribe for full study scheduling and premium progression.",
  "learner.flashcards.deckStudy.preparingShell": "Preparing study session…",
  "learner.flashcards.deckStudy.resumeTitle": "Resume this deck?",
  "learner.flashcards.deckStudy.resumeBody":
    "You have a saved position in this session (card {{n}}{{revealed}}). Continue from there or start over.",
  "learner.flashcards.deckStudy.resumeRevealedSuffix": ", answer revealed",
  "learner.flashcards.deckStudy.resumeCta": "Resume",
  "learner.flashcards.deckStudy.startFresh": "Start fresh",
  "learner.flashcards.deckStudy.chooseBefore": "Choose",
  "learner.flashcards.deckStudy.chooseOr": "or",
  "learner.flashcards.deckStudy.chooseAfter": "above to begin.",
  "learner.flashcards.deckStudy.defaultTitle": "Flashcard study session",
  "learner.flashcards.deckStudy.modeTest": "Test-style recall",
  "learner.flashcards.deckStudy.modeLearn": "Learn mode",
  "learner.flashcards.deckStudy.sessionKind": "Deck session",
  "learner.flashcards.deckStudy.reviewSaveFailed": "Could not save review",
  "learner.flashcards.deckStudy.genericError": "Save failed",
};

function main() {
  const enPath = path.join(i18nDir, "en.json");
  const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
  for (const [k, v] of Object.entries(NEW_KEYS)) {
    en[k] = v;
  }
  fs.writeFileSync(enPath, JSON.stringify(en));

  const files = fs.readdirSync(i18nDir).filter((f) => f.endsWith(".json") && f !== "en.json");
  for (const f of files) {
    const p = path.join(i18nDir, f);
    const loc = JSON.parse(fs.readFileSync(p, "utf8"));
    let changed = false;
    for (const [k, v] of Object.entries(NEW_KEYS)) {
      if (loc[k] === undefined || String(loc[k]).trim() === "") {
        loc[k] = v;
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(p, JSON.stringify(loc));
      console.log("merged into", f);
    }
  }
  console.log("done; en +", Object.keys(NEW_KEYS).length, "keys");
}

main();
