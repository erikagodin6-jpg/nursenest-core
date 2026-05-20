/**
 * Clinical interpretation hierarchy — education intent, ready when routes ship.
 *
 * Home → Clinical Interpretation → {Category} → {Guide}
 */

import type { BreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-types";
import { attachIntentToResolution } from "@/lib/breadcrumbs/breadcrumb-intent";
import {
  clinicalInterpretationGuidePath,
  type ClinicalInterpretationCategory,
} from "@/lib/clinical-interpretation/clinical-interpretation-registry";
import { toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";

const HOME = { name: "Home", href: "/", i18nKey: "breadcrumbs.home" as const };
const INTERPRETATION_HUB = {
  name: "Clinical Interpretation",
  href: "/clinical-interpretation",
};

const CATEGORY_LABELS: Record<ClinicalInterpretationCategory, string> = {
  acid_base: "Acid–base & ABG",
  cardiac_rhythm: "Cardiac & rhythm",
  imaging: "Imaging",
  laboratory: "Laboratory",
  critical_care: "Critical care",
  fluids_electrolytes: "Fluids & electrolytes",
  infection_sepsis: "Infection & sepsis",
  perfusion_shock: "Perfusion & shock",
};

function categoryHubPath(category: ClinicalInterpretationCategory): string {
  return `/clinical-interpretation/${category.replace(/_/g, "-")}`;
}

export function clinicalInterpretationHubBreadcrumbs(): BreadcrumbResolution {
  return attachIntentToResolution(
    {
      crumbs: [HOME, { name: "Clinical Interpretation", href: undefined }],
      schemaItems: [
        { name: "Home", item: toAbsoluteSiteUrl("/") },
        { name: "Clinical Interpretation", item: toAbsoluteSiteUrl("/clinical-interpretation") },
      ],
    },
    "education",
  );
}

export function clinicalInterpretationCategoryBreadcrumbs(
  category: ClinicalInterpretationCategory,
): BreadcrumbResolution {
  const label = CATEGORY_LABELS[category];
  const path = categoryHubPath(category);
  return attachIntentToResolution(
    {
      crumbs: [HOME, INTERPRETATION_HUB, { name: label, href: undefined }],
      schemaItems: [
        { name: "Home", item: toAbsoluteSiteUrl("/") },
        { name: "Clinical Interpretation", item: toAbsoluteSiteUrl("/clinical-interpretation") },
        { name: label, item: toAbsoluteSiteUrl(path) },
      ],
    },
    "education",
  );
}

export function clinicalInterpretationGuideBreadcrumbs(args: {
  category: ClinicalInterpretationCategory;
  guideTitle: string;
  guideSlug: string;
}): BreadcrumbResolution {
  const categoryLabel = CATEGORY_LABELS[args.category];
  const categoryPath = categoryHubPath(args.category);
  const guidePath = clinicalInterpretationGuidePath(args.guideSlug);
  return attachIntentToResolution(
    {
      crumbs: [
        HOME,
        INTERPRETATION_HUB,
        { name: categoryLabel, href: categoryPath },
        { name: args.guideTitle, href: undefined },
      ],
      schemaItems: [
        { name: "Home", item: toAbsoluteSiteUrl("/") },
        { name: "Clinical Interpretation", item: toAbsoluteSiteUrl("/clinical-interpretation") },
        { name: categoryLabel, item: toAbsoluteSiteUrl(categoryPath) },
        { name: args.guideTitle, item: toAbsoluteSiteUrl(guidePath) },
      ],
    },
    "education",
  );
}

/** ABG example: Home → Clinical Interpretation → Acid–base & ABG → Respiratory Acidosis */
export function abgInterpretationGuideBreadcrumbs(
  guideTitle: string,
  guideSlug: string,
): BreadcrumbResolution {
  return clinicalInterpretationGuideBreadcrumbs({
    category: "acid_base",
    guideTitle,
    guideSlug,
  });
}
