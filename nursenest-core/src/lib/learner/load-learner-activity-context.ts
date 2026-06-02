import "server-only";

import type { CountryCode, TierCode } from "@prisma/client";
import { cache } from "react";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { loadLearnerRequestUser } from "@/lib/learner/load-learner-request-user";
import {
  parseMeasurementPreference,
  type MeasurementPreference,
} from "@/lib/measurements/measurement-preference";

export type LearnerActivityContext = {
  userId: string;
  learnerPath: string | null;
  country: CountryCode | null;
  tier: TierCode | null;
  alliedProfessionKey: string | null;
  measurementPreference: MeasurementPreference | null;
};

const LEARNER_ACTIVITY_CONTEXT_TTL_MS = 60_000;
const LEARNER_ACTIVITY_CONTEXT_MAX = 512;
const learnerActivityContextCache = new Map<
  string,
  { expiresAt: number; value: LearnerActivityContext }
>();

function emptyLearnerActivityContext(userId: string): LearnerActivityContext {
  return {
    userId,
    learnerPath: null,
    country: null,
    tier: null,
    alliedProfessionKey: null,
    measurementPreference: null,
  };
}

function pruneLearnerActivityContextCache(now: number) {
  if (learnerActivityContextCache.size <= LEARNER_ACTIVITY_CONTEXT_MAX) return;
  for (const [key, entry] of learnerActivityContextCache) {
    if (entry.expiresAt <= now) learnerActivityContextCache.delete(key);
  }
  if (learnerActivityContextCache.size <= LEARNER_ACTIVITY_CONTEXT_MAX) return;
  const overflow =
    learnerActivityContextCache.size - LEARNER_ACTIVITY_CONTEXT_MAX;
  let removed = 0;
  for (const key of learnerActivityContextCache.keys()) {
    learnerActivityContextCache.delete(key);
    removed++;
    if (removed >= overflow) break;
  }
}

async function loadLearnerActivityContextCore(
  userId: string,
): Promise<LearnerActivityContext> {
  if (!userId || !isDatabaseUrlConfigured()) {
    return emptyLearnerActivityContext(userId);
  }

  const now = Date.now();
  pruneLearnerActivityContextCache(now);
  const cached = learnerActivityContextCache.get(userId);
  if (cached && cached.expiresAt > now) return cached.value;

  const user = await loadLearnerRequestUser(userId);

  const value: LearnerActivityContext = user
    ? {
        userId,
        alliedProfessionKey: user.alliedProfessionKey?.trim() || null,
        country: user.country ?? null,
        learnerPath: user.learnerPath?.trim() || null,
        measurementPreference: parseMeasurementPreference(
          user.measurementPreference,
        ),
        tier: user.tier ?? null,
      }
    : emptyLearnerActivityContext(userId);

  learnerActivityContextCache.set(userId, {
    expiresAt: now + LEARNER_ACTIVITY_CONTEXT_TTL_MS,
    value,
  });
  return value;
}

export const loadLearnerActivityContext = cache(loadLearnerActivityContextCore);
