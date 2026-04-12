"use client";

/**
 * Adaptive Study Plan Generator
 *
 * Deterministic, data-driven plan divided into 3 sections:
 *   1. Focus Areas  — top weak topics ranked by accuracy + confidence signal
 *   2. Daily Study Plan — 3–5 day structured day cards (adaptive to readiness)
 *   3. Retest Strategy — when + how to retest
 *
 * Palette: follows multi-surface system used across lessons, practice, and review:
 *   summary        → surface-emphasis
 *   focus areas    → soft-warning (major gap) / soft-info (reinforcement) / muted (slight)
 *   day cards      → alternating soft-a / soft-b
 *   retest card    → soft-info
 *
 * All colors via CSS custom properties — zero hardcoded hex.
 */

import Link from "next/link";
import { BookOpen, ClipboardList, RotateCcw, Lightbulb } from "lucide-react";
import {
  getReadinessBand,
  BAND_LABELS,
  ReadinessBandBadge,
  type ReadinessBand,
} from "./cat-readiness-hero";
import {
  LockedDayShell,
  PremiumLockCard,
  UpgradePromptCard,
  usePremiumGateImpression,
} from "./premium-gate";

// ── Types ────────────────────────────────────────────────────────────────────

/** Weakness severity mapping (spec §5). */
export type WeaknessLabel = "major-gap" | "needs-reinforcement" | "slight-weakness";

const WEAKNESS_DISPLAY: Record<WeaknessLabel, string> = {
  "major-gap": "Major Gap",
  "needs-reinforcement": "Needs Reinforcement",
  "slight-weakness": "Slight Weakness",
};

function deriveWeaknessLabel(accuracyPct: number): WeaknessLabel {
  if (accuracyPct < 45) return "major-gap";
  if (accuracyPct < 68) return "needs-reinforcement";
  return "slight-weakness";
}

/** A single resolved focus area topic row. */
export interface FocusArea {
  topic: string;
  accuracyPct: number;
  label: WeaknessLabel;
  /** Optional human-readable confidence signal sentence. */
  confidenceSignal: string | null;
  lessonHref: string;
}

/** Block type icons map to a CSS modifier and a lucide icon. */
export type StudyBlockType = "lesson" | "practice" | "review" | "recap";

/** Individual action block inside a study day (spec §6). */
export interface StudyBlock {
  type: StudyBlockType;
  instruction: string;
  actionLabel: string;
  href: string;
}

/** A single day in the study plan (spec §6). */
export interface StudyDay {
  dayNumber: number;
  title: string;
  blocks: StudyBlock[];
  /** Alternating surface variant for palette variation (spec §8). */
  variant: "a" | "b";
}

/** Retest timing + recommendation (spec §7). */
export interface RetestStrategy {
  timing: string;
  recommendation: string;
  catHref: string;
}

/** Full generated plan (output of `generateStudyPlan`). */
export interface StudyPlan {
  band: ReadinessBand;
  readinessScore: number;
  interpretation: string;
  focusAreas: FocusArea[];
  days: StudyDay[];
  retestStrategy: RetestStrategy;
}

/** All input data the generator needs. Falls back gracefully when partial. */
export interface StudyPlanInput {
  /** 0–100 readiness score (from CAT report or derived from accuracy). */
  readinessScore: number;
  /** Ranked weak topics — most critical first. */
  weakTopics: Array<{
    topic: string;
    correct: number;
    total: number;
    accuracyPct: number;
  }>;
  strengthTopics: string[];
  /** True when the confidence analytics detected overconfident incorrect answers. */
  hasOverconfidence: boolean;
  /** True when many answers were correct but low-confidence. */
  hasManyUncertainCorrect: boolean;
  pathwayId: string | null;
  testId: string;
}

// ── Route helpers ─────────────────────────────────────────────────────────────

function lessonsHref(pathwayId: string | null, topic?: string): string {
  const base = pathwayId
    ? `/app/lessons?pathway=${encodeURIComponent(pathwayId)}`
    : "/app/lessons";
  return topic ? `${base}&topic=${encodeURIComponent(topic)}` : base;
}

function practiceHref(): string {
  return "/app/practice-tests";
}

