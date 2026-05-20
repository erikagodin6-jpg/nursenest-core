/**
 * Clinical academy breadcrumbs — education intent via canonical root registry.
 */

import type { BreadcrumbCrumb, BreadcrumbSchemaItem, BreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-types";
import {
  getBreadcrumbRoot,
  rootCrumbFromDefinition,
  rootSchemaFromDefinition,
} from "@/lib/breadcrumbs/breadcrumb-root-registry";
import { applyGovernedBreadcrumbResolution } from "@/lib/breadcrumbs/governed-breadcrumb-resolution";
import { canonicalBreadcrumbHref, canonicalMarketingPath } from "@/lib/breadcrumbs/canonical-breadcrumb-href-builder";

function homeCrumb(): BreadcrumbCrumb {
  const home = getBreadcrumbRoot("home")!;
  return rootCrumbFromDefinition(home, true);
}

function homeSchema(): BreadcrumbSchemaItem {
  const home = getBreadcrumbRoot("home")!;
  return rootSchemaFromDefinition(home);
}

function governedAcademy(
  pathname: string,
  crumbs: BreadcrumbCrumb[],
  schemaItems: BreadcrumbSchemaItem[],
  canonicalRootId: "ecg" | "clinical_modules",
): BreadcrumbResolution {
  return applyGovernedBreadcrumbResolution({
    resolution: { crumbs, schemaItems },
    surface: "academy",
    pathname,
    canonicalRootId,
  });
}

/** `/ecg` hub */
export function ecgHubBreadcrumbs(): BreadcrumbResolution {
  const ecg = getBreadcrumbRoot("ecg")!;
  return governedAcademy(
    ecg.href,
    [homeCrumb(), rootCrumbFromDefinition(ecg, false)],
    [homeSchema(), rootSchemaFromDefinition(ecg)],
    "ecg",
  );
}

/** `/ecg/{topic}` cluster topic */
export function ecgTopicBreadcrumbs(topicLabel: string, topicPath: string): BreadcrumbResolution {
  const ecg = getBreadcrumbRoot("ecg")!;
  const path = canonicalMarketingPath(topicPath);
  return governedAcademy(
    path,
    [homeCrumb(), rootCrumbFromDefinition(ecg, true), { name: topicLabel, href: undefined }],
    [homeSchema(), rootSchemaFromDefinition(ecg), { name: topicLabel, item: canonicalBreadcrumbHref(path) }],
    "ecg",
  );
}

/** `/advanced-ecg-nursing` hub */
export function ecgAdvancedHubBreadcrumbs(): BreadcrumbResolution {
  const ecg = getBreadcrumbRoot("ecg")!;
  const advancedPath = "/advanced-ecg-nursing";
  return governedAcademy(
    advancedPath,
    [homeCrumb(), rootCrumbFromDefinition(ecg, true), { name: "Advanced ECG for Nurses", href: undefined }],
    [
      homeSchema(),
      rootSchemaFromDefinition(ecg),
      { name: "Advanced ECG for Nurses", item: canonicalBreadcrumbHref(advancedPath) },
    ],
    "ecg",
  );
}

/** Leaf under `/advanced-ecg-nursing/*` */
export function ecgAdvancedLeafBreadcrumbs(leafLabel: string, leafPath: string): BreadcrumbResolution {
  const ecg = getBreadcrumbRoot("ecg")!;
  const path = canonicalMarketingPath(leafPath);
  const advancedPath = "/advanced-ecg-nursing";
  return governedAcademy(
    path,
    [
      homeCrumb(),
      rootCrumbFromDefinition(ecg, true),
      { name: "Advanced ECG for Nurses", href: advancedPath },
      { name: leafLabel, href: undefined },
    ],
    [
      homeSchema(),
      rootSchemaFromDefinition(ecg),
      { name: "Advanced ECG for Nurses", item: canonicalBreadcrumbHref(advancedPath) },
      { name: leafLabel, item: canonicalBreadcrumbHref(path) },
    ],
    "ecg",
  );
}

/** Standalone ECG marketing pages (e.g. `/ecg-interpretation`, `/pals-rhythms`). */
export function ecgStandaloneLeafBreadcrumbs(leafLabel: string, leafPath: string): BreadcrumbResolution {
  const ecg = getBreadcrumbRoot("ecg")!;
  const path = canonicalMarketingPath(leafPath);
  return governedAcademy(
    path,
    [homeCrumb(), rootCrumbFromDefinition(ecg, true), { name: leafLabel, href: undefined }],
    [homeSchema(), rootSchemaFromDefinition(ecg), { name: leafLabel, item: canonicalBreadcrumbHref(path) }],
    "ecg",
  );
}

/** `/clinical-modules` hub */
export function clinicalModulesHubBreadcrumbs(): BreadcrumbResolution {
  const mod = getBreadcrumbRoot("clinical_modules")!;
  return governedAcademy(
    mod.href,
    [homeCrumb(), rootCrumbFromDefinition(mod, false)],
    [homeSchema(), rootSchemaFromDefinition(mod)],
    "clinical_modules",
  );
}

/** `/labs-interpretation`, `/advanced-labs-interpretation` hubs */
export function labsHubBreadcrumbs(hubLabel: string, hubPath: string): BreadcrumbResolution {
  const mod = getBreadcrumbRoot("clinical_modules")!;
  const path = canonicalMarketingPath(hubPath);
  return governedAcademy(
    path,
    [homeCrumb(), rootCrumbFromDefinition(mod, true), { name: hubLabel, href: undefined }],
    [homeSchema(), rootSchemaFromDefinition(mod), { name: hubLabel, item: canonicalBreadcrumbHref(path) }],
    "clinical_modules",
  );
}

/** Hemodynamics / labs leaf under clinical modules */
export function labsClinicalModuleLeafBreadcrumbs(leafLabel: string, leafPath: string): BreadcrumbResolution {
  const mod = getBreadcrumbRoot("clinical_modules")!;
  const path = canonicalMarketingPath(leafPath);
  return governedAcademy(
    path,
    [homeCrumb(), rootCrumbFromDefinition(mod, true), { name: leafLabel, href: undefined }],
    [homeSchema(), rootSchemaFromDefinition(mod), { name: leafLabel, item: canonicalBreadcrumbHref(path) }],
    "clinical_modules",
  );
}

/** Labs leaf with parent hub link (advanced labs children). */
export function labsHubChildBreadcrumbs(
  hubLabel: string,
  hubPath: string,
  leafLabel: string,
  leafPath: string,
): BreadcrumbResolution {
  const mod = getBreadcrumbRoot("clinical_modules")!;
  const hub = canonicalMarketingPath(hubPath);
  const leaf = canonicalMarketingPath(leafPath);
  return governedAcademy(
    leaf,
    [
      homeCrumb(),
      rootCrumbFromDefinition(mod, true),
      { name: hubLabel, href: hub },
      { name: leafLabel, href: undefined },
    ],
    [
      homeSchema(),
      rootSchemaFromDefinition(mod),
      { name: hubLabel, item: canonicalBreadcrumbHref(hub) },
      { name: leafLabel, item: canonicalBreadcrumbHref(leaf) },
    ],
    "clinical_modules",
  );
}
