import Link from "next/link";
import { remediationCatPracticeHref, remediationLessonsTopicHref, remediationTopicDrillHref } from "@/lib/learner/remediation-links";

type ReadinessLevel = "Likely Pass" | "Borderline" | "At Risk";

type PlanStep = {
  step: number;
  title: string;
  description: string;
  href: string;
  cta: string;
  primary?: boolean;
};

function flashcardsHrefForTopic(topic: string | null, pathwayId?: string | null): string {
  const q = new URLSearchParams();
  const pathway = pathwayId?.trim();
  if (pathway) q.set("pathwayId", pathway);
  if (topic?.trim()) q.set("q", topic.trim());
  const qs = q.toString();
  return qs ? `/app/flashcards?${qs}` : "/app/flashcards";
}

function mixedQuestionHref(pathwayId?: string | null): string {
  const q = new URLSearchParams({ preset: "mixed" });
  const pathway = pathwayId?.trim();
  if (pathway) q.set("pathwayId", pathway);
  return `/app/questions?${q.toString()}`;
}

function normalizeReadinessLevel(
  level: string | null | undefined,
): ReadinessLevel {
  if (level === "Likely Pass" || level === "Borderline" || level === "At Risk") return level;
  return "Borderline";
}

function buildPlanByLevel(args: {
  readinessLevel: ReadinessLevel;
  weakAreas: string[];
  pathwayId?: string | null;
}): PlanStep[] {
  const { readinessLevel, weakAreas, pathwayId } = args;
  const topWeak = weakAreas[0] ?? null;
  const lessonsHref = remediationLessonsTopicHref(topWeak ?? "", null, pathwayId);
  const flashcardsHref = flashcardsHrefForTopic(topWeak, pathwayId);
  const topicQuestionsHref = remediationTopicDrillHref(topWeak ?? "", pathwayId);
  const mixedQuestions = mixedQuestionHref(pathwayId);
  const retakeHref = remediationCatPracticeHref(topWeak ?? undefined, pathwayId);

  if (readinessLevel === "Likely Pass") {
    return [
      {
        step: 1,
        title: "Brief weak-area reinforcement",
        description: topWeak
          ? `Do a quick lesson review in ${topWeak} to lock in your final weak spot.`
          : "Do a short lesson review in your weakest category before your next attempt.",
        href: lessonsHref,
        cta: "Review lessons",
      },
      {
        step: 2,
        title: "Run mixed practice questions",
        description: "Use mixed sets to confirm consistent decision-making across categories.",
        href: mixedQuestions,
        cta: "Practice mixed questions",
        primary: true,
      },
      {
        step: 3,
        title: "Retake readiness later",
        description: "Retest after reinforcement to confirm this result is stable before exam day.",
        href: retakeHref,
        cta: "Retake readiness exam",
      },
    ];
  }

  if (readinessLevel === "At Risk") {
    return [
      {
        step: 1,
        title: "Return to lessons first",
        description: topWeak
          ? `Start with lessons in ${topWeak} and any other weak categories before retesting.`
          : "Start with lesson review in your weakest categories before retesting.",
        href: lessonsHref,
        cta: "Review lessons",
        primary: true,
      },
      {
        step: 2,
        title: "Reinforce with flashcards",
        description: "Use targeted flashcards to improve recall and reduce repeat misses.",
        href: flashcardsHref,
        cta: "Practice flashcards",
      },
      {
        step: 3,
        title: "Targeted questions before CAT",
        description: "Complete category drills after review; do not retake CAT immediately.",
        href: topicQuestionsHref,
        cta: "Practice weak-topic questions",
      },
      {
        step: 4,
        title: "Retake readiness exam",
        description: "Retake only after completing review, flashcards, and targeted question work.",
        href: retakeHref,
        cta: "Retake readiness exam",
      },
    ];
  }

  return [
    {
      step: 1,
      title: "Focused review of weakest categories",
      description: topWeak
        ? `Start with lesson review for ${topWeak} and your other weak categories.`
        : "Start with lesson review for your weakest categories.",
      href: lessonsHref,
      cta: "Review lessons",
      primary: true,
    },
    {
      step: 2,
      title: "Targeted flashcards",
      description: "Use flashcards to reinforce weak concepts before full mixed testing.",
      href: flashcardsHref,
      cta: "Practice flashcards",
    },
    {
      step: 3,
      title: "Practice questions by category",
      description: "Run targeted question drills to improve performance where misses cluster.",
      href: topicQuestionsHref,
      cta: "Practice weak-topic questions",
    },
    {
      step: 4,
      title: "Retake readiness exam",
      description: "Retake after focused review to measure whether readiness moved out of borderline.",
      href: retakeHref,
      cta: "Retake readiness exam",
    },
  ];
}

export function GuidedNextSteps({
  readinessLevel,
  weakAreas,
  pathwayId,
}: {
  readinessLevel: string | null | undefined;
  weakAreas: string[];
  pathwayId?: string | null;
}) {
  const level = normalizeReadinessLevel(readinessLevel);
  const prioritizedWeakAreas = weakAreas.filter(Boolean).slice(0, 3);
  const steps = buildPlanByLevel({ readinessLevel: level, weakAreas: prioritizedWeakAreas, pathwayId });

  return (
    <section className="nn-cat-results__section">
      <h2 className="nn-cat-results__section-title">What To Do Next</h2>
      <p className="mb-4 text-sm text-[var(--semantic-text-secondary)]">
        Follow this sequence based on your current readiness result.
      </p>

      <div className="nn-cat-next-steps-grid">
        {steps.map((item) => (
          <div key={`${item.step}-${item.title}`} className="nn-cat-next-step-card">
            <p className="nn-cat-next-step-card__num">Step {String(item.step).padStart(2, "0")}</p>
            <p className="nn-cat-next-step-card__title">{item.title}</p>
            <p className="nn-cat-next-step-card__desc">{item.description}</p>
            <div className="nn-cat-next-step-card__action">
              <Link
                href={item.href}
                className={`${item.primary ? "nn-btn-primary" : "nn-btn-secondary"} inline-flex min-h-[2.5rem] items-center rounded-lg px-4 text-sm font-semibold shadow-none`}
              >
                {item.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {prioritizedWeakAreas.length > 0 ? (
        <div className="mt-5 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-4">
          <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Weak-area action links</p>
          <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">
            Direct actions for the categories most responsible for this result.
          </p>
          <ul className="mt-3 space-y-3">
            {prioritizedWeakAreas.map((topic) => (
              <li key={topic} className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-3">
                <p className="text-sm font-medium text-[var(--semantic-text-primary)]">{topic}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link
                    href={remediationLessonsTopicHref(topic, null, pathwayId)}
                    className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))] bg-[var(--semantic-panel-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-brand)]"
                  >
                    Review lesson
                  </Link>
                  <Link
                    href={flashcardsHrefForTopic(topic, pathwayId)}
                    className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-info)]"
                  >
                    Practice flashcards
                  </Link>
                  <Link
                    href={remediationTopicDrillHref(topic, pathwayId)}
                    className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[var(--semantic-panel-warm)] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-warning)]"
                  >
                    Do category questions
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
