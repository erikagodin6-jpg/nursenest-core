"use client";

import { useEffect, useRef } from "react";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import type { BreadcrumbCrumb } from "@/lib/seo/breadcrumb-types";
import type { BreadcrumbIntent } from "@/lib/breadcrumbs/breadcrumb-intent";
import type { BreadcrumbSurface } from "@/lib/breadcrumbs/breadcrumb-surface";
import type { BreadcrumbSchemaOwner } from "@/lib/breadcrumbs/breadcrumb-schema-governance";
import { trackNavigationEvent } from "@/lib/breadcrumbs/navigation-analytics";
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
    trackNavigationEvent({
      event: "breadcrumb_rendered",
      breadcrumbIntent: intent,
      breadcrumbSurface,
      pathname,
      ontologyNamespace,
      educationalIntent: psych.educationalIntent,
      testing_model: testing_model ?? psych.testing_model,
      ontologyRevision: psych.ontologyRevision,
      graphVersion: psych.graphVersion,
      cognitionReliabilityTier: psych.cognitionReliabilityTier,
      topicSlug,
      competencyId,
      remediationPathwayId,
      canonicalRoot,
      learnerStateReason,
      graphDepth,
      sourceSurface,
      interpretationChainDepth,
      glossaryTraversalContinuity,
      trailLabels,
      isLearnerRoute: pathname.startsWith("/app"),
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
      onCrumbClick={(index, crumb) => {
        const event =
          breadcrumbSurface === "remediation" || breadcrumbSurface === "post_exam"
            ? index < items.length - 1
              ? "remediation_ladder_opened"
              : "breadcrumb_click"
            : breadcrumbSurface === "interpretation_guide"
              ? "interpretation_path_opened"
              : breadcrumbSurface === "glossary"
                ? "glossary_navigation_opened"
                : "breadcrumb_click";
        trackNavigationEvent({
          event,
          breadcrumbIntent: intent,
          breadcrumbSurface,
          pathname,
          ontologyNamespace,
          educationalIntent,
          testing_model,
          crumbIndex: index,
          crumbLabel: crumb.name,
          topicSlug,
          competencyId,
          remediationPathwayId,
          canonicalRoot,
          learnerStateReason,
          graphDepth,
          sourceSurface,
          interpretationChainDepth,
          glossaryTraversalContinuity,
          trailLabels,
          isLearnerRoute: pathname.startsWith("/app"),
        });
      }}
    />
  );
}
