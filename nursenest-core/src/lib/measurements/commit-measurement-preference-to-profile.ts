import type { MeasurementPreference } from "@/lib/measurements/measurement-preference";

/** Persist units preference to the learner profile (cross-device default). */
export async function commitMeasurementPreferenceToProfile(
  preference: MeasurementPreference,
): Promise<boolean> {
  try {
    const res = await fetch("/api/learner/personal-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ measurementPreference: preference }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
