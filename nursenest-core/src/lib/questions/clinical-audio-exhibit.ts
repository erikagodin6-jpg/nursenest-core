/**
 * Clinical audio exhibit — extends the ExamQuestion `exhibitData` JSON field with
 * a `clinicalAudio` envelope so auscultation sounds appear inline in practice
 * question stems and CAT sessions.
 *
 * This follows the same pattern as `ecg-video-question.ts`:
 * - DB stores `exhibitData: { clinicalAudio: { soundId, soundKind, displayName, placement } }`
 * - `parseClinicalAudioExhibit(exhibitData)` decodes it at render time
 * - `PracticeTestQuestionMediaBlock` renders `ClinicalAudioBlock` from the parsed value
 *
 * No schema migration required — `exhibitData` is already a free-form JSON column.
 *
 * AUTHORING EXAMPLE (set exhibitData on an ExamQuestion row):
 * ```json
 * {
 *   "clinicalAudio": {
 *     "soundId": "wheezes",
 *     "soundKind": "respiratory",
 *     "displayName": "Wheeze heard on auscultation",
 *     "placement": "stem",
 *     "showSignificance": true,
 *     "showAuscultationSite": false
 *   }
 * }
 * ```
 */

export const CLINICAL_AUDIO_EXHIBIT_KIND = "clinical_audio" as const;

export type ClinicalAudioExhibitKind = typeof CLINICAL_AUDIO_EXHIBIT_KIND;

export type ClinicalAudioPlacement = "stem" | "post_stem" | "rationale";

export type ClinicalAudioExhibit = {
  kind: ClinicalAudioExhibitKind;
  soundId: string;
  soundKind: "cardiac" | "respiratory";
  displayName?: string;
  placement: ClinicalAudioPlacement;
  showSignificance: boolean;
  showAuscultationSite: boolean;
  /** Optional second sound (e.g. show wheezes + rhonchi together). */
  secondary?: {
    soundId: string;
    soundKind: "cardiac" | "respiratory";
    displayName?: string;
  };
};

function asRecord(val: unknown): Record<string, unknown> | null {
  if (val && typeof val === "object" && !Array.isArray(val)) {
    return val as Record<string, unknown>;
  }
  return null;
}

function str(val: unknown): string | null {
  return typeof val === "string" && val.trim() ? val.trim() : null;
}

function bool(val: unknown, def: boolean): boolean {
  if (typeof val === "boolean") return val;
  return def;
}

/**
 * Parses `exhibitData.clinicalAudio` from an ExamQuestion JSON field.
 * Returns null when no valid clinical audio envelope is present.
 */
export function parseClinicalAudioExhibit(exhibitData: unknown): ClinicalAudioExhibit | null {
  const root = asRecord(exhibitData);
  if (!root) return null;

  const candidate = asRecord(root.clinicalAudio);
  if (!candidate) return null;

  const soundId = str(candidate.soundId);
  const soundKindRaw = str(candidate.soundKind);
  if (!soundId || (soundKindRaw !== "cardiac" && soundKindRaw !== "respiratory")) return null;

  const placementRaw = str(candidate.placement);
  const placement: ClinicalAudioPlacement =
    placementRaw === "post_stem"
      ? "post_stem"
      : placementRaw === "rationale"
        ? "rationale"
        : "stem";

  const secondaryRecord = asRecord(candidate.secondary);
  const secondarySoundId = secondaryRecord ? str(secondaryRecord.soundId) : null;
  const secondaryKindRaw = secondaryRecord ? str(secondaryRecord.soundKind) : null;

  return {
    kind: CLINICAL_AUDIO_EXHIBIT_KIND,
    soundId,
    soundKind: soundKindRaw,
    displayName: str(candidate.displayName) ?? undefined,
    placement,
    showSignificance: bool(candidate.showSignificance, true),
    showAuscultationSite: bool(candidate.showAuscultationSite, false),
    secondary:
      secondarySoundId && (secondaryKindRaw === "cardiac" || secondaryKindRaw === "respiratory")
        ? {
            soundId: secondarySoundId,
            soundKind: secondaryKindRaw,
            displayName: secondaryRecord ? (str(secondaryRecord.displayName) ?? undefined) : undefined,
          }
        : undefined,
  };
}

/**
 * Returns true when the question has a clinical audio exhibit in its exhibitData.
 * Useful for tagging / index queries that want to filter audio questions.
 */
export function hasClinicalAudioExhibit(exhibitData: unknown): boolean {
  return parseClinicalAudioExhibit(exhibitData) !== null;
}
