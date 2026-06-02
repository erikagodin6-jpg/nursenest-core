/**
 * Medical laboratory technology (MLT/MLS) exam question pool — allied hub inventory + profession scope.
 * Framework-agnostic (no `server-only`) so CLI audit scripts can import safely.
 */
import type { Prisma } from "@prisma/client";
import { prismaWhereForAlliedProfessionExamQuestions } from "@/lib/allied/allied-exam-question-scope";
import { US_ALLIED_CORE_PATHWAY_ID } from "@/lib/allied/allied-hub-program-model";
import { usAlliedMarketingHubInventoryWhere } from "@/lib/allied/allied-respiratory-pool-scope";

/**
 * MLT scoped pool: tier + exam keys + study-bank gates + legacy career/tag map for `mlt`.
 * Returns null only if pathway or profession scope cannot be built (registry misconfiguration).
 */
export function medicalLaboratoryTechnologyExamQuestionPoolWhere(): Prisma.ExamQuestionWhereInput | null {
  const hub = usAlliedMarketingHubInventoryWhere();
  if (!hub) return null;
  const prof = prismaWhereForAlliedProfessionExamQuestions(US_ALLIED_CORE_PATHWAY_ID, "mlt");
  if (!prof) return null;
  return { AND: [hub, prof] };
}
