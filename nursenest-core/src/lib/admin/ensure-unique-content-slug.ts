import { prisma } from "@/lib/db";

const SLUG_MAX = 118;

function sanitizeSlugBase(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, SLUG_MAX);
}

/** Returns a slug not present on any `content_items` row. */
export async function ensureUniqueContentItemSlug(preferred: string): Promise<string> {
  let base = sanitizeSlugBase(preferred) || "lesson";
  let candidate = base;
  let n = 0;
  while (await prisma.contentItem.findUnique({ where: { slug: candidate }, select: { id: true } })) {
    n += 1;
    const suffix = `-${n}`;
    candidate = `${base.slice(0, Math.max(1, SLUG_MAX - suffix.length))}${suffix}`;
  }
  return candidate;
}
