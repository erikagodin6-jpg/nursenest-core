import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import pg from "pg";
import { PROJECT_ROOT, getTimestamp, ensureDir, computeSHA256, writeChecksumFile, type BackupResult } from "./backup-engine";
import { logBackup } from "./backup-logger";

function pgDumpAvailable(): boolean {
  try {
    execSync("which pg_dump", { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

export async function runDbBackup(): Promise<BackupResult> {
  const startTime = Date.now();
  const timestamp = getTimestamp();
  const backupDir = path.join(PROJECT_ROOT, "backups", "db", timestamp);
  ensureDir(backupDir);

  const warnings: string[] = [];
  const errors: string[] = [];
  let fileCount = 0;
  const checksums: Record<string, string> = {};

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  try {
    if (pgDumpAvailable()) {
      const dumpPath = path.join(backupDir, "database-full.sql");
      try {
        execSync(`pg_dump "${dbUrl}" --no-owner --no-privileges > "${dumpPath}"`, {
          stdio: "pipe",
          maxBuffer: 500 * 1024 * 1024,
          timeout: 300000,
        });
        fileCount++;
        const checksum = computeSHA256(dumpPath);
        checksums["database-full.sql"] = checksum;
        writeChecksumFile(dumpPath, checksum);
        fileCount++;
      } catch (err: any) {
        warnings.push(`pg_dump failed: ${err.message}. Falling back to JSON export.`);
        const fallbackResult = await exportAllTablesAsJson(dbUrl, backupDir, checksums, fileCount, warnings, errors);
        fileCount = fallbackResult.fileCount;
      }
    } else {
      warnings.push("pg_dump not available. Using JSON export fallback.");
      const result = await exportAllTablesAsJson(dbUrl, backupDir, checksums, fileCount, warnings, errors);
      fileCount = result.fileCount;
    }

    const pool = new pg.Pool({ connectionString: dbUrl });
    try {
      const tablesResult = await pool.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);

      const tableManifest: Record<string, { rowCount: number; columns: any[] }> = {};

      for (const row of tablesResult.rows) {
        const tableName = row.table_name;
        try {
          const countResult = await pool.query(`SELECT COUNT(*) as cnt FROM "${tableName}"`);
          const columnsResult = await pool.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = $1
            ORDER BY ordinal_position
          `, [tableName]);

          tableManifest[tableName] = {
            rowCount: parseInt(countResult.rows[0].cnt),
            columns: columnsResult.rows,
          };
        } catch (err: any) {
          tableManifest[tableName] = { rowCount: -1, columns: [] };
          warnings.push(`Could not query table ${tableName}: ${err.message}`);
        }
      }

      const manifestPath = path.join(backupDir, "db-manifest.json");
      fs.writeFileSync(manifestPath, JSON.stringify(tableManifest, null, 2));
      fileCount++;
      checksums["db-manifest.json"] = computeSHA256(manifestPath);
    } finally {
      await pool.end();
    }

    const schemaPath = path.join(PROJECT_ROOT, "shared", "schema.ts");
    if (fs.existsSync(schemaPath)) {
      fs.copyFileSync(schemaPath, path.join(backupDir, "schema.ts"));
      fileCount++;
    }

    const migrationsDir = path.join(PROJECT_ROOT, "migrations");
    if (fs.existsSync(migrationsDir)) {
      const migOut = path.join(backupDir, "migrations");
      ensureDir(migOut);
      const migFiles = fs.readdirSync(migrationsDir);
      for (const f of migFiles) {
        const src = path.join(migrationsDir, f);
        if (fs.statSync(src).isFile()) {
          fs.copyFileSync(src, path.join(migOut, f));
          fileCount++;
        }
      }
    }

    const checksumManifestPath = path.join(backupDir, "checksums.json");
    fs.writeFileSync(checksumManifestPath, JSON.stringify(checksums, null, 2));
    fileCount++;

    const status = errors.length > 0 ? "partial" : "success";
    const result: BackupResult = {
      timestamp,
      type: "db",
      status,
      fileCount,
      archiveSize: 0,
      archivePath: backupDir,
      warnings,
      errors,
      duration: Date.now() - startTime,
      manifest: { checksums },
    };

    await logBackup({
      type: "db",
      timestamp: new Date().toISOString(),
      archivePath: backupDir,
      size: 0,
      fileCount,
      status,
    });

    return result;
  } catch (err: any) {
    errors.push(err.message);
    const result: BackupResult = {
      timestamp,
      type: "db",
      status: "failed",
      fileCount: 0,
      archiveSize: 0,
      archivePath: backupDir,
      warnings,
      errors,
      duration: Date.now() - startTime,
    };
    await logBackup({
      type: "db",
      timestamp: new Date().toISOString(),
      archivePath: backupDir,
      size: 0,
      fileCount: 0,
      status: "failed",
    });
    return result;
  }
}

async function exportAllTablesAsJson(
  dbUrl: string,
  backupDir: string,
  checksums: Record<string, string>,
  initialFileCount: number,
  warnings: string[],
  errors: string[]
): Promise<{ fileCount: number }> {
  let fileCount = initialFileCount;
  const pool = new pg.Pool({ connectionString: dbUrl });

  try {
    const tablesResult = await pool.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    const SENSITIVE_TABLES = new Set(["sessions"]);
    const SENSITIVE_COLUMNS = new Set([
      "password",
      "stripe_customer_id",
      "stripe_subscription_id",
      "stripe_payment_intent_id",
    ]);

    const tablesDir = path.join(backupDir, "tables");
    ensureDir(tablesDir);

    for (const row of tablesResult.rows) {
      const tableName = row.table_name;
      if (SENSITIVE_TABLES.has(tableName)) continue;

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

        const filePath = path.join(tablesDir, `${tableName}.json`);
        fs.writeFileSync(filePath, JSON.stringify(result.rows, null, 2));
        fileCount++;
        checksums[`tables/${tableName}.json`] = computeSHA256(filePath);
      } catch (err: any) {
        warnings.push(`Failed to export table ${tableName}: ${err.message}`);
      }
    }

    const drizzleConfig = path.join(PROJECT_ROOT, "drizzle.config.ts");
    if (fs.existsSync(drizzleConfig)) {
      fs.copyFileSync(drizzleConfig, path.join(backupDir, "drizzle.config.ts"));
      fileCount++;
    }

    try {
      const pricingResult = await pool.query(
        `SELECT id, tier, duration, is_lifetime, price_cad, price_usd, is_enabled, is_popular, feature_list, display_order
         FROM pricing_plans ORDER BY display_order`
      );
      if (pricingResult.rows.length > 0) {
        fs.writeFileSync(
          path.join(backupDir, "stripe-pricing-config.json"),
          JSON.stringify({
            exportedAt: new Date().toISOString(),
            plans: pricingResult.rows,
          }, null, 2)
        );
        fileCount++;
      }
    } catch (err: any) {
      errors.push(`Failed to export pricing config: ${err.message}`);
    }

    try {
      const snapshotResult = await pool.query(
        `SELECT id, content_id, version, title, slug, snapshot_type, created_at
         FROM content_snapshots ORDER BY created_at DESC LIMIT 100`
      );
      if (snapshotResult.rows.length > 0) {
        fs.writeFileSync(
          path.join(backupDir, "content-snapshots-index.json"),
          JSON.stringify({
            exportedAt: new Date().toISOString(),
            totalSnapshots: snapshotResult.rows.length,
            snapshots: snapshotResult.rows,
          }, null, 2)
        );
        fileCount++;
      }
    } catch (err: any) {
      errors.push(`Failed to export content snapshots index: ${err.message}`);
    }

    try {
      const payloadResult = await pool.query(
        `SELECT content_id, payload_type, version, validated_at, created_at
         FROM render_payloads ORDER BY created_at DESC LIMIT 200`
      );
      if (payloadResult.rows.length > 0) {
        fs.writeFileSync(
          path.join(backupDir, "render-payloads-index.json"),
          JSON.stringify({
            exportedAt: new Date().toISOString(),
            totalPayloads: payloadResult.rows.length,
            payloads: payloadResult.rows,
          }, null, 2)
        );
        fileCount++;
      }
    } catch (err: any) {
      errors.push(`Failed to export render payloads index: ${err.message}`);
    }
  } finally {
    await pool.end();
  }

  return { fileCount };
}

if (process.argv[1] && process.argv[1].includes("backup-db")) {
  runDbBackup()
    .then((result) => {
      console.log("Database backup completed:");
      console.log(`  Output: ${result.archivePath}`);
      console.log(`  Files: ${result.fileCount}`);
      console.log(`  Status: ${result.status}`);
      if (result.warnings.length > 0) console.log(`  Warnings: ${result.warnings.length}`);
    })
    .catch((err) => {
      console.error("Database backup failed:", err);
      process.exit(1);
    });
}
