import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import {
  mergeFeatureUsageSnapshot,
  usageMetric,
  type FeatureDiscoveryKey,
  type FeatureUsageSnapshot,
} from "@/lib/discovery/feature-value-communication";

const FEATURE_VALUE_ACTIVITY_TIMEOUT_MS = 1200;

const ACTIVITY_TO_FEATURE: Record<string, FeatureDiscoveryKey> = {
  questions: "questions",
  question: "questions",
  practice: "questions",
  "practice-questions": "questions",
  flashcards: "flashcards",
  flashcard: "flashcards",
  lessons: "lessons",
  lesson: "lessons",
  "clinical-skills": "clinical_skills",
  clinical_skills: "clinical_skills",
  clinical_skill: "clinical_skills",
  pharmacology: "pharmacology",
  ecg: "ecg_core",
  "ecg-core": "ecg_core",
  advanced_ecg: "advanced_ecg",
  "advanced-ecg": "advanced_ecg",
  cat: "cat",
  loft: "loft",
  simulation: "loft",
  "study-plan": "study_plans",
  study_plan: "study_plans",
  "smart-review": "readiness",
  readiness: "readiness",
  analytics: "analytics",
  progress: "progress_reports",
};

export async function loadFeatureValueActivitySnapshot(userId: string): Promise<FeatureUsageSnapshot> {
  if (!userId || !isDatabaseUrlConfigured()) return {};

  const rows = await withDatabaseFallbackTimeout(
    () =>
      prisma.learnerActivityEvent.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 250,
        select: {
          activityType: true,
          lifecycle: true,
          itemsCompleted: true,
          createdAt: true,
        },
      }),
    [],
    FEATURE_VALUE_ACTIVITY_TIMEOUT_MS,
    { scope: "feature_value_discovery", label: "learner_activity_events" },
  );

  const snapshots: FeatureUsageSnapshot[] = [];
  for (const row of rows) {
    const featureKey = ACTIVITY_TO_FEATURE[row.activityType.trim().toLowerCase()];
    if (!featureKey) continue;
    const lifecycle = row.lifecycle.trim().toLowerCase();
    snapshots.push({
      [featureKey]: usageMetric({
        launches: lifecycle === "started" || lifecycle === "resumed" ? 1 : 0,
        completions: lifecycle === "completed" ? 1 : 0,
        itemsCompleted: row.itemsCompleted ?? (lifecycle === "completed" ? 1 : 0),
        lastUsedAt: row.createdAt.toISOString(),
      }),
    });
  }

  return mergeFeatureUsageSnapshot(...snapshots);
}
