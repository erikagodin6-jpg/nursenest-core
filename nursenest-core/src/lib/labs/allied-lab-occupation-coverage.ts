/**
 * Governance registry — **documentation + audit hooks** for occupation-scoped labs.
 *
 * Implementation: set `alliedExclusiveProfessionKeys` on entries in `labs-engine` `LESSONS`.
 * This module lists **expected** occupation-exclusive surfaces so PRs can grep for coverage gaps.
 *
 * @see {@link LabLessonDefinition.alliedExclusiveProfessionKeys} in `labs-engine.ts`
 */

export type AlliedLabOccupationCoverageExpectation = {
  /** Stable audit id */
  id: string;
  /** Human intent — map to `alliedExclusiveProfessionKeys` on concrete lab lessons when product confirms */
  intent: string;
  /** Canonical profession keys (registry) that should eventually own exclusive lab rows */
  professionKeysExclusive?: readonly string[];
  notes?: string;
};

/**
 * TODO / audit backlog — **not** runtime enforcement. Labs routes enforce `alliedExclusiveProfessionKeys` when set.
 */
export const ALLIED_LAB_OCCUPATION_COVERAGE_EXPECTATIONS: readonly AlliedLabOccupationCoverageExpectation[] = [
  {
    id: "rt-ventilator-waveform",
    intent: "RT-only ventilator / waveform interpretation labs",
    professionKeysExclusive: ["respiratory"],
    notes: "Tag lab lessons with alliedExclusiveProfessionKeys: ['respiratory'] when curriculum isolates these.",
  },
  {
    id: "rt-abg-advanced",
    intent: "Respiratory-primary ABG / advanced gas interpretation (when split from shared ABG core)",
    professionKeysExclusive: ["respiratory"],
    notes: "Optional split from shared `abgs` ladder — product decides vs shared Allied ABG core.",
  },
  {
    id: "mlt-hematology-lab-patterns",
    intent: "MLT-primary bench / hematology pattern labs",
    professionKeysExclusive: ["mlt"],
    notes: "When a lab is MLT-only, tag with ['mlt'].",
  },
  {
    id: "shared-allied-lab-core",
    intent: "Shared Allied core (electrolytes, renal, liver, etc.) — **no** alliedExclusiveProfessionKeys",
    notes: "Default: all Allied subscribers; do not tag unless product explicitly scopes.",
  },
];

/** For admin QA scripts — returns expectations missing explicit profession keys (incomplete spec rows only). */
export function alliedLabOccupationCoverageAuditNotes(): string[] {
  return ALLIED_LAB_OCCUPATION_COVERAGE_EXPECTATIONS.filter((e) => e.id !== "shared-allied-lab-core").map(
    (e) => `[${e.id}] ${e.intent}${e.notes ? ` — ${e.notes}` : ""}`,
  );
}
