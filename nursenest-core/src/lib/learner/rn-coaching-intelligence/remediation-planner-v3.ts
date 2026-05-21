import type { CatResultsCoachSnapshot } from "@/lib/practice-tests/cat-results-coach";
import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";
import {
  graphSourceSurfaceForPlanner,
  graphStepsToCoachingRecommendations,
} from "@/lib/educational-graph/graph-step-adapters";
import { maxGraphStepsForSurface } from "@/lib/educational-graph/graph-surface-caps";
import type { RnCompetencyId } from "@/lib/educational-graph/rn-competency-ontology";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import {
  countExposureForKey,
  wasRecentlyExposed,
} from "@/lib/learner/rn-coaching-intelligence/remediation-exposure";
import type { CoachingModel, CoachingRecommendation, CoachingSessionKind } from "@/lib/learner/rn-coaching-intelligence/coaching-types";

function reassessmentLabel(coachingModel: CoachingModel): string {
  return coachingModel === "loft_readiness" ? "LOFT reassessment" : "Adaptive reassessment";
}

function simulationFollowUpLabel(): string {
  return "Another LOFT simulation";
}

const UNSTABLE_PRIORITY: RnCompetencyId[] = [
  "perfusion_hemodynamics",
  "respiratory_instability",
  "infection_sepsis",
  "acid_base_gas_exchange",
];

function exposureKeyFor(topic: string, kind: string): string {
  return `${topic.trim().toLowerCase()}::${kind}`;
}

function measurementBoostForTopic(topic: string, state: RnLearnerStateSnapshot | null): number {
  if (!state?.measurementWeaknesses.length) return 0;
  const lower = topic.toLowerCase();
  const hit = state.measurementWeaknesses.some(
    (t) => lower.includes(t.replace(/_/g, " ")) || lower.includes(t.replace(/_/g, "-")),
  );
  return hit ? 18 : 0;
}

function weakTopicPriorityScore(topic: string, state: RnLearnerStateSnapshot | null): number {
  if (!state) return 0;
  let score = measurementBoostForTopic(topic, state);
  const lower = topic.toLowerCase();
  for (const c of state.competencyStates) {
    if (!c.persistentWeak && c.masteryScore >= 50) continue;
    if (lower.includes(c.competencyId.replace(/_/g, " ")) || lower.includes(c.competencyId.split("_")[0])) {
      score += 100 - c.masteryScore;
      if (UNSTABLE_PRIORITY.includes(c.competencyId)) score += 15;
      if (c.volatility === "declining" || c.volatility === "volatile") score += 10;
    }
  }
  return score;
}

function sortWeakTopicsByState(labels: string[], state: RnLearnerStateSnapshot | null): string[] {
  return [...labels].sort((a, b) => weakTopicPriorityScore(b, state) - weakTopicPriorityScore(a, state));
}

function topicSlugFromLabel(label: string): string {
  return label.trim().toLowerCase().replace(/\s+/g, "-");
}

/**
 * Thin presentation adapter — all traversal and hrefs from {@link orchestrateEducationalGraph}.
 */
