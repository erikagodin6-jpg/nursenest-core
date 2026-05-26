import { Suspense } from "react";
import { FlashcardCustomStudyClient } from "@/components/flashcards/flashcard-custom-study-client";
import { FlashcardStudySessionSkeleton } from "@/components/skeletons/hub-page-skeleton";
import { LearnerActivityState } from "@/components/student/learner-activity-state";
import { loadLearnerActivityBootstrap } from "@/lib/learner/activity-lifecycle";

export default async function FlashcardCustomPage() {
  const bootstrap = await loadLearnerActivityBootstrap({
    surface: "(student).app.(learner).flashcards.custom",
    activityKind: "flashcards",
    homeHref: "/app/flashcards",
    homeLabel: "Back to Flashcards",
  });
  if (!bootstrap.ok) return <LearnerActivityState state={bootstrap} />;

  return (
    <Suspense
      fallback={
        <FlashcardStudySessionSkeleton
          message="Preparing your flashcards..."
          detail="Opening the study workspace while your cards load."
        />
      }
    >
      <FlashcardCustomStudyClient />
    </Suspense>
  );
}
