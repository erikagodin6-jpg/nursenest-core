import "../../src/lib/db/env-bootstrap";
import { PrismaClient } from "@prisma/client";

const globalForScriptPrisma = globalThis as typeof globalThis & {
  __NN_SCRIPT_PRISMA__?: PrismaClient;
};

/**
 * Script-safe shared Prisma helper for standalone TS/TSX/MTS entrypoints.
 *
 * These scripts already run in their own Node process, so this mainly prevents
 * duplicate client construction inside a single script execution while
 * preserving the existing env-bootstrap semantics.
 */
export const prisma =
  globalForScriptPrisma.__NN_SCRIPT_PRISMA__ ??
  new PrismaClient({
    log: ["error"],
  });

globalForScriptPrisma.__NN_SCRIPT_PRISMA__ = prisma;
