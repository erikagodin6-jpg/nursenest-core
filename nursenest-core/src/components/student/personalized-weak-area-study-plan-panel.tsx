import Link from "next/link";
import type { PersonalizedWeakAreaStudyPlanPublic } from "@/lib/learner/personalized-weak-area-study-plan";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

function bandBadgeClass(band: PersonalizedWeakAreaStudyPlanPublic["weakestAreas"][number]["band"]): string {
  if (band === "priority_review") return "bg-[color-mix(in_srgb,var(--semantic-danger)_12%,transparent)] text-[var(--semantic-danger)]";
  if (band === "needs_attention") return "bg-[color-mix(in_srgb,var(--semantic-warning)_14%,transparent)] text-[var(--semantic-warning)]";
  return "bg-[color-mix(in_srgb,var(--semantic-info)_12%,transparent)] text-[var(--semantic-info)]";
}

function bandLabel(
  t: LearnerMarketingT,
  band: PersonalizedWeakAreaStudyPlanPublic["weakestAreas"][number]["band"],
): string {
  if (band === "priority_review") return t("learner.studyPlan.weakEngine.band.priority");
  if (band === "needs_attention") return t("learner.studyPlan.weakEngine.band.needs");
  return t("learner.studyPlan.weakEngine.band.watch");
}

export function PersonalizedWeakAreaStudyPlanPanel({
  plan,
  t,
}: {
  plan: PersonalizedWeakAreaStudyPlanPublic;
  t: LearnerMarketingT;
}) {
  const hasAny =
    plan.weakestAreas.length > 0 ||
    plan.reviewSequence.length > 0 ||
    plan.signals.hasRepeatIncorrects ||
    plan.signals.hasStaleInProgressPractice;

  return (
    <section className="nn-card space-y-4 border border-border/70 bg-[var(--theme-card-bg)] p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("learner.studyPlan.weakEngine.kicker")}</p>
        <h2 className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">{t("learner.studyPlan.weakEngine.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("learner.studyPlan.weakEngine.subtitle")}</p>
      </div>

      {!hasAny ? (
        <p className="text-sm text-muted-foreground">{t("learner.studyPlan.weakEngine.empty")}</p>
      ) : null}

      {plan.weakestAreas.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">{t("learner.studyPlan.weakEngine.weakest")}</h3>
          <ul className="space-y-2">
            {plan.weakestAreas.map((w) => (
              <li key={w.label} className="rounded-lg border border-border/60 bg-muted/20 p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-foreground">{w.label}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${bandBadgeClass(w.band)}`}>
                    {bandLabel(t, w.band)}
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground">{w.coachLine}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {plan.reviewSequence.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">{t("learner.studyPlan.weakEngine.sequence")}</h3>
          <ol className="list-decimal space-y-2 pl-5 text-sm">
            {plan.reviewSequence.map((s) => (
              <li key={`${s.step}-${s.href}`} className="text-foreground">
                <Link href={s.href} className="font-semibold text-primary underline">
                  {s.title}
                </Link>
                <p className="text-muted-foreground">{s.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {(plan.anchors.lesson || plan.anchors.flashcards || plan.anchors.questions || plan.anchors.practiceWeak) && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">{t("learner.studyPlan.weakEngine.shortcuts")}</h3>
          <ul className="flex flex-col gap-2 text-sm">
            {[plan.anchors.lesson, plan.anchors.flashcards, plan.anchors.questions, plan.anchors.practiceWeak]
              .filter(Boolean)
              .map((a) => (
                <li key={a!.href}>
                  <Link href={a!.href} className="font-semibold text-primary underline">
                    {a!.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">{a!.reason}</p>
                </li>
              ))}
          </ul>
        </div>
      )}

      {(plan.signals.hasRepeatIncorrects || plan.signals.hasStaleInProgressPractice) && (
        <div className="rounded-lg border border-border/50 bg-muted/15 p-3 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">{t("learner.studyPlan.weakEngine.signalsTitle")}</p>
          <ul className="mt-1 list-inside list-disc space-y-1">
            {plan.signals.hasRepeatIncorrects ? <li>{t("learner.studyPlan.weakEngine.signalRepeat")}</li> : null}
            {plan.signals.hasStaleInProgressPractice ? <li>{t("learner.studyPlan.weakEngine.signalStale")}</li> : null}
          </ul>
        </div>
      )}

      <p className="text-xs text-muted-foreground">{plan.sessionIntegrationNote}</p>
    </section>
  );
}
