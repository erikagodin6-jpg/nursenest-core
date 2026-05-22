/**
 * Canonical breadcrumb resolver — surface-derived intent (callers must not pass intent).
 */

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type {
  BreadcrumbCrumb,
  BreadcrumbResolution,
  BreadcrumbSchemaItem,
  PathwayLessonCategoryBreadcrumb,
} from "@/lib/breadcrumbs/breadcrumb-types";
import { intentEmitsBreadcrumbSchema } from "@/lib/breadcrumbs/breadcrumb-intent";
import {
  pathwayLessonDetailEducationBreadcrumbs,
  pathwayLessonsCategoryEducationBreadcrumbs,
  pathwayLessonsHubEducationBreadcrumbs,
  pathwayTopicClusterEducationBreadcrumbs,
  learnerPathwayLessonEducationBreadcrumbs,
} from "@/lib/breadcrumbs/pathway-education-breadcrumbs";
import {
  ecgHubBreadcrumbs,
  ecgTopicBreadcrumbs,
  ecgAdvancedHubBreadcrumbs,
  ecgAdvancedLeafBreadcrumbs,
  ecgStandaloneLeafBreadcrumbs,
  labsHubBreadcrumbs,
  labsClinicalModuleLeafBreadcrumbs,
  labsHubChildBreadcrumbs,
} from "@/lib/breadcrumbs/academy-breadcrumbs";
import {
  clinicalInterpretationGuideBreadcrumbs,
  clinicalInterpretationHubBreadcrumbs,
} from "@/lib/breadcrumbs/clinical-interpretation-breadcrumbs";
import type { ClinicalInterpretationCategory } from "@/lib/clinical-interpretation/clinical-interpretation-registry";
import {
  glossaryIndexBreadcrumbs,
  glossaryTermBreadcrumbs,
  nursingGlossaryHubBreadcrumbs,
  nursingGlossaryTermBreadcrumbs,
} from "@/lib/breadcrumbs/glossary-breadcrumbs";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { PathwayMarketingHubBreadcrumbOpts } from "@/lib/seo/pathway-breadcrumbs";
import { displayCategoryForPathwayMarketingHubLesson } from "@/lib/lessons/marketing-lessons-hub-category";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { caseStudiesBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import {
  applyGovernedBreadcrumbResolution,
  type GovernedBreadcrumbResolution,
} from "@/lib/breadcrumbs/governed-breadcrumb-resolution";
import {
  resolveSurfaceFromResolverKind,
  type BreadcrumbSurface,
} from "@/lib/breadcrumbs/breadcrumb-surface";
export type ResolvePathwayLessonDetailBreadcrumbsInput = {
  kind: "pathway-lesson-detail";
  pathway: ExamPathwayDefinition;
  lesson: Pick<PathwayLessonRecord, "slug" | "title" | "topic">;
  lessonTitleDisplay: string;
  opts?: PathwayMarketingHubBreadcrumbOpts;
};

export type ResolvePathwayCategoryBreadcrumbsInput = {
  kind: "pathway-lessons-category";
  pathway: ExamPathwayDefinition;
  category: PathwayLessonCategoryBreadcrumb;
  opts?: PathwayMarketingHubBreadcrumbOpts;
};

export type ResolvePathwayLessonsHubBreadcrumbsInput = {
  kind: "pathway-lessons-hub";
  pathway: ExamPathwayDefinition;
  opts?: PathwayMarketingHubBreadcrumbOpts;
};

export type ResolvePathwayTopicClusterBreadcrumbsInput = {
  kind: "pathway-topic-cluster";
  pathway: ExamPathwayDefinition;
  topicSlug: string;
  topicLabel: string;
  opts?: PathwayMarketingHubBreadcrumbOpts;
};

export type ResolveLearnerPathwayLessonBreadcrumbsInput = {
  kind: "learner-pathway-lesson";
  pathway: ExamPathwayDefinition;
  lesson: Pick<PathwayLessonRecord, "slug" | "title" | "topic">;
  lessonTitleDisplay: string;
};

export type ResolveEcgHubBreadcrumbsInput = { kind: "ecg-hub" };
export type ResolveEcgTopicBreadcrumbsInput = {
  kind: "ecg-topic";
  topicLabel: string;
  topicPath: string;
};
export type ResolveEcgAdvancedHubBreadcrumbsInput = { kind: "ecg-advanced-hub" };
export type ResolveEcgAdvancedLeafBreadcrumbsInput = {
  kind: "ecg-advanced-leaf";
  leafLabel: string;
  leafPath: string;
};
export type ResolveEcgStandaloneLeafBreadcrumbsInput = {
  kind: "ecg-standalone-leaf";
  leafLabel: string;
  leafPath: string;
};
export type ResolveLabsHubBreadcrumbsInput = {
  kind: "labs-hub";
  hubLabel: string;
  hubPath: string;
};
export type ResolveLabsClinicalModuleLeafBreadcrumbsInput = {
  kind: "labs-leaf";
  leafLabel: string;
  leafPath: string;
};
export type ResolveLabsHubChildBreadcrumbsInput = {
  kind: "labs-hub-child";
  hubLabel: string;
  hubPath: string;
  leafLabel: string;
  leafPath: string;
};
export type ResolveGlossaryIndexBreadcrumbsInput = {
  kind: "glossary-index";
  examLabel: string;
  examPath: string;
};
export type ResolveGlossaryTermBreadcrumbsInput = {
  kind: "glossary-term";
  examLabel: string;
  examPath: string;
  termLabel: string;
  termPath: string;
};
export type ResolveNursingGlossaryHubInput = { kind: "nursing-glossary-hub" };
export type ResolveNursingGlossaryTermInput = {
  kind: "nursing-glossary-term";
  pathway: ExamPathwayDefinition;
  termLabel: string;
  termSlug: string;
  topicSlug: string;
};
export type ResolveCaseStudiesBreadcrumbsInput = { kind: "case-studies" };
export type ResolveClinicalInterpretationHubInput = { kind: "clinical-interpretation-hub" };
export type ResolveClinicalInterpretationGuideInput = {
  kind: "clinical-interpretation-guide";
  category: ClinicalInterpretationCategory;
  guideTitle: string;
  guideSlug: string;
};

export type BreadcrumbResolverInput =
  | ResolvePathwayLessonDetailBreadcrumbsInput
  | ResolvePathwayCategoryBreadcrumbsInput
  | ResolvePathwayLessonsHubBreadcrumbsInput
  | ResolvePathwayTopicClusterBreadcrumbsInput
  | ResolveLearnerPathwayLessonBreadcrumbsInput
  | ResolveEcgHubBreadcrumbsInput
  | ResolveEcgTopicBreadcrumbsInput
  | ResolveEcgAdvancedHubBreadcrumbsInput
  | ResolveEcgAdvancedLeafBreadcrumbsInput
  | ResolveEcgStandaloneLeafBreadcrumbsInput
  | ResolveLabsHubBreadcrumbsInput
  | ResolveLabsClinicalModuleLeafBreadcrumbsInput
  | ResolveLabsHubChildBreadcrumbsInput
  | ResolveGlossaryIndexBreadcrumbsInput
  | ResolveGlossaryTermBreadcrumbsInput
  | ResolveNursingGlossaryHubInput
  | ResolveNursingGlossaryTermInput
  | ResolveCaseStudiesBreadcrumbsInput
  | ResolveClinicalInterpretationHubInput
  | ResolveClinicalInterpretationGuideInput;

export function categoryBreadcrumbFromLesson(
  lesson: Pick<PathwayLessonRecord, "slug" | "title" | "topic">,
  pathwayId: string,
): PathwayLessonCategoryBreadcrumb {
  const descriptor = displayCategoryForPathwayMarketingHubLesson(lesson as PathwayLessonRecord, pathwayId);
  return { label: descriptor.label, slug: descriptor.slug };
}

function governPathwayResolution(
  kind: string,
  raw: { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] },
  pathway: ExamPathwayDefinition,
  meta?: { topicSlug?: string; competencyId?: string | null },
): GovernedBreadcrumbResolution {
  const surface = resolveSurfaceFromResolverKind(kind);
  const pathname = buildExamPathwayPath(pathway);
  return applyGovernedBreadcrumbResolution({
    resolution: raw,
    surface,
    pathname,
    canonicalRootId: "lessons",
    topicSlug: meta?.topicSlug,
    competencyId: meta?.competencyId,
  });
}

