/**
 * Graph-aware focus-area learner routes — cognition + remediation continuity anchors.
 */

import { learnerWeakAreaCrumbsFromGraph, remediationPathwayId } from "@/lib/breadcrumbs/breadcrumb-graph-convergence";
import { resolveEducationalCognitionContext } from "@/lib/educational-cognition/resolve-educational-cognition-context";
import { resolveGraphNavigationTelemetryContext } from "@/lib/breadcrumbs/pathname-normalization";
import { buildReasoningChainNavigation } from "@/lib/breadcrumbs/reasoning-chain-navigation";
import { normalizeTopicKey } from "@/lib/linking/link-resolver";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";

export type FocusAreaGraphRouteContext = {
  topicSlug: string;
  topicLabel: string;
  pathname: string;
  competencyId: string | null;
  remediationPathwayId: string;
  currentStepHref: string;
  ontologyNamespace: string;
  graphDepth: number;
  learnerStateReason: string | null;
  weakAreaSeverity: "high" | "medium" | "low";
  crumbs: ReturnType<typeof learnerWeakAreaCrumbsFromGraph>["crumbs"];
};

export function focusAreaDetailPathname(topicSlug: string): string {
  const slug = normalizeTopicKey(topicSlug) ?? topicSlug;
  return `/app/account/focus-areas/${encodeURIComponent(slug)}`;
}

export function resolveFocusAreaGraphRoute(args: {
  topicSlug: string;
  topicLabel?: string;
  pathwayId?: string | null;
  userId?: string;
  weakTopics?: readonly string[];
  missRate?: number;
  learnerState?: RnLearnerStateSnapshot | null;
}): FocusAreaGraphRouteContext {
  const topicSlug = normalizeTopicKey(args.topicSlug) ?? args.topicSlug;
  const topicLabel = args.topicLabel ?? topicSlug.replace(/-/g, " ");
  const pathname = focusAreaDetailPathname(topicSlug);

  const weakTopicRows: WeakTopicRow[] = [...(args.weakTopics ?? [])].map((topic) => ({
    topic,
    missed: 1,
    attempted: 1,
    missRate: args.missRate ?? 1,
    strength: "weak",
    normalizedTopic: normalizeTopicKey(topic),
  }));

  const cognition = args.userId
    ? resolveEducationalCognitionContext(args.pathwayId ?? null, {
        userId: args.userId,
        weakTopics: weakTopicRows,
      })
    : null;

  const learnerState = args.learnerState ?? cognition?.learnerState ?? null;
  const graph = learnerWeakAreaCrumbsFromGraph({
    topicSlug,
    topicLabel,
    pathwayId: args.pathwayId ?? null,
    sourceSurface: "dashboard_feed",
    learnerState,
    persistentWeakTopics: args.weakTopics,
    currentLabel: topicLabel,
    currentHref: pathname,
    currentStepHref: graphCurrentStepHref(topicSlug),
  });

  const telemetry = resolveGraphNavigationTelemetryContext({
    pathname,
    surface: "remediation",
    canonicalRootId: "lessons",
    topicSlug,
    pathwayId: args.pathwayId ?? null,
    traversal: graph.traversal,
    sourceSurface: "focus_area_detail",
  });

  const reasoning = buildReasoningChainNavigation({
    topicSlug,
    topicLabel,
    pathwayId: args.pathwayId ?? null,
    pathname,
    sourceSurface: "dashboard_feed",
  });

  const missRate = args.missRate ?? 0;
  const weakAreaSeverity: FocusAreaGraphRouteContext["weakAreaSeverity"] =
    missRate >= 0.45 ? "high" : missRate >= 0.25 ? "medium" : "low";

  return {
    topicSlug,
    topicLabel,
    pathname,
    competencyId: graph.competencyId,
    remediationPathwayId: remediationPathwayId(args.pathwayId ?? null, topicSlug),
    currentStepHref: graphCurrentStepHref(topicSlug),
    ontologyNamespace: telemetry.ontologyNamespace,
    graphDepth: reasoning.depth || graph.traversal.steps.length,
    learnerStateReason: cognition?.measurement?.learnerStateReason ?? null,
    weakAreaSeverity,
    crumbs: graph.crumbs,
  };
}

function graphCurrentStepHref(topicSlug: string): string {
  return `/app/questions?topic=${encodeURIComponent(topicSlug)}&mode=weak`;
}
