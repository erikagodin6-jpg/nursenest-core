import "./db/env-bootstrap";

import { PrismaClient, type Prisma } from "@prisma/client";
import { attachPrismaQueryCapture } from "@/lib/db/prisma-query-capture";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  __PRISMA_CLIENT_COUNT__?: number;
  __PRISMA_CLIENT_DUPLICATE_WARNED__?: boolean;
  __PRISMA_QUERY_CAPTURE_ATTACHED__?: boolean;
};

function assertEnvBootstrapRan(): void {
  const bootstrapped = (globalThis as typeof globalThis & {
    __ENV_BOOTSTRAP_RAN__?: boolean;
  }).__ENV_BOOTSTRAP_RAN__;

  if (bootstrapped !== true) {
    throw new Error("env-bootstrap did not run before Prisma init");
  }
}

function shouldCapturePrismaQueries(): boolean {
  if (process.env.PRISMA_QUERY_AUDIT === "0") return false;
  if (process.env.PRISMA_QUERY_AUDIT === "1") return true;

  return process.env.NODE_ENV !== "production";
}

function prismaLogOptions(): Prisma.LogLevel[] | Prisma.LogDefinition[] {
  if (!shouldCapturePrismaQueries()) {
    return ["error"];
  }

  return [
    { emit: "event", level: "query" },
    { emit: "stdout", level: "error" },
  ];
}

function registerPrismaClientConstruction(): void {
  globalForPrisma.__PRISMA_CLIENT_COUNT__ = (globalForPrisma.__PRISMA_CLIENT_COUNT__ ?? 0) + 1;

  if (
    globalForPrisma.__PRISMA_CLIENT_COUNT__ > 1 &&
    globalForPrisma.__PRISMA_CLIENT_DUPLICATE_WARNED__ !== true
  ) {
    globalForPrisma.__PRISMA_CLIENT_DUPLICATE_WARNED__ = true;

    console.warn(
      "[prisma] Multiple Prisma clients detected. Use the shared singleton from src/lib/db.ts.",
    );
  }
}

function createPrismaClient(): PrismaClient {
  registerPrismaClientConstruction();

  const client = new PrismaClient({
    log: prismaLogOptions(),
  });

  if (
    shouldCapturePrismaQueries() &&
    globalForPrisma.__PRISMA_QUERY_CAPTURE_ATTACHED__ !== true
  ) {
    attachPrismaQueryCapture(client);
    globalForPrisma.__PRISMA_QUERY_CAPTURE_ATTACHED__ = true;
  }

  return client;
}

assertEnvBootstrapRan();

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;