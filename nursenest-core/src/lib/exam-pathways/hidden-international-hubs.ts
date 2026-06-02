import type { Metadata } from "next";
import {
  findGlobalExamRegistryEntryByAdminRoute,
  type GlobalExamRegistryEntry,
} from "@/lib/exam-pathways/global-exam-registry";

export type HiddenInternationalHubModel = {
  readonly entry: GlobalExamRegistryEntry;
  readonly title: string;
  readonly description: string;
  readonly routePolicy: {
    readonly adminOnly: true;
    readonly noindex: true;
    readonly navigationEligible: false;
    readonly sitemapEligible: false;
  };
};

export function resolveHiddenInternationalHub(
  countryCodeOrSlug: string,
  profession: string,
): HiddenInternationalHubModel | null {
  const entry = findGlobalExamRegistryEntryByAdminRoute(countryCodeOrSlug, profession);
  if (!entry || entry.visibilityStatus !== "admin_only_hidden") return null;
  return {
    entry,
    title: `${entry.country} ${entry.profession.toUpperCase()} ${entry.exam} Draft Hub`,
    description: `${entry.regulator} pathway foundation. Admin-only draft inventory for future NurseNest expansion.`,
    routePolicy: {
      adminOnly: true,
      noindex: true,
      navigationEligible: false,
      sitemapEligible: false,
    },
  };
}

export function hiddenInternationalHubMetadata(model: HiddenInternationalHubModel): Metadata {
  return {
    title: model.title,
    description: model.description,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
  };
}
