/**
 * ECG Rhythm Tag Registry — typed single source of truth.
 *
 * This registry is the contract between:
 *   1. The DB question `rhythmTag` field (must use a value from this registry)
 *   2. The curriculum content lookup (getEcgCurriculumUnitByRhythmTag)
 *   3. The question seeding scripts (validate before upsert)
 *   4. The remediation engine (ensure every seeded tag has a learning path)
 *
 * Adding a new rhythmTag requires:
 *   a) Appending a new entry to ECG_RHYTHM_TAG_REGISTRY below
 *   b) Adding a corresponding EcgCurriculumUnit in ecg-curriculum-content.ts
 *      (or documenting why the tag is intentionally without curriculum coverage)
 *   c) Running `npm run test:ecg-video-quiz` — contract tests enforce coverage
 *
 * Coverage tiers:
 *   "full"    — curriculum unit exists with mechanism, nursing priorities, NCLEX traps
 *   "partial" — unit exists but is missing some required fields (tech debt)
 *   "fallback"— no curriculum unit; learner sees a graceful fallback state + telemetry
 *   "excluded"— intentionally not in curriculum (e.g. artifact is taught within ICU unit)
 */

export type EcgRhythmTagCoverage = "full" | "partial" | "fallback" | "excluded";

export type EcgRhythmTagEntry = {
  /** The exact string value used in the DB `rhythmTag` field. Case-sensitive. */
  tag: string;
  /** Canonical curriculum unit ID in ecg-curriculum-content.ts, if any. */
  curriculumUnitId?: string;
  /** Coverage level — determines learner-facing behavior when unit is absent. */
  coverage: EcgRhythmTagCoverage;
  /** Where this tag appears in the learning progression. */
  level: 1 | 2 | 3;
  /**
   * For "fallback" and "excluded" tags: the unit ID to route learners to
   * instead of the missing dedicated unit.
   */
  fallbackUnitId?: string;
  /** Human-readable reason for fallback/excluded status (appears in governance reports). */
  coverageNote?: string;
};

