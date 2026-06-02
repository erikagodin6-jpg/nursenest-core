import type { EducationalCognitionContext } from "@/lib/educational-cognition/educational-cognition-types";
import {
  resolveUnifiedEducationalSubstrate,
  type UnifiedEducationalSubstrate,
} from "@/lib/educational-graph/unified-educational-substrate";
import {
  buildDashboardGraphActions,
  type DashboardGraphAction,
} from "@/lib/educational-graph/dashboard-graph-actions";
import type { DashboardOrchestrationCard, DashboardOrchestrationV3 } from "@/lib/learner/rn-coaching-intelligence/dashboard-orchestration-v3";
import { readDashboardFeedFromSession } from "@/lib/learner/rn-coaching-intelligence/dashboard-feed";

export type DashboardSubstrateOrchestration = DashboardOrchestrationV3 & {
  substrate: UnifiedEducationalSubstrate;
  graphActions: DashboardGraphAction[];
};

function cardToneForStepKind(
  kind: DashboardGraphAction["stepKind"],
): DashboardOrchestrationCard["tone"] {
  if (kind === "reassessment" || kind === "cat_exam" || kind === "loft_simulation") return "alert";
  if (kind === "interpretation" || kind === "mechanism") return "remediation";
  if (kind === "prioritization_drill" || kind === "mixed_case") return "momentum";
  return "neutral";
}

/** Dashboard cards from unified substrate — no local recommendation heuristics. */
export function composeDashboardOrchestrationFromSubstrate(
  substrate: UnifiedEducationalSubstrate,
): DashboardSubstrateOrchestration {
  const { cognition } = substrate;
  const feed = readDashboardFeedFromSession();
  const graphActions = buildDashboardGraphActions(substrate);
  const cards: DashboardOrchestrationCard[] = [];

  const persistentWeakAreas = cognition.learnerState.competencyStates
    .filter((c) => c.persistentWeak)
    .map((c) => c.competencyId.replace(/_/g, " "));
  const unstableCompetencies = cognition.learnerState.competencyStates
    .filter((c) => c.volatility === "volatile" || c.volatility === "declining")
    .map((c) => c.competencyId.replace(/_/g, " "));
  const remediationFatigue = substrate.sharedFatigueScore >= 0.5;

  if (feed?.studyMomentumLine) {
    cards.push({
      id: "momentum",
      title: "Readiness momentum",
      body: feed.studyMomentumLine,
      href: graphActions[0]?.href ?? feed.primaryHref,
      tone: "momentum",
    });
  }

  for (const action of graphActions.slice(0, remediationFatigue ? 2 : 4)) {
    cards.push({
      id: `graph-${action.stepId}`,
      title: action.title,
      body: action.step.description,
      href: action.href,
      tone: cardToneForStepKind(action.stepKind),
    });
  }

  if (remediationFatigue) {
    cards.push({
      id: "fatigue",
      title: "Study load balance",
      body: "Remediation fatigue cap active — complete one graph step before opening parallel ladders.",
      tone: "neutral",
    });
  }

  for (const unstable of unstableCompetencies.slice(0, 1)) {
    cards.push({
      id: `volatile-${unstable}`,
      title: "Stabilize competency",
      body: `${unstable} accuracy has been uneven — follow the governed graph sequence before reassessment.`,
      tone: "alert",
    });
  }

  return {
    feed,
    learnerState: cognition.learnerState,
    cards: cards.slice(0, cognition.remediation.maxRecommendations + 1),
    persistentWeakAreas: persistentWeakAreas.length ? persistentWeakAreas : [...substrate.persistentWeakTopics],
    remediationFatigue,
    unstableCompetencies,
    substrate,
    graphActions,
  };
}

export function resolveDashboardSubstrateOrchestration(args: {
  pathwayId: string | null | undefined;
  topicSlugs?: readonly string[];
  cognitionOptions?: Parameters<typeof resolveUnifiedEducationalSubstrate>[0]["cognitionOptions"];
}): DashboardSubstrateOrchestration {
  const substrate = resolveUnifiedEducationalSubstrate({
    pathwayId: args.pathwayId,
    cognitionOptions: args.cognitionOptions,
    topicSlugs: args.topicSlugs,
    sourceSurface: "dashboard_feed",
  });
  return composeDashboardOrchestrationFromSubstrate(substrate);
}
