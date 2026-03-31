import Link from "next/link";
import { CalendarClock, Sparkles } from "lucide-react";
import type { LearnerAdaptiveStripModel } from "@/lib/learner/load-learner-adaptive-strip";

export function LearnerAdaptiveStrip({ model }: { model: LearnerAdaptiveStripModel }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-primary/15 bg-gradient-to-r from-primary/[0.06] to-transparent px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 items-start gap-2">
        <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        <div className="min-w-0">
          <p className="font-medium text-[var(--theme-heading-text)]">{model.countdownPrimary}</p>
          {model.countdownSecondary ? <p className="mt-0.5 text-xs text-muted">{model.countdownSecondary}</p> : null}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
        {model.weakAreasShort ? (
          <span className="max-w-[min(100%,20rem)] truncate text-xs text-muted" title={model.weakAreasShort}>
            Weak areas: {model.weakAreasShort}
          </span>
        ) : (
          <span className="text-xs text-muted">Weak areas: building signals as you practice</span>
        )}
        <Link
          href={model.nextActionHref}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/80"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
          {model.nextActionShort}
        </Link>
        <Link href={model.plannerHref} className="text-xs font-semibold text-primary underline">
          Planner
        </Link>
      </div>
    </div>
  );
}
