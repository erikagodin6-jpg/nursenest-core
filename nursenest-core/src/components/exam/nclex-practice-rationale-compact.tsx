"use client";

import Link from "next/link";
import { BookOpen, CheckCircle2, XCircle } from "lucide-react";

export type NclexPracticeRationaleCompactProps = {
  status: "waiting" | "correct" | "incorrect" | null;
  correctKeys?: string[];
  optionDisplayMap?: Record<string, string>;
  correctAnswerExplanation?: string | null;
  rationale?: string | null;
  /** First distractor explanation for compact incorrect row (optional). */
  primaryDistractorText?: string | null;
  relatedLessons?: { title: string; href: string }[];
  keyTakeaway?: string | null;
};

/**
 * Viewport-fit rationale for NCLEX practice shell — no page scroll, no band scroll.
 * Full review remains on results / legacy tutor split surfaces.
 */
export function NclexPracticeRationaleCompact({
  status,
  correctKeys = [],
  optionDisplayMap = {},
  correctAnswerExplanation,
  rationale,
  primaryDistractorText,
  relatedLessons = [],
  keyTakeaway,
}: NclexPracticeRationaleCompactProps) {
  if (status === "waiting" || status === null) {
    return (
      <div className="nn-nclex-rationale-compact nn-nclex-rationale-compact--waiting">
        <BookOpen className="nn-nclex-rationale-compact__wait-icon" aria-hidden />
        <p className="nn-nclex-rationale-compact__wait-text">
          Submit your answer to see rationale and lesson links.
        </p>
      </div>
    );
  }

  const isCorrect = status === "correct";
  const correctLabel = correctKeys.map((k) => optionDisplayMap[k] ?? k).join(", ") || "—";
  const whyText = (correctAnswerExplanation ?? rationale ?? "").trim();
  const lesson = relatedLessons[0];

  return (
    <div
      className={`nn-nclex-rationale-compact nn-nclex-rationale-compact--${isCorrect ? "correct" : "incorrect"}`}
      data-nn-qa-practice-rationale-compact=""
    >
      <div className="nn-nclex-rationale-compact__head">
        {isCorrect ? (
          <CheckCircle2 className="nn-nclex-rationale-compact__status-icon" aria-hidden />
        ) : (
          <XCircle className="nn-nclex-rationale-compact__status-icon" aria-hidden />
        )}
        <div className="nn-nclex-rationale-compact__head-text">
          <p className="nn-nclex-rationale-compact__status-label">
            {isCorrect ? "Correct" : "Incorrect"}
          </p>
          <p className="nn-nclex-rationale-compact__answer-line">
            <span className="nn-nclex-rationale-compact__answer-kicker">Answer · </span>
            {correctLabel}
          </p>
        </div>
        {lesson ? (
          <Link href={lesson.href} className="nn-nclex-rationale-compact__lesson-link">
            ↗ {lesson.title}
          </Link>
        ) : null}
      </div>

      {whyText ? (
        <p className="nn-nclex-rationale-compact__why">{whyText}</p>
      ) : null}

      {!isCorrect && primaryDistractorText ? (
        <p className="nn-nclex-rationale-compact__distractor">
          <span className="nn-nclex-rationale-compact__distractor-kicker">Why not yours · </span>
          {primaryDistractorText}
        </p>
      ) : null}

      {keyTakeaway ? (
        <p className="nn-nclex-rationale-compact__takeaway">
          <span className="nn-nclex-rationale-compact__takeaway-kicker">Takeaway · </span>
          {keyTakeaway}
        </p>
      ) : null}
    </div>
  );
}
