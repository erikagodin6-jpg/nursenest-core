"use client";

import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { buildPracticeHubContext } from "@/lib/seo/programmatic-practice-hub";

export function ProgrammaticPracticeDynamicHeader({
  slug,
  locale,
  fallbackTitle,
  fallbackLead,
}: {
  slug: string;
  locale: string;
  fallbackTitle: string;
  fallbackLead: string;
}) {
  const { region } = useNursenestRegion();
  const hub = buildPracticeHubContext(slug, region, locale);
  return (
    <>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--theme-body-text)] sm:text-4xl">
        {hub.examLabel || fallbackTitle}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-[var(--theme-body-text)]/90">{hub.lead || fallbackLead}</p>
    </>
  );
}

