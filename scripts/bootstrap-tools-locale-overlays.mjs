#!/usr/bin/env node
/**
 * Builds `src/content/tools-overlays-all.json` by scanning `tools/i18n/marketing/locale/marketing-*.json`
 * for files that define ≥50 of the tools-related keys (nav.tools, footer.toolsHub, tools.*).
 * Run `npm run i18n:compile` after editing overlays so merged runtime JSON is updated.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const enPath = path.join(__dirname, "../../../tools/i18n/marketing/marketing-en.json");
const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
const KEYS = Object.keys(en).filter((k) => k.startsWith("tools.") || k === "nav.tools" || k === "footer.toolsHub");

const localeDir = path.join(__dirname, "../../../tools/i18n/marketing/locale");

function buildFromMap(map) {
  const out = {};
  for (const key of KEYS) {
    if (map[key] !== undefined) out[key] = map[key];
    else if (en[key] !== undefined) out[key] = en[key];
  }
  return out;
}

const all = {};
for (const f of fs.readdirSync(localeDir)) {
  const m = /^marketing-([a-z-]+)\.json$/.exec(f);
  if (!m) continue;
  const code = m[1];
  if (code === "en") continue;
  let data;
  try {
    data = JSON.parse(fs.readFileSync(path.join(localeDir, f), "utf8"));
  } catch {
    continue;
  }
  const defined = KEYS.filter((k) => data[k] != null && String(data[k]).trim() !== "");
  if (defined.length < 50) continue;
  all[code] = buildFromMap(data);
}

const outPath = path.join(__dirname, "../src/content/tools-overlays-all.json");
fs.writeFileSync(outPath, JSON.stringify(all, null, 2) + "\n");
console.log("wrote", outPath, "locales:", Object.keys(all).sort().join(", "));
