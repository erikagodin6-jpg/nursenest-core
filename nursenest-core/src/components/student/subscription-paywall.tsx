import Link from "next/link";

export type PaywallContext = "questions" | "lessons" | "exams" | "dashboard";

const COPY: Record<
  PaywallContext,
  { title: string; body: string; missing: string[]; progressNote: string }
> = {
  questions: {
    title: "Unlock the full question bank",
    body: "You are missing unlimited items, full rationales, category analytics, and NGN-style practice depth.",
    missing: [
      "Full rationale explanations on every item",
      "Unlimited retakes and weak-area routing",
      "CAT-style / adaptive practice where enabled",
    ],
    progressNote: "Your complimentary previews do not carry subscription analytics—upgrade to save progress across sessions.",
  },
  lessons: {
    title: "Unlock full lessons and tracking",
    body: "Complete lesson bodies, structured modules, and progress sync are reserved for active subscribers.",
    missing: ["Full lesson depth beyond previews", "Cross-lesson study paths", "Completion tracking tied to your exam date"],
    progressNote: "Partial previews help you taste the quality; a plan keeps your study arc organized.",
  },
  exams: {
    title: "Practice exams are subscription-protected",
    body: "Mock exams use your filtered item pool server-side—there is no URL bypass. Start checkout to enable attempts.",
    missing: ["Full-length timed sessions", "Score history and readiness trends", "Exam-realistic pacing"],
    progressNote: "Exams stay locked until billing confirms—your attempts will appear here immediately after activation.",
  },
  dashboard: {
    title: "Activate your plan to see readiness insights",
    body: "The dashboard surfaces access status today; subscribers see streaks, recommendations, and next-best actions.",
    missing: ["Readiness indicators", "Continue-where-you-left-off shortcuts", "Weak-area nudges"],
    progressNote: "Subscribe to turn this page into your daily command center.",
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
        Outcome focus: learners who combine timed practice, rationales, and mock exams report higher confidence approaching test day.
      </p>
    </section>
  );
}
