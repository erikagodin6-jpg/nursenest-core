"use client";

import Link from "next/link";
import { BookOpen, ClipboardCheck, Layers, LineChart, Stethoscope } from "lucide-react";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import type { NursenestMarketingRegion } from "@/lib/marketing/home-hero-gateway-config";
import { HUB, loginWithCallback, rnQuestions } from "@/lib/marketing/marketing-entry-routes";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
  MARKETING_TERTIARY_LINK_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

type Props = { region: NursenestMarketingRegion };

const FEATURES = [
  { icon: Stethoscope, titleKey: "home.featuresStack.questionBankTitle", bodyKey: "home.featuresStack.questionBankBody", span: "full" as const },
  { icon: BookOpen, titleKey: "home.featuresStack.lessonsTitle", bodyKey: "home.featuresStack.lessonsBody", span: "half" as const },
  { icon: Layers, titleKey: "home.featuresStack.flashcardsTitle", bodyKey: "home.featuresStack.flashcardsBody", span: "half" as const },
  { icon: ClipboardCheck, titleKey: "home.featuresStack.plannerTitle", bodyKey: "home.featuresStack.plannerBody", span: "wide" as const },
  { icon: LineChart, titleKey: "home.featuresStack.readinessTitle", bodyKey: "home.featuresStack.readinessBody", span: "narrow" as const },
] as const;

function featureSpanClass(span: (typeof FEATURES)[number]["span"]): string {
  switch (span) {
    case "full":
      return "sm:col-span-12";
    case "wide":
      return "sm:col-span-7";
    case "narrow":
      return "sm:col-span-5";
    default:
      return "sm:col-span-6";
  }
}

export function HomeMarketingFeaturesStack({ region }: Props) {
  const { t, locale } = useMarketingI18n();
  const loc = (h: string) => withMarketingLocale(locale, h);

  return (
    <section
      className="border-t border-[var(--divider)] bg-[var(--bg-page)]"
      style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
      data-testid="section-marketing-features-stack"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="nn-marketing-h2">{t("home.featuresStack.title")}</h2>
          <p className="nn-marketing-lead text-[var(--theme-muted-text)]">{t("home.featuresStack.lead")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-12">
          {FEATURES.map((feat) => (
            <div key={feat.titleKey} className={`nn-marketing-card nn-marketing-card-pad ${featureSpanClass(feat.span)}`}>
              <div className="flex items-start gap-3">
                <feat.icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--theme-muted-text)]" aria-hidden />
                <div className="min-w-0">
                  <h3 className="nn-marketing-h4">{t(feat.titleKey)}</h3>
                  <p className="nn-marketing-body-sm mt-2">{t(feat.bodyKey)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="nn-marketing-cta-group mt-10 items-stretch sm:items-center">
          <Link href={loc(rnQuestions(region))} className={MARKETING_PRIMARY_CTA_CLASS}>
            {t("home.featuresStack.ctaQuestions")}
          </Link>
          <Link href={loc(HUB.pricing)} className={MARKETING_SECONDARY_CTA_CLASS}>
            {t("home.featuresStack.ctaPricing")}
          </Link>
          <Link
            href={loc(loginWithCallback(rnQuestions(region)))}
            className={`${MARKETING_TERTIARY_LINK_CLASS} w-full justify-center text-center sm:ml-1 sm:w-auto sm:justify-start sm:text-left`}
          >
            {t("home.featuresStack.ctaSignIn")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
