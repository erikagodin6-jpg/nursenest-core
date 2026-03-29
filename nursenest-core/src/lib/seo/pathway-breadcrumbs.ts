import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import type { BreadcrumbCrumb, BreadcrumbSchemaItem } from "@/lib/seo/breadcrumb-types";
import { countryLabelFromSlug, formatRoleTrackLabel, toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";

export type { BreadcrumbCrumb, BreadcrumbSchemaItem } from "@/lib/seo/breadcrumb-types";

const HOME: BreadcrumbCrumb = { name: "Home", href: "/" };
const HOME_ITEM: BreadcrumbSchemaItem = { name: "Home", item: "/" };

function countryCrumb(pathway: ExamPathwayDefinition): BreadcrumbCrumb {
  return { name: countryLabelFromSlug(pathway.countrySlug), href: "/exam-lessons" };
}

function countrySchema(pathway: ExamPathwayDefinition): BreadcrumbSchemaItem {
  return {
    name: countryLabelFromSlug(pathway.countrySlug),
    item: toAbsoluteSiteUrl("/exam-lessons"),
  };
}

function roleCrumb(pathway: ExamPathwayDefinition): BreadcrumbCrumb {
  const base = buildExamPathwayPath(pathway);
  return { name: formatRoleTrackLabel(pathway.roleTrack, pathway.countrySlug), href: `${base}#role` };
}

function roleSchema(pathway: ExamPathwayDefinition): BreadcrumbSchemaItem {
  const base = buildExamPathwayPath(pathway);
  return {
    name: formatRoleTrackLabel(pathway.roleTrack, pathway.countrySlug),
    item: toAbsoluteSiteUrl(`${base}#role`),
  };
}

function examCrumb(pathway: ExamPathwayDefinition): BreadcrumbCrumb {
  const base = buildExamPathwayPath(pathway);
  return { name: pathway.shortName, href: `${base}#exam` };
}

function examSchema(pathway: ExamPathwayDefinition): BreadcrumbSchemaItem {
  const base = buildExamPathwayPath(pathway);
  return {
    name: pathway.shortName,
    item: toAbsoluteSiteUrl(`${base}#exam`),
  };
}

function examHubSchema(pathway: ExamPathwayDefinition): BreadcrumbSchemaItem {
  const base = buildExamPathwayPath(pathway);
  return { name: pathway.shortName, item: toAbsoluteSiteUrl(base) };
}

/** Exam pathway overview: Home → country → role → exam (current). */
export function pathwayOverviewBreadcrumbs(pathway: ExamPathwayDefinition): {
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
} {
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    countryCrumb(pathway),
    roleCrumb(pathway),
    { name: pathway.shortName, href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [HOME_ITEM, countrySchema(pathway), roleSchema(pathway), examHubSchema(pathway)];
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
    countryCrumb(pathway),
    roleCrumb(pathway),
    examCrumb(pathway),
    { name: "Lessons", href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    countrySchema(pathway),
    roleSchema(pathway),
    examSchema(pathway),
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
    countryCrumb(pathway),
    roleCrumb(pathway),
    examCrumb(pathway),
    { name: "Lessons", href: lessonsPath },
    { name: topicLabel, href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    countrySchema(pathway),
    roleSchema(pathway),
    examSchema(pathway),
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
    countryCrumb(pathway),
    roleCrumb(pathway),
    examCrumb(pathway),
    { name: "Lessons", href: lessonsPath },
    { name: lessonTitle, href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    countrySchema(pathway),
    roleSchema(pathway),
    examSchema(pathway),
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
    countryCrumb(pathway),
    roleCrumb(pathway),
    examCrumb(pathway),
    { name: "Question bank", href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    countrySchema(pathway),
    roleSchema(pathway),
    examSchema(pathway),
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
    countryCrumb(pathway),
    roleCrumb(pathway),
    examCrumb(pathway),
    { name: "Pricing", href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    countrySchema(pathway),
    roleSchema(pathway),
    examSchema(pathway),
    { name: "Pricing", item: toAbsoluteSiteUrl(pricingPath) },
  ];
  return { crumbs, schemaItems };
}

/** Exam lessons index (all pathways). */
export function examLessonsIndexBreadcrumbs(): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const crumbs: BreadcrumbCrumb[] = [HOME, { name: "Lessons by exam", href: undefined }];
  const schemaItems: BreadcrumbSchemaItem[] = [HOME_ITEM, { name: "Lessons by exam", item: toAbsoluteSiteUrl("/exam-lessons") }];
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
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    { name: "Blog", href: "/blog" },
    { name: `Tag: ${tag}`, href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    { name: "Blog", item: toAbsoluteSiteUrl("/blog") },
    { name: tag, item: toAbsoluteSiteUrl(tagPath) },
  ];
  return { crumbs, schemaItems };
}

