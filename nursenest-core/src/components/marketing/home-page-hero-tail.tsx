"use client";

import { getEnabledCareers } from "@shared/careers";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { HomeHeroPathGateway } from "@/components/marketing/home-hero-path-gateway";

/**
 * Careers strip + path gateway — below the hero grid, deferred from the main homepage chunk.
 */
export default function HomePageHeroTail() {
  const { t } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const enabledCareers = getEnabledCareers();

  return (
    <>
      <div className="mt-[var(--nn-rhythm-tight-y)] sm:mt-6" data-testid="section-careers-supported">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--theme-body-text)]">
          {t("home.hero.examPrepFor", {
            region: region === "CA" ? t("home.region.ca") : t("home.region.us"),
          })}
        </p>
        <div className="flex flex-wrap gap-2">
          {enabledCareers.slice(0, 8).map((career) => {
            const label = (career.shortName || career.name || "").trim();
            if (!label) return null;
            return (
              <span
                key={career.id}
                className="inline-flex items-center rounded-full border border-[var(--theme-card-border)] bg-card px-3 py-1.5 text-xs font-medium text-[var(--theme-body-text)] shadow-sm"
              >
                {label}
              </span>
            );
          })}
          {enabledCareers.length > 8 && (
            <span className="inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
              {t("home.hero.moreCount", { count: String(enabledCareers.length - 8) })}
            </span>
          )}
        </div>
      </div>

      <HomeHeroPathGateway region={region} />
    </>
  );
}
