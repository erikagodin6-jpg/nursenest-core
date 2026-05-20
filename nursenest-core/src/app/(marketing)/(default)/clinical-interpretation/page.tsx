import type { Metadata } from "next";
import Link from "next/link";
import {
  CLINICAL_INTERPRETATION_HUB_PATH,
  clinicalInterpretationGuidePath,
  listPublishedClinicalInterpretationGuides,
} from "@/lib/clinical-interpretation/clinical-interpretation-registry";
import { seoPageMetadata } from "@/lib/seo/marketing-metadata";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const published = listPublishedClinicalInterpretationGuides();
  return seoPageMetadata({
    title: "Clinical Interpretation Guides for Nurses | NurseNest",
    description:
      "Stepwise nursing interpretation guides for ABGs, electrolytes, sepsis signals, and related labs — linked to lessons, practice, and remediation.",
    path: CLINICAL_INTERPRETATION_HUB_PATH,
    robots: published.length > 0 ? undefined : { index: false, follow: true },
  });
}

export default function ClinicalInterpretationHubPage() {
  const guides = listPublishedClinicalInterpretationGuides();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Clinical interpretation</p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
          Interpretation guides
        </h1>
        <p className="max-w-3xl leading-7 text-[var(--theme-body-text)]">
          Bounded reference frameworks for high-stakes nursing interpretation — each guide links into pathway lessons,
          practice questions, and the broader study graph.
        </p>
      </header>
      {guides.length > 0 ? (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {guides.map((g) => (
            <li key={g.id}>
              <Link
                href={clinicalInterpretationGuidePath(g.slug)}
                className="block rounded-lg border border-[var(--semantic-border-soft)] p-4 hover:underline"
              >
                <span className="block text-sm font-medium text-primary">{g.category.replace(/_/g, " ")}</span>
                <span className="mt-2 block font-semibold text-[var(--theme-heading-text)]">{g.h1}</span>
                <span className="mt-2 block text-sm text-[var(--semantic-text-secondary)]">{g.metaDescription}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
