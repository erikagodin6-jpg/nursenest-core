import { ANTIBIOTIC_REGISTRY } from "./antibiotic-registry";
import type { CoverageStrength } from "./types";

export interface SpectrumHeatmapCell {
  antibioticId: string;
  antibioticName: string;
  target: "gramPositive" | "gramNegative" | "anaerobes" | "atypicals" | "mrsa" | "pseudomonas";
  label: string;
  strength: CoverageStrength | "covered" | "not-covered";
  score: number;
}

export interface SpectrumHeatmapRow {
  antibioticId: string;
  antibioticName: string;
  cells: SpectrumHeatmapCell[];
}

function strengthScore(strength: CoverageStrength): number {
  switch (strength) {
    case "strong":
      return 3;
    case "moderate":
      return 2;
    case "weak":
      return 1;
    default:
      return 0;
  }
}

function booleanCoverage(value: boolean): "covered" | "not-covered" {
  return value ? "covered" : "not-covered";
}

export function buildSpectrumHeatmap(): SpectrumHeatmapRow[] {
  return ANTIBIOTIC_REGISTRY.map((antibiotic) => ({
    antibioticId: antibiotic.id,
    antibioticName: antibiotic.name,
    cells: [
      {
        antibioticId: antibiotic.id,
        antibioticName: antibiotic.name,
        target: "gramPositive",
        label: "Gram +",
        strength: antibiotic.gramPositive,
        score: strengthScore(antibiotic.gramPositive)
      },
      {
        antibioticId: antibiotic.id,
        antibioticName: antibiotic.name,
        target: "gramNegative",
        label: "Gram -",
        strength: antibiotic.gramNegative,
        score: strengthScore(antibiotic.gramNegative)
      },
      {
        antibioticId: antibiotic.id,
        antibioticName: antibiotic.name,
        target: "anaerobes",
        label: "Anaerobes",
        strength: antibiotic.anaerobes,
        score: strengthScore(antibiotic.anaerobes)
      },
      {
        antibioticId: antibiotic.id,
        antibioticName: antibiotic.name,
        target: "atypicals",
        label: "Atypicals",
        strength: antibiotic.atypicals,
        score: strengthScore(antibiotic.atypicals)
      },
      {
        antibioticId: antibiotic.id,
        antibioticName: antibiotic.name,
        target: "mrsa",
        label: "MRSA",
        strength: booleanCoverage(antibiotic.mrsa),
        score: antibiotic.mrsa ? 3 : 0
      },
      {
        antibioticId: antibiotic.id,
        antibioticName: antibiotic.name,
        target: "pseudomonas",
        label: "Pseudomonas",
        strength: booleanCoverage(antibiotic.pseudomonas),
        score: antibiotic.pseudomonas ? 3 : 0
      }
    ]
  }));
}
