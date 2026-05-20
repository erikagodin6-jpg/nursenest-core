#!/usr/bin/env node
/**
 * Inventory markdown/json blog sources under the repo that are not the canonical Prisma BlogPost table.
 * Extend with DB queries when DATABASE_URL is available in a trusted environment.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const coreRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const roots = [
  path.join(coreRoot, "src", "content", "blog"),
  path.join(coreRoot, "content", "blog"),
];

const rows = [];
for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  for (const name of fs.readdirSync(root)) {
    if (!name.endsWith(".md") && !name.endsWith(".mdx") && !name.endsWith(".json")) continue;
    const full = path.join(root, name);
    const st = fs.statSync(full);
    if (!st.isFile()) continue;
    const slug = name.replace(/\.(md|mdx|json)$/i, "");
    rows.push({
      title: slug.replace(/-/g, " "),
      slug,
      sourcePath: path.relative(coreRoot, full),
      sourceKind: "filesystem",
      status: "non-canonical-file",
      targetCanonicalUrl: `/blog/${encodeURIComponent(slug)}`,
      conflictStatus: "unknown",
      importEligibility: "manual-review",
    });
  }
}

console.log(JSON.stringify({ generatedAt: new Date().toISOString(), count: rows.length, posts: rows }, null, 2));
