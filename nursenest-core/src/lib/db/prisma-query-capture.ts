import type { PrismaClient } from "@prisma/client";
import { auditRawSqlQuery } from "@/lib/db/prisma-query-audit";
import { logPrismaQueryDiagnosticsIfConfigured } from "@/lib/db/prisma-slow-query-log";

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

export type AttachPrismaQueryCaptureOptions = {
  /**
   * When true, stores every query in the in-process log and runs the SQL heuristic audit.
   * When false (production default), only the slow-query logger fires — no per-query storage.
   */
  fullCapture?: boolean;
};

/**
 * Attaches `$on('query')` to the shared PrismaClient.
 * - In development / PRISMA_QUERY_AUDIT=1: full capture (in-memory log + SQL audit).
 * - In production: slim capture — slow-query logging only; no per-query storage cost.
 */
export function attachPrismaQueryCapture(
  prisma: PrismaClient,
  opts: AttachPrismaQueryCaptureOptions = {},
): void {
  const full = opts.fullCapture ?? false;
  const p = prisma as PrismaClient & {
    $on(event: string, cb: (e: { query: string; duration: number }) => void): void;
  };
  p.$on("query", (e) => {
    logPrismaQueryDiagnosticsIfConfigured(e.duration, e.query);
    if (full) {
      pushQuery({ query: e.query, durationMs: e.duration });
      auditRawSqlQuery(e.query);
    }
  });
}
