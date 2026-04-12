import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { BreadcrumbResolution } from "@/lib/seo/breadcrumb-types";
import type { SeoPageDefinition } from "@/lib/seo/programmatic-registry";

/** Home → pathway hub → current long-tail programmatic page (indexable marketing). */
export function buildPathwayTopicProgrammaticBreadcrumbResolution(
  pathway: ExamPathwayDefinition,
  seoSlug: string,
  page: SeoPageDefinition,
): BreadcrumbResolution {
  const hubPath = buildExamPathwayPath(pathway);
  const selfPath = buildExamPathwayPath(pathway, seoSlug);
  const hubLabel = pathway.shortName;
  return {
    crumbs: [
      { name: "Home", href: "/" },
      { name: hubLabel, href: hubPath },
      { name: page.h1, href: undefined },
    ],
    schemaItems: [
      { name: "Home", item: "/" },
      { name: hubLabel, item: hubPath },
      { name: page.h1, item: selfPath },
    ],
  };
}
