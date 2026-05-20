import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { shouldEmitResolverBreadcrumbSchema } from "@/lib/breadcrumbs/breadcrumb-resolver";
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
}: {
  crumbs: BreadcrumbCrumb[];
  schemaItems?: BreadcrumbSchemaItem[];
  navClassName?: string;
  suppressSchema?: boolean;
  className?: string;
}) {
  const schema = schemaItems ?? [];
  return (
    <>
      {!suppressSchema && schema.length > 0 ? <BreadcrumbJsonLd items={schema} /> : null}
      {crumbs.length > 0 ? (
        <div className={className}>
          <BreadcrumbTrail items={crumbs} navClassName={navClassName} />
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
}: {
  resolution: BreadcrumbResolution;
  navClassName?: string;
  /** When omitted, defers to resolution intent (learner → no JSON-LD). */
  suppressSchema?: boolean;
  className?: string;
}) {
  const emitSchema = suppressSchema === undefined ? shouldEmitResolverBreadcrumbSchema(resolution) : !suppressSchema;
  return (
    <Breadcrumbs
      crumbs={resolution.crumbs}
      schemaItems={resolution.schemaItems}
      navClassName={navClassName}
      suppressSchema={!emitSchema}
      className={className}
    />
  );
}

/** @deprecated Prefer `Breadcrumbs` — alias for gradual migration from `BreadcrumbBar`. */
export function BreadcrumbBar(props: Parameters<typeof Breadcrumbs>[0] & { schemaItems: BreadcrumbSchemaItem[] }) {
  return <Breadcrumbs {...props} />;
}
