"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { HUB, NP, PN, rnQuestions } from "@/lib/marketing/marketing-entry-routes";

export function ProgrammaticPracticeHeroActions({ locale, slug }: { locale: string; slug: string }) {
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);

  const questionsHref =
    slug === "nclex-rn-practice-questions"
      ? loc(rnQuestions(region))
      : slug === "rex-pn-practice-questions"
        ? loc(region === "US" ? PN.usQuestions : PN.caQuestions)
        : loc(region === "US" ? NP.fnpQuestions : NP.caNpQuestions);

  const pricingHref = loc(HUB.pricing);

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Link
        href={questionsHref}
        className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
      >
        Try 5 questions now
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
      <Link
        href={questionsHref}
        className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-6 py-3 text-sm font-semibold text-[var(--theme-body-text)] hover:border-primary/40"
      >
        See your weak areas
      </Link>
      <Link
        href={pricingHref}
        className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/5"
      >
        View plans
      </Link>
      <p className="w-full text-xs font-medium text-muted-foreground sm:pl-1">No account required to start on most banks.</p>
    </div>
  );
}
