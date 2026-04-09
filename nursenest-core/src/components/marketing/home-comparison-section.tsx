"use client";

import { useMarketingI18n } from "@/lib/marketing-i18n";

const ROWS = ["clarity", "simplicity", "adaptive", "integrated", "guided", "readiness"] as const;
const HIGHLIGHT_ROWS = new Set<typeof ROWS[number]>(["guided", "readiness"]);

/**
 * Explicit comparison vs typical high-volume question banks: concrete product-shape differences
 * (integrated rail, CAT, readiness signals)—not vague “we’re the best” claims.
 */
export function HomeComparisonSection() {
  const { t } = useMarketingI18n();

  return (
    <section
      className="nn-section-soft border-b border-[var(--border-subtle)] py-12 md:py-16"
      aria-labelledby="home-comparison-heading"
      data-testid="section-home-comparison"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-8 max-w-3xl md:mb-10">
          <h2 id="home-comparison-heading" className="nn-marketing-h2 text-balance text-[var(--theme-heading-text)]">
            {t("home.comparison.title")}
          </h2>
          <p className="nn-marketing-body mx-auto mt-3 max-w-3xl text-pretty text-[var(--theme-muted-text)]">
            {t("home.comparison.sub")}
          </p>
          <p className="nn-marketing-caption mt-3 text-[var(--theme-muted-text)]">{t("home.comparison.disclaimer")}</p>
        </header>

        <div className="hidden md:block overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] shadow-sm">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--nn-presentation-wash)]">
                <th scope="col" className="px-4 py-3 font-semibold text-[var(--theme-heading-text)] sm:px-5">
                  {t("home.comparison.colDimension")}
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-[var(--theme-muted-text)] sm:px-5">
                  {t("home.comparison.colTypical")}
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-primary sm:px-5">
                  {t("home.comparison.colNn")}
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const hi = HIGHLIGHT_ROWS.has(row);
                return (
                  <tr
                    key={row}
                    className={`border-b border-[var(--border-subtle)] last:border-b-0 ${
                      hi ? "bg-[color-mix(in_srgb,var(--theme-primary)_6%,var(--theme-card-bg))]" : ""
                    }`}
                  >
                    <th scope="row" className="align-top px-4 py-3.5 font-semibold text-[var(--theme-heading-text)] sm:px-5">
                      {t(`home.comparison.row.${row}.label`)}
                    </th>
                    <td className="align-top px-4 py-3.5 text-[var(--theme-body-text)] sm:px-5">
                      {t(`home.comparison.row.${row}.typical`)}
                    </td>
                    <td className="align-top px-4 py-3.5 text-[var(--theme-body-text)] sm:px-5">
                      {t(`home.comparison.row.${row}.nn`)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <ul className="flex flex-col gap-4 md:hidden">
          {ROWS.map((row) => {
            const hi = HIGHLIGHT_ROWS.has(row);
            return (
              <li
                key={row}
                className={`rounded-2xl border border-[var(--border-subtle)] p-4 ${
                  hi ? "border-primary/30 bg-[color-mix(in_srgb,var(--theme-primary)_6%,var(--theme-card-bg))]" : "bg-[var(--theme-card-bg)]"
                }`}
              >
                <p className="nn-marketing-h4 text-[var(--theme-heading-text)]">{t(`home.comparison.row.${row}.label`)}</p>
                <p className="nn-marketing-caption mt-2 font-medium text-[var(--theme-muted-text)]">{t("home.comparison.colTypical")}</p>
                <p className="nn-marketing-body-sm mt-1 text-[var(--theme-body-text)]">{t(`home.comparison.row.${row}.typical`)}</p>
                <p className="nn-marketing-caption mt-3 font-medium text-primary">{t("home.comparison.colNn")}</p>
                <p className="nn-marketing-body-sm mt-1 text-[var(--theme-body-text)]">{t(`home.comparison.row.${row}.nn`)}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
