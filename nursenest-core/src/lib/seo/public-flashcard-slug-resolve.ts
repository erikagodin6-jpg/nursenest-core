/**
 * Single entry for public `/flashcards/[slug]` resolution.
 * Deck slug wins when both a published marketing deck and a tag share the same slug string.
 */
export { loadPublicFlashcardSlugLanding as resolvePublicFlashcardLanding } from "@/lib/seo/public-flashcard-landing";
