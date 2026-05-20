import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import type { PostExamDashboardFeed } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import { readDashboardFeedFromSession } from "@/lib/learner/rn-coaching-intelligence/dashboard-feed";
import { readLearnerStateFromSession } from "@/lib/learner/rn-coaching-intelligence/learner-state-store";
import {
  resolveDashboardSubstrateOrchestration,
  type DashboardSubstrateOrchestration,
} from "@/lib/educational-cognition/dashboard-substrate-orchestration";
import type { DashboardGraphAction } from "@/lib/educational-graph/dashboard-graph-actions";

export type DashboardOrchestrationCard = {
  id: string;
  title: string;
  body: string;
  href?: string;
  tone: "momentum" | "alert" | "pacing" | "remediation" | "neutral";
};

export type DashboardOrchestrationV3 = {
  feed: PostExamDashboardFeed | null;
  learnerState: RnLearnerStateSnapshot | null;
  cards: DashboardOrchestrationCard[];
  persistentWeakAreas: string[];
  remediationFatigue: boolean;
  unstableCompetencies: string[];
  /** Present when cards derive from unified educational substrate. */
  graphActions?: DashboardGraphAction[];
};

/** Canonical dashboard orchestration from cognition context (preferred). */
function toDashboardOrchestrationV3(orch: DashboardSubstrateOrchestration): DashboardOrchestrationV3 {
  const { substrate: _substrate, graphActions, ...v3 } = orch;
  return { ...v3, graphActions };
}

export function composeDashboardOrchestrationFromContext(
  ctx: import("@/lib/educational-cognition/educational-cognition-types").EducationalCognitionContext,
): DashboardOrchestrationV3 {
  const pathwayId = ctx.pathwayId ?? ctx.learnerState?.pathwayId ?? null;
  if (pathwayId) {
    try {
      return toDashboardOrchestrationV3(resolveDashboardSubstrateOrchestration({ pathwayId }));
    } catch {
      /* session-only fallback below */
    }
  }
  const feed = readDashboardFeedFromSession();
  const learnerState = ctx.learnerState ?? readLearnerStateFromSession();
  return buildDashboardCards({ feed, learnerState });
}

/** @deprecated Local heuristics — substrate orchestration is authoritative. */
function buildDashboardCardsLegacy(): DashboardOrchestrationV3 {
  const feed = readDashboardFeedFromSession();
  const learnerState = readLearnerStateFromSession();
  return buildDashboardCards({ feed, learnerState });
}

export function composeDashboardOrchestrationV3(): DashboardOrchestrationV3 {
  const learnerState = readLearnerStateFromSession();
  const pathwayId = (learnerState?.pathwayId ?? "us-rn-nclex-rn").trim();
  try {
    return toDashboardOrchestrationV3(resolveDashboardSubstrateOrchestration({ pathwayId }));
  } catch {
    return buildDashboardCardsLegacy();
  }
}

function buildDashboardCards(args: {
  feed: PostExamDashboardFeed | null;
  learnerState: RnLearnerStateSnapshot | null;
}): DashboardOrchestrationV3 {
  const { feed, learnerState } = args;
  const cards: DashboardOrchestrationCard[] = [];

  const persistentWeakAreas =
    learnerState?.competencyStates.filter((c) => c.persistentWeak).map((c) => c.competencyId.replace(/_/g, " ")) ??
    feed?.weakTopics ??
    [];

  const unstableCompetencies =
    learnerState?.competencyStates
      .filter((c) => c.volatility === "volatile" || c.volatility === "declining")
      .map((c) => c.competencyId.replace(/_/g, " ")) ?? [];

  const remediationFatigue = (learnerState?.remediationFatigueScore ?? 0) >= 0.5;

  if (feed?.studyMomentumLine) {
    cards.push({
      id: "momentum",
      title: "Readiness momentum",
      body: feed.studyMomentumLine,
      href: feed.primaryHref,
      tone: "momentum",
    });
  } else if (learnerState && learnerState.readinessMomentum !== 0) {
    cards.push({
      id: "momentum-state",
      title: "Readiness momentum",
      body:
        learnerState.readinessMomentum > 0
          ? "Recent sessions show upward readiness movement — consolidate with timed mixed items."
          : "Readiness momentum softened — prioritize one competency before long sessions.",
      tone: "momentum",
    });
  }

  if (feed?.pacingProfile || learnerState?.pacingProfile) {
    cards.push({
      id: "pacing",
      title: "Pacing profile",
      body: feed?.pacingProfile ?? learnerState!.pacingProfile,
      tone: "pacing",
    });
  }

  if (feed?.hesitationProfile || learnerState?.hesitationProfile) {
    cards.push({
      id: "hesitation",
      title: "Hesitation patterns",
      body: feed?.hesitationProfile ?? learnerState!.hesitationProfile,
      tone: "pacing",
    });
  }

  for (const topic of persistentWeakAreas.slice(0, 2)) {
    cards.push({
      id: `weak-${topic}`,
      title: "Continuing focus",
      body: `${topic} remains a priority across sessions — use the remediation ladder before new domains.`,
      href: feed?.primaryHref,
      tone: "remediation",
    });
  }

  for (const unstable of unstableCompetencies.slice(0, 2)) {
    cards.push({
      id: `volatile-${unstable}`,
      title: "Stabilize competency",
      body: `${unstable} accuracy has been uneven — short drills plus one lesson block can reduce volatility.`,
      tone: "alert",
    });
  }

  if (remediationFatigue) {
    cards.push({
      id: "fatigue",
      title: "Study load balance",
      body: "You have seen several remediation prompts recently — mix in strengths or a shorter review block today.",
      tone: "neutral",
    });
  }

  if (feed?.nextBestActionTitle) {
    cards.push({
      id: "next-best",
      title: "Next best study",
      body: feed.nextBestActionTitle,
      href: feed.primaryHref,
      tone: "remediation",
    });
  }

  return {
    feed,
    learnerState,
    cards: cards.slice(0, 6),
    persistentWeakAreas,
    remediationFatigue,
    unstableCompetencies,
  };
}
