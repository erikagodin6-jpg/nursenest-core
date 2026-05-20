import type { CountryCode } from "@prisma/client";
import {
  getMeasurementSystemForCountry,
  resolveMeasurementSystemForLearnerPathway,
  type MeasurementSystem,
} from "@/lib/measurements/measurement-system";
import {
  parseMeasurementPreference,
  resolveMeasurementSystemPreference,
  type MeasurementPreference,
} from "@/lib/measurements/measurement-preference";

export function resolveLessonMeasurementSystem(args: {
  countryCode?: CountryCode | string | null;
  pathwayId?: string | null;
  preference?: MeasurementPreference | string | null;
}): MeasurementSystem {
  const pref = parseMeasurementPreference(
    typeof args.preference === "string" ? args.preference : args.preference ?? null,
  );
  if (args.pathwayId) {
    const country = args.countryCode ? String(args.countryCode) : null;
    const map =
      country && args.pathwayId
        ? { [args.pathwayId]: country }
        : undefined;
    const fallback = resolveMeasurementSystemForLearnerPathway(args.pathwayId, map, pref);
    return fallback;
  }
  const base = getMeasurementSystemForCountry(
    typeof args.countryCode === "string" ? args.countryCode : null,
  );
  return resolveMeasurementSystemPreference(base, pref);
}
