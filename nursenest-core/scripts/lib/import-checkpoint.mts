import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export type FileCheckpoint = {
  script: string;
  updatedAt: string;
  completedFiles: string[];
};

export function checkpointPath(repoRoot: string, scriptBaseName: string): string {
  return join(repoRoot, "data", "import-checkpoints", `${scriptBaseName}.json`);
}

export function readCheckpoint(repoRoot: string, scriptBaseName: string): FileCheckpoint | null {
  const p = checkpointPath(repoRoot, scriptBaseName);
  if (!existsSync(p)) return null;
  try {
    const raw = readFileSync(p, "utf8");
    const j = JSON.parse(raw) as FileCheckpoint;
    if (!j || !Array.isArray(j.completedFiles)) return null;
    return j;
  } catch {
    return null;
  }
}

export function writeCheckpoint(repoRoot: string, scriptBaseName: string, completedFiles: string[]): void {
  const p = checkpointPath(repoRoot, scriptBaseName);
  mkdirSync(dirname(p), { recursive: true });
  const doc: FileCheckpoint = {
    script: scriptBaseName,
    updatedAt: new Date().toISOString(),
    completedFiles: [...new Set(completedFiles)].sort(),
  };
  writeFileSync(p, JSON.stringify(doc, null, 2));
}