// ── Interpretation sentences (deterministic, spec §4) ────────────────────────

const INTERPRETATION: Record<ReadinessBand, string> = {
  not_ready:
    "Your foundation is still developing. The plan below focuses on building core knowledge first.",
  building:
    "You are making progress. A few areas of inconsistency are holding your score back.",
  approaching:
    "You are close to exam readiness. Targeted work on remaining weak spots will get you there.",
  exam_ready:
    "Your performance is strong and consistent. Fine-tune your remaining weak areas to stay sharp.",
};

// ── Plan Generator ────────────────────────────────────────────────────────────

/**
 * `generateStudyPlan` — deterministic plan builder.
 *
 * Adaptive rules (spec §10):
 *   readiness < 50  → lesson-heavy, 5 days, no immediate CAT
 *   readiness 50–74 → balanced lessons + practice, 4 days, timed practice
 *   readiness ≥ 75  → CAT-focused, 3 days, refine weak areas
 *   + overconfidence → Day 1 prioritises overconfidence correction block
 *   + uncertain correct → adds reinforcement block
 */
export function generateStudyPlan(input: StudyPlanInput): StudyPlan {
  const { readinessScore, weakTopics, hasOverconfidence, hasManyUncertainCorrect, pathwayId, testId } =
    input;

  const band = getReadinessBand(readinessScore);

  // Focus areas — top 5 (spec §5)
  const focusAreas: FocusArea[] = weakTopics.slice(0, 5).map((wt) => {
    const label = deriveWeaknessLabel(wt.accuracyPct);
    let confidenceSignal: string | null = null;
    if (hasOverconfidence && label === "major-gap") {
      confidenceSignal = "Often answered incorrectly with high confidence";
    } else if (hasManyUncertainCorrect && wt.accuracyPct >= 55) {
      confidenceSignal = "Uncertain answers: reinforce for reliable recall";
    }
    return {
      topic: wt.topic,
      accuracyPct: wt.accuracyPct,
      label,
      confidenceSignal,
      lessonHref: lessonsHref(pathwayId, wt.topic),
    };
  });

  const topTopics = weakTopics.slice(0, 3).map((t) => t.topic);
  const topic1 = topTopics[0] ?? "Core Concepts";
  const topic2 = topTopics[1] ?? "Clinical Applications";
  const topic3 = topTopics[2] ?? "Pharmacology";

  // ── Build day plans ──────────────────────────────────────────────────────

  let days: StudyDay[];

  if (band === "not_ready" || (band === "building" && readinessScore < 50)) {
    days = [
      {
        dayNumber: 1,
        title: `Build Your Foundation: ${topic1}`,
        variant: "a",
        blocks: [
          ...(hasOverconfidence
            ? [
                {
                  type: "review" as const,
                  instruction: `Review the questions you answered incorrectly with high confidence. Understanding why builds stronger recall.`,
                  actionLabel: "Review Session",
                  href: `/app/practice-tests/${testId}/results`,
                },
              ]
            : []),
          {
            type: "lesson",
            instruction: `Study the ${topic1} lesson. Focus on core concepts and take notes on anything unfamiliar.`,
            actionLabel: "Open Lesson",
            href: lessonsHref(pathwayId, topic1),
          },
          {
            type: "practice",
            instruction: `Answer 10 targeted questions on ${topic1} to check your understanding.`,
            actionLabel: "Start Practice",
            href: practiceHref(),
          },
          {
            type: "review",
            instruction: "Read the full explanation for every question you got wrong before moving on.",
            actionLabel: "Review Results",
            href: practiceHref(),
          },
        ],
      },
      {
        dayNumber: 2,
        title: `Learn: ${topic2}`,
        variant: "b",
        blocks: [
          {
            type: "lesson",
            instruction: `Study the ${topic2} lesson. Focus on understanding the reasoning, not memorization.`,
            actionLabel: "Open Lesson",
            href: lessonsHref(pathwayId, topic2),
          },
          {
            type: "practice",
            instruction: `Answer 10 targeted questions on ${topic2}.`,
            actionLabel: "Start Practice",
            href: practiceHref(),
          },
          {
            type: "recap",
            instruction: "Briefly revisit yesterday's material to reinforce what you learned.",
            actionLabel: "Review Day 1",
            href: lessonsHref(pathwayId),
          },
        ],
      },
      {
        dayNumber: 3,
        title: "Mixed Practice and Error Review",
        variant: "a",
        blocks: [
          {
            type: "practice",
            instruction: "Answer 15 mixed questions covering your weak areas from Days 1 and 2.",
            actionLabel: "Start Practice",
            href: practiceHref(),
          },
          {
            type: "review",
            instruction: "Review your mistakes. Look for patterns in the types of questions you get wrong.",
            actionLabel: "Review Results",
            href: practiceHref(),
          },
          ...(hasManyUncertainCorrect
            ? [
                {
                  type: "recap" as const,
                  instruction: "Some of your correct answers relied on guessing. Revisit those topics to build reliable knowledge.",
                  actionLabel: "Revisit Lessons",
                  href: lessonsHref(pathwayId),
                },
              ]
            : []),
        ],
      },
      {
        dayNumber: 4,
        title: `Learn: ${topic3}`,
        variant: "b",
        blocks: [
          {
            type: "lesson",
            instruction: `Study the ${topic3} lesson, paying attention to clinical decision-making scenarios.`,
            actionLabel: "Open Lesson",
            href: lessonsHref(pathwayId, topic3),
          },
          {
            type: "practice",
            instruction: `Answer 10 targeted questions on ${topic3}.`,
            actionLabel: "Start Practice",
            href: practiceHref(),
          },
        ],
      },
      {
        dayNumber: 5,
        title: "Consolidate and Prepare",
        variant: "a",
        blocks: [
          {
            type: "review",
            instruction: "Review your notes and lesson summaries from this week.",
            actionLabel: "Review Lessons",
            href: lessonsHref(pathwayId),
          },
          {
            type: "practice",
            instruction: "Answer 20 mixed questions across all weak areas. Aim for consistency above 60%.",
            actionLabel: "Start Practice",
            href: practiceHref(),
          },
          {
            type: "recap",
            instruction: "Hold off on a CAT exam. Complete one or two more study sessions first to build consistency.",
            actionLabel: "Continue Studying",
            href: practiceHref(),
          },
        ],
      },
    ];
  } else if (readinessScore < 75) {
    days = [
      {
        dayNumber: 1,
        title: `Strengthen: ${topic1}`,
        variant: "a",
        blocks: [
          ...(hasOverconfidence
            ? [
                {
                  type: "review" as const,
                  instruction: "Start by reviewing the questions you got wrong with high confidence to recalibrate.",
                  actionLabel: "Review Session",
                  href: `/app/practice-tests/${testId}/results`,
                },
              ]
            : []),
          {
            type: "lesson",
            instruction: `Study the ${topic1} lesson, focusing on the areas where you scored below 60%.`,
            actionLabel: "Open Lesson",
            href: lessonsHref(pathwayId, topic1),
          },
          {
            type: "practice",
            instruction: `Answer 15 targeted questions on ${topic1}.`,
            actionLabel: "Start Practice",
            href: practiceHref(),
          },
          {
            type: "review",
            instruction: "Review incorrect answers. Note the clinical reasoning behind each correction.",
            actionLabel: "Review Results",
            href: practiceHref(),
          },
        ],
      },
      {
        dayNumber: 2,
        title: `Strengthen: ${topic2}`,
        variant: "b",
        blocks: [
          {
            type: "lesson",
            instruction: `Study the ${topic2} lesson.`,
            actionLabel: "Open Lesson",
            href: lessonsHref(pathwayId, topic2),
          },
          {
            type: "practice",
            instruction: `Answer 15 targeted questions on ${topic2}.`,
            actionLabel: "Start Practice",
            href: practiceHref(),
          },
          ...(hasManyUncertainCorrect
            ? [
                {
                  type: "recap" as const,
                  instruction: "Some correct answers relied on guessing. Revisit those sections to build confident recall.",
                  actionLabel: "Revisit Lessons",
                  href: lessonsHref(pathwayId),
                },
              ]
            : []),
        ],
      },
      {
        dayNumber: 3,
        title: "Timed Practice",
        variant: "a",
        blocks: [
          {
            type: "practice",
            instruction: "Answer 20 questions under timed conditions. Aim for about 90 seconds per question.",
            actionLabel: "Start Timed Practice",
            href: practiceHref(),
          },
          {
            type: "review",
            instruction: "Review incorrect answers. Note which topics caused the most errors under time pressure.",
            actionLabel: "Review Results",
            href: practiceHref(),
          },
        ],
      },
      {
        dayNumber: 4,
        title: "Consolidate and Retest",
        variant: "b",
        blocks: [
          {
            type: "review",
            instruction: `Revisit your notes on ${topic1} and ${topic2}. Focus on the gaps that keep reappearing.`,
            actionLabel: "Review Lessons",
            href: lessonsHref(pathwayId),
          },
          {
            type: "practice",
            instruction: "Answer 20 mixed questions to measure your consistency across all topics.",
            actionLabel: "Start Practice",
            href: practiceHref(),
          },
          {
            type: "recap",
            instruction: "Once you consistently score above 70% on mixed sets, you are ready to retake the CAT.",
            actionLabel: "Start CAT When Ready",
            href: practiceHref(),
          },
        ],
      },
    ];
  } else {
    days = [
      {
        dayNumber: 1,
        title: "CAT Simulation and Review",
        variant: "a",
        blocks: [
          {
            type: "practice",
            instruction: "Take a full CAT session when you feel mentally fresh. Simulate real exam conditions.",
            actionLabel: "Start CAT",
            href: practiceHref(),
          },
          ...(hasOverconfidence
            ? [
                {
                  type: "review" as const,
                  instruction: "Review the high-confidence questions you got wrong. Even strong performers have calibration gaps.",
                  actionLabel: "Review Session",
                  href: `/app/practice-tests/${testId}/results`,
                },
              ]
            : []),
          {
            type: "lesson",
            instruction: `After your CAT, review the ${topic1} lesson to reinforce your most persistent weak area.`,
            actionLabel: "Open Lesson",
            href: lessonsHref(pathwayId, topic1),
          },
        ],
      },
      {
        dayNumber: 2,
        title: "Precision Practice on Weak Areas",
        variant: "b",
        blocks: [
          {
            type: "practice",
            instruction: `Answer 20 targeted questions across ${topic1} and ${topic2}. Prioritize clinical reasoning.`,
            actionLabel: "Start Practice",
            href: practiceHref(),
          },
          {
            type: "review",
            instruction: "Review every incorrect answer, paying close attention to your reasoning process.",
            actionLabel: "Review Results",
            href: practiceHref(),
          },
          ...(hasManyUncertainCorrect
            ? [
                {
                  type: "recap" as const,
                  instruction: "Some correct answers relied on guessing. Revisit those topics to build confident mastery.",
                  actionLabel: "Revisit Lessons",
                  href: lessonsHref(pathwayId),
                },
              ]
            : []),
        ],
      },
      {
        dayNumber: 3,
        title: "Final Consolidation",
        variant: "a",
        blocks: [
          {
            type: "practice",
            instruction: "Answer 25 mixed-difficulty questions across all systems. Focus on consistency.",
            actionLabel: "Start Practice",
            href: practiceHref(),
          },
          {
            type: "review",
            instruction: "Consolidate your notes. Flag any topics that keep appearing as weak.",
            actionLabel: "Review Lessons",
            href: lessonsHref(pathwayId),
          },
          {
            type: "recap",
            instruction: "You are exam-ready. Take another CAT to confirm your stability. Consistent scores across two or more sessions is a strong signal.",
            actionLabel: "Start Another CAT",
            href: practiceHref(),
          },
        ],
      },
    ];
  }

  // ── Retest strategy (spec §7) ────────────────────────────────────────────

  const retestStrategy: RetestStrategy = (() => {
    switch (band) {
      case "not_ready":
        return {
          timing: "After 3 to 5 focused study sessions",
          recommendation:
            "Focus on your weakest topics first. Once you consistently score above 55% on mixed question sets, take another CAT to measure your progress.",
          catHref: practiceHref(),
        };
      case "building":
        return {
          timing: "After 2 to 3 focused study sessions",
          recommendation:
            "Work through your weak areas. When your mixed-set accuracy is consistently above 65%, retake the CAT to check your improvement.",
          catHref: practiceHref(),
        };
      case "approaching":
        return {
          timing: "After 1 to 2 targeted sessions",
          recommendation:
            "You are close. One or two focused sessions on remaining weak areas, then retake the CAT. A score of 75 or higher indicates strong readiness.",
          catHref: practiceHref(),
        };
      case "exam_ready":
        return {
          timing: "Now, or after one more review session",
          recommendation:
            "Your readiness is high. You can retest now or after one targeted review. Two strong CAT scores in a row confirms you are ready.",
          catHref: practiceHref(),
        };
    }
  })();

  return {
    band,
    readinessScore,
    interpretation: INTERPRETATION[band],
    focusAreas,
    days,
    retestStrategy,
  };
}

