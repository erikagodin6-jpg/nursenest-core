import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { PROJECT_ROOT, getTimestamp, ensureDir, computeSHA256, writeChecksumFile, collectFiles, type BackupResult } from "./backup-engine";
import { logBackup } from "./backup-logger";

export async function runCodeArchive(): Promise<BackupResult> {
  const startTime = Date.now();
  const timestamp = getTimestamp();
  const backupDir = path.join(PROJECT_ROOT, "backups", "code");
  ensureDir(backupDir);

  const warnings: string[] = [];
  const errors: string[] = [];
  let fileCount = 0;

  const archiveName = `nursenest-source-${timestamp}.tar.gz`;
  const archivePath = path.join(backupDir, archiveName);

  try {
    const excludeArgs = [
      "--exclude=node_modules",
      "--exclude=.git",
      "--exclude=dist",
      "--exclude=backups",
      "--exclude=exports",
      "--exclude=.cache",
      "--exclude=.local",
      "--exclude=*.tar.gz",
    ].join(" ");

    try {
      execSync(
        `tar czf "${archivePath}" ${excludeArgs} -C "${path.dirname(PROJECT_ROOT)}" "${path.basename(PROJECT_ROOT)}"`,
        { stdio: "pipe", maxBuffer: 500 * 1024 * 1024, timeout: 300000 }
      );
    } catch (tarErr: any) {
      try {
        execSync(
          `cd "${PROJECT_ROOT}" && tar czf "${archivePath}" ${excludeArgs} .`,
          { stdio: "pipe", maxBuffer: 500 * 1024 * 1024, timeout: 300000 }
        );
      } catch (fallbackErr: any) {
        errors.push(`tar command failed: ${fallbackErr.message}`);
      }
    }

    if (fs.existsSync(archivePath)) {
      const checksum = computeSHA256(archivePath);
      writeChecksumFile(archivePath, checksum);
      fileCount = 2;

      const stat = fs.statSync(archivePath);
      const result: BackupResult = {
        timestamp,
        type: "code-archive",
        status: "success",
        fileCount,
        archiveSize: stat.size,
        archivePath,
        checksum,
        warnings,
        errors,
        duration: Date.now() - startTime,
      };

      await logBackup({
        type: "code-archive",
        timestamp: new Date().toISOString(),
        archivePath,
        size: stat.size,
        fileCount,
        status: "success",
      });

      return result;
    } else {
      errors.push("Archive file was not created");
    }
  } catch (err: any) {
    errors.push(`Code archive failed: ${err.message}`);
  }

  const result: BackupResult = {
    timestamp,
    type: "code-archive",
    status: "failed",
    fileCount: 0,
    archiveSize: 0,
    archivePath: "",
    warnings,
    errors,
    duration: Date.now() - startTime,
  };

  await logBackup({
    type: "code-archive",
    timestamp: new Date().toISOString(),
    archivePath: "",
    size: 0,
    fileCount: 0,
    status: "failed",
  });

  return result;
}

if (process.argv[1] && process.argv[1].includes("backup-code-archive")) {
  runCodeArchive()
    .then((result) => {
      console.log("Code archive completed:");
      console.log(`  Archive: ${result.archivePath}`);
      console.log(`  Size: ${(result.archiveSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  Checksum: ${result.checksum}`);
      console.log(`  Status: ${result.status}`);
    })
    .catch((err) => {
      console.error("Code archive failed:", err);
      process.exit(1);
    });
}
