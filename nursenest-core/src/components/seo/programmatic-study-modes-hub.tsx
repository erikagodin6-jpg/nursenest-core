"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { buildPracticeHubContext } from "@/lib/seo/programmatic-practice-hub";
import { programmaticStudyModesI18nPrefix } from "@/lib/seo/programmatic-study-modes";

type Props = { slug: string; locale: string };

/**
 * Region-aware study mode cards for all unified programmatic practice landings (RN, PN, NP).
 * Copy comes from i18n; URLs from {@link buildPracticeHubContext}.
 */
export function ProgrammaticStudyModesHub({ slug, locale }: Props) {
  const prefix = programmaticStudyModesI18nPrefix(slug);
  const { region } = useNursenestRegion();
  const { t } = useMarketingI18n();

  if (!prefix) return null;

  const hub = buildPracticeHubContext(slug, region, locale);
  const k = (suffix: string) => `${prefix}.${suffix}`;

  const modes = [
    {
      href: hub.ctas.questions,
      titleKey: k("questionBankTitle"),
      descKey: k("questionBankDesc"),
      ctaKey: k("cardCtaQuestions"),
      primary: true,
    },
    {
      href: hub.ctas.lessons,
      titleKey: k("lessonsTitle"),
      descKey: k("lessonsDesc"),
      ctaKey: k("cardCtaLessons"),
      primary: false,
    },
    {
      href: hub.ctas.exams,
      titleKey: k("catTitle"),
      descKey: k("catDesc"),
      ctaKey: k("cardCtaCat"),
      primary: false,
    },
  ] as const;

  const headingId = `programmatic-study-modes-${slug.replace(/[^a-z0-9-]/gi, "")}`;

  return (
    <section className="mb-10 scroll-mt-6" aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="text-xl font-bold tracking-tight text-[var(--theme-body-text)] sm:text-2xl"
      >
        {t(k("heading"))}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]/85 sm:text-base">{t(k("lead"))}</p>
      <ul className="mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:gap-5 md:grid-cols-3">
        {modes.map((mode) => (
          <li key={mode.href}>
            <Link
              href={mode.href}
              className={`flex h-full min-h-[180px] flex-col rounded-2xl border p-5 transition-[border-color,box-shadow] sm:min-h-[200px] ${
                mode.primary
                  ? "border-primary/35 bg-[color-mix(in_srgb,var(--theme-primary)_8%,var(--theme-card-bg))] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] hover:border-primary/55 hover:shadow-md dark:shadow-none"
                  : "border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] hover:border-primary/40 hover:shadow-sm"
              }`}
            >
              <span className="text-base font-semibold text-[var(--theme-heading-text)]">{t(mode.titleKey)}</span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-[var(--theme-body-text)]/88">
                {t(mode.descKey)}
              </span>
              <span className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-primary">
                {t(mode.ctaKey)}
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
