import { SocialStatKey, SocialVisibilityScope } from "@prisma/client";

export type SocialSnapshotInput = {
  readinessScore?: number | null;
  readinessBand?: string | null;
  weeklyStudyStreak?: number | null;
  practiceAccuracyPct?: number | null;
  flashcardProgressPct?: number | null;
  flashcardsStudiedCount?: number | null;
  weakTopicCodes?: string[] | null;
  catCompletedCount?: number | null;
};

export type SocialSnapshotCreateInput = {
  userId: string;
  audienceScope: SocialVisibilityScope;
  statKey: SocialStatKey;
  value: Record<string, unknown>;
  expiresAt: Date;
};

function rangeForPct(value: number | null | undefined): string | null {
  if (value == null || !Number.isFinite(value)) return null;
  const bounded = Math.max(0, Math.min(100, Math.round(value)));
  const low = Math.floor(bounded / 10) * 10;
  const high = Math.min(100, low + 9);
  return high >= 100 ? "90-100" : `${low}-${high}`;
}

function streakBand(days: number | null | undefined): string | null {
  if (days == null || !Number.isFinite(days)) return null;
  if (days >= 14) return "14+ days";
  if (days >= 7) return "7-13 days";
  if (days >= 3) return "3-6 days";
  if (days >= 1) return "1-2 days";
  return "Not yet this week";
}

function countBand(count: number | null | undefined): string | null {
  if (count == null || !Number.isFinite(count)) return null;
  if (count >= 5) return "5+";
  if (count >= 1) return String(Math.max(1, Math.round(count)));
  return "0";
}

export function buildSanitizedSocialSnapshots(
  userId: string,
  input: SocialSnapshotInput,
  now = new Date(),
): SocialSnapshotCreateInput[] {
  const expiresAt = new Date(now.getTime() + 6 * 60 * 60 * 1000);
  const shared = { userId, audienceScope: SocialVisibilityScope.FRIENDS_AND_GROUPS, expiresAt };
  const rows: SocialSnapshotCreateInput[] = [];

  if (input.readinessBand) {
    rows.push({
      ...shared,
      statKey: SocialStatKey.READINESS_BAND,
      value: { band: input.readinessBand },
    });
  }

  const readinessRange = rangeForPct(input.readinessScore);
  if (readinessRange) {
    rows.push({
      ...shared,
      statKey: SocialStatKey.READINESS_RANGE,
      value: { range: readinessRange },
    });
  }

  const weeklyStreak = streakBand(input.weeklyStudyStreak);
  if (weeklyStreak) {
    rows.push({
      ...shared,
      statKey: SocialStatKey.WEEKLY_STREAK,
      value: { band: weeklyStreak },
    });
  }

  const practiceRange = rangeForPct(input.practiceAccuracyPct);
  if (practiceRange) {
    rows.push({
      ...shared,
      statKey: SocialStatKey.PRACTICE_SCORE_RANGE,
      value: { range: practiceRange },
    });
  }

  const flashcardRange = rangeForPct(input.flashcardProgressPct);
  if (flashcardRange) {
    rows.push({
      ...shared,
      statKey: SocialStatKey.FLASHCARD_PROGRESS,
      value: { range: flashcardRange },
    });
  } else {
    const flashcardCount = countBand(input.flashcardsStudiedCount);
    if (flashcardCount) {
      rows.push({
        ...shared,
        statKey: SocialStatKey.FLASHCARD_PROGRESS,
        value: { count: flashcardCount },
      });
    }
  }

  const weakTopicCodes = Array.isArray(input.weakTopicCodes)
    ? [...new Set(input.weakTopicCodes.map((v) => v.trim()).filter(Boolean))].slice(0, 8)
    : [];
  if (weakTopicCodes.length > 0) {
    rows.push({
      ...shared,
      statKey: SocialStatKey.WEAK_AREA_OVERLAP,
      value: { topicCodes: weakTopicCodes, count: weakTopicCodes.length },
    });
  }

  const catCount = countBand(input.catCompletedCount);
  if (catCount) {
    rows.push({
      ...shared,
      statKey: SocialStatKey.CAT_COMPLETION,
      value: { completedBand: catCount },
    });
  }

  return rows;
}
