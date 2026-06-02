#!/usr/bin/env npx tsx
/**
 * Idempotent seed for internal interactive courses (ECG / ABC labs).
 *
 * Usage:
 *   npm run db:seed-internal-courses
 *
 * Requires DATABASE_URL (same as Prisma).
 */
import { upsertLegacyInternalCoursesFromCatalog } from "@/lib/internal-courses/upsert-legacy-import";

async function main() {
  const r = await upsertLegacyInternalCoursesFromCatalog();
  // eslint-disable-next-line no-console -- CLI script
  console.info(`internal_courses_seed_ok courses=${r.coursesUpserted}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
