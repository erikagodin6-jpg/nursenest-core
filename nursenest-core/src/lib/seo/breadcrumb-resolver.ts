/**
 * Central breadcrumb entrypoint: marketing helpers + re-exports of pathway/blog builders.
 *
 * **Schema rule:** emit `BreadcrumbJsonLd` only on public indexable routes. App routes use `BreadcrumbTrail` + `appShellBreadcrumbs` (no JSON-LD).
 *
 * @see `breadcrumb-types.ts` for route-class audit notes.
 */

import { toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";
import type {
  BreadcrumbCrumb,
  BreadcrumbResolution,
  BreadcrumbSchemaItem,
} from "@/lib/seo/breadcrumb-types";

const HOME: BreadcrumbCrumb = { name: "Home", href: "/", i18nKey: "breadcrumbs.home" };

function abs(path: string): string {
  return toAbsoluteSiteUrl(path);
}

/** Home > {name} (current). */
export function simpleMarketingBreadcrumbs(
  name: string,
  path: string,
  opts?: { nameI18nKey?: string },
): BreadcrumbResolution {
  const homeSchema: BreadcrumbSchemaItem = { name: "Home", item: abs("/"), i18nKey: "breadcrumbs.home" };
  return {
    crumbs: [HOME, { name, href: undefined, i18nKey: opts?.nameI18nKey }],
    schemaItems: [homeSchema, { name, item: abs(path), i18nKey: opts?.nameI18nKey }],
  };
}

export function marketingPricingBreadcrumbs(): BreadcrumbResolution {
  return simpleMarketingBreadcrumbs("Pricing", "/pricing", { nameI18nKey: "breadcrumbs.pricing" });
}

export function preNursingHubBreadcrumbs(): BreadcrumbResolution {
  return simpleMarketingBreadcrumbs("Pre-nursing", "/pre-nursing");
}

export function preNursingLessonsHubBreadcrumbs(page: number): BreadcrumbResolution {
  const safePage = Math.max(1, page);
  if (safePage <= 1) {
    return {
      crumbs: [HOME, { name: "Pre-nursing", href: "/pre-nursing" }, { name: "Lessons", href: undefined }],
      schemaItems: [
        { name: "Home", item: abs("/") },
        { name: "Pre-nursing", item: abs("/pre-nursing") },
        { name: "Lessons", item: abs("/pre-nursing/lessons") },
      ],
    };
  }
  return {
    crumbs: [
      HOME,
      { name: "Pre-nursing", href: "/pre-nursing" },
      { name: "Lessons", href: "/pre-nursing/lessons" },
      { name: `Page ${safePage}`, href: undefined },
    ],
    schemaItems: [
      { name: "Home", item: abs("/") },
      { name: "Pre-nursing", item: abs("/pre-nursing") },
      { name: "Lessons", item: abs("/pre-nursing/lessons") },
      { name: `Page ${safePage}`, item: abs(`/pre-nursing/lessons?page=${safePage}`) },
    ],
  };
}

export function preNursingModuleBreadcrumbs(moduleTitle: string, slug: string): BreadcrumbResolution {
  const path = `/pre-nursing/lessons/${slug}`;
  return {
    crumbs: [
      HOME,
      { name: "Pre-nursing", href: "/pre-nursing" },
      { name: "Lessons", href: "/pre-nursing/lessons" },
      { name: moduleTitle, href: undefined },
    ],
    schemaItems: [
      { name: "Home", item: abs("/") },
      { name: "Pre-nursing", item: abs("/pre-nursing") },
      { name: "Lessons", item: abs("/pre-nursing/lessons") },
      { name: moduleTitle, item: abs(path) },
    ],
  };
}

export function preNursingStudyPlanBreadcrumbs(): BreadcrumbResolution {
  return {
    crumbs: [
      HOME,
      { name: "Pre-nursing", href: "/pre-nursing" },
      { name: "Study planning", href: undefined },
    ],
    schemaItems: [
      { name: "Home", item: abs("/") },
      { name: "Pre-nursing", item: abs("/pre-nursing") },
      { name: "Study planning", item: abs("/pre-nursing/study-plan") },
    ],
  };
}

export function caseStudiesBreadcrumbs(): BreadcrumbResolution {
  return simpleMarketingBreadcrumbs("Case studies", "/case-studies");
}

export function toolsIndexBreadcrumbs(): BreadcrumbResolution {
  return simpleMarketingBreadcrumbs("Study tools", "/tools");
}

export function toolsSlugBreadcrumbs(toolName: string, slug: string): BreadcrumbResolution {
  const path = `/tools/${slug}`;
  return {
    crumbs: [HOME, { name: "Study tools", href: "/tools" }, { name: toolName, href: undefined }],
    schemaItems: [
      { name: "Home", item: abs("/") },
      { name: "Study tools", item: abs("/tools") },
      { name: toolName, item: abs(path) },
    ],
  };
}

export function forInstitutionsBreadcrumbs(): BreadcrumbResolution {
  return simpleMarketingBreadcrumbs("For institutions", "/for-institutions");
}

/** Public homepage: no visible trail (root is obvious); JSON-LD still lists Home for SEO. */
export function marketingHomeSurfaceBreadcrumbs(): BreadcrumbResolution {
  return {
    crumbs: [],
    schemaItems: [{ name: "Home", item: abs("/"), i18nKey: "breadcrumbs.home" }],
  };
}

/** App shell account hub: Home → Dashboard → Account → current (UX only). */
export function appAccountBreadcrumbs(leafLabel: string): BreadcrumbCrumb[] {
  return [
    HOME,
    { name: "Dashboard", href: "/app" },
    { name: "Account", href: "/app/account" },
    { name: leafLabel, href: undefined },
  ];
}

/** Account landing (`/app/account`): Home → Dashboard → Account (current). */
export function appAccountHubBreadcrumbs(): BreadcrumbCrumb[] {
  return [HOME, { name: "Dashboard", href: "/app" }, { name: "Account", href: undefined }];
}

/** App shell: UX only. No schema items. */
export function appShellBreadcrumbs(
  section: "dashboard" | "lessons" | "questions" | "exams" | "practice-tests",
): BreadcrumbCrumb[] {
  switch (section) {
    case "dashboard":
      return [HOME, { name: "Dashboard", href: undefined }];
    case "lessons":
      return [HOME, { name: "Lessons", href: undefined }];
    case "questions":
      return [HOME, { name: "Question Bank", href: undefined }];
    case "exams":
      return [HOME, { name: "Practice Exams", href: undefined }];
    case "practice-tests":
      return [HOME, { name: "Practice Test", href: undefined }];
    default:
      return [HOME];
  }
}

export * from "@/lib/seo/pathway-breadcrumbs";
