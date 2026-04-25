import fs from "fs";
import path from "path";
import pg from "pg";
import {
  PROJECT_ROOT,
  getTimestamp,
  ensureDir,
  computeSHA256,
  writeChecksumFile,
  type BackupResult,
} from "./backup-engine";
import { logBackup } from "./backup-logger";

// ─── Configuration ────────────────────────────────────────────────────────────

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
] as const;

const SENSITIVE_COLUMNS = new Set([
  "password",
  "password_hash",
  "stripe_customer_id",
  "stripe_subscription_id",
  "stripe_payment_intent_id",
  "stripe_price_id",
  "stripe_product_id",
  "api_key",
  "secret",
  "token",
  "refresh_token",
  "access_token",
]);

// Pool connection limits — content backup should not starve the app
const DB_POOL_MAX = 3;
const DB_QUERY_TIMEOUT_MS = 60_000;
const DB_CONNECTION_TIMEOUT_MS = 10_000;
const BACKUP_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ROWS_PER_TABLE = 500_000; // safety cap — warn if exceeded
const LOCK_PATH = path.join(PROJECT_ROOT, "backups", "content.lock");

// ─── Helpers ──────────────────────────────────────────────────────────────────

function releaseLock(): void {
  try { fs.unlinkSync(LOCK_PATH); } catch {}
}

function acquireLock(): void {
  try {
    fs.mkdirSync(path.dirname(LOCK_PATH), { recursive: true });
    fs.writeFileSync(LOCK_PATH, String(process.pid), { flag: "wx" });
  } catch {
    throw new Error(
      "Content backup is already running (lock file exists). " +
        "If this is stale, delete: " + LOCK_PATH,
    );
  }
}

function getDirectorySizeBytes(dir: string): number {
  try {
    let total = 0;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      try {
        total += entry.isDirectory()
          ? getDirectorySizeBytes(full)
          : fs.statSync(full).size;
      } catch {}
    }
    return total;
  } catch {
    return 0;
  }
}

function safeComputeSHA256(filePath: string, warnings: string[]): string | null {
  try {
    return computeSHA256(filePath);
  } catch (err: any) {
    warnings.push(`Checksum failed for ${path.basename(filePath)}: ${err.message}`);
    return null;
  }
}

