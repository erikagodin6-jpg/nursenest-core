import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirnameBackupEngine =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = path.resolve(__dirnameBackupEngine, "..");

const EXCLUDE_PATTERNS = [
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

export function getTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

export function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function computeSHA256(filePath: string): string {
  const hash = crypto.createHash("sha256");
  const data = fs.readFileSync(filePath);
  hash.update(data);
  return hash.digest("hex");
}

export function computeSHA256Buffer(buffer: Buffer): string {
  const hash = crypto.createHash("sha256");
  hash.update(buffer);
  return hash.digest("hex");
}

export function writeChecksumFile(filePath: string, checksum: string): void {
  const checksumPath = filePath + ".sha256";
  const fileName = path.basename(filePath);
  fs.writeFileSync(checksumPath, `${checksum}  ${fileName}\n`);
}

export function verifyChecksum(filePath: string): { valid: boolean; expected: string; actual: string } {
  const checksumPath = filePath + ".sha256";
  if (!fs.existsSync(checksumPath)) {
    return { valid: false, expected: "NO_CHECKSUM_FILE", actual: "" };
  }
  const content = fs.readFileSync(checksumPath, "utf-8").trim();
  const expected = content.split(/\s+/)[0];
  const actual = computeSHA256(filePath);
  return { valid: expected === actual, expected, actual };
}

export function collectFiles(
  baseDir: string,
  patterns: string[],
  excludePatterns: string[] = EXCLUDE_PATTERNS
): string[] {
  const files: string[] = [];

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(baseDir, fullPath);

      const shouldExclude = excludePatterns.some((pat) => {
        if (pat.startsWith("*.")) {
          return entry.name.endsWith(pat.slice(1));
        }
        return relPath.split(path.sep).some((seg) => seg === pat);
      });

      if (shouldExclude) continue;

      if (entry.isDirectory()) {
        walk(fullPath);
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

  walk(baseDir);
  return files;
}

export function generateFileManifest(
  baseDir: string,
  files: string[]
): { generatedAt: string; totalFiles: number; totalSizeBytes: number; files: any[] } {
  const manifest: any = {
    generatedAt: new Date().toISOString(),
    totalFiles: files.length,
    totalSizeBytes: 0,
    files: [],
  };

  for (const f of files) {
    const fullPath = path.join(baseDir, f);
    try {
      const stat = fs.statSync(fullPath);
      const checksum = computeSHA256(fullPath);
      manifest.files.push({
        path: f,
        size: stat.size,
        modified: stat.mtime.toISOString(),
        sha256: checksum,
      });
      manifest.totalSizeBytes += stat.size;
    } catch {
      manifest.files.push({ path: f, size: 0, modified: null, error: "stat failed" });
    }
  }

  return manifest;
}

export { EXCLUDE_PATTERNS };
