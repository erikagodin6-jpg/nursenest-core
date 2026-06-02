/**
 * Governed learner analytics — all pathway-scoped PostHog events must pass psychometric telemetry guards.
 */
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { skipLearnerBusinessAnalyticsForAccessScope } from "@/lib/observability/admin-learner-qa-analytics";
import { analyticsDistinctId, captureServerEvent } from "@/lib/observability/posthog-server";
import {
  assertPathwayPostHogCapture,
  logPsychometricTelemetryViolation,
  toTestingModelPostHogFields,
} from "@/lib/testing/testing-telemetry-governance";
import { getTestingModelForPathwayId } from "@/lib/testing/testing-model-pathway-map";

function extractPathwayId(props: Record<string, string | number | boolean | undefined>): string | null {
  const raw = props.pathway_id ?? props.pathwayId;
  return typeof raw === "string" && raw.trim() ? raw.trim() : null;
}

/**
 * PostHog capture with psychometric dimension normalization and LOFT/CAT isolation.
 * Forbidden CAT-prefixed events on LOFT pathways are blocked and logged (never sent).
 */
export function captureGovernedLearnerProductEvent(
  userId: string,
  entitlement: AccessScope,
  event: string,
  props: Record<string, string | number | boolean | undefined> = {},
): void {
  const pathwayId = extractPathwayId(props);
  try {
    assertPathwayPostHogCapture(pathwayId, event, props);
  } catch (err) {
    logPsychometricTelemetryViolation(
      pathwayId,
      event,
      err instanceof Error ? err.message : String(err),
    );
    return;
  }

  if (skipLearnerBusinessAnalyticsForAccessScope(entitlement)) return;

  const model = getTestingModelForPathwayId(pathwayId);
  const governed: Record<string, string | number | boolean | undefined> = {
    ...toTestingModelPostHogFields(pathwayId),
    ...props,
    testing_model: model,
  };

  if (model === "LOFT") {
    delete governed.cat_mode;
    delete governed.cat_coach_present;
    delete governed.cat_confidence_level;
    delete governed.cat_pattern_codes;
    delete governed.cat_exam_feedback_mode;
    delete governed.pass_outlook_pct;
  }

  void captureServerEvent(analyticsDistinctId(userId), event, {
    actor: "authenticated",
    ...governed,
    country: entitlement.country ?? undefined,
    tier: entitlement.tier ?? undefined,
  });
}
