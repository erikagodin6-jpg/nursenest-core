/**
 * CNPLE Item Type Registry — future-safe registry of question item types.
 *
 * Current active types are "single-best-answer" and "sata". Additional types
 * exist in the registry but are disabled (`ready: false`) until CCRNR confirms
 * their inclusion and NurseNest builds the required renderer.
 *
 * Simulation shell and practice session runners MUST consume this registry
 * instead of hardcoded item type checks, so enabling a new type only requires
 * setting `ready: true` and building the renderer.
 *
 * Governance:
 * - Only set `ready: true` after both CCRNR confirmation AND renderer implementation.
 * - Never present a `ready: false` type to candidates as "supported".
 * - `officiallyConfirmed` tracks CCRNR acknowledgement separately from readiness.
 */

// ── Type definitions ──────────────────────────────────────────────────────────

export type CnpleItemType =
  | "single-best-answer"
  | "sata"
  | "case-evolution"
  | "prescribing-sequence"
  | "lab-interpretation";

export type CnpleItemTypeRecord = {
  type: CnpleItemType;
  /** Human-readable label for UI display. */
  label: string;
  /** Tooltip / help text describing what this item type looks like. */
  description: string;
  /**
   * True when NurseNest has a renderer AND CCRNR has confirmed this type exists.
   * Guards all item-type dispatch in the simulation shell.
   */
  ready: boolean;
  /**
   * True when CCRNR has officially confirmed this type appears on the CNPLE.
   * May be true before `ready` if CCRNR confirms before NurseNest builds the renderer.
   */
  officiallyConfirmed: boolean;
  /**
   * Roadmap note — describes what is needed to enable this type.
   * Not surfaced to candidates.
   */
  roadmapNote?: string;
};

// ── Registry ──────────────────────────────────────────────────────────────────

export const CNPLE_ITEM_TYPE_REGISTRY: readonly CnpleItemTypeRecord[] = [
  {
    type: "single-best-answer",
    label: "Single Best Answer",
    description:
      "A clinical scenario or knowledge question with one correct answer from four or five options.",
    ready: true,
    officiallyConfirmed: false,
    roadmapNote: "Active. Standard MCQ format used in NurseNest practice and simulation.",
  },
  {
    type: "sata",
    label: "Select All That Apply",
    description:
      "A question with multiple correct answers. All correct options must be selected; partial credit is not applied.",
    ready: true,
    officiallyConfirmed: false,
    roadmapNote: "Active. SATA renderer supports 3–8 options.",
  },
  {
    type: "case-evolution",
    label: "Evolving Case",
    description:
      "A multi-item case cluster where patient data updates between items. Each item builds on the previous clinical picture.",
    ready: false,
    officiallyConfirmed: false,
    roadmapNote:
      "Disabled. Requires multi-item cluster session orchestration. Enable once CCRNR confirms format and renderer is built.",
  },
  {
    type: "prescribing-sequence",
    label: "Prescribing Sequence",
    description:
      "An ordered decision task where the NP must select and sequence prescribing actions (e.g., first-line, titration, monitoring).",
    ready: false,
    officiallyConfirmed: false,
    roadmapNote:
      "Disabled. No official CCRNR confirmation. Requires drag-to-order renderer.",
  },
  {
    type: "lab-interpretation",
    label: "Lab Interpretation",
    description:
      "A question presenting a lab panel or trend table requiring the NP to interpret results and select the next clinical action.",
    ready: false,
    officiallyConfirmed: false,
    roadmapNote:
      "Disabled. Planned enhancement. Uses existing LabTrendTable UI component but requires item-type dispatch integration.",
  },
] as const;

// ── Lookup helpers ────────────────────────────────────────────────────────────

/** Map keyed by item type for O(1) lookup. */
const REGISTRY_MAP = new Map<CnpleItemType, CnpleItemTypeRecord>(
  CNPLE_ITEM_TYPE_REGISTRY.map((r) => [r.type, r]),
);

/**
 * Returns the registry record for a given item type, or undefined if unknown.
 */
export function getCnpleItemTypeRecord(type: string): CnpleItemTypeRecord | undefined {
  return REGISTRY_MAP.get(type as CnpleItemType);
}

/**
 * Returns true if an item type is both registered AND ready for use in simulations.
 * Use this in the simulation shell before dispatching to a renderer.
 */
export function isCnpleItemTypeReady(type: string): boolean {
  return getCnpleItemTypeRecord(type)?.ready === true;
}

/**
 * Returns all currently ready item types. Used to build the simulation shell's
 * dispatch table and the "supported item types" list in marketing copy.
 */
export function getReadyCnpleItemTypes(): readonly CnpleItemTypeRecord[] {
  return CNPLE_ITEM_TYPE_REGISTRY.filter((r) => r.ready);
}

/**
 * Returns only the type strings for ready item types (convenience for
 * conditional rendering without the full record).
 */
export function getReadyCnpleItemTypeKeys(): CnpleItemType[] {
  return getReadyCnpleItemTypes().map((r) => r.type);
}

/**
 * Validates a raw item type string from question data.
 * Returns the typed key if valid + ready, or null for unknown/unready types.
 * The simulation shell should fall back to SBA rendering for null returns.
 */
export function resolveCnpleItemType(raw: unknown): CnpleItemType | null {
  if (typeof raw !== "string") return null;
  const record = getCnpleItemTypeRecord(raw);
  if (!record || !record.ready) return null;
  return record.type;
}
