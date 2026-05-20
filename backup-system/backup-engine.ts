import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

// ─── Project root ─────────────────────────────────────────────────────────────

const __dirnameBackupEngine =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export const PROJECT_ROOT = path.resolve(__dirnameBackupEngine, "..");

// ─── Constants ────────────────────────────────────────────────────────────────

export const EXCLUDE_PATTERNS = [
  "node_modules",
  "dist",
  ".git",
  ".DS_Store",
  "backups",
  "exports",
  ".env",
  ".env.local",
  ".env.production",
  ".local",
  ".cache",
];

// Maximum file size to read into memory for checksumming (256 MB).
// Files larger than this are streamed instead to avoid OOM crashes.
const STREAM_CHECKSUM_THRESHOLD_BYTES = 256 * 1024 * 1024;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BackupResult {
  timestamp: string;
  type: string;
  status: "success" | "partial" | "failed";
  fileCount: number;
  archiveSize: number;
  archivePath: string;
  checksum?: string;
  warnings: string[];
  errors: string[];
  duration: number;
  manifest?: Record<string, any>;
}

// ─── Timestamp ────────────────────────────────────────────────────────────────

export function getTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
    `-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  );
}

// ─── Directory helpers ────────────────────────────────────────────────────────

/**
 * Creates a directory if it does not already exist.
 * Throws with a descriptive message if creation fails.
 */
export function ensureDir(dir: string): void {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (err: any) {
    // mkdirSync with recursive:true throws if the path exists as a file,
    // or on permission errors — surface those clearly.
    if (err.code !== "EEXIST") {
      throw new Error(`ensureDir failed for "${dir}": ${err.message}`);
    }
  }
}

// ─── Checksums ────────────────────────────────────────────────────────────────

/**
 * Computes SHA-256 of a file.
 *
 * For files under STREAM_CHECKSUM_THRESHOLD_BYTES, reads into memory (fast).
 * For larger files, streams to avoid OOM on large SQL dumps or archives.
 *
 * Throws on any I/O error — callers should catch and treat as a warning.
 */
export function computeSHA256(filePath: string): string {
  let size = 0;
  try {
    size = fs.statSync(filePath).size;
  } catch (err: any) {
    throw new Error(`computeSHA256: cannot stat "${filePath}": ${err.message}`);
  }

  if (size <= STREAM_CHECKSUM_THRESHOLD_BYTES) {
    // Fast path — single read
    try {
      const hash = crypto.createHash("sha256");
      hash.update(fs.readFileSync(filePath));
      return hash.digest("hex");
    } catch (err: any) {
      throw new Error(`computeSHA256: read failed for "${filePath}": ${err.message}`);
    }
  }

  // Streaming path for large files
  return computeSHA256Stream(filePath);
}

/**
 * Synchronous streaming SHA-256 using readSync in chunks.
 * Avoids loading the entire file into memory.
 */
function computeSHA256Stream(filePath: string): string {
  const CHUNK = 4 * 1024 * 1024; // 4 MB chunks
  const hash = crypto.createHash("sha256");
  const buf = Buffer.allocUnsafe(CHUNK);
  let fd: number | null = null;

  try {
    fd = fs.openSync(filePath, "r");
    let bytesRead = 0;
    while ((bytesRead = fs.readSync(fd, buf, 0, CHUNK, null)) > 0) {
      hash.update(buf.subarray(0, bytesRead));
    }
    return hash.digest("hex");
  } catch (err: any) {
    throw new Error(`computeSHA256Stream: failed for "${filePath}": ${err.message}`);
  } finally {
    if (fd !== null) {
      try { fs.closeSync(fd); } catch {}
    }
  }
}

/**
 * Computes SHA-256 of an in-memory Buffer.
 */
export function computeSHA256Buffer(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

/**
 * Writes a .sha256 sidecar file next to the given file.
 * Format matches the output of `sha256sum` for interoperability.
 */
export function writeChecksumFile(filePath: string, checksum: string): void {
  const checksumPath = filePath + ".sha256";
  const fileName = path.basename(filePath);
  try {
    fs.writeFileSync(checksumPath, `${checksum}  ${fileName}\n`, "utf8");
  } catch (err: any) {
    throw new Error(`writeChecksumFile: failed for "${checksumPath}": ${err.message}`);
  }
}

/**
 * Verifies a file against its .sha256 sidecar.
 * Returns { valid: false } if the sidecar is missing rather than throwing.
 */
export function verifyChecksum(
  filePath: string,
): { valid: boolean; expected: string; actual: string } {
  const checksumPath = filePath + ".sha256";

  if (!fs.existsSync(checksumPath)) {
    return { valid: false, expected: "NO_CHECKSUM_FILE", actual: "" };
  }

  let expected = "";
  try {
    const content = fs.readFileSync(checksumPath, "utf-8").trim();
    expected = content.split(/\s+/)[0] ?? "";
  } catch (err: any) {
    return { valid: false, expected: "CHECKSUM_FILE_UNREADABLE", actual: "" };
  }

  let actual = "";
  try {
    actual = computeSHA256(filePath);
  } catch {
    return { valid: false, expected, actual: "CHECKSUM_COMPUTE_FAILED" };
  }

  return { valid: expected === actual, expected, actual };
}

// ─── File collection ──────────────────────────────────────────────────────────

/**
 * Recursively collects relative file paths under baseDir, filtered by
 * patterns and excludePatterns.
 *
 * Always returns relative paths so callers can safely join with any base.
 * Skips symlinks to prevent circular reference loops.
 * Caps recursion depth to prevent stack overflows.
 */
export function collectFiles(
  baseDir: string,
  patterns: string[],
  excludePatterns: string[] = EXCLUDE_PATTERNS,
  maxDepth = 20,
): string[] {
  const files: string[] = [];

  function walk(dir: string, depth: number): void {
    if (depth > maxDepth) return;
    if (!fs.existsSync(dir)) return;

    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      // Unreadable directory — skip silently, callers log errors separately
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(baseDir, fullPath);

      // Skip symlinks — following them can cause infinite loops
      if (entry.isSymbolicLink()) continue;

      const shouldExclude = excludePatterns.some((pat) => {
        if (pat.startsWith("*.")) return entry.name.endsWith(pat.slice(1));
        return relPath.split(path.sep).some((seg) => seg === pat);
      });

      if (shouldExclude) continue;

      if (entry.isDirectory()) {
        walk(fullPath, depth + 1);
      } else if (entry.isFile()) {
        const matchesPattern =
          patterns.length === 0 ||
          patterns.some((p) => {
            if (p === "**/*") return true;
            if (p.startsWith("*.")) return entry.name.endsWith(p.slice(1));
            if (p.includes("/")) return relPath.startsWith(p);
            return relPath.includes(p);
          });

        if (matchesPattern) {
          files.push(relPath);
        }
      }
    }
  }

  walk(baseDir, 0);
  return files;
}

// ─── File manifest ────────────────────────────────────────────────────────────

/**
 * Generates a manifest of files with sizes, modification times, and checksums.
 *
 * Checksum failures are recorded per-file rather than aborting the manifest,
 * so one unreadable file never prevents the rest from being documented.
 */
export function generateFileManifest(
  baseDir: string,
  files: string[],
): {
  generatedAt: string;
  totalFiles: number;
  totalSizeBytes: number;
  files: Array<{
    path: string;
    size: number;
    modified: string | null;
    sha256?: string;
    error?: string;
  }>;
} {
  const manifest = {
    generatedAt: new Date().toISOString(),
    totalFiles: files.length,
    totalSizeBytes: 0,
    files: [] as Array<{
      path: string;
      size: number;
      modified: string | null;
      sha256?: string;
      error?: string;
    }>,
  };

  for (const f of files) {
    const fullPath = path.join(baseDir, f);

    let size = 0;
    let modified: string | null = null;
    let sha256: string | undefined;
    let error: string | undefined;

    try {
      const stat = fs.statSync(fullPath);
      size = stat.size;
      modified = stat.mtime.toISOString();
      manifest.totalSizeBytes += size;
    } catch (err: any) {
      error = `stat failed: ${err.message}`;
      manifest.files.push({ path: f, size: 0, modified: null, error });
      continue;
    }

    try {
      sha256 = computeSHA256(fullPath);
    } catch (err: any) {
      error = `checksum failed: ${err.message}`;
    }

    manifest.files.push({ path: f, size, modified, sha256, ...(error ? { error } : {}) });
  }

  return manifest;
}