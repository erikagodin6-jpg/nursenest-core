"use client";

import type { ReactNode } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import type { CatStudyFeedbackPayload } from "@/lib/practice-tests/types";

export type RationalePanelMode =
  | "waiting"   // before the user submits their answer
  | "locked"    // CAT test mode — rationale hidden until session ends
  | "feedback"; // CAT study mode — rationale available

/**
 * RationaleSection — a single section inside the rationale panel.
 * Separated from adjacent sections by a divider + 20px vertical spacing.
 * Key Takeaway variant uses surface-soft-a tint.
 */
export function RationaleSection({
  label,
  variant = "default",
  children,
}: {
  label: string;
  variant?: "default" | "takeaway";
  children: ReactNode;
}) {
  return (
    <div className={`nn-cat-rationale-section ${variant === "takeaway" ? "nn-cat-rationale-section--takeaway" : ""}`}>
      <p className="nn-cat-rationale-section__label">{label}</p>
      <div className="nn-cat-rationale-section__body">{children}</div>
    </div>
  );
}

function WaitingPlaceholder({ mode }: { mode: "waiting" | "locked" }) {
  const { t } = useMarketingI18n();
  if (mode === "locked") {
    return (
      <div className="nn-cat-rationale-placeholder">
        <span className="nn-cat-rationale-placeholder__icon" aria-hidden="true">🔒</span>
        <p className="nn-cat-rationale-placeholder__title">
          {t("learner.session.split.catRationaleLockedTitle")}
        </p>
        <p className="nn-cat-rationale-placeholder__body">
          {t("learner.session.split.rationaleLocked")}
        </p>
      </div>
    );
  }
  return (
    <div className="nn-cat-rationale-placeholder">
      <span className="nn-cat-rationale-placeholder__icon" aria-hidden="true">○</span>
      <p className="nn-cat-rationale-placeholder__title">
        {t("learner.session.split.catRationaleWaitingTitle")}
      </p>
      <p className="nn-cat-rationale-placeholder__body">{t("learner.qbank.split.rationalePlaceholder")}</p>
    </div>
  );
}

const LETTERS = ["A", "B", "C", "D", "E", "F"];

/**
 * RationalePanel — right column card in the CAT session.
 * Spec: padding 24px, same border-radius as question card, surface-elevated bg, subtle border.
 *
 * Sections:
 *  1. Correct Answer — bold label, correct option letter + text
 *  2. Explanation — paragraph, no colored block, spacing only
 *  3. Incorrect Options — each wrong option listed, separated by dividers
 *  4. Key Takeaway — slight surface-soft-a variation
 */
export function RationalePanel({
  mode,
  feedback,
  optionKeys,
  optionTexts,
}: {
  mode: RationalePanelMode;
  /** Available in "feedback" mode only — the scored item's study payload */
  feedback?: CatStudyFeedbackPayload | null;
  /** Canonical option keys in order (e.g. ["a","b","c","d"]) */
  optionKeys?: string[];
  /** Display texts in same order as optionKeys */
  optionTexts?: string[];
}) {
  return (
    <div className="nn-cat-rationale-card">
      {mode !== "feedback" || !feedback ? (
        <WaitingPlaceholder mode={mode === "locked" ? "locked" : "waiting"} />
      ) : (
        <FeedbackContent
          feedback={feedback}
          optionKeys={optionKeys ?? []}
          optionTexts={optionTexts ?? []}
        />
      )}
    </div>
  );
}

function FeedbackContent({
  feedback,
  optionKeys,
  optionTexts,
}: {
  feedback: CatStudyFeedbackPayload;
  optionKeys: string[];
  optionTexts: string[];
}) {
  const correctSet = new Set(feedback.correctKeys);

  // Build display for correct options: "A. <text>"
  const correctDisplayLines = feedback.correctKeys.map((k) => {
    const idx = optionKeys.indexOf(k);
    const letter = idx >= 0 ? (LETTERS[idx] ?? k.toUpperCase()) : k.toUpperCase();
    const text = idx >= 0 ? (optionTexts[idx] ?? k) : k;
    return { letter, text };
  });

  // Incorrect option display
  const incorrectOptions = optionKeys
    .map((k, i) => ({
      key: k,
      letter: LETTERS[i] ?? k.toUpperCase(),
      text: optionTexts[i] ?? k,
    }))
    .filter((o) => !correctSet.has(o.key));

  const level1 = feedback.layers?.level1Short?.trim() ?? "";
  const level2 = feedback.layers?.level2Sections ?? feedback.sections ?? [];
  const strategy = feedback.layers?.level3Strategy?.trim() ?? "";

  return (
    <>
      {/* 1. Correct Answer */}
      <RationaleSection label="Correct Answer">
        {correctDisplayLines.length > 0 ? (
          <ul className="space-y-1">
            {correctDisplayLines.map(({ letter, text }) => (
              <li key={letter} className="flex items-start gap-2 text-[0.9375rem]">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--role-success)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--role-success)_12%,var(--bg-card))] text-[0.625rem] font-bold leading-none text-[var(--role-success-text)]">
                  {letter}
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--semantic-text-muted)]">
            Correct answer data is not on file.
          </p>
        )}
      </RationaleSection>

      {/* 2. Explanation */}
      <RationaleSection label="Explanation">
        {level1 ? (
          <p className="mb-3 leading-relaxed">{level1}</p>
        ) : null}
        {level2.length > 0 ? (
          <div className="space-y-3">
            {level2.map((s, i) => (
              <div key={`${s.heading}-${i}`}>
                {s.heading?.trim() ? (
                  <p className="mb-1 text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-[var(--semantic-text-muted)]">
                    {s.heading}
                  </p>
                ) : null}
                {s.body?.trim() ? (
                  <p className="leading-relaxed">{s.body}</p>
                ) : null}
              </div>
            ))}
          </div>
        ) : !level1 ? (
          <p className="text-sm text-[var(--semantic-text-muted)]">
            No detailed rationale is on file for this item.
          </p>
        ) : null}
      </RationaleSection>

      {/* 3. Incorrect Options */}
      {incorrectOptions.length > 0 ? (
        <RationaleSection label="Incorrect Options">
          <ul className="space-y-2">
            {incorrectOptions.map(({ letter, text }, i) => (
              <li
                key={letter}
                className={`flex items-start gap-2 text-[0.9375rem] ${
                  i < incorrectOptions.length - 1
                    ? "border-b border-[var(--semantic-border-soft)] pb-2"
                    : ""
                }`}
              >
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] text-[0.625rem] font-bold leading-none text-[var(--semantic-text-muted)]">
                  {letter}
                </span>
                <span className="text-[var(--semantic-text-secondary)]">{text}</span>
              </li>
            ))}
          </ul>
        </RationaleSection>
      ) : null}

      {/* 4. Key Takeaway — surface-soft-a variation */}
      {strategy ? (
        <RationaleSection label="Key Takeaway" variant="takeaway">
          <p className="leading-relaxed">{strategy}</p>
        </RationaleSection>
      ) : null}
    </>
  );
}
