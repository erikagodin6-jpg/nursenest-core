"use client";

import Link from "next/link";
import { BookOpen, ClipboardCheck, Layers, LineChart, Stethoscope } from "lucide-react";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import type { NursenestMarketingRegion } from "@/lib/marketing/home-hero-gateway-config";
import { HUB, loginWithCallback, rnQuestions } from "@/lib/marketing/marketing-entry-routes";

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
                  <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">{t(feat.titleKey)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]">{t(feat.bodyKey)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href={loc(rnQuestions(region))}
            className="nn-btn-primary inline-flex min-h-[44px] items-center justify-center px-6 py-2.5 text-sm font-semibold sm:min-h-0"
          >
            {t("home.featuresStack.ctaQuestions")}
          </Link>
          <Link href={loc(HUB.pricing)} className="nn-btn-secondary inline-flex min-h-[44px] items-center justify-center px-6 py-2.5 text-sm font-semibold sm:min-h-0">
            {t("home.featuresStack.ctaPricing")}
          </Link>
          <Link
            href={loc(loginWithCallback(rnQuestions(region)))}
            className="nn-link-quiet text-center text-sm sm:ml-1 sm:text-left"
          >
            {t("home.featuresStack.ctaSignIn")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
