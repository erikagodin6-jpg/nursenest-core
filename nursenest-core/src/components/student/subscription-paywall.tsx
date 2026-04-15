"use client";

import Link from "next/link";
import { CheckCircle2, BookOpen, HelpCircle, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { BrandTrustInline } from "@/components/brand/brand-trust-inline";
import {
  paywallTierLineI18nKey,
  sampleLessonHref,
  sampleQuestionsHref,
} from "@/lib/brand/tier-brand-messaging";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";

export type PaywallContext = "questions" | "lessons" | "exams" | "dashboard";

const FEATURE_KEYS = [
  "paywall.feature.fullQuestionBank",
  "paywall.feature.detailedRationales",
  "paywall.feature.flashcards",
  "paywall.feature.adaptivePlanner",
  "paywall.feature.readinessTracking",
] as const;

const LOSE_KEYS = [`lose0`, `lose1`, `lose2`] as const;

/** Objection Q&A blocks rendered above the pricing CTA (order = conversion flow). */
const PAYWALL_OBJECTION_IDS = ["worthIt", "different", "passExam", "ifStayFree", "upToDate"] as const;

const PREVIEW_CHOICE_KEYS = [
  "pages.home.sampleQuestion.choiceA",
  "pages.home.sampleQuestion.choiceB",
  "pages.home.sampleQuestion.choiceC",
  "pages.home.sampleQuestion.choiceD",
] as const;

/** Same as homepage sample: option A is the keyed correct answer for this static preview. */
const PREVIEW_CORRECT_CHOICE_INDEX = 0;

type HomeStatsPayload = {
  questionCount?: number;
  totalLessons?: number;
  registeredLearners?: number;
};

function formatStat(n: number, locale: string): string {
  if (n <= 0) return "";
  return n.toLocaleString(locale.replace(/_/g, "-"));
}

/** Avoids an empty proof row then a pop-in — shows stable pulse placeholders until `/api/public/home-stats` resolves. */
function PaywallProofStatsSkeleton() {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl border px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
      style={{ borderColor: "color-mix(in srgb, var(--semantic-info) 22%, var(--semantic-border-soft))" }}
      aria-busy
      aria-label="Loading library stats"
    >
      <div className="h-3 w-36 animate-pulse rounded bg-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))]" />
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <div className="h-4 w-52 max-w-full animate-pulse rounded bg-[color-mix(in_srgb,var(--semantic-success)_16%,var(--semantic-border-soft))]" />
        <div className="h-4 w-44 max-w-full animate-pulse rounded bg-[color-mix(in_srgb,var(--semantic-info)_14%,var(--semantic-border-soft))]" />
      </div>
    </div>
  );
}

