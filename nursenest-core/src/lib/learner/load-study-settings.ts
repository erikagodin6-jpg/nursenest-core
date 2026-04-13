import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import {
  DEFAULT_STUDY_SETTINGS,
  rowToStudySettings,
  studySettingsUserSelect,
  type StudySettings,
} from "@/lib/learner/study-settings";

export async function loadStudySettings(userId: string): Promise<StudySettings> {
  if (!userId || !isDatabaseUrlConfigured()) {
    return DEFAULT_STUDY_SETTINGS;
  }

  try {
    const row = await prisma.user.findUnique({
      where: { id: userId },
      select: studySettingsUserSelect,
    });
    return rowToStudySettings(row);
  } catch {
    return DEFAULT_STUDY_SETTINGS;
  }
}
