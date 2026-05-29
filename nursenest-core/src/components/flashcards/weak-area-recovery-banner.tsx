"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { WeakAreaPlan } from "@/lib/flashcards/flashcard-ecosystem-resolver";

/* ── Session performance tracker ────────────────────────────────── */

/**
 * Pure data structure — call `updateTopicPerformance` each time a card is rated.
 * When a topic has ≥5 attempts and <60% correct, it becomes "weak."
 */
export type TopicPerformanceMap = Map<string, { correct: number; total: number }>;

export function updateTopicPerformance(
  map: TopicPerformanceMap,
  topic: string | null | undefined,
  isCorrect: boolean,
): TopicPerformanceMap {
  if (!topic?.trim()) return map;
  const next = new Map(map);
  const existing = next.get(topic) ?? { correct: 0, total: 0 };
  next.set(topic, {
    correct: existing.correct + (isCorrect ? 1 : 0),
    total: existing.total + 1,
  });
  return next;
}

export function detectWeakTopics(
  map: TopicPerformanceMap,
  minAttempts = 4,
  threshold = 0.6,
): Array<{ topic: string; correct: number; total: number }> {
  const weak: Array<{ topic: string; correct: number; total: number }> = [];
  for (const [topic, perf] of map) {
    if (perf.total >= minAttempts && perf.correct / perf.total < threshold) {
      weak.push({ topic, ...perf });
    }
  }
  return weak.sort((a, b) => (a.correct / a.total) - (b.correct / b.total));
}

/* ── Component ──────────────────────────────────────────────────── */

export function WeakAreaRecoveryBanner({
  weakTopics,
  plans,
  onDismiss,
}: {
  /** Output of detectWeakTopics() */
  weakTopics: Array<{ topic: string; correct: number; total: number }>;
  /** Remediation plans keyed by topic */
  plans: Map<string, WeakAreaPlan>;
  onDismiss?: () => void;
}) {
  if (weakTopics.length === 0) return null;

  const top = weakTopics[0];
  if (!top) return null;
  const plan = plans.get(top.topic);
  const missed = top.total - top.correct;
  const pct = Math.round((top.correct / top.total) * 100);

  return (
    <div className="nn-weak-area-banner" role="alert" aria-live="polite">
      <div className="nn-weak-area-banner__icon">
        <AlertTriangle className="h-4 w-4" aria-hidden />
      </div>
      <div className="nn-weak-area-banner__body">
        <strong className="nn-weak-area-banner__topic">{top.topic}</strong>
        <p className="nn-weak-area-banner__message">
          You have missed {missed} of your last {top.total} {top.topic.toLowerCase()} cards ({pct}% correct).
          Focused practice is recommended.
        </p>
        {plan && plan.links.length > 0 ? (
          <div className="nn-weak-area-banner__links">
            {plan.links.slice(0, 3).map((link) => (
              <Link
                key={`${link.type}-${link.href}`}
                href={link.href}
                className="nn-weak-area-banner__link"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          className="nn-weak-area-banner__dismiss"
          aria-label="Dismiss weak area notice"
          onClick={onDismiss}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
