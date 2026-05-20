import "server-only";

import { AsyncLocalStorage } from "node:async_hooks";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";

export type PrismaQueryContextStore = {
  route: string;
  correlationId?: string;
};

const prismaQueryAls = new AsyncLocalStorage<PrismaQueryContextStore>();

export function getPrismaQueryContext(): PrismaQueryContextStore | undefined {
  return prismaQueryAls.getStore();
}

export function runWithPrismaQueryContext<T>(ctx: PrismaQueryContextStore, fn: () => T): T {
  return prismaQueryAls.run(ctx, fn);
}

/**
 * Populate ALS for the duration of `fn` so Prisma slow-query logs can attach route + correlationId.
 */
export async function runWithPrismaQueryContextFromRequest<T>(
  req: Request,
  routeFallback: string,
  fn: () => Promise<T>,
): Promise<T> {
  let route = routeFallback.slice(0, 200);
  try {
    route = new URL(req.url).pathname.slice(0, 200);
  } catch {
    /* keep fallback */
  }
  const correlationId = correlationIdFromRequest(req) ?? undefined;
  return prismaQueryAls.run({ route, correlationId }, () => fn());
}
