import Link from "next/link";
import type { ReactNode } from "react";
import { BreadcrumbJsonLd, type BreadcrumbJsonLdInput } from "@/components/seo/breadcrumb-json-ld";

export type PublicStudyLandingBreadcrumb = {
  name: string;
  href?: string;
};

export function PublicStudyLandingLayout({
  breadcrumbs,
  schemaItems,
  children,
}: {
  breadcrumbs: PublicStudyLandingBreadcrumb[];
  schemaItems: BreadcrumbJsonLdInput[];
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <BreadcrumbJsonLd items={schemaItems} />

      <nav className="mb-6 nn-marketing-caption" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <li key={`${item.name}-${index}`} className="contents">
                {index > 0 ? (
                  <span aria-hidden className="text-[var(--theme-muted-text)]">
                    /
                  </span>
                ) : null}
                {isLast || !item.href ? (
                  <span className="font-medium text-[var(--theme-heading-text)]" aria-current={isLast ? "page" : undefined}>
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.href} className="text-[var(--semantic-brand)] hover:underline">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {children}
    </main>
  );
}
