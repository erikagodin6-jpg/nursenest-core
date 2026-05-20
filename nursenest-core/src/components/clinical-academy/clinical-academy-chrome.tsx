import { BreadcrumbsFromResolution } from "@/components/navigation/breadcrumbs";
import { shouldEmitResolverBreadcrumbSchema } from "@/lib/breadcrumbs/breadcrumb-resolver";
import type { BreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-types";
import { resolveEducationalPathnameForTelemetry } from "@/lib/breadcrumbs/pathname-normalization";

/** JSON-LD `@graph` without `BreadcrumbList` — page-owned breadcrumbs emit schema separately. */
export function ClinicalAcademyJsonLdGraph({ graph }: { graph: Record<string, unknown>[] }) {
  if (!graph.length) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}

export function AcademyBreadcrumbBar({
  resolution,
  className = "mb-6",
  pathname,
}: {
  resolution: BreadcrumbResolution;
  className?: string;
  /** Enables privacy-safe breadcrumb analytics on academy surfaces. */
  pathname?: string;
}) {
  const telemetryPathname = resolveEducationalPathnameForTelemetry({
    declaredPathname: pathname,
    resolution,
    canonicalRootId: "ecg",
  });

  return (
    <BreadcrumbsFromResolution
      resolution={resolution}
      className={className}
      pathname={telemetryPathname}
      suppressSchema={!shouldEmitResolverBreadcrumbSchema(resolution)}
    />
  );
}
