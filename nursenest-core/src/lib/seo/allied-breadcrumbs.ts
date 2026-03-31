import type { BreadcrumbCrumb, BreadcrumbSchemaItem } from "@/lib/seo/breadcrumb-types";
import { toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";

const HOME: BreadcrumbCrumb = { name: "Home", href: "/" };
const HOME_ITEM: BreadcrumbSchemaItem = { name: "Home", item: "/" };

const HUB_PATH = "/allied-health";
const HUB_LABEL = "Allied health";

export function alliedHubBreadcrumbs(): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  return {
    crumbs: [HOME, { name: HUB_LABEL, href: undefined }],
    schemaItems: [HOME_ITEM, { name: HUB_LABEL, item: toAbsoluteSiteUrl(HUB_PATH) }],
  };
}

export function alliedProfessionBreadcrumbs(professionLabel: string, professionHeroPath: string): {
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
} {
  return {
    crumbs: [HOME, { name: HUB_LABEL, href: HUB_PATH }, { name: professionLabel, href: undefined }],
    schemaItems: [
      HOME_ITEM,
      { name: HUB_LABEL, item: toAbsoluteSiteUrl(HUB_PATH) },
      { name: professionLabel, item: toAbsoluteSiteUrl(professionHeroPath) },
    ],
  };
}

export function alliedLessonsHubBreadcrumbs(
  professionLabel: string,
  professionHeroPath: string,
  lessonsBasePath: string,
  page: number,
): {
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
} {
  const label = page > 1 ? `Lessons (page ${page})` : "Lessons";
  return {
    crumbs: [
      HOME,
      { name: HUB_LABEL, href: HUB_PATH },
      { name: professionLabel, href: professionHeroPath },
      { name: label, href: undefined },
    ],
    schemaItems: [
      HOME_ITEM,
      { name: HUB_LABEL, item: toAbsoluteSiteUrl(HUB_PATH) },
      { name: professionLabel, item: toAbsoluteSiteUrl(professionHeroPath) },
      { name: "Lessons", item: toAbsoluteSiteUrl(lessonsBasePath) },
    ],
  };
}

export function alliedLessonDetailBreadcrumbs(
  professionLabel: string,
  professionHeroPath: string,
  lessonsBasePath: string,
  lessonTitle: string,
  lessonPath: string,
): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  return {
    crumbs: [
      HOME,
      { name: HUB_LABEL, href: HUB_PATH },
      { name: professionLabel, href: professionHeroPath },
      { name: "Lessons", href: lessonsBasePath },
      { name: lessonTitle, href: undefined },
    ],
    schemaItems: [
      HOME_ITEM,
      { name: HUB_LABEL, item: toAbsoluteSiteUrl(HUB_PATH) },
      { name: professionLabel, item: toAbsoluteSiteUrl(professionHeroPath) },
      { name: "Lessons", item: toAbsoluteSiteUrl(lessonsBasePath) },
      { name: lessonTitle, item: toAbsoluteSiteUrl(lessonPath) },
    ],
  };
}
