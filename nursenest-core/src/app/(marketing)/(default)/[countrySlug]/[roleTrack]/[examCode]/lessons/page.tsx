import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { buildExamPathwayPath, getExamPathwayByRoute } from "@/lib/exam-pathways/exam-product-registry";
import { listTopicClusters, getPathwayLessons } from "@/lib/lessons/pathway-lesson-loader";
import { pathwayLessonsHubBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ countrySlug: string; roleTrack: string; examCode: string }> };

export default async function PathwayLessonsHubPage({ params }: Props) {
  const { countrySlug, roleTrack, examCode } = await params;
  const pathway = getExamPathwayByRoute(countrySlug, roleTrack, examCode);
  if (!pathway) notFound();

  const lessons = getPathwayLessons(pathway.id);
  if (lessons.length === 0) notFound();

  const topics = listTopicClusters(pathway.id);
  const base = buildExamPathwayPath(pathway, "lessons");
  const { crumbs, schemaItems } = pathwayLessonsHubBreadcrumbs(pathway);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <Link href={buildExamPathwayPath(pathway)} className="text-sm font-medium text-primary hover:underline">
        ← {pathway.shortName} hub
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-[var(--theme-heading-text)]">Lessons · {pathway.displayName}</h1>
      <p className="mt-3 text-[var(--theme-muted-text)]">
        Exam-scoped clinical lessons for this track only—terminology and scope match{" "}
        {pathway.countrySlug === "canada" ? "Canada" : "United States"} ({pathway.shortName}). Deeper sections unlock with a
        matching subscription; previews stay indexable for discovery.
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Browse by system / topic</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {topics.map((t) => (
            <li key={t.topicSlug}>
              <Link
                href={`${base}/topics/${t.topicSlug}`}
                className="inline-flex rounded-full border border-[var(--theme-card-border)] bg-card px-3 py-1.5 text-sm font-medium hover:border-primary/40"
              >
                {t.label} ({t.count})
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">All lessons</h2>
        <ul className="mt-4 space-y-4">
          {lessons.map((l) => (
            <li key={l.slug} className="nn-card p-4">
              <p className="text-xs font-medium uppercase text-muted">{l.topic}</p>
              <Link href={`${base}/${l.slug}`} className="mt-1 block text-lg font-semibold text-primary hover:underline">
                {l.title}
              </Link>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{l.seoDescription}</p>
              <Link href={`${base}/${l.slug}`} className="mt-3 inline-block text-sm font-semibold text-primary">
                Open lesson →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-xl border border-border bg-[var(--theme-muted-surface)] p-4 text-sm text-muted">
        <p className="font-semibold text-foreground">Study loop</p>
        <p className="mt-1">
          Lesson → question bank (same pathway) → timed practice → review rationales → back to the next lesson in a weak
          area.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={buildExamPathwayPath(pathway, "questions")} className="font-semibold text-primary">
            Question bank hub
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/app/questions" className="font-semibold text-primary">
            App question bank
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/app/exams" className="font-semibold text-primary">
            Practice exams
          </Link>
        </div>
      </section>
    </div>
  );
}
