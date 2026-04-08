"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { mapLegacyMarketingHref } from "@/lib/legacy-marketing-routes";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

export default function HomeCareerCta() {
  const router = useRouter();
  const { t } = useMarketingI18n();

  return (
    <section
      className="border-t border-[var(--border-subtle)]"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-career-journey-cta"
    >
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/[0.08] via-primary/[0.04] to-secondary/40 p-8 shadow-[var(--shadow-card)] sm:p-12">
          <div className="nn-accent-soft-ring mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 shadow-[var(--shadow-card)]">
            <ArrowRight className="h-3.5 w-3.5 text-[var(--theme-primary)]" />
            <span className="nn-marketing-label nn-marketing-label--accent">{t("home.career.journeyBadge")}</span>
          </div>
          <h2 className="nn-marketing-h2 mb-3">{t("home.career.journeyTitle")}</h2>
          <p className="nn-marketing-lead mx-auto mb-8 max-w-2xl text-[var(--theme-muted-text)]">{t("home.career.journeySubtitle")}</p>
          <div className="nn-marketing-cta-group justify-center">
            <button
              type="button"
              className={`${MARKETING_PRIMARY_CTA_CLASS} gap-2 shadow-[var(--shadow-card)]`}
              onClick={() => router.push(mapLegacyMarketingHref("/career-journey"))}
              data-testid="button-career-journey-home"
            >
              {t("home.career.exploreJourney")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button
              type="button"
              className={MARKETING_SECONDARY_CTA_CLASS}
              onClick={() => router.push(mapLegacyMarketingHref("/career-journey/nursing"))}
              data-testid="button-career-journey-nursing"
            >
              {t("home.career.rnPath")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
