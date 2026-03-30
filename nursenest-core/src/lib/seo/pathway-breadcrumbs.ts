import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import type { BreadcrumbCrumb, BreadcrumbSchemaItem } from "@/lib/seo/breadcrumb-types";
import { toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";
import { getPathwayProgrammaticSeoLanding } from "@/lib/seo/pathway-programmatic-seo";

export type { BreadcrumbCrumb, BreadcrumbSchemaItem } from "@/lib/seo/breadcrumb-types";

const HOME: BreadcrumbCrumb = { name: "Home", href: "/" };
const HOME_ITEM: BreadcrumbSchemaItem = { name: "Home", item: "/" };

/**
 * Public index of all exam-scoped lesson hubs. Label matches the `h1` on `/exam-lessons`.
 * There is no standalone `/canada` (or other country) page — do not label a crumb “Canada” and link here.
 */
export const EXAM_LESSONS_INDEX = {
  path: "/exam-lessons" as const,
  label: "Lessons by exam pathway",
};

function examLessonsIndexCrumb(linked: boolean): BreadcrumbCrumb {
  return linked
    ? { name: EXAM_LESSONS_INDEX.label, href: EXAM_LESSONS_INDEX.path }
    : { name: EXAM_LESSONS_INDEX.label, href: undefined };
}

function examLessonsIndexSchema(): BreadcrumbSchemaItem {
  return { name: EXAM_LESSONS_INDEX.label, item: toAbsoluteSiteUrl(EXAM_LESSONS_INDEX.path) };
}

/** Second crumb: programmatic SEO landing when mapped, else lessons index (all pathways). */
function pathwayProgrammaticParentCrumb(pathway: ExamPathwayDefinition, linked: boolean): BreadcrumbCrumb {
  const land = getPathwayProgrammaticSeoLanding(pathway);
  if (!land) return examLessonsIndexCrumb(linked);
  return linked ? { name: land.label, href: land.path } : { name: land.label, href: undefined };
}

function pathwayProgrammaticParentSchema(pathway: ExamPathwayDefinition): BreadcrumbSchemaItem {
  const land = getPathwayProgrammaticSeoLanding(pathway);
  if (!land) return examLessonsIndexSchema();
  return { name: land.label, item: toAbsoluteSiteUrl(land.path) };
}

function pathwayHubCrumb(pathway: ExamPathwayDefinition, linked: boolean): BreadcrumbCrumb {
  const base = buildExamPathwayPath(pathway);
  return linked ? { name: pathway.shortName, href: base } : { name: pathway.shortName, href: undefined };
}

function pathwayHubSchema(pathway: ExamPathwayDefinition): BreadcrumbSchemaItem {
  const base = buildExamPathwayPath(pathway);
  return { name: pathway.shortName, item: toAbsoluteSiteUrl(base) };
}

/** Exam pathway overview: Home → programmatic SEO (or lessons index) → pathway hub (current). */
export function pathwayOverviewBreadcrumbs(pathway: ExamPathwayDefinition): {
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
} {
  const crumbs: BreadcrumbCrumb[] = [HOME, pathwayProgrammaticParentCrumb(pathway, true), pathwayHubCrumb(pathway, false)];
  const schemaItems: BreadcrumbSchemaItem[] = [HOME_ITEM, pathwayProgrammaticParentSchema(pathway), pathwayHubSchema(pathway)];
  return { crumbs, schemaItems };
}

/** Lessons hub for a pathway. */
export function pathwayLessonsHubBreadcrumbs(pathway: ExamPathwayDefinition): {
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
} {
  const lessons = buildExamPathwayPath(pathway, "lessons");
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    examLessonsIndexCrumb(true),
    pathwayHubCrumb(pathway, true),
    { name: "Lessons", href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    examLessonsIndexSchema(),
    pathwayHubSchema(pathway),
    { name: "Lessons", item: toAbsoluteSiteUrl(lessons) },
  ];
  return { crumbs, schemaItems };
}

/** Topic cluster: … → Lessons (linked) → topic (current). */
export function pathwayTopicClusterBreadcrumbs(
  pathway: ExamPathwayDefinition,
  topicSlug: string,
  topicLabel: string,
): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const lessonsPath = buildExamPathwayPath(pathway, "lessons");
  const topicPath = buildExamPathwayPath(pathway, `lessons/topics/${topicSlug}`);
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    examLessonsIndexCrumb(true),
    pathwayHubCrumb(pathway, true),
    { name: "Lessons", href: lessonsPath },
    { name: topicLabel, href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    examLessonsIndexSchema(),
    pathwayHubSchema(pathway),
    { name: "Lessons", item: toAbsoluteSiteUrl(lessonsPath) },
    { name: topicLabel, item: toAbsoluteSiteUrl(topicPath) },
  ];
  return { crumbs, schemaItems };
}

