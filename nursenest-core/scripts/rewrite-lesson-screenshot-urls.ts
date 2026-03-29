/**
 * One-off: replace stale www.nursenest.ca/screenshots/ URLs in `content_items.content` JSON with Spaces CDN.
 * Run: `npx tsx scripts/rewrite-lesson-screenshot-urls.ts`
 * Env: DATABASE_URL, optional NEXT_PUBLIC_MARKETING_CDN_BASE (default: nursenest-images Spaces).
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { bodyStringFromContentJson, bodyStringToContentJson } from "../src/lib/prisma/content-item-body";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.join(__dirname, "../.env") });
loadEnv({ path: path.join(__dirname, "../../.env") });

const MARKETING_CDN_BASE =
  process.env.NEXT_PUBLIC_MARKETING_CDN_BASE?.replace(/\/$/, "") ?? "https://nursenest-images.tor1.cdn.digitaloceanspaces.com";
const NEW_PREFIX = `${MARKETING_CDN_BASE}/screenshots/`;

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.contentItem.findMany({
    where: { type: "lesson" },
    select: { id: true, slug: true, content: true },
  });
  let updated = 0;
  for (const row of rows) {
    const bodyStr = bodyStringFromContentJson(row.content);
    if (!bodyStr.includes("www.nursenest.ca/screenshots")) continue;
    const next = bodyStr.replace(/https:\/\/www\.nursenest\.ca\/screenshots\//gi, NEW_PREFIX);
    if (next === bodyStr) continue;
    await prisma.contentItem.update({
      where: { id: row.id },
      data: { content: bodyStringToContentJson(next) },
    });
    updated += 1;
  }
  console.log(JSON.stringify({ scanned: rows.length, updated, newPrefix: NEW_PREFIX }, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
