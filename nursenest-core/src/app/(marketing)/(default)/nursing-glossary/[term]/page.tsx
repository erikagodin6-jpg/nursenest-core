import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbsFromResolution } from "@/components/navigation/breadcrumbs";
import { resolveBreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-resolver";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { DEFAULT_INTERPRETATION_PATHWAY_ID } from "@/lib/clinical-interpretation/clinical-interpretation-registry";
import { GlossaryRelatedTerms } from "@/components/seo/glossary-related-terms";
import { definedTermJsonLd } from "@/lib/educational-graph/structured-data-educational-entities";
import { glossaryGraphMetadataForTerm } from "@/lib/educational-graph/nursing-glossary-governance";
import { buildGlossaryGraphNode, validateGlossaryGraphNode } from "@/lib/educational-graph/glossary-graph-node";
import { captureGraphTelemetryReplayFrame } from "@/lib/breadcrumbs/governance/graph-telemetry-replay";
import { getNursingGlossaryTerm } from "@/lib/seo/nursing-glossary-registry";
import { seoPageMetadata } from "@/lib/seo/marketing-metadata";

const GLOSSARY_HUB_PATH = "/nursing-glossary";

type Props = { params: Promise<{ term: string }> };

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term } = await params;
  const entry = getNursingGlossaryTerm(term);
  if (!entry) return { title: "Glossary term | NurseNest", robots: { index: false, follow: false } };
  return seoPageMetadata({
    title: `${entry.term} — Nursing Glossary | NurseNest`,
    description: entry.definition.slice(0, 155),
    path: `${GLOSSARY_HUB_PATH}/${entry.slug}`,
  });
}

export default async function NursingGlossaryTermPage({ params }: Props) {
  const { term } = await params;
  const entry = getNursingGlossaryTerm(term);
  if (!entry) notFound();

  const pathway = getExamPathwayById(DEFAULT_INTERPRETATION_PATHWAY_ID);
  const lessonsHref = pathway
    ? `${buildExamPathwayPath(pathway, "lessons")}?topicSlug=${encodeURIComponent(entry.topicSlug)}`
    : `/us/rn/nclex-rn/lessons?topicSlug=${encodeURIComponent(entry.topicSlug)}`;
  const questionsHref = pathway
    ? `${buildExamPathwayPath(pathway, "questions")}?topic=${encodeURIComponent(entry.topicSlug)}`
    : `/us/rn/nclex-rn/questions?topic=${encodeURIComponent(entry.topicSlug)}`;

  const related = (entry.relatedTermSlugs ?? [])
    .map((s) => getNursingGlossaryTerm(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const termPath = `${GLOSSARY_HUB_PATH}/${entry.slug}`;
  if (pathway) {
    const glossaryNode = buildGlossaryGraphNode(
      { termSlug: entry.slug, termLabel: entry.term, topicSlug: entry.topicSlug, pathway },
      pathway.id,
    );
    const orphan = validateGlossaryGraphNode(glossaryNode);
    if (orphan && process.env.NODE_ENV === "development") {
      console.warn("[glossary-graph-node]", orphan);
    }
    captureGraphTelemetryReplayFrame({
      kind: "glossary_traversal",
      pathname: termPath,
      pathwayId: pathway.id,
      topicSlug: entry.topicSlug,
      educationalIntent: "glossary",
    });
  }
  const breadcrumbs = pathway
    ? resolveBreadcrumbResolution({
        kind: "nursing-glossary-term",
        pathway,
        termLabel: entry.term,
        termSlug: entry.slug,
        topicSlug: entry.topicSlug,
      })
    : resolveBreadcrumbResolution({
        kind: "glossary-term",
        examLabel: "NCLEX-RN",
        examPath: "/us/rn/nclex-rn",
        termLabel: entry.term,
        termPath,
      });

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <BreadcrumbsFromResolution
        resolution={breadcrumbs}
        pathname={termPath}
        pathwayId={pathway?.id}
        educationalIntent="glossary"
      />
      <h1 className="text-3xl font-semibold text-[var(--theme-heading-text)]">{entry.term}</h1>
      <p className="mt-4 text-lg leading-8 text-[var(--theme-body-text)]">{entry.definition}</p>
      <p className="mt-8 text-sm">
        <Link href={lessonsHref} className="font-semibold text-primary hover:underline">
          Study {entry.topicSlug.replace(/-/g, " ")} lessons
        </Link>
        <span aria-hidden className="mx-2">
          ·
        </span>
        <Link href={questionsHref} className="font-semibold text-primary hover:underline">
          Practice questions
        </Link>
      </p>
      <GlossaryRelatedTerms terms={related} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            definedTermJsonLd(entry, glossaryGraphMetadataForTerm(entry).canonicalHref),
          ),
        }}
      />
    </article>
  );
}
