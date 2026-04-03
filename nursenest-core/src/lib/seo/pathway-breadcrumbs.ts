import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import type { BreadcrumbCrumb, BreadcrumbSchemaItem } from "@/lib/seo/breadcrumb-types";
import { toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";
import { getPathwayProgrammaticSeoLanding } from "@/lib/seo/pathway-programmatic-seo";

export type { BreadcrumbCrumb, BreadcrumbSchemaItem } from "@/lib/seo/breadcrumb-types";

/** Optional hub URL when the third segment is an NP SEO alias (must match the request path). */
export type PathwayMarketingHubBreadcrumbOpts = {
  hubBasePath?: string;
};

const HOME: BreadcrumbCrumb = { name: "Home", href: "/", i18nKey: "breadcrumbs.home" };
const HOME_ITEM: BreadcrumbSchemaItem = { name: "Home", item: "/", i18nKey: "breadcrumbs.home" };

/**
 * Public index of all exam-scoped lesson hubs. Label matches the `h1` on `/exam-lessons`.
 * There is no standalone `/canada` (or other country) page — do not label a crumb “Canada” and link here.
 */
export const EXAM_LESSONS_INDEX = {
  path: "/exam-lessons" as const,
  label: "Lessons by exam pathway",
};

function examLessonsIndexCrumb(linked: boolean): BreadcrumbCrumb {
  const base = {
    name: EXAM_LESSONS_INDEX.label,
    i18nKey: "breadcrumbs.examLessonsIndex" as const,
  };
  return linked ? { ...base, href: EXAM_LESSONS_INDEX.path } : { ...base, href: undefined };
}

function examLessonsIndexSchema(): BreadcrumbSchemaItem {
  return {
    name: EXAM_LESSONS_INDEX.label,
    item: toAbsoluteSiteUrl(EXAM_LESSONS_INDEX.path),
    i18nKey: "breadcrumbs.examLessonsIndex",
  };
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

function pathwayHubBase(pathway: ExamPathwayDefinition, hubBasePath?: string): string {
  return hubBasePath ?? buildExamPathwayPath(pathway);
}

function pathwayHubChildPath(pathway: ExamPathwayDefinition, hubBasePath: string | undefined, subpath: string): string {
  const base = pathwayHubBase(pathway, hubBasePath);
  const tail = subpath.replace(/^\//, "");
  return tail ? `${base}/${tail}` : base;
}

function pathwayHubCrumb(pathway: ExamPathwayDefinition, linked: boolean, hubBasePath?: string): BreadcrumbCrumb {
  const base = pathwayHubBase(pathway, hubBasePath);
  return linked ? { name: pathway.shortName, href: base } : { name: pathway.shortName, href: undefined };
}

function pathwayHubSchema(pathway: ExamPathwayDefinition, hubBasePath?: string): BreadcrumbSchemaItem {
  const base = pathwayHubBase(pathway, hubBasePath);
  return { name: pathway.shortName, item: toAbsoluteSiteUrl(base) };
}

/** Exam pathway overview: Home → programmatic SEO (or lessons index) → pathway hub (current). */
export function pathwayOverviewBreadcrumbs(
  pathway: ExamPathwayDefinition,
  opts?: PathwayMarketingHubBreadcrumbOpts,
): {
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
} {
  const hub = opts?.hubBasePath;
  const crumbs: BreadcrumbCrumb[] = [HOME, pathwayProgrammaticParentCrumb(pathway, true), pathwayHubCrumb(pathway, false, hub)];
  const schemaItems: BreadcrumbSchemaItem[] = [HOME_ITEM, pathwayProgrammaticParentSchema(pathway), pathwayHubSchema(pathway, hub)];
  return { crumbs, schemaItems };
}

/** Lessons hub for a pathway. */
export function pathwayLessonsHubBreadcrumbs(
  pathway: ExamPathwayDefinition,
  opts?: PathwayMarketingHubBreadcrumbOpts,
): {
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
} {
  const hub = opts?.hubBasePath;
  const lessons = pathwayHubChildPath(pathway, hub, "lessons");
  const lessonsKey = "breadcrumbs.lessons" as const;
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    pathwayProgrammaticParentCrumb(pathway, true),
    pathwayHubCrumb(pathway, true, hub),
    { name: "Lessons", href: undefined, i18nKey: lessonsKey },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    pathwayProgrammaticParentSchema(pathway),
    pathwayHubSchema(pathway, hub),
    { name: "Lessons", item: toAbsoluteSiteUrl(lessons), i18nKey: lessonsKey },
  ];
  return { crumbs, schemaItems };
}

/** Topic cluster: … → Lessons (linked) → topic (current). */
export function pathwayTopicClusterBreadcrumbs(
  pathway: ExamPathwayDefinition,
  topicSlug: string,
  topicLabel: string,
  opts?: PathwayMarketingHubBreadcrumbOpts,
): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const hub = opts?.hubBasePath;
  const lessonsPath = pathwayHubChildPath(pathway, hub, "lessons");
  const topicPath = pathwayHubChildPath(pathway, hub, `lessons/topics/${topicSlug}`);
  const lessonsKey = "breadcrumbs.lessons" as const;
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    pathwayProgrammaticParentCrumb(pathway, true),
    pathwayHubCrumb(pathway, true, hub),
    { name: "Lessons", href: lessonsPath, i18nKey: lessonsKey },
    { name: topicLabel, href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    pathwayProgrammaticParentSchema(pathway),
    pathwayHubSchema(pathway, hub),
    { name: "Lessons", item: toAbsoluteSiteUrl(lessonsPath), i18nKey: lessonsKey },
    { name: topicLabel, item: toAbsoluteSiteUrl(topicPath) },
  ];
  return { crumbs, schemaItems };
}

/** Single lesson page. */
export function pathwayLessonDetailBreadcrumbs(
  pathway: ExamPathwayDefinition,
  lessonSlug: string,
  lessonTitle: string,
  opts?: PathwayMarketingHubBreadcrumbOpts,
): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const hub = opts?.hubBasePath;
  const lessonsPath = pathwayHubChildPath(pathway, hub, "lessons");
  const lessonPath = pathwayHubChildPath(pathway, hub, `lessons/${lessonSlug}`);
  const lessonsLabel = `${pathway.shortName} lessons`;
  const lessonsHubKey = "breadcrumbs.pathwayLessonsHub" as const;
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    pathwayProgrammaticParentCrumb(pathway, true),
    pathwayHubCrumb(pathway, true, hub),
    {
      name: lessonsLabel,
      href: lessonsPath,
      i18nKey: lessonsHubKey,
      i18nParams: { shortName: pathway.shortName },
    },
    { name: lessonTitle, href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    pathwayProgrammaticParentSchema(pathway),
    pathwayHubSchema(pathway, hub),
    {
      name: lessonsLabel,
      item: toAbsoluteSiteUrl(lessonsPath),
      i18nKey: lessonsHubKey,
      i18nParams: { shortName: pathway.shortName },
    },
    { name: lessonTitle, item: toAbsoluteSiteUrl(lessonPath) },
  ];
  return { crumbs, schemaItems };
}