export function resolveBreadcrumbs(input: BreadcrumbResolverInput): BreadcrumbResolution | BreadcrumbCrumb[] {
  switch (input.kind) {
    case "pathway-lesson-detail": {
      const category = categoryBreadcrumbFromLesson(input.lesson, input.pathway.id);
      return governPathwayResolution(
        input.kind,
        pathwayLessonDetailEducationBreadcrumbs(
          input.pathway,
          input.lesson.slug,
          input.lessonTitleDisplay,
          category,
          input.opts,
        ),
        input.pathway,
        { topicSlug: input.lesson.topic ?? undefined, competencyId: category.slug },
      );
    }
    case "pathway-lessons-category":
      return governPathwayResolution(
        input.kind,
        pathwayLessonsCategoryEducationBreadcrumbs(input.pathway, input.category, input.opts),
        input.pathway,
        { competencyId: input.category.slug },
      );
    case "pathway-lessons-hub":
      return governPathwayResolution(
        input.kind,
        pathwayLessonsHubEducationBreadcrumbs(input.pathway, input.opts),
        input.pathway,
      );
    case "pathway-topic-cluster":
      return governPathwayResolution(
        input.kind,
        pathwayTopicClusterEducationBreadcrumbs(input.pathway, input.topicSlug, input.topicLabel, input.opts),
        input.pathway,
        { topicSlug: input.topicSlug },
      );
    case "learner-pathway-lesson": {
      const category = categoryBreadcrumbFromLesson(input.lesson, input.pathway.id);
      const crumbs = learnerPathwayLessonEducationBreadcrumbs(
        input.pathway,
        input.lessonTitleDisplay,
        category,
      );
      return applyGovernedBreadcrumbResolution({
        resolution: { crumbs, schemaItems: [] },
        surface: "review_session",
        pathname: `/app/lessons/${input.lesson.slug}`,
        canonicalRootId: "lessons",
        topicSlug: input.lesson.topic ?? undefined,
      });
    }
    case "ecg-hub":
      return ecgHubBreadcrumbs();
    case "ecg-topic":
      return ecgTopicBreadcrumbs(input.topicLabel, input.topicPath);
    case "ecg-advanced-hub":
      return ecgAdvancedHubBreadcrumbs();
    case "ecg-advanced-leaf":
      return ecgAdvancedLeafBreadcrumbs(input.leafLabel, input.leafPath);
    case "ecg-standalone-leaf":
      return ecgStandaloneLeafBreadcrumbs(input.leafLabel, input.leafPath);
    case "labs-hub":
      return labsHubBreadcrumbs(input.hubLabel, input.hubPath);
    case "labs-leaf":
      return labsClinicalModuleLeafBreadcrumbs(input.leafLabel, input.leafPath);
    case "labs-hub-child":
      return labsHubChildBreadcrumbs(input.hubLabel, input.hubPath, input.leafLabel, input.leafPath);
    case "glossary-index":
      return glossaryIndexBreadcrumbs(input.examLabel, input.examPath);
    case "glossary-term":
      return glossaryTermBreadcrumbs(input.examLabel, input.examPath, input.termLabel, input.termPath);
    case "nursing-glossary-hub":
      return nursingGlossaryHubBreadcrumbs();
    case "nursing-glossary-term":
      return nursingGlossaryTermBreadcrumbs({
        pathway: input.pathway,
        termLabel: input.termLabel,
        termSlug: input.termSlug,
        topicSlug: input.topicSlug,
      });
    case "case-studies": {
      const raw = caseStudiesBreadcrumbs();
      return applyGovernedBreadcrumbResolution({
        resolution: raw,
        surface: "case_study",
        pathname: "/case-studies",
        canonicalRootId: "case_studies",
      });
    }
    case "clinical-interpretation-hub":
      return clinicalInterpretationHubBreadcrumbs();
    case "clinical-interpretation-guide":
      return clinicalInterpretationGuideBreadcrumbs({
        category: input.category,
        guideTitle: input.guideTitle,
        guideSlug: input.guideSlug,
      });
    default:
      return applyGovernedBreadcrumbResolution({
        resolution: { crumbs: [], schemaItems: [] },
        surface: "unknown",
        pathname: "/",
      });
  }
}

export function resolveBreadcrumbResolution(input: BreadcrumbResolverInput): BreadcrumbResolution {
  const result = resolveBreadcrumbs(input);
  if (Array.isArray(result)) {
    return applyGovernedBreadcrumbResolution({
      resolution: { crumbs: result, schemaItems: [] },
      surface: resolveSurfaceFromResolverKind(input.kind),
      pathname: "/app",
    });
  }
  return result;
}

/** Whether UI should emit `BreadcrumbJsonLd` for this resolution. */
export function shouldEmitResolverBreadcrumbSchema(resolution: BreadcrumbResolution): boolean {
  const intent = resolution.intent ?? "education";
  return intentEmitsBreadcrumbSchema(intent) && resolution.schemaItems.length > 0;
}

/** @internal re-export for tests */
export { resolveSurfaceFromResolverKind, type BreadcrumbSurface };
