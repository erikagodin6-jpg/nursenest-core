import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

const REQUIRED_BLOG_COLUMNS = ["scheduledAt", "publishAt", "postStatus"] as const;

type SchemaGuardResult = {
  ok: boolean;
  missing: string[];
  checkedAt: string;
  reason?: string;
};

let schemaCache: SchemaGuardResult | null = null;

export async function verifyBlogPublishSchemaColumns(force = false): Promise<SchemaGuardResult> {
  if (!isDatabaseUrlConfigured()) {
    return {
      ok: false,
      missing: [...REQUIRED_BLOG_COLUMNS],
      checkedAt: new Date().toISOString(),
      reason: "DATABASE_URL is not configured.",
    };
  }
  if (!force && schemaCache) return schemaCache;

  try {
    const rows = await prisma.$queryRaw<Array<{ column_name: string }>>`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND lower(table_name) = lower('BlogPost')
        AND column_name IN ('scheduledAt', 'publishAt', 'postStatus')
    `;
    const present = new Set(rows.map((row) => row.column_name));
    const missing = REQUIRED_BLOG_COLUMNS.filter((column) => !present.has(column));
    schemaCache = {
      ok: missing.length === 0,
      missing,
      checkedAt: new Date().toISOString(),
    };
    return schemaCache;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    schemaCache = {
      ok: false,
      missing: [...REQUIRED_BLOG_COLUMNS],
      checkedAt: new Date().toISOString(),
      reason,
    };
    return schemaCache;
  }
}
