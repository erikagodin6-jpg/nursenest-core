import { BlogPostStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadRnTopicMapBatchRows } from "@/lib/admin/blog-topic-map-batch";
import { prisma } from "@/lib/db";

const bodySchema = z.object({
  cursor: z.number().int().min(0),
  limit: z.number().int().min(1).max(8),
  /** When true, no DB writes — returns what would be created. */
  dryRun: z.boolean().optional(),
});

function normalizeTopic(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Chunked blog shell creation from RN master topic map — avoids long single HTTP requests (timeout-safe).
 * Client loops: increment `cursor` by `processed` until `done`.
 */
export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }
  const { cursor, limit, dryRun } = parsed.data;

  const allRows = loadRnTopicMapBatchRows(100000);
  if (allRows.length === 0) {
    return NextResponse.json({
      ok: true,
      done: true,
      cursor: 0,
      processed: 0,
      created: [],
      skipped: [],
      errors: ["master-topic-map.json missing or has no RN topics"],
      totalAvailable: 0,
    });
  }

  const slice = allRows.slice(cursor, cursor + limit);
  const created: string[] = [];
  const skipped: string[] = [];
  const errors: string[] = [];

  if (dryRun) {
    return NextResponse.json({
      ok: true,
      done: cursor + slice.length >= allRows.length,
      cursor: cursor + slice.length,
      processed: slice.length,
      created: slice.map((r) => r.slug),
      skipped: [],
      errors: [],
      totalAvailable: allRows.length,
      dryRun: true,
    });
  }

  for (const row of slice) {
    try {
      const exists = await prisma.blogPost.findUnique({ where: { slug: row.slug }, select: { id: true } });
      if (exists) {
        skipped.push(row.slug);
        continue;
      }
      const normalizedTopic = normalizeTopic(row.tags[1] ?? row.title);
      const dupTopic = normalizedTopic
        ? await prisma.blogPost.findFirst({
            where: {
              exam: row.exam,
              OR: [
                { targetKeyword: normalizedTopic },
                { keywordCluster: normalizedTopic },
                { tags: { has: normalizedTopic } },
              ],
            },
            select: { id: true },
          })
        : null;
      if (dupTopic) {
        skipped.push(`${row.slug} (topic duplicate)`);
        continue;
      }
      await prisma.blogPost.create({
        data: {
          slug: row.slug,
          title: row.title,
          excerpt: row.excerpt,
          body: row.body,
          exam: row.exam,
          category: row.category,
          tags: row.tags,
          postTemplate: row.postTemplate,
          postStatus: BlogPostStatus.DRAFT,
          relatedLessonPaths: [row.relatedLessonPath],
          seoTitle: row.title.slice(0, 200),
          seoDescription: row.excerpt.slice(0, 480),
          targetKeyword: normalizedTopic || null,
        },
      });
      created.push(row.slug);
    } catch (e) {
      errors.push(`${row.slug}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  const nextCursor = cursor + slice.length;
  const done = nextCursor >= allRows.length;

  return NextResponse.json({
    ok: true,
    done,
    cursor: nextCursor,
    processed: slice.length,
    created,
    skipped,
    errors,
    totalAvailable: allRows.length,
  });
}