// ── StudyBlockItem ────────────────────────────────────────────────────────────

const BLOCK_ICONS: Record<StudyBlockType, React.ReactNode> = {
  lesson: <BookOpen className="h-4 w-4" aria-hidden />,
  practice: <ClipboardList className="h-4 w-4" aria-hidden />,
  review: <RotateCcw className="h-4 w-4" aria-hidden />,
  recap: <Lightbulb className="h-4 w-4" aria-hidden />,
};

const BLOCK_TYPE_LABELS: Record<StudyBlockType, string> = {
  lesson: "Lesson",
  practice: "Practice",
  review: "Review",
  recap: "Tip",
};

export function StudyBlockItem({ block, stepNumber }: { block: StudyBlock; stepNumber: number }) {
  return (
    <div className="nn-study-block">
      <div className="nn-study-block__step-col">
        <span className="nn-study-block__step-number">{stepNumber}</span>
        <div className={`nn-study-block__icon nn-study-block__icon--${block.type}`}>
          {BLOCK_ICONS[block.type]}
        </div>
      </div>
      <div className="nn-study-block__content">
        <p className="nn-study-block__type-label">{BLOCK_TYPE_LABELS[block.type]}</p>
        <p className="nn-study-block__instruction">{block.instruction}</p>
        <Link
          href={block.href}
          className="nn-study-block__cta"
        >
          {block.actionLabel}
        </Link>
      </div>
    </div>
  );
}

