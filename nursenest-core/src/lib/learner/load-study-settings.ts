import "server-only";

import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { loadLearnerRequestUser } from "@/lib/learner/load-learner-request-user";
import {
  DEFAULT_STUDY_SETTINGS,
  rowToStudySettings,
  type StudySettings,
} from "@/lib/learner/study-settings";

export async function loadStudySettings(userId: string): Promise<StudySettings> {
  if (!userId || !isDatabaseUrlConfigured()) {
    return DEFAULT_STUDY_SETTINGS;
  }

  try {
    const row = await loadLearnerRequestUser(userId);
    return rowToStudySettings(row);
  } catch {
    return DEFAULT_STUDY_SETTINGS;
  }
}
