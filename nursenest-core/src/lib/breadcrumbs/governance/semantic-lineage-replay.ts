/**
 * Semantic lineage replay — breadcrumb/navigation hydration parity snapshots.
 */

import { compareBreadcrumbHydrationParity, buildReplaySnapshot } from "@/lib/breadcrumbs/governance/client-navigation-governance";
import {
  validateHydrationLineageParity,
  resolvePsychometricLineageStamp,
  type PsychometricLineageStamp,
} from "@/lib/breadcrumbs/governance/psychometric-lineage-validation";
import type { BreadcrumbCrumb } from "@/lib/breadcrumbs/breadcrumb-types";
import {
  captureGraphTelemetryReplayFrame,
  type GraphTelemetryReplayFrame,
} from "@/lib/breadcrumbs/governance/graph-telemetry-replay";

export type SemanticLineageReplaySnapshot = {
  pathname: string;
  hydration: ReturnType<typeof buildReplaySnapshot>;
  ssrStamp: PsychometricLineageStamp;
  hydratedStamp: PsychometricLineageStamp;
  lineageIssues: string[];
  graphFrames: GraphTelemetryReplayFrame[];
};

export function captureSemanticLineageReplay(args: {
  pathname: string;
  pathwayId?: string | null;
  ssrCrumbs: readonly BreadcrumbCrumb[];
  hydratedCrumbs: readonly BreadcrumbCrumb[];
  breadcrumbListCount: number;
  graphKind?: GraphTelemetryReplayFrame["kind"];
}): SemanticLineageReplaySnapshot {
  const ssrStamp = resolvePsychometricLineageStamp({ pathwayId: args.pathwayId });
  const hydratedStamp = resolvePsychometricLineageStamp({ pathwayId: args.pathwayId });
  const hydration = compareBreadcrumbHydrationParity({
    pathname: args.pathname,
    ssrCrumbs: args.ssrCrumbs,
    hydratedCrumbs: args.hydratedCrumbs,
    breadcrumbListCount: args.breadcrumbListCount,
  });
  const parityIssues = validateHydrationLineageParity({
    ssrStamp,
    hydratedStamp,
    pathname: args.pathname,
  }).map((i) => `${i.code}:${i.detail}`);

  const graphFrames = [
    captureGraphTelemetryReplayFrame({
      kind: args.graphKind ?? "hydration_normalization_fallback",
      pathname: args.pathname,
      pathwayId: args.pathwayId,
    }),
  ];

  return {
    pathname: args.pathname,
    hydration: buildReplaySnapshot(hydration),
    ssrStamp,
    hydratedStamp,
    lineageIssues: [...hydration.issues, ...parityIssues],
    graphFrames,
  };
}

export function replayDeterministicClientTransition(args: {
  fromPath: string;
  toPath: string;
  pathwayId?: string | null;
}): SemanticLineageReplaySnapshot[] {
  return [args.fromPath, args.toPath].map((pathname) =>
    captureSemanticLineageReplay({
      pathname,
      pathwayId: args.pathwayId,
      ssrCrumbs: [{ name: "Home", href: "/" }],
      hydratedCrumbs: [{ name: "Home", href: "/" }],
      breadcrumbListCount: pathname.startsWith("/app") ? 0 : 1,
      graphKind: pathname.includes("glossary") ? "glossary_traversal" : "remediation_chain",
    }),
  );
}
