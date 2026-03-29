import { FREEMIUM_LESSON_BUDGET, FREEMIUM_QUESTION_BUDGET } from "@/lib/conversion/constants";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export type FreemiumSnapshot = {
  questionRemaining: number;
  lessonRemaining: number;
};

export async function getFreemiumSnapshot(userId: string): Promise<FreemiumSnapshot | null> {
  if (!isDatabaseUrlConfigured()) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { freeQuestionViews: true, freeLessonOpens: true },
  });
  if (!user) return null;
  return {
    questionRemaining: Math.max(0, FREEMIUM_QUESTION_BUDGET - user.freeQuestionViews),
    lessonRemaining: Math.max(0, FREEMIUM_LESSON_BUDGET - user.freeLessonOpens),
  };
}
