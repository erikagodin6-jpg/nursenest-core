import type { Prisma } from "@prisma/client";

/** Shared non-ECG bank filter for CAT, practice, snapshots, and flashcard generation. */
export const NON_ECG_PRACTICE_EXAM_WHERE: Prisma.ExamQuestionWhereInput = {
  NOT: [{ questionFormat: "ecg_video" }, { tags: { has: "ecg-video" } }],
};
