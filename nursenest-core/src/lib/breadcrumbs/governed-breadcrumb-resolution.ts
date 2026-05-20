/**
 * Applies governance (surface, intent, depth, telemetry) to raw breadcrumb resolutions.
 */

import type { BreadcrumbIntent } from "@/lib/breadcrumbs/breadcrumb-intent";
import { attachIntentToResolution, intentEmitsBreadcrumbSchema } from "@/lib/breadcrumbs/breadcrumb-intent";
import type { BreadcrumbResolution } from "@/lib/breadcrumbs/breadcrumb-types";
import type { BreadcrumbSurface } from "@/lib/breadcrumbs/breadcrumb-surface";
import { intentForSurface } from "@/lib/breadcrumbs/breadcrumb-surface";
import {
  assertBreadcrumbDepth,
  clampCrumbsForIntent,
} from "@/lib/breadcrumbs/breadcrumb-depth-governance";
import { resolveBreadcrumbSchemaOwner } from "@/lib/breadcrumbs/breadcrumb-schema-governance";
import {
  detectForbiddenRootAlias,
  getBreadcrumbRoot,
  type OntologyClassification,
} from "@/lib/breadcrumbs/breadcrumb-root-registry";
import {
  trackBreadcrumbRendered,
  trackBreadcrumbSchemaEmitted,
} from "@/lib/breadcrumbs/breadcrumb-telemetry";
import { buildSemanticTelemetryLineage } from "@/lib/breadcrumbs/governance/semantic-telemetry-lineage";
import { auditTrailHrefs } from "@/lib/breadcrumbs/canonical-breadcrumb-href-builder";

export type GovernedBreadcrumbResolution = BreadcrumbResolution & {
  surface: BreadcrumbSurface;
  breadcrumbDepth: number;
  canonicalRoot: string;
  schemaOwner: ReturnType<typeof resolveBreadcrumbSchemaOwner>;
  ontologyClassification: OntologyClassification | "unknown";
};

export type ApplyGovernedResolutionInput = {
  resolution: { crumbs: BreadcrumbResolution["crumbs"]; schemaItems: BreadcrumbResolution["schemaItems"] };
  surface: BreadcrumbSurface;
  pathname: string;
  canonicalRootId?: string;
  competencyId?: string | null;
  topicSlug?: string | null;
  remediationPathwayId?: string | null;
  educationalIntent?: string;
  /** Skip telemetry (SSR batch / tests). */
  silent?: boolean;
};

export function applyGovernedBreadcrumbResolution(
  input: ApplyGovernedResolutionInput,
): GovernedBreadcrumbResolution {
  const intent: BreadcrumbIntent = intentForSurface(input.surface);
  let crumbs = input.resolution.crumbs;
  let schemaItems = input.resolution.schemaItems;

  const depthCheck = assertBreadcrumbDepth(intent, crumbs);
  if (!depthCheck.ok) {
    crumbs = clampCrumbsForIntent(intent, crumbs);
  }

  if (!intentEmitsBreadcrumbSchema(intent)) {
    schemaItems = [];
  }

  const rootId = input.canonicalRootId ?? inferCanonicalRootId(input.surface, crumbs);
  const root = getBreadcrumbRoot(rootId);
  const ontologyClassification: OntologyClassification | "unknown" =
    root?.ontologyClassification ?? "unknown";
  const canonicalRoot = root?.telemetryNamespace ?? rootId;

  if (rootId && detectForbiddenRootAlias(rootId, crumbs.map((c) => c.name))) {
    /* keep trail but CI tests flag via assertSingleBreadcrumbOwner */
  }

  const hrefIssues = auditTrailHrefs(crumbs.map((c) => c.href));
  if (hrefIssues.length > 0 && process.env.NODE_ENV === "development") {
    console.warn("[breadcrumb] href governance", hrefIssues);
  }

  const base = attachIntentToResolution({ crumbs, schemaItems }, intent);
  const schemaOwner = resolveBreadcrumbSchemaOwner(input.pathname);

  const governed: GovernedBreadcrumbResolution = {
    ...base,
    surface: input.surface,
    breadcrumbDepth: crumbs.length,
    canonicalRoot,
    schemaOwner,
    ontologyClassification,
  };

  if (!input.silent) {
    trackBreadcrumbRendered({
      pathname: input.pathname,
      breadcrumbIntent: intent,
      breadcrumbSurface: input.surface,
      breadcrumbDepth: governed.breadcrumbDepth,
      canonicalRoot,
      schemaOwner,
      ontologyClassification,
      competencyId: input.competencyId ?? undefined,
      topicSlug: input.topicSlug ?? undefined,
      educationalIntent: input.educationalIntent,
      lineage: buildSemanticTelemetryLineage({
        pathname: input.pathname,
        breadcrumbIntent: intent,
        breadcrumbSurface: input.surface,
        breadcrumbDepth: governed.breadcrumbDepth,
        canonicalRoot,
        schemaOwner,
        ontologyClassification,
        educationalIntent: input.educationalIntent,
        topicSlug: input.topicSlug ?? undefined,
        competencyId: input.competencyId ?? undefined,
        pathwayId: input.remediationPathwayId,
      }),
    });
    if (governed.schemaItems.length > 0) {
      trackBreadcrumbSchemaEmitted({
        pathname: input.pathname,
        breadcrumbIntent: intent,
        breadcrumbSurface: input.surface,
        breadcrumbDepth: governed.breadcrumbDepth,
        canonicalRoot,
        schemaOwner: "page",
        ontologyClassification,
        competencyId: input.competencyId ?? undefined,
        topicSlug: input.topicSlug ?? undefined,
      });
    }
  }

  return governed;
}

function inferCanonicalRootId(
  surface: BreadcrumbSurface,
  crumbs: BreadcrumbResolution["crumbs"],
): string {
  if (surface === "academy") {
    const labels = crumbs.map((c) => c.name.toLowerCase());
    if (labels.some((l) => l.includes("ecg"))) return "ecg";
    if (labels.some((l) => l.includes("clinical modules"))) return "clinical_modules";
    return "ecg";
  }
  if (surface === "glossary") return "glossary";
  if (surface === "case_study") return "case_studies";
  if (surface === "lesson" || surface === "topic_cluster" || surface === "competency") {
    return "lessons";
  }
  return "home";
}
