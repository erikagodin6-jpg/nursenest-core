#!/usr/bin/env npx tsx
/** One-off export for editorial audits — writes TSV next to reports/. */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { BlogPostStatus, PrismaClient } from "@prisma/client";
import {
  blogPrePublishValidationSelect,
  validateBlogPrePublish,
} from "../../src/lib/blog/blog-pre-publish-validation";

const prisma = new PrismaClient();
const out = path.resolve(import.meta.dirname, "..", "..", "..", "reports", "admin-blog-queue-detail.tsv");

async function main(): Promise<void> {
  const rows = await prisma.blogPost.findMany({
    where: {
      postStatus: {
        in: [
          BlogPostStatus.DRAFT,
          BlogPostStatus.NEEDS_REVIEW,
          BlogPostStatus.APPROVED,
          BlogPostStatus.SCHEDULED,
          BlogPostStatus.FAILED,
        ],
      },
    },
    select: blogPrePublishValidationSelect,
    orderBy: [{ postStatus: "asc" }, { slug: "asc" }],
  });
  const lines = ["id\tslug\ttitle\tpostStatus\tblocking_ids\tblocking_messages_snip"];
  for (const row of rows) {
    const r = await validateBlogPrePublish(row, row.id, { prisma });
    const ids = r.blocking.map((b) => b.id).join(";");
    const msgs = r.blocking.map((b) => b.message.replace(/\t/g, " ").slice(0, 120)).join(" | ");
    lines.push([row.id, row.slug, row.title.replace(/\t/g, " ").slice(0, 200), row.postStatus, ids, msgs].join("\t"));
  }
  writeFileSync(out, lines.join("\n"), "utf8");
  console.log("wrote", out, "rows", rows.length);
}

main().finally(() => prisma.$disconnect());
