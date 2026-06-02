import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath, marketingHubRoleSegment } from "@/lib/exam-pathways/build-exam-pathway-path";
import {
  learnerPathwayLessonEducationBreadcrumbs,
  pathwayLessonDetailEducationBreadcrumbs,
  pathwayLessonsCategoryEducationBreadcrumbs,
  pathwayLessonsHubEducationBreadcrumbs,
  pathwayTopicClusterEducationBreadcrumbs,
} from "@/lib/breadcrumbs/pathway-education-breadcrumbs";
import type { PathwayLessonCategoryBreadcrumb } from "@/lib/breadcrumbs/breadcrumb-types";
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

function pathwaySegmentBaseForChildUrls(pathway: ExamPathwayDefinition, hubBasePath?: string): string {
  return hubBasePath ?? buildExamPathwayPath(pathway);
}

function pathwayHubChildPath(pathway: ExamPathwayDefinition, hubBasePath: string | undefined, subpath: string): string {
  const base = pathwaySegmentBaseForChildUrls(pathway, hubBasePath);
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
  hubOverviewHref: string;
  countryCrumb: (linked: boolean) => BreadcrumbCrumb;
  roleCrumb: (linked: boolean) => BreadcrumbCrumb;
  hubCrumb: (linked: boolean) => BreadcrumbCrumb;
  countrySchema: () => BreadcrumbSchemaItem;
  roleSchema: () => BreadcrumbSchemaItem;
  hubSchema: () => BreadcrumbSchemaItem;
} {
  const hubOverviewHref = opts?.hubBasePath ?? buildExamPathwayPath(pathway);
  const countrySlug = pathway.countrySlug;
  const rolePath = `/${countrySlug}/${marketingHubRoleSegment(pathway)}`;
  const examName = pathwayRegionAwareExamName(pathway);
  const countryName = countryLabelFromSlug(countrySlug);
  const roleLabel = formatRoleTrackLabel(pathway.roleTrack, countrySlug);
  const countryHref = countryExamGuideHref(countrySlug);

  return {
    hubOverviewHref,
    countryCrumb: (linked) => (linked ? { name: countryName, href: countryHref } : { name: countryName, href: undefined }),
    roleCrumb: (linked) => (linked ? { name: roleLabel, href: rolePath } : { name: roleLabel, href: undefined }),
    hubCrumb: (linked) => (linked ? { name: examName, href: hubOverviewHref } : { name: examName, href: undefined }),
    countrySchema: () => ({ name: countryName, item: toAbsoluteSiteUrl(countryHref) }),
    roleSchema: () => ({ name: roleLabel, item: toAbsoluteSiteUrl(rolePath) }),
    hubSchema: () => ({ name: examName, item: toAbsoluteSiteUrl(hubOverviewHref) }),
  };
}

const LESSONS_KEY = "breadcrumbs.lessons" as const;

/** Exam pathway overview: Home → Country → Exam hub (current). No redundant role track crumb. */
export function pathwayOverviewBreadcrumbs(
  pathway: ExamPathwayDefinition,
  opts?: PathwayMarketingHubBreadcrumbOpts,
): {
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
} {
  const p = examPathwaySurfacePrefix(pathway, opts);
  const crumbs: BreadcrumbCrumb[] = [HOME, p.countryCrumb(true), p.hubCrumb(false)];
  const schemaItems: BreadcrumbSchemaItem[] = [HOME_ITEM, p.countrySchema(), p.hubSchema()];
  return { crumbs, schemaItems };
}

/** Lessons hub for a pathway (education-first: Home → Exam → Lessons). */
export function pathwayLessonsHubBreadcrumbs(
  pathway: ExamPathwayDefinition,
  opts?: PathwayMarketingHubBreadcrumbOpts,
): {
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
} {
  return pathwayLessonsHubEducationBreadcrumbs(pathway, opts);
}

/** Topic cluster: Home → {Exam} → Lessons → {Topic} (education-first). */
export function pathwayTopicClusterBreadcrumbs(
  pathway: ExamPathwayDefinition,
  topicSlug: string,
  topicLabel: string,
  opts?: PathwayMarketingHubBreadcrumbOpts,
): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  return pathwayTopicClusterEducationBreadcrumbs(pathway, topicSlug, topicLabel, opts);
}

/** Display category hub: Home → Exam → {Category} (education-first). */
export function pathwayLessonsDisplayCategoryBreadcrumbs(
  pathway: ExamPathwayDefinition,
  categoryLabel: string,
  categoryUrlSegment: string,
  opts?: PathwayMarketingHubBreadcrumbOpts,
): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const category: PathwayLessonCategoryBreadcrumb = {
    label: categoryLabel,
    slug: categoryUrlSegment.trim().toLowerCase(),
  };
  return pathwayLessonsCategoryEducationBreadcrumbs(pathway, category, opts);
}

