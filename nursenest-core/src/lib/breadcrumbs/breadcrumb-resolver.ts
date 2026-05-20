/**
 * Canonical breadcrumb resolver — explicit intent + single entry for trails/schema.
 */

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type {
  BreadcrumbCrumb,
  BreadcrumbResolution,
  BreadcrumbSchemaItem,
  PathwayLessonCategoryBreadcrumb,
} from "@/lib/breadcrumbs/breadcrumb-types";
import type { BreadcrumbIntent } from "@/lib/breadcrumbs/breadcrumb-intent";
import {
  attachIntentToResolution,
  defaultIntentForResolverKind,
  intentEmitsBreadcrumbSchema,
} from "@/lib/breadcrumbs/breadcrumb-intent";
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
import { glossaryIndexBreadcrumbs, glossaryTermBreadcrumbs } from "@/lib/breadcrumbs/glossary-breadcrumbs";
import type { PathwayMarketingHubBreadcrumbOpts } from "@/lib/seo/pathway-breadcrumbs";
import { displayCategoryForPathwayMarketingHubLesson } from "@/lib/lessons/marketing-lessons-hub-category";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { caseStudiesBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

type ResolverBase = { intent?: BreadcrumbIntent };

export type ResolvePathwayLessonDetailBreadcrumbsInput = ResolverBase & {
  kind: "pathway-lesson-detail";
  pathway: ExamPathwayDefinition;
  lesson: Pick<PathwayLessonRecord, "slug" | "title" | "topic">;
  lessonTitleDisplay: string;
  opts?: PathwayMarketingHubBreadcrumbOpts;
};

export type ResolvePathwayCategoryBreadcrumbsInput = ResolverBase & {
  kind: "pathway-lessons-category";
  pathway: ExamPathwayDefinition;
  category: PathwayLessonCategoryBreadcrumb;
  opts?: PathwayMarketingHubBreadcrumbOpts;
};

export type ResolvePathwayLessonsHubBreadcrumbsInput = ResolverBase & {
  kind: "pathway-lessons-hub";
  pathway: ExamPathwayDefinition;
  opts?: PathwayMarketingHubBreadcrumbOpts;
};

export type ResolvePathwayTopicClusterBreadcrumbsInput = ResolverBase & {
  kind: "pathway-topic-cluster";
  pathway: ExamPathwayDefinition;
  topicSlug: string;
  topicLabel: string;
  opts?: PathwayMarketingHubBreadcrumbOpts;
};

export type ResolveLearnerPathwayLessonBreadcrumbsInput = ResolverBase & {
  kind: "learner-pathway-lesson";
  pathway: ExamPathwayDefinition;
  lesson: Pick<PathwayLessonRecord, "slug" | "title" | "topic">;
  lessonTitleDisplay: string;
};

export type ResolveEcgHubBreadcrumbsInput = ResolverBase & { kind: "ecg-hub" };
export type ResolveEcgTopicBreadcrumbsInput = ResolverBase & {
  kind: "ecg-topic";
  topicLabel: string;
  topicPath: string;
};
export type ResolveEcgAdvancedHubBreadcrumbsInput = ResolverBase & { kind: "ecg-advanced-hub" };
export type ResolveEcgAdvancedLeafBreadcrumbsInput = ResolverBase & {
  kind: "ecg-advanced-leaf";
  leafLabel: string;
  leafPath: string;
};
export type ResolveEcgStandaloneLeafBreadcrumbsInput = ResolverBase & {
  kind: "ecg-standalone-leaf";
  leafLabel: string;
  leafPath: string;
};
export type ResolveLabsHubBreadcrumbsInput = ResolverBase & {
  kind: "labs-hub";
  hubLabel: string;
  hubPath: string;
};
export type ResolveLabsClinicalModuleLeafBreadcrumbsInput = ResolverBase & {
  kind: "labs-leaf";
  leafLabel: string;
  leafPath: string;
};
export type ResolveLabsHubChildBreadcrumbsInput = ResolverBase & {
  kind: "labs-hub-child";
  hubLabel: string;
  hubPath: string;
  leafLabel: string;
  leafPath: string;
};
export type ResolveGlossaryIndexBreadcrumbsInput = ResolverBase & {
  kind: "glossary-index";
  examLabel: string;
  examPath: string;
};
export type ResolveGlossaryTermBreadcrumbsInput = ResolverBase & {
  kind: "glossary-term";
  examLabel: string;
  examPath: string;
  termLabel: string;
  termPath: string;
};
export type ResolveCaseStudiesBreadcrumbsInput = ResolverBase & { kind: "case-studies" };

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
  | ResolveCaseStudiesBreadcrumbsInput;

export function categoryBreadcrumbFromLesson(
  lesson: Pick<PathwayLessonRecord, "slug" | "title" | "topic">,
  pathwayId: string,
): PathwayLessonCategoryBreadcrumb {
  const descriptor = displayCategoryForPathwayMarketingHubLesson(lesson as PathwayLessonRecord, pathwayId);
  return { label: descriptor.label, slug: descriptor.slug };
}

function withIntent(
  resolution: { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] },
  kind: string,
  intent?: BreadcrumbIntent,
): BreadcrumbResolution {
  const resolvedIntent = intent ?? defaultIntentForResolverKind(kind);
  const base = attachIntentToResolution(resolution, resolvedIntent);
  if (!intentEmitsBreadcrumbSchema(resolvedIntent)) {
    return { ...base, schemaItems: [] };
  }
  return base;
}

