/**
 * SecureStore / AsyncStorage keys for learner exam surfaces.
 * Prefix keeps collisions with other app data unlikely.
 */
export const NN_SECURE_PREFIX = "nn.mobile.v1";

export function flashcardDeckResumeKey(deckId: string): string {
  return `${NN_SECURE_PREFIX}.flashcards.deck:${deckId}`;
}

export function flashcardDeckRefCursorKey(deckRef: string): string {
  return `${NN_SECURE_PREFIX}.flashcards.deckRef:${deckRef}`;
}

export function practiceTestResumeKey(practiceTestId: string): string {
  return `${NN_SECURE_PREFIX}.practiceTest:${practiceTestId}`;
}

export function npCatResumeKey(practiceTestId: string): string {
  return `${NN_SECURE_PREFIX}.cat.np.practiceTest:${practiceTestId}`;
}

export function pathwaySelectionKey(): string {
  return `${NN_SECURE_PREFIX}.pathwayId`;
}
