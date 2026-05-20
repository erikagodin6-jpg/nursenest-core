/** SQL fragments for `@@map` / default Prisma Postgres identifiers. */
const WATCH_SQL_TABLES: { re: RegExp; name: string }[] = [
  { re: /\bpathway_lessons\b/i, name: "pathway_lessons" },
  { re: /"Progress"/, name: "Progress" },
  { re: /"ExamAttempt"/, name: "ExamAttempt" },
];

export type PrismaQueryViolation =
  | {
      kind: "sql_missing_limit_on_watch_table";
      table: string;
      detail: string;
    }
  | {
      kind: "sql_potential_full_table_scan_no_where";
      table: string;
      detail: string;
    };

const MAX_VIOLATIONS = 200;

function pushViolation(v: PrismaQueryViolation): void {
  const g = globalThis as typeof globalThis & { __PRISMA_QUERY_VIOLATIONS__?: PrismaQueryViolation[] };
  if (!g.__PRISMA_QUERY_VIOLATIONS__) g.__PRISMA_QUERY_VIOLATIONS__ = [];
  const arr = g.__PRISMA_QUERY_VIOLATIONS__;
  if (arr.length >= MAX_VIOLATIONS) arr.shift();
  arr.push(v);
}

export function clearPrismaQueryViolations(): void {
  const g = globalThis as typeof globalThis & { __PRISMA_QUERY_VIOLATIONS__?: PrismaQueryViolation[] };
  g.__PRISMA_QUERY_VIOLATIONS__ = [];
}

export function getPrismaQueryViolations(): PrismaQueryViolation[] {
  const g = globalThis as typeof globalThis & { __PRISMA_QUERY_VIOLATIONS__?: PrismaQueryViolation[] };
  return [...(g.__PRISMA_QUERY_VIOLATIONS__ ?? [])];
}

/**
 * Heuristic on Prisma-emitted SQL (`$on('query')`):
 * - **LIMIT** (Prisma `take`) must be present on list reads against hot tables, **or** the query must
 *   clearly target a single row (PK / composite unique equality).
 * - **SELECT** from those tables with **no WHERE** and no LIMIT is treated as a potential full table scan.
 *
 * Skips `SELECT 1`, introspection, and bounded unique lookups.
 */
export function auditRawSqlQuery(sql: string): void {
  const t = sql.replace(/\s+/g, " ").trim();
  if (!/^SELECT/i.test(t)) return;
  if (/SELECT\s+1\b/i.test(t)) return;
  if (/\binformation_schema\b/i.test(t)) return;

  const hasLimit = /\bLIMIT\b/i.test(t);
  const hasWhere = /\bWHERE\b/i.test(t);

  for (const { re, name } of WATCH_SQL_TABLES) {
    if (!re.test(t)) continue;

    if (hasLimit) continue;

    /** Single-row by primary key. */
    if (/"id"\s*=\s*\$/i.test(t)) continue;

    /** `@@unique([userId, lessonId])` — at most one row. */
    if (
      name === "Progress" &&
      hasWhere &&
      /"userId"\s*=\s*\$/i.test(t) &&
      /"lessonId"\s*=\s*\$/i.test(t)
    ) {
      continue;
    }

    /** `@@unique([pathwayId, slug, locale])` — match mapped column names in SQL. */
    if (
      name === "pathway_lessons" &&
      hasWhere &&
      /"pathway_id"\s*=\s*\$/i.test(t) &&
      /"slug"\s*=\s*\$/i.test(t) &&
      /"locale"\s*=\s*\$/i.test(t)
    ) {
      continue;
    }

    /** `COUNT(...) ... WHERE` — aggregate over a filter, not a row scan list. */
    if (/\bCOUNT\s*\(/i.test(t) && hasWhere) continue;

    if (!hasWhere) {
      pushViolation({
        kind: "sql_potential_full_table_scan_no_where",
        table: name,
        detail: t.slice(0, 280),
      });
      continue;
    }

    pushViolation({
      kind: "sql_missing_limit_on_watch_table",
      table: name,
      detail: t.slice(0, 280),
    });
  }
}
