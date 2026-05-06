import type { MeasurementSystem } from "@/lib/measurements/measurement-system";

export type MeasurementPreference = "metric" | "imperial";

export const MEASUREMENT_PREFERENCE_COOKIE = "nn_measurement_system";
export const MEASUREMENT_PREFERENCE_LOCAL_STORAGE_KEY = "nn_measurement_system";

export function isMeasurementPreference(value: string | null | undefined): value is MeasurementPreference {
  return value === "metric" || value === "imperial";
}

export function parseMeasurementPreference(value: string | null | undefined): MeasurementPreference | null {
  const normalized = (value ?? "").trim().toLowerCase();
  return isMeasurementPreference(normalized) ? normalized : null;
}

export function measurementPreferenceToSystem(preference: MeasurementPreference): MeasurementSystem {
  return preference === "imperial" ? "US" : "SI";
}

export function measurementSystemToPreference(system: MeasurementSystem): MeasurementPreference {
  return system === "US" ? "imperial" : "metric";
}

export function resolveMeasurementSystemPreference(
  fallback: MeasurementSystem,
  preference: MeasurementPreference | null | undefined,
): MeasurementSystem {
  return preference ? measurementPreferenceToSystem(preference) : fallback;
}

export function readMeasurementPreferenceFromCookieStore(
  store: { get(name: string): { value: string } | undefined } | null | undefined,
): MeasurementPreference | null {
  const raw = store?.get(MEASUREMENT_PREFERENCE_COOKIE)?.value;
  return parseMeasurementPreference(raw);
}

export function readMeasurementPreferenceFromCookieHeader(cookieHeader: string | null | undefined): MeasurementPreference | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${MEASUREMENT_PREFERENCE_COOKIE}=([^;]+)`));
  return parseMeasurementPreference(match ? decodeURIComponent(match[1]) : null);
}
