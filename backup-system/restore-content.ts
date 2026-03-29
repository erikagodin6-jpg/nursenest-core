import fs from "fs";
import path from "path";
import pg from "pg";
import { PROJECT_ROOT } from "./backup-engine";

export interface RestoreContentOptions {
  dryRun?: boolean;
  backupPath?: string;
  targetDbUrl?: string;
}

export async function restoreContent(options: RestoreContentOptions = {}): Promise<{
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

  const contentDir = path.join(PROJECT_ROOT, "backups", "content");
  if (!fs.existsSync(contentDir)) {
    steps.push({ action: "Find content backup", status: "failed", details: "No content backups found" });
    return { success: false, steps };
  }

  const subDirs = fs.readdirSync(contentDir)
    .filter(d => fs.statSync(path.join(contentDir, d)).isDirectory())
    .sort()
    .reverse();

  if (subDirs.length === 0) {
    steps.push({ action: "Find content backup", status: "failed", details: "No content backup directories" });
    return { success: false, steps };
  }

  const backupPath = options.backupPath || path.join(contentDir, subDirs[0]);
  steps.push({ action: "Selected content backup", status: "ok", details: backupPath });

  const jsonFiles = fs.readdirSync(backupPath).filter(f => f.endsWith(".json") && !f.includes("manifest") && !f.includes("checksum"));

  if (jsonFiles.length === 0) {
    steps.push({ action: "Find content files", status: "failed", details: "No JSON content files found" });
    return { success: false, steps };
  }

  steps.push({ action: "Content tables found", status: "ok", details: `${jsonFiles.length} tables` });

  if (dryRun) {
    for (const jf of jsonFiles) {
      const tableName = jf.replace(".json", "");
      const data = JSON.parse(fs.readFileSync(path.join(backupPath, jf), "utf-8"));
      steps.push({ action: `Would restore ${tableName}`, status: "dry-run", details: `${data.length} rows` });
    }
    return { success: true, steps };
  }

  const pool = new pg.Pool({ connectionString: dbUrl });

  try {
    for (const jf of jsonFiles) {
      const tableName = jf.replace(".json", "");
      const data = JSON.parse(fs.readFileSync(path.join(backupPath, jf), "utf-8"));

      if (data.length === 0) {
        steps.push({ action: `Skip ${tableName}`, status: "ok", details: "0 rows" });
        continue;
      }

      try {
        await pool.query(`SELECT 1 FROM "${tableName}" LIMIT 1`);
      } catch {
        steps.push({ action: `Skip ${tableName}`, status: "warning", details: "Table does not exist" });
        continue;
      }

      const columns = Object.keys(data[0]);
      const colList = columns.map(c => `"${c}"`).join(", ");

      let inserted = 0;
      let skipped = 0;

      for (const row of data) {
        const values = columns.map(c => row[c]);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
        try {
          await pool.query(
            `INSERT INTO "${tableName}" (${colList}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
            values
          );
          inserted++;
        } catch {
          skipped++;
        }
      }

      steps.push({
        action: `Restored ${tableName}`,
        status: "ok",
        details: `${inserted} inserted, ${skipped} skipped of ${data.length}`,
      });
    }
  } finally {
    await pool.end();
  }

  return { success: true, steps };
}

if (process.argv[1] && process.argv[1].includes("restore-content")) {
  const dryRun = process.argv.includes("--dry-run");
  restoreContent({ dryRun })
    .then((result) => {
      console.log(`\nContent Restore ${dryRun ? "(DRY RUN)" : ""}`);
      console.log("=".repeat(40));
      for (const step of result.steps) {
        console.log(`  [${step.status.toUpperCase()}] ${step.action}: ${step.details}`);
      }
      console.log(`\nResult: ${result.success ? "SUCCESS" : "FAILED"}`);
      if (!result.success) process.exit(1);
    })
    .catch((err) => {
      console.error("Content restore failed:", err);
      process.exit(1);
    });
}
