import Link from "next/link";
import type { ConfidencePatternSummary, AnalyticsSummary } from "@/lib/study/analytics-data";

type RecKind = "risk" | "build" | "measure" | "consistency" | "progress";

type NextStep = {
  step: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  surface: string;
  border: string;
  ctaVariant: "primary" | "secondary";
  priority: number;
  kind: RecKind;
};

/**
 * AnalyticsNextSteps — contextual recommendation cards based on actual analytics data.
 *
 * Surfaces alternate between soft-a, soft-b, soft-c to avoid monotony.
 * Recommendations are derived from real signals (overconfidence, uncertainty, etc.)
 * not generic filler copy.
 */
export function AnalyticsNextSteps({
  summary,
  patterns,
}: {
  summary: AnalyticsSummary;
  patterns: ConfidencePatternSummary;
}) {
  const steps = buildSteps(summary, patterns);

  return (
    <section className="space-y-4">
      <div>
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--semantic-text-muted)]">
          Recommendations
        </p>
        <h2 className="mt-1 text-lg font-bold text-[var(--semantic-text-primary)]">Next best actions</h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
          Prioritized from your latest performance and confidence signals — tap through in order when time is tight.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, i) => (
          <NextStepCard key={i} step={step} index={i} />
        ))}
      </div>
    </section>
  );
}

const KIND_LABEL: Record<RecKind, string> = {
  risk: "High impact",
  build: "Reinforce",
  measure: "Measure",
  consistency: "Habit",
  progress: "Progress",
};

const KIND_SURFACE: Record<RecKind, string> = {
  risk: "color-mix(in srgb, var(--semantic-danger) 12%, var(--semantic-surface))",
  build: "color-mix(in srgb, var(--semantic-info) 10%, var(--semantic-surface))",
  measure: "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))",
  consistency: "color-mix(in srgb, var(--semantic-warning) 10%, var(--semantic-surface))",
  progress: "color-mix(in srgb, var(--semantic-success) 10%, var(--semantic-surface))",
};

function NextStepCard({ step, index }: { step: NextStep; index: number }) {
  return (
    <div
      className="flex flex-col justify-between gap-4 rounded-2xl p-5 shadow-sm"
      style={{ background: step.surface, border: `1px solid ${step.border}` }}
    >
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-[var(--semantic-text-primary)]"
            style={{
              background: KIND_SURFACE[step.kind],
              border: `1px solid color-mix(in srgb, var(--semantic-border-soft) 70%, transparent)`,
            }}
          >
            P{step.priority}
          </span>
          <span className="text-[0.6rem] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            {KIND_LABEL[step.kind]}
          </span>
        </div>
        <p
          className="text-[0.65rem] font-bold uppercase tracking-widest"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          Action {String(index + 1).padStart(2, "0")}
        </p>
        <p className="text-sm font-bold text-[var(--semantic-text-primary)]">{step.title}</p>
        <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{step.body}</p>
      </div>
      <div>
        <Link
          href={step.href}
          className={`${
            step.ctaVariant === "primary" ? "nn-btn-primary" : "nn-btn-secondary"
          } inline-flex min-h-[2.25rem] items-center rounded-lg px-4 text-xs font-semibold shadow-none`}
        >
          {step.cta}
        </Link>
      </div>
    </div>
  );
}

const SURFACES = [
  {
    surface: "var(--surface-soft-a, var(--semantic-panel-cool))",
    border: "color-mix(in srgb, var(--semantic-info) 20%, var(--semantic-border-soft))",
  },
  {
    surface: "var(--surface-soft-c, var(--semantic-panel-positive))",
    border: "color-mix(in srgb, var(--semantic-success) 20%, var(--semantic-border-soft))",
  },
  {
    surface: "color-mix(in srgb, var(--semantic-warning) 8%, var(--semantic-surface))",
    border: "color-mix(in srgb, var(--semantic-warning) 20%, transparent)",
  },
  {
    surface: "color-mix(in srgb, var(--semantic-brand) 8%, var(--semantic-surface))",
    border: "color-mix(in srgb, var(--semantic-brand) 20%, transparent)",
  },
];

