import fs from "fs";
import path from "path";
import { PROJECT_ROOT, getTimestamp, ensureDir, computeSHA256, collectFiles, type BackupResult } from "./backup-engine";
import { logBackup } from "./backup-logger";

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

function copyDir(
  srcDir: string,
  destDir: string,
  extensions: string[] | null,
  fileCount: { count: number },
  errors: string[]
) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, extensions, fileCount, errors);
    } else {
      if (extensions) {
        const ext = path.extname(entry.name).toLowerCase();
        if (!extensions.includes(ext)) continue;
      }
      try {
        fs.copyFileSync(srcPath, destPath);
        fileCount.count++;
      } catch (err: any) {
        errors.push(`Failed to copy ${srcPath}: ${err.message}`);
      }
    }
  }
}

export async function runAssetsBackup(): Promise<BackupResult> {
  const startTime = Date.now();
  const timestamp = getTimestamp();
  const outputDir = path.join(PROJECT_ROOT, "backups", "assets", timestamp);
  fs.mkdirSync(outputDir, { recursive: true });

  const fileCount = { count: 0 };
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const source of ASSET_SOURCES) {
    const srcDir = path.join(PROJECT_ROOT, source.src);
    if (fs.existsSync(srcDir)) {
      const destDir = path.join(outputDir, source.src);
      copyDir(srcDir, destDir, source.patterns, fileCount, errors);
    }
  }

  for (const tDir of TRANSLATION_DIRS) {
    const srcDir = path.join(PROJECT_ROOT, tDir);
    if (fs.existsSync(srcDir)) {
      const destDir = path.join(outputDir, "translations", path.basename(tDir));
      copyDir(srcDir, destDir, null, fileCount, errors);
    }
  }

  const seoFiles = ["robots.txt", "sitemap.xml", "sitemap-index.xml"];
  for (const sf of seoFiles) {
    const srcPath = path.join(PROJECT_ROOT, "public", sf);
    if (fs.existsSync(srcPath)) {
      const destPath = path.join(outputDir, "seo", sf);
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
      fileCount.count++;
    }
  }

  const checksums: Record<string, string> = {};
  const allFiles = collectFiles(outputDir, ["**/*"], []);
  for (const f of allFiles) {
    const fullPath = path.join(outputDir, f);
    try {
      checksums[f] = computeSHA256(fullPath);
    } catch {}
  }
  const checksumPath = path.join(outputDir, "checksums.json");
  fs.writeFileSync(checksumPath, JSON.stringify(checksums, null, 2));
  fileCount.count++;

  const status = errors.length > 0 ? "partial" : "success";

  await logBackup({
    type: "assets",
    timestamp: new Date().toISOString(),
    archivePath: outputDir,
    size: 0,
    fileCount: fileCount.count,
    status,
  });

  return {
    timestamp,
    type: "assets",
    status,
    fileCount: fileCount.count,
    archiveSize: 0,
    archivePath: outputDir,
    warnings,
    errors,
    duration: Date.now() - startTime,
    manifest: { checksums },
  };
}

if (process.argv[1] && process.argv[1].includes("backup-assets")) {
  runAssetsBackup()
    .then((result) => {
      console.log("Assets backup completed:");
      console.log(`  Output: ${result.archivePath}`);
      console.log(`  Files: ${result.fileCount}`);
      console.log(`  Status: ${result.status}`);
    })
    .catch((err) => {
      console.error("Assets backup failed:", err);
      process.exit(1);
    });
}