export function SubscriptionPaywall({
  context,
  freemiumRemainingQuestions,
  freemiumRemainingLessons,
}: {
  context: PaywallContext;
  freemiumRemainingQuestions?: number;
  freemiumRemainingLessons?: number;
}) {
  const { t, locale } = useMarketingI18n();
  const { data: session } = useSession();
  const [homeStats, setHomeStats] = useState<HomeStatsPayload | null>(null);
  const [statsReady, setStatsReady] = useState(false);
  const tier = session?.user?.tier;
  const region = session?.user?.country === "CA" ? "CA" : "US";
  const tierLineKey = paywallTierLineI18nKey(tier);
  const sampleLessons = sampleLessonHref(region, tier);
  const sampleQuestions = sampleQuestionsHref(region, tier);
  const p = `paywall.${context}` as const;
  const progressBits: string[] = [];
  if (freemiumRemainingQuestions !== undefined && freemiumRemainingQuestions > 0) {
    progressBits.push(t("paywall.remainingQuestions", { n: freemiumRemainingQuestions }));
  }
  if (freemiumRemainingLessons !== undefined && freemiumRemainingLessons > 0) {
    progressBits.push(t("paywall.remainingLessons", { n: freemiumRemainingLessons }));
  }
  const progressTemplate = t(`${p}.progress`);
  const progressLine =
    progressBits.length > 0 ? `${progressBits.join(" · ")}. ${progressTemplate}` : progressTemplate;

  const bankQuestionCount =
    homeStats?.questionCount != null && homeStats.questionCount > 0 ? homeStats.questionCount : null;
  const lessonCount = homeStats?.totalLessons != null && homeStats.totalLessons > 0 ? homeStats.totalLessons : null;
  const learnersCount =
    homeStats?.registeredLearners != null && homeStats.registeredLearners > 0
      ? formatStat(homeStats.registeredLearners, locale)
      : null;

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/home-stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: HomeStatsPayload | null) => {
        if (cancelled) return;
        setHomeStats(d ?? {});
      })
      .catch(() => {
        if (!cancelled) setHomeStats({});
      })
      .finally(() => {
        if (!cancelled) setStatsReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    trackClientEvent(PH.paywallEncounter, {
      actor: "authenticated",
      context,
      freemium_questions_remaining: freemiumRemainingQuestions,
      freemium_lessons_remaining: freemiumRemainingLessons,
    });
  }, [context, freemiumRemainingQuestions, freemiumRemainingLessons]);

  return (
    <section className="nn-card space-y-5 p-6">
      {/* Direct answer to “Will this help me pass?” — before subscription ask */}
      <div
        className="rounded-xl border p-4"
        style={{
          borderColor: "color-mix(in srgb, var(--semantic-success) 28%, var(--semantic-border-soft))",
          background: "color-mix(in srgb, var(--semantic-panel-positive) 88%, var(--semantic-surface))",
        }}
      >
        <h2 className="text-lg font-bold leading-snug text-[var(--semantic-text-primary)]">
          {t("paywall.passPromise.heading")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          {t("paywall.passPromise.lead")}
        </p>
      </div>

      {/* Real library stats (proof) — skeleton first so counts never flash 0 then real values */}
      {!statsReady ? (
        <PaywallProofStatsSkeleton />
      ) : bankQuestionCount != null || lessonCount != null || learnersCount ? (
        <div
          className="flex flex-col gap-3 rounded-xl border px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          style={{ borderColor: "color-mix(in srgb, var(--semantic-info) 22%, var(--semantic-border-soft))" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-info)]">
            {t("paywall.preview.proofIntro")}
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--semantic-text-primary)]">
            {bankQuestionCount != null ? (
              <li className="inline-flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                <span className="font-semibold text-[var(--semantic-success)]">
                  {t("paywall.preview.bankSizeLine", {
                    count: bankQuestionCount.toLocaleString(locale.replace(/_/g, "-")),
                  })}
                </span>
              </li>
            ) : null}
            {lessonCount != null ? (
              <li className="inline-flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 shrink-0 text-[var(--semantic-info)]" aria-hidden />
                <span className="font-medium">
                  {t("paywall.preview.lessonsLine", {
                    count: lessonCount.toLocaleString(locale.replace(/_/g, "-")),
                  })}
                </span>
              </li>
            ) : null}
            {learnersCount ? (
              <li className="inline-flex items-center gap-1.5 text-[var(--semantic-text-secondary)]">
                <Users className="h-4 w-4 shrink-0 text-[var(--semantic-chart-3)]" aria-hidden />
                <span className="text-sm">{t("paywall.preview.learnersLine", { count: learnersCount })}</span>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}

      {/* Content preview — difficulty + rationale depth before CTA */}
      <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-info)]">{t("paywall.preview.heading")}</p>
        <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{t("paywall.preview.lead")}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
            style={{
              borderColor: "color-mix(in srgb, var(--semantic-warning) 35%, var(--semantic-border-soft))",
              color: "color-mix(in srgb, var(--semantic-warning) 92%, var(--semantic-text-primary))",
              background: "color-mix(in srgb, var(--semantic-warning) 10%, var(--semantic-surface))",
            }}
          >
            {t("paywall.preview.difficultyLabel")}: {t("paywall.preview.difficultyValue")}
          </span>
        </div>
        <p className="mt-3 text-pretty text-base font-semibold leading-snug text-[var(--semantic-text-primary)]">
          {formatSentenceCase(t("pages.home.sampleQuestion.stem"), locale)}
        </p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
          {formatTitleCase(t("pages.home.sampleQuestion.choicesHeading"), locale)}
        </p>
        <ul className="mt-2 space-y-2" role="list">
          {PREVIEW_CHOICE_KEYS.map((key, idx) => {
            const correct = idx === PREVIEW_CORRECT_CHOICE_INDEX;
            return (
              <li
                key={key}
                className={
                  correct
                    ? "rounded-xl border-2 border-[color-mix(in_srgb,var(--semantic-success)_55%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_08%,var(--bg-card))] px-3 py-2.5"
                    : "rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] px-3 py-2.5"
                }
              >
                <div className="flex items-start gap-2">
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold text-[var(--semantic-text-secondary)]"
                    style={{
                      borderColor: correct
                        ? "color-mix(in srgb, var(--semantic-success) 50%, var(--semantic-border-soft))"
                        : "var(--semantic-border-soft)",
                    }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm leading-relaxed text-[var(--semantic-text-primary)]">
                    {formatSentenceCase(t(key), locale)}
                  </span>
                  {correct ? (
                    <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
        <div
          className="mt-4 rounded-xl border bg-[var(--bg-card)] p-4"
          style={{ borderColor: "color-mix(in srgb, var(--semantic-info) 22%, var(--semantic-border-soft))" }}
        >
          <p className="text-xs font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-info)_85%,var(--semantic-text-primary))]">
            {formatTitleCase(t("pages.home.sampleQuestion.rationaleLabel"), locale)}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
            {t("paywall.preview.rationaleDepthHint")}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            {formatSentenceCase(t("pages.home.sampleQuestion.rationaleBody"), locale)}
          </p>
          <p className="mt-3 border-t border-[var(--semantic-border-soft)] pt-3 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
            {formatSentenceCase(t("pages.home.sampleQuestion.examTip"), locale)}
          </p>
        </div>
        <p className="mt-2 text-xs text-[var(--semantic-text-secondary)]">{t("paywall.preview.contentFreshness")}</p>
      </div>

      {/* Value vs loss — scannable columns */}
      <div className="grid gap-4 md:grid-cols-2">
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: "color-mix(in srgb, var(--semantic-success) 22%, var(--semantic-border-soft))" }}
        >
          <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{t("paywall.unlockListHeading")}</p>
          <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm text-[var(--semantic-text-primary)]">
            {FEATURE_KEYS.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
        </div>
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: "color-mix(in srgb, var(--semantic-chart-4) 18%, var(--semantic-border-soft))" }}
        >
          <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{t("paywall.loseHeading")}</p>
          <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm text-[var(--semantic-text-secondary)]">
            {LOSE_KEYS.map((suffix) => (
              <li key={suffix}>{t(`${p}.${suffix}`)}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("paywall.subscriptionBadge")}</p>
        <h2 className="mt-1 text-2xl font-bold">{t(`${p}.title`)}</h2>
        <p className="mt-2 text-sm text-muted">{t(`${p}.intro`)}</p>
        <p className="mt-3 text-sm font-medium text-foreground">{t(tierLineKey)}</p>
      </div>

      <p className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground">{progressLine}</p>

      <BrandTrustInline variant="checkout" className="border-t border-border pt-4" />

      <div>
        <p className="text-xs font-medium text-muted-foreground">{t("paywall.sampleExploreLead")}</p>
        <div className="mt-2 flex flex-wrap gap-3 text-sm">
          <Link
            href={sampleLessons}
            className="font-semibold text-[var(--semantic-brand)] underline-offset-4 hover:underline"
          >
            {t("paywall.sampleLessons")}
          </Link>
          <Link
            href={sampleQuestions}
            className="font-semibold text-[var(--semantic-brand)] underline-offset-4 hover:underline"
          >
            {t("paywall.sampleQuestions")}
          </Link>
        </div>
      </div>

      <div
        className="space-y-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_24%,var(--semantic-border-soft))] bg-[var(--semantic-panel-positive)] p-4"
        aria-labelledby="paywall-objections-heading"
      >
        <div>
          <p id="paywall-objections-heading" className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-success)]">
            {t("paywall.objections.title")}
          </p>
          <p className="mt-2 text-sm font-medium leading-snug text-[var(--semantic-text-primary)]">
            {statsReady ? (
              bankQuestionCount != null ? (
                t("paywall.objections.proofWithCount", {
                  count: bankQuestionCount.toLocaleString(locale.replace(/_/g, "-")),
                })
              ) : (
                t("paywall.objections.proofNoCount")
              )
            ) : (
              <span className="inline-block min-h-[1.25rem] w-[min(100%,22rem)] animate-pulse rounded bg-[color-mix(in_srgb,var(--semantic-text-muted)_14%,transparent)]" aria-hidden />
            )}
          </p>
        </div>

        <dl className="space-y-3">
          {PAYWALL_OBJECTION_IDS.map((id) => (
            <div key={id}>
              <dt className="text-sm font-semibold text-[var(--semantic-text-primary)]">{t(`paywall.objections.${id}.q`)}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t(`paywall.objections.${id}.a`)}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          {t("cta.continuePlan")}
        </Link>
        <Link
          href="/app"
          className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
        >
          {t("paywall.cta.openStudyHub")}
        </Link>
      </div>
      <p className="text-xs text-muted">{t("paywall.footerHint")}</p>
    </section>
  );
}