function buildSteps(
  summary: AnalyticsSummary,
  patterns: ConfidencePatternSummary,
): NextStep[] {
  const steps: Omit<NextStep, "surface" | "border">[] = [];
  let priority = 1;

  // 1. Overconfidence intervention (highest urgency)
  if (patterns.overconfidentErrors >= 3) {
    steps.push({
      step: "01",
      title: "Fix Overconfident Errors",
      body: `You have ${patterns.overconfidentErrors} questions where you were confident but wrong — these are your highest-risk gaps. Review them in the spaced repetition queue.`,
      cta: "Open review queue",
      href: "/app/review",
      ctaVariant: "primary",
      priority: priority++,
      kind: "risk",
    });
  }

  // 2. CAT if no recent one
  if (summary.catSessionCount === 0) {
    steps.push({
      step: "01",
      title: "Measure Your Readiness",
      body: "You have not completed a CAT session yet. A CAT gives you an adaptive readiness score and identifies exact weak areas.",
      cta: "Start a CAT",
      href: "/app/practice-tests",
      ctaVariant: "primary",
      priority: priority++,
      kind: "measure",
    });
  } else if (summary.latestReadinessBand === "not_ready" || summary.latestReadinessBand === "building") {
    steps.push({
      step: "01",
      title: "Strengthen Foundations",
      body: "Your readiness score shows you are still building. Focus on lesson review before increasing question volume.",
      cta: "Go to lessons",
      href: "/app/lessons",
      ctaVariant: "primary",
      priority: priority++,
      kind: "build",
    });
  }

  // 3. Uncertain correct — reinforce near-misses
  if (patterns.uncertainCorrect >= 5) {
    steps.push({
      step: "02",
      title: "Reinforce Uncertain Correct",
      body: `You answered ${patterns.uncertainCorrect} questions correctly but lacked confidence. Use flashcards to lock in this fragile knowledge before it slips.`,
      cta: "Go to flashcards",
      href: "/app/flashcards",
      ctaVariant: "secondary",
      priority: priority++,
      kind: "build",
    });
  }

  // 4. Strategy practice if enough sessions
  if (summary.studySessionCount >= 10) {
    steps.push({
      step: steps.length + 1 < 10 ? `0${steps.length + 1}` : `${steps.length + 1}`,
      title: "Practice Thinking Strategies",
      body: "Use the strategy trainer to build clinical decision-making patterns — not just recall, but the reasoning approach that unlocks harder questions.",
      cta: "Open strategy trainer",
      href: "/app/strategy",
      ctaVariant: "secondary",
      priority: priority++,
      kind: "build",
    });
  }

  // 5. Streak / consistency
  if (summary.streakDays === 0) {
    steps.push({
      step: steps.length + 1 < 10 ? `0${steps.length + 1}` : `${steps.length + 1}`,
      title: "Build Your Study Streak",
      body: "Consistent daily practice compounds faster than long irregular sessions. Even 15 minutes daily improves retention.",
      cta: "Start a quick session",
      href: "/app/questions",
      ctaVariant: "secondary",
      priority: priority++,
      kind: "consistency",
    });
  }

  // 6. Always-on: take another CAT
  if (summary.catSessionCount > 0) {
    steps.push({
      step: steps.length + 1 < 10 ? `0${steps.length + 1}` : `${steps.length + 1}`,
      title: "Track Your Progress",
      body: "Take another CAT to see if your readiness score has improved since your last session.",
      cta: "Take another CAT",
      href: "/app/practice-tests",
      ctaVariant: "secondary",
      priority: priority++,
      kind: "progress",
    });
  }

  // Assign alternating surfaces
  return steps.slice(0, 6).map((s, i) => ({
    ...s,
    ...(SURFACES[i % SURFACES.length]!),
  }));
}
