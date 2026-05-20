import fs from "fs";
import path from "path";
import { PROJECT_ROOT, getTimestamp, ensureDir, computeSHA256, generateFileManifest, collectFiles, type BackupResult } from "./backup-engine";
import { logBackup } from "./backup-logger";

export async function runRenderBackup(): Promise<BackupResult> {
  const startTime = Date.now();
  const timestamp = getTimestamp();
  const backupDir = path.join(PROJECT_ROOT, "backups", "render", timestamp);
  ensureDir(backupDir);

  const warnings: string[] = [];
  const errors: string[] = [];
  let fileCount = 0;
  const checksums: Record<string, string> = {};

  const distDir = path.join(PROJECT_ROOT, "dist");
  if (!fs.existsSync(distDir)) {
    warnings.push("dist/ directory not found. Run 'npm run build' first.");
    const result: BackupResult = {
      timestamp,
      type: "render",
      status: "partial",
      fileCount: 0,
      archiveSize: 0,
      archivePath: backupDir,
      warnings,
      errors,
      duration: Date.now() - startTime,
    };
    await logBackup({
      type: "render",
      timestamp: new Date().toISOString(),
      archivePath: backupDir,
      size: 0,
      fileCount: 0,
      status: "partial",
    });
    return result;
  }

  try {
    const files = collectFiles(distDir, ["**/*"], []);

    const destDir = path.join(backupDir, "dist");
    ensureDir(destDir);

    for (const f of files) {
      const src = path.join(distDir, f);
      const dest = path.join(destDir, f);
      ensureDir(path.dirname(dest));
      fs.copyFileSync(src, dest);
      fileCount++;
    }

    const manifest = generateFileManifest(distDir, files);
    const manifestPath = path.join(backupDir, "render-manifest.json");
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    fileCount++;
    checksums["render-manifest.json"] = computeSHA256(manifestPath);

    for (const fileEntry of manifest.files) {
      if (fileEntry.sha256) {
        checksums[`dist/${fileEntry.path}`] = fileEntry.sha256;
      }
    }

    const checksumPath = path.join(backupDir, "checksums.json");
    fs.writeFileSync(checksumPath, JSON.stringify(checksums, null, 2));
    fileCount++;
  } catch (err: any) {
    errors.push(`Render backup failed: ${err.message}`);
  }

  const status = errors.length > 0 ? "partial" : "success";
  const result: BackupResult = {
    timestamp,
    type: "render",
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
    type: "render",
    timestamp: new Date().toISOString(),
    archivePath: backupDir,
    size: 0,
    fileCount,
    status,
  });

  return result;
}

if (process.argv[1] && process.argv[1].includes("backup-render")) {
  runRenderBackup()
    .then((result) => {
      console.log("Render backup completed:");
      console.log(`  Output: ${result.archivePath}`);
      console.log(`  Files: ${result.fileCount}`);
      console.log(`  Status: ${result.status}`);
    })
    .catch((err) => {
      console.error("Render backup failed:", err);
      process.exit(1);
    });
}
