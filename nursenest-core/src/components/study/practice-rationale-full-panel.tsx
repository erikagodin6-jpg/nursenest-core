"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { ReactNode } from "react";
import { ConfidenceChip, type ConfidenceLevel } from "./confidence-selector";

function RationaleFullFrame({ children }: { children: ReactNode }) {
  return (
    <div className="nn-practice-rationale-full">
      <div className="nn-practice-rationale-full__scroll">{children}</div>
    </div>
  );
}

// ── PracticeRationaleSection ───────────────────────────────────────────────

type SectionVariant = "success" | "info" | "error" | "muted" | "takeaway";

/**
 * PracticeRationaleSection — styled content block within the rationale panel.
 *
 * Variants map to CSS class `.nn-practice-rsection--{variant}`.
 */
export function PracticeRationaleSection({
  variant,
  label,
  children,
}: {
  variant: SectionVariant;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={`nn-practice-rsection nn-practice-rsection--${variant}`}>
      <p className="nn-practice-rsection__label">{label}</p>
      <div className="nn-practice-rsection__body">{children}</div>
    </div>
  );
}

// ── PracticeIncorrectOptionRow ─────────────────────────────────────────────

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

/**
 * PracticeIncorrectOptionRow — shows one incorrect option with its individual
 * distractor explanation (spec §5: "each incorrect option must be shown separately").
 */
export function PracticeIncorrectOptionRow({
  index,
  optionText,
  explanation,
}: {
  index: number;
  optionText: string;
  explanation?: string | null;
}) {
  const letter = LETTERS[index] ?? String(index + 1);
  return (
    <div className="nn-practice-incorrect-opt-row">
      <span className="nn-practice-incorrect-opt-row__letter" aria-hidden="true">
        {letter}
      </span>
      <div className="nn-practice-incorrect-opt-row__content">
        <p className="nn-practice-incorrect-opt-row__text">{optionText}</p>
        {explanation ? (
          <p className="nn-practice-incorrect-opt-row__explanation">{explanation}</p>
        ) : null}
      </div>
    </div>
  );
}

// ── PracticeRelatedLessons ─────────────────────────────────────────────────

/**
 * PracticeRelatedLessons — list of 2–4 lesson links (spec §5 / §7).
 * Uses real hrefs resolved by `resolveRationaleLessonLinksForQuestion`.
 */
