import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export const ENGLISH_CANONICAL_LOCALE = "en" as const;

export const CRITICAL_ENGLISH_COPY_FILES = [
  "public/i18n/en/nav.json",
  "public/i18n/en/pages.json",
  "public/i18n/en/marketing.json",
  "public/i18n/en/learner.json",
  "public/i18n/en/billing.json",
  "public/i18n/en/auth.json",
  "src/content/lessons/lesson-library.json",
] as const;

export type EnglishSourceSnapshot = {
  createdAt: string;
  root: string;
  files: Record<string, string>;
};

function sha256(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

export function assertEnglishWriteAllowed(argv: readonly string[] = process.argv): void {
  if (argv.includes("--allow-english-write")) return;
  const writeIntent = argv.some((arg) => arg === "--apply" || arg === "--write" || arg === "--fix" || arg === "--publish");
  if (!writeIntent) return;
  const localeArg = argv.find((arg) => arg.startsWith("--locale=") || arg.startsWith("--target-locale="));
  if (localeArg && /=en($|[-_])/i.test(localeArg)) {
    throw new Error("English is canonical. Writing English translation files requires --allow-english-write.");
  }
}

export function assertPathIsNotEnglishLocaleTarget(filePath: string, argv: readonly string[] = process.argv): void {
  if (argv.includes("--allow-english-write")) return;
  const normalized = filePath.replace(/\\/g, "/");
  if (/\/public\/i18n\/en\//.test(normalized) || /\/public\/i18n\/en\.json$/.test(normalized)) {
    throw new Error(`Refusing to write canonical English i18n file without --allow-english-write: ${filePath}`);
  }
}

export function snapshotCriticalEnglishCopy(root = process.cwd()): EnglishSourceSnapshot {
  const files: Record<string, string> = {};
  for (const rel of CRITICAL_ENGLISH_COPY_FILES) {
    const abs = path.join(root, rel);
    if (!existsSync(abs)) {
      files[rel] = "missing";
      continue;
    }
    files[rel] = sha256(readFileSync(abs, "utf8"));
  }
  return { createdAt: new Date().toISOString(), root, files };
}

export function diffEnglishSourceSnapshots(
  before: EnglishSourceSnapshot,
  after: EnglishSourceSnapshot,
): string[] {
  const changed: string[] = [];
  const keys = new Set([...Object.keys(before.files), ...Object.keys(after.files)]);
  for (const key of keys) {
    if (before.files[key] !== after.files[key]) changed.push(key);
  }
  return changed;
}

export function assertEnglishSourceUnchanged(before: EnglishSourceSnapshot, after: EnglishSourceSnapshot): void {
  const changed = diffEnglishSourceSnapshots(before, after);
  if (changed.length > 0) {
    throw new Error(`Canonical English copy changed unexpectedly: ${changed.join(", ")}. Use --allow-english-write only for reviewed English edits.`);
  }
}
