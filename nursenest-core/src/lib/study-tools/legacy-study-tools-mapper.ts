/**
 * Maps legacy monolith study-tool content shapes into NurseNest draft bundles.
 * Output is always draft (`published: false`) until product approves launch.
 */

export type LegacyStudyToolCategory = string;

export type CanonicalBodySystem =
  | "respiratory"
  | "cardiovascular"
  | "pharmacology"
  | "patient-education"
  | "ventilation"
  | "monitoring"
  | "neuromuscular"
  | "general";

/** Heuristic: legacy `category` / `topic` strings → canonical body-system bucket (not RN pathway logic). */
export function mapLegacyCategoryToBodySystem(categoryOrTopic: string | null | undefined): CanonicalBodySystem {
  const raw = (categoryOrTopic ?? "").trim().toLowerCase();
  if (!raw) return "general";

  if (
    raw.includes("bronch") ||
    raw.includes("asthma") ||
    raw.includes("copd") ||
    raw.includes("aerosol") ||
    raw.includes("nebul") ||
    raw.includes("inhal")
  ) {
    return "respiratory";
  }
  if (raw.includes("ventil") || raw.includes("co₂") || raw.includes("co2") || raw.includes("oxygen")) {
    return "ventilation";
  }
  if (
    raw.includes("drug") ||
    raw.includes("pharm") ||
    raw.includes("interaction") ||
    raw.includes("paralytic") ||
    raw.includes("sedation") ||
    raw.includes("opioid") ||
    raw.includes("analges")
  ) {
    return "pharmacology";
  }
  if (raw.includes("patient") || raw.includes("education") || raw.includes("delivery")) {
    return "patient-education";
  }
  if (raw.includes("monitor") || raw.includes("spo") || raw.includes("lab")) {
    return "monitoring";
  }
  if (raw.includes("cardio") || raw.includes("arrhythm") || raw.includes("beta")) {
    return "cardiovascular";
  }
  if (raw.includes("neuro") || raw.includes("nmj")) {
    return "neuromuscular";
  }
  return "general";
}

export type LegacyTrapLike = {
  id: number;
  trap: string;
  wrongAnswer: string;
  correctAnswer: string;
  explanation: string;
  category: string;
};

export type LegacyOneMinuteCardLike = {
  id: number;
  title: string;
  keyFacts: string[];
  examTip: string;
  category: string;
};

export type LegacyQuickSheetDrugLike = {
  drug: string;
  sideEffects: string[];
  clinicalTip: string;
};

export type DraftStudyToolsGrouping = {
  bodySystem: CanonicalBodySystem;
  category: LegacyStudyToolCategory;
};

export type DraftStudyToolsActivity = {
  kind: "trap_mc" | "flashcard_stack" | "medication_table";
  title: string;
  grouping: DraftStudyToolsGrouping;
  /** Stable within source export */
  legacyIds: number[] | string[];
  /** Opaque payload for future UI — keep text-only, bounded */
  preview: Record<string, unknown>;
};

export type DraftStudyToolsBundle = {
  schemaVersion: 1;
  source: "legacy-rrt-pharm-study-tools";
  pathwayId: string | null;
  published: false;
  /** ISO timestamp string when generated */
  generatedAt: string;
  activities: DraftStudyToolsActivity[];
  groupings: DraftStudyToolsGrouping[];
};

function uniqueGroupings(activities: DraftStudyToolsActivity[]): DraftStudyToolsGrouping[] {
  const seen = new Set<string>();
  const out: DraftStudyToolsGrouping[] = [];
  for (const a of activities) {
    const k = `${a.grouping.bodySystem}::${a.grouping.category}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(a.grouping);
  }
  return out;
}

/**
 * Maps the legacy `client/src/data/rrt-pharm-study-tools.ts` exports into a draft bundle.
 * Categories are preserved on each activity; body systems are derived via {@link mapLegacyCategoryToBodySystem}.
 */
export function mapLegacyRrtPharmStudyToolsExport(input: {
  tmcTraps?: LegacyTrapLike[] | null;
  oneMinuteCards?: LegacyOneMinuteCardLike[] | null;
  highYieldSideEffects?: LegacyQuickSheetDrugLike[] | null;
  pathwayId?: string | null;
}): DraftStudyToolsBundle {
  const pathwayId = input.pathwayId?.trim() || null;
  const activities: DraftStudyToolsActivity[] = [];

  for (const row of input.tmcTraps ?? []) {
    const category = row.category.trim() || "General";
    const bodySystem = mapLegacyCategoryToBodySystem(row.category);
    activities.push({
      kind: "trap_mc",
      title: row.trap.slice(0, 200),
      grouping: { bodySystem, category },
      legacyIds: [row.id],
      preview: {
        trap: row.trap,
        wrongAnswer: row.wrongAnswer,
        correctAnswer: row.correctAnswer,
        explanation: row.explanation,
      },
    });
  }

  for (const card of input.oneMinuteCards ?? []) {
    const category = card.category.trim() || "General";
    const bodySystem = mapLegacyCategoryToBodySystem(card.category);
    activities.push({
      kind: "flashcard_stack",
      title: card.title.slice(0, 200),
      grouping: { bodySystem, category },
      legacyIds: [card.id],
      preview: {
        keyFacts: card.keyFacts.slice(0, 12),
        examTip: card.examTip,
      },
    });
  }

  for (const drug of input.highYieldSideEffects ?? []) {
    const category = "Medication safety";
    const bodySystem = mapLegacyCategoryToBodySystem("Pharmacology");
    activities.push({
      kind: "medication_table",
      title: drug.drug.slice(0, 200),
      grouping: { bodySystem, category },
      legacyIds: [drug.drug],
      preview: {
        sideEffects: drug.sideEffects.slice(0, 20),
        clinicalTip: drug.clinicalTip,
      },
    });
  }

  return {
    schemaVersion: 1,
    source: "legacy-rrt-pharm-study-tools",
    pathwayId,
    published: false,
    generatedAt: new Date().toISOString(),
    activities,
    groupings: uniqueGroupings(activities),
  };
}
