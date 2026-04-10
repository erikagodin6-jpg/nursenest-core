"use client";

import { useMarketingI18n } from "@/lib/marketing-i18n";

const MODULE_IDS = [
  "nclexRn",
  "nclexPn",
  "rexPn",
  "np",
  "flashcards",
  "medMath",
  "weakArea",
] as const;

/**
 * Static study examples (not a live feed). Follows the testimonials block.
 */
export function HomeStudentsStudyingSection() {
  const { t } = useMarketingI18n();

  return (
    <section
      className="border-t border-[var(--trust-surface-border)] bg-[var(--trust-surface)] pt-7 pb-10 md:pt-9 md:pb-12"
      aria-labelledby="home-students-studying-heading"
      data-testid="section-home-students-studying"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-6 max-w-3xl text-center md:mb-8">
          <h2 id="home-students-studying-heading" className="nn-marketing-h2 text-balance">
            {t("home.landing.studentsStudying.title")}
          </h2>
          <p className="nn-marketing-body mx-auto mt-2 max-w-2xl text-pretty text-[var(--theme-muted-text)]">
            {t("home.landing.studentsStudying.sub")}
          </p>
        </header>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MODULE_IDS.map((id) => (
            <li
              key={id}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--nn-presentation-ribbon)] px-4 py-3.5 text-left shadow-sm"
            >
              <p className="nn-marketing-body-sm font-medium text-[var(--theme-heading-text)]">
                {t(`home.landing.studentsStudying.${id}.title`)}
              </p>
              <p className="nn-marketing-caption mt-1.5 text-[var(--theme-muted-text)]">
                {t(`home.landing.studentsStudying.${id}.body`)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
