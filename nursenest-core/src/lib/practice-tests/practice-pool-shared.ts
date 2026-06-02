import type { Prisma } from "@prisma/client";

export function difficultyWhere(min: number | null, max: number | null): Prisma.ExamQuestionWhereInput | null {
  if (min == null && max == null) return null;
  const lo = min ?? 1;
  const hi = max ?? 5;
  return {
    OR: [{ difficulty: null }, { AND: [{ difficulty: { gte: lo } }, { difficulty: { lte: hi } }] }],
  };
}
