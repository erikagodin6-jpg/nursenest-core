import { readFileSync, writeFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const lessonsDir = resolve(__dirname, "..", "client", "src", "data", "lessons");

function countLessonKeys(): number {
  const indexPath = join(lessonsDir, "index.ts");
  const src = readFileSync(indexPath, "utf-8");
  const spread = src.match(/\.\.\.(\w+)/g);
  let total = 0;
  if (spread) {
    for (const s of spread) {
      const varName = s.replace("...", "");
      const importLine = src.match(new RegExp(`import\\s*\\{\\s*${varName}\\s*\\}\\s*from\\s*"(.+?)"`));
      if (importLine) {
        const relPath = importLine[1].replace(/^\.\//, "");
        const filePath = join(lessonsDir, relPath.endsWith(".ts") ? relPath : relPath + ".ts");
        try {
          const fileSrc = readFileSync(filePath, "utf-8");
          const keys = fileSrc.match(/"[a-z0-9][a-z0-9-]+":\s*\{/g);
          if (keys) total += keys.length;
        } catch {}
      }
    }
  }
  return total;
}

function countQuestions(): number {
  let total = 0;
  const files = readdirSync(lessonsDir).filter(f => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts");
  for (const f of files) {
    try {
      const src = readFileSync(join(lessonsDir, f), "utf-8");
      const matches = src.match(/questions:\s*\[/g);
      if (matches) {
        const questionBlocks = src.match(/\{\s*question:/g);
        if (questionBlocks) total += questionBlocks.length;
      }
    } catch {}
  }
  return total;
}

function inferTier(key: string): "rpn" | "rn" | "np" | "free" {
  if (key.endsWith("-np")) return "np";
  if (key.endsWith("-rn")) return "rn";
  if (key.endsWith("-rpn")) return "rpn";
  const freePatterns = [
    "pre-nursing", "anatomy-", "clinical-clarity",
    "first-aid", "vital-signs", "hand-hygiene",
    "body-mechanics", "patient-communication",
  ];
  for (const p of freePatterns) {
    if (key.startsWith(p)) return "free";
  }
  return "free";
}

function countByTier(): Record<string, number> {
  const counts: Record<string, number> = { free: 0, rpn: 0, rn: 0, np: 0 };
  const files = readdirSync(lessonsDir).filter(f => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts");
  for (const f of files) {
    try {
      const src = readFileSync(join(lessonsDir, f), "utf-8");
      const keys = src.match(/"([a-z0-9][a-z0-9-]+)":\s*\{/g);
      if (keys) {
        for (const k of keys) {
          const m = k.match(/"([^"]+)"/);
          if (m) {
            const tier = inferTier(m[1]);
            counts[tier]++;
          }
        }
      }
    } catch {}
  }
  return counts;
}

const counts = countByTier();
const questionCount = countQuestions();
const totalStatic = counts.free + counts.rpn + counts.rn + counts.np;

const output = `export const tierCounts = {
    free: ${counts.free},
    rpn: ${counts.rpn},
    rn: ${counts.rn},
    np: ${counts.np},
    totalStatic: ${totalStatic},
    questionCount: ${questionCount},
    computedAt: "${new Date().toISOString()}",
  };
`;

const outPath = resolve(__dirname, "..", "shared", "tier-counts.ts");
writeFileSync(outPath, output, "utf-8");
console.log(`[tier-counts] Updated: free=${counts.free} rpn=${counts.rpn} rn=${counts.rn} np=${counts.np} total=${totalStatic} questions=${questionCount}`);
