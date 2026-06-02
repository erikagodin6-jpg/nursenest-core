/**
 * Read/write the Next.js marketing i18n tree.
 * - **Public** (anonymous-safe): `nursenest-core/public/i18n/{locale}/{shard}.json` for all shards except `admin`.
 * - **Staff-only**: `nursenest-core/i18n-admin-only/{locale}/admin.json` (never under `public/`).
 */
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  I18N_SHARD_FILENAMES,
  PUBLIC_I18N_SHARD_FILENAMES,
  splitFlatBundleIntoShards,
  type I18nShardFilename,
} from "../../shared/i18n-shard-policy";
import { REPO_ROOT } from "../repo-root";

/** Repo-relative path used at compile time and by server loaders (not web-accessible). */
export const DEFAULT_ADMIN_ONLY_I18N_ROOT = join(REPO_ROOT, "nursenest-core", "i18n-admin-only");

/**
 * Merges public shards + optional staff `admin.json` from {@link DEFAULT_ADMIN_ONLY_I18N_ROOT}.
 * Use `adminOnlyRoot: null` to read **public static files only** (diagnostics / leak checks).
 */
export function readMergedBundleFromNextPublicI18n(
  i18nDir: string,
  locale: string,
  options?: { adminOnlyRoot?: string | null },
): Record<string, string> | null {
  const adminRoot = options?.adminOnlyRoot === undefined ? DEFAULT_ADMIN_ONLY_I18N_ROOT : options.adminOnlyRoot;

  const legacy = join(i18nDir, `${locale}.json`);
  if (existsSync(legacy)) {
    try {
      return JSON.parse(readFileSync(legacy, "utf8")) as Record<string, string>;
    } catch {
      return null;
    }
  }
  const dir = join(i18nDir, locale);
  if (!existsSync(dir)) return null;
  const merged: Record<string, string> = {};
  for (const name of PUBLIC_I18N_SHARD_FILENAMES) {
    const fp = join(dir, `${name}.json`);
    if (!existsSync(fp)) continue;
    let part: Record<string, string>;
    try {
      part = JSON.parse(readFileSync(fp, "utf8")) as Record<string, string>;
    } catch {
      return null;
    }
    for (const [k, v] of Object.entries(part)) {
      if (k in merged) {
        throw new Error(`[i18n] Duplicate key "${k}" in ${fp}`);
      }
      merged[k] = v;
    }
  }
  if (adminRoot) {
    const adminFp = join(adminRoot, locale, "admin.json");
    if (existsSync(adminFp)) {
      try {
        const part = JSON.parse(readFileSync(adminFp, "utf8")) as Record<string, string>;
        for (const [k, v] of Object.entries(part)) {
          if (k in merged) {
            throw new Error(`[i18n] Duplicate key "${k}" in ${adminFp}`);
          }
          merged[k] = v;
        }
      } catch (e) {
        if (e instanceof SyntaxError) {
          console.error(`[i18n] Invalid JSON: ${adminFp}`);
          return null;
        }
        throw e;
      }
    }
  }
  return merged;
}

/** Writes shard JSON: public tree (no admin) + staff-only admin.json under {@link DEFAULT_ADMIN_ONLY_I18N_ROOT}. */
export function writeMergedBundleToNextShardTree(
  i18nDir: string,
  locale: string,
  merged: Record<string, string>,
  adminOnlyRoot: string = DEFAULT_ADMIN_ONLY_I18N_ROOT,
): void {
  const shards = splitFlatBundleIntoShards(merged) as Record<I18nShardFilename, Record<string, string>>;
  const dir = join(i18nDir, locale);
  mkdirSync(dir, { recursive: true });
  mkdirSync(join(adminOnlyRoot, locale), { recursive: true });

  for (const name of PUBLIC_I18N_SHARD_FILENAMES) {
    writeFileSync(join(dir, `${name}.json`), JSON.stringify(shards[name]));
  }
  writeFileSync(join(adminOnlyRoot, locale, "admin.json"), JSON.stringify(shards.admin));

  const staleAdmin = join(dir, "admin.json");
  if (existsSync(staleAdmin)) {
    try {
      unlinkSync(staleAdmin);
    } catch {
      /* best-effort remove leaked staff shard from public */
    }
  }

  const legacy = join(i18nDir, `${locale}.json`);
  if (existsSync(legacy)) {
    try {
      unlinkSync(legacy);
    } catch {
      /* best-effort */
    }
  }
}