/** Single lesson page. */
export function pathwayLessonDetailBreadcrumbs(
  pathway: ExamPathwayDefinition,
  lessonSlug: string,
  lessonTitle: string,
): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const lessonsPath = buildExamPathwayPath(pathway, "lessons");
  const lessonPath = buildExamPathwayPath(pathway, `lessons/${lessonSlug}`);
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    examLessonsIndexCrumb(true),
    pathwayHubCrumb(pathway, true),
    { name: "Lessons", href: lessonsPath },
    { name: lessonTitle, href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    examLessonsIndexSchema(),
    pathwayHubSchema(pathway),
    { name: "Lessons", item: toAbsoluteSiteUrl(lessonsPath) },
    { name: lessonTitle, item: toAbsoluteSiteUrl(lessonPath) },
  ];
  return { crumbs, schemaItems };
}

/** Marketing question bank hub for a pathway. */
export function pathwayQuestionsHubBreadcrumbs(pathway: ExamPathwayDefinition): {
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
} {
  const qPath = buildExamPathwayPath(pathway, "questions");
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    examLessonsIndexCrumb(true),
    pathwayHubCrumb(pathway, true),
    { name: "Question bank", href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    examLessonsIndexSchema(),
    pathwayHubSchema(pathway),
    { name: "Question bank", item: toAbsoluteSiteUrl(qPath) },
  ];
  return { crumbs, schemaItems };
}

/** Pathway-specific pricing page (marketing). */
export function pathwayPricingBreadcrumbs(pathway: ExamPathwayDefinition): {
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
} {
  const pricingPath = buildExamPathwayPath(pathway, "pricing");
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    examLessonsIndexCrumb(true),
    pathwayHubCrumb(pathway, true),
    { name: "Pricing", href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    examLessonsIndexSchema(),
    pathwayHubSchema(pathway),
    { name: "Pricing", item: toAbsoluteSiteUrl(pricingPath) },
  ];
  return { crumbs, schemaItems };
}

/** Exam lessons index (all pathways). */
export function examLessonsIndexBreadcrumbs(): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const crumbs: BreadcrumbCrumb[] = [HOME, examLessonsIndexCrumb(false)];
  const schemaItems: BreadcrumbSchemaItem[] = [HOME_ITEM, examLessonsIndexSchema()];
  return { crumbs, schemaItems };
}

/** Blog index. */
export function blogIndexBreadcrumbs(): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const crumbs: BreadcrumbCrumb[] = [HOME, { name: "Blog", href: undefined }];
  const schemaItems: BreadcrumbSchemaItem[] = [HOME_ITEM, { name: "Blog", item: toAbsoluteSiteUrl("/blog") }];
  return { crumbs, schemaItems };
}

/** Blog post. */
export function blogPostBreadcrumbs(title: string, slug: string): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const postPath = `/blog/${slug}`;
  const crumbs: BreadcrumbCrumb[] = [HOME, { name: "Blog", href: "/blog" }, { name: title, href: undefined }];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    { name: "Blog", item: toAbsoluteSiteUrl("/blog") },
    { name: title, item: toAbsoluteSiteUrl(postPath) },
  ];
  return { crumbs, schemaItems };
}

/**
 * Optional middle crumb for post category (display only when no dedicated category archive URL).
 * JSON-LD stays Home → Blog → Article so we do not invent category URLs.
 */
export function blogPostBreadcrumbsWithOptionalCategory(
  title: string,
  slug: string,
  category?: string | null,
): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const base = blogPostBreadcrumbs(title, slug);
  const cat = category?.trim();
  if (!cat) return base;
  return {
    crumbs: [HOME, { name: "Blog", href: "/blog" }, { name: cat, href: undefined }, { name: title, href: undefined }],
    schemaItems: base.schemaItems,
  };
}

/** Blog tag page. */
export function blogTagBreadcrumbs(tag: string): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const tagPath = `/blog/tag/${encodeURIComponent(tag)}`;
  const tagLabel = `Tag: ${tag}`;
  const crumbs: BreadcrumbCrumb[] = [HOME, { name: "Blog", href: "/blog" }, { name: tagLabel, href: undefined }];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    { name: "Blog", item: toAbsoluteSiteUrl("/blog") },
    { name: tagLabel, item: toAbsoluteSiteUrl(tagPath) },
  ];
  return { crumbs, schemaItems };
}
