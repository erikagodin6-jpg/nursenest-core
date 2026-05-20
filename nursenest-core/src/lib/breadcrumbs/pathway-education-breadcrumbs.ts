import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";
import { marketingPathwayLessonsCategoryPath } from "@/lib/lessons/lesson-routes";
import type { BreadcrumbCrumb, BreadcrumbSchemaItem } from "@/lib/breadcrumbs/breadcrumb-types";
import type { PathwayLessonCategoryBreadcrumb } from "@/lib/breadcrumbs/breadcrumb-types";
import { toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";
import type { PathwayMarketingHubBreadcrumbOpts } from "@/lib/seo/pathway-breadcrumbs";

const HOME: BreadcrumbCrumb = { name: "Home", href: "/", i18nKey: "breadcrumbs.home" };
const HOME_ITEM: BreadcrumbSchemaItem = { name: "Home", item: "/", i18nKey: "breadcrumbs.home" };
const LESSONS_KEY = "breadcrumbs.lessons" as const;

function pathwayHubChildPath(
  pathway: ExamPathwayDefinition,
  hubBasePath: string | undefined,
  subpath: string,
): string {
  const base = hubBasePath ?? buildExamPathwayPath(pathway);
  const tail = subpath.replace(/^\//, "");
  return tail ? `${base}/${tail}` : base;
}

function examEducationPrefix(pathway: ExamPathwayDefinition, opts?: PathwayMarketingHubBreadcrumbOpts) {
  const hubOverviewHref = opts?.hubBasePath ?? buildExamPathwayPath(pathway);
  const examName = pathwayRegionAwareExamName(pathway);
  return {
    hubOverviewHref,
    examName,
    hubCrumb: (linked: boolean): BreadcrumbCrumb =>
      linked ? { name: examName, href: hubOverviewHref } : { name: examName, href: undefined },
    hubSchema: (): BreadcrumbSchemaItem => ({
      name: examName,
      item: toAbsoluteSiteUrl(hubOverviewHref),
    }),
  };
}

/** Lessons index: Home → {Exam} → Lessons (current). */
export function pathwayLessonsHubEducationBreadcrumbs(
  pathway: ExamPathwayDefinition,
  opts?: PathwayMarketingHubBreadcrumbOpts,
): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const hub = opts?.hubBasePath;
  const p = examEducationPrefix(pathway, opts);
  const lessonsPath = pathwayHubChildPath(pathway, hub, "lessons");
  return {
    crumbs: [HOME, p.hubCrumb(true), { name: "Lessons", href: undefined, i18nKey: LESSONS_KEY }],
    schemaItems: [
      HOME_ITEM,
      p.hubSchema(),
      { name: "Lessons", item: toAbsoluteSiteUrl(lessonsPath), i18nKey: LESSONS_KEY },
    ],
  };
}

/** Category hub: Home → {Exam} → {Category} (current). */
export function pathwayLessonsCategoryEducationBreadcrumbs(
  pathway: ExamPathwayDefinition,
  category: PathwayLessonCategoryBreadcrumb,
  opts?: PathwayMarketingHubBreadcrumbOpts,
): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const p = examEducationPrefix(pathway, opts);
  const categoryPath = marketingPathwayLessonsCategoryPath(pathway, category.slug);
  return {
    crumbs: [HOME, p.hubCrumb(true), { name: category.label, href: undefined }],
    schemaItems: [HOME_ITEM, p.hubSchema(), { name: category.label, item: toAbsoluteSiteUrl(categoryPath) }],
  };
}

/** Lesson detail: Home → {Exam} → {Category} → {Lesson} (education-first; category required for full trail). */
export function pathwayLessonDetailEducationBreadcrumbs(
  pathway: ExamPathwayDefinition,
  lessonSlug: string,
  lessonTitle: string,
  category: PathwayLessonCategoryBreadcrumb | null | undefined,
  opts?: PathwayMarketingHubBreadcrumbOpts,
): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const hub = opts?.hubBasePath;
  const p = examEducationPrefix(pathway, opts);
  const lessonsPath = pathwayHubChildPath(pathway, hub, "lessons");
  const lessonPath = pathwayHubChildPath(pathway, hub, `lessons/${lessonSlug}`);

  if (category?.label && category.slug) {
    const categoryPath = marketingPathwayLessonsCategoryPath(pathway, category.slug);
    return {
      crumbs: [
        HOME,
        p.hubCrumb(true),
        { name: category.label, href: categoryPath },
        { name: lessonTitle, href: undefined },
      ],
      schemaItems: [
        HOME_ITEM,
        p.hubSchema(),
        { name: category.label, item: toAbsoluteSiteUrl(categoryPath) },
        { name: lessonTitle, item: toAbsoluteSiteUrl(lessonPath) },
      ],
    };
  }

  return {
    crumbs: [
      HOME,
      p.hubCrumb(true),
      { name: "Lessons", href: lessonsPath, i18nKey: LESSONS_KEY },
      { name: lessonTitle, href: undefined },
    ],
    schemaItems: [
      HOME_ITEM,
      p.hubSchema(),
      { name: "Lessons", item: toAbsoluteSiteUrl(lessonsPath), i18nKey: LESSONS_KEY },
      { name: lessonTitle, item: toAbsoluteSiteUrl(lessonPath) },
    ],
  };
}

/** Topic cluster on lessons hub: Home → {Exam} → Lessons → {Topic} (education-first; no geo). */
export function pathwayTopicClusterEducationBreadcrumbs(
  pathway: ExamPathwayDefinition,
  topicSlug: string,
  topicLabel: string,
  opts?: PathwayMarketingHubBreadcrumbOpts,
): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const hub = opts?.hubBasePath;
  const p = examEducationPrefix(pathway, opts);
  const lessonsPath = pathwayHubChildPath(pathway, hub, "lessons");
  const topicPath = `${lessonsPath}?topicSlug=${encodeURIComponent(topicSlug.trim().toLowerCase())}`;
  return {
    crumbs: [
      HOME,
      p.hubCrumb(true),
      { name: "Lessons", href: lessonsPath, i18nKey: LESSONS_KEY },
      { name: topicLabel, href: undefined },
    ],
    schemaItems: [
      HOME_ITEM,
      p.hubSchema(),
      { name: "Lessons", item: toAbsoluteSiteUrl(lessonsPath), i18nKey: LESSONS_KEY },
      { name: topicLabel, item: toAbsoluteSiteUrl(topicPath) },
    ],
  };
}

/** App learner lesson: same education trail, public URLs only (no JSON-LD). */
export function learnerPathwayLessonEducationBreadcrumbs(
  pathway: ExamPathwayDefinition,
  lessonTitle: string,
  category: PathwayLessonCategoryBreadcrumb | null | undefined,
): BreadcrumbCrumb[] {
  const p = examEducationPrefix(pathway);
  const lessonsPath = pathwayHubChildPath(pathway, undefined, "lessons");
  if (category?.label && category.slug) {
    const categoryPath = marketingPathwayLessonsCategoryPath(pathway, category.slug);
    return [HOME, p.hubCrumb(true), { name: category.label, href: categoryPath }, { name: lessonTitle, href: undefined }];
  }
  return [
    HOME,
    p.hubCrumb(true),
    { name: "Lessons", href: lessonsPath, i18nKey: LESSONS_KEY },
    { name: lessonTitle, href: undefined },
  ];
}
