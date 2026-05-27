/**
 * UI strings for {@link PracticeRationaleFullPanel} — resolved copy only (no i18n hooks here).
 * Parent passes `tx()` results from the practice test runner.
 */
export type PracticeRationaleFullPanelCopy = {
  panelTitle: string;
  waitingPrimary: string;
  waitingSecondary: string;
  lockedTitle: string;
  lockedBody: string;
  correctAnswer: string;
  whyCorrect: string;
  whyOthersIncorrect: string;
  clinicalPearl: string;
  /** Section heading for the takeaway block (not the takeaway sentence body). */
  keyTakeawayHeading: string;
  referencesSource: string;
  relatedLessonsSection: string;
  missingDistractorFallback: string;
};

export const PRACTICE_RATIONALE_FULL_PANEL_COPY_DEFAULTS: PracticeRationaleFullPanelCopy = {
  panelTitle: "Rationale & Review",
  waitingPrimary: "Review appears after you answer.",
  waitingSecondary:
    "Submit your response to see the correct answer, teaching rationale, distractor review, and optional references. Prioritize airway, breathing, and circulation when choosing the most urgent option.",
  lockedTitle: "Answer Locked",
  lockedBody:
    "Your answer is submitted. Explanations and correct keys are revealed when you finish the full exam.",
  correctAnswer: "Correct Answer",
  whyCorrect: "Why This Is Correct",
  whyOthersIncorrect: "Why The Other Options Are Incorrect",
  clinicalPearl: "Clinical Pearl",
  keyTakeawayHeading: "Key Takeaway",
  referencesSource: "References / Source",
  relatedLessonsSection: "Related Lessons",
  missingDistractorFallback:
    "This choice may look plausible, but it is lower priority than the correct answer. In exam questions, use the stem cues to choose the option that protects safety, addresses the most urgent change, or gives the nurse the assessment data needed before acting.",
};
