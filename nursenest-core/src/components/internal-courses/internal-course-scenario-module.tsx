"use client";

import Link from "next/link";
import { useState } from "react";

export type InternalScenarioDecision = { id: string; label: string; outcome: string };

export type InternalScenarioModuleContent = {
  stem: string;
  decisions: InternalScenarioDecision[];
};

export function InternalCourseScenarioModule({
  content,
  lessonAppHref,
}: {
  content: InternalScenarioModuleContent;
  lessonAppHref: string | null;
}) {
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="space-y-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_12%,transparent)] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">Scenario</h3>
        <span className="nn-badge-semantic-warning rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
          Branching
        </span>
      </div>
      <p className="text-sm leading-relaxed text-foreground">{content.stem}</p>
      {lessonAppHref ? (
        <p className="text-xs text-muted-foreground">
          <Link href={lessonAppHref} className="font-semibold text-primary underline-offset-2 hover:underline">
            Related pathway lesson
          </Link>
        </p>
      ) : null}
      <div className="flex flex-col gap-2">
        {content.decisions.map((d) => (
          <button
            key={d.id}
            type="button"
            className={`rounded-lg border px-3 py-2 text-left text-sm font-medium transition-colors ${
              picked === d.id
                ? "border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,transparent)]"
                : "border-border bg-background/70 hover:bg-muted/40"
            }`}
            onClick={() => setPicked(d.id)}
          >
            {d.label}
          </button>
        ))}
      </div>
      {picked ? (
        <div className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,transparent)] p-3 text-sm text-foreground">
          {content.decisions.find((d) => d.id === picked)?.outcome}
        </div>
      ) : null}
    </div>
  );
}
