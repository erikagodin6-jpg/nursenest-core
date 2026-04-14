#!/usr/bin/env npx tsx
/**
 * Operator check: Prisma can reach the DB and the User table (required for signup/login).
 * Does not create users or send credentials. Run: `npm run verify:auth-db` from nursenest-core.
 */
import "../src/lib/db/env-bootstrap";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$queryRaw`SELECT 1`;
  const userCount = await prisma.user.count();
  console.log(JSON.stringify({ ok: true, userCount, message: "DATABASE_URL reachable; User table query succeeded" }));
}

main()
  .catch((e) => {
    console.error(JSON.stringify({ ok: false, message: e instanceof Error ? e.message : String(e) }));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
