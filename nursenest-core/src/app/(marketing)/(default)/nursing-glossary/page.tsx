import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbsFromResolution } from "@/components/navigation/breadcrumbs";
import { resolveBreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-resolver";
import { listNursingGlossaryTerms } from "@/lib/seo/nursing-glossary-registry";
import { seoPageMetadata } from "@/lib/seo/marketing-metadata";

const GLOSSARY_HUB_PATH = "/nursing-glossary";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return seoPageMetadata({
    title: "Nursing Glossary — High-Yield Clinical Terms | NurseNest",
    description:
      "Canonical nursing definitions for exam prep: preload, sepsis, DKA, ABG terms, and more — each linked into lessons and practice topics.",
    path: GLOSSARY_HUB_PATH,
  });
}

export default function NursingGlossaryHubPage() {
  const terms = listNursingGlossaryTerms().sort((a, b) => a.term.localeCompare(b.term));

  const breadcrumbs = resolveBreadcrumbResolution({ kind: "nursing-glossary-hub" });

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <BreadcrumbsFromResolution resolution={breadcrumbs} pathname={GLOSSARY_HUB_PATH} className="mb-6" />
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Reference</p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
          Nursing glossary
        </h1>
        <p className="leading-7 text-[var(--theme-body-text)]">
          High-yield terms with clinically reviewed definitions. Each entry links into the lesson and practice graph by
          topic — not isolated dictionary pages.
        </p>
      </header>
      <ul className="mt-10 columns-1 gap-x-8 sm:columns-2">
        {terms.map((t) => (
          <li key={t.slug} className="mb-3 break-inside-avoid">
            <Link href={`${GLOSSARY_HUB_PATH}/${t.slug}`} className="font-medium text-primary hover:underline">
              {t.term}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
