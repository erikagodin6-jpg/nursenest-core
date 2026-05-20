/**
 * Clinical academy breadcrumbs (ECG, labs, hemodynamics) — education intent.
 */

import type { BreadcrumbCrumb, BreadcrumbSchemaItem, BreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-types";
import { attachIntentToResolution } from "@/lib/breadcrumbs/breadcrumb-intent";
import { toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";

const HOME: BreadcrumbCrumb = { name: "Home", href: "/", i18nKey: "breadcrumbs.home" };
const HOME_ITEM: BreadcrumbSchemaItem = { name: "Home", item: "/", i18nKey: "breadcrumbs.home" };

const CLINICAL_MODULES = { name: "Clinical Modules", href: "/clinical-modules" };
const CLINICAL_MODULES_ITEM: BreadcrumbSchemaItem = {
  name: "Clinical Modules",
  item: toAbsoluteSiteUrl("/clinical-modules"),
};

const ECG_HUB = { name: "ECG Interpretation", href: "/ecg" };
const ECG_HUB_ITEM: BreadcrumbSchemaItem = {
  name: "ECG Interpretation",
  item: toAbsoluteSiteUrl("/ecg"),
};

function educationResolution(
  crumbs: BreadcrumbCrumb[],
  schemaItems: BreadcrumbSchemaItem[],
): BreadcrumbResolution {
  return attachIntentToResolution({ crumbs, schemaItems }, "education");
}

/** `/ecg` hub */
export function ecgHubBreadcrumbs(): BreadcrumbResolution {
  return educationResolution([HOME, { name: "ECG Interpretation", href: undefined }], [HOME_ITEM, ECG_HUB_ITEM]);
}

/** `/ecg/{topic}` cluster topic */
export function ecgTopicBreadcrumbs(topicLabel: string, topicPath: string): BreadcrumbResolution {
  return educationResolution(
    [HOME, ECG_HUB, { name: topicLabel, href: undefined }],
    [HOME_ITEM, ECG_HUB_ITEM, { name: topicLabel, item: toAbsoluteSiteUrl(topicPath) }],
  );
}

/** `/advanced-ecg-nursing` hub */
export function ecgAdvancedHubBreadcrumbs(): BreadcrumbResolution {
  return educationResolution(
    [HOME, ECG_HUB, { name: "Advanced ECG for Nurses", href: undefined }],
    [
      HOME_ITEM,
      ECG_HUB_ITEM,
      { name: "Advanced ECG for Nurses", item: toAbsoluteSiteUrl("/advanced-ecg-nursing") },
    ],
  );
}

/** Leaf under `/advanced-ecg-nursing/*` */
export function ecgAdvancedLeafBreadcrumbs(leafLabel: string, leafPath: string): BreadcrumbResolution {
  return educationResolution(
    [
      HOME,
      ECG_HUB,
      { name: "Advanced ECG for Nurses", href: "/advanced-ecg-nursing" },
      { name: leafLabel, href: undefined },
    ],
    [
      HOME_ITEM,
      ECG_HUB_ITEM,
      { name: "Advanced ECG for Nurses", item: toAbsoluteSiteUrl("/advanced-ecg-nursing") },
      { name: leafLabel, item: toAbsoluteSiteUrl(leafPath) },
    ],
  );
}

/** Standalone ECG marketing pages that sit beside the hub (e.g. `/ecg-interpretation`, `/pals-rhythms`). */
export function ecgStandaloneLeafBreadcrumbs(leafLabel: string, leafPath: string): BreadcrumbResolution {
  return educationResolution(
    [HOME, ECG_HUB, { name: leafLabel, href: undefined }],
    [HOME_ITEM, ECG_HUB_ITEM, { name: leafLabel, item: toAbsoluteSiteUrl(leafPath) }],
  );
}

/** `/clinical-modules` hub */
export function clinicalModulesHubBreadcrumbs(): BreadcrumbResolution {
  return educationResolution(
    [HOME, { name: "Clinical Modules", href: undefined }],
    [HOME_ITEM, CLINICAL_MODULES_ITEM],
  );
}

/** `/labs-interpretation`, `/advanced-labs-interpretation` hubs */
export function labsHubBreadcrumbs(hubLabel: string, hubPath: string): BreadcrumbResolution {
  return educationResolution(
    [HOME, CLINICAL_MODULES, { name: hubLabel, href: undefined }],
    [HOME_ITEM, CLINICAL_MODULES_ITEM, { name: hubLabel, item: toAbsoluteSiteUrl(hubPath) }],
  );
}

/** Hemodynamics / labs leaf under clinical modules */
export function labsClinicalModuleLeafBreadcrumbs(leafLabel: string, leafPath: string): BreadcrumbResolution {
  return educationResolution(
    [HOME, CLINICAL_MODULES, { name: leafLabel, href: undefined }],
    [HOME_ITEM, CLINICAL_MODULES_ITEM, { name: leafLabel, item: toAbsoluteSiteUrl(leafPath) }],
  );
}

/** Labs leaf with parent hub link (advanced labs children). */
export function labsHubChildBreadcrumbs(
  hubLabel: string,
  hubPath: string,
  leafLabel: string,
  leafPath: string,
): BreadcrumbResolution {
  return educationResolution(
    [
      HOME,
      CLINICAL_MODULES,
      { name: hubLabel, href: hubPath },
      { name: leafLabel, href: undefined },
    ],
    [
      HOME_ITEM,
      CLINICAL_MODULES_ITEM,
      { name: hubLabel, item: toAbsoluteSiteUrl(hubPath) },
      { name: leafLabel, item: toAbsoluteSiteUrl(leafPath) },
    ],
  );
}
