/**
 * Merges `locale-batch-overrides.json` into each `locale/marketing-*.json`.
 * Run from repo root: node tools/i18n/marketing/apply-locale-batch.cjs
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "locale");
const files = ["locale-batch-overrides.json", "locale-batch-overrides-part2.json", "locale-batch-overrides-part3.json"];
const merged = {};
for (const f of files) {
  const p = path.join(__dirname, f);
  if (!fs.existsSync(p)) continue;
  const part = JSON.parse(fs.readFileSync(p, "utf8"));
  for (const [lang, add] of Object.entries(part)) {
    merged[lang] = { ...(merged[lang] || {}), ...add };
  }
}

for (const [lang, additions] of Object.entries(merged)) {
  const fp = path.join(dir, `marketing-${lang}.json`);
  if (!fs.existsSync(fp)) {
    console.warn("skip missing", fp);
    continue;
  }
  const cur = JSON.parse(fs.readFileSync(fp, "utf8"));
  Object.assign(cur, additions);
  fs.writeFileSync(fp, JSON.stringify(cur, null, 2) + "\n");
  console.log("merged", lang, Object.keys(additions).length, "keys");
}