// ── StudyDayCard ──────────────────────────────────────────────────────────────

export function StudyDayCard({ day }: { day: StudyDay }) {
  return (
    <div className={`nn-study-day-card nn-study-day-card--${day.variant}`}>
      <div className="nn-study-day-card__header">
        <span className="nn-study-day-card__day-badge" aria-label={`Day ${day.dayNumber}`}>
          Day {day.dayNumber}
        </span>
        <h4 className="nn-study-day-card__title">{day.title}</h4>
      </div>
      <div className="nn-study-day-card__body">
        {day.blocks.map((block, i) => (
          <StudyBlockItem key={i} block={block} stepNumber={i + 1} />
        ))}
      </div>
    </div>
  );
}

// ── FocusAreasList ────────────────────────────────────────────────────────────

const FOCUS_VARIANT: Record<WeaknessLabel, string> = {
  "major-gap": "nn-focus-area-row--major",
  "needs-reinforcement": "nn-focus-area-row--reinforcement",
  "slight-weakness": "nn-focus-area-row--slight",
};

const LABEL_VARIANT: Record<WeaknessLabel, string> = {
  "major-gap": "",
  "needs-reinforcement": "nn-focus-area-row__label--reinforcement",
  "slight-weakness": "nn-focus-area-row__label--slight",
};

