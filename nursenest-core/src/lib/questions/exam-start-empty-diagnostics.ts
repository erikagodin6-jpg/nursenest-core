import { DB_PUBLISHED, questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";

export type ExamStartEmptyDiagnostics = {
  code: "bank_empty_global" | "entitlement_excludes_all_published" | "indeterminate";
  message: string;
  counts: { publishedGlobal: number; entitlementPublished: number };
};

export async function diagnoseExamStartEmpty(entitlement: AccessScope): Promise<ExamStartEmptyDiagnostics> {
  const [publishedGlobal, entitlementPublished] = await Promise.all([
    prisma.examQuestion.count({ where: { status: DB_PUBLISHED } }),
    prisma.examQuestion.count({ where: questionAccessWhere(entitlement) }),
  ]);

  if (publishedGlobal === 0) {
    return {
      code: "bank_empty_global",
      message: "No published questions in the database — exam pool cannot start.",
      counts: { publishedGlobal, entitlementPublished },
    };
  }
  if (entitlementPublished === 0) {
    return {
      code: "entitlement_excludes_all_published",
      message:
        "Published questions exist, but none match this subscriber tier/region gates — check profile and row tier/region_scope.",
      counts: { publishedGlobal, entitlementPublished },
    };
  }
  return {
    code: "indeterminate",
    message: "Pool empty despite non-zero entitlement count — investigate take/skip or transient DB state.",
    counts: { publishedGlobal, entitlementPublished },
  };
}
