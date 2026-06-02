import { prisma } from "@/lib/db";

/** Normalized key for comparing canonical blog intent (topic / keyword cluster). */
export function normalizeBlogTopicKey(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Find an existing post that already targets the same normalized intent for this exam.
 * When `exam` is null/empty, matches intent across exams (conservative dedupe for manual creates).
 */
export async function findExistingBlogByCanonicalIntent(params: {
  exam: string | null | undefined;
  normalizedTopic: string;
}): Promise<{ id: string; slug: string } | null> {
  const key = params.normalizedTopic.trim();
  if (!key) return null;

  const exam = params.exam?.trim();
  if (exam && exam.length > 0) {
    return prisma.blogPost.findFirst({
      where: {
        exam,
        OR: [{ targetKeyword: key }, { keywordCluster: key }, { tags: { has: key } }],
      },
      select: { id: true, slug: true },
    });
  }
  return prisma.blogPost.findFirst({
    where: {
      OR: [{ targetKeyword: key }, { keywordCluster: key }, { tags: { has: key } }],
    },
    select: { id: true, slug: true },
  });
}
