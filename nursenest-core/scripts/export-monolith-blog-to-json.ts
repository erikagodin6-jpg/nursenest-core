/**
 * Export blog-ready rows from the monolith Postgres into `content/blog-legacy-export.json`
 * for `import-blog.ts`.
 *
 * Requires: LEGACY_DATABASE_URL (or MONOLITH_DATABASE_URL) pointing at the monolith DB
 * (not the nursenest-core Prisma DB).
 *
 * Usage: `npx tsx scripts/export-monolith-blog-to-json.ts`
 */
import { config as loadEnv } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.join(__dirname, "../.env") });
loadEnv({ path: path.join(__dirname, "../../.env") });
const OUT = path.join(__dirname, "../content/blog-legacy-export.json");

type ExportRow = Record<string, unknown>;

async function hasColumn(client: pg.PoolClient, table: string, column: string): Promise<boolean> {
  const r = await client.query(
    `SELECT 1 FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2`,
    [table, column],
  );
  return r.rows.length > 0;
}

async function main() {
  const url = process.env.LEGACY_DATABASE_URL || process.env.MONOLITH_DATABASE_URL;
  if (!url) {
    console.error(
      JSON.stringify({
        ok: false,
        error: "Set LEGACY_DATABASE_URL (or MONOLITH_DATABASE_URL) to the monolith Postgres connection string.",
        wrote: null,
      }),
    );
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString: url, max: 1 });
  const client = await pool.connect();
  const out: ExportRow[] = [];

  try {
    const bodyOnItems = await hasColumn(client, "content_items", "body");

    const contentSql = `
      SELECT
        slug,
        title,
        summary,
        seo_description,
        category,
        tags,
        content,
        status,
        published_at,
        created_at,
        scheduled_at,
        updated_at
        ${bodyOnItems ? ", body" : ""}
      FROM content_items
      WHERE type IN ('blog', 'blog-post', 'article')
        AND (status IS NULL OR status NOT IN ('merged', 'archived', 'quarantined'))
        AND (
          status = 'published'
          OR (status = 'scheduled' AND scheduled_at IS NOT NULL AND scheduled_at <= NOW())
        )
      ORDER BY COALESCE(published_at, scheduled_at, created_at) DESC NULLS LAST
    `;

    const ci = await client.query(contentSql);
    for (const row of ci.rows) {
      out.push({
        legacy_source: "content_items",
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        seo_description: row.seo_description,
        category: row.category,
        tags: row.tags,
        content: row.content,
        body: bodyOnItems ? row.body : null,
        status: row.status,
        published_at: row.published_at,
        created_at: row.created_at,
        scheduled_at: row.scheduled_at,
        updated_at: row.updated_at,
        cover_image: null,
      });
    }

    if (await hasColumn(client, "imaging_blog_articles", "slug")) {
      const img = await client.query(`
        SELECT slug, title, summary, meta_description, category, content_html, tags,
               status, published_at, created_at, updated_at
        FROM imaging_blog_articles
        WHERE status = 'published'
        ORDER BY published_at DESC NULLS LAST, updated_at DESC
        LIMIT 5000
      `);
      for (const row of img.rows) {
        out.push({
          legacy_source: "imaging_blog",
          slug: `imaging-${row.slug}`,
          title: row.title,
          summary: row.summary,
          seo_description: row.meta_description,
          category: row.category || "Medical imaging",
          tags: [...(row.tags || []), "medical-imaging"],
          content: null,
          content_html: row.content_html,
          status: "published",
          published_at: row.published_at,
          created_at: row.created_at,
          cover_image: null,
          legacy_original_slug: row.slug,
        });
      }
    }

    if (await hasColumn(client, "mlt_blog_posts", "slug")) {
      const mlt = await client.query(`
        SELECT slug, title, excerpt, seo_description, discipline, content, tags,
               status, published_at, created_at, updated_at, featured_image
        FROM mlt_blog_posts
        WHERE status = 'published'
        ORDER BY published_at DESC NULLS LAST, updated_at DESC
        LIMIT 5000
      `);
      for (const row of mlt.rows) {
        out.push({
          legacy_source: "mlt_blog",
          slug: `mlt-${row.slug}`,
          title: row.title,
          summary: row.excerpt,
          seo_description: row.seo_description,
          category: row.discipline || "Medical laboratory",
          tags: [...(row.tags || []), "mlt"],
          content: row.content,
          status: "published",
          published_at: row.published_at,
          created_at: row.created_at,
          cover_image: row.featured_image,
          legacy_original_slug: row.slug,
        });
      }
    }

    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(out, null, 2), "utf8");

    const bySource = out.reduce<Record<string, number>>((acc, r) => {
      const s = String(r.legacy_source || "unknown");
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    console.log(
      JSON.stringify(
        {
          ok: true,
          wrote: OUT,
          total: out.length,
          bySource,
          note: "blog_clusters are pillar SEO pages (not article bodies) — not exported here.",
        },
        null,
        2,
      ),
    );
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
