"use client";

import { useEffect, useMemo } from "react";
import { BookOpen, Globe2, GraduationCap, Layers, Sparkles, Target } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import { PH } from "@/lib/observability/posthog-conversion-events";

function formatStat(n: number | undefined): string {
  if (n === undefined || Number.isNaN(n)) return "N/A";
  if (n === 0) return "0";
  return n.toLocaleString("en-US");
}

export function MarketingTrustSection({
  questionCount,
  lessonCount,
  categoryHint,
}: {
  questionCount: number;
  lessonCount: number;
  /** Approximate category breadth for marketing (e.g. exam + body system buckets). */
  categoryHint?: number;
}) {
  const { t } = useMarketingI18n();

  useEffect(() => {
    trackClientEvent(PH.marketingTrustBarView, {});
  }, []);

  const cat = useMemo(() => {
    if (typeof categoryHint === "number" && categoryHint > 0) return formatStat(categoryHint);
    return t("home.trust.categoriesFallback");
  }, [categoryHint, t]);

  return (
    <section
      className="border-t border-[var(--theme-card-border)] bg-gradient-to-b from-[var(--theme-muted-surface)]/80 to-[var(--theme-card-bg)]"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-marketing-trust"
      aria-labelledby="marketing-trust-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 id="marketing-trust-heading" className="sr-only">
          {t("home.trust.sectionTitle")}
        </h2>

        <div className="flex flex-col gap-3 rounded-2xl border border-[var(--theme-card-border)] bg-card/90 px-4 py-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:px-6">
          <p className="flex items-start gap-2 text-sm text-[var(--theme-body-text)] sm:max-w-[32%]">
            <Layers className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>{t("home.trust.barLine1")}</span>
          </p>
          <p className="flex items-start gap-2 text-sm text-[var(--theme-body-text)] sm:max-w-[32%]">
            <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>{t("home.trust.barLine2")}</span>
          </p>
          <p className="flex items-start gap-2 text-sm text-[var(--theme-body-text)] sm:max-w-[32%]">
            <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>{t("home.trust.barLine3")}</span>
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--theme-card-border)] bg-card p-4 text-center shadow-sm">
            <p className="text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{formatStat(questionCount)}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("home.trust.statQuestions")}</p>
          </div>
          <div className="rounded-2xl border border-[var(--theme-card-border)] bg-card p-4 text-center shadow-sm">
            <p className="text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{formatStat(lessonCount)}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("home.trust.statLessons")}</p>
          </div>
          <div className="rounded-2xl border border-[var(--theme-card-border)] bg-card p-4 text-center shadow-sm">
            <p className="text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{cat}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("home.trust.statCategories")}</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden />
            <h3 className="text-lg font-bold text-[var(--theme-heading-text)]">{t("home.trust.whyTitle")}</h3>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3">
            <li className="rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/50 p-4">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-4 w-4 text-primary" aria-hidden />
              </div>
              <p className="font-semibold text-[var(--theme-heading-text)]">{t("home.trust.why1Title")}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t("home.trust.why1Body")}</p>
            </li>
            <li className="rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/50 p-4">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-4 w-4 text-primary" aria-hidden />
              </div>
              <p className="font-semibold text-[var(--theme-heading-text)]">{t("home.trust.why2Title")}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t("home.trust.why2Body")}</p>
            </li>
            <li className="rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-muted-surface)]/50 p-4">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Layers className="h-4 w-4 text-primary" aria-hidden />
              </div>
              <p className="font-semibold text-[var(--theme-heading-text)]">{t("home.trust.why3Title")}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t("home.trust.why3Body")}</p>
            </li>
          </ul>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">{t("home.trust.urgencyLine")}</p>
      </div>
    </section>
  );
}
