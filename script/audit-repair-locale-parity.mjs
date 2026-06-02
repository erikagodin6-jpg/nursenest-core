/**
 * Audit flat locale JSON under nursenest-core/public/i18n/*.json vs en.json.
 * Repairs: exact key parity (drop extras, fill missing from en), optional empty→en fallback.
 *
 * Usage: node script/audit-repair-locale-parity.mjs
 * Env: REPAIR_EMPTY=1 to replace "" with English when en has non-empty text (reports count).
 */
import { readdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const i18nDir = path.join(root, "nursenest-core/public/i18n");
const clientDir = path.join(root, "client/public/i18n");
const enPath = path.join(i18nDir, "en.json");
const repairEmpty = process.env.REPAIR_EMPTY === "1";

const en = JSON.parse(readFileSync(enPath, "utf8"));
const enKeys = Object.keys(en).sort();
const enKeySet = new Set(enKeys);

/** @type {{ locale: string; missing: number; extra: number; emptyFilled: number; wrote: boolean }[]} */
const report = [];

for (const name of readdirSync(i18nDir).sort()) {
  if (!name.endsWith(".json") || name === "en.json") continue;
  // only top-level locale bundles (not subdirs)
  const locale = name.replace(/\.json$/, "");
  const p = path.join(i18nDir, name);
  let partial = {};
  try {
    partial = JSON.parse(readFileSync(p, "utf8"));
  } catch (e) {
    console.error(`[audit] invalid JSON: ${p}`, e);
    process.exit(1);
  }

  const pk = Object.keys(partial);
  const missing = enKeys.filter((k) => !(k in partial));
  const extra = pk.filter((k) => !enKeySet.has(k));

  const merged = { ...en };
  for (const k of enKeys) {
    if (partial[k] !== undefined) merged[k] = partial[k];
  }

  let emptyFilled = 0;
  if (repairEmpty) {
    for (const k of enKeys) {
      const ev = en[k] ?? "";
      const mv = merged[k] ?? "";
      if (mv === "" && typeof ev === "string" && ev.trim() !== "") {
        merged[k] = ev;
        emptyFilled++;
      }
    }
  }

  const json = JSON.stringify(merged);
  const outKeys = Object.keys(merged).length;
  if (outKeys !== enKeys.length) {
    console.error(`[audit] internal error: key count ${outKeys} vs en ${enKeys.length} (${name})`);
    process.exit(1);
  }

  const needsWrite =
    missing.length > 0 || extra.length > 0 || emptyFilled > 0;

  if (needsWrite) {
    writeFileSync(p, json);
    writeFileSync(path.join(clientDir, name), json);
  }

  report.push({
    locale,
    missing: missing.length,
    extra: extra.length,
    emptyFilled,
    wrote: needsWrite,
  });
}

console.log("[audit] locales vs en.json:", enKeys.length, "keys");
for (const r of report) {
  const flags = [];
  if (r.missing) flags.push(`missing:${r.missing}`);
  if (r.extra) flags.push(`extra:${r.extra}`);
  if (r.emptyFilled) flags.push(`empty→en:${r.emptyFilled}`);
  console.log(
    `  ${r.locale}: ${flags.length ? flags.join(" ") : "ok"}${r.wrote ? " [repaired]" : ""}`,
  );
}
