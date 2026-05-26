import { Suspense } from "react";
import { FlashcardCustomStudyClient } from "@/components/flashcards/flashcard-custom-study-client";
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
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-10 text-sm text-muted-foreground">Loading session…</div>}>
      <FlashcardCustomStudyClient />
    </Suspense>
  );
}
