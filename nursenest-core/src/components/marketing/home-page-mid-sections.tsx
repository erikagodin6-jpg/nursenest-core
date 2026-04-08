"use client";

import { memo } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Brain, ClipboardList, Stethoscope, Target } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import type { HomepageLessonTeaser } from "@/lib/marketing/homepage-lesson-teasers";

const MemoLessonTeaserGrid = memo(function MemoLessonTeaserGrid({ items }: { items: HomepageLessonTeaser[] }) {
  const { t, locale } = useMarketingI18n();
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={withMarketingLocale(locale, item.lessonsHref)}
            className="nn-marketing-card nn-marketing-card-pad flex h-full flex-col transition hover:border-primary/35 hover:bg-[var(--surface-interactive-hover)]"
          >
            <span className="nn-marketing-label nn-marketing-label--accent">{item.shortLabel}</span>
            <span className="mt-1 text-sm font-semibold text-[var(--theme-heading-text)]">{item.title}</span>
            <span className="mt-3 text-xs font-medium text-primary">{t("home.lessons.lessonHubCta")}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
});

type Props = { lessonTeasers: HomepageLessonTeaser[] };

/**
 * Benefits grid + lesson teaser strip — below hero tail, deferred from the main homepage chunk.
 */
export default function HomePageMidSections({ lessonTeasers }: Props) {
  const { t, locale } = useMarketingI18n();

  return (
    <>
      <section
        className="border-t border-[var(--border-subtle)] bg-[var(--nn-presentation-trust-band)]"
        style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
        data-testid="section-hero-benefits"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="nn-marketing-h2 mb-5 text-center sm:mb-6" data-testid="text-benefits-heading">
            {t("home.hero.benefitsHeading")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {(
              [
                { key: "benefit1", icon: Stethoscope },
                { key: "benefit2", icon: Brain },
                { key: "benefit3", icon: ClipboardList },
                { key: "benefit4", icon: Target },
              ] as const
            ).map((item) => (
              <div
                key={item.key}
                className="nn-marketing-card nn-marketing-card-pad flex items-start gap-3"
                data-testid={`hero-${item.key}`}
              >
                <div className="nn-accent-icon-wrap mt-0.5 h-8 w-8 shrink-0">
                  <item.icon className="nn-accent-icon h-4 w-4" />
                </div>
                <p className="text-sm leading-relaxed text-[var(--theme-body-text)]">{t(`home.hero.${item.key}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-t border-[var(--border-subtle)] bg-[var(--nn-presentation-wash)]"
        style={{ paddingTop: "var(--space-block)", paddingBottom: "var(--space-block)" }}
        data-testid="section-start-lessons"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="nn-marketing-h2">{t("home.lessons.title")}</h2>
              <p className="nn-marketing-lead mt-1 max-w-xl text-[var(--theme-muted-text)]">{t("home.lessons.subtitle")}</p>
            </div>
            <Link
              href={withMarketingLocale(locale, "/exam-lessons")}
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              <BookOpen className="h-4 w-4" />
              {t("home.lessons.allPathwaysCta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <MemoLessonTeaserGrid items={lessonTeasers} />
        </div>
      </section>
    </>
  );
}
