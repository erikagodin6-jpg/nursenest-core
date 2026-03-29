import fs from "fs";
import path from "path";
import { PROJECT_ROOT, ensureDir } from "./backup-engine";

export interface RestoreConfigOptions {
  dryRun?: boolean;
}

export async function restoreConfig(options: RestoreConfigOptions = {}): Promise<{
  success: boolean;
  steps: { action: string; status: string; details: string }[];
  envTemplate?: string;
}> {
  const { dryRun = false } = options;
  const steps: { action: string; status: string; details: string }[] = [];

  const envInventoryDir = path.join(PROJECT_ROOT, "backups", "env-inventory");
  let inventoryData: any = null;

  if (fs.existsSync(envInventoryDir)) {
    const subDirs = fs.readdirSync(envInventoryDir)
      .filter(d => fs.statSync(path.join(envInventoryDir, d)).isDirectory())
      .sort()
      .reverse();

    if (subDirs.length > 0) {
      const inventoryPath = path.join(envInventoryDir, subDirs[0], "env-inventory.json");
      if (fs.existsSync(inventoryPath)) {
        inventoryData = JSON.parse(fs.readFileSync(inventoryPath, "utf-8"));
        steps.push({ action: "Found env inventory", status: "ok", details: inventoryPath });
      }
    }
  }

  if (!inventoryData) {
    const envExamplePath = path.join(PROJECT_ROOT, ".env.example");
    if (fs.existsSync(envExamplePath)) {
      steps.push({ action: "Using .env.example as fallback", status: "ok", details: envExamplePath });

      if (dryRun) {
        steps.push({ action: "Would copy .env.example to .env", status: "dry-run", details: "" });
      } else {
        const envPath = path.join(PROJECT_ROOT, ".env");
        if (!fs.existsSync(envPath)) {
          fs.copyFileSync(envExamplePath, envPath);
          steps.push({ action: "Created .env from .env.example", status: "ok", details: "Edit .env with actual values" });
        } else {
          steps.push({ action: "Skip .env creation", status: "ok", details: ".env already exists" });
        }
      }
      return { success: true, steps };
    }

    steps.push({ action: "Find config source", status: "failed", details: "No env inventory or .env.example found" });
    return { success: false, steps };
  }

  const checklist = inventoryData.recoveryChecklist || [];
  const lines: string[] = [];
  lines.push("# NurseNest Environment Configuration");
  lines.push(`# Generated from backup inventory on ${new Date().toISOString()}`);
  lines.push(`# Original inventory from: ${inventoryData.generatedAt || "unknown"}`);
  lines.push("");

  const byCategory: Record<string, any[]> = {};
  for (const entry of checklist) {
    const cat = entry.category || "other";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(entry);
  }

  for (const [category, entries] of Object.entries(byCategory)) {
    lines.push(`# === ${category.toUpperCase()} ===`);
    for (const entry of entries) {
      if (entry.description) {
        lines.push(`# ${entry.description}`);
      }
      const statusComment = entry.status === "SET" ? "# Was set in previous environment" : "# Was NOT set - configure if needed";
      lines.push(statusComment);
      if (entry.required) {
        lines.push(`# REQUIRED`);
      }
      lines.push(`${entry.name}=`);
      lines.push("");
    }
  }

  const envTemplate = lines.join("\n");

  if (dryRun) {
    steps.push({
      action: "Would generate .env template",
      status: "dry-run",
      details: `${checklist.length} variables, ${checklist.filter((e: any) => e.required).length} required`,
    });
  } else {
    const envPath = path.join(PROJECT_ROOT, ".env.restored");
    fs.writeFileSync(envPath, envTemplate);
    steps.push({
      action: "Generated .env.restored",
      status: "ok",
      details: `${checklist.length} variables. Review and rename to .env after filling in values.`,
    });
  }

  return { success: true, steps, envTemplate };
}

if (process.argv[1] && process.argv[1].includes("restore-config")) {
  const dryRun = process.argv.includes("--dry-run");
  restoreConfig({ dryRun })
    .then((result) => {
      console.log(`\nConfig Restore ${dryRun ? "(DRY RUN)" : ""}`);
      console.log("=".repeat(40));
      for (const step of result.steps) {
        console.log(`  [${step.status.toUpperCase()}] ${step.action}: ${step.details}`);
      }
      console.log(`\nResult: ${result.success ? "SUCCESS" : "FAILED"}`);
      if (!result.success) process.exit(1);
    })
    .catch((err) => {
      console.error("Config restore failed:", err);
      process.exit(1);
    });
}
