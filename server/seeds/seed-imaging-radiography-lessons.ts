import { pool } from "../storage";
import { generateRadiographyLessons } from "./imaging-radiography-lessons-data";

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  console.log("=== Imaging Radiography Lessons Seeder (ARRT + CAMRT) ===\n");

  const lessons = generateRadiographyLessons();
  console.log(`Total lessons to seed: ${lessons.length}`);

  const categories = [...new Set(lessons.map(l => l.category))];
  console.log(`Categories: ${categories.join(', ')}`);

  const countryCounts = { usa: 0, canada: 0 };
  for (const l of lessons) {
    if (l.country === 'usa') countryCounts.usa++;
    else countryCounts.canada++;
  }
  console.log(`USA (ARRT): ${countryCounts.usa}, Canada (CAMRT): ${countryCounts.canada}`);

  console.log("\n--- Clearing existing radiography lesson data (scoped to arrt/camrt exam_type) ---");
  for (const cat of categories) {
    try {
      const r = await pool.query(
        `DELETE FROM imaging_physics_topics WHERE category = $1 AND exam_type IN ('arrt', 'camrt')`,
        [cat]
      );
      console.log(`  Cleared ${r.rowCount} existing entries for category: ${cat}`);
    } catch (err: any) {
      console.log(`  Skip clear for ${cat}: ${err.message.substring(0, 80)}`);
    }
  }

  console.log("\n--- Inserting lessons ---");
  let inserted = 0;
  let errors = 0;

  for (const l of lessons) {
    try {
      await pool.query(
        `INSERT INTO imaging_physics_topics (
          id, title, slug, content, explanation, category, modality, country, exam_type,
          key_concepts, quiz_items, difficulty, sort_order,
          seo_title, seo_description, status, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, 'X-ray', $6, $7,
          $8, $9, $10, $11,
          $12, $13, 'published', NOW(), NOW()
        )`,
        [
          l.title,
          l.slug,
          l.content,
          l.explanation,
          l.category,
          l.country,
          l.examType,
          l.keyConcepts,
          JSON.stringify(l.quizItems),
          l.difficulty,
          inserted,
          l.seoTitle,
          l.seoDescription,
        ]
      );
      inserted++;
    } catch (err: any) {
      errors++;
      if (errors <= 10) console.error(`  Error inserting "${l.title}": ${err.message}`);
    }
  }

  console.log(`\n--- Results ---`);
  console.log(`  Inserted: ${inserted}`);
  console.log(`  Errors: ${errors}`);

  console.log("\n--- Verification ---");
  for (const cat of categories) {
    const usaCount = await pool.query(
      `SELECT COUNT(*) FROM imaging_physics_topics WHERE category = $1 AND country = 'usa' AND status = 'published'`,
      [cat]
    );
    const canCount = await pool.query(
      `SELECT COUNT(*) FROM imaging_physics_topics WHERE category = $1 AND country = 'canada' AND status = 'published'`,
      [cat]
    );
    console.log(`  ${cat}: USA=${usaCount.rows[0].count}, Canada=${canCount.rows[0].count}`);
  }

  const totalPublished = await pool.query(
    `SELECT COUNT(*) FROM imaging_physics_topics WHERE status = 'published' AND category IN (${categories.map((_, i) => `$${i + 1}`).join(',')})`,
    categories
  );
  console.log(`\n  Total published radiography lessons: ${totalPublished.rows[0].count}`);

  console.log("\n=== Seeding Complete! ===\n");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
