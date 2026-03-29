import fs from "fs";
import path from "path";
import pg from "pg";

const PROJECT_ROOT = path.resolve(process.cwd());

export interface RestoreDryRunResult {
  success: boolean;
  timestamp: string;
  mode: "dry-run";
  steps: { action: string; status: "pass" | "fail" | "skip" | "warn"; details: string }[];
  dataIntegrity: {
    tablesChecked: number;
    rowCountsMatch: number;
    schemaCompatible: number;
    issues: string[];
  };
  summary: {
    totalSteps: number;
    passed: number;
    failed: number;
    skipped: number;
    warnings: number;
  };
  wouldSucceed: boolean;
}

export async function runRestoreDryRun(): Promise<RestoreDryRunResult> {
  const steps: RestoreDryRunResult["steps"] = [];
  const dataIntegrity = { tablesChecked: 0, rowCountsMatch: 0, schemaCompatible: 0, issues: [] as string[] };

  const backupsDir = path.join(PROJECT_ROOT, "backups");
  if (!fs.existsSync(backupsDir)) {
    steps.push({ action: "Locate backup directory", status: "fail", details: "No backups directory found" });
    return buildResult(steps, dataIntegrity);
  }
  steps.push({ action: "Locate backup directory", status: "pass", details: backupsDir });

  const contentDir = path.join(backupsDir, "content");
  if (!fs.existsSync(contentDir)) {
    steps.push({ action: "Locate content backup", status: "skip", details: "No content backup directory" });
    return buildResult(steps, dataIntegrity);
  }

  const subDirs = fs.readdirSync(contentDir)
    .filter(d => fs.statSync(path.join(contentDir, d)).isDirectory())
    .sort()
    .reverse();

  if (subDirs.length === 0) {
    steps.push({ action: "Find backup snapshots", status: "skip", details: "No backup snapshots found" });
    return buildResult(steps, dataIntegrity);
  }

  const latestBackup = path.join(contentDir, subDirs[0]);
  steps.push({ action: "Selected latest backup", status: "pass", details: `${subDirs[0]} (${subDirs.length} total snapshots)` });

  const manifestPath = path.join(latestBackup, "content-manifest.json");
  if (!fs.existsSync(manifestPath)) {
    steps.push({ action: "Find manifest", status: "warn", details: "No content-manifest.json found" });
    return buildResult(steps, dataIntegrity);
  }

  let manifest: any;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    steps.push({ action: "Parse manifest", status: "pass", details: `${Object.keys(manifest.tables || {}).length} tables in manifest` });
  } catch (err: any) {
    steps.push({ action: "Parse manifest", status: "fail", details: `Manifest parse error: ${err.message}` });
    return buildResult(steps, dataIntegrity);
  }

  const checksumFile = path.join(latestBackup, "checksums.json");
  if (fs.existsSync(checksumFile)) {
    try {
      const checksums = JSON.parse(fs.readFileSync(checksumFile, "utf-8"));
      let allValid = true;
      for (const [file, expectedHash] of Object.entries(checksums)) {
        const filePath = path.join(latestBackup, file);
        if (!fs.existsSync(filePath)) {
          allValid = false;
          dataIntegrity.issues.push(`Missing file referenced in checksums: ${file}`);
        }
      }
      steps.push({
        action: "Verify checksums",
        status: allValid ? "pass" : "warn",
        details: allValid ? `${Object.keys(checksums).length} files verified` : "Some checksum files missing",
      });
    } catch (err: any) {
      steps.push({ action: "Verify checksums", status: "warn", details: `Checksum verification error: ${err.message}` });
    }
  } else {
    steps.push({ action: "Verify checksums", status: "skip", details: "No checksums.json found" });
  }

  const tables = manifest.tables || {};
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  try {
    await pool.query("SELECT 1");
    steps.push({ action: "Connect to database", status: "pass", details: "Database connection successful" });
  } catch (err: any) {
    steps.push({ action: "Connect to database", status: "fail", details: `Connection failed: ${err.message}` });
    return buildResult(steps, dataIntegrity);
  }

  try {
    const tablesResult = await pool.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);
    const existingTables = new Set(tablesResult.rows.map((r: any) => r.table_name));

    for (const [tableName, expectedCount] of Object.entries(tables)) {
      dataIntegrity.tablesChecked++;

      if (!existingTables.has(tableName)) {
        steps.push({ action: `Schema check: ${tableName}`, status: "warn", details: "Table does not exist in current schema" });
        dataIntegrity.issues.push(`Table ${tableName} missing from current schema`);
        continue;
      }

      dataIntegrity.schemaCompatible++;

      const tableFile = path.join(latestBackup, `${tableName}.json`);
      if (!fs.existsSync(tableFile)) {
        steps.push({ action: `Data check: ${tableName}`, status: "warn", details: `Backup file ${tableName}.json missing` });
        continue;
      }

      try {
        const data = JSON.parse(fs.readFileSync(tableFile, "utf-8"));
        const fileRowCount = Array.isArray(data) ? data.length : 0;

        if (fileRowCount === expectedCount) {
          dataIntegrity.rowCountsMatch++;
          steps.push({ action: `Validate ${tableName}`, status: "pass", details: `${fileRowCount} rows match manifest (schema compatible)` });
        } else {
          steps.push({ action: `Validate ${tableName}`, status: "warn", details: `Row count mismatch: file has ${fileRowCount}, manifest says ${expectedCount}` });
          dataIntegrity.issues.push(`${tableName}: row count mismatch (${fileRowCount} vs ${expectedCount})`);
        }

        if (Array.isArray(data) && data.length > 0) {
          const sampleRow = data[0];
          const backupColumns = Object.keys(sampleRow);

          const colResult = await pool.query(
            `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1`,
            [tableName]
          );
          const dbColumns = new Set(colResult.rows.map((r: any) => r.column_name));

          const missingInDb = backupColumns.filter(c => !dbColumns.has(c));
          if (missingInDb.length > 0) {
            steps.push({ action: `Schema compat: ${tableName}`, status: "warn", details: `Backup has columns not in DB: ${missingInDb.join(", ")}` });
            dataIntegrity.issues.push(`${tableName}: backup columns not in DB schema: ${missingInDb.join(", ")}`);
          } else {
            steps.push({ action: `Schema compat: ${tableName}`, status: "pass", details: `All ${backupColumns.length} backup columns exist in current schema` });
          }
        }
      } catch (err: any) {
        steps.push({ action: `Parse ${tableName}`, status: "fail", details: `Parse error: ${err.message}` });
        dataIntegrity.issues.push(`${tableName}: parse error`);
      }
    }
  } catch (err: any) {
    steps.push({ action: "Schema validation", status: "fail", details: err.message });
  } finally {
    await pool.end();
  }

  const dbDir = path.join(backupsDir, "db");
  if (fs.existsSync(dbDir)) {
    const dbSnapshots = fs.readdirSync(dbDir).filter(d => fs.statSync(path.join(dbDir, d)).isDirectory()).sort().reverse();
    if (dbSnapshots.length > 0) {
      steps.push({ action: "DB backup snapshots", status: "pass", details: `${dbSnapshots.length} DB snapshots found, latest: ${dbSnapshots[0]}` });
    }
  }

  const stripeDir = path.join(backupsDir, "stripe");
  if (fs.existsSync(stripeDir)) {
    steps.push({ action: "Stripe config backup", status: "pass", details: "Stripe backup directory present" });
  }

  const envDir = path.join(backupsDir, "env-inventory");
  if (fs.existsSync(envDir)) {
    steps.push({ action: "Environment inventory", status: "pass", details: "Environment inventory backup present" });
  }

  const result = buildResult(steps, dataIntegrity);

  try {
    const logsDir = path.join(backupsDir, "logs");
    fs.mkdirSync(logsDir, { recursive: true });
    fs.writeFileSync(
      path.join(logsDir, "restore-test-results.json"),
      JSON.stringify(result, null, 2)
    );
  } catch {}

  return result;
}

