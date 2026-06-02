import { Suspense } from "react";
import { FlashcardWeakStudyClient } from "@/components/flashcards/flashcard-weak-study-client";
import { LearnerActivityState } from "@/components/student/learner-activity-state";
import { loadLearnerActivityBootstrap } from "@/lib/learner/activity-lifecycle";

export default async function FlashcardWeakAreasPage() {
  const bootstrap = await loadLearnerActivityBootstrap({
    surface: "(student).app.(learner).flashcards.weak-areas",
    activityKind: "flashcards",
    homeHref: "/app/flashcards",
    homeLabel: "Back to Flashcards",
  });
  if (!bootstrap.ok) return <LearnerActivityState state={bootstrap} />;

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-[var(--theme-muted-text)]">
          Loading weak-area study…
        </div>
      }
    >
      <FlashcardWeakStudyClient userId={bootstrap.userId} userLabel={bootstrap.userLabel} protectionFlags={bootstrap.protectionFlags} />
    </Suspense>
  );
}
