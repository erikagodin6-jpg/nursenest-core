import fs from "fs";
import path from "path";
import {
  PROJECT_ROOT,
  getTimestamp,
  ensureDir,
  computeSHA256,
  collectFiles,
  type BackupResult,
} from "./backup-engine";
import { logBackup } from "./backup-logger";

// ─── Configuration ────────────────────────────────────────────────────────────

const ASSET_SOURCES = [
  { src: "public", patterns: [".svg", ".png", ".jpg", ".jpeg", ".ico", ".webp", ".gif", ".pdf"] },
  { src: "attached_assets", patterns: [".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".pdf"] },
  { src: "client/src/assets", patterns: [".svg", ".png", ".jpg", ".jpeg", ".webp", ".css"] },
  { src: "data", patterns: [".json"] },
];

const TRANSLATION_DIRS = [
  "client/src/i18n",
  "client/src/translations",
  "client/src/locales",
  "shared/i18n",
  "shared/translations",
  "data/translations",
];

const SEO_FILES = ["robots.txt", "sitemap.xml", "sitemap-index.xml"];

// Files larger than this are skipped with a warning instead of copied.
// Prevents a single large file from filling disk or hanging the backup.
const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

// Maximum directory recursion depth to prevent symlink loops or
// pathologically deep trees from causing a stack overflow.
const MAX_RECURSE_DEPTH = 20;

// If the entire backup run takes longer than this, the process exits.
const BACKUP_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns the total size in bytes of all files under a directory, recursively.
 * Returns 0 on any error so a size calculation failure never crashes the backup.
 */
function getDirectorySizeBytes(dir: string): number {
  try {
    let total = 0;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      try {
        if (entry.isDirectory()) {
          total += getDirectorySizeBytes(fullPath);
        } else if (entry.isFile()) {
          total += fs.statSync(fullPath).size;
        }
      } catch {
        // Skip files we can't stat — they'll have been logged during copy
      }
    }
    return total;
  } catch {
    return 0;
  }
}

/**
 * Copies a directory tree from srcDir to destDir, filtering by extension.
 * - Skips node_modules and .git
 * - Skips files above MAX_FILE_SIZE_BYTES (adds a warning)
 * - Skips symlinks to prevent circular reference loops
 * - Caps recursion at MAX_RECURSE_DEPTH
 * - Catches per-file errors so one bad file never aborts the whole backup
 */
function copyDir(
  srcDir: string,
  destDir: string,
  extensions: string[] | null,
  fileCount: { count: number },
  errors: string[],
  warnings: string[],
  depth = 0,
): void {
  if (depth > MAX_RECURSE_DEPTH) {
    warnings.push(`Max recursion depth reached, skipping: ${srcDir}`);
    return;
  }

  if (!fs.existsSync(srcDir)) return;

  try {
    fs.mkdirSync(destDir, { recursive: true });
  } catch (err: any) {
    errors.push(`Failed to create dest dir ${destDir}: ${err.message}`);
    return;
  }

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(srcDir, { withFileTypes: true });
  } catch (err: any) {
    errors.push(`Failed to read dir ${srcDir}: ${err.message}`);
    return;
  }

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    // Skip known large/irrelevant directories
    if (entry.name === "node_modules" || entry.name === ".git") continue;

    // Skip symlinks — following them risks circular loops
    if (entry.isSymbolicLink()) {
      warnings.push(`Skipping symlink: ${srcPath}`);
      continue;
    }

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, extensions, fileCount, errors, warnings, depth + 1);
      continue;
    }

    if (!entry.isFile()) continue;

    // Extension filter
    if (extensions) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!extensions.includes(ext)) continue;
    }

    // Size guard — skip files that are unreasonably large
    try {
      const stat = fs.statSync(srcPath);
      if (stat.size > MAX_FILE_SIZE_BYTES) {
        warnings.push(
          `Skipping oversized file (${(stat.size / 1024 / 1024).toFixed(1)} MB): ${srcPath}`,
        );
        continue;
      }
    } catch (err: any) {
      errors.push(`Failed to stat ${srcPath}: ${err.message}`);
      continue;
    }

    // Copy
    try {
      fs.copyFileSync(srcPath, destPath);
      fileCount.count++;
    } catch (err: any) {
      errors.push(`Failed to copy ${srcPath}: ${err.message}`);
    }
  }
}

/**
 * Copies a single file with full error handling.
 * Unlike the main copyDir, SEO files were previously unguarded.
 */
