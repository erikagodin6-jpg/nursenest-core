/** Pure CLI parsing for `scripts/migrate-content-items-to-pathway-lessons.ts` (testable without DB). */
export function parseMigrationCliArgs(argv: string[]): {
  dryRun: boolean;
  limit: number;
  pathwayId: string | null;
  apply: boolean;
} {
  let dryRun = true;
  let limit = 50;
  let pathwayId: string | null = null;
  let apply = false;

  for (const raw of argv) {
    const a = raw.trim();
    if (a.startsWith("--dryRun=")) {
      const v = a.slice("--dryRun=".length).toLowerCase();
      dryRun = v !== "false" && v !== "0";
    } else if (a.startsWith("--limit=")) {
      const n = Number.parseInt(a.slice("--limit=".length), 10);
      if (Number.isFinite(n) && n > 0) limit = Math.min(5000, n);
    } else if (a.startsWith("--pathwayId=")) {
      pathwayId = a.slice("--pathwayId=".length).trim() || null;
    } else if (a.startsWith("--apply=")) {
      const v = a.slice("--apply=".length).toLowerCase();
      apply = v === "true" || v === "1";
    }
  }

  if (apply) dryRun = false;

  return { dryRun, limit, pathwayId, apply };
}
