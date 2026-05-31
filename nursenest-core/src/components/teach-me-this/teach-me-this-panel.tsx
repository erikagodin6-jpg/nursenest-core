"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import {
  buildTeachMeThisMiniLesson,
  type TeachMeThisInput,
} from "@/lib/teach-me-this/teach-me-this-mini-lesson";

type Props = TeachMeThisInput & {
  lessonHref?: string | null;
  lessonTitle?: string | null;
  triggerReason?: "incorrect" | "low_confidence" | "request";
  defaultOpen?: boolean;
  compact?: boolean;
};

const SECTIONS = [
  ["Concept Overview", "conceptOverview"],
  ["Why It Matters", "whyItMatters"],
  ["Clinical Example", "clinicalExample"],
  ["Patient Scenario", "patientScenario"],
  ["NCLEX Tip", "nclexTip"],
  ["Memory Hook", "memoryHook"],
] as const;

function hasAuthoredTeaching(input: TeachMeThisInput): boolean {
  return Boolean(
    input.rationale?.trim() ||
    input.clinicalPearl?.trim() ||
    input.examTip?.trim() ||
    input.memoryHook?.trim(),
  );
}

export function TeachMeThisPanel({
  lessonHref,
  lessonTitle,
  triggerReason = "request",
  defaultOpen = false,
  compact = false,
  ...input
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const lesson = useMemo(() => buildTeachMeThisMiniLesson(input), [input]);
  const hasTeaching = hasAuthoredTeaching(input);

  if (!hasTeaching && !lessonHref) return null;

  const triggerCopy =
    triggerReason === "incorrect"
      ? "Use the rationale to repair the concept before the next item."
      : triggerReason === "low_confidence"
        ? "Build confidence with a quick teaching pass before moving on."
        : "Open an inline teaching pass without leaving your study session.";

  return (
    <section
      className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] p-4 shadow-[var(--semantic-shadow-soft)]"
      data-nn-teach-me-this
      aria-label="Teach Me This mini lesson"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_24%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] text-[var(--semantic-brand)]">
            <Lightbulb className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[var(--semantic-text-primary)]">Teach Me This</h3>
            <p className="mt-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{triggerCopy}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex min-h-[2.5rem] items-center justify-center gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm font-semibold text-[var(--semantic-text-primary)] transition-colors hover:border-[color-mix(in_srgb,var(--semantic-brand)_36%,var(--semantic-border-soft))]"
          aria-expanded={open}
        >
          {open ? "Hide Mini-Lesson" : "Open Mini-Lesson"}
          {open ? <ChevronUp className="h-4 w-4" aria-hidden /> : <ChevronDown className="h-4 w-4" aria-hidden />}
        </button>
      </div>

      {open ? (
        <div className={`mt-4 grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
          {hasTeaching ? (
            <>
              {SECTIONS.map(([label, key]) => (
                <article key={key} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">{label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{lesson[key]}</p>
                </article>
              ))}
              <article className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_6%,var(--semantic-surface))] p-3 sm:col-span-2">
                <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">Practice Question</p>
                <p className="mt-1 text-sm font-semibold leading-relaxed text-[var(--semantic-text-primary)]">{lesson.practiceQuestion.prompt}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{lesson.practiceQuestion.answer}</p>
              </article>
            </>
          ) : null}

          {lessonHref ? (
            <Link
              href={lessonHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_26%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-3 py-2 text-sm font-semibold text-[var(--semantic-brand)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-brand)_7%,var(--semantic-surface))] sm:col-span-2"
            >
              <BookOpen className="h-4 w-4" aria-hidden />
              {lessonTitle?.trim() || "Open Full Lesson"}
            </Link>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
