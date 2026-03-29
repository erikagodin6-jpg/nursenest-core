import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Pool } from "pg";

const __filename_esm = typeof __filename !== "undefined" ? __filename : fileURLToPath(import.meta.url);
const __dirname_esm = path.dirname(__filename_esm);

export async function seedDigitalProducts(pool: Pool): Promise<void> {
  const existingCount = await pool.query("SELECT COUNT(*)::int AS cnt FROM digital_products");
  if (existingCount.rows[0].cnt >= 54) {
    console.log(`[DigitalProductSeed] Fast-path: ${existingCount.rows[0].cnt} products exist, skipping`);
    return;
  }

  const candidates = [
    path.resolve(__dirname_esm, "seed-data/digital-products.json"),
    path.resolve(process.cwd(), "dist/seed-data/digital-products.json"),
    path.resolve(process.cwd(), "server/seed-data/digital-products.json"),
  ];
  let seedPath = "";
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      seedPath = candidate;
      break;
    }
  }
  if (!seedPath) {
    console.log("[DigitalProductSeed] No seed file found. Searched:", candidates.join(", "));
    return;
  }
  console.log("[DigitalProductSeed] Found seed file at:", seedPath);

  const raw = fs.readFileSync(seedPath, "utf-8");
  const products: any[] = JSON.parse(raw);
  console.log(`[DigitalProductSeed] Loaded ${products.length} products from seed file`);

  const existingSlugs = await pool.query("SELECT slug FROM digital_products");
  const existingSet = new Set<string>(existingSlugs.rows.map((r: any) => r.slug));

  const toInsert = products.filter(p => !existingSet.has(p.slug));

  if (toInsert.length === 0) {
    console.log("[DigitalProductSeed] All products already exist, nothing to insert");
    return;
  }

  console.log(`[DigitalProductSeed] Inserting ${toInsert.length} new products...`);

  let inserted = 0;
  let errors = 0;

  for (const p of toInsert) {
    try {
      await pool.query(
        `INSERT INTO digital_products (
          slug, title, description, short_description, price, compare_at_price,
          file_url, cover_image_url, preview_url, preview_page_count,
          category, tier_target, exam_target, featured, is_active,
          question_count, seo_title, seo_description, seo_keywords,
          theme_id, career_type, sale_price, sale_starts_at, sale_ends_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
        ON CONFLICT (slug) DO UPDATE SET
          question_count = EXCLUDED.question_count,
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          price = EXCLUDED.price,
          is_active = EXCLUDED.is_active`,
        [
          p.slug,
          p.title,
          p.description,
          p.short_description || null,
          p.price,
          p.compare_at_price || null,
          p.file_url || null,
          p.cover_image_url || null,
          p.preview_url || null,
          p.preview_page_count || 3,
          p.category,
          p.tier_target || "all",
          p.exam_target || null,
          p.featured || false,
          p.is_active !== false,
          p.question_count || 0,
          p.seo_title || null,
          p.seo_description || null,
          p.seo_keywords || null,
          p.theme_id || null,
          p.career_type || "nursing",
          p.sale_price || null,
          p.sale_starts_at || null,
          p.sale_ends_at || null,
        ]
      );
      inserted++;
    } catch (err: any) {
      errors++;
      if (errors <= 5) {
        console.error(`[DigitalProductSeed] Insert error: ${err.message.substring(0, 200)}`);
      }
    }
  }

  console.log(`[DigitalProductSeed] Complete: ${inserted} inserted, ${errors} errors`);
}
