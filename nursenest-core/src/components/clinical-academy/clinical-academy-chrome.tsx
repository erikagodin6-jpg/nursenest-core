import { BreadcrumbsFromResolution } from "@/components/navigation/breadcrumbs";
import { shouldEmitResolverBreadcrumbSchema } from "@/lib/breadcrumbs/breadcrumb-resolver";
import type { BreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-types";

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
}: {
  resolution: BreadcrumbResolution;
  className?: string;
}) {
  return (
    <BreadcrumbsFromResolution
      resolution={resolution}
      className={className}
      suppressSchema={!shouldEmitResolverBreadcrumbSchema(resolution)}
    />
  );
}
