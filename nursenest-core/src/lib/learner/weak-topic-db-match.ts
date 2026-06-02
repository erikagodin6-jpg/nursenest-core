import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";

/**
 * Resolves DB `ExamQuestion.topic` values that normalize to the given canonical keys
 * (case and slash formatting may differ in content).
 */
export async function examQuestionDbTopicsMatchingCanonicals(
  base: Prisma.ExamQuestionWhereInput,
  canonicalKeys: string[],
): Promise<string[]> {
  if (canonicalKeys.length === 0) return [];
  const want = new Set(canonicalKeys);
  const rows = await prisma.examQuestion.findMany({
    where: { AND: [base, { topic: { not: null } }] },
    select: { topic: true },
    distinct: ["topic"],
  });
  const out: string[] = [];
  for (const r of rows) {
    const t = r.topic;
    if (!t) continue;
    if (want.has(normalizeTopicKey(t))) out.push(t);
  }
  return out;
}
