/**
 * ReadinessFocusPlan
 *
 * Intelligent "What to focus on next" recommendation cards.
 * Built from actual learner signals — NOT generic filler copy.
 *
 * Signal priority order:
 *   1. Overconfidence misses (wrong + high confidence → highest urgency)
 *   2. No CAT taken yet → measure baseline first
 *   3. Low readiness band + weak topics → targeted remediation
 *   4. High miss streak topic → focused drilling
 *   5. No study streak → consistency nudge
 *   6. Flashcard review due → spaced repetition
 *   7. Always-on: re-measure with another CAT
 *
 * Visual design:
 *   - Numbered step cards with alternating semantic surfaces
 *   - Step number rendered as a large typographic label
 *   - Primary CTA colored to match card accent
 *
 * Server Component — data pre-loaded, no interactivity.
 */

import Link from "next/link";
import type { ReadinessBand } from "@/lib/learner/readiness-score";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import type { BenchmarkData } from "@/lib/learner/benchmark-engine";
import { remediationTopicDrillHref, remediationLessonsTopicHref } from "@/lib/learner/remediation-links";

// ── Recommendation card type ──────────────────────────────────────────────────

interface FocusCard {
  step: number;
  title: string;
  body: string;
  cta: string;
  href: string;
  accent: string;
  surface: string;
  border: string;
}

// ── Surface palette — 5 distinct surfaces ────────────────────────────────────

const SURFACES: Array<Pick<FocusCard, "accent" | "surface" | "border">> = [
  {
    accent: "var(--semantic-danger, #e11d48)",
    surface:
      "color-mix(in srgb, var(--semantic-danger, #e11d48) 6%, var(--bg-card, var(--theme-card-bg)))",
    border:
      "color-mix(in srgb, var(--semantic-danger, #e11d48) 18%, var(--border-subtle, var(--theme-border)))",
  },
  {
    accent: "var(--semantic-warning, #d97706)",
    surface:
      "color-mix(in srgb, var(--semantic-warning, #d97706) 6%, var(--bg-card, var(--theme-card-bg)))",
    border:
      "color-mix(in srgb, var(--semantic-warning, #d97706) 18%, var(--border-subtle, var(--theme-border)))",
  },
  {
    accent: "var(--semantic-info, #76b6c4)",
    surface:
      "color-mix(in srgb, var(--semantic-info, #76b6c4) 6%, var(--bg-card, var(--theme-card-bg)))",
    border:
      "color-mix(in srgb, var(--semantic-info, #76b6c4) 18%, var(--border-subtle, var(--theme-border)))",
  },
  {
    accent: "var(--semantic-brand, #1da2d8)",
    surface:
      "color-mix(in srgb, var(--semantic-brand, #1da2d8) 6%, var(--bg-card, var(--theme-card-bg)))",
    border:
      "color-mix(in srgb, var(--semantic-brand, #1da2d8) 18%, var(--border-subtle, var(--theme-border)))",
  },
  {
    accent: "var(--semantic-success, #22c55e)",
    surface:
      "color-mix(in srgb, var(--semantic-success, #22c55e) 6%, var(--bg-card, var(--theme-card-bg)))",
    border:
      "color-mix(in srgb, var(--semantic-success, #22c55e) 18%, var(--border-subtle, var(--theme-border)))",
  },
];

// ── Card component ────────────────────────────────────────────────────────────

function FocusCardItem({ card }: { card: FocusCard }) {
  return (
    <div
      className="flex flex-col gap-4 overflow-hidden rounded-2xl p-5"
      style={{ background: card.surface, border: `1px solid ${card.border}` }}
    >
      {/* Step label */}
      <div className="flex items-center gap-3">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-black"
          style={{
            background: `color-mix(in srgb, ${card.accent} 16%, var(--bg-card))`,
            color: card.accent,
            border: `1px solid color-mix(in srgb, ${card.accent} 28%, var(--border-subtle))`,
          }}
          aria-hidden="true"
        >
          {card.step}
        </span>
        <p
          className="text-sm font-bold leading-snug"
          style={{ color: "var(--theme-heading-text, var(--foreground))" }}
        >
          {card.title}
        </p>
      </div>

      {/* Body */}
      <p
        className="flex-1 text-xs leading-relaxed"
        style={{ color: "var(--semantic-text-secondary, var(--muted-foreground))" }}
      >
        {card.body}
      </p>

      {/* CTA */}
      <Link
        href={card.href}
        className="inline-flex min-h-[2rem] items-center justify-center self-start rounded-full px-4 py-1.5 text-xs font-semibold transition-all hover:opacity-85 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2"
        style={{
          background: card.accent,
          color: "#fff",
        }}
      >
        {card.cta}
      </Link>
    </div>
  );
}

// ── Recommendation builder ────────────────────────────────────────────────────

