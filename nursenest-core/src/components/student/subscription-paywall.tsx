import Link from "next/link";

export type PaywallContext = "questions" | "lessons" | "exams" | "dashboard";

const UNLOCK_BULLETS = [
  "full question bank",
  "detailed rationales",
  "flashcards",
  "adaptive study planner",
  "readiness tracking",
] as const;

const COPY: Record<
  PaywallContext,
  {
    title: string;
    intro: string;
    loseWithoutUpgrade: string[];
    progressTemplate: string;
  }
> = {
  questions: {
    title: "Unlock full access",
    intro:
      "Previews and capped runs show you the interface; a paid tier unlocks the full pathway-scoped pool, full rationales on every option, weak-area routing, and cross-device history.",
    loseWithoutUpgrade: [
      "Full rationales and review history for every item you have attempted",
      "Unlimited or tier-scoped bank access (not preview caps)",
      "Category analytics that persist across sessions and devices",
    ],
    progressTemplate:
      "You have already started prep. Your recent attempts count. Upgrade to keep weak-topic lists, streaks, and full review instead of losing depth after each preview.",
  },
  lessons: {
    title: "Unlock full access",
    intro:
      "Lesson previews show structure; subscribers get complete bodies, module progress, and the lesson pool that matches your pathway.",
    loseWithoutUpgrade: [
      "Full lesson content beyond preview limits",
      "Completion tracking and resume across modules",
      "Cross-lesson sequences aligned to your exam scope",
    ],
    progressTemplate:
      "Any preview modules you opened still count toward your study story. Upgrade to keep progress and unlock full depth.",
  },
  exams: {
    title: "Unlock full access",
    intro:
      "Timed mocks draw from your tier’s server-side pool. Checkout enables full-length attempts, autosave, and score history.",
    loseWithoutUpgrade: [
      "Full-length timed sessions with attempt review",
      "Score history and pacing that match authorization-to-test timing",
      "Saved mocks tied to your pathway",
    ],
    progressTemplate:
      "When your plan is active, new mock attempts appear here immediately after checkout.",
  },
  dashboard: {
    title: "Unlock full access",
    intro:
      "The dashboard shows access status for everyone; subscribers get readiness, streaks, planner, weak-topic nudges, and continue-where-you-left-off shortcuts.",
    loseWithoutUpgrade: [
      "Blended readiness and suggested next steps across sessions",
      "Study planner and exam-date pacing",
      "Weak-area flashcard and drill nudges from your misses",
    ],
    progressTemplate:
      "You already have activity on this account. Upgrade to turn this into your daily hub with saved signals, not just banners.",
  },
};

export function SubscriptionPaywall({
  context,
  freemiumRemainingQuestions,
  freemiumRemainingLessons,
}: {
  context: PaywallContext;
  freemiumRemainingQuestions?: number;
  freemiumRemainingLessons?: number;
}) {
  const c = COPY[context];
  const progressBits: string[] = [];
  if (freemiumRemainingQuestions !== undefined && freemiumRemainingQuestions > 0) {
    progressBits.push(`${freemiumRemainingQuestions} preview questions remaining`);
  }
  if (freemiumRemainingLessons !== undefined && freemiumRemainingLessons > 0) {
    progressBits.push(`${freemiumRemainingLessons} lesson preview rows remaining`);
  }
  const progressLine =
    progressBits.length > 0 ? `${progressBits.join(" · ")}. ${c.progressTemplate}` : c.progressTemplate;

  return (
    <section className="nn-card space-y-4 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">NurseNest subscription</p>
        <h2 className="mt-1 text-2xl font-bold">{c.title}</h2>
        <p className="mt-2 text-sm text-muted">{c.intro}</p>
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground">Unlock full access to:</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-foreground">
          {UNLOCK_BULLETS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground">What you lose without upgrading</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
          {c.loseWithoutUpgrade.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <p className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground">{progressLine}</p>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Unlock full access
        </Link>
        <Link
          href="/app"
          className="inline-flex items-center justify-center rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
        >
          Back to dashboard
        </Link>
      </div>
      <p className="text-xs text-muted">
        Most candidates who feel exam-ready mixed steady question reps, full rationales, and at least one full mock in the weeks before their
        date, not a single cram block.
      </p>
    </section>
  );
}
