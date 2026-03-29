import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirnameBackupLogger =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirnameBackupLogger, "..");
const LOGS_DIR = path.join(ROOT, "backups", "logs");

export interface BackupLogEntry {
  type: string;
  timestamp: string;
  archivePath: string;
  size: number;
  fileCount: number;
  status: string;
  validationResult?: any;
}

export async function logBackup(entry: BackupLogEntry): Promise<void> {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
  const logFile = path.join(LOGS_DIR, "backup-history.json");

  let history: BackupLogEntry[] = [];
  if (fs.existsSync(logFile)) {
    try {
      history = JSON.parse(fs.readFileSync(logFile, "utf-8"));
    } catch {
      history = [];
    }
  }

  history.unshift(entry);

  if (history.length > 100) {
    history = history.slice(0, 100);
  }

  fs.writeFileSync(logFile, JSON.stringify(history, null, 2));
}

export function getBackupHistory(): BackupLogEntry[] {
  const logFile = path.join(LOGS_DIR, "backup-history.json");
  if (!fs.existsSync(logFile)) return [];
  try {
    return JSON.parse(fs.readFileSync(logFile, "utf-8"));
  } catch {
    return [];
  }
}

export function getLatestBackupInfo(): BackupLogEntry | null {
  const history = getBackupHistory();
  const fullBackups = history.filter((e) => e.type === "full");
  return fullBackups.length > 0 ? fullBackups[0] : null;
}
