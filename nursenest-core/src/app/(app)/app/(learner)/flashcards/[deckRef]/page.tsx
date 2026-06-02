import { FlashcardDeckStudyShell } from "@/components/flashcards/flashcard-deck-study-shell";
import { LearnerActivityState } from "@/components/student/learner-activity-state";
import { loadLearnerActivityBootstrap } from "@/lib/learner/activity-lifecycle";

type Props = {
  params: Promise<{ deckRef: string }>;
  searchParams: Promise<{ shuffle?: string; mode?: string; start?: string }>;
};

export default async function FlashcardDeckStudyPage({ params, searchParams }: Props) {
  const { deckRef } = await params;
  const sp = await searchParams;
  const studyMode = sp.mode === "test" ? "test" : "learn";
  const startImmediately = sp.start === "1";
  const bootstrap = await loadLearnerActivityBootstrap({
    surface: "(student).app.(learner).flashcards.[deckRef]",
    activityKind: "flashcards",
    homeHref: "/app/flashcards",
    homeLabel: "Back to Flashcards",
    routeParams: [{ name: "deckRef", value: deckRef, pattern: /^[a-zA-Z0-9_-]{2,120}$/, displayName: "flashcard deck" }],
  });

  if (!bootstrap.ok) return <LearnerActivityState state={bootstrap} />;

  return (
    <FlashcardDeckStudyShell
      deckRef={bootstrap.routeParams.deckRef!}
      userId={bootstrap.userId}
      userLabel={bootstrap.userLabel}
      protectionFlags={bootstrap.protectionFlags}
      shuffleInitially={sp.shuffle === "1"}
      studyMode={studyMode}
      startImmediately={startImmediately}
    />
  );
}
