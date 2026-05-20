import fs from "fs";
import path from "path";

const distDir = path.resolve("dist/public/assets");

if (!fs.existsSync(distDir)) {
  console.log("No build output found at dist/public/assets");
  process.exit(0);
}

function collectAssetFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...collectAssetFiles(full));
    else if (e.isFile() && (e.name.endsWith(".js") || e.name.endsWith(".css"))) out.push(full);
  }
  return out;
}

const chunkFiles = collectAssetFiles(distDir);
const chunks = chunkFiles
  .map((full) => {
    const stat = fs.statSync(full);
    return { name: path.relative(distDir, full), size: stat.size };
  })
  .sort((a, b) => b.size - a.size);

const totalJS = chunks.filter((c) => c.name.endsWith(".js")).reduce((s, c) => s + c.size, 0);
const totalCSS = chunks.filter((c) => c.name.endsWith(".css")).reduce((s, c) => s + c.size, 0);
const total = totalJS + totalCSS;

function fmt(bytes) {
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

console.log("\n📦 Bundle Size Report");
console.log("═".repeat(60));
console.log(`Total: ${fmt(total)}  (JS: ${fmt(totalJS)}, CSS: ${fmt(totalCSS)})`);
console.log(`Chunks: ${chunks.length}`);
console.log("");
console.log("Top 10 largest chunks:");
console.log("─".repeat(60));

const top10 = chunks.slice(0, 10);
for (const chunk of top10) {
  const sizeStr = fmt(chunk.size).padStart(10);
  const warn = chunk.size > 500 * 1024 ? " ⚠️  >500KB" : "";
  console.log(`  ${sizeStr}  ${chunk.name}${warn}`);
}

const oversized = chunks.filter((c) => c.size > 500 * 1024);
if (oversized.length > 0) {
  console.log("");
  console.log(`⚠️  ${oversized.length} chunk(s) exceed 500KB warning limit`);
}

console.log("═".repeat(60));
