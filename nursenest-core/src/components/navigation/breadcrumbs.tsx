import { AnalyticsBreadcrumbTrail } from "@/components/navigation/analytics-breadcrumb-trail";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { shouldEmitResolverBreadcrumbSchema } from "@/lib/breadcrumbs/breadcrumb-resolver";
import type { BreadcrumbIntent } from "@/lib/breadcrumbs/breadcrumb-intent";
import type { BreadcrumbCrumb, BreadcrumbResolution, BreadcrumbSchemaItem } from "@/lib/breadcrumbs/breadcrumb-types";

/**
 * Canonical public breadcrumb row: visible trail + optional `BreadcrumbList` JSON-LD.
 * Use `suppressSchema` on `/app/*` routes (learner UX only).
 */
export function Breadcrumbs({
  crumbs,
  schemaItems,
  navClassName = "nn-marketing-caption text-[var(--theme-muted-text)]",
  suppressSchema = false,
  className = "min-h-9 mb-4",
  pathname,
  analyticsIntent = "education",
  pathwayId,
  remediationPathwayId,
  educationalIntent,
}: {
  crumbs: BreadcrumbCrumb[];
  schemaItems?: BreadcrumbSchemaItem[];
  navClassName?: string;
  suppressSchema?: boolean;
  className?: string;
  /** When set, breadcrumb clicks emit privacy-safe navigation analytics. */
  pathname?: string;
  analyticsIntent?: BreadcrumbIntent;
  pathwayId?: string | null;
  remediationPathwayId?: string;
  educationalIntent?: string;
}) {
  const schema = schemaItems ?? [];
  return (
    <>
      {!suppressSchema && schema.length > 0 ? <BreadcrumbJsonLd items={schema} /> : null}
      {crumbs.length > 0 ? (
        <div className={className}>
          {pathname ? (
            <AnalyticsBreadcrumbTrail
              items={crumbs}
              pathname={pathname}
              intent={analyticsIntent ?? "education"}
              navClassName={navClassName}
              pathwayId={pathwayId}
              remediationPathwayId={remediationPathwayId}
              educationalIntent={educationalIntent}
            />
          ) : (
            <BreadcrumbTrail items={crumbs} navClassName={navClassName} />
          )}
        </div>
      ) : null}
    </>
  );
}

export function BreadcrumbsFromResolution({
  resolution,
  navClassName,
  suppressSchema,
  className,
  pathname,
  pathwayId,
  remediationPathwayId,
  educationalIntent,
}: {
  resolution: BreadcrumbResolution;
  navClassName?: string;
  /** When omitted, defers to resolution intent (learner → no JSON-LD). */
  suppressSchema?: boolean;
  className?: string;
  pathname?: string;
  pathwayId?: string | null;
  remediationPathwayId?: string;
  educationalIntent?: string;
}) {
  const emitSchema = suppressSchema === undefined ? shouldEmitResolverBreadcrumbSchema(resolution) : !suppressSchema;
  return (
    <Breadcrumbs
      crumbs={resolution.crumbs}
      schemaItems={resolution.schemaItems}
      navClassName={navClassName}
      suppressSchema={!emitSchema}
      className={className}
      pathname={pathname}
      analyticsIntent={resolution.intent}
      pathwayId={pathwayId}
      remediationPathwayId={remediationPathwayId}
      educationalIntent={educationalIntent}
    />
  );
}

/** @deprecated Prefer `Breadcrumbs` — alias for gradual migration from `BreadcrumbBar`. */
export function BreadcrumbBar(props: Parameters<typeof Breadcrumbs>[0] & { schemaItems: BreadcrumbSchemaItem[] }) {
  return <Breadcrumbs {...props} />;
}
