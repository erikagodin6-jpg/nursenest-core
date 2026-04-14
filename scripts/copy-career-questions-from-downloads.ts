#!/usr/bin/env npx tsx
/**
 * Copy career-style question JSON from a folder (default: ~/Downloads) into
 * monorepo `data/career-questions/` (parent of this package).
 *
 * Matches files: basename contains "questions" and ends with .json
 * (e.g. rrt-questions.json, pta-questions-batch3.json).
 *
 * Run from nursenest-core/:
 *   npx tsx scripts/copy-career-questions-from-downloads.ts
 *   npx tsx scripts/copy-career-questions-from-downloads.ts --from=/path/to/Downloads
 */
import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function monorepoRoot(): string {
  return path.resolve(__dirname, "../..");
}

function parseArgs() {
  const argv = process.argv.slice(2);
  const get = (name: string): string | undefined => {
    const pref = `--${name}=`;
    const hit = argv.find((a) => a.startsWith(pref));
    return hit ? hit.slice(pref.length) : undefined;
  };
  const from = get("from") ?? path.join(process.env.HOME || process.env.USERPROFILE || "", "Downloads");
  const to = get("to") ?? path.join(monorepoRoot(), "data", "career-questions");
  return { from: path.resolve(from), to: path.resolve(to) };
}

function isCareerQuestionFilename(base: string): boolean {
  const b = base.toLowerCase();
  if (!b.endsWith(".json")) return false;
  return b.includes("questions");
}

function main() {
  const { from, to } = parseArgs();

  if (!fs.existsSync(from) || !fs.statSync(from).isDirectory()) {
    console.log(
      JSON.stringify(
        {
          ok: false,
          error: "downloads_dir_not_found",
          from,
          hint: "Pass --from=/full/path/to/Downloads or create the folder.",
          filesCopied: 0,
        },
        null,
        2,
      ),
    );
    process.exit(2);
  }

  fs.mkdirSync(to, { recursive: true });

  const copied: string[] = [];
  const skipped: string[] = [];
  const usedDestNames = new Set<string>();

  function walk(dir: string) {
    let dirents: fs.Dirent[];
    try {
      dirents = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of dirents) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        walk(full);
        continue;
      }
      if (!e.isFile() || !isCareerQuestionFilename(e.name)) continue;
      let destName = e.name;
      if (usedDestNames.has(destName)) {
        const rel = path.relative(from, full).replace(/[/\\]/g, "__");
        destName = rel.endsWith(".json") ? rel : `${rel}.json`;
      }
      usedDestNames.add(destName);
      const dest = path.join(to, destName);
      if (fs.existsSync(dest)) {
        skipped.push(destName);
        continue;
      }
      fs.copyFileSync(full, dest);
      copied.push(destName);
    }
  }

  walk(from);

  console.log(
    JSON.stringify(
      {
        ok: true,
        from,
        to,
        filesCopied: copied.length,
        copied,
        skippedAlreadyInDest: skipped.length,
        skippedNames: skipped.slice(0, 30),
      },
      null,
      2,
    ),
  );
}

main();
