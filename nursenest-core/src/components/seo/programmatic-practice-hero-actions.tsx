"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { buildPracticeHubContext } from "@/lib/seo/programmatic-practice-hub";

export function ProgrammaticPracticeHeroActions({ locale, slug }: { locale: string; slug: string }) {
  const { region } = useNursenestRegion();
  const hub = buildPracticeHubContext(slug, region, locale);

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Link
        href={hub.ctas.questions}
        className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
      >
        Start practice questions
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
      <Link
        href={hub.ctas.lessons}
        className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] px-6 py-3 text-sm font-semibold text-[var(--theme-body-text)] hover:border-primary/40"
      >
        Study lessons
      </Link>
      <Link
        href={hub.ctas.testBank}
        className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/5"
      >
        Open test bank
      </Link>
      <Link
        href={hub.ctas.exams}
        className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--theme-card-border)] px-6 py-3 text-sm font-semibold text-[var(--theme-body-text)] hover:border-primary/40"
      >
        Take a test (CAT / exams)
      </Link>
      {hub.ctas.studyPlan ? (
        <Link href={hub.ctas.studyPlan} className="inline-flex items-center px-1 text-sm font-semibold text-primary hover:underline">
          Build study plan
        </Link>
      ) : null}
      <p className="w-full text-xs font-medium text-muted-foreground sm:pl-1">Structured hub actions: questions, lessons, test bank, and exams.</p>
    </div>
  );
}
