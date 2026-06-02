import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import pg from "pg";
import { PROJECT_ROOT, ensureDir } from "./backup-engine";

export interface RestoreOptions {
  dryRun?: boolean;
  backupPath?: string;
  targetDbUrl?: string;
}

export async function restoreDatabase(options: RestoreOptions = {}): Promise<{
  success: boolean;
  steps: { action: string; status: string; details: string }[];
}> {
  const { dryRun = false, targetDbUrl } = options;
  const dbUrl = targetDbUrl || process.env.DATABASE_URL;
  const steps: { action: string; status: string; details: string }[] = [];

  if (!dbUrl) {
    steps.push({ action: "Check DATABASE_URL", status: "failed", details: "DATABASE_URL not set" });
    return { success: false, steps };
  }

  const backupsDir = path.join(PROJECT_ROOT, "backups", "db");
  if (!fs.existsSync(backupsDir)) {
    steps.push({ action: "Find backup directory", status: "failed", details: "No db backups found" });
    return { success: false, steps };
  }

  const backupDirs = fs.readdirSync(backupsDir)
    .filter(d => fs.statSync(path.join(backupsDir, d)).isDirectory())
    .sort()
    .reverse();

  if (backupDirs.length === 0) {
    steps.push({ action: "Find backup", status: "failed", details: "No db backup directories found" });
    return { success: false, steps };
  }

  const backupPath = options.backupPath || path.join(backupsDir, backupDirs[0]);
  steps.push({ action: "Selected backup", status: "ok", details: backupPath });

  const sqlDump = path.join(backupPath, "database-full.sql");
  const tablesDir = path.join(backupPath, "tables");

  if (fs.existsSync(sqlDump)) {
    steps.push({ action: "Found SQL dump", status: "ok", details: sqlDump });

    if (dryRun) {
      const stat = fs.statSync(sqlDump);
      steps.push({ action: "Would restore SQL dump", status: "dry-run", details: `${(stat.size / 1024 / 1024).toFixed(2)} MB dump file` });
    } else {
      try {
        execSync(`psql "${dbUrl}" < "${sqlDump}"`, {
          stdio: "pipe",
          maxBuffer: 500 * 1024 * 1024,
          timeout: 600000,
        });
        steps.push({ action: "Restored SQL dump", status: "ok", details: "psql import successful" });
      } catch (err: any) {
        steps.push({ action: "Restore SQL dump", status: "failed", details: err.message });
        return { success: false, steps };
      }
    }
  } else if (fs.existsSync(tablesDir)) {
    steps.push({ action: "Found JSON table exports", status: "ok", details: tablesDir });

    const tableFiles = fs.readdirSync(tablesDir).filter(f => f.endsWith(".json"));
    steps.push({ action: "Tables to restore", status: "ok", details: `${tableFiles.length} tables` });

    if (dryRun) {
      for (const tf of tableFiles) {
        const tableName = tf.replace(".json", "");
        const data = JSON.parse(fs.readFileSync(path.join(tablesDir, tf), "utf-8"));
        steps.push({ action: `Would restore ${tableName}`, status: "dry-run", details: `${data.length} rows` });
      }
    } else {
      const pool = new pg.Pool({ connectionString: dbUrl });
      try {
        for (const tf of tableFiles) {
          const tableName = tf.replace(".json", "");
          const data = JSON.parse(fs.readFileSync(path.join(tablesDir, tf), "utf-8"));

          if (data.length === 0) {
            steps.push({ action: `Skip ${tableName}`, status: "ok", details: "0 rows" });
            continue;
          }

          const columns = Object.keys(data[0]);
          const colList = columns.map(c => `"${c}"`).join(", ");
          const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");

          let inserted = 0;
          for (const row of data) {
            const values = columns.map(c => row[c]);
            try {
              await pool.query(
                `INSERT INTO "${tableName}" (${colList}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
                values
              );
              inserted++;
            } catch (err: any) {
              if (!err.message.includes("duplicate key") && !err.message.includes("already exists")) {
                steps.push({ action: `Insert into ${tableName}`, status: "warning", details: err.message });
              }
            }
          }
          steps.push({ action: `Restored ${tableName}`, status: "ok", details: `${inserted}/${data.length} rows` });
        }
      } finally {
        await pool.end();
      }
    }
  } else {
    const migrationsDir = path.join(backupPath, "migrations");
    if (fs.existsSync(migrationsDir)) {
      steps.push({ action: "Found migrations", status: "ok", details: migrationsDir });
      if (dryRun) {
        const migFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith(".sql"));
        steps.push({ action: "Would apply migrations", status: "dry-run", details: `${migFiles.length} migration files` });
      } else {
        const migFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith(".sql")).sort();
        for (const mf of migFiles) {
          try {
            execSync(`psql "${dbUrl}" < "${path.join(migrationsDir, mf)}"`, { stdio: "pipe" });
            steps.push({ action: `Applied migration ${mf}`, status: "ok", details: "Success" });
          } catch (err: any) {
            steps.push({ action: `Apply migration ${mf}`, status: "warning", details: err.message });
          }
        }
      }
    } else {
      steps.push({ action: "Find restorable data", status: "failed", details: "No SQL dump, JSON exports, or migrations found" });
      return { success: false, steps };
    }
  }

  return { success: true, steps };
}

if (process.argv[1] && process.argv[1].includes("restore-db")) {
  const dryRun = process.argv.includes("--dry-run");
  const backupPath = process.argv.find(a => !a.startsWith("--") && a !== process.argv[0] && a !== process.argv[1]);
  restoreDatabase({ dryRun, backupPath })
    .then((result) => {
      console.log(`\nDatabase Restore ${dryRun ? "(DRY RUN)" : ""}`);
      console.log("=".repeat(40));
      for (const step of result.steps) {
        console.log(`  [${step.status.toUpperCase()}] ${step.action}: ${step.details}`);
      }
      console.log(`\nResult: ${result.success ? "SUCCESS" : "FAILED"}`);
      if (!result.success) process.exit(1);
    })
    .catch((err) => {
      console.error("Restore failed:", err);
      process.exit(1);
    });
}
