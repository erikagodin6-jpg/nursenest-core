import fs from "fs";
import path from "path";
import { PROJECT_ROOT, ensureDir } from "./backup-engine";

const DEFAULT_KEEP_COUNT = 7;

export function enforceRetention(keepCount: number = DEFAULT_KEEP_COUNT): {
  cleaned: string[];
  kept: string[];
} {
  const backupsDir = path.join(PROJECT_ROOT, "backups");
  if (!fs.existsSync(backupsDir)) return { cleaned: [], kept: [] };

  const cleaned: string[] = [];
  const kept: string[] = [];

  const subDirs = ["db", "content", "stripe", "object-storage", "env-inventory", "render", "assets"];

  for (const subDir of subDirs) {
    const dirPath = path.join(backupsDir, subDir);
    if (!fs.existsSync(dirPath)) continue;

    const entries = fs.readdirSync(dirPath)
      .filter(e => {
        const full = path.join(dirPath, e);
        return fs.statSync(full).isDirectory();
      })
      .sort()
      .reverse();

    for (let i = 0; i < entries.length; i++) {
      const entryPath = path.join(dirPath, entries[i]);
      if (i < keepCount) {
        kept.push(entryPath);
      } else {
        try {
          fs.rmSync(entryPath, { recursive: true, force: true });
          cleaned.push(entryPath);
        } catch (err: any) {
          console.warn(`Could not remove ${entryPath}: ${err.message}`);
        }
      }
    }
  }

  const codeDir = path.join(backupsDir, "code");
  if (fs.existsSync(codeDir)) {
    const archives = fs.readdirSync(codeDir)
      .filter(f => f.endsWith(".tar.gz"))
      .sort()
      .reverse();

    for (let i = 0; i < archives.length; i++) {
      const archivePath = path.join(codeDir, archives[i]);
      const checksumPath = archivePath + ".sha256";
      if (i < keepCount) {
        kept.push(archivePath);
      } else {
        try {
          fs.unlinkSync(archivePath);
          if (fs.existsSync(checksumPath)) fs.unlinkSync(checksumPath);
          cleaned.push(archivePath);
        } catch (err: any) {
          console.warn(`Could not remove ${archivePath}: ${err.message}`);
        }
      }
    }
  }

  const topLevelZips = fs.readdirSync(backupsDir)
    .filter(f => f.endsWith(".zip"))
    .sort()
    .reverse();

  for (let i = 0; i < topLevelZips.length; i++) {
    const zipPath = path.join(backupsDir, topLevelZips[i]);
    if (i < keepCount) {
      kept.push(zipPath);
    } else {
      try {
        fs.unlinkSync(zipPath);
        cleaned.push(zipPath);
      } catch (err: any) {
        console.warn(`Could not remove ${zipPath}: ${err.message}`);
      }
    }
  }

  return { cleaned, kept };
}

if (process.argv[1] && process.argv[1].includes("retention")) {
  const keepCount = parseInt(process.argv[2] || "7", 10);
  const result = enforceRetention(keepCount);
  console.log(`Retention policy applied (keep last ${keepCount}):`);
  console.log(`  Cleaned: ${result.cleaned.length} items`);
  console.log(`  Kept: ${result.kept.length} items`);
  if (result.cleaned.length > 0) {
    console.log("\nRemoved:");
    for (const c of result.cleaned) console.log(`  - ${c}`);
  }
}
