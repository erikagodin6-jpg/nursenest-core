#!/usr/bin/env npx tsx
/**
 * Find (and optionally delete) Spaces objects under a prefix that are not referenced from the DB.
 *
 *   npm run ops:cleanup-spaces-orphans -- --prefix=uploads/
 *   npm run ops:cleanup-spaces-orphans -- --prefix=uploads/ --delete
 *
 * Protect marketing keys: --protect-prefixes=screenshots/,branding/,replit-export/
 */
import "../src/lib/db/env-bootstrap";

import { DeleteObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/db";
import { collectReferencedSpacesKeys } from "@/lib/storage/collect-db-asset-refs";
import { getSpacesBucket, getSpacesEndpoint, getSpacesRegion } from "@/lib/storage/spaces-config";

function arg(name: string): string | undefined {
  const p = `--${name}=`;
  const hit = process.argv.find((a) => a.startsWith(p));
  return hit ? hit.slice(p.length) : undefined;
}

function maxListKeys(): number {
  const n = Number(process.env.SPACES_LIST_MAX_KEYS ?? "20000");
  if (!Number.isFinite(n) || n < 100) return 20000;
  return Math.min(500_000, Math.floor(n));
}

function isProtected(key: string, prefixes: string[]): boolean {
  for (const p of prefixes) {
    const norm = p.replace(/^\/+/, "");
    if (norm && key.startsWith(norm)) return true;
  }
  return false;
}

async function run() {
  const prefix = (arg("prefix") ?? "uploads/").replace(/^\//, "");
  const doDelete = process.argv.includes("--delete");
  const protectRaw = arg("protect-prefixes") ?? "screenshots/,branding/";
  const protectPrefixes = protectRaw
    .split(",")
    .map((s) => s.trim().replace(/^\//, ""))
    .filter(Boolean);

  const key = process.env.SPACES_KEY?.trim();
  const secret = process.env.SPACES_SECRET?.trim();
  if (!key || !secret) {
    console.error("SPACES_KEY and SPACES_SECRET are required.");
    process.exit(1);
  }

  console.error("[cleanup-spaces-orphans] loading DB references…");
  const referenced = await collectReferencedSpacesKeys(prisma);
  console.error(`[cleanup-spaces-orphans] referenced keys: ${referenced.size}`);

  const client = new S3Client({
    region: getSpacesRegion(),
    endpoint: getSpacesEndpoint(),
    credentials: { accessKeyId: key, secretAccessKey: secret },
  });
  const bucket = getSpacesBucket();
  const cap = maxListKeys();
  let continuationToken: string | undefined;
  const listed: string[] = [];
  let truncated = false;

  do {
    const out = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
        MaxKeys: Math.min(1000, cap - listed.length),
      }),
    );
    for (const o of out.Contents ?? []) {
      if (o.Key) listed.push(o.Key);
      if (listed.length >= cap) {
        truncated = true;
        break;
      }
    }
    continuationToken = out.IsTruncated ? out.NextContinuationToken : undefined;
    if (listed.length >= cap) break;
  } while (continuationToken);

  const orphans = listed.filter((k) => !referenced.has(k) && !isProtected(k, protectPrefixes));

  const report = {
    prefix,
    listedCount: listed.length,
    referencedCount: referenced.size,
    orphanCount: orphans.length,
    protectedPrefixes: protectPrefixes,
    truncated,
    dryRun: !doDelete,
    sampleOrphans: orphans.slice(0, 50),
  };

  console.log(JSON.stringify(report, null, 2));

  if (!doDelete) {
    console.error("[cleanup-spaces-orphans] dry-run only. Re-run with --delete to remove orphans.");
    return;
  }

  let deleted = 0;
  let failed = 0;
  for (const Key of orphans) {
    try {
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key }));
      deleted += 1;
    } catch {
      failed += 1;
    }
  }

  console.error(
    JSON.stringify({
      event: "cleanup_spaces_orphans_done",
      deleted,
      failed,
    }),
  );
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
