export type CatExposureBand =
  | "underused"
  | "healthy"
  | "elevated"
  | "overexposed"
  | "retire";

export type CatExposureBalancingInput = {
  questionId?: string | null;
  qualityWeight: number;
  qualityBand: "exclude" | "low" | "standard" | "preferred" | "flagship";
  totalExposures?: number | null;
  recentExposures7d?: number | null;
  recentExposures30d?: number | null;
  incorrectRate?: number | null;
  discriminationIndex?: number | null;
  lastServedAt?: string | Date | null;
  isExperimental?: boolean | null;
};

export type CatExposureBalancingResult = {
  adjustedWeight: number;
  exposureBand: CatExposureBand;
  exposurePenalty: number;
  longevityScore: number;
  recommendations: string[];
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function daysSince(date: string | Date | null | undefined): number | null {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return Math.floor((Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24));
}

function exposureBandFor(exposurePenalty: number, totalExposures: number): CatExposureBand {
  if (totalExposures >= 5000 || exposurePenalty >= 0.65) return "retire";
  if (totalExposures >= 2500 || exposurePenalty >= 0.45) return "overexposed";
  if (totalExposures >= 1200 || exposurePenalty >= 0.25) return "elevated";
  if (totalExposures <= 100) return "underused";
  return "healthy";
}

export function balanceCatItemExposure(
  input: CatExposureBalancingInput,
): CatExposureBalancingResult {
  const recommendations: string[] = [];

  const totalExposures = Math.max(0, input.totalExposures ?? 0);
  const recent7d = Math.max(0, input.recentExposures7d ?? 0);
  const recent30d = Math.max(0, input.recentExposures30d ?? 0);
  const incorrectRate = clamp(input.incorrectRate ?? 0.5, 0, 1);
  const discriminationIndex = clamp(input.discriminationIndex ?? 0.2, -1, 1);

  let exposurePenalty = 0;

  if (totalExposures >= 500) exposurePenalty += 0.08;
  if (totalExposures >= 1000) exposurePenalty += 0.12;
  if (totalExposures >= 2500) exposurePenalty += 0.18;
  if (totalExposures >= 5000) exposurePenalty += 0.24;

  if (recent7d >= 50) exposurePenalty += 0.08;
  if (recent7d >= 120) exposurePenalty += 0.12;

  if (recent30d >= 250) exposurePenalty += 0.08;
  if (recent30d >= 600) exposurePenalty += 0.12;

  if (input.qualityBand === "flagship") {
    exposurePenalty += 0.05;
    recommendations.push("Protect flagship item from overexposure.");
  }

  if (input.qualityBand === "preferred") {
    exposurePenalty += 0.03;
  }

  if (incorrectRate <= 0.15) {
    exposurePenalty += 0.1;
    recommendations.push("Item may be too easy for adaptive precision.");
  }

  if (incorrectRate >= 0.92) {
    exposurePenalty += 0.1;
    recommendations.push("Item may be excessively difficult or unclear.");
  }

  if (discriminationIndex <= 0.05) {
    exposurePenalty += 0.12;
    recommendations.push("Low discrimination index reduces adaptive value.");
  }

  if (discriminationIndex >= 0.4) {
    exposurePenalty -= 0.05;
    recommendations.push("Strong discrimination index supports continued adaptive use.");
  }

  const idleDays = daysSince(input.lastServedAt);
  if (idleDays !== null && idleDays >= 30) {
    exposurePenalty -= 0.08;
    recommendations.push("Item has rested and may be safely reintroduced.");
  }

  if (input.isExperimental) {
    exposurePenalty -= 0.05;
    recommendations.push("Experimental item eligible for controlled exposure.");
  }

  exposurePenalty = clamp(Number(exposurePenalty.toFixed(2)), 0, 0.85);

  let adjustedWeight = input.qualityWeight * (1 - exposurePenalty);

  if (input.qualityBand === "exclude") adjustedWeight = 0;

  adjustedWeight = clamp(Number(adjustedWeight.toFixed(2)), 0, 1.25);

  const longevityScore = clamp(
    Math.round(
      (1 - exposurePenalty) * 100 +
        discriminationIndex * 15 -
        Math.max(0, totalExposures - 1000) / 80,
    ),
    0,
    100,
  );

  const exposureBand = exposureBandFor(exposurePenalty, totalExposures);

  if (exposureBand === "retire") {
    recommendations.push("Temporarily retire item from CAT rotation.");
  } else if (exposureBand === "overexposed") {
    recommendations.push("Reduce CAT frequency and diversify surrounding items.");
  } else if (exposureBand === "underused") {
    recommendations.push("Safe candidate for broader adaptive exposure.");
  }

  return {
    adjustedWeight,
    exposureBand,
    exposurePenalty,
    longevityScore,
    recommendations,
  };
}
