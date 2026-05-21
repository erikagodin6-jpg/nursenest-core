import type { DurableLearnerCognitionEnvelope } from "@/lib/educational-cognition/cognition-snapshot-types";
import { prepareDurableCognitionEnvelope } from "@/lib/educational-cognition/prepare-durable-cognition-envelope";
import { governCognitionHydration } from "@/lib/educational-cognition/cognition-hydration-governance";
import { resolveEducationalCognitionContext } from "@/lib/educational-cognition/resolve-educational-cognition-context";
import { buildGovernedAdaptiveRecommendations } from "@/lib/educational-cognition/adaptive-recommendation-cognition";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { buildCognitionVersionMetadata } from "@/lib/educational-cognition/cognition-version-governance";

export type CognitionReplayResult = {
  envelope: DurableLearnerCognitionEnvelope | null;
  hydrationMode: string;
  pathwayId: string;
  primaryNextTitle: string | null;
  graphStepCount: number;
  warnings: string[];
  version: ReturnType<typeof buildCognitionVersionMetadata>;
};

/**
 * Replays a stored envelope through migrate → integrity → repair → hydration → context resolution.
 * Deterministic for a fixed envelope + pathway (no DB).
 */
export async function replayCognitionEnvelope(args: {
  raw: unknown;
  pathwayId: string;
  userId?: string;
  entitlement?: AccessScope | null;
}): Promise<CognitionReplayResult> {
  const pathwayId = args.pathwayId.trim() || "unknown";
  const prepared = prepareDurableCognitionEnvelope(args.raw, pathwayId);
  const warnings = [...prepared.repairOperations];

  if (!prepared.envelope) {
    return {
      envelope: null,
      hydrationMode: "fresh",
      pathwayId,
      primaryNextTitle: null,
      graphStepCount: 0,
      warnings: [...warnings, "envelope_unrecoverable"],
      version: buildCognitionVersionMetadata({ migrationPath: prepared.migrationPath }),
    };
  }

  const hydration = governCognitionHydration({
    userId: args.userId ?? "replay_user",
    pathwayId,
    stored: prepared.envelope,
    fromDatabase: true,
    fingerprintMatch: true,
  });
  warnings.push(...hydration.warnings);

  const ctx = resolveEducationalCognitionContext(pathwayId, {
    userId: args.userId,
    weakTopicLabels: hydration.snapshot.measurementWeaknesses,
    persistLearnerState: false,
  });

  let primaryNextTitle: string | null = null;
  let graphStepCount = 0;

  if (args.entitlement?.hasAccess && args.userId && ctx.readinessResult) {
    const governed = await buildGovernedAdaptiveRecommendations({
      preferredPathwayId: pathwayId,
      userId: args.userId,
      entitlement: args.entitlement,
      examDatePlanType: null,
      examDate: null,
      readiness: ctx.readinessResult,
      weakTopics: [],
      streakDays: 0,
      lessonPct: 0,
      lessonsCompleted: 0,
      lessonsTotal: 0,
      studyCadencePreference: null,
      continueLesson: null,
      recommendedQuizTopic: null,
      mockCount: 0,
      practiceSessionCount: 0,
    });
    primaryNextTitle = governed.primaryNext?.title ?? null;
    graphStepCount = governed.cognition?.graphNextSteps?.length ?? 0;
  }

  return {
    envelope: prepared.envelope,
    hydrationMode: hydration.mode,
    pathwayId,
    primaryNextTitle,
    graphStepCount,
    warnings,
    version: buildCognitionVersionMetadata({
      envelopeVersion: prepared.envelope.cognitionSnapshotVersion,
      migrationPath: prepared.migrationPath,
    }),
  };
}

export function diffReplayPrimaryNext(
  before: CognitionReplayResult,
  after: CognitionReplayResult,
): { changed: boolean; before: string | null; after: string | null } {
  return {
    changed: before.primaryNextTitle !== after.primaryNextTitle,
    before: before.primaryNextTitle,
    after: after.primaryNextTitle,
  };
}

export const replayCognitionEnvelopeHydration = replayCognitionEnvelope;
