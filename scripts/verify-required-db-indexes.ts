#!/usr/bin/env npx tsx
/**
 * Release / deploy verification: required Postgres indexes for hot paths exist.
 *
 * Production (after migrate deploy):
 *   cd nursenest-core && DATABASE_URL="postgresql://..." npx prisma migrate deploy && npm run db:verify-indexes
 *
 * Fails with exit 1 and lists missing names if any required index is absent.
 */
import "../src/lib/db/env-bootstrap";
import { PrismaClient } from "@prisma/client";
import {
  OPTIONAL_PUBLIC_INDEX_NAMES,
  REQUIRED_PUBLIC_INDEX_NAMES,
} from "../src/lib/db/required-index-names";

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  try {
    const rows = await prisma.$queryRaw<{ indexname: string }[]>`
      SELECT indexname FROM pg_indexes WHERE schemaname = 'public'
    `;
    const have = new Set(rows.map((r) => r.indexname));

    const missingRequired = REQUIRED_PUBLIC_INDEX_NAMES.filter((n) => !have.has(n));
    const missingOptional = OPTIONAL_PUBLIC_INDEX_NAMES.filter((n) => !have.has(n));

    if (missingRequired.length > 0) {
      console.error(
        JSON.stringify(
          {
            ok: false,
            error: "missing_required_indexes",
            missingRequired,
            hint: "Run `npx prisma migrate deploy` against this database, then re-run this script.",
          },
          null,
          2,
        ),
      );
      process.exit(1);
    }

    console.log(
      JSON.stringify(
        {
          ok: true,
          requiredChecked: REQUIRED_PUBLIC_INDEX_NAMES.length,
          optionalMissing: missingOptional.length > 0 ? missingOptional : undefined,
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
