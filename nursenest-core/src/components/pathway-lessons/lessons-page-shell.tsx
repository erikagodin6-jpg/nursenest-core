import type { ReactNode } from "react";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { LessonsHomeHeader } from "@/components/pathway-lessons/lessons-home-header";
import type { CountrySwitcherOption } from "@/components/pathway-lessons/country-switcher";

export function LessonsPageShell({
  schemaItems,
  eyebrow,
  title,
  description,
  searchBasePath,
  initialQuery,
  countryOptions,
  boardId,
  backHref,
  backLabel,
  children,
  pagination,
}: {
  schemaItems: Array<{ name: string; item: string }>;
  eyebrow: string;
  title: string;
  description: string;
  searchBasePath: string;
  initialQuery?: string;
  countryOptions?: CountrySwitcherOption[];
  boardId?: string;
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
  pagination?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <BreadcrumbJsonLd items={schemaItems} />
      <LessonsHomeHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        searchBasePath={searchBasePath}
        initialQuery={initialQuery}
        countryOptions={countryOptions}
        backHref={backHref}
        backLabel={backLabel}
      />
      <section id={boardId} className="mt-6 scroll-mt-24">
        {children}
      </section>
      {pagination ? <div className="mt-6">{pagination}</div> : null}
    </div>
  );
}
