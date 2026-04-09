"use client";

import { BookOpen, ClipboardList, Flag, LayoutDashboard } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { buildExamPathwayPath, getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";

/**
 * Four-step path: Learn → Practice → Track → Pass. Concrete links use the region’s default RN pathway where applicable.
 */
export function HomeHowItWorksSection() {
  const { t, locale } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);

  const rnPathway = getExamPathwayById(region === "US" ? "us-rn-nclex-rn" : "ca-rn-nclex-rn");
  const questionsHref = rnPathway ? loc(buildExamPathwayPath(rnPathway, "questions")) : loc("/us/rn/nclex-rn/questions");
  const lessonsHref = rnPathway ? loc(buildExamPathwayPath(rnPathway, "lessons")) : loc("/us/rn/nclex-rn/lessons");
  const practiceExamsHref = loc(HUB.practiceExams);

  const steps = [
    {
      icon: BookOpen,
      title: t("home.conversion.how.step1Title"),
      body: t("home.conversion.how.step1Body"),
      href: lessonsHref,
      label: t("home.conversion.how.step1Cta"),
      testId: "how-step-learn",
    },
    {
      icon: ClipboardList,
      title: t("home.conversion.how.step2Title"),
      body: t("home.conversion.how.step2Body"),
      href: questionsHref,
      label: t("home.conversion.how.step2Cta"),
      testId: "how-step-practice",
    },
    {
      icon: LayoutDashboard,
      title: t("home.conversion.how.step3Title"),
      body: t("home.conversion.how.step3Body"),
      href: loc(HUB.signup),
      label: t("home.conversion.how.step3Cta"),
      testId: "how-step-track",
    },
    {
      icon: Flag,
      title: t("home.conversion.how.step4Title"),
      body: t("home.conversion.how.step4Body"),
      href: practiceExamsHref,
      label: t("home.conversion.how.step4Cta"),
      testId: "how-step-pass",
    },
  ] as const;

  return (
    <section
      id="home-how-it-works"
      className="scroll-mt-20 border-b border-[var(--border-subtle)] bg-[var(--theme-page-bg)] py-12 md:py-16"
      aria-labelledby="home-how-heading"
      data-testid="section-how-it-works"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <h2 id="home-how-heading" className="nn-marketing-h2 text-balance">
            {t("home.conversion.how.title")}
          </h2>
          <p className="nn-marketing-body mx-auto mt-2 max-w-xl text-pretty text-[var(--theme-muted-text)]">
            {t("home.conversion.how.sub")}
          </p>
        </header>

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.testId} className="nn-card-soft relative flex flex-col p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="nn-accent-icon-wrap flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold tabular-nums text-[var(--theme-primary)]">
                  {i + 1}
                </span>
                <s.icon className="h-6 w-6 text-[color-mix(in_srgb,var(--theme-primary)_85%,var(--theme-heading-text))]" aria-hidden />
              </div>
              <h3 className="nn-marketing-h3 text-balance">{s.title}</h3>
              <p className="nn-marketing-body-sm mt-2 flex-1 text-pretty text-[var(--theme-muted-text)]">{s.body}</p>
              <MarketingTrackedLink
                href={s.href}
                event={PH.marketingHomeExploreHubClick}
                eventProps={{ surface: "how_it_works", step: i + 1, region }}
                className="mt-4 inline-flex text-sm font-semibold text-[var(--theme-primary)] underline-offset-4 hover:underline"
                data-testid={s.testId}
              >
                {s.label}
              </MarketingTrackedLink>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
