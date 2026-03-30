#!/usr/bin/env npx tsx
/**
 * Log database size growth and (optionally) sampled Spaces usage for operations / log drains.
 *
 *   npm run ops:storage-report
 *
 * Env: SPACES_* for bucket sampling; SPACES_LIST_MAX_KEYS (default 5000) caps ListObjects pagination.
 */
import "../src/lib/db/env-bootstrap";

import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/db";
import { getSpacesBucket, getSpacesEndpoint, getSpacesRegion } from "@/lib/storage/spaces-config";

const PREFIX = "[nursenest-core]";

function maxListKeys(): number {
  const n = Number(process.env.SPACES_LIST_MAX_KEYS ?? "5000");
  if (!Number.isFinite(n) || n < 100) return 5000;
  return Math.min(500_000, Math.floor(n));
}

async function main() {
  const [dbSize, examBytes, blogBytes, contentBytes, examCount, blogCount, contentCount] = await Promise.all([
    prisma.$queryRaw<Array<{ bytes: bigint }>>`SELECT pg_database_size(current_database())::bigint AS bytes`,
    prisma.$queryRaw<Array<{ bytes: bigint }>>`SELECT COALESCE(pg_total_relation_size('exam_questions'), 0)::bigint AS bytes`,
    prisma.$queryRaw<Array<{ bytes: bigint }>>`SELECT COALESCE(pg_total_relation_size('blog_posts'), 0)::bigint AS bytes`,
    prisma.$queryRaw<Array<{ bytes: bigint }>>`SELECT COALESCE(pg_total_relation_size('content_items'), 0)::bigint AS bytes`,
    prisma.examQuestion.count(),
    prisma.blogPost.count(),
    prisma.contentItem.count(),
  ]);

  const totalDb = Number(dbSize[0]?.bytes ?? BigInt(0));
  const examTable = Number(examBytes[0]?.bytes ?? BigInt(0));
  const blogTable = Number(blogBytes[0]?.bytes ?? BigInt(0));
  const contentTable = Number(contentBytes[0]?.bytes ?? BigInt(0));

  const payload = {
    event: "storage_report",
    dbTotalBytes: totalDb,
    tableBytes: {
      exam_questions: examTable,
      blog_posts: blogTable,
      content_items: contentTable,
    },
    rowCounts: {
      exam_questions: examCount,
      blog_posts: blogCount,
      content_items: contentCount,
    },
    spacesSample: null as null | { prefix: string; objectsCounted: number; totalBytes: number; truncated: boolean },
  };

  const key = process.env.SPACES_KEY?.trim();
  const secret = process.env.SPACES_SECRET?.trim();
  if (key && secret) {
    const client = new S3Client({
      region: getSpacesRegion(),
      endpoint: getSpacesEndpoint(),
      credentials: { accessKeyId: key, secretAccessKey: secret },
    });
    const bucket = getSpacesBucket();
    const prefix = (process.env.SPACES_REPORT_PREFIX ?? "").replace(/^\//, "");
    let continuationToken: string | undefined;
    let objectsCounted = 0;
    let totalBytes = 0;
    const cap = maxListKeys();
    let truncated = false;

    try {
      do {
        const out = await client.send(
          new ListObjectsV2Command({
            Bucket: bucket,
            Prefix: prefix || undefined,
            ContinuationToken: continuationToken,
            MaxKeys: Math.min(1000, cap - objectsCounted),
          }),
        );
        for (const o of out.Contents ?? []) {
          objectsCounted += 1;
          totalBytes += o.Size ?? 0;
          if (objectsCounted >= cap) {
            truncated = true;
            break;
          }
        }
        continuationToken = out.IsTruncated ? out.NextContinuationToken : undefined;
        if (objectsCounted >= cap) break;
      } while (continuationToken);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`${PREFIX} ops storage_report spaces_list_failed`, JSON.stringify({ message: msg.slice(0, 400) }));
    }

    payload.spacesSample = {
      prefix: prefix || "(whole bucket)",
      objectsCounted,
      totalBytes,
      truncated,
    };
  }

  console.error(`${PREFIX} ops storage_report`, JSON.stringify(payload));
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
