/**
 * Short action labels for learner landing hubs (flashcards, practice exams, CAT, analytics).
 * Surrounding cards, previews, and sublines carry session context — not the button.
 */
export const HUB_ACTION_CTA = {
  start: "Start",
  resume: "Resume",
  review: "Review",
  continue: "Continue",
  practice: "Practice",
  retry: "Retry",
} as const;

export type HubActionCta = keyof typeof HUB_ACTION_CTA;

export function hubActionCtaLabel(action: HubActionCta): string {
  return HUB_ACTION_CTA[action];
}

/** i18n keys under `learner.flashcards.hub.*` / `learner.practiceTests.*` that mirror {@link HUB_ACTION_CTA}. */
export const HUB_ACTION_CTA_I18N = {
  flashcards: {
    start: "learner.flashcards.hub.ctaStart",
    resume: "learner.flashcards.hub.ctaResume",
    continue: "learner.flashcards.hub.ctaContinue",
    review: "learner.flashcards.hub.filterReviewIncorrect",
    quickReview: "learner.flashcards.hub.quickReviewCta",
  },
  practiceTests: {
    start: "learner.practiceTests.hub.startPracticeExam",
    resume: "learner.practiceTests.hub.resumeCta",
    review: "learner.practiceTests.hub.reviewCta",
    continue: "learner.practiceTests.examFirst.ctaContinue",
    practice: "learner.practiceTests.examFirst.ctaCustom",
    catStart: "learner.practiceTests.examFirst.ctaCat",
  },
} as const;
