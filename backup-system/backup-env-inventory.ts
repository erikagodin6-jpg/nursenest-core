import fs from "fs";
import path from "path";
import { PROJECT_ROOT, getTimestamp, ensureDir, computeSHA256, type BackupResult } from "./backup-engine";
import { logBackup } from "./backup-logger";

interface EnvVarEntry {
  name: string;
  category: string;
  required: boolean;
  isSet: boolean;
  documentedInSchema: boolean;
  description?: string;
}

export async function runEnvInventory(): Promise<BackupResult> {
  const startTime = Date.now();
  const timestamp = getTimestamp();
  const backupDir = path.join(PROJECT_ROOT, "backups", "env-inventory", timestamp);
  ensureDir(backupDir);

  const warnings: string[] = [];
  const errors: string[] = [];
  let fileCount = 0;
  const checksums: Record<string, string> = {};

  try {
    let envSchema: any = { variables: {} };
    const schemaPath = path.join(PROJECT_ROOT, "config", "env-schema.json");
    if (fs.existsSync(schemaPath)) {
      envSchema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
    } else {
      warnings.push("config/env-schema.json not found, using runtime env vars only");
    }

    const schemaVars = envSchema.variables || {};
    const inventory: EnvVarEntry[] = [];

    for (const [name, def] of Object.entries(schemaVars) as [string, any][]) {
      inventory.push({
        name,
        category: def.category || "uncategorized",
        required: def.required || false,
        isSet: process.env[name] !== undefined && process.env[name] !== "",
        documentedInSchema: true,
        description: def.description,
      });
    }

    const runtimeVarNames = Object.keys(process.env).filter((name) => {
      if (name.startsWith("_") || name === "PATH" || name === "HOME" || name === "USER" ||
          name === "SHELL" || name === "TERM" || name === "LANG" || name === "PWD" ||
          name === "OLDPWD" || name === "SHLVL" || name === "HOSTNAME" ||
          name.startsWith("npm_") || name.startsWith("NIX_") || name.startsWith("XDG_")) {
        return false;
      }
      return true;
    });

    const documentedNames = new Set(Object.keys(schemaVars));
    const undocumented: string[] = [];

    for (const name of runtimeVarNames) {
      if (!documentedNames.has(name)) {
        undocumented.push(name);
        inventory.push({
          name,
          category: categorizeEnvVar(name),
          required: false,
          isSet: true,
          documentedInSchema: false,
        });
      }
    }

    if (undocumented.length > 0) {
      warnings.push(`${undocumented.length} runtime variables not documented in env-schema.json: ${undocumented.join(", ")}`);
    }

    const byCategory: Record<string, EnvVarEntry[]> = {};
    for (const entry of inventory) {
      if (!byCategory[entry.category]) byCategory[entry.category] = [];
      byCategory[entry.category].push(entry);
    }

    const checklist = {
      generatedAt: new Date().toISOString(),
      timestamp,
      summary: {
        total: inventory.length,
        set: inventory.filter((e) => e.isSet).length,
        missing: inventory.filter((e) => !e.isSet).length,
        required: inventory.filter((e) => e.required).length,
        requiredMissing: inventory.filter((e) => e.required && !e.isSet).length,
        undocumented: undocumented.length,
      },
      byCategory,
      recoveryChecklist: inventory.map((e) => ({
        name: e.name,
        category: e.category,
        required: e.required,
        status: e.isSet ? "SET" : "MISSING",
        action: e.isSet ? "Restore from secure backup" : (e.required ? "MUST configure before deployment" : "Optional - configure if needed"),
        description: e.description || "",
      })),
    };

    const checklistPath = path.join(backupDir, "env-inventory.json");
    fs.writeFileSync(checklistPath, JSON.stringify(checklist, null, 2));
    fileCount++;
    checksums["env-inventory.json"] = computeSHA256(checklistPath);

    const checksumPath = path.join(backupDir, "checksums.json");
    fs.writeFileSync(checksumPath, JSON.stringify(checksums, null, 2));
    fileCount++;
  } catch (err: any) {
    errors.push(`Env inventory failed: ${err.message}`);
  }

  const status = errors.length > 0 ? "failed" : "success";
  const result: BackupResult = {
    timestamp,
    type: "env-inventory",
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
    type: "env-inventory",
    timestamp: new Date().toISOString(),
    archivePath: backupDir,
    size: 0,
    fileCount,
    status,
  });

  return result;
}

function categorizeEnvVar(name: string): string {
  if (name.includes("DATABASE") || name.includes("DB") || name.includes("PG")) return "database";
  if (name.includes("STRIPE") || name.includes("PAYMENT") || name.includes("PAYPAL")) return "payments";
  if (name.includes("OPENAI") || name.includes("AI_")) return "ai";
  if (name.includes("SMTP") || name.includes("EMAIL") || name.includes("RESEND")) return "email";
  if (name.includes("SESSION") || name.includes("SECRET") || name.includes("AUTH")) return "security";
  if (name.includes("STORAGE") || name.includes("BUCKET") || name.includes("GCS")) return "storage";
  if (name.includes("REPLIT") || name.includes("REPL_")) return "replit";
  if (name.includes("NODE") || name.includes("PORT") || name.includes("HOST")) return "runtime";
  if (name.includes("TWILIO") || name.includes("SMS")) return "sms";
  if (name.includes("GOOGLE") || name.includes("ANALYTICS")) return "analytics";
  if (name.includes("DOMAIN") || name.includes("URL") || name.includes("BASE")) return "domain";
  return "other";
}

if (process.argv[1] && process.argv[1].includes("backup-env-inventory")) {
  runEnvInventory()
    .then((result) => {
      console.log("Environment inventory completed:");
      console.log(`  Output: ${result.archivePath}`);
      console.log(`  Files: ${result.fileCount}`);
      console.log(`  Status: ${result.status}`);
    })
    .catch((err) => {
      console.error("Environment inventory failed:", err);
      process.exit(1);
    });
}