export function PracticeRelatedLessons({
  lessons,
}: {
  lessons: { title: string; href: string }[];
}) {
  if (lessons.length === 0) return null;
  return (
    <div>
      <p className="nn-practice-rsection__label mb-2">Related Lessons</p>
      <div className="nn-practice-lessons">
        {lessons.map(({ title, href }) => (
          <Link
            key={href}
            href={href}
            className="nn-practice-lesson-link"
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          >
            <BookOpen
              className="nn-practice-lesson-link__icon mt-0.5 h-4 w-4"
              aria-hidden
            />
            <span className="nn-practice-lesson-link__title">{title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── PracticeRationaleFullPanel ─────────────────────────────────────────────

export type PracticeRationaleFullPanelStatus =
  | "waiting"
  | "correct"
  | "incorrect"
  | "exam_locked"
  | null;

export interface PracticeRationaleFullPanelProps {
  status: PracticeRationaleFullPanelStatus;
  /** Canonical keys of the correct answer(s). */
  correctKeys?: string[];
  /** Display text for every option, indexed by canonical key. */
  optionDisplayMap?: Record<string, string>;
  /** All canonical option keys in display order. */
  allOptionKeys?: string[];
  /** Why the correct answer is right. Preferred over `rationale`. */
  correctAnswerExplanation?: string | null;
  /** Main rationale — fallback when `correctAnswerExplanation` is absent. */
  rationale?: string | null;
  /**
   * Per-option distractor explanations: `{ [canonicalKey]: explanation }`.
   * When absent, incorrect option rows show the option text only.
   */
  distractorRationalesMap?: Record<string, string> | null;
  /** Short key takeaway (1–2 sentences). */
  keyTakeaway?: string | null;
  /** Resolved lesson links (0–4). */
  relatedLessons?: { title: string; href: string }[];
  /** Confidence rating selected for this question — shown as a chip (spec §10). */
  confidenceLevel?: ConfidenceLevel | null;
}

/**
 * PracticeRationaleFullPanel — right-column rationale panel for linear practice mode.
 *
 * After submitting an answer shows ALL explanations simultaneously (spec §5):
 *   1. Correct Answer
 *   2. Why This Is Correct
 *   3. Why The Other Options Are Incorrect (each option individually)
 *   4. Key Takeaway
 *   5. Related Lessons
 *
 * Before submission: shows a placeholder (spec §12).
 * In exam-locked mode (linear exam): shows a locked message.
 */
export function PracticeRationaleFullPanel({
  status,
  correctKeys = [],
  optionDisplayMap = {},
  allOptionKeys = [],
  correctAnswerExplanation,
  rationale,
  distractorRationalesMap,
  keyTakeaway,
  relatedLessons = [],
  confidenceLevel,
}: PracticeRationaleFullPanelProps) {
  // ── Waiting / not-yet-submitted ──────────────────────────────────────────
  if (status === "waiting" || status === null) {
    return (
      <RationaleFullFrame>
        <div className="nn-practice-rationale-waiting">
          <BookOpen
            className="h-6 w-6 text-[var(--semantic-text-muted)]"
            aria-hidden
          />
          <p className="nn-practice-rationale-waiting__text">
            Select an answer and submit to reveal the explanation.
          </p>
          <p className="nn-practice-rationale-waiting__sub">
            The correct answer, why each option is right or wrong, and related
            lessons will appear here.
          </p>
        </div>
      </RationaleFullFrame>
    );
  }

  // ── Exam locked ──────────────────────────────────────────────────────────
  if (status === "exam_locked") {
    return (
      <RationaleFullFrame>
        <div className="nn-practice-rationale-locked">
          <p className="nn-practice-rationale-locked__title">Answer Locked</p>
          <p className="nn-practice-rationale-locked__body">
            Your answer is submitted. Explanations and correct keys are revealed
            when you finish the full exam.
          </p>
        </div>
      </RationaleFullFrame>
    );
  }

  // ── Feedback (correct or incorrect) ─────────────────────────────────────
  const correctSet = new Set(correctKeys);
  const incorrectKeys = allOptionKeys.filter((k) => !correctSet.has(k));

  // "Why This Is Correct" — prefer dedicated field, fall back to rationale
  const whyCorrectText = correctAnswerExplanation ?? rationale;

  // Correct option display text
  const correctDisplayTexts = correctKeys
    .map((k) => optionDisplayMap[k] ?? k)
    .join(", ");

  return (
    <RationaleFullFrame>
      {/* Confidence chip — shown when user rated their confidence */}
      {confidenceLevel ? (
        <div className="flex items-center gap-2">
          <ConfidenceChip level={confidenceLevel} />
        </div>
      ) : null}

      {/* 1 ─ Correct Answer ──────────────────────────────────────────────── */}
      <PracticeRationaleSection
        variant={status === "correct" ? "success" : "info"}
        label="Correct Answer"
      >
        <p>{correctDisplayTexts || "—"}</p>
      </PracticeRationaleSection>

      {/* 2 ─ Why This Is Correct ──────────────────────────────────────────── */}
      {whyCorrectText ? (
        <PracticeRationaleSection variant="info" label="Why This Is Correct">
          <p>{whyCorrectText}</p>
        </PracticeRationaleSection>
      ) : null}

      {/* 3 ─ Why The Other Options Are Incorrect ─────────────────────────── */}
      {incorrectKeys.length > 0 ? (
        <PracticeRationaleSection
          variant="muted"
          label="Why The Other Options Are Incorrect"
        >
          {incorrectKeys.map((key, i) => {
            const displayIdx = allOptionKeys.indexOf(key);
            const optionText = optionDisplayMap[key] ?? key;
            const explanation = distractorRationalesMap?.[key] ?? null;
            return (
              <PracticeIncorrectOptionRow
                key={key}
                index={displayIdx >= 0 ? displayIdx : i}
                optionText={optionText}
                explanation={explanation}
              />
            );
          })}
        </PracticeRationaleSection>
      ) : null}

      {/* 4 ─ Key Takeaway ────────────────────────────────────────────────── */}
      {keyTakeaway ? (
        <PracticeRationaleSection variant="takeaway" label="Key Takeaway">
          <p>{keyTakeaway}</p>
        </PracticeRationaleSection>
      ) : null}

      {/* 5 ─ Related Lessons ─────────────────────────────────────────────── */}
      {relatedLessons.length > 0 ? (
        <PracticeRelatedLessons lessons={relatedLessons} />
      ) : null}
    </RationaleFullFrame>
  );
}
