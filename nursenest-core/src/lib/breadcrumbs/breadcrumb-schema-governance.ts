/**
 * Breadcrumb schema governance — single owner per route, CI-hard failures.
 */

import {
  pageOwnsBreadcrumbSchema,
  shouldEmitLayoutBreadcrumbFallback,
} from "@/lib/breadcrumbs/schema-ownership";
import {
  detectDuplicateBreadcrumbSchema,
  type SchemaGovernanceIssue,
} from "@/lib/breadcrumbs/structured-data-governance";
import { detectForbiddenRootAlias } from "@/lib/breadcrumbs/breadcrumb-root-registry";
import type { BreadcrumbCrumb, BreadcrumbSchemaItem } from "@/lib/breadcrumbs/breadcrumb-types";

export type BreadcrumbSchemaOwner = "page" | "layout_fallback" | "forbidden" | "none";

export type BreadcrumbOwnershipViolation = {
  code:
    | "duplicate_breadcrumb_list"
    | "layout_fallback_on_owned_route"
    | "forbidden_schema_on_learner"
    | "orphan_trail"
    | "duplicate_root_label"
    | "schema_without_page_owner"
    | "duplicate_schema_id"
    | "conflicting_canonical_url"
    | "nested_breadcrumb_list"
    | "glossary_schema_drift"
    | "ecg_alias_leakage";
  detail: string;
  pathname: string;
};

function normalizePath(pathname: string): string {
  return (pathname.split("?")[0]?.split("#")[0] ?? "/").toLowerCase().replace(/\/$/, "") || "/";
}

export function resolveBreadcrumbSchemaOwner(pathname: string): BreadcrumbSchemaOwner {
  const path = normalizePath(pathname);
  if (path.startsWith("/app")) return "forbidden";
  if (pageOwnsBreadcrumbSchema(path)) return "page";
  if (shouldEmitLayoutBreadcrumbFallback(path)) return "layout_fallback";
  return "none";
}

export type AssertSingleBreadcrumbOwnerInput = {
  pathname: string;
  pageEmitsBreadcrumbList: boolean;
  layoutEmitsBreadcrumbFallback?: boolean;
  crumbs?: readonly BreadcrumbCrumb[];
  schemaItems?: readonly BreadcrumbSchemaItem[];
  /** When checking ECG root duplication. */
  canonicalRootId?: string;
};

/**
 * Asserts at most one BreadcrumbList owner and valid trail shape. Throws in CI when `strict`.
 */
export function assertSingleBreadcrumbOwner(
  input: AssertSingleBreadcrumbOwnerInput,
  opts?: { strict?: boolean },
): BreadcrumbOwnershipViolation[] {
  const violations: BreadcrumbOwnershipViolation[] = [];
  const path = normalizePath(input.pathname);
  const layoutFallback = input.layoutEmitsBreadcrumbFallback ?? shouldEmitLayoutBreadcrumbFallback(path);

  const dup: SchemaGovernanceIssue | null = detectDuplicateBreadcrumbSchema({
    pathname: path,
    pageEmitsBreadcrumbList: input.pageEmitsBreadcrumbList,
    layoutEmitsBreadcrumbList: layoutFallback,
  });
  if (dup) {
    violations.push({
      code: "duplicate_breadcrumb_list",
      detail: dup.detail,
      pathname: path,
    });
  }

  const owner = resolveBreadcrumbSchemaOwner(path);
  if (owner === "page" && layoutFallback && input.pageEmitsBreadcrumbList) {
    violations.push({
      code: "layout_fallback_on_owned_route",
      detail: "Layout fallback must not run when page emits BreadcrumbList",
      pathname: path,
    });
  }

  if (path.startsWith("/app") && input.pageEmitsBreadcrumbList) {
    violations.push({
      code: "forbidden_schema_on_learner",
      detail: "Learner routes must not emit BreadcrumbList",
      pathname: path,
    });
  }

  const crumbCount = input.crumbs?.length ?? 0;
  const schemaCount = input.schemaItems?.length ?? 0;
  if (input.pageEmitsBreadcrumbList && crumbCount < 1 && schemaCount < 1) {
    violations.push({
      code: "orphan_trail",
      detail: "Page claims breadcrumb ownership but trail is empty",
      pathname: path,
    });
  }

  if (input.canonicalRootId && input.crumbs?.length) {
    const alias = detectForbiddenRootAlias(
      input.canonicalRootId,
      input.crumbs.map((c) => c.name),
    );
    if (alias) {
      violations.push({
        code: input.canonicalRootId === "ecg" ? "ecg_alias_leakage" : "duplicate_root_label",
        detail: alias,
        pathname: path,
      });
    }
  }

  if (input.schemaItems?.length) {
    const urls = input.schemaItems.map((s) => s.item?.trim() ?? "");
    const seenUrl = new Set<string>();
    for (const url of urls) {
      if (!url) continue;
      if (seenUrl.has(url)) {
        violations.push({
          code: "conflicting_canonical_url",
          detail: `Duplicate BreadcrumbList item URL: ${url}`,
          pathname: path,
        });
      }
      seenUrl.add(url);
    }

    const homeRoots = input.schemaItems.filter((s) => s.name.trim().toLowerCase() === "home");
    if (homeRoots.length > 1) {
      violations.push({
        code: "duplicate_schema_id",
        detail: "Multiple Home positions in BreadcrumbList",
        pathname: path,
      });
    }

    if (path.includes("/nursing-glossary") || path.includes("/glossary")) {
      const hub = input.schemaItems.find((s) => /glossary/i.test(s.name));
      const expected = path.startsWith("/nursing-glossary") ? "/nursing-glossary" : "/glossary";
      if (hub?.item && !hub.item.includes(expected)) {
        violations.push({
          code: "glossary_schema_drift",
          detail: `Glossary hub schema URL does not match ${expected}`,
          pathname: path,
        });
      }
    }
  }

  if (input.pageEmitsBreadcrumbList && layoutFallback && input.schemaItems && input.schemaItems.length > 0) {
    violations.push({
      code: "nested_breadcrumb_list",
      detail: "Page BreadcrumbList while layout fallback is also active",
      pathname: path,
    });
  }

  if (opts?.strict && violations.length > 0) {
    const msg = violations.map((v) => `${v.code}@${v.pathname}: ${v.detail}`).join("; ");
    throw new Error(`breadcrumb_schema_governance: ${msg}`);
  }

  return violations;
}

/** Registry of routes that must never ship without page-owned breadcrumbs when indexed. */
export const PAGE_OWNED_INDEXABLE_PREFIXES = [
  "/ecg",
  "/labs-interpretation",
  "/clinical-modules",
  "/nursing-glossary",
  "/case-studies",
  "/canada/rn",
  "/us/rn",
] as const;

export function auditIndexableRoutesMissingPageOwner(
  pathname: string,
  pageEmitsBreadcrumbList: boolean,
): BreadcrumbOwnershipViolation | null {
  const path = normalizePath(pathname);
  const mustOwn = PAGE_OWNED_INDEXABLE_PREFIXES.some((p) => path === p || path.startsWith(p));
  if (mustOwn && !pageEmitsBreadcrumbList && !path.startsWith("/app")) {
    return {
      code: "schema_without_page_owner",
      detail: "Indexable education route must emit page-owned breadcrumbs",
      pathname: path,
    };
  }
  return null;
}
