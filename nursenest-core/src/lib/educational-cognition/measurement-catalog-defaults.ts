import type { MeasurementCategory } from "@/lib/measurements/measurement-domain";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

export type MeasurementCatalogItem = {
  category: MeasurementCategory;
  kind?: string;
  valueSi: number;
  trendValuesSi?: number[];
};

const TAG_TO_CATALOG: Array<{ match: RegExp; item: MeasurementCatalogItem }> = [
  { match: /abg|acid|respiratory|co2|ph/i, item: { category: "abg", kind: "ph", valueSi: 7.32, trendValuesSi: [7.4, 7.35, 7.32] } },
  {
    match: /potassium|k\+|electrolyte|sodium|magnesium/i,
    item: { category: "electrolytes", kind: "potassium", valueSi: 2.8, trendValuesSi: [3.8, 3.2, 2.8] },
  },
  {
    match: /hemodynamic|perfusion|map|bp|hypotension/i,
    item: { category: "hemodynamics", kind: "map", valueSi: 58, trendValuesSi: [72, 65, 58] },
  },
  {
    match: /glucose|insulin|dka/i,
    item: { category: "glucose", kind: "glucose", valueSi: 48, trendValuesSi: [110, 72, 48] },
  },
];

/**
 * Bounded measurement catalog for cognition slices when live vitals are unavailable.
 */
export function defaultMeasurementCatalogForState(
  learnerState: RnLearnerStateSnapshot,
): MeasurementCatalogItem[] {
  const items: MeasurementCatalogItem[] = [];
  const tags = [
    ...learnerState.measurementWeaknesses,
    ...learnerState.reasoningPatterns.filter((p) => /lab|trend|abg|electrolyte/i.test(p)),
  ];
  for (const tag of tags) {
    for (const row of TAG_TO_CATALOG) {
      if (!row.match.test(tag)) continue;
      if (items.some((i) => i.category === row.item.category && i.kind === row.item.kind)) continue;
      items.push({ ...row.item });
      if (items.length >= 6) return items;
    }
  }
  if (items.length === 0 && learnerState.competencyStates.some((c) => c.competencyId === "acid_base_gas_exchange")) {
    items.push(TAG_TO_CATALOG[0].item);
  }
  return items;
}
