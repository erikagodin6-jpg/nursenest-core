import fs from "fs";
import path from "path";

const distDir = path.resolve("dist/public/assets");
const maxChunkKB = parseInt(process.env.BUNDLE_MAX_CHUNK_KB || "800", 10);
const maxChunkBytes = maxChunkKB * 1024;

if (!fs.existsSync(distDir)) {
  console.log(`[bundle-guardrail] No assets output found at ${distDir}; skipping.`);
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

const jsChunks = chunks.filter((c) => c.name.endsWith(".js"));
const oversized = jsChunks.filter((c) => c.size > maxChunkBytes);

function fmt(bytes) {
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

console.log("\n[bundle-guardrail] Bundle Chunk Guardrails");
console.log("=".repeat(60));
console.log(`Assets dir: ${distDir}`);
console.log(`Max JS chunk: ${maxChunkKB} KB`);
console.log(`JS chunks: ${jsChunks.length}`);
console.log("");
console.log("Top 10 largest JS chunks:");
for (const chunk of jsChunks.slice(0, 10)) {
  const flag = chunk.size > maxChunkBytes ? " ⚠️  FAIL" : "";
  console.log(`  ${fmt(chunk.size).padStart(10)}  ${chunk.name}${flag}`);
}

if (oversized.length > 0) {
  console.error("\n[bundle-guardrail] FAILURE: Oversized JS chunks detected:");
  for (const c of oversized.slice(0, 25)) {
    console.error(`  ${fmt(c.size).padStart(10)}  ${c.name}`);
  }
  console.error(`\nThreshold: ${maxChunkKB} KB`);
  process.exit(1);
}

console.log("\n[bundle-guardrail] PASS: No JS chunk exceeds threshold.");

