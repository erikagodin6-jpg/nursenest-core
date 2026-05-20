import { convertClinicalMeasurement, formatRangeFromSi } from "@/lib/measurements/convert-clinical-measurement";
import type { AuthoredMeasurement, ClinicalMeasurementSystem } from "@/lib/measurements/measurement-domain";
import type { ConvertClinicalMeasurementOptions } from "@/lib/measurements/convert-clinical-measurement";
import { assessMeasurementSafety } from "@/lib/measurements/measurement-safety-governance";
import type { ParsedMeasurementTokenV2 } from "@/lib/measurements/measurement-token-v2";
import { buildTrendClinicalReasoning } from "@/lib/measurements/measurement-clinical-reasoning";
import { analyzeTrendSeries } from "@/lib/measurements/measurement-trend-intelligence";
import { renderAuthoredMeasurement } from "@/lib/measurements/measurement-token-governance";

export function renderParsedTokenV2(
  parsed: ParsedMeasurementTokenV2,
  renderedSystem: ClinicalMeasurementSystem,
  instructionalSystem: ClinicalMeasurementSystem,
  options?: ConvertClinicalMeasurementOptions,
): string {
  if ("error" in parsed) return "";

  if (parsed.type === "literal") {
    return parsed.displayLiteral;
  }

  if (parsed.type === "trend") {
    const current = renderAuthoredMeasurement(parsed.measurement, renderedSystem, options);
    const series =
      parsed.valuesSi.length >= 2
        ? analyzeTrendSeries({
            category: parsed.measurement.category,
            valuesSi: parsed.valuesSi,
            kind: parsed.measurement.kind,
          })
        : null;
    const trend =
      series?.summary ??
      buildTrendClinicalReasoning({
        category: parsed.measurement.category,
        priorValueSi: parsed.priorValueSi,
        currentValueSi: parsed.currentValueSi,
      });
    return `${current} (${trend})`;
  }

  const m = parsed.measurement;
  const safety = assessMeasurementSafety({
    category: m.category,
    annotation: parsed.annotation,
    authoredSystem: m.authoredSystem,
    renderedSystem,
  });
  const safeOptions: ConvertClinicalMeasurementOptions = {
    ...options,
    showEducationalEquivalent:
      (options?.showEducationalEquivalent ?? false) && safety.allowDualEquivalent,
  };

  if (parsed.type === "range" && m.lowSi != null && m.highSi != null) {
    return formatRangeFromSi({
      lowSi: m.lowSi,
      highSi: m.highSi,
      category: m.category,
      authoredSystem: m.authoredSystem,
      renderedSystem,
      kind: m.kind,
      options: safeOptions,
    });
  }

  const result = convertClinicalMeasurement({
    valueSi: m.valueSi,
    category: m.category,
    kind: m.kind,
    authoredSystem: m.authoredSystem,
    renderedSystem,
    options: safeOptions,
  });

  if (parsed.annotation === "critical" && safety.warning) {
    return `${result.displayPrimary} (${parsed.annotation})`;
  }
  if (result.dualShown && result.displaySecondary) {
    return `${result.displayPrimary} (≈ ${result.displaySecondary})`;
  }
  return result.displayPrimary;
}
