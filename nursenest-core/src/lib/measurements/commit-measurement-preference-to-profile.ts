import {
  buildMeasurementAnalyticsPayload,
  trackMeasurementAnalytics,
} from "@/lib/measurements/measurement-analytics";
import { legacyToClinicalSystem } from "@/lib/measurements/measurement-domain";
import { getPathwayMeasurementPolicy } from "@/lib/measurements/pathway-measurement-policy";
import type { MeasurementPreference } from "@/lib/measurements/measurement-preference";

/** Persist units preference to the learner profile (cross-device default). */
export async function commitMeasurementPreferenceToProfile(
  preference: MeasurementPreference,
  options?: { pathwayId?: string | null; surface?: string },
): Promise<boolean> {
  try {
    const res = await fetch("/api/learner/personal-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ measurementPreference: preference }),
    });
    if (res.ok) {
      const policy = getPathwayMeasurementPolicy(options?.pathwayId ?? null);
      void trackMeasurementAnalytics(
        buildMeasurementAnalyticsPayload({
          event: "measurement_preference_set",
          pathwayId: options?.pathwayId,
          instructionalSystem: policy.instructionalSystem,
          renderedSystem: legacyToClinicalSystem(preference === "imperial" ? "US" : "SI"),
          measurementContext: policy.measurementContext,
          surface: options?.surface ?? "profile",
        }),
      );
    }
    return res.ok;
  } catch {
    return false;
  }
}
