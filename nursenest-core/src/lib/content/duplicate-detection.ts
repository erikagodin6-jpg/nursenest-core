import { prisma } from "@/lib/db";

/**
 * Returns how many other rows share the same stem hash (usually 0 or 1).
 * Used before publish to block duplicate stems from entering production.
 */
export async function countStemHashDuplicates(stemHash: string, excludeId?: string): Promise<number> {
  if (!stemHash) return 0;
  return prisma.examQuestion.count({
    where: {
      stemHash,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });
}
