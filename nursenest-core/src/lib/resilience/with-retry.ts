import { Prisma } from "@prisma/client";

export type RetryOptions = {
  maxAttempts?: number;
  baseMs?: number;
  /**
   * When true, retry any thrown error (legacy). Default false: only transient DB / connection errors.
   */
  retryAllErrors?: boolean;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const TRANSIENT_PRISMA_KNOWN_CODES = new Set([
  "P1001",
  "P1002",
  "P1008",
  "P1017",
  "P2024",
  "P2034",
]);

const TRANSIENT_NODE_CODES = new Set(["ECONNRESET", "ECONNREFUSED", "ETIMEDOUT", "EPIPE", "ENOTFOUND"]);

function messageLooksTransient(msg: string): boolean {
  const m = msg.toLowerCase();
  return (
    m.includes("timeout") ||
    m.includes("timed out") ||
    m.includes("connection terminated") ||
    m.includes("server closed the connection") ||
    m.includes("connection closed") ||
    m.includes("socket hang up") ||
    m.includes("econnreset") ||
    m.includes("econnrefused") ||
    m.includes("etimedout")
  );
}

/** True for typical failover / pool / network flakes (exported for tests). */
export function isTransientDatabaseError(e: unknown): boolean {
  if (e instanceof Prisma.PrismaClientInitializationError) return true;
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    return TRANSIENT_PRISMA_KNOWN_CODES.has(e.code);
  }
  if (e instanceof Prisma.PrismaClientUnknownRequestError) {
    return messageLooksTransient(e.message);
  }
  if (e instanceof Error) {
    const code =
      "code" in e && typeof (e as NodeJS.ErrnoException).code === "string"
        ? (e as NodeJS.ErrnoException).code
        : undefined;
    if (code && TRANSIENT_NODE_CODES.has(code)) return true;
    return messageLooksTransient(e.message);
  }
  return false;
}

/**
 * Exponential backoff for transient DB / network flakes.
 * Defaults to retrying only {@link isTransientDatabaseError}; use `retryAllErrors: true` for legacy behavior.
 */
export async function withRetry<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const maxAttempts = Math.min(5, Math.max(1, opts.maxAttempts ?? 3));
  const baseMs = opts.baseMs ?? 40;
  const retryAll = opts.retryAllErrors === true;
  let last: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (attempt === maxAttempts) break;
      if (!retryAll && !isTransientDatabaseError(e)) break;
      await sleep(baseMs * 2 ** (attempt - 1));
    }
  }
  throw last instanceof Error ? last : new Error(String(last));
}
