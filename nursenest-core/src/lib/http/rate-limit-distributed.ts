/**
 * Postgres-backed fixed-window rate limits — Node-only (imported dynamically from {@link rate-limit-unified}).
 */
import { createHash } from "node:crypto";
import { prisma } from "@/lib/db";

function hashKey(key: string): string {
  return createHash("sha256").update(key, "utf8").digest("hex");
}

export async function checkRateLimitDistributed(
  key: string,
  opts: { windowMs: number; max: number },
): Promise<{ ok: boolean }> {
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
        return { ok: true };
      }
      if (row.count >= opts.max) return { ok: false };
      await tx.appRateLimitBucket.update({
        where: { id },
        data: { count: { increment: 1 } },
      });
      return { ok: true };
    },
    {
      isolationLevel: "Serializable",
      maxWait: 5000,
      timeout: 10_000,
    },
  );
}

export async function consumeRateLimitDistributed(
  key: string,
  cost: number,
  opts: { windowMs: number; max: number },
): Promise<{ ok: boolean }> {
  if (cost <= 0) return { ok: true };
  const id = hashKey(key);
  return prisma.$transaction(
    async (tx) => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + opts.windowMs);
      const row = await tx.appRateLimitBucket.findUnique({ where: { id } });
      if (!row || row.expiresAt < now) {
        if (cost > opts.max) return { ok: false };
        await tx.appRateLimitBucket.upsert({
          where: { id },
          create: { id, count: cost, expiresAt },
          update: { count: cost, expiresAt },
        });
        return { ok: true };
      }
      if (row.count + cost > opts.max) return { ok: false };
      await tx.appRateLimitBucket.update({
        where: { id },
        data: { count: { increment: cost } },
      });
      return { ok: true };
    },
    {
      isolationLevel: "Serializable",
      maxWait: 5000,
      timeout: 10_000,
    },
  );
}