function buildFocusCards(args: {
  band: ReadinessBand;
  catSessionCount: number;
  studyStreakDays: number;
  weakTopics: WeakTopicRow[];
  holdingBack: string[];
  nextActions: string[];
  benchmark: BenchmarkData | null;
}): FocusCard[] {
  const { band, catSessionCount, studyStreakDays, weakTopics, holdingBack } = args;
  const cards: Omit<FocusCard, "step" | "accent" | "surface" | "border">[] = [];

  const topWeak = weakTopics.find((w) => w.attempted >= 2);
  const highStreak = weakTopics.find((w) => (w.wrongStreak ?? 0) >= 3);

  // 1. No CAT yet — establish baseline
  if (catSessionCount === 0) {
    cards.push({
      title: "Measure Your Baseline",
      body: "Take a CAT session to get your first readiness score. This unlocks personalized recommendations and tracks your progress over time.",
      cta: "Take a CAT →",
      href: "/app/practice-tests",
    });
  }

  // 2. High miss streak — targeted drilling (most actionable)
  if (highStreak) {
    const drill = remediationTopicDrillHref(highStreak.topic);
    cards.push({
      title: `Break the Streak: ${highStreak.topic}`,
      body: `You have ${highStreak.wrongStreak} misses in a row on ${highStreak.topic}. This is your most urgent gap — slow down, read rationales carefully, then drill.`,
      cta: "Drill this topic →",
      href: drill,
    });
  }

  // 3. Top weak topic — remediation
  if (topWeak && topWeak !== highStreak) {
    const lesson = remediationLessonsTopicHref(topWeak.topic, topWeak.normalizedTopic ?? null);
    cards.push({
      title: `Study: ${topWeak.topic}`,
      body: `${topWeak.missRate}% miss rate on ${topWeak.topic} with ${topWeak.attempted} attempts. A focused lesson review before drilling tends to be more efficient than questions alone.`,
      cta: "Start lesson →",
      href: lesson,
    });
  }

  // 4. Band-specific push
  if (band === "not_ready" || band === "insufficient_data") {
    cards.push({
      title: "Build Daily Practice",
      body: "Consistent daily sets — even 10–20 questions — build the accuracy foundation faster than weekly marathon sessions. Enable a streak to track it.",
      cta: "Practice questions →",
      href: "/app/questions",
    });
  } else if (band === "improving") {
    cards.push({
      title: "Increase Question Volume",
      body: "You have the foundation. Now increase the volume — aim for mixed-topic sessions to expose gaps you haven't encountered yet.",
      cta: "Start mixed session →",
      href: "/app/questions?preset=mixed",
    });
  } else if (band === "near_ready") {
    cards.push({
      title: "Take a Full Practice Exam",
      body: "Your score is approaching exam-ready. A timed full exam builds pacing stamina and surfaces the last hidden weak points.",
      cta: "Start a mock exam →",
      href: "/app/practice-tests",
    });
  } else if (band === "ready") {
    cards.push({
      title: "Maintain with Spaced Review",
      body: "You are exam-ready. Shift to spaced repetition to maintain recall without burning out. Review your queue daily to stay sharp.",
      cta: "Open review queue →",
      href: "/app/review",
    });
  }

  // 5. No streak — consistency nudge
  if (studyStreakDays === 0) {
    cards.push({
      title: "Start a Study Streak",
      body: "Even one correct question counts. Start today's session to build the habit. Consistent daily contact beats occasional intensity.",
      cta: "Practice now →",
      href: "/app/questions",
    });
  }

  // 6. Holding-back topics
  if (holdingBack.length > 0 && !topWeak && !highStreak) {
    const topic = holdingBack[0]!;
    cards.push({
      title: `Focus Area: ${topic}`,
      body: `${topic} is one of the factors most limiting your readiness score. Targeted drilling on this topic has the highest expected score impact.`,
      cta: "Drill it →",
      href: remediationTopicDrillHref(topic),
    });
  }

  // 7. Always-on: re-test with CAT (if at least one taken)
  if (catSessionCount > 0 && cards.length < 6) {
    cards.push({
      title: "Take Another CAT",
      body: "Re-run a CAT to check if your readiness score has improved. A new data point updates all trend indicators and adjusts recommendations.",
      cta: "Start a CAT →",
      href: "/app/practice-tests",
    });
  }

  // Assign step numbers and alternating surfaces
  return cards.slice(0, 6).map((c, i) => ({
    ...c,
    step: i + 1,
    ...SURFACES[i % SURFACES.length]!,
  }));
}

// ── ReadinessFocusPlan ────────────────────────────────────────────────────────

export interface ReadinessFocusPlanProps {
  band: ReadinessBand;
  catSessionCount: number;
  studyStreakDays: number;
  weakTopics: WeakTopicRow[];
  holdingBack: string[];
  nextActions: string[];
  benchmark: BenchmarkData | null;
}

export function ReadinessFocusPlan({
  band,
  catSessionCount,
  studyStreakDays,
  weakTopics,
  holdingBack,
  nextActions,
  benchmark,
}: ReadinessFocusPlanProps) {
  const cards = buildFocusCards({
    band,
    catSessionCount,
    studyStreakDays,
    weakTopics,
    holdingBack,
    nextActions,
    benchmark,
  });

  if (cards.length === 0) return null;

  return (
    <section aria-labelledby="focus-plan-heading">
      <h2
        id="focus-plan-heading"
        className="mb-3 text-base font-bold"
        style={{ color: "var(--theme-heading-text, var(--foreground))" }}
      >
        Recommended Focus Areas
      </h2>
      <p
        className="mb-4 text-sm"
        style={{ color: "var(--semantic-text-secondary, var(--muted-foreground))" }}
      >
        Personalized actions based on your performance signals — work through them in order for maximum impact.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <FocusCardItem key={card.step} card={card} />
        ))}
      </div>
    </section>
  );
}
