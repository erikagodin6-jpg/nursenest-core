import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type LessonNavTarget = {
  title: string;
  href: string;
};

type Props = {
  position: "top" | "bottom";
  backHref: string;
  backLabel: string;
  /** Pathway-ordered previous lesson (`/app/lessons/:id`). */
  prevLesson?: LessonNavTarget | null;
  /** Pathway-ordered next lesson (`/app/lessons/:id`). */
  nextLesson?: LessonNavTarget | null;
  previousLessonLabel?: string;
  nextLessonLabel?: string;
};

const topPill =
  "inline-flex min-h-9 min-w-0 max-w-full flex-1 flex-col justify-center gap-0.5 rounded-lg border px-2.5 py-1.5 text-center text-xs font-semibold transition-colors sm:text-sm";

const topLink =
  `${topPill} border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-brand)_12%)] bg-[color-mix(in_srgb,var(--bg-card)_94%,var(--semantic-panel-muted)_6%)] text-[var(--theme-heading-text)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))]`;

const topDisabled = `${topPill} cursor-not-allowed border-[var(--semantic-border-soft)] text-[var(--theme-muted-text)] opacity-55`;

const bottomBtn =
  "inline-flex min-h-11 min-w-0 max-w-full flex-1 flex-col items-stretch justify-center gap-0.5 rounded-xl border px-3 py-2 text-sm font-semibold sm:px-4";

const bottomLink =
  `${bottomBtn} border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-brand)_12%)] bg-[color-mix(in_srgb,var(--bg-card)_94%,var(--semantic-panel-muted)_6%)] text-[var(--theme-heading-text)] transition-colors hover:border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--bg-card)_88%,var(--semantic-panel-positive)_12%)]`;

const bottomDisabled = `${bottomBtn} cursor-not-allowed border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--theme-muted-surface)_50%,var(--bg-card))] text-[var(--theme-muted-text)] opacity-55`;

const subTitle = "block max-w-full truncate text-xs font-normal text-[var(--theme-muted-text)]";

/**
 * Previous / next pathway lessons plus back to list. `prevLesson` / `nextLesson` use hub order from
 * {@link loadPathwayLessonAdjacent}; missing ends render as disabled controls.
 */
export function LessonNavButtons({
  position,
  backHref,
  backLabel,
  prevLesson,
  nextLesson,
  previousLessonLabel = "Previous lesson",
  nextLessonLabel = "Next lesson",
}: Props) {
  const showSequence = prevLesson != null || nextLesson != null;

  if (position === "top") {
    if (!showSequence) {
      return (
        <div className="mb-7">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:opacity-80"
            style={{
              borderColor: "var(--border-subtle)",
              color: "var(--semantic-text-muted)",
              background: "var(--bg-card)",
            }}
          >
            <ArrowLeft className="h-3 w-3" aria-hidden="true" />
            {backLabel}
          </Link>
        </div>
      );
    }
    return (
      <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch">
        <div className="grid grid-cols-2 gap-2 sm:flex-1 sm:max-w-md">
          {prevLesson ? (
            <Link href={prevLesson.href} className={`group ${topLink}`} title={prevLesson.title}>
              <span className="inline-flex items-center justify-center gap-1">
                <ArrowLeft className="h-3 w-3 shrink-0 transition-transform group-hover:-translate-x-0.5" aria-hidden />
                {previousLessonLabel}
              </span>
              <span className={subTitle}>{prevLesson.title}</span>
            </Link>
          ) : (
            <span className={topDisabled} aria-disabled="true">
              <span className="inline-flex items-center justify-center gap-1">
                <ArrowLeft className="h-3 w-3 shrink-0 opacity-50" aria-hidden />
                {previousLessonLabel}
              </span>
            </span>
          )}
          {nextLesson ? (
            <Link href={nextLesson.href} className={`group ${topLink}`} title={nextLesson.title}>
              <span className="inline-flex items-center justify-center gap-1">
                {nextLessonLabel}
                <ArrowRight className="h-3 w-3 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
              <span className={subTitle}>{nextLesson.title}</span>
            </Link>
          ) : (
            <span className={topDisabled} aria-disabled="true">
              <span className="inline-flex items-center justify-center gap-1">
                {nextLessonLabel}
                <ArrowRight className="h-3 w-3 shrink-0 opacity-50" aria-hidden />
              </span>
            </span>
          )}
        </div>
        <Link
          href={backHref}
          className="inline-flex min-h-9 items-center justify-center gap-1.5 self-start rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:opacity-80 sm:self-center"
          style={{
            borderColor: "var(--border-subtle)",
            color: "var(--semantic-text-muted)",
            background: "var(--bg-card)",
          }}
        >
          <ArrowLeft className="h-3 w-3" aria-hidden="true" />
          {backLabel}
        </Link>
      </div>
    );
  }

  if (!showSequence) {
    return (
      <nav
        className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t pt-7"
        style={{ borderColor: "color-mix(in srgb, var(--theme-primary) 14%, var(--border-subtle))" }}
        aria-label="Lesson navigation"
      >
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors hover:opacity-80"
          style={{
            borderColor: "var(--border-subtle)",
            color: "var(--semantic-text-secondary)",
            background: "var(--bg-card)",
          }}
        >
          <ArrowLeft className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          {backLabel}
        </Link>
      </nav>
    );
  }

  return (
    <nav
      className="mt-12 flex flex-col gap-3 border-t pt-7 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-between"
      style={{ borderColor: "color-mix(in srgb, var(--theme-primary) 14%, var(--border-subtle))" }}
      aria-label="Lesson navigation"
    >
      <div className="order-2 grid w-full grid-cols-1 gap-2 sm:order-1 sm:max-w-xl sm:grid-cols-2">
        {prevLesson ? (
          <Link href={prevLesson.href} className={`group ${bottomLink} text-left`} title={prevLesson.title}>
            <span className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5" aria-hidden />
              {previousLessonLabel}
            </span>
            <span className={subTitle}>{prevLesson.title}</span>
          </Link>
        ) : (
          <span className={`${bottomDisabled} text-left`} aria-disabled="true">
            <span className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
              {previousLessonLabel}
            </span>
          </span>
        )}
        {nextLesson ? (
          <Link href={nextLesson.href} className={`group ${bottomLink} text-left sm:text-right`} title={nextLesson.title}>
            <span className="inline-flex items-center gap-2 sm:w-full sm:justify-end">
              {nextLessonLabel}
              <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
            <span className={`${subTitle} sm:text-right`}>{nextLesson.title}</span>
          </Link>
        ) : (
          <span className={`${bottomDisabled} text-left sm:text-right`} aria-disabled="true">
            <span className="inline-flex items-center gap-2 sm:w-full sm:justify-end">
              {nextLessonLabel}
              <ArrowRight className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
            </span>
          </span>
        )}
      </div>
      <div className="order-1 w-full sm:order-2 sm:w-auto sm:self-center">
        <Link
          href={backHref}
          className="inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors hover:opacity-80 sm:w-auto"
          style={{
            borderColor: "var(--border-subtle)",
            color: "var(--semantic-text-secondary)",
            background: "var(--bg-card)",
          }}
        >
          <ArrowLeft className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          {backLabel}
        </Link>
      </div>
    </nav>
  );
}
