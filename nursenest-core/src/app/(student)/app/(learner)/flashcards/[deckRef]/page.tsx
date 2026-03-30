import { FlashcardStudyClient } from "@/components/flashcards/flashcard-study-client";

type Props = { params: Promise<{ deckRef: string }> };

export default async function FlashcardDeckStudyPage({ params }: Props) {
  const { deckRef } = await params;
  return <FlashcardStudyClient deckRef={deckRef} />;
}
