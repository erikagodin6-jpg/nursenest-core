"use client";

import Link from "next/link";
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

export type PaywallContext = "questions" | "lessons" | "exams" | "dashboard";

const FEATURE_KEYS = [
  "paywall.feature.fullQuestionBank",
  "paywall.feature.detailedRationales",
  "paywall.feature.flashcards",
  "paywall.feature.adaptivePlanner",
  "paywall.feature.readinessTracking",
] as const;

const LOSE_KEYS = [`lose0`, `lose1`, `lose2`] as const;

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
  const [bankQuestionCount, setBankQuestionCount] = useState<number | null>(null);
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

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/home-stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { questionCount?: number } | null) => {
        if (cancelled || !d || typeof d.questionCount !== "number") return;
        setBankQuestionCount(d.questionCount);
      })
      .catch(() => {});
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
    <section className="nn-card space-y-4 p-6">
      <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-info)]">{t("paywall.preview.heading")}</p>
        <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{t("paywall.preview.lead")}</p>
        <p className="mt-3 text-sm font-medium text-[var(--semantic-text-primary)]">{t("paywall.preview.sampleStem")}</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("paywall.preview.sampleRationale")}</p>
        {bankQuestionCount != null && bankQuestionCount > 0 ? (
          <p className="mt-3 text-xs font-semibold text-[var(--semantic-text-primary)]">
            {t("paywall.preview.bankSizeLine", {
              count: bankQuestionCount.toLocaleString(locale.replace(/_/g, "-")),
            })}
          </p>
        ) : null}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("paywall.subscriptionBadge")}</p>
        <h2 className="mt-1 text-2xl font-bold">{t(`${p}.title`)}</h2>
        <p className="mt-2 text-sm text-muted">{t(`${p}.intro`)}</p>
        <p className="mt-3 text-sm font-medium text-foreground">{t(tierLineKey)}</p>
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground">{t("paywall.unlockListHeading")}</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-foreground">
          {FEATURE_KEYS.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground">{t("paywall.loseHeading")}</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted">
          {LOSE_KEYS.map((suffix) => (
            <li key={suffix}>{t(`${p}.${suffix}`)}</li>
          ))}
        </ul>
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
