import fs from "fs";
import path from "path";
import pg from "pg";
import { PROJECT_ROOT, getTimestamp, ensureDir, computeSHA256, writeChecksumFile, type BackupResult } from "./backup-engine";
import { logBackup } from "./backup-logger";

const CONTENT_TABLES = [
  "content_items",
  "exam_questions",
  "flashcard_decks",
  "deck_flashcards",
  "allied_questions",
  "case_studies",
  "imaging_questions",
  "digital_products",
  "product_purchases",
  "lessons",
  "seo_pages",
  "blog_config",
  "pricing_plans",
  "lesson_aliases",
  "lesson_overrides",
  "exam_blueprints",
  "social_posts",
  "qotd_history",
  "question_type_registry",
  "mock_exam_templates",
  "content_translations",
  "medical_terminology_dictionary",
  "allied_health_articles",
  "allied_article_templates",
  "new_grad_templates",
  "new_grad_interview_questions",
  "new_grad_scenario_questions",
  "question_explanations",
  "tutor_admin_config",
];

const SENSITIVE_COLUMNS = new Set([
  "password",
  "stripe_customer_id",
  "stripe_subscription_id",
  "stripe_payment_intent_id",
]);

export async function runContentBackup(): Promise<BackupResult> {
  const startTime = Date.now();
  const timestamp = getTimestamp();
  const backupDir = path.join(PROJECT_ROOT, "backups", "content", timestamp);
  ensureDir(backupDir);

  const warnings: string[] = [];
  const errors: string[] = [];
  let fileCount = 0;
  const checksums: Record<string, string> = {};
  const tableManifest: Record<string, number> = {};

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const pool = new pg.Pool({ connectionString: dbUrl });

  try {
    const tablesResult = await pool.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    const existingTables = new Set(tablesResult.rows.map((r: any) => r.table_name));

    for (const tableName of CONTENT_TABLES) {
      if (!existingTables.has(tableName)) {
        warnings.push(`Table ${tableName} does not exist, skipping`);
        continue;
      }

      try {
        const columnsResult = await pool.query(`
          SELECT column_name FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position
        `, [tableName]);

        const safeCols = columnsResult.rows
          .map((r: any) => r.column_name)
          .filter((c: string) => !SENSITIVE_COLUMNS.has(c));

        if (safeCols.length === 0) continue;

        const colList = safeCols.map((c: string) => `"${c}"`).join(", ");
        const result = await pool.query(`SELECT ${colList} FROM "${tableName}"`);

        const filePath = path.join(backupDir, `${tableName}.json`);
        fs.writeFileSync(filePath, JSON.stringify(result.rows, null, 2));
        fileCount++;
        tableManifest[tableName] = result.rows.length;
        checksums[`${tableName}.json`] = computeSHA256(filePath);
      } catch (err: any) {
        errors.push(`Failed to export table ${tableName}: ${err.message}`);
      }
    }

    const manifestPath = path.join(backupDir, "content-manifest.json");
    fs.writeFileSync(manifestPath, JSON.stringify({
      generatedAt: new Date().toISOString(),
      timestamp,
      tables: tableManifest,
      totalTables: Object.keys(tableManifest).length,
      totalRows: Object.values(tableManifest).reduce((a, b) => a + b, 0),
      checksums,
    }, null, 2));
    fileCount++;

    const checksumPath = path.join(backupDir, "checksums.json");
    fs.writeFileSync(checksumPath, JSON.stringify(checksums, null, 2));
    fileCount++;
  } finally {
    await pool.end();
  }

  const status = errors.length > 0 ? "partial" : "success";
  const result: BackupResult = {
    timestamp,
    type: "content",
    status,
    fileCount,
    archiveSize: 0,
    archivePath: backupDir,
    warnings,
    errors,
    duration: Date.now() - startTime,
    manifest: { tables: tableManifest, checksums },
  };

  await logBackup({
    type: "content",
    timestamp: new Date().toISOString(),
    archivePath: backupDir,
    size: 0,
    fileCount,
    status,
  });

  return result;
}

if (process.argv[1] && process.argv[1].includes("backup-content")) {
  runContentBackup()
    .then((result) => {
      console.log("Content backup completed:");
      console.log(`  Output: ${result.archivePath}`);
      console.log(`  Files: ${result.fileCount}`);
      console.log(`  Status: ${result.status}`);
      if (result.manifest?.tables) {
        console.log(`  Tables: ${Object.keys(result.manifest.tables).length}`);
        console.log(`  Total rows: ${Object.values(result.manifest.tables as Record<string, number>).reduce((a: number, b: number) => a + b, 0)}`);
      }
    })
    .catch((err) => {
      console.error("Content backup failed:", err);
      process.exit(1);
    });
}
