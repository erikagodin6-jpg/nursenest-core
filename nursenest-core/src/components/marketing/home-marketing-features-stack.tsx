"use client";

import Link from "next/link";
import { BookOpen, ClipboardCheck, Layers, LineChart, Stethoscope } from "lucide-react";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import type { NursenestMarketingRegion } from "@/lib/marketing/home-hero-gateway-config";
import { HUB, loginWithCallback, rnQuestions } from "@/lib/marketing/marketing-entry-routes";

type Props = { region: NursenestMarketingRegion };

const FEATURES = [
  { icon: Stethoscope, titleKey: "home.featuresStack.questionBankTitle", bodyKey: "home.featuresStack.questionBankBody" },
  { icon: BookOpen, titleKey: "home.featuresStack.lessonsTitle", bodyKey: "home.featuresStack.lessonsBody" },
  { icon: Layers, titleKey: "home.featuresStack.flashcardsTitle", bodyKey: "home.featuresStack.flashcardsBody" },
  { icon: ClipboardCheck, titleKey: "home.featuresStack.plannerTitle", bodyKey: "home.featuresStack.plannerBody" },
  { icon: LineChart, titleKey: "home.featuresStack.readinessTitle", bodyKey: "home.featuresStack.readinessBody" },
] as const;

export function HomeMarketingFeaturesStack({ region }: Props) {
  const { t, locale } = useMarketingI18n();
  const loc = (h: string) => withMarketingLocale(locale, h);

  return (
    <section
      className="border-t border-[var(--theme-card-border)] bg-[var(--theme-page-bg)]"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-marketing-features-stack"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-xl font-bold text-[var(--theme-heading-text)] sm:text-2xl">{t("home.featuresStack.title")}</h2>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">{t("home.featuresStack.lead")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feat) => (
            <div
              key={feat.titleKey}
              className="flex flex-col rounded-2xl border border-[var(--theme-card-border)] bg-card p-5 shadow-sm"
            >
              <feat.icon className="h-5 w-5 text-primary" aria-hidden />
              <h3 className="mt-3 text-base font-bold text-[var(--theme-heading-text)]">{t(feat.titleKey)}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--theme-body-text)]">{t(feat.bodyKey)}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={loc(rnQuestions(region))}
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:brightness-110"
          >
            {t("home.featuresStack.ctaQuestions")}
          </Link>
          <Link
            href={loc(HUB.pricing)}
            className="inline-flex items-center rounded-full border border-[var(--theme-card-border)] bg-card px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)] hover:border-primary/35"
          >
            {t("home.featuresStack.ctaPricing")}
          </Link>
          <Link
            href={loc(loginWithCallback(rnQuestions(region)))}
            className="inline-flex items-center rounded-full border border-dashed border-primary/30 bg-primary/[0.04] px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
          >
            {t("home.featuresStack.ctaSignIn")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
