"use client";

import type { ReactNode } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * QuestionCard — left card in the CAT session layout.
 * Contains topic metadata (optional), question stem, and answer options (via children).
 * Spec: padding 32px, border-radius large, surface-elevated background, subtle border.
 */
export function QuestionCard({
  stem,
  topic,
  subtopic,
  difficultyLabel,
  children,
  /**
   * When set with `examStackedLayout`, renders children in a scroll region and pins the footer
   * (e.g. submit / next) for viewport-height CAT exam shells.
   */
  footerSlot,
  examStackedLayout = false,
  /** When true with `examStackedLayout`, scroll body only — footer lives outside the card (fixed bar). */
  examDetachedFooter = false,
  /** CAT exam: single uppercase category line (replaces topic/subtopic/difficulty row). */
  examCategoryLabel?: string | null;
  /** CAT exam: e.g. flag control aligned top-right of the item header row. */
  examHeaderRightSlot?: ReactNode;
  /** Bumps footer remeasure when the item body changes (stem/options) without `footerSlot` identity changing. */
  examLayoutMeasureKey,
}: {
  stem: string;
  topic?: string | null;
  subtopic?: string | null;
  difficultyLabel?: string | null;
  /** Answer options list + nav bar — passed as children to keep layout separate from logic. */
  children: ReactNode;
  footerSlot?: ReactNode;
  examStackedLayout?: boolean;
  examDetachedFooter?: boolean;
  examCategoryLabel?: string | null;
  examHeaderRightSlot?: ReactNode;
  examLayoutMeasureKey?: string | null;
}) {
  const hasMeta = topic ?? subtopic ?? difficultyLabel;
  const examHead =
    examCategoryLabel != null && examCategoryLabel.trim().length > 0 ? (
      <div className="nn-cat-exam-item-head mb-3 flex items-start justify-between gap-3">
        <p className="nn-cat-exam-category-label m-0">{examCategoryLabel.trim().toUpperCase()}</p>
        {examHeaderRightSlot ? <div className="nn-cat-exam-item-head__actions shrink-0">{examHeaderRightSlot}</div> : null}
      </div>
    ) : null;

  const meta =
    examHead ??
    (hasMeta ? (
      <div className="nn-cat-topic-meta">
        {topic ? <span className="nn-cat-topic-meta__name">{topic}</span> : null}
        {subtopic ? <span>· {subtopic}</span> : null}
        {difficultyLabel ? <span>· {difficultyLabel}</span> : null}
      </div>
    ) : null);

  const stemBlock = (
    <p className="nn-cat-question-stem">
      {typeof stem === "string" && stem.trim().length > 0
        ? stem
        : "Question text is unavailable. Try reloading this item."}
    </p>
  );

  const footerRef = useRef<HTMLDivElement | null>(null);
  const measureOuterRafRef = useRef<number | null>(null);
  const measureInnerRafRef = useRef<number | null>(null);
  const [examScrollPadBottomPx, setExamScrollPadBottomPx] = useState(0);
  /** True once we have a real footer box height — keeps first-paint fallback from overriding a good measure. */
  const [examFooterMeasured, setExamFooterMeasured] = useState(false);

  const measureExamFooter = useCallback((isCancelled: () => boolean) => {
    const el = footerRef.current;
    if (!el || isCancelled()) return;
    /* Coalesce ResizeObserver + resize bursts; double rAF stabilizes after layout/font/orientation. */
    if (measureOuterRafRef.current != null) {
      cancelAnimationFrame(measureOuterRafRef.current);
    }
    if (measureInnerRafRef.current != null) {
      cancelAnimationFrame(measureInnerRafRef.current);
    }
    measureOuterRafRef.current = requestAnimationFrame(() => {
      measureOuterRafRef.current = null;
      if (isCancelled()) return;
      measureInnerRafRef.current = requestAnimationFrame(() => {
        measureInnerRafRef.current = null;
        if (isCancelled()) return;
        const el2 = footerRef.current;
        if (!el2) {
          setExamFooterMeasured(false);
          setExamScrollPadBottomPx(0);
          return;
        }
        const h = Math.ceil(el2.getBoundingClientRect().height);
        if (h <= 0) {
          setExamFooterMeasured(false);
          setExamScrollPadBottomPx(0);
          return;
        }
        setExamFooterMeasured(true);
        /** Keep a floor so short footers / late measure never clip last options on laptop viewports. */
        const padded = Math.max(h, 104);
        setExamScrollPadBottomPx((prev) => (prev === padded ? prev : padded));
      });
    });
  }, []);

  useLayoutEffect(() => {
    if (!examStackedLayout || !footerSlot || examDetachedFooter) return;
    let cancelled = false;
    const isCancelled = () => cancelled;
    const safeMeasure = () => measureExamFooter(isCancelled);
    safeMeasure();
    const el = footerRef.current;
    const ro =
      typeof ResizeObserver !== "undefined" && el
        ? new ResizeObserver(() => {
            safeMeasure();
          })
        : null;
    ro?.observe(el as Element);
    window.addEventListener("resize", safeMeasure);
    window.addEventListener("orientationchange", safeMeasure);
    if (typeof document !== "undefined" && document.fonts?.ready) {
      void document.fonts.ready
        .then(() => {
          if (!cancelled) safeMeasure();
        })
        .catch(() => {
          /* Optional API; RO + resize still measure */
        });
    }
    return () => {
      cancelled = true;
      if (measureOuterRafRef.current != null) {
        cancelAnimationFrame(measureOuterRafRef.current);
        measureOuterRafRef.current = null;
      }
      if (measureInnerRafRef.current != null) {
        cancelAnimationFrame(measureInnerRafRef.current);
        measureInnerRafRef.current = null;
      }
      ro?.disconnect();
      window.removeEventListener("resize", safeMeasure);
      window.removeEventListener("orientationchange", safeMeasure);
    };
    // footerSlot omitted: unstable ReactNode identity; ResizeObserver covers footer content/height changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examStackedLayout, examDetachedFooter, measureExamFooter, examLayoutMeasureKey, stem]);

  useLayoutEffect(() => {
    if ((examStackedLayout && footerSlot) || examDetachedFooter) return;
    setExamScrollPadBottomPx(0);
    setExamFooterMeasured(false);
  }, [examStackedLayout, examDetachedFooter, footerSlot]);

  if (examStackedLayout && examDetachedFooter) {
    return (
      <div className="nn-cat-question-card nn-cat-question-card--exam-stack nn-cat-question-card--exam-detached flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[var(--semantic-surface)]">
        <div
          id="nn-cat-exam-scroll-region"
          className="nn-cat-question-card__exam-scroll nn-cat-question-card__exam-scroll--detached min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-5"
        >
          {meta}
          {stemBlock}
          {children}
        </div>
      </div>
    );
  }

  if (examStackedLayout && footerSlot) {
    return (
      <div className="nn-cat-question-card nn-cat-question-card--exam-stack flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div
          id="nn-cat-exam-scroll-region"
          className="nn-cat-question-card__exam-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
          style={{
            /*
             * Match footer border-box height (footer uses padding-bottom: calc(16px + env(safe-area-inset-bottom))).
             * Default bottom pad lives in globals.css until measured — then px overrides for a tight scroll gap.
             */
            ...(examFooterMeasured && examScrollPadBottomPx > 0
              ? { paddingBottom: `${examScrollPadBottomPx}px` }
              : {}),
          }}
        >
          {meta}
          {stemBlock}
          {children}
        </div>
        <div
          ref={footerRef}
          className="nn-cat-question-card__exam-footer nn-cat-question-card__exam-footer--anchored shrink-0 border-t border-[var(--semantic-border-soft)]"
        >
          {footerSlot}
        </div>
      </div>
    );
  }

  return (
    <div className="nn-cat-question-card">
      {meta}
      {stemBlock}
      {children}
    </div>
  );
}

export type AnswerOptionState = "default" | "selected" | "correct" | "incorrect" | "dim";

/**
 * AnswerOptionRow — a single answer option in the CAT session.
 * Spec: full-width row, circular letter badge, 16px padding.
 * Uses `nn-cat-opt` CSS classes — NOT the lesson-style nn-qopt-surface.
 */
export function AnswerOptionRow({
  letter,
  text,
  state = "default",
  disabled = false,
  isCheckbox = false,
  checked = false,
  onClick,
  onChange,
}: {
  letter: string;
  text: string;
  state?: AnswerOptionState;
  disabled?: boolean;
  isCheckbox?: boolean;
  checked?: boolean;
  onClick?: () => void;
  onChange?: (checked: boolean) => void;
}) {
  const stateClass =
    state === "selected"
      ? "nn-cat-opt--selected"
      : state === "correct"
        ? "nn-cat-opt--correct"
        : state === "incorrect"
          ? "nn-cat-opt--incorrect"
          : state === "dim"
            ? "nn-cat-opt--dim"
            : "";

  const interactiveClass = !disabled && state !== "correct" && state !== "incorrect" && state !== "dim"
    ? "nn-cat-opt--interactive"
    : "";

  if (isCheckbox) {
    return (
      <label
        className={`nn-cat-opt ${stateClass} ${interactiveClass} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <input
          type="checkbox"
          disabled={disabled}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only"
        />
        <span className="nn-cat-opt__letter" aria-hidden="true">
          {letter}
        </span>
        <span
          className={`nn-cat-opt__control ${checked || state === "correct" ? "nn-cat-opt__control--checked" : ""}`}
          aria-hidden="true"
        />
        <span className="nn-cat-opt__text">{text}</span>
        {state === "correct" ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--nn-exam-accent)]" aria-hidden />
        ) : state === "incorrect" ? (
          <XCircle className="h-5 w-5 shrink-0 text-[var(--semantic-danger)]" aria-hidden />
        ) : null}
      </label>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`nn-cat-opt ${stateClass} ${interactiveClass}`}
      aria-pressed={state === "selected"}
    >
      <span className="nn-cat-opt__letter" aria-hidden="true">
        {letter}
      </span>
      <span
        className={`nn-cat-opt__control ${state === "selected" || state === "correct" ? "nn-cat-opt__control--checked" : ""}`}
        aria-hidden="true"
      />
      <span className="nn-cat-opt__text">{text}</span>
      {state === "correct" ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--nn-exam-accent)]" aria-hidden />
      ) : state === "incorrect" ? (
        <XCircle className="h-5 w-5 shrink-0 text-[var(--semantic-danger)]" aria-hidden />
      ) : null}
    </button>
  );
}
