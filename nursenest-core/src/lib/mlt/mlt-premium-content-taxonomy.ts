/**
 * MLT premium module — Prisma fragments for pool slicing (mirrors `rt-ventilator-content-taxonomy`).
 */

import type { Prisma } from "@prisma/client";
import { MLT_PREMIUM_MODULE_BANK_TAGS } from "@/lib/mlt/mlt-premium-modules-registry";

/**
 * Exclude questions tagged for any premium MLT specialty module from **general** allied / MLT hub pools.
 */
export function prismaWhereExcludeMltPremiumModuleTags(): Prisma.ExamQuestionWhereInput {
  const tags = [...MLT_PREMIUM_MODULE_BANK_TAGS];
  if (tags.length === 0) {
    return {};
  }
  return {
    NOT: {
      OR: tags.map((tag) => ({ tags: { has: tag } })),
    },
  };
}

export function examQuestionWhereMltPremiumBankTag(tag: string): Prisma.ExamQuestionWhereInput {
  return { tags: { has: tag } };
}
