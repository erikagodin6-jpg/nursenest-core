import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { migrateCognitionEnvelopeFromStorage } from "@/lib/educational-cognition/cognition-snapshot-migrations";
import type { DurableLearnerCognitionEnvelope } from "@/lib/educational-cognition/cognition-snapshot-types";

function isPrismaMissingColumnError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /learner_cognition_envelope|Unknown field|column.*does not exist/i.test(msg);
}

/** Loads versioned cognition envelope from `User.learnerCognitionEnvelope`. */
export async function readLearnerCognitionEnvelopeFromDatabase(
  userId: string,
): Promise<DurableLearnerCognitionEnvelope | null> {
  if (!isDatabaseUrlConfigured()) return null;
  try {
    const row = await prisma.user.findUnique({
      where: { id: userId },
      select: { learnerCognitionEnvelope: true, learnerPath: true },
    });
    if (!row?.learnerCognitionEnvelope) return null;
    return migrateCognitionEnvelopeFromStorage(row.learnerCognitionEnvelope, row.learnerPath);
  } catch (err) {
    if (isPrismaMissingColumnError(err)) return null;
    throw err;
  }
}

/** Persists envelope JSON — returns false when column missing or DB unavailable. */
export async function writeLearnerCognitionEnvelopeToDatabase(
  userId: string,
  envelope: DurableLearnerCognitionEnvelope,
): Promise<boolean> {
  if (!isDatabaseUrlConfigured()) return false;
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { learnerCognitionEnvelope: envelope as object },
    });
    return true;
  } catch (err) {
    if (isPrismaMissingColumnError(err)) return false;
    throw err;
  }
}
