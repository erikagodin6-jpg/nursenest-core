#!/usr/bin/env npx tsx
/**
 * Prints which database host the app would use (masked) and whether core Prisma tables respond.
 * Does not print secrets. Run from `nursenest-core/`: `npm run db:sanity`
 */
import "../src/lib/db/env-bootstrap";
import { PrismaClient } from "@prisma/client";

function maskUrl(raw: string): string {
  try {
    const u = new URL(raw);
    if (u.password) u.password = "***";
    return u.toString();
  } catch {
    return "(unparseable DATABASE_URL)";
  }
}

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }
  console.log("Effective DATABASE_URL (masked):", maskUrl(url));
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const userCount = await prisma.user.count();
    console.log(JSON.stringify({ ok: true, userCount, prismaReachable: true }, null, 2));
  } catch (e) {
    console.error(
      JSON.stringify(
        {
          ok: false,
          prismaReachable: false,
          detail: e instanceof Error ? e.message.slice(0, 500) : String(e).slice(0, 500),
        },
        null,
        2,
      ),
    );
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
