import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import {
  PROJECT_ROOT,
  getTimestamp,
  ensureDir,
  computeSHA256,
  writeChecksumFile,
  collectFiles,
  type BackupResult,
} from "./backup-engine";
import { logBackup } from "./backup-logger";

const BACKUP_TIMEOUT_MS = 5 * 60 * 1000;
const TAR_MAX_BUFFER = 500 * 1024 * 1024;
const LOCK_PATH = path.join(PROJECT_ROOT, "backups", "code-archive.lock");

const EXCLUDE_ARGS = [
  "--exclude=node_modules",
  "--exclude=.git",
  "--exclude=dist",
  "--exclude=backups",
  "--exclude=exports",
  "--exclude=.cache",
  "--exclude=.local",
  "--exclude=*.tar.gz",
].join(" ");

function releaseLock(): void {
  try { fs.unlinkSync(LOCK_PATH); } catch {}
}

function acquireLock(): void {
  try {
    fs.mkdirSync(path.dirname(LOCK_PATH), { recursive: true });
    fs.writeFileSync(LOCK_PATH, String(process.pid), { flag: "wx" });
  } catch {
    throw new Error(
      "Code archive backup is already running (lock file exists). " +
        "If this is stale, delete: " + LOCK_PATH,
    );
  }
}

function buildArchive(archivePath: string, errors: string[], warnings: string[]): boolean {
  // Primary: archive from parent directory using project folder name
  try {
    execSync(
      `tar czf "${archivePath}" ${EXCLUDE_ARGS} -C "${path.dirname(PROJECT_ROOT)}" "${path.basename(PROJECT_ROOT)}"`,
      { stdio: "pipe", maxBuffer: TAR_MAX_BUFFER, timeout: BACKUP_TIMEOUT_MS },
    );
    if (fs.existsSync(archivePath)) return true;
    warnings.push("Primary tar produced no output file, trying fallback.");
  } catch (err: any) {
    warnings.push(`Primary tar failed (${err.message}), trying fallback.`);
  }

  // Fallback: archive from within the project directory
  try {
    execSync(
      `cd "${PROJECT_ROOT}" && tar czf "${archivePath}" ${EXCLUDE_ARGS} .`,
      { stdio: "pipe", maxBuffer: TAR_MAX_BUFFER, timeout: BACKUP_TIMEOUT_MS },
    );
    if (fs.existsSync(archivePath)) return true;
    errors.push("Fallback tar produced no output file.");
  } catch (err: any) {
    errors.push(`Fallback tar failed: ${err.message}`);
  }

  return false;
}

export async function runCodeArchive(): Promise<BackupResult> {
  const startTime = Date.now();
  const timestamp = getTimestamp();
  const backupDir = path.join(PROJECT_ROOT, "backups", "code");
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    ensureDir(backupDir);
  } catch (err: any) {
    errors.push(`Failed to create backup directory: ${err.message}`);
    const duration = Date.now() - startTime;
    const result: BackupResult = {
      timestamp,
      type: "code-archive",
      status: "failed",
      fileCount: 0,
      archiveSize: 0,
      archivePath: "",
      warnings,
      errors,
      duration,
    };
    try {
      await logBackup({
        type: "code-archive",
        timestamp: new Date().toISOString(),
        archivePath: "",
        size: 0,
        fileCount: 0,
        status: "failed",
      });
    } catch {}
    return result;
  }

  acquireLock();

  const timeoutHandle = setTimeout(() => {
    releaseLock();
    console.error(`Code archive timed out after ${BACKUP_TIMEOUT_MS / 1000}s`);
    process.exit(1);
  }, BACKUP_TIMEOUT_MS);
  timeoutHandle.unref();

  const archiveName = `nursenest-source-${timestamp}.tar.gz`;
  const archivePath = path.join(backupDir, archiveName);

  try {
    const archiveCreated = buildArchive(archivePath, errors, warnings);

    if (!archiveCreated) {
      errors.push("Archive file was not created by any method.");
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
      try {
        await logBackup({
          type: "code-archive",
          timestamp: new Date().toISOString(),
          archivePath: "",
          size: 0,
          fileCount: 0,
          status: "failed",
        });
      } catch {}
      return result;
    }

    // Stat the archive
    let archiveSize = 0;
    try {
      archiveSize = fs.statSync(archivePath).size;
    } catch (err: any) {
      warnings.push(`Could not stat archive file: ${err.message}`);
    }

    // Checksum
    let checksum: string | undefined;
    try {
      checksum = computeSHA256(archivePath);
    } catch (err: any) {
      warnings.push(`Checksum computation failed: ${err.message}`);
    }

    if (checksum) {
      try {
        writeChecksumFile(archivePath, checksum);
      } catch (err: any) {
        warnings.push(`Failed to write checksum file: ${err.message}`);
      }
    }

    // fileCount: archive + checksum file (only if both exist)
    const checksumFilePath = archivePath + ".sha256";
    const fileCount =
      (fs.existsSync(archivePath) ? 1 : 0) +
      (fs.existsSync(checksumFilePath) ? 1 : 0);

    const status: BackupResult["status"] =
      errors.length > 0 ? "failed" : warnings.length > 0 ? "partial" : "success";

    const result: BackupResult = {
      timestamp,
      type: "code-archive",
      status,
      fileCount,
      archiveSize,
      archivePath,
      checksum,
      warnings,
      errors,
      duration: Date.now() - startTime,
    };

    try {
      await logBackup({
        type: "code-archive",
        timestamp: new Date().toISOString(),
        archivePath,
        size: archiveSize,
        fileCount,
        status,
      });
    } catch (err: any) {
      // Logging failure must never suppress a successful backup result
      warnings.push(`logBackup failed: ${err.message}`);
    }

    return result;
  } catch (err: any) {
    errors.push(`Unexpected error during code archive: ${err.message}`);

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

    try {
      await logBackup({
        type: "code-archive",
        timestamp: new Date().toISOString(),
        archivePath: "",
        size: 0,
        fileCount: 0,
        status: "failed",
      });
    } catch {}

    return result;
  } finally {
    clearTimeout(timeoutHandle);
    releaseLock();
  }
}

// ─── CLI entry point ──────────────────────────────────────────────────────────

if (process.argv[1] && process.argv[1].includes("backup-code-archive")) {
  runCodeArchive()
    .then((result) => {
      console.log("Code archive completed:");
      console.log(`  Archive:  ${result.archivePath}`);
      console.log(`  Size:     ${(result.archiveSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  Checksum: ${result.checksum ?? "(not computed)"}`);
      console.log(`  Files:    ${result.fileCount}`);
      console.log(`  Duration: ${result.duration}ms`);
      console.log(`  Status:   ${result.status}`);
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
      console.error("Code archive failed:", err);
      process.exit(1);
    });
}