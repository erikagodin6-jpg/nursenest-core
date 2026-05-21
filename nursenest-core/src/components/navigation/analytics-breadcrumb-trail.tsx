"use client";

import { useEffect, useRef } from "react";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import type { BreadcrumbCrumb } from "@/lib/seo/breadcrumb-types";
import type { BreadcrumbIntent } from "@/lib/breadcrumbs/breadcrumb-intent";
import type { BreadcrumbSurface } from "@/lib/breadcrumbs/breadcrumb-surface";
import type { BreadcrumbSchemaOwner } from "@/lib/breadcrumbs/breadcrumb-schema-governance";
import {
  resolvePsychometricLineageStamp,
  psychometricTelemetryDedupeKey,
  registerPsychometricTelemetryDedupe,
} from "@/lib/breadcrumbs/governance/psychometric-lineage-validation";
import { captureGraphTelemetryReplayFrame } from "@/lib/breadcrumbs/governance/graph-telemetry-replay";

export function AnalyticsBreadcrumbTrail({
  items,
  pathname,
  intent = "learner",
  breadcrumbSurface,
  navClassName,
  topicSlug,
  competencyId,
  remediationPathwayId,
  pathwayId,
  canonicalRoot,
  learnerStateReason,
  graphDepth,
  sourceSurface,
  ontologyNamespace,
  educationalIntent,
  testing_model,
  interpretationChainDepth,
  glossaryTraversalContinuity,
  breadcrumbDepth,
}: {
  items: BreadcrumbCrumb[];
  pathname: string;
  intent?: BreadcrumbIntent;
  breadcrumbSurface?: BreadcrumbSurface;
  schemaOwner?: BreadcrumbSchemaOwner;
  breadcrumbDepth?: number;
  navClassName?: string;
  topicSlug?: string;
  competencyId?: string | null;
  remediationPathwayId?: string;
  pathwayId?: string | null;
  canonicalRoot?: string;
  learnerStateReason?: string | null;
  graphDepth?: number;
  sourceSurface?: string;
  ontologyNamespace?: string;
  educationalIntent?: string;
  testing_model?: string;
  interpretationChainDepth?: number;
  glossaryTraversalContinuity?: boolean;
}) {
  const trailLabels = items.map((c) => c.name);
  const renderedRef = useRef(false);

  useEffect(() => {
    if (renderedRef.current || items.length === 0) return;
    renderedRef.current = true;
    const psych = resolvePsychometricLineageStamp({
      pathwayId: pathwayId ?? remediationPathwayId ?? null,
      educationalIntent,
    });
    const dedupeOk = registerPsychometricTelemetryDedupe(
      psychometricTelemetryDedupeKey(psych, pathname, "breadcrumb_rendered"),
    );
    if (!dedupeOk) return;
    captureGraphTelemetryReplayFrame({
      kind: breadcrumbSurface === "glossary" ? "glossary_traversal" : "remediation_chain",
      pathname,
      pathwayId: pathwayId ?? remediationPathwayId ?? null,
      educationalIntent: psych.educationalIntent,
    });
  }, [
    items.length,
    pathname,
    intent,
    breadcrumbSurface,
    topicSlug,
    competencyId,
    remediationPathwayId,
    canonicalRoot,
    learnerStateReason,
    graphDepth,
    sourceSurface,
    ontologyNamespace,
    educationalIntent,
    testing_model,
    interpretationChainDepth,
    glossaryTraversalContinuity,
    trailLabels.join("|"),
  ]);

  return (
    <BreadcrumbTrail
      items={items}
      navClassName={navClassName}
      onCrumbClick={() => {}}
    />
  );
}
