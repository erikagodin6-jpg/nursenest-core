import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { invalidateLearnerPrivateReadCache } from "@/lib/cache/learner-private-read-cache.server";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resetUserLearningProgress } from "@/lib/learner/reset-user-learning-progress";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const resetProgressRouteDeps = {
  auth,
  prisma,
  isDatabaseUrlConfigured,
  resetUserLearningProgress,
  invalidateLearnerPrivateReadCache,
  safeServerLog,
  revalidatePath,
};
