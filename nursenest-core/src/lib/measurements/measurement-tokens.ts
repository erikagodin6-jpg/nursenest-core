/**
 * Lesson / exam token resolution — legacy `{{id}}` + canonical `[[category:value:unit]]`.
 */
import type { MeasurementSystem } from "@/lib/measurements/measurement-domain";
import { legacyToClinicalSystem } from "@/lib/measurements/measurement-domain";
import {
  LEGACY_TOKEN_RE,
  renderAuthoredMeasurement,
  resolveCanonicalTokensWithProvenance,
} from "@/lib/measurements/measurement-token-governance";
import {
  LEGACY_MEASUREMENT_TOKEN_REGISTRY,
  listKnownMeasurementTokenIds,
  type MeasurementTokenId,
} from "@/lib/measurements/measurement-tokens-registry";
import { getPathwayInstructionalSystem } from "@/lib/measurements/pathway-measurement-policy";

export type { MeasurementTokenId } from "@/lib/measurements/measurement-tokens-registry";
export { listKnownMeasurementTokenIds };

export type ResolveMeasurementTokensOptions = {
  dual?: boolean;
  pathwayId?: string | null;
  countryCode?: string | null;
};

export type ResolveMeasurementTokensResult = {
  text: string;
  /** Non-fatal canonical token lint errors (unknown tokens left unchanged). */
  errors: import("./measurement-token-governance").MeasurementTokenValidationError[];
};

/**
 * Replace measurement tokens in plain text. Unknown legacy tokens left unchanged.
 */
export function resolveMeasurementTokens(
  text: string,
  measurementSystem: MeasurementSystem,
  options?: ResolveMeasurementTokensOptions,
): string {
  return resolveMeasurementTokensDetailed(text, measurementSystem, options).text;
}

export function resolveMeasurementTokensDetailed(
  text: string,
  measurementSystem: MeasurementSystem,
  options?: ResolveMeasurementTokensOptions,
): ResolveMeasurementTokensResult {
  const renderedSystem = legacyToClinicalSystem(measurementSystem);
  const instructionalSystem = getPathwayInstructionalSystem(
    options?.pathwayId,
    options?.countryCode,
  );
  const convertOpts = { showEducationalEquivalent: options?.dual === true };

  const canonical = resolveCanonicalTokensWithProvenance(
    text,
    renderedSystem,
    instructionalSystem,
    convertOpts,
  );

  const legacyRendered = canonical.output.replace(LEGACY_TOKEN_RE, (full, id: string) => {
    const def = LEGACY_MEASUREMENT_TOKEN_REGISTRY[id as MeasurementTokenId];
    if (!def) return full;
    const m = def.measurement;
    const authored = {
      ...m,
      authoredSystem: m.authoredSystem ?? instructionalSystem,
    };
    if (def.type === "range" && authored.lowSi != null && authored.highSi != null) {
      return renderAuthoredMeasurement(
        { ...authored, lowSi: authored.lowSi, highSi: authored.highSi },
        renderedSystem,
        convertOpts,
      );
    }
    return renderAuthoredMeasurement(authored, renderedSystem, convertOpts);
  });

  return { text: legacyRendered, errors: canonical.errors };
}
