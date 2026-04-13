import Link from "next/link";
import type { StructuredStudyPath, StructuredStudyPathStep, StudyPathPhase } from "@/lib/learner/structured-study-path";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

function phaseLabel(phase: StudyPathPhase, t: LearnerMarketingT): string {
  switch (phase) {
    case "foundation":
      return t("learner.structuredStudyPath.phase.foundation");
    case "weak_spot":
      return t("learner.structuredStudyPath.phase.weak_spot");
    case "build":
      return t("learner.structuredStudyPath.phase.build");
    case "advanced":
      return t("learner.structuredStudyPath.phase.advanced");
    case "adaptive":
      return t("learner.structuredStudyPath.phase.adaptive");
    default:
      return phase;
  }
}

function contentLabel(contentType: StructuredStudyPathStep["contentType"], t: LearnerMarketingT): string {
  switch (contentType) {
    case "lessons":
      return t("learner.structuredStudyPath.content.lessons");
    case "questions":
      return t("learner.structuredStudyPath.content.questions");
    case "cat":
      return t("learner.structuredStudyPath.content.cat");
    default:
      return contentType;
  }
}

export function StructuredStudyPathSection({
  path,
  t,
  inferredKind,
  kindFromQuery,
}: {
  path: StructuredStudyPath;
  t: LearnerMarketingT;
  /** Kind from profile (before URL override). */
  inferredKind: import("@/lib/learner/structured-study-path").StudyPathKind;
  /** When set, `path.kind` came from `?kind=`. */
  kindFromQuery: import("@/lib/learner/structured-study-path").StudyPathKind | null;
}) {
  const overridden = kindFromQuery != null && kindFromQuery !== inferredKind;
  const showNewGradLink = path.kind === "rn" && inferredKind === "rn" && !kindFromQuery;

  let lastPhase: StudyPathPhase | null = null;

  return (
    <section className="nn-card space-y-4 p-5 sm:p-6" aria-labelledby="structured-study-path-heading">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.structuredStudyPath.kicker")}</p>
        <h2 id="structured-study-path-heading" className="text-xl font-semibold tracking-tight text-[var(--theme-heading-text)]">
          {t("learner.structuredStudyPath.title")}
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">{t("learner.structuredStudyPath.subtitle")}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            <span className="font-medium text-[var(--semantic-text-secondary)]">{t("learner.structuredStudyPath.pathwayLabel")}:</span>{" "}
            {path.pathwayDisplayName}
          </span>
          <span>
            <span className="font-medium text-[var(--semantic-text-secondary)]">{t("learner.structuredStudyPath.kindLabel")}:</span>{" "}
            {path.kind.replace(/_/g, " ")}
          </span>
        </div>
        {path.weakTopicsApplied.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-[var(--semantic-text-secondary)]">{t("learner.structuredStudyPath.weakApplied")}:</span>{" "}
            {path.weakTopicsApplied.join(", ")}
          </p>
        ) : null}
        {overridden ? <p className="text-xs text-amber-700 dark:text-amber-400">{t("learner.structuredStudyPath.overrideHint")}</p> : null}
      </header>

      <ol className="space-y-6 border-t border-[var(--semantic-border-soft)] pt-4">
        {path.steps.map((step) => {
          const showPhase = step.phase !== lastPhase;
          if (showPhase) lastPhase = step.phase;
          return (
            <li key={step.id} className="list-none">
              {showPhase ? (
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
                  {phaseLabel(step.phase, t)}
                </p>
              ) : null}
              <div className="flex flex-col gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_88%,var(--semantic-panel-muted))] p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[var(--semantic-text-primary)]">{step.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{step.description}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                    {contentLabel(step.contentType, t)}
                  </p>
                </div>
                <Link
                  href={step.href}
                  className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[var(--theme-primary)] px-3 py-2 text-xs font-semibold text-[var(--theme-primary-foreground)] hover:opacity-90"
                >
                  {t("learner.structuredStudyPath.open")}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>

      {showNewGradLink ? (
        <p className="border-t border-[var(--semantic-border-soft)] pt-4 text-sm">
          <Link href="/app/study-plan?kind=new_grad" className="font-medium text-primary underline-offset-4 hover:underline">
            {t("learner.structuredStudyPath.linkNewGrad")}
          </Link>
        </p>
      ) : null}
    </section>
  );
}
