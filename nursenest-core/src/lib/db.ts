import "./db/env-bootstrap";
import { attachPrismaQueryCapture } from "@/lib/db/prisma-query-capture";
import { PrismaClient, type Prisma } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  __PRISMA_CLIENT_COUNT__?: number;
  __PRISMA_CLIENT_DUPLICATE_WARNED__?: boolean;
};

/** Query capture + bounded-read heuristics (see `prisma-query-audit.ts`). Off in production unless `PRISMA_QUERY_AUDIT=1`. */
function shouldCapturePrismaQueries(): boolean {
  if (process.env.PRISMA_QUERY_AUDIT === "0") return false;
  if (process.env.PRISMA_QUERY_AUDIT === "1") return true;
  return process.env.NODE_ENV !== "production";
}

function prismaLogOptions(): Prisma.LogLevel[] | Prisma.LogDefinition[] {
  if (shouldCapturePrismaQueries()) {
    return [
      { emit: "event", level: "query" },
      { emit: "stdout", level: "error" },
    ];
  }
  return ["error"];
}

if ((globalThis as typeof globalThis & { __ENV_BOOTSTRAP_RAN__?: boolean }).__ENV_BOOTSTRAP_RAN__ !== true) {
  throw new Error("env-bootstrap did not run before Prisma init");
}

function registerPrismaClientConstruction(): void {
  globalForPrisma.__PRISMA_CLIENT_COUNT__ = (globalForPrisma.__PRISMA_CLIENT_COUNT__ ?? 0) + 1;
  if (
    globalForPrisma.__PRISMA_CLIENT_COUNT__ > 1 &&
    globalForPrisma.__PRISMA_CLIENT_DUPLICATE_WARNED__ !== true
  ) {
    globalForPrisma.__PRISMA_CLIENT_DUPLICATE_WARNED__ = true;
    console.warn(
      "[prisma] Multiple Prisma clients detected — more than one PrismaClient was constructed in this process. Use the shared singleton from src/lib/db.ts.",
    );
  }
}

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    registerPrismaClientConstruction();
    const client = new PrismaClient({
      log: prismaLogOptions(),
    });
    if (shouldCapturePrismaQueries()) {
      attachPrismaQueryCapture(client);
    }
    globalForPrisma.prisma = client;
    return client;
  })();
