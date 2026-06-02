/**
 * Canonical breadcrumb href builder — all trail links derive from shared route helpers.
 */

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { marketingPathwayLessonsCategoryPath } from "@/lib/lessons/lesson-routes";
import { toAbsoluteSiteUrl } from "@/lib/seo/breadcrumb-utils";
import { getBreadcrumbRoot } from "@/lib/breadcrumbs/breadcrumb-root-registry";

const LEGACY_BREADCRUMB_HREF_PREFIXES = [
  "/client/",
  "/legacy/",
  "/old/",
  "/gs://",
  "/rpn/rex-pn",
] as const;

/** Pathway marketing aliases that must not appear in governed hrefs. */
const FORBIDDEN_PATHWAY_ALIASES = ["/rpn/", "/rex-pn-old"] as const;

export function canonicalMarketingPath(path: string): string {
  const raw = path.trim() || "/";
  const noQuery = raw.split("?")[0]?.split("#")[0] ?? "/";
  const withLeading = noQuery.startsWith("/") ? noQuery : `/${noQuery}`;
  const collapsed = withLeading.replace(/\/{2,}/g, "/");
  if (collapsed.length > 1 && collapsed.endsWith("/")) {
    return collapsed.slice(0, -1);
  }
  return collapsed || "/";
}

export function canonicalBreadcrumbHref(path: string): string {
  return toAbsoluteSiteUrl(canonicalMarketingPath(path));
}

export function pathwayHubHref(pathway: ExamPathwayDefinition): string {
  return canonicalMarketingPath(buildExamPathwayPath(pathway));
}

export function pathwayLessonsHref(pathway: ExamPathwayDefinition): string {
  return canonicalMarketingPath(buildExamPathwayPath(pathway, "lessons"));
}

export function pathwayLessonHref(pathway: ExamPathwayDefinition, lessonSlug: string): string {
  return canonicalMarketingPath(buildExamPathwayPath(pathway, `lessons/${lessonSlug}`));
}

export function pathwayCategoryHref(pathway: ExamPathwayDefinition, categorySlug: string): string {
  return canonicalMarketingPath(marketingPathwayLessonsCategoryPath(pathway, categorySlug));
}

export function pathwayTopicClusterHref(pathway: ExamPathwayDefinition, topicSlug: string): string {
  const base = pathwayLessonsHref(pathway);
  const qs = new URLSearchParams({ topicSlug: topicSlug.trim().toLowerCase() });
  return `${base}?${qs.toString()}`;
}

export function academyRootHref(rootId: "ecg" | "clinical_modules"): string {
  const root = getBreadcrumbRoot(rootId);
  return root ? canonicalMarketingPath(root.href) : "/";
}

export function glossaryTermHref(termSlug: string): string {
  const hub = getBreadcrumbRoot("glossary")?.href ?? "/nursing-glossary";
  return canonicalMarketingPath(`${hub}/${termSlug}`);
}

export function glossaryHubHref(): string {
  return canonicalMarketingPath(getBreadcrumbRoot("glossary")?.href ?? "/nursing-glossary");
}

export type HrefGovernanceIssue = {
  code: "legacy_prefix" | "empty_path" | "non_canonical";
  href: string;
};

export function auditBreadcrumbHref(href: string | undefined): HrefGovernanceIssue | null {
  if (!href?.trim()) return { code: "empty_path", href: href ?? "" };
  const path = canonicalMarketingPath(href);
  for (const prefix of LEGACY_BREADCRUMB_HREF_PREFIXES) {
    if (path.startsWith(prefix)) return { code: "legacy_prefix", href: path };
  }
  for (const alias of FORBIDDEN_PATHWAY_ALIASES) {
    if (path.includes(alias)) return { code: "non_canonical", href: path };
  }
  if (path.includes("/glossary/") && !path.startsWith("/nursing-glossary")) {
    return { code: "non_canonical", href: path };
  }
  return null;
}

export function auditTrailHrefs(hrefs: readonly (string | undefined)[]): HrefGovernanceIssue[] {
  const issues: HrefGovernanceIssue[] = [];
  for (const href of hrefs) {
    if (!href) continue;
    const issue = auditBreadcrumbHref(href);
    if (issue) issues.push(issue);
  }
  return issues;
}
