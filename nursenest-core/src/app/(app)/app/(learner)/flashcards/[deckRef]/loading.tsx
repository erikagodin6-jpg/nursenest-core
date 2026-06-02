import { FlashcardStudySessionSkeleton } from "@/components/skeletons/hub-page-skeleton";

export default function FlashcardDeckSegmentLoading() {
  return <FlashcardStudySessionSkeleton message="Preparing your flashcards..." detail="Opening your deck workspace." />;
}
