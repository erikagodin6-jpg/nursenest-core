import fs from "fs";
import path from "path";
import pg from "pg";
import { PROJECT_ROOT } from "./backup-engine";

export interface RestoreTestResult {
  success: boolean;
  timestamp: string;
  steps: { action: string; status: "pass" | "fail" | "skip"; details: string }[];
}

export async function runRestoreTest(): Promise<RestoreTestResult> {
  const testDbUrl = process.env.TEST_DATABASE_URL;
  const steps: { action: string; status: "pass" | "fail" | "skip"; details: string }[] = [];

  if (!testDbUrl) {
    steps.push({
      action: "Check TEST_DATABASE_URL",
      status: "skip",
      details: "TEST_DATABASE_URL not set. Set it to run restore tests against a test database.",
    });
    return { success: true, timestamp: new Date().toISOString(), steps };
  }

  const pool = new pg.Pool({ connectionString: testDbUrl });

  try {
    await pool.query("SELECT 1");
    steps.push({ action: "Connect to test database", status: "pass", details: "Connection successful" });
  } catch (err: any) {
    steps.push({ action: "Connect to test database", status: "fail", details: err.message });
    return { success: false, timestamp: new Date().toISOString(), steps };
  }

  const contentDir = path.join(PROJECT_ROOT, "backups", "content");
  if (!fs.existsSync(contentDir)) {
    steps.push({ action: "Find content backup", status: "skip", details: "No content backup directory" });
    await pool.end();
    return { success: true, timestamp: new Date().toISOString(), steps };
  }

  const subDirs = fs.readdirSync(contentDir)
    .filter(d => fs.statSync(path.join(contentDir, d)).isDirectory())
    .sort()
    .reverse();

  if (subDirs.length === 0) {
    steps.push({ action: "Find content backup", status: "skip", details: "No content backup directories" });
    await pool.end();
    return { success: true, timestamp: new Date().toISOString(), steps };
  }

  const backupPath = path.join(contentDir, subDirs[0]);
  steps.push({ action: "Selected content backup", status: "pass", details: backupPath });

  const manifestPath = path.join(backupPath, "content-manifest.json");
  if (!fs.existsSync(manifestPath)) {
    steps.push({ action: "Find manifest", status: "skip", details: "No content-manifest.json" });
    await pool.end();
    return { success: true, timestamp: new Date().toISOString(), steps };
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  const tables = manifest.tables || {};

  try {
    const tablesResult = await pool.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);
    const existingTables = new Set(tablesResult.rows.map((r: any) => r.table_name));

    for (const [tableName, expectedCount] of Object.entries(tables)) {
      if (!existingTables.has(tableName)) {
        steps.push({
          action: `Verify table ${tableName}`,
          status: "skip",
          details: "Table does not exist in test database",
        });
        continue;
      }

      const tableFile = path.join(backupPath, `${tableName}.json`);
      if (!fs.existsSync(tableFile)) {
        steps.push({
          action: `Verify ${tableName} backup file`,
          status: "fail",
          details: `File ${tableName}.json missing from backup`,
        });
        continue;
      }

      const data = JSON.parse(fs.readFileSync(tableFile, "utf-8"));
      if (data.length !== expectedCount) {
        steps.push({
          action: `Verify ${tableName} row count`,
          status: "fail",
          details: `Manifest says ${expectedCount} rows, file has ${data.length}`,
        });
      } else {
        steps.push({
          action: `Verify ${tableName}`,
          status: "pass",
          details: `${data.length} rows match manifest`,
        });
      }

      if (data.length > 0) {
        const columns = Object.keys(data[0]);
        const colList = columns.map(c => `"${c}"`).join(", ");
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");

        try {
          await pool.query("BEGIN");
          const values = columns.map(c => data[0][c]);
          await pool.query(
            `INSERT INTO "${tableName}" (${colList}) VALUES (${placeholders})`,
            values
          );
          await pool.query("ROLLBACK");
          steps.push({
            action: `Test insert ${tableName}`,
            status: "pass",
            details: "Sample row inserted and rolled back successfully",
          });
        } catch (err: any) {
          try { await pool.query("ROLLBACK"); } catch {}
          steps.push({
            action: `Test insert ${tableName}`,
            status: "fail",
            details: `Insert failed: ${err.message}`,
          });
        }
      }
    }
  } catch (err: any) {
    steps.push({ action: "Run integrity queries", status: "fail", details: err.message });
  } finally {
    await pool.end();
  }

  const failures = steps.filter(s => s.status === "fail");
  return {
    success: failures.length === 0,
    timestamp: new Date().toISOString(),
    steps,
  };
}

if (process.argv[1] && process.argv[1].includes("restore-test")) {
  runRestoreTest()
    .then((result) => {
      console.log("\nRestore Test Report");
      console.log("=".repeat(40));
      for (const step of result.steps) {
        const icon = step.status === "pass" ? "[PASS]" : step.status === "fail" ? "[FAIL]" : "[SKIP]";
        console.log(`  ${icon} ${step.action}: ${step.details}`);
      }
      const passes = result.steps.filter(s => s.status === "pass").length;
      const failures = result.steps.filter(s => s.status === "fail").length;
      const skips = result.steps.filter(s => s.status === "skip").length;
      console.log(`\n  Summary: ${passes} passed, ${failures} failed, ${skips} skipped`);
      console.log(`  Result: ${result.success ? "PASS" : "FAIL"}`);
      if (!result.success) process.exit(1);
    })
    .catch((err) => {
      console.error("Restore test failed:", err);
      process.exit(1);
    });
}
