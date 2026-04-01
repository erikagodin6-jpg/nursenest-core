import Link from "next/link";

export type PaywallContext = "questions" | "lessons" | "exams" | "dashboard";

const COPY: Record<
  PaywallContext,
  { title: string; body: string; missing: string[]; progressNote: string }
> = {
  questions: {
    title: "Subscribe for the full bank and saved progress",
    body:
      "Previews are capped. A paid tier unlocks the full pathway-scoped item pool, full rationales on every option, weak-area routing, and session history across devices.",
    missing: [
      "Unlimited or tier-scoped items (not preview caps)",
      "Topic and category analytics tied to your misses",
      "CAT-style and adaptive practice modes where your plan includes them",
    ],
    progressNote:
      "Free-tier runs do not sync full analytics—upgrade to keep your weak-topic list and streaks across study sessions.",
  },
  lessons: {
    title: "Subscribe for full lesson depth and tracking",
    body:
      "Previews show structure; subscribers get complete lesson bodies, module progress, and alignment with your pathway’s lesson pool.",
    missing: [
      "Full lesson content beyond preview limits",
      "Completion tracking across modules",
      "Cross-lesson paths that match your exam scope",
    ],
    progressNote: "Use previews to judge quality; a plan keeps your pathway sequence and progress in one place.",
  },
  exams: {
    title: "Timed mocks require an active plan",
    body:
      "Mocks are drawn from your tier’s item pool on the server—there is no URL bypass. Checkout enables full-length and timed attempts with score history.",
    missing: [
      "Full-length timed sessions with autosave",
      "Score history and attempt review",
      "Exam pacing that matches authorization-to-test timing",
    ],
    progressNote: "After Stripe confirms activation, your mock attempts show up here immediately.",
  },
  dashboard: {
    title: "Subscribe for the full learner dashboard",
    body:
      "You still see access status; subscribers get readiness, streaks, weak-topic nudges, planner, and continue-where-you-left-off shortcuts.",
    missing: [
      "Blended readiness and suggested next steps",
      "Study planner and exam-date pacing (when you set a date)",
      "Weak-area flashcard and drill nudges",
    ],
    progressNote: "Upgrade to turn this into your daily study hub—not just a static banner.",
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
  return (
    <section className="nn-card space-y-4 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">NurseNest subscription</p>
        <h2 className="mt-1 text-2xl font-bold">{c.title}</h2>
        <p className="mt-2 text-sm text-muted">{c.body}</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">What you are missing</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
          {c.missing.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      {(freemiumRemainingQuestions !== undefined && freemiumRemainingQuestions > 0) ||
      (freemiumRemainingLessons !== undefined && freemiumRemainingLessons > 0) ? (
        <p className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground">
          Free previews left:{" "}
          {freemiumRemainingQuestions !== undefined ? `${freemiumRemainingQuestions} questions` : null}
          {freemiumRemainingQuestions !== undefined && freemiumRemainingLessons !== undefined ? " · " : null}
          {freemiumRemainingLessons !== undefined ? `${freemiumRemainingLessons} lesson rows` : null}.
        </p>
      ) : null}
      <p className="text-sm text-muted">{c.progressNote}</p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          View plans & pricing
        </Link>
        <Link
          href="/app"
          className="inline-flex items-center justify-center rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
        >
          Back to dashboard
        </Link>
      </div>
      <p className="text-xs text-muted">
        Most candidates who feel exam-ready mixed steady question reps, rationales, and at least one full mock in the weeks before their date—not a single cram block.
      </p>
    </section>
  );
}
