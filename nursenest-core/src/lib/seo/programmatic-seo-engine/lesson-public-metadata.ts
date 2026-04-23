import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";
import {
  clampMetaDescription,
  isShoutyOrSpammyTitle,
  isWeakMetaDescription,
  isWeakSeoTitle,
} from "@/lib/seo/programmatic-seo-engine/guardrails";
import type { ProgrammaticDescriptionMerge, ProgrammaticTitleMerge } from "@/lib/seo/programmatic-seo-engine/types";

function lessonTitleAutoCandidate(args: {
  lessonTitle: string;
  topic: string;
  pathway: ExamPathwayDefinition;
}): string {
  const exam = pathwayRegionAwareExamName(args.pathway);
  const place = args.pathway.countrySlug === "canada" ? "Canada" : "United States";
  const stem = args.lessonTitle.trim() || args.topic.trim();
  return `${stem} — ${exam} (${place}) | NurseNest`;
}

function lessonDescriptionAutoCandidate(args: {
  lessonTitle: string;
  topic: string;
  bodySystem: string;
  seoDescription: string;
  pathway: ExamPathwayDefinition;
}): string {
  const exam = pathwayRegionAwareExamName(args.pathway);
  const place = args.pathway.countrySlug === "canada" ? "Canada" : "the United States";
  const base = args.seoDescription.trim();
  if (base.length >= 90 && !isWeakMetaDescription(base, 40)) return base;
  const topic = args.topic.trim();
  const sys = args.bodySystem.trim();
  const title = args.lessonTitle.trim();
  const parts = [
    `${title} for ${exam} candidates in ${place}.`,
    topic ? `Topic focus: ${topic}.` : "",
    sys && sys !== topic ? `Clinical area: ${sys}.` : "",
    "Structured lesson with exam-style emphasis and safety-aware framing.",
  ].filter(Boolean);
  return parts.join(" ");
}

function pathwayLessonKeywords(pathway: ExamPathwayDefinition, lesson: { topic: string; bodySystem: string }): string[] {
  const exam = pathway.shortName;
  const geo = pathway.countrySlug === "canada" ? "Canada" : "United States";
  const tier =
    pathway.roleTrack === "np"
      ? "nurse practitioner"
      : pathway.roleTrack === "lpn" || pathway.roleTrack === "rpn"
        ? "practical nursing"
        : "registered nursing";
  const out = [
    exam,
    pathway.displayName,
    lesson.topic,
    lesson.bodySystem,
    geo,
    tier,
    "clinical reasoning",
    "nursing exam prep",
  ]
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean);
  return [...new Set(out)].slice(0, 20);
}

/**
 * Public marketing lesson metadata merge: explicit DB seo fields win when strong;
 * otherwise fill from deterministic templates (CTR-oriented, exam/geo grounded).
 */
export function mergePathwayLessonPublicMetadata(args: {
  pathway: ExamPathwayDefinition;
  lesson: {
    title: string;
    topic: string;
    bodySystem: string;
    seoTitle: string;
    seoDescription: string;
  };
}): { title: ProgrammaticTitleMerge; description: ProgrammaticDescriptionMerge; keywords: string[] } {
  const manualTitle = args.lesson.seoTitle.trim();
  const manualDesc = args.lesson.seoDescription.trim();
  const autoTitle = lessonTitleAutoCandidate({
    lessonTitle: args.lesson.title,
    topic: args.lesson.topic,
    pathway: args.pathway,
  });
  const autoDesc = lessonDescriptionAutoCandidate({
    lessonTitle: args.lesson.title,
    topic: args.lesson.topic,
    bodySystem: args.lesson.bodySystem,
    seoDescription: args.lesson.seoDescription,
    pathway: args.pathway,
  });

  const title =
    !isWeakSeoTitle(manualTitle, 8) && !isShoutyOrSpammyTitle(manualTitle)
      ? { title: manualTitle.slice(0, 110), source: "manual" as const }
      : { title: autoTitle.slice(0, 110), source: "auto" as const };

  const description: ProgrammaticDescriptionMerge = !isWeakMetaDescription(manualDesc)
    ? { description: clampMetaDescription(manualDesc), source: "manual" }
    : { description: clampMetaDescription(autoDesc), source: "auto" };

  return {
    title,
    description,
    keywords: pathwayLessonKeywords(args.pathway, {
      topic: args.lesson.topic,
      bodySystem: args.lesson.bodySystem,
    }),
  };
}
