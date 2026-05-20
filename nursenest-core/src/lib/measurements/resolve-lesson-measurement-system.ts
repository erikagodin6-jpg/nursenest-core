import type { CountryCode } from "@prisma/client";
import type { MeasurementSystem } from "@/lib/measurements/measurement-domain";
import type { MeasurementPreference } from "@/lib/measurements/measurement-preference";
import { parseMeasurementPreference } from "@/lib/measurements/measurement-preference";
import {
  resolveMeasurementRenderContext,
  type MeasurementRenderContext,
} from "@/lib/measurements/resolve-measurement-context";

export function resolveLessonMeasurementContext(args: {
  countryCode?: CountryCode | string | null;
  pathwayId?: string | null;
  preference?: MeasurementPreference | string | null;
}): MeasurementRenderContext {
  const pref = parseMeasurementPreference(
    typeof args.preference === "string" ? args.preference : args.preference ?? null,
  );
  return resolveMeasurementRenderContext({
    pathwayId: args.pathwayId,
    countryCode: args.countryCode ? String(args.countryCode) : null,
    preference: pref,
  });
}

/** Rendered system for lesson SSR (legacy `MeasurementSystem` type). */
export function resolveLessonMeasurementSystem(args: {
  countryCode?: CountryCode | string | null;
  pathwayId?: string | null;
  preference?: MeasurementPreference | string | null;
}): MeasurementSystem {
  return resolveLessonMeasurementContext(args).legacyRenderedSystem;
}
