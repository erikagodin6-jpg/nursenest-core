import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

/** Parent of `script/` (typical monorepo root when `script/` lives at repo root). */
export const REPO_ROOT_FROM_SCRIPT = path.resolve(SCRIPT_DIR, "..");

const I18N_EN_MARKER = path.join("tools", "i18n", "source", "i18n-en.ts");

/**
 * Resolves the monorepo root by locating `tools/i18n/source/i18n-en.ts`.
 * Falls back to `REPO_ROOT_FROM_SCRIPT` when the marker is missing everywhere
 * (so callers still get stable paths for error messages / Docker diagnosis).
 */
function discoverRepoRoot(): string {
  const fromScript = REPO_ROOT_FROM_SCRIPT;
  if (existsSync(path.join(fromScript, I18N_EN_MARKER))) {
    return fromScript;
  }
  const alternates = [
    path.resolve(fromScript, ".."),
    process.cwd(),
    path.resolve(process.cwd(), ".."),
  ];
  for (const alt of alternates) {
    if (alt === fromScript) continue;
    if (existsSync(path.join(alt, I18N_EN_MARKER))) {
      console.warn(
        `[repo-root] Using alternate monorepo root (tools/i18n found here, not under script parent): ${alt}`,
      );
      return path.resolve(alt);
    }
  }
  return fromScript;
}

/**
 * Absolute path to the repository root for i18n/build scripts.
 * Prefers the directory that contains `tools/i18n/source/i18n-en.ts` when cwd/layout differs.
 */
export const REPO_ROOT = discoverRepoRoot();
