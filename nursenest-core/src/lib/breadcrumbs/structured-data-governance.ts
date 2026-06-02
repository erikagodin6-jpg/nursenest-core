/**
 * Structured-data governance V2 — centralized schema ownership beyond BreadcrumbList.
 */

export type StructuredDataType =
  | "BreadcrumbList"
  | "FAQPage"
  | "MedicalWebPage"
  | "DefinedTerm"
  | "Course"
  | "LearningResource"
  | "MedicalCondition"
  | "MedicalEntity"
  | "Organization"
  | "WebSite"
  | "Article";

export type SchemaOwnershipTier = "page" | "layout_fallback" | "forbidden";

export type SchemaOwnershipRule = {
  schemaType: StructuredDataType;
  /** Route prefix or exact path pattern (lowercase, no query). */
  routePattern: string;
  owner: SchemaOwnershipTier;
  notes?: string;
};

/** Default: page owns all primary graphs; layout may only emit org/website + breadcrumb fallback. */
export const SCHEMA_OWNERSHIP_RULES: readonly SchemaOwnershipRule[] = [
  { schemaType: "Organization", routePattern: "/", owner: "layout_fallback", notes: "Global layout" },
  { schemaType: "WebSite", routePattern: "/", owner: "layout_fallback" },
  {
    schemaType: "BreadcrumbList",
    routePattern: "/app",
    owner: "forbidden",
    notes: "Learner routes: visible crumbs only",
  },
  {
    schemaType: "BreadcrumbList",
    routePattern: "/ecg",
    owner: "page",
    notes: "Academy resolver via BreadcrumbsFromResolution",
  },
  {
    schemaType: "BreadcrumbList",
    routePattern: "/canada/rn",
    owner: "page",
    notes: "Pathway education-first resolver",
  },
  {
    schemaType: "FAQPage",
    routePattern: "/ecg",
    owner: "page",
    notes: "Co-located with academy page metadata @graph",
  },
  {
    schemaType: "BreadcrumbList",
    routePattern: "/clinical-interpretation",
    owner: "page",
    notes: "Interpretation hub + guides via BreadcrumbsFromResolution",
  },
  {
    schemaType: "LearningResource",
    routePattern: "/clinical-interpretation",
    owner: "page",
    notes: "When interpretation guides publish",
  },
  {
    schemaType: "DefinedTerm",
    routePattern: "/glossary",
    owner: "page",
  },
  {
    schemaType: "DefinedTerm",
    routePattern: "/nursing-glossary",
    owner: "page",
  },
  {
    schemaType: "BreadcrumbList",
    routePattern: "/nursing-glossary",
    owner: "page",
  },
  {
    schemaType: "BreadcrumbList",
    routePattern: "/about",
    owner: "layout_fallback",
    notes: "No dedicated page builder",
  },
] as const;

export type SchemaGovernanceIssueCode =
  | "duplicate_schema"
  | "forbidden_schema"
  | "layout_overrides_page"
  | "orphaned_hierarchy"
  | "duplicate_faq"
  | "duplicate_learning_resource"
  | "duplicate_medical_web_page"
  | "invalid_fallback";

export type SchemaGovernanceIssue = {
  code: SchemaGovernanceIssueCode;
  schemaType: StructuredDataType;
  detail: string;
};

function normalizePath(p: string): string {
  return (p.split("?")[0]?.split("#")[0] ?? "/").toLowerCase().replace(/\/$/, "") || "/";
}

export function resolveSchemaOwnership(
  pathname: string,
  schemaType: StructuredDataType,
): SchemaOwnershipTier {
  const path = normalizePath(pathname);
  if (path.startsWith("/app")) {
    if (schemaType === "BreadcrumbList") return "forbidden";
  }
  const matches = SCHEMA_OWNERSHIP_RULES.filter(
    (r) => r.schemaType === schemaType && (path === r.routePattern || path.startsWith(r.routePattern)),
  );
  if (matches.length === 0) return schemaType === "BreadcrumbList" ? "layout_fallback" : "page";
  const pageOwned = matches.find((m) => m.owner === "page");
  if (pageOwned) return "page";
  const forbidden = matches.find((m) => m.owner === "forbidden");
  if (forbidden) return "forbidden";
  return matches[matches.length - 1]!.owner;
}

/**
 * Detects duplicate BreadcrumbList emission when page owns schema and layout also emits fallback.
 */
export function detectDuplicateBreadcrumbSchema(args: {
  pathname: string;
  pageEmitsBreadcrumbList: boolean;
  layoutEmitsBreadcrumbList: boolean;
}): SchemaGovernanceIssue | null {
  const ownership = resolveSchemaOwnership(args.pathname, "BreadcrumbList");
  if (ownership === "forbidden" && args.pageEmitsBreadcrumbList) {
    return {
      code: "forbidden_schema",
      schemaType: "BreadcrumbList",
      detail: "Learner route must not emit BreadcrumbList",
    };
  }
  if (ownership === "page" && args.pageEmitsBreadcrumbList && args.layoutEmitsBreadcrumbList) {
    return {
      code: "duplicate_schema",
      schemaType: "BreadcrumbList",
      detail: "Page-owned breadcrumb conflicts with marketing layout fallback",
    };
  }
  if (ownership === "page" && args.layoutEmitsBreadcrumbList && !args.pageEmitsBreadcrumbList) {
    return {
      code: "layout_overrides_page",
      schemaType: "BreadcrumbList",
      detail: "Layout fallback emitted on page-owned route without page breadcrumb",
    };
  }
  return null;
}

export type PageStructuredDataEmission = Partial<Record<StructuredDataType, boolean>>;

/**
 * Validates a page's declared structured-data emissions against route ownership rules.
 */
export function auditPageStructuredDataEmissions(
  pathname: string,
  emissions: PageStructuredDataEmission,
  layoutEmitsBreadcrumbFallback = false,
): SchemaGovernanceIssue[] {
  const issues: SchemaGovernanceIssue[] = [];
  const dup = detectDuplicateBreadcrumbSchema({
    pathname,
    pageEmitsBreadcrumbList: Boolean(emissions.BreadcrumbList),
    layoutEmitsBreadcrumbList: layoutEmitsBreadcrumbFallback,
  });
  if (dup) issues.push(dup);

  const pairs: Array<[StructuredDataType, keyof PageStructuredDataEmission]> = [
    ["FAQPage", "FAQPage"],
    ["LearningResource", "LearningResource"],
    ["MedicalWebPage", "MedicalWebPage"],
  ];

  for (const [schemaType] of pairs) {
    if (!emissions[schemaType]) continue;
    const owner = resolveSchemaOwnership(pathname, schemaType);
    if (owner === "forbidden") {
      issues.push({
        code: "invalid_fallback",
        schemaType,
        detail: `${schemaType} forbidden on ${pathname}`,
      });
    }
  }

  if (emissions.FAQPage && layoutEmitsBreadcrumbFallback && pathname.startsWith("/ecg")) {
    issues.push({
      code: "duplicate_faq",
      schemaType: "FAQPage",
      detail: "FAQPage should be page-owned on academy routes only",
    });
  }

  if (emissions.LearningResource && emissions.MedicalWebPage) {
    issues.push({
      code: "duplicate_medical_web_page",
      schemaType: "MedicalWebPage",
      detail: "Prefer single primary medical/learning entity per page",
    });
  }

  return issues;
}
