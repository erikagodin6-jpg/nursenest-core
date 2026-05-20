import Link from "next/link";
import { BreadcrumbsFromResolution } from "@/components/navigation/breadcrumbs";
import { resolveBreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-resolver";
import type { ClinicalInterpretationEntry } from "@/lib/clinical-interpretation/clinical-interpretation-registry";
import {
  CLINICAL_INTERPRETATION_HUB_PATH,
  DEFAULT_INTERPRETATION_PATHWAY_ID,
} from "@/lib/clinical-interpretation/clinical-interpretation-registry";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";

type Props = { entry: ClinicalInterpretationEntry };

export function ClinicalInterpretationGuidePage({ entry }: Props) {
  const pathway = getExamPathwayById(DEFAULT_INTERPRETATION_PATHWAY_ID);
  const lessonsHref = pathway ? buildExamPathwayPath(pathway, "lessons") : "/us/rn/nclex-rn/lessons";
  const questionsHref = pathway ? buildExamPathwayPath(pathway, "questions") : "/us/rn/nclex-rn/questions";
  const guidePath = `${CLINICAL_INTERPRETATION_HUB_PATH}/${entry.slug}`;
  const breadcrumbs = resolveBreadcrumbResolution({
    kind: "clinical-interpretation-guide",
    category: entry.category,
    guideTitle: entry.h1,
    guideSlug: entry.slug,
  });

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <BreadcrumbsFromResolution resolution={breadcrumbs} pathname={guidePath} />

      <header className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Clinical interpretation guide</p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">{entry.h1}</h1>
        <p className="text-lg leading-8 text-[var(--theme-body-text)]">{entry.metaDescription}</p>
      </header>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">What nurses should establish first</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-relaxed text-[var(--theme-body-text)]">
          {entry.segmentation.freeHighlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {entry.related.topicSlugs.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-[var(--theme-heading-text)]">Connected study topics</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {entry.related.topicSlugs.map((topic) => (
              <li key={topic}>
                <Link
                  href={`${lessonsHref}?topicSlug=${encodeURIComponent(topic)}`}
                  className="font-medium text-primary hover:underline"
                >
                  {topic.replace(/-/g, " ")} lessons
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10 flex flex-wrap gap-3">
        <Link
          href={questionsHref}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Practice related questions
        </Link>
        <Link
          href={CLINICAL_INTERPRETATION_HUB_PATH}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-card"
        >
          All interpretation guides
        </Link>
      </section>
    </article>
  );
}
