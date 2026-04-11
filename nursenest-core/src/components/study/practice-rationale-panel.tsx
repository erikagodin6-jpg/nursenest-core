"use client";

import type { ReactNode } from "react";
import { BookOpen, CheckCircle, XCircle, Lightbulb, Info, AlertCircle } from "lucide-react";

/**
 * Practice session rationale panel — right column of the 2-col session layout.
 *
 * Renders multi-surface rationale sections for linear practice mode:
 *   - correct verdict   → success surface (nn-practice-rationale-section--success)
 *   - explanation       → info surface (nn-practice-rationale-section--info)
 *   - correct answer    → success surface (when answer was wrong)
 *   - clinical pearl    → brand surface (nn-practice-rationale-section--brand)
 *   - exam mode locked  → muted surface
 *   - placeholder       → dashed neutral surface
 *
 * Colors derive 100% from semantic/theme tokens — no hardcoded hex values.
 */

export type RationalePanelStatus =
  | "correct"
  | "incorrect"
  | "exam_locked"
  | "waiting"
  | null;

interface PracticeRationalePanelProps {
  status: RationalePanelStatus;
  rationale?: string | null;
  /** Keys of the correct option(s) — used to show correct answer when wrong */
  correctKeys?: string[];
  /** Map of canonical key → display text for each answer option */
  optionDisplayMap?: Record<string, string>;
  /** Mode label shown above the panel title */
  modeLabel?: string;
  /** Custom content (e.g. CatStudyFeedbackPanel) replaces default sections */
  children?: ReactNode;
}

function SectionLabel({
  variant,
  label,
}: {
  variant: "success" | "info" | "warning" | "brand" | "muted";
  label: string;
}) {
  const iconClass = "w-3.5 h-3.5 shrink-0";
  const icon =
    variant === "success" ? (
      <CheckCircle className={iconClass} aria-hidden />
    ) : variant === "info" ? (
      <Info className={iconClass} aria-hidden />
    ) : variant === "warning" ? (
      <AlertCircle className={iconClass} aria-hidden />
    ) : variant === "brand" ? (
      <Lightbulb className={iconClass} aria-hidden />
    ) : (
      <BookOpen className={iconClass} aria-hidden />
    );

  return (
    <p className="nn-practice-rationale-section__label">
      {icon}
      {label}
    </p>
  );
}

function RationaleSection({
  variant,
  label,
  children,
}: {
  variant: "success" | "info" | "warning" | "brand" | "muted";
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={`nn-practice-rationale-section nn-practice-rationale-section--${variant}`}>
      <SectionLabel variant={variant} label={label} />
      <div className="nn-practice-rationale-section__body">{children}</div>
    </div>
  );
}

function VerdictBanner({
  status,
  correctText,
}: {
  status: "correct" | "incorrect";
  correctText?: string | null;
}) {
  if (status === "correct") {
    return (
      <div className="nn-practice-verdict-banner nn-practice-verdict-banner--correct" role="status">
        <CheckCircle
          className="mt-0.5 h-5 w-5 shrink-0 text-[var(--semantic-success)]"
          aria-hidden
        />
        <div>
          <p className="text-sm font-bold text-[var(--semantic-success-contrast)]">
            Correct answer
          </p>
          <p className="mt-0.5 text-xs text-[var(--semantic-success-contrast)] opacity-75">
            See the explanation below for a deeper understanding.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="nn-practice-verdict-banner nn-practice-verdict-banner--incorrect" role="status">
      <XCircle
        className="mt-0.5 h-5 w-5 shrink-0 text-[var(--semantic-danger)]"
        aria-hidden
      />
      <div>
        <p className="text-sm font-bold text-[var(--semantic-danger-contrast)]">
          Incorrect answer
        </p>
        {correctText ? (
          <p className="mt-0.5 text-xs text-[var(--semantic-danger-contrast)] opacity-80">
            Correct:{" "}
            <span className="font-semibold">{correctText}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** Placeholder shown before the learner submits an answer. */
function WaitingPlaceholder({ modeLabel }: { modeLabel?: string }) {
  return (
    <>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
          {modeLabel ?? "Practice"}
        </p>
        <h3 className="mt-0.5 text-base font-bold text-[var(--semantic-text-primary)]">
          Explanation
        </h3>
      </div>
      <div className="nn-practice-rationale-placeholder">
        <BookOpen
          className="mx-auto mb-3 h-6 w-6 text-[var(--semantic-text-muted)]"
          aria-hidden
        />
        <p className="text-sm font-medium text-[var(--semantic-text-secondary)]">
          Select an answer and submit to reveal the explanation.
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-[var(--semantic-text-muted)]">
          Rationale, correct answer, and key clinical takeaways will appear here.
        </p>
      </div>
    </>
  );
}

export function PracticeRationalePanel({
  status,
  rationale,
  correctKeys,
  optionDisplayMap,
  modeLabel,
  children,
}: PracticeRationalePanelProps) {
  if (children) {
    return (
      <div className="nn-practice-rationale-panel">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
            {modeLabel ?? "Session"}
          </p>
          <h3 className="mt-0.5 text-base font-bold text-[var(--semantic-text-primary)]">
            Explanation
          </h3>
        </div>
        {children}
      </div>
    );
  }

  if (status === "waiting" || status === null) {
    return (
      <div className="nn-practice-rationale-panel">
        <WaitingPlaceholder modeLabel={modeLabel} />
      </div>
    );
  }

  if (status === "exam_locked") {
    return (
      <div className="nn-practice-rationale-panel">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
            {modeLabel ?? "Exam"}
          </p>
          <h3 className="mt-0.5 text-base font-bold text-[var(--semantic-text-primary)]">
            Answer Locked
          </h3>
        </div>
        <RationaleSection variant="muted" label="Submitted">
          <p className="text-sm leading-relaxed">
            Your answer is locked in. Rationale and correct keys are revealed after you finish the
            full test.
          </p>
        </RationaleSection>
      </div>
    );
  }

  const correctText =
    correctKeys && correctKeys.length > 0 && optionDisplayMap
      ? correctKeys.map((k) => optionDisplayMap[k] ?? k).join(", ")
      : null;

  return (
    <div className="nn-practice-rationale-panel">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
          {modeLabel ?? "Practice"}
        </p>
        <h3 className="mt-0.5 text-base font-bold text-[var(--semantic-text-primary)]">
          Explanation
        </h3>
      </div>

      <VerdictBanner status={status} correctText={correctText} />

      {status === "incorrect" && correctText ? (
        <RationaleSection variant="success" label="Correct Answer">
          <p className="text-sm leading-relaxed">{correctText}</p>
        </RationaleSection>
      ) : null}

      {rationale ? (
        <RationaleSection
          variant={status === "correct" ? "info" : "warning"}
          label={status === "correct" ? "Why This Is Correct" : "Explanation"}
        >
          <p className="leading-relaxed">{rationale}</p>
        </RationaleSection>
      ) : (
        <RationaleSection variant="muted" label="Rationale">
          <p className="text-sm text-[var(--semantic-text-muted)]">
            No detailed rationale is on file for this item.
          </p>
        </RationaleSection>
      )}

      <RationaleSection variant="brand" label="Study Tip">
        <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          Review related questions in this topic to reinforce your understanding. Practice questions
          in context help build clinical reasoning.
        </p>
      </RationaleSection>
    </div>
  );
}
