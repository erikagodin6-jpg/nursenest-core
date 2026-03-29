import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { buildExamPathwayPath, getExamPathwayByRoute } from "@/lib/exam-pathways/exam-product-registry";
import { getLessonsForTopic, listTopicClusters } from "@/lib/lessons/pathway-lesson-loader";
import { pathwayTopicClusterBreadcrumbs } from "@/lib/seo/pathway-breadcrumbs";

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{ countrySlug: string; roleTrack: string; examCode: string; topicSlug: string }>;
};

export default async function PathwayLessonTopicClusterPage({ params }: Props) {
  const { countrySlug, roleTrack, examCode, topicSlug } = await params;
  const pathway = getExamPathwayByRoute(countrySlug, roleTrack, examCode);
  if (!pathway) notFound();

  const lessons = getLessonsForTopic(pathway.id, topicSlug);
  if (lessons.length === 0) notFound();

  const label = listTopicClusters(pathway.id).find((t) => t.topicSlug === topicSlug)?.label ?? topicSlug;
  const base = buildExamPathwayPath(pathway, "lessons");
  const { crumbs, schemaItems } = pathwayTopicClusterBreadcrumbs(pathway, topicSlug, label);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mb-6">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <Link href={base} className="text-sm font-medium text-primary hover:underline">
        ← All lessons ({pathway.shortName})
      </Link>
      <p className="mt-3 text-xs font-semibold uppercase text-primary">{pathway.displayName}</p>
      <h1 className="mt-2 text-3xl font-extrabold text-[var(--theme-heading-text)]">{label}</h1>
      <p className="mt-3 text-[var(--theme-muted-text)]">
        SEO cluster for {pathway.shortName}: lessons in this topic stay in the {pathway.countryCode} / {pathway.roleTrack}{" "}
        track—no cross-mix with other exams or countries.
      </p>

      <ul className="mt-8 space-y-4">
        {lessons.map((l) => (
          <li key={l.slug} className="nn-card p-4">
            <Link href={`${base}/${l.slug}`} className="text-lg font-semibold text-primary hover:underline">
              {l.title}
            </Link>
            <p className="mt-2 text-sm text-muted">{l.seoDescription}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <Link href={`/app/questions?pathwayId=${encodeURIComponent(pathway.id)}&topic=${encodeURIComponent(l.topic)}`} className="font-semibold text-primary">
                Practice questions (app) →
              </Link>
              <Link href={`${base}/${l.slug}`} className="font-semibold text-muted hover:text-primary">
                Read lesson →
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 nn-card p-4 text-sm text-muted">
        <p>
          <Link href={buildExamPathwayPath(pathway)} className="font-semibold text-primary">
            Exam hub
          </Link>{" "}
          ·{" "}
          <Link href={buildExamPathwayPath(pathway, "questions")} className="font-semibold text-primary">
            Questions
          </Link>
        </p>
      </div>
    </div>
  );
}
