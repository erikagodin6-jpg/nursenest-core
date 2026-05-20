/**
 * Unified measurement context: instructional (pathway) vs rendered (learner preference).
 */
import { isAlliedGlobalPathwayId } from "@/lib/allied/allied-global-pathway";
import {
  clinicalToLegacySystem,
  legacyToClinicalSystem,
  type MeasurementRenderContext,
  type MeasurementSystem,
} from "@/lib/measurements/measurement-domain";
import type { MeasurementPreference } from "@/lib/measurements/measurement-preference";
import {
  parseMeasurementPreference,
  resolveMeasurementSystemPreference,
} from "@/lib/measurements/measurement-preference";
import { getPathwayMeasurementPolicy } from "@/lib/measurements/pathway-measurement-policy";

export function resolveMeasurementRenderContext(args: {
  pathwayId?: string | null;
  countryCode?: string | null;
  preference?: MeasurementPreference | string | null;
}): MeasurementRenderContext {
  const pref = parseMeasurementPreference(
    typeof args.preference === "string" ? args.preference : args.preference ?? null,
  );
  const pid = args.pathwayId?.trim() ?? "";
  const policy = getPathwayMeasurementPolicy(pid || null, args.countryCode ?? null);

  let instructionalSystem = policy.instructionalSystem;
  if (pid && isAlliedGlobalPathwayId(pid)) {
    instructionalSystem = "si";
  }

  const legacyInstructional = clinicalToLegacySystem(instructionalSystem);
  const legacyRendered: MeasurementSystem = resolveMeasurementSystemPreference(
    legacyInstructional,
    pref,
  );
  const renderedSystem = legacyToClinicalSystem(legacyRendered);

  return {
    pathwayId: pid || null,
    measurementContext: policy.measurementContext,
    instructionalSystem,
    renderedSystem,
    legacyRenderedSystem: legacyRendered,
    preferenceApplied: pref != null && legacyRendered !== legacyInstructional,
  };
}

/** Convenience: rendered legacy system for existing call sites. */
export function resolveRenderedMeasurementSystem(args: {
  pathwayId?: string | null;
  countryCode?: string | null;
  preference?: MeasurementPreference | string | null;
}): MeasurementSystem {
  return resolveMeasurementRenderContext(args).legacyRenderedSystem;
}
