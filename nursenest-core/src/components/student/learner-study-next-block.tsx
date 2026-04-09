import Link from "next/link";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import type { LearnerStudyNextBlockModel } from "@/lib/learner/load-learner-study-next-block";
import type {
  StudyNextConfidence,
  StudyNextRecommendation,
  StudyNextRecommendationType,
} from "@/lib/learner/study-next-types";

function ctaForRecommendationType(type: StudyNextRecommendationType, t: LearnerMarketingT): string {
  switch (type) {
    case "continue_pathway_lesson":
    case "weak_topic_lesson":
      return t("studyNext.cta.continue");
    case "weak_topic_qbank":
    case "weak_topic_flashcards":
      return t("studyNext.cta.practiceNow");
    case "retest_topic":
      return t("studyNext.cta.reviewNow");
    default:
      return t("studyNext.openCta");
  }
}

function confidenceLabel(confidence: StudyNextConfidence, t: LearnerMarketingT): string {
  if (confidence === "high") return t("studyNext.confidence.high");
  if (confidence === "medium") return t("studyNext.confidence.medium");
  return t("studyNext.confidence.low");
}

function RecommendationRow({
  rec,
  t,
  variant,
}: {
  rec: StudyNextRecommendation;
  t: LearnerMarketingT;
  variant: "primary" | "secondary";
}) {
  const cta = ctaForRecommendationType(rec.type, t);
  const conf = confidenceLabel(rec.confidence, t);

  if (variant === "primary") {
    return (
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--nn-presentation-badge)] p-3 sm:p-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug text-[var(--theme-heading-text)] [overflow-wrap:anywhere]">
              {rec.title}
            </p>
            <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
              {rec.reasonShort}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:max-w-[11rem] sm:items-end">
            <span className="inline-flex w-fit rounded border border-border/60 bg-background/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {conf}
            </span>
            <Link
              href={rec.href}
              className="inline-flex min-h-[2.25rem] w-full items-center justify-center rounded-full bg-role-cta px-3 py-1.5 text-center text-xs font-semibold text-role-cta-foreground shadow-[0_2px_8px_var(--role-cta-shadow)] transition hover:bg-role-cta-hover sm:w-auto sm:min-w-[7.5rem]"
            >
              {cta}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <li className="rounded-lg border border-border/50 bg-background/50 p-2.5 sm:p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-snug text-[var(--theme-heading-text)] [overflow-wrap:anywhere]">
            {rec.title}
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground [overflow-wrap:anywhere]">{rec.reasonShort}</p>
          <span className="mt-1 inline-flex w-fit rounded border border-transparent bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            {conf}
          </span>
        </div>
        <Link
          href={rec.href}
          className="inline-flex shrink-0 min-h-[2rem] items-center justify-center rounded-full border border-role-cta/35 bg-role-cta-soft px-3 py-1.5 text-center text-xs font-semibold text-role-cta-on-soft transition hover:bg-[color-mix(in_srgb,var(--role-cta)_12%,var(--bg-card))] sm:min-w-[6.5rem]"
        >
          {cta}
        </Link>
      </div>
    </li>
  );
}

export async function LearnerStudyNextBlock({ model }: { model: LearnerStudyNextBlockModel }) {
  const { t } = await getLearnerMarketingBundle();
  const secondary = model.secondary.slice(0, 2);

  return (
    <section
      className="rounded-xl border border-[var(--nn-presentation-divider)] bg-[var(--nn-presentation-wash)] shadow-[0_1px_0_color-mix(in_srgb,var(--theme-heading-text)_4%,transparent)]"
      aria-labelledby="nn-study-next-heading"
    >
      <div className="flex flex-col gap-1 border-b border-border/50 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-3.5">
        <div className="min-w-0">
          <p className="text-sm font-medium leading-snug text-[var(--theme-heading-text)]">{model.countdownPrimary}</p>
          {model.countdownSecondary ? (
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{model.countdownSecondary}</p>
          ) : null}
        </div>
        <Link
          href={model.plannerHref}
          className="shrink-0 text-xs font-semibold text-primary underline-offset-2 hover:underline sm:pt-0.5"
        >
          {t("studyNext.linkStudyPlan")}
        </Link>
      </div>

      <div className="px-3 py-3 sm:px-3.5 sm:py-3.5">
        <h2
          id="nn-study-next-heading"
          className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
        >
          {t("studyNext.title")}
        </h2>
        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{t("studyNext.integratedExplanation")}</p>

        <p className="mt-3 text-xs font-medium text-[var(--theme-heading-text)]">{t("studyNext.primary")}</p>
        <div className="mt-1.5">
          <RecommendationRow rec={model.primary} t={t} variant="primary" />
        </div>

        {secondary.length > 0 ? (
          <div className="mt-3 border-t border-border/40 pt-3">
            <p className="text-xs font-medium text-[var(--theme-heading-text)]">{t("studyNext.secondary")}</p>
            <ul className="mt-1.5 space-y-2">
              {secondary.map((rec) => (
                <RecommendationRow key={`${rec.href}-${rec.type}`} rec={rec} t={t} variant="secondary" />
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
