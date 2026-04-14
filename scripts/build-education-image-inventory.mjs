#!/usr/bin/env node
/**
 * Rebuild `src/config/education-image-inventory.json` from `data/replit-exports/lesson_images.json`.
 * Run: node scripts/build-education-image-inventory.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "data/replit-exports/lesson_images.json");
const out = path.join(root, "src/config/education-image-inventory.json");

if (!fs.existsSync(src)) {
  console.error("Missing", src);
  process.exit(1);
}

const rows = JSON.parse(fs.readFileSync(src, "utf8"));
const keys = new Set();
for (const r of rows) {
  if (typeof r.file_name === "string" && r.file_name && !r.file_name.startsWith("ai-generated")) {
    keys.add(`uploads/images/${r.file_name}`);
    const base = r.file_name.replace(/\.[^.]+$/, "").toLowerCase();
    keys.add(`uploads/images/${base}.webp`);
  }
}

const payload = {
  version: 1,
  generatedFrom: "data/replit-exports/lesson_images.json",
  keys: [...keys].sort(),
};

fs.writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`);
console.log("Wrote", out, "keys:", payload.keys.length);
