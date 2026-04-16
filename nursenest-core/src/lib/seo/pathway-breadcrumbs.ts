import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";
import { HUB } from "@/lib/navigation/canonical-destinations";
import type { BreadcrumbCrumb, BreadcrumbSchemaItem } from "@/lib/seo/breadcrumb-types";
import {
  countryExamGuideHref,
  countryLabelFromSlug,
  formatRoleTrackLabel,
  toAbsoluteSiteUrl,
} from "@/lib/seo/breadcrumb-utils";

export type { BreadcrumbCrumb, BreadcrumbSchemaItem } from "@/lib/seo/breadcrumb-types";

/** Optional hub URL when the third segment is an NP SEO alias (must match the request path). */
export type PathwayMarketingHubBreadcrumbOpts = {
  hubBasePath?: string;
};

const HOME: BreadcrumbCrumb = { name: "Home", href: "/", i18nKey: "breadcrumbs.home" };
const HOME_ITEM: BreadcrumbSchemaItem = { name: "Home", item: "/", i18nKey: "breadcrumbs.home" };

/**
 * Public index of all exam-scoped lesson hubs. Label aligns with the public `/lessons` landing `h1` (i18n).
 */
export const EXAM_LESSONS_INDEX = {
  path: HUB.examLessons,
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

function pathwayHubBase(pathway: ExamPathwayDefinition, hubBasePath?: string): string {
  return hubBasePath ?? buildExamPathwayPath(pathway);
}

function pathwayHubChildPath(pathway: ExamPathwayDefinition, hubBasePath: string | undefined, subpath: string): string {
  const base = pathwayHubBase(pathway, hubBasePath);
  const tail = subpath.replace(/^\//, "");
  return tail ? `${base}/${tail}` : base;
}

/**
 * Home → Country → Role track (URL segment `[slug]`) → Pathway hub (`[examCode]`).
 * Matches public marketing routes under `/[locale]/[slug]/[examCode]`.
 */
function examPathwaySurfacePrefix(
  pathway: ExamPathwayDefinition,
  opts?: PathwayMarketingHubBreadcrumbOpts,
): {
  hubBase: string;
  countryCrumb: (linked: boolean) => BreadcrumbCrumb;
  roleCrumb: (linked: boolean) => BreadcrumbCrumb;
  hubCrumb: (linked: boolean) => BreadcrumbCrumb;
  countrySchema: () => BreadcrumbSchemaItem;
  roleSchema: () => BreadcrumbSchemaItem;
  hubSchema: () => BreadcrumbSchemaItem;
} {
  const hubBase = pathwayHubBase(pathway, opts?.hubBasePath);
  const countrySlug = pathway.countrySlug;
  const rolePath = `/${countrySlug}/${pathway.roleTrack}`;
  const examName = pathwayRegionAwareExamName(pathway);
  const countryName = countryLabelFromSlug(countrySlug);
  const roleLabel = formatRoleTrackLabel(pathway.roleTrack, countrySlug);
  const countryHref = countryExamGuideHref(countrySlug);

  return {
    hubBase,
    countryCrumb: (linked) => (linked ? { name: countryName, href: countryHref } : { name: countryName, href: undefined }),
    roleCrumb: (linked) => (linked ? { name: roleLabel, href: rolePath } : { name: roleLabel, href: undefined }),
    hubCrumb: (linked) => (linked ? { name: examName, href: hubBase } : { name: examName, href: undefined }),
    countrySchema: () => ({ name: countryName, item: toAbsoluteSiteUrl(countryHref) }),
    roleSchema: () => ({ name: roleLabel, item: toAbsoluteSiteUrl(rolePath) }),
    hubSchema: () => ({ name: examName, item: toAbsoluteSiteUrl(hubBase) }),
  };
}

const LESSONS_KEY = "breadcrumbs.lessons" as const;

/** Exam pathway overview: Home → Country → Role track → Pathway hub (current). */
export function pathwayOverviewBreadcrumbs(
  pathway: ExamPathwayDefinition,
  opts?: PathwayMarketingHubBreadcrumbOpts,
): {
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
} {
  const p = examPathwaySurfacePrefix(pathway, opts);
  const crumbs: BreadcrumbCrumb[] = [HOME, p.countryCrumb(true), p.roleCrumb(true), p.hubCrumb(false)];
  const schemaItems: BreadcrumbSchemaItem[] = [HOME_ITEM, p.countrySchema(), p.roleSchema(), p.hubSchema()];
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
  const p = examPathwaySurfacePrefix(pathway, opts);
  const lessonsPath = pathwayHubChildPath(pathway, hub, "lessons");
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    p.countryCrumb(true),
    p.roleCrumb(true),
    p.hubCrumb(true),
    { name: "Lessons", href: undefined, i18nKey: LESSONS_KEY },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    p.countrySchema(),
    p.roleSchema(),
    p.hubSchema(),
    { name: "Lessons", item: toAbsoluteSiteUrl(lessonsPath), i18nKey: LESSONS_KEY },
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
  const p = examPathwaySurfacePrefix(pathway, opts);
  const lessonsPath = pathwayHubChildPath(pathway, hub, "lessons");
  const topicPath = pathwayHubChildPath(pathway, hub, `lessons/topics/${topicSlug}`);
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    p.countryCrumb(true),
    p.roleCrumb(true),
    p.hubCrumb(true),
    { name: "Lessons", href: lessonsPath, i18nKey: LESSONS_KEY },
    { name: topicLabel, href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    p.countrySchema(),
    p.roleSchema(),
    p.hubSchema(),
    { name: "Lessons", item: toAbsoluteSiteUrl(lessonsPath), i18nKey: LESSONS_KEY },
    { name: topicLabel, item: toAbsoluteSiteUrl(topicPath) },
  ];
  return { crumbs, schemaItems };
}

/** Single lesson page: Home → … → Lessons → lesson title (current). */
export function pathwayLessonDetailBreadcrumbs(
  pathway: ExamPathwayDefinition,
  lessonSlug: string,
  lessonTitle: string,
  opts?: PathwayMarketingHubBreadcrumbOpts,
): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const hub = opts?.hubBasePath;
  const p = examPathwaySurfacePrefix(pathway, opts);
  const lessonsPath = pathwayHubChildPath(pathway, hub, "lessons");
  const lessonPath = pathwayHubChildPath(pathway, hub, `lessons/${lessonSlug}`);
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    p.countryCrumb(true),
    p.roleCrumb(true),
    p.hubCrumb(true),
    { name: "Lessons", href: lessonsPath, i18nKey: LESSONS_KEY },
    { name: lessonTitle, href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    p.countrySchema(),
    p.roleSchema(),
    p.hubSchema(),
    { name: "Lessons", item: toAbsoluteSiteUrl(lessonsPath), i18nKey: LESSONS_KEY },
    { name: lessonTitle, item: toAbsoluteSiteUrl(lessonPath) },
  ];
  return { crumbs, schemaItems };
}

/** `/app` pathway lesson: visible trail only (no BreadcrumbList); links to public marketing URLs. */
export function learnerPathwayLessonBreadcrumbs(pathway: ExamPathwayDefinition, lessonTitle: string): BreadcrumbCrumb[] {
  const p = examPathwaySurfacePrefix(pathway);
  const lessonsPath = pathwayHubChildPath(pathway, undefined, "lessons");
  return [
    HOME,
    p.countryCrumb(true),
    p.roleCrumb(true),
    p.hubCrumb(true),
    { name: "Lessons", href: lessonsPath, i18nKey: LESSONS_KEY },
    { name: lessonTitle, href: undefined },
  ];
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
  const p = examPathwaySurfacePrefix(pathway, opts);
  const qPath = pathwayHubChildPath(pathway, hub, "questions");
  const qbKey = "breadcrumbs.questionBank" as const;
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    p.countryCrumb(true),
    p.roleCrumb(true),
    p.hubCrumb(true),
    { name: "Question bank", href: undefined, i18nKey: qbKey },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    p.countrySchema(),
    p.roleSchema(),
    p.hubSchema(),
    { name: "Question bank", item: toAbsoluteSiteUrl(qPath), i18nKey: qbKey },
  ];
  return { crumbs, schemaItems };
}

