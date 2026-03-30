import Link from "next/link";
import { notFound } from "next/navigation";
import { FnpLessonsHub } from "@/components/pathway-lessons/fnp-lessons-hub";
import { NclexPnLessonsHub } from "@/components/pathway-lessons/nclex-pn-lessons-hub";
import { NclexRnLessonsHub } from "@/components/pathway-lessons/nclex-rn-lessons-hub";
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

type Props = { params: Promise<{ locale: string; slug: string; examCode: string }> };

export default async function PathwayLessonsHubPage({ params }: Props) {
  const { locale, slug, examCode } = await params;
  const pathway = getExamPathwayByRoute(locale, slug, examCode);
  if (!pathway) notFound();

  const lessons = getPathwayLessons(pathway.id);
  if (lessons.length === 0) notFound();

  const topics = listTopicClusters(pathway.id);
  const base = buildExamPathwayPath(pathway, "lessons");
  const { crumbs, schemaItems } = pathwayLessonsHubBreadcrumbs(pathway);
  const isNclexRnHub = pathway.id === "us-rn-nclex-rn" || pathway.id === "ca-rn-nclex-rn";
  const nclexRnRegion = pathway.id === "ca-rn-nclex-rn" ? "ca" : "us";
  const isUsNclexPnHub = pathway.id === "us-lpn-nclex-pn";
  const isUsFnpHub = pathway.id === "us-np-fnp";

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
        {isUsNclexPnHub ? (
          <>
            Clinical lessons for US LVN/LPN candidates—organized by NCLEX-PN Client Needs, focused on scope-safe judgment and
            delegation—not textbook lists. Pair each lesson with pathway-scoped questions and CAT practice. Subscription gates
            full lesson depth; previews remain discoverable.
          </>
        ) : isUsFnpHub ? (
          <>
            Advanced-practice lessons for US Family NP candidates—structured for board-style assessment → diagnosis → plan →
            evaluation across the lifespan (prenatal through geriatrics), not RN-level task lists. Pair each lesson with
            case-based questions and exam simulations; subscription gates full lesson depth; previews remain discoverable.
          </>
        ) : isNclexRnHub ? (
          pathway.id === "ca-rn-nclex-rn" ? (
            <>
              Clinical lessons for Canadian RN candidates—written for decision-making and safety, not isolated facts. Content
              follows the NCLEX-RN Client Needs structure below; pair each lesson with pathway-scoped questions and CAT
              practice. Subscription gates full lesson depth; previews remain discoverable.
            </>
          ) : (
            <>
              Clinical lessons for US RN candidates—written for decision-making and safety, not isolated facts. Content follows
              the NCLEX-RN Client Needs structure below; pair each lesson with pathway-scoped questions, adaptive practice, and
              performance feedback—lessons alone are not a full prep pathway. Subscription gates full lesson depth; previews
              remain discoverable.
            </>
          )
        ) : (
          <>
            Exam-scoped clinical lessons for this track only—terminology and scope match{" "}
            {pathway.countrySlug === "canada" ? "Canada" : "United States"} ({pathway.shortName}). Deeper sections unlock with
            a matching subscription; previews stay indexable for discovery.
          </>
        )}
      </p>

      {isUsNclexPnHub ? (
        <NclexPnLessonsHub pathway={pathway} lessons={lessons} lessonsBasePath={base} topicClusters={topics} />
      ) : isUsFnpHub ? (
        <FnpLessonsHub pathway={pathway} lessons={lessons} lessonsBasePath={base} topicClusters={topics} />
      ) : isNclexRnHub ? (
        <NclexRnLessonsHub
          pathway={pathway}
          lessons={lessons}
          lessonsBasePath={base}
          topicClusters={topics}
          region={nclexRnRegion}
        />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
