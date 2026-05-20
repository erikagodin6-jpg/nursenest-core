#!/usr/bin/env npx tsx
/**
 * Audit blog posts: drafts, scheduled rows, workflow-promotable states, optional legacy JSON export gaps.
 *
 *   cd nursenest-core && npm run legacy:audit-blogs-drafts
 *
 * Env:
 *   DATABASE_URL (required)
 *   LEGACY_BLOG_EXPORT_PATH or argv[2] — optional version-1 JSON `{ "version": 1, "posts": [...] }`
 *   EMERGENCY_SEO_PUBLISH=1 — evaluate "safe to publish" using relaxed soft-gate rules
 *   LEGACY_IMPORT_OVERWRITE_BLOG_BODY=1 — when simulating recovery fixes, allow replacing body from export
 */
import { readFileSync } from "node:fs";

import { PrismaClient } from "@prisma/client";

import "../../src/lib/db/script-env-bootstrap";
import { parseLegacyBlogExportV1Json } from "../../src/lib/legacy/legacy-blog-draft-recovery-types";
import { runBlogDraftRecoveryAudit } from "../../src/lib/legacy/legacy-blog-draft-recovery-pipeline";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[legacy:audit-blogs-drafts] DATABASE_URL is required.");
    process.exit(1);
  }
  const path = process.env.LEGACY_BLOG_EXPORT_PATH?.trim() || process.argv[2]?.trim();
  const exportV1 = path ? parseLegacyBlogExportV1Json(readFileSync(path, "utf8")) : null;
  const audit = await runBlogDraftRecoveryAudit(prisma, exportV1, {
    emergencySeoPublish: process.env.EMERGENCY_SEO_PUBLISH?.trim() === "1",
    overwriteBlogBody: process.env.LEGACY_IMPORT_OVERWRITE_BLOG_BODY?.trim() === "1",
  });
  console.log(JSON.stringify({ ok: true, audit }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
