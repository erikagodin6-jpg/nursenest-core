import fs from "node:fs";
import path from "node:path";

const FILE = path.join(process.cwd(), ".cache", "admin-readiness-last.json");

export type PriorReadinessRecord = { score: number; recordedAt: string };

/**
 * Instance-local last readiness score (written after each diagnostics load).
 * Enables a lightweight improving / stable / worsening hint without a DB migration.
 */
export function readPriorReadinessScore(): PriorReadinessRecord | null {
  try {
    if (!fs.existsSync(FILE)) return null;
    const raw = fs.readFileSync(FILE, "utf8");
    const j = JSON.parse(raw) as unknown;
    if (!j || typeof j !== "object") return null;
    const o = j as Record<string, unknown>;
    if (typeof o.score !== "number" || !Number.isFinite(o.score)) return null;
    if (typeof o.recordedAt !== "string") return null;
    return { score: Math.round(o.score), recordedAt: o.recordedAt };
  } catch {
    return null;
  }
}

export function writePriorReadinessScore(score: number): void {
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(
      FILE,
      JSON.stringify({ score: Math.round(score), recordedAt: new Date().toISOString() }, null, 0),
      "utf8",
    );
  } catch {
    /* ignore — diagnostics must not fail if cache is not writable */
  }
}
