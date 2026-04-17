import "./db/env-bootstrap";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function registerPrismaClientConstruction(): void {
  const g = globalThis as typeof globalThis & { __PRISMA_CLIENT_COUNT__?: number };
  g.__PRISMA_CLIENT_COUNT__ = (g.__PRISMA_CLIENT_COUNT__ ?? 0) + 1;
  if (g.__PRISMA_CLIENT_COUNT__ > 1) {
    console.warn(
      "[prisma] Multiple Prisma clients detected — more than one PrismaClient was constructed in this process. Use the shared singleton from src/lib/db.ts.",
    );
  }
}

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    registerPrismaClientConstruction();
    return new PrismaClient({
      log: ["error"],
    });
  })();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
