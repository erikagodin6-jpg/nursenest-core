import fs from "fs";
import path from "path";
import { PROJECT_ROOT, ensureDir } from "./backup-engine";

export interface RestoreAssetsOptions {
  dryRun?: boolean;
  backupPath?: string;
}

export async function restoreAssets(options: RestoreAssetsOptions = {}): Promise<{
  success: boolean;
  steps: { action: string; status: string; details: string }[];
}> {
  const { dryRun = false } = options;
  const steps: { action: string; status: string; details: string }[] = [];

  const assetsDir = path.join(PROJECT_ROOT, "backups", "assets");
  if (!fs.existsSync(assetsDir)) {
    steps.push({ action: "Find assets backup", status: "failed", details: "No assets backups found" });
    return { success: false, steps };
  }

  const subDirs = fs.readdirSync(assetsDir)
    .filter(d => fs.statSync(path.join(assetsDir, d)).isDirectory())
    .sort()
    .reverse();

  if (subDirs.length === 0) {
    steps.push({ action: "Find assets backup", status: "failed", details: "No asset backup directories" });
    return { success: false, steps };
  }

  const backupPath = options.backupPath || path.join(assetsDir, subDirs[0]);
  steps.push({ action: "Selected assets backup", status: "ok", details: backupPath });

  const sourceDirs = ["public", "attached_assets", "client/src/assets", "data"];
  let totalCopied = 0;

  for (const srcDir of sourceDirs) {
    const backupSrcDir = path.join(backupPath, srcDir);
    if (!fs.existsSync(backupSrcDir)) continue;

    const destDir = path.join(PROJECT_ROOT, srcDir);
    const files = collectFilesRecursive(backupSrcDir);

    if (dryRun) {
      steps.push({ action: `Would restore ${srcDir}`, status: "dry-run", details: `${files.length} files` });
    } else {
      ensureDir(destDir);
      let copied = 0;
      for (const f of files) {
        const relPath = path.relative(backupSrcDir, f);
        const destPath = path.join(destDir, relPath);
        ensureDir(path.dirname(destPath));
        try {
          fs.copyFileSync(f, destPath);
          copied++;
        } catch (err: any) {
          steps.push({ action: `Copy ${relPath}`, status: "warning", details: err.message });
        }
      }
      steps.push({ action: `Restored ${srcDir}`, status: "ok", details: `${copied} files` });
      totalCopied += copied;
    }
  }

  const translationsDir = path.join(backupPath, "translations");
  if (fs.existsSync(translationsDir)) {
    const translationSubDirs = fs.readdirSync(translationsDir);
    for (const td of translationSubDirs) {
      const srcDir = path.join(translationsDir, td);
      if (!fs.statSync(srcDir).isDirectory()) continue;

      const files = collectFilesRecursive(srcDir);
      if (dryRun) {
        steps.push({ action: `Would restore translations/${td}`, status: "dry-run", details: `${files.length} files` });
      } else {
        for (const f of files) {
          const relPath = path.relative(srcDir, f);
          const possibleDests = [
            path.join(PROJECT_ROOT, "client/src/i18n", relPath),
            path.join(PROJECT_ROOT, "shared/translations", relPath),
          ];
          const destPath = possibleDests[0];
          ensureDir(path.dirname(destPath));
          try {
            fs.copyFileSync(f, destPath);
            totalCopied++;
          } catch {}
        }
        steps.push({ action: `Restored translations/${td}`, status: "ok", details: `${files.length} files` });
      }
    }
  }

  if (!dryRun) {
    steps.push({ action: "Total files restored", status: "ok", details: `${totalCopied}` });
  }

  return { success: true, steps };
}

function collectFilesRecursive(dir: string): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFilesRecursive(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

if (process.argv[1] && process.argv[1].includes("restore-assets")) {
  const dryRun = process.argv.includes("--dry-run");
  restoreAssets({ dryRun })
    .then((result) => {
      console.log(`\nAssets Restore ${dryRun ? "(DRY RUN)" : ""}`);
      console.log("=".repeat(40));
      for (const step of result.steps) {
        console.log(`  [${step.status.toUpperCase()}] ${step.action}: ${step.details}`);
      }
      console.log(`\nResult: ${result.success ? "SUCCESS" : "FAILED"}`);
      if (!result.success) process.exit(1);
    })
    .catch((err) => {
      console.error("Assets restore failed:", err);
      process.exit(1);
    });
}
