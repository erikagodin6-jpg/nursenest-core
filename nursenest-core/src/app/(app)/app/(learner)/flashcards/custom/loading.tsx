import { FlashcardStudySessionSkeleton } from "@/components/skeletons/hub-page-skeleton";

export default function FlashcardCustomSegmentLoading() {
  return (
    <FlashcardStudySessionSkeleton
      message="Preparing your flashcards..."
      detail="Opening the study workspace while your cards load."
    />
  );
}
