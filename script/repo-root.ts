import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

/** Parent of `script/` (typical monorepo root when `script/` lives at repo root). */
export const REPO_ROOT_FROM_SCRIPT = path.resolve(SCRIPT_DIR, "..");

const I18N_EN_MARKER = path.join("tools", "i18n", "source", "i18n-en.ts");

function hasRepoMarker(dir: string): boolean {
  return existsSync(path.join(dir, I18N_EN_MARKER));
}

/**
 * Resolves the monorepo root by locating `tools/i18n/source/i18n-en.ts`.
 * Falls back to `REPO_ROOT_FROM_SCRIPT` when the marker is missing everywhere
 * (so callers still get stable paths for error messages / Docker diagnosis).
 * Supports `process.cwd()` = `nursenest-core/` (npm --prefix / App Platform).
 */
function discoverRepoRoot(): string {
  const fromScript = REPO_ROOT_FROM_SCRIPT;
  if (hasRepoMarker(fromScript)) {
    return fromScript;
  }
  const alternates = [
    path.resolve(fromScript, ".."),
    process.cwd(),
    path.resolve(process.cwd(), ".."),
    path.basename(process.cwd()) === "nursenest-core" ? path.resolve(process.cwd(), "..") : "",
  ].filter(Boolean) as string[];

  for (const alt of alternates) {
    if (alt === fromScript) continue;
    if (hasRepoMarker(alt)) {
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

function discoverAppRoot(): string {
  const app = path.join(REPO_ROOT, "nursenest-core");
  if (existsSync(path.join(app, "package.json"))) {
    return app;
  }
  return REPO_ROOT;
}

/** Next.js app package (`nursenest-core/`) when present; otherwise the monorepo root. */
export const APP_ROOT = discoverAppRoot();

/** Vite monolith JSON output at repo root: `client/public/i18n` (not under `nursenest-core/client/`). */
export const CLIENT_PUBLIC_I18N_DIR = path.join(REPO_ROOT, "client/public/i18n");

/** Next.js shard tree: `{appRoot}/public/i18n`. */
export const NEXT_PUBLIC_I18N_SHARD_ROOT = path.join(APP_ROOT, "public/i18n");

let pathsLogged = false;

/** Log resolved roots once per process (e.g. after `chdir`). */
export function logResolvedPathsOnce(): void {
  if (pathsLogged) return;
  pathsLogged = true;
  console.log(`[paths] repoRoot=${REPO_ROOT} appRoot=${APP_ROOT}`);
}