/** Marketing CAT / adaptive practice entry for a pathway (`…/cat`). */
export function pathwayCatPracticeBreadcrumbs(
  pathway: ExamPathwayDefinition,
  opts?: PathwayMarketingHubBreadcrumbOpts,
): {
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
} {
  const hub = opts?.hubBasePath;
  const p = examPathwaySurfacePrefix(pathway, opts);
  const catPath = pathwayHubChildPath(pathway, hub, "cat");
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    p.countryCrumb(true),
    p.roleCrumb(true),
    p.hubCrumb(true),
    { name: "CAT practice", href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    p.countrySchema(),
    p.roleSchema(),
    p.hubSchema(),
    { name: "CAT practice", item: toAbsoluteSiteUrl(catPath) },
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
  const p = examPathwaySurfacePrefix(pathway, opts);
  const pricingPath = pathwayHubChildPath(pathway, hub, "pricing");
  const pricingKey = "breadcrumbs.pricing" as const;
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    p.countryCrumb(true),
    p.roleCrumb(true),
    p.hubCrumb(true),
    { name: "Pricing", href: undefined, i18nKey: pricingKey },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    p.countrySchema(),
    p.roleSchema(),
    p.hubSchema(),
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

/** Global question bank index (/question-bank — all exam tracks). */
export function questionBankIndexBreadcrumbs(): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const label = "Practice questions by exam";
  const crumbs: BreadcrumbCrumb[] = [HOME, { name: label }];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    { name: label, item: toAbsoluteSiteUrl("/question-bank") },
  ];
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
