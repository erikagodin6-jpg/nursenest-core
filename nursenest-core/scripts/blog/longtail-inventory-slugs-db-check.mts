#!/usr/bin/env npx tsx
/**
 * Read-only: checks whether inventory slugs already exist on `BlogPost` (collision watch).
 *
 * Requires DATABASE_URL. Exits 0 always unless Prisma errors; prints counts to stdout.
 *
 * Usage (from `nursenest-core/`):
 *   npx tsx scripts/blog/longtail-inventory-slugs-db-check.mts
 */
import { createReadStream } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import { PrismaClient } from "@prisma/client";

import "../../src/lib/db/script-env-bootstrap";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(__dirname, "..", "..");
const repoRoot = resolve(appRoot, "..");
const csvPath = resolve(repoRoot, "reports", "longtail-patho-pharm-topic-inventory.csv");

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i]!;
    if (c === '"') {
      q = !q;
      continue;
    }
    if (c === "," && !q) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out;
}

async function loadSlugs(): Promise<string[]> {
  const rl = createInterface({ input: createReadStream(csvPath, "utf8"), crlfDelay: Infinity });
  let header: string[] | null = null;
  const slugs: string[] = [];
  for await (const line of rl) {
    if (!line.trim()) continue;
    const cells = parseCsvLine(line);
    if (!header) {
      header = cells;
      continue;
    }
    const si = header.indexOf("slug");
    slugs.push((cells[si] ?? "").replace(/^"|"$/g, ""));
  }
  return slugs;
}

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[longtail-inventory-slugs-db-check] DATABASE_URL not set; skipping DB collision check.");
    process.exit(0);
  }

  const slugs = await loadSlugs();
  if (slugs.length !== 300) {
    console.error(`Expected 300 slugs, got ${slugs.length}`);
    process.exit(1);
  }

  const prisma = new PrismaClient();
  try {
    const hits = await prisma.blogPost.findMany({
      where: { slug: { in: slugs } },
      select: { slug: true, postStatus: true },
      take: 400,
    });
    console.log(
      JSON.stringify(
        {
          inventorySlugs: slugs.length,
          existingMatches: hits.length,
          sample: hits.slice(0, 15),
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
