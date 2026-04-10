"use client";

import { useMarketingI18n } from "@/lib/marketing-i18n";

/**
 * Soft friction-reduction band: what is free vs paid, without aggressive sales tone.
 */
export function HomeConversionFreeAccessBand() {
  const { t } = useMarketingI18n();

  return (
    <section
      className="border-b border-[var(--accent-surface-b-border)] bg-[var(--accent-surface-b)] py-8 md:py-10"
      aria-labelledby="home-free-access-heading"
      data-testid="section-home-free-access"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 id="home-free-access-heading" className="nn-marketing-h3 text-balance text-[var(--theme-heading-text)]">
          {t("home.conversion.freeAccess.title")}
        </h2>
        <p className="nn-marketing-body-sm mx-auto mt-3 max-w-2xl text-pretty text-[var(--theme-body-text)]">
          {t("home.conversion.freeAccess.body")}
        </p>
        <p className="nn-marketing-caption mx-auto mt-3 max-w-xl text-pretty text-[var(--theme-muted-text)]">
          {t("home.conversion.freeAccess.tiersHint")}
        </p>
      </div>
    </section>
  );
}
