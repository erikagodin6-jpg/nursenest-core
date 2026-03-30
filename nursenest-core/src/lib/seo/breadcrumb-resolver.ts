/**
 * Central breadcrumb entrypoint: marketing helpers + re-exports of pathway/blog builders.
 *
 * **Schema rule:** emit `BreadcrumbJsonLd` only on public indexable routes. App routes use `BreadcrumbTrail` + `appShellBreadcrumbs` (no JSON-LD).
 *
 * @see `breadcrumb-types.ts` for route-class audit notes.
 */

import { toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";
import type { BreadcrumbCrumb, BreadcrumbResolution, BreadcrumbSchemaItem } from "@/lib/seo/breadcrumb-types";

const HOME: BreadcrumbCrumb = { name: "Home", href: "/" };

function abs(path: string): string {
  return toAbsoluteSiteUrl(path);
}

/** Home > {name} (current). */
export function simpleMarketingBreadcrumbs(name: string, path: string): BreadcrumbResolution {
  return {
    crumbs: [HOME, { name, href: undefined }],
    schemaItems: [
      { name: "Home", item: abs("/") },
      { name, item: abs(path) },
    ],
  };
}

export function marketingPricingBreadcrumbs(): BreadcrumbResolution {
  return simpleMarketingBreadcrumbs("Pricing", "/pricing");
}

export function preNursingHubBreadcrumbs(): BreadcrumbResolution {
  return simpleMarketingBreadcrumbs("Pre-nursing", "/pre-nursing");
}

export function preNursingModuleBreadcrumbs(moduleTitle: string, slug: string): BreadcrumbResolution {
  const path = `/pre-nursing/${slug}`;
  return {
    crumbs: [HOME, { name: "Pre-nursing", href: "/pre-nursing" }, { name: moduleTitle, href: undefined }],
    schemaItems: [
      { name: "Home", item: abs("/") },
      { name: "Pre-nursing", item: abs("/pre-nursing") },
      { name: moduleTitle, item: abs(path) },
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

/** Public homepage: single current crumb + JSON-LD (canonical `/`). */
export function marketingHomeSurfaceBreadcrumbs(): BreadcrumbResolution {
  return {
    crumbs: [{ name: "Home", href: undefined }],
    schemaItems: [{ name: "Home", item: abs("/") }],
  };
}

/** App shell: UX only — no schema items. */
export function appShellBreadcrumbs(section: "dashboard" | "lessons" | "questions" | "exams"): BreadcrumbCrumb[] {
  switch (section) {
    case "dashboard":
      return [HOME, { name: "Dashboard", href: undefined }];
    case "lessons":
      return [HOME, { name: "Lessons", href: undefined }];
    case "questions":
      return [HOME, { name: "Question bank", href: undefined }];
    case "exams":
      return [HOME, { name: "Practice exams", href: undefined }];
    default:
      return [HOME];
  }
}

export * from "@/lib/seo/pathway-breadcrumbs";