export function planRemediationV3(args: {
  coachingModel: CoachingModel;
  sessionKind: CoachingSessionKind;
  pathwayId: string | null;
  weakTopicLabels: string[];
  coach?: CatResultsCoachSnapshot | null;
  remediationUserId?: string | null;
  learnerState?: RnLearnerStateSnapshot | null;
  maxItems?: number;
  sourceSurface?: import("@/lib/educational-graph/graph-step-contract").GraphSourceSurface;
}): CoachingRecommendation[] {
  const {
    coachingModel,
    sessionKind,
    pathwayId,
    weakTopicLabels,
    coach,
    remediationUserId,
    learnerState,
    maxItems = 5,
    sourceSurface: sourceSurfaceOverride,
  } = args;

  const fatigue = learnerState?.remediationFatigueScore ?? 0;
  const sourceSurface =
    sourceSurfaceOverride ??
    graphSourceSurfaceForPlanner({
      sessionKind,
      preferDashboard: maxItems <= 5 && sessionKind === "practice_exam",
    });
  const cap = maxGraphStepsForSurface(sourceSurface, {
    fatigueScore: fatigue,
    explicitMax: maxItems,
  });
  const out: CoachingRecommendation[] = [];
  const seenHref = new Set<string>();
  let priority = 1;
  const orderedWeak = sortWeakTopicsByState(weakTopicLabels, learnerState ?? null);
  const primaryWeak = orderedWeak[0] ?? coach?.weakestDomains?.[0] ?? null;

  for (const topic of coach?.studyNext ?? []) {
    const topicSlug = topicSlugFromLabel(topic.title);
    const traversal = orchestrateEducationalGraph({
      topicSlug,
      topicLabel: topic.title,
      pathwayId,
      coachingModel,
      sourceSurface: "recommendation_engine",
      learnerState: learnerState ?? null,
      persistentWeakTopics: orderedWeak,
      maxSteps: 1,
      exposureDepth: remediationUserId ? countExposureForKey(remediationUserId, exposureKeyFor(topic.title, "topic")) : 0,
    });
    const step = traversal.steps[0];
    if (!step?.href || seenHref.has(step.href)) continue;
    const key = exposureKeyFor(topic.title, step.stepKind);
    if (remediationUserId && wasRecentlyExposed(remediationUserId, key, 24)) continue;
    const [rec] = graphStepsToCoachingRecommendations({
      steps: [step],
      topicLabel: topic.title,
      startPriority: priority,
      exposureKeyPrefix: topic.title,
    });
    if (!rec) continue;
    out.push({ ...rec, reason: topic.reason || rec.reason });
    seenHref.add(step.href);
    priority++;
    if (out.length >= cap) return out;
  }

  if (primaryWeak) {
    const topicDepth = remediationUserId
      ? countExposureForKey(remediationUserId, exposureKeyFor(primaryWeak, "topic"))
      : 0;
    const rotateOffset = fatigue >= 0.5 ? topicDepth % 3 : 0;
    const traversal = orchestrateEducationalGraph({
      topicSlug: topicSlugFromLabel(primaryWeak),
      topicLabel: primaryWeak,
      pathwayId,
      coachingModel,
      sourceSurface,
      learnerState: learnerState ?? null,
      persistentWeakTopics: orderedWeak,
      exposureDepth: topicDepth + rotateOffset,
      maxSteps: cap,
    });
    for (const rec of graphStepsToCoachingRecommendations({
      steps: traversal.steps,
      topicLabel: primaryWeak,
      startPriority: priority,
    })) {
      if (seenHref.has(rec.href)) continue;
      const key = exposureKeyFor(primaryWeak, rec.kind);
      if (remediationUserId && wasRecentlyExposed(remediationUserId, key, fatigue >= 0.6 ? 48 : 36)) continue;
      out.push(rec);
      seenHref.add(rec.href);
      priority++;
      if (out.length >= cap) break;
    }
  }

  if (out.length < cap && coachingModel === "cat_adaptive" && (sessionKind === "cat" || sessionKind === "readiness_assessment")) {
    const href = pathwayId
      ? `/app/practice-tests/cat-launch?pathwayId=${encodeURIComponent(pathwayId)}`
      : "/app/practice-tests";
    if (!seenHref.has(href)) {
      out.push({
        priority: priority++,
        title: reassessmentLabel(coachingModel),
        reason:
          learnerState && learnerState.readinessMomentum < 0.3
            ? "Stabilize readiness with a short adaptive check after targeted review."
            : "Confirm whether today's gaps are stable or one-off under pressure.",
        href,
        kind: "readiness_reassessment",
        exposureKey: "cat::reassessment",
      });
    }
  }

  if (out.length < cap && sessionKind === "loft_simulation") {
    const href = "/app/cases/cnple";
    if (!seenHref.has(href)) {
      out.push({
        priority: priority++,
        title: simulationFollowUpLabel(),
        reason: "Repeat a fixed-length licensing simulation to confirm domain balance and pacing.",
        href,
        kind: "simulation",
        exposureKey: "loft::simulation",
      });
    }
  }

  return out.slice(0, cap);
}
