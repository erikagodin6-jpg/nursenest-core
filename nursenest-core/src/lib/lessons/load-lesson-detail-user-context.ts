import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import {
  studySettingsUserSelect,
  rowToStudySettings,
  DEFAULT_STUDY_SETTINGS,
  type StudySettings,
} from "@/lib/learner/study-settings";
import {
  parseMeasurementPreference,
  type MeasurementPreference,
} from "@/lib/measurements/measurement-preference";

export type LessonDetailUserContext = {
  learnerPath: string | null;
  measurementPreference: MeasurementPreference | null;
  studySettings: StudySettings;
};

const DEFAULT_CONTEXT: LessonDetailUserContext = {
  learnerPath: null,
  measurementPreference: null,
  studySettings: DEFAULT_STUDY_SETTINGS,
};

/**
 * Single DB round-trip for all user context needed by the lesson detail page.
 * Replaces three separate prisma.user.findUnique calls (learnerPath, measurementPreference,
 * studySettings) that previously ran sequentially across three render phases.
 * React cache() deduplicates within the same request.
 */
export const loadLessonDetailUserContext = cache(
  async (userId: string): Promise<LessonDetailUserContext> => {
    if (!userId || !isDatabaseUrlConfigured()) return DEFAULT_CONTEXT;
    try {
      const row = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          learnerPath: true,
          measurementPreference: true,
          ...studySettingsUserSelect,
        },
      });
      if (!row) return DEFAULT_CONTEXT;
      return {
        learnerPath: row.learnerPath ?? null,
        measurementPreference: parseMeasurementPreference(
          row.measurementPreference ?? null,
        ),
        studySettings: rowToStudySettings(row),
      };
    } catch {
      return DEFAULT_CONTEXT;
    }
  },
);
