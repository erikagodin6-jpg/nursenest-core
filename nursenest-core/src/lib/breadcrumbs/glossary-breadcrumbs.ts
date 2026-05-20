/**
 * Glossary breadcrumbs (education intent) — wire when public glossary routes ship.
 */

import type { BreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-types";
import { attachIntentToResolution } from "@/lib/breadcrumbs/breadcrumb-intent";
import { toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";

const HOME = { name: "Home", href: "/", i18nKey: "breadcrumbs.home" as const };

export function glossaryIndexBreadcrumbs(examLabel: string, examPath: string): BreadcrumbResolution {
  return attachIntentToResolution(
    {
      crumbs: [HOME, { name: examLabel, href: examPath }, { name: "Glossary", href: undefined }],
      schemaItems: [
        { name: "Home", item: toAbsoluteSiteUrl("/") },
        { name: examLabel, item: toAbsoluteSiteUrl(examPath) },
        { name: "Glossary", item: toAbsoluteSiteUrl(`${examPath.replace(/\/$/, "")}/glossary`) },
      ],
    },
    "education",
  );
}

export function glossaryTermBreadcrumbs(
  examLabel: string,
  examPath: string,
  termLabel: string,
  termPath: string,
): BreadcrumbResolution {
  const glossaryPath = `${examPath.replace(/\/$/, "")}/glossary`;
  return attachIntentToResolution(
    {
      crumbs: [
        HOME,
        { name: examLabel, href: examPath },
        { name: "Glossary", href: glossaryPath },
        { name: termLabel, href: undefined },
      ],
      schemaItems: [
        { name: "Home", item: toAbsoluteSiteUrl("/") },
        { name: examLabel, item: toAbsoluteSiteUrl(examPath) },
        { name: "Glossary", item: toAbsoluteSiteUrl(glossaryPath) },
        { name: termLabel, item: toAbsoluteSiteUrl(termPath) },
      ],
    },
    "education",
  );
}
