"use client";

import { useEffect, type ReactNode } from "react";
import type { EducationalCognitionContext } from "@/lib/educational-cognition/educational-cognition-types";
import { captureGovernedGraphTelemetry } from "@/lib/educational-graph/capture-governed-graph-telemetry";
import { remediationPathStartedPayload } from "@/lib/educational-graph/graph-telemetry";
import type { EduGraphStep, GraphSourceSurface } from "@/lib/educational-graph/graph-step-contract";

type GraphTelemetryBoundaryProps = {
  topicSlug: string;
  sourceSurface: GraphSourceSurface;
  steps: readonly EduGraphStep[];
  pathwayId?: string | null;
  competencyId?: string | null;
  cognition?: EducationalCognitionContext | null;
  children: ReactNode;
};

/**
 * Fires remediation_path_started once per mount when steps are present (deduped in capture layer).
 */
export function GraphTelemetryBoundary({
  topicSlug,
  sourceSurface,
  steps,
  pathwayId,
  competencyId,
  cognition,
  children,
}: GraphTelemetryBoundaryProps) {
  useEffect(() => {
    if (steps.length === 0) return;
    const payload = remediationPathStartedPayload({
      topicSlug,
      sourceSurface,
      stepCount: steps.length,
      competencyId: competencyId ?? steps[0]?.competencyId ?? null,
    });
    void captureGovernedGraphTelemetry({
      event: "remediation_path_started",
      topicSlug,
      sourceSurface,
      pathwayId: pathwayId ?? steps[0]?.pathwayId ?? null,
      competencyId: payload.competencyId,
      stepCount: steps.length,
      cognition,
      suppressDedupe: false,
    });
  }, [topicSlug, sourceSurface, steps.length, pathwayId, competencyId, cognition]);

  return <>{children}</>;
}
