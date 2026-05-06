"use client";

import Link from "next/link";
import { useState } from "react";

export type InternalEcgModuleContent = {
  title: string;
  stripSummary: string;
  question: string;
  answer: string;
  rationale: string;
};

export function InternalCourseEcgModule({
  content,
  lessonAppHref,
}: {
  content: InternalEcgModuleContent;
  lessonAppHref: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-1)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,transparent)] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">{content.title}</h3>
        <span className="nn-badge-semantic-info rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
          ECG
        </span>
      </div>
      <p className="rounded-lg border border-border bg-background/60 px-3 py-2 font-mono text-sm leading-relaxed text-foreground">
        {content.stripSummary}
      </p>
      <p className="text-sm font-medium text-foreground">{content.question}</p>
      {lessonAppHref ? (
        <p className="text-xs text-muted-foreground">
          <Link href={lessonAppHref} className="font-semibold text-primary underline-offset-2 hover:underline">
            Open canonical pathway lesson
          </Link>{" "}
          for full teaching content.
        </p>
      ) : null}
      <button
        type="button"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-95 disabled:opacity-60"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Hide answer" : "Reveal answer"}
      </button>
      {open ? (
        <div className="space-y-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-success)_25%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,transparent)] p-3 text-sm">
          <p className="font-semibold text-foreground">{content.answer}</p>
          <p className="text-muted-foreground">{content.rationale}</p>
        </div>
      ) : null}
    </div>
  );
}