function copyFileSafe(
  srcPath: string,
  destPath: string,
  fileCount: { count: number },
  errors: string[],
): void {
  try {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
    fileCount.count++;
  } catch (err: any) {
    errors.push(`Failed to copy SEO file ${srcPath}: ${err.message}`);
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function runAssetsBackup(): Promise<BackupResult> {
  const startTime = Date.now();
  const timestamp = getTimestamp();
  const outputDir = path.join(PROJECT_ROOT, "backups", "assets", timestamp);

  // Lock file — prevents two concurrent backup runs from writing to the
  // same output directory and corrupting checksums.json.
  const lockPath = path.join(PROJECT_ROOT, "backups", "assets.lock");
  try {
    // wx = fail if file already exists (atomic check-and-create)
    fs.writeFileSync(lockPath, String(process.pid), { flag: "wx" });
  } catch {
    throw new Error(
      "Assets backup is already running (lock file exists). " +
        "If this is stale, delete: " +
        lockPath,
    );
  }

  // Timeout watchdog — kills the process if backup hangs
  const timeoutHandle = setTimeout(() => {
    try { fs.unlinkSync(lockPath); } catch {}
    console.error(`Assets backup timed out after ${BACKUP_TIMEOUT_MS / 1000}s`);
    process.exit(1);
  }, BACKUP_TIMEOUT_MS);

  // Ensure timeout doesn't keep Node alive if backup finishes normally
  timeoutHandle.unref();

  try {
    fs.mkdirSync(outputDir, { recursive: true });

    const fileCount = { count: 0 };
    const errors: string[] = [];
    const warnings: string[] = [];

    // ── Asset sources ──────────────────────────────────────────────────────
    for (const source of ASSET_SOURCES) {
      const srcDir = path.join(PROJECT_ROOT, source.src);
      if (fs.existsSync(srcDir)) {
        const destDir = path.join(outputDir, source.src);
        copyDir(srcDir, destDir, source.patterns, fileCount, errors, warnings);
      }
    }

    // ── Translation directories ────────────────────────────────────────────
    for (const tDir of TRANSLATION_DIRS) {
      const srcDir = path.join(PROJECT_ROOT, tDir);
      if (fs.existsSync(srcDir)) {
        const destDir = path.join(outputDir, "translations", path.basename(tDir));
        copyDir(srcDir, destDir, null, fileCount, errors, warnings);
      }
    }

    // ── SEO files ──────────────────────────────────────────────────────────
    for (const sf of SEO_FILES) {
      const srcPath = path.join(PROJECT_ROOT, "public", sf);
      if (fs.existsSync(srcPath)) {
        const destPath = path.join(outputDir, "seo", sf);
        copyFileSafe(srcPath, destPath, fileCount, errors);
      }
    }

    // ── Checksums ──────────────────────────────────────────────────────────
    // collectFiles may return absolute or relative paths depending on the
    // implementation. We normalise to relative here to be safe.
    const checksums: Record<string, string> = {};
    const checksumErrors: string[] = [];

    let allFiles: string[];
    try {
      allFiles = collectFiles(outputDir, ["**/*"], []);
    } catch (err: any) {
      allFiles = [];
      errors.push(`collectFiles failed: ${err.message}`);
    }

    for (const f of allFiles) {
      // Normalise: strip outputDir prefix if collectFiles returned absolute paths
      const relativePath = path.isAbsolute(f) ? path.relative(outputDir, f) : f;
      const fullPath = path.join(outputDir, relativePath);

      try {
        const stat = fs.statSync(fullPath);
        // Don't checksum directories
        if (!stat.isFile()) continue;
        checksums[relativePath] = computeSHA256(fullPath);
      } catch (err: any) {
        checksumErrors.push(`Checksum failed for ${relativePath}: ${err.message}`);
      }
    }

    // Checksum errors are warnings, not hard errors — the files were still copied
    warnings.push(...checksumErrors);

    const checksumPath = path.join(outputDir, "checksums.json");
    try {
      fs.writeFileSync(checksumPath, JSON.stringify(checksums, null, 2));
      fileCount.count++;
    } catch (err: any) {
      errors.push(`Failed to write checksums.json: ${err.message}`);
    }

    // ── Archive size ───────────────────────────────────────────────────────
    // Actually calculated now instead of hardcoded to 0
    const archiveSize = getDirectorySizeBytes(outputDir);

    // ── Status ────────────────────────────────────────────────────────────
    // "partial" if there were any errors OR warnings, not just errors
    const status: BackupResult["status"] =
      errors.length > 0 ? "partial" : warnings.length > 0 ? "partial" : "success";

    // ── Log ───────────────────────────────────────────────────────────────
    await logBackup({
      type: "assets",
      timestamp: new Date().toISOString(),
      archivePath: outputDir,
      size: archiveSize,
      fileCount: fileCount.count,
      status,
    });

    return {
      timestamp,
      type: "assets",
      status,
      fileCount: fileCount.count,
      archiveSize,
      archivePath: outputDir,
      warnings,
      errors,
      duration: Date.now() - startTime,
      manifest: { checksums },
    };
  } finally {
    // Always clean up lock file and timeout, even if backup threw
    clearTimeout(timeoutHandle);
    try { fs.unlinkSync(lockPath); } catch {}
  }
}

// ─── CLI entry point ──────────────────────────────────────────────────────────

if (process.argv[1] && process.argv[1].includes("backup-assets")) {
  runAssetsBackup()
    .then((result) => {
      console.log("Assets backup completed:");
      console.log(`  Output:   ${result.archivePath}`);
      console.log(`  Files:    ${result.fileCount}`);
      console.log(`  Size:     ${(result.archiveSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  Duration: ${result.duration}ms`);
      console.log(`  Status:   ${result.status}`);
      if (result.warnings.length > 0) {
        console.warn("  Warnings:");
        result.warnings.forEach((w) => console.warn(`    - ${w}`));
      }
      if (result.errors.length > 0) {
        console.error("  Errors:");
        result.errors.forEach((e) => console.error(`    - ${e}`));
      }
    })
    .catch((err) => {
      console.error("Assets backup failed:", err);
      process.exit(1);
    });
}