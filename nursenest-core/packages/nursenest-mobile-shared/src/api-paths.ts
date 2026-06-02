/** Relative to API origin — same contract as web learner JSON APIs. */
export const ApiPaths = {
  flashcardDecks: "/api/flashcards/decks",
  flashcardDeckStudy: (deckRef: string) => `/api/flashcards/decks/${encodeURIComponent(deckRef)}/study`,
  flashcardDeckReview: (deckRef: string) => `/api/flashcards/decks/${encodeURIComponent(deckRef)}/review`,
  flashcardCardReview: (cardId: string) => `/api/flashcards/cards/${encodeURIComponent(cardId)}/review`,
  practiceTests: "/api/practice-tests",
  practiceTest: (id: string) => `/api/practice-tests/${encodeURIComponent(id)}`,
  practiceTestQuestion: (id: string, index: number) =>
    `/api/practice-tests/${encodeURIComponent(id)}/question?index=${encodeURIComponent(String(index))}`,
  practiceTestCatStudyReview: (id: string) =>
    `/api/practice-tests/${encodeURIComponent(id)}/cat-study-review`,
  catNpSession: "/api/cat/np/session",
  catNpAnswer: "/api/cat/np/answer",
  catNpAnalysis: (practiceTestId: string) =>
    `/api/cat/np/analysis?practiceTestId=${encodeURIComponent(practiceTestId)}`,
  questionById: (id: string, opts?: { includeRationale?: boolean }) => {
    const q = opts?.includeRationale ? "?includeRationale=1" : "";
    return `/api/questions/${encodeURIComponent(id)}${q}`;
  },
} as const;