function safeWriteJson(filePath: string, data: unknown, errors: string[]): boolean {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err: any) {
    errors.push(`Failed to write ${path.basename(filePath)}: ${err.message}`);
    return false;
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function runContentBackup(): Promise<BackupResult> {
  const startTime = Date.now();
  const timestamp = getTimestamp();
  const backupDir = path.join(PROJECT_ROOT, "backups", "content", timestamp);
  const warnings: string[] = [];
  const errors: string[] = [];
  let fileCount = 0;
  const checksums: Record<string, string> = {};
  const tableManifest: Record<string, number> = {};

  // ── Pre-flight checks ──────────────────────────────────────────────────────

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  try {
    ensureDir(backupDir);
  } catch (err: any) {
    throw new Error(`Failed to create backup directory ${backupDir}: ${err.message}`);
  }

  acquireLock();

  const timeoutHandle = setTimeout(() => {
    releaseLock();
    console.error(`Content backup timed out after ${BACKUP_TIMEOUT_MS / 1000}s`);
    process.exit(1);
  }, BACKUP_TIMEOUT_MS);
  timeoutHandle.unref();

  // ── Database connection ────────────────────────────────────────────────────

  const pool = new pg.Pool({
    connectionString: dbUrl,
    max: DB_POOL_MAX,
    connectionTimeoutMillis: DB_CONNECTION_TIMEOUT_MS,
    statement_timeout: DB_QUERY_TIMEOUT_MS,
    // Read-only application_name helps identify this connection in pg_stat_activity
    application_name: "nursenest_content_backup",
  });

  // Verify connectivity before doing any work
  try {
    await pool.query("SELECT 1");
  } catch (err: any) {
    releaseLock();
    clearTimeout(timeoutHandle);
    await pool.end().catch(() => {});
    throw new Error(`Cannot connect to database: ${err.message}`);
  }

  try {
    // ── Discover existing tables ─────────────────────────────────────────────

    let existingTables: Set<string>;
    try {
      const tablesResult = await pool.query<{ table_name: string }>(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);
      existingTables = new Set(tablesResult.rows.map((r) => r.table_name));
    } catch (err: any) {
      throw new Error(`Failed to query information_schema: ${err.message}`);
    }

    // ── Export each table ────────────────────────────────────────────────────

    for (const tableName of CONTENT_TABLES) {
      if (!existingTables.has(tableName)) {
        warnings.push(`Table "${tableName}" does not exist — skipping`);
        continue;
      }

      try {
        // Discover columns, filtering sensitive ones
        const columnsResult = await pool.query<{ column_name: string }>(`
          SELECT column_name
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position
        `, [tableName]);

        const safeCols = columnsResult.rows
          .map((r) => r.column_name)
          .filter((c) => !SENSITIVE_COLUMNS.has(c));

        if (safeCols.length === 0) {
          warnings.push(`Table "${tableName}" has no exportable columns after filtering — skipping`);
          continue;
        }

        // Row count check before full fetch — warn on very large tables
        const countResult = await pool.query<{ count: string }>(
          `SELECT COUNT(*) AS count FROM "${tableName}"`,
        );
        const rowCount = parseInt(countResult.rows[0]?.count ?? "0", 10);

        if (rowCount > MAX_ROWS_PER_TABLE) {
          warnings.push(
            `Table "${tableName}" has ${rowCount.toLocaleString()} rows — exceeds cap of ${MAX_ROWS_PER_TABLE.toLocaleString()}, exporting anyway but review backup size`,
          );
        }

        const colList = safeCols.map((c) => `"${c}"`).join(", ");
        const dataResult = await pool.query(
          `SELECT ${colList} FROM "${tableName}" ORDER BY 1`,
        );

        const filePath = path.join(backupDir, `${tableName}.json`);
        const written = safeWriteJson(filePath, dataResult.rows, errors);

        if (written) {
          fileCount++;
          tableManifest[tableName] = dataResult.rows.length;
          const checksum = safeComputeSHA256(filePath, warnings);
          if (checksum) checksums[`${tableName}.json`] = checksum;
        }
      } catch (err: any) {
        errors.push(`Failed to export table "${tableName}": ${err.message}`);
      }
    }

    // ── Manifest ─────────────────────────────────────────────────────────────

    const manifestPath = path.join(backupDir, "content-manifest.json");
    const manifestWritten = safeWriteJson(
      manifestPath,
      {
        generatedAt: new Date().toISOString(),
        timestamp,
        tables: tableManifest,
        totalTables: Object.keys(tableManifest).length,
        totalRows: Object.values(tableManifest).reduce((a, b) => a + b, 0),
        warnings,
        errors,
      },
      errors,
    );
    if (manifestWritten) {
      fileCount++;
      const checksum = safeComputeSHA256(manifestPath, warnings);
      if (checksum) checksums["content-manifest.json"] = checksum;
    }

    // ── Checksums file ────────────────────────────────────────────────────────

    const checksumPath = path.join(backupDir, "checksums.json");
    const checksumWritten = safeWriteJson(checksumPath, checksums, errors);
    if (checksumWritten) fileCount++;

  } finally {
    await pool.end().catch((err: any) => {
      // Pool shutdown failure is non-fatal but should be visible
      console.error("pg pool failed to shut down cleanly:", err.message);
    });
    clearTimeout(timeoutHandle);
    releaseLock();
  }

  // ── Result ──────────────────────────────────────────────────────────────────

  const archiveSize = getDirectorySizeBytes(backupDir);
  const status: BackupResult["status"] =
    errors.length > 0 ? "partial" : warnings.length > 0 ? "partial" : "success";

  const result: BackupResult = {
    timestamp,
    type: "content",
    status,
    fileCount,
    archiveSize,
    archivePath: backupDir,
    warnings,
    errors,
    duration: Date.now() - startTime,
    manifest: { tables: tableManifest, checksums },
  };

  try {
    await logBackup({
      type: "content",
      timestamp: new Date().toISOString(),
      archivePath: backupDir,
      size: archiveSize,
      fileCount,
      status,
    });
  } catch (err: any) {
    // Log failure must never suppress the backup result
    result.warnings.push(`logBackup failed: ${err.message}`);
  }

  return result;
}

// ─── CLI entry point ──────────────────────────────────────────────────────────

if (process.argv[1] && process.argv[1].includes("backup-content")) {
  runContentBackup()
    .then((result) => {
      console.log("Content backup completed:");
      console.log(`  Output:     ${result.archivePath}`);
      console.log(`  Files:      ${result.fileCount}`);
      console.log(`  Size:       ${(result.archiveSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  Duration:   ${result.duration}ms`);
      console.log(`  Status:     ${result.status}`);
      if (result.manifest?.tables) {
        const tables = result.manifest.tables as Record<string, number>;
        console.log(`  Tables:     ${Object.keys(tables).length}`);
        console.log(`  Total rows: ${Object.values(tables).reduce((a: number, b: number) => a + b, 0).toLocaleString()}`);
      }
      if (result.warnings.length > 0) {
        console.warn("  Warnings:");
        result.warnings.forEach((w) => console.warn(`    - ${w}`));
      }
      if (result.errors.length > 0) {
        console.error("  Errors:");
        result.errors.forEach((e) => console.error(`    - ${e}`));
        process.exit(1);
      }
    })
    .catch((err) => {
      console.error("Content backup failed:", err);
      process.exit(1);
    });
}