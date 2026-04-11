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
    "Your foundation still needs significant development before exam conditions will be reliable.",
  building:
    "Your performance is improving, but key areas of inconsistency are still limiting your readiness.",
  approaching:
    "You are approaching readiness, but a few key systems are limiting consistency.",
  exam_ready:
    "Your performance is strong and stable. Focus on weak areas to lock in a high pass probability.",
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
    // Low readiness: 5 lesson-heavy days, no CAT (spec §10)
    days = [
      {
        dayNumber: 1,
        title: `Day 1: Core Weak Area Repair${hasOverconfidence ? " (Overconfidence Correction)" : ""}`,
        variant: "a",
        blocks: [
          ...(hasOverconfidence
            ? [
                {
                  type: "review" as const,
                  instruction: `Review the questions you got wrong with high confidence. Understanding why you were wrong is the fastest path to improvement.`,
                  actionLabel: "Review session",
                  href: `/app/practice-tests/${testId}/results`,
                },
              ]
            : []),
          {
            type: "lesson",
            instruction: `Study the lesson covering ${topic1}. Read all sections and take notes on key concepts.`,
            actionLabel: "Open lesson",
            href: lessonsHref(pathwayId, topic1),
          },
          {
            type: "practice",
            instruction: `Complete 10 targeted questions on ${topic1} to test your understanding.`,
            actionLabel: "Start practice",
            href: practiceHref(),
          },
          {
            type: "review",
            instruction: "Review every incorrect answer and read the full explanation before moving on.",
            actionLabel: "Review results",
            href: practiceHref(),
          },
        ],
      },
      {
        dayNumber: 2,
        title: `Day 2: ${topic2} Foundation`,
        variant: "b",
        blocks: [
          {
            type: "lesson",
            instruction: `Study the lesson covering ${topic2}. Focus on understanding, not memorisation.`,
            actionLabel: "Open lesson",
            href: lessonsHref(pathwayId, topic2),
          },
          {
            type: "practice",
            instruction: `Complete 10 targeted questions on ${topic2}.`,
            actionLabel: "Start practice",
            href: practiceHref(),
          },
          {
            type: "recap",
            instruction: "Briefly recap Day 1 material to reinforce retention across sessions.",
            actionLabel: "Go to lessons",
            href: lessonsHref(pathwayId),
          },
        ],
      },
      {
        dayNumber: 3,
        title: "Day 3: Mixed Practice and Error Review",
        variant: "a",
        blocks: [
          {
            type: "practice",
            instruction: "Complete 15 mixed questions across your two weak areas from Days 1 and 2.",
            actionLabel: "Start practice",
            href: practiceHref(),
          },
          {
            type: "review",
            instruction: "Review every incorrect answer. Look for patterns in what you keep getting wrong.",
            actionLabel: "Review results",
            href: practiceHref(),
          },
          ...(hasManyUncertainCorrect
            ? [
                {
                  type: "recap" as const,
                  instruction: "You had many uncertain correct answers. Revisit lessons on those topics to turn guesses into reliable knowledge.",
                  actionLabel: "Go to lessons",
                  href: lessonsHref(pathwayId),
                },
              ]
            : []),
        ],
      },
      {
        dayNumber: 4,
        title: `Day 4: ${topic3} Study Block`,
        variant: "b",
        blocks: [
          {
            type: "lesson",
            instruction: `Study the lesson covering ${topic3}. Pay special attention to clinical decision-making scenarios.`,
            actionLabel: "Open lesson",
            href: lessonsHref(pathwayId, topic3),
          },
          {
            type: "practice",
            instruction: `Complete 10 targeted questions on ${topic3}.`,
            actionLabel: "Start practice",
            href: practiceHref(),
          },
        ],
      },
      {
        dayNumber: 5,
        title: "Day 5: Reassessment Preparation",
        variant: "a",
        blocks: [
          {
            type: "review",
            instruction: "Review all weak area notes and lesson summaries from this week.",
            actionLabel: "Go to lessons",
            href: lessonsHref(pathwayId),
          },
          {
            type: "practice",
            instruction: "Complete 20 mixed questions covering all weak areas. Aim for consistency above 60%.",
            actionLabel: "Start practice",
            href: practiceHref(),
          },
          {
            type: "recap",
            instruction: "Do not take a CAT yet. Complete 1–2 more study sessions first to build reliability.",
            actionLabel: "View study plan",
            href: practiceHref(),
          },
        ],
      },
    ];
  } else if (readinessScore < 75) {
    // Medium readiness: 4 balanced days (spec §10)
    days = [
      {
        dayNumber: 1,
        title: `Day 1: ${topic1} Deep Dive${hasOverconfidence ? " + Overconfidence Correction" : ""}`,
        variant: "a",
        blocks: [
          ...(hasOverconfidence
            ? [
                {
                  type: "review" as const,
                  instruction: "Start by reviewing high-confidence incorrect questions from your last session to recalibrate your self-assessment.",
                  actionLabel: "Review session",
                  href: `/app/practice-tests/${testId}/results`,
                },
              ]
            : []),
          {
            type: "lesson",
            instruction: `Study the lesson covering ${topic1} and focus on the areas where you scored below 60%.`,
            actionLabel: "Open lesson",
            href: lessonsHref(pathwayId, topic1),
          },
          {
            type: "practice",
            instruction: `Complete 15 targeted questions on ${topic1}.`,
            actionLabel: "Start practice",
            href: practiceHref(),
          },
          {
            type: "review",
            instruction: "Review incorrect answers and note the clinical reasoning for each correction.",
            actionLabel: "Review results",
            href: practiceHref(),
          },
        ],
      },
      {
        dayNumber: 2,
        title: `Day 2: ${topic2} Focus`,
        variant: "b",
        blocks: [
          {
            type: "lesson",
            instruction: `Study the lesson covering ${topic2}.`,
            actionLabel: "Open lesson",
            href: lessonsHref(pathwayId, topic2),
          },
          {
            type: "practice",
            instruction: `Complete 15 targeted questions on ${topic2}.`,
            actionLabel: "Start practice",
            href: practiceHref(),
          },
          ...(hasManyUncertainCorrect
            ? [
                {
                  type: "recap" as const,
                  instruction: "You had many uncertain correct answers. Revisit those lesson sections to build confident, reliable recall.",
                  actionLabel: "Go to lessons",
                  href: lessonsHref(pathwayId),
                },
              ]
            : []),
        ],
      },
      {
        dayNumber: 3,
        title: "Day 3: Timed Practice",
        variant: "a",
        blocks: [
          {
            type: "practice",
            instruction: "Complete 20 questions under timed conditions to simulate exam pressure. Aim for a steady pace, approximately 90 seconds per question.",
            actionLabel: "Start timed practice",
            href: practiceHref(),
          },
          {
            type: "review",
            instruction: "Review all incorrect answers. Note which topics caused the most errors under time pressure.",
            actionLabel: "Review results",
            href: practiceHref(),
          },
        ],
      },
      {
        dayNumber: 4,
        title: "Day 4: Pre-CAT Consolidation",
        variant: "b",
        blocks: [
          {
            type: "review",
            instruction: `Review notes and lessons on ${topic1} and ${topic2}. Focus on your most persistent gaps.`,
            actionLabel: "Go to lessons",
            href: lessonsHref(pathwayId),
          },
          {
            type: "practice",
            instruction: "Complete 20 mixed questions to measure overall consistency across all topics.",
            actionLabel: "Start practice",
            href: practiceHref(),
          },
          {
            type: "recap",
            instruction: "When you consistently score above 70% on mixed sets, you are ready to retest your CAT readiness.",
            actionLabel: "Start CAT when ready",
            href: practiceHref(),
          },
        ],
      },
    ];
  } else {
    // High readiness: 3 CAT-focused days (spec §10)
    days = [
      {
        dayNumber: 1,
        title: "Day 1: CAT Simulation + Targeted Review",
        variant: "a",
        blocks: [
          {
            type: "practice",
            instruction: "Start a new CAT session when you feel mentally fresh. Full exam-simulation conditions.",
            actionLabel: "Start CAT",
            href: practiceHref(),
          },
          ...(hasOverconfidence
            ? [
                {
                  type: "review" as const,
                  instruction: "After your CAT, review the high-confidence questions you got wrong. Even strong performers have calibration gaps.",
                  actionLabel: "Review session",
                  href: `/app/practice-tests/${testId}/results`,
                },
              ]
            : []),
          {
            type: "lesson",
            instruction: `After the CAT, review the ${topic1} lesson to reinforce your most persistent weak area.`,
            actionLabel: "Open lesson",
            href: lessonsHref(pathwayId, topic1),
          },
        ],
      },
      {
        dayNumber: 2,
        title: "Day 2: Weak Area Precision Practice",
        variant: "b",
        blocks: [
          {
            type: "practice",
            instruction: `Complete 20 targeted questions across ${topic1} and ${topic2}. Prioritize clinical reasoning over recall.`,
            actionLabel: "Start practice",
            href: practiceHref(),
          },
          {
            type: "review",
            instruction: "Review every incorrect answer with particular attention to your reasoning process.",
            actionLabel: "Review results",
            href: practiceHref(),
          },
          ...(hasManyUncertainCorrect
            ? [
                {
                  type: "recap" as const,
                  instruction: "Several correct answers relied on guessing. Revisit those lesson sections to convert uncertain knowledge into confident mastery.",
                  actionLabel: "Go to lessons",
                  href: lessonsHref(pathwayId),
                },
              ]
            : []),
        ],
      },
      {
        dayNumber: 3,
        title: "Day 3: Final Consolidation and Retest",
        variant: "a",
        blocks: [
          {
            type: "practice",
            instruction: "Complete 25 mixed-difficulty questions across all systems. Focus on maintaining consistency, not just getting easy items correct.",
            actionLabel: "Start practice",
            href: practiceHref(),
          },
          {
            type: "review",
            instruction: "Review and consolidate notes. Flag any topics that continue to appear as weak.",
            actionLabel: "Go to lessons",
            href: lessonsHref(pathwayId),
          },
          {
            type: "recap",
            instruction: "You are exam-ready. Take another CAT to confirm stability. Strong performers tend to show consistent scores across 2+ sessions.",
            actionLabel: "Start another CAT",
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
          timing: "After completing 3–5 dedicated study sessions",
          recommendation:
            "Do not retest immediately. Spend 3–5 focused sessions on your weakest topics before taking another CAT. Look for consistent accuracy above 55% across mixed sets.",
          catHref: practiceHref(),
        };
      case "building":
        return {
          timing: "After completing 2–3 focused study sessions",
          recommendation:
            "Complete 2–3 sessions covering your weak areas. When your mixed-set accuracy is consistently above 65%, take another CAT to measure improvement.",
          catHref: practiceHref(),
        };
      case "approaching":
        return {
          timing: "After 1–2 targeted sessions on remaining weak areas",
          recommendation:
            "You are close. After one or two focused sessions on your remaining weak areas, retake the CAT. A score of 75+ indicates strong readiness.",
          catHref: practiceHref(),
        };
      case "exam_ready":
        return {
          timing: "Now or after one additional review session",
          recommendation:
            "Your readiness is high. You can retest immediately or after one targeted review session. Focus on maintaining consistency: two strong CAT scores in a row is your target.",
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

/**
 * StudyBlockItem — a single action block inside a study day.
 * Icon + type label + instruction text + linked action button (spec §6).
 */
export function StudyBlockItem({ block }: { block: StudyBlock }) {
  return (
    <div className="nn-study-block">
      <div className={`nn-study-block__icon nn-study-block__icon--${block.type}`}>
        {BLOCK_ICONS[block.type]}
      </div>
      <div className="nn-study-block__content">
        <p className="nn-study-block__type-label">{BLOCK_TYPE_LABELS[block.type]}</p>
        <p className="nn-study-block__instruction">{block.instruction}</p>
      </div>
      <div className="nn-study-block__action">
        <Link
          href={block.href}
          className="nn-review-action-link"
        >
          {block.actionLabel} →
        </Link>
      </div>
    </div>
  );
}

// ── StudyDayCard ──────────────────────────────────────────────────────────────

/**
 * StudyDayCard — a single day plan card with collapsible blocks (spec §6).
 * Alternates between `soft-a` and `soft-b` surface variants (spec §8).
 */
export function StudyDayCard({ day }: { day: StudyDay }) {
  return (
    <div className={`nn-study-day-card nn-study-day-card--${day.variant}`}>
      <div className="nn-study-day-card__header">
        <span className="nn-study-day-card__day-badge" aria-label={`Day ${day.dayNumber}`}>
          {day.dayNumber}
        </span>
        <h4 className="nn-study-day-card__title">{day.title}</h4>
      </div>
      <div className="nn-study-day-card__body">
        {day.blocks.map((block, i) => (
          <StudyBlockItem key={i} block={block} />
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

/**
 * RetestStrategyCard — soft-info card with timing + recommendation + CTA (spec §7).
 */
export function RetestStrategyCard({ strategy }: { strategy: RetestStrategy }) {
  return (
    <div className="nn-retest-card">
      <h3 className="nn-retest-card__heading">When to Retest</h3>
      <div className="nn-retest-card__timing">
        <div>
          <p className="nn-retest-card__timing-label">Recommended timing</p>
          <p className="nn-retest-card__timing-text">{strategy.timing}</p>
        </div>
      </div>
      <p className="nn-retest-card__recommendation">{strategy.recommendation}</p>
      <div>
        <Link
          href={strategy.catHref}
          className="nn-review-action-btn inline-flex"
        >
          Start another CAT →
        </Link>
      </div>
    </div>
  );
}

// ── StudyPlanSummary ──────────────────────────────────────────────────────────

/**
 * StudyPlanSummary — surface-emphasis hero card (spec §4).
 * Score · Band badge · One-sentence interpretation.
 */
export function StudyPlanSummary({
  plan,
}: {
  plan: Pick<StudyPlan, "band" | "readinessScore" | "interpretation">;
}) {
  return (
    <div className="nn-study-plan-summary">
      <p className="nn-study-plan-summary__label">Adaptive Study Plan</p>
      <h2 className="nn-study-plan-summary__heading">Your Study Plan</h2>
      <div className="nn-study-plan-summary__meta">
        <span
          className="nn-study-plan-summary__score"
          aria-label={`Readiness score: ${plan.readinessScore}`}
        >
          {plan.readinessScore}
        </span>
        <ReadinessBandBadge band={plan.band} />
        <span className="text-sm text-[var(--semantic-text-muted)] font-medium">
          Readiness Score
        </span>
      </div>
      <p className="nn-study-plan-summary__interp">{plan.interpretation}</p>
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
      {/* 1 — Summary card (always visible) */}
      <StudyPlanSummary plan={plan} />

      {/* 2 — Focus Areas (always visible — top 2 for free, all for premium) */}
      <div className="nn-study-plan-section">
        <h3 className="nn-study-plan-section__title">Your Focus Areas</h3>
        <p className="nn-study-plan-section__desc">
          The topics below had the most impact on your readiness score. Study
          these first, in order.
        </p>
        <FocusAreasList
          areas={isEntitled ? plan.focusAreas : plan.focusAreas.slice(0, 2)}
        />
        {!isEntitled && plan.focusAreas.length > 2 ? (
          <PremiumLockCard
            title={`${plan.focusAreas.length - 2} more focus areas`}
            description="Unlock the full ranked list of weak topics with severity labels and lesson links for each."
            ctaLabel="View Plans"
          />
        ) : null}
      </div>

      {/* 3 — Daily Study Plan */}
      <div className="nn-study-plan-section">
        <h3 className="nn-study-plan-section__title">
          Daily Study Plan: Next {plan.days.length} Days
        </h3>
        <p className="nn-study-plan-section__desc">
          Each day is structured with lessons, practice, and review. Complete
          them in order for best results.
        </p>

        {/* Day 1 always visible */}
        {freeDays.map((day) => (
          <StudyDayCard key={day.dayNumber} day={day} />
        ))}

        {/* Days 2+ locked for free users */}
        {!isEntitled && lockedDays.length > 0 ? (
          <>
            {lockedDays.map((day) => (
              <LockedDayShell
                key={day.dayNumber}
                dayNumber={day.dayNumber}
                title={day.title.replace(/^Day \d+: /, "")}
              />
            ))}
            <PremiumLockCard
              title="Unlock your full study plan"
              description={`Unlock all ${plan.days.length} days of your personalized plan with structured lessons, practice questions, and review blocks tailored to your weak areas.`}
              ctaLabel="View Plans"
              secondaryHref="/app/lessons"
              secondaryLabel="Continue free study"
            />
          </>
        ) : isEntitled ? (
          lockedDays.map((day) => (
            <StudyDayCard key={day.dayNumber} day={day} />
          ))
        ) : null}
      </div>

      {/* 4 — Retest Strategy (premium) OR upgrade prompt (free) */}
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