export function resolveBreadcrumbs(input: BreadcrumbResolverInput): BreadcrumbResolution | BreadcrumbCrumb[] {
  switch (input.kind) {
    case "pathway-lesson-detail": {
      const category = categoryBreadcrumbFromLesson(input.lesson, input.pathway.id);
      return withIntent(
        pathwayLessonDetailEducationBreadcrumbs(
          input.pathway,
          input.lesson.slug,
          input.lessonTitleDisplay,
          category,
          input.opts,
        ),
        input.kind,
        input.intent,
      );
    }
    case "pathway-lessons-category":
      return withIntent(
        pathwayLessonsCategoryEducationBreadcrumbs(input.pathway, input.category, input.opts),
        input.kind,
        input.intent,
      );
    case "pathway-lessons-hub":
      return withIntent(
        pathwayLessonsHubEducationBreadcrumbs(input.pathway, input.opts),
        input.kind,
        input.intent,
      );
    case "pathway-topic-cluster":
      return withIntent(
        pathwayTopicClusterEducationBreadcrumbs(input.pathway, input.topicSlug, input.topicLabel, input.opts),
        input.kind,
        input.intent,
      );
    case "learner-pathway-lesson": {
      const category = categoryBreadcrumbFromLesson(input.lesson, input.pathway.id);
      return learnerPathwayLessonEducationBreadcrumbs(input.pathway, input.lessonTitleDisplay, category);
    }
    case "ecg-hub":
      return withIntent(ecgHubBreadcrumbs(), input.kind, input.intent);
    case "ecg-topic":
      return withIntent(ecgTopicBreadcrumbs(input.topicLabel, input.topicPath), input.kind, input.intent);
    case "ecg-advanced-hub":
      return withIntent(ecgAdvancedHubBreadcrumbs(), input.kind, input.intent);
    case "ecg-advanced-leaf":
      return withIntent(ecgAdvancedLeafBreadcrumbs(input.leafLabel, input.leafPath), input.kind, input.intent);
    case "ecg-standalone-leaf":
      return withIntent(ecgStandaloneLeafBreadcrumbs(input.leafLabel, input.leafPath), input.kind, input.intent);
    case "labs-hub":
      return withIntent(labsHubBreadcrumbs(input.hubLabel, input.hubPath), input.kind, input.intent);
    case "labs-leaf":
      return withIntent(labsClinicalModuleLeafBreadcrumbs(input.leafLabel, input.leafPath), input.kind, input.intent);
    case "labs-hub-child":
      return withIntent(
        labsHubChildBreadcrumbs(input.hubLabel, input.hubPath, input.leafLabel, input.leafPath),
        input.kind,
        input.intent,
      );
    case "glossary-index":
      return withIntent(glossaryIndexBreadcrumbs(input.examLabel, input.examPath), input.kind, input.intent);
    case "glossary-term":
      return withIntent(
        glossaryTermBreadcrumbs(input.examLabel, input.examPath, input.termLabel, input.termPath),
        input.kind,
        input.intent,
      );
    case "case-studies":
      return withIntent(caseStudiesBreadcrumbs(), input.kind, input.intent ?? "education");
    default:
      return { crumbs: [], schemaItems: [], intent: "education" };
  }
}

export function resolveBreadcrumbResolution(input: BreadcrumbResolverInput): BreadcrumbResolution {
  const result = resolveBreadcrumbs(input);
  if (Array.isArray(result)) {
    return withIntent({ crumbs: result, schemaItems: [] }, input.kind, input.intent ?? "learner");
  }
  return result;
}

/** Whether UI should emit `BreadcrumbJsonLd` for this resolution. */
export function shouldEmitResolverBreadcrumbSchema(resolution: BreadcrumbResolution): boolean {
  const intent = resolution.intent ?? "education";
  return intentEmitsBreadcrumbSchema(intent) && resolution.schemaItems.length > 0;
}
