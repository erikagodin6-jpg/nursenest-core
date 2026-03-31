import type { BreadcrumbCrumb, BreadcrumbSchemaItem } from "@/lib/seo/breadcrumb-types";
import { toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";

const HOME: BreadcrumbCrumb = { name: "Home", href: "/" };
const HOME_ITEM: BreadcrumbSchemaItem = { name: "Home", item: "/" };

const HUB_PATH = "/allied-health-exam-prep";
const HUB_LABEL = "Allied health exam prep";

export function alliedHubBreadcrumbs(): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  return {
    crumbs: [HOME, { name: HUB_LABEL, href: undefined }],
    schemaItems: [HOME_ITEM, { name: HUB_LABEL, item: toAbsoluteSiteUrl(HUB_PATH) }],
  };
}

export function alliedProfessionBreadcrumbs(professionLabel: string, professionPath: string): {
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
} {
  return {
    crumbs: [HOME, { name: HUB_LABEL, href: HUB_PATH }, { name: professionLabel, href: undefined }],
    schemaItems: [
      HOME_ITEM,
      { name: HUB_LABEL, item: toAbsoluteSiteUrl(HUB_PATH) },
      { name: professionLabel, item: toAbsoluteSiteUrl(professionPath) },
    ],
  };
}

export function alliedLessonsHubBreadcrumbs(professionLabel: string, professionPath: string, page: number): {
  crumbs: BreadcrumbCrumb[];
  schemaItems: BreadcrumbSchemaItem[];
} {
  const lessonsPath = `${professionPath}/lessons`;
  const label = page > 1 ? `Lessons (page ${page})` : "Lessons";
  return {
    crumbs: [
      HOME,
      { name: HUB_LABEL, href: HUB_PATH },
      { name: professionLabel, href: professionPath },
      { name: label, href: undefined },
    ],
    schemaItems: [
      HOME_ITEM,
      { name: HUB_LABEL, item: toAbsoluteSiteUrl(HUB_PATH) },
      { name: professionLabel, item: toAbsoluteSiteUrl(professionPath) },
      { name: "Lessons", item: toAbsoluteSiteUrl(lessonsPath) },
    ],
  };
}

export function alliedLessonDetailBreadcrumbs(
  professionLabel: string,
  professionPath: string,
  lessonTitle: string,
  lessonPath: string,
): { crumbs: BreadcrumbCrumb[]; schemaItems: BreadcrumbSchemaItem[] } {
  const lessonsPath = `${professionPath}/lessons`;
  return {
    crumbs: [
      HOME,
      { name: HUB_LABEL, href: HUB_PATH },
      { name: professionLabel, href: professionPath },
      { name: "Lessons", href: lessonsPath },
      { name: lessonTitle, href: undefined },
    ],
    schemaItems: [
      HOME_ITEM,
      { name: HUB_LABEL, item: toAbsoluteSiteUrl(HUB_PATH) },
      { name: professionLabel, item: toAbsoluteSiteUrl(professionPath) },
      { name: "Lessons", item: toAbsoluteSiteUrl(lessonsPath) },
      { name: lessonTitle, item: toAbsoluteSiteUrl(lessonPath) },
    ],
  };
}
