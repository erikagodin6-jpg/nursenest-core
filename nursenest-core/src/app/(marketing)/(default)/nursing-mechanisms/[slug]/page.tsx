import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNursingMechanismExplainerDraft } from "@/content/nursing-mechanism-explainers";
import {
  buildNursingMechanismBreadcrumbJsonLd,
  getNursingMechanismClusterBySlug,
  nursingMechanismCanonicalPath,
} from "@/lib/seo/nursing-mechanism-clusters";
import { seoPageMetadata } from "@/lib/seo/marketing-metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cluster = getNursingMechanismClusterBySlug(slug);
  const draft = getNursingMechanismExplainerDraft(slug);

  if (!cluster || cluster.status !== "published" || !draft || draft.status !== "published") {
    return {
      title: "Nursing mechanism explainer unavailable | NurseNest",
      robots: { index: false, follow: false },
    };
  }

  return seoPageMetadata({
    title: draft.metaTitle,
    description: draft.metaDescription,
    path: nursingMechanismCanonicalPath(cluster),
    ogType: "article",
  });
}

export default async function NursingMechanismExplainerPage({ params }: Props) {
  const { slug } = await params;
  const cluster = getNursingMechanismClusterBySlug(slug);
  const draft = getNursingMechanismExplainerDraft(slug);

  if (!cluster || cluster.status !== "published" || !draft || draft.status !== "published") {
    notFound();
  }

  const breadcrumbJsonLd = buildNursingMechanismBreadcrumbJsonLd(cluster);

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="hover:underline">Home</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/nursing-mechanisms" className="hover:underline">Nursing mechanisms</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">{draft.h1}</li>
        </ol>
      </nav>

      <header className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">{cluster.topicArea}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
          {draft.h1}
        </h1>
        <p className="text-lg leading-8 text-[var(--theme-body-text)]">{draft.clinicalSummary}</p>
      </header>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl font-semibold text-[var(--theme-heading-text)]">Mechanism explanation</h2>
        {draft.mechanismExplanation.map((paragraph) => (
          <p key={paragraph} className="leading-7 text-[var(--theme-body-text)]">{paragraph}</p>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-[var(--theme-heading-text)]">Nursing assessment implications</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-[var(--theme-body-text)]">
          {draft.nursingImplications.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-[var(--theme-heading-text)]">Exam-style pearls</h2>
        <p className="mt-4 leading-7 text-[var(--theme-body-text)]">{draft.examRelevance}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-[var(--theme-heading-text)]">Common mistakes</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-[var(--theme-body-text)]">
          {draft.commonMisconceptions.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-[var(--theme-heading-text)]">Practice prompts</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-[var(--theme-body-text)]">
          {cluster.relatedPracticeCatHooks.map((href) => (
            <li key={href}>
              <Link href={href} className="font-medium text-primary hover:underline">{href}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link className="rounded-lg border p-4 font-semibold text-primary hover:underline" href={draft.practiceCta.href}>
          {draft.practiceCta.label}
        </Link>
        <Link className="rounded-lg border p-4 font-semibold text-primary hover:underline" href={draft.relatedLessonsCta.href}>
          {draft.relatedLessonsCta.label}
        </Link>
      </section>
    </article>
  );
}
