import "./db/env-bootstrap";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Connection pool sizing: prefer `DATABASE_URL` query params, e.g.
 * `postgresql://...?connection_limit=15&pool_timeout=20&statement_timeout=30000` (values depend on host + traffic).
 * `statement_timeout` (ms) caps runaway queries at the server — pair with app-level retries/timeouts on hot paths.
 * Prisma does not set a universal default; tune alongside your Postgres max_connections.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
