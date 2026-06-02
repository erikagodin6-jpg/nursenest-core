/**
 * Entry shim — Prisma and `@/` imports resolve from the Next.js app package (`nursenest-core/`).
 *
 * Run:
 *   cd nursenest-core && npx tsx scripts/generate-blog-posts.ts --help
 *   cd nursenest-core && npx tsx scripts/generate-blog-posts.ts --topic="Your topic" --draft
 */
console.error(
  "Run blog generation from the app package directory:\n" +
    "  cd nursenest-core && npx tsx scripts/generate-blog-posts.ts [...]\n" +
    "\nSee script header in nursenest-core/scripts/generate-blog-posts.ts for flags.\n",
);
process.exit(1);
