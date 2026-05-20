import fs from "fs";
import path from "path";
import { PROJECT_ROOT, getTimestamp, ensureDir, type BackupResult } from "./backup-engine";
import { logBackup } from "./backup-logger";
import { runDbBackup } from "./backup-db";
import { runContentBackup } from "./backup-content";
import { runAssetsBackup } from "./backup-assets";
import { runCodeArchive } from "./backup-code-archive";
import { runEnvInventory } from "./backup-env-inventory";
import { runRenderBackup } from "./backup-render";
import { enforceRetention } from "./retention";

export interface FullBackupResult {
  timestamp: string;
  status: "success" | "partial" | "failed";
  duration: number;
  components: Record<string, BackupResult>;
  retentionResult?: { cleaned: string[]; kept: string[] };
  errors: string[];
  warnings: string[];
}

export async function runFullBackup(options?: {
  includeStripe?: boolean;
  includeObjectStorage?: boolean;
  downloadObjectStorageFiles?: boolean;
}): Promise<FullBackupResult> {
  const startTime = Date.now();
  const timestamp = getTimestamp();
  const components: Record<string, BackupResult> = {};
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  console.log(`[BACKUP:FULL] Starting comprehensive backup at ${timestamp}`);

  console.log("  [1/7] Database backup...");
  try {
    components.db = await runDbBackup();
    if (components.db.errors.length > 0) allErrors.push(...components.db.errors.map(e => `[db] ${e}`));
    if (components.db.warnings.length > 0) allWarnings.push(...components.db.warnings.map(w => `[db] ${w}`));
    console.log(`    Done: ${components.db.status}`);
  } catch (err: any) {
    allErrors.push(`[db] ${err.message}`);
    console.log(`    Failed: ${err.message}`);
  }

  console.log("  [2/7] Content export...");
  try {
    components.content = await runContentBackup();
    if (components.content.errors.length > 0) allErrors.push(...components.content.errors.map(e => `[content] ${e}`));
    if (components.content.warnings.length > 0) allWarnings.push(...components.content.warnings.map(w => `[content] ${w}`));
    console.log(`    Done: ${components.content.status}`);
  } catch (err: any) {
    allErrors.push(`[content] ${err.message}`);
    console.log(`    Failed: ${err.message}`);
  }

  console.log("  [3/7] Assets backup...");
  try {
    components.assets = await runAssetsBackup();
    if (components.assets.errors.length > 0) allErrors.push(...components.assets.errors.map(e => `[assets] ${e}`));
    if (components.assets.warnings.length > 0) allWarnings.push(...components.assets.warnings.map(w => `[assets] ${w}`));
    console.log(`    Done: ${components.assets.status}`);
  } catch (err: any) {
    allErrors.push(`[assets] ${err.message}`);
    console.log(`    Failed: ${err.message}`);
  }

  console.log("  [4/7] Environment inventory...");
  try {
    components.envInventory = await runEnvInventory();
    if (components.envInventory.errors.length > 0) allErrors.push(...components.envInventory.errors.map(e => `[env] ${e}`));
    if (components.envInventory.warnings.length > 0) allWarnings.push(...components.envInventory.warnings.map(w => `[env] ${w}`));
    console.log(`    Done: ${components.envInventory.status}`);
  } catch (err: any) {
    allErrors.push(`[env] ${err.message}`);
    console.log(`    Failed: ${err.message}`);
  }

  console.log("  [5/7] Render payload backup...");
  try {
    components.render = await runRenderBackup();
    if (components.render.errors.length > 0) allErrors.push(...components.render.errors.map(e => `[render] ${e}`));
    if (components.render.warnings.length > 0) allWarnings.push(...components.render.warnings.map(w => `[render] ${w}`));
    console.log(`    Done: ${components.render.status}`);
  } catch (err: any) {
    allErrors.push(`[render] ${err.message}`);
    console.log(`    Failed: ${err.message}`);
  }

  console.log("  [6/7] Code archive...");
  try {
    components.codeArchive = await runCodeArchive();
    if (components.codeArchive.errors.length > 0) allErrors.push(...components.codeArchive.errors.map(e => `[code] ${e}`));
    if (components.codeArchive.warnings.length > 0) allWarnings.push(...components.codeArchive.warnings.map(w => `[code] ${w}`));
    console.log(`    Done: ${components.codeArchive.status}`);
  } catch (err: any) {
    allErrors.push(`[code] ${err.message}`);
    console.log(`    Failed: ${err.message}`);
  }

  if (options?.includeStripe) {
    console.log("  [+] Stripe snapshot...");
    try {
      const { runStripeBackup } = await import("./backup-stripe");
      components.stripe = await runStripeBackup();
      if (components.stripe.errors.length > 0) allErrors.push(...components.stripe.errors.map(e => `[stripe] ${e}`));
      if (components.stripe.warnings.length > 0) allWarnings.push(...components.stripe.warnings.map(w => `[stripe] ${w}`));
      console.log(`    Done: ${components.stripe.status}`);
    } catch (err: any) {
      allWarnings.push(`[stripe] ${err.message}`);
      console.log(`    Failed: ${err.message}`);
    }
  }

  if (options?.includeObjectStorage) {
    console.log("  [+] Object storage backup...");
    try {
      const { runObjectStorageBackup } = await import("./backup-object-storage");
      components.objectStorage = await runObjectStorageBackup({ downloadFiles: options.downloadObjectStorageFiles });
      if (components.objectStorage.errors.length > 0) allErrors.push(...components.objectStorage.errors.map(e => `[storage] ${e}`));
      if (components.objectStorage.warnings.length > 0) allWarnings.push(...components.objectStorage.warnings.map(w => `[storage] ${w}`));
      console.log(`    Done: ${components.objectStorage.status}`);
    } catch (err: any) {
      allWarnings.push(`[storage] ${err.message}`);
      console.log(`    Failed: ${err.message}`);
    }
  }

  console.log("  [7/7] Retention cleanup...");
  let retentionResult: { cleaned: string[]; kept: string[] } | undefined;
  try {
    retentionResult = enforceRetention(7);
    console.log(`    Cleaned: ${retentionResult.cleaned.length}, Kept: ${retentionResult.kept.length}`);
  } catch (err: any) {
    allWarnings.push(`[retention] ${err.message}`);
  }

  const componentStatuses = Object.values(components).map(c => c.status);
  const hasFailures = componentStatuses.some(s => s === "failed");
  const hasPartial = componentStatuses.some(s => s === "partial");
  const overallStatus = hasFailures ? "partial" : hasPartial ? "partial" : "success";

  const fullResult: FullBackupResult = {
    timestamp,
    status: overallStatus,
    duration: Date.now() - startTime,
    components,
    retentionResult,
    errors: allErrors,
    warnings: allWarnings,
  };

  const summaryPath = path.join(PROJECT_ROOT, "backups", "logs", `full-backup-${timestamp}.json`);
  ensureDir(path.dirname(summaryPath));
  fs.writeFileSync(summaryPath, JSON.stringify(fullResult, null, 2));

  await logBackup({
    type: "full",
    timestamp: new Date().toISOString(),
    archivePath: path.join(PROJECT_ROOT, "backups"),
    size: 0,
    fileCount: Object.values(components).reduce((a, c) => a + c.fileCount, 0),
    status: overallStatus,
  });

  console.log(`\n[BACKUP:FULL] Complete!`);
  console.log(`  Status: ${overallStatus}`);
  console.log(`  Duration: ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
  console.log(`  Components: ${Object.keys(components).length}`);
  if (allErrors.length > 0) console.log(`  Errors: ${allErrors.length}`);
  if (allWarnings.length > 0) console.log(`  Warnings: ${allWarnings.length}`);

  return fullResult;
}

if (process.argv[1] && process.argv[1].includes("backup-full")) {
  const includeStripe = process.argv.includes("--stripe");
  const includeObjectStorage = process.argv.includes("--object-storage");
  const downloadFiles = process.argv.includes("--download");

  runFullBackup({ includeStripe, includeObjectStorage, downloadObjectStorageFiles: downloadFiles })
    .then((result) => {
      if (result.status === "failed") process.exit(1);
    })
    .catch((err) => {
      console.error("Full backup failed:", err);
      process.exit(1);
    });
}
