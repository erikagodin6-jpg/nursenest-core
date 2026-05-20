/**
 * Central breadcrumb entrypoint: marketing helpers + re-exports of pathway/blog builders.
 *
 * **Schema rule:** emit `BreadcrumbJsonLd` only on public indexable routes. App routes use `LearnerBreadcrumbTrail` (no JSON-LD).
 *
 * @see `breadcrumb-types.ts` for route-class audit notes.
 */

import { resolveAppShellBreadcrumbCrumbs } from "@/lib/breadcrumbs/app-shell-breadcrumb-adapter";
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

/**
 * App shell crumbs via governed learner resolver (no JSON-LD).
 * @deprecated Use `resolveLearnerBreadcrumbResolution` / `LearnerBreadcrumbTrail` in pages.
 */
export function appShellBreadcrumbs(
  section: "dashboard" | "lessons" | "questions" | "exams" | "practice-tests",
): BreadcrumbCrumb[] {
  return resolveAppShellBreadcrumbCrumbs(section);
}

export * from "@/lib/seo/pathway-breadcrumbs";

// ── Authority cluster breadcrumbs ─────────────────────────────────────────────

/** Home > CNPLE > [leaf] — for /canada/np/cnple/* sub-pages. */
export function cnpleHubClusterBreadcrumbs(leafName: string, leafPath: string): BreadcrumbResolution {
  return {
    crumbs: [
      HOME,
      { name: "CNPLE", href: "/cnple" },
      { name: leafName, href: undefined },
    ],
    schemaItems: [
      { name: "Home", item: abs("/") },
      { name: "CNPLE", item: abs("/cnple") },
      { name: leafName, item: abs(leafPath) },
    ],
  };
}

/** Home > REx-PN Hub — for /canada/pn/rex-pn. */
export function rexPnHubBreadcrumbs(): BreadcrumbResolution {
  return simpleMarketingBreadcrumbs("REx-PN", "/canada/pn/rex-pn");
}

/** Home > REx-PN > [leaf] — for /canada/pn/rex-pn/* sub-pages. */
export function rexPnClusterBreadcrumbs(leafName: string, leafPath: string): BreadcrumbResolution {
  const hubPath = "/canada/pn/rex-pn";
  return {
    crumbs: [
      HOME,
      { name: "REx-PN", href: hubPath },
      { name: leafName, href: undefined },
    ],
    schemaItems: [
      { name: "Home", item: abs("/") },
      { name: "REx-PN", item: abs(hubPath) },
      { name: leafName, item: abs(leafPath) },
    ],
  };
}

/** Home > Allied Health > Respiratory Therapy — for /allied-health/respiratory-therapy. */
export function rtHubBreadcrumbs(): BreadcrumbResolution {
  return {
    crumbs: [
      HOME,
      { name: "Allied Health", href: "/allied-health" },
      { name: "Respiratory Therapy", href: undefined },
    ],
    schemaItems: [
      { name: "Home", item: abs("/") },
      { name: "Allied Health", item: abs("/allied-health") },
      { name: "Respiratory Therapy", item: abs("/allied-health/respiratory-therapy") },
    ],
  };
}

/** Home > Allied Health > Respiratory Therapy > [leaf] — for /allied-health/respiratory-therapy/* sub-pages. */
export function rtClusterBreadcrumbs(leafName: string, leafPath: string): BreadcrumbResolution {
  const hubPath = "/allied-health/respiratory-therapy";
  return {
    crumbs: [
      HOME,
      { name: "Allied Health", href: "/allied-health" },
      { name: "Respiratory Therapy", href: hubPath },
      { name: leafName, href: undefined },
    ],
    schemaItems: [
      { name: "Home", item: abs("/") },
      { name: "Allied Health", item: abs("/allied-health") },
      { name: "Respiratory Therapy", item: abs(hubPath) },
      { name: leafName, item: abs(leafPath) },
    ],
  };
}