/** Single lesson page: Home → Exam → Category → Lesson (education-first when category supplied). */
export function pathwayLessonDetailBreadcrumbs(
  pathway: ExamPathwayDefinition,
  lessonSlug: string,
  lessonTitle: string,
  opts?: PathwayMarketingHubBreadcrumbOpts & {
    category?: PathwayLessonCategoryBreadcrumb | null;
  },
): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  return pathwayLessonDetailEducationBreadcrumbs(pathway, lessonSlug, lessonTitle, opts?.category, opts);
}

/** `/app` pathway lesson: visible trail only (no BreadcrumbList); links to public marketing URLs. */
export function learnerPathwayLessonBreadcrumbs(
  pathway: ExamPathwayDefinition,
  lessonTitle: string,
  category?: PathwayLessonCategoryBreadcrumb | null,
): BreadcrumbCrumb[] {
  return learnerPathwayLessonEducationBreadcrumbs(pathway, lessonTitle, category);
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
    p.hubCrumb(true),
    { name: "Question bank", href: undefined, i18nKey: qbKey },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    p.countrySchema(),
    p.hubSchema(),
    { name: "Question bank", item: toAbsoluteSiteUrl(qPath), i18nKey: qbKey },
  ];
  return { crumbs, schemaItems };
}

/** Programmatic study SEO page (`…/study/{topicSlug}`) — hybrid lesson + practice hub. */
export function pathwayProgrammaticStudySeoBreadcrumbs(
  pathway: ExamPathwayDefinition,
  pageLabel: string,
  topicSlug: string,
  opts?: PathwayMarketingHubBreadcrumbOpts,
): {
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
} {
  const hub = opts?.hubBasePath;
  const p = examPathwaySurfacePrefix(pathway, opts);
  const selfPath = pathwayHubChildPath(pathway, hub, `study/${encodeURIComponent(topicSlug.trim())}`);
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    p.countryCrumb(true),
    p.hubCrumb(true),
    { name: pageLabel, href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    p.countrySchema(),
    p.hubSchema(),
    { name: pageLabel, item: toAbsoluteSiteUrl(selfPath) },
  ];
  return { crumbs, schemaItems };
}

/** Body-system study resource hub (`…/study-resources/{bodyKey}`) — data-backed SEO surface. */
export function pathwayStudyResourcesBodyBreadcrumbs(
  pathway: ExamPathwayDefinition,
  bodyDisplayLabel: string,
  bodyKey: string,
  opts?: PathwayMarketingHubBreadcrumbOpts,
): {
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
} {
  const hub = opts?.hubBasePath;
  const p = examPathwaySurfacePrefix(pathway, opts);
  const selfPath = pathwayHubChildPath(pathway, hub, `study-resources/${bodyKey.replace(/^\/+|\/+$/g, "")}`);
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    p.countryCrumb(true),
    p.hubCrumb(true),
    { name: bodyDisplayLabel, href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    p.countrySchema(),
    p.hubSchema(),
    { name: bodyDisplayLabel, item: toAbsoluteSiteUrl(selfPath) },
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
    p.hubCrumb(true),
    { name: "CAT practice", href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    p.countrySchema(),
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
    p.hubCrumb(true),
    { name: "Pricing", href: undefined, i18nKey: pricingKey },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    p.countrySchema(),
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
  const catHref = `/blog/category/${encodeURIComponent(cat)}`;
  return {
    crumbs: [
      HOME,
      { name: "Blog", href: "/blog", i18nKey: blogKey },
      { name: cat, href: catHref },
      { name: title, href: undefined },
    ],
    schemaItems: base.schemaItems,
  };
}

/** Blog category archive (matches `BlogPost.category` exactly). */
export function blogCategoryBreadcrumbs(category: string): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const catPath = `/blog/category/${encodeURIComponent(category)}`;
  const catLabel = `Category: ${category}`;
  const blogKey = "breadcrumbs.blog" as const;
  const crumbs: BreadcrumbCrumb[] = [
    HOME,
    { name: "Blog", href: "/blog", i18nKey: blogKey },
    { name: catLabel, href: undefined },
  ];
  const schemaItems: BreadcrumbSchemaItem[] = [
    HOME_ITEM,
    { name: "Blog", item: toAbsoluteSiteUrl("/blog"), i18nKey: blogKey },
    { name: catLabel, item: toAbsoluteSiteUrl(catPath) },
  ];
  return { crumbs, schemaItems };
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
