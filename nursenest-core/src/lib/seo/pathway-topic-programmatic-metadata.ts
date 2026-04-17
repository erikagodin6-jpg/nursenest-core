import type { Metadata } from "next";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { examPathwayTopicRegionalHreflang } from "@/lib/seo/exam-pathway-hub-alternates";
import type { SeoPageDefinition } from "@/lib/seo/programmatic-registry";
import { absoluteUrl } from "@/lib/seo/site-origin";

/**
 * Canonical + regional hreflang for hub-nested programmatic pages (`/{country}/{role}/{exam}/{seoSlug}`).
 * Does **not** emit global marketing-locale alternates (`/fr/…`, …) — those are not valid routes for this URL tree.
 */
export function buildPathwayTopicProgrammaticMetadata(
  page: SeoPageDefinition,
  pathway: ExamPathwayDefinition,
  topicSegment: string,
): Metadata {
  const enPath = buildExamPathwayPath(pathway, topicSegment);
  const canonical = absoluteUrl(enPath);
  const languages = examPathwayTopicRegionalHreflang(pathway, topicSegment);
  return {
    title: page.title,
    description: page.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      type: "article",
    },
  };
}
