import Link from "next/link";
import { CalendarClock } from "lucide-react";
import type { LearnerStudyNextBlockModel } from "@/lib/learner/load-learner-study-next-block";

export function LearnerStudyNextBlock({ model }: { model: LearnerStudyNextBlockModel }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary/15 bg-gradient-to-r from-primary/[0.06] to-transparent px-4 py-3 text-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
          <div className="min-w-0">
            <p className="font-medium text-[var(--theme-heading-text)]">{model.countdownPrimary}</p>
            {model.countdownSecondary ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{model.countdownSecondary}</p>
            ) : null}
          </div>
        </div>
        <Link href={model.plannerHref} className="shrink-0 text-xs font-semibold text-primary underline sm:pt-0.5">
          Study plan
        </Link>
      </div>

      <div className="border-t border-border/50 pt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Study next</p>
        <div className="mt-2 rounded-lg border border-border/60 bg-card/80 p-3">
          <Link
            href={model.primary.href}
            className="text-sm font-semibold text-foreground underline-offset-2 hover:underline"
          >
            {model.primary.title}
          </Link>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{model.primary.reasonShort}</p>
        </div>
        {model.secondary.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {model.secondary.map((s) => (
              <li key={s.href} className="flex flex-col gap-0.5 text-xs">
                <Link href={s.href} className="font-medium text-foreground underline-offset-2 hover:underline">
                  {s.title}
                </Link>
                <span className="text-muted-foreground">{s.reasonShort}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
