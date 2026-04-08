"use client";

import { useMarketingI18n } from "@/lib/marketing-i18n";

type Props = {
  questionCount?: number;
  lessonCount?: number;
};

/**
 * Static “report” panels plus optional live counts from `/api/public/home-stats`.
 */
export function HomeMarketingProductProof({ questionCount, lessonCount }: Props) {
  const { t, locale } = useMarketingI18n();
  const q =
    questionCount != null && questionCount > 0 ? questionCount.toLocaleString(locale.replace(/_/g, "-")) : null;
  const l = lessonCount != null && lessonCount > 0 ? lessonCount.toLocaleString(locale.replace(/_/g, "-")) : null;
  const showStatsLine = q != null && l != null;

  return (
    <section
      className="border-t border-[var(--divider)] bg-[var(--bg-page)]"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="home-product-proof-wrap"
      aria-labelledby="home-product-proof-heading"
    >
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h2 id="home-product-proof-heading" className="nn-marketing-h2">
          {t("home.productProof.title")}
        </h2>
        <p className="nn-marketing-lead mt-2 text-[var(--theme-muted-text)]">{t("home.productProof.sub")}</p>
        {showStatsLine ? (
          <p className="nn-marketing-body-sm mt-3 font-medium">
            {t("home.productProof.statsLine", { questions: q!, lessons: l! })}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-12" data-testid="home-product-proof">
        <div className="lg:col-span-7">
          <div className="nn-marketing-card nn-marketing-card-pad">
            <p className="nn-marketing-label">{t("home.productProof.sessionLabel")}</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="nn-marketing-h3 tabular-nums">{t("home.productProof.sessionPctExample")}</p>
                <p className="nn-marketing-caption">{t("home.productProof.sessionSub")}</p>
              </div>
              <span className="rounded-full border border-role-warning-border bg-role-warning-soft px-2.5 py-1 text-[11px] font-semibold text-role-warning-text">
                {t("home.productProof.needsReview")}
              </span>
            </div>
            <dl className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between gap-4 border-t border-[var(--theme-card-border)] pt-2">
                <dt className="text-[var(--theme-muted-text)]">{t("home.productProof.priorityRisk")}</dt>
                <dd className="font-medium text-[var(--theme-heading-text)]">{t("home.productProof.priorityExample")}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--theme-muted-text)]">{t("home.productProof.trend")}</dt>
                <dd className="font-medium text-[var(--role-success-text)]">{t("home.productProof.trendExample")}</dd>
              </div>
            </dl>
            <div className="mt-4 h-16 rounded-lg bg-[var(--theme-muted-surface)] p-2">
              <div className="flex h-full items-end gap-1">
                {[40, 52, 48, 61, 55, 68].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-[color-mix(in_srgb,var(--theme-primary)_32%,var(--theme-muted-surface))]"
                    style={{ height: `${h}%` }}
                    title={`Block ${i + 1}: ${h}%`}
                  />
                ))}
              </div>
            </div>
            <p className="nn-marketing-caption mt-2">{t("home.productProof.chartCaption")}</p>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-5">
          <div className="nn-marketing-card nn-marketing-card-pad">
            <p className="nn-marketing-label">{t("home.productProof.rationaleLabel")}</p>
            <p className="nn-marketing-h4 mt-2">{t("home.productProof.rationaleTitle")}</p>
            <p className="nn-marketing-body-sm mt-2">{t("home.productProof.rationaleBody")}</p>
          </div>
          <div className="nn-marketing-card nn-marketing-card-pad bg-[var(--bg-inset)]">
            <p className="nn-marketing-label">{t("home.productProof.stemLabel")}</p>
            <p className="nn-marketing-body-sm mt-2 italic">{t("home.productProof.stemQuote")}</p>
            <p className="nn-marketing-caption mt-3">{t("home.productProof.stemNote")}</p>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
