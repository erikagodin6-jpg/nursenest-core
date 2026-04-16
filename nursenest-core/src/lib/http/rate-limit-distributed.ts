/**
 * Postgres-backed fixed-window rate limits — Node-only (imported dynamically from {@link rate-limit-unified}).
 *
 * Implements {@link RateLimitStore} for multi-instance consistency via `AppRateLimitBucket`.
 */
import { createHash } from "node:crypto";
import { prisma } from "@/lib/db";
import type { RateLimitCheckResult, RateLimitStore, RateLimitWindowOpts } from "@/lib/http/rate-limit-store";

function hashKey(key: string): string {
  return createHash("sha256").update(key, "utf8").digest("hex");
}

function remainingFromCount(count: number, max: number): number {
  return Math.max(0, max - count);
}

export function createPostgresRateLimitStore(): RateLimitStore {
  return {
    async check(key: string, opts: RateLimitWindowOpts): Promise<RateLimitCheckResult> {
      const id = hashKey(key);
      return prisma.$transaction(
        async (tx) => {
          const now = new Date();
          const expiresAt = new Date(now.getTime() + opts.windowMs);
          const row = await tx.appRateLimitBucket.findUnique({ where: { id } });
          if (!row || row.expiresAt < now) {
            await tx.appRateLimitBucket.upsert({
              where: { id },
              create: { id, count: 1, expiresAt },
              update: { count: 1, expiresAt },
            });
            return { ok: true, remaining: remainingFromCount(1, opts.max) };
          }
          if (row.count >= opts.max) {
            return { ok: false, remaining: 0 };
          }
          const updated = await tx.appRateLimitBucket.update({
            where: { id },
            data: { count: { increment: 1 } },
            select: { count: true },
          });
          return { ok: true, remaining: remainingFromCount(updated.count, opts.max) };
        },
        {
          isolationLevel: "Serializable",
          maxWait: 5000,
          timeout: 10_000,
        },
      );
    },

    async consume(key: string, cost: number, opts: RateLimitWindowOpts): Promise<RateLimitCheckResult> {
      if (cost <= 0) {
        return { ok: true, remaining: opts.max };
      }
      const id = hashKey(key);
      return prisma.$transaction(
        async (tx) => {
          const now = new Date();
          const expiresAt = new Date(now.getTime() + opts.windowMs);
          const row = await tx.appRateLimitBucket.findUnique({ where: { id } });
          if (!row || row.expiresAt < now) {
            if (cost > opts.max) return { ok: false, remaining: 0 };
            await tx.appRateLimitBucket.upsert({
              where: { id },
              create: { id, count: cost, expiresAt },
              update: { count: cost, expiresAt },
            });
            return { ok: true, remaining: remainingFromCount(cost, opts.max) };
          }
          if (row.count + cost > opts.max) {
            return { ok: false, remaining: remainingFromCount(row.count, opts.max) };
          }
          const updated = await tx.appRateLimitBucket.update({
            where: { id },
            data: { count: { increment: cost } },
            select: { count: true },
          });
          return { ok: true, remaining: remainingFromCount(updated.count, opts.max) };
        },
        {
          isolationLevel: "Serializable",
          maxWait: 5000,
          timeout: 10_000,
        },
      );
    },
  };
}
