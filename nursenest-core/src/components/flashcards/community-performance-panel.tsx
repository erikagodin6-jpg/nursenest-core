"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

/* ── Types ──────────────────────────────────────────────────────── */

type Difficulty = "easy" | "medium" | "hard" | "very-hard";

type AnswerDistEntry = {
  letter: string;
  selectRate: number;
  isCorrect: boolean;
};

type CommunityStatsPayload = {
  sampleTooSmall: boolean;
  totalSessions: number;
  communityCorrectRate?: number;
  difficulty?: Difficulty;
  answerDistribution?: AnswerDistEntry[];
};

/* ── Difficulty badge ────────────────────────────────────────────── */

const DIFFICULTY_META: Record<Difficulty, { label: string; colorClass: string }> = {
  "easy":      { label: "Easy",      colorClass: "nn-community-difficulty--easy"      },
  "medium":    { label: "Medium",    colorClass: "nn-community-difficulty--medium"    },
  "hard":      { label: "Hard",      colorClass: "nn-community-difficulty--hard"      },
  "very-hard": { label: "Very Hard", colorClass: "nn-community-difficulty--very-hard" },
};

/* ── Hook: lazy-fetch stats after reveal ──────────────────────────  */

function useCommunityStats(flashcardId: string | null, enabled: boolean) {
  const [data, setData] = useState<CommunityStatsPayload | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !flashcardId) return;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/flashcards/community-stats/${encodeURIComponent(flashcardId)}`)
      .then((r) => r.ok ? r.json() as Promise<CommunityStatsPayload> : null)
      .then((json) => { if (!cancelled && json) setData(json); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [flashcardId, enabled]);

  return { data, loading };
}

/* ── Component ──────────────────────────────────────────────────── */

export function CommunityPerformancePanel({
  flashcardId,
  revealed,
  submittedLetter,
  correctLetter,
}: {
  flashcardId: string | null;
  revealed: boolean;
  /** Letter the learner chose (null for plain cards). */
  submittedLetter?: string | null;
  /** Correct letter for highlight. */
  correctLetter?: string;
}) {
  const { data, loading } = useCommunityStats(flashcardId, revealed);

  if (!revealed) return null;
  if (loading) {
    return (
      <div className="nn-community-panel nn-community-panel--loading" aria-label="Loading community stats">
        <div className="nn-community-panel__skeleton" />
      </div>
    );
  }
  if (!data || data.sampleTooSmall) return null;

  const pct = Math.round((data.communityCorrectRate ?? 0) * 100);
  const diff = data.difficulty ?? "medium";
  const diffMeta = DIFFICULTY_META[diff];

  return (
    <section className="nn-community-panel" aria-label="Community performance">
      <div className="nn-community-panel__header">
        <div className="nn-community-panel__title">
          <Users className="h-3.5 w-3.5" aria-hidden />
          <span>Community Performance</span>
        </div>
        <span className={`nn-community-difficulty ${diffMeta.colorClass}`}>
          {diffMeta.label}
        </span>
      </div>

      {/* Correct rate bar */}
      <div className="nn-community-correct-row">
        <div className="nn-community-correct-label">
          <span>Community correct</span>
          <strong>{pct}%</strong>
        </div>
        <div className="nn-community-bar-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="nn-community-bar-fill"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Answer distribution */}
      {data.answerDistribution && data.answerDistribution.length > 0 ? (
        <div className="nn-community-dist">
          <div className="nn-community-dist__label">Answer distribution</div>
          <div className="nn-community-dist__bars">
            {data.answerDistribution.map((entry) => {
              const barPct = Math.round(entry.selectRate * 100);
              const isLearnerPick = submittedLetter === entry.letter;
              const isCorrectOpt = entry.isCorrect;
              return (
                <div
                  key={entry.letter}
                  className={[
                    "nn-community-dist__row",
                    isCorrectOpt ? "nn-community-dist__row--correct" : "",
                    isLearnerPick && !isCorrectOpt ? "nn-community-dist__row--learner-wrong" : "",
                  ].filter(Boolean).join(" ")}
                >
                  <span className="nn-community-dist__letter">{entry.letter}</span>
                  <div className="nn-community-dist__track">
                    <div
                      className="nn-community-dist__bar"
                      style={{ width: `${Math.max(barPct, 2)}%` }}
                    />
                  </div>
                  <span className="nn-community-dist__pct">{barPct}%</span>
                  {isCorrectOpt ? (
                    <span className="nn-community-dist__correct-badge" aria-label="correct answer">✓</span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="nn-community-panel__footer">
        Based on {data.totalSessions.toLocaleString()} responses
      </div>
    </section>
  );
}