/**
 * FocusAreasList — ranked list of weak topics with label + confidence signal (spec §5).
 */
export function FocusAreasList({ areas }: { areas: FocusArea[] }) {
  if (areas.length === 0) {
    return (
      <p className="text-sm text-[var(--semantic-text-muted)] italic">
        No significant weak areas detected. Continue with general practice to maintain readiness.
      </p>
    );
  }

  return (
    <div className="nn-focus-areas-list">
      {areas.map((area) => (
        <div
          key={area.topic}
          className={`nn-focus-area-row ${FOCUS_VARIANT[area.label]}`}
        >
          <div className="nn-focus-area-row__body">
            <p className="nn-focus-area-row__name">{area.topic}</p>
            {area.confidenceSignal ? (
              <p className="nn-focus-area-row__signal">{area.confidenceSignal}</p>
            ) : null}
          </div>
          <div className="nn-focus-area-row__right">
            <span
              className={`nn-focus-area-row__label ${LABEL_VARIANT[area.label]}`}
            >
              {WEAKNESS_DISPLAY[area.label]}
            </span>
            <span className="nn-focus-area-row__pct" aria-label={`${area.accuracyPct}% accuracy`}>
              {area.accuracyPct}% accuracy
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── RetestStrategyCard ────────────────────────────────────────────────────────

export function RetestStrategyCard({ strategy }: { strategy: RetestStrategy }) {
  return (
    <div className="nn-retest-card">
      <h3 className="nn-retest-card__heading">When to Retest</h3>
      <p className="nn-retest-card__timing-text">{strategy.timing}</p>
      <p className="nn-retest-card__recommendation">{strategy.recommendation}</p>
      <Link
        href={strategy.catHref}
        className="nn-retest-card__cta"
      >
        Start Another CAT
      </Link>
    </div>
  );
}

// ── StudyPlanSummary ──────────────────────────────────────────────────────────

export function StudyPlanSummary({
  plan,
}: {
  plan: Pick<StudyPlan, "band" | "readinessScore" | "interpretation">;
}) {
  return (
    <div className="nn-study-plan-summary">
      <p className="nn-study-plan-summary__label">Your Study Plan</p>
      <div className="nn-study-plan-summary__hero">
        <span
          className="nn-study-plan-summary__score"
          aria-label={`Readiness score: ${plan.readinessScore}`}
        >
          {plan.readinessScore}
        </span>
        <div className="nn-study-plan-summary__hero-text">
          <ReadinessBandBadge band={plan.band} />
          <p className="nn-study-plan-summary__interp">{plan.interpretation}</p>
        </div>
      </div>
    </div>
  );
}

// ── StudyPlanLayout ───────────────────────────────────────────────────────────

/**
 * StudyPlanLayout — the full Adaptive Study Plan screen (spec §2–§12).
 *
 * Gating (spec §5):
 *   isEntitled = true  → full plan (all days + retest strategy)
 *   isEntitled = false → summary + focus areas + Day 1 + locked shells for
 *                        remaining days + UpgradePromptCard in place of retest
 *
 * Strict section order:
 *   1. StudyPlanSummary     (surface-emphasis)
 *   2. FocusAreasList       (soft-warning / soft-info / muted)
 *   3. StudyDayCard × N     (alternating soft-a / soft-b; days 2+ locked)
 *   4. RetestStrategyCard   (soft-info) OR UpgradePromptCard
 */
export function StudyPlanLayout({
  plan,
  isEntitled = true,
}: {
  plan: StudyPlan;
  isEntitled?: boolean;
}) {
  usePremiumGateImpression("studyPlanLockedViewed", isEntitled);

  // For free users: show Day 1 + locked shells for remaining days
  const freeDays = plan.days.slice(0, 1);
  const lockedDays = plan.days.slice(1);

  return (
    <div className="nn-study-plan">
      {/* 1 — Summary hero */}
      <StudyPlanSummary plan={plan} />

      {/* 2 — Focus Areas */}
      <section className="nn-study-plan-section">
        <h3 className="nn-study-plan-section__title">Focus Areas</h3>
        <p className="nn-study-plan-section__desc">
          These topics had the most impact on your score. Work through them in order.
        </p>
        <FocusAreasList
          areas={isEntitled ? plan.focusAreas : plan.focusAreas.slice(0, 2)}
        />
        {!isEntitled && plan.focusAreas.length > 2 ? (
          <PremiumLockCard
            title={`${plan.focusAreas.length - 2} More Focus Areas`}
            description="Unlock the full ranked list of weak topics with severity labels and lesson links."
            ctaLabel="View Plans"
          />
        ) : null}
      </section>

      <div className="nn-study-plan__divider" />

      {/* 3 — Daily Study Plan */}
      <section className="nn-study-plan-section">
        <h3 className="nn-study-plan-section__title">
          Your {plan.days.length}-Day Plan
        </h3>
        <p className="nn-study-plan-section__desc">
          Follow each day in order. Every step builds on the last.
        </p>

        {freeDays.map((day) => (
          <StudyDayCard key={day.dayNumber} day={day} />
        ))}

        {!isEntitled && lockedDays.length > 0 ? (
          <>
            {lockedDays.map((day) => (
              <LockedDayShell
                key={day.dayNumber}
                dayNumber={day.dayNumber}
                title={day.title}
              />
            ))}
            <PremiumLockCard
              title="Unlock Your Full Study Plan"
              description={`Get all ${plan.days.length} days with structured lessons, practice, and review tailored to your weak areas.`}
              ctaLabel="View Plans"
              secondaryHref="/app/lessons"
              secondaryLabel="Continue Free Study"
            />
          </>
        ) : isEntitled ? (
          lockedDays.map((day) => (
            <StudyDayCard key={day.dayNumber} day={day} />
          ))
        ) : null}
      </section>

      {/* 4 — Retest Strategy */}
      {isEntitled ? (
        <RetestStrategyCard strategy={plan.retestStrategy} />
      ) : (
        <UpgradePromptCard isEntitled={false} />
      )}
    </div>
  );
}

// ── StudyPlanFromResults (convenience wrapper) ────────────────────────────────

/**
 * `StudyPlanFromResults` — takes raw runner state and computes + renders the plan.
 *
 * Accepts the same data already available on the CAT / practice results page:
 *   - `readinessScore`: from catReport.readinessScore or derived from accuracyPct
 *   - `byTopic`:        Record<topic, {correct, total}> (from results)
 *   - `weakAreas`:      string[] (pre-ranked by the server)
 *   - `hasOverconfidence` / `hasManyUncertainCorrect`: from confidence analytics
 *   - `pathwayId` / `testId`: from testConfig + testId prop
 */
export function StudyPlanFromResults({
  readinessScore,
  byTopic,
  weakAreas,
  hasOverconfidence,
  hasManyUncertainCorrect,
  pathwayId,
  testId,
  isEntitled = true,
}: {
  readinessScore: number;
  byTopic: Record<string, { correct: number; total: number }>;
  weakAreas: string[];
  hasOverconfidence: boolean;
  hasManyUncertainCorrect: boolean;
  pathwayId: string | null;
  testId: string;
  /** Pass false for free/trial users to show preview gating (spec §5). */
  isEntitled?: boolean;
}) {
  // Build ranked weak topic list using server-side weakAreas order as primary rank,
  // filling in accuracy from byTopic. Topics not in byTopic get 0/0.
  const weakTopics = weakAreas.map((topic) => {
    const stat = byTopic[topic];
    const correct = stat?.correct ?? 0;
    const total = stat?.total ?? 0;
    const accuracyPct = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { topic, correct, total, accuracyPct };
  });

  // Add any byTopic topics not already in weakAreas that have < 70% accuracy
  for (const [topic, stat] of Object.entries(byTopic)) {
    if (weakTopics.some((wt) => wt.topic === topic)) continue;
    const accuracyPct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 100;
    if (accuracyPct < 70) {
      weakTopics.push({ topic, correct: stat.correct, total: stat.total, accuracyPct });
    }
  }

  // Sort by accuracy ascending (most difficult first) within weak pool
  weakTopics.sort((a, b) => a.accuracyPct - b.accuracyPct);

  const strengthTopics = Object.entries(byTopic)
    .filter(([, s]) => s.total > 0 && s.correct / s.total >= 0.8)
    .map(([t]) => t);

  const plan = generateStudyPlan({
    readinessScore,
    weakTopics,
    strengthTopics,
    hasOverconfidence,
    hasManyUncertainCorrect,
    pathwayId,
    testId,
  });

  return <StudyPlanLayout plan={plan} isEntitled={isEntitled} />;
}
