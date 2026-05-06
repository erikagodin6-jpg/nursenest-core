/**
 * Shared monorepo root resolution for Node build scripts (ESM).
 * Keep discovery logic aligned with `script/repo-root.ts` (same markers).
 *
 * Marker: `tools/i18n/source/i18n-en.ts` at repo root. Supports cwd = repo root
 * or `nursenest-core/` (DigitalOcean / npm --prefix layouts).
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const I18N_EN_MARKER = path.join("tools", "i18n", "source", "i18n-en.ts");

function hasRepoMarker(dir) {
  const d = path.resolve(dir);
  return existsSync(path.join(d, I18N_EN_MARKER));
}

function rootFromThisModule() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, "..", "..");
}

function discoverRepoRoot() {
  const fromModule = rootFromThisModule();
  if (hasRepoMarker(fromModule)) return fromModule;

  const cwd = process.cwd();
  const candidates = [
    path.resolve(cwd),
    path.resolve(cwd, ".."),
    path.resolve(cwd, "..", ".."),
    path.basename(cwd) === "nursenest-core" ? path.resolve(cwd, "..") : null,
    path.resolve(fromModule, ".."),
  ].filter(Boolean);

  for (const c of candidates) {
    if (c === fromModule) continue;
    if (hasRepoMarker(c)) return path.resolve(c);
  }

  return fromModule;
}

function resolveAppRoot(repo) {
  const app = path.join(repo, "nursenest-core");
  return existsSync(path.join(app, "package.json")) ? app : repo;
}

let _repoRoot = null;
let _appRoot = null;
let _logged = false;

function ensureRoots() {
  if (!_repoRoot) _repoRoot = discoverRepoRoot();
  if (!_appRoot) _appRoot = resolveAppRoot(_repoRoot);
}

export function getRepoRoot() {
  ensureRoots();
  return _repoRoot;
}

export function getAppRoot() {
  ensureRoots();
  return _appRoot;
}

/**
 * Emit `[paths]` once (call from `script/build.ts` / orchestrators).
 * Child CLI scripts use `getRepoRoot()` without logging to avoid noise.
 */
export function logResolvedPathsOnce() {
  ensureRoots();
  if (_logged) return;
  _logged = true;
  // eslint-disable-next-line no-console
  console.log(`[paths] repoRoot=${_repoRoot} appRoot=${_appRoot}`);
}
