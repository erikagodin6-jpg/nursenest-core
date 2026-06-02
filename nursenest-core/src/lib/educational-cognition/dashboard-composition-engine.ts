/**
 * Governed dashboard composition — all widgets derive from psychometric + cognition capabilities.
 */
import { isDashboardWidgetEligible } from "@/lib/testing/testing-dashboard-governance";
import type { PsychometricDashboardWidgetId } from "@/lib/testing/testing-dashboard-governance";
import type { PsychometricOrchestrationContext } from "@/lib/testing/psychometric-orchestrator";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import type {
  CognitionCapability,
  DashboardCompositionContract,
  DashboardWidgetContract,
} from "@/lib/educational-cognition/educational-cognition-types";

type CapabilityRegistry = Record<CognitionCapability, boolean>;

const WIDGET_DEFS: Array<{
  id: DashboardWidgetContract["id"];
  psychometricId?: PsychometricDashboardWidgetId;
  labelFromProfile?: boolean;
  requiresAdaptive?: boolean;
  priority: number;
}> = [
  { id: "readinessHero", priority: 100, labelFromProfile: true },
  { id: "adaptiveReadinessMeter", psychometricId: "adaptiveReadinessMeter", requiresAdaptive: true, priority: 90 },
  { id: "passProbability", psychometricId: "passProbability", priority: 85 },
  { id: "adaptiveEngine", psychometricId: "adaptiveEngine", requiresAdaptive: true, priority: 80 },
  { id: "catStreak", psychometricId: "catStreak", requiresAdaptive: true, priority: 70 },
  { id: "precisionConfidence", psychometricId: "precisionConfidence", priority: 65 },
  { id: "weakAreaRail", priority: 60 },
  { id: "competencyBalance", priority: 55 },
  { id: "studyMomentum", priority: 50 },
];

export function composeGovernedDashboard(
  psychometric: PsychometricOrchestrationContext,
  capabilities: CapabilityRegistry,
  learnerState?: RnLearnerStateSnapshot | null,
): DashboardCompositionContract {
  const fatigueHigh =
    (learnerState?.remediationFatigueScore ?? 0) >= 0.65 && capabilities.remediation_fatigue_governance;
  const widgets: DashboardWidgetContract[] = [];

  for (const def of WIDGET_DEFS) {
    let eligible = true;
    if (def.psychometricId) {
      eligible = isDashboardWidgetEligible(psychometric.pathwayId, def.psychometricId);
    }
    if (def.requiresAdaptive && !capabilities.adaptive_recommendations) {
      eligible = false;
    }
    if (def.id === "passProbability" && !capabilities.pass_outlook) {
      eligible = false;
    }
    if (fatigueHigh && (def.id === "adaptiveEngine" || def.id === "catStreak")) {
      eligible = false;
    }
    if (
      def.id === "competencyBalance" &&
      !capabilities.competency_graph &&
      !psychometric.readiness.emphasizeCompetencyBalance
    ) {
      eligible = false;
    }

    const label =
      def.labelFromProfile === true
        ? psychometric.dashboard.primaryMetricLabel
        : def.id.replace(/([A-Z])/g, " $1").trim();

    widgets.push({
      id: def.id,
      eligible,
      priority: def.priority,
      label,
    });
  }

  widgets.sort((a, b) => b.priority - a.priority);

  return {
    pathwayId: psychometric.pathwayId,
    widgets,
    showAdaptivePlan: psychometric.dashboard.showAdaptiveProgression && capabilities.adaptive_recommendations,
    primaryMetricLabel: psychometric.dashboard.primaryMetricLabel,
    sessionCtaLabel: psychometric.dashboard.sessionCtaLabel,
  };
}