export const ECG_RHYTHM_TAG_REGISTRY: readonly EcgRhythmTagEntry[] = [
  // ─── Level 1: Foundational ────────────────────────────────────────────────
  {
    tag: "Normal sinus rhythm",
    curriculumUnitId: "normal-sinus-rhythm",
    coverage: "full",
    level: 1,
  },

  // ─── Level 2: Core rhythms ────────────────────────────────────────────────
  {
    tag: "Sinus tachycardia",
    curriculumUnitId: "sinus-tachycardia",
    coverage: "full",
    level: 2,
  },
  {
    tag: "Sinus bradycardia",
    curriculumUnitId: "sinus-bradycardia",
    coverage: "full",
    level: 2,
  },
  {
    tag: "Atrial fibrillation",
    curriculumUnitId: "atrial-fibrillation",
    coverage: "full",
    level: 2,
  },
  {
    tag: "Atrial flutter",
    curriculumUnitId: "atrial-flutter",
    coverage: "full",
    level: 2,
  },
  {
    tag: "SVT",
    curriculumUnitId: "svt",
    coverage: "full",
    level: 2,
  },
  {
    tag: "Heart block (1st degree)",
    curriculumUnitId: "av-block-first-degree",
    coverage: "full",
    level: 2,
  },
  {
    tag: "Heart block (2nd degree)",
    curriculumUnitId: "av-block-second-mobitz1",
    coverage: "full",
    level: 2,
  },
  {
    tag: "Heart block (3rd degree)",
    curriculumUnitId: "av-block-third-degree",
    coverage: "full",
    level: 2,
  },
  {
    tag: "PVC",
    curriculumUnitId: "pvcs-pacs",
    coverage: "full",
    level: 2,
  },
  {
    // PAC shares a curriculum unit with PVC — the unit covers both.
    tag: "PAC",
    curriculumUnitId: "pvcs-pacs",
    coverage: "full",
    level: 2,
    coverageNote: "PACs and PVCs are co-taught in the pvcs-pacs curriculum unit.",
  },
  {
    tag: "Ventricular tachycardia",
    curriculumUnitId: "ventricular-tachycardia",
    coverage: "full",
    level: 2,
  },
  {
    tag: "Ventricular fibrillation",
    curriculumUnitId: "ventricular-fibrillation",
    coverage: "full",
    level: 2,
  },
  {
    tag: "Asystole",
    curriculumUnitId: undefined,
    coverage: "fallback",
    level: 2,
    fallbackUnitId: "ventricular-fibrillation",
    coverageNote:
      "No dedicated Asystole unit yet. Learners see a fallback banner directing them to the VF/ACLS unit. Pending curriculum authoring.",
  },
  {
    tag: "Pulseless electrical activity",
    curriculumUnitId: undefined,
    coverage: "fallback",
    level: 2,
    fallbackUnitId: "ventricular-fibrillation",
    coverageNote:
      "PEA has no dedicated unit. Learners are directed to the VF unit which covers ACLS arrest management.",
  },

  // ─── Level 3: Advanced ────────────────────────────────────────────────────
  {
    tag: "STEMI changes",
    curriculumUnitId: "stemi-localization",
    coverage: "full",
    level: 3,
  },
  {
    tag: "Hyperkalemia ECG changes",
    curriculumUnitId: "hyperkalemia-ecg",
    coverage: "full",
    level: 3,
  },
  {
    tag: "Hypokalemia ECG changes",
    curriculumUnitId: undefined,
    coverage: "fallback",
    level: 3,
    fallbackUnitId: "hyperkalemia-ecg",
    coverageNote:
      "Hypokalemia ECG unit pending. Learners are directed to the hyperkalemia unit (covers both electrolyte patterns comparatively).",
  },
  {
    tag: "Torsades de Pointes",
    curriculumUnitId: "torsades-de-pointes",
    coverage: "full",
    level: 3,
  },
  {
    tag: "Paced rhythm",
    curriculumUnitId: "paced-rhythms",
    coverage: "full",
    level: 3,
  },
  {
    tag: "Bundle branch block",
    curriculumUnitId: undefined,
    coverage: "fallback",
    level: 3,
    fallbackUnitId: "seven-step-method",
    coverageNote:
      "RBBB/LBBB have no dedicated Level 3 unit in ecg-curriculum-content.ts (though covered in ecg-curriculum-config.ts). Pending authoring of a detailed BBB content unit.",
  },
  {
    // Artifact is a telemetry/monitoring pitfall, not a standalone rhythm.
    // It is taught within the ICU telemetry topic and the 7-step method unit.
    tag: "Artifact recognition",
    curriculumUnitId: undefined,
    coverage: "excluded",
    level: 3,
    fallbackUnitId: "seven-step-method",
    coverageNote:
      "Artifact is intentionally excluded from standalone curriculum units — it is taught within the 7-step method and ICU telemetry units as a differential.",
  },
] as const;

/** The set of all valid rhythm tag strings for runtime validation. */
export const VALID_ECG_RHYTHM_TAGS: ReadonlySet<string> = new Set(
  ECG_RHYTHM_TAG_REGISTRY.map((e) => e.tag),
);

/** Look up a registry entry by the exact rhythmTag string. */
export function getEcgRhythmTagEntry(tag: string): EcgRhythmTagEntry | undefined {
  return ECG_RHYTHM_TAG_REGISTRY.find((e) => e.tag === tag);
}

/**
 * Resolve the best curriculum unit ID for a given rhythmTag.
 * Returns the direct unit ID if coverage is "full" or "partial".
 * Returns the fallback unit ID if coverage is "fallback" or "excluded".
 * Returns undefined if the tag is not in the registry (unknown tag).
 */
export function resolveEcgCurriculumUnitIdForTag(tag: string): string | undefined {
  const entry = getEcgRhythmTagEntry(tag);
  if (!entry) return undefined;
  return entry.curriculumUnitId ?? entry.fallbackUnitId;
}

/** True when the tag is in the registry (even if coverage is fallback/excluded). */
export function isKnownEcgRhythmTag(tag: string): boolean {
  return VALID_ECG_RHYTHM_TAGS.has(tag);
}

/** Tags that have no dedicated curriculum unit and need fallback treatment. */
export const ECG_FALLBACK_COVERAGE_TAGS: ReadonlySet<string> = new Set(
  ECG_RHYTHM_TAG_REGISTRY.filter((e) => e.coverage === "fallback" || e.coverage === "excluded").map(
    (e) => e.tag,
  ),
);
