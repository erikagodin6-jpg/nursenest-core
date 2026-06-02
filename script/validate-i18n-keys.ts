import { readFileSync, readdirSync, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EN_FILE = path.resolve(__dirname, "../tools/i18n/source/i18n-en.ts");
const SRC_DIR = path.resolve(__dirname, "../client/src");

function extractEnKeys(): Set<string> {
  const content = readFileSync(EN_FILE, "utf-8");
  const keys = new Set<string>();
  const regex = /"([a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z][a-zA-Z0-9]*)+)":/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }
  return keys;
}

function findTsxFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      if (entry !== "node_modules" && entry !== ".git") {
        results.push(...findTsxFiles(fullPath));
      }
    } else if (/\.(tsx?|jsx?)$/.test(entry) && !entry.includes("i18n-en") && !entry.includes("i18n-")) {
      results.push(fullPath);
    }
  }
  return results;
}

function extractUsedKeys(files: string[]): Map<string, string[]> {
  const keyToFiles = new Map<string, string[]>();
  const regex = /t\("([a-zA-Z][a-zA-Z0-9]*(?:\.[a-zA-Z][a-zA-Z0-9]*)+)"/g;

  for (const file of files) {
    const content = readFileSync(file, "utf-8");
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      const key = match[1];
      if (!keyToFiles.has(key)) keyToFiles.set(key, []);
      keyToFiles.get(key)!.push(path.relative(SRC_DIR, file));
    }
  }
  return keyToFiles;
}

function main() {
  console.log("Validating i18n translation keys...\n");

  const enKeys = extractEnKeys();
  console.log(`Found ${enKeys.size} keys in i18n-en.ts`);

  const files = findTsxFiles(SRC_DIR);
  console.log(`Scanning ${files.length} source files...\n`);

  const usedKeys = extractUsedKeys(files);
  console.log(`Found ${usedKeys.size} unique translation keys in components\n`);

  const missing: [string, string[]][] = [];
  for (const [key, locations] of usedKeys) {
    if (!enKeys.has(key)) {
      missing.push([key, locations]);
    }
  }

  if (missing.length === 0) {
    console.log("All translation keys are present in i18n-en.ts");
    process.exit(0);
  } else {
    console.log(`MISSING KEYS (${missing.length}):\n`);
    missing.sort((a, b) => a[0].localeCompare(b[0]));
    for (const [key, locations] of missing) {
      console.log(`  "${key}"`);
      for (const loc of [...new Set(locations)]) {
        console.log(`    → ${loc}`);
      }
    }
    console.log(`\nTotal missing: ${missing.length}`);
    process.exit(1);
  }
}

main();
