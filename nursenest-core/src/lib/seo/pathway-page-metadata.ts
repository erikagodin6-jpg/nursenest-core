import type { Metadata } from "next";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { absoluteUrl } from "@/lib/seo/site-origin";

function truncateMeta(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

export function pathwayLessonsHubMetadata(pathway: ExamPathwayDefinition): Metadata {
  const path = buildExamPathwayPath(pathway, "lessons");
  const canonical = absoluteUrl(path);
  const title = `Lessons · ${pathway.displayName} | NurseNest`;
  const description = truncateMeta(
    `Exam-scoped lesson hub for ${pathway.shortName}. ${pathway.seoDescription}`,
    158,
  );
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website" },
  };
}

export function pathwayTopicClusterMetadata(
  pathway: ExamPathwayDefinition,
  topicLabel: string,
  topicSlug: string,
): Metadata {
  const path = buildExamPathwayPath(pathway, `lessons/topics/${topicSlug}`);
  const canonical = absoluteUrl(path);
  const title = `${topicLabel} · ${pathway.shortName} lessons | NurseNest`;
  const description = truncateMeta(
    `${topicLabel} lessons for ${pathway.displayName}. Clinical topics scoped to ${pathway.countryCode} and this exam track.`,
    158,
  );
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website" },
  };
}

export function pathwayQuestionsHubMetadata(pathway: ExamPathwayDefinition): Metadata {
  const path = buildExamPathwayPath(pathway, "questions");
  const canonical = absoluteUrl(path);
  const title = `${pathway.shortName} question bank · ${pathway.displayName} | NurseNest`;
  const description = truncateMeta(
    `Pathway-scoped practice questions for ${pathway.displayName}. Filters match your subscription region and tier.`,
    158,
  );
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website" },
  };
}

export function pathwayPricingChildMetadata(pathway: ExamPathwayDefinition): Metadata {
  const path = buildExamPathwayPath(pathway, "pricing");
  const canonical = absoluteUrl(path);
  const title = `Plans & pricing · ${pathway.displayName} | NurseNest`;
  const description = truncateMeta(
    `NurseNest subscription options for ${pathway.shortName} in ${pathway.countryCode}. Checkout aligns tier and country with this exam pathway.`,
    158,
  );
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website" },
  };
}
