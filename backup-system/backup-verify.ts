import fs from "fs";
import path from "path";
import { PROJECT_ROOT, computeSHA256, type BackupResult } from "./backup-engine";
import { logBackup } from "./backup-logger";

export interface VerificationResult {
  valid: boolean;
  backupPath: string;
  timestamp: string;
  components: {
    name: string;
    present: boolean;
    details: string;
    checksumValid?: boolean;
  }[];
  warnings: string[];
  errors: string[];
}

const REQUIRED_COMPONENTS = [
  { name: "Database Backup", check: (dir: string) => fs.existsSync(path.join(dir, "db")) },
  { name: "Content Export", check: (dir: string) => fs.existsSync(path.join(dir, "content")) },
  { name: "Checksums", check: (dir: string) => {
    const dbDir = path.join(dir, "db");
    if (!fs.existsSync(dbDir)) return false;
    const subDirs = fs.readdirSync(dbDir).filter(d => fs.statSync(path.join(dbDir, d)).isDirectory());
    return subDirs.some(d => fs.existsSync(path.join(dbDir, d, "checksums.json")));
  }},
];

export async function verifyBackup(backupPath?: string): Promise<VerificationResult> {
  const basePath = backupPath || path.join(PROJECT_ROOT, "backups");

  if (!fs.existsSync(basePath)) {
    throw new Error(`Backup path not found: ${basePath}`);
  }

  const components: VerificationResult["components"] = [];
  const warnings: string[] = [];
  const errs: string[] = [];

  for (const component of REQUIRED_COMPONENTS) {
    const present = component.check(basePath);
    components.push({
      name: component.name,
      present,
      details: present ? "Found" : "Missing",
    });
    if (!present) {
      warnings.push(`Missing component: ${component.name}`);
    }
  }

  const checksumDirs = ["db", "content", "stripe", "render", "env-inventory", "object-storage"];

  for (const dir of checksumDirs) {
    const dirPath = path.join(basePath, dir);
    if (!fs.existsSync(dirPath)) continue;

    const subDirs = fs.readdirSync(dirPath).filter(d => {
      const full = path.join(dirPath, d);
      return fs.statSync(full).isDirectory();
    });

    const latestDir = subDirs.sort().reverse()[0];
    if (!latestDir) continue;

    const checksumFile = path.join(dirPath, latestDir, "checksums.json");
    if (!fs.existsSync(checksumFile)) {
      warnings.push(`No checksums.json in ${dir}/${latestDir}`);
      continue;
    }

    try {
      const checksums = JSON.parse(fs.readFileSync(checksumFile, "utf-8"));
      let allValid = true;

      for (const [file, expectedHash] of Object.entries(checksums)) {
        const filePath = path.join(dirPath, latestDir, file);
        if (!fs.existsSync(filePath)) {
          warnings.push(`Checksum file missing: ${dir}/${latestDir}/${file}`);
          allValid = false;
          continue;
        }
        const actualHash = computeSHA256(filePath);
        if (actualHash !== expectedHash) {
          errs.push(`Checksum mismatch for ${dir}/${latestDir}/${file}: expected ${expectedHash}, got ${actualHash}`);
          allValid = false;
        }
      }

      components.push({
        name: `${dir} Integrity (${latestDir})`,
        present: true,
        details: allValid ? "All checksums valid" : "Checksum verification failed",
        checksumValid: allValid,
      });
    } catch (err: any) {
      warnings.push(`Could not verify checksums for ${dir}: ${err.message}`);
    }
  }

  const codeArchiveDir = path.join(basePath, "code");
  if (fs.existsSync(codeArchiveDir)) {
    const archives = fs.readdirSync(codeArchiveDir).filter(f => f.endsWith(".tar.gz"));
    const latestArchive = archives.sort().reverse()[0];
    if (latestArchive) {
      const archivePath = path.join(codeArchiveDir, latestArchive);
      const checksumFile = archivePath + ".sha256";
      if (fs.existsSync(checksumFile)) {
        const expected = fs.readFileSync(checksumFile, "utf-8").trim().split(/\s+/)[0];
        const actual = computeSHA256(archivePath);
        const valid = expected === actual;
        components.push({
          name: "Code Archive Integrity",
          present: true,
          details: valid ? `Archive ${latestArchive} checksum valid` : "Checksum mismatch",
          checksumValid: valid,
        });
        if (!valid) {
          errs.push(`Code archive checksum mismatch: expected ${expected}, got ${actual}`);
        }
      }
    }
  }

  const contentDirs = fs.existsSync(path.join(basePath, "content"))
    ? fs.readdirSync(path.join(basePath, "content")).filter(d =>
        fs.statSync(path.join(basePath, "content", d)).isDirectory()
      )
    : [];

  if (contentDirs.length > 0) {
    const latestContent = contentDirs.sort().reverse()[0];
    const manifestPath = path.join(basePath, "content", latestContent, "content-manifest.json");
    if (fs.existsSync(manifestPath)) {
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
        const tables = manifest.tables || {};
        for (const [tableName, expectedCount] of Object.entries(tables)) {
          const tableFile = path.join(basePath, "content", latestContent, `${tableName}.json`);
          if (!fs.existsSync(tableFile)) {
            warnings.push(`Content file missing for table: ${tableName}`);
            continue;
          }
          try {
            const data = JSON.parse(fs.readFileSync(tableFile, "utf-8"));
            if (data.length !== expectedCount) {
              warnings.push(`Row count mismatch for ${tableName}: manifest says ${expectedCount}, file has ${data.length}`);
            }
          } catch {
            warnings.push(`Could not parse content file for ${tableName}`);
          }
        }
      } catch {
        warnings.push("Could not parse content manifest");
      }
    }
  }

  const valid = errs.length === 0 && components.filter(c => c.checksumValid === false).length === 0;

  const result: VerificationResult = {
    valid,
    backupPath: basePath,
    timestamp: new Date().toISOString(),
    components,
    warnings,
    errors: errs,
  };

  await logBackup({
    type: "verification",
    timestamp: new Date().toISOString(),
    archivePath: basePath,
    size: 0,
    fileCount: components.length,
    status: valid ? "valid" : "invalid",
    validationResult: result,
  });

  return result;
}

if (process.argv[1] && process.argv[1].includes("backup-verify")) {
  const backupPath = process.argv[2] || undefined;
  verifyBackup(backupPath)
    .then((result) => {
      console.log("\nBackup Verification Report");
      console.log("==========================");
      console.log(`Backup: ${result.backupPath}`);
      console.log(`Status: ${result.valid ? "VALID" : "ISSUES FOUND"}`);
      console.log("\nComponents:");
      for (const c of result.components) {
        const icon = c.present && c.checksumValid !== false ? "[OK]" : "[!!]";
        console.log(`  ${icon} ${c.name}: ${c.details}`);
      }
      if (result.warnings.length > 0) {
        console.log("\nWarnings:");
        for (const w of result.warnings) console.log(`  - ${w}`);
      }
      if (result.errors.length > 0) {
        console.log("\nErrors:");
        for (const e of result.errors) console.log(`  - ${e}`);
      }
      if (!result.valid) process.exit(1);
    })
    .catch((err) => {
      console.error("Verification failed:", err.message);
      process.exit(1);
    });
}
