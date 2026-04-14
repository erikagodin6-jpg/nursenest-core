#!/usr/bin/env node
/**
 * End-to-end: find `replit-object-storage-export.tar-2.gz`, extract, verify layout,
 * upload to DigitalOcean Spaces (SPACES_KEY / SPACES_SECRET), write manifests, then
 * migrate `server/seed-data/digital-products.json` to CDN URLs (repo-root script).
 *
 * Env:
 *   REPLIT_OBJECT_STORAGE_ARCHIVE_GZ — optional explicit path to the .tar.gz
 *   SPACES_KEY, SPACES_SECRET — required for upload (unless SKIP_SPACES_UPLOAD=1)
 *   SKIP_SPACES_UPLOAD=1 — extract + validate (+ migrate) only
 *   SKIP_SEED_MIGRATE=1 — do not run digital-products CDN migration after upload
 *
 * Searched paths (when REPLIT_OBJECT_STORAGE_ARCHIVE_GZ unset):
 *   <monorepo>/replit-object-storage-export.tar-2.gz
 *   <nursenest-core app>/replit-object-storage-export.tar-2.gz
 *
 * Re-upload without a tarball: put an extracted tree at `<monorepo>/replit-export/`
 * (with `public/` and `private-products/`; gitignored), then run only the uploader:
 *   REPLIT_EXPORT_DIR="../../replit-export" node scripts/upload-replit-export-to-spaces.mjs
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nursenestAppRoot = path.join(__dirname, "..");
const monorepoRoot = path.join(nursenestAppRoot, "..");

const DEFAULT_ARCHIVE = "replit-object-storage-export.tar-2.gz";
const STAGING_DIR = path.join(nursenestAppRoot, ".replit-export-staging");
const EXPORT_SUBDIR = path.join(STAGING_DIR, "replit-export");
const MANIFEST_OUT = path.join(nursenestAppRoot, ".replit-spaces-upload-manifest.json");
const PIPELINE_REPORT = path.join(nursenestAppRoot, ".replit-spaces-pipeline-report.json");

function findArchive() {
  const fromEnv = process.env.REPLIT_OBJECT_STORAGE_ARCHIVE_GZ?.trim();
  if (fromEnv && fs.existsSync(fromEnv)) return path.resolve(fromEnv);
  const cands = [
    path.join(monorepoRoot, DEFAULT_ARCHIVE),
    path.join(nursenestAppRoot, DEFAULT_ARCHIVE),
  ];
  for (const c of cands) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function run(cmd, args, opts) {
  const r = spawnSync(cmd, args, { stdio: "inherit", ...opts });
  return r.status ?? 1;
}

function main() {
  const report = {
    startedAt: new Date().toISOString(),
    steps: [],
    errors: [],
  };

  const archive = findArchive();
  if (!archive) {
    const msg = `Archive not found. Place ${DEFAULT_ARCHIVE} at repo root or nursenest-core/, or set REPLIT_OBJECT_STORAGE_ARCHIVE_GZ.`;
    report.errors.push(msg);
    fs.writeFileSync(PIPELINE_REPORT, JSON.stringify(report, null, 2), "utf8");
    console.error(msg);
    process.exit(1);
  }
  report.archive = archive;
  console.log(`[pipeline] Using archive: ${archive}`);

  fs.rmSync(STAGING_DIR, { recursive: true, force: true });
  fs.mkdirSync(STAGING_DIR, { recursive: true });

  const tarCode = run("tar", ["-xzf", archive, "-C", STAGING_DIR], {});
  if (tarCode !== 0) {
    report.errors.push("tar extract failed");
    report.steps.push({ step: "extract", ok: false });
    fs.writeFileSync(PIPELINE_REPORT, JSON.stringify(report, null, 2), "utf8");
    process.exit(1);
  }
  report.steps.push({ step: "extract", ok: true, staging: STAGING_DIR });

  const pub = path.join(EXPORT_SUBDIR, "public");
  const priv = path.join(EXPORT_SUBDIR, "private-products");
  if (!fs.existsSync(pub) || !fs.statSync(pub).isDirectory()) {
    report.errors.push(`Missing replit-export/public under ${EXPORT_SUBDIR}`);
    fs.writeFileSync(PIPELINE_REPORT, JSON.stringify(report, null, 2), "utf8");
    console.error(report.errors.at(-1));
    process.exit(1);
  }
  if (!fs.existsSync(priv) || !fs.statSync(priv).isDirectory()) {
    report.errors.push(`Missing replit-export/private-products under ${EXPORT_SUBDIR}`);
    fs.writeFileSync(PIPELINE_REPORT, JSON.stringify(report, null, 2), "utf8");
    console.error(report.errors.at(-1));
    process.exit(1);
  }
  console.log(`[pipeline] Verified: ${pub}`);
  console.log(`[pipeline] Verified: ${priv}`);
  report.steps.push({ step: "validate_layout", ok: true, publicDir: pub, privateProductsDir: priv });

  const skipUpload = process.env.SKIP_SPACES_UPLOAD === "1";
  if (skipUpload) {
    console.log("[pipeline] SKIP_SPACES_UPLOAD=1 — skipping Spaces upload.");
    report.steps.push({ step: "upload", skipped: true });
  } else {
    if (!process.env.SPACES_KEY?.trim() || !process.env.SPACES_SECRET?.trim()) {
      const msg = "SPACES_KEY and SPACES_SECRET are required for upload (or set SKIP_SPACES_UPLOAD=1).";
      report.errors.push(msg);
      fs.writeFileSync(PIPELINE_REPORT, JSON.stringify(report, null, 2), "utf8");
      console.error(msg);
      process.exit(1);
    }
    const uploadScript = path.join(nursenestAppRoot, "scripts/upload-replit-export-to-spaces.mjs");
    const code = run(process.execPath, [uploadScript], {
      cwd: nursenestAppRoot,
      env: {
        ...process.env,
        REPLIT_EXPORT_DIR: EXPORT_SUBDIR,
        SPACES_UPLOAD_MANIFEST: MANIFEST_OUT,
      },
    });
    report.steps.push({ step: "upload", ok: code === 0, manifest: MANIFEST_OUT });
    if (code !== 0) {
      report.errors.push("Spaces upload script exited non-zero");
      fs.writeFileSync(PIPELINE_REPORT, JSON.stringify(report, null, 2), "utf8");
      process.exit(code);
    }
  }

  const skipMigrate = process.env.SKIP_SEED_MIGRATE === "1";
  if (skipMigrate) {
    console.log("[pipeline] SKIP_SEED_MIGRATE=1 — skipping digital-products migration.");
    report.steps.push({ step: "migrate_seed", skipped: true });
  } else {
    const mig = path.join(monorepoRoot, "scripts/migrate-digital-products-seed-to-cdn.ts");
    if (!fs.existsSync(mig)) {
      report.errors.push(`Missing migrate script: ${mig}`);
      fs.writeFileSync(PIPELINE_REPORT, JSON.stringify(report, null, 2), "utf8");
      console.error(report.errors.at(-1));
      process.exit(1);
    }
    const mCode = run("npx", ["tsx", "scripts/migrate-digital-products-seed-to-cdn.ts"], {
      cwd: monorepoRoot,
      env: { ...process.env },
    });
    report.steps.push({ step: "migrate_seed", ok: mCode === 0 });
    if (mCode !== 0) {
      report.errors.push("migrate-digital-products-seed-to-cdn failed");
      fs.writeFileSync(PIPELINE_REPORT, JSON.stringify(report, null, 2), "utf8");
      process.exit(mCode);
    }
  }

  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(PIPELINE_REPORT, JSON.stringify(report, null, 2), "utf8");
  console.log(`[pipeline] Report: ${PIPELINE_REPORT}`);
  console.log("[pipeline] Complete.");
}

main();
