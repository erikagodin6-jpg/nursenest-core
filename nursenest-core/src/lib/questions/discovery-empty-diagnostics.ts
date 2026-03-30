import { DB_PUBLISHED, questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { examQuestionsDiscoveryWhereSql } from "@/lib/questions/subscriber-discovery-aggregates";

export type DiscoveryEmptyDiagnostics = {
  code:
    | "bank_empty_global"
    | "entitlement_excludes_all_published"
    | "aggregate_prisma_mismatch"
    | "indeterminate";
  message: string;
  counts: {
    publishedGlobal: number;
    entitlementPublished: number;
    discoveryScoped: number;
  };
};

function toNumber(n: unknown): number {
  if (typeof n === "bigint") return Number(n);
  if (typeof n === "number") return n;
  return 0;
}

/**
 * When discovery aggregates return `total === 0`, explain whether the bank is empty vs gates.
 */
export async function diagnoseDiscoveryEmpty(entitlement: AccessScope): Promise<DiscoveryEmptyDiagnostics> {
  const w = examQuestionsDiscoveryWhereSql(entitlement);
  const [globalRow, scopedRow, entCount] = await Promise.all([
    prisma.$queryRaw<[{ n: bigint }]>`SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE status = ${DB_PUBLISHED}`,
    prisma.$queryRaw<[{ n: bigint }]>`SELECT COUNT(*)::bigint AS n FROM exam_questions WHERE ${w}`,
    prisma.examQuestion.count({ where: questionAccessWhere(entitlement) }),
  ]);

  const publishedGlobal = toNumber(globalRow[0]?.n);
  const discoveryScoped = toNumber(scopedRow[0]?.n);
  const entitlementPublished = entCount;

  let code: DiscoveryEmptyDiagnostics["code"] = "indeterminate";
  let message = "Discovery returned zero rows.";

  if (publishedGlobal === 0) {
    code = "bank_empty_global";
    message = "No published questions in the database.";
  } else if (entitlementPublished === 0) {
    code = "entitlement_excludes_all_published";
    message = "Published questions exist, but subscriber tier/region gates match none.";
  } else if (entitlementPublished > 0 && discoveryScoped === 0) {
    code = "aggregate_prisma_mismatch";
    message =
      "Prisma entitlement count is positive but discovery SQL count is zero — inspect examQuestionsDiscoveryWhereSql vs questionAccessWhere.";
  }

  return {
    code,
    message,
    counts: {
      publishedGlobal,
      entitlementPublished,
      discoveryScoped,
    },
  };
}
