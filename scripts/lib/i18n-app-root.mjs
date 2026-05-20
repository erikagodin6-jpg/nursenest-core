/**
 * Resolve the Next app root that holds `public/i18n` (monorepo: `nursenest-core/`, legacy: repo root).
 */
import fs from "node:fs";
import path from "node:path";

export function resolveMarketingI18nAppRoot(repoRoot) {
  const candidates = [path.join(repoRoot, "nursenest-core"), repoRoot];
  for (const r of candidates) {
    if (fs.existsSync(path.join(r, "public", "i18n", "en", "nav.json"))) return r;
    if (fs.existsSync(path.join(r, "public", "i18n", "en.json"))) return r;
  }
  return path.join(repoRoot, "nursenest-core");
}

/** Flat map: legacy `public/i18n/{locale}.json` or merged shards under `public/i18n/{locale}/*.json`. */
export function loadLocaleFlatMarketingMap(appRoot, localeCode) {
  const flatPath = path.join(appRoot, "public", "i18n", `${localeCode}.json`);
  if (fs.existsSync(flatPath)) {
    return JSON.parse(fs.readFileSync(flatPath, "utf8"));
  }
  const dir = path.join(appRoot, "public", "i18n", localeCode);
  if (!fs.existsSync(dir)) return null;
  const merged = {};
  for (const name of fs.readdirSync(dir).sort()) {
    if (!name.endsWith(".json")) continue;
    const p = path.join(dir, name);
    if (!fs.statSync(p).isFile()) continue;
    Object.assign(merged, JSON.parse(fs.readFileSync(p, "utf8")));
  }
  return Object.keys(merged).length ? merged : null;
}
