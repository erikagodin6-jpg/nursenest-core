import { writeFileSync, mkdirSync, readFileSync } from "fs";
import path from "path";

const LANGUAGES = [
  "en", "fr", "tl", "hi", "es", "zh", "zh-tw", "ar", "ko",
  "pt", "pa", "vi", "ht", "ur", "ja", "fa", "de", "th", "tr", "id",
];

function extractTranslationsFromSource(filePath: string): Record<string, string> | null {
  const source = readFileSync(filePath, "utf-8");

  const objectRegex = /(?:const\s+\w+\s*(?::\s*Record<string,\s*string>)?\s*=\s*|export\s+default\s+)\{([\s\S]*)\}\s*(?:as\s+const)?\s*;?\s*(?:export\s+default\s+\w+;?\s*)?$/;
  const match = source.match(objectRegex);
  if (!match) return null;

  const body = match[1];
  const result: Record<string, string> = {};
  const entryRegex = /["']([^"']+)["']\s*:\s*["'`]((?:[^"'`\\]|\\.)*)["'`]/g;
  let m: RegExpExecArray | null;
  while ((m = entryRegex.exec(body)) !== null) {
    result[m[1]] = m[2].replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, "\\");
  }
  return result;
}

export async function compileI18n() {
  const outDir = path.resolve(process.cwd(), "client/public/i18n");
  mkdirSync(outDir, { recursive: true });
  const errors: string[] = [];
  let totalKeys = 0;

  for (const lang of LANGUAGES) {
    const filePath = path.resolve(process.cwd(), `tools/i18n/source/i18n-${lang}.ts`);
    try {
      const data = extractTranslationsFromSource(filePath);
      if (!data || typeof data !== "object") {
        errors.push(`i18n-${lang}.ts: could not extract translations`);
        continue;
      }
      const keys = Object.keys(data);
      if (keys.length < 10) {
        errors.push(`i18n-${lang}.ts: suspiciously few keys (${keys.length})`);
        continue;
      }
      totalKeys += keys.length;
      const json = JSON.stringify(data);
      writeFileSync(path.join(outDir, `${lang}.json`), json);
    } catch (err) {
      errors.push(`i18n-${lang}.ts: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (errors.length > 0) {
    console.error("[i18n] Compilation errors:\n  " + errors.join("\n  "));
    throw new Error(`i18n compilation failed: ${errors.length} error(s)`);
  }
  console.log(`compiled ${LANGUAGES.length} i18n files to JSON (${totalKeys} total keys)`);

  const { mergeMarketingIntoI18n } = await import("./merge-marketing-i18n");
  mergeMarketingIntoI18n();
  console.log("merged marketing strings into client/public/i18n and nursenest-core/public/i18n");
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("compile-i18n.ts")) {
  compileI18n().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
