import type { PrismaClient } from "@prisma/client";
import { auditRawSqlQuery } from "@/lib/db/prisma-query-audit";

const MAX_QUERIES = 800;

export type CapturedPrismaQuery = {
  query: string;
  durationMs: number;
};

function pushQuery(entry: CapturedPrismaQuery): void {
  const g = globalThis as typeof globalThis & { __PRISMA_QUERY_LOG__?: CapturedPrismaQuery[] };
  if (!g.__PRISMA_QUERY_LOG__) g.__PRISMA_QUERY_LOG__ = [];
  const arr = g.__PRISMA_QUERY_LOG__;
  if (arr.length >= MAX_QUERIES) arr.shift();
  arr.push(entry);
}

export function clearPrismaQueryLog(): void {
  const g = globalThis as typeof globalThis & { __PRISMA_QUERY_LOG__?: CapturedPrismaQuery[] };
  g.__PRISMA_QUERY_LOG__ = [];
}

export function getPrismaQueryLog(): CapturedPrismaQuery[] {
  const g = globalThis as typeof globalThis & { __PRISMA_QUERY_LOG__?: CapturedPrismaQuery[] };
  return [...(g.__PRISMA_QUERY_LOG__ ?? [])];
}

/**
 * Enables `$on('query')` logging + SQL heuristic audit. Call once on the shared `PrismaClient`.
 * Safe to skip in production unless `PRISMA_QUERY_AUDIT=1`.
 */
export function attachPrismaQueryCapture(prisma: PrismaClient): void {
  const p = prisma as PrismaClient & { $on(event: string, cb: (e: { query: string; duration: number }) => void): void };
  p.$on("query", (e) => {
    pushQuery({ query: e.query, durationMs: e.duration });
    auditRawSqlQuery(e.query);
  });
}
