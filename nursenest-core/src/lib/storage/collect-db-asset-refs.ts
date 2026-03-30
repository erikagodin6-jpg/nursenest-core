import { Prisma } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";
import { getSpacesPublicBaseUrls } from "./spaces-config";
import { collectUrlsFromJson, urlToObjectKey } from "./url-to-object-key";

/**
 * Object keys referenced from DB text/JSON columns (best-effort URL walk).
 */
export async function collectReferencedSpacesKeys(prisma: PrismaClient): Promise<Set<string>> {
  const bases = getSpacesPublicBaseUrls();
  const keys = new Set<string>();

  const addUrl = (s: string | null | undefined) => {
    if (!s) return;
    const k = urlToObjectKey(s, bases);
    if (k) keys.add(k);
  };

  const blogRows = await prisma.blogPost.findMany({
    where: { coverImage: { not: null } },
    select: { coverImage: true },
  });
  for (const r of blogRows) addUrl(r.coverImage);

  const examBatch = 500;
  let lastExamId = "";
  for (;;) {
    const rows = await prisma.$queryRaw<Array<{ id: string; images: unknown }>>(
      Prisma.sql`SELECT id, images FROM exam_questions WHERE images IS NOT NULL AND id > ${lastExamId} ORDER BY id ASC LIMIT ${examBatch}`,
    );
    if (rows.length === 0) break;
    for (const r of rows) {
      const urls = new Set<string>();
      collectUrlsFromJson(r.images, urls);
      for (const u of urls) addUrl(u);
    }
    lastExamId = rows[rows.length - 1].id;
  }

  const contentBatch = 100;
  let contentCursor: string | undefined;
  for (;;) {
    const rows = await prisma.contentItem.findMany({
      take: contentBatch,
      ...(contentCursor ? { skip: 1, cursor: { id: contentCursor } } : {}),
      orderBy: { id: "asc" },
      select: { id: true, content: true },
    });
    if (rows.length === 0) break;
    for (const r of rows) {
      const urls = new Set<string>();
      collectUrlsFromJson(r.content, urls);
      for (const u of urls) addUrl(u);
    }
    contentCursor = rows[rows.length - 1].id;
  }

  return keys;
}