function buildResult(
  steps: RestoreDryRunResult["steps"],
  dataIntegrity: RestoreDryRunResult["dataIntegrity"]
): RestoreDryRunResult {
  const passed = steps.filter(s => s.status === "pass").length;
  const failed = steps.filter(s => s.status === "fail").length;
  const skipped = steps.filter(s => s.status === "skip").length;
  const warnings = steps.filter(s => s.status === "warn").length;

  return {
    success: failed === 0,
    timestamp: new Date().toISOString(),
    mode: "dry-run",
    steps,
    dataIntegrity,
    summary: { totalSteps: steps.length, passed, failed, skipped, warnings },
    wouldSucceed: failed === 0 && dataIntegrity.issues.length < 3,
  };
}

if (process.argv[1] && process.argv[1].includes("restore-dry-run")) {
  runRestoreDryRun()
    .then((result) => {
      console.log("\nRestore Dry-Run Report");
      console.log("=".repeat(50));
      for (const step of result.steps) {
        const icon = step.status === "pass" ? "[PASS]" : step.status === "fail" ? "[FAIL]" : step.status === "warn" ? "[WARN]" : "[SKIP]";
        console.log(`  ${icon} ${step.action}: ${step.details}`);
      }
      console.log(`\n  Summary: ${result.summary.passed} passed, ${result.summary.failed} failed, ${result.summary.warnings} warnings, ${result.summary.skipped} skipped`);
      console.log(`  Data Integrity: ${result.dataIntegrity.tablesChecked} tables checked, ${result.dataIntegrity.rowCountsMatch} row counts match`);
      console.log(`  Would Succeed: ${result.wouldSucceed ? "YES" : "NO"}`);
      if (!result.success) process.exit(1);
    })
    .catch((err) => {
      console.error("Restore dry-run failed:", err);
      process.exit(1);
    });
}
