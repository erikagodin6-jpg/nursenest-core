#!/usr/bin/env npx tsx
/**
 * Publish blog drafts / scheduled / approved posts that pass recovery gates (with optional legacy JSON import).
 *
 * **Dry-run by default.** Writes require:
 *   APPLY_BLOG_DRAFT_RECOVERY=1
 *   DATABASE_URL
 *
 * Optional:
 *   EMERGENCY_SEO_PUBLISH=1 — bypass editorial soft gates (see `legacy-blog-draft-recovery-gates.ts`)
 *   LEGACY_IMPORT_OVERWRITE_BLOG_BODY=1 — replace body from export when slug matches
 *   LEGACY_BLOG_EXPORT_PATH or argv[2] — version-1 JSON for missing slugs (creates published rows when valid)
 *
 * After publishing:
 *   npm run legacy:audit-blogs-drafts
 *   npm run content:fix-public-content-integrity
 *   MARKETING_STUDY_SMOKE_BASE_URL=https://www.nursenest.ca MARKETING_STUDY_REQUIRE_PP_BLOG_LINKS=0 npx playwright test tests/e2e/public/marketing-study-surfaces-production-gate.spec.ts --project=chromium
 */
import { readFileSync } from "node:fs";

import { PrismaClient } from "@prisma/client";

import "../../src/lib/db/script-env-bootstrap";
import { parseLegacyBlogExportV1Json } from "../../src/lib/legacy/legacy-blog-draft-recovery-types";
import { runBlogDraftRecoveryImport } from "../../src/lib/legacy/legacy-blog-draft-recovery-pipeline";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[legacy:publish-blogs-drafts] DATABASE_URL is required.");
    process.exit(1);
  }
  const apply = process.env.APPLY_BLOG_DRAFT_RECOVERY?.trim() === "1";
  if (apply) {
    console.error("[legacy:publish-blogs-drafts] APPLY mode — writing BlogPost rows");
  } else {
    console.log("[legacy:publish-blogs-drafts] dry-run (set APPLY_BLOG_DRAFT_RECOVERY=1 to write)");
  }

  const path = process.env.LEGACY_BLOG_EXPORT_PATH?.trim() || process.argv[2]?.trim();
  const exportV1 = path ? parseLegacyBlogExportV1Json(readFileSync(path, "utf8")) : null;

  const result = await runBlogDraftRecoveryImport(prisma, exportV1, {
    apply,
    emergencySeoPublish: process.env.EMERGENCY_SEO_PUBLISH?.trim() === "1",
    overwriteBlogBody: process.env.LEGACY_IMPORT_OVERWRITE_BLOG_BODY?.trim() === "1",
  });

  console.log(
    JSON.stringify(
      {
        ok: result.errors.length === 0,
        dryRun: result.dryRun,
        changeCount: result.changes.length,
        errors: result.errors,
        audit: result.audit,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
