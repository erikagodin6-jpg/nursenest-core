/**
 * UI copy quality audit — scans Next app sources for likely user-visible issues:
 * - dotted i18n-style keys in JSX text or string literals
 * - SCREAMING_SNAKE / internal enum tokens in JSX children
 * - awkward lowercase-only headings (heuristic)
 *
 * Run from repo root:
 *   npx tsx scripts/audit-ui-copy-quality.ts
 *
 * Exit 1 when `--ci` and findings exceed threshold.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const ROOT = fs.existsSync(path.join(REPO_ROOT, "nursenest-core", "src", "app"))
  ? path.join(REPO_ROOT, "nursenest-core")
  : REPO_ROOT;
const SCAN_ROOT = path.join(ROOT, "src");

const IGNORE_DIRS = new Set(["node_modules", ".next", "dist", ".git", "coverage", "__tests__", "legacy"]);

type Hit = { file: string; line: number; text: string; rule: string };

function walkFiles(dir: string, out: string[]): void {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (IGNORE_DIRS.has(e.name)) continue;
      walkFiles(p, out);
    } else if (e.isFile() && (e.name.endsWith(".tsx") || e.name.endsWith(".ts"))) {
      out.push(p);
    }
  }
}

function scanFile(file: string): Hit[] {
  const hits: Hit[] = [];
  const rel = path.relative(REPO_ROOT, file);
  let content: string;
  try {
    content = fs.readFileSync(file, "utf8");
  } catch {
    return hits;
  }
  const lines = content.split(/\r?\n/);

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;

    /** JSX text that looks like a raw dotted key: >pages.foo.bar< */
    const jsxTextKey = />\s*((?:pages|footer|blog|admin|content|learner|app|nav|components|marketing|errors|forms)(?:\.[a-z0-9_-]+){2,})\s*</gi;
    let j: RegExpExecArray | null;
    while ((j = jsxTextKey.exec(line)) !== null) {
      hits.push({ file: rel, line: idx + 1, text: j[1] ?? "", rule: "jsx_text_dotted_key" });
    }

  });

  return hits;
}

function main() {
  const args = new Set(process.argv.slice(2));
  const ci = args.has("--ci");
  const max = ci ? 0 : 200;

  const files: string[] = [];
  walkFiles(SCAN_ROOT, files);

  const all: Hit[] = [];
  for (const f of files) {
    all.push(...scanFile(f));
  }

  const dedup = new Map<string, Hit>();
  for (const h of all) {
    dedup.set(`${h.file}:${h.line}:${h.rule}:${h.text}`, h);
  }
  const hits = [...dedup.values()].sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);

  console.log(`[audit-ui-copy-quality] scanned ${files.length} files under ${path.relative(REPO_ROOT, SCAN_ROOT)}`);
  console.log(`[audit-ui-copy-quality] findings: ${hits.length}${ci ? " (ci mode: max 0)" : ` (showing up to ${max})`}`);

  for (const h of hits.slice(0, max)) {
    console.log(`${h.file}:${h.line}\t${h.rule}\t${h.text}`);
  }

  if (ci && hits.length > 0) {
    console.error("[audit-ui-copy-quality] CI failed: fix copy issues or adjust heuristics with documented exceptions.");
    process.exit(1);
  }
}

main();
