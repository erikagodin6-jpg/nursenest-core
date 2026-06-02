import type { Metadata } from "next";
import Link from "next/link";
import {
  listPublishedNursingMechanismClusters,
  NURSING_MECHANISM_CANONICAL_BASE_PATH,
  nursingMechanismCanonicalPath,
} from "@/lib/seo/nursing-mechanism-clusters";
import { seoPageMetadata } from "@/lib/seo/marketing-metadata";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const published = listPublishedNursingMechanismClusters();
  return seoPageMetadata({
    title: "Nursing Mechanism Explainers | NurseNest",
    description: "Mechanism-first nursing explainers for clinical interpretation, labs, ABGs, fluids, electrolytes, and exam reasoning.",
    path: NURSING_MECHANISM_CANONICAL_BASE_PATH,
    robots: published.length > 0 ? undefined : { index: false, follow: true },
  });
}

export default function NursingMechanismIndexPage() {
  const published = listPublishedNursingMechanismClusters();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Clinical interpretation</p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
          Nursing mechanism explainers
        </h1>
        <p className="max-w-3xl leading-7 text-[var(--theme-body-text)]">
          Mechanism-first nursing articles are staged here only after editorial completion. Draft and hidden explainers stay out of public indexing.
        </p>
      </header>

      {published.length > 0 ? (
        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          {published.map((cluster) => (
            <Link key={cluster.slug} href={nursingMechanismCanonicalPath(cluster)} className="rounded-lg border p-4 hover:underline">
              <span className="block text-sm font-medium text-primary">{cluster.topicArea}</span>
              <span className="mt-2 block font-semibold text-[var(--theme-heading-text)]">{cluster.suggestedTitle}</span>
            </Link>
          ))}
        </section>
      ) : null}
    </main>
  );
}
