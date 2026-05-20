export const ALLOWED_STUDY_SESSION_LENGTHS = [10, 15, 20, 25, 30] as const;

export type StudySessionLength = (typeof ALLOWED_STUDY_SESSION_LENGTHS)[number];

export type StudySettings = {
  enableAdaptivePlan: boolean;
  enableSpacedRepetition: boolean;
  enableConfidenceTracking: boolean;
  enablePrePostQuizzes: boolean;
  /** Guided lesson study loop: optional bank-backed pre/post quick check + review on lesson pages. */
  lessonStudyLoopEnabled: boolean;
  showHeatmap: boolean;
  showAdvancedInsights: boolean;
  enableWeaknessAlerts: boolean;
  enableDecayAlerts: boolean;
  preferredSessionLength: StudySessionLength;
};

export type PartialStudySettings = Partial<StudySettings> | null | undefined;

export const DEFAULT_STUDY_SETTINGS: StudySettings = {
  enableAdaptivePlan: true,
  enableSpacedRepetition: true,
  enableConfidenceTracking: true,
  enablePrePostQuizzes: true,
  lessonStudyLoopEnabled: true,
  showHeatmap: true,
  showAdvancedInsights: true,
  enableWeaknessAlerts: true,
  enableDecayAlerts: true,
  preferredSessionLength: 20,
};

function normalizeSessionLength(value: unknown): StudySessionLength {
  const n = Number(value);
  const allowed = ALLOWED_STUDY_SESSION_LENGTHS as readonly number[];
  if (allowed.includes(n)) {
    return n as StudySessionLength;
  }
  return DEFAULT_STUDY_SETTINGS.preferredSessionLength;
}

export function normalizeStudySettings(input?: PartialStudySettings): StudySettings {
  const source = input ?? {};
  return {
    enableAdaptivePlan: source.enableAdaptivePlan !== false,
    enableSpacedRepetition: source.enableSpacedRepetition !== false,
    enableConfidenceTracking: source.enableConfidenceTracking !== false,
    enablePrePostQuizzes: source.enablePrePostQuizzes !== false,
    lessonStudyLoopEnabled: source.lessonStudyLoopEnabled !== false,
    showHeatmap: source.showHeatmap !== false,
    showAdvancedInsights: source.showAdvancedInsights !== false,
    enableWeaknessAlerts: source.enableWeaknessAlerts !== false,
    enableDecayAlerts: source.enableDecayAlerts !== false,
    preferredSessionLength: normalizeSessionLength(source.preferredSessionLength),
  };
}

export type StudySettingsPersistenceRow = {
  enableAdaptivePlan: boolean | null;
  enableSpacedRepetition: boolean | null;
  enableConfidenceTracking: boolean | null;
  enablePrePostQuizzes: boolean | null;
  lessonStudyLoopEnabled: boolean | null;
  showHeatmap: boolean | null;
  showAdvancedInsights: boolean | null;
  enableWeaknessAlerts: boolean | null;
  enableDecayAlerts: boolean | null;
  preferredSessionLength: number | null;
};

export const studySettingsUserSelect = {
  enableAdaptivePlan: true,
  enableSpacedRepetition: true,
  enableConfidenceTracking: true,
  enablePrePostQuizzes: true,
  lessonStudyLoopEnabled: true,
  showHeatmap: true,
  showAdvancedInsights: true,
  enableWeaknessAlerts: true,
  enableDecayAlerts: true,
  preferredSessionLength: true,
} as const;

/** Maps DB nulls to undefined so `normalizeStudySettings` accepts Prisma rows. */
function persistenceRowToPartial(row: StudySettingsPersistenceRow): Partial<StudySettings> {
  return {
    enableAdaptivePlan: row.enableAdaptivePlan ?? undefined,
    enableSpacedRepetition: row.enableSpacedRepetition ?? undefined,
    enableConfidenceTracking: row.enableConfidenceTracking ?? undefined,
    enablePrePostQuizzes: row.enablePrePostQuizzes ?? undefined,
    lessonStudyLoopEnabled: row.lessonStudyLoopEnabled ?? undefined,
    showHeatmap: row.showHeatmap ?? undefined,
    showAdvancedInsights: row.showAdvancedInsights ?? undefined,
    enableWeaknessAlerts: row.enableWeaknessAlerts ?? undefined,
    enableDecayAlerts: row.enableDecayAlerts ?? undefined,
    preferredSessionLength:
      row.preferredSessionLength != null
        ? (normalizeSessionLength(row.preferredSessionLength) as StudySessionLength)
        : undefined,
  };
}

export function rowToStudySettings(row: StudySettingsPersistenceRow | null | undefined): StudySettings {
  return normalizeStudySettings(row ? persistenceRowToPartial(row) : undefined);
}

export function studySettingsToPersistenceInput(
  settings: PartialStudySettings,
): StudySettingsPersistenceRow {
  const normalized = normalizeStudySettings(settings);
  return {
    enableAdaptivePlan:
      normalized.enableAdaptivePlan === DEFAULT_STUDY_SETTINGS.enableAdaptivePlan ? null : normalized.enableAdaptivePlan,
    enableSpacedRepetition:
      normalized.enableSpacedRepetition === DEFAULT_STUDY_SETTINGS.enableSpacedRepetition
        ? null
        : normalized.enableSpacedRepetition,
    enableConfidenceTracking:
      normalized.enableConfidenceTracking === DEFAULT_STUDY_SETTINGS.enableConfidenceTracking
        ? null
        : normalized.enableConfidenceTracking,
    enablePrePostQuizzes:
      normalized.enablePrePostQuizzes === DEFAULT_STUDY_SETTINGS.enablePrePostQuizzes
        ? null
        : normalized.enablePrePostQuizzes,
    lessonStudyLoopEnabled:
      normalized.lessonStudyLoopEnabled === DEFAULT_STUDY_SETTINGS.lessonStudyLoopEnabled
        ? null
        : normalized.lessonStudyLoopEnabled,
    showHeatmap: normalized.showHeatmap === DEFAULT_STUDY_SETTINGS.showHeatmap ? null : normalized.showHeatmap,
    showAdvancedInsights:
      normalized.showAdvancedInsights === DEFAULT_STUDY_SETTINGS.showAdvancedInsights
        ? null
        : normalized.showAdvancedInsights,
    enableWeaknessAlerts:
      normalized.enableWeaknessAlerts === DEFAULT_STUDY_SETTINGS.enableWeaknessAlerts
        ? null
        : normalized.enableWeaknessAlerts,
    enableDecayAlerts:
      normalized.enableDecayAlerts === DEFAULT_STUDY_SETTINGS.enableDecayAlerts
        ? null
        : normalized.enableDecayAlerts,
    preferredSessionLength:
      normalized.preferredSessionLength === DEFAULT_STUDY_SETTINGS.preferredSessionLength
        ? null
        : normalized.preferredSessionLength,
  };
}
