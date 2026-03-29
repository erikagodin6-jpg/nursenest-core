import { existsSync } from "fs";
import path from "path";

/**
 * Resolves the NurseNest repository root (where `tools/i18n/source` lives).
 * Works when `process.cwd()` is the monorepo root or `nursenest-core/`.
 */
export function getMonorepoRoot(): string {
  const cwd = process.cwd();
  if (existsSync(path.join(cwd, "tools", "i18n", "source", "i18n-en.ts"))) {
    return cwd;
  }
  const parent = path.join(cwd, "..");
  if (existsSync(path.join(parent, "tools", "i18n", "source", "i18n-en.ts"))) {
    return path.resolve(parent);
  }
  return cwd;
}