/** Marketing question bank hub for a pathway. */
export function pathwayQuestionsHubBreadcrumbs(
  pathway: ExamPathwayDefinition,
  opts?: PathwayMarketingHubBreadcrumbOpts,
): {
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
} {
  const hub = opts?.hubBasePath;
  const qPath = pathwayHubChildPath(pathway, hub, "questions");
  const qbKey = "breadcrumbs.questionBank" as const;
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    pathwayProgrammaticParentCrumb(pathway, true),
    pathwayHubCrumb(pathway, true, hub),
    { name: "Question bank", href: undefined, i18nKey: qbKey },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    pathwayProgrammaticParentSchema(pathway),
    pathwayHubSchema(pathway, hub),
    { name: "Question bank", item: toAbsoluteSiteUrl(qPath), i18nKey: qbKey },
  ];
  return { crumbs, schemaItems };
}

/** Pathway-specific pricing page (marketing). */
export function pathwayPricingBreadcrumbs(
  pathway: ExamPathwayDefinition,
  opts?: PathwayMarketingHubBreadcrumbOpts,
): {
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
} {
  const hub = opts?.hubBasePath;
  const pricingPath = pathwayHubChildPath(pathway, hub, "pricing");
  const pricingKey = "breadcrumbs.pricing" as const;
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    pathwayProgrammaticParentCrumb(pathway, true),
    pathwayHubCrumb(pathway, true, hub),
    { name: "Pricing", href: undefined, i18nKey: pricingKey },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    pathwayProgrammaticParentSchema(pathway),
    pathwayHubSchema(pathway, hub),
    { name: "Pricing", item: toAbsoluteSiteUrl(pricingPath), i18nKey: pricingKey },
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
  const blogKey = "breadcrumbs.blog" as const;
  const crumbs: BreadcrumbCrumb[] = [HOME, { name: "Blog", href: undefined, i18nKey: blogKey }];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    { name: "Blog", item: toAbsoluteSiteUrl("/blog"), i18nKey: blogKey },
  ];
  return { crumbs, schemaItems };
}

/** Blog post. */
export function blogPostBreadcrumbs(title: string, slug: string): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const postPath = `/blog/${slug}`;
  const blogKey = "breadcrumbs.blog" as const;
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    { name: "Blog", href: "/blog", i18nKey: blogKey },
    { name: title, href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    { name: "Blog", item: toAbsoluteSiteUrl("/blog"), i18nKey: blogKey },
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
  const blogKey = "breadcrumbs.blog" as const;
  return {
    crumbs: [
      HOME,
      { name: "Blog", href: "/blog", i18nKey: blogKey },
      { name: cat, href: undefined },
      { name: title, href: undefined },
    ],
    schemaItems: base.schemaItems,
  };
}

/** Blog tag page. */
export function blogTagBreadcrumbs(tag: string): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const tagPath = `/blog/tag/${encodeURIComponent(tag)}`;
  const tagLabel = `Tag: ${tag}`;
  const blogKey = "breadcrumbs.blog" as const;
  const tagKey = "breadcrumbs.tagPage" as const;
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    { name: "Blog", href: "/blog", i18nKey: blogKey },
    { name: tagLabel, href: undefined, i18nKey: tagKey, i18nParams: { tag } },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    { name: "Blog", item: toAbsoluteSiteUrl("/blog"), i18nKey: blogKey },
    { name: tagLabel, item: toAbsoluteSiteUrl(tagPath), i18nKey: tagKey, i18nParams: { tag } },
  ];
  return { crumbs, schemaItems };
}
