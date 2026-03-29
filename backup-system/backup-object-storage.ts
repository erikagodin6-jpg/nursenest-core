import fs from "fs";
import path from "path";
import { PROJECT_ROOT, getTimestamp, ensureDir, computeSHA256, type BackupResult } from "./backup-engine";
import { logBackup } from "./backup-logger";

export async function runObjectStorageBackup(options?: { downloadFiles?: boolean }): Promise<BackupResult> {
  const startTime = Date.now();
  const timestamp = getTimestamp();
  const backupDir = path.join(PROJECT_ROOT, "backups", "object-storage", timestamp);
  ensureDir(backupDir);

  const warnings: string[] = [];
  const errors: string[] = [];
  let fileCount = 0;
  const checksums: Record<string, string> = {};
  const shouldDownload = options?.downloadFiles || false;

  try {
    const { ObjectStorageService } = await import("../server/replit_integrations/object_storage/objectStorage");
    const storageService = new ObjectStorageService();

    const publicPaths = storageService.getPublicObjectSearchPaths();
    const privateDir = process.env.PRIVATE_OBJECT_DIR || ".private";

    const inventory: {
      publicFiles: any[];
      privateFiles: any[];
      totalFiles: number;
      totalSizeBytes: number;
    } = {
      publicFiles: [],
      privateFiles: [],
      totalFiles: 0,
      totalSizeBytes: 0,
    };

    for (const searchPath of publicPaths) {
      try {
        const bucketName = searchPath.split("/")[0];
        const prefix = searchPath.split("/").slice(1).join("/");
        const { objectStorageClient } = await import("../server/replit_integrations/object_storage/objectStorage");
        const bucket = objectStorageClient.bucket(bucketName);
        const [files] = await bucket.getFiles({ prefix: prefix || "public" });

        for (const file of files) {
          const [metadata] = await file.getMetadata();
          const fileInfo = {
            name: file.name,
            bucket: bucketName,
            size: parseInt(metadata.size as string) || 0,
            contentType: metadata.contentType || "unknown",
            updated: metadata.updated,
            created: metadata.timeCreated,
          };
          inventory.publicFiles.push(fileInfo);
          inventory.totalFiles++;
          inventory.totalSizeBytes += fileInfo.size;

          if (shouldDownload) {
            const downloadDir = path.join(backupDir, "files", "public");
            ensureDir(downloadDir);
            const localPath = path.join(downloadDir, file.name.replace(/\//g, "_"));
            try {
              const [contents] = await file.download();
              fs.writeFileSync(localPath, contents);
              fileCount++;
            } catch (dlErr: any) {
              warnings.push(`Could not download ${file.name}: ${dlErr.message}`);
            }
          }
        }
      } catch (err: any) {
        warnings.push(`Could not list public path ${searchPath}: ${err.message}`);
      }
    }

    try {
      const firstPublicPath = publicPaths[0] || "";
      const bucketName = firstPublicPath.split("/")[0];
      if (bucketName) {
        const { objectStorageClient } = await import("../server/replit_integrations/object_storage/objectStorage");
        const bucket = objectStorageClient.bucket(bucketName);
        const [files] = await bucket.getFiles({ prefix: privateDir });

        for (const file of files) {
          const [metadata] = await file.getMetadata();
          const fileInfo = {
            name: file.name,
            bucket: bucketName,
            size: parseInt(metadata.size as string) || 0,
            contentType: metadata.contentType || "unknown",
            updated: metadata.updated,
            created: metadata.timeCreated,
          };
          inventory.privateFiles.push(fileInfo);
          inventory.totalFiles++;
          inventory.totalSizeBytes += fileInfo.size;
        }
      }
    } catch (err: any) {
      warnings.push(`Could not list private files: ${err.message}`);
    }

    const inventoryPath = path.join(backupDir, "object-storage-inventory.json");
    fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2));
    fileCount++;
    checksums["object-storage-inventory.json"] = computeSHA256(inventoryPath);

    const manifestPath = path.join(backupDir, "object-storage-manifest.json");
    fs.writeFileSync(manifestPath, JSON.stringify({
      generatedAt: new Date().toISOString(),
      timestamp,
      publicFiles: inventory.publicFiles.length,
      privateFiles: inventory.privateFiles.length,
      totalFiles: inventory.totalFiles,
      totalSizeBytes: inventory.totalSizeBytes,
      downloadedLocally: shouldDownload,
      checksums,
    }, null, 2));
    fileCount++;
  } catch (err: any) {
    errors.push(`Object storage backup failed: ${err.message}`);
  }

  const status = errors.length > 0 ? (fileCount > 0 ? "partial" : "failed") : "success";
  const result: BackupResult = {
    timestamp,
    type: "object-storage",
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
    type: "object-storage",
    timestamp: new Date().toISOString(),
    archivePath: backupDir,
    size: 0,
    fileCount,
    status,
  });

  return result;
}

if (process.argv[1] && process.argv[1].includes("backup-object-storage")) {
  const download = process.argv.includes("--download");
  runObjectStorageBackup({ downloadFiles: download })
    .then((result) => {
      console.log("Object storage backup completed:");
      console.log(`  Output: ${result.archivePath}`);
      console.log(`  Files: ${result.fileCount}`);
      console.log(`  Status: ${result.status}`);
    })
    .catch((err) => {
      console.error("Object storage backup failed:", err);
      process.exit(1);
    });
}
