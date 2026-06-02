/**
 * Legacy blog batch importer — **run from the Next.js app** (Prisma lives in `nursenest-core/`).
 *
 * Usage:
 *   cd nursenest-core && npx tsx scripts/import-blog.ts
 *   cd nursenest-core && npx tsx scripts/import-blog.ts --dry-run
 *   cd nursenest-core && npx tsx scripts/import-blog.ts --batch-size=25 --dedupe-report
 *
 * Implementation: `nursenest-core/scripts/import-blog.ts`
 */
console.error(
  "Run this script from the nursenest-core app directory so @prisma/client resolves:\n" +
    "  cd nursenest-core && npx tsx scripts/import-blog.ts [...args]\n",
);
process.exit(1);
